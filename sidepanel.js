const SESSION_STORAGE_KEY = "patentWorkbenchSessionV1";

const EMPTY_PROMPT_PREVIEW = "아직 생성된 프롬프트가 없습니다.";
const EMPTY_CLAIM_TEXT = "아직 청구항 데이터가 없습니다.";

const PROMPT_PATHS = {
  citationSearch: "prompts/citation_search.txt",
  inventiveStep: "prompts/inventive_step_review.txt",
  evidenceFind: "prompts/evidence_find.txt",
  citationFormat: "prompts/paper_citation_format.txt",
};

const sidebarStatusEl = document.getElementById("sidebarStatus");
const chatgptTargetInfoEl = document.getElementById("chatgptTargetInfo");
const refreshSidebarBtnEl = document.getElementById("refreshSidebarBtn");
const openFullPageBtnEl = document.getElementById("openFullPageBtn");

const claimSelectEl = document.getElementById("claimSelect");
const claimContentEl = document.getElementById("claimContent");

const sourceModeSummaryEl = document.getElementById("sourceModeSummary");
const sourceModeDescriptionEl = document.getElementById("sourceModeDescription");

const citationCutoffDateInputEl = document.getElementById("citationCutoffDateInput");
const inventiveStepCitationNumbersInputEl = document.getElementById(
  "inventiveStepCitationNumbersInput"
);
const evidenceClaimNumberInputEl = document.getElementById("evidenceClaimNumberInput");
const evidenceCitationNumbersInputEl = document.getElementById(
  "evidenceCitationNumbersInput"
);
const citationFormatNumbersInputEl = document.getElementById(
  "citationFormatNumbersInput"
);

const generatePromptButtons = Array.from(
  document.querySelectorAll(".generatePromptBtn")
);
const sendPromptButtons = Array.from(document.querySelectorAll(".sendPromptBtn"));

const PROMPT_META = {
  citationSearch: {
    label: "인용발명 검색",
    templateKey: "citationSearch",
    previewEl: document.getElementById("promptPreview-citationSearch"),
  },
  inventiveStep: {
    label: "진보성 판단",
    templateKey: "inventiveStep",
    previewEl: document.getElementById("promptPreview-inventiveStep"),
  },
  evidenceFind: {
    label: "증거찾기",
    templateKey: "evidenceFind",
    previewEl: document.getElementById("promptPreview-evidenceFind"),
  },
  citationFormat: {
    label: "논문 인용문구 정리",
    templateKey: "citationFormat",
    previewEl: document.getElementById("promptPreview-citationFormat"),
  },
};

const state = {
  session: null,
  prompts: null,
  patentData: null,
  summaryMarkdown: "",
  claims: [],
  selectedClaimIndex: 0,
  promptOutputs: createEmptyPromptOutputs(),
  pending: false,
  chatGptTabId: null,
};

let persistTimerId = null;

function createEmptyPromptOutputs() {
  return {
    citationSearch: "",
    inventiveStep: "",
    evidenceFind: "",
    citationFormat: "",
  };
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

function updateStatus(message, isError = false) {
  sidebarStatusEl.textContent = message;
  sidebarStatusEl.classList.toggle("error", isError);
}

function setPending(isPending) {
  state.pending = isPending;
  updateControls();
}

function isChatGptUrl(url) {
  return /^https:\/\/(chatgpt\.com|chat\.openai\.com)(\/|$)/i.test(
    String(url || "")
  );
}

function toPreview(text, maxLength = 120) {
  const compact = String(text || "").trim().replace(/\s+/g, " ");
  if (!compact) return "";
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength)}...`;
}

function parseCitationNumbers(value) {
  const tokens = String(value || "")
    .split(/[\s,]+/g)
    .map((token) => token.trim())
    .filter(Boolean);

  const output = [];
  const seen = new Set();

  for (const token of tokens) {
    if (!/^\d+$/.test(token)) continue;
    const numberValue = Number(token);
    if (!Number.isInteger(numberValue) || numberValue < 1) continue;
    if (seen.has(numberValue)) continue;
    seen.add(numberValue);
    output.push(numberValue);
  }

  return output;
}

function formatCitationNumbers(value) {
  return parseCitationNumbers(value).join(", ");
}

function getEvidenceCitationNumbersRaw() {
  const direct = String(evidenceCitationNumbersInputEl.value || "").trim();
  if (direct) return direct;
  return String(inventiveStepCitationNumbersInputEl.value || "").trim();
}

function parseClaims(rawClaims) {
  const stripLeadingClaimNumber = (text) => {
    return String(text || "")
      .replace(/^\s*\d+\.\s+/, "")
      .trim();
  };

  const stripClaimHeadingLines = (text) => {
    const lines = String(text || "")
      .replace(/\r\n/g, "\n")
      .split("\n");

    while (lines.length > 0) {
      const first = lines[0].trim();
      const isHeadingOnly =
        /^claims(?:\s*\(\d+\))?$/i.test(first) ||
        /^청구항(?:\s*\(\d+\))?$/i.test(first) ||
        /^\(\d+\)$/.test(first);

      if (!isHeadingOnly) break;
      lines.shift();
    }

    return lines.join("\n").trim();
  };

  const source = stripClaimHeadingLines(
    String(rawClaims || "").replace(/\r\n/g, "\n").trim()
  );
  if (!source) return [];

  const numberedAnchors = [];
  const numberedRegex = /^(\s*)(\d+)\.\s+/gm;
  let numberedMatch = null;
  while ((numberedMatch = numberedRegex.exec(source)) !== null) {
    numberedAnchors.push({
      index: numberedMatch.index,
      number: Number(numberedMatch[2]),
    });
  }

  if (numberedAnchors.length > 0) {
    let anchorsToUse = numberedAnchors;
    const firstOneIdx = numberedAnchors.findIndex((item) => item.number === 1);

    if (firstOneIdx !== -1) {
      const sequential = [];
      let expected = 1;
      for (let i = firstOneIdx; i < numberedAnchors.length; i += 1) {
        const anchor = numberedAnchors[i];
        if (anchor.number === expected) {
          sequential.push(anchor);
          expected += 1;
        }
      }
      if (sequential.length > 0) {
        anchorsToUse = sequential;
      }
    }

    const numberedClaims = [];
    for (let i = 0; i < anchorsToUse.length; i += 1) {
      const start = anchorsToUse[i].index;
      const end =
        i + 1 < anchorsToUse.length ? anchorsToUse[i + 1].index : source.length;
      const chunk = source.slice(start, end).trim();
      const normalizedChunk = stripLeadingClaimNumber(chunk);
      if (normalizedChunk) numberedClaims.push(normalizedChunk);
    }

    if (numberedClaims.length > 0) {
      return numberedClaims;
    }
  }

  const lines = source.split("\n");
  const fallbackClaims = [];
  let current = [];

  const isFallbackStart = (line) => {
    const text = line.trim();
    return /^청구항\s*\d+\s*/.test(text) || /^claim\s*\d+\s*/i.test(text);
  };

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (isFallbackStart(trimmed) && current.length > 0) {
      fallbackClaims.push(current.join("\n").trim());
      current = [trimmed];
    } else if (trimmed || current.length > 0) {
      current.push(trimmed);
    }
  }

  if (current.length > 0) {
    fallbackClaims.push(current.join("\n").trim());
  }

  const normalizedFallbackClaims = fallbackClaims
    .map((claimText) => stripLeadingClaimNumber(claimText))
    .filter(Boolean);

  if (fallbackClaims.length <= 1) {
    const blocks = source
      .split(/\n{2,}/g)
      .map((block) => block.trim())
      .filter(Boolean);
    if (blocks.length > 1) {
      return blocks
        .map((claimText) => stripLeadingClaimNumber(claimText))
        .filter(Boolean);
    }
  }

  return normalizedFallbackClaims;
}

function parseClaimsFromSession(session) {
  if (Array.isArray(session?.claimItems) && session.claimItems.length > 0) {
    return session.claimItems
      .map((item) => String(item || ""))
      .map((item) => item.replace(/^\s*\d+\.\s+/, "").trim())
      .filter(Boolean);
  }
  return parseClaims(session?.patentData?.claims || "");
}

function getCitationSourceMode() {
  return sourceModeDescriptionEl?.checked ? "description" : "summary";
}

function getPromptOptionsFromUi() {
  return {
    sourceMode: getCitationSourceMode(),
    citationCutoffDate: String(citationCutoffDateInputEl.value || "").trim(),
    inventiveStepCitationNumbers: String(
      inventiveStepCitationNumbersInputEl.value || ""
    ).trim(),
    evidenceClaimNumber: String(evidenceClaimNumberInputEl.value || "").trim(),
    evidenceCitationNumbers: String(
      evidenceCitationNumbersInputEl.value || ""
    ).trim(),
    citationFormatNumbers: String(citationFormatNumbersInputEl.value || "").trim(),
  };
}

function applyPromptOptions(promptOptions) {
  const sourceMode =
    promptOptions?.sourceMode === "description" ? "description" : "summary";
  sourceModeSummaryEl.checked = sourceMode === "summary";
  sourceModeDescriptionEl.checked = sourceMode === "description";

  citationCutoffDateInputEl.value = String(promptOptions?.citationCutoffDate || "");
  inventiveStepCitationNumbersInputEl.value = String(
    promptOptions?.inventiveStepCitationNumbers || ""
  );
  evidenceClaimNumberInputEl.value = String(promptOptions?.evidenceClaimNumber || "");
  evidenceCitationNumbersInputEl.value = String(
    promptOptions?.evidenceCitationNumbers || ""
  );
  citationFormatNumbersInputEl.value = String(
    promptOptions?.citationFormatNumbers || ""
  );
}

function getClaimOneText() {
  if (state.claims.length > 0) {
    return state.claims[0];
  }

  const fallbackClaims = parseClaims(state.patentData?.claims || "");
  return fallbackClaims[0] || "";
}

function resolveSelectedClaim(claimNumberText) {
  const numberValue = Number(claimNumberText);
  if (!Number.isInteger(numberValue) || numberValue < 1) {
    throw new Error("청구항 번호는 1 이상의 정수여야 합니다.");
  }

  const claimList = state.claims.length > 0 ? state.claims : parseClaims(state.patentData?.claims);
  const claimText = claimList[numberValue - 1] || "";
  if (!claimText) {
    throw new Error(`청구항 ${numberValue}를 찾지 못했습니다.`);
  }

  return {
    claimNumber: numberValue,
    claimText,
  };
}

function getPromptSourceContext() {
  const claimOne = getClaimOneText();
  if (!claimOne) {
    throw new Error("청구항 1을 찾지 못했습니다.");
  }

  const sourceMode = getCitationSourceMode();
  const sourceLabel = sourceMode === "description" ? "발명의 설명" : "발명의 요약";
  const sourceText =
    sourceMode === "description"
      ? String(state.patentData?.description || "").trim()
      : String(state.summaryMarkdown || "").trim();

  if (!sourceText) {
    if (sourceMode === "summary") {
      throw new Error("발명의 요약이 없습니다. 먼저 요약을 생성해 주세요.");
    }
    throw new Error("발명의 설명이 없습니다.");
  }

  return {
    claimOne,
    sourceMode,
    sourceLabel,
    sourceText,
  };
}

function requireCutoffDate(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    throw new Error("특허판단 기준일을 입력해 주세요.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error("특허판단 기준일 형식이 올바르지 않습니다.");
  }
  return normalized;
}

function requireCitationNumbers(value, fieldName) {
  const normalized = formatCitationNumbers(value);
  if (!normalized) {
    throw new Error(`${fieldName}를 입력해 주세요. 예: 1, 2, 5`);
  }
  return normalized;
}

function buildWholeText(data) {
  const title = data?.title || "(제목 없음)";
  const patentId = data?.patentId || `KR${data?.publicationNumber || ""}A`;
  const claims = data?.claims || "(청구항 없음)";
  const description = data?.description || "(발명의 설명 없음)";

  return [
    `[Patent ID]`,
    patentId,
    ``,
    `[Title]`,
    title,
    ``,
    `[Claims]`,
    claims,
    ``,
    `[Description]`,
    description,
  ].join("\n");
}

function applyTemplate(templateText, replacements) {
  let output = String(templateText || "");
  for (const [placeholder, value] of Object.entries(replacements)) {
    output = output.split(placeholder).join(String(value ?? ""));
  }
  return output;
}

function basePromptVariables(overrides = {}) {
  const whole = buildWholeText(state.patentData);
  const summary = state.summaryMarkdown || "";
  const description = state.patentData?.description || "";
  const allClaims = state.patentData?.claims || "";
  const claimOne = getClaimOneText();

  return {
    "{전체}": whole,
    "{발명의 요약}": summary,
    "{발명의 설명}": description,
    "{청구항}": allClaims,
    "{청구항1}": claimOne,
    "{검색기반}": "",
    "{검색기반유형}": "",
    "{특허판단기준일}": "",
    "{선택인용발명번호}": "",
    "{선택청구항번호}": "",
    "{선택청구항}": "",
    "{질문}": "",
    "{대화기록}": "",
    "{추가요청}": "",
    ...overrides,
  };
}

function buildPromptGenerationSpec(kind) {
  const context = getPromptSourceContext();
  const baseReplacements = {
    "{청구항1}": context.claimOne,
    "{청구항}": context.claimOne,
    "{발명의 요약}": context.sourceMode === "summary" ? context.sourceText : "",
    "{발명의 설명}": context.sourceMode === "description" ? context.sourceText : "",
    "{검색기반유형}": context.sourceLabel,
    "{검색기반}": context.sourceText,
  };

  if (kind === "citationSearch") {
    const cutoffDate = requireCutoffDate(citationCutoffDateInputEl.value);
    return {
      templateKey: "citationSearch",
      replacements: {
        ...baseReplacements,
        "{특허판단기준일}": cutoffDate,
      },
    };
  }

  if (kind === "inventiveStep") {
    const selectedCitationNumbers = requireCitationNumbers(
      inventiveStepCitationNumbersInputEl.value,
      "검토할 인용발명 번호"
    );
    return {
      templateKey: "inventiveStep",
      replacements: {
        ...baseReplacements,
        "{선택인용발명번호}": selectedCitationNumbers,
      },
    };
  }

  if (kind === "evidenceFind") {
    const selectedClaim = resolveSelectedClaim(evidenceClaimNumberInputEl.value);
    const selectedCitationNumbers = requireCitationNumbers(
      getEvidenceCitationNumbersRaw(),
      "검토할 인용발명 번호"
    );
    return {
      templateKey: "evidenceFind",
      replacements: {
        ...baseReplacements,
        "{선택인용발명번호}": selectedCitationNumbers,
        "{선택청구항번호}": String(selectedClaim.claimNumber),
        "{선택청구항}": selectedClaim.claimText,
      },
    };
  }

  if (kind === "citationFormat") {
    const selectedCitationNumbers = requireCitationNumbers(
      citationFormatNumbersInputEl.value,
      "인용발명 번호"
    );
    return {
      templateKey: "citationFormat",
      replacements: {
        ...baseReplacements,
        "{선택인용발명번호}": selectedCitationNumbers,
      },
    };
  }

  throw new Error("알 수 없는 프롬프트 종류입니다.");
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

function setPromptPreview(el, text) {
  const normalized = String(text || "").trim();
  if (!normalized) {
    el.textContent = EMPTY_PROMPT_PREVIEW;
    el.classList.add("empty");
    return;
  }
  el.textContent = `${toPreview(normalized)}\n\n(생성된 전체 프롬프트는 전송 시 사용됩니다)`;
  el.classList.remove("empty");
}

function renderPromptCards() {
  for (const [kind, meta] of Object.entries(PROMPT_META)) {
    setPromptPreview(meta.previewEl, state.promptOutputs[kind]);
  }
}

function canGeneratePrompt(kind) {
  const hasPatent = Boolean(state.patentData);
  const hasPromptTemplates = Boolean(state.prompts);
  const hasClaimOne = Boolean(getClaimOneText());
  const sourceMode = getCitationSourceMode();
  const hasSourceText =
    sourceMode === "summary"
      ? Boolean(String(state.summaryMarkdown || "").trim())
      : Boolean(String(state.patentData?.description || "").trim());

  if (state.pending || !hasPatent || !hasPromptTemplates || !hasClaimOne || !hasSourceText) {
    return false;
  }

  if (kind === "citationSearch") {
    return Boolean(String(citationCutoffDateInputEl.value || "").trim());
  }

  if (kind === "inventiveStep") {
    return parseCitationNumbers(inventiveStepCitationNumbersInputEl.value).length > 0;
  }

  if (kind === "evidenceFind") {
    const claimNumber = Number(evidenceClaimNumberInputEl.value);
    const hasClaimNumber = Number.isInteger(claimNumber) && claimNumber >= 1;
    const hasCitationNumbers =
      parseCitationNumbers(getEvidenceCitationNumbersRaw()).length > 0;
    return hasClaimNumber && hasCitationNumbers;
  }

  if (kind === "citationFormat") {
    return parseCitationNumbers(citationFormatNumbersInputEl.value).length > 0;
  }

  return false;
}

function updatePromptButtonStates() {
  for (const button of generatePromptButtons) {
    const kind = button.dataset.kind;
    button.disabled = !kind || !canGeneratePrompt(kind);
  }

  for (const button of sendPromptButtons) {
    const kind = button.dataset.kind;
    const hasPrompt = Boolean(String(state.promptOutputs[kind] || "").trim());
    button.disabled = state.pending || !kind || !hasPrompt;
  }
}

function updateControls() {
  refreshSidebarBtnEl.disabled = state.pending;
  updatePromptButtonStates();
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

function setLocalValue(payload) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(payload, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
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

async function loadPromptTemplates() {
  const entries = await Promise.all(
    Object.entries(PROMPT_PATHS).map(async ([key, path]) => {
      const response = await fetch(chrome.runtime.getURL(path));
      if (!response.ok) {
        throw new Error(`프롬프트 템플릿 로드 실패: ${path}`);
      }
      const text = await response.text();
      return [key, text];
    })
  );
  state.prompts = Object.fromEntries(entries);
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

async function persistSessionNow() {
  const latest = (await getLocalValue(SESSION_STORAGE_KEY)) || {};
  const nextSession = {
    ...latest,
    promptOutputs: {
      ...normalizePromptOutputs(latest.promptOutputs),
      ...state.promptOutputs,
    },
    promptOptions: getPromptOptionsFromUi(),
    savedAt: Date.now(),
  };
  await setLocalValue({ [SESSION_STORAGE_KEY]: nextSession });
  state.session = nextSession;
}

function queuePersistSession() {
  if (persistTimerId) {
    clearTimeout(persistTimerId);
  }

  persistTimerId = setTimeout(() => {
    persistTimerId = null;
    persistSessionNow().catch((error) => {
      console.warn("Failed to persist sidepanel session data:", error);
    });
  }, 180);
}

async function loadSessionData(options = {}) {
  const silent = options.silent === true;
  if (!silent) updateStatus("저장된 세션을 불러오는 중...");

  try {
    const session = (await getLocalValue(SESSION_STORAGE_KEY)) || null;
    state.session = session;
    state.patentData =
      session?.patentData && typeof session.patentData === "object"
        ? session.patentData
        : null;
    state.summaryMarkdown = String(session?.summaryMarkdown || "");
    state.claims = parseClaimsFromSession(session);
    state.promptOutputs = normalizePromptOutputs(session?.promptOutputs);

    const promptOptions = session?.promptOptions || session?.citationOptions || {};
    applyPromptOptions(promptOptions);

    renderClaimSelect();
    renderPromptCards();
    await refreshTargetTabInfo();
    updateControls();

    if (!silent) {
      if (!state.patentData) {
        updateStatus(
          "저장된 특허 데이터가 없습니다. 풀페이지 앱에서 공개번호를 먼저 조회해 주세요.",
          true
        );
      } else {
        updateStatus("사이드바 데이터를 불러왔습니다.");
      }
    }
  } catch (error) {
    updateStatus(`불러오기 실패: ${error.message}`, true);
  }
}

async function generatePrompt(kind) {
  const meta = PROMPT_META[kind];
  if (!meta) return;

  setPending(true);
  updateStatus(`${meta.label} 프롬프트 생성 중...`);

  try {
    if (!state.prompts?.[meta.templateKey]) {
      throw new Error("프롬프트 템플릿이 아직 로드되지 않았습니다.");
    }
    if (!state.patentData) {
      throw new Error("특허 데이터가 없습니다. 풀페이지 앱에서 공개번호를 조회해 주세요.");
    }

    const spec = buildPromptGenerationSpec(kind);
    const promptText = applyTemplate(
      state.prompts[spec.templateKey],
      basePromptVariables(spec.replacements)
    ).trim();

    if (!promptText) {
      throw new Error("생성된 프롬프트가 비어 있습니다.");
    }

    state.promptOutputs[kind] = promptText;
    renderPromptCards();
    queuePersistSession();
    updateStatus(`${meta.label} 프롬프트를 생성했습니다.`);
  } catch (error) {
    updateStatus(`생성 실패: ${error.message}`, true);
  } finally {
    setPending(false);
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

    if (response.tabId) {
      state.chatGptTabId = response.tabId;
    }
    updateStatus(`${promptLabel} 프롬프트를 ChatGPT로 전송했습니다.`);
    await refreshTargetTabInfo();
  } catch (error) {
    updateStatus(`전송 실패: ${error.message}`, true);
  } finally {
    setPending(false);
  }
}

function normalizeCitationInputValue(inputEl) {
  const formatted = formatCitationNumbers(inputEl.value);
  if (!formatted) return false;
  if (formatted === inputEl.value) return false;
  inputEl.value = formatted;
  return true;
}

function onPromptOptionChanged() {
  updateControls();
  queuePersistSession();
}

claimSelectEl.addEventListener("change", () => {
  state.selectedClaimIndex = Number(claimSelectEl.value) || 0;
  renderClaimContent();
});

refreshSidebarBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  loadSessionData();
});

openFullPageBtnEl.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("chat.html") });
});

for (const button of generatePromptButtons) {
  button.addEventListener("click", () => {
    if (state.pending) return;
    const kind = button.dataset.kind;
    if (!kind) return;
    generatePrompt(kind);
  });
}

for (const button of sendPromptButtons) {
  button.addEventListener("click", () => {
    if (state.pending) return;
    const kind = button.dataset.kind;
    if (!kind) return;
    sendPromptToChatGpt(kind);
  });
}

sourceModeSummaryEl.addEventListener("change", onPromptOptionChanged);
sourceModeDescriptionEl.addEventListener("change", onPromptOptionChanged);
citationCutoffDateInputEl.addEventListener("input", onPromptOptionChanged);
inventiveStepCitationNumbersInputEl.addEventListener("input", onPromptOptionChanged);
evidenceClaimNumberInputEl.addEventListener("input", onPromptOptionChanged);
evidenceCitationNumbersInputEl.addEventListener("input", onPromptOptionChanged);
citationFormatNumbersInputEl.addEventListener("input", onPromptOptionChanged);

inventiveStepCitationNumbersInputEl.addEventListener("blur", () => {
  if (normalizeCitationInputValue(inventiveStepCitationNumbersInputEl)) {
    onPromptOptionChanged();
  }
});

evidenceCitationNumbersInputEl.addEventListener("blur", () => {
  if (normalizeCitationInputValue(evidenceCitationNumbersInputEl)) {
    onPromptOptionChanged();
  }
});

citationFormatNumbersInputEl.addEventListener("blur", () => {
  if (normalizeCitationInputValue(citationFormatNumbersInputEl)) {
    onPromptOptionChanged();
  }
});

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

async function init() {
  updateStatus("사이드바 초기화 중...");
  setPending(true);

  try {
    await loadPromptTemplates();
    await loadSessionData({ silent: true });

    if (!state.patentData) {
      updateStatus(
        "저장된 특허 데이터가 없습니다. 풀페이지 앱에서 공개번호를 먼저 조회해 주세요.",
        true
      );
    } else {
      updateStatus("사이드바 준비가 완료되었습니다.");
    }
  } catch (error) {
    updateStatus(`초기화 실패: ${error.message}`, true);
  } finally {
    setPending(false);
  }
}

init();
