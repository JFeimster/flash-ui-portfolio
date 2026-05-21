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

function isNestedApp(item) {
  return item.type === "nextjs-app" || Boolean(item.needsStandaloneDeploy);
}

function isArchive(item) {
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

function renderButtons(container, values, key) {
  container.innerHTML = values.map(value => `
    <button class="${state[key] === value ? "active" : ""}" data-filter-key="${key}" data-filter-value="${escapeHtml(value)}">${escapeHtml(value)}</button>
  `).join("");
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

  renderButtons(els.categoryFilters, categories, "category");
  renderButtons(els.statusFilters, statuses, "status");
  renderCards();
}

function bindEvents() {
  els.search.addEventListener("input", event => {
    state.query = event.target.value.trim();
    renderCards();
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter-key]");
    if (!button) return;
    const key = button.dataset.filterKey;
    state[key] = button.dataset.filterValue;
    renderShell();
  });
}

async function init() {
  bindEvents();
  try {
    const response = await fetch("/data/site-registry.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Registry request failed: ${response.status}`);
    state.items = await response.json();
  } catch (error) {
    console.error(error);
    state.items = [];
  }
  renderShell();
}

init();
