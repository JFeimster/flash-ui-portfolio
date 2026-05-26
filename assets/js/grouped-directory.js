(() => {
  const DEFAULT_RULES = {
    suppressVariantsByDefault: true,
    showUngroupedAssets: true,
    showArchivesByDefault: false,
    showNeedsReviewByDefault: false,
    canonicalHubPathTemplate: "/sites/{groupId}/",
    groupCardCtaLabel: "Open Hub",
    variantCountLabel: "variants",
    canonicalGroupIds: [],
    manualReviewGroupIds: []
  };

  const state = {
    items: [],
    groups: [],
    rules: DEFAULT_RULES,
    query: "",
    category: "All",
    status: "All",
    showIndividualVariants: false,
    showArchives: false,
    showNeedsReview: false
  };

  const grid = document.querySelector("#cardGrid");
  const search = document.querySelector("#searchInput");
  const categoryFilters = document.querySelector("#categoryFilters");
  const statusFilters = document.querySelector("#statusFilters");
  const assetCount = document.querySelector("#assetCount");
  const deployableCount = document.querySelector("#deployableCount");
  const sitesCount = document.querySelector("#sitesCount");
  const archiveCount = document.querySelector("#archiveCount");
  const visibleCount = document.querySelector("#visibleCount");

  const registryFiles = [
    "/data/site-registry.json",
    "/data/site-registry-static-extractions.json"
  ];

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

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return response.json();
  }

  function guessCategory(name = "") {
    if (/Lead Magnet|Local Business Funding/i.test(name)) return "Lead Magnets";
    if (/Funding|Calculator|Credit|CFO|CAC|Estimator|Diagnostic/i.test(name)) return "Funding Tools";
    if (/Referral|Partner|Affiliate|Attorney/i.test(name)) return "Partner Sites";
    if (/Personal|Founder|Jester|Radical Libertarian|Meme/i.test(name)) return "Personal Brand Sites";
    if (/AI Agent|AI Lab|AI SDR|Person-Finder/i.test(name)) return "AI Agent Libraries";
    if (/Widget|Embed/i.test(name)) return "Widgets";
    if (/From Idea|Static Site/i.test(name)) return "Static Site Factories";
    if (/Editorial|Bento|Directory|Content|Pillar/i.test(name)) return "Content Hubs";
    return "Experiments";
  }

  function expandBatch5Manifest(manifest) {
    const rootHtml = (manifest.rootHtml || []).map(fileName => {
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
        needsNormalization: true
      };
    });
    const staticItems = (manifest.static || []).map(([name, subdir = "", hasZip = false, hasMarkdown = false]) => {
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
        hasZip,
        hasMarkdown
      };
    });
    const docs = (manifest.docs || []).map(name => ({
      title: `sites ${name}`,
      slug: `sites-${slugify(name)}`,
      category: "Docs",
      type: "docs-archive",
      status: "archive-needs-review",
      source: "incremental-sync",
      path: `sites/${name}`,
      livePath: "",
      hasMarkdown: true
    }));
    const apps = (manifest.apps || []).map(([name, folder, category = "Apps"]) => ({
      title: `sites ${name}`,
      slug: `sites-${slugify(name)}`,
      category,
      type: "nextjs-app",
      status: "nested-app-needs-standalone-deploy",
      source: "incremental-sync",
      path: `sites/${folder}`,
      livePath: "",
      hasPackageJson: true,
      needsStandaloneDeploy: true
    }));
    return [...rootHtml, ...staticItems, ...docs, ...apps];
  }

  function normalizeExtractionItem(item) {
    const title = item.title || item.slug || item.path || "Untitled static extraction";
    const extractionStatus = item.extractionStatus || "unknown-needs-manual-review";
    const isStatic = ["static-site-extracted", "static-site-existing", "skipped-existing-index"].includes(extractionStatus);
    const isStandalone = extractionStatus === "nextjs-app-needs-standalone-deploy" || Boolean(item.needsStandaloneDeploy);
    return {
      ...item,
      title,
      slug: item.slug || slugify(title),
      category: item.category || guessCategory(title),
      type: item.type || (isStatic ? "static-site" : isStandalone ? "nextjs-app" : "zip-archive"),
      status: item.status || (isStatic ? "portfolio-site" : isStandalone ? "nested-app-needs-standalone-deploy" : "archive-needs-review"),
      source: item.source || "static-zip-extraction",
      livePath: isStatic ? item.livePath : "",
      needsStandaloneDeploy: isStandalone
    };
  }

  function displayTitle(item) {
    return String(item.title || item.path || "Untitled asset")
      .replace(/^sites\s+/i, "")
      .replace(/ index\.html$/i, "")
      .replace(/\.html$/i, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isArchive(item) {
    if (["static-site-extracted", "static-site-existing", "skipped-existing-index"].includes(item.extractionStatus)) return false;
    return item.status === "archive-needs-review" || item.type === "zip-archive" || item.type === "docs-archive" || item.hasZip || item.hasMarkdown;
  }

  function isNestedApp(item) {
    return item.type === "nextjs-app" || Boolean(item.needsStandaloneDeploy);
  }

  function isDeployable(item) {
    return Boolean(item.livePath) && !isNestedApp(item) && !isArchive(item);
  }

  function canonicalHubPath(group) {
    return String(state.rules.canonicalHubPathTemplate || "/sites/{groupId}/").replace("{groupId}", group.groupId);
  }

  function groupKeyCandidates(item) {
    const title = displayTitle(item);
    const path = String(item.path || "");
    return [item.title, title, item.slug, path.replace(/^sites\//, "").replace(/\/index\.html$/i, "")]
      .filter(Boolean)
      .flatMap(value => [String(value), slugify(value)]);
  }

  function buildGroupIndex(groups) {
    const index = new Map();
    groups.forEach(group => {
      index.set(group.groupId, group);
      index.set(slugify(group.displayTitle), group);
      (group.items || []).forEach(itemName => {
        index.set(itemName, group);
        index.set(slugify(itemName), group);
      });
    });
    return index;
  }

  function buildRows() {
    const groupIndex = buildGroupIndex(state.groups);
    const canonicalIds = new Set(state.rules.canonicalGroupIds || []);
    const manualReviewIds = new Set(state.rules.manualReviewGroupIds || []);
    const grouped = new Map();
    const ungrouped = [];

    state.items.forEach(item => {
      const match = groupKeyCandidates(item).map(key => groupIndex.get(key)).find(Boolean);
      if (!match || !canonicalIds.has(match.groupId)) {
        ungrouped.push({ kind: "asset", item });
        return;
      }
      if (!grouped.has(match.groupId)) {
        grouped.set(match.groupId, { kind: "group", group: match, items: [], manualReview: manualReviewIds.has(match.groupId) });
      }
      grouped.get(match.groupId).items.push(item);
    });

    const groupRows = Array.from(grouped.values()).filter(row => row.items.some(isDeployable) || row.items.length);
    const variantItems = state.showIndividualVariants ? groupRows.flatMap(row => row.items.map(item => ({ kind: "asset", item, groupedVariant: true }))) : [];
    const rows = [...groupRows, ...variantItems, ...(state.rules.showUngroupedAssets ? ungrouped : [])];

    return rows.filter(row => {
      if (row.kind === "group") return state.showNeedsReview || !row.manualReview;
      const archive = isArchive(row.item);
      const review = /review/i.test(row.item.status || "") || row.item.needsNormalization;
      if (archive && !state.showArchives) return false;
      if (review && !state.showNeedsReview) return false;
      return true;
    });
  }

  function rowCategory(row) {
    return row.kind === "group" ? row.group.category || guessCategory(row.group.displayTitle) : row.item.category || "Experiments";
  }

  function rowStatus(row) {
    if (row.kind === "group") return row.manualReview ? "manual-review" : "canonical-group-hub";
    return row.item.status || "unknown";
  }

  function rowSearchText(row) {
    if (row.kind === "group") {
      return [row.group.displayTitle, row.group.groupId, row.group.category, row.group.groupType, row.group.confidence, (row.group.items || []).join(" ")].join(" ").toLowerCase();
    }
    const item = row.item;
    return [item.title, item.slug, item.category, item.type, item.status, item.path, item.notes].join(" ").toLowerCase();
  }

  function filteredRows() {
    return buildRows().filter(row => {
      const queryOk = !state.query || rowSearchText(row).includes(state.query.toLowerCase());
      const categoryOk = state.category === "All" || rowCategory(row) === state.category;
      const statusOk = state.status === "All" || rowStatus(row) === state.status;
      return queryOk && categoryOk && statusOk;
    });
  }

  function renderSelect(container, values, key, label) {
    container.innerHTML = `<select data-group-filter="${key}" aria-label="${escapeHtml(label)}">${values.map(value => `<option value="${escapeHtml(value)}" ${state[key] === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select>`;
  }

  function renderControls() {
    let panel = document.querySelector("#groupDirectoryControls");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "groupDirectoryControls";
      panel.className = "group-directory-controls";
      document.querySelector(".toolbar .wrap")?.appendChild(panel);
    }
    panel.innerHTML = `
      <div class="group-mode-banner">
        <div><strong>Grouped Directory Mode</strong><span>Canonical hubs are shown first. Variant cards are suppressed by default so the homepage stops cosplaying as a junk drawer.</span></div>
        <span class="mode-pill">Batch 22D</span>
      </div>
      <div class="group-toggle-row">
        ${(state.rules.advancedToggles || []).map(toggle => `
          <label class="toggle-chip">
            <input type="checkbox" data-group-toggle="${escapeHtml(toggle.id)}" ${state[toggle.id] ? "checked" : ""} />
            <span>${escapeHtml(toggle.label)}</span>
          </label>
        `).join("")}
      </div>
    `;
  }

  function renderStats(rows) {
    const groupRows = rows.filter(row => row.kind === "group");
    const assetRows = rows.filter(row => row.kind === "asset");
    assetCount.textContent = String(groupRows.length + assetRows.length);
    deployableCount.textContent = String(groupRows.length + assetRows.filter(row => isDeployable(row.item)).length);
    sitesCount.textContent = String(groupRows.length);
    archiveCount.textContent = String(assetRows.filter(row => isArchive(row.item)).length);
    visibleCount.textContent = String(rows.length);
  }

  function renderShell() {
    renderControls();
    const rows = buildRows();
    renderSelect(categoryFilters, ["All", ...Array.from(new Set(rows.map(rowCategory))).sort()], "category", "Category filter");
    renderSelect(statusFilters, ["All", ...Array.from(new Set(rows.map(rowStatus))).sort()], "status", "Status filter");
    renderCards();
  }

  function renderCards() {
    const rows = filteredRows();
    renderStats(rows);
    if (!rows.length) {
      grid.innerHTML = `<section class="empty"><h2>No grouped assets match.</h2><p>Clear a search/filter or enable variant/archive toggles.</p></section>`;
      return;
    }
    grid.innerHTML = rows.map(row => row.kind === "group" ? renderGroupCard(row) : renderAssetCard(row)).join("");
  }

  function renderGroupCard(row) {
    const group = row.group;
    const hubPath = canonicalHubPath(group);
    const count = group.items?.length || row.items.length;
    const variants = (group.items || []).slice(0, 5).map(item => `<span>${escapeHtml(item.replace(group.displayTitle, "").trim() || item)}</span>`).join("");
    return `
      <article class="card group-card">
        <div class="card-top">
          <div class="card-heading">
            <h2>${escapeHtml(group.displayTitle)}</h2>
            <p class="card-description">Canonical group hub for ${escapeHtml(count)} ${escapeHtml(state.rules.variantCountLabel || "variants")}. Use this when browsing concepts instead of individual Flash UI exports.</p>
          </div>
          <div class="badge-stack"><span class="badge readiness ready">Group Hub</span></div>
        </div>
        <div class="meta viewer-meta">
          <span class="meta-chip"><span class="meta-label">Category</span><strong>${escapeHtml(group.category || guessCategory(group.displayTitle))}</strong></span>
          <span class="meta-chip"><span class="meta-label">Variants</span><strong>${escapeHtml(count)}</strong></span>
        </div>
        <div class="variant-strip" aria-label="Variants">${variants}</div>
        <div class="card-actions">
          <a class="btn primary" href="${escapeHtml(hubPath)}" target="_blank" rel="noreferrer">${escapeHtml(state.rules.groupCardCtaLabel || "Open Hub")}</a>
          <button class="btn" type="button" data-group-copy="${escapeHtml(hubPath)}">Copy Hub Link</button>
        </div>
      </article>
    `;
  }

  function renderAssetCard(row) {
    const item = row.item;
    const deployable = isDeployable(item);
    const title = displayTitle(item);
    const cardClass = row.groupedVariant ? " grouped-variant-card" : isArchive(item) ? " archive-card" : "";
    return `
      <article class="card${cardClass}">
        <div class="card-top">
          <div class="card-heading">
            <h2>${escapeHtml(title)}</h2>
            <p class="card-description">${escapeHtml(row.groupedVariant ? "Individual variant shown from grouped directory toggle." : (item.notes || "Ungrouped indexed asset."))}</p>
          </div>
          <div class="badge-stack"><span class="badge readiness ${deployable ? "ready" : "review"}">${deployable ? "Openable" : "Needs Review"}</span></div>
        </div>
        <div class="meta viewer-meta">
          <span class="meta-chip"><span class="meta-label">Category</span><strong>${escapeHtml(item.category || "Experiments")}</strong></span>
          <span class="meta-chip"><span class="meta-label">Status</span><strong>${escapeHtml(item.status || "unknown")}</strong></span>
        </div>
        <div class="card-actions">
          ${deployable ? `<a class="btn primary" href="${escapeHtml(item.livePath)}" target="_blank" rel="noreferrer">Open Site</a><button class="btn" data-group-copy="${escapeHtml(item.livePath)}" type="button">Copy Link</button>` : `<a class="btn primary" href="https://github.com/JFeimster/flash-ui-portfolio/tree/main/${escapeHtml(item.path || "")}" target="_blank" rel="noreferrer">View Source</a>`}
        </div>
      </article>
    `;
  }

  function bind() {
    search?.addEventListener("input", event => {
      state.query = event.target.value.trim();
      renderCards();
    });
    document.addEventListener("change", event => {
      const filter = event.target.closest("[data-group-filter]");
      if (filter) {
        state[filter.dataset.groupFilter] = filter.value;
        renderCards();
        return;
      }
      const toggle = event.target.closest("[data-group-toggle]");
      if (toggle) {
        state[toggle.dataset.groupToggle] = toggle.checked;
        renderShell();
      }
    });
    document.addEventListener("click", async event => {
      const button = event.target.closest("[data-group-copy]");
      if (!button) return;
      await navigator.clipboard.writeText(new URL(button.dataset.groupCopy, window.location.origin).href);
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = previous; }, 1400);
    });
  }

  async function init() {
    try {
      const [baseRegistry, batch5Manifest, staticRegistry, groupData, displayRules] = await Promise.all([
        fetchJson("/data/site-registry.json"),
        fetchJson("/data/site-registry-batch-5-additions.json").catch(() => ({})),
        fetchJson("/data/site-registry-static-extractions.json").catch(() => []),
        fetchJson("/data/asset-groups.json"),
        fetchJson("/data/group-display-rules.json").catch(() => DEFAULT_RULES)
      ]);
      const merged = new Map();
      [...baseRegistry, ...expandBatch5Manifest(batch5Manifest), ...(Array.isArray(staticRegistry) ? staticRegistry.map(normalizeExtractionItem) : [])].forEach(item => {
        const key = item.path || item.slug || item.title;
        if (key) merged.set(key, item);
      });
      state.items = Array.from(merged.values());
      state.groups = groupData.groups || [];
      state.rules = { ...DEFAULT_RULES, ...displayRules };
      state.showArchives = Boolean(state.rules.showArchivesByDefault);
      state.showNeedsReview = Boolean(state.rules.showNeedsReviewByDefault);
      state.showIndividualVariants = !state.rules.suppressVariantsByDefault;
      bind();
      renderShell();
    } catch (error) {
      console.warn("Grouped directory layer failed; falling back to base app renderer.", error);
    }
  }

  window.setTimeout(init, 120);
})();
