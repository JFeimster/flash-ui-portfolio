(() => {
  const page = document.body.dataset.page || "home";
  const isCatalog = page === "catalog";
  const params = new URLSearchParams(window.location.search);
  const isPublicView = params.get("view") === "public";
  const repoUrl = "https://github.com/JFeimster/flash-ui-portfolio";
  const state = { entries: [], groups: [], curation: [], query: "", category: new URLSearchParams(window.location.search).get("category") || "All", availability: "All", sort: "recommended", showArchives: !isPublicView, showApps: !isPublicView };
  const defaults = { primaryCtaLabel: "Open Project", sourceCtaLabel: "View Source", detailsCtaLabel: "View Details" };
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const slugify = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const titleFor = item => String(item.displayTitle || item.title || item.path || "Untitled project").replace(/^sites\s+/i, "").replace(/\s+index\.html$/i, "").replace(/\.html$/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
  const sourceUrl = item => `${repoUrl}/${/\.[a-z0-9]+$/i.test(item.originalPath || item.path || "") ? "blob" : "tree"}/main/${String(item.originalPath || item.path || "").replace(/^\//, "").split("/").map(encodeURIComponent).join("/")}`;

  function getCuration(item) {
    const keys = [item.slug, item.title, item.displayTitle, item.groupId, slugify(item.title), slugify(item.displayTitle)].filter(Boolean).map(String);
    return state.curation.find(entry => keys.includes(String(entry.slug)) || keys.includes(String(entry.title)) || keys.includes(slugify(entry.slug)) || keys.includes(slugify(entry.title))) || null;
  }

  function availability(item) {
    const status = item.resolutionStatus || item.status;
    if (status === "standalone-app") return { label: "Standalone Deployment Required", tone: "deploy", key: "standalone" };
    if (status === "archive") return { label: "Archive / Source Only", tone: "archive", key: "archive" };
    if (status === "unresolved" || status === "missing-entrypoint") return { label: "Needs Repair", tone: "repair", key: "repair" };
    if (item.productionVerification === "verified") return { label: "Verified Live", tone: "verified", key: "verified" };
    return { label: "Local Route Valid / Production Unverified", tone: "local", key: "local" };
  }

  function isVariant(item) { return Boolean(item.canonicalGroupId && /\/variant-\d+\/?$/i.test(item.resolvedPath || "")); }
  function isVisible(item) {
    const status = availability(item).key;
    if (isPublicView && !["verified", "local"].includes(status)) return false;
    if (!state.showArchives && status === "archive") return false;
    if (!state.showApps && status === "standalone") return false;
    return true;
  }

  function groupRows() {
    return state.groups.map(group => {
      const members = state.entries.filter(item => item.canonicalGroupId === group.groupId);
      const hub = members.find(item => item.type === "group-hub") || state.entries.find(item => item.slug === group.groupId && item.resolutionStatus === "resolved");
      const variants = members.filter(isVariant);
      return { kind: "group", group, hub, variants, variantCount: variants.length || group.variantCount || group.variantNumbers?.length || 0, title: group.displayTitle || titleFor(hub || group) };
    }).filter(row => row.hub || row.variants.length || row.group.hubPath);
  }

  function ungroupedRows() { return state.entries.filter(item => !item.canonicalGroupId && !isVariant(item)).map(item => ({ kind: "asset", item, title: titleFor(item) })); }
  function rowAvailability(row) { return row.kind === "group" ? availability(row.hub || { resolutionStatus: "unresolved" }) : availability(row.item); }
  function rowCategory(row) { return row.kind === "group" ? row.group.category || "Experiments" : row.item.category || "Experiments"; }
  function rowText(row) { return row.kind === "group" ? [row.title, row.group.groupId, row.group.category, row.group.groupType, row.group.items?.join(" ")].join(" ").toLowerCase() : [row.title, row.item.slug, row.item.category, row.item.type, row.item.originalPath, row.item.resolutionReason, row.item.notes].join(" ").toLowerCase(); }
  function rowMatches(row) {
    const status = rowAvailability(row);
    return (!state.query || rowText(row).includes(state.query.toLowerCase())) && (state.category === "All" || rowCategory(row) === state.category) && (state.availability === "All" || status.key === state.availability) && isVisible(row.kind === "group" ? (row.hub || { resolutionStatus: "unresolved" }) : row.item);
  }
  function sortRows(rows) {
    return [...rows].sort((a, b) => {
      if (state.sort === "title") return a.title.localeCompare(b.title);
      if (state.sort === "variants") return (b.variantCount || 0) - (a.variantCount || 0) || a.title.localeCompare(b.title);
      if (state.sort === "availability") return rowAvailability(a).label.localeCompare(rowAvailability(b).label) || a.title.localeCompare(b.title);
      const aFeatured = getCuration(a.group || a.item)?.featured ? 1 : 0;
      const bFeatured = getCuration(b.group || b.item)?.featured ? 1 : 0;
      return bFeatured - aFeatured || (b.variantCount || 0) - (a.variantCount || 0) || a.title.localeCompare(b.title);
    });
  }

  function renderStats() {
    const stats = {
      familyCount: groupRows().length,
      indexedCount: state.entries.length,
      resolvedCount: state.entries.filter(item => ["local", "verified"].includes(availability(item).key)).length,
      verifiedCount: state.entries.filter(item => availability(item).key === "verified").length,
      repairCount: state.entries.filter(item => availability(item).key === "repair").length,
      appCount: state.entries.filter(item => availability(item).key === "standalone").length,
      archiveCount: state.entries.filter(item => availability(item).key === "archive").length
    };
    Object.entries(stats).forEach(([key, value]) => { const node = $(`[data-stat="${key}"]`); if (node) node.textContent = String(value); });
    const visibleNode = $("#visibleCount");
    if (visibleNode) visibleNode.textContent = String(document.querySelectorAll("#cardGrid .card, #featuredGrid .card").length);
  }

  function renderFilterControls(rows) {
    const category = $("#categoryFilter");
    const availabilitySelect = $("#availabilityFilter");
    const sort = $("#sortFilter");
    const categories = ["All", ...new Set(rows.map(rowCategory).sort())];
    if (category) category.innerHTML = categories.map(value => `<option value="${escapeHtml(value)}" ${state.category === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
    if (availabilitySelect) {
      const statuses = ["All", "local", "verified", "repair", "standalone", "archive"];
      const labels = { local: "Local route valid", verified: "Verified live", repair: "Needs repair", standalone: "Standalone app", archive: "Archive / source only" };
      availabilitySelect.innerHTML = statuses.map(value => `<option value="${value}" ${state.availability === value ? "selected" : ""}>${escapeHtml(value === "All" ? "All availability" : labels[value])}</option>`).join("");
    }
    if (sort) sort.value = state.sort;
  }

  function renderDetails(item, id) {
    const evidence = item.entrypointEvidence || {};
    const details = [["Original path", item.originalPath || "None"], ["Resolved path", item.resolvedPath || "None"], ["Resolution", item.resolutionStatus || "Unknown"], ["Reason", item.resolutionReason || "None"], ["Local source", item.sourceFile || "Unknown"], ["Original entrypoint", String(Boolean(evidence.originalEntrypointExists))], ["Resolved entrypoint", String(Boolean(evidence.resolvedEntrypointExists))], ["Production check", item.productionVerification === "verified" ? "Verified" : "Pending"], ["Evidence", (evidence.evidence || []).join("; ") || "None"]];
    return `<details class="details-panel" id="${escapeHtml(id)}"><summary>Dev details</summary><dl class="detail-grid">${details.map(([label, value]) => `<div class="detail-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></details>`;
  }

  function renderActions(item, options = {}) {
    const status = availability(item);
    const detailsId = `details-${slugify(item.slug || item.title || item.originalPath)}`;
    const source = `<a class="btn" href="${escapeHtml(sourceUrl(item))}" target="_blank" rel="noreferrer">${defaults.sourceCtaLabel}</a>`;
    const openPath = options.hubPath || item.resolvedPath;
    const copy = openPath ? `<button class="btn" type="button" data-copy-link="${escapeHtml(openPath)}">Copy link</button>` : "";
    if (options.hubPath && (status.key === "local" || status.key === "verified")) return `<a class="btn primary" href="${escapeHtml(options.hubPath)}">Explore Variants</a>${copy}${source}`;
    if (status.key === "local" || status.key === "verified") return `<a class="btn primary" href="${escapeHtml(item.resolvedPath)}">${defaults.primaryCtaLabel}</a>${copy}${source}`;
    return `<span class="btn disabled" aria-disabled="true">${escapeHtml(status.label)}</span>${source}<button class="btn subtle" type="button" data-open-details="${escapeHtml(detailsId)}">${defaults.detailsCtaLabel}</button>`;
  }

  function renderGroupCard(row) {
    const group = row.group;
    const item = row.hub || { resolutionStatus: "unresolved", category: group.category };
    const status = rowAvailability(row);
    const description = group.description || `Canonical ${group.category || "project"} family with ${row.variantCount || 0} preserved variant${row.variantCount === 1 ? "" : "s"}. Individual variants stay inside the family hub.`;
    const details = row.hub ? renderDetails(row.hub, `details-${group.groupId}`) : "";
    return `<article class="card group-card" data-family="${escapeHtml(group.groupId)}"><div class="card-top"><div class="card-heading"><span class="card-kicker">Project family</span><h2>${escapeHtml(row.title)}</h2><p class="card-description">${escapeHtml(description)}</p></div><span class="badge readiness ${status.tone}">${escapeHtml(status.label)}</span></div><div class="meta viewer-meta"><span class="meta-chip"><span class="meta-label">Category</span><strong>${escapeHtml(group.category || "Experiments")}</strong></span><span class="meta-chip"><span class="meta-label">Variants</span><strong>${escapeHtml(row.variantCount || 0)}</strong></span></div><div class="badge-row"><span class="badge viewer">Canonical hub</span>${group.recommendedPrimary ? `<span class="badge viewer">Recommended primary: ${escapeHtml(group.recommendedPrimary)}</span>` : ""}</div><div class="card-actions">${renderActions(item, { hubPath: group.hubPath || item.resolvedPath })}</div>${!isPublicView ? details : ""}</article>`;
  }

  function renderAssetCard(row) {
    const item = row.item;
    const status = availability(item);
    const detailsId = `details-${slugify(item.slug || item.title || item.originalPath)}`;
    const description = item.description || item.notes || item.resolutionReason || "Ungrouped indexed project asset.";
    return `<article class="card ${status.tone}-card"><div class="card-top"><div class="card-heading"><span class="card-kicker">Ungrouped project</span><h2>${escapeHtml(row.title)}</h2><p class="card-description">${escapeHtml(description)}</p></div><span class="badge readiness ${status.tone}">${escapeHtml(status.label)}</span></div><div class="meta viewer-meta"><span class="meta-chip"><span class="meta-label">Category</span><strong>${escapeHtml(item.category || "Experiments")}</strong></span><span class="meta-chip"><span class="meta-label">Type</span><strong>${escapeHtml(item.type || "Project")}</strong></span></div><div class="badge-row"><span class="badge viewer">${escapeHtml(item.source || "Indexed asset")}</span></div><div class="card-actions">${renderActions(item)}</div>${!isPublicView ? renderDetails(item, detailsId) : ""}</article>`;
  }

  function renderRows(container, rows, emptyTitle, emptyText) {
    if (!container) return;
    const visible = sortRows(rows.filter(rowMatches));
    container.innerHTML = visible.length ? visible.map(row => row.kind === "group" ? renderGroupCard(row) : renderAssetCard(row)).join("") : `<section class="empty"><h2>${escapeHtml(emptyTitle)}</h2><p>${escapeHtml(emptyText)}</p></section>`;
  }

  function renderHome() {
    const groups = groupRows();
    renderRows($("#featuredGrid"), sortRows(groups).slice(0, 6), "No featured families yet.", "The canonical registry is present, but no family can currently be shown.");
    const categoryGrid = $("#categoryGrid");
    if (categoryGrid) {
      const categories = new Map();
      groups.forEach(row => { const category = rowCategory(row); if (!categories.has(category)) categories.set(category, []); categories.get(category).push(row); });
      categoryGrid.innerHTML = [...categories.entries()].sort().map(([category, rows]) => `<a class="category-tile" href="/sites/?category=${encodeURIComponent(category)}"><span>${escapeHtml(category)}</span><strong>${rows.length}</strong><small>${escapeHtml(rows.slice(0, 2).map(row => row.title).join(" · "))}</small></a>`).join("");
    }
    renderStats();
  }

  function renderCatalog() {
    const groups = groupRows();
    const ungrouped = ungroupedRows();
    renderFilterControls([...groups, ...ungrouped]);
    renderRows($("#cardGrid"), groups, "No project families match.", "Clear the search or filters to see the canonical directory.");
    const ungroupedSection = $("#ungroupedSection");
    const ungroupedGrid = $("#ungroupedGrid");
    const rows = sortRows(ungrouped.filter(rowMatches));
    if (ungroupedSection && ungroupedGrid) { ungroupedSection.hidden = !rows.length; ungroupedGrid.innerHTML = rows.map(renderAssetCard).join(""); }
    renderStats();
  }

  function bindEvents() {
    $("#searchInput")?.addEventListener("input", event => { state.query = event.target.value.trim(); isCatalog ? renderCatalog() : renderHome(); });
    document.addEventListener("change", event => {
      const control = event.target.closest("[data-filter]");
      if (control) { state[control.dataset.filter] = control.value; renderCatalog(); return; }
      const toggle = event.target.closest("[data-toggle]");
      if (toggle) { state[toggle.dataset.toggle] = toggle.checked; renderCatalog(); }
    });
    document.addEventListener("click", async event => {
      const copy = event.target.closest("[data-copy-link]");
      if (copy) { try { await navigator.clipboard.writeText(new URL(copy.dataset.copyLink, window.location.origin).href); copy.textContent = "Copied"; window.setTimeout(() => { copy.textContent = "Copy link"; }, 1400); } catch (error) { console.warn("Copy failed", error); } }
      const details = event.target.closest("[data-open-details]");
      if (details) { const panel = document.getElementById(details.dataset.openDetails); if (panel) panel.open = true; }
    });
  }

  async function load() {
    try {
      const [routeData, curationData] = await Promise.all([
        fetch("/data/asset-route-resolution.json", { cache: "no-store" }).then(response => { if (!response.ok) throw new Error(`Route metadata failed: ${response.status}`); return response.json(); }),
        fetch("/data/asset-curation.json", { cache: "no-store" }).then(response => response.ok ? response.json() : ({ assetCuration: [] })).catch(() => ({ assetCuration: [] }))
      ]);
      state.entries = Array.isArray(routeData.entries) ? routeData.entries : [];
      state.groups = Array.isArray(routeData.groups) ? routeData.groups : [];
      state.curation = Array.isArray(curationData.assetCuration) ? curationData.assetCuration : [];
      document.body.classList.toggle("public-view", isPublicView);
      const notice = $("#viewModeNotice");
      if (notice) notice.innerHTML = isPublicView ? `<strong>Public directory</strong><span>Showing locally valid project routes. Production verification remains explicitly separate.</span><a class="btn subtle" href="${isCatalog ? "/sites/" : "/"}">Internal view</a>` : `<strong>Internal directory</strong><span>Archives, repair candidates, and standalone apps are visible for operator review.</span><a class="btn subtle" href="${isCatalog ? "/sites/?view=public" : "/?view=public"}>Public view</a>`;
      bindEvents();
      isCatalog ? renderCatalog() : renderHome();
    } catch (error) {
      console.error(error);
      const target = $("#cardGrid") || $("#featuredGrid");
      if (target) target.innerHTML = `<section class="empty"><h2>Route metadata could not be loaded.</h2><p>Run <code>scripts/generate-route-resolution.ps1</code> and refresh this page.</p></section>`;
    }
  }
  load();
})();
