/**
 * Shared Semantic Controller & State Binder
 * Binds standardized semantic input identifiers including:
 * - Global & per-product average funded deal sizes
 * - Inline customizable per-product commission rates
 * - Plus/minus steppers for Deals Per Month and Average Deal Size
 */

import { COMMISSION_CONFIG, getEqualAllocations } from "../config/commission-config.js";
import { PARTNER_LINKS } from "../config/partner-links.js";
import { calculateAllScenarios, calculateCommissions, formatCurrency } from "./calculator-engine.js";
import { DISCLOSURES, FAQ_ITEMS, METHODOLOGY_STEPS } from "./faq-data.js";
import { mountPayPlanSuite } from "./pay-plan-ui.js";
import {
  copyScenarioShareLink,
  downloadFile,
  generatePrintableReportHTML,
  generateReportCSV,
  generateReportData,
} from "./reporting.js";
import {
  createBaselineDemoState,
  createDefaultState,
  decodeScenarioFromSearch,
  normalizeAllocationsTo100,
} from "./state.js";

export function initCalculatorApp(themeHooks) {
  let state = decodeScenarioFromSearch(window.location.search, COMMISSION_CONFIG);
  let chartMetric = themeHooks?.defaultChartMetric || "cumulative";
  let feedbackTimer = null;

  const rootEl = document.body;
  let payPlanUI = null;

  function showToast(message) {
    const toast = document.getElementById("mc-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function syncInputDOM() {
    const dealsSlider = document.getElementById("input-monthly-deals-slider");
    const dealsNumber = document.getElementById("input-monthly-deals");
    if (dealsSlider) {
      dealsSlider.value = String(Math.min(COMMISSION_CONFIG.limits.sliderMaxMonthlyDeals, state.monthlyDeals));
    }
    if (dealsNumber && document.activeElement !== dealsNumber) dealsNumber.value = String(state.monthlyDeals);

    const dealSizeInput = document.getElementById("input-avg-deal-size");
    if (dealSizeInput && document.activeElement !== dealSizeInput) dealSizeInput.value = String(state.averageDealSize);

    document.querySelectorAll("[data-deal-size-preset]").forEach((btn) => {
      const val = Number(btn.getAttribute("data-deal-size-preset"));
      const hasCustomSizes = Object.keys(state.customDealSizes || {}).length > 0;
      const active = !hasCustomSizes && Number(state.averageDealSize) === val;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-alloc-mode]").forEach((btn) => {
      const mode = btn.getAttribute("data-alloc-mode");
      const active = state.allocationMode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-scenario]").forEach((btn) => {
      const scen = btn.getAttribute("data-scenario");
      const active = state.scenario === scen;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-horizon]").forEach((btn) => {
      const h = Number(btn.getAttribute("data-horizon"));
      const active = Number(state.projectionHorizon) === h;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-chart-metric]").forEach((btn) => {
      const m = btn.getAttribute("data-chart-metric");
      const active = chartMetric === m;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    // Per-product allocation, deal size, and commission rate inputs (supports inline + advanced mirror)
    COMMISSION_CONFIG.products.forEach((p) => {
      const allocVal = state.allocations[p.id] ?? p.defaultAllocation;
      const allocRange = document.getElementById(`alloc-range-${p.id}`);
      const allocNum = document.getElementById(`alloc-num-${p.id}`);
      if (allocRange) {
        allocRange.value = String(allocVal);
        allocRange.disabled = state.allocationMode === "equal";
      }
      if (allocNum) {
        if (document.activeElement !== allocNum) allocNum.value = String(allocVal);
        allocNum.disabled = state.allocationMode === "equal";
      }

      // Sync every rate input for this product (both inline & advanced if both exist)
      const rateVal = state.customRates[p.id] !== undefined ? state.customRates[p.id] : p.commissionRate;
      document.querySelectorAll(`[data-product-rate="${p.id}"], #rate-input-${p.id}`).forEach((el) => {
        if (document.activeElement !== el) el.value = String(rateVal);
      });

      // Sync every per-product deal size input
      const dsizeVal =
        state.customDealSizes[p.id] !== undefined ? state.customDealSizes[p.id] : state.averageDealSize;
      document.querySelectorAll(`[data-product-dsize="${p.id}"], #dsize-input-${p.id}`).forEach((el) => {
        if (document.activeElement !== el) el.value = String(dsizeVal);
      });
    });

    // Advanced inputs
    const fieldMap = {
      "input-growth-rate": state.monthlyGrowthRate,
      "input-ramp-months": state.rampUpMonths,
      "input-max-capacity": state.maxMonthlyCapacity,
      "input-retention-rate": state.customerRetentionRate,
      "input-operating-expenses": state.operatingExpenses,
      "input-payment-delay": state.paymentDelayMonths,
      "input-target-income": state.targetMonthlyIncome,
      "input-credit-sub-clients": state.creditSubscriptionClientsPerMonth,
      "input-mult-conservative": state.scenarioMultipliers.conservative,
      "input-mult-base": state.scenarioMultipliers.base,
      "input-mult-optimistic": state.scenarioMultipliers.optimistic,
    };
    Object.entries(fieldMap).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = String(val);
    });

    const bonusToggle = document.getElementById("input-enable-bonuses");
    if (bonusToggle) bonusToggle.checked = Boolean(state.enableBonuses);
    const recurringToggle = document.getElementById("input-enable-recurring");
    if (recurringToggle) recurringToggle.checked = Boolean(state.enableRecurring);
    const creditSubToggle = document.getElementById("input-enable-credit-sub");
    if (creditSubToggle) creditSubToggle.checked = Boolean(state.enableCreditSubscription);
  }

  function render() {
    const results = calculateCommissions(state, COMMISSION_CONFIG);
    const scenarios = calculateAllScenarios(state, COMMISSION_CONFIG);
    syncInputDOM();

    const setText = (selector, text) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = text;
      });
    };

    setText("[data-out='monthlyGross']", formatCurrency(results.monthlyGrossCommission));
    setText("[data-out='annualizedGross']", formatCurrency(results.annualizedGrossCommission));
    setText("[data-out='firstYearGross']", formatCurrency(results.firstYearCumulativeCommission));
    setText("[data-out='threeYearGross']", formatCurrency(results.threeYearCumulativeCommission));
    setText("[data-out='monthlyVolume']", formatCurrency(results.totalMonthlyFundedVolume));
    setText("[data-out='weightedDealSize']", formatCurrency(results.weightedAverageDealSize));
    setText("[data-out='modeledDeals']", String(results.modeledMonthlyDeals));
    setText("[data-out='effectiveRate']", `${results.effectiveCommissionRatePercent.toFixed(2)}%`);
    setText("[data-out='monthlyReceipts']", formatCurrency(results.month1CommissionReceipts));
    setText("[data-out='monthlyExpenses']", formatCurrency(results.monthlyOperatingExpenses));
    setText("[data-out='monthlyNetIncome']", formatCurrency(results.monthlyNetOperatingIncome));
    setText("[data-out='currentTier']", results.tier.activeDisplay?.name || results.tier.currentTier.name);
    setText("[data-out='currentTierSummary']", results.tier.activeDisplay?.summary || results.tier.currentTier.summary);
    setText(
      "[data-out='nextTierStatus']",
      results.meta.payPlanId === "agency-override" && results.agencySummary?.ladder?.nextTier
        ? `Next Ladder Tier: T${results.agencySummary.ladder.nextTier.tier} (${results.agencySummary.ladder.nextTier.rate}%) at ${results.agencySummary.ladder.nextTier.minClients} clients & ${formatCurrency(results.agencySummary.ladder.nextTier.minTPBR)} TPBR`
        : results.tier.nextTier
          ? `${results.tier.dealsNeededForNextTier} more funded deal${results.tier.dealsNeededForNextTier === 1 ? "" : "s"}/mo to reach ${results.tier.nextTier.name}`
          : "Top demonstration production tier reached"
    );

    const allocTotalEl = document.querySelectorAll("[data-out='allocationTotal']");
    allocTotalEl.forEach((el) => {
      el.textContent = `${results.validation.allocationTotal.toFixed(0)}%`;
      el.classList.toggle("is-invalid", !results.validation.allocationValid);
    });

    // Income Target outputs
    setText("[data-out='targetIncomeDisplay']", formatCurrency(results.incomeTarget.targetMonthlyIncome));
    setText("[data-out='targetDealsNeeded']", `${results.incomeTarget.dealsNeeded} deals/mo`);
    setText("[data-out='targetVolumeNeeded']", formatCurrency(results.incomeTarget.volumeNeeded));
    setText("[data-out='targetAttainment']", `${Math.min(999, Math.round(results.incomeTarget.attainmentPercent))}%`);
    setText(
      "[data-out='targetGapText']",
      results.incomeTarget.monthlyGap >= 0
        ? `+${formatCurrency(results.incomeTarget.monthlyGap)}/mo above target`
        : `${formatCurrency(Math.abs(results.incomeTarget.monthlyGap))}/mo below target`
    );

    const targetBar = document.getElementById("target-progress-fill");
    if (targetBar) {
      targetBar.style.width = `${Math.min(100, Math.max(0, results.incomeTarget.attainmentPercent))}%`;
    }

    const validationBox = document.getElementById("validation-alert");
    if (validationBox) {
      if (!results.validation.isValid) {
        validationBox.hidden = false;
        validationBox.textContent = results.validation.errors.join(" ");
      } else {
        validationBox.hidden = true;
        validationBox.textContent = "";
      }
    }

    const tableBody = document.getElementById("projection-table-body");
    if (tableBody) {
      const horizonRows =
        state.projectionHorizon === 36
          ? results.projections36
          : state.projectionHorizon === 24
            ? results.projections24
            : results.projections12;
      tableBody.innerHTML = horizonRows
        .map(
          (row) => `
          <tr>
            <td>Month ${row.month}</td>
            <td class="num">${row.deals.toFixed(1)}</td>
            <td class="num">${formatCurrency(row.fundedVolume)}</td>
            <td class="num">${formatCurrency(row.commissionsEarned)}</td>
            <td class="num">${formatCurrency(row.commissionReceipts)}</td>
            <td class="num">${formatCurrency(row.estimatedPreTaxOperatingIncome)}</td>
            <td class="num">${formatCurrency(row.cumulativeEarned)}</td>
          </tr>`
        )
        .join("");
    }

    if (payPlanUI) {
      payPlanUI.sync(state, results);
    }

    if (themeHooks && typeof themeHooks.render === "function") {
      themeHooks.render({ state, results, scenarios, chartMetric });
    }
  }

  function wirePartnerLinks() {
    document.querySelectorAll("[data-partner-cta='become-partner']").forEach((el) => {
      if (!PARTNER_LINKS.becomePartnerUrl) { el.hidden = true; el.removeAttribute("href"); return; }
      el.setAttribute("href", PARTNER_LINKS.becomePartnerUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    document.querySelectorAll("[data-partner-cta='recruiter']").forEach((el) => {
      if (!PARTNER_LINKS.speakWithRecruiterUrl) { el.hidden = true; el.removeAttribute("href"); return; }
      el.setAttribute("href", PARTNER_LINKS.speakWithRecruiterUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    const leadStatus = document.getElementById("lead-endpoint-notice");
    const emailSubmitBtn = document.getElementById("btn-lead-submit");
    const emailInputs = document.querySelectorAll("[data-lead-input]");
    if (!PARTNER_LINKS.leadCaptureEndpoint) {
      if (leadStatus) {
        leadStatus.textContent =
          "Direct email delivery is currently disabled (no external CRM endpoint configured). Use the button below to download your complete earnings plan locally.";
      }
      if (emailSubmitBtn) {
        emailSubmitBtn.disabled = true;
        emailSubmitBtn.setAttribute("aria-disabled", "true");
      }
      emailInputs.forEach((inp) => {
        inp.disabled = true;
      });
    }
  }

  function wireStaticContent() {
    document.querySelectorAll("[data-disclosure='short']").forEach((el) => {
      el.textContent = DISCLOSURES.short;
    });
    document.querySelectorAll("[data-disclosure='demo']").forEach((el) => {
      el.textContent = DISCLOSURES.demonstrationBanner;
    });
    document.querySelectorAll("[data-disclosure='expanded']").forEach((el) => {
      el.textContent = DISCLOSURES.expanded;
    });

    const methodContainer = document.getElementById("methodology-list");
    if (methodContainer && !methodContainer.hasChildNodes()) {
      methodContainer.innerHTML = METHODOLOGY_STEPS.map(
        (m) => `
        <article class="method-item">
          <div class="method-step">${m.step}</div>
          <div class="method-content">
            <h4>${m.title}</h4>
            <p class="method-formula">${m.formula}</p>
            <p class="method-detail">${m.detail}</p>
          </div>
        </article>`
      ).join("");
    }

    const faqContainer = document.getElementById("faq-list");
    if (faqContainer && !faqContainer.hasChildNodes()) {
      faqContainer.innerHTML = FAQ_ITEMS.map(
        (item, idx) => `
        <details class="faq-item" ${idx === 0 ? "open" : ""}>
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>`
      ).join("");
    }
  }

  function wireEvents() {
    // Monthly deals slider + number input
    const dealsSlider = document.getElementById("input-monthly-deals-slider");
    const dealsNum = document.getElementById("input-monthly-deals");
    if (dealsSlider) {
      dealsSlider.addEventListener("input", (e) => {
        state.monthlyDeals = Math.max(0, Number(e.target.value));
        if (dealsNum) dealsNum.value = String(state.monthlyDeals);
        render();
      });
    }
    if (dealsNum) {
      dealsNum.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        state.monthlyDeals = Number.isNaN(val) ? 0 : val;
        render();
      });
    }

    // Plus / Minus steppers for Deals Per Month
    document.querySelectorAll("[data-step-deals]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.getAttribute("data-step-deals"));
        state.monthlyDeals = Math.max(
          0,
          Math.min(COMMISSION_CONFIG.limits.maxMonthlyDeals, Number(state.monthlyDeals || 0) + delta)
        );
        render();
      });
    });

    // Global Average Deal Size input + steppers + presets (applies across products)
    const dealSizeInput = document.getElementById("input-avg-deal-size");
    if (dealSizeInput) {
      dealSizeInput.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        state.averageDealSize = Number.isNaN(val) ? 0 : val;
        state.customDealSizes = {};
        render();
      });
    }
    document.querySelectorAll("[data-step-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.getAttribute("data-step-size"));
        state.averageDealSize = Math.max(
          0,
          Math.min(COMMISSION_CONFIG.limits.maxDealSize, Number(state.averageDealSize || 0) + delta)
        );
        state.customDealSizes = {};
        render();
      });
    });
    document.querySelectorAll("[data-deal-size-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.averageDealSize = Number(btn.getAttribute("data-deal-size-preset"));
        state.customDealSizes = {};
        render();
      });
    });

    // Allocation mode buttons
    document.querySelectorAll("[data-alloc-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-alloc-mode");
        state.allocationMode = mode === "equal" ? "equal" : "custom";
        if (state.allocationMode === "equal") {
          state.allocations = getEqualAllocations(COMMISSION_CONFIG);
        }
        render();
      });
    });

    // Balance 100% button
    const balanceBtn = document.getElementById("btn-balance-alloc");
    if (balanceBtn) {
      balanceBtn.addEventListener("click", () => {
        state.allocationMode = "custom";
        state.allocations = normalizeAllocationsTo100(state.allocations, COMMISSION_CONFIG);
        showToast("Product allocations balanced to 100%.");
        render();
      });
    }

    // Per-product allocation, deal size, and commission rate listeners
    COMMISSION_CONFIG.products.forEach((p) => {
      const allocRange = document.getElementById(`alloc-range-${p.id}`);
      const allocNum = document.getElementById(`alloc-num-${p.id}`);
      const onAlloc = (val) => {
        state.allocationMode = "custom";
        state.allocations = { ...state.allocations, [p.id]: Math.max(0, Number(val) || 0) };
        render();
      };
      if (allocRange) allocRange.addEventListener("input", (e) => onAlloc(e.target.value));
      if (allocNum) allocNum.addEventListener("input", (e) => onAlloc(e.target.value));

      // Per-product Commission Rate inputs (inline or advanced)
      document.querySelectorAll(`[data-product-rate="${p.id}"], #rate-input-${p.id}`).forEach((el) => {
        el.addEventListener("input", (e) => {
          const val = Number(e.target.value);
          state.customRates = {
            ...state.customRates,
            [p.id]: Number.isFinite(val) ? val : p.commissionRate,
          };
          render();
        });
      });

      // Per-product Average Funded Deal Size inputs
      document.querySelectorAll(`[data-product-dsize="${p.id}"], #dsize-input-${p.id}`).forEach((el) => {
        el.addEventListener("input", (e) => {
          const val = Number(e.target.value);
          state.customDealSizes = {
            ...state.customDealSizes,
            [p.id]: Number.isFinite(val) ? val : state.averageDealSize,
          };
          render();
        });
      });
    });

    // Scenario buttons
    document.querySelectorAll("[data-scenario]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.scenario = btn.getAttribute("data-scenario");
        render();
      });
    });

    // Horizon buttons
    document.querySelectorAll("[data-horizon]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.projectionHorizon = Number(btn.getAttribute("data-horizon"));
        render();
      });
    });

    // Chart metric buttons
    document.querySelectorAll("[data-chart-metric]").forEach((btn) => {
      btn.addEventListener("click", () => {
        chartMetric = btn.getAttribute("data-chart-metric");
        render();
      });
    });

    const bindNum = (id, setter) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", (e) => {
          setter(Number(e.target.value));
          render();
        });
      }
    };
    bindNum("input-growth-rate", (v) => (state.monthlyGrowthRate = Number.isFinite(v) ? v : 0));
    bindNum("input-ramp-months", (v) => (state.rampUpMonths = Number.isFinite(v) ? v : 0));
    bindNum("input-max-capacity", (v) => (state.maxMonthlyCapacity = Number.isFinite(v) ? v : 0));
    bindNum("input-retention-rate", (v) => (state.customerRetentionRate = Number.isFinite(v) ? v : 85));
    bindNum("input-operating-expenses", (v) => (state.operatingExpenses = Number.isFinite(v) ? v : 0));
    bindNum("input-payment-delay", (v) => (state.paymentDelayMonths = Number.isFinite(v) ? v : 0));
    bindNum("input-target-income", (v) => (state.targetMonthlyIncome = Number.isFinite(v) ? v : 0));
    bindNum("input-credit-sub-clients", (v) => (state.creditSubscriptionClientsPerMonth = Number.isFinite(v) ? v : 0));

    const bindCheck = (id, setter) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", (e) => {
          setter(Boolean(e.target.checked));
          render();
        });
      }
    };
    bindCheck("input-enable-bonuses", (v) => (state.enableBonuses = v));
    bindCheck("input-enable-recurring", (v) => (state.enableRecurring = v));
    bindCheck("input-enable-credit-sub", (v) => (state.enableCreditSubscription = v));

    // Action buttons
    rootEl.addEventListener("click", async (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (!actionBtn) return;
      const action = actionBtn.getAttribute("data-action");
      const results = calculateCommissions(state, COMMISSION_CONFIG);

      if (action === "download-projection") {
        const html = generatePrintableReportHTML(state, results);
        downloadFile(html, "moonshine-capital-earnings-projection.html", "text/html;charset=utf-8");
        showToast("Earnings projection report downloaded.");
      } else if (action === "download-csv") {
        const csv = generateReportCSV(state, results);
        downloadFile(csv, "moonshine-capital-commission-projection.csv", "text/csv;charset=utf-8");
        showToast("CSV projection exported.");
      } else if (action === "download-json") {
        const json = JSON.stringify(generateReportData(state, results), null, 2);
        downloadFile(json, "moonshine-capital-scenario.json", "application/json;charset=utf-8");
        showToast("Scenario JSON saved.");
      } else if (action === "print-pdf") {
        window.print();
      } else if (action === "copy-link") {
        const res = await copyScenarioShareLink(state);
        showToast(res.ok ? "Scenario link copied (zero personal data included)." : `Share link: ${res.url}`);
      } else if (action === "share-scenario") {
        const res = await copyScenarioShareLink(state);
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Moonshine Capital Commission Scenario",
              text: `Modeled ${results.modeledMonthlyDeals} deals/mo generating ${formatCurrency(results.monthlyGrossCommission)}/mo gross commission.`,
              url: res.url,
            });
            return;
          } catch {
            // Fall back
          }
        }
        showToast("Shareable scenario URL copied to clipboard.");
      } else if (action === "download-brochure") {
        if (PARTNER_LINKS.partnerBrochureUrl) {
          window.location.href = PARTNER_LINKS.partnerBrochureUrl;
        } else {
          const brochure = generatePrintableReportHTML(
            state,
            results,
            "Moonshine Capital Partner Program — Summary Brochure & Earnings Model"
          );
          downloadFile(brochure, "moonshine-capital-partner-brochure.html", "text/html;charset=utf-8");
          showToast("Partner summary brochure downloaded.");
        }
      } else if (action === "apply-baseline") {
        state = createBaselineDemoState(COMMISSION_CONFIG);
        showToast("Applied 3.0% uniform demonstration baseline ($15,000/mo).");
        render();
      } else if (action === "sync-deal-sizes") {
        state.customDealSizes = {};
        showToast(`Applied ${formatCurrency(state.averageDealSize)} deal size to all products.`);
        render();
      } else if (action === "reset-calculator") {
        state = createDefaultState(COMMISSION_CONFIG);
        chartMetric = themeHooks?.defaultChartMetric || "cumulative";
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, "", window.location.pathname);
        }
        showToast("Calculator reset to default configuration.");
        render();
      }
    });
  }

  wirePartnerLinks();
  wireStaticContent();
  payPlanUI = mountPayPlanSuite({
    getState: () => state,
    onStateChange: () => render(),
  });
  wireEvents();
  render();

  return {
    getState: () => state,
    setState: (next) => {
      state = { ...state, ...next };
      render();
    },
    getResults: () => calculateCommissions(state, COMMISSION_CONFIG),
  };
}
