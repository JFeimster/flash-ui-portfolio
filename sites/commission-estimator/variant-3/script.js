/**
 * Variant 3 — Lime Precision Fintech Presentation Controller
 */

import { COMMISSION_CONFIG } from "../shared/config/commission-config.js";
import { formatCurrency } from "../shared/lib/calculator-engine.js";
import {
  buildCommissionStreamSlices,
  renderProductDonutSVG,
  renderProjectionChartSVG,
  renderScenarioComparisonSVG,
} from "../shared/lib/charts.js";
import { initCalculatorApp } from "../shared/lib/controller.js";

const DONUT_PALETTE = ["#151A15", "#65A30D", "#A7FA3B", "#505850", "#9CA3AF"];

function buildInputs() {
  const allocEl = document.getElementById("product-allocation-inputs");

  if (allocEl) {
    allocEl.innerHTML = COMMISSION_CONFIG.products
      .filter((p) => p.enabled !== false)
      .map(
        (p) => `
        <div class="mix-row">
          <div class="mix-row-top">
            <label for="alloc-num-${p.id}">${p.name}</label>
            <span class="slate-note" data-rate-badge="${p.id}">${p.commissionRate}%</span>
          </div>
          <input id="alloc-range-${p.id}" type="range" min="0" max="100" step="5" class="f-slider" aria-label="${p.name} allocation slider" />
          <div class="mix-fields-grid">
            <label class="f-mini-field">
              <span>Avg Deal ($)</span>
              <input id="dsize-input-${p.id}" data-product-dsize="${p.id}" type="number" min="0" max="10000000" step="5000" class="f-num-input" aria-label="${p.name} average funded deal size" />
            </label>
            <label class="f-mini-field">
              <span>Rate (%)</span>
              <input id="rate-input-${p.id}" data-product-rate="${p.id}" type="number" min="0" max="25" step="0.1" class="f-num-input" aria-label="${p.name} commission rate percent" />
            </label>
            <label class="f-mini-field">
              <span>Mix (%)</span>
              <input id="alloc-num-${p.id}" type="number" min="0" max="100" step="1" class="f-num-input" aria-label="${p.name} allocation percentage" />
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

    // Accessible Donut Chart + Legend (Product Mix in Solo, Commission Streams when Overrides Active)
    const streamSlices = buildCommissionStreamSlices(results);
    const donutHeading = document.getElementById("donut-heading");
    if (donutHeading) {
      donutHeading.textContent = streamSlices
        ? "Commission Breakdown by Stream"
        : "Commission Breakdown by Product";
    }
    const donutSubtitle = document.getElementById("donut-subtitle");
    if (donutSubtitle) {
      donutSubtitle.textContent = streamSlices
        ? "Monthly gross commission split across personal production and agency overrides."
        : "Share of monthly gross commission across funding categories.";
    }

    const donutEl = document.getElementById("donut-chart-container");
    if (donutEl) {
      donutEl.innerHTML = renderProductDonutSVG(streamSlices || results.productResults, {
        palette: DONUT_PALETTE,
        centerTitle: "Monthly Gross",
        centerValue: formatCurrency(results.monthlyGrossCommission, true),
        textColor: "#151A15",
        mutedColor: "#505850",
      });
    }

    const legendEl = document.getElementById("donut-legend");
    if (legendEl) {
      if (streamSlices) {
        legendEl.innerHTML = streamSlices
          .map(
            (s, idx) => `
            <div class="legend-item">
              <span class="legend-left">
                <span class="legend-swatch" style="background:${DONUT_PALETTE[idx % DONUT_PALETTE.length]}"></span>
                <span>${s.shortName}</span>
              </span>
              <strong>${formatCurrency(s.grossCommission)} (${s.sharePercent}%)</strong>
            </div>`
          )
          .join("");
      } else {
        const total = Math.max(1, results.dealBasedMonthlyCommission);
        legendEl.innerHTML = results.productResults
          .map((p, idx) => {
            const pct = Math.round((p.grossCommission / total) * 100);
            return `
              <div class="legend-item">
                <span class="legend-left">
                  <span class="legend-swatch" style="background:${DONUT_PALETTE[idx % DONUT_PALETTE.length]}"></span>
                  <span>${p.shortName}</span>
                </span>
                <strong>${formatCurrency(p.grossCommission)} (${pct}%)</strong>
              </div>`;
          })
          .join("");
      }
    }

    // Commission breakdown table
    const tableBody = document.getElementById("product-table-body");
    if (tableBody) {
      tableBody.innerHTML = results.productResults
        .map(
          (p) => `
          <tr>
            <td>${p.productName}</td>
            <td class="num">${p.allocatedDeals.toFixed(1)}</td>
            <td class="num">${formatCurrency(p.dealSize)}</td>
            <td class="num">${formatCurrency(p.fundedVolume)}</td>
            <td class="num">${p.commissionRate.toFixed(1)}%</td>
            <td class="num"><strong>${formatCurrency(p.grossCommission)}</strong></td>
          </tr>`
        )
        .join("");
    }

    // Projection Bar Chart
    const horizonRows =
      state.projectionHorizon === 36
        ? results.projections36
        : state.projectionHorizon === 24
          ? results.projections24
          : results.projections12;

    const projEl = document.getElementById("projection-chart-container");
    if (projEl) {
      projEl.innerHTML = renderProjectionChartSVG(horizonRows, {
        barColor: "#65A30D",
        secondaryColor: "#151A15",
        gridColor: "#E8EBE7",
        textColor: "#505850",
        metric: chartMetric,
        rounded: 6,
      });
    }
    const projSummary = document.getElementById("projection-chart-summary");
    if (projSummary) {
      const end = horizonRows[horizonRows.length - 1];
      projSummary.textContent = `${state.projectionHorizon}-month cumulative earned gross commission: ${formatCurrency(end?.cumulativeEarned || 0)}.`;
    }

    // Scenario Chart
    const scenEl = document.getElementById("scenario-chart-container");
    if (scenEl) {
      scenEl.innerHTML = renderScenarioComparisonSVG(scenarios, {
        colors: ["#9CA3AF", "#65A30D", "#151A15"],
        gridColor: "#E8EBE7",
        textColor: "#505850",
        valueColor: "#151A15",
        rounded: 8,
        horizon: state.projectionHorizon,
      });
    }

    // Tier Stepper
    const tiersEl = document.getElementById("tiers-grid");
    if (tiersEl) {
      tiersEl.innerHTML = results.tier.tiersWithStatus
        .map((tier) => {
          const range = tier.maxDeals === null ? `${tier.minDeals}+ deals/mo` : `${tier.minDeals}–${tier.maxDeals} deals/mo`;
          return `
            <article class="step-card ${tier.isCurrent ? "is-current" : ""}">
              <span class="kpi-micro">${range}${tier.isCurrent ? " · Active" : ""}</span>
              <strong>${tier.name}</strong>
              <p>${tier.summary}</p>
            </article>`;
        })
        .join("");
    }
  },
});
