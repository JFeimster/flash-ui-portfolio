(() => {
  let voltage = null, catalogCore = null;
  const dimensions = ["productSubcategory","productType","designThemeIds","industries","audiences","capabilities","lifecycle","architecture","distributionMethods","integrations"];
  const catalog = document.body.dataset.page === "catalog";
  const params = new URLSearchParams(location.search);
  const internal = params.get("view") === "internal";
  const storedFavorites = (() => { try { const data = JSON.parse(localStorage.getItem("flash-ui-saved-projects") || "[]"); return new Set(Array.isArray(data) ? data : []); } catch { return new Set(); } })();
  const state = { entries: [], groups: [], candidates: [], showcase: {}, previews: {}, packages: {}, review: {}, favorites: storedFavorites, favoritesOnly: params.get("saved") === "1", style: params.get("style") || "All", query: params.get("q") || "", category: params.get("category") || "All", type: params.get("type") || "All", browse: params.get("browse") || "all", sort: params.get("sort") || "featured", limit: 24 };
  state.filters = Object.fromEntries(dimensions.map(key => [key, params.get(key) || "All"]));
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const cleanTitle = value => String(value || "Project").replace(/^sites\s+/i, "").replace(/\s*index\.html$/i, "").replace(/\.html$/i, "").replace(/[-_]+/g, " ").trim();
  const available = item => item?.resolutionStatus === "resolved" && Boolean(item.resolvedPath);
  const usePath = path => `/use-asset/?asset=${encodeURIComponent(path)}`;
  const categoryCopy = {
    "Partner Sites": "Partner program pages and referral interface concepts.",
    "Funding Tools": "Financial planning and funding tool interface concepts.",
    "AI Agent Libraries": "AI agent browsing and workspace interface concepts.",
    "Content Hubs": "Content browsing and publishing page layouts.",
    "Personal Brand Sites": "Personal portfolio and publishing page layouts.",
    "Static Site Factories": "Site creation and configuration interface concepts.",
    "Lead Magnets": "Landing pages for introducing a resource and collecting interest.",
    "Widgets": "Embeddable widget and configuration interface concepts."
  };
  function presentation(row) {
    const copy = state.showcase[row.id] || {};
    const preview = state.previews[row.id] || {};
    const cachedImage = state.captures?.[row.id]?.image;
    return { ...row, title: copy.title || row.title, description: copy.description || row.description || row.item.description || categoryCopy[row.category] || "Static page layout from the interface experiment collection.", audience: copy.audience || "", purpose: copy.purpose || "", industry: copy.industry || "", priority: copy.featuredPriority || row.priority || 0, visualStyle: preview.style || "", tone: preview.tone || "mint", previewLabel: preview.label || "", previewTarget: preview.target || row.previewPath || row.path, image: cachedImage || preview.image || "" };
  }
  function rows() {
    return (state.records || []).filter(row => internal || row.path).map(row => catalogCore.themePreview(row, state.filters.designThemeIds));
  }

  const typeOf = row => row.path ? (row.count > 1 ? "variants" : "single") : row.item.resolutionStatus === "archive" ? "archive" : row.item.resolutionStatus === "standalone-app" ? "app" : "repair";
  const statusLabel = row => ({ archive: "Source archive", app: "Separate deployment needed", repair: "Preview needs repair" }[typeOf(row)] || "HTML preview");
  function matches(row) {
    const text = [row.title, row.description, row.purpose, row.industry, row.audience, row.category, ...(row.members || []).flatMap(item => [item.title, item.description]), internal ? row.item.originalPath : ""].join(" ").toLowerCase();
    return catalogCore.matchesCatalog(row, { ...state.filters, q: state.query }) && (state.category === "All" || state.category === row.category) && (state.type === "All" || typeOf(row) === state.type) && (state.style === "All" || row.visualStyle === state.style) && (state.browse === "all" || row.priority > 0) && (!state.favoritesOnly || state.favorites.has(row.id));
  }
  function sorted(list) {
    return catalogCore.sortCatalog(list, state.sort, state.query);
  }

  function details(item) {
    const fields = [["Source path", item.sourcePath || item.originalPath], ["Preview route", item.resolvedPath || "Unavailable"], ["Resolution", item.resolutionStatus], ["Evidence", item.resolutionReason], ["Production check", item.productionVerification === "verified" ? "Verified in recorded smoke test" : "Not verified"], ["Document title", item.documentTitle], ["Structure", item.structuralValidity ? JSON.stringify(item.structuralValidity) : "Entrypoint existence checked"]];
    return `<details class="details-panel"><summary>Operator details</summary><dl>${fields.filter(([, value]) => value).map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}</dl>${item.sourceUrl ? `<a href="${esc(item.sourceUrl)}" target="_blank" rel="noreferrer">View source â†—</a>` : "<p>Source location unresolved.</p>"}</details>`;
  }
  function card(row) {
    const path = row.path && internal && row.count > 1 ? (row.path + "?view=internal") : row.path;
    const title = esc(row.title);
    const category = esc([row.catalog?.productType, row.category].filter(Boolean).join(" · "));
    const themeLabel = row.catalog.designThemeIds.map(id => state.themes.themes.find(t => t.id === id)?.name || id).join(" · ") || row.visualStyle;
    const style = themeLabel ? '<span class="card-style">' + esc(themeLabel) + '</span>' : '';
    const action = path
      ? '<a class="btn primary" href="' + esc(path) + '" aria-label="' + esc((row.count > 1 ? "Explore variants of " : "Open ") + row.title) + '">' + (row.count > 1 ? 'Explore Variants' : 'ðŸš€ Open Site') + '<span aria-hidden="true">â†—</span></a>'
      : '<p class="repair-note">' + esc(statusLabel(row)) + '</p>';
    const reuseRoute = row.previewPath || row.path;
    const useAction = row.count <= 1 && (state.packages[reuseRoute] || state.review[reuseRoute]) ? '<a class="btn" href="' + esc(usePath(reuseRoute)) + '">' + (state.packages[reuseRoute] ? 'Use This Asset' : 'Inspect for Reuse') + '</a>' : '';
    const preview = voltage ? voltage.quickPreview(row) : '';
    return '<article class="card voltage-card" data-project="' + esc(row.id) + '">'
      + (voltage ? voltage.artwork(row,state.favorites.has(row.id)) : '')
      + '<div class="card-content"><div class="card-topline"><span class="card-category">' + category + '</span>' + style + (row.count ? '<span class="variant-count">' + row.count + (row.count === 1 ? ' preview' : ' variations') + '</span>' : '') + '</div>'
      + '<h2>' + title + '</h2><p class="card-description">' + esc(row.description) + '</p>'
      + '<p class="card-audience">' + esc(row.catalog.audiences[0] || row.catalog.capabilities[0] || '') + '</p>'
      + '<div class="card-bottom">' + preview + action + useAction + '</div></div>'
      + (internal ? details(row.item) : '') + '</article>';
  }
  function empty() { return '<section class="empty"><h2>No projects found</h2><p>Try a broader search or clear the filters.</p><button class="btn" id="resetFilters" type="button">Clear filters</button></section>'; }
  function renderInventory() {
    const node = $("#internalInventory");
    if (!internal || !node) return;
    node.hidden = false;
    const repairs = state.entries.filter(item => ["unresolved", "missing-entrypoint", "invalid-entrypoint"].includes(item.resolutionStatus));
    node.innerHTML = `<div class="section-heading"><div><span class="eyebrow">Operator inventory</span><h2>Route evidence & candidates</h2></div><a href="/sites/">Public directory â†—</a></div><p>${state.entries.length} indexed records Â· ${repairs.length} repair records Â· ${state.entries.filter(item => item.resolutionStatus === "archive").length} archives. Local HTML checks do not verify production availability.</p><details class="inventory-panel"><summary>${state.candidates.length} variant folders outside the grouped index</summary><p>Preserved candidates for review; these do not create additional canonical projects.</p>${state.candidates.map(candidate => `<section class="candidate"><h3>${esc(cleanTitle(candidate.familyId))}</h3><ul>${state.entries.filter(item => item.canonicalGroupId === candidate.familyId).map(item => `<li>${available(item) ? `<a href="${esc(item.resolvedPath)}">Variant ${item.variantNumber}: ${esc(item.title)}</a>` : `Variant ${item.variantNumber}: preview needs repair`}${details(item)}</li>`).join("")}</ul></section>`).join("")}</details><details class="inventory-panel"><summary>${repairs.length} unresolved or incomplete source records</summary>${repairs.map(item => `<section class="candidate"><h3>${esc(cleanTitle(item.title))}</h3>${details(item)}</section>`).join("")}</details>`;
  }
  function render() {
    const all = rows();
    if (!catalog) {
      const featured = all.filter(row => row.priority && row.path).sort((a, b) => a.priority - b.priority).slice(0, 6);
      $("#featuredGrid").innerHTML = featured.map(card).join("") || '<p>No selected projects are available.</p>';
      const categories = [...new Set(all.filter(row => row.path).map(row => row.category))].sort();
      $("#categoryGrid").innerHTML = categories.map(category => `<a class="category-tile" href="/sites/?category=${encodeURIComponent(category)}"><span>${esc(category)}</span><span aria-hidden="true">â†—</span></a>`).join("");
    } else {
      const result = sorted(all.filter(matches));
      $("#cardGrid").innerHTML = result.length ? result.slice(0, state.limit).map(card).join("") : empty();
      $("#visibleCount").textContent = `${Math.min(result.length, state.limit)} of ${result.length} project${result.length === 1 ? "" : "s"}`;
      $("#loadMore").hidden = result.length <= state.limit;
    }
  }
  function setup() {
    if (catalog) {
      const all = rows();
      const extra = document.createElement("details"); extra.className = "catalog-advanced";
      extra.innerHTML = '<summary>Product details & advanced filters</summary><div class="filter-grid">' + dimensions.filter(key => !["productType","designThemeIds","productSubcategory"].includes(key)).map(key => '<label><span>' + esc(key.replace(/([A-Z])/g, ' $1')) + '</span><select data-catalog-filter="' + key + '"></select></label>').join('') + '</div>';
      $(".toolbar").append(extra);
      for (const key of ["productType","productSubcategory","designThemeIds"]) {
        const label = document.createElement("label"); label.innerHTML = '<span>' + esc({productType:"Product type",productSubcategory:"Subcategory",designThemeIds:"Design theme"}[key]) + '</span><select data-catalog-filter="' + key + '"></select>';
        $(".filter-grid").append(label);
      }
      for (const key of dimensions) {
        const select = document.querySelector(`[data-catalog-filter="${key}"]`);
        const values = [...new Set(all.flatMap(row => { const v = row.catalog[key]; return Array.isArray(v) ? v.map(i => typeof i === 'object' ? i.id || i.name : i) : v ? [v] : []; }).filter(Boolean))].sort();
        if (state.filters[key] !== "All" && !values.includes(state.filters[key])) values.push(state.filters[key]);
        select.innerHTML = '<option value="All">All</option>' + values.map(value => '<option value="' + esc(value) + '">' + esc(key === 'designThemeIds' ? state.themes.themes.find(t => t.id === value)?.name || value : value) + '</option>').join('');
        select.value = state.filters[key];
      }
      const reset = document.createElement('button'); reset.id = 'clearCatalogFilters'; reset.type = 'button'; reset.className = 'btn'; reset.textContent = 'Reset all filters'; $(".toolbar-actions").append(reset);
      const active = document.createElement('div'); active.id = 'activeCatalogFilters'; active.setAttribute('aria-live','polite'); $(".toolbar").append(active);
      for (const [value,label] of [["relevance","Relevance"],["created","Recently created"],["updated","Recently updated"]]) $("#sortFilter").add(new Option(label,value));
      const categories = ["All", ...new Set(all.map(row => row.category).sort())];
      if (!categories.includes(state.category)) categories.push(state.category);
      $("#categoryFilter").innerHTML = categories.map(category => `<option value="${esc(category)}">${esc(category === "All" ? "All categories" : category)}</option>`).join("");
      const types = [["All", "All projects"], ["variants", "With variants"], ["single", "Single preview"], ...(internal ? [["repair", "Needs repair"], ["app", "Standalone apps"], ["archive", "Archives"]] : [])];
      $("#typeFilter").innerHTML = types.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
      const styles = ["All", ...new Set(all.map(row => row.visualStyle).filter(Boolean))].sort((a,b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));
      if (!styles.includes(state.style)) state.style = "All";
      $("#styleFilter").innerHTML = styles.map(value => '<option value="' + esc(value) + '">' + esc(value === "All" ? "All visual styles" : value) + '</option>').join("");
      if (!types.some(([value]) => value === state.type)) state.type = "All";
      if (!["all", "featured"].includes(state.browse)) state.browse = "all";
      if (!["featured", "title", "variants", "relevance", "created", "updated"].includes(state.sort)) state.sort = "featured";
      for (const key of ["browse", "category", "type", "style", "sort"]) $(`#${key}Filter`).value = state[key];
      const favoritesButton = $("#favoritesOnly");
      const syncFavorites = () => { if (favoritesButton) favoritesButton.setAttribute("aria-pressed", String(state.favoritesOnly)); const count = $("#favoritesCount"); if (count) count.textContent = state.favorites.size ? "(" + state.favorites.size + ")" : ""; };
      syncFavorites();
      $("#searchInput").value = state.query;
      const update = () => {
        const url = new URL(location.href);
        for (const [key, value] of [["q", state.query], ["browse", state.browse], ["category", state.category], ["type", state.type], ["style", state.style], ["sort", state.sort], ["saved", state.favoritesOnly ? "1" : ""]]) {
          if (!value || value === "All" || (key === "browse" && value === "all") || (key === "sort" && value === "featured")) url.searchParams.delete(key); else url.searchParams.set(key, value);
        }
        for (const [key,value] of Object.entries(state.filters)) { if (value === 'All') url.searchParams.delete(key); else url.searchParams.set(key,value); }
        const active = [...Object.entries(state.filters),['q',state.query],['category',state.category],['type',state.type],['style',state.style],['browse',state.browse],['saved',state.favoritesOnly ? 'Saved projects' : '']].filter(([,v]) => v && !['All','all'].includes(v));
        $('#activeCatalogFilters').innerHTML = active.map(([key,value]) => '<button type="button" class="btn" data-clear-dimension="' + esc(key) + '">' + esc(key + ': ' + value) + ' ×</button>').join('');
        history.replaceState(null, "", url); syncFavorites(); render();
      };
      $("#searchInput").addEventListener("input", event => { state.query = event.target.value.trim(); state.limit = 24; update(); });
      document.querySelectorAll("[data-filter]").forEach(node => node.addEventListener("change", event => { state[event.target.dataset.filter] = event.target.value; state.limit = 24; update(); }));
      document.querySelectorAll('[data-catalog-filter]').forEach(node => node.addEventListener('change', () => { state.filters[node.dataset.catalogFilter] = node.value; state.limit = 24; update(); }));
      document.addEventListener('click', event => { const key = event.target.closest('[data-clear-dimension]')?.dataset.clearDimension; if (!key) return; if (dimensions.includes(key)) { state.filters[key] = 'All'; document.querySelector(`[data-catalog-filter="${key}"]`).value = 'All'; } else if (key === 'q') { state.query = ''; $('#searchInput').value = ''; } else if (key === 'saved') state.favoritesOnly = false; else { state[key] = key === 'browse' ? 'all' : 'All'; $(`#${key}Filter`).value = state[key]; } state.limit = 24; update(); });
      favoritesButton?.addEventListener("click", () => { state.favoritesOnly = !state.favoritesOnly; state.limit = 24; update(); });
      $("#loadMore").addEventListener("click", () => { state.limit += 24; render(); });
      document.addEventListener("click", event => {
        if (!event.target.closest("#resetFilters, #clearCatalogFilters")) return;
        for (const key of dimensions) { state.filters[key] = "All"; document.querySelector(`[data-catalog-filter="${key}"]`).value = "All"; }
        state.sort = "featured"; $("#sortFilter").value = "featured";
        state.query = ""; state.category = "All"; state.type = "All"; state.style = "All"; state.browse = "all"; state.favoritesOnly = false; state.limit = 24;
        $("#searchInput").value = ""; $("#browseFilter").value = "all"; $("#categoryFilter").value = "All"; $("#typeFilter").value = "All"; $("#styleFilter").value = "All";
        update(); $("#searchInput").focus();
      });
    }
    if (internal) { $("#viewModeNotice").hidden = false; $("#viewModeNotice").textContent = "Operator view Â· source records and repair details included"; }
    renderInventory(); render();
    if (catalog) { document.querySelector("#searchInput").dispatchEvent(new Event("input")); }
  }
  async function init() {
    try {
      const [data, showcase, collections, previews, packages, registry, voltageModule] = await Promise.all([
        fetch("/data/asset-route-resolution.json").then(response => { if (!response.ok) throw new Error("Directory unavailable"); return response.json(); }),
        fetch("/data/asset-showcase.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/curated-collections.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/asset-previews.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/asset-packages.json").then(response => response.ok ? response.json() : { entries: {} }).catch(() => ({ entries: {} })),
        fetch("/data/site-registry.json").then(response => response.ok ? response.json() : []).catch(() => []),
        import("/assets/js/voltage-ui.js")
      ]);
      const { applyCuratedCollections } = await import("/assets/js/curated-collections.js");
      const model = applyCuratedCollections(data, collections);
      // Externally hosted sites use the canonical site registry, not local route resolution.
      // Keep their real deployment URLs so the directory never invents /sites/ paths.
      const externalSites = (registry || []).filter(item => (item.status === "live-external" && /^https:\/\//.test(item.livePath || "")) || (item.type === "resource-library" && /^\/sites\//.test(item.livePath || "")));
      const indexedUrls = new Set((model.entries || []).map(item => item.resolvedPath));
      for (const item of externalSites) {
        if (indexedUrls.has(item.livePath)) continue;
        model.entries.push({
          ...item, originalPath: item.path, sourcePath: item.path,
          resolvedPath: item.livePath, resolutionStatus: "resolved",
          resolutionReason: "External deployment linked from site registry",
          sourceUrl: item.sourceUrl || item.path,
          productionVerification: "unverified"
        });
        indexedUrls.add(item.livePath);
      }
      state.entries = model.entries || []; state.groups = model.groups || []; state.candidates = model.groupCandidates || []; state.showcase = showcase.projects || {}; state.previews = previews.projects || {}; state.packages = packages.entries || {}; state.review = packages.review || {}; voltage = voltageModule;
      state.captures = previews.projects || {};
      const readOptional = file => fetch('/data/' + file).then(r => r.ok ? r.json() : {}).catch(() => ({}));
      const [core,themes,groups,contracts,external] = await Promise.all([import('/assets/js/catalog-core.mjs'),readOptional('transferable-design-themes.json'),readOptional('asset-groups.json'),readOptional('variant-route-contracts.json'),readOptional('external-project-references.json')]);
      catalogCore = core; state.themes = themes;
      state.records = core.normalizeCatalog({ routes:model,showcase,previews,themes,registry:Array.isArray(registry) ? registry : [],groups,contracts,external }).map(row => ({...row,description:row.description || categoryCopy[row.category] || 'Static page layout from the interface experiment collection.'}));
      setup();
      voltage.mountVoltage({ rows, rerender: () => { render(); if (catalog) { const count = $("#favoritesCount"); if (count) count.textContent = state.favorites.size ? "(" + state.favorites.size + ")" : ""; } }, favorites: state.favorites });
      document.addEventListener('click', event => {
        const preview = event.target.closest('[data-quick-preview]');
        if (!preview) return;
        const link = $('#quickPreviewUse');
        if (!link) return;
        const path = preview.getAttribute('data-preview-url');
        link.hidden = !state.packages[path] && !state.review[path];
        if (!link.hidden) link.href = usePath(path);
      });
    } catch (error) {
      console.error(error);
      ($("#cardGrid") || $("#featuredGrid")).innerHTML = '<section class="empty"><h2>Projects could not be loaded</h2><p>Please reload the page to try again.</p></section>';
    }
  }
  init();
})();
