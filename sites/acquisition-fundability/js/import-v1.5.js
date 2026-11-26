(() => {
  "use strict";

  const VERSION = "1.5.0";
  const STORAGE_KEY = "microAcquisitionDealImport";
  const $ = (id) => document.getElementById(id);
  let currentDeal = null;
  let recommendationToken = 0;

  const money = (value) => Number.isFinite(Number(value))
    ? Number(value).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

  const numberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  function setStatus(message, type = "info") {
    const el = $("importStatus");
    el.textContent = message;
    el.className = `import-status ${type}`;
  }

  function detectProvider(input) {
    const raw = String(input || "").trim();
    if (/^#?\d{4,9}$/.test(raw)) return "empire_flippers";
    try {
      const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
      if (host === "empireflippers.com" || host.endsWith(".empireflippers.com")) return "empire_flippers";
      if (host === "app.acquire.com" || host === "acquire.com" || host.endsWith(".acquire.com")) return "acquire";
      if (host === "bizbuysell.com" || host.endsWith(".bizbuysell.com")) return "bizbuysell";
      if (host === "flippa.com" || host.endsWith(".flippa.com")) return "flippa";
    } catch { /* no-op */ }
    return null;
  }

  function updateProviderGuidance() {
    const provider = detectProvider($("listingInput").value);
    const badge = $("providerBadge");
    const note = $("providerNote");
    const wrap = $("sourceTextWrap");
    if (provider === "empire_flippers") {
      badge.textContent = "Empire Flippers";
      note.textContent = "Official Marketplace API";
      wrap.classList.add("optional-source");
    } else if (provider === "acquire") {
      badge.textContent = "Acquire.com";
      note.textContent = "User-supplied public listing text";
      wrap.classList.remove("optional-source");
    } else if (provider === "bizbuysell") {
      badge.textContent = "BizBuySell";
      note.textContent = "User-supplied public listing text";
      wrap.classList.remove("optional-source");
    } else if (provider === "flippa") {
      badge.textContent = "Flippa";
      note.textContent = "User-supplied public listing text";
      wrap.classList.remove("optional-source");
    } else {
      badge.textContent = "4 marketplaces";
      note.textContent = "Empire Flippers · Acquire.com · BizBuySell · Flippa";
      wrap.classList.remove("optional-source");
    }
  }

  function sourceText(field, fallback) {
    return field && field.sourceLabel ? field.sourceLabel : fallback;
  }

  function setField(inputId, sourceId, field, fallback) {
    $(inputId).value = field && field.value !== null && field.value !== undefined ? field.value : "";
    $(sourceId).textContent = sourceText(field, fallback);
  }

  function addContext(label, value) {
    if (value === null || value === undefined || value === "") return;
    const chip = document.createElement("span");
    chip.className = "context-chip";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    chip.append(strong, document.createTextNode(String(value)));
    $("listingContext").appendChild(chip);
  }

  function clearSimilar() {
    recommendationToken += 1;
    $("similarDeals").classList.add("hidden");
    $("similarDealsGrid").innerHTML = "";
  }

  function recommendationCard(listing) {
    const card = document.createElement("article");
    card.className = "similar-deal-card";
    const top = document.createElement("div");
    top.className = "similar-card-top";
    const number = document.createElement("span");
    number.className = "similar-listing-number";
    number.textContent = `#${listing.listingNumber || "—"}`;
    const status = document.createElement("span");
    status.className = "similar-status-badge";
    status.textContent = listing.listingStatus || "Marketplace";
    top.append(number, status);
    const heading = document.createElement("h3");
    heading.textContent = listing.title || listing.niche || "Empire Flippers listing";
    const meta = document.createElement("p");
    meta.className = "similar-deal-meta";
    meta.textContent = [listing.monetization, listing.niche].filter(Boolean).join(" · ") || "Similar listing";
    const price = document.createElement("div");
    price.className = "similar-price";
    price.textContent = money(listing.askingPrice);
    const metrics = document.createElement("div");
    metrics.className = "similar-metrics";
    [["Monthly profit", money(listing.monthlyNetProfit)], ["Monthly revenue", money(listing.monthlyRevenue)], ["Multiple", Number.isFinite(Number(listing.listingMultiple)) ? `${Number(listing.listingMultiple).toFixed(1)}x` : "—"], ["Owner hours", Number.isFinite(Number(listing.hoursWorkedPerWeek)) ? `${listing.hoursWorkedPerWeek} / wk` : "—"]].forEach(([label, value]) => {
      const m = document.createElement("div"); m.className = "similar-metric";
      const s = document.createElement("span"); s.textContent = label;
      const b = document.createElement("strong"); b.textContent = value;
      m.append(s, b); metrics.appendChild(m);
    });
    const link = document.createElement("a");
    link.className = "similar-card-link"; link.href = listing.affiliateUrl || listing.sourceUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "View Listing ↗";
    card.append(top, heading, meta, price, metrics, link);
    return card;
  }

  async function loadSimilarDeals(deal) {
    if (!deal || deal.provider !== "empire_flippers") return clearSimilar();
    const token = ++recommendationToken;
    $("similarDeals").classList.remove("hidden");
    $("similarDealsStatus").textContent = "Loading…";
    $("similarDealsGrid").innerHTML = '<div class="similar-empty">Finding similar Empire Flippers listings…</div>';
    await new Promise((r) => setTimeout(r, 1100));
    if (token !== recommendationToken) return;
    try {
      const params = new URLSearchParams();
      if (deal.context && deal.context.internalId) params.set("id", deal.context.internalId);
      if (deal.listingNumber) params.set("listingNumber", deal.listingNumber);
      const response = await fetch(`/api/recommendations?${params}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Recommendations unavailable.");
      const list = payload.recommendations || [];
      $("similarDealsGrid").innerHTML = "";
      $("similarDealsStatus").textContent = list.length ? `${list.length} similar deals` : "No matches";
      if (!list.length) $("similarDealsGrid").innerHTML = '<div class="similar-empty">No public similar listings returned.</div>';
      else list.forEach((item) => $("similarDealsGrid").appendChild(recommendationCard(item)));
    } catch (error) {
      $("similarDealsStatus").textContent = "Unavailable";
      $("similarDealsGrid").innerHTML = "";
      const box = document.createElement("div"); box.className = "similar-error"; box.textContent = `${error.message} This does not affect the imported deal.`;
      $("similarDealsGrid").appendChild(box);
    }
  }

  function renderDeal(deal) {
    currentDeal = deal;
    const fields = deal.fields || {};
    const context = deal.context || {};
    $("providerName").textContent = deal.providerLabel || deal.provider || "Marketplace";
    $("listingNumber").textContent = deal.listingNumber ? `#${deal.listingNumber}` : "";
    $("listingMeta").textContent = [context.niche, context.monetization].filter(Boolean).join(" · ") || context.complianceNote || "Review source data before underwriting.";
    $("importMethod").textContent = context.importMethod || (deal.provider === "empire_flippers" ? "Official API" : "Pasted public text");
    $("metricPrice").textContent = money(fields.purchasePrice && fields.purchasePrice.value);
    $("metricProfit").textContent = money(context.monthlyNetProfit);
    $("metricRevenue").textContent = money(context.monthlyRevenue);
    $("metricMultiple").textContent = Number.isFinite(Number(context.listingMultiple)) ? `${Number(context.listingMultiple).toFixed(2)}x` : "—";
    $("listingContext").innerHTML = "";
    addContext("Provider", deal.providerLabel);
    addContext("Monetization", context.monetization);
    addContext("Industry / niche", context.niche);
    addContext("Import method", context.importMethod);
    addContext("Hours/week", context.hoursWorkedPerWeek);
    if (context.complianceNote) addContext("Adapter", context.complianceNote);
    setField("reviewPrice", "priceSource", fields.purchasePrice, "Confirm purchase price.");
    setField("reviewCashFlow", "cashFlowSource", fields.annualCashFlow, "Confirm annual cash flow/profit.");
    const basis = fields.cashFlowBasis || {};
    $("reviewCashFlowBasis").value = basis.value || "";
    $("basisSource").textContent = sourceText(basis, "Confirm SDE vs. EBITDA treatment.");
    setField("reviewRecurring", "recurringSource", fields.recurringRevenuePct, "Confirm recurring revenue percentage.");
    setField("reviewManagementCost", "managementSource", fields.managementCost, "Estimate replacement management cost.");
    const owner = fields.ownerDependence || {};
    $("reviewOwnerDep").value = owner.value || "unknown";
    $("ownerSource").textContent = sourceText(owner, "Confirm owner dependence.");
    setField("reviewCapex", "capexSource", fields.capexReserve, "Enter annual capex reserve.");
    setField("reviewWorkingCapital", "workingSource", fields.workingCapitalAtClose, "Enter working capital at close.");
    setField("reviewOtherDebt", "debtSource", fields.otherAnnualDebtService, "Confirm other annual debt service.");
    setField("reviewTransactionCosts", "transactionSource", fields.transactionCosts, "Enter transaction/closing costs.");
    $("viewListingBtn").href = deal.affiliateUrl || deal.sourceUrl || "#";
    $("viewListingBtn").textContent = `View ${deal.providerLabel || "Source"} Listing ↗`;
    $("basisWarning").classList.add("hidden");
    $("importResults").classList.remove("hidden");
    void loadSimilarDeals(deal);
  }

  async function importListing(event) {
    event.preventDefault();
    const input = $("listingInput").value.trim();
    const provider = detectProvider(input);
    if (!provider) return setStatus("Enter a supported Empire Flippers, Acquire.com, BizBuySell, or Flippa listing.", "error");
    if (provider !== "empire_flippers" && !$("sourceText").value.trim()) return setStatus("Paste the public listing text for this marketplace before importing.", "error");
    const button = $("importBtn");
    button.disabled = true; button.textContent = "Importing…";
    setStatus(provider === "empire_flippers" ? "Pulling the official Empire Flippers listing…" : "Parsing the public listing text you supplied…", "loading");
    $("importResults").classList.add("hidden"); clearSimilar();
    try {
      const response = await fetch("/api/import-listing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: input, sourceText: $("sourceText").value }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok || !payload.deal) throw new Error(payload.error || "The listing could not be imported.");
      renderDeal(payload.deal);
      setStatus(`Imported ${payload.deal.providerLabel || "marketplace"} deal. Confirm unresolved assumptions before sending it to the calculator.`, "success");
    } catch (error) {
      currentDeal = null; setStatus(error.message || "The listing could not be imported.", "error");
    } finally { button.disabled = false; button.textContent = "Import Listing"; }
  }

  function buildConfirmedPackage() {
    if (!currentDeal) return null;
    const confirmed = {
      price: numberOrNull($("reviewPrice").value), cashFlow: numberOrNull($("reviewCashFlow").value), cashFlowBasis: $("reviewCashFlowBasis").value,
      recurring: numberOrNull($("reviewRecurring").value), managementCost: numberOrNull($("reviewManagementCost").value), capex: numberOrNull($("reviewCapex").value),
      workingCapitalAtClose: numberOrNull($("reviewWorkingCapital").value), otherDebt: numberOrNull($("reviewOtherDebt").value), transactionCosts: numberOrNull($("reviewTransactionCosts").value),
      ownerDep: $("reviewOwnerDep").value || "unknown", books: "unknown", topCust: null
    };
    const errors = [];
    if (confirmed.price === null || confirmed.price < 0) errors.push("purchase price");
    if (confirmed.cashFlow === null || confirmed.cashFlow < 0) errors.push("annual cash flow/profit");
    if (!confirmed.cashFlowBasis || confirmed.cashFlowBasis === "unsure") errors.push("SDE or EBITDA cash-flow basis");
    if (confirmed.recurring === null || confirmed.recurring < 0 || confirmed.recurring > 100) errors.push("recurring revenue percentage");
    if (confirmed.managementCost === null || confirmed.managementCost < 0) errors.push("replacement management cost");
    if (confirmed.capex === null || confirmed.capex < 0) errors.push("capex reserve");
    if (confirmed.workingCapitalAtClose === null || confirmed.workingCapitalAtClose < 0) errors.push("working capital at close");
    if (confirmed.otherDebt === null || confirmed.otherDebt < 0) errors.push("other annual debt service");
    if (confirmed.transactionCosts === null || confirmed.transactionCosts < 0) errors.push("transaction/closing costs");
    if (errors.length) {
      $("basisWarning").textContent = `Confirm ${errors.join(", ")} before sending the deal to the calculator.`;
      $("basisWarning").classList.remove("hidden"); return null;
    }
    $("basisWarning").classList.add("hidden");
    return { version: VERSION, provider: currentDeal.provider, providerLabel: currentDeal.providerLabel, listingNumber: currentDeal.listingNumber, sourceUrl: currentDeal.sourceUrl, affiliateUrl: currentDeal.affiliateUrl, extractedAt: currentDeal.extractedAt, confirmedAt: new Date().toISOString(), context: currentDeal.context || {}, recommendations: currentDeal.fields || {}, confirmed };
  }

  function useDeal() {
    const pkg = buildConfirmedPackage(); if (!pkg) return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pkg)); } catch { return setStatus("Browser storage is blocked. Enter values manually in the calculator.", "error"); }
    const embed = new URLSearchParams(location.search).get("embed") === "1";
    location.href = embed ? "/?embed=1&imported=1" : "/?imported=1";
  }

  function clearImport() {
    currentDeal = null; recommendationToken += 1; $("importForm").reset(); $("importResults").classList.add("hidden"); $("importStatus").className = "import-status hidden"; clearSimilar(); updateProviderGuidance();
  }

  function init() {
    document.documentElement.dataset.version = VERSION;
    $("importForm").addEventListener("submit", importListing);
    $("listingInput").addEventListener("input", updateProviderGuidance);
    $("useDealBtn").addEventListener("click", useDeal);
    $("clearImportBtn").addEventListener("click", clearImport);
    updateProviderGuidance();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
