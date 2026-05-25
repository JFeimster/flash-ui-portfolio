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

function actionDetailsId(card) {
  return card.querySelector("details")?.id || "";
}

function actionInferContext(card) {
  const text = card.textContent || "";
  const sourceLink = card.querySelector('.card-actions a[href*="github.com"]')?.getAttribute("href") || "";
  const openLink = card.querySelector('.card-actions a:not([href*="github.com"])')?.getAttribute("href") || "";
  const pathRow = Array.from(card.querySelectorAll(".detail-row")).find(row => row.querySelector("dt")?.textContent?.trim() === "path");
  const typeRow = Array.from(card.querySelectorAll(".detail-row")).find(row => row.querySelector("dt")?.textContent?.trim() === "type");
  const path = pathRow?.querySelector("dd")?.textContent?.trim() || "";
  const type = typeRow?.querySelector("dd")?.textContent?.trim() || "";
  const nestedApp = card.classList.contains("app-card") || /Standalone App|Needs Deployment|nextjs-app/i.test(text);
  const archive = card.classList.contains("archive-card") || /Archive|Needs Review|zip-archive|docs-archive/i.test(text);
  const deployable = Boolean(openLink) && !nestedApp && !archive;
  const variantHub = /Variant Hub/i.test(text);
  const variantSet = /Variant Set|Variant/i.test(text);

  return {
    card,
    title: actionCardTitle(card),
    text,
    path,
    type,
    livePath: openLink,
    sourceUrl: sourceLink || (path ? actionSourceUrl(path) : ACTION_REPO_URL),
    detailsId: actionDetailsId(card),
    deployable,
    nestedApp,
    archive,
    variantHub,
    variantSet
  };
}

function actionButton(label, klass, attrs = {}) {
  const attrText = Object.entries(attrs)
    .map(([key, value]) => `${key}="${actionEscapeHtml(value)}"`)
    .join(" ");
  return `<button class="${klass}" type="button" ${attrText}>${actionEscapeHtml(label)}</button>`;
}

function actionLink(label, klass, href) {
  return `<a class="${klass}" href="${actionEscapeHtml(href)}" target="_blank" rel="noreferrer">${actionEscapeHtml(label)}</a>`;
}

function actionButtonsForContext(context) {
  const actions = [];
  if (context.deployable) {
    actions.push(actionLink(context.variantHub ? "Open Hub" : "🚀 Open Site", "btn primary asset-action", context.livePath));
    actions.push(actionButton("🔗 Copy Link", "btn asset-action", { "data-copy-link": context.livePath }));
    if (/Widget|Embed/i.test(context.text)) actions.push(actionButton("📋 Copy Embed", "btn subtle asset-action", { "data-copy-embed": context.livePath, "data-asset-title": context.title }));
    else if (/Funding|Calculator|Analyzer|Estimator|Matcher|Scorecard|CFO|CAC|LTV/i.test(context.text)) actions.push(actionButton("🧲 Landing Draft", "btn subtle asset-action", { "data-open-details": context.detailsId }));
    else if (/Partner|Referral|Affiliate|Attorney|Darwin/i.test(context.text)) actions.push(actionButton("📣 Campaign Notes", "btn subtle asset-action", { "data-open-details": context.detailsId }));
    else actions.push(actionButton("🧭 View Details", "btn subtle asset-action", { "data-open-details": context.detailsId }));
  } else if (context.nestedApp) {
    actions.push(actionLink("🧱 View Source", "btn primary asset-action", context.sourceUrl));
    actions.push(actionButton("🛰️ Deployment Plan", "btn asset-action", { "data-open-details": context.detailsId }));
  } else {
    actions.push(actionLink("🧱 View Source", "btn primary asset-action", context.sourceUrl));
    actions.push(actionButton(context.archive ? "📝 Review Notes" : "🧭 View Details", "btn asset-action", { "data-open-details": context.detailsId }));
  }

  const hubLink = Array.from(context.card.querySelectorAll(".card-actions a"))
    .find(link => /Open Variant Hub/i.test(link.textContent || ""));
  if (hubLink && !context.variantHub) {
    actions.push(actionLink("Open Variant Hub", "btn subtle asset-action", hubLink.getAttribute("href")));
  }

  return actions.filter(Boolean).slice(0, 4);
}

function actionApplyToCard(card) {
  const row = card.querySelector(".card-actions");
  if (!row) return;
  const context = actionInferContext(card);
  const actions = actionButtonsForContext(context);
  if (actions.length) row.innerHTML = actions.join("");
}

function actionApplySystem() {
  document.querySelectorAll(".card").forEach(actionApplyToCard);
}

function actionObserveCards() {
  const grid = document.querySelector("#cardGrid");
  if (!grid) return;
  const observer = new MutationObserver(() => actionApplySystem());
  observer.observe(grid, { childList: true });
  actionApplySystem();
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
    window.setTimeout(() => { embedButton.textContent = previous; }, 1600);
  } catch (error) {
    console.warn("Embed copy failed.", error);
  }
});

loadGroupingEnhancements();
actionObserveCards();
