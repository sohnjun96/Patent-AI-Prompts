const PATENT_WAIT_MS = 40_000;
const EXTRACTION_WAIT_MS = 35_000;
const SECTION_CHAR_LIMIT = 22_000;
const CLAIM_STABILIZE_MS = 600;
const EXTRACTION_MAX_ATTEMPTS = 2;
const CHATGPT_PROMPT_SELECTOR = "#prompt-textarea";
const CHATGPT_SUBMIT_SELECTOR = "#composer-submit-button";

chrome.action.onClicked.addListener((tab) => {
  if (isChatGptTab(tab)) {
    openSidePanelFromAction(tab, (opened) => {
      if (!opened) {
        openFullPageApp();
      }
    });
    return;
  }

  if (tab?.id) {
    getTab(tab.id)
      .then((freshTab) => {
        if (isChatGptTab(freshTab)) {
          openSidePanelFromAction(freshTab, (opened) => {
            if (!opened) {
              openFullPageApp();
            }
          });
          return;
        }
        openFullPageApp();
      })
      .catch(() => {
        openFullPageApp();
      });
    return;
  }

  queryActiveTab()
    .then((activeTab) => {
      if (isChatGptTab(activeTab)) {
        openSidePanelFromAction(activeTab, (opened) => {
          if (!opened) {
            openFullPageApp();
          }
        });
        return;
      }
      openFullPageApp();
    })
    .catch(() => {
      openFullPageApp();
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "collectPatentSections") {
    (async () => {
      try {
        const data = await collectPatentSections(
          message.publicationNumber,
          sender?.tab?.id ?? null
        );
        sendResponse({ ok: true, data });
      } catch (error) {
        sendResponse({ ok: false, error: error.message });
      }
    })();
    return true;
  }

  if (message?.type === "sendPromptToChatGpt") {
    (async () => {
      try {
        const promptText = String(message.promptText || "").trim();
        if (!promptText) {
          throw new Error("전송할 프롬프트가 비어 있습니다.");
        }

        const targetTab = await resolveChatGptTab(message.tabId);
        if (!targetTab?.id) {
          throw new Error("ChatGPT 탭을 찾지 못했습니다.");
        }

        const injected = await runScriptInTab(
          targetTab.id,
          injectPromptIntoChatGpt,
          [promptText, CHATGPT_PROMPT_SELECTOR, CHATGPT_SUBMIT_SELECTOR]
        );

        if (!injected?.ok) {
          throw new Error(injected?.error || "ChatGPT 입력/전송에 실패했습니다.");
        }

        sendResponse({ ok: true, tabId: targetTab.id });
      } catch (error) {
        sendResponse({ ok: false, error: error.message });
      }
    })();
    return true;
  }
});

function openFullPageApp() {
  chrome.tabs.create({ url: chrome.runtime.getURL("chat.html") });
}

function isChatGptUrl(url) {
  return /^https:\/\/(chatgpt\.com|chat\.openai\.com)(\/|$)/i.test(
    String(url || "")
  );
}

function isChatGptTab(tab) {
  return (
    isChatGptUrl(tab?.url) ||
    isChatGptUrl(tab?.pendingUrl) ||
    /chatgpt/i.test(String(tab?.title || ""))
  );
}

function getTab(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(tab || null);
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

async function resolveChatGptTab(preferredTabId) {
  const preferredId = Number(preferredTabId);
  if (Number.isInteger(preferredId) && preferredId > 0) {
    const tab = await getTab(preferredId).catch(() => null);
    if (tab?.id && isChatGptTab(tab)) {
      return tab;
    }
  }

  const activeTab = await queryActiveTab();
  if (activeTab?.id && isChatGptTab(activeTab)) {
    return activeTab;
  }

  throw new Error(
    "ChatGPT 탭을 활성화한 뒤 다시 시도해 주세요. (https://chatgpt.com)"
  );
}

function runScriptInTab(tabId, func, args = []) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func,
        args,
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(results?.[0]?.result);
      }
    );
  });
}

async function openSidePanelForTab(tabId) {
  if (!chrome.sidePanel?.setOptions || !chrome.sidePanel?.open) {
    throw new Error("현재 브라우저에서 side panel API를 지원하지 않습니다.");
  }

  const tab = await getTab(tabId).catch(() => null);

  await chrome.sidePanel.setOptions({
    tabId,
    enabled: true,
    path: "sidepanel.html",
  });

  try {
    await chrome.sidePanel.open({ tabId });
  } catch (error) {
    if (!tab?.windowId) throw error;
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
}

function openSidePanelFromAction(tab, onDone) {
  let done = false;
  const finish = (ok) => {
    if (done) return;
    done = true;
    onDone(Boolean(ok));
  };

  if (!chrome.sidePanel?.open) {
    finish(false);
    return;
  }

  const openWithWindow = () => {
    if (!tab?.windowId && !tab?.id) {
      finish(false);
      return;
    }

    const tryOpenByTab = () => {
      if (!tab?.id) {
        finish(false);
        return;
      }
      chrome.sidePanel.open({ tabId: tab.id }, () => {
        if (!chrome.runtime.lastError) {
          finish(true);
          return;
        }
        console.warn("Failed to open side panel by tabId:", chrome.runtime.lastError);
        finish(false);
      });
    };

    if (tab?.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId }, () => {
        if (!chrome.runtime.lastError) {
          finish(true);
          return;
        }
        console.warn(
          "Failed to open side panel by windowId:",
          chrome.runtime.lastError
        );
        tryOpenByTab();
      });
      return;
    }

    tryOpenByTab();
  };

  if (chrome.sidePanel.setOptions && tab?.id) {
    chrome.sidePanel.setOptions(
      {
        tabId: tab.id,
        enabled: true,
        path: "sidepanel.html",
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn("Failed to set side panel options:", chrome.runtime.lastError);
        }
        openWithWindow();
      }
    );
    return;
  }

  openWithWindow();
}

function normalizePublicationNumber(value) {
  const normalized = String(value || "")
    .toUpperCase()
    .trim()
    .replace(/^KR/, "")
    .replace(/A$/, "")
    .replace(/[^0-9A-Z]/g, "");

  if (!normalized) {
    throw new Error("유효한 공개번호를 입력해 주세요.");
  }

  return normalized;
}

function buildPatentUrl(publicationNumber) {
  const normalized = normalizePublicationNumber(publicationNumber);
  return {
    normalized,
    url: `https://patents.google.com/patent/KR${normalized}A/`,
  };
}

function createFocusedTab(url) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url, active: true }, (tab) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!tab?.id) {
        reject(new Error("특허 탭 생성에 실패했습니다."));
        return;
      }
      resolve(tab.id);
    });
  });
}

function waitForTabComplete(tabId, timeoutMs) {
  return new Promise((resolve, reject) => {
    let done = false;
    let timerId = null;

    const finish = (error) => {
      if (done) return;
      done = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      if (timerId) clearTimeout(timerId);
      if (error) reject(error);
      else resolve();
    };

    const onUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId !== tabId) return;
      if (changeInfo.status === "complete") {
        finish();
      }
    };

    timerId = setTimeout(() => {
      finish(new Error("특허 페이지 로딩 시간 초과"));
    }, timeoutMs);

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        finish(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (tab?.status === "complete") finish();
    });
  });
}

function closeTabQuietly(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.remove(tabId, () => {
      resolve();
    });
  });
}

function activateTabQuietly(tabId) {
  return new Promise((resolve) => {
    if (tabId === null || tabId === undefined) {
      resolve();
      return;
    }

    chrome.tabs.update(tabId, { active: true }, () => {
      resolve();
    });
  });
}

function runExtraction(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: extractPatentSectionsFromPage,
        args: [SECTION_CHAR_LIMIT, EXTRACTION_WAIT_MS, CLAIM_STABILIZE_MS],
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(results?.[0]?.result);
      }
    );
  });
}

function reloadTab(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.reload(tabId, { bypassCache: true }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

async function runExtractionWithRetry(tabId, maxAttempts = EXTRACTION_MAX_ATTEMPTS) {
  let lastExtracted = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    lastExtracted = await runExtraction(tabId);
    if (!lastExtracted) {
      continue;
    }

    const hasClaims = Boolean(String(lastExtracted.claims || "").trim());
    const hasDescription = Boolean(String(lastExtracted.description || "").trim());
    if (hasClaims || hasDescription) {
      return lastExtracted;
    }

    if (attempt < maxAttempts) {
      await reloadTab(tabId);
      await waitForTabComplete(tabId, PATENT_WAIT_MS);
    }
  }

  return lastExtracted;
}

async function collectPatentSections(publicationNumber, returnFocusTabId = null) {
  const { normalized, url } = buildPatentUrl(publicationNumber);
  let tabId = null;

  try {
    tabId = await createFocusedTab(url);
    await waitForTabComplete(tabId, PATENT_WAIT_MS);

    const extracted = await runExtractionWithRetry(tabId);
    if (!extracted) {
      throw new Error("특허 데이터 추출 결과가 비어 있습니다.");
    }

    const claims = extracted.claims || "";
    const description = extracted.description || "";
    if (!claims && !description) {
      throw new Error("Claims 또는 Description을 찾지 못했습니다.");
    }
    if (!claims && !extracted.claimsReady) {
      throw new Error("청구항 로딩 완료를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }

    return {
      ...extracted,
      publicationNumber: normalized,
      sourceUrl: url,
    };
  } finally {
    if (tabId !== null) {
      await closeTabQuietly(tabId);
    }
    await activateTabQuietly(returnFocusTabId);
  }
}

async function injectPromptIntoChatGpt(
  promptText,
  promptSelector,
  submitSelector
) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const promptEl = document.querySelector(promptSelector);
  if (!promptEl) {
    return {
      ok: false,
      error: `입력 칸을 찾지 못했습니다. (${promptSelector})`,
    };
  }

  const textValue = String(promptText || "");
  promptEl.focus();

  const isTextInput =
    promptEl instanceof HTMLTextAreaElement || promptEl instanceof HTMLInputElement;
  if (isTextInput) {
    const valueProto =
      promptEl instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(valueProto, "value")?.set;
    if (valueSetter) {
      valueSetter.call(promptEl, textValue);
    } else {
      promptEl.value = textValue;
    }
    if (typeof promptEl.setSelectionRange === "function") {
      promptEl.setSelectionRange(textValue.length, textValue.length);
    }
  } else if (promptEl.isContentEditable) {
    promptEl.textContent = textValue;
  } else {
    return {
      ok: false,
      error: "입력 칸 타입을 지원하지 않습니다.",
    };
  }

  promptEl.dispatchEvent(new Event("input", { bubbles: true }));
  promptEl.dispatchEvent(new Event("change", { bubbles: true }));

  let submitEl = null;
  const deadline = Date.now() + 2500;
  while (Date.now() < deadline) {
    submitEl = document.querySelector(submitSelector);
    const enabled =
      Boolean(submitEl) &&
      !submitEl.disabled &&
      submitEl.getAttribute("aria-disabled") !== "true";
    if (enabled) break;
    await wait(80);
  }

  if (!submitEl) {
    return {
      ok: false,
      error: `전송 버튼을 찾지 못했습니다. (${submitSelector})`,
    };
  }
  if (submitEl.disabled || submitEl.getAttribute("aria-disabled") === "true") {
    return {
      ok: false,
      error: "전송 버튼이 비활성화 상태입니다.",
    };
  }

  submitEl.click();
  return { ok: true };
}

async function extractPatentSectionsFromPage(
  sectionCharLimit,
  waitMs,
  stabilizeMs
) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const cleanText = (raw) =>
    String(raw || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

  const clip = (text) => {
    if (text.length <= sectionCharLimit) return text;
    return `${text.slice(0, sectionCharLimit)}\n\n[...truncated...]`;
  };

  const parseClaimCountFromText = (text) => {
    const match = String(text || "").match(/\b(?:claims|청구항)\s*\((\d+)\)/i);
    if (!match) return null;
    const count = Number(match[1]);
    return Number.isFinite(count) ? count : null;
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

    return cleanText(lines.join("\n"));
  };

  const firstNonEmpty = (selectors) => {
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node) continue;
      const text = cleanText(node.innerText || node.textContent);
      if (text) return text;
    }
    return "";
  };

  const mergeNonEmpty = (selectors) => {
    const blocks = [];
    for (const selector of selectors) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) {
        const text = cleanText(node.innerText || node.textContent);
        if (text) blocks.push(text);
      }
      if (blocks.length > 0) break;
    }
    return cleanText(blocks.join("\n\n"));
  };

  const claimSectionSelectors = [
    "section[itemprop='claims']",
    "#claims",
    "[itemprop='claims']",
    "section.claims",
    "div.claims",
  ];
  const claimBlockSelectors = [
    "#claims .claim",
    "#claims .claim-text",
    "[itemprop='claims'] .claim",
    "[itemprop='claims'] .claim-text",
  ];
  const descSectionSelectors = [
    "section[itemprop='description']",
    "#description",
    "[itemprop='description']",
    "section.description",
    "div.description",
  ];
  const descBlockSelectors = [
    "#description p",
    "[itemprop='description'] p",
    "div.description p",
  ];
  const claimHeadingSelectors = [
    "#claims h2",
    "#claims h3",
    "section[itemprop='claims'] h2",
    "section[itemprop='claims'] h3",
    "[itemprop='claims'] h2",
    "[itemprop='claims'] h3",
  ];
  const claimRootSelectors = [
    "section[itemprop='claims']",
    "[itemprop='claims']",
    "#claims",
  ];

  const parsePositiveInt = (value) => {
    const n = Number(String(value || "").trim());
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.trunc(n);
  };

  const countNumberedClaims = (claimsText) => {
    const matches = String(claimsText || "").match(/(?:^|\n)\s*\d+\.\s+/g);
    return matches ? matches.length : 0;
  };

  const findClaimRoot = () => {
    for (const selector of claimRootSelectors) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return null;
  };

  const getClaimCountFromHeading = (claimRoot) => {
    if (!claimRoot) return null;

    const countNode = claimRoot.querySelector(
      "h2 [itemprop='count'], h3 [itemprop='count'], [itemprop='count']"
    );
    const fromCountNode = parsePositiveInt(countNode?.textContent || "");
    if (fromCountNode !== null) return fromCountNode;

    for (const selector of claimHeadingSelectors) {
      const heading = document.querySelector(selector);
      if (!heading) continue;
      const headingText = cleanText(heading.innerText || heading.textContent);
      const parsed = parseClaimCountFromText(headingText);
      if (parsed !== null) return parsed;
    }

    return null;
  };

  const htmlEntityDecoder = document.createElement("textarea");
  const decodeHtmlEntities = (value) => {
    htmlEntityDecoder.innerHTML = String(value || "");
    return htmlEntityDecoder.value;
  };

  const htmlToText = (value) =>
    cleanText(
      decodeHtmlEntities(
        String(value || "")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n")
          .replace(/<[^>]+>/g, " ")
      )
    );

  const splitNumberedClaimChunks = (text) => {
    const source = cleanText(text);
    if (!source) return [];

    const anchors = [];
    const regex = /^\s*(\d+)\.\s+/gm;
    let match = null;
    while ((match = regex.exec(source)) !== null) {
      anchors.push({ index: match.index });
    }
    if (anchors.length === 0) return [];

    const chunks = [];
    for (let i = 0; i < anchors.length; i += 1) {
      const start = anchors[i].index;
      const end = i + 1 < anchors.length ? anchors[i + 1].index : source.length;
      const chunk = source.slice(start, end).trim();
      if (chunk) chunks.push(chunk);
    }
    return chunks;
  };

  const getClaimsSectionMarkup = () => {
    const claimRoot = findClaimRoot();
    if (claimRoot?.outerHTML) {
      return claimRoot.outerHTML;
    }

    const fullHtml = document.documentElement?.innerHTML || "";
    const match = fullHtml.match(
      /<section[^>]*itemprop=["']claims["'][^>]*>[\s\S]*?<\/section>/i
    );
    return match ? match[0] : "";
  };

  const extractClaimsFromMarkupFallback = () => {
    const markup = getClaimsSectionMarkup();
    if (!markup) {
      return {
        claimsText: "",
        claimNodeCount: 0,
        claimCount: null,
      };
    }

    const countMatch =
      markup.match(/itemprop=["']count["'][^>]*>\s*(\d+)\s*</i) ||
      markup.match(/claims\s*\((\d+)\)/i);
    const parsedCount = parsePositiveInt(countMatch?.[1] || "");

    const claimItems = [];
    const seen = new Set();

    const claimRegex =
      /<div[^>]*num=["']?(\d+)["']?[^>]*class=["'][^"']*\bclaim\b[^"']*["'][^>]*>[\s\S]*?<div[^>]*class=["'][^"']*claim-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    let match = null;
    while ((match = claimRegex.exec(markup)) !== null) {
      const claimNo = parsePositiveInt(match[1]);
      const body = htmlToText(match[2]);
      if (!body) continue;
      const value = claimNo !== null ? `${claimNo}. ${body}` : body;
      const dedupeKey = value.replace(/\s+/g, " ").trim();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      claimItems.push(value);
    }

    if (claimItems.length === 0) {
      claimItems.push(...splitNumberedClaimChunks(htmlToText(markup)));
    }

    const claimNodeCount = claimItems.length;
    const claimCount =
      parsedCount !== null
        ? parsedCount
        : claimNodeCount > 0
          ? claimNodeCount
          : null;

    return {
      claimsText: cleanText(claimItems.join("\n\n")),
      claimNodeCount,
      claimCount,
    };
  };

  const extractClaimsStructured = () => {
    const claimRoot = findClaimRoot();
    if (!claimRoot) {
      return {
        claimsText: "",
        claimNodeCount: 0,
        claimCount: null,
      };
    }

    const claimTextSelectors = [
      "li[class*='claim'] > div.claim > div.claim-text",
      "li[class*='claim'] div.claim-text",
      ".claim-text",
    ];

    let claimTextNodes = [];
    for (const selector of claimTextSelectors) {
      const nodes = Array.from(claimRoot.querySelectorAll(selector));
      if (nodes.length > 0) {
        claimTextNodes = nodes;
        break;
      }
    }

    const seen = new Set();
    const claimItems = [];

    for (const node of claimTextNodes) {
      const text = cleanText(node.innerText || node.textContent);
      if (!text) continue;

      const claimWrapper = node.closest("div.claim");
      const li = node.closest("li");

      const numAttr =
        claimWrapper?.getAttribute("num") ||
        li?.getAttribute("num") ||
        "";
      const claimNo = parsePositiveInt(numAttr);

      const value = claimNo !== null ? `${claimNo}. ${text}` : text;
      const dedupeKey = value.replace(/\s+/g, " ").trim();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      claimItems.push(value);
    }

    const claimNodeCount = claimItems.length;
    const headingCount = getClaimCountFromHeading(claimRoot);
    const claimCount =
      headingCount !== null
        ? headingCount
        : claimNodeCount > 0
          ? claimNodeCount
          : null;

    return {
      claimsText: cleanText(claimItems.join("\n\n")),
      claimNodeCount,
      claimCount,
    };
  };

  let claims = "";
  let description = "";
  let claimCount = null;
  let claimsReady = false;
  const deadline = Date.now() + waitMs;
  let previousNodeCount = -1;
  let stableSince = Date.now();
  let consecutiveReady = 0;

  while (Date.now() < deadline) {
    const structured = extractClaimsStructured();
    const markupFallback =
      structured.claimNodeCount > 0 ? null : extractClaimsFromMarkupFallback();
    const rawClaimsFallback =
      firstNonEmpty(claimSectionSelectors) || mergeNonEmpty(claimBlockSelectors);
    const rawDescription =
      firstNonEmpty(descSectionSelectors) || mergeNonEmpty(descBlockSelectors);

    const cleanedClaims = stripClaimHeadingLines(
      structured.claimsText || markupFallback?.claimsText || rawClaimsFallback
    );
    const claimNodeCount =
      structured.claimNodeCount ||
      markupFallback?.claimNodeCount ||
      countNumberedClaims(cleanedClaims);

    if (claimNodeCount !== previousNodeCount) {
      previousNodeCount = claimNodeCount;
      stableSince = Date.now();
    }

    claims = cleanedClaims;
    description = rawDescription;
    claimCount =
      structured.claimCount ??
      markupFallback?.claimCount ??
      parseClaimCountFromText(cleanedClaims) ??
      (claimNodeCount > 0 ? claimNodeCount : null);

    const enoughByCount =
      claimCount !== null && claimNodeCount > 0 && claimNodeCount >= claimCount;
    const stableEnough =
      claimNodeCount > 0 && Date.now() - stableSince >= stabilizeMs;
    const enoughByFallback =
      claimNodeCount === 0 &&
      countNumberedClaims(cleanedClaims) > 0 &&
      cleanedClaims.length >= 120;
    const looksUsable = claimNodeCount > 0 && cleanedClaims.length >= 40;

    if (looksUsable) {
      consecutiveReady += 1;
    } else {
      consecutiveReady = 0;
    }

    claimsReady =
      enoughByCount ||
      stableEnough ||
      enoughByFallback ||
      consecutiveReady >= 3;
    if (claimsReady) {
      const settledStructured = extractClaimsStructured();
      const settledFallback =
        settledStructured.claimNodeCount > 0
          ? null
          : extractClaimsFromMarkupFallback();
      const settledClaims = stripClaimHeadingLines(
        settledStructured.claimsText ||
          settledFallback?.claimsText ||
          cleanedClaims
      );

      claims = settledClaims;
      description =
        firstNonEmpty(descSectionSelectors) || mergeNonEmpty(descBlockSelectors);
      claimCount =
        settledStructured.claimCount ??
        settledFallback?.claimCount ??
        claimCount ??
        parseClaimCountFromText(settledClaims) ??
        (settledStructured.claimNodeCount > 0
          ? settledStructured.claimNodeCount
          : null);
      break;
    }

    const claimAnchor = findClaimRoot();
    if (claimAnchor) {
      claimAnchor.scrollIntoView({ block: "start", behavior: "auto" });
    }

    await sleep(350);
  }

  if (!claims) {
    const finalFallback = extractClaimsFromMarkupFallback();
    if (finalFallback.claimsText) {
      claims = stripClaimHeadingLines(finalFallback.claimsText);
      claimCount = claimCount ?? finalFallback.claimCount;
      claimsReady = true;
    }
  }

  const title =
    cleanText(
      document.querySelector("meta[name='DC.title']")?.content ||
        document.querySelector("h1")?.innerText ||
        document.title
    ) || "";

  const patentIdMatch = window.location.pathname.match(/\/patent\/([^/]+)\//);
  const patentId = cleanText(patentIdMatch?.[1] || "");

  return {
    title,
    patentId,
    claimCount,
    claimsReady,
    claims: clip(claims),
    description: clip(description),
    pageUrl: window.location.href,
  };
}
