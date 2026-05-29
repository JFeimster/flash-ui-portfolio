(() => {
  const shell = document.querySelector("#variantHub");
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const slugFromPath = currentPath.split("/").filter(Boolean).pop() || "";
  const titleCase = value => String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const formatType = value => titleCase(String(value || "Asset").replace(/-/g, " "));
  const normalize = value => String(value || "").replace(/\/+$/, "");
  const absoluteUrl = path => new URL(path || "/", window.location.origin).href;

  function findHub(registry) {
    return registry.find(item => normalize(item.livePath) === currentPath)
      || registry.find(item => item.slug === slugFromPath)
      || registry.find(item => normalize(`/${item.path || ""}`) === currentPath)
      || registry.find(item => normalize(item.path || "").split("/").pop() === slugFromPath);
  }

  function expandVariants(item) {
    if (Array.isArray(item.variants) && item.variants.length) return item.variants;
    if (!Array.isArray(item.variantNumbers)) return [];
    return item.variantNumbers.map(number => ({
      variantNumber: number,
      title: `${item.title || titleCase(item.slug)} ${number}`,
      path: `${item.path}/variant-${number}`,
      livePath: `${item.livePath || `/sites/${item.slug}/`}variant-${number}/`,
      hasIndex: true
    }));
  }

  function renderMissing() {
    const fallbackTitle = titleCase(slugFromPath || "Variant Hub");
    document.title = `${fallbackTitle} | Flash UI Portfolio`;
    shell.innerHTML = `
      <section class="hub-error">
        <span class="eyebrow">Flash UI Portfolio</span>
        <h1>${escapeHtml(fallbackTitle)}</h1>
        <p>This canonical hub could not be matched to the current registry. The path may still be deploying, or the registry may need a fresh indexing pass.</p>
        <a class="btn primary" href="/">Back to portfolio</a>
      </section>
    `;
  }

  function renderHub(item) {
    const variants = expandVariants(item);
    const title = item.title || titleCase(slugFromPath);
    document.title = `${title} | Flash UI Variant Hub`;
    const firstVariant = variants.find(variant => variant.livePath);
    const variantCards = variants.length ? variants.map((variant, index) => `
      <a class="variant-card" href="${escapeHtml(variant.livePath || "#")}">
        <span class="variant-number">${escapeHtml(variant.variantNumber || index + 1)}</span>
        <h3>${escapeHtml(variant.title || `Variant ${index + 1}`)}</h3>
        <p>Open this preserved Flash UI variation as a standalone prototype.</p>
        <div class="card-footer">
          <span>Launch variant</span>
          <span>↗</span>
        </div>
      </a>
    `).join("") : `
      <article class="variant-card">
        <span class="variant-number">!</span>
        <h3>No variant metadata yet</h3>
        <p>This hub exists, but the registry does not list variant child pages yet.</p>
      </article>
    `;

    shell.innerHTML = `
      <section class="hub-hero">
        <div class="topline">
          <span class="pill">Canonical Hub</span>
          <span class="pill gold">${escapeHtml(formatType(item.category || item.type))}</span>
          <span class="pill">${escapeHtml(item.status || "portfolio-site")}</span>
        </div>
        <div class="hero-grid">
          <div>
            <span class="eyebrow">Flash UI Variant Command Center</span>
            <h1 class="hub-title">${escapeHtml(title)}</h1>
            <p class="hub-subtitle">A cleaned-up canonical home for related Flash UI outputs. Variants stay preserved, but the directory now gives them one organized launch point instead of a junk drawer full of duplicate-looking cards.</p>
            <div class="hub-actions">
              ${firstVariant ? `<a class="btn primary" href="${escapeHtml(firstVariant.livePath)}">Open First Variant</a>` : ""}
              <a class="btn gold" href="/">Back to Portfolio</a>
              <a class="btn" href="/data/site-registry.json" target="_blank" rel="noreferrer">View Registry</a>
            </div>
          </div>
          <aside class="stat-panel">
            <div class="stat-card"><strong>${escapeHtml(variants.length)}</strong><span>Preserved variants</span></div>
            <div class="stat-card"><strong>${escapeHtml(item.hasZip ? "Yes" : "No")}</strong><span>Archive package</span></div>
            <div class="stat-card"><strong>${escapeHtml(item.needsNormalization ? "Yes" : "No")}</strong><span>Needs normalization</span></div>
            <div class="stat-card"><strong>${escapeHtml(item.type || "hub")}</strong><span>Registry type</span></div>
          </aside>
        </div>
        <div class="path-box">${escapeHtml(item.path || currentPath)}</div>
      </section>

      <section>
        <div class="section-head">
          <div>
            <h2>Available Variants</h2>
            <p>Open, compare, and decide which version deserves to graduate.</p>
          </div>
        </div>
        <div class="variant-grid">${variantCards}</div>
      </section>

      <section class="utility-row">
        <article class="utility-card">
          <h3>Canonical URL</h3>
          <p>${escapeHtml(absoluteUrl(item.livePath || window.location.pathname))}</p>
        </article>
        <article class="utility-card">
          <h3>Source path</h3>
          <p>${escapeHtml(item.path || "Not listed")}</p>
        </article>
        <article class="utility-card">
          <h3>Operator note</h3>
          <p>${escapeHtml(item.notes || "Canonical group hub generated from the curated registry.")}</p>
        </article>
      </section>

      <a class="footer-link" href="/">← Back to Flash UI Portfolio</a>
    `;
  }

  async function init() {
    try {
      const response = await fetch("/data/site-registry.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Registry returned ${response.status}`);
      const registry = await response.json();
      const item = findHub(registry);
      if (!item) return renderMissing();
      renderHub(item);
    } catch (error) {
      console.error("Variant hub render failed", error);
      renderMissing();
    }
  }

  init();
})();
