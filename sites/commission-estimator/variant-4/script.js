/**
 * Variant 4 — Pastel Intelligence Presentation Controller
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

const PASTEL_DONUT = ["#793FDC", "#4E9F86", "#5E9ED6", "#D98A4E", "#A77AEF"];

function buildInputs() {
  const allocEl = document.getElementById("product-allocation-inputs");

  if (allocEl) {
    allocEl.innerHTML = COMMISSION_CONFIG.products
      .filter((p) => p.enabled !== false)
      .map(
        (p) => `
        <div class="mix-card">
          <div class="mix-top">
            <label for="alloc-num-${p.id}">${p.name}</label>
            <span class="muted" data-rate-badge="${p.id}">${p.commissionRate}%</span>
          </div>
          <input id="alloc-range-${p.id}" type="range" min="0" max="100" step="5" class="purple-slider" aria-label="${p.name} allocation slider" />
          <div class="mix-fields-grid">
            <label class="pastel-mini-field">
              <span>Avg Deal ($)</span>
              <input id="dsize-input-${p.id}" data-product-dsize="${p.id}" type="number" min="0" max="10000000" step="5000" class="soft-input" aria-label="${p.name} average funded deal size" />
            </label>
            <label class="pastel-mini-field">
              <span>Rate (%)</span>
              <input id="rate-input-${p.id}" data-product-rate="${p.id}" type="number" min="0" max="25" step="0.1" class="soft-input" aria-label="${p.name} commission rate percent" />
            </label>
            <label class="pastel-mini-field">
              <span>Mix (%)</span>
              <input id="alloc-num-${p.id}" type="number" min="0" max="100" step="1" class="soft-input" aria-label="${p.name} allocation percentage" />
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

    const streamSlices = buildCommissionStreamSlices(results);
    const donutHeading = document.getElementById("donut-heading");
    if (donutHeading) {
      donutHeading.textContent = streamSlices
        ? "Commission Stream Share"
        : "Product Commission Share";
    }

    const donutEl = document.getElementById("donut-chart-container");
    if (donutEl) {
      donutEl.innerHTML = renderProductDonutSVG(streamSlices || results.productResults, {
        palette: PASTEL_DONUT,
        centerTitle: "Monthly Gross",
        centerValue: formatCurrency(results.monthlyGrossCommission, true),
        textColor: "#241343",
        mutedColor: "#594877",
      });
    }

    const legendEl = document.getElementById("donut-legend");
    if (legendEl) {
      if (streamSlices) {
        legendEl.innerHTML = streamSlices
          .map(
            (s, idx) => `
            <div class="legend-row">
              <span class="legend-l">
                <span class="swatch" style="background:${PASTEL_DONUT[idx % PASTEL_DONUT.length]}"></span>
                <span>${s.shortName} <small class="muted">(${s.meta})</small></span>
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
              <div class="legend-row">
                <span class="legend-l">
                  <span class="swatch" style="background:${PASTEL_DONUT[idx % PASTEL_DONUT.length]}"></span>
                  <span>${p.shortName} <small class="muted">(${formatCurrency(p.dealSize)} · ${p.commissionRate.toFixed(1)}%)</small></span>
                </span>
                <strong>${formatCurrency(p.grossCommission)} (${pct}%)</strong>
              </div>`;
          })
          .join("");
      }
    }

    const horizonRows =
      state.projectionHorizon === 36
        ? results.projections36
        : state.projectionHorizon === 24
          ? results.projections24
          : results.projections12;

    const projEl = document.getElementById("projection-chart-container");
    if (projEl) {
      projEl.innerHTML = renderProjectionChartSVG(horizonRows, {
        barColor: "#793FDC",
        secondaryColor: "#241343",
        gridColor: "#E6DEFA",
        textColor: "#594877",
        metric: chartMetric,
        rounded: 8,
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
        colors: ["#A77AEF", "#793FDC", "#241343"],
        gridColor: "#E6DEFA",
        textColor: "#594877",
        valueColor: "#241343",
        rounded: 10,
        horizon: state.projectionHorizon,
      });
    }

    const tiersEl = document.getElementById("tiers-grid");
    if (tiersEl) {
      tiersEl.innerHTML = results.tier.tiersWithStatus
        .map((tier) => {
          const range = tier.maxDeals === null ? `${tier.minDeals}+ deals/mo` : `${tier.minDeals}–${tier.maxDeals} deals/mo`;
          return `
            <article class="pastel-tier ${tier.isCurrent ? "is-current" : ""}">
              <span class="spot-label">${range}${tier.isCurrent ? " · Active" : ""}</span>
              <strong>${tier.name}</strong>
              <p>${tier.summary}</p>
            </article>`;
        })
        .join("");
    }
  },
});
