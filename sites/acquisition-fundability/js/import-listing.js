(() => {
  "use strict";

  const VERSION = "1.3.2";
  const STORAGE_KEY = "microAcquisitionDealImport";
  const $ = (id) => document.getElementById(id);
  let currentDeal = null;
  let recommendationRequestToken = 0;

  const money = (value) => Number.isFinite(Number(value))
    ? Number(value).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

  const numberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  function setStatus(message, type = "info") {
    const target = $("importStatus");
    target.textContent = message;
    target.className = `import-status ${type}`;
  }

  function hideStatus() {
    $("importStatus").className = "import-status hidden";
  }

  function provenanceLabel(value) {
    if (value === "imported") return "Imported";
    if (value === "inferred") return "Inferred";
    if (value === "recommended") return "Recommended";
    return "Needs confirmation";
  }

  function provenanceClass(value) {
    if (value === "imported") return "imported";
    if (value === "inferred") return "inferred";
    if (value === "recommended") return "recommended";
    return "confirm";
  }

  function setProvenance(target, provenance) {
    target.textContent = provenanceLabel(provenance);
    target.className = `provenance ${provenanceClass(provenance)}`;
  }

  function sourceText(field, fallback) {
    if (!field) return fallback;
    const confidence = field.confidence ? ` Confidence: ${field.confidence}.` : "";
    return `${field.sourceLabel || fallback}${confidence}`;
  }

  function addContextItem(container, label, value) {
    if (value === null || value === undefined || value === "") return;
    const item = document.createElement("span");
    item.className = "context-chip";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    item.appendChild(strong);
    item.appendChild(document.createTextNode(String(value)));
    container.appendChild(item);
  }

  function renderContext(context = {}) {
    const container = $("listingContext");
    container.innerHTML = "";
    addContextItem(container, "Monetization", context.monetization);
    addContextItem(container, "Niche", context.niche);
    addContextItem(container, "Status", context.listingStatus);
    addContextItem(container, "Hours/week", context.hoursWorkedPerWeek);
    addContextItem(container, "Monthly expenses", context.monthlyExpenses === null || context.monthlyExpenses === undefined ? null : money(context.monthlyExpenses));
    addContextItem(container, "Inventory", context.inventoryCost === null || context.inventoryCost === undefined ? null : money(context.inventoryCost));
    addContextItem(container, "First made money", context.firstMadeMoneyAt);
    addContextItem(container, "Monthly recurring revenue", context.monthlyRecurringRevenue === null || context.monthlyRecurringRevenue === undefined ? null : money(context.monthlyRecurringRevenue));
    addContextItem(container, "SBA approved", context.sbaFinancingApproved === null || context.sbaFinancingApproved === undefined ? null : (context.sbaFinancingApproved ? "Yes" : "No"));
  }

  function populateNumber(inputId, provenanceId, sourceId, field, fallback) {
    $(inputId).value = field && field.value !== null && field.value !== undefined ? field.value : "";
    setProvenance($(provenanceId), field && field.provenance);
    $(sourceId).textContent = sourceText(field, fallback);
  }

  function clearSimilarDeals() {
    recommendationRequestToken += 1;
    $("similarDeals").classList.add("hidden");
    $("similarDealsGrid").innerHTML = "";
    $("similarDealsStatus").textContent = "Loading…";
  }

  function appendMetric(container, label, value) {
    const metric = document.createElement("div");
    metric.className = "similar-metric";
    const caption = document.createElement("span");
    caption.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = value;
    metric.append(caption, strong);
    container.appendChild(metric);
  }

  function renderRecommendationCard(listing) {
    const card = document.createElement("article");
    card.className = "similar-deal-card";

    const top = document.createElement("div");
    top.className = "similar-card-top";
    const number = document.createElement("span");
    number.className = "similar-listing-number";
    number.textContent = listing.listingNumber ? `#${listing.listingNumber}` : "Empire Flippers";
    const status = document.createElement("span");
    status.className = "similar-status-badge";
    status.textContent = listing.listingStatus || "Marketplace";
    top.append(number, status);

    const heading = document.createElement("h3");
    heading.textContent = listing.title || listing.niche || `Listing #${listing.listingNumber || ""}`;

    const meta = document.createElement("p");
    meta.className = "similar-deal-meta";
    meta.textContent = [listing.monetization, listing.niche].filter(Boolean).join(" · ") || "Empire Flippers marketplace listing";

    const price = document.createElement("div");
    price.className = "similar-price";
    price.textContent = money(listing.askingPrice);

    const metrics = document.createElement("div");
    metrics.className = "similar-metrics";
    appendMetric(metrics, "Monthly profit", money(listing.monthlyNetProfit));
    appendMetric(metrics, "Monthly revenue", money(listing.monthlyRevenue));
    appendMetric(metrics, "Multiple", Number.isFinite(Number(listing.listingMultiple)) ? `${Number(listing.listingMultiple).toFixed(1)}x` : "—");
    appendMetric(metrics, "Owner hours", Number.isFinite(Number(listing.hoursWorkedPerWeek)) ? `${Number(listing.hoursWorkedPerWeek)} / wk` : "—");

    const footer = document.createElement("div");
    footer.className = "similar-card-footer";
    const context = document.createElement("small");
    if (listing.sbaFinancingApproved === true) context.textContent = "SBA approved on EF";
    else if (listing.firstMadeMoneyAt) context.textContent = `First made money: ${listing.firstMadeMoneyAt}`;
    else context.textContent = "Similar marketplace listing";

    const link = document.createElement("a");
    link.className = "similar-card-link";
    link.href = listing.affiliateUrl || listing.sourceUrl || "https://empireflippers.com/marketplace/?referrer=6I8WK4WSMYC9KGJD";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View Listing ↗";
    footer.append(context, link);

    card.append(top, heading, meta, price, metrics, footer);
    return card;
  }

  function renderSimilarDeals(recommendations) {
    const section = $("similarDeals");
    const grid = $("similarDealsGrid");
    grid.innerHTML = "";
    section.classList.remove("hidden");

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      $("similarDealsStatus").textContent = "No matches";
      const empty = document.createElement("div");
      empty.className = "similar-empty";
      empty.textContent = "Empire Flippers did not return public similar listings for this deal. Your imported deal and calculator remain fully usable.";
      grid.appendChild(empty);
      return;
    }

    $("similarDealsStatus").textContent = `${recommendations.length} similar deal${recommendations.length === 1 ? "" : "s"}`;
    recommendations.forEach((listing) => grid.appendChild(renderRecommendationCard(listing)));
  }

  function renderSimilarDealsError(message) {
    const section = $("similarDeals");
    const grid = $("similarDealsGrid");
    section.classList.remove("hidden");
    $("similarDealsStatus").textContent = "Unavailable";
    grid.innerHTML = "";
    const error = document.createElement("div");
    error.className = "similar-error";
    error.textContent = `${message || "Similar listings are temporarily unavailable."} This does not affect the imported deal or calculator.`;
    grid.appendChild(error);
  }

  async function loadSimilarDeals(deal) {
    const token = ++recommendationRequestToken;
    const internalId = deal && deal.context && deal.context.internalId;
    const listingNumber = deal && deal.listingNumber;
    const section = $("similarDeals");
    const grid = $("similarDealsGrid");

    section.classList.remove("hidden");
    $("similarDealsStatus").textContent = "Loading…";
    grid.innerHTML = "";
    const loading = document.createElement("div");
    loading.className = "similar-empty";
    loading.textContent = "Finding similar Empire Flippers marketplace listings…";
    grid.appendChild(loading);

    if (!internalId) {
      renderSimilarDealsError("This public listing did not expose the internal Empire Flippers ID required by the Recommendations API.");
      return;
    }

    // Empire Flippers publishes a 1 request/second Marketplace API limit. The
    // initial listing import just completed, so wait before requesting matches.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    if (token !== recommendationRequestToken) return;

    try {
      const params = new URLSearchParams({ id: String(internalId) });
      if (listingNumber) params.set("listingNumber", String(listingNumber));
      const response = await fetch(`/api/recommendations?${params.toString()}`);
      const payload = await response.json().catch(() => ({}));
      if (token !== recommendationRequestToken) return;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Similar Empire Flippers listings are temporarily unavailable.");
      }
      renderSimilarDeals(payload.recommendations || []);
    } catch (error) {
      if (token !== recommendationRequestToken) return;
      renderSimilarDealsError(error && error.message ? error.message : null);
    }
  }

  function renderDeal(deal) {
    currentDeal = deal;
    const fields = deal.fields || {};
    const context = deal.context || {};

    $("listingNumber").textContent = `#${deal.listingNumber || "—"}`;
    $("listingStatus").textContent = context.listingStatus || "Public listing";
    $("listingMeta").textContent = [context.niche, context.monetization].filter(Boolean).join(" · ") || "Review the marketplace data before using it in the calculator.";

    $("metricPrice").textContent = money(fields.purchasePrice && fields.purchasePrice.value);
    $("metricProfit").textContent = money(context.monthlyNetProfit);
    $("metricRevenue").textContent = money(context.monthlyRevenue);
    $("metricMultiple").textContent = Number.isFinite(Number(context.listingMultiple)) ? `${Number(context.listingMultiple).toFixed(1)}x` : "—";

    renderContext(context);

    populateNumber("reviewPrice", "priceProvenance", "priceSource", fields.purchasePrice, "Confirm the purchase price before calculating.");
    populateNumber("reviewCashFlow", "cashFlowProvenance", "cashFlowSource", fields.annualCashFlow, "Confirm the annual cash flow before calculating.");

    const basis = fields.cashFlowBasis || {};
    $("reviewCashFlowBasis").value = basis.value || "";
    setProvenance($("basisProvenance"), basis.provenance);
    $("basisSource").textContent = sourceText(basis, "Confirm whether the cash flow should be treated as SDE or EBITDA.");

    populateNumber("reviewRecurring", "recurringProvenance", "recurringSource", fields.recurringRevenuePct, "Enter a defensible recurring-revenue estimate before calculating.");
    populateNumber("reviewManagementCost", "managementProvenance", "managementSource", fields.managementCost, "Estimate the annual market cost to replace the seller's role.");

    const ownerDep = fields.ownerDependence || {};
    $("reviewOwnerDep").value = ownerDep.value || "unknown";
    setProvenance($("ownerDepProvenance"), ownerDep.provenance);
    $("ownerDepSource").textContent = sourceText(ownerDep, "Confirm owner dependence during diligence.");

    populateNumber("reviewCapex", "capexProvenance", "capexSource", fields.capexReserve, "Enter an annual capex reserve based on actual fixed-asset needs.");
    populateNumber("reviewWorkingCapital", "workingCapitalProvenance", "workingCapitalSource", fields.workingCapitalAtClose, "Enter operating capital needed at close.");
    populateNumber("reviewOtherDebt", "otherDebtProvenance", "otherDebtSource", fields.otherAnnualDebtService, "Confirm other annual debt obligations.");
    populateNumber("reviewTransactionCosts", "transactionCostsProvenance", "transactionCostsSource", fields.transactionCosts, "Enter transaction and closing costs.");

    $("viewListingBtn").href = deal.affiliateUrl || "https://empireflippers.com/marketplace/?referrer=6I8WK4WSMYC9KGJD";
    $("basisWarning").classList.add("hidden");
    $("importResults").classList.remove("hidden");
    $("importResults").scrollIntoView({ behavior: "smooth", block: "start" });
    void loadSimilarDeals(deal);
  }

  async function importListing(event) {
    event.preventDefault();
    const input = $("listingInput").value.trim();
    if (!input) {
      setStatus("Enter an Empire Flippers listing URL or listing number.", "error");
      return;
    }

    const button = $("importBtn");
    button.disabled = true;
    button.textContent = "Importing…";
    setStatus("Pulling the public listing and generating screening recommendations…", "loading");
    $("importResults").classList.add("hidden");
    clearSimilarDeals();

    try {
      const response = await fetch("/api/import-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok || !payload.deal) {
        throw new Error(payload.error || "The listing could not be imported.");
      }

      renderDeal(payload.deal);
      setStatus(`Imported Empire Flippers listing #${payload.deal.listingNumber}. Review the facts, recommendations, unresolved assumptions, and similar marketplace deals below.`, "success");
    } catch (error) {
      currentDeal = null;
      setStatus(error && error.message ? error.message : "The listing could not be imported. Enter the deal manually or try again shortly.", "error");
    } finally {
      button.disabled = false;
      button.textContent = "Import Listing";
    }
  }

  function buildConfirmedPackage() {
    if (!currentDeal) return null;

    const price = numberOrNull($("reviewPrice").value);
    const cashFlow = numberOrNull($("reviewCashFlow").value);
    const recurring = numberOrNull($("reviewRecurring").value);
    const managementCost = numberOrNull($("reviewManagementCost").value);
    const capex = numberOrNull($("reviewCapex").value);
    const workingCapitalAtClose = numberOrNull($("reviewWorkingCapital").value);
    const otherDebt = numberOrNull($("reviewOtherDebt").value);
    const transactionCosts = numberOrNull($("reviewTransactionCosts").value);
    const basis = $("reviewCashFlowBasis").value;
    const ownerDep = $("reviewOwnerDep").value;

    const errors = [];
    if (price === null || price < 0) errors.push("purchase price");
    if (cashFlow === null || cashFlow < 0) errors.push("annual cash flow");
    if (!basis || basis === "unsure") errors.push("SDE or EBITDA cash-flow basis");
    if (recurring === null || recurring < 0 || recurring > 100) errors.push("recurring revenue percentage");
    if (managementCost === null || managementCost < 0) errors.push("replacement management cost");
    if (capex === null || capex < 0) errors.push("capex reserve");
    if (workingCapitalAtClose === null || workingCapitalAtClose < 0) errors.push("working capital at close");
    if (otherDebt === null || otherDebt < 0) errors.push("other annual debt service");
    if (transactionCosts === null || transactionCosts < 0) errors.push("transaction / closing costs");

    if (errors.length) {
      $("basisWarning").textContent = `Confirm ${errors.join(", ")} before sending the deal to the calculator.`;
      $("basisWarning").classList.remove("hidden");
      return null;
    }

    $("basisWarning").classList.add("hidden");

    return {
      version: VERSION,
      provider: currentDeal.provider,
      providerLabel: currentDeal.providerLabel,
      listingNumber: currentDeal.listingNumber,
      sourceUrl: currentDeal.sourceUrl,
      affiliateUrl: currentDeal.affiliateUrl,
      extractedAt: currentDeal.extractedAt,
      confirmedAt: new Date().toISOString(),
      context: currentDeal.context || {},
      recommendations: currentDeal.fields || {},
      confirmed: {
        price,
        cashFlow,
        cashFlowBasis: basis,
        recurring,
        managementCost,
        capex,
        workingCapitalAtClose,
        otherDebt,
        transactionCosts,
        ownerDep: ownerDep || "unknown",
        books: "unknown",
        topCust: null
      }
    };
  }

  function useDeal() {
    const confirmed = buildConfirmedPackage();
    if (!confirmed) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(confirmed));
    } catch {
      setStatus("Your browser blocked temporary deal storage. Keep this tab open and enter the values manually in the calculator.", "error");
      return;
    }

    const embed = new URLSearchParams(window.location.search).get("embed") === "1";
    window.location.href = embed ? "/?embed=1&imported=1" : "/?imported=1";
  }

  function clearImport() {
    currentDeal = null;
    clearSimilarDeals();
    $("importForm").reset();
    $("importResults").classList.add("hidden");
    $("basisWarning").classList.add("hidden");
    hideStatus();
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
    $("listingInput").focus();
  }

  function init() {
    document.documentElement.dataset.version = VERSION;
    $("importForm").addEventListener("submit", importListing);
    $("useDealBtn").addEventListener("click", useDeal);
    $("clearImportBtn").addEventListener("click", clearImport);
    ["reviewCashFlowBasis", "reviewRecurring", "reviewManagementCost", "reviewCapex", "reviewWorkingCapital", "reviewOtherDebt", "reviewTransactionCosts"].forEach((id) => {
      $(id).addEventListener(id === "reviewCashFlowBasis" ? "change" : "input", () => $("basisWarning").classList.add("hidden"));
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();