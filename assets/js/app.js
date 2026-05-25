const DEFAULT_DISPLAY_RULES = {
  version: "1.0.0",
  defaultCardRules: {
    hideTechnicalFieldsByDefault: true,
    showAdvancedDetailsToggle: true,
    primaryCtaLabel: "Open Site",
    secondaryCtaLabel: "Copy Link",
    detailsCtaLabel: "View Details",
    sourceCtaLabel: "View Source",
    deploymentPlanLabel: "Deployment Plan",
    reviewNotesLabel: "Review Notes"
  },
  technicalLabelsToHide: [],
  badgeRules: [],
  categoryDisplayRules: [],
  readinessRules: [],
  recommendedUseRules: [],
  descriptionRules: []
};

const state = {
  items: [],
  query: "",
  category: "All",
  status: "All",
  rules: DEFAULT_DISPLAY_RULES
};

const REPO_URL = "https://github.com/JFeimster/flash-ui-portfolio";

const els = {
  grid: document.querySelector("#cardGrid"),
  search: document.querySelector("#searchInput"),
  categoryFilters: document.querySelector("#categoryFilters"),
  statusFilters: document.querySelector("#statusFilters"),
  assetCount: document.querySelector("#assetCount"),
  deployableCount: document.querySelector("#deployableCount"),
  legacyCount: document.querySelector("#legacyCount"),
  sitesCount: document.querySelector("#sitesCount"),
  nestedAppCount: document.querySelector("#nestedAppCount"),
  archiveCount: document.querySelector("#archiveCount"),
  visibleCount: document.querySelector("#visibleCount")
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function encodePath(path = "", trailingSlash = false) {
  const encoded = String(path).split("/").map(encodeURIComponent).join("/");
  return `/${encoded}${trailingSlash ? "/" : ""}`;
}

function normalizeWhitespace(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function makeKeywordRegex(pattern) {
  if (!pattern || pattern === "*") return null;
  return new RegExp(pattern, "i");
}

function guessCategory(name = "") {
  if (name.includes("Lead Magnet")) return "Lead Magnets";
  if (name.includes("Funding Calculators") || name.includes("Calculator") || name.includes("Credit") || name.includes("Funding Route") || name.includes("CFO") || name.includes("CAC")) return "Funding Tools";
  if (["Referral", "Partner", "Affiliate", "Darwin"].some(term => name.includes(term))) return "Partner Sites";
  if (["Personal", "Founder", "Jester", "Radical Libertarian"].some(term => name.includes(term))) return "Personal Brand Sites";
  if (name.includes("AI Agent")) return "AI Agent Libraries";
  if (name.includes("Widget") || name.includes("Embed")) return "Widgets";
  if (name.includes("From Idea to URL") || name.includes("Static Site Generator")) return "Static Site Factories";
  if (["Editorial", "Bento", "Content Hub"].some(term => name.includes(term))) return "Content Hubs";
  if (["CFO", "financing-widget", "moonshine-affiliate-hub"].some(term => name.includes(term))) return "Apps";
  return "Experiments";
}

function isNestedApp(item) {
  return item.type === "nextjs-app" || Boolean(item.needsStandaloneDeploy);
}

function isArchive(item) {
  if (["static-site-extracted", "static-site-existing", "skipped-existing-index"].includes(item.extractionStatus)) return false;
  return item.status === "archive-needs-review" || item.type === "zip-archive" || item.type === "docs-archive" || item.hasZip || item.hasMarkdown;
}

function isDeployable(item) {
  return Boolean(item.livePath) && !isNestedApp(item) && !isArchive(item);
}

function isLegacy(item) {
  return item.status === "legacy-root" || item.status === "legacy-root-folder" || item.source === "existing-root-file" || item.source === "existing-root-folder";
}

function isSitesAsset(item) {
  return String(item.path || "").startsWith("sites/");
}

function unique(values) {
  return ["All", ...Array.from(new Set(values.filter(Boolean))).sort()];
}

function sourceUrl(item) {
  const path = String(item.path || "");
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const looksFile = /\.[a-z0-9]+$/i.test(path);
  return `${REPO_URL}/${looksFile ? "blob" : "tree"}/main/${encoded}`;
}

function cleanDisplayTitle(item) {
  const rawTitle = item.title || item.path || "Untitled asset";
  return normalizeWhitespace(
    rawTitle
      .replace(/^sites\s+/i, "")
      .replace(/ index\.html$/i, "")
      .replace(/\.html$/i, "")
      .replace(/_/g, " ")
  );
}

function getAssetTypeLabel(item) {
  const categoryRule = (state.rules.categoryDisplayRules || []).find(rule => rule.match === item.category);
  if (categoryRule) return categoryRule.label;
  if (item.type === "nextjs-app") return "Standalone App";
  if (item.type === "docs-archive") return "Archive / Docs";
  if (item.type === "zip-archive") return "Archive Package";
  return "Website";
}

function getRecommendedUse(item, displayTitle) {
  const text = [displayTitle, item.category, item.type, item.path].join(" ");

  if (/(Partner|Referral|Affiliate|Darwin|Attorney)/i.test(text)) return "Partner enablement";
  if (/(Calculator|Analyzer|Estimator|Matcher|Generator|Scorecard)/i.test(text)) return "Interactive tool";
  if (/Lead Magnet/i.test(text)) return "Lead generation";
  if (/(AI Agent|AI Lab|Agent Library)/i.test(text)) return "AI demo/library";
  if (/(Personal|Radical Libertarian|Jester|Founder)/i.test(text)) return "Personal brand";
  if (/(Editorial|Bento|Content Hub|Pillar)/i.test(text)) return "Content hub";
  if (item.type === "nextjs-app" || item.needsStandaloneDeploy || item.hasPackageJson) return "Standalone app candidate";

  const fallback = (state.rules.recommendedUseRules || []).find(rule => rule.id === "default");
  return fallback?.label || "Prototype / experiment";
}

function getDescription(item, displayTitle) {
  if (item.description) return item.description;

  const haystack = [displayTitle, item.category, item.type, item.path].join(" ");
  const matchedRule = (state.rules.descriptionRules || []).find(rule => {
    if (rule.match === "*") return false;
    return makeKeywordRegex(rule.match)?.test(haystack);
  });
  if (matchedRule) return matchedRule.description;

  const defaultRule = (state.rules.descriptionRules || []).find(rule => rule.match === "*");
  return defaultRule?.description || "Flash UI starter asset ready for review, reuse, or promotion.";
}

function getReadiness(item, deployable, nested, archive) {
  if (deployable) {
    return { label: "Ready to Share", tone: "ready" };
  }
  if (nested) {
    return { label: "Needs Deployment", tone: "deploy" };
  }
  if (item.needsNormalization || /review/i.test(item.status || "")) {
    return { label: "Needs Polish", tone: "polish" };
  }
  if (archive) {
    return { label: "Needs Review", tone: "review" };
  }
  return { label: "Needs Review", tone: "review" };
}

function hasVariantName(displayTitle, path) {
  return /\b\d+\)?$/i.test(displayTitle) || /(?:^|[\s-_])(variant|v\d+)(?:$|[\s-_])/i.test(path || "");
}

function getBadgeDefinitions() {
  const map = new Map();
  (state.rules.badgeRules || []).forEach(rule => {
    map.set(rule.id, {
      id: rule.id,
      label: rule.label,
      emoji: rule.emoji || "",
      text: `${rule.emoji ? `${rule.emoji} ` : ""}${rule.label}`.trim()
    });
  });
  return map;
}

function getViewerBadges(item, displayTitle, nested, archive) {
  const defs = getBadgeDefinitions();
  const haystack = [displayTitle, item.category, item.type, item.path].join(" ");
  const badges = [];
  const add = id => {
    const badge = defs.get(id);
    if (badge && !badges.some(entry => entry.id === id)) badges.push(badge);
  };

  if (item.livePath && !archive && !nested) add("live-site");
  if (/Lead Magnet/i.test(haystack)) add("lead-magnet");
  if (/(Tool|Calculator|Generator|Analyzer|Scorecard|Matcher|Estimator)/i.test(haystack)) add("tool");
  if (/(Experiment|prototype)/i.test(haystack)) add("experiment");
  if (/(Partner|Referral|Affiliate|Darwin|Attorney)/i.test(haystack)) add("partner-asset");
  if (/(AI Agent|AI Lab|Agent Library)/i.test(haystack)) add("ai-agent");
  if (item.extractionStatus === "static-site-extracted") add("zip-extracted");
  if (item.livePath && !nested && !archive) add("ready-to-share");
  if (item.needsNormalization || /review/i.test(item.status || "")) add("needs-polish");
  if (item.needsStandaloneDeploy || item.type === "nextjs-app") add("standalone-app");
  if (hasVariantName(displayTitle, item.path)) add("variant");
  if (item.featured) add("featured");

  return badges;
}

function getCardActions(item, detailsId, deployable, nested, archive) {
  const labels = state.rules.defaultCardRules || DEFAULT_DISPLAY_RULES.defaultCardRules;
  const actions = [];

  if (deployable) {
    actions.push(`<a class="btn primary" href="${escapeHtml(item.livePath)}" target="_blank" rel="noreferrer">${escapeHtml(labels.primaryCtaLabel)}</a>`);
    actions.push(`<button class="btn" type="button" data-copy-link="${escapeHtml(item.livePath)}">${escapeHtml(labels.secondaryCtaLabel)}</button>`);
  } else if (nested) {
    actions.push(`<a class="btn primary" href="${escapeHtml(sourceUrl(item))}" target="_blank" rel="noreferrer">${escapeHtml(labels.sourceCtaLabel)}</a>`);
    actions.push(`<button class="btn" type="button" data-open-details="${escapeHtml(detailsId)}">${escapeHtml(labels.deploymentPlanLabel)}</button>`);
  } else if (!item.livePath || archive) {
    actions.push(`<a class="btn primary" href="${escapeHtml(sourceUrl(item))}" target="_blank" rel="noreferrer">${escapeHtml(labels.sourceCtaLabel)}</a>`);
    actions.push(`<button class="btn" type="button" data-open-details="${escapeHtml(detailsId)}">${escapeHtml(archive ? labels.reviewNotesLabel : labels.detailsCtaLabel)}</button>`);
  }

  if (state.rules.defaultCardRules?.showAdvancedDetailsToggle) {
    actions.push(`<button class="btn subtle" type="button" data-open-details="${escapeHtml(detailsId)}">Advanced / Dev Details</button>`);
  }

  return actions.join("");
}

function getFriendlyStatusLabel(status) {
  const map = {
    "portfolio-site": "Portfolio Site",
    "legacy-root": "Legacy Root",
    "legacy-root-folder": "Legacy Root Folder",
    "archive-needs-review": "Archive Needs Review",
    "nested-app-needs-standalone-deploy": "Nested App Needs Deployment",
    "portfolio-root-html": "Portfolio Root HTML"
  };
  return map[status] || status;
}

function getDisplayMeta(item) {
  const displayTitle = cleanDisplayTitle(item);
  const deployable = isDeployable(item);
  const nested = isNestedApp(item);
  const archive = isArchive(item);
  const assetType = getAssetTypeLabel(item);
  const recommendedUse = getRecommendedUse(item, displayTitle);
  const description = getDescription(item, displayTitle);
  const readiness = getReadiness(item, deployable, nested, archive);
  const badges = getViewerBadges(item, displayTitle, nested, archive);
  const technicalDetails = [
    ["path", item.path || "None"],
    ["type", item.type || "Unknown"],
    ["status", item.status || "Unknown"],
    ["source", item.source || "Unknown"],
    ["livePath", item.livePath || "None"],
    ["hasIndex", String(Boolean(item.hasIndex))],
    ["hasPackageJson", String(Boolean(item.hasPackageJson))],
    ["hasZip", String(Boolean(item.hasZip))],
    ["hasMarkdown", String(Boolean(item.hasMarkdown))],
    ["needsNormalization", String(Boolean(item.needsNormalization))],
    ["needsStandaloneDeploy", String(Boolean(item.needsStandaloneDeploy))],
    ["extractionStatus", item.extractionStatus || "None"],
    ["notes", item.notes || "None"]
  ];

  return {
    displayTitle,
    deployable,
    nested,
    archive,
    assetType,
    recommendedUse,
    description,
    readiness,
    badges,
    technicalDetails
  };
}

function renderSelect(container, values, key, label) {
  container.innerHTML = `
    <select data-filter-key="${key}" aria-label="${escapeHtml(label)}">
      ${values.map(value => `<option value="${escapeHtml(value)}" ${state[key] === value ? "selected" : ""}>${escapeHtml(key === "status" ? getFriendlyStatusLabel(value) : value)}</option>`).join("")}
    </select>
  `;
}

function itemMatches(item) {
  const meta = item.displayMeta || getDisplayMeta(item);
  const haystack = [
    item.title,
    item.category,
    item.type,
    item.status,
    item.path,
    item.source,
    item.notes,
    meta.displayTitle,
    meta.description,
    meta.assetType,
    meta.recommendedUse,
    meta.readiness.label,
    meta.badges.map(badge => badge.label).join(" ")
  ].join(" ").toLowerCase();
  const matchesQuery = !state.query || haystack.includes(state.query.toLowerCase());
  const matchesCategory = state.category === "All" || item.category === state.category;
  const matchesStatus = state.status === "All" || item.status === state.status;
  return matchesQuery && matchesCategory && matchesStatus;
}

function renderCards() {
  const visible = state.items.filter(itemMatches);
  els.visibleCount.textContent = String(visible.length);

  if (!state.items.length) {
    els.grid.innerHTML = `
      <section class="empty">
        <h2>The vault is empty. Time to stop admiring the shelf and load the ammo.</h2>
        <p>Run the indexing batch again and rebuild <code>data/site-registry.json</code>.</p>
      </section>
    `;
    return;
  }

  if (!visible.length) {
    els.grid.innerHTML = `
      <section class="empty">
        <h2>No matching assets found.</h2>
        <p>Clear a filter or search for another term.</p>
      </section>
    `;
    return;
  }

  els.grid.innerHTML = visible.map(item => {
    const meta = item.displayMeta || getDisplayMeta(item);
    const { deployable, nested, archive } = meta;
    const cardClass = nested ? " app-card" : archive ? " archive-card" : !deployable ? " review-card" : "";
    const detailsId = `details-${escapeHtml(item.slug || slugify(meta.displayTitle))}`;
    const badgeMarkup = meta.badges.map(badge => `<span class="badge viewer">${escapeHtml(badge.text)}</span>`).join("");
    const detailRows = meta.technicalDetails.map(([label, value]) => `
      <div class="detail-row">
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>
    `).join("");

    return `
      <article class="card${cardClass}">
        <div class="card-top">
          <div class="card-heading">
            <h2>${escapeHtml(meta.displayTitle)}</h2>
            <p class="card-description">${escapeHtml(meta.description)}</p>
          </div>
          <div class="badge-stack">
            <span class="badge readiness ${escapeHtml(meta.readiness.tone)}">${escapeHtml(meta.readiness.label)}</span>
          </div>
        </div>
        <div class="meta viewer-meta">
          <span class="meta-chip">
            <span class="meta-label">Asset Type</span>
            <strong>${escapeHtml(meta.assetType)}</strong>
          </span>
          <span class="meta-chip">
            <span class="meta-label">Recommended Use</span>
            <strong>${escapeHtml(meta.recommendedUse)}</strong>
          </span>
        </div>
        <div class="badge-row">${badgeMarkup || `<span class="badge viewer">Prototype</span>`}</div>
        <div class="card-actions">
          ${getCardActions(item, detailsId, deployable, nested, archive)}
        </div>
        ${state.rules.defaultCardRules?.showAdvancedDetailsToggle ? `
          <details class="details-panel" id="${detailsId}">
            <summary>Advanced / Dev Details</summary>
            <dl class="detail-grid">${detailRows}</dl>
          </details>
        ` : ""}
      </article>
    `;
  }).join("");
}

function renderShell() {
  const categories = unique(state.items.map(item => item.category));
  const statuses = unique(state.items.map(item => item.status));

  els.assetCount.textContent = String(state.items.length);
  els.deployableCount.textContent = String(state.items.filter(isDeployable).length);
  els.legacyCount.textContent = String(state.items.filter(isLegacy).length);
  els.sitesCount.textContent = String(state.items.filter(isSitesAsset).length);
  els.nestedAppCount.textContent = String(state.items.filter(isNestedApp).length);
  els.archiveCount.textContent = String(state.items.filter(isArchive).length);

  renderSelect(els.categoryFilters, categories, "category", "Category filter");
  renderSelect(els.statusFilters, statuses, "status", "Status filter");
  renderCards();
}

function bindEvents() {
  els.search.addEventListener("input", event => {
    state.query = event.target.value.trim();
    renderCards();
  });

  document.addEventListener("change", event => {
    const select = event.target.closest("select[data-filter-key]");
    if (!select) return;
    state[select.dataset.filterKey] = select.value;
    renderShell();
  });

  document.addEventListener("click", async event => {
    const copyButton = event.target.closest("[data-copy-link]");
    if (copyButton) {
      const link = copyButton.getAttribute("data-copy-link");
      if (!link) return;
      try {
        await navigator.clipboard.writeText(new URL(link, window.location.origin).href);
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = state.rules.defaultCardRules?.secondaryCtaLabel || DEFAULT_DISPLAY_RULES.defaultCardRules.secondaryCtaLabel;
        }, 1600);
      } catch (error) {
        console.warn("Clipboard copy failed.", error);
      }
      return;
    }

    const detailsButton = event.target.closest("[data-open-details]");
    if (!detailsButton) return;
    const details = document.getElementById(detailsButton.getAttribute("data-open-details"));
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function buildRootHtmlEntry(fileName) {
  const title = fileName.replace(/ index\.html$/i, "").replace(/\.html$/i, "");
  return {
    title: `sites ${title}`,
    slug: `sites-${slugify(title)}`,
    category: guessCategory(title),
    type: "sites-root-html",
    status: "portfolio-root-html",
    source: "incremental-sync",
    path: `sites/${fileName}`,
    livePath: encodePath(`sites/${fileName}`),
    hasIndex: true,
    hasPackageJson: false,
    hasZip: false,
    hasMarkdown: false,
    needsNormalization: true,
    needsStandaloneDeploy: false,
    notes: "Incremental-sync /sites root-level HTML file; normalize later."
  };
}

function buildStaticEntry(tuple) {
  const [name, subdir = "", hasZip = false, hasMarkdown = false] = tuple;
  const livePath = subdir ? `sites/${name}/${subdir}` : `sites/${name}`;
  return {
    title: `sites ${name}`,
    slug: `sites-${slugify(name)}`,
    category: guessCategory(name),
    type: "static-site",
    status: "portfolio-site",
    source: "incremental-sync",
    path: `sites/${name}`,
    livePath: encodePath(livePath, true),
    hasIndex: true,
    hasPackageJson: false,
    hasZip: Boolean(hasZip),
    hasMarkdown: Boolean(hasMarkdown),
    needsNormalization: false,
    needsStandaloneDeploy: false,
    notes: "Incremental-sync /sites static asset."
  };
}

function buildDocsEntry(name) {
  return {
    title: `sites ${name}`,
    slug: `sites-${slugify(name)}`,
    category: "Docs",
    type: "docs-archive",
    status: "archive-needs-review",
    source: "incremental-sync",
    path: `sites/${name}`,
    livePath: "",
    hasIndex: false,
    hasPackageJson: false,
    hasZip: false,
    hasMarkdown: true,
    needsNormalization: false,
    needsStandaloneDeploy: false,
    notes: "Incremental-sync docs/markdown asset; review later."
  };
}

function buildAppEntry(tuple) {
  const [name, folder, category = "Apps"] = tuple;
  return {
    title: `sites ${name}`,
    slug: `sites-${slugify(name)}`,
    category,
    type: "nextjs-app",
    status: "nested-app-needs-standalone-deploy",
    source: "incremental-sync",
    path: `sites/${folder}`,
    livePath: "",
    hasIndex: false,
    hasPackageJson: true,
    hasZip: false,
    hasMarkdown: true,
    needsNormalization: false,
    needsStandaloneDeploy: true,
    notes: "Incremental-sync nested app; deploy separately or promote later."
  };
}

function expandBatch5Manifest(manifest) {
  return [
    ...(manifest.rootHtml || []).map(buildRootHtmlEntry),
    ...(manifest.static || []).map(buildStaticEntry),
    ...(manifest.docs || []).map(buildDocsEntry),
    ...(manifest.apps || []).map(buildAppEntry)
  ];
}

function normalizeStaticExtractionEntry(item) {
  const title = item.title || item.slug || item.path || "Untitled static extraction";
  const extractionStatus = item.extractionStatus || "unknown-needs-manual-review";
  const isStatic = ["static-site-extracted", "static-site-existing", "skipped-existing-index"].includes(extractionStatus);
  const isStandalone = extractionStatus === "nextjs-app-needs-standalone-deploy" || Boolean(item.needsStandaloneDeploy);
  const status = isStatic
    ? "portfolio-site"
    : isStandalone
      ? "nested-app-needs-standalone-deploy"
      : "archive-needs-review";

  return {
    ...item,
    title,
    slug: item.slug || slugify(title),
    category: item.category || guessCategory(title),
    type: item.type || (isStatic ? "static-site" : isStandalone ? "nextjs-app" : "zip-archive"),
    status: item.status || status,
    source: item.source || "static-zip-extraction",
    livePath: isStatic ? item.livePath : "",
    hasMarkdown: Boolean(item.hasMarkdown),
    needsNormalization: Boolean(item.needsNormalization),
    needsStandaloneDeploy: isStandalone,
    notes: Array.isArray(item.notes) ? item.notes.join(" ") : (item.notes || item.recommendedAction || "")
  };
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Registry request failed for ${path}: ${response.status}`);
  return response.json();
}

async function init() {
  bindEvents();
  try {
    const [baseRegistry, displayRules] = await Promise.all([
      fetchJson("/data/site-registry.json"),
      fetchJson("/data/card-display-rules.json").catch(() => DEFAULT_DISPLAY_RULES)
    ]);
    state.rules = {
      ...DEFAULT_DISPLAY_RULES,
      ...displayRules,
      defaultCardRules: {
        ...DEFAULT_DISPLAY_RULES.defaultCardRules,
        ...(displayRules.defaultCardRules || {})
      }
    };
    let batch5Registry = [];
    let staticExtractionRegistry = [];

    try {
      const manifest = await fetchJson("/data/site-registry-batch-5-additions.json");
      batch5Registry = expandBatch5Manifest(manifest);
    } catch (batchError) {
      console.warn(batchError);
    }

    try {
      const staticExtractions = await fetchJson("/data/site-registry-static-extractions.json");
      staticExtractionRegistry = Array.isArray(staticExtractions)
        ? staticExtractions.map(normalizeStaticExtractionEntry)
        : [];
      if (!Array.isArray(staticExtractions)) {
        console.warn(new Error("Static extraction registry is not an array."));
      }
    } catch (staticExtractionError) {
      console.warn(staticExtractionError);
    }

    const merged = new Map();
    [...baseRegistry, ...batch5Registry, ...staticExtractionRegistry].forEach(item => {
      const key = item.path || item.slug || item.title;
      if (!key) return;
      merged.set(key, item);
    });

    state.items = Array.from(merged.values()).map(item => ({
      ...item,
      displayMeta: getDisplayMeta(item)
    }));
  } catch (error) {
    console.error(error);
    state.items = [];
  }
  renderShell();
}

function loadAssetActionHelper() {
  const script = document.createElement("script");
  script.src = "/assets/js/asset-actions.js";
  script.defer = true;
  document.body.appendChild(script);
}

init();
loadAssetActionHelper();
