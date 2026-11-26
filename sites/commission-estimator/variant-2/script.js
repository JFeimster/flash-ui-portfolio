/**
 * Variant 2 — Broker's Manifesto Presentation Controller
 */

import { COMMISSION_CONFIG } from "../shared/config/commission-config.js";
import { formatCurrency } from "../shared/lib/calculator-engine.js";
import { renderProjectionChartSVG, renderScenarioComparisonSVG } from "../shared/lib/charts.js";
import { initCalculatorApp } from "../shared/lib/controller.js";

function buildInputs() {
  const allocEl = document.getElementById("product-allocation-inputs");

  if (allocEl) {
    allocEl.innerHTML = COMMISSION_CONFIG.products
      .filter((p) => p.enabled !== false)
      .map(
        (p) => `
        <div class="alloc-item">
          <div class="alloc-item-head">
            <label for="alloc-num-${p.id}">${p.name}</label>
            <span class="annotation" data-rate-badge="${p.id}">${p.commissionRate}%</span>
          </div>
          <input id="alloc-range-${p.id}" type="range" min="0" max="100" step="5" class="ink-slider" aria-label="${p.name} allocation slider" />
          <div class="alloc-item-fields">
            <label class="alloc-sub-field">
              <span>Avg Deal ($)</span>
              <input id="dsize-input-${p.id}" data-product-dsize="${p.id}" type="number" min="0" max="10000000" step="5000" class="ink-input" aria-label="${p.name} average funded deal size" />
            </label>
            <label class="alloc-sub-field">
              <span>Rate (%)</span>
              <input id="rate-input-${p.id}" data-product-rate="${p.id}" type="number" min="0" max="25" step="0.1" class="ink-input" aria-label="${p.name} commission rate percent" />
            </label>
            <label class="alloc-sub-field">
              <span>Mix (%)</span>
              <input id="alloc-num-${p.id}" type="number" min="0" max="100" step="1" class="ink-input" aria-label="${p.name} allocation percentage" />
            </label>
          </div>
        </div>`
      )
      .join("");
  }
}

buildInputs();

initCalculatorApp({
  render({ state, results, scenarios, chartMetric }) {
    results.productResults.forEach((p) => {
      const badge = document.querySelector(`[data-rate-badge="${p.productId}"]`);
      if (badge) badge.textContent = `${p.allocatedDeals.toFixed(1)} deals · ${formatCurrency(p.grossCommission)}/mo`;
    });

    // Live Commission Flow Schematic
    const flowEl = document.getElementById("process-diagram");
    if (flowEl) {
      const hasOverrides = (results.commissionStreams?.totalOverrides || 0) > 0;
      const step3Label = hasOverrides
        ? `Personal ${formatCurrency(results.commissionStreams.personal)} + Overrides ${formatCurrency(results.commissionStreams.totalOverrides)}`
        : `${results.effectiveCommissionRatePercent.toFixed(2)}% blended · ${results.payPlan?.shortName || "Direct"}`;
      flowEl.innerHTML = `
        <div class="flow-node">
          <div class="flow-node-step">STEP 01 → FUNDED DEALS</div>
          <div class="flow-node-val">${results.modeledMonthlyDeals} / MO</div>
          <div class="flow-node-label">${results.scenario.label} (${results.scenario.multiplier}x) × ${formatCurrency(results.weightedAverageDealSize)} weighted avg</div>
        </div>
        <div class="flow-node">
          <div class="flow-node-step">STEP 02 → ELIGIBLE VOLUME</div>
          <div class="flow-node-val">${formatCurrency(results.totalMonthlyFundedVolume, true)}</div>
          <div class="flow-node-label">${results.payPlan?.name || "Direct Product Rate Plan"}</div>
        </div>
        <div class="flow-node">
          <div class="flow-node-step">STEP 03 → GROSS COMMISSION</div>
          <div class="flow-node-val">${formatCurrency(results.monthlyGrossCommission)}</div>
          <div class="flow-node-label">${step3Label}</div>
        </div>
        <div class="flow-node">
          <div class="flow-node-step">STEP 04 → PRE-TAX OPERATING</div>
          <div class="flow-node-val">${formatCurrency(results.monthlyNetOperatingIncome)}</div>
          <div class="flow-node-label">After ${formatCurrency(results.monthlyOperatingExpenses)}/mo operating expenses</div>
        </div>
      `;
    }

    // Broadsheet Product Ledger Table
    const ledgerBody = document.getElementById("product-ledger-body");
    if (ledgerBody) {
      ledgerBody.innerHTML = results.productResults
        .map(
          (p) => `
          <tr>
            <td><strong>${p.productName}</strong></td>
            <td class="num">${p.allocationPercentage}%</td>
            <td class="num">${p.allocatedDeals.toFixed(1)}</td>
            <td class="num">${formatCurrency(p.dealSize)}</td>
            <td class="num">${formatCurrency(p.fundedVolume)}</td>
            <td class="num">${p.commissionRate.toFixed(1)}%</td>
            <td class="num"><strong>${formatCurrency(p.grossCommission)}</strong></td>
          </tr>`
        )
        .join("");
    }

    // Technical Projection Charts
    const horizonRows =
      state.projectionHorizon === 36
        ? results.projections36
        : state.projectionHorizon === 24
          ? results.projections24
          : results.projections12;

    const projEl = document.getElementById("projection-chart-container");
    if (projEl) {
      projEl.innerHTML = renderProjectionChartSVG(horizonRows, {
        barColor: "#151515",
        secondaryColor: "#151515",
        gridColor: "#CFC6B5",
        textColor: "#4A463F",
        metric: chartMetric,
        rounded: 0,
      });
    }
    const projSummary = document.getElementById("projection-chart-summary");
    if (projSummary) {
      const last = horizonRows[horizonRows.length - 1];
      projSummary.textContent = `${state.projectionHorizon}-month cumulative earned total: ${formatCurrency(last?.cumulativeEarned || 0)}.`;
    }

    const scenEl = document.getElementById("scenario-chart-container");
    if (scenEl) {
      scenEl.innerHTML = renderScenarioComparisonSVG(scenarios, {
        colors: ["#85817A", "#151515", "#4A463F"],
        gridColor: "#CFC6B5",
        textColor: "#4A463F",
        valueColor: "#151515",
        rounded: 0,
        horizon: state.projectionHorizon,
      });
    }

    // Partner Milestones
    const tiersEl = document.getElementById("tiers-grid");
    if (tiersEl) {
      tiersEl.innerHTML = results.tier.tiersWithStatus
        .map((tier) => {
          const range = tier.maxDeals === null ? `${tier.minDeals}+ deals` : `${tier.minDeals}–${tier.maxDeals} deals`;
          return `
            <article class="milestone-card ${tier.isCurrent ? "is-current" : ""}">
              <span class="annotation">${range}${tier.isCurrent ? " · ACTIVE" : ""}</span>
              <strong>${tier.name}</strong>
              <p>${tier.summary}</p>
            </article>`;
        })
        .join("");
    }
  },
});
