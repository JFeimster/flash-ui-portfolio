/**
 * Shared Theme-Adaptive UI Module for Modular Multi-Partner Pay Plans
 * & Full Agency / Downline Override Suite.
 *
 * Uses CSS custom properties (--pp-*) so every visual variant inherits
 * its exact native design language without duplicating markup or logic.
 * Preserves input focus cleanly by toggling panel visibility and updating
 * data-pp-out nodes instead of destroying active inputs on keystroke.
 */

import { COMMISSION_CONFIG } from "../config/commission-config.js";
import {
  AGENCY_OVERRIDE_PLAN,
  ISO_VOLUME_SPLIT_PLAN,
  PAY_PLAN_LIST,
} from "../config/pay-plans/index.js";
import { calculatePlanComparison, formatCurrency } from "./calculator-engine.js";

const STYLE_ELEMENT_ID = "mc-pay-plan-suite-styles";

function injectSuiteStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
    .pp-suite {
      margin: 0 0 20px;
      border: var(--pp-border-width, 1.5px) solid var(--pp-border, #F7F7F4);
      background: var(--pp-bg, #111111);
      color: var(--pp-text, #F7F7F4);
      border-radius: var(--pp-radius, 0px);
      overflow: hidden;
    }
    .pp-header-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      background: var(--pp-head-bg, #161616);
      border-bottom: 1px solid var(--pp-rule, #2A2A2A);
    }
    .pp-header-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pp-eyebrow {
      font-family: var(--pp-font-mono, monospace);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--pp-accent, #00F23D);
    }
    .pp-heading {
      font-family: var(--pp-font-display, inherit);
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0;
      line-height: 1.1;
    }
    .pp-mode-toggle {
      display: inline-grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      padding: 3px;
      background: var(--pp-surface, #080808);
      border: 1px solid var(--pp-rule, #3A3A3A);
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-mode-btn {
      min-height: 36px;
      padding: 6px 14px;
      border: none;
      background: transparent;
      color: var(--pp-muted, #9A9A95);
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      cursor: pointer;
      border-radius: var(--pp-btn-radius, 0px);
      white-space: nowrap;
      transition: background-color 140ms ease, color 140ms ease;
    }
    .pp-mode-btn.is-active {
      background: var(--pp-accent, #00F23D);
      color: var(--pp-accent-ink, #080808);
    }

    .pp-plan-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
      padding: 14px 16px;
      background: var(--pp-bg, #111111);
    }
    .pp-plan-card {
      text-align: left;
      padding: 10px 12px;
      border: 1px solid var(--pp-rule, #333);
      background: var(--pp-surface, #0C0C0C);
      color: var(--pp-text, #F7F7F4);
      border-radius: var(--pp-card-radius, 0px);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: border-color 140ms ease, background-color 140ms ease;
    }
    .pp-plan-card:hover {
      border-color: var(--pp-accent, #00F23D);
    }
    .pp-plan-card.is-active {
      border-color: var(--pp-accent, #00F23D);
      box-shadow: inset 3px 0 0 var(--pp-accent, #00F23D);
      background: var(--pp-active-bg, #141d16);
    }
    .pp-plan-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .pp-plan-name {
      font-family: var(--pp-font-display, inherit);
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .pp-plan-badge {
      font-family: var(--pp-font-mono, monospace);
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      background: var(--pp-badge-bg, #222);
      color: var(--pp-accent, #00F23D);
      border-radius: var(--pp-btn-radius, 0px);
      white-space: nowrap;
    }
    .pp-plan-desc {
      font-size: 11px;
      color: var(--pp-muted, #A0A09A);
      line-height: 1.35;
    }

    .pp-context-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-top: 1px solid var(--pp-rule, #2A2A2A);
      background: var(--pp-surface, #0C0C0C);
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      color: var(--pp-muted, #B8B8B2);
    }
    .pp-context-bar strong {
      color: var(--pp-text, #F7F7F4);
    }
    .pp-active-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: var(--pp-accent, #00F23D);
      color: var(--pp-accent-ink, #080808);
      font-weight: 700;
      border-radius: var(--pp-btn-radius, 0px);
    }

    .pp-panels-wrap {
      padding: 16px;
      border-top: 1px solid var(--pp-rule, #2A2A2A);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .pp-panels-wrap[hidden],
    .pp-panel[hidden],
    .pp-sub-section[hidden] {
      display: none !important;
    }
    .pp-panel {
      border: 1px solid var(--pp-rule, #2E2E2E);
      background: var(--pp-surface, #0C0C0C);
      border-radius: var(--pp-card-radius, 0px);
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .pp-panel-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--pp-rule, #262626);
      padding-bottom: 10px;
    }
    .pp-panel-head h3 {
      margin: 0;
      font-family: var(--pp-font-display, inherit);
      font-size: 17px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .pp-panel-total {
      font-family: var(--pp-font-mono, monospace);
      font-size: 13px;
      font-weight: 700;
      color: var(--pp-accent, #00F23D);
    }
    .pp-grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    .pp-grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 10px;
    }
    .pp-grid-5 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
    }
    .pp-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      color: var(--pp-muted, #A0A09A);
    }
    .pp-field span {
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .pp-input, .pp-select {
      width: 100%;
      min-height: 38px;
      padding: 6px 10px;
      border: 1px solid var(--pp-input-border, #444);
      background: var(--pp-input-bg, #080808);
      color: var(--pp-text, #F7F7F4);
      font-family: var(--pp-font-mono, monospace);
      font-size: 13px;
      font-weight: 700;
      border-radius: var(--pp-btn-radius, 0px);
      font-variant-numeric: tabular-nums;
    }
    .pp-check-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 20px;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
    }
    .pp-check-row label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      cursor: pointer;
    }
    .pp-alert-warn {
      padding: 8px 12px;
      border: 1px solid #d97706;
      background: rgba(217, 119, 6, 0.14);
      color: var(--pp-text, #F7F7F4);
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-ladder-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 8px;
    }
    .pp-stat-box {
      padding: 10px 12px;
      border: 1px solid var(--pp-rule, #2A2A2A);
      background: var(--pp-bg, #111111);
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-stat-box small {
      display: block;
      font-family: var(--pp-font-mono, monospace);
      font-size: 10px;
      text-transform: uppercase;
      color: var(--pp-muted, #9A9A95);
    }
    .pp-stat-box strong {
      display: block;
      margin-top: 3px;
      font-family: var(--pp-font-mono, monospace);
      font-size: 14px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    .pp-table-wrap {
      overflow-x: auto;
    }
    .pp-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--pp-font-mono, monospace);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
    .pp-table th, .pp-table td {
      padding: 8px 8px;
      border-bottom: 1px solid var(--pp-rule, #262626);
      text-align: left;
      white-space: nowrap;
    }
    .pp-table th {
      font-size: 10px;
      text-transform: uppercase;
      color: var(--pp-muted, #9A9A95);
    }
    .pp-table td.num, .pp-table th.num {
      text-align: right;
    }
    .pp-table .pp-input {
      min-height: 32px;
      padding: 4px 6px;
      font-size: 12px;
      width: 84px;
      text-align: right;
    }
    .pp-table .pp-input-wide {
      width: 108px;
    }
    .pp-status-ok {
      display: inline-block;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 700;
      background: var(--pp-accent, #00F23D);
      color: var(--pp-accent-ink, #080808);
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-status-lock {
      display: inline-block;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid var(--pp-rule, #444);
      color: var(--pp-muted, #9A9A95);
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-status-rollup {
      display: inline-block;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 700;
      background: #f59e0b;
      color: #080808;
      border-radius: var(--pp-btn-radius, 0px);
    }

    .pp-brackets-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
      gap: 8px;
    }
    .pp-bracket-card {
      padding: 10px;
      border: 1px solid var(--pp-rule, #333);
      background: var(--pp-bg, #111);
      border-radius: var(--pp-btn-radius, 0px);
      font-family: var(--pp-font-mono, monospace);
    }
    .pp-bracket-card.is-active {
      border-color: var(--pp-accent, #00F23D);
      box-shadow: inset 0 3px 0 var(--pp-accent, #00F23D);
    }
    .pp-bracket-card small {
      display: block;
      font-size: 10px;
      color: var(--pp-muted, #9A9A95);
    }
    .pp-bracket-card strong {
      display: block;
      font-size: 16px;
      margin-top: 2px;
    }

    /* Commission Streams & Plan Comparison Strip */
    .pp-streams-box {
      margin: 16px 0 0;
      border: var(--pp-border-width, 1.5px) solid var(--pp-border, #F7F7F4);
      background: var(--pp-bg, #111111);
      color: var(--pp-text, #F7F7F4);
      border-radius: var(--pp-radius, 0px);
      padding: 14px 16px;
    }
    .pp-streams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .pp-stream-card {
      padding: 10px 12px;
      border: 1px solid var(--pp-rule, #2A2A2A);
      background: var(--pp-surface, #0C0C0C);
      border-radius: var(--pp-btn-radius, 0px);
    }
    .pp-stream-card.is-highlight {
      border-color: var(--pp-accent, #00F23D);
    }
    .pp-stream-card span {
      display: block;
      font-family: var(--pp-font-mono, monospace);
      font-size: 10px;
      text-transform: uppercase;
      color: var(--pp-muted, #9A9A95);
    }
    .pp-stream-card strong {
      display: block;
      margin-top: 4px;
      font-family: var(--pp-font-mono, monospace);
      font-size: 18px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .pp-compare-drawer {
      margin-top: 12px;
      border-top: 1px solid var(--pp-rule, #2A2A2A);
      padding-top: 10px;
    }
    .pp-compare-drawer summary {
      cursor: pointer;
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--pp-accent, #00F23D);
    }
    .pp-note {
      margin: 0;
      font-family: var(--pp-font-mono, monospace);
      font-size: 11px;
      color: var(--pp-muted, #9A9A95);
      line-height: 1.45;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Mount the Modular Pay-Plan & Agency Override Suite UI once and wire all event handlers.
 */
export function mountPayPlanSuite({ getState, onStateChange }) {
  injectSuiteStyles();
  const mountEl = document.getElementById("pay-plan-suite-mount");
  if (!mountEl) return { sync: () => {} };

  const ladderOptions = AGENCY_OVERRIDE_PLAN.performanceLadder
    .map(
      (t) =>
        `<option value="${t.tier}">Tier ${t.tier} · ${t.code} — ${t.rate}% (${t.minClients} clients / ${formatCurrency(t.minTPBR)} TPBR)</option>`
    )
    .join("");

  const brRateInputs = COMMISSION_CONFIG.products
    .filter((p) => p.enabled !== false)
    .map(
      (p) => `
      <label class="pp-field">
        <span>${p.shortName} BR (%)</span>
        <input type="number" min="0" max="30" step="0.5" class="pp-input" data-pp-br-rate="${p.id}" aria-label="${p.name} Bonus Revenue percent" />
      </label>`
    )
    .join("");

  const fiveLevelRows = AGENCY_OVERRIDE_PLAN.fiveLevelSchedule
    .map(
      (s, idx) => `
      <tr>
        <td><strong>L${s.level}</strong> <span class="pp-note">${s.level === 1 ? "Direct" : "Downline"}</span></td>
        <td class="num"><span data-pp-out="lvl-rate-${idx}">${s.rate.toFixed(1)}%</span></td>
        <td><span data-pp-out="lvl-gate-${idx}">${s.minFrontlineQCBs === 0 ? "Certified" : `${s.minFrontlineQCBs} QCBs`}</span></td>
        <td class="num"><input type="number" min="0" max="1000" step="1" class="pp-input" data-pp-lvl-brokers="${idx}" aria-label="Level ${s.level} active brokers" /></td>
        <td class="num"><input type="number" min="0" max="1000000" step="500" class="pp-input pp-input-wide" data-pp-lvl-br="${idx}" aria-label="Level ${s.level} average monthly BR per broker" /></td>
        <td><span data-pp-out="lvl-status-${idx}" class="pp-status-ok">UNLOCKED</span></td>
        <td class="num"><strong data-pp-out="lvl-payout-${idx}">$0</strong></td>
      </tr>`
    )
    .join("");

  const customLevelRateInputs = [0, 1, 2, 3, 4]
    .map(
      (idx) => `
      <label class="pp-field">
        <span>L${idx + 1} Override (%)</span>
        <input type="number" min="0" max="25" step="0.5" class="pp-input" data-pp-custom-lvl-rate="${idx}" aria-label="Custom Level ${idx + 1} override percent" />
      </label>`
    )
    .join("");

  mountEl.innerHTML = `
    <div class="pp-suite">
      <div class="pp-header-bar">
        <div class="pp-header-title">
          <span class="pp-eyebrow">Modular Multi-Partner Compensation Engine</span>
          <h2 class="pp-heading">Partner Pay Plan &amp; Agency Override Mode</h2>
        </div>
        <div class="pp-mode-toggle" role="group" aria-label="Operating Mode">
          <button type="button" class="pp-mode-btn" data-pp-opmode="solo">Solo Broker</button>
          <button type="button" class="pp-mode-btn" data-pp-opmode="agency">Agency / Overrides</button>
        </div>
      </div>

      <div class="pp-plan-grid" role="group" aria-label="Funding Partner Pay Plan Selector">
        ${PAY_PLAN_LIST.map(
          (p) => `
          <button type="button" class="pp-plan-card" data-pp-plan="${p.id}">
            <div class="pp-plan-top">
              <span class="pp-plan-name">${p.shortName}</span>
              <span class="pp-plan-badge">${p.badge}</span>
            </div>
            <span class="pp-plan-desc">${p.payoutBasisLabel}</span>
          </button>`
        ).join("")}
      </div>

      <div class="pp-context-bar">
        <div>
          Active Plan: <strong data-pp-out="planName">Direct Product Rate Plan</strong> ·
          <span data-pp-out="planSummary"></span>
        </div>
        <span class="pp-active-pill" data-pp-out="activeTierPill">Bronze</span>
      </div>

      <!-- DYNAMIC PLAN PANELS (Hidden cleanly in Direct Rate + Solo Mode) -->
      <div id="pp-dynamic-panels" class="pp-panels-wrap" hidden>

        <!-- A. AGENCY OVERRIDE & DOWNLINE PLAN: 18-TIER LADDER & QCB -->
        <div id="pp-panel-agency-ladder" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>18-Tier Performance Ladder &amp; QCB Qualification (Bonus Revenue Base)</h3>
            <span class="pp-panel-total">Personal BR: <span data-pp-out="personalBR">$0</span>/mo</span>
          </div>

          <div class="pp-grid-2">
            <label class="pp-field">
              <span>Starting Performance Ladder Tier (1–18)</span>
              <select id="pp-agency-start-tier" class="pp-select">${ladderOptions}</select>
            </label>
            <label class="pp-field">
              <span>New Unique Clients Ratio (% of Funded Deals; Renewals Add BR Only)</span>
              <input id="pp-agency-unique-ratio" type="number" min="10" max="100" step="5" class="pp-input" />
            </label>
          </div>

          <div class="pp-check-row">
            <label><input id="pp-agency-certified" type="checkbox" /> Certified Broker (Annual Certification Active)</label>
            <label><input id="pp-agency-qcb" type="checkbox" /> Qualified Certified Broker (QCB — 1st 30 Days or $1k+ Rolling 6-Mo BR)</label>
            <label><input id="pp-agency-autoadvance" type="checkbox" /> Auto-Advance 18-Tier Ladder Over 12–36 Months</label>
          </div>

          <div id="pp-qcb-warning" class="pp-alert-warn" hidden></div>

          <div class="pp-ladder-strip">
            <div class="pp-stat-box">
              <small>Month 1 Active Tier</small>
              <strong data-pp-out="ladderM1">—</strong>
            </div>
            <div class="pp-stat-box">
              <small>Month 12 Projected Tier</small>
              <strong data-pp-out="ladderM12">—</strong>
            </div>
            <div class="pp-stat-box">
              <small>Month 36 Projected Tier</small>
              <strong data-pp-out="ladderM36">—</strong>
            </div>
            <div class="pp-stat-box">
              <small>Next Ladder Gate</small>
              <strong data-pp-out="ladderNextGate">—</strong>
            </div>
          </div>

          <details>
            <summary class="pp-note" style="cursor:pointer; font-weight:700;">Customize Product Bonus Revenue (BR %) Rates</summary>
            <div class="pp-grid-5" style="margin-top:10px;">${brRateInputs}</div>
          </details>
        </div>

        <!-- B. ISO POINTS SPLIT & VOLUME-TIERED PLAN -->
        <div id="pp-panel-iso" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>ISO Buy/Sell Points Split &amp; Monthly Volume Brackets</h3>
            <span class="pp-panel-total" data-pp-out="isoActiveSplit">60% Split</span>
          </div>
          <div class="pp-grid-2">
            <label class="pp-field">
              <span>Gross Buy/Sell Markup Points (% of Funded Volume)</span>
              <input id="pp-iso-points" type="number" min="0" max="20" step="0.5" class="pp-input" />
            </label>
            <div class="pp-stat-box">
              <small>Gross Markup Pool / Mo</small>
              <strong data-pp-out="isoMarkupPool">$0</strong>
            </div>
          </div>
          <div class="pp-brackets-4" id="pp-iso-brackets">
            ${ISO_VOLUME_SPLIT_PLAN.volumeBrackets
              .map(
                (b) => `
              <div class="pp-bracket-card" data-pp-iso-bracket="${b.id}">
                <small>${b.name}</small>
                <strong>${b.brokerSplitPercent}% Split</strong>
                <small>${b.maxMonthlyVolume ? `${formatCurrency(b.minMonthlyVolume)}–${formatCurrency(b.maxMonthlyVolume)}` : `${formatCurrency(b.minMonthlyVolume)}+/mo`}</small>
              </div>`
              )
              .join("")}
          </div>

          <div id="pp-iso-subbroker-box" class="pp-sub-section" hidden>
            <div class="pp-panel-head" style="margin-top:8px;">
              <h3>Direct Sub-Broker Override</h3>
              <span class="pp-panel-total" data-pp-out="isoSubOverride">$0/mo</span>
            </div>
            <div class="pp-grid-3" style="margin-top:10px;">
              <label class="pp-field">
                <span>Active Sub-Brokers</span>
                <input id="pp-iso-sub-count" type="number" min="0" max="500" step="1" class="pp-input" />
              </label>
              <label class="pp-field">
                <span>Avg Monthly Volume / Sub-Broker ($)</span>
                <input id="pp-iso-sub-vol" type="number" min="0" max="10000000" step="25000" class="pp-input" />
              </label>
              <label class="pp-field">
                <span>Sub-Broker Override (% of Vol)</span>
                <input id="pp-iso-sub-pct" type="number" min="0" max="10" step="0.25" class="pp-input" />
              </label>
            </div>
          </div>
        </div>

        <!-- C. CUSTOM PARTNER & OVERRIDE BUILDER -->
        <div id="pp-panel-custom" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>Custom Partner Formula &amp; Override Builder</h3>
            <span class="pp-panel-total" data-pp-out="customFormulaBadge">Bonus Revenue × 60%</span>
          </div>
          <div class="pp-grid-3">
            <label class="pp-field">
              <span>Commission Base Formula</span>
              <select id="pp-custom-basetype" class="pp-select">
                <option value="direct-percent">Direct % of Funded Volume</option>
                <option value="bonus-revenue">Bonus Revenue (BR %) × Split %</option>
                <option value="points-markup">Points Markup × Split %</option>
              </select>
            </label>
            <label class="pp-field">
              <span>Personal Broker Split (%)</span>
              <input id="pp-custom-split" type="number" min="0" max="100" step="2.5" class="pp-input" />
            </label>
            <label class="pp-field" id="pp-custom-br-wrap">
              <span>Default Bonus Revenue (%)</span>
              <input id="pp-custom-br" type="number" min="0" max="30" step="0.5" class="pp-input" />
            </label>
            <label class="pp-field" id="pp-custom-pts-wrap" hidden>
              <span>Markup Points (%)</span>
              <input id="pp-custom-pts" type="number" min="0" max="20" step="0.5" class="pp-input" />
            </label>
            <label class="pp-field">
              <span>Custom Spread Override (%)</span>
              <input id="pp-custom-spread" type="number" min="0" max="50" step="1" class="pp-input" />
            </label>
          </div>
          <div id="pp-custom-levels-rates" class="pp-sub-section" hidden>
            <div class="pp-note" style="margin-bottom:8px; font-weight:700;">CUSTOM 5-LEVEL DOWNLINE OVERRIDE RATES (%)</div>
            <div class="pp-grid-5">${customLevelRateInputs}</div>
          </div>
        </div>

        <!-- D. OVERRIDE SPREAD SIMULATOR (WITH QCB ROLL-UP) -->
        <div id="pp-panel-spread" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>Differential Override Spread Simulator (With QCB Roll-Up)</h3>
            <span class="pp-panel-total" data-pp-out="spreadTotal">$0/mo</span>
          </div>
          <p class="pp-note">Formula: Your Effective Tier % − Highest Active QCB Tier % Below You. Uncheck an intermediate manager's QCB status to simulate automatic spread roll-up.</p>
          <div class="pp-table-wrap">
            <table class="pp-table">
              <thead>
                <tr>
                  <th>Team Cohort</th>
                  <th class="num">Brokers</th>
                  <th class="num">Avg BR/Mo ($)</th>
                  <th class="num">Broker %</th>
                  <th class="num">Mid-Mgr %</th>
                  <th>Mid QCB</th>
                  <th class="num">Your Spread</th>
                  <th class="num">Monthly Pay</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Direct Brokers</strong></td>
                  <td class="num"><input type="number" min="0" max="500" step="1" class="pp-input" data-pp-cohort="0" data-pp-cfield="activeBrokers" aria-label="Direct cohort active brokers" /></td>
                  <td class="num"><input type="number" min="0" max="1000000" step="500" class="pp-input pp-input-wide" data-pp-cohort="0" data-pp-cfield="avgMonthlyBR" aria-label="Direct cohort average monthly BR" /></td>
                  <td class="num"><input type="number" min="0" max="80" step="2.5" class="pp-input" data-pp-cohort="0" data-pp-cfield="brokerTierRate" aria-label="Direct cohort broker tier percent" /></td>
                  <td class="num"><input type="number" min="0" max="80" step="2.5" class="pp-input" data-pp-cohort="0" data-pp-cfield="intermediateManagerRate" aria-label="Direct cohort intermediate manager percent" /></td>
                  <td><input type="checkbox" data-pp-cohort="0" data-pp-cfield="intermediateIsQCB" aria-label="Direct cohort intermediate manager QCB active" /> <span data-pp-out="cohort-badge-0"></span></td>
                  <td class="num"><span data-pp-out="cohort-spread-0">0%</span></td>
                  <td class="num"><strong data-pp-out="cohort-pay-0">$0</strong></td>
                </tr>
                <tr>
                  <td><strong>Managed Team</strong></td>
                  <td class="num"><input type="number" min="0" max="500" step="1" class="pp-input" data-pp-cohort="1" data-pp-cfield="activeBrokers" aria-label="Managed cohort active brokers" /></td>
                  <td class="num"><input type="number" min="0" max="1000000" step="500" class="pp-input pp-input-wide" data-pp-cohort="1" data-pp-cfield="avgMonthlyBR" aria-label="Managed cohort average monthly BR" /></td>
                  <td class="num"><input type="number" min="0" max="80" step="2.5" class="pp-input" data-pp-cohort="1" data-pp-cfield="brokerTierRate" aria-label="Managed cohort broker tier percent" /></td>
                  <td class="num"><input type="number" min="0" max="80" step="2.5" class="pp-input" data-pp-cohort="1" data-pp-cfield="intermediateManagerRate" aria-label="Managed cohort intermediate manager percent" /></td>
                  <td><input type="checkbox" data-pp-cohort="1" data-pp-cfield="intermediateIsQCB" aria-label="Managed cohort intermediate manager QCB active" /> <span data-pp-out="cohort-badge-1"></span></td>
                  <td class="num"><span data-pp-out="cohort-spread-1">0%</span></td>
                  <td class="num"><strong data-pp-out="cohort-pay-1">$0</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- E. 5-LEVEL AGENCY DOWNLINE PAY -->
        <div id="pp-panel-five-level" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>5-Level Agency Downline Pay (4% / 2% / 2% / 2% / 2%)</h3>
            <span class="pp-panel-total" data-pp-out="fiveLevelTotal">$0/mo</span>
          </div>
          <div class="pp-grid-2" id="pp-frontline-qcb-row">
            <label class="pp-field">
              <span>Personally Enrolled Active QCBs (Unlocks L2@3 · L3@6 · L4@10 · L5@20)</span>
              <input id="pp-agency-frontline-qcbs" type="number" min="0" max="200" step="1" class="pp-input" />
            </label>
            <div class="pp-stat-box">
              <small>Active Unlocked Depth</small>
              <strong data-pp-out="fiveLevelDepth">3 of 5 Levels</strong>
            </div>
          </div>
          <div class="pp-table-wrap">
            <table class="pp-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th class="num">Rate</th>
                  <th>Unlock Gate</th>
                  <th class="num">Brokers</th>
                  <th class="num">Avg BR/Mo ($)</th>
                  <th>Status</th>
                  <th class="num">Monthly Pay</th>
                </tr>
              </thead>
              <tbody>${fiveLevelRows}</tbody>
            </table>
          </div>
          <p class="pp-note">5-Level overrides are paid monthly on the 15th for prior month's imported BR (+1 month cash receipt lag in projections) regardless of override spread.</p>
        </div>

        <!-- F. 2-GEN TOP-TIER LEADERSHIP OVERRIDE -->
        <div id="pp-panel-leadership" class="pp-panel" hidden>
          <div class="pp-panel-head">
            <h3>2-Generation Top-Tier Leadership Override (2% Openline BR)</h3>
            <span class="pp-panel-total" data-pp-out="leadershipTotal">$0/mo</span>
          </div>
          <div id="pp-leadership-status" class="pp-note"></div>
          <div class="pp-grid-3">
            <label class="pp-field">
              <span>1st-Gen Top-Tier Openline BR ($/mo · 2%)</span>
              <input id="pp-lead-gen1" type="number" min="0" max="50000000" step="10000" class="pp-input" />
            </label>
            <label class="pp-field">
              <span>2nd-Gen Top-Tier Openline BR ($/mo · 2%)</span>
              <input id="pp-lead-gen2" type="number" min="0" max="50000000" step="10000" class="pp-input" />
            </label>
            <label class="pp-field">
              <span>3rd-Gen+ Openline BR ($/mo · Capped at 0%)</span>
              <input id="pp-lead-gen3" type="number" min="0" max="50000000" step="10000" class="pp-input" />
            </label>
          </div>
        </div>

      </div>
    </div>
  `;

  // Wire Pay Plan cards
  mountEl.querySelectorAll("[data-pp-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextPlan = btn.getAttribute("data-pp-plan");
      const st = getState();
      st.payPlanId = nextPlan;
      if (nextPlan === "direct-rate") {
        st.operatingMode = "solo";
      }
      onStateChange();
    });
  });

  // Wire Solo vs Agency / Overrides mode toggle
  mountEl.querySelectorAll("[data-pp-opmode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextMode = btn.getAttribute("data-pp-opmode");
      const st = getState();
      st.operatingMode = nextMode === "agency" ? "agency" : "solo";
      if (st.operatingMode === "agency" && st.payPlanId === "direct-rate") {
        st.payPlanId = "agency-override";
      }
      onStateChange();
    });
  });

  // Wire Agency Ladder controls
  const bindEl = (id, event, fn) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(event, (e) => {
        fn(e, getState());
        onStateChange();
      });
    }
  };

  bindEl("pp-agency-start-tier", "change", (e, st) => {
    st.agency.startingTier = Number(e.target.value) || 2;
  });
  bindEl("pp-agency-unique-ratio", "input", (e, st) => {
    st.agency.uniqueClientRatioPercent = Number(e.target.value) || 75;
  });
  bindEl("pp-agency-certified", "change", (e, st) => {
    st.agency.isCertified = Boolean(e.target.checked);
  });
  bindEl("pp-agency-qcb", "change", (e, st) => {
    st.agency.isQCB = Boolean(e.target.checked);
  });
  bindEl("pp-agency-autoadvance", "change", (e, st) => {
    st.agency.autoAdvanceLadder = Boolean(e.target.checked);
  });
  bindEl("pp-agency-frontline-qcbs", "input", (e, st) => {
    st.agency.frontlineQCBs = Math.max(0, Number(e.target.value) || 0);
  });

  // Wire Product BR Rates
  mountEl.querySelectorAll("[data-pp-br-rate]").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const pid = inp.getAttribute("data-pp-br-rate");
      const st = getState();
      const val = Number(e.target.value);
      st.agency.customBRRates = {
        ...st.agency.customBRRates,
        [pid]: Number.isFinite(val) ? val : AGENCY_OVERRIDE_PLAN.defaultProductBRRates[pid] || 6,
      };
      onStateChange();
    });
  });

  // Wire Override Spread cohorts
  mountEl.querySelectorAll("[data-pp-cohort]").forEach((inp) => {
    const idx = Number(inp.getAttribute("data-pp-cohort"));
    const field = inp.getAttribute("data-pp-cfield");
    const evt = inp.type === "checkbox" ? "change" : "input";
    inp.addEventListener(evt, (e) => {
      const st = getState();
      if (!st.agency.spreadCohorts[idx]) return;
      st.agency.spreadCohorts[idx][field] =
        inp.type === "checkbox" ? Boolean(e.target.checked) : Number(e.target.value) || 0;
      onStateChange();
    });
  });

  // Wire 5-Level inputs
  mountEl.querySelectorAll("[data-pp-lvl-brokers]").forEach((inp) => {
    const idx = Number(inp.getAttribute("data-pp-lvl-brokers"));
    inp.addEventListener("input", (e) => {
      const st = getState();
      st.agency.fiveLevels[idx].brokers = Math.max(0, Number(e.target.value) || 0);
      onStateChange();
    });
  });
  mountEl.querySelectorAll("[data-pp-lvl-br]").forEach((inp) => {
    const idx = Number(inp.getAttribute("data-pp-lvl-br"));
    inp.addEventListener("input", (e) => {
      const st = getState();
      st.agency.fiveLevels[idx].avgMonthlyBR = Math.max(0, Number(e.target.value) || 0);
      onStateChange();
    });
  });

  // Wire 2-Gen Leadership inputs
  bindEl("pp-lead-gen1", "input", (e, st) => {
    st.agency.leadership.gen1OpenlineBR = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-lead-gen2", "input", (e, st) => {
    st.agency.leadership.gen2OpenlineBR = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-lead-gen3", "input", (e, st) => {
    st.agency.leadership.gen3OpenlineBR = Math.max(0, Number(e.target.value) || 0);
  });

  // Wire ISO Split controls
  bindEl("pp-iso-points", "input", (e, st) => {
    st.iso.markupPoints = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-iso-sub-count", "input", (e, st) => {
    st.iso.subBrokerCount = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-iso-sub-vol", "input", (e, st) => {
    st.iso.subBrokerAvgMonthlyVolume = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-iso-sub-pct", "input", (e, st) => {
    st.iso.subBrokerOverridePercent = Math.max(0, Number(e.target.value) || 0);
  });

  // Wire Custom Partner Builder controls
  bindEl("pp-custom-basetype", "change", (e, st) => {
    st.customPlan.baseType = e.target.value;
  });
  bindEl("pp-custom-split", "input", (e, st) => {
    st.customPlan.personalSplitPercent = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-custom-br", "input", (e, st) => {
    st.customPlan.bonusRevenuePercent = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-custom-pts", "input", (e, st) => {
    st.customPlan.markupPoints = Math.max(0, Number(e.target.value) || 0);
  });
  bindEl("pp-custom-spread", "input", (e, st) => {
    st.customPlan.spreadOverridePercent = Math.max(0, Number(e.target.value) || 0);
  });
  mountEl.querySelectorAll("[data-pp-custom-lvl-rate]").forEach((inp) => {
    const idx = Number(inp.getAttribute("data-pp-custom-lvl-rate"));
    inp.addEventListener("input", (e) => {
      const st = getState();
      st.customPlan.levelRates[idx] = Math.max(0, Number(e.target.value) || 0);
      onStateChange();
    });
  });

  function setValSafe(el, val) {
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(val);
    } else if (document.activeElement !== el) {
      el.value = String(val);
    }
  }

  function setOut(key, text) {
    mountEl.querySelectorAll(`[data-pp-out="${key}"]`).forEach((el) => {
      el.textContent = text;
    });
  }

  function sync(state, results) {
    const planId = results.meta.payPlanId;
    const isAgency = state.operatingMode === "agency";

    // Active plan cards & mode toggle
    mountEl.querySelectorAll("[data-pp-plan]").forEach((btn) => {
      const active = btn.getAttribute("data-pp-plan") === planId;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    mountEl.querySelectorAll("[data-pp-opmode]").forEach((btn) => {
      const active = btn.getAttribute("data-pp-opmode") === state.operatingMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    setOut("planName", results.payPlan.name);
    setOut("planSummary", results.payPlan.summary);
    setOut("activeTierPill", results.tier.activeDisplay?.name || results.tier.currentTier.name);

    // Progressive Disclosure: show panels ONLY when non-default plan or Agency Mode is active
    const dynWrap = document.getElementById("pp-dynamic-panels");
    const showAnyPanel = planId !== "direct-rate" || isAgency;
    if (dynWrap) dynWrap.hidden = !showAnyPanel;

    const pLadder = document.getElementById("pp-panel-agency-ladder");
    const pIso = document.getElementById("pp-panel-iso");
    const pCustom = document.getElementById("pp-panel-custom");
    const pSpread = document.getElementById("pp-panel-spread");
    const pFive = document.getElementById("pp-panel-five-level");
    const pLead = document.getElementById("pp-panel-leadership");

    if (pLadder) pLadder.hidden = planId !== "agency-override";
    if (pIso) pIso.hidden = planId !== "iso-volume-split";
    if (pCustom) pCustom.hidden = planId !== "custom-partner";
    if (pSpread) pSpread.hidden = !(isAgency && (planId === "agency-override" || planId === "custom-partner"));
    if (pFive) pFive.hidden = !(isAgency && (planId === "agency-override" || planId === "custom-partner"));
    if (pLead) pLead.hidden = !(isAgency && planId === "agency-override");

    // Sync Agency Ladder inputs & readouts
    setValSafe(document.getElementById("pp-agency-start-tier"), state.agency.startingTier);
    setValSafe(document.getElementById("pp-agency-unique-ratio"), state.agency.uniqueClientRatioPercent);
    setValSafe(document.getElementById("pp-agency-certified"), state.agency.isCertified);
    setValSafe(document.getElementById("pp-agency-qcb"), state.agency.isQCB);
    setValSafe(document.getElementById("pp-agency-autoadvance"), state.agency.autoAdvanceLadder);
    setValSafe(document.getElementById("pp-agency-frontline-qcbs"), state.agency.frontlineQCBs);

    mountEl.querySelectorAll("[data-pp-br-rate]").forEach((inp) => {
      const pid = inp.getAttribute("data-pp-br-rate");
      const val =
        state.agency.customBRRates?.[pid] !== undefined
          ? state.agency.customBRRates[pid]
          : AGENCY_OVERRIDE_PLAN.defaultProductBRRates[pid] ?? 6;
      setValSafe(inp, val);
    });

    const lad = results.agencySummary.ladder;
    const lad12 = results.agencySummary.month12Ladder;
    const lad36 = results.agencySummary.month36Ladder;
    setOut("personalBR", formatCurrency(results.totalMonthlyPersonalBR));
    setOut("ladderM1", `T${lad.effectiveTier.tier} ${lad.effectiveTier.code} (${lad.effectiveTier.rate}%)`);
    setOut("ladderM12", `T${lad12.effectiveTier.tier} ${lad12.effectiveTier.code} (${lad12.effectiveTier.rate}%)`);
    setOut("ladderM36", `T${lad36.effectiveTier.tier} ${lad36.effectiveTier.code} (${lad36.effectiveTier.rate}%)`);
    setOut(
      "ladderNextGate",
      lad.nextTier
        ? `T${lad.nextTier.tier} (${lad.nextTier.rate}%): ${lad.nextTier.minClients} clients & ${formatCurrency(lad.nextTier.minTPBR)} TPBR`
        : "Top Tier Reached (80%)"
    );

    const warnEl = document.getElementById("pp-qcb-warning");
    if (warnEl) {
      if (!state.agency.isCertified) {
        warnEl.hidden = false;
        warnEl.textContent =
          "Uncertified Status Active: Personal commission is reduced to Tier 1 Referral Partner (10%) and all Agency Overrides (Spread, L1–L5, Leadership) are paused until certification.";
      } else if (!state.agency.isQCB) {
        warnEl.hidden = false;
        warnEl.textContent = lad.qcbDropped
          ? `QCB Inactive Fallback Triggered: Personal split temporarily dropped from Tier ${lad.earnedTier.tier} (${lad.earnedTier.rate}%) to Tier ${lad.effectiveTier.tier} (${lad.effectiveTier.rate}%). Override Spreads, L2–L5, and Leadership Overrides are $0 (Level 1 4% remains active while certified).`
          : "QCB Inactive: Override Spreads, L2–L5 Downline Pay, and Leadership Overrides are paused ($0) until $1,000+ rolling 6-month Personal BR is restored (Level 1 4% remains active while certified).";
      } else {
        warnEl.hidden = true;
      }
    }

    // Sync Override Spread cohorts
    state.agency.spreadCohorts.forEach((c, idx) => {
      ["activeBrokers", "avgMonthlyBR", "brokerTierRate", "intermediateManagerRate", "intermediateIsQCB"].forEach((f) => {
        const inp = mountEl.querySelector(`[data-pp-cohort="${idx}"][data-pp-cfield="${f}"]`);
        setValSafe(inp, c[f]);
      });
      const resRow = results.agencySummary.spread?.cohorts?.[idx];
      setOut("cohort-spread-" + idx, resRow ? `${resRow.spreadPercent.toFixed(1)}%` : "0%");
      setOut("cohort-pay-" + idx, formatCurrency(resRow?.monthlyOverride || 0));
      const badgeEl = mountEl.querySelector(`[data-pp-out="cohort-badge-${idx}"]`);
      if (badgeEl) {
        if (resRow?.rollUpTriggered) {
          badgeEl.className = "pp-status-rollup";
          badgeEl.textContent = "ROLL-UP";
        } else {
          badgeEl.className = "";
          badgeEl.textContent = "";
        }
      }
    });
    setOut("spreadTotal", `${formatCurrency(results.commissionStreams.overrideSpread)}/mo`);

    // Sync 5-Level Agency Pay
    const qcbGateRow = document.getElementById("pp-frontline-qcb-row");
    if (qcbGateRow) qcbGateRow.hidden = planId === "custom-partner";
    state.agency.fiveLevels.forEach((lvl, idx) => {
      setValSafe(mountEl.querySelector(`[data-pp-lvl-brokers="${idx}"]`), lvl.brokers);
      setValSafe(mountEl.querySelector(`[data-pp-lvl-br="${idx}"]`), lvl.avgMonthlyBR);
      const resLvl = results.agencySummary.fiveLevel?.levels?.[idx];
      if (resLvl) {
        setOut(`lvl-rate-${idx}`, `${resLvl.rate.toFixed(1)}%`);
        setOut(
          `lvl-gate-${idx}`,
          planId === "custom-partner"
            ? "Custom"
            : resLvl.minFrontlineQCBs === 0
              ? "Certified"
              : `${resLvl.minFrontlineQCBs} QCBs`
        );
        setOut(`lvl-payout-${idx}`, formatCurrency(resLvl.monthlyPayout));
        const stEl = mountEl.querySelector(`[data-pp-out="lvl-status-${idx}"]`);
        if (stEl) {
          stEl.className = resLvl.unlocked ? "pp-status-ok" : "pp-status-lock";
          stEl.textContent = resLvl.unlocked ? "UNLOCKED" : resLvl.lockReason || "LOCKED";
        }
      }
    });
    setOut(
      "fiveLevelDepth",
      `${results.agencySummary.fiveLevel?.unlockedLevels ?? 0} of 5 Levels Active`
    );
    setOut("fiveLevelTotal", `${formatCurrency(results.commissionStreams.fiveLevel)}/mo`);

    // Sync 2-Gen Top-Tier Leadership Override
    setValSafe(document.getElementById("pp-lead-gen1"), state.agency.leadership.gen1OpenlineBR);
    setValSafe(document.getElementById("pp-lead-gen2"), state.agency.leadership.gen2OpenlineBR);
    setValSafe(document.getElementById("pp-lead-gen3"), state.agency.leadership.gen3OpenlineBR);
    setOut("leadershipTotal", `${formatCurrency(results.commissionStreams.leadership)}/mo`);
    const leadSt = document.getElementById("pp-leadership-status");
    if (leadSt) {
      const leadInfo = results.agencySummary.leadership;
      leadSt.textContent = leadInfo?.eligible
        ? "ACTIVE (Tier 18 · 80% + QCB): Earning 2% daily on Gen 1 & Gen 2 Openline BR (Gen 3+ hard-capped at $0). Stacked on top of 5-Level Pay."
        : `Currently at Tier ${lad.effectiveTier.tier} (${lad.effectiveTier.rate}%). Leadership Overrides (2% on Gen 1 & Gen 2 Openline BR) unlock automatically once you reach Tier 18 (80% National Agency) with active QCB — or select Tier 18 above to simulate immediately.`;
    }

    // Sync ISO Volume Split
    setValSafe(document.getElementById("pp-iso-points"), state.iso.markupPoints);
    setValSafe(document.getElementById("pp-iso-sub-count"), state.iso.subBrokerCount);
    setValSafe(document.getElementById("pp-iso-sub-vol"), state.iso.subBrokerAvgMonthlyVolume);
    setValSafe(document.getElementById("pp-iso-sub-pct"), state.iso.subBrokerOverridePercent);
    const isoSubBox = document.getElementById("pp-iso-subbroker-box");
    if (isoSubBox) isoSubBox.hidden = !isAgency;
    const activeBracket = results.agencySummary.isoBracket;
    setOut("isoActiveSplit", activeBracket ? `${activeBracket.name} · ${activeBracket.brokerSplitPercent}% Split` : "60% Split");
    setOut("isoMarkupPool", formatCurrency(results.totalMonthlyPersonalBR));
    setOut("isoSubOverride", `${formatCurrency(results.commissionStreams.isoSubBroker)}/mo`);
    mountEl.querySelectorAll("[data-pp-iso-bracket]").forEach((card) => {
      card.classList.toggle("is-active", card.getAttribute("data-pp-iso-bracket") === activeBracket?.id);
    });

    // Sync Custom Partner Builder
    setValSafe(document.getElementById("pp-custom-basetype"), state.customPlan.baseType);
    setValSafe(document.getElementById("pp-custom-split"), state.customPlan.personalSplitPercent);
    setValSafe(document.getElementById("pp-custom-br"), state.customPlan.bonusRevenuePercent);
    setValSafe(document.getElementById("pp-custom-pts"), state.customPlan.markupPoints);
    setValSafe(document.getElementById("pp-custom-spread"), state.customPlan.spreadOverridePercent);
    state.customPlan.levelRates.forEach((r, idx) => {
      setValSafe(mountEl.querySelector(`[data-pp-custom-lvl-rate="${idx}"]`), r);
    });
    const brWrap = document.getElementById("pp-custom-br-wrap");
    const ptsWrap = document.getElementById("pp-custom-pts-wrap");
    const customLvlWrap = document.getElementById("pp-custom-levels-rates");
    if (brWrap) brWrap.hidden = state.customPlan.baseType !== "bonus-revenue";
    if (ptsWrap) ptsWrap.hidden = state.customPlan.baseType !== "points-markup";
    if (customLvlWrap) customLvlWrap.hidden = !isAgency;
    setOut(
      "customFormulaBadge",
      state.customPlan.baseType === "direct-percent"
        ? "Direct Product Rates"
        : state.customPlan.baseType === "bonus-revenue"
          ? `${state.customPlan.bonusRevenuePercent}% BR × ${state.customPlan.personalSplitPercent}% Split`
          : `${state.customPlan.markupPoints} Pts × ${state.customPlan.personalSplitPercent}% Split`
    );

    // Render Commission Streams Breakdown & 4-Plan Comparison Strip
    const streamsMount = document.getElementById("pay-plan-streams-mount");
    if (streamsMount) {
      const comparison = calculatePlanComparison(state, COMMISSION_CONFIG);
      const s = results.commissionStreams;
      const showStreams = isAgency || planId !== "direct-rate";
      const prevOpen = streamsMount.querySelector("details.pp-compare-drawer")?.open || false;

      streamsMount.innerHTML = `
        <div class="pp-streams-box">
          <div class="pp-panel-head" style="border-bottom:none; padding-bottom:0;">
            <div>
              <span class="pp-eyebrow">${results.payPlan.name} · ${isAgency ? "Agency / Override Mode" : "Solo Broker Mode"}</span>
              <h3 style="margin:2px 0 0;">${showStreams ? "Commission Streams & Partner Plan Comparison" : "Multi-Partner Pay Plan Comparison"}</h3>
            </div>
            <span class="pp-panel-total">Combined: ${formatCurrency(results.monthlyGrossCommission)}/mo</span>
          </div>

          ${
            showStreams
              ? `<div class="pp-streams-grid">
                  <div class="pp-stream-card">
                    <span>Personal Commission</span>
                    <strong>${formatCurrency(s.personal)}</strong>
                  </div>
                  ${
                    planId === "iso-volume-split"
                      ? `<div class="pp-stream-card">
                          <span>ISO Sub-Broker Override</span>
                          <strong>${formatCurrency(s.isoSubBroker)}</strong>
                        </div>`
                      : `<div class="pp-stream-card">
                          <span>Override Spreads</span>
                          <strong>${formatCurrency(s.overrideSpread)}</strong>
                        </div>
                        <div class="pp-stream-card">
                          <span>5-Level Downline Pay</span>
                          <strong>${formatCurrency(s.fiveLevel)}</strong>
                        </div>
                        <div class="pp-stream-card">
                          <span>2-Gen Leadership</span>
                          <strong>${formatCurrency(s.leadership)}</strong>
                        </div>`
                  }
                  <div class="pp-stream-card is-highlight">
                    <span>Total Monthly Gross</span>
                    <strong>${formatCurrency(results.monthlyGrossCommission)}</strong>
                  </div>
                </div>`
              : ""
          }

          <details class="pp-compare-drawer" ${prevOpen ? "open" : ""}>
            <summary>Compare All 4 Funding Partner Pay Plans Side-by-Side (Same Deal Flow)</summary>
            <div class="pp-table-wrap" style="margin-top:10px;">
              <table class="pp-table">
                <thead>
                  <tr>
                    <th>Funding Partner Pay Plan</th>
                    <th>Active Tier / Split</th>
                    <th class="num">Personal / Mo</th>
                    <th class="num">Overrides / Mo</th>
                    <th class="num">Total / Mo</th>
                    <th class="num">12-Mo Sum</th>
                    <th class="num">36-Mo Sum</th>
                  </tr>
                </thead>
                <tbody>
                  ${comparison
                    .map(
                      (row) => `
                    <tr ${row.planId === planId ? 'style="font-weight:700;"' : ""}>
                      <td>${row.planId === planId ? "▶ " : ""}${row.planName}</td>
                      <td>${row.tierLabel}</td>
                      <td class="num">${formatCurrency(row.monthlyPersonal)}</td>
                      <td class="num">${formatCurrency(row.monthlyOverrides)}</td>
                      <td class="num"><strong>${formatCurrency(row.monthlyGross)}</strong></td>
                      <td class="num">${formatCurrency(row.firstYearCumulative)}</td>
                      <td class="num">${formatCurrency(row.threeYearCumulative)}</td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      `;
    }
  }

  return { sync };
}
