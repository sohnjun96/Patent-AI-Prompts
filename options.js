const API_KEY_FIELD = document.getElementById("apiKey");
const KIPRIS_API_KEY_FIELD = document.getElementById("kiprisApiKey");
const MODEL_SELECT = document.getElementById("modelSelect");
const LOAD_MODELS_BUTTON = document.getElementById("loadModelsBtn");
const SAVE_BUTTON = document.getElementById("saveBtn");
const CLEAR_BUTTON = document.getElementById("clearBtn");
const STATUS = document.getElementById("status");

const DEFAULT_MODEL = "gemini-2.0-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const state = {
  models: [],
};

function showStatus(message, isError = false) {
  STATUS.textContent = message;
  STATUS.style.color = isError ? "#b91c1c" : "#0f766e";
}

function normalizeModelName(name) {
  return (name || "").replace(/^models\//, "");
}

function makeModelLabel(modelId, displayName) {
  if (!displayName) return modelId;
  return `${displayName} (${modelId})`;
}

function upsertCustomOption(modelId) {
  const option = document.createElement("option");
  option.value = modelId;
  option.textContent = `${modelId} (saved)`;
  MODEL_SELECT.appendChild(option);
}

function renderModelOptions(selectedModel = DEFAULT_MODEL) {
  MODEL_SELECT.innerHTML = "";

  const fragment = document.createDocumentFragment();
  for (const item of state.models) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    fragment.appendChild(option);
  }
  MODEL_SELECT.appendChild(fragment);

  if (!state.models.find((item) => item.id === selectedModel)) {
    upsertCustomOption(selectedModel);
  }

  MODEL_SELECT.value = selectedModel;
}

async function fetchGenerateModels(apiKey) {
  const collected = [];
  let pageToken = "";

  while (true) {
    const url = new URL(`${API_BASE}/models`);
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    const pageModels = data?.models ?? [];
    collected.push(...pageModels);

    if (!data?.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  const normalized = collected
    .filter((model) =>
      (model?.supportedGenerationMethods || []).includes("generateContent")
    )
    .map((model) => {
      const id = normalizeModelName(model.name);
      return {
        id,
        label: makeModelLabel(id, model.displayName),
      };
    })
    .filter((model) => Boolean(model.id));

  const deduped = [];
  const seen = new Set();
  for (const model of normalized) {
    if (seen.has(model.id)) continue;
    seen.add(model.id);
    deduped.push(model);
  }

  deduped.sort((a, b) => a.id.localeCompare(b.id));
  return deduped;
}

async function refreshModels(selectedModel) {
  const apiKey = API_KEY_FIELD.value.trim();
  if (!apiKey) {
    showStatus("API Key를 먼저 입력해 주세요.", true);
    return;
  }

  LOAD_MODELS_BUTTON.disabled = true;
  LOAD_MODELS_BUTTON.textContent = "불러오는 중...";

  try {
    const models = await fetchGenerateModels(apiKey);
    if (models.length === 0) {
      throw new Error("generateContent를 지원하는 모델이 없습니다.");
    }

    state.models = models;
    const selected = selectedModel || MODEL_SELECT.value || DEFAULT_MODEL;
    renderModelOptions(selected);

    showStatus(`모델 ${models.length}개를 불러왔습니다.`);
  } finally {
    LOAD_MODELS_BUTTON.disabled = false;
    LOAD_MODELS_BUTTON.textContent = "목록 불러오기";
  }
}

async function loadSettings() {
  const { apiKey = "", kiprisApiKey = "", model = DEFAULT_MODEL } =
    await chrome.storage.sync.get(["apiKey", "kiprisApiKey", "model"]);

  API_KEY_FIELD.value = apiKey;
  KIPRIS_API_KEY_FIELD.value = kiprisApiKey;
  renderModelOptions(model || DEFAULT_MODEL);

  if (apiKey) {
    try {
      await refreshModels(model || DEFAULT_MODEL);
    } catch (error) {
      showStatus(`모델 목록 자동 로드 실패: ${error.message}`, true);
    }
  }
}

async function saveSettings() {
  const apiKey = API_KEY_FIELD.value.trim();
  const kiprisApiKey = KIPRIS_API_KEY_FIELD.value.trim();
  const model = MODEL_SELECT.value || DEFAULT_MODEL;

  if (!apiKey) {
    showStatus("API Key를 입력해 주세요.", true);
    return;
  }

  await chrome.storage.sync.set({ apiKey, kiprisApiKey, model });
  showStatus("저장되었습니다.");
}

async function clearApiKey() {
  await chrome.storage.sync.remove("apiKey");
  API_KEY_FIELD.value = "";
  showStatus("API Key를 삭제했습니다.");
}

LOAD_MODELS_BUTTON.addEventListener("click", () => {
  refreshModels(MODEL_SELECT.value).catch((error) => {
    showStatus(`모델 목록 조회 실패: ${error.message}`, true);
  });
});

SAVE_BUTTON.addEventListener("click", () => {
  saveSettings().catch((error) => {
    showStatus(`저장 실패: ${error.message}`, true);
  });
});

CLEAR_BUTTON.addEventListener("click", () => {
  clearApiKey().catch((error) => {
    showStatus(`삭제 실패: ${error.message}`, true);
  });
});

loadSettings().catch((error) => {
  showStatus(`설정 로드 실패: ${error.message}`, true);
});
