(() => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });

  // FAQ accordion
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const ans = item.querySelector(".faq-a");
    const icon = item.querySelector(".faq-icon");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";

      // close others
      items.forEach((other) => {
        const ob = other.querySelector(".faq-q");
        const oa = other.querySelector(".faq-a");
        const oi = other.querySelector(".faq-icon");
        if (!ob || !oa) return;
        ob.setAttribute("aria-expanded", "false");
        oa.hidden = true;
        if (oi) oi.textContent = "+";
      });

      // toggle current
      btn.setAttribute("aria-expanded", String(!expanded));
      ans.hidden = expanded;
      if (icon) icon.textContent = expanded ? "+" : "–";
    });
  });
})();