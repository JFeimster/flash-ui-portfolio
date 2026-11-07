(() => {
  const shell = document.querySelector("#variantHub");
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const slugFromPath = currentPath.split("/").filter(Boolean).pop() || "";
  const titleCase = value => String(value || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, letter => letter.toUpperCase());
  const escapeHtml = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const normalize = value => String(value || "").replace(/\/+$/, "");
  const absoluteUrl = path => new URL(path || "/", window.location.origin).href;

  function availability(item) {
    if (item.resolutionStatus === "standalone-app") return { label: "Standalone Deployment Required", tone: "review" };
    if (item.resolutionStatus === "archive") return { label: "Archive / Source Only", tone: "review" };
    if (item.resolutionStatus === "unresolved" || item.resolutionStatus === "missing-entrypoint") return { label: "Needs Repair", tone: "review" };
    if (item.productionVerification === "verified") return { label: "Verified Live", tone: "ready" };
    return { label: "Local Route Valid / Production Unverified", tone: "ready" };
  }

  function findHub(data) {
    const entries = Array.isArray(data.entries) ? data.entries : [];
    return entries.find(item => item.type === "group-hub" && normalize(item.resolvedPath) === currentPath)
      || entries.find(item => item.type === "group-hub" && item.slug === slugFromPath)
      || entries.find(item => item.type === "group-hub" && normalize(item.originalPath) === currentPath);
  }

  function expandVariants(item, data) {
    const entries = (data.entries || []).filter(entry => entry.canonicalGroupId === item.canonicalGroupId && /\/variant-\d+\/?$/i.test(entry.resolvedPath || ""));
    if (entries.length) return entries.sort((a, b) => (a.resolvedPath || "").localeCompare(b.resolvedPath || ""));
    return (item.variantNumbers || []).map(number => ({ title: `${item.title || titleCase(item.slug)} ${number}`, resolvedPath: `/sites/${item.slug}/variant-${number}/`, resolutionStatus: "unresolved", variantNumber: number }));
  }

  function sourceUrl(item) {
    const path = String(item.originalPath || item.path || "").replace(/^\//, "");
    return `https://github.com/JFeimster/flash-ui-portfolio/tree/main/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  function renderMissing() {
    const fallbackTitle = titleCase(slugFromPath || "Variant Hub");
    document.title = `${fallbackTitle} | Flash UI Portfolio`;
    shell.innerHTML = `<section class="hub-error"><span class="eyebrow">Flash UI Portfolio</span><h1>${escapeHtml(fallbackTitle)}</h1><p>This canonical hub could not be matched to the additive route metadata.</p><a class="btn primary" href="/sites/">Back to all projects</a></section>`;
  }

  function renderHub(item, data) {
    const variants = expandVariants(item, data);
    const title = item.title || titleCase(slugFromPath);
    const status = availability(item);
    document.title = `${title} | Flash UI Variant Hub`;
    const firstVariant = variants.find(variant => ["resolved"].includes(variant.resolutionStatus) && variant.resolvedPath);
    const variantCards = variants.length ? variants.map((variant, index) => {
      const variantStatus = availability(variant);
      const canOpen = variantStatus.tone === "ready" && variant.resolvedPath;
      return canOpen
        ? `<a class="variant-card" href="${escapeHtml(variant.resolvedPath)}"><span class="variant-number">${escapeHtml(variant.variantNumber || index + 1)}</span><h3>${escapeHtml(variant.title || `Variant ${index + 1}`)}</h3><p>Open this preserved Flash UI variation from the canonical family hub.</p><div class="card-footer"><span>Launch variant</span><span>↗</span></div></a>`
        : `<article class="variant-card"><span class="variant-number">${escapeHtml(variant.variantNumber || index + 1)}</span><h3>${escapeHtml(variant.title || `Variant ${index + 1}`)}</h3><p>${escapeHtml(variantStatus.label)}. Use the source record for operator review.</p><div class="card-footer"><a href="${escapeHtml(sourceUrl(variant))}">View source ↗</a></div></article>`;
    }).join("") : `<article class="variant-card"><span class="variant-number">!</span><h3>No variant metadata yet</h3><p>This hub exists, but no child entrypoints are present in the route metadata.</p></article>`;

    shell.innerHTML = `<section class="hub-hero"><div class="topline"><span class="pill">Canonical Hub</span><span class="pill gold">${escapeHtml(item.category || "Project family")}</span><span class="pill">${escapeHtml(status.label)}</span></div><div class="hero-grid"><div><span class="eyebrow">Flash UI Variant Command Center</span><h1 class="hub-title">${escapeHtml(title)}</h1><p class="hub-subtitle">A single launch point for related Flash UI outputs. Variants stay preserved, while the portfolio directory stays focused on families.</p><div class="hub-actions">${firstVariant ? `<a class="btn primary" href="${escapeHtml(firstVariant.resolvedPath)}">Open recommended variant</a>` : ""}<a class="btn gold" href="/sites/">Back to all projects</a><a class="btn" href="/">Back to portfolio</a></div></div><aside class="stat-panel"><div class="stat-card"><strong>${escapeHtml(variants.length)}</strong><span>Preserved variants</span></div><div class="stat-card"><strong>${escapeHtml(item.productionVerification === "verified" ? "Yes" : "Pending")}</strong><span>Production verification</span></div><div class="stat-card"><strong>${escapeHtml(item.canonicalGroupId || item.slug || "Unknown")}</strong><span>Canonical family</span></div><div class="stat-card"><strong>Local</strong><span>Route evidence</span></div></aside></div><div class="path-box">${escapeHtml(item.resolvedPath || item.originalPath || currentPath)}</div></section><section><div class="section-head"><div><h2>Available Variants</h2><p>Open, compare, and decide which preserved version deserves to graduate.</p></div></div><div class="variant-grid">${variantCards}</div></section><section class="utility-row"><article class="utility-card"><h3>Canonical URL</h3><p>${escapeHtml(absoluteUrl(item.resolvedPath || window.location.pathname))}</p></article><article class="utility-card"><h3>Source path</h3><p>${escapeHtml(item.originalPath || "Not listed")}</p></article><article class="utility-card"><h3>Operator note</h3><p>${escapeHtml(item.resolutionReason || "Canonical hub resolved from local entrypoint evidence.")}</p></article></section><a class="footer-link" href="/sites/">← Back to all projects</a>`;
  }

  async function init() {
    try {
      const response = await fetch("/data/asset-route-resolution.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Route metadata returned ${response.status}`);
      const data = await response.json();
      const item = findHub(data);
      if (!item) return renderMissing();
      renderHub(item, data);
    } catch (error) {
      console.error("Variant hub render failed", error);
      renderMissing();
    }
  }
  init();
})();
