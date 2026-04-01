const modelInfoEl = document.getElementById("modelInfo");
const keyNoticeEl = document.getElementById("keyNotice");
const patentFormEl = document.getElementById("patentForm");
const publicationInputEl = document.getElementById("publicationInput");
const numberTypeSelectEl = document.getElementById("numberTypeSelect");
const summarizeBtnEl = document.getElementById("summarizeBtn");
const openSettingsBtnEl = document.getElementById("openSettingsBtn");
const statusBarEl = document.getElementById("statusBar");

const tabButtons = Array.from(document.querySelectorAll(".tabButton"));
const tabPanels = Array.from(document.querySelectorAll(".tabPanel"));

const summaryMetaEl = document.getElementById("summaryMeta");
const summaryMarkdownEl = document.getElementById("summaryMarkdown");
const generateSummaryBtnEl = document.getElementById("generateSummaryBtn");
const followupChatLogEl = document.getElementById("followupChatLog");
const followupFormEl = document.getElementById("followupForm");
const followupInputEl = document.getElementById("followupInput");
const followupSendBtnEl = document.getElementById("followupSendBtn");

const analyzeAllClaimsBtnEl = document.getElementById("analyzeAllClaimsBtn");
const claimsCountTextEl = document.getElementById("claimsCountText");
const claimsCardsEl = document.getElementById("claimsCards");
const generateHighlightsBtnEl = document.getElementById("generateHighlightsBtn");
const openHighlightEditorBtnEl = document.getElementById("openHighlightEditorBtn");
const highlightMetaEl = document.getElementById("highlightMeta");
const highlightLegendEl = document.getElementById("highlightLegend");
const highlightGroupsEditorEl = document.getElementById("highlightGroupsEditor");
const addHighlightGroupBtnEl = document.getElementById("addHighlightGroupBtn");

const descriptionClaimsColumnEl = document.getElementById("descriptionClaimsColumn");
const descriptionRawEl = document.getElementById("descriptionRaw");
const loadAmendmentHistoryBtnEl = document.getElementById("loadAmendmentHistoryBtn");
const analyzeClaimChangesBtnEl = document.getElementById("analyzeClaimChangesBtn");
const amendmentGroupSelectEl = document.getElementById("amendmentGroupSelect");
const amendmentViewModeSelectEl = document.getElementById("amendmentViewModeSelect");
const amendmentHistoryMetaEl = document.getElementById("amendmentHistoryMeta");
const amendmentHistoryStatusEl = document.getElementById("amendmentHistoryStatus");
const amendmentAnalysisSummaryEl = document.getElementById("amendmentAnalysisSummary");
const amendmentAnalysisListEl = document.getElementById("amendmentAnalysisList");
const amendmentAnalysisRawEl = document.getElementById("amendmentAnalysisRaw");
const amendmentAnalysisErrorEl = document.getElementById("amendmentAnalysisError");
const amendmentHistoryListEl = document.getElementById("amendmentHistoryList");

const citationSourceSummaryEl = document.getElementById("citationSourceSummary");
const citationSourceDescriptionEl = document.getElementById(
  "citationSourceDescription"
);
const citationCutoffDateInputEl = document.getElementById("citationCutoffDateInput");
const generateCitationSearchPromptBtnEl = document.getElementById(
  "generateCitationSearchPromptBtn"
);
const citationSearchPromptPreviewEl = document.getElementById(
  "citationSearchPromptPreview"
);
const inventiveStepCitationNumbersInputEl = document.getElementById(
  "inventiveStepCitationNumbersInput"
);
const generateInventiveStepPromptBtnEl = document.getElementById(
  "generateInventiveStepPromptBtn"
);
const inventiveStepPromptPreviewEl = document.getElementById(
  "inventiveStepPromptPreview"
);
const evidenceClaimNumberInputEl = document.getElementById("evidenceClaimNumberInput");
const evidenceCitationNumbersInputEl = document.getElementById(
  "evidenceCitationNumbersInput"
);
const generateEvidencePromptBtnEl = document.getElementById(
  "generateEvidencePromptBtn"
);
const evidencePromptPreviewEl = document.getElementById("evidencePromptPreview");
const citationFormatNumbersInputEl = document.getElementById(
  "citationFormatNumbersInput"
);
const generateCitationFormatPromptBtnEl = document.getElementById(
  "generateCitationFormatPromptBtn"
);
const citationFormatPromptPreviewEl = document.getElementById(
  "citationFormatPromptPreview"
);

const promptModalEl = document.getElementById("promptModal");
const promptModalTitleEl = document.getElementById("promptModalTitle");
const promptModalBodyEl = document.getElementById("promptModalBody");
const closePromptModalBtnEl = document.getElementById("closePromptModalBtn");
const copyPromptModalBtnEl = document.getElementById("copyPromptModalBtn");
const highlightEditorModalEl = document.getElementById("highlightEditorModal");
const closeHighlightEditorBtnEl = document.getElementById("closeHighlightEditorBtn");
const highlightEditorMountEl = document.getElementById("highlightEditorMount");
const amendmentDetailModalEl = document.getElementById("amendmentDetailModal");
const amendmentDetailModalTitleEl = document.getElementById(
  "amendmentDetailModalTitle"
);
const amendmentDetailModalMetaEl = document.getElementById(
  "amendmentDetailModalMeta"
);
const amendmentDetailModalDiffEl = document.getElementById(
  "amendmentDetailModalDiff"
);
const amendmentDetailModalRelatedWrapEl = document.getElementById(
  "amendmentDetailModalRelatedWrap"
);
const amendmentDetailModalRelatedListEl = document.getElementById(
  "amendmentDetailModalRelatedList"
);
const closeAmendmentDetailModalBtnEl = document.getElementById(
  "closeAmendmentDetailModalBtn"
);

const settingsModalEl = document.getElementById("settingsModal");
const closeSettingsBtnEl = document.getElementById("closeSettingsBtn");
const settingsApiKeyInputEl = document.getElementById("settingsApiKeyInput");
const settingsKiprisApiKeyInputEl = document.getElementById(
  "settingsKiprisApiKeyInput"
);
const settingsModelSelectEl = document.getElementById("settingsModelSelect");
const loadSettingsModelsBtnEl = document.getElementById("loadSettingsModelsBtn");
const saveSettingsBtnEl = document.getElementById("saveSettingsBtn");
const clearSettingsApiKeyBtnEl = document.getElementById("clearSettingsApiKeyBtn");
const settingsStatusEl = document.getElementById("settingsStatus");

const DEFAULT_MODEL = "gemini-2.0-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const NUMBER_TYPE_PUBLICATION = "publication";
const NUMBER_TYPE_APPLICATION = "application";
const AMENDMENT_VIEW_MODE_MODIFIED = "modified";
const AMENDMENT_VIEW_MODE_DELETED = "deleted";
const AMENDMENT_VIEW_MODE_ADDED = "added";
const AMENDMENT_VIEW_MODE_FINAL = "final";

const EMPTY_SUMMARY = "아직 생성된 요약이 없습니다.";
const EMPTY_CLAIMS = "아직 청구항이 없습니다.";
const EMPTY_DESCRIPTION = "아직 발명의 설명이 없습니다.";
const EMPTY_PROMPT_PREVIEW = "아직 생성된 프롬프트가 없습니다.";
const EMPTY_AMENDMENT_HISTORY = "No amendment history loaded yet.";
const SESSION_STORAGE_KEY = "patentWorkbenchSessionV1";
const CLAIM_CHANGE_TYPES = [
  "claim_combination",
  "reference_fix",
  "claim_deletion",
  "new_content_addition",
  "claim_renumbering",
];
const CLAIM_CHANGE_CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);

const PROMPT_PATHS = {
  summary: "prompts/summary.txt",
  followup: "prompts/followup_chat.txt",
  claimComponent: "prompts/claim_component.txt",
  highlightTerms: "prompts/highlight_terms.txt",
  claimChanges: "prompts/claim_changes.txt",
  citationSearch: "prompts/citation_search.txt",
  inventiveStep: "prompts/inventive_step_review.txt",
  evidenceFind: "prompts/evidence_find.txt",
  citationFormat: "prompts/paper_citation_format.txt",
};

const state = {
  apiKey: "",
  kiprisApiKey: "",
  model: DEFAULT_MODEL,
  pending: false,
  activeTab: "summary",
  prompts: null,
  patentData: null,
  summaryMarkdown: "",
  claimItems: [],
  claimAnalyses: {},
  highlightGroups: [],
  amendmentHistoryItems: null,
  amendmentHistoryApplicationNumber: "",
  amendmentSelectedGroupKey: "",
  amendmentViewMode: AMENDMENT_VIEW_MODE_MODIFIED,
  amendmentAnalysisResult: null,
  amendmentAnalysisRaw: "",
  amendmentAnalysisError: "",
  amendmentAnalysisLoading: false,
  amendmentAnalysisContext: null,
  followupHistory: [],
  promptOutputs: createEmptyPromptOutputs(),
  settingModels: [],
};

let persistTimerId = null;
let highlightGroupSeq = 1;
let promptModalState = {
  key: "",
  title: "",
  text: "",
};
let amendmentDetailModalState = {
  title: "",
  meta: "",
  beforeText: "",
  afterText: "",
  relatedPreviousClaims: [],
};

if (
  highlightEditorMountEl &&
  highlightGroupsEditorEl &&
  highlightGroupsEditorEl.parentElement !== highlightEditorMountEl
) {
  highlightEditorMountEl.appendChild(highlightGroupsEditorEl);
}

if (openHighlightEditorBtnEl) {
  openHighlightEditorBtnEl.textContent = "용어군 편집";
}

const HIGHLIGHT_COLOR_PALETTE = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

const PROMPT_CARD_INFO = {
  citationSearch: {
    title: "인용발명 검색 프롬프트",
    previewEl: citationSearchPromptPreviewEl,
  },
  inventiveStep: {
    title: "진보성 판단 프롬프트",
    previewEl: inventiveStepPromptPreviewEl,
  },
  evidenceFind: {
    title: "증거찾기 프롬프트",
    previewEl: evidencePromptPreviewEl,
  },
  citationFormat: {
    title: "논문 인용문구 정리 프롬프트",
    previewEl: citationFormatPromptPreviewEl,
  },
};

function createEmptyPromptOutputs() {
  return {
    citationSearch: "",
    inventiveStep: "",
    evidenceFind: "",
    citationFormat: "",
  };
}

function updateHeader() {
  modelInfoEl.textContent = `Model: ${state.model}`;
}

function updateStatus(message, isError = false) {
  statusBarEl.textContent = message;
  statusBarEl.classList.toggle("error", isError);
}

function isValidTabName(tabName) {
  return tabButtons.some((button) => button.dataset.tab === tabName);
}

function sanitizeTabName(tabName) {
  return isValidTabName(tabName) ? tabName : "summary";
}

function buildPersistedSession() {
  return {
    activeTab: state.activeTab,
    patentData: state.patentData,
    summaryMarkdown: state.summaryMarkdown,
    claimItems: state.claimItems,
    claimAnalyses: state.claimAnalyses,
    highlightGroups: state.highlightGroups,
    amendmentHistoryItems: state.amendmentHistoryItems,
    amendmentHistoryApplicationNumber: state.amendmentHistoryApplicationNumber,
    amendmentSelectedGroupKey: state.amendmentSelectedGroupKey,
    amendmentViewMode: state.amendmentViewMode,
    amendmentAnalysisResult: state.amendmentAnalysisResult,
    amendmentAnalysisRaw: state.amendmentAnalysisRaw,
    amendmentAnalysisError: state.amendmentAnalysisError,
    amendmentAnalysisContext: state.amendmentAnalysisContext,
    followupHistory: state.followupHistory,
    promptOutputs: state.promptOutputs,
    promptOptions: {
      sourceMode: getCitationSourceMode(),
      citationCutoffDate: citationCutoffDateInputEl.value || "",
      inventiveStepCitationNumbers:
        inventiveStepCitationNumbersInputEl.value || "",
      evidenceClaimNumber: evidenceClaimNumberInputEl.value || "",
      evidenceCitationNumbers: evidenceCitationNumbersInputEl.value || "",
      citationFormatNumbers: citationFormatNumbersInputEl.value || "",
    },
    publicationInput: publicationInputEl.value || "",
    numberType: getSelectedNumberType(),
    savedAt: Date.now(),
  };
}

async function persistSession() {
  const payload = buildPersistedSession();
  await chrome.storage.local.set({ [SESSION_STORAGE_KEY]: payload });
}

function queuePersistSession() {
  if (persistTimerId) {
    clearTimeout(persistTimerId);
  }

  persistTimerId = setTimeout(() => {
    persistTimerId = null;
    persistSession().catch((error) => {
      console.warn("Failed to persist session:", error);
    });
  }, 180);
}

async function loadPersistedSession() {
  const result = await chrome.storage.local.get(SESSION_STORAGE_KEY);
  return result?.[SESSION_STORAGE_KEY] || null;
}

function getCitationSourceMode() {
  return citationSourceDescriptionEl?.checked ? "description" : "summary";
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

function showSettingsStatus(message, isError = false) {
  settingsStatusEl.textContent = message;
  settingsStatusEl.style.color = isError ? "#b91c1c" : "#0f766e";
}

function normalizeModelName(name) {
  return String(name || "").replace(/^models\//, "");
}

function makeModelLabel(modelId, displayName) {
  if (!displayName) return modelId;
  return `${displayName} (${modelId})`;
}

function renderSettingsModelOptions(selectedModel = DEFAULT_MODEL) {
  settingsModelSelectEl.textContent = "";

  const fragment = document.createDocumentFragment();
  for (const model of state.settingModels) {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.label;
    fragment.appendChild(option);
  }
  settingsModelSelectEl.appendChild(fragment);

  if (!state.settingModels.find((model) => model.id === selectedModel)) {
    const option = document.createElement("option");
    option.value = selectedModel;
    option.textContent = `${selectedModel} (saved)`;
    settingsModelSelectEl.appendChild(option);
  }

  settingsModelSelectEl.value = selectedModel;
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

    collected.push(...(data?.models || []));
    if (!data?.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  const normalized = collected
    .filter((model) =>
      (model?.supportedGenerationMethods || []).includes("generateContent")
    )
    .map((model) => {
      const id = normalizeModelName(model.name);
      return { id, label: makeModelLabel(id, model.displayName) };
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

async function refreshSettingsModelList(selectedModel) {
  const apiKey = settingsApiKeyInputEl.value.trim();
  if (!apiKey) {
    showSettingsStatus("API Key를 먼저 입력해 주세요.", true);
    return;
  }

  loadSettingsModelsBtnEl.disabled = true;
  loadSettingsModelsBtnEl.textContent = "불러오는 중...";

  try {
    const models = await fetchGenerateModels(apiKey);
    if (models.length === 0) {
      throw new Error("generateContent를 지원하는 모델이 없습니다.");
    }
    state.settingModels = models;
    renderSettingsModelOptions(selectedModel || settingsModelSelectEl.value || state.model);
    showSettingsStatus(`모델 ${models.length}개를 불러왔습니다.`);
  } catch (error) {
    showSettingsStatus(`모델 목록 조회 실패: ${error.message}`, true);
  } finally {
    loadSettingsModelsBtnEl.disabled = false;
    loadSettingsModelsBtnEl.textContent = "목록 불러오기";
  }
}

async function openSettingsModal() {
  settingsApiKeyInputEl.value = state.apiKey || "";
  settingsKiprisApiKeyInputEl.value = state.kiprisApiKey || "";
  renderSettingsModelOptions(state.model || DEFAULT_MODEL);
  showSettingsStatus("");
  settingsModalEl.classList.remove("hidden");
  settingsApiKeyInputEl.focus();

  if (state.apiKey) {
    await refreshSettingsModelList(state.model || DEFAULT_MODEL);
  }
}

function closeSettingsModal() {
  settingsModalEl.classList.add("hidden");
}

async function saveSettingsFromModal() {
  const apiKey = settingsApiKeyInputEl.value.trim();
  const kiprisApiKey = settingsKiprisApiKeyInputEl.value.trim();
  const model = settingsModelSelectEl.value || DEFAULT_MODEL;

  if (!apiKey) {
    showSettingsStatus("API Key를 입력해 주세요.", true);
    return;
  }

  await chrome.storage.sync.set({ apiKey, kiprisApiKey, model });
  state.apiKey = apiKey;
  state.kiprisApiKey = kiprisApiKey;
  state.model = model;
  syncNumberTypeSelectState();
  updateHeader();
  updateControls();
  showSettingsStatus("저장되었습니다.");
}

async function clearApiKeyFromModal() {
  await chrome.storage.sync.remove("apiKey");
  state.apiKey = "";
  settingsApiKeyInputEl.value = "";
  updateControls();
  showSettingsStatus("API Key를 삭제했습니다.");
}

function updateControls() {
  syncNumberTypeSelectState();

  const hasKey = Boolean(state.apiKey);
  const hasKiprisKey = Boolean(String(state.kiprisApiKey || "").trim());
  const hasPatent = Boolean(state.patentData);
  const hasSummary = Boolean(state.summaryMarkdown);
  const hasDescription = Boolean(state.patentData?.description);
  const hasPromptSet = Boolean(state.prompts);
  const hasClaimOne = Boolean(getClaimOneText());
  const citationSourceMode = getCitationSourceMode();
  const canUseCitationBase =
    citationSourceMode === "summary" ? hasSummary : hasDescription;
  const hasCutoffDate = Boolean(String(citationCutoffDateInputEl.value || "").trim());
  const hasInventiveCitationNumbers =
    parseCitationNumbers(inventiveStepCitationNumbersInputEl.value).length > 0;
  const hasEvidenceCitationNumbers =
    parseCitationNumbers(getEvidenceCitationNumbersRaw()).length > 0;
  const evidenceClaimNumber = Number(evidenceClaimNumberInputEl.value);
  const hasEvidenceClaimNumber =
    Number.isInteger(evidenceClaimNumber) && evidenceClaimNumber >= 1;
  const hasCitationFormatNumbers =
    parseCitationNumbers(citationFormatNumbersInputEl.value).length > 0;
  const currentApplicationNumber = resolveCurrentApplicationNumber();
  const loadedApplicationNumber = normalizeApplicationNumber(
    state.amendmentHistoryApplicationNumber || ""
  );
  const hasLoadedAmendmentForCurrent =
    Array.isArray(state.amendmentHistoryItems) &&
    Boolean(currentApplicationNumber) &&
    loadedApplicationNumber === currentApplicationNumber;
  const hasSelectableAmendmentGroupOption =
    amendmentGroupSelectEl &&
    amendmentGroupSelectEl.options.length > 0 &&
    Boolean(String(amendmentGroupSelectEl.options[0].value || "").trim());

  const canStart = hasKey && hasPromptSet && !state.pending;
  const canInteract = hasKey && hasPromptSet && hasPatent && !state.pending;
  const canPromptInteract = canInteract && hasClaimOne && canUseCitationBase;
  const canGenerateSummary = hasKey && hasPromptSet && hasPatent && !state.pending;
  const canGenerateHighlights =
    canInteract &&
    state.claimItems.length > 0 &&
    hasDescription &&
    Boolean(state.prompts?.highlightTerms);
  const canEditHighlights = hasPatent && !state.pending;
  const canLoadAmendmentHistory =
    hasPatent &&
    hasKiprisKey &&
    Boolean(currentApplicationNumber) &&
    !state.pending;
  const canAnalyzeClaimChanges =
    hasLoadedAmendmentForCurrent &&
    hasSelectableAmendmentGroupOption &&
    Boolean(state.prompts?.claimChanges) &&
    !state.pending;

  keyNoticeEl.classList.toggle("hidden", hasKey);

  numberTypeSelectEl.disabled = !canStart;
  publicationInputEl.disabled = !canStart;
  summarizeBtnEl.disabled = !canStart;
  generateSummaryBtnEl.disabled = !canGenerateSummary;

  if (!hasKiprisKey && getSelectedNumberType() === NUMBER_TYPE_APPLICATION) {
    summarizeBtnEl.disabled = true;
  }

  followupInputEl.disabled = !(canInteract && hasSummary);
  followupSendBtnEl.disabled = !(canInteract && hasSummary);

  analyzeAllClaimsBtnEl.disabled = !(canInteract && state.claimItems.length > 0);
  generateHighlightsBtnEl.disabled = !canGenerateHighlights;
  openHighlightEditorBtnEl.disabled = !canEditHighlights;
  addHighlightGroupBtnEl.disabled = !canEditHighlights;
  generateCitationSearchPromptBtnEl.disabled = !(canPromptInteract && hasCutoffDate);
  generateInventiveStepPromptBtnEl.disabled =
    !(canPromptInteract && hasInventiveCitationNumbers);
  generateEvidencePromptBtnEl.disabled =
    !(canPromptInteract && hasEvidenceClaimNumber && hasEvidenceCitationNumbers);
  generateCitationFormatPromptBtnEl.disabled =
    !(canPromptInteract && hasCitationFormatNumbers);
  if (loadAmendmentHistoryBtnEl) {
    loadAmendmentHistoryBtnEl.disabled = !canLoadAmendmentHistory;
  }
  if (amendmentGroupSelectEl) {
    amendmentGroupSelectEl.disabled =
      state.pending ||
      !hasLoadedAmendmentForCurrent ||
      !hasSelectableAmendmentGroupOption;
  }
  if (amendmentViewModeSelectEl) {
    amendmentViewModeSelectEl.disabled = state.pending || !hasLoadedAmendmentForCurrent;
  }
  if (analyzeClaimChangesBtnEl) {
    analyzeClaimChangesBtnEl.disabled = !canAnalyzeClaimChanges;
  }

  for (const button of document.querySelectorAll(".claimAnalyzeBtn")) {
    button.disabled = !canInteract;
  }

  for (const control of highlightGroupsEditorEl.querySelectorAll(
    "input, textarea, button"
  )) {
    control.disabled = !canEditHighlights;
  }
}

function setPending(isPending) {
  state.pending = isPending;
  updateControls();
}

function setActiveTab(tabName, options = {}) {
  const persist = options.persist !== false;
  const normalizedTab = sanitizeTabName(tabName);
  state.activeTab = normalizedTab;

  for (const button of tabButtons) {
    const selected = button.dataset.tab === normalizedTab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", selected ? "true" : "false");
  }
  for (const panel of tabPanels) {
    const active = panel.id === `tab-${normalizedTab}`;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  }

  if (persist) {
    queuePersistSession();
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function renderInlineMarkdown(raw) {
  const tokenPrefix = "ZZCODETOKEN";
  const tokenSuffix = "ZZ";
  const codeTokens = [];

  let text = String(raw || "").replace(/`([^`\n]+)`/g, (_match, code) => {
    const tokenIndex = codeTokens.push(`<code>${escapeHtml(code)}</code>`) - 1;
    return `${tokenPrefix}${tokenIndex}${tokenSuffix}`;
  });

  text = escapeHtml(text);
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, label, url) =>
      `<a href="${escapeAttr(url)}" target="_blank" rel="noreferrer">${label}</a>`
  );
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_\n]+)_/g, "<em>$1</em>");

  const tokenPattern = new RegExp(`${tokenPrefix}(\\d+)${tokenSuffix}`, "g");
  return text.replace(tokenPattern, (_match, tokenIndex) => {
    return codeTokens[Number(tokenIndex)] || "";
  });
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  const html = [];
  let paragraphLines = [];
  let listType = null;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(listType === "ul" ? "</ul>" : "</ol>");
    listType = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    const codeFence = trimmed.match(/^```(\w+)?$/);
    if (codeFence) {
      flushParagraph();
      closeList();

      const language = codeFence[1] || "";
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().match(/^```$/)) {
        codeLines.push(lines[i]);
        i += 1;
      }

      const langAttr = language
        ? ` class="language-${escapeAttr(language)}"`
        : "";
      html.push(
        `<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html.push(
        `<h${level}>${renderInlineMarkdown(headingMatch[2].trim())}</h${level}>`
      );
      continue;
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      flushParagraph();
      if (listType === "ol") closeList();
      if (!listType) {
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${renderInlineMarkdown(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      flushParagraph();
      if (listType === "ul") closeList();
      if (!listType) {
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${renderInlineMarkdown(olMatch[1])}</li>`);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html.join("\n");
}

function setMarkdown(el, markdown, emptyText) {
  const normalized = String(markdown || "").trim();
  if (!normalized) {
    el.textContent = emptyText;
    el.classList.add("empty");
    return;
  }

  el.innerHTML = markdownToHtml(normalized);
  el.classList.remove("empty");
}

function normalizePromptText(value) {
  return String(value || "").trim();
}

function toPromptPreview(text, maxLength = 120) {
  const compact = normalizePromptText(text).replace(/\s+/g, " ");
  if (!compact) return "";
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength)}...`;
}

function setPromptPreview(el, fullText) {
  const normalized = normalizePromptText(fullText);
  if (!normalized) {
    el.textContent = EMPTY_PROMPT_PREVIEW;
    el.classList.add("empty");
    return;
  }

  const preview = `${toPromptPreview(normalized)}\n\n(클릭해서 전체 보기)`;
  el.textContent = preview;
  el.classList.remove("empty");
}

function renderPromptCards() {
  for (const [key, info] of Object.entries(PROMPT_CARD_INFO)) {
    setPromptPreview(info.previewEl, state.promptOutputs[key]);
  }
}

function openPromptModal(title, text, key = "") {
  const normalized = normalizePromptText(text);
  if (!normalized) {
    updateStatus("먼저 프롬프트를 생성해 주세요.", true);
    return;
  }

  promptModalState = { key, title, text: normalized };
  promptModalTitleEl.textContent = title;
  promptModalBodyEl.textContent = normalized;
  promptModalEl.classList.remove("hidden");
}

function closePromptModal() {
  promptModalEl.classList.add("hidden");
}

function openAmendmentDetailModal(detail) {
  if (
    !amendmentDetailModalEl ||
    !amendmentDetailModalTitleEl ||
    !amendmentDetailModalMetaEl ||
    !amendmentDetailModalDiffEl ||
    !amendmentDetailModalRelatedWrapEl ||
    !amendmentDetailModalRelatedListEl
  ) {
    return;
  }

  const title = String(detail?.title || "청구항 수정보기").trim();
  const meta = String(detail?.meta || "").trim();
  const beforeText = String(detail?.beforeText || "");
  const afterText = String(detail?.afterText || "");
  const relatedPreviousClaims = Array.isArray(detail?.relatedPreviousClaims)
    ? detail.relatedPreviousClaims
        .map((item) => ({
          claimNo: String(item?.claimNo || "").trim(),
          text: String(item?.text || "").trim(),
        }))
        .filter((item) => item.claimNo && item.text)
    : [];

  amendmentDetailModalState = {
    title,
    meta,
    beforeText,
    afterText,
    relatedPreviousClaims,
  };

  amendmentDetailModalTitleEl.textContent = title;
  amendmentDetailModalMetaEl.textContent = meta || "비교 기준 정보가 없습니다.";

  const diffHtml = buildAmendmentDiffHtml(beforeText, afterText);
  if (!diffHtml) {
    amendmentDetailModalDiffEl.textContent = "표시할 변경 내용이 없습니다.";
    amendmentDetailModalDiffEl.classList.add("empty");
  } else {
    amendmentDetailModalDiffEl.innerHTML = diffHtml;
    amendmentDetailModalDiffEl.classList.remove("empty");
  }

  amendmentDetailModalRelatedListEl.textContent = "";
  if (relatedPreviousClaims.length > 0) {
    amendmentDetailModalRelatedWrapEl.classList.remove("hidden");
    relatedPreviousClaims.forEach((item) => {
      const card = document.createElement("article");
      card.className = "amendmentDetailRelatedCard";

      const titleEl = document.createElement("div");
      titleEl.className = "amendmentDetailRelatedClaimNo";
      titleEl.textContent = `청구항 ${item.claimNo}`;

      const textEl = document.createElement("pre");
      textEl.className = "amendmentDetailRelatedText";
      textEl.textContent = item.text;

      card.append(titleEl, textEl);
      amendmentDetailModalRelatedListEl.appendChild(card);
    });
  } else {
    amendmentDetailModalRelatedWrapEl.classList.add("hidden");
  }

  amendmentDetailModalEl.classList.remove("hidden");
  closeAmendmentDetailModalBtnEl?.focus();
}

function closeAmendmentDetailModal() {
  if (!amendmentDetailModalEl) return;
  amendmentDetailModalEl.classList.add("hidden");
}

function openHighlightEditorModal() {
  if (!highlightEditorModalEl || !highlightGroupsEditorEl) return;
  renderHighlightGroupsEditor();
  highlightEditorModalEl.classList.remove("hidden");
  closeHighlightEditorBtnEl?.focus();
}

function closeHighlightEditorModal() {
  if (!highlightEditorModalEl) return;
  highlightEditorModalEl.classList.add("hidden");
}

function stripCodeFence(text) {
  const trimmed = String(text || "").trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }
  return trimmed;
}

function extractJsonObjectText(text) {
  const cleaned = stripCodeFence(text);
  if (!cleaned) return "";

  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    return cleaned;
  }
  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
    return cleaned;
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function parseClaimAnalysis(rawText) {
  const raw = String(rawText || "").trim();
  if (!raw) {
    return {
      rawText: "",
      features: [],
      parseError: null,
    };
  }

  const jsonText = extractJsonObjectText(raw);
  let parsed = null;
  try {
    parsed = JSON.parse(jsonText);
  } catch (_error) {
    return {
      rawText: raw,
      features: [],
      parseError: "JSON 형식으로 해석하지 못했습니다.",
    };
  }

  const rawFeatures = Array.isArray(parsed?.ClaimFeatures)
    ? parsed.ClaimFeatures
    : [];

  const features = rawFeatures
    .map((item, index) => {
      const idText = String(item?.Id || `F${index + 1}`).trim() || `F${index + 1}`;
      const descText = String(item?.Description || "").trim();
      if (!descText) return null;
      return {
        id: idText,
        description: descText,
      };
    })
    .filter(Boolean);

  if (features.length === 0) {
    return {
      rawText: raw,
      features: [],
      parseError: "ClaimFeatures 항목이 비어 있습니다.",
    };
  }

  return {
    rawText: raw,
    features,
    parseError: null,
  };
}

function normalizeClaimAnalysis(value) {
  if (!value) return null;
  if (typeof value === "string") {
    return parseClaimAnalysis(value);
  }
  if (Array.isArray(value.features)) {
    return value;
  }
  return null;
}

function setClaimAnalysisView(el, analysisValue) {
  const analysis = normalizeClaimAnalysis(analysisValue);
  const hasFeatures = Boolean(analysis?.features?.length);

  if (!analysis || !hasFeatures) {
    const emptyText =
      analysis?.parseError || "아직 생성된 구성분석이 없습니다.";
    el.textContent = emptyText;
    el.classList.add("empty");
    return;
  }

  el.textContent = "";
  el.classList.remove("empty");

  const list = document.createElement("div");
  list.className = "featureList";

  for (const feature of analysis.features) {
    const row = document.createElement("article");
    row.className = "featureItem";

    const id = document.createElement("div");
    id.className = "featureId";
    id.textContent = feature.id;

    const desc = document.createElement("div");
    desc.className = "featureDesc";
    desc.textContent = feature.description;

    row.append(id, desc);
    list.appendChild(row);
  }

  el.appendChild(list);
}

function normalizePublicationNumber(value) {
  let normalized = String(value || "")
    .toUpperCase()
    .trim()
    .replace(/^KR/, "")
    .replace(/A$/, "")
    .replace(/[^0-9A-Z]/g, "");

  if (normalized.startsWith("10")) {
    normalized = normalized.slice(2);
  }

  return normalized;
}

function normalizeApplicationNumber(value) {
  return String(value || "")
    .toUpperCase()
    .trim()
    .replace(/^KR/, "")
    .replace(/[^0-9A-Z]/g, "");
}

function sanitizeNumberType(value) {
  return value === NUMBER_TYPE_APPLICATION
    ? NUMBER_TYPE_APPLICATION
    : NUMBER_TYPE_PUBLICATION;
}

function getSelectedNumberType() {
  return sanitizeNumberType(numberTypeSelectEl?.value);
}

function syncNumberTypeSelectState() {
  if (!numberTypeSelectEl) return;

  const hasKiprisApiKey = Boolean(String(state.kiprisApiKey || "").trim());
  const applicationOption = numberTypeSelectEl.querySelector(
    `option[value="${NUMBER_TYPE_APPLICATION}"]`
  );
  if (applicationOption) {
    applicationOption.disabled = !hasKiprisApiKey;
  }

  if (!hasKiprisApiKey && getSelectedNumberType() === NUMBER_TYPE_APPLICATION) {
    numberTypeSelectEl.value = NUMBER_TYPE_PUBLICATION;
  }

  numberTypeSelectEl.title = hasKiprisApiKey
    ? ""
    : "출원번호 조회에는 KIPRIS API Key가 필요합니다.";
}

function resolveCurrentApplicationNumber() {
  const candidates = [
    state.patentData?.applicationNumber,
    state.patentData?.queryType === NUMBER_TYPE_APPLICATION
      ? state.patentData?.inputNumber
      : "",
    getSelectedNumberType() === NUMBER_TYPE_APPLICATION ? publicationInputEl?.value : "",
  ];

  for (const candidate of candidates) {
    const normalized = normalizeApplicationNumber(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function splitClaims(rawClaims) {
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
        /^청구항(?:\s*\(\d+\))?$/.test(first) ||
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

  // Priority parser: split by line starts like "1. ...", "2. ...", "3. ..."
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
      const end = i + 1 < anchorsToUse.length ? anchorsToUse[i + 1].index : source.length;
      const chunk = source.slice(start, end).trim();
      const normalizedChunk = stripLeadingClaimNumber(chunk);
      if (normalizedChunk) numberedClaims.push(normalizedChunk);
    }

    if (numberedClaims.length > 0) {
      return numberedClaims;
    }
  }

  // Fallback parser for non-numbered formats
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
      .split(/\n{2,}/)
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

function sanitizeAmendmentHistoryItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((item) => ({
    applicationNumber: String(item?.applicationNumber || "").trim(),
    receiptSendSerialNumber: String(item?.receiptSendSerialNumber || "").trim(),
    receiptSendNumber: String(item?.receiptSendNumber || "").trim(),
    petitionclauseNumber: String(item?.petitionclauseNumber || "").trim(),
    changeTypeCode: String(item?.changeTypeCode || "").trim(),
    changeTypeName: String(item?.changeTypeName || "").trim(),
    petitionclauseRaw: String(item?.petitionclauseRaw || "").trim(),
    petitionclause: String(item?.petitionclause || "").trim(),
    transferReceiptDocNumber: String(item?.transferReceiptDocNumber || "").trim(),
    transferPetitionclauseRaw: String(item?.transferPetitionclauseRaw || "").trim(),
    transferPetitionclause: String(item?.transferPetitionclause || "").trim(),
  }));
}

function tokenizeDiffText(value) {
  return String(value || "").match(/(\s+|[^\s]+)/g) || [];
}

function pushDiffSegment(segments, type, value) {
  if (!value) return;
  const last = segments[segments.length - 1];
  if (last && last.type === type) {
    last.value += value;
    return;
  }
  segments.push({ type, value });
}

function buildTokenDiffSegments(beforeText, afterText) {
  const beforeTokens = tokenizeDiffText(beforeText);
  const afterTokens = tokenizeDiffText(afterText);

  if (beforeTokens.length === 0 && afterTokens.length === 0) {
    return [];
  }

  const matrixSize = beforeTokens.length * afterTokens.length;
  if (matrixSize > 220_000) {
    const fallback = [];
    if (beforeText) {
      fallback.push({ type: "remove", value: beforeText });
    }
    if (afterText) {
      fallback.push({ type: "add", value: afterText });
    }
    return fallback;
  }

  const rows = beforeTokens.length;
  const cols = afterTokens.length;
  const dp = Array.from({ length: rows + 1 }, () => new Uint16Array(cols + 1));

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = cols - 1; col >= 0; col -= 1) {
      if (beforeTokens[row] === afterTokens[col]) {
        dp[row][col] = dp[row + 1][col + 1] + 1;
      } else {
        dp[row][col] = Math.max(dp[row + 1][col], dp[row][col + 1]);
      }
    }
  }

  const segments = [];
  let row = 0;
  let col = 0;

  while (row < rows && col < cols) {
    if (beforeTokens[row] === afterTokens[col]) {
      pushDiffSegment(segments, "equal", beforeTokens[row]);
      row += 1;
      col += 1;
      continue;
    }

    if (dp[row + 1][col] >= dp[row][col + 1]) {
      pushDiffSegment(segments, "remove", beforeTokens[row]);
      row += 1;
    } else {
      pushDiffSegment(segments, "add", afterTokens[col]);
      col += 1;
    }
  }

  while (row < rows) {
    pushDiffSegment(segments, "remove", beforeTokens[row]);
    row += 1;
  }

  while (col < cols) {
    pushDiffSegment(segments, "add", afterTokens[col]);
    col += 1;
  }

  return segments;
}

function buildAmendmentDiffHtml(beforeText, afterText) {
  const before = String(beforeText || "");
  const after = String(afterText || "");

  if (!before && !after) {
    return "";
  }

  if (before === after) {
    return escapeHtml(after || before);
  }

  const segments = buildTokenDiffSegments(before, after);
  if (segments.length === 0) {
    return escapeHtml(after || before);
  }

  return segments
    .map((segment) => {
      const safeValue = escapeHtml(segment.value);
      if (segment.type === "add") {
        return `<span class="amendAdded">${safeValue}</span>`;
      }
      if (segment.type === "remove") {
        return `<span class="amendRemoved">${safeValue}</span>`;
      }
      return safeValue;
    })
    .join("");
}

function parseNonNegativeInteger(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  if (num < 0) return null;
  return Math.trunc(num);
}

function renderClaimsCountText() {
  if (!claimsCountTextEl) return;

  const extractedCount = parseNonNegativeInteger(state.patentData?.claimCount);
  const parsedCount = state.claimItems.length;

  if (!state.patentData) {
    claimsCountTextEl.textContent = "청구항 개수: -";
    return;
  }

  if (extractedCount === null) {
    claimsCountTextEl.textContent = `청구항 개수: ${parsedCount}`;
    return;
  }

  if (parsedCount > 0 && parsedCount !== extractedCount) {
    claimsCountTextEl.textContent =
      `청구항 개수: ${extractedCount} (파싱 ${parsedCount})`;
    return;
  }

  claimsCountTextEl.textContent = `청구항 개수: ${extractedCount}`;
}

function nextHighlightGroupId() {
  const id = `hg_${Date.now().toString(36)}_${highlightGroupSeq.toString(36)}`;
  highlightGroupSeq += 1;
  return id;
}

function normalizeHighlightColor(value, fallbackColor = "#f59e0b") {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) {
    return text.toLowerCase();
  }
  return fallbackColor.toLowerCase();
}

function parseHighlightTerms(value) {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[\n,;]+/g)
      : [];

  const output = [];
  const seen = new Set();

  for (const item of raw) {
    if (item === null || item === undefined) continue;
    if (typeof item === "object") continue;
    const term = String(item || "").trim();
    if (!term) continue;
    const key = term.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(term);
  }

  output.sort((a, b) => b.length - a.length);
  return output;
}

function sanitizeHighlightGroups(rawGroups, options = {}) {
  const keepEmpty = options.keepEmpty === true;
  if (!Array.isArray(rawGroups)) return [];

  return rawGroups
    .map((group, index) => {
      const fallbackColor = HIGHLIGHT_COLOR_PALETTE[index % HIGHLIGHT_COLOR_PALETTE.length];

      if (typeof group === "string") {
        const terms = parseHighlightTerms(group);
        if (terms.length === 0 && !keepEmpty) return null;
        return {
          id: nextHighlightGroupId(),
          name: `용어군 ${index + 1}`,
          color: fallbackColor,
          terms,
        };
      }

      if (!group || typeof group !== "object") return null;

      const id = String(group.id || group.Id || nextHighlightGroupId());
      const name = String(
        group.name || group.Name || group.group || group.Group || `용어군 ${index + 1}`
      ).trim();
      const color = normalizeHighlightColor(
        group.color || group.Color,
        fallbackColor
      );

      const termsValue =
        group.terms ??
        group.Terms ??
        group.keywords ??
        group.Keywords ??
        group.items ??
        group.Items ??
        group.term ??
        group.Term ??
        [];
      const terms = parseHighlightTerms(termsValue);
      if (terms.length === 0 && !keepEmpty) return null;

      return {
        id,
        name: name || `용어군 ${index + 1}`,
        color,
        terms,
      };
    })
    .filter(Boolean);
}

function colorHexToRgba(hexColor, alpha) {
  const normalized = normalizeHighlightColor(hexColor).slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const clampedAlpha = Math.min(1, Math.max(0, Number(alpha) || 0));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
}

function buildHighlightedHtml(rawText, groups = state.highlightGroups) {
  const text = String(rawText || "");
  if (!text) return "";

  const normalizedGroups = sanitizeHighlightGroups(groups).filter(
    (group) => group.terms.length > 0
  );
  if (normalizedGroups.length === 0) {
    return escapeHtml(text);
  }

  const loweredText = text.toLocaleLowerCase();
  const matches = [];

  normalizedGroups.forEach((group) => {
    group.terms.forEach((term) => {
      const loweredTerm = term.toLocaleLowerCase();
      if (!loweredTerm) return;
      let searchIndex = 0;

      while (searchIndex < loweredText.length) {
        const foundAt = loweredText.indexOf(loweredTerm, searchIndex);
        if (foundAt === -1) break;
        matches.push({
          start: foundAt,
          end: foundAt + term.length,
          group,
        });
        searchIndex = foundAt + loweredTerm.length;
      }
    });
  });

  if (matches.length === 0) {
    return escapeHtml(text);
  }

  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const lenDiff = b.end - b.start - (a.end - a.start);
    if (lenDiff !== 0) return lenDiff;
    return a.group.name.localeCompare(b.group.name);
  });

  const selectedMatches = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor) continue;
    selectedMatches.push(match);
    cursor = match.end;
  }

  const htmlParts = [];
  let lastIndex = 0;

  for (const match of selectedMatches) {
    if (match.start > lastIndex) {
      htmlParts.push(escapeHtml(text.slice(lastIndex, match.start)));
    }

    const matchedText = text.slice(match.start, match.end);
    const bgColor = colorHexToRgba(match.group.color, 0.24);
    const borderColor = colorHexToRgba(match.group.color, 0.58);
    htmlParts.push(
      `<span class="termHighlight" style="background-color: ${escapeAttr(
        bgColor
      )}; border-color: ${escapeAttr(borderColor)};" title="${escapeAttr(
        match.group.name
      )}">${escapeHtml(matchedText)}</span>`
    );
    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    htmlParts.push(escapeHtml(text.slice(lastIndex)));
  }

  return htmlParts.join("");
}

function renderHighlightMetaAndLegend() {
  const groups = sanitizeHighlightGroups(state.highlightGroups, { keepEmpty: true });
  state.highlightGroups = groups;

  const totalTerms = groups.reduce((sum, group) => sum + group.terms.length, 0);
  if (!state.patentData) {
    highlightMetaEl.textContent = "공개번호 조회 후 용어 하이라이트를 사용할 수 있습니다.";
  } else if (groups.length === 0) {
    highlightMetaEl.textContent = "아직 추출된 용어군이 없습니다.";
  } else {
    highlightMetaEl.textContent = `${groups.length}개 용어군 / ${totalTerms}개 용어`;
  }

  highlightLegendEl.textContent = "";
  if (groups.length === 0) {
    highlightLegendEl.textContent = "아직 용어군이 없습니다.";
    highlightLegendEl.classList.add("empty");
    return;
  }

  highlightLegendEl.classList.remove("empty");
  groups.forEach((group) => {
    const chip = document.createElement("span");
    chip.className = "highlightLegendChip";

    const dot = document.createElement("span");
    dot.className = "highlightLegendDot";
    dot.style.backgroundColor = group.color;

    const text = document.createElement("span");
    text.textContent = `${group.name} (${group.terms.length})`;

    chip.append(dot, text);
    highlightLegendEl.appendChild(chip);
  });
}

function renderHighlightGroupsEditor() {
  const groups = sanitizeHighlightGroups(state.highlightGroups, { keepEmpty: true });
  state.highlightGroups = groups;

  highlightGroupsEditorEl.textContent = "";
  if (groups.length === 0) {
    highlightGroupsEditorEl.textContent = "API 추출 또는 수동 추가로 용어군을 만들어 주세요.";
    highlightGroupsEditorEl.classList.add("empty");
    return;
  }

  highlightGroupsEditorEl.classList.remove("empty");

  groups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "highlightGroupCard";
    card.dataset.groupId = group.id;

    const head = document.createElement("div");
    head.className = "highlightGroupCardHead";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "highlightGroupNameInput";
    nameInput.value = group.name;
    nameInput.placeholder = "용어군 이름";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "highlightColorInput";
    colorInput.value = normalizeHighlightColor(group.color);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "highlightGroupRemoveBtn";
    removeBtn.textContent = "삭제";

    head.append(nameInput, colorInput, removeBtn);

    const termsInput = document.createElement("textarea");
    termsInput.className = "highlightTermsInput";
    termsInput.placeholder = "용어를 줄바꿈 또는 쉼표로 구분해 입력하세요.";
    termsInput.value = group.terms.join("\n");

    const hint = document.createElement("div");
    hint.className = "highlightGroupHint";
    hint.textContent = `${group.terms.length}개 용어`;

    card.append(head, termsInput, hint);
    highlightGroupsEditorEl.appendChild(card);
  });
}

function parseHighlightGroupsFromModel(rawText) {
  const raw = String(rawText || "").trim();
  if (!raw) {
    throw new Error("하이라이트 응답이 비어 있습니다.");
  }

  const jsonText = extractJsonObjectText(raw);
  let parsed = null;
  try {
    parsed = JSON.parse(jsonText);
  } catch (_error) {
    throw new Error("하이라이트 응답을 JSON으로 해석하지 못했습니다.");
  }

  const rawGroups = Array.isArray(parsed)
    ? parsed
    : parsed?.TermGroups ||
      parsed?.termGroups ||
      parsed?.HighlightGroups ||
      parsed?.highlightGroups ||
      parsed?.groups ||
      [];

  if (!Array.isArray(rawGroups) || rawGroups.length === 0) {
    throw new Error("하이라이트 용어군이 응답에 없습니다.");
  }

  const groups = sanitizeHighlightGroups(rawGroups);
  if (groups.length === 0) {
    throw new Error("하이라이트 용어군을 추출하지 못했습니다.");
  }

  return groups.map((group, index) => ({
    ...group,
    color: normalizeHighlightColor(
      group.color,
      HIGHLIGHT_COLOR_PALETTE[index % HIGHLIGHT_COLOR_PALETTE.length]
    ),
  }));
}

function buildClaimsForHighlightPrompt() {
  if (state.claimItems.length === 0) {
    return String(state.patentData?.claims || "").trim();
  }

  return state.claimItems
    .map((claimText, index) => `[청구항 ${index + 1}]\n${claimText}`)
    .join("\n\n")
    .trim();
}

function applyHighlightGroups(nextGroups, options = {}) {
  const renderEditor = options.renderEditor !== false;
  const persist = options.persist !== false;

  state.highlightGroups = sanitizeHighlightGroups(nextGroups, {
    keepEmpty: true,
  });

  renderHighlightMetaAndLegend();
  if (renderEditor) {
    renderHighlightGroupsEditor();
  }
  renderClaimsCards();
  renderDescriptionTab();

  if (persist) {
    queuePersistSession();
  }
}

function createEmptyHighlightGroup() {
  const groupIndex = state.highlightGroups.length;
  return {
    id: nextHighlightGroupId(),
    name: `용어군 ${groupIndex + 1}`,
    color: HIGHLIGHT_COLOR_PALETTE[groupIndex % HIGHLIGHT_COLOR_PALETTE.length],
    terms: [],
  };
}

function updateHighlightGroupFromEditor(groupId, updater) {
  if (!groupId) return false;
  let changed = false;

  const nextGroups = state.highlightGroups.map((group) => {
    if (group.id !== groupId) return group;
    changed = true;
    return updater(group);
  });

  if (!changed) return false;
  applyHighlightGroups(nextGroups, { renderEditor: false });
  return true;
}

function removeHighlightGroup(groupId) {
  const nextGroups = state.highlightGroups.filter((group) => group.id !== groupId);
  if (nextGroups.length === state.highlightGroups.length) return;
  applyHighlightGroups(nextGroups);
}

function addHighlightGroup() {
  const nextGroups = [...state.highlightGroups, createEmptyHighlightGroup()];
  applyHighlightGroups(nextGroups);
}

function handleHighlightEditorChange(event) {
  const target = event.target;
  const card = target.closest(".highlightGroupCard");
  if (!card) return;

  const groupId = String(card.dataset.groupId || "");
  if (!groupId) return;

  if (target.classList.contains("highlightGroupNameInput")) {
    const nextName = String(target.value || "");
    const updated = updateHighlightGroupFromEditor(groupId, (group) => ({
      ...group,
      name: nextName,
    }));
    if (updated) {
      renderHighlightGroupsEditor();
      updateControls();
    }
    return;
  }

  if (target.classList.contains("highlightColorInput")) {
    const nextColor = normalizeHighlightColor(target.value);
    const updated = updateHighlightGroupFromEditor(groupId, (group) => ({
      ...group,
      color: nextColor,
    }));
    if (updated) {
      renderHighlightGroupsEditor();
      updateControls();
    }
    return;
  }

  if (target.classList.contains("highlightTermsInput")) {
    const nextTerms = parseHighlightTerms(target.value);
    const updated = updateHighlightGroupFromEditor(groupId, (group) => ({
      ...group,
      terms: nextTerms,
    }));
    if (updated) {
      renderHighlightGroupsEditor();
      updateControls();
    }
  }
}

function handleHighlightEditorClick(event) {
  const button = event.target.closest(".highlightGroupRemoveBtn");
  if (!button) return;

  const card = button.closest(".highlightGroupCard");
  const groupId = String(card?.dataset.groupId || "");
  if (!groupId) return;

  removeHighlightGroup(groupId);
}

function setPatentMeta(data) {
  const patentId = data?.patentId || `KR${data?.publicationNumber || ""}A`;
  const title = data?.title || "(제목 없음)";
  const sourceUrl = data?.sourceUrl || data?.pageUrl || "";

  summaryMetaEl.textContent = "";
  summaryMetaEl.classList.remove("empty");

  const idNode = document.createElement("strong");
  idNode.textContent = patentId;
  summaryMetaEl.appendChild(idNode);

  summaryMetaEl.appendChild(document.createTextNode(` | ${title}`));

  if (data?.resolvedFromApplication && data?.applicationNumber) {
    summaryMetaEl.appendChild(
      document.createTextNode(
        ` | 출원번호 ${data.applicationNumber} → 공개번호 ${data.publicationNumber || ""}`
      )
    );
  }

  if (sourceUrl) {
    summaryMetaEl.appendChild(document.createTextNode(" | "));
    const link = document.createElement("a");
    link.href = sourceUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "원문 링크";
    summaryMetaEl.appendChild(link);
  }
}

function clearPatentMeta() {
  summaryMetaEl.textContent = "아직 조회된 특허가 없습니다.";
  summaryMetaEl.classList.add("empty");
}

function clearFollowupChat() {
  followupChatLogEl.textContent = "";
  const msg = document.createElement("div");
  msg.className = "chatMsg assistant";
  msg.innerHTML =
    '<span class="chatMsgLabel">Assistant</span><p>요약 생성 후 추가 질문을 할 수 있습니다.</p>';
  followupChatLogEl.appendChild(msg);
}

function appendFollowupMessage(role, text, asMarkdown = false) {
  const box = document.createElement("div");
  box.className = `chatMsg ${role}`;

  const label = document.createElement("span");
  label.className = "chatMsgLabel";
  label.textContent = role === "user" ? "You" : "Assistant";

  const body = document.createElement("div");
  if (asMarkdown) {
    body.innerHTML = markdownToHtml(text);
  } else {
    body.textContent = text;
  }

  box.append(label, body);
  followupChatLogEl.appendChild(box);
  followupChatLogEl.scrollTop = followupChatLogEl.scrollHeight;
}

function renderFollowupChat() {
  followupChatLogEl.textContent = "";
  if (!Array.isArray(state.followupHistory) || state.followupHistory.length === 0) {
    clearFollowupChat();
    return;
  }

  for (const item of state.followupHistory) {
    const role = item?.role === "user" ? "user" : "assistant";
    const text = String(item?.text || "");
    appendFollowupMessage(role, text, role === "assistant");
  }
}

function renderDescriptionTab() {
  const highlightGroups = sanitizeHighlightGroups(state.highlightGroups);
  const description = state.patentData?.description || "";
  if (!description) {
    descriptionRawEl.textContent = EMPTY_DESCRIPTION;
    descriptionRawEl.classList.add("empty");
  } else {
    descriptionRawEl.innerHTML = buildHighlightedHtml(description, highlightGroups);
    descriptionRawEl.classList.remove("empty");
  }

  descriptionClaimsColumnEl.textContent = "";
  const claims = state.claimItems;
  if (claims.length === 0) {
    descriptionClaimsColumnEl.textContent = EMPTY_CLAIMS;
    descriptionClaimsColumnEl.classList.add("empty");
    return;
  }

  descriptionClaimsColumnEl.classList.remove("empty");
  claims.forEach((claimText, index) => {
    const card = document.createElement("article");
    card.className = "claimMiniCard";

    const title = document.createElement("div");
    title.className = "claimMiniTitle";
    title.textContent = `청구항 ${index + 1}`;

    const body = document.createElement("div");
    body.className = "claimMiniBody";
    body.innerHTML = buildHighlightedHtml(claimText, highlightGroups);

    card.append(title, body);
    descriptionClaimsColumnEl.appendChild(card);
  });
}

function setAmendmentHistoryListEmpty(message = EMPTY_AMENDMENT_HISTORY) {
  if (!amendmentHistoryListEl) return;
  amendmentHistoryListEl.textContent = message;
  amendmentHistoryListEl.classList.add("empty");
}

function appendAmendmentMetaChip(rowEl, text, variant = "") {
  const normalized = String(text || "").trim();
  if (!normalized) return;
  const chip = document.createElement("span");
  chip.className = "amendmentMetaChip";
  if (variant) {
    chip.classList.add(variant);
  }
  chip.textContent = normalized;
  rowEl.appendChild(chip);
}

function normalizeAmendmentGroupKey(value) {
  return String(value || "").trim();
}

function sanitizeAmendmentViewMode(value) {
  const normalized = String(value || "").trim();
  if (normalized === AMENDMENT_VIEW_MODE_MODIFIED) {
    return AMENDMENT_VIEW_MODE_MODIFIED;
  }
  if (normalized === AMENDMENT_VIEW_MODE_DELETED) {
    return AMENDMENT_VIEW_MODE_DELETED;
  }
  if (normalized === AMENDMENT_VIEW_MODE_ADDED) {
    return AMENDMENT_VIEW_MODE_ADDED;
  }
  if (normalized === AMENDMENT_VIEW_MODE_FINAL) {
    return AMENDMENT_VIEW_MODE_FINAL;
  }

  // Backward compatibility with old persisted values.
  if (normalized === "deletedOnly") {
    return AMENDMENT_VIEW_MODE_DELETED;
  }
  if (normalized === "addedOnly") {
    return AMENDMENT_VIEW_MODE_ADDED;
  }
  if (normalized === "finalOnly") {
    return AMENDMENT_VIEW_MODE_FINAL;
  }

  return AMENDMENT_VIEW_MODE_MODIFIED;
}

function makeAmendmentGroupKey(item, index) {
  const receipt = String(item?.receiptSendNumber || "").trim();
  if (receipt) {
    return `receipt:${receipt}`;
  }

  const serial = String(item?.receiptSendSerialNumber || "").trim();
  if (serial) {
    return `serial:${serial}`;
  }

  return `row:${index + 1}`;
}

function makeAmendmentClaimKey(item, groupRowIndex) {
  const claimNumber = String(item?.petitionclauseNumber || "").trim();
  if (claimNumber) {
    return claimNumber;
  }
  return `line-${groupRowIndex + 1}`;
}

function buildAmendmentReceiptGroups(items) {
  const groups = [];
  const groupMap = new Map();

  items.forEach((item, index) => {
    const groupKey = makeAmendmentGroupKey(item, index);
    let group = groupMap.get(groupKey);

    if (!group) {
      group = {
        key: groupKey,
        receiptSendNumber: String(item?.receiptSendNumber || "").trim(),
        receiptSendSerialNumber: String(item?.receiptSendSerialNumber || "").trim(),
        transferReceiptDocNumber: String(item?.transferReceiptDocNumber || "").trim(),
        claimsByKey: new Map(),
        claimKeys: [],
        effectiveClaimsByKey: new Map(),
        effectiveClaimKeys: [],
      };
      groupMap.set(groupKey, group);
      groups.push(group);
    }

    if (!group.transferReceiptDocNumber) {
      group.transferReceiptDocNumber = String(item?.transferReceiptDocNumber || "").trim();
    }

    const claimKey = makeAmendmentClaimKey(item, group.claimKeys.length);
    const claimText = String(item?.petitionclause || "").trim();
    if (!group.claimsByKey.has(claimKey)) {
      group.claimKeys.push(claimKey);
    }
    group.claimsByKey.set(claimKey, claimText);
  });

  let previousEffectiveClaims = new Map();
  groups.forEach((group, index) => {
    const effectiveClaims =
      index === 0 ? new Map() : new Map(previousEffectiveClaims);

    group.claimKeys.forEach((claimKey) => {
      const nextText = String(group.claimsByKey.get(claimKey) || "").trim();
      if (!nextText) {
        // Explicit empty text is treated as deletion, but missing mention means carry-forward.
        effectiveClaims.delete(claimKey);
      } else {
        effectiveClaims.set(claimKey, nextText);
      }
    });

    group.effectiveClaimsByKey = effectiveClaims;
    group.effectiveClaimKeys = Array.from(effectiveClaims.keys()).sort(compareClaimKeys);
    previousEffectiveClaims = new Map(effectiveClaims);
  });

  return groups;
}

function formatAmendmentGroupLabel(group, index) {
  const receipt = String(group?.receiptSendNumber || "").trim();
  const serial = String(group?.receiptSendSerialNumber || "").trim();
  const receiptText = receipt ? `Receipt ${receipt}` : "Receipt -";
  const serialText = serial ? ` / Serial ${serial}` : "";
  return `${index + 1}. ${receiptText}${serialText}`;
}

function compareClaimKeys(a, b) {
  const aText = String(a || "");
  const bText = String(b || "");
  const aNum = Number(aText);
  const bNum = Number(bText);

  const aNumeric = Number.isFinite(aNum) && /^\d+$/.test(aText);
  const bNumeric = Number.isFinite(bNum) && /^\d+$/.test(bText);

  if (aNumeric && bNumeric) {
    return aNum - bNum;
  }
  if (aNumeric) return -1;
  if (bNumeric) return 1;
  return aText.localeCompare(bText);
}

function formatClaimKeyLabel(claimKey, index) {
  const keyText = String(claimKey || "").trim();
  if (/^\d+$/.test(keyText)) {
    return `Claim ${keyText}`;
  }
  return `Claim Item ${index + 1}`;
}

function getSelectedAmendmentComparisonContext(groupsOverride = null) {
  const groups = Array.isArray(groupsOverride)
    ? groupsOverride
    : buildAmendmentReceiptGroups(
        sanitizeAmendmentHistoryItems(state.amendmentHistoryItems)
      );

  if (!Array.isArray(groups) || groups.length === 0) {
    return null;
  }

  let selectedGroupKey = normalizeAmendmentGroupKey(state.amendmentSelectedGroupKey);
  if (!groups.some((group) => group.key === selectedGroupKey)) {
    selectedGroupKey = groups[groups.length - 1].key;
  }

  const selectedIndex = groups.findIndex((group) => group.key === selectedGroupKey);
  if (selectedIndex < 0) {
    return null;
  }

  const selectedGroup = groups[selectedIndex];
  const previousGroup = selectedIndex > 0 ? groups[selectedIndex - 1] : null;

  return {
    groups,
    selectedIndex,
    selectedGroup,
    previousGroup,
    selectedGroupKey,
    previousGroupKey: String(previousGroup?.key || ""),
    selectedLabel: formatAmendmentGroupLabel(selectedGroup, selectedIndex),
    previousLabel: previousGroup
      ? formatAmendmentGroupLabel(previousGroup, selectedIndex - 1)
      : "이전 그룹 없음",
  };
}

function normalizeClaimReferenceText(rawText) {
  let text = String(rawText || "");
  if (!text) return "";

  const replaceRefNumber = (matchText) => matchText.replace(/\d+/g, "<REF>");
  const referencePatterns = [
    /청구항\s*제?\s*\d+\s*항?/gi,
    /제\s*\d+\s*항/gi,
    /\d+\s*항/gi,
    /claim\s*\d+/gi,
    /claims?\s*\d+/gi,
  ];

  referencePatterns.forEach((pattern) => {
    text = text.replace(pattern, replaceRefNumber);
  });

  return text.replace(/\s+/g, " ").trim();
}

function normalizeClaimArrayFromEffectiveClaims(group) {
  if (!group || !(group.effectiveClaimsByKey instanceof Map)) {
    return [];
  }

  const keys = Array.from(
    group.effectiveClaimKeys?.length
      ? group.effectiveClaimKeys
      : group.effectiveClaimsByKey.keys()
  ).sort(compareClaimKeys);

  return keys
    .map((claimKey) => {
      const claimNo = String(claimKey || "").trim();
      const rawText = String(group.effectiveClaimsByKey.get(claimKey) || "").trim();
      if (!claimNo || !rawText) return null;
      return {
        claim_no: claimNo,
        raw_text: rawText,
        reference_normalized_text: normalizeClaimReferenceText(rawText),
      };
    })
    .filter(Boolean);
}

function buildClaimChangeAnalysisInput(selectedGroup, previousGroup) {
  return {
    previous_claims: normalizeClaimArrayFromEffectiveClaims(previousGroup),
    current_claims: normalizeClaimArrayFromEffectiveClaims(selectedGroup),
  };
}

function buildClaimChangePrompt(
  previousClaims,
  currentClaims,
  previousLabel,
  currentLabel
) {
  if (!state.prompts?.claimChanges) {
    throw new Error("청구항 보정 해석 프롬프트를 불러오지 못했습니다.");
  }

  const payload = JSON.stringify(
    {
      previous_claims: Array.isArray(previousClaims) ? previousClaims : [],
      current_claims: Array.isArray(currentClaims) ? currentClaims : [],
    },
    null,
    2
  );

  return applyTemplate(
    state.prompts.claimChanges,
    basePromptVariables({
      "{PREVIOUS_GROUP_LABEL}": String(previousLabel || "이전 그룹 없음"),
      "{CURRENT_GROUP_LABEL}": String(currentLabel || "현재 그룹"),
      "{CLAIM_CHANGE_INPUT_JSON}": payload,
    })
  );
}

function extractFirstJsonObjectText(rawText) {
  const cleaned = stripCodeFence(rawText);
  const start = cleaned.indexOf("{");
  if (start === -1) return "";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i += 1) {
    const ch = cleaned[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return cleaned.slice(start, i + 1).trim();
      }
    }
  }

  return cleaned.slice(start).trim();
}

function sanitizeClaimChangeStringArray(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const output = [];
  value.forEach((item) => {
    const text = String(item || "").trim();
    if (!text) return;
    if (seen.has(text)) return;
    seen.add(text);
    output.push(text);
  });
  return output;
}

function sanitizeClaimChangeTypes(value, allowedTypes = CLAIM_CHANGE_TYPES) {
  const allowedSet = new Set(allowedTypes);
  return sanitizeClaimChangeStringArray(value).filter((type) =>
    allowedSet.has(type)
  );
}

function sanitizeClaimChangeConfidence(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return CLAIM_CHANGE_CONFIDENCE_VALUES.has(normalized) ? normalized : "low";
}

function sanitizeClaimChangeSummary(summary, derivedSummary) {
  const pickCount = (key) => {
    const direct = parseNonNegativeInteger(summary?.[key]);
    if (direct !== null) return direct;
    return parseNonNegativeInteger(derivedSummary?.[key]) || 0;
  };

  return {
    claim_combination_count: pickCount("claim_combination_count"),
    reference_fix_count: pickCount("reference_fix_count"),
    claim_deletion_count: pickCount("claim_deletion_count"),
    new_content_addition_count: pickCount("new_content_addition_count"),
    claim_renumbering_count: pickCount("claim_renumbering_count"),
  };
}

function deriveClaimChangeSummary(currentResults, deletedResults) {
  const countByType = (items, type) =>
    items.filter((item) => item.change_types.includes(type)).length;

  return {
    claim_combination_count:
      countByType(currentResults, "claim_combination") +
      countByType(deletedResults, "claim_combination"),
    reference_fix_count: countByType(currentResults, "reference_fix"),
    claim_deletion_count:
      countByType(currentResults, "claim_deletion") +
      countByType(deletedResults, "claim_deletion"),
    new_content_addition_count: countByType(
      currentResults,
      "new_content_addition"
    ),
    claim_renumbering_count: countByType(currentResults, "claim_renumbering"),
  };
}

function sanitizeClaimChangeCurrentResult(item) {
  const renumberedRaw = item?.renumbered_from;
  const renumberedFrom =
    renumberedRaw === null || renumberedRaw === undefined
      ? null
      : String(renumberedRaw).trim() || null;

  const referenceFixDetails = Array.isArray(item?.reference_fix_details)
    ? item.reference_fix_details
        .map((detail) => ({
          before: String(detail?.before || "").trim(),
          after: String(detail?.after || "").trim(),
        }))
        .filter((detail) => detail.before || detail.after)
    : [];

  return {
    current_claim_no: String(item?.current_claim_no || "").trim(),
    matched_previous_claim_nos: sanitizeClaimChangeStringArray(
      item?.matched_previous_claim_nos
    ),
    change_types: sanitizeClaimChangeTypes(item?.change_types),
    is_substantively_same: Boolean(item?.is_substantively_same),
    summary: String(item?.summary || "").trim(),
    renumbered_from: renumberedFrom,
    merged_from_previous_claim_nos: sanitizeClaimChangeStringArray(
      item?.merged_from_previous_claim_nos
    ),
    reference_fix_details: referenceFixDetails,
    newly_added_fragments: sanitizeClaimChangeStringArray(
      item?.newly_added_fragments
    ),
    deleted_fragments: sanitizeClaimChangeStringArray(item?.deleted_fragments),
    confidence: sanitizeClaimChangeConfidence(item?.confidence),
  };
}

function sanitizeClaimChangeDeletedResult(item) {
  return {
    previous_claim_no: String(item?.previous_claim_no || "").trim(),
    change_types: sanitizeClaimChangeTypes(item?.change_types, [
      "claim_combination",
      "claim_deletion",
    ]),
    summary: String(item?.summary || "").trim(),
    merged_into_current_claim_no:
      item?.merged_into_current_claim_no === null ||
      item?.merged_into_current_claim_no === undefined
        ? null
        : String(item?.merged_into_current_claim_no || "").trim() || null,
    confidence: sanitizeClaimChangeConfidence(item?.confidence),
  };
}

function parseClaimChangeAnalysis(rawText) {
  const raw = String(rawText || "").trim();
  if (!raw) {
    throw new Error("AI 응답이 비어 있습니다.");
  }

  const extractedObject = extractFirstJsonObjectText(raw);
  if (!extractedObject) {
    throw new Error("AI 응답에서 JSON 객체를 찾지 못했습니다.");
  }

  let parsed = null;
  try {
    parsed = JSON.parse(extractedObject);
  } catch (_error) {
    throw new Error("AI 응답을 JSON으로 파싱하지 못했습니다.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI 응답 JSON이 객체 스키마가 아닙니다.");
  }

  const currentClaimResults = Array.isArray(parsed?.current_claim_results)
    ? parsed.current_claim_results.map(sanitizeClaimChangeCurrentResult)
    : [];
  const deletedPreviousClaimResults = Array.isArray(
    parsed?.deleted_previous_claim_results
  )
    ? parsed.deleted_previous_claim_results.map(sanitizeClaimChangeDeletedResult)
    : [];

  const derivedSummary = deriveClaimChangeSummary(
    currentClaimResults,
    deletedPreviousClaimResults
  );

  return {
    version_info: {
      previous_group: String(parsed?.version_info?.previous_group || "").trim(),
      current_group: String(parsed?.version_info?.current_group || "").trim(),
    },
    summary: sanitizeClaimChangeSummary(parsed?.summary, derivedSummary),
    current_claim_results: currentClaimResults,
    deleted_previous_claim_results: deletedPreviousClaimResults,
  };
}

function mapClaimChangeTypeLabel(type) {
  if (type === "claim_combination") return "병합";
  if (type === "reference_fix") return "인용항 정정";
  if (type === "claim_deletion") return "삭제";
  if (type === "new_content_addition") return "신규 추가";
  if (type === "claim_renumbering") return "번호 정정";
  return type;
}

function formatClaimNoListForDisplay(values) {
  if (!Array.isArray(values) || values.length === 0) return "-";
  return values.join(", ");
}

function toSingleLineText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function truncateText(value, maxLength = 80) {
  const text = toSingleLineText(value);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function resolveCurrentClaimRowKind(item) {
  const types = new Set(item.change_types || []);
  const hasMatchedPrevious =
    Array.isArray(item.matched_previous_claim_nos) &&
    item.matched_previous_claim_nos.length > 0;

  if (types.has("claim_combination")) {
    return { label: "병합", token: "merge" };
  }
  if (
    types.has("reference_fix") &&
    !types.has("new_content_addition") &&
    !types.has("claim_renumbering")
  ) {
    return { label: "인용항 정정", token: "reference_fix" };
  }
  if (
    types.has("claim_renumbering") &&
    !types.has("new_content_addition") &&
    !types.has("reference_fix")
  ) {
    return { label: "번호 정정", token: "renumbering" };
  }
  if (types.has("new_content_addition") && !hasMatchedPrevious) {
    return { label: "추가", token: "addition" };
  }
  if (
    types.has("new_content_addition") ||
    (item.deleted_fragments || []).length > 0
  ) {
    return { label: "변경", token: "change" };
  }
  if (types.has("reference_fix") || types.has("claim_renumbering")) {
    return { label: "변경", token: "change" };
  }
  if (item.is_substantively_same) {
    return { label: "유지", token: "same" };
  }

  return { label: "변경", token: "change" };
}

function resolveCurrentClaimBaselineNo(item, previousClaimsMap) {
  const renumberedFrom = String(item.renumbered_from || "").trim();
  if (renumberedFrom) return renumberedFrom;

  const matched = Array.isArray(item.matched_previous_claim_nos)
    ? item.matched_previous_claim_nos
    : [];
  if (matched.length > 0) {
    return String(matched[0] || "").trim();
  }

  const currentClaimNo = String(item.current_claim_no || "").trim();
  if (currentClaimNo && previousClaimsMap.has(currentClaimNo)) {
    return currentClaimNo;
  }
  return "";
}

function resolveCurrentClaimRelatedPreviousNos(item, baselineNo, previousClaimsMap) {
  const noSet = new Set();
  const pushNo = (value) => {
    const normalized = String(value || "").trim();
    if (!normalized) return;
    if (!previousClaimsMap.has(normalized)) return;
    noSet.add(normalized);
  };

  const hasCombination = Array.isArray(item?.change_types)
    ? item.change_types.includes("claim_combination")
    : false;
  if (!hasCombination) {
    return [];
  }

  pushNo(baselineNo);

  const mergedFrom = Array.isArray(item?.merged_from_previous_claim_nos)
    ? item.merged_from_previous_claim_nos
    : [];
  mergedFrom.forEach(pushNo);

  const matched = Array.isArray(item?.matched_previous_claim_nos)
    ? item.matched_previous_claim_nos
    : [];
  matched.forEach(pushNo);

  const currentClaimNo = String(item?.current_claim_no || "").trim();
  if (currentClaimNo) {
    pushNo(currentClaimNo);
  }

  return Array.from(noSet).sort(compareClaimKeys);
}

function buildCurrentClaimRowNote(item, kindLabel) {
  const currentClaimNo = String(item.current_claim_no || "").trim() || "-";

  if (kindLabel === "병합") {
    const mergedFrom = Array.isArray(item.merged_from_previous_claim_nos)
      ? item.merged_from_previous_claim_nos
      : [];
    const filteredMerged = mergedFrom
      .map((no) => String(no || "").trim())
      .filter(Boolean);
    if (filteredMerged.length > 0) {
      return `${currentClaimNo}에 ${filteredMerged.join(", ")} 병합`;
    }

    const matched = Array.isArray(item.matched_previous_claim_nos)
      ? item.matched_previous_claim_nos
      : [];
    const extra = matched
      .map((no) => String(no || "").trim())
      .filter((no) => no && no !== currentClaimNo);
    if (extra.length > 0) {
      return `${currentClaimNo}에 ${extra.join(", ")} 병합`;
    }
    return truncateText(item.summary || "병합", 70) || "병합";
  }

  if (kindLabel === "인용항 정정") {
    const detail = Array.isArray(item.reference_fix_details)
      ? item.reference_fix_details[0]
      : null;
    if (detail && (detail.before || detail.after)) {
      const beforeText = truncateText(detail.before || "-", 40) || "-";
      const afterText = truncateText(detail.after || "-", 40) || "-";
      return `인용항을 정정(${beforeText} -> ${afterText})`;
    }
    return "인용항을 정정";
  }

  if (kindLabel === "번호 정정") {
    const renumberedFrom = String(item.renumbered_from || "").trim();
    if (renumberedFrom) {
      return `번호 정정(${renumberedFrom} -> ${currentClaimNo})`;
    }
    return "번호만 정정";
  }

  if (kindLabel === "추가") {
    const added = Array.isArray(item.newly_added_fragments)
      ? item.newly_added_fragments[0]
      : "";
    if (added) {
      return `추가 내용: ${truncateText(added, 70)}`;
    }
    return "신규 내용 추가";
  }

  if (kindLabel === "변경") {
    const added = Array.isArray(item.newly_added_fragments)
      ? item.newly_added_fragments[0]
      : "";
    const removed = Array.isArray(item.deleted_fragments)
      ? item.deleted_fragments[0]
      : "";
    if (added && removed) {
      return `추가 내용: ${truncateText(added, 40)} / 삭제 내용: ${truncateText(
        removed,
        40
      )}`;
    }
    if (added) {
      return `추가 내용: ${truncateText(added, 70)}`;
    }
    if (removed) {
      return `삭제 내용: ${truncateText(removed, 70)}`;
    }
    return truncateText(item.summary || "변경", 70) || "변경";
  }

  if (kindLabel === "유지") {
    return "-";
  }

  return truncateText(item.summary || "-", 70) || "-";
}

function buildCurrentClaimDetail(item, context) {
  const previousClaimsMap =
    context?.previousGroup?.effectiveClaimsByKey instanceof Map
      ? context.previousGroup.effectiveClaimsByKey
      : new Map();
  const currentClaimsMap =
    context?.selectedGroup?.effectiveClaimsByKey instanceof Map
      ? context.selectedGroup.effectiveClaimsByKey
      : new Map();

  const currentClaimNo = String(item.current_claim_no || "").trim();
  const baselineNo = resolveCurrentClaimBaselineNo(item, previousClaimsMap);
  const relatedPreviousClaimNos = resolveCurrentClaimRelatedPreviousNos(
    item,
    baselineNo,
    previousClaimsMap
  );
  const relatedPreviousClaims = relatedPreviousClaimNos
    .map((claimNo) => ({
      claimNo,
      text: String(previousClaimsMap.get(claimNo) || "").trim(),
    }))
    .filter((item) => item.claimNo && item.text);

  return {
    title: `청구항 ${currentClaimNo || "-"} 수정보기`,
    meta: `비교 기준: 이전 ${baselineNo || "-"} -> 현재 ${currentClaimNo || "-"}`,
    beforeText: String(previousClaimsMap.get(baselineNo) || ""),
    afterText: String(currentClaimsMap.get(currentClaimNo) || ""),
    relatedPreviousClaims,
  };
}

function buildDeletedClaimDetail(item, context) {
  const previousClaimsMap =
    context?.previousGroup?.effectiveClaimsByKey instanceof Map
      ? context.previousGroup.effectiveClaimsByKey
      : new Map();
  const currentClaimsMap =
    context?.selectedGroup?.effectiveClaimsByKey instanceof Map
      ? context.selectedGroup.effectiveClaimsByKey
      : new Map();
  const previousClaimNo = String(item.previous_claim_no || "").trim();
  const mergedIntoNo = String(item.merged_into_current_claim_no || "").trim();

  return {
    title: `직전 청구항 ${previousClaimNo || "-"} 수정보기`,
    meta: mergedIntoNo
      ? `삭제/병합 기준: 이전 ${previousClaimNo || "-"} -> 현재 ${mergedIntoNo}`
      : `삭제 기준: 이전 ${previousClaimNo || "-"}`,
    beforeText: String(previousClaimsMap.get(previousClaimNo) || ""),
    afterText: mergedIntoNo ? String(currentClaimsMap.get(mergedIntoNo) || "") : "",
  };
}

function buildClaimChangeTableRows(result, context) {
  const rows = [];

  const currentResults = Array.isArray(result?.current_claim_results)
    ? result.current_claim_results
    : [];
  currentResults.forEach((item, index) => {
    const claimNo = String(item.current_claim_no || "").trim();
    if (!claimNo) return;

    const kind = resolveCurrentClaimRowKind(item);
    rows.push({
      claim_no: claimNo,
      kind_label: kind.label,
      kind_token: kind.token,
      note: buildCurrentClaimRowNote(item, kind.label),
      detail: buildCurrentClaimDetail(item, context),
      row_order: index,
    });
  });

  const deletedResults = Array.isArray(result?.deleted_previous_claim_results)
    ? result.deleted_previous_claim_results
    : [];
  deletedResults.forEach((item, index) => {
    const claimNo = String(item.previous_claim_no || "").trim();
    if (!claimNo) return;

    const mergedInto = String(item.merged_into_current_claim_no || "").trim();
    rows.push({
      claim_no: claimNo,
      kind_label: "삭제",
      kind_token: "deletion",
      note: mergedInto ? `${mergedInto}에 병합` : "-",
      detail: buildDeletedClaimDetail(item, context),
      row_order: currentResults.length + index,
    });
  });

  rows.sort((a, b) => {
    const claimCompare = compareClaimKeys(a.claim_no, b.claim_no);
    if (claimCompare !== 0) return claimCompare;
    return a.row_order - b.row_order;
  });

  return rows;
}

function createClaimChangeKindBadge(kindLabel, kindToken) {
  const badge = document.createElement("span");
  badge.className = "amendmentAnalysisKindChip";
  badge.dataset.kind = String(kindToken || "");
  badge.textContent = kindLabel;
  return badge;
}

function createClaimChangeNoteButton(note, detail) {
  const normalizedNote = String(note || "").trim() || "-";
  const hasDetail = Boolean(
    (detail?.beforeText && String(detail.beforeText).trim()) ||
      (detail?.afterText && String(detail.afterText).trim())
  );

  if (!hasDetail || normalizedNote === "-") {
    const text = document.createElement("span");
    text.className = "amendmentAnalysisNoteText";
    text.textContent = normalizedNote;
    return text;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "amendmentAnalysisNoteBtn";
  button.textContent = normalizedNote || "수정보기";
  button.addEventListener("click", () => {
    openAmendmentDetailModal(detail);
  });
  return button;
}

function renderClaimChangeTable(rows) {
  const wrap = document.createElement("div");
  wrap.className = "amendmentAnalysisTableWrap";

  const table = document.createElement("table");
  table.className = "amendmentAnalysisTable";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["청구항", "종류", "비고"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");

    const claimTd = document.createElement("td");
    claimTd.className = "amendmentAnalysisClaimCol";
    claimTd.textContent = row.claim_no;

    const kindTd = document.createElement("td");
    kindTd.className = "amendmentAnalysisKindCol";
    kindTd.appendChild(createClaimChangeKindBadge(row.kind_label, row.kind_token));

    const noteTd = document.createElement("td");
    noteTd.className = "amendmentAnalysisNoteCol";
    noteTd.appendChild(createClaimChangeNoteButton(row.note, row.detail));

    tr.append(claimTd, kindTd, noteTd);
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  wrap.appendChild(table);
  return wrap;
}

function renderClaimChangeSummary(summary) {
  if (!amendmentAnalysisSummaryEl) return;

  amendmentAnalysisSummaryEl.textContent = "";
  amendmentAnalysisSummaryEl.classList.remove("empty");

  const items = [
    ["병합", summary?.claim_combination_count || 0, "claim_combination"],
    ["인용항 정정", summary?.reference_fix_count || 0, "reference_fix"],
    ["삭제", summary?.claim_deletion_count || 0, "claim_deletion"],
    ["신규 추가", summary?.new_content_addition_count || 0, "new_content_addition"],
    ["번호 정정", summary?.claim_renumbering_count || 0, "claim_renumbering"],
  ];

  items.forEach(([label, count, type]) => {
    const chip = document.createElement("span");
    chip.className = "amendmentSummaryChip";
    chip.dataset.type = String(type);
    chip.textContent = `${label} ${count}건`;
    amendmentAnalysisSummaryEl.appendChild(chip);
  });
}

function renderClaimChangeAnalysis(context = null) {
  if (
    !amendmentAnalysisSummaryEl ||
    !amendmentAnalysisListEl ||
    !amendmentAnalysisRawEl ||
    !amendmentAnalysisErrorEl
  ) {
    return;
  }

  const resolvedContext = context || getSelectedAmendmentComparisonContext();
  const selectedGroupKey = String(resolvedContext?.selectedGroupKey || "");
  const previousGroupKey = String(resolvedContext?.previousGroupKey || "");
  const hasMatchingContext =
    Boolean(resolvedContext?.selectedGroup) &&
    Boolean(state.amendmentAnalysisContext) &&
    String(state.amendmentAnalysisContext.selectedGroupKey || "") ===
      selectedGroupKey &&
    String(state.amendmentAnalysisContext.previousGroupKey || "") ===
      previousGroupKey;

  const showError =
    hasMatchingContext && Boolean(String(state.amendmentAnalysisError || "").trim());
  amendmentAnalysisErrorEl.hidden = !showError;
  amendmentAnalysisErrorEl.textContent = showError
    ? `분석 오류: ${state.amendmentAnalysisError}`
    : "";

  if (state.amendmentAnalysisLoading) {
    amendmentAnalysisSummaryEl.textContent = "AI 분석 중입니다...";
    amendmentAnalysisSummaryEl.classList.add("empty");
    amendmentAnalysisListEl.textContent = "분석 완료 후 요약 표가 표시됩니다.";
    amendmentAnalysisListEl.classList.add("empty");
    amendmentAnalysisRawEl.textContent = "분석 중입니다...";
    amendmentAnalysisRawEl.classList.add("empty");
    return;
  }

  if (!resolvedContext?.selectedGroup) {
    amendmentAnalysisSummaryEl.textContent =
      "변동 이력을 불러오면 AI 해석 결과를 확인할 수 있습니다.";
    amendmentAnalysisSummaryEl.classList.add("empty");
    amendmentAnalysisListEl.textContent = "표시할 분석 결과가 없습니다.";
    amendmentAnalysisListEl.classList.add("empty");
    amendmentAnalysisRawEl.textContent = "아직 분석 원본 JSON이 없습니다.";
    amendmentAnalysisRawEl.classList.add("empty");
    return;
  }

  if (!hasMatchingContext || !state.amendmentAnalysisResult) {
    amendmentAnalysisSummaryEl.textContent =
      "선택된 Receipt Group 기준으로 Analyze Changes를 실행하세요.";
    amendmentAnalysisSummaryEl.classList.add("empty");
    amendmentAnalysisListEl.textContent = "아직 렌더링할 요약 표가 없습니다.";
    amendmentAnalysisListEl.classList.add("empty");
    amendmentAnalysisRawEl.textContent = hasMatchingContext && state.amendmentAnalysisRaw
      ? String(state.amendmentAnalysisRaw)
      : "현재 선택 그룹에 대한 분석 원본 JSON이 없습니다.";
    amendmentAnalysisRawEl.classList.toggle(
      "empty",
      !hasMatchingContext || !state.amendmentAnalysisRaw
    );
    return;
  }

  const result = state.amendmentAnalysisResult;
  renderClaimChangeSummary(result.summary);

  amendmentAnalysisListEl.textContent = "";
  amendmentAnalysisListEl.classList.remove("empty");

  const rows = buildClaimChangeTableRows(result, resolvedContext);
  if (rows.length === 0) {
    amendmentAnalysisListEl.textContent = "요약 표를 만들 수 있는 분석 결과가 없습니다.";
    amendmentAnalysisListEl.classList.add("empty");
  } else {
    amendmentAnalysisListEl.appendChild(renderClaimChangeTable(rows));
  }

  amendmentAnalysisRawEl.textContent = JSON.stringify(result, null, 2);
  amendmentAnalysisRawEl.classList.remove("empty");
}

async function analyzeClaimChangesForSelectedGroup() {
  if (!state.prompts?.claimChanges) {
    updateStatus("청구항 보정 해석 프롬프트를 불러오지 못했습니다.", true);
    return;
  }

  const context = getSelectedAmendmentComparisonContext();
  if (!context?.selectedGroup) {
    updateStatus("먼저 변동 이력과 Receipt Group을 확인해 주세요.", true);
    return;
  }

  const inputPayload = buildClaimChangeAnalysisInput(
    context.selectedGroup,
    context.previousGroup
  );
  const promptText = buildClaimChangePrompt(
    inputPayload.previous_claims,
    inputPayload.current_claims,
    context.previousLabel,
    context.selectedLabel
  );

  state.amendmentSelectedGroupKey = context.selectedGroupKey;
  state.amendmentAnalysisLoading = true;
  state.amendmentAnalysisResult = null;
  state.amendmentAnalysisRaw = "";
  state.amendmentAnalysisError = "";
  state.amendmentAnalysisContext = {
    selectedGroupKey: context.selectedGroupKey,
    previousGroupKey: context.previousGroupKey,
  };

  renderClaimChangeAnalysis(context);
  setPending(true);
  updateStatus("AI 청구항 보정 해석 분석 중...");

  let rawResponse = "";
  try {
    rawResponse = await requestModel(promptText, 0.1);
    state.amendmentAnalysisRaw = rawResponse;

    const parsed = parseClaimChangeAnalysis(rawResponse);
    if (!parsed.version_info.previous_group) {
      parsed.version_info.previous_group = context.previousLabel;
    }
    if (!parsed.version_info.current_group) {
      parsed.version_info.current_group = context.selectedLabel;
    }

    state.amendmentAnalysisResult = parsed;
    state.amendmentAnalysisError = "";
    updateStatus("완료: AI 청구항 보정 해석 결과를 생성했습니다.");
  } catch (error) {
    state.amendmentAnalysisResult = null;
    state.amendmentAnalysisRaw = rawResponse || state.amendmentAnalysisRaw;
    state.amendmentAnalysisError =
      error instanceof Error ? error.message : String(error || "분석 실패");
    updateStatus(`오류: ${state.amendmentAnalysisError}`, true);
  } finally {
    state.amendmentAnalysisLoading = false;
    setPending(false);
    renderClaimChangeAnalysis(context);
    queuePersistSession();
  }
}

function renderAmendmentGroupSelect(groups, selectedKey) {
  if (!amendmentGroupSelectEl) return;

  amendmentGroupSelectEl.textContent = "";
  if (!Array.isArray(groups) || groups.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No groups";
    amendmentGroupSelectEl.appendChild(option);
    amendmentGroupSelectEl.disabled = true;
    return;
  }

  groups.forEach((group, index) => {
    const option = document.createElement("option");
    option.value = group.key;
    option.textContent = formatAmendmentGroupLabel(group, index);
    amendmentGroupSelectEl.appendChild(option);
  });

  amendmentGroupSelectEl.value = selectedKey;
  amendmentGroupSelectEl.disabled = false;
}

function renderAmendmentViewModeSelect(viewMode) {
  if (!amendmentViewModeSelectEl) return;
  amendmentViewModeSelectEl.value = sanitizeAmendmentViewMode(viewMode);
}

function hasNonWhitespaceText(value) {
  return /\S/.test(String(value || ""));
}

function buildAmendmentViewContent(viewMode, beforeText, afterText) {
  const before = String(beforeText || "");
  const after = String(afterText || "");
  const mode = sanitizeAmendmentViewMode(viewMode);

  if (mode === AMENDMENT_VIEW_MODE_FINAL) {
    const html = escapeHtml(after);
    return {
      html,
      hasVisibleContent: hasNonWhitespaceText(after),
    };
  }

  if (before === after) {
    const html = escapeHtml(after);
    return {
      html,
      hasVisibleContent: hasNonWhitespaceText(after),
    };
  }

  const segments = buildTokenDiffSegments(before, after);
  const htmlParts = [];
  let rawVisibleText = "";

  for (const segment of segments) {
    const value = String(segment.value || "");
    if (!value) continue;

    if (mode === AMENDMENT_VIEW_MODE_MODIFIED) {
      if (segment.type === "add") {
        htmlParts.push(`<span class="amendAdded">${escapeHtml(value)}</span>`);
      } else if (segment.type === "remove") {
        htmlParts.push(`<span class="amendRemoved">${escapeHtml(value)}</span>`);
      } else {
        htmlParts.push(escapeHtml(value));
      }
      rawVisibleText += value;
      continue;
    }

    if (mode === AMENDMENT_VIEW_MODE_DELETED) {
      if (segment.type === "remove") {
        htmlParts.push(`<span class="amendRemoved">${escapeHtml(value)}</span>`);
        rawVisibleText += value;
        continue;
      }
      if (segment.type === "equal" || segment.type === "add") {
        htmlParts.push(escapeHtml(value));
        rawVisibleText += value;
      }
      continue;
    }

    if (mode === AMENDMENT_VIEW_MODE_ADDED) {
      if (segment.type === "add") {
        htmlParts.push(`<span class="amendAdded">${escapeHtml(value)}</span>`);
        rawVisibleText += value;
        continue;
      }
      if (segment.type === "equal") {
        htmlParts.push(escapeHtml(value));
        rawVisibleText += value;
      }
    }
  }

  const html = htmlParts.join("");
  return {
    html,
    hasVisibleContent: hasNonWhitespaceText(rawVisibleText),
  };
}

function renderAmendmentHistoryTab() {
  if (!amendmentHistoryMetaEl || !amendmentHistoryStatusEl || !amendmentHistoryListEl) {
    return;
  }

  const viewMode = sanitizeAmendmentViewMode(state.amendmentViewMode);
  state.amendmentViewMode = viewMode;
  renderAmendmentViewModeSelect(viewMode);
  renderClaimChangeAnalysis();

  const hasKiprisApiKey = Boolean(String(state.kiprisApiKey || "").trim());
  const currentApplicationNumber = resolveCurrentApplicationNumber();
  const loadedApplicationNumber = normalizeApplicationNumber(
    state.amendmentHistoryApplicationNumber || ""
  );
  const hasLoadedForCurrentApplication =
    Array.isArray(state.amendmentHistoryItems) &&
    loadedApplicationNumber &&
    loadedApplicationNumber === currentApplicationNumber;
  amendmentHistoryMetaEl.textContent = `Application No: ${currentApplicationNumber || "-"}`;

  if (!state.patentData) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      "Load a patent first, then fetch amendment history.";
    setAmendmentHistoryListEmpty(EMPTY_AMENDMENT_HISTORY);
    return;
  }

  if (!hasKiprisApiKey) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      "KIPRIS API Key is required for amendment history lookup.";
    setAmendmentHistoryListEmpty("Register KIPRIS API Key in settings.");
    return;
  }

  if (!currentApplicationNumber) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      "No application number available for the current patent.";
    setAmendmentHistoryListEmpty("Search by application number or load a patent with application number.");
    return;
  }

  if (!hasLoadedForCurrentApplication) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      `Ready to load amendment history for ${currentApplicationNumber}.`;
    setAmendmentHistoryListEmpty(EMPTY_AMENDMENT_HISTORY);
    return;
  }

  const items = sanitizeAmendmentHistoryItems(state.amendmentHistoryItems);
  state.amendmentHistoryItems = items;

  if (items.length === 0) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      `No amendment history found for ${loadedApplicationNumber}.`;
    setAmendmentHistoryListEmpty("No amendment records were returned.");
    return;
  }

  const groups = buildAmendmentReceiptGroups(items);
  if (groups.length === 0) {
    renderAmendmentGroupSelect([], "");
    amendmentHistoryStatusEl.textContent =
      `No receipt groups found for ${loadedApplicationNumber}.`;
    setAmendmentHistoryListEmpty("No comparable receipt groups were returned.");
    return;
  }

  let selectedGroupKey = normalizeAmendmentGroupKey(state.amendmentSelectedGroupKey);
  if (!groups.some((group) => group.key === selectedGroupKey)) {
    selectedGroupKey = groups[groups.length - 1].key;
  }
  state.amendmentSelectedGroupKey = selectedGroupKey;
  renderAmendmentGroupSelect(groups, selectedGroupKey);

  const selectedIndex = groups.findIndex((group) => group.key === selectedGroupKey);
  const selectedGroup = groups[selectedIndex];
  const previousGroup = selectedIndex > 0 ? groups[selectedIndex - 1] : null;
  if (!selectedGroup) {
    amendmentHistoryStatusEl.textContent = "Invalid receipt group selection.";
    setAmendmentHistoryListEmpty("Select a valid receipt group.");
    return;
  }

  const selectedLabel = formatAmendmentGroupLabel(selectedGroup, selectedIndex);
  const analysisContext = {
    selectedGroup,
    previousGroup,
    selectedGroupKey: selectedGroup.key,
    previousGroupKey: String(previousGroup?.key || ""),
    selectedLabel,
    previousLabel: previousGroup
      ? formatAmendmentGroupLabel(previousGroup, selectedIndex - 1)
      : "이전 그룹 없음",
  };
  const modeLabel =
    viewMode === AMENDMENT_VIEW_MODE_MODIFIED
      ? "수정 보기"
      : viewMode === AMENDMENT_VIEW_MODE_DELETED
        ? "삭제된 부분만 보기"
        : viewMode === AMENDMENT_VIEW_MODE_ADDED
          ? "추가된 부분만 보기"
          : "최종본만 보기";
  if (previousGroup) {
    const previousLabel = formatAmendmentGroupLabel(previousGroup, selectedIndex - 1);
    amendmentHistoryStatusEl.textContent =
      `Comparing ${selectedLabel} with previous group (${previousLabel}) [${modeLabel}]`;
  } else {
    amendmentHistoryStatusEl.textContent =
      `${selectedLabel} has no previous group. Comparison uses an empty baseline. [${modeLabel}]`;
  }

  renderClaimChangeAnalysis(analysisContext);

  amendmentHistoryListEl.textContent = "";
  amendmentHistoryListEl.classList.remove("empty");

  const claimKeys =
    viewMode === AMENDMENT_VIEW_MODE_FINAL ||
    viewMode === AMENDMENT_VIEW_MODE_ADDED
      ? Array.from(selectedGroup.effectiveClaimKeys || []).sort(compareClaimKeys)
      : Array.from(
          new Set([
            ...(selectedGroup.effectiveClaimKeys || []),
            ...(previousGroup?.effectiveClaimKeys || []),
          ])
        ).sort(compareClaimKeys);

  if (claimKeys.length === 0) {
    setAmendmentHistoryListEmpty("No comparable claim text in the selected group.");
    return;
  }

  claimKeys.forEach((claimKey, index) => {
    const beforeText = String(
      previousGroup?.effectiveClaimsByKey?.get(claimKey) || ""
    );
    const afterText = String(
      selectedGroup.effectiveClaimsByKey?.get(claimKey) || ""
    );
    const modeContent = buildAmendmentViewContent(viewMode, beforeText, afterText);
    if (!modeContent.hasVisibleContent) return;

    const isUnchanged = beforeText && afterText && beforeText === afterText;

    const card = document.createElement("article");
    card.className = "amendmentCard";

    const head = document.createElement("div");
    head.className = "amendmentCardHead";

    const title = document.createElement("h3");
    title.className = "amendmentCardTitle";
    title.textContent = formatClaimKeyLabel(claimKey, index);

    const indexLabel = document.createElement("span");
    indexLabel.className = "amendmentCardIndex";
    indexLabel.textContent = `Group Claim ${index + 1}`;
    head.append(title, indexLabel);

    const metaRow = document.createElement("div");
    metaRow.className = "amendmentMetaRow";
    appendAmendmentMetaChip(
      metaRow,
      `Current: ${selectedGroup.receiptSendNumber || selectedGroup.receiptSendSerialNumber || "-"}`
    );
    appendAmendmentMetaChip(
      metaRow,
      `Previous: ${previousGroup?.receiptSendNumber || previousGroup?.receiptSendSerialNumber || "-"}`
    );

    const diffWrap = document.createElement("div");
    diffWrap.className = "amendmentDiff";
    const diffPre = document.createElement("pre");
    diffPre.className = "amendmentDiffText";
    diffPre.innerHTML = modeContent.html;
    if (viewMode !== AMENDMENT_VIEW_MODE_FINAL && isUnchanged) {
      diffPre.classList.add("empty");
    }

    diffWrap.appendChild(diffPre);
    card.append(head);
    if (metaRow.childElementCount > 0) {
      card.append(metaRow);
    }
    card.append(diffWrap);
    amendmentHistoryListEl.appendChild(card);
  });

  if (amendmentHistoryListEl.childElementCount === 0) {
    let emptyByModeMessage = "선택한 그룹의 최종본 텍스트가 없습니다.";
    if (viewMode === AMENDMENT_VIEW_MODE_MODIFIED) {
      emptyByModeMessage = "선택한 그룹에서 수정 내용을 표시할 수 없습니다.";
    } else if (viewMode === AMENDMENT_VIEW_MODE_DELETED) {
      emptyByModeMessage = "선택한 그룹에서 삭제된 내용을 표시할 수 없습니다.";
    } else if (viewMode === AMENDMENT_VIEW_MODE_ADDED) {
      emptyByModeMessage = "선택한 그룹에서 추가된 내용을 표시할 수 없습니다.";
    }
    setAmendmentHistoryListEmpty(emptyByModeMessage);
    return;
  }

  if (amendmentHistoryListEl.childElementCount === 0) {
    const emptyByModeMessage =
      viewMode === AMENDMENT_VIEW_MODE_DELETED
        ? "선택한 그룹에서 삭제된 부분이 없습니다."
        : viewMode === AMENDMENT_VIEW_MODE_ADDED
          ? "선택한 그룹에서 추가된 부분이 없습니다."
          : "선택한 그룹의 최종본 텍스트가 없습니다.";
    setAmendmentHistoryListEmpty(emptyByModeMessage);
  }
}

function renderClaimsCards() {
  claimsCardsEl.textContent = "";
  renderClaimsCountText();
  const highlightGroups = sanitizeHighlightGroups(state.highlightGroups);

  if (state.claimItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "metaText";
    empty.textContent = EMPTY_CLAIMS;
    claimsCardsEl.appendChild(empty);
    updateControls();
    return;
  }

  state.claimItems.forEach((claimText, index) => {
    const card = document.createElement("article");
    card.className = "claimCard";

    const header = document.createElement("div");
    header.className = "claimHeader";

    const title = document.createElement("strong");
    title.textContent = `청구항 ${index + 1}`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "claimAnalyzeBtn";
    btn.dataset.index = String(index);
    btn.textContent = "구성분석";

    header.append(title, btn);

    const text = document.createElement("pre");
    text.className = "claimText";
    text.innerHTML = buildHighlightedHtml(claimText, highlightGroups);

    const analysisTitle = document.createElement("div");
    analysisTitle.className = "analysisTitle";
    analysisTitle.textContent = "구성분석 결과";

    const analysisView = document.createElement("div");
    analysisView.id = `claimAnalysis-${index}`;
    analysisView.className = "claimFeatureView";
    setClaimAnalysisView(analysisView, state.claimAnalyses[index]);

    card.append(header, text, analysisTitle, analysisView);
    claimsCardsEl.appendChild(card);
  });

  updateControls();
}

function clearPatentViews(options = {}) {
  const persist = options.persist !== false;
  state.summaryMarkdown = "";
  state.claimItems = [];
  state.claimAnalyses = {};
  state.highlightGroups = [];
  state.amendmentHistoryItems = null;
  state.amendmentHistoryApplicationNumber = "";
  state.amendmentSelectedGroupKey = "";
  state.amendmentAnalysisResult = null;
  state.amendmentAnalysisRaw = "";
  state.amendmentAnalysisError = "";
  state.amendmentAnalysisLoading = false;
  state.amendmentAnalysisContext = null;
  state.followupHistory = [];
  state.promptOutputs = createEmptyPromptOutputs();
  state.patentData = null;

  clearPatentMeta();
  setMarkdown(summaryMarkdownEl, "", EMPTY_SUMMARY);
  renderFollowupChat();
  renderHighlightMetaAndLegend();
  renderHighlightGroupsEditor();
  renderClaimsCards();
  renderDescriptionTab();
  renderAmendmentHistoryTab();
  renderPromptCards();

  if (persist) {
    queuePersistSession();
  }
}

function sanitizeFollowupHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .map((item) => ({
      role: item?.role === "user" ? "user" : "assistant",
      text: String(item?.text || "").trim(),
    }))
    .filter((item) => Boolean(item.text));
}

function sanitizeClaimAnalysesMap(source) {
  if (!source || typeof source !== "object") return {};
  const output = {};
  for (const [key, value] of Object.entries(source)) {
    const normalized = normalizeClaimAnalysis(value);
    if (normalized) {
      output[key] = normalized;
    }
  }
  return output;
}

function renderPatentViewsFromState() {
  if (state.patentData) {
    setPatentMeta(state.patentData);
  } else {
    clearPatentMeta();
  }

  setMarkdown(summaryMarkdownEl, state.summaryMarkdown, EMPTY_SUMMARY);
  renderFollowupChat();
  renderHighlightMetaAndLegend();
  renderHighlightGroupsEditor();
  renderClaimsCards();
  renderDescriptionTab();
  renderAmendmentHistoryTab();
  renderPromptCards();
}

function applyPersistedSession(session) {
  if (!session || typeof session !== "object") {
    return false;
  }

  state.activeTab = sanitizeTabName(session.activeTab);
  state.patentData =
    session.patentData && typeof session.patentData === "object"
      ? session.patentData
      : null;
  state.summaryMarkdown = String(session.summaryMarkdown || "");
  state.claimItems = Array.isArray(session.claimItems)
    ? session.claimItems
        .map((item) => String(item || ""))
        .map((item) => item.replace(/^\s*\d+\.\s+/, "").trim())
        .filter(Boolean)
    : splitClaims(state.patentData?.claims || "");
  state.claimAnalyses = sanitizeClaimAnalysesMap(session.claimAnalyses);
  state.highlightGroups = sanitizeHighlightGroups(session.highlightGroups, {
    keepEmpty: true,
  });
  state.amendmentHistoryItems = Array.isArray(session.amendmentHistoryItems)
    ? sanitizeAmendmentHistoryItems(session.amendmentHistoryItems)
    : null;
  state.amendmentHistoryApplicationNumber = normalizeApplicationNumber(
    session.amendmentHistoryApplicationNumber || ""
  );
  state.amendmentSelectedGroupKey = String(session.amendmentSelectedGroupKey || "");
  state.amendmentViewMode = sanitizeAmendmentViewMode(session.amendmentViewMode);
  try {
    state.amendmentAnalysisResult = session.amendmentAnalysisResult
      ? parseClaimChangeAnalysis(JSON.stringify(session.amendmentAnalysisResult))
      : null;
  } catch (_error) {
    state.amendmentAnalysisResult = null;
  }
  state.amendmentAnalysisRaw = String(session.amendmentAnalysisRaw || "");
  state.amendmentAnalysisError = String(session.amendmentAnalysisError || "");
  state.amendmentAnalysisLoading = false;
  state.amendmentAnalysisContext =
    session.amendmentAnalysisContext &&
    typeof session.amendmentAnalysisContext === "object"
      ? {
          selectedGroupKey: String(
            session.amendmentAnalysisContext.selectedGroupKey || ""
          ),
          previousGroupKey: String(
            session.amendmentAnalysisContext.previousGroupKey || ""
          ),
        }
      : null;
  state.followupHistory = sanitizeFollowupHistory(session.followupHistory);
  state.promptOutputs = {
    citationSearch: String(
      session?.promptOutputs?.citationSearch ||
        session?.promptOutputs?.comparePrompt ||
        session?.citationMarkdown ||
        ""
    ),
    inventiveStep: String(session?.promptOutputs?.inventiveStep || ""),
    evidenceFind: String(session?.promptOutputs?.evidenceFind || ""),
    citationFormat: String(
      session?.promptOutputs?.citationFormat ||
        session?.promptOutputs?.paperFormat ||
        ""
    ),
  };

  const promptOptions = session.promptOptions || session.citationOptions || {};
  const sourceMode =
    promptOptions.sourceMode === "description" ? "description" : "summary";
  citationSourceSummaryEl.checked = sourceMode === "summary";
  citationSourceDescriptionEl.checked = sourceMode === "description";
  citationCutoffDateInputEl.value = String(promptOptions.citationCutoffDate || "");
  inventiveStepCitationNumbersInputEl.value = String(
    promptOptions.inventiveStepCitationNumbers || ""
  );
  evidenceClaimNumberInputEl.value = String(promptOptions.evidenceClaimNumber || "");
  evidenceCitationNumbersInputEl.value = String(
    promptOptions.evidenceCitationNumbers || ""
  );
  citationFormatNumbersInputEl.value = String(
    promptOptions.citationFormatNumbers || ""
  );

  if (numberTypeSelectEl) {
    numberTypeSelectEl.value = sanitizeNumberType(session.numberType);
  }

  const savedInput = String(session.publicationInput || "").trim();
  if (savedInput) {
    publicationInputEl.value = savedInput;
  }

  syncNumberTypeSelectState();

  renderPatentViewsFromState();
  setActiveTab(state.activeTab, { persist: false });
  return true;
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
  const claimOne = state.claimItems[0] || "";

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

async function loadPromptTemplates() {
  const entries = await Promise.all(
    Object.entries(PROMPT_PATHS).map(async ([key, path]) => {
      const url = chrome.runtime.getURL(path);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`프롬프트 로드 실패: ${path}`);
      }
      const text = await response.text();
      return [key, text];
    })
  );

  state.prompts = Object.fromEntries(entries);
}

function parseModelText(responseJson) {
  const parts = responseJson?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part?.text ?? "")
    .filter(Boolean)
    .join("\n");
  return text.trim();
}

async function requestModel(promptText, temperature = 0.2) {
  const endpoint =
    `${API_BASE}/models/${encodeURIComponent(state.model)}:generateContent` +
    `?key=${encodeURIComponent(state.apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: { temperature },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const apiMessage = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(apiMessage);
  }

  const output = parseModelText(data);
  if (!output) {
    throw new Error("모델 응답 텍스트를 받지 못했습니다.");
  }
  return output;
}

async function collectPatentSections(inputNumber, numberType) {
  const result = await chrome.runtime.sendMessage({
    type: "collectPatentSections",
    inputNumber,
    numberType,
  });

  if (!result?.ok) {
    throw new Error(result?.error || "특허 데이터 수집에 실패했습니다.");
  }
  return result.data;
}

async function fetchAmendmentHistoryDetailInfo(applicationNumber) {
  const result = await chrome.runtime.sendMessage({
    type: "getAmendmentHistoryDetailInfo",
    applicationNumber,
  });

  if (!result?.ok) {
    throw new Error(result?.error || "Failed to load amendment history.");
  }

  return {
    applicationNumber: normalizeApplicationNumber(
      result?.data?.applicationNumber || applicationNumber
    ),
    items: sanitizeAmendmentHistoryItems(result?.data?.items || []),
  };
}

async function loadAmendmentHistoryForCurrentApplication() {
  if (!state.patentData) {
    updateStatus("특허를 먼저 조회해 주세요.", true);
    return;
  }

  const applicationNumber = resolveCurrentApplicationNumber();
  if (!applicationNumber) {
    updateStatus("출원번호가 없어 변동 이력을 조회할 수 없습니다.", true);
    return;
  }

  if (!String(state.kiprisApiKey || "").trim()) {
    updateStatus("KIPRIS API Key를 등록해야 변동 이력을 조회할 수 있습니다.", true);
    return;
  }

  setPending(true);
  updateStatus(`청구항 변동 이력 조회 중... (${applicationNumber})`);

  try {
    const { applicationNumber: resolvedApplicationNumber, items } =
      await fetchAmendmentHistoryDetailInfo(applicationNumber);
    state.amendmentHistoryApplicationNumber =
      resolvedApplicationNumber || applicationNumber;
    state.amendmentHistoryItems = items;
    state.amendmentSelectedGroupKey = "";
    state.amendmentAnalysisResult = null;
    state.amendmentAnalysisRaw = "";
    state.amendmentAnalysisError = "";
    state.amendmentAnalysisLoading = false;
    state.amendmentAnalysisContext = null;
    renderAmendmentHistoryTab();

    if (items.length === 0) {
      updateStatus("완료: 변동 이력이 없습니다.");
    } else {
      updateStatus(`완료: 변동 이력 ${items.length}건을 불러왔습니다.`);
    }
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function runPrimaryFlow(inputNumber, numberType) {
  setPending(true);
  updateStatus("특허 페이지에서 청구항/발명의 설명을 수집 중입니다...");

  if (numberType === NUMBER_TYPE_APPLICATION) {
    updateStatus("출원번호를 공개번호로 변환한 뒤 특허 페이지를 수집 중입니다...");
  }

  clearPatentViews();

  try {
    const patentData = await collectPatentSections(inputNumber, numberType);
    state.patentData = patentData;
    state.claimItems = splitClaims(patentData.claims);

    setPatentMeta(patentData);
    renderHighlightMetaAndLegend();
    renderHighlightGroupsEditor();
    renderClaimsCards();
    renderDescriptionTab();
    renderAmendmentHistoryTab();
    updateStatus("원문 로딩 완료: 요약 탭에서 '요약 생성' 버튼을 눌러주세요.");
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    updateControls();
    queuePersistSession();
  }
}

async function generateSummaryForCurrentPatent() {
  if (!state.patentData) {
    updateStatus("먼저 공개번호로 특허를 불러와 주세요.", true);
    return;
  }

  setPending(true);
  updateStatus("요약 생성 중입니다...");

  try {
    const summaryPrompt = applyTemplate(
      state.prompts.summary,
      basePromptVariables()
    );
    const summary = await requestModel(summaryPrompt, 0.2);
    state.summaryMarkdown = summary;
    state.followupHistory = [];
    renderFollowupChat();

    setMarkdown(summaryMarkdownEl, summary, EMPTY_SUMMARY);
    updateStatus("완료: 요약이 생성되었습니다.");
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function generateHighlightsForCurrentPatent() {
  if (!state.patentData) {
    updateStatus("먼저 공개번호로 특허를 불러와 주세요.", true);
    return;
  }
  if (!state.prompts?.highlightTerms) {
    updateStatus("하이라이트 프롬프트를 불러오지 못했습니다.", true);
    return;
  }
  if (state.claimItems.length === 0) {
    updateStatus("하이라이트를 위해 청구항이 필요합니다.", true);
    return;
  }

  const descriptionText = String(state.patentData?.description || "").trim();
  if (!descriptionText) {
    updateStatus("하이라이트를 위해 발명의 설명이 필요합니다.", true);
    return;
  }

  setPending(true);
  updateStatus("하이라이트 용어군 추출 중입니다...");

  try {
    const highlightPrompt = applyTemplate(
      state.prompts.highlightTerms,
      basePromptVariables({
        "{청구항}": buildClaimsForHighlightPrompt(),
        "{발명의 설명}": descriptionText,
      })
    );

    const responseText = await requestModel(highlightPrompt, 0.1);
    applyHighlightGroups(parseHighlightGroupsFromModel(responseText), {
      persist: false,
    });
    updateStatus("완료: 하이라이트 용어군을 생성했습니다.");
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function analyzeClaim(index) {
  if (!state.patentData || !state.claimItems[index]) return;

  setPending(true);
  updateStatus(`청구항 ${index + 1} 구성분석 중...`);

  try {
    const claimPrompt = applyTemplate(
      state.prompts.claimComponent,
      basePromptVariables({ "{청구항}": state.claimItems[index] })
    );
    const analysisText = await requestModel(claimPrompt, 0.1);
    state.claimAnalyses[index] = parseClaimAnalysis(analysisText);

    const target = document.getElementById(`claimAnalysis-${index}`);
    if (target) {
      setClaimAnalysisView(target, state.claimAnalyses[index]);
    }

    updateStatus(`완료: 청구항 ${index + 1} 구성분석`);
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function analyzeAllClaims() {
  if (!state.patentData || state.claimItems.length === 0) return;

  setPending(true);
  updateStatus("청구항 전체 구성분석을 시작합니다...");

  try {
    for (let i = 0; i < state.claimItems.length; i += 1) {
      updateStatus(`청구항 ${i + 1}/${state.claimItems.length} 분석 중...`);
      const claimPrompt = applyTemplate(
        state.prompts.claimComponent,
        basePromptVariables({ "{청구항}": state.claimItems[i] })
      );
      const analysisText = await requestModel(claimPrompt, 0.1);
      state.claimAnalyses[i] = parseClaimAnalysis(analysisText);

      const target = document.getElementById(`claimAnalysis-${i}`);
      if (target) {
        setClaimAnalysisView(target, state.claimAnalyses[i]);
      }
    }

    updateStatus("완료: 청구항 전체 구성분석");
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function runFollowupQuestion(question) {
  if (!state.patentData || !state.summaryMarkdown) return;

  const historyText = state.followupHistory
    .map((item) => `${item.role === "user" ? "사용자" : "어시스턴트"}: ${item.text}`)
    .join("\n\n");

  appendFollowupMessage("user", question, false);
  state.followupHistory.push({ role: "user", text: question });
  queuePersistSession();

  setPending(true);
  updateStatus("추가 질문 응답 생성 중...");

  try {
    const followupPrompt = applyTemplate(
      state.prompts.followup,
      basePromptVariables({
        "{질문}": question,
        "{대화기록}": historyText,
      })
    );
    const answer = await requestModel(followupPrompt, 0.25);
    state.followupHistory.push({ role: "assistant", text: answer });
    appendFollowupMessage("assistant", answer, true);
    updateStatus("완료: 추가 질문 응답 생성");
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return fallbackCopyText(text);
}

function getClaimOneText() {
  if (state.claimItems.length > 0) {
    return state.claimItems[0];
  }
  const fallbackClaims = splitClaims(state.patentData?.claims || "");
  return fallbackClaims[0] || "";
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
      throw new Error("요약이 없습니다. 요약 탭에서 먼저 요약을 생성해 주세요.");
    }
    throw new Error("발명의 설명을 찾지 못했습니다.");
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

function resolveSelectedClaim(claimNumberText) {
  const numberValue = Number(claimNumberText);
  if (!Number.isInteger(numberValue) || numberValue < 1) {
    throw new Error("청구항 번호는 1 이상의 정수여야 합니다.");
  }

  const claimList =
    state.claimItems.length > 0
      ? state.claimItems
      : splitClaims(state.patentData?.claims || "");
  const claimText = claimList[numberValue - 1] || "";
  if (!claimText) {
    throw new Error(`청구항 ${numberValue}을(를) 찾지 못했습니다.`);
  }

  return {
    claimNumber: numberValue,
    claimText,
  };
}

function buildPromptGenerationSpec(kind) {
  const context = getPromptSourceContext();
  const baseReplacements = {
    "{청구항1}": context.claimOne,
    "{청구항}": context.claimOne,
    "{발명의 요약}": context.sourceMode === "summary" ? context.sourceText : "",
    "{발명의 설명}":
      context.sourceMode === "description" ? context.sourceText : "",
    "{검색기반유형}": context.sourceLabel,
    "{검색기반}": context.sourceText,
  };

  if (kind === "citationSearch") {
    const cutoffDate = requireCutoffDate(citationCutoffDateInputEl.value);
    return {
      templateKey: "citationSearch",
      outputTitle: PROMPT_CARD_INFO.citationSearch.title,
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
      outputTitle: PROMPT_CARD_INFO.inventiveStep.title,
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
      outputTitle: PROMPT_CARD_INFO.evidenceFind.title,
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
      outputTitle: PROMPT_CARD_INFO.citationFormat.title,
      replacements: {
        ...baseReplacements,
        "{선택인용발명번호}": selectedCitationNumbers,
      },
    };
  }

  throw new Error("알 수 없는 프롬프트 종류입니다.");
}

async function generatePromptAndCopy(kind) {
  if (!state.patentData) return;

  setPending(true);
  updateStatus("프롬프트 생성 중...");

  try {
    const spec = buildPromptGenerationSpec(kind);

    const promptText = applyTemplate(
      state.prompts[spec.templateKey],
      basePromptVariables(spec.replacements)
    );

    await copyTextToClipboard(promptText);

    state.promptOutputs[kind] = promptText;
    renderPromptCards();
    updateStatus("프롬프트를 클립보드에 복사했습니다.");

    openPromptModal(spec.outputTitle, promptText, kind);
  } catch (error) {
    updateStatus(`오류: ${error.message}`, true);
  } finally {
    setPending(false);
    queuePersistSession();
  }
}

async function loadSettings() {
  const { apiKey = "", kiprisApiKey = "", model = DEFAULT_MODEL } =
    await chrome.storage.sync.get([
      "apiKey",
      "kiprisApiKey",
      "model",
    ]);
  state.apiKey = apiKey;
  state.kiprisApiKey = kiprisApiKey;
  state.model = model || DEFAULT_MODEL;
  syncNumberTypeSelectState();
  updateHeader();
}

for (const tabButton of tabButtons) {
  tabButton.addEventListener("click", () => {
    setActiveTab(tabButton.dataset.tab);
  });
}

patentFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.pending) return;

  const numberType = getSelectedNumberType();
  const hasKiprisApiKey = Boolean(String(state.kiprisApiKey || "").trim());

  if (numberType === NUMBER_TYPE_APPLICATION && !hasKiprisApiKey) {
    updateStatus("출원번호 조회에는 KIPRIS API Key가 필요합니다.", true);
    return;
  }

  const normalizedInput =
    numberType === NUMBER_TYPE_APPLICATION
      ? normalizeApplicationNumber(publicationInputEl.value)
      : normalizePublicationNumber(publicationInputEl.value);
  if (!normalizedInput) {
    if (numberType === NUMBER_TYPE_APPLICATION) {
      updateStatus("유효한 출원번호를 입력해 주세요.", true);
      return;
    }
    updateStatus("유효한 공개번호를 입력해 주세요.", true);
    return;
  }

  runPrimaryFlow(normalizedInput, numberType);
});

generateSummaryBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generateSummaryForCurrentPatent();
});

followupFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.pending) return;

  const question = followupInputEl.value.trim();
  if (!question) return;
  followupInputEl.value = "";
  runFollowupQuestion(question);
});

analyzeAllClaimsBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  analyzeAllClaims();
});

generateHighlightsBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generateHighlightsForCurrentPatent();
});

openHighlightEditorBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  openHighlightEditorModal();
});

if (loadAmendmentHistoryBtnEl) {
  loadAmendmentHistoryBtnEl.addEventListener("click", () => {
    if (state.pending) return;
    loadAmendmentHistoryForCurrentApplication();
  });
}

if (analyzeClaimChangesBtnEl) {
  analyzeClaimChangesBtnEl.addEventListener("click", () => {
    if (state.pending) return;
    analyzeClaimChangesForSelectedGroup();
  });
}

if (amendmentGroupSelectEl) {
  amendmentGroupSelectEl.addEventListener("change", () => {
    state.amendmentSelectedGroupKey = String(amendmentGroupSelectEl.value || "");
    renderAmendmentHistoryTab();
    queuePersistSession();
  });
}

if (amendmentViewModeSelectEl) {
  amendmentViewModeSelectEl.addEventListener("change", () => {
    state.amendmentViewMode = sanitizeAmendmentViewMode(
      amendmentViewModeSelectEl.value
    );
    renderAmendmentHistoryTab();
    queuePersistSession();
  });
}

claimsCardsEl.addEventListener("click", (event) => {
  const button = event.target.closest(".claimAnalyzeBtn");
  if (!button || state.pending) return;
  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;
  analyzeClaim(index);
});

addHighlightGroupBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  addHighlightGroup();
});

highlightGroupsEditorEl.addEventListener("change", (event) => {
  if (state.pending) return;
  handleHighlightEditorChange(event);
});

highlightGroupsEditorEl.addEventListener("click", (event) => {
  if (state.pending) return;
  handleHighlightEditorClick(event);
});

generateCitationSearchPromptBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generatePromptAndCopy("citationSearch");
});

generateInventiveStepPromptBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generatePromptAndCopy("inventiveStep");
});

generateEvidencePromptBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generatePromptAndCopy("evidenceFind");
});

generateCitationFormatPromptBtnEl.addEventListener("click", () => {
  if (state.pending) return;
  generatePromptAndCopy("citationFormat");
});

for (const [key, info] of Object.entries(PROMPT_CARD_INFO)) {
  info.previewEl.addEventListener("click", () => {
    openPromptModal(info.title, state.promptOutputs[key], key);
  });

  info.previewEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      info.previewEl.click();
    }
  });
}

citationSourceSummaryEl.addEventListener("change", () => {
  updateControls();
  queuePersistSession();
});

citationSourceDescriptionEl.addEventListener("change", () => {
  updateControls();
  queuePersistSession();
});

citationCutoffDateInputEl.addEventListener("input", () => {
  updateControls();
  queuePersistSession();
});

inventiveStepCitationNumbersInputEl.addEventListener("input", () => {
  updateControls();
  queuePersistSession();
});

evidenceClaimNumberInputEl.addEventListener("input", () => {
  updateControls();
  queuePersistSession();
});

evidenceCitationNumbersInputEl.addEventListener("input", () => {
  updateControls();
  queuePersistSession();
});

citationFormatNumbersInputEl.addEventListener("input", () => {
  updateControls();
  queuePersistSession();
});

publicationInputEl.addEventListener("input", () => {
  renderAmendmentHistoryTab();
  updateControls();
  queuePersistSession();
});

numberTypeSelectEl.addEventListener("change", () => {
  renderAmendmentHistoryTab();
  updateControls();
  queuePersistSession();
});

closePromptModalBtnEl.addEventListener("click", () => {
  closePromptModal();
});

closeHighlightEditorBtnEl.addEventListener("click", () => {
  closeHighlightEditorModal();
});

if (closeAmendmentDetailModalBtnEl) {
  closeAmendmentDetailModalBtnEl.addEventListener("click", () => {
    closeAmendmentDetailModal();
  });
}

copyPromptModalBtnEl.addEventListener("click", () => {
  if (!promptModalState.text) return;
  copyTextToClipboard(promptModalState.text)
    .then(() => {
      updateStatus("프롬프트를 클립보드에 복사했습니다.");
    })
    .catch((error) => {
      updateStatus(`오류: ${error.message}`, true);
    });
});

openSettingsBtnEl.addEventListener("click", () => {
  openSettingsModal();
});

closeSettingsBtnEl.addEventListener("click", () => {
  closeSettingsModal();
});

loadSettingsModelsBtnEl.addEventListener("click", () => {
  refreshSettingsModelList(settingsModelSelectEl.value || state.model || DEFAULT_MODEL);
});

saveSettingsBtnEl.addEventListener("click", () => {
  saveSettingsFromModal().catch((error) => {
    showSettingsStatus(`저장 실패: ${error.message}`, true);
  });
});

clearSettingsApiKeyBtnEl.addEventListener("click", () => {
  clearApiKeyFromModal().catch((error) => {
    showSettingsStatus(`삭제 실패: ${error.message}`, true);
  });
});

settingsModalEl.addEventListener("click", (event) => {
  if (event.target === settingsModalEl) {
    closeSettingsModal();
  }
});

promptModalEl.addEventListener("click", (event) => {
  if (event.target === promptModalEl) {
    closePromptModal();
  }
});

highlightEditorModalEl.addEventListener("click", (event) => {
  if (event.target === highlightEditorModalEl) {
    closeHighlightEditorModal();
  }
});

if (amendmentDetailModalEl) {
  amendmentDetailModalEl.addEventListener("click", (event) => {
    if (event.target === amendmentDetailModalEl) {
      closeAmendmentDetailModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!settingsModalEl.classList.contains("hidden")) {
    closeSettingsModal();
    return;
  }
  if (!highlightEditorModalEl.classList.contains("hidden")) {
    closeHighlightEditorModal();
    return;
  }
  if (amendmentDetailModalEl && !amendmentDetailModalEl.classList.contains("hidden")) {
    closeAmendmentDetailModal();
    return;
  }
  if (!promptModalEl.classList.contains("hidden")) {
    closePromptModal();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;
  if (changes.apiKey) {
    state.apiKey = changes.apiKey.newValue ?? "";
  }
  if (changes.kiprisApiKey) {
    state.kiprisApiKey = changes.kiprisApiKey.newValue ?? "";
  }
  if (changes.model) {
    state.model = changes.model.newValue || DEFAULT_MODEL;
    updateHeader();
  }
  if (!settingsModalEl.classList.contains("hidden")) {
    settingsApiKeyInputEl.value = state.apiKey || "";
    settingsKiprisApiKeyInputEl.value = state.kiprisApiKey || "";
    renderSettingsModelOptions(state.model || DEFAULT_MODEL);
  }
  renderAmendmentHistoryTab();
  updateControls();
});

Promise.all([loadSettings(), loadPromptTemplates(), loadPersistedSession()])
  .then(([, , persistedSession]) => {
    const restored = applyPersistedSession(persistedSession);
    if (!restored) {
      clearPatentViews({ persist: false });
      setActiveTab("summary", { persist: false });
      updateStatus("공개번호를 입력하면 탭별 분석 결과가 생성됩니다.");
    } else {
      updateStatus("저장된 작업을 복원했습니다.");
    }

    updateControls();
    publicationInputEl.focus();
  })
  .catch((error) => {
    updateStatus(`초기화 실패: ${error.message}`, true);
    updateControls();
  });
