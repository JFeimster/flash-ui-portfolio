(() => {
  "use strict";

  const cta = document.getElementById("cta-embed-launch-gpt");
  if (!cta) return;

  cta.addEventListener("click", () => {
    const detail = {
      id: cta.id,
      href: cta.href,
      timestamp: new Date().toISOString()
    };

    window.dispatchEvent(new CustomEvent("guardrail:cta", { detail }));

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "guardrail_cta", ...detail });
    }

    if (typeof window.plausible === "function") {
      window.plausible("Guardrail CTA", { props: { cta_id: cta.id } });
    }
  });
})();
