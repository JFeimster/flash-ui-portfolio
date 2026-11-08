(() => {
  let voltage = null;
  const catalog = document.body.dataset.page === "catalog";
  const params = new URLSearchParams(location.search);
  const internal = params.get("view") === "internal";
  const storedFavorites = (() => { try { const data = JSON.parse(localStorage.getItem("flash-ui-saved-projects") || "[]"); return new Set(Array.isArray(data) ? data : []); } catch { return new Set(); } })();
  const state = { entries: [], groups: [], candidates: [], showcase: {}, previews: {}, favorites: storedFavorites, favoritesOnly: params.get("saved") === "1", style: params.get("style") || "All", query: params.get("q") || "", category: params.get("category") || "All", type: params.get("type") || "All", sort: params.get("sort") || "featured" };
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const cleanTitle = value => String(value || "Project").replace(/^sites\s+/i, "").replace(/\s*index\.html$/i, "").replace(/\.html$/i, "").replace(/[-_]+/g, " ").trim();
  const available = item => item?.resolutionStatus === "resolved" && Boolean(item.resolvedPath);
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
    return { ...row, title: copy.title || row.title, description: copy.description || row.description || row.item.description || categoryCopy[row.category] || "Static page layout from the interface experiment collection.", audience: copy.audience || "", priority: copy.featuredPriority || row.priority || 0, visualStyle: preview.style || "", tone: preview.tone || "mint", previewLabel: preview.label || "", previewTarget: preview.target || (row.count ? "" : row.path), image: preview.image || "" };
  }
  function rows() {
    const grouped = state.groups.map(group => {
      const members = state.entries.filter(entry => entry.canonicalGroupId === group.groupId);
      const variants = members.filter(entry => entry.variantNumber && available(entry));
      const hub = members.find(entry => entry.type === "group-hub") || members.find(entry => entry.resolvedPath === group.hubPath);
      const item = hub || variants[0] || members[0] || { resolutionStatus: "unresolved" };
      return presentation({ id: group.groupId, title: group.displayTitle, category: group.category || "Experiments", description: group.description || "", priority: group.featuredPriority || 0, item, count: variants.length, path: group.curatedCollection && variants.length ? group.hubPath : (available(hub) ? hub.resolvedPath : variants[0]?.resolvedPath || (available(item) ? item.resolvedPath : "")) });
    });
    const seen = new Set(grouped.map(row => row.path).filter(Boolean));
    const singles = state.entries.filter(entry => !entry.canonicalGroupId).filter(entry => {
      if (!entry.resolvedPath) return true;
      if (seen.has(entry.resolvedPath)) return false;
      seen.add(entry.resolvedPath); return true;
    }).map(item => presentation({ id: item.slug, title: cleanTitle(item.title), category: item.category || "Experiments", item, count: 0, path: available(item) ? item.resolvedPath : "" }));
    return [...grouped, ...singles].filter(row => internal || row.path);
  }
  const typeOf = row => row.path ? (row.count ? "variants" : "single") : row.item.resolutionStatus === "archive" ? "archive" : row.item.resolutionStatus === "standalone-app" ? "app" : "repair";
  const statusLabel = row => ({ archive: "Source archive", app: "Separate deployment needed", repair: "Preview needs repair" }[typeOf(row)] || "HTML preview");
  function matches(row) {
    const text = [row.title, row.description, row.audience, row.category, internal ? row.item.originalPath : ""].join(" ").toLowerCase();
    return (!state.query || text.includes(state.query.toLowerCase())) && (state.category === "All" || state.category === row.category) && (state.type === "All" || typeOf(row) === state.type) && (state.style === "All" || row.visualStyle === state.style) && (!state.favoritesOnly || state.favorites.has(row.id));
  }
  function sorted(list) {
    return [...list].sort((a, b) => {
      if (state.sort === "variants") return b.count - a.count || a.title.localeCompare(b.title);
      if (state.sort === "featured") return (a.priority || Infinity) - (b.priority || Infinity) || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
  }
  function details(item) {
    const fields = [["Source path", item.sourcePath || item.originalPath], ["Preview route", item.resolvedPath || "Unavailable"], ["Resolution", item.resolutionStatus], ["Evidence", item.resolutionReason], ["Production check", item.productionVerification === "verified" ? "Verified in recorded smoke test" : "Not verified"], ["Document title", item.documentTitle], ["Structure", item.structuralValidity ? JSON.stringify(item.structuralValidity) : "Entrypoint existence checked"]];
    return `<details class="details-panel"><summary>Operator details</summary><dl>${fields.filter(([, value]) => value).map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}</dl>${item.sourceUrl ? `<a href="${esc(item.sourceUrl)}" target="_blank" rel="noreferrer">View source ↗</a>` : "<p>Source location unresolved.</p>"}</details>`;
  }
  function card(row) {
    const path = row.path && internal && row.count ? (row.path + "?view=internal") : row.path;
    const title = esc(row.title);
    const category = esc(row.category);
    const style = row.visualStyle ? '<span class="card-style">' + esc(row.visualStyle) + '</span>' : '';
    const action = path
      ? '<a class="btn primary" href="' + esc(path) + '" aria-label="' + esc((row.count ? "Explore variants of " : "Open ") + row.title) + '">' + (row.count ? 'Explore Variants' : '🚀 Open Site') + '<span aria-hidden="true">↗</span></a>'
      : '<p class="repair-note">' + esc(statusLabel(row)) + '</p>';
    return '<article class="card voltage-card" data-project="' + esc(row.id) + '">'
      + (voltage ? voltage.artwork(row,state.favorites.has(row.id)) : '')
      + '<div class="card-content"><div class="card-topline"><span class="card-category">' + category + '</span>' + style + '</div>'
      + '<h2>' + title + '</h2><p class="card-description">' + esc(row.description) + '</p>'
      + '<div class="card-bottom">' + (row.count ? '<span class="variant-count">' + row.count + ' variation' + (row.count === 1 ? '' : 's') + '</span>' : '') + action + '</div></div>'
      + (internal ? details(row.item) : '') + '</article>';
  }
  function empty() { return '<section class="empty"><h2>No projects found</h2><p>Try a broader search or clear the filters.</p><button class="btn" id="resetFilters" type="button">Clear filters</button></section>'; }
  function renderInventory() {
    const node = $("#internalInventory");
    if (!internal || !node) return;
    node.hidden = false;
    const repairs = state.entries.filter(item => ["unresolved", "missing-entrypoint", "invalid-entrypoint"].includes(item.resolutionStatus));
    node.innerHTML = `<div class="section-heading"><div><span class="eyebrow">Operator inventory</span><h2>Route evidence & candidates</h2></div><a href="/sites/">Public directory ↗</a></div><p>${state.entries.length} indexed records · ${repairs.length} repair records · ${state.entries.filter(item => item.resolutionStatus === "archive").length} archives. Local HTML checks do not verify production availability.</p><details class="inventory-panel"><summary>${state.candidates.length} variant folders outside the grouped index</summary><p>Preserved candidates for review; these do not create additional canonical projects.</p>${state.candidates.map(candidate => `<section class="candidate"><h3>${esc(cleanTitle(candidate.familyId))}</h3><ul>${state.entries.filter(item => item.canonicalGroupId === candidate.familyId).map(item => `<li>${available(item) ? `<a href="${esc(item.resolvedPath)}">Variant ${item.variantNumber}: ${esc(item.title)}</a>` : `Variant ${item.variantNumber}: preview needs repair`}${details(item)}</li>`).join("")}</ul></section>`).join("")}</details><details class="inventory-panel"><summary>${repairs.length} unresolved or incomplete source records</summary>${repairs.map(item => `<section class="candidate"><h3>${esc(cleanTitle(item.title))}</h3>${details(item)}</section>`).join("")}</details>`;
  }
  function render() {
    const all = rows();
    if (!catalog) {
      const featured = all.filter(row => row.priority && row.path).sort((a, b) => a.priority - b.priority).slice(0, 6);
      $("#featuredGrid").innerHTML = featured.map(card).join("") || '<p>No selected projects are available.</p>';
      const categories = [...new Set(all.filter(row => row.path).map(row => row.category))].sort();
      $("#categoryGrid").innerHTML = categories.map(category => `<a class="category-tile" href="/sites/?category=${encodeURIComponent(category)}"><span>${esc(category)}</span><span aria-hidden="true">↗</span></a>`).join("");
    } else {
      const result = sorted(all.filter(matches));
      $("#cardGrid").innerHTML = result.length ? result.map(card).join("") : empty();
      $("#visibleCount").textContent = `${result.length} project${result.length === 1 ? "" : "s"}`;
    }
  }
  function setup() {
    if (catalog) {
      const all = rows();
      const categories = ["All", ...new Set(all.map(row => row.category).sort())];
      if (!categories.includes(state.category)) categories.push(state.category);
      $("#categoryFilter").innerHTML = categories.map(category => `<option value="${esc(category)}">${esc(category === "All" ? "All categories" : category)}</option>`).join("");
      const types = [["All", "All projects"], ["variants", "With variants"], ["single", "Single preview"], ...(internal ? [["repair", "Needs repair"], ["app", "Standalone apps"], ["archive", "Archives"]] : [])];
      $("#typeFilter").innerHTML = types.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
      const styles = ["All", ...new Set(all.map(row => row.visualStyle).filter(Boolean))].sort((a,b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));
      if (!styles.includes(state.style)) state.style = "All";
      $("#styleFilter").innerHTML = styles.map(value => '<option value="' + esc(value) + '">' + esc(value === "All" ? "All visual styles" : value) + '</option>').join("");
      if (!types.some(([value]) => value === state.type)) state.type = "All";
      if (!["featured", "title", "variants"].includes(state.sort)) state.sort = "featured";
      for (const key of ["category", "type", "style", "sort"]) $(`#${key}Filter`).value = state[key];
      const favoritesButton = $("#favoritesOnly");
      const syncFavorites = () => { if (favoritesButton) favoritesButton.setAttribute("aria-pressed", String(state.favoritesOnly)); const count = $("#favoritesCount"); if (count) count.textContent = state.favorites.size ? "(" + state.favorites.size + ")" : ""; };
      syncFavorites();
      $("#searchInput").value = state.query;
      const update = () => {
        const url = new URL(location.href);
        for (const [key, value] of [["q", state.query], ["category", state.category], ["type", state.type], ["style", state.style], ["sort", state.sort], ["saved", state.favoritesOnly ? "1" : ""]]) {
          if (!value || value === "All" || (key === "sort" && value === "featured")) url.searchParams.delete(key); else url.searchParams.set(key, value);
        }
        history.replaceState(null, "", url); syncFavorites(); render();
      };
      $("#searchInput").addEventListener("input", event => { state.query = event.target.value.trim(); update(); });
      document.querySelectorAll("[data-filter]").forEach(node => node.addEventListener("change", event => { state[event.target.dataset.filter] = event.target.value; update(); }));
      favoritesButton?.addEventListener("click", () => { state.favoritesOnly = !state.favoritesOnly; update(); });
      document.addEventListener("click", event => {
        if (!event.target.closest("#resetFilters")) return;
        state.query = ""; state.category = "All"; state.type = "All"; state.style = "All"; state.favoritesOnly = false;
        $("#searchInput").value = ""; $("#categoryFilter").value = "All"; $("#typeFilter").value = "All"; $("#styleFilter").value = "All";
        update(); $("#searchInput").focus();
      });
    }
    if (internal) { $("#viewModeNotice").hidden = false; $("#viewModeNotice").textContent = "Operator view · source records and repair details included"; }
    renderInventory(); render();
  }
  async function init() {
    try {
      const [data, showcase, collections, previews, voltageModule] = await Promise.all([
        fetch("/data/asset-route-resolution.json").then(response => { if (!response.ok) throw new Error("Directory unavailable"); return response.json(); }),
        fetch("/data/asset-showcase.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/curated-collections.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/asset-previews.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        import("/assets/js/voltage-ui.js")
      ]);
      const { applyCuratedCollections } = await import("/assets/js/curated-collections.js");
      const model = applyCuratedCollections(data, collections);
      state.entries = model.entries || []; state.groups = model.groups || []; state.candidates = model.groupCandidates || []; state.showcase = showcase.projects || {}; state.previews = previews.projects || {}; voltage = voltageModule;
      setup();
      voltage.mountVoltage({ rows, rerender: () => { render(); if (catalog) { const count = $("#favoritesCount"); if (count) count.textContent = state.favorites.size ? "(" + state.favorites.size + ")" : ""; } }, favorites: state.favorites });
    } catch (error) {
      console.error(error);
      ($("#cardGrid") || $("#featuredGrid")).innerHTML = '<section class="empty"><h2>Projects could not be loaded</h2><p>Please reload the page to try again.</p></section>';
    }
  }
  init();
})();
