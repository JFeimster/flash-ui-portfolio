/**
 * Variant 1 — Punk Utility Brutalism Presentation Controller
 * Matches the attached visual reference with per-product deal size & rate controls,
 * monthly product ring donut chart, and filled-green 36-month area trajectory chart.
 */

import { COMMISSION_CONFIG } from "../shared/config/commission-config.js";
import { formatCurrency } from "../shared/lib/calculator-engine.js";
import {
  buildCommissionStreamSlices,
  renderAreaProjectionChartSVG,
  renderProductDonutSVG,
  renderScenarioComparisonSVG,
} from "../shared/lib/charts.js";
import { initCalculatorApp } from "../shared/lib/controller.js";

const BRUTAL_DONUT_PALETTE = ["#00F23D", "#787878", "#D4D8E0", "#00A82B", "#4B525A"];

function buildDynamicInputs() {
  const allocContainer = document.getElementById("product-allocation-inputs");
  if (!allocContainer) return;

  allocContainer.innerHTML = COMMISSION_CONFIG.products
    .filter((p) => p.enabled !== false)
    .map(
      (p) => `
      <div class="pmix-row">
        <div class="pmix-name-wrap">
          <div class="pmix-name-line">
            <label for="alloc-num-${p.id}" class="pmix-name">${p.shortName}</label>
            <span class="pmix-deals-meta" data-product-meta="${p.id}"></span>
          </div>
          <input id="alloc-range-${p.id}" type="range" min="0" max="100" step="5" class="green-range" aria-label="${p.name} allocation slider" />
        </div>

        <div class="pmix-inputs-mobile-grid">
          <div class="pmix-cell">
            <span class="pmix-mobile-label">Avg Deal ($)</span>
            <div class="pmix-input-wrap">
              <span>$</span>
              <input id="dsize-input-${p.id}" data-product-dsize="${p.id}" type="number" min="0" max="10000000" step="5000" class="pmix-input" aria-label="${p.name} average funded deal size in dollars" />
            </div>
          </div>

          <div class="pmix-cell">
            <span class="pmix-mobile-label">Rate (%)</span>
            <div class="pmix-input-wrap">
              <input id="rate-input-${p.id}" data-product-rate="${p.id}" type="number" min="0" max="25" step="0.1" class="pmix-input" aria-label="${p.name} commission rate percent" />
              <span>%</span>
            </div>
          </div>

          <div class="pmix-cell">
            <span class="pmix-mobile-label">Mix (%)</span>
            <div class="pmix-input-wrap">
              <input id="alloc-num-${p.id}" type="number" min="0" max="100" step="1" class="pmix-input" aria-label="${p.name} allocation percentage" />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");
}

buildDynamicInputs();

initCalculatorApp({
  defaultChartMetric: "cumulative",
  render({ state, results, scenarios, chartMetric }) {
    // Per-product deal count metadata
    results.productResults.forEach((p) => {
      const meta = document.querySelector(`[data-product-meta="${p.productId}"]`);
      if (meta) {
        meta.textContent = `${p.allocatedDeals.toFixed(1)} deals · ${formatCurrency(p.grossCommission)}/mo`;
      }
    });

    // Monthly Ring Donut Chart + Legend (Product Mix in Solo, Commission Streams when Overrides Active)
    const streamSlices = buildCommissionStreamSlices(results);
    const donutHeading = document.getElementById("donut-heading");
    if (donutHeading) {
      donutHeading.textContent = streamSlices
        ? "COMMISSION BY STREAM (MONTHLY)"
        : "COMMISSION BY PRODUCT (MONTHLY)";
    }

    const donutEl = document.getElementById("donut-chart-container");
    if (donutEl) {
      donutEl.innerHTML = renderProductDonutSVG(streamSlices || results.productResults, {
        palette: BRUTAL_DONUT_PALETTE,
        centerTitle: "PER MONTH",
        centerValue: formatCurrency(results.monthlyGrossCommission),
        textColor: "#F7F7F4",
        mutedColor: "#B8B8B2",
        strokeWidth: 32,
      });
    }

    const legendEl = document.getElementById("donut-legend");
    if (legendEl) {
      if (streamSlices) {
        legendEl.innerHTML = streamSlices
          .map((s, idx) => {
            const swatch = BRUTAL_DONUT_PALETTE[idx % BRUTAL_DONUT_PALETTE.length];
            return `
              <div class="legend-item">
                <div class="legend-left">
                  <span class="legend-swatch" style="background:${swatch}"></span>
                  <div>
                    <div class="legend-name">${s.shortName} (${s.sharePercent}%)</div>
                    <div class="legend-meta">${s.meta}</div>
                  </div>
                </div>
                <div class="legend-val">${formatCurrency(s.grossCommission)}</div>
              </div>`;
          })
          .join("");
      } else {
        legendEl.innerHTML = results.productResults
          .map((p, idx) => {
            const swatch = BRUTAL_DONUT_PALETTE[idx % BRUTAL_DONUT_PALETTE.length];
            return `
              <div class="legend-item">
                <div class="legend-left">
                  <span class="legend-swatch" style="background:${swatch}"></span>
                  <div>
                    <div class="legend-name">${p.shortName} (${p.allocationPercentage}%)</div>
                    <div class="legend-meta">Avg ${formatCurrency(p.dealSize)} · ${p.commissionRate.toFixed(1)}% rate</div>
                  </div>
                </div>
                <div class="legend-val">${formatCurrency(p.grossCommission)}</div>
              </div>`;
          })
          .join("");
      }
    }

    // 36-Month Filled-Green Area Trajectory Chart
    const horizonRows =
      state.projectionHorizon === 36
        ? results.projections36
        : state.projectionHorizon === 24
          ? results.projections24
          : results.projections12;

    const projHeading = document.getElementById("projection-heading");
    if (projHeading) {
      projHeading.textContent = `${state.projectionHorizon}-MONTH COMMISSION PROJECTION`;
    }

    const projEl = document.getElementById("projection-chart-container");
    if (projEl) {
      projEl.innerHTML = renderAreaProjectionChartSVG(horizonRows, {
        lineColor: "#00F23D",
        gridColor: "#262626",
        axisColor: "#F7F7F4",
        textColor: "#B8B8B2",
        badgeBg: "#00F23D",
        badgeText: "#080808",
        metric: chartMetric,
        title: `${state.projectionHorizon}-Month Commission Projection`,
      });
    }

    const projSummary = document.getElementById("projection-chart-summary");
    if (projSummary) {
      const endRow = horizonRows[horizonRows.length - 1];
      projSummary.textContent = `${state.projectionHorizon}-month summary: Month 1 earned ${formatCurrency(horizonRows[0]?.commissionsEarned || 0)} · Month ${state.projectionHorizon} earned ${formatCurrency(endRow?.commissionsEarned || 0)} · Cumulative total ${formatCurrency(endRow?.cumulativeEarned || 0)}.`;
    }

    // Scenario comparison chart
    const scenEl = document.getElementById("scenario-chart-container");
    if (scenEl) {
      scenEl.innerHTML = renderScenarioComparisonSVG(scenarios, {
        colors: ["#929292", "#00F23D", "#F7F7F4"],
        gridColor: "#292929",
        textColor: "#929292",
        valueColor: "#F7F7F4",
        rounded: 0,
        horizon: state.projectionHorizon,
      });
    }

    const scenCards = document.getElementById("scenario-cards-strip");
    if (scenCards) {
      scenCards.innerHTML = ["conservative", "base", "optimistic"]
        .map((key) => {
          const s = scenarios[key];
          return `
            <div class="scenario-mini-card ${state.scenario === key ? "is-selected" : ""}">
              <span>${s.scenario.label} (${s.scenario.multiplier}x)</span>
              <strong>${formatCurrency(s.monthlyGrossCommission)}/mo</strong>
            </div>`;
        })
        .join("");
    }

    // Partner tiers cards (truthful milestones — never fabricating unverified rates)
    const tiersEl = document.getElementById("tiers-grid");
    if (tiersEl) {
      const tierBullets = {
        "pre-production": ["Partner portal onboarding", "Full product catalog access", "Scenario modeling tools"],
        bronze: ["Active funding deal desk", "Multi-product submissions", "Standard partner resources"],
        silver: ["Consistent monthly deal cadence", "Dedicated deal coordination", "Portfolio planning visibility"],
        gold: ["High-volume submission support", "Strategic deal structuring", "Multi-product pipeline tools"],
        platinum: ["Enterprise brokerage volume", "Executive partner collaboration", "Custom program review eligibility"],
      };
      tiersEl.innerHTML = results.tier.tiersWithStatus
        .map((tier) => {
          const range = tier.maxDeals === null ? `${tier.minDeals}+ DEALS` : `${tier.minDeals}–${tier.maxDeals} DEALS`;
          const bullets = tierBullets[tier.id] || ["Full product access", "Deal support"];
          return `
            <article class="tier-card ${tier.isCurrent ? "is-current" : ""}">
              <div class="tier-top-row">
                <div class="tier-name">${tier.name}</div>
                <span class="tier-tag">${tier.isCurrent ? "ACTIVE" : range}</span>
              </div>
              <div class="tier-highlight">${range}/MO</div>
              <div class="tier-sub">${tier.isCurrent ? "CURRENT MODELED TIER" : "ILLUSTRATIVE MILESTONE"}</div>
              <ul class="tier-checks">
                ${bullets.map((b) => `<li>${b}</li>`).join("")}
              </ul>
            </article>`;
        })
        .join("");
    }
  },
});
