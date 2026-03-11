const SESSION_STORAGE_KEY = "patentWorkbenchSessionV1";
const EMPTY_PROMPT_PREVIEW = "아직 생성된 프롬프트가 없습니다.";
const EMPTY_CLAIM_TEXT = "아직 청구항 데이터가 없습니다.";

const sidebarStatusEl = document.getElementById("sidebarStatus");
const chatgptTargetInfoEl = document.getElementById("chatgptTargetInfo");
const refreshSidebarBtnEl = document.getElementById("refreshSidebarBtn");
const openFullPageBtnEl = document.getElementById("openFullPageBtn");
const claimSelectEl = document.getElementById("claimSelect");
const claimContentEl = document.getElementById("claimContent");
const sendPromptButtons = Array.from(document.querySelectorAll(".sendPromptBtn"));

const PROMPT_META = {
  citationSearch: {
    label: "인용발명 검색",
    previewEl: document.getElementById("promptPreview-citationSearch"),
  },
  inventiveStep: {
    label: "진보성 판단",
    previewEl: document.getElementById("promptPreview-inventiveStep"),
  },
  evidenceFind: {
    label: "증거찾기",
    previewEl: document.getElementById("promptPreview-evidenceFind"),
  },
  citationFormat: {
    label: "논문 인용문구 정리",
    previewEl: document.getElementById("promptPreview-citationFormat"),
  },
};

const state = {
  session: null,
  claims: [],
  selectedClaimIndex: 0,
  promptOutputs: createEmptyPromptOutputs(),
  pending: false,
  chatGptTabId: null,
};

function createEmptyPromptOutputs() {
  return {
    citationSearch: "",
    inventiveStep: "",
    evidenceFind: "",
    citationFormat: "",
  };
}

function updateStatus(message, isError = false) {
  sidebarStatusEl.textContent = message;
  sidebarStatusEl.classList.toggle("error", isError);
}

function setPending(isPending) {
  state.pending = isPending;
  refreshSidebarBtnEl.disabled = isPending;
  for (const button of sendPromptButtons) {
    button.disabled = isPending || !button.dataset.kind;
  }
  updatePromptButtonStates();
}

function isChatGptUrl(url) {
  return /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//i.test(
    String(url || "")
  );
}

function toPreview(text, maxLength = 120) {
  const compact = String(text || "").trim().replace(/\s+/g, " ");
  if (!compact) return "";
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength)}...`;
}

function parseClaims(rawClaims) {
  const source = String(rawClaims || "").replace(/\r\n/g, "\n").trim();
  if (!source) return [];

  const anchors = [];
  const regex = /^\s*(\d+)\.\s+/gm;
  let match = null;
  while ((match = regex.exec(source)) !== null) {
    anchors.push({ index: match.index, number: Number(match[1]) });
  }

  if (anchors.length > 0) {
    const claims = [];
    for (let i = 0; i < anchors.length; i += 1) {
      const start = anchors[i].index;
      const end = i + 1 < anchors.length ? anchors[i + 1].index : source.length;
      const chunk = source.slice(start, end).trim();
      if (chunk) claims.push(chunk);
    }
    if (claims.length > 0) return claims;
  }

  return source
    .split(/\n{2,}/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizePromptOutputs(promptOutputs) {
  const raw = promptOutputs || {};
  return {
    citationSearch: String(raw.citationSearch || raw.comparePrompt || ""),
    inventiveStep: String(raw.inventiveStep || ""),
    evidenceFind: String(raw.evidenceFind || ""),
    citationFormat: String(raw.citationFormat || raw.paperFormat || ""),
  };
}

function renderClaimContent() {
  if (state.claims.length === 0) {
    claimContentEl.textContent = EMPTY_CLAIM_TEXT;
    claimContentEl.classList.add("empty");
    return;
  }

  const selected = state.claims[state.selectedClaimIndex] || "";
  claimContentEl.textContent = selected || EMPTY_CLAIM_TEXT;
  claimContentEl.classList.toggle("empty", !selected);
}

function renderClaimSelect() {
  claimSelectEl.textContent = "";

  if (state.claims.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "청구항 없음";
    claimSelectEl.appendChild(option);
    claimSelectEl.disabled = true;
    state.selectedClaimIndex = 0;
    renderClaimContent();
    return;
  }

  state.claims.forEach((claimText, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    const singleLine = claimText.replace(/\s+/g, " ").trim();
    option.textContent = `청구항 ${index + 1} - ${singleLine.slice(0, 34)}${
      singleLine.length > 34 ? "..." : ""
    }`;
    claimSelectEl.appendChild(option);
  });

  if (state.selectedClaimIndex >= state.claims.length) {
    state.selectedClaimIndex = 0;
  }

  claimSelectEl.value = String(state.selectedClaimIndex);
  claimSelectEl.disabled = false;
  renderClaimContent();
}

function updatePromptButtonStates() {
  for (const button of sendPromptButtons) {
    const kind = button.dataset.kind;
    const hasPrompt = Boolean(String(state.promptOutputs[kind] || "").trim());
    button.disabled = state.pending || !hasPrompt;
  }
}

function renderPromptCards() {
  for (const [kind, info] of Object.entries(PROMPT_META)) {
    const text = String(state.promptOutputs[kind] || "").trim();
    if (!text) {
      info.previewEl.textContent = EMPTY_PROMPT_PREVIEW;
      info.previewEl.classList.add("empty");
      continue;
    }
    info.previewEl.textContent = `${toPreview(text)}\n\n(풀프롬프트는 전송 시 사용)`;
    info.previewEl.classList.remove("empty");
  }

  updatePromptButtonStates();
}

function parseClaimsFromSession(session) {
  if (Array.isArray(session?.claimItems) && session.claimItems.length > 0) {
    return session.claimItems.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return parseClaims(session?.patentData?.claims || "");
}

function getLocalValue(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(result?.[key]);
    });
  });
}

function queryActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(tabs?.[0] || null);
    });
  });
}

function sendRuntimeMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

async function refreshTargetTabInfo() {
  const activeTab = await queryActiveTab();
  if (activeTab?.id && isChatGptUrl(activeTab.url)) {
    state.chatGptTabId = activeTab.id;
    const title = String(activeTab.title || "ChatGPT");
    chatgptTargetInfoEl.textContent = `대상 탭: ${title}`;
    return;
  }

  state.chatGptTabId = null;
  chatgptTargetInfoEl.textContent =
    "대상 탭: ChatGPT 탭을 활성화하면 해당 탭으로 전송됩니다.";
}

async function loadSessionData(options = {}) {
  const silent = options.silent === true;
  if (!silent) updateStatus("저장된 세션을 불러오는 중...");

  try {
    const session = await getLocalValue(SESSION_STORAGE_KEY);
    state.session = session || null;
    state.claims = parseClaimsFromSession(session);
    state.promptOutputs = normalizePromptOutputs(session?.promptOutputs);

    renderClaimSelect();
    renderPromptCards();
    await refreshTargetTabInfo();

    if (!session?.patentData) {
      updateStatus(
        "저장된 특허 데이터가 없습니다. 풀페이지 앱에서 먼저 공개번호를 불러와 주세요.",
        true
      );
      return;
    }

    updateStatus("사이드바 데이터를 불러왔습니다.");
  } catch (error) {
    updateStatus(`불러오기 실패: ${error.message}`, true);
  }
}

async function sendPromptToChatGpt(kind) {
  const promptText = String(state.promptOutputs[kind] || "").trim();
  const promptLabel = PROMPT_META[kind]?.label || "프롬프트";
  if (!promptText) {
    updateStatus(`${promptLabel} 프롬프트가 비어 있습니다.`, true);
    return;
  }

  setPending(true);
  updateStatus(`${promptLabel} 프롬프트를 ChatGPT로 전송 중...`);

  try {
    const response = await sendRuntimeMessage({
      type: "sendPromptToChatGpt",
      tabId: state.chatGptTabId,
      promptText,
    });

    if (!response?.ok) {
      throw new Error(response?.error || "전송 실패");
    }

    updateStatus(`${promptLabel} 프롬프트를 붙여넣고 전송했습니다.`);
    await refreshTargetTabInfo();
  } catch (error) {
    updateStatus(`전송 실패: ${error.message}`, true);
  } finally {
    setPending(false);
  }
}

claimSelectEl.addEventListener("change", () => {
  state.selectedClaimIndex = Number(claimSelectEl.value) || 0;
  renderClaimContent();
});

refreshSidebarBtnEl.addEventListener("click", () => {
  loadSessionData();
});

openFullPageBtnEl.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("chat.html") });
});

for (const button of sendPromptButtons) {
  button.addEventListener("click", () => {
    if (state.pending) return;
    const kind = button.dataset.kind;
    if (!kind) return;
    sendPromptToChatGpt(kind);
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;
  if (!changes[SESSION_STORAGE_KEY]) return;
  loadSessionData({ silent: true });
});

chrome.tabs.onActivated.addListener(() => {
  refreshTargetTabInfo().catch(() => {});
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (!tab?.active) return;
  if (!changeInfo?.status && !changeInfo?.url) return;
  refreshTargetTabInfo().catch(() => {});
});

loadSessionData();
