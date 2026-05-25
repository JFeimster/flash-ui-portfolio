const ACTION_SYSTEM_DEFAULTS = {
  version: "1.0.0",
  defaultRules: {
    maxVisibleActions: 3,
    showOverflowMenu: true,
    preserveExistingCardActions: true
  },
  actionDefinitions: [
    { id: "open-site", label: "Open Site", emoji: "🚀", type: "primary", behavior: "open-live-path" },
    { id: "copy-link", label: "Copy Link", emoji: "🔗", type: "secondary", behavior: "copy-live-url" },
    { id: "view-details", label: "View Details", emoji: "🧭", type: "utility", behavior: "open-details" },
    { id: "view-source", label: "View Source", emoji: "🧱", type: "primary", behavior: "open-source-url" },
    { id: "copy-embed-code", label: "Copy Embed Code", emoji: "📋", type: "utility", behavior: "copy-embed-code" },
    { id: "landing-draft", label: "Landing Draft", emoji: "🧲", type: "utility", behavior: "landing-draft-details" },
    { id: "campaign-notes", label: "Campaign Notes", emoji: "📣", type: "utility", behavior: "campaign-notes-details" },
    { id: "deploy-candidate", label: "Deploy Candidate", emoji: "🛰️", type: "secondary", behavior: "deploy-candidate-details" },
    { id: "review-notes", label: "Review Notes", emoji: "📝", type: "secondary", behavior: "review-notes-details" }
  ],
  actionRules: [
    { id: "nested-app", match: { nestedApp: true }, actions: ["view-source", "deploy-candidate", "view-details"] },
    { id: "archive", match: { archive: true }, actions: ["view-source", "review-notes", "view-details"] },
    { id: "widget", match: { deployable: true, textRegex: "Widget|Embed" }, actions: ["open-site", "copy-link", "copy-embed-code"] },
    { id: "funding-tool", match: { deployable: true, textRegex: "Funding|Calculator|Analyzer|Estimator|Matcher|Scorecard|CFO|CAC|LTV" }, actions: ["open-site", "copy-link", "landing-draft"] },
    { id: "partner", match: { deployable: true, textRegex: "Partner|Referral|Affiliate|Attorney|Darwin" }, actions: ["open-site", "copy-link", "campaign-notes"] },
    { id: "ai-library", match: { deployable: true, textRegex: "AI Agent|AI Lab|Agent Library|Prompt" }, actions: ["open-site", "copy-link", "view-details"] },
    { id: "live-static-site", match: { deployable: true }, actions: ["open-site", "copy-link", "view-details"] }
  ],
  assetOverrides: []
};

const ACTION_REPO_URL = "https://github.com/JFeimster/flash-ui-portfolio";

function actionEscapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function actionSourceUrl(path = "") {
  const encoded = String(path).split("/").map(encodeURIComponent).join("/");
  const looksFile = /\.[a-z0-9]+$/i.test(path);
  return `${ACTION_REPO_URL}/${looksFile ? "blob" : "tree"}/main/${encoded}`;
}

function loadGroupingEnhancements() {
  if (window.__flashGroupingEnhancementsRequested) return;
  window.__flashGroupingEnhancementsRequested = true;
  const script = document.createElement("script");
  script.src = "/assets/js/grouping-enhancements.js";
  script.defer = true;
  document.body.appendChild(script);
}

function actionCardTitle(card) {
  return card.querySelector("h2")?.textContent?.trim() || "Flash UI asset";
}

function actionCardText(card) {
  return card.textContent || "";
}

function actionDetailsId(card) {
  return card.querySelector("details")?.id || "";
}

function actionInferContext(card) {
  const text = actionCardText(card);
  const sourceLink = card.querySelector('.card-actions a[href*="github.com"]')?.getAttribute("href") || "";
  const openLink = card.querySelector('.card-actions a:not([href*="github.com"])')?.getAttribute("href") || "";
  const pathRow = Array.from(card.querySelectorAll(".detail-row")).find(row => row.querySelector("dt")?.textContent?.trim() === "path");
  const typeRow = Array.from(card.querySelectorAll(".detail-row")).find(row => row.querySelector("dt")?.textContent?.trim() === "type");
  const statusRow = Array.from(card.querySelectorAll(".detail-row")).find(row => row.querySelector("dt")?.textContent?.trim() === "status");
  const recommendedUse = Array.from(card.querySelectorAll(".meta-chip")).find(chip => /Recommended Use/i.test(chip.textContent || ""))?.querySelector("strong")?.textContent?.trim() || "";
  const path = pathRow?.querySelector("dd")?.textContent?.trim() || "";
  const type = typeRow?.querySelector("dd")?.textContent?.trim() || "";
  const status = statusRow?.querySelector("dd")?.textContent?.trim() || "";
  const nestedApp = card.classList.contains("app-card") || /Standalone App|Needs Deployment|nextjs-app/i.test(text);
  const archive = card.classList.contains("archive-card") || /Archive|Needs Review|zip-archive|docs-archive/i.test(text);
  const deployable = Boolean(openLink) && !nestedApp && !archive;

  return {
    card,
    title: actionCardTitle(card),
    text,
    path,
    type,
    status,
    recommendedUse,
    livePath: openLink,
    sourceUrl: sourceLink || (path ? actionSourceUrl(path) : ACTION_REPO_URL),
    detailsId: actionDetailsId(card),
    deployable,
    nestedApp,
    archive
  };
}

function actionMatchesValue(actual, expected) {
  if (typeof expected === "boolean") return Boolean(actual) === expected;
  if (Array.isArray(expected)) return expected.includes(actual);
  return actual === expected;
}

function actionMatchRule(context, rule) {
  const match = rule.match || {};
  if (Object.prototype.hasOwnProperty.call(match, "deployable") && !actionMatchesValue(context.deployable, match.deployable)) return false;
  if (Object.prototype.hasOwnProperty.call(match, "nestedApp") && !actionMatchesValue(context.nestedApp, match.nestedApp)) return false;
  if (Object.prototype.hasOwnProperty.call(match, "archive") && !actionMatchesValue(context.archive, match.archive)) return false;
  if (match.type && !actionMatchesValue(context.type, match.type)) return false;
  if (match.status && !actionMatchesValue(context.status, match.status)) return false;
  if (match.recommendedUse && !actionMatchesValue(context.recommendedUse, match.recommendedUse)) return false;
  if (match.textIncludes && !match.textIncludes.some(term => context.text.includes(term))) return false;
  if (match.textRegex) {
    try {
      if (!new RegExp(match.textRegex, "i").test(context.text)) return false;
    } catch (error) {
      console.warn("Invalid action rule regex.", error);
      return false;
    }
  }
  return true;
}

function actionDefinitionsMap(system) {
  return new Map((system.actionDefinitions || []).map(action => [action.id, action]));
}

function actionSelectIds(system, context) {
  const override = (system.assetOverrides || []).find(item => item.slug && context.text.includes(item.slug));
  if (override?.actions?.length) return override.actions;
  const rule = (system.actionRules || []).find(candidate => actionMatchRule(context, candidate));
  return rule?.actions || ["open-site", "copy-link", "view-details"];
}

function actionClass(action) {
  if (action.type === "primary") return "btn primary asset-action";
  if (action.type === "secondary") return "btn asset-action";
  return "btn subtle asset-action";
}

function actionLabel(action) {
  return `${action.emoji ? `${action.emoji} ` : ""}${action.label}`.trim();
}

function actionButtonHtml(action, context) {
  const label = actionEscapeHtml(actionLabel(action));
  const klass = actionEscapeHtml(actionClass(action));
  const detailsId = actionEscapeHtml(context.detailsId);
  const livePath = actionEscapeHtml(context.livePath);
  const sourceUrl = actionEscapeHtml(context.sourceUrl);

  if (action.behavior === "open-live-path" || action.behavior === "preview-embed") {
    return context.livePath ? `<a class="${klass}" href="${livePath}" target="_blank" rel="noreferrer">${label}</a>` : "";
  }
  if (action.behavior === "open-source-url") {
    return `<a class="${klass}" href="${sourceUrl}" target="_blank" rel="noreferrer">${label}</a>`;
  }
  if (action.behavior === "copy-live-url") {
    return context.livePath ? `<button class="${klass}" type="button" data-copy-link="${livePath}">${label}</button>` : "";
  }
  if (action.behavior === "copy-embed-code") {
    return context.livePath ? `<button class="${klass}" type="button" data-copy-embed="${livePath}" data-asset-title="${actionEscapeHtml(context.title)}">${label}</button>` : "";
  }
  return detailsId ? `<button class="${klass}" type="button" data-open-details="${detailsId}">${label}</button>` : "";
}

function actionApplyToCard(card, system) {
  const context = actionInferContext(card);
  const actionMap = actionDefinitionsMap(system);
  const maxVisible = system.defaultRules?.maxVisibleActions || 3;
  const actions = actionSelectIds(system, context)
    .slice(0, maxVisible)
    .map(id => actionMap.get(id))
    .filter(Boolean)
    .map(action => actionButtonHtml(action, context))
    .filter(Boolean);

  if (!actions.length && system.defaultRules?.preserveExistingCardActions) return;
  const row = card.querySelector(".card-actions");
  if (!row) return;
  row.innerHTML = actions.join("");
}

function actionApplySystem(system) {
  document.querySelectorAll(".card").forEach(card => actionApplyToCard(card, system));
}

function actionObserveCards(system) {
  const grid = document.querySelector("#cardGrid");
  if (!grid) return;
  const observer = new MutationObserver(() => actionApplySystem(system));
  observer.observe(grid, { childList: true });
  actionApplySystem(system);
}

async function initAssetActions() {
  let system = ACTION_SYSTEM_DEFAULTS;
  try {
    const response = await fetch("/data/asset-actions.json", { cache: "no-store" });
    if (response.ok) {
      const remote = await response.json();
      system = {
        ...ACTION_SYSTEM_DEFAULTS,
        ...remote,
        defaultRules: {
          ...ACTION_SYSTEM_DEFAULTS.defaultRules,
          ...(remote.defaultRules || {})
        }
      };
    }
  } catch (error) {
    console.warn("Asset action metadata unavailable; preserving default card actions.", error);
  }
  actionObserveCards(system);
}

document.addEventListener("click", async event => {
  const embedButton = event.target.closest("[data-copy-embed]");
  if (!embedButton) return;
  const link = embedButton.getAttribute("data-copy-embed");
  const title = embedButton.getAttribute("data-asset-title") || "Flash UI asset";
  if (!link) return;
  const absoluteUrl = new URL(link, window.location.origin).href;
  const embedCode = `<iframe title="${title}" src="${absoluteUrl}" width="100%" height="900" loading="lazy" style="border:0;width:100%;max-width:100%;"></iframe>`;
  try {
    await navigator.clipboard.writeText(embedCode);
    const previous = embedButton.textContent;
    embedButton.textContent = "Copied Embed";
    window.setTimeout(() => {
      embedButton.textContent = previous;
    }, 1600);
  } catch (error) {
    console.warn("Embed copy failed.", error);
  }
});

loadGroupingEnhancements();
initAssetActions();