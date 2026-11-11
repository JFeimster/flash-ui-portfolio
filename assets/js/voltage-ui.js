/* Presentational features only; existing app.js remains the single directory renderer. */
const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const localPath = raw => { try { const url = new URL(String(raw || ""), location.origin); return url.origin === location.origin ? url.pathname + url.search : ""; } catch { return ""; } };
const cleanTone = raw => ["mint","violet","coral","amber"].includes(raw) ? raw : "mint";
export function artwork(row, saved) {
  const title = esc(row.title);
  const hasPreview = Boolean(localPath(row.previewTarget));
  const thumb = String(row.image || "");
  const safeImage = thumb.startsWith("/assets/previews/") && thumb.endsWith(".webp") ? thumb : "";
  let html = '<div class="card-artwork tone-' + cleanTone(row.tone) + '">';
  html += '<div class="card-art-title" aria-hidden="true">' + title + '</div>';
  if (safeImage) html += '<img data-preview-image src="' + esc(safeImage) + '" alt="" loading="lazy" decoding="async">';
  html += '<button class="favorite-toggle" type="button" data-favorite-id="' + esc(row.id) + '" aria-label="' + (saved ? 'Remove from saved: ' : 'Save project: ') + title + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' + (saved ? '★' : '☆') + '</button>';
  return html + '</div>';
}

export function quickPreview(row) {
  const path = localPath(row.previewTarget);
  if (!path) return "";
  return '<button class="quick-peek" type="button" data-quick-preview data-preview-url="' + esc(path) + '" data-preview-title="' + esc(row.title) + '">◎ Quick Preview</button>';
}
export function mountVoltage({ rows, rerender, favorites }) {
  const dialog = document.getElementById("quickPreviewDialog");
  const frame = document.getElementById("quickPreviewFrame");
  const title = document.getElementById("quickPreviewTitle");
  const openLink = document.getElementById("quickPreviewOpen");
  let launchTrigger = null;
  function closePreview() { if (dialog && dialog.open) dialog.close(); }
  document.addEventListener("click", event => {
    const close = event.target.closest("[data-close-preview]");
    if (close) { closePreview(); return; }
    const favorite = event.target.closest("[data-favorite-id]");
    if (favorite) {
      const id = favorite.getAttribute("data-favorite-id");
      if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
      try { localStorage.setItem("flash-ui-saved-projects", JSON.stringify([...favorites])); } catch {}
      rerender();
      return;
    }
    const peek = event.target.closest("[data-quick-preview]");
    if (!peek || !dialog || !frame) return;
    const url = localPath(peek.getAttribute("data-preview-url"));
    if (!url) return;
    launchTrigger = peek;
    title.textContent = peek.getAttribute("data-preview-title") || "Project Preview";
    openLink.href = url;
    frame.src = url;
    dialog.showModal();
  });
  document.addEventListener("error", event => {
    if (!event.target?.matches?.("img[data-preview-image]")) return;
    const img = event.target;
    img.hidden = true;
  }, true);
  if (dialog && frame) {
    dialog.addEventListener("close", () => { frame.removeAttribute("src"); if (launchTrigger?.isConnected) launchTrigger.focus(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) closePreview(); });
  }
  const hero = document.getElementById("heroShowcase");
  if (!hero) return;
  const preferred = ["editorial-bento-grid-marketing-site","cinematic-dark-luxe","neo-brutalist-marketing-portfolio","niche-factory"];
  const items = preferred.map(id => rows().find(row => row.id === id && localPath(row.previewTarget))).filter(Boolean);
  if (!items.length) return;
  let current = 0;
  let paused = false;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  hero.addEventListener("mouseenter", () => { paused = true; });
  hero.addEventListener("mouseleave", () => { paused = false; });
  hero.addEventListener("focusin", () => { paused = true; });
  hero.addEventListener("focusout", () => { paused = false; });
  function show(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const path = localPath(item.previewTarget);
    const safeImg = String(item.image || "");
    const validImg = safeImg.startsWith("/assets/previews/") && safeImg.endsWith(".webp");
    hero.innerHTML = '<div class="showcase-head"><div class="showcase-chrome" aria-hidden="true"><span></span><span></span><span></span></div><span class="showcase-live-label">ACTUAL PROJECT / 0' + (current+1) + '</span></div>'
      + '<div class="showcase-window"><div class="showcase-live-media" data-live-path="' + esc(path) + '">'
      + (validImg ? '<img data-preview-image data-showcase-preview src="' + esc(safeImg) + '" alt="Screenshot of ' + esc(item.title) + '">' : '<div class="showcase-fallback">' + esc(item.title) + '</div>')
      + '</div><a class="showcase-open-overlay" href="' + esc(path) + '" aria-label="Open ' + esc(item.title) + '"></a></div>'
      + '<div class="showcase-bottom"><div><strong>' + esc(item.title) + '</strong><span class="showcase-subtitle">' + esc(item.visualStyle || item.category) + ' · Open live project ↗</span></div><div class="showcase-tabs" role="tablist" aria-label="Choose showcase project">'
      + items.map((entry,i) => '<button type="button" role="tab" data-showcase-index="' + i + '" aria-label="Show ' + esc(entry.title) + '" aria-selected="' + (i === current) + '">' + (i+1) + '</button>').join("")
      + '</div></div>';
    const img = hero.querySelector("[data-showcase-preview]");
    if (img) {
      const liveHost = img.parentElement;
      const fallback = () => {
        if (!img.isConnected) return;
        img.remove();
        if (liveHost.querySelector("iframe")) return;
        const iframe = document.createElement("iframe");
        iframe.src = path;
        iframe.title = item.title + " interactive preview";
        iframe.loading = "lazy";
        iframe.tabIndex = -1;
        iframe.setAttribute("aria-hidden", "true");
        iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
        iframe.setAttribute("referrerpolicy","no-referrer");
        liveHost.appendChild(iframe);
      };
      img.addEventListener("error", fallback, {once:true});
      if (img.complete && img.naturalWidth === 0) fallback();
    } else {
      const host = hero.querySelector(".showcase-live-media");
      const iframe = document.createElement("iframe");
      iframe.src = path; iframe.loading = "lazy"; iframe.tabIndex = -1; iframe.title = item.title;
      iframe.setAttribute("aria-hidden","true");
      iframe.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms");
      host.appendChild(iframe);
    }
  }
  hero.addEventListener("click", e => {
    const button = e.target.closest("[data-showcase-index]");
    if (button) show(Number(button.getAttribute("data-showcase-index")));
  });
  show(0);
  if (!reduce && items.length > 1) window.setInterval(() => {
    if (!paused && !document.hidden) show(current+1);
  }, 8500);
}
