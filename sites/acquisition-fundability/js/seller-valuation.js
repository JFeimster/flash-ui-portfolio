(() => {
  "use strict";

  const VERSION = "1.4.0";
  const $ = (id) => document.getElementById(id);
  const money = (value) => Number.isFinite(Number(value))
    ? Number(value).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

  function setStatus(message, type = "info") {
    const target = $("valuationStatus");
    target.textContent = message;
    target.className = `import-status ${type}`;
  }

  function hideStatus() {
    $("valuationStatus").className = "import-status hidden";
  }

  function setText(id, value) {
    $(id).textContent = value;
  }

  function multiple(value, basis) {
    if (!Number.isFinite(Number(value))) return "—";
    return `${Number(value).toFixed(1)}x monthly ${basis}`;
  }

  function collectParams() {
    const form = $("valuationForm");
    const params = new URLSearchParams();
    new FormData(form).forEach((raw, key) => {
      const value = String(raw || "").trim();
      if (value !== "") params.set(key, value);
    });
    return params;
  }

  function toggleSaasFields() {
    $("saasFields").classList.toggle("hidden", $("monetization").value !== "SaaS");
  }

  function renderValuation(payload) {
    const v = payload.valuation || {};
    const basis = v.isProfitMultiple === false ? "MRR" : "profit";

    setText("suggestedPrice", money(v.suggestedListingPrice));
    setText("suggestedMultiple", `Suggested listing multiple: ${multiple(v.suggestedListingMultiple, basis)}`);
    setText("typicalLow", money(v.typicalLowValuation));
    setText("typicalHigh", money(v.typicalHighValuation));
    setText("suggestedPriceCard", money(v.suggestedListingPrice));
    setText("typicalLowMultiple", multiple(v.typicalLowMultiple, basis));
    setText("typicalHighMultiple", multiple(v.typicalHighMultiple, basis));
    setText("suggestedMultipleCard", multiple(v.suggestedListingMultiple, basis));
    setText("absoluteLow", money(v.absoluteLowValuation));
    setText("absoluteHigh", money(v.absoluteHighValuation));
    setText("absoluteLowMultiple", multiple(v.absoluteLowMultiple, basis));
    setText("absoluteHighMultiple", multiple(v.absoluteHighMultiple, basis));

    const assumptions = payload.assumptions || {};
    const details = [
      assumptions.average_monthly_net_profit ? `${money(assumptions.average_monthly_net_profit)} avg monthly profit` : null,
      assumptions.monetization || null,
      assumptions.business_created_at ? `started ${assumptions.business_created_at}` : null,
      basis === "MRR" ? "valuation multiple is based on recurring revenue" : "valuation multiple is based on monthly profit"
    ].filter(Boolean);
    setText("valuationBasis", `Basis: ${details.join(" · ")}.`);

    $("valuationResults").classList.remove("hidden");
    $("valuationResults").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitValuation(event) {
    event.preventDefault();
    const profit = Number($("monthlyProfit").value);
    if (!Number.isFinite(profit) || profit < 0) {
      setStatus("Enter a valid average monthly net profit.", "error");
      return;
    }

    const button = $("valuationBtn");
    button.disabled = true;
    button.textContent = "Calculating…";
    $("valuationResults").classList.add("hidden");
    setStatus("Running your inputs through Empire Flippers' live valuation engine…", "loading");

    try {
      const response = await fetch(`/api/empire-flippers/valuation?${collectParams().toString()}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok || !payload.valuation) {
        throw new Error(payload.error || "The valuation could not be calculated.");
      }
      renderValuation(payload);
      setStatus("Valuation returned. Review the typical range, suggested listing price, and exit options below.", "success");
    } catch (error) {
      setStatus(error && error.message ? error.message : "The valuation could not be calculated. Try again shortly.", "error");
    } finally {
      button.disabled = false;
      button.textContent = "Estimate My Valuation";
    }
  }

  function reset() {
    $("valuationForm").reset();
    $("valuationResults").classList.add("hidden");
    hideStatus();
    toggleSaasFields();
    $("monthlyProfit").focus();
  }

  function init() {
    document.documentElement.dataset.version = VERSION;
    $("valuationForm").addEventListener("submit", submitValuation);
    $("resetValuationBtn").addEventListener("click", reset);
    $("monetization").addEventListener("change", toggleSaasFields);
    toggleSaasFields();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
