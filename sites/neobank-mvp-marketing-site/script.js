/* Minimal, Vercel-friendly JS. No frameworks. */
(function () {
  const byId = (id) => document.getElementById(id);

  // Mobile nav toggle
  const btn = byId("menuBtn");
  const menu = byId("mobileMenu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      menu.style.display = open ? "none" : "block";
      btn.setAttribute("aria-expanded", String(!open));
    });
  }

  // Active nav link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  // Waitlist form: store locally (MVP), with optional redirect to your form tool later.
  const form = byId("waitlistForm");
  const status = byId("waitlistStatus");

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      // Basic validation
      const required = ["email", "company_name", "entity_type", "vertical"];
      const missing = required.filter((k) => !String(data[k] || "").trim());
      if (missing.length) {
        if (status) status.textContent = "Please fill the required fields: " + missing.join(", ");
        return;
      }

      const key = "neobank_waitlist_v1";
      const existing = safeJsonParse(localStorage.getItem(key)) || [];
      existing.push({ ...data, created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));

      if (status) status.textContent = "Saved. You're on the early access list (local demo).";
      form.reset();
    });
  }

  // Export local waitlist data for you (admin-only convenience).
  const exportBtn = byId("exportWaitlist");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const key = "neobank_waitlist_v1";
      const rows = safeJsonParse(localStorage.getItem(key)) || [];
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlist_export.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }
})();
