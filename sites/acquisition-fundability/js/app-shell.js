(() => {
  "use strict";

  const PATCH_STYLESHEET = "/css/v1.3.1.css?v=1.3.1";

  function ensurePatchStyles() {
    if (document.querySelector('link[href*="/css/v1.3.1.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PATCH_STYLESHEET;
    link.dataset.v131Styles = "true";
    document.head.appendChild(link);
  }

  function ensureSellerValuationNav() {
    const nav = document.querySelector(".top-nav");
    if (!nav || nav.querySelector('a[href="/seller-valuation"]')) return;
    const methodology = nav.querySelector('a[href="/methodology"]');
    const link = document.createElement("a");
    link.className = "nav-link";
    link.setAttribute("data-preserve-embed", "");
    link.href = "/seller-valuation";
    link.textContent = "Seller Valuation";
    if (methodology) nav.insertBefore(link, methodology);
    else nav.appendChild(link);
  }

  function initShell() {
    ensurePatchStyles();
    ensureSellerValuationNav();
    const params = new URLSearchParams(window.location.search);
    const embed = params.get("embed") === "1";

    document.body.classList.toggle("embed", embed);
    document.documentElement.dataset.embed = embed ? "1" : "0";

    if (!embed) return;

    document.querySelectorAll("a[data-preserve-embed]").forEach((link) => {
      try {
        const target = new URL(link.getAttribute("href"), window.location.origin);
        if (target.origin !== window.location.origin) return;
        target.searchParams.set("embed", "1");
        link.setAttribute("href", `${target.pathname}${target.search}${target.hash}`);
      } catch {
        // Keep the original link if it cannot be normalized.
      }
    });
  }

  ensurePatchStyles();
  document.addEventListener("DOMContentLoaded", initShell);
})();