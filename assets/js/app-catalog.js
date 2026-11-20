(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const allowedCategories = ["All", "SaaS Applications", "AI Tools", "Prototypes"];
  const state = { apps: [], category: allowedCategories.includes(params.get("category")) ? params.get("category") : "All", query: params.get("q") || "", sort: "title" };
  const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const externalUrl = value => { try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; } catch { return ""; } };
  const categoryLabel = category => allowedCategories.includes(category) ? category : "Prototypes";

  function card(app) {
    const deployment = externalUrl(app.deploymentUrl);
    const source = externalUrl(app.repositoryUrl);
    const tags = Array.isArray(app.tags) ? app.tags.slice(0, 4) : [];
    return '<article class="card app-card">'
      + '<div class="app-card-head"><span class="card-category">' + esc(categoryLabel(app.category)) + '</span><span class="app-status">External deployment</span></div>'
      + '<h2>' + esc(app.title) + '</h2>'
      + '<p class="card-description">' + esc(app.description) + '</p>'
      + '<div class="app-tags">' + tags.map(tag => '<span>' + esc(tag) + '</span>').join("") + '</div>'
      + '<p class="app-framework">Framework: ' + esc(app.framework || "Not verified") + '</p>'
      + '<div class="card-bottom app-actions">'
      + (deployment ? '<a class="btn primary" href="' + esc(deployment) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + esc(app.title) + ' in a new tab">Open App ↗</a>' : '<span class="repair-note">Deployment not listed</span>')
      + (source ? '<a class="btn" href="' + esc(source) + '" target="_blank" rel="noopener noreferrer" aria-label="View source for ' + esc(app.title) + ' in a new tab">View Source ↗</a>' : "")
      + '</div></article>';
  }
  function syncUrl() {
    const url = new URL(location.href);
    if (state.category === "All") url.searchParams.delete("category"); else url.searchParams.set("category", state.category);
    if (!state.query) url.searchParams.delete("q"); else url.searchParams.set("q", state.query);
    history.replaceState(null, "", url);
  }
  function render() {
    document.querySelectorAll("[data-category]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === state.category)));
    const query = state.query.toLowerCase();
    const results = state.apps.filter(app => (state.category === "All" || app.category === state.category) &&
      (!query || [app.title, app.description, app.category, app.framework, ...(app.tags || [])].join(" ").toLowerCase().includes(query)));
    results.sort((a, b) => state.sort === "category" ? String(a.category).localeCompare(String(b.category)) || a.title.localeCompare(b.title) : a.title.localeCompare(b.title));
    $("#appCount").textContent = results.length + " application" + (results.length === 1 ? "" : "s") + " found";
    $("#appGrid").innerHTML = results.length ? results.map(card).join("") : '<div class="empty"><h2>No matching applications</h2><p>Try another category or search term.</p><button class="btn" id="appReset" type="button">Clear filters</button></div>';
  }
  function reset() {
    state.category = "All"; state.query = ""; state.sort = "title";
    $("#appSearch").value = ""; $("#appSort").value = "title"; syncUrl(); render(); $("#appSearch").focus();
  }
  async function init() {
    $("#appSearch").value = state.query;
    $("#appSearch").addEventListener("input", event => { state.query = event.target.value.trim(); syncUrl(); render(); });
    $("#appSort").addEventListener("change", event => { state.sort = event.target.value; render(); });
    $("#appCategories").addEventListener("click", event => {
      const button = event.target.closest("button[data-category]");
      if (!button || !allowedCategories.includes(button.dataset.category)) return;
      state.category = button.dataset.category; syncUrl(); render();
    });
    $("#appGrid").addEventListener("click", event => { if (event.target.closest("#appReset")) reset(); });
    try {
      const response = await fetch("/data/app-registry.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("Application registry unavailable");
      const data = await response.json();
      if (!Array.isArray(data.apps)) throw new Error("Invalid application registry");
      state.apps = data.apps.filter(app => app && typeof app.id === "string" && typeof app.title === "string");
      render();
    } catch (error) {
      console.error("Could not load application directory:", error);
      $("#appCount").textContent = "Applications unavailable";
      $("#appGrid").innerHTML = '<section class="empty"><h2>Applications could not be loaded</h2><p>Reload this page to try again.</p></section>';
    }
  }
  init();
})();
