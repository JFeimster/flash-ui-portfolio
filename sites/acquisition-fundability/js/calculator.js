(() => {
  "use strict";

  const VERSION = "1.3.1";
  const STORAGE_KEY = "microAcquisitionDealImport";
  const EMBED_PARAM = new URLSearchParams(window.location.search).get("embed") === "1";

  const $ = (id) => document.getElementById(id);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const money = (n) => Number.isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";
  const pct = (n) => Number.isFinite(n) ? `${n.toFixed(1)}%` : "—";

  const defaults = {
    cashFlowBasis: "sde",
    cashFlow: 140000,
    managementCost: 80000,
    managementIncluded: true,
    capex: 12000,
    otherDebt: 0,
    price: 300000,
    loanAmt: 240000,
    rate: 11.5,
    term: 10,
    targetDscr: 1.35,
    sellerNote: 0,
    buyerCash: 0,
    wcAtClose: 8000,
    transactionCosts: 9000,
    topCust: 15,
    ownerDep: "low",
    books: "clean",
    recurring: 30
  };

  function monthlyPayment(principal, annualRatePct, years) {
    const p = Math.max(0, principal);
    const r = Math.max(0, annualRatePct) / 100 / 12;
    const n = Math.max(1, Math.round(years * 12));
    if (p === 0) return 0;
    if (r === 0) return p / n;
    return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function principalFromMonthlyPayment(payment, annualRatePct, years) {
    const pmt = Math.max(0, payment);
    const r = Math.max(0, annualRatePct) / 100 / 12;
    const n = Math.max(1, Math.round(years * 12));
    if (pmt === 0) return 0;
    if (r === 0) return pmt * n;
    const factor = Math.pow(1 + r, n);
    return pmt * (factor - 1) / (r * factor);
  }

  function nullableNumber(id, min = -Infinity, max = Infinity) {
    const raw = $(id).value.trim();
    if (raw === "") return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return clamp(parsed, min, max);
  }

  function getInputs() {
    return {
      cashFlowBasis: $("cashFlowBasis").value,
      cashFlow: Number($("cashFlow").value) || 0,
      managementCost: Number($("managementCost").value) || 0,
      managementIncluded: $("managementIncluded").checked,
      capex: Number($("capex").value) || 0,
      otherDebt: Number($("otherDebt").value) || 0,
      price: Number($("price").value) || 0,
      loanAmt: Number($("loanAmt").value) || 0,
      rate: Number($("rate").value) || 0,
      term: Math.max(1, Number($("term").value) || 1),
      targetDscr: clamp(Number($("targetDscr").value) || 1.35, 1, 3),
      sellerNote: Number($("sellerNote").value) || 0,
      buyerCash: Number($("buyerCash").value) || 0,
      wcAtClose: Number($("wcAtClose").value) || 0,
      transactionCosts: Number($("transactionCosts").value) || 0,
      topCust: nullableNumber("topCust", 0, 100),
      ownerDep: $("ownerDep").value,
      books: $("books").value,
      recurring: nullableNumber("recurring", 0, 100)
    };
  }

  function normalizeCashFlow(input) {
    let managementDeduction = 0;
    if (input.cashFlowBasis === "sde") managementDeduction = input.managementCost;
    else if (!input.managementIncluded) managementDeduction = input.managementCost;

    const availableForDebtService = input.cashFlow
      - managementDeduction
      - input.capex
      - input.otherDebt;

    return { managementDeduction, availableForDebtService };
  }

  function supportableLoanForDscr(availableForDebtService, targetDscr, rate, term) {
    if (!Number.isFinite(availableForDebtService) || availableForDebtService <= 0 || targetDscr <= 0) return 0;
    const maxAnnualDebtService = availableForDebtService / targetDscr;
    return principalFromMonthlyPayment(maxAnnualDebtService / 12, rate, term);
  }

  function calculateDeal(input) {
    const monthlyDebtService = monthlyPayment(input.loanAmt, input.rate, input.term);
    const annualDebtService = monthlyDebtService * 12;
    const normalized = normalizeCashFlow(input);
    const dscr = annualDebtService > 0 ? normalized.availableForDebtService / annualDebtService : null;

    const rawSupportableLoan = supportableLoanForDscr(normalized.availableForDebtService, input.targetDscr, input.rate, input.term);
    const maxSupportableLoan = Math.max(0, Math.min(rawSupportableLoan, input.price));

    const purchasePriceEquityRaw = input.price - input.loanAmt - input.sellerNote;
    const purchasePriceEquity = Math.max(0, purchasePriceEquityRaw);
    const equityPct = input.price > 0 ? purchasePriceEquity / input.price * 100 : null;
    const loanToPurchasePct = input.price > 0 ? input.loanAmt / input.price * 100 : null;

    const totalProjectCost = input.price + input.wcAtClose + input.transactionCosts;
    const buyerCashRequiredRaw = totalProjectCost - input.loanAmt - input.sellerNote;
    const buyerCashRequired = Math.max(0, buyerCashRequiredRaw);
    const financingGap = totalProjectCost - input.loanAmt - input.sellerNote - input.buyerCash;

    return {
      ...normalized,
      monthlyDebtService,
      annualDebtService,
      dscr,
      rawSupportableLoan,
      maxSupportableLoan,
      purchasePriceEquity,
      purchasePriceEquityRaw,
      equityPct,
      loanToPurchasePct,
      totalProjectCost,
      buyerCashRequired,
      buyerCashRequiredRaw,
      financingGap
    };
  }

  function scoreDSCR(dscr, annualDebtService, cashFlowAvailable) {
    if (annualDebtService === 0) return cashFlowAvailable > 0 ? 35 : 0;
    if (!Number.isFinite(dscr)) return 0;
    if (dscr >= 1.50) return 35;
    if (dscr >= 1.35) return 25;
    if (dscr >= 1.20) return 15;
    return 0;
  }
  function scoreBooks(value) { return value === "clean" ? 20 : value === "some" ? 10 : 0; }
  function scoreOwnerDependence(value) { return value === "low" ? 15 : value === "med" ? 8 : 0; }
  function scoreConcentration(value) { if (!Number.isFinite(value)) return 0; if (value < 10) return 10; if (value <= 20) return 7; if (value <= 30) return 3; return 0; }
  function scoreCapex(capex, cashFlow) { if (cashFlow <= 0) return 0; const ratio = capex / cashFlow; if (ratio <= 0.08) return 10; if (ratio <= 0.15) return 5; return 0; }
  function scoreRecurring(value) { if (!Number.isFinite(value)) return 0; if (value >= 60) return 10; if (value >= 30) return 6; if (value >= 10) return 3; return 0; }

  function buildScore(input, calc) {
    const components = {
      dscr: scoreDSCR(calc.dscr, calc.annualDebtService, calc.availableForDebtService),
      books: scoreBooks(input.books),
      ownerDependence: scoreOwnerDependence(input.ownerDep),
      concentration: scoreConcentration(input.topCust),
      capex: scoreCapex(input.capex, input.cashFlow),
      recurring: scoreRecurring(input.recurring)
    };
    const score = Object.values(components).reduce((sum, value) => sum + value, 0);
    return { score: clamp(Math.round(score), 0, 100), components };
  }

  function bucket(score) {
    if (score >= 80) return "Fundable — strong story";
    if (score >= 60) return "Borderline — structure needs work";
    return "Risky — major issues to solve";
  }

  function buildFlagsAndActions(input, calc) {
    const flags = [];
    const actions = [];

    if (calc.annualDebtService > 0 && Number.isFinite(calc.dscr) && calc.dscr < 1.20) {
      flags.push("DSCR is below 1.20x; entered senior acquisition debt is too heavy for the modeled cash flow.");
      actions.push("Reduce senior debt, add equity/seller financing, improve cash flow, or restructure terms toward at least 1.35x DSCR.");
    } else if (calc.annualDebtService > 0 && calc.dscr < 1.35) {
      flags.push("DSCR clears 1.20x but leaves a thin acquisition cushion.");
      actions.push("Stress-test the deal and target a stronger debt-service cushion before closing.");
    }

    if (input.loanAmt > calc.maxSupportableLoan + 1 && calc.maxSupportableLoan >= 0) {
      flags.push(`Entered senior loan exceeds the ${input.targetDscr.toFixed(2)}x cash-flow-supported estimate.`);
      actions.push("Compare the entered loan with the supportable-loan estimate or raise the equity / seller-note portion.");
    }

    if (calc.availableForDebtService < 0) {
      flags.push("Cash flow available for senior debt service is negative before acquisition debt is paid.");
      actions.push("Rework normalized cash flow, management cost, capex, retained debt, or purchase economics before pursuing financing.");
    }

    if (!Number.isFinite(input.topCust)) {
      flags.push("Top-customer concentration is unconfirmed; the score receives no concentration credit.");
      actions.push("Confirm customer concentration from revenue-by-customer data before relying on the score.");
    } else if (input.topCust > 30) {
      flags.push("Top-customer concentration exceeds 30%, creating material revenue-loss risk.");
      actions.push("Verify customer durability, diversify revenue, or negotiate valuation protection.");
    }

    if (input.ownerDep === "unknown") {
      flags.push("Owner dependence is unconfirmed; the score receives no transferability credit.");
      actions.push("Confirm the seller's actual weekly duties, relationships, and transition requirements.");
    } else if (input.ownerDep === "high") {
      flags.push("Owner dependence is high; transferability risk is elevated.");
      actions.push("Require a transition plan, documented SOPs, key-staff retention, and meaningful seller support.");
    }

    if (input.books === "unknown") {
      flags.push("Books verifiability is unconfirmed; the score receives no books-quality credit.");
      actions.push("Verify tax returns, P&Ls, bank deposits, add-backs, AR/AP, and source documentation.");
    } else if (input.books === "messy") {
      flags.push("Books are messy or unclear; underwriting confidence is low.");
      actions.push("Require clean financials, tax returns, bank statements, AR/AP aging, and support for add-backs.");
    }

    if (input.cashFlow > 0 && input.capex / input.cashFlow > 0.15) {
      flags.push("Capex burden exceeds 15% of stated cash flow.");
      actions.push("Inspect asset condition, increase reserves, or negotiate seller credit/holdback.");
    }

    if (!Number.isFinite(input.recurring)) {
      flags.push("Recurring revenue is unconfirmed; the score receives no recurring-revenue credit.");
      actions.push("Confirm contractual, subscription, or demonstrably durable recurring revenue before assigning a percentage.");
    } else if (input.recurring < 10) {
      flags.push("Recurring revenue is below 10%, increasing volatility risk.");
      actions.push("Validate repeat-customer behavior and use conservative valuation/reserve assumptions.");
    }

    if (input.sellerNote > 0 && input.otherDebt === 0) {
      flags.push("A seller note is entered with no other annual debt service; the model therefore assumes no current-pay seller-note payment unless you add it manually.");
      actions.push("If the seller note requires current payments, add its annual debt service to Other annual debt service or verify standby treatment.");
    }

    if (input.loanAmt > input.price) {
      flags.push("Senior acquisition loan exceeds purchase price; check the structure.");
      actions.push("Correct the acquisition-loan input or separately document financing for working capital and transaction costs.");
    }

    if (calc.purchasePriceEquityRaw < 0) flags.push("Senior loan plus seller note exceeds the purchase price.");

    if (calc.financingGap > 0) {
      flags.push(`Current sources leave a financing gap of ${money(calc.financingGap)}.`);
      actions.push("Increase buyer cash, seller financing, or another permitted source—or reduce project uses.");
    }

    if (flags.length === 0) flags.push("No major red flags were triggered by the entered assumptions. Diligence is still required.");
    if (actions.length === 0) actions.push("Validate the inputs against source financials and run a downside case before relying on the result.");
    return { flags, actions: actions.slice(0, 8) };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function renderList(targetId, items) {
    const target = $(targetId);
    target.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function updateCashFlowBasisUI() {
    const basis = $("cashFlowBasis").value;
    const ebitdaOptions = $("ebitdaOptions");
    const managementLabel = $("managementLabel");
    const helper = $("managementHelper");
    if (basis === "sde") {
      ebitdaOptions.classList.add("hidden");
      $("managementCost").disabled = false;
      managementLabel.textContent = "Replacement management / owner compensation ($/yr)";
      helper.textContent = "SDE commonly includes owner economics, so replacement management is deducted for a transferable cash-flow view.";
    } else {
      ebitdaOptions.classList.remove("hidden");
      managementLabel.textContent = "Replacement management cost ($/yr)";
      const included = $("managementIncluded").checked;
      $("managementCost").disabled = included;
      helper.textContent = included
        ? "No extra management deduction is applied because EBITDA is marked as already reflecting replacement management."
        : "This management cost is deducted because the entered EBITDA does not already include it.";
    }
  }

  function scenario(input, calc, targetDscr) {
    const raw = supportableLoanForDscr(calc.availableForDebtService, targetDscr, input.rate, input.term);
    const seniorLoan = Math.max(0, Math.min(raw, input.price));
    const buyerCashNeeded = Math.max(0, calc.totalProjectCost - seniorLoan - input.sellerNote);
    return { targetDscr, seniorLoan, buyerCashNeeded };
  }

  function renderScenario(prefix, result) {
    $(`${prefix}Loan`).textContent = `${money(result.seniorLoan)} senior debt`;
    $(`${prefix}Cash`).textContent = `${money(result.buyerCashNeeded)} estimated buyer cash`;
  }

  function render() {
    updateCashFlowBasisUI();
    const input = getInputs();
    const calc = calculateDeal(input);
    const scoreResult = buildScore(input, calc);
    const guidance = buildFlagsAndActions(input, calc);

    $("outScore").textContent = `${scoreResult.score} / 100`;
    $("outBucket").textContent = bucket(scoreResult.score);
    $("outDscr").textContent = calc.annualDebtService > 0 && Number.isFinite(calc.dscr) ? `${calc.dscr.toFixed(2)}x` : "No senior debt";
    $("outCash").textContent = `Cash flow for senior debt service: ${money(calc.availableForDebtService)}`;
    $("outCash").classList.toggle("negative", calc.availableForDebtService < 0);

    $("outMaxLoan").textContent = money(calc.maxSupportableLoan);
    $("outMaxLoanMeta").textContent = `At ${input.targetDscr.toFixed(2)}x target · cash-flow capacity ${money(calc.rawSupportableLoan)} before purchase-price cap`;
    $("maxLoanInline").textContent = money(calc.maxSupportableLoan);

    $("outBuyerCashRequired").textContent = money(calc.buyerCashRequired);
    $("outBuyerCashMeta").textContent = `After ${money(input.loanAmt)} senior debt + ${money(input.sellerNote)} seller note`;

    $("outDebt").textContent = `${money(calc.annualDebtService)} / yr`;
    $("outMonthlyDebt").textContent = `${money(calc.monthlyDebtService)} / mo senior debt only`;

    $("outProjectCost").textContent = money(calc.totalProjectCost);
    $("outProjectCostMeta").textContent = `Price ${money(input.price)} + working capital ${money(input.wcAtClose)} + costs ${money(input.transactionCosts)}`;

    $("outEquity").textContent = money(calc.purchasePriceEquity);
    $("outEquityMeta").textContent = `Purchase-price equity ${pct(calc.equityPct)} · senior loan-to-purchase ${pct(calc.loanToPurchasePct)}`;

    const gap = calc.financingGap;
    $("outGap").textContent = gap > 0 ? money(gap) : gap < 0 ? `${money(Math.abs(gap))} surplus` : "$0";
    $("outGapMeta").textContent = gap > 0
      ? `Buyer cash available ${money(input.buyerCash)} is short of required cash.`
      : gap < 0
        ? `Entered sources exceed modeled project uses by ${money(Math.abs(gap))}.`
        : "Entered sources exactly cover modeled project uses.";
    $("outGap").classList.toggle("negative", gap > 0);

    renderScenario("scenarioConservative", scenario(input, calc, 1.50));
    renderScenario("scenarioBalanced", scenario(input, calc, 1.35));
    renderScenario("scenarioAggressive", scenario(input, calc, 1.20));

    renderList("outFlags", guidance.flags);
    renderList("outActions", guidance.actions);

    const status = $("statusTag");
    status.className = "status-tag";
    if (scoreResult.score >= 80) { status.textContent = "Strong"; status.classList.add("strong"); }
    else if (scoreResult.score >= 60) { status.textContent = "Borderline"; status.classList.add("borderline"); }
    else { status.textContent = "Risky"; status.classList.add("risky"); }
  }

  function clearImportState() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
    const notice = $("importNotice");
    if (notice) notice.classList.add("hidden");
  }

  function reset(options = {}) {
    $("cashFlowBasis").value = defaults.cashFlowBasis;
    $("cashFlow").value = defaults.cashFlow;
    $("managementCost").value = defaults.managementCost;
    $("managementIncluded").checked = defaults.managementIncluded;
    $("capex").value = defaults.capex;
    $("otherDebt").value = defaults.otherDebt;
    $("price").value = defaults.price;
    $("loanAmt").value = defaults.loanAmt;
    $("rate").value = defaults.rate;
    $("term").value = defaults.term;
    $("targetDscr").value = defaults.targetDscr;
    $("sellerNote").value = defaults.sellerNote;
    $("buyerCash").value = defaults.buyerCash;
    $("wcAtClose").value = defaults.wcAtClose;
    $("transactionCosts").value = defaults.transactionCosts;
    $("topCust").value = defaults.topCust;
    $("ownerDep").value = defaults.ownerDep;
    $("books").value = defaults.books;
    $("recurring").value = defaults.recurring;
    if (options.clearImport) clearImportState();
    render();
  }

  function getStoredImport() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function applyStoredImport() {
    const imported = getStoredImport();
    if (!imported || !imported.confirmed) return false;

    const values = imported.confirmed;
    if (Number.isFinite(Number(values.price))) $("price").value = Number(values.price);
    if (Number.isFinite(Number(values.cashFlow))) $("cashFlow").value = Number(values.cashFlow);
    if (values.cashFlowBasis === "sde" || values.cashFlowBasis === "ebitda") $("cashFlowBasis").value = values.cashFlowBasis;
    if (Number.isFinite(Number(values.recurring))) $("recurring").value = clamp(Number(values.recurring), 0, 100);
    if (Number.isFinite(Number(values.managementCost))) $("managementCost").value = Number(values.managementCost);
    if (Number.isFinite(Number(values.capex))) $("capex").value = Number(values.capex);
    if (Number.isFinite(Number(values.workingCapitalAtClose))) $("wcAtClose").value = Number(values.workingCapitalAtClose);
    if (Number.isFinite(Number(values.otherDebt))) $("otherDebt").value = Number(values.otherDebt);
    if (Number.isFinite(Number(values.transactionCosts))) $("transactionCosts").value = Number(values.transactionCosts);
    if (["low", "med", "high", "unknown"].includes(values.ownerDep)) $("ownerDep").value = values.ownerDep;

    $("books").value = "unknown";
    $("topCust").value = "";

    const notice = $("importNotice");
    if (notice) {
      $("importNoticeTitle").textContent = `${imported.providerLabel || "Marketplace"} listing #${imported.listingNumber || "—"} loaded`;
      $("importNoticeText").textContent = `Price ${money(Number(values.price))} · annual cash flow ${money(Number(values.cashFlow))} · ${String(values.cashFlowBasis || "").toUpperCase()} · imported recommendations applied. Books and customer concentration remain unresolved.`;
      const sourceLink = $("importNoticeSource");
      if (sourceLink && imported.affiliateUrl) sourceLink.href = imported.affiliateUrl;
      notice.classList.remove("hidden");
    }

    updateCashFlowBasisUI();
    render();
    return true;
  }

  function applySupportableLoan() {
    const input = getInputs();
    const calc = calculateDeal(input);
    $("loanAmt").value = Math.round(calc.maxSupportableLoan / 1000) * 1000;
    render();
  }

  function init() {
    document.body.classList.toggle("embed", EMBED_PARAM);
    document.documentElement.dataset.version = VERSION;
    $("versionLabel").textContent = `v${VERSION}`;
    $("calcBtn").addEventListener("click", render);
    $("resetBtn").addEventListener("click", () => reset({ clearImport: true }));
    $("applyMaxLoanBtn").addEventListener("click", applySupportableLoan);
    $("cashFlowBasis").addEventListener("change", render);
    $("managementIncluded").addEventListener("change", render);

    [
      "cashFlow", "managementCost", "capex", "otherDebt", "price", "loanAmt", "rate", "term", "targetDscr",
      "sellerNote", "buyerCash", "wcAtClose", "transactionCosts", "topCust", "ownerDep", "books", "recurring"
    ].forEach((id) => {
      const element = $(id);
      element.addEventListener(element.tagName === "SELECT" ? "change" : "input", render);
    });

    if ($("clearImportedDeal")) $("clearImportedDeal").addEventListener("click", clearImportState);

    reset();
    applyStoredImport();
  }

  document.addEventListener("DOMContentLoaded", init);
})();