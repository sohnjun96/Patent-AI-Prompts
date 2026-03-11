const modelInfoEl = document.getElementById("modelInfo");
const keyNoticeEl = document.getElementById("keyNotice");
const patentFormEl = document.getElementById("patentForm");
const publicationInputEl = document.getElementById("publicationInput");
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
const highlightMetaEl = document.getElementById("highlightMeta");
const highlightLegendEl = document.getElementById("highlightLegend");
const highlightGroupsEditorEl = document.getElementById("highlightGroupsEditor");
const addHighlightGroupBtnEl = document.getElementById("addHighlightGroupBtn");

const descriptionClaimsColumnEl = document.getElementById("descriptionClaimsColumn");
const descriptionRawEl = document.getElementById("descriptionRaw");

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

const settingsModalEl = document.getElementById("settingsModal");
const closeSettingsBtnEl = document.getElementById("closeSettingsBtn");
const settingsApiKeyInputEl = document.getElementById("settingsApiKeyInput");
const settingsModelSelectEl = document.getElementById("settingsModelSelect");
const loadSettingsModelsBtnEl = document.getElementById("loadSettingsModelsBtn");
const saveSettingsBtnEl = document.getElementById("saveSettingsBtn");
const clearSettingsApiKeyBtnEl = document.getElementById("clearSettingsApiKeyBtn");
const settingsStatusEl = document.getElementById("settingsStatus");

const DEFAULT_MODEL = "gemini-2.0-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const EMPTY_SUMMARY = "아직 생성된 요약이 없습니다.";
const EMPTY_CLAIMS = "아직 청구항이 없습니다.";
const EMPTY_DESCRIPTION = "아직 발명의 설명이 없습니다.";
const EMPTY_PROMPT_PREVIEW = "아직 생성된 프롬프트가 없습니다.";
const SESSION_STORAGE_KEY = "patentWorkbenchSessionV1";

const PROMPT_PATHS = {
  summary: "prompts/summary.txt",
  followup: "prompts/followup_chat.txt",
  claimComponent: "prompts/claim_component.txt",
  highlightTerms: "prompts/highlight_terms.txt",
  citationSearch: "prompts/citation_search.txt",
  inventiveStep: "prompts/inventive_step_review.txt",
  evidenceFind: "prompts/evidence_find.txt",
  citationFormat: "prompts/paper_citation_format.txt",
};

const state = {
  apiKey: "",
  model: DEFAULT_MODEL,
  pending: false,
  activeTab: "summary",
  prompts: null,
  patentData: null,
  summaryMarkdown: "",
  claimItems: [],
  claimAnalyses: {},
  highlightGroups: [],
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
  const model = settingsModelSelectEl.value || DEFAULT_MODEL;

  if (!apiKey) {
    showSettingsStatus("API Key를 입력해 주세요.", true);
    return;
  }

  await chrome.storage.sync.set({ apiKey, model });
  state.apiKey = apiKey;
  state.model = model;
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
  const hasKey = Boolean(state.apiKey);
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

  keyNoticeEl.classList.toggle("hidden", hasKey);

  publicationInputEl.disabled = !canStart;
  summarizeBtnEl.disabled = !canStart;
  generateSummaryBtnEl.disabled = !canGenerateSummary;

  followupInputEl.disabled = !(canInteract && hasSummary);
  followupSendBtnEl.disabled = !(canInteract && hasSummary);

  analyzeAllClaimsBtnEl.disabled = !(canInteract && state.claimItems.length > 0);
  generateHighlightsBtnEl.disabled = !canGenerateHighlights;
  addHighlightGroupBtnEl.disabled = !canEditHighlights;
  generateCitationSearchPromptBtnEl.disabled = !(canPromptInteract && hasCutoffDate);
  generateInventiveStepPromptBtnEl.disabled =
    !(canPromptInteract && hasInventiveCitationNumbers);
  generateEvidencePromptBtnEl.disabled =
    !(canPromptInteract && hasEvidenceClaimNumber && hasEvidenceCitationNumbers);
  generateCitationFormatPromptBtnEl.disabled =
    !(canPromptInteract && hasCitationFormatNumbers);

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
  return String(value || "")
    .toUpperCase()
    .trim()
    .replace(/^KR/, "")
    .replace(/A$/, "")
    .replace(/[^0-9A-Z]/g, "");
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

  const savedInput = String(session.publicationInput || "").trim();
  if (savedInput) {
    publicationInputEl.value = savedInput;
  }

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

async function collectPatentSections(publicationNumber) {
  const result = await chrome.runtime.sendMessage({
    type: "collectPatentSections",
    publicationNumber,
  });

  if (!result?.ok) {
    throw new Error(result?.error || "특허 데이터 수집에 실패했습니다.");
  }
  return result.data;
}

async function runPrimaryFlow(publicationNumber) {
  setPending(true);
  updateStatus("특허 페이지에서 청구항/발명의 설명을 수집 중입니다...");

  clearPatentViews();

  try {
    const patentData = await collectPatentSections(publicationNumber);
    state.patentData = patentData;
    state.claimItems = splitClaims(patentData.claims);

    setPatentMeta(patentData);
    renderHighlightMetaAndLegend();
    renderHighlightGroupsEditor();
    renderClaimsCards();
    renderDescriptionTab();
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
  const { apiKey = "", model = DEFAULT_MODEL } = await chrome.storage.sync.get([
    "apiKey",
    "model",
  ]);
  state.apiKey = apiKey;
  state.model = model || DEFAULT_MODEL;
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

  const publicationNumber = normalizePublicationNumber(publicationInputEl.value);
  if (!publicationNumber) {
    updateStatus("유효한 공개번호를 입력해 주세요.", true);
    return;
  }

  runPrimaryFlow(publicationNumber);
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
  queuePersistSession();
});

closePromptModalBtnEl.addEventListener("click", () => {
  closePromptModal();
});

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

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!settingsModalEl.classList.contains("hidden")) {
    closeSettingsModal();
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
  if (changes.model) {
    state.model = changes.model.newValue || DEFAULT_MODEL;
    updateHeader();
  }
  if (!settingsModalEl.classList.contains("hidden")) {
    settingsApiKeyInputEl.value = state.apiKey || "";
    renderSettingsModelOptions(state.model || DEFAULT_MODEL);
  }
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
