(() => {
  const shell = document.querySelector("#variantHub");
  const current = location.pathname.replace(/\/+$/, "");
  const familyId = current.split("/").filter(Boolean).pop();
  const internal = new URLSearchParams(location.search).get("view") === "internal";
  const back = `/sites/${internal ? "?view=internal" : ""}`;
  const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const available = item => item?.resolutionStatus === "resolved" && Boolean(item.resolvedPath);
  const chosen = new Set();
  let captures = {};
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
    const cards = variants.map(item => {
      const key = `${group.groupId}--variant-${item.variantNumber}`;
      const capture = captures[key];
      return `<article class="card variant-card" data-variant="${item.variantNumber}">${capture?.image ? `<a class="variant-image-link" href="${esc(item.resolvedPath || "#")}" aria-label="Open ${esc(item.title || `Variant ${item.variantNumber}`)}"><img class="variant-image" src="${esc(capture.image)}" alt="Screenshot of ${esc(item.title || `Variant ${item.variantNumber}`)}" loading="lazy"></a>` : ""}<span class="card-category">Variant ${item.variantNumber}</span><h3>${esc(item.title || `Variant ${item.variantNumber}`)}</h3>${item.description ? `<p class="card-description">${esc(item.description)}</p>` : ""}<div class="card-bottom">${available(item) ? `<a class="btn primary" href="${esc(item.resolvedPath)}" aria-label="${esc(`Open variant ${item.variantNumber}: ${item.title}`)}">Open variant <span aria-hidden="true">↗</span></a><button class="btn compare-toggle" type="button" data-compare="${item.variantNumber}" aria-pressed="${chosen.has(item.variantNumber)}">${chosen.has(item.variantNumber) ? "Remove comparison" : "Compare"}</button>` : '<p class="repair-note">Preview unavailable · source entrypoint needs repair.</p>'}</div>${internal ? details(item) : ""}</article>`;
    }).join("");
    const comparison = [...chosen].map(number => variants.find(item => item.variantNumber === number)).filter(Boolean);
    const single = members.find(item => !item.variantNumber && item.type !== "group-hub" && available(item) && item.resolvedPath.replace(/\/+$/, "") !== current);
    const comparePanel = comparison.length ? `<section class="compare-panel" aria-live="polite"><div class="compare-heading"><h2>Compare variants</h2><button class="btn" type="button" data-clear-compare>Clear selection</button></div><div class="compare-grid">${comparison.map(item => { const capture = captures[`${group.groupId}--variant-${item.variantNumber}`]; return `<article class="compare-item"><div class="compare-title"><h3>${esc(item.title || `Variant ${item.variantNumber}`)}</h3><button class="btn" type="button" data-remove-compare="${item.variantNumber}" aria-label="Remove ${esc(item.title || `Variant ${item.variantNumber}`)}">Remove</button></div>${capture?.image ? `<img src="${esc(capture.image)}" alt="Screenshot of ${esc(item.title || `Variant ${item.variantNumber}`)}">` : `<div class="compare-placeholder">Screenshot unavailable</div>`}<a class="btn primary" href="${esc(item.resolvedPath)}">Open variant ↗</a></article>`; }).join("")}</div></section>` : "";
    shell.innerHTML = `<nav class="hub-nav" aria-label="Project navigation"><a href="${back}">← All projects</a><a href="/">Flash UI Portfolio</a></nav><header class="hub-hero"><span class="eyebrow">${esc(group.category || "Project")}</span><h1>${esc(title)}</h1><p>${esc(description)}</p>${count ? `<span class="hub-count">${count} available variant${count === 1 ? "" : "s"}</span>` : ""}</header>${variants.length ? `<section aria-label="Project variants"><div class="section-heading"><h2>Choose a variation</h2></div><div class="grid variant-grid">${cards}</div></section>` : `<section class="single-project">${single ? `<a class="btn primary" href="${esc(single.resolvedPath)}">Open project ↗</a>` : '<p class="repair-note">This project has no separate preview entrypoint available.</p>'}</section>`}${comparePanel}${internal && hub ? details(hub) : ""}<footer><a href="${back}">← Back to all projects</a><a href="${esc(current)}/${internal ? "" : "?view=internal"}">${internal ? "Public view" : "Operator view"}</a></footer>`;
  }
  async function init() {
    try {
      const [data, showcase, collections, previewData] = await Promise.all([
        fetch("/data/asset-route-resolution.json").then(response => { if (!response.ok) throw new Error("Project data unavailable"); return response.json(); }),
        fetch("/data/asset-showcase.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/curated-collections.json").then(response => response.ok ? response.json() : {}).catch(() => ({})),
        fetch("/data/asset-previews.json").then(response => response.ok ? response.json() : {}).catch(() => ({}))
      ]);
      captures = previewData.projects || {};
      const { applyCuratedCollections } = await import("/assets/js/curated-collections.js");
      render(applyCuratedCollections(data, collections), showcase);
      shell.addEventListener("click", event => {
        if (event.target.closest("[data-compare]")) { const number = Number(event.target.closest("[data-compare]").dataset.compare); if (chosen.has(number)) chosen.delete(number); else if (chosen.size < 2) chosen.add(number); render(applyCuratedCollections(data, collections), showcase); }
        else if (event.target.closest("[data-remove-compare]")) { chosen.delete(Number(event.target.closest("[data-remove-compare]").dataset.removeCompare)); render(applyCuratedCollections(data, collections), showcase); }
        else if (event.target.closest("[data-clear-compare]")) { chosen.clear(); render(applyCuratedCollections(data, collections), showcase); }
      });
    } catch (error) { console.error(error); missing(); }
  }
  init();
})();
