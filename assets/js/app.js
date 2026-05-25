const state = {
  items: [],
  query: "",
  category: "All",
  status: "All"
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

function renderSelect(container, values, key, label) {
  container.innerHTML = `
    <select data-filter-key="${key}" aria-label="${escapeHtml(label)}">
      ${values.map(value => `<option value="${escapeHtml(value)}" ${state[key] === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
    </select>
  `;
}

function itemMatches(item) {
  const haystack = [item.title, item.category, item.type, item.status, item.path, item.source, item.notes].join(" ").toLowerCase();
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
        <p>Clear a filter or search for another term. The goblins are in here somewhere.</p>
      </section>
    `;
    return;
  }

  els.grid.innerHTML = visible.map(item => {
    const deployable = isDeployable(item);
    const nested = isNestedApp(item);
    const archive = isArchive(item);
    const cardClass = nested ? " app-card" : archive ? " archive-card" : !deployable ? " review-card" : "";
    const openButton = deployable
      ? `<a class="btn primary" href="${escapeHtml(item.livePath)}" target="_blank" rel="noreferrer">Open Site</a>`
      : "";
    const sourceButton = `<a class="btn" href="${escapeHtml(sourceUrl(item))}" target="_blank" rel="noreferrer">View Source Path</a>`;
    const reviewBadge = !deployable ? `<span class="badge review">Needs Review</span>` : "";
    const nestedBadge = nested ? `<span class="badge app">Nested App</span>` : "";
    const archiveBadge = archive ? `<span class="badge archive">Archive</span>` : "";

    return `
      <article class="card${cardClass}">
        <div class="card-top">
          <h2>${escapeHtml(item.title)}</h2>
          <div class="badge-stack">${reviewBadge}${nestedBadge}${archiveBadge}</div>
        </div>
        <div class="meta">
          <span class="badge">${escapeHtml(item.category || "Uncategorized")}</span>
          <span class="badge">${escapeHtml(item.type || "Unknown")}</span>
          <span class="badge">${escapeHtml(item.status || "Unknown")}</span>
        </div>
        <div class="path">${escapeHtml(item.path || "No path recorded")}</div>
        <ul class="flags">
          <li>${item.hasIndex ? "index.html" : "no index.html"}</li>
          <li>${item.hasPackageJson ? "package.json" : "no package.json"}</li>
          <li>${item.hasZip ? "ZIP present" : "no ZIP flagged"}</li>
          <li>${item.hasMarkdown ? "Markdown/docs" : "no docs flagged"}</li>
        </ul>
        ${item.notes ? `<p class="notes">${escapeHtml(item.notes)}</p>` : ""}
        <div class="card-actions">
          ${openButton}
          ${sourceButton}
          ${item.needsNormalization ? `<span class="badge">Needs normalization</span>` : ""}
          ${item.needsStandaloneDeploy ? `<span class="badge">Standalone deploy</span>` : ""}
        </div>
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
    const baseRegistry = await fetchJson("/data/site-registry.json");
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

    state.items = Array.from(merged.values());
  } catch (error) {
    console.error(error);
    state.items = [];
  }
  renderShell();
}

init();
