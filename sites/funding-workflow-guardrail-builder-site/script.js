(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((node) => revealObserver.observe(node));
  }

  const scoreCard = document.querySelector("[data-score-card]");
  const scoreNode = document.querySelector("[data-score]");
  let scoreAnimated = false;

  const animateScore = () => {
    if (!scoreNode || scoreAnimated) return;
    scoreAnimated = true;

    const target = 32;
    const duration = reduceMotion ? 0 : 850;
    const start = performance.now();

    const tick = (now) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      scoreNode.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (scoreCard && "IntersectionObserver" in window && !reduceMotion) {
    const scoreObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateScore();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    scoreObserver.observe(scoreCard);
  } else {
    animateScore();
  }

  const trackedIds = new Set([
    "cta-launch-gpt-hero",
    "cta-launch-gpt-mid",
    "cta-launch-gpt-final",
    "cta-download-checkpoint-map",
    "cta-open-automation-pack",
    "cta-embed-launch-gpt"
  ]);

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a,button");
    if (!target || !trackedIds.has(target.id)) return;

    const detail = {
      id: target.id,
      href: target.getAttribute("href") || "",
      timestamp: new Date().toISOString()
    };

    window.dispatchEvent(new CustomEvent("guardrail:cta", { detail }));

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "guardrail_cta", ...detail });
    }

    if (typeof window.plausible === "function") {
      window.plausible("Guardrail CTA", { props: { cta_id: target.id } });
    }
  });
})();
