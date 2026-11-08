(() => {
  const shell = document.querySelector("#variantHub");
  const current = location.pathname.replace(/\/+$/, "");
  const familyId = current.split("/").filter(Boolean).pop();
  const internal = new URLSearchParams(location.search).get("view") === "internal";
  const back = `/sites/${internal ? "?view=internal" : ""}`;
  const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const available = item => item?.resolutionStatus === "resolved" && Boolean(item.resolvedPath);
  function details(item) {
    return `<details class="details-panel"><summary>Source details</summary><dl><dt>File</dt><dd>${esc(item.sourcePath || item.originalPath || "Not located")}</dd><dt>Resolution</dt><dd>${esc(item.resolutionReason || "No child entrypoint was found.")}</dd><dt>Document title</dt><dd>${esc(item.documentTitle || "No title element")}</dd><dt>Structure</dt><dd>${esc(item.structuralValidity ? JSON.stringify(item.structuralValidity) : "Entrypoint existence checked")}</dd><dt>Production check</dt><dd>${item.productionVerification === "verified" ? "Verified in recorded smoke test" : "Not verified"}</dd></dl>${item.sourceUrl ? `<a href="${esc(item.sourceUrl)}" target="_blank" rel="noreferrer">View source ↗</a>` : ""}</details>`;
  }
  function missing() {
    document.title = "Project unavailable · Flash UI Portfolio";
    shell.innerHTML = `<section class="empty"><h1>Project preview unavailable</h1><p>We couldn’t load this project’s preview information.</p><a class="btn primary" href="${back}">Back to all projects</a></section>`;
  }
  function render(data, showcase) {
    const group = (data.groups || []).find(item => item.groupId === familyId || item.hubPath.replace(/\/+$/, "") === current);
    if (!group) return missing();
    const members = (data.entries || []).filter(item => item.canonicalGroupId === group.groupId);
    const hub = members.find(item => item.type === "group-hub") || members.find(item => item.resolvedPath?.replace(/\/+$/, "") === current);
    const unique = new Map(members.filter(item => item.variantNumber).map(item => [item.variantNumber, item]));
    // Retain known missing variants without inventing launch destinations.
    for (const number of hub?.variantNumbers || []) if (!unique.has(number)) unique.set(number, { variantNumber: number, title: `Variant ${number}`, resolutionStatus: "missing-entrypoint" });
    const variants = [...unique.values()].sort((a, b) => a.variantNumber - b.variantNumber);
    const count = variants.filter(available).length;
    const copy = showcase.projects?.[group.groupId] || {};
    const title = copy.title || group.displayTitle;
    const description = copy.description || group.description || `${group.category || "Interface"} project previews from the Flash UI collection.`;
    document.title = `${title} · Flash UI Portfolio`;
    const cards = variants.map(item => `<article class="card variant-card" data-variant="${item.variantNumber}"><span class="card-category">Variant ${item.variantNumber}</span><h3>${esc(item.title || `Variant ${item.variantNumber}`)}</h3>${item.description ? `<p class="card-description">${esc(item.description)}</p>` : ""}<div class="card-bottom">${available(item) ? `<a class="btn primary" href="${esc(item.resolvedPath)}" aria-label="${esc(`Open variant ${item.variantNumber}: ${item.title}`)}">Open variant <span aria-hidden="true">↗</span></a>` : '<p class="repair-note">Preview unavailable · source entrypoint needs repair.</p>'}</div>${internal ? details(item) : ""}</article>`).join("");
    const single = members.find(item => !item.variantNumber && item.type !== "group-hub" && available(item) && item.resolvedPath.replace(/\/+$/, "") !== current);
    shell.innerHTML = `<nav class="hub-nav" aria-label="Project navigation"><a href="${back}">← All projects</a><a href="/">Flash UI Portfolio</a></nav><header class="hub-hero"><span class="eyebrow">${esc(group.category || "Project")}</span><h1>${esc(title)}</h1><p>${esc(description)}</p>${count ? `<span class="hub-count">${count} available variant${count === 1 ? "" : "s"}</span>` : ""}</header>${variants.length ? `<section aria-label="Project variants"><div class="section-heading"><h2>Choose a variation</h2></div><div class="grid variant-grid">${cards}</div></section>` : `<section class="single-project">${single ? `<a class="btn primary" href="${esc(single.resolvedPath)}">Open project ↗</a>` : '<p class="repair-note">This project has no separate preview entrypoint available.</p>'}</section>`}${internal && hub ? details(hub) : ""}<footer><a href="${back}">← Back to all projects</a><a href="${esc(current)}/${internal ? "" : "?view=internal"}">${internal ? "Public view" : "Operator view"}</a></footer>`;
  }
  async function init() {
    try {
      const [data, showcase, collections] = await Promise.all([
        fetch("/data/asset-route-resolution.json").then(response => { if (!response.ok) throw new Error("Project data unavailable"); return response.json(); }),
        fetch("/data/asset-showcase.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/curated-collections.json").then(response => response.ok ? response.json() : {}).catch(() => ({}))
      ]);
      const { applyCuratedCollections } = await import("/assets/js/curated-collections.js");
      render(applyCuratedCollections(data, collections), showcase);
    } catch (error) { console.error(error); missing(); }
  }
  init();
})();
