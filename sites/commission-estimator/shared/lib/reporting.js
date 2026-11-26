/**
 * Shared Reporting & Export Utilities
 * Generates CSV, printable HTML/PDF reports, Partner Summary Brochure, and JSON
 * including Pay-Plan profile details, Commission Streams (Personal, Override Spread,
 * 5-Level Downline Pay, 2-Gen Leadership Override, ISO Sub-Broker Override),
 * and full 36-month schedules directly from calculator-engine results.
 */

import { calculateAllScenarios, formatCurrency } from "./calculator-engine.js";
import { DISCLOSURES, METHODOLOGY_STEPS } from "./faq-data.js";
import { buildShareableUrl } from "./state.js";

function escapeCsvCell(value) {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateReportData(state, results) {
  const scenarios = calculateAllScenarios(state);
  return {
    productName: "Commission Estimator",
    subtitle: "Funding Partner & Agency Revenue Simulator",
    generatedAt: new Date().toISOString(),
    programName: results.meta.programName,
    configVersion: results.meta.version,
    verificationStatus: results.meta.verificationStatus,
    approvedSourceReference: results.meta.approvedSourceReference,
    payPlan: {
      id: results.meta.payPlanId,
      name: results.meta.payPlanName,
      operatingMode: results.meta.operatingMode,
      activeTier: results.tier.activeDisplay?.name || results.tier.currentTier.name,
    },
    assumptions: {
      monthlyDeals: results.inputs.monthlyDeals,
      averageDealSize: results.inputs.averageDealSize,
      weightedAverageDealSize: results.weightedAverageDealSize,
      scenario: results.scenario,
      monthlyGrowthRate: results.inputs.monthlyGrowthRate,
      rampUpMonths: results.inputs.rampUpMonths,
      maxMonthlyCapacity: results.inputs.maxMonthlyCapacity,
      operatingExpenses: results.inputs.operatingExpenses,
      paymentDelayMonths: results.inputs.paymentDelayMonths,
      enableBonuses: results.inputs.enableBonuses,
      enableRecurring: results.inputs.enableRecurring,
      targetMonthlyIncome: results.inputs.targetMonthlyIncome,
    },
    summary: {
      modeledMonthlyDeals: results.modeledMonthlyDeals,
      totalMonthlyFundedVolume: results.totalMonthlyFundedVolume,
      totalMonthlyPersonalBR: results.totalMonthlyPersonalBR || 0,
      effectiveCommissionRatePercent: results.effectiveCommissionRatePercent,
      personalMonthlyCommission: results.personalMonthlyCommission,
      monthlyGrossCommission: results.monthlyGrossCommission,
      annualizedGrossCommission: results.annualizedGrossCommission,
      firstYearCumulativeCommission: results.firstYearCumulativeCommission,
      twentyFourMonthCumulativeCommission: results.twentyFourMonthCumulativeCommission,
      threeYearCumulativeCommission: results.threeYearCumulativeCommission,
      monthlyNetOperatingIncome: results.monthlyNetOperatingIncome,
      currentTier: results.tier.activeDisplay?.name || results.tier.currentTier.name,
    },
    commissionStreams: results.commissionStreams,
    agencySummary: results.agencySummary,
    scenariosComparison: {
      conservative: {
        monthlyDeals: scenarios.conservative.modeledMonthlyDeals,
        monthlyGrossCommission: scenarios.conservative.monthlyGrossCommission,
        firstYearCumulative: scenarios.conservative.firstYearCumulativeCommission,
        threeYearCumulative: scenarios.conservative.threeYearCumulativeCommission,
      },
      base: {
        monthlyDeals: scenarios.base.modeledMonthlyDeals,
        monthlyGrossCommission: scenarios.base.monthlyGrossCommission,
        firstYearCumulative: scenarios.base.firstYearCumulativeCommission,
        threeYearCumulative: scenarios.base.threeYearCumulativeCommission,
      },
      optimistic: {
        monthlyDeals: scenarios.optimistic.modeledMonthlyDeals,
        monthlyGrossCommission: scenarios.optimistic.monthlyGrossCommission,
        firstYearCumulative: scenarios.optimistic.firstYearCumulativeCommission,
        threeYearCumulative: scenarios.optimistic.threeYearCumulativeCommission,
      },
    },
    productAllocation: results.productResults,
    incomeTarget: results.incomeTarget,
    projections36: results.projections36,
    methodology: METHODOLOGY_STEPS,
    disclosures: DISCLOSURES,
  };
}

export function generateReportCSV(state, results) {
  const report = generateReportData(state, results);
  const rows = [];

  rows.push(["Commission Estimator — Commission Projection Report"]);
  rows.push(["Generated At", report.generatedAt]);
  rows.push(["Verification Status", report.verificationStatus]);
  rows.push(["Configuration Version", report.configVersion]);
  rows.push(["Active Pay Plan", report.payPlan.name]);
  rows.push(["Operating Mode", report.payPlan.operatingMode === "agency" ? "Agency / Override Mode" : "Solo Broker Mode"]);
  rows.push(["Active Tier / Split", report.payPlan.activeTier]);
  rows.push(["Source Reference", report.approvedSourceReference]);
  rows.push([]);

  rows.push(["USER-SELECTED ASSUMPTIONS"]);
  rows.push(["Monthly Funded Deals", report.assumptions.monthlyDeals]);
  rows.push(["Average Funded Deal Size (USD)", report.assumptions.averageDealSize]);
  rows.push(["Weighted Average Deal Size (USD)", report.assumptions.weightedAverageDealSize]);
  rows.push(["Selected Scenario", `${report.assumptions.scenario.label} (${report.assumptions.scenario.multiplier}x)`]);
  rows.push(["Monthly Production Growth (%)", report.assumptions.monthlyGrowthRate]);
  rows.push(["Ramp-Up Schedule (Months)", report.assumptions.rampUpMonths]);
  rows.push(["Max Monthly Capacity (0 = Uncapped)", report.assumptions.maxMonthlyCapacity]);
  rows.push(["Monthly Operating Expenses (USD)", report.assumptions.operatingExpenses]);
  rows.push(["Payment Delay (Months)", report.assumptions.paymentDelayMonths]);
  rows.push(["Qualified Bonuses Enabled", report.assumptions.enableBonuses ? "Yes" : "No"]);
  rows.push(["Recurring Commissions Enabled", report.assumptions.enableRecurring ? "Yes" : "No"]);
  rows.push(["Target Monthly Gross Commission (USD)", report.assumptions.targetMonthlyIncome]);
  rows.push([]);

  rows.push(["EARNINGS SUMMARY"]);
  rows.push(["Modeled Monthly Funded Deals", report.summary.modeledMonthlyDeals]);
  rows.push(["Monthly Funded Volume (USD)", report.summary.totalMonthlyFundedVolume]);
  if (report.summary.totalMonthlyPersonalBR > 0) {
    rows.push(["Monthly Personal Bonus Revenue / Markup Pool (USD)", report.summary.totalMonthlyPersonalBR]);
  }
  rows.push(["Personal Monthly Commission (USD)", report.commissionStreams.personal]);
  if (report.commissionStreams.totalOverrides > 0 || report.payPlan.operatingMode === "agency") {
    rows.push(["Override Spread Commission (USD/mo)", report.commissionStreams.overrideSpread]);
    rows.push(["5-Level Downline Pay (USD/mo, paid 15th next mo)", report.commissionStreams.fiveLevel]);
    rows.push(["2-Gen Top-Tier Leadership Override (USD/mo)", report.commissionStreams.leadership]);
    if (report.commissionStreams.isoSubBroker > 0) {
      rows.push(["ISO Sub-Broker Override (USD/mo)", report.commissionStreams.isoSubBroker]);
    }
    rows.push(["Total Team & Downline Overrides (USD/mo)", report.commissionStreams.totalOverrides]);
  }
  rows.push(["Total Monthly Gross Commission (USD)", report.summary.monthlyGrossCommission]);
  rows.push(["Annualized Gross Commission (USD)", report.summary.annualizedGrossCommission]);
  rows.push(["Modeled First-Year Gross Commission (USD)", report.summary.firstYearCumulativeCommission]);
  rows.push(["Modeled 36-Month Cumulative Commission (USD)", report.summary.threeYearCumulativeCommission]);
  rows.push(["Estimated Monthly Pre-Tax Operating Income (USD)", report.summary.monthlyNetOperatingIncome]);
  rows.push(["Modeled Partner Tier (Illustrative)", report.summary.currentTier]);
  rows.push([]);

  if (report.agencySummary?.enabled && report.agencySummary.fiveLevel) {
    rows.push(["5-LEVEL DOWNLINE SCHEDULE", "Brokers", "Avg Monthly BR (USD)", "Level BR (USD)", "Rate %", "Status", "Monthly Payout (USD)"]);
    report.agencySummary.fiveLevel.levels.forEach((lvl) => {
      rows.push([
        lvl.label,
        lvl.brokers,
        lvl.avgMonthlyBR,
        lvl.levelBR,
        `${lvl.rate}%`,
        lvl.unlocked ? "Unlocked" : `Locked (${lvl.lockReason})`,
        lvl.monthlyPayout,
      ]);
    });
    rows.push([]);
  }

  rows.push(["SCENARIO COMPARISON", "Deals/Mo", "Monthly Gross (USD)", "12-Mo Cumulative (USD)", "36-Mo Cumulative (USD)"]);
  ["conservative", "base", "optimistic"].forEach((key) => {
    const s = report.scenariosComparison[key];
    rows.push([key.toUpperCase(), s.monthlyDeals, s.monthlyGrossCommission, s.firstYearCumulative, s.threeYearCumulative]);
  });
  rows.push([]);

  rows.push(["PRODUCT ALLOCATION", "Allocation %", "Deals/Mo", "Avg Deal Size (USD)", "Funded Volume (USD)", "Method", "Rate/Fee", "Monthly Gross (USD)"]);
  report.productAllocation.forEach((p) => {
    rows.push([
      p.productName,
      p.allocationPercentage,
      p.allocatedDeals,
      p.dealSize,
      p.fundedVolume,
      p.compensationMethod,
      p.compensationMethod === "fixed" ? `$${p.fixedFee}` : `${p.commissionRate}%`,
      p.grossCommission,
    ]);
  });
  rows.push([]);

  rows.push([
    "MONTH",
    "Deals",
    "Active Tier",
    "Funded Volume (USD)",
    "Personal Commission (USD)",
    "Override Spread (USD)",
    "5-Level Downline (USD)",
    "Leadership Override (USD)",
    "Total Commissions Earned (USD)",
    "Commission Receipts (USD)",
    "Operating Expenses (USD)",
    "Est. Pre-Tax Operating Income (USD)",
    "Cumulative Earned (USD)",
    "Cumulative Receipts (USD)",
  ]);
  report.projections36.forEach((m) => {
    rows.push([
      m.month,
      m.deals,
      m.tierName,
      m.fundedVolume,
      m.dealCommission,
      m.overrideSpreadCommission || 0,
      m.fiveLevelCommission || 0,
      m.leadershipCommission || 0,
      m.commissionsEarned,
      m.commissionReceipts,
      m.operatingExpenses,
      m.estimatedPreTaxOperatingIncome,
      m.cumulativeEarned,
      m.cumulativeReceipts,
    ]);
  });
  rows.push([]);

  rows.push(["CALCULATION METHODOLOGY"]);
  report.methodology.forEach((step) => {
    rows.push([`Step ${step.step}: ${step.title}`, step.formula, step.detail]);
  });
  rows.push([]);
  rows.push(["EARNINGS DISCLOSURE", DISCLOSURES.expanded]);

  return rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generatePrintableReportHTML(state, results, title = "Commission Estimator — Commission Projection") {
  const report = generateReportData(state, results);
  const productRows = report.productAllocation
    .map(
      (p) => `
      <tr>
        <td>${escapeHtml(p.productName)}</td>
        <td style="text-align:right">${p.allocationPercentage}%</td>
        <td style="text-align:right">${p.allocatedDeals}</td>
        <td style="text-align:right">${formatCurrency(p.dealSize)}</td>
        <td style="text-align:right">${formatCurrency(p.fundedVolume)}</td>
        <td style="text-align:right">${p.compensationMethod === "fixed" ? formatCurrency(p.fixedFee) : `${p.commissionRate}%`}</td>
        <td style="text-align:right"><strong>${formatCurrency(p.grossCommission)}</strong></td>
      </tr>`
    )
    .join("");

  const scenarioRows = ["conservative", "base", "optimistic"]
    .map((key) => {
      const s = report.scenariosComparison[key];
      return `
        <tr>
          <td style="text-transform:capitalize">${key}</td>
          <td style="text-align:right">${s.monthlyDeals}</td>
          <td style="text-align:right">${formatCurrency(s.monthlyGrossCommission)}</td>
          <td style="text-align:right">${formatCurrency(s.firstYearCumulative)}</td>
          <td style="text-align:right">${formatCurrency(s.threeYearCumulative)}</td>
        </tr>`;
    })
    .join("");

  const streamsSection =
    report.payPlan.operatingMode === "agency" || report.commissionStreams.totalOverrides > 0
      ? `
      <h2>Commission Streams Breakdown (${escapeHtml(report.payPlan.name)})</h2>
      <table>
        <thead><tr><th>Commission Stream</th><th style="text-align:right">Monthly Estimate</th><th style="text-align:right">Annualized</th></tr></thead>
        <tbody>
          <tr><td>Personal Production Commission</td><td style="text-align:right">${formatCurrency(report.commissionStreams.personal)}</td><td style="text-align:right">${formatCurrency(report.commissionStreams.personal * 12)}</td></tr>
          <tr><td>Differential Override Spreads</td><td style="text-align:right">${formatCurrency(report.commissionStreams.overrideSpread)}</td><td style="text-align:right">${formatCurrency(report.commissionStreams.overrideSpread * 12)}</td></tr>
          <tr><td>5-Level Agency Downline Pay (Paid 15th Next Mo)</td><td style="text-align:right">${formatCurrency(report.commissionStreams.fiveLevel)}</td><td style="text-align:right">${formatCurrency(report.commissionStreams.fiveLevel * 12)}</td></tr>
          <tr><td>2-Gen Top-Tier Leadership Override</td><td style="text-align:right">${formatCurrency(report.commissionStreams.leadership)}</td><td style="text-align:right">${formatCurrency(report.commissionStreams.leadership * 12)}</td></tr>
          ${
            report.commissionStreams.isoSubBroker > 0
              ? `<tr><td>ISO Sub-Broker Override</td><td style="text-align:right">${formatCurrency(report.commissionStreams.isoSubBroker)}</td><td style="text-align:right">${formatCurrency(report.commissionStreams.isoSubBroker * 12)}</td></tr>`
              : ""
          }
          <tr><td><strong>Total Combined Monthly Gross</strong></td><td style="text-align:right"><strong>${formatCurrency(report.summary.monthlyGrossCommission)}</strong></td><td style="text-align:right"><strong>${formatCurrency(report.summary.annualizedGrossCommission)}</strong></td></tr>
        </tbody>
      </table>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; max-width: 900px; margin: 32px auto; padding: 0 24px; line-height: 1.5; }
    h1 { font-size: 26px; margin: 0 0 6px; }
    .meta { font-size: 12px; color: #555; margin-bottom: 24px; border-bottom: 2px solid #111; padding-bottom: 12px; }
    .banner { background: #f4f4f0; border: 1px solid #111; padding: 12px 16px; font-size: 12px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .card { border: 1px solid #ddd; padding: 14px; }
    .card-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-val { font-size: 20px; font-weight: 700; margin-top: 4px; font-variant-numeric: tabular-nums; }
    h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.04em; margin: 28px 0 10px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; font-variant-numeric: tabular-nums; }
    th, td { border-bottom: 1px solid #e2e2e2; padding: 8px 6px; text-align: left; }
    th { font-size: 11px; text-transform: uppercase; color: #444; background: #fafafa; }
    .disclosure { font-size: 11px; color: #444; border-top: 2px solid #111; padding-top: 14px; margin-top: 28px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    ${escapeHtml(report.programName)} · Plan: <strong>${escapeHtml(report.payPlan.name)}</strong> (${report.payPlan.operatingMode === "agency" ? "Agency / Override Mode" : "Solo Mode"}) · Tier: <strong>${escapeHtml(report.payPlan.activeTier)}</strong> · Config v${escapeHtml(report.configVersion)} · Status: <strong>${escapeHtml(report.verificationStatus)}</strong> · Generated ${new Date(report.generatedAt).toLocaleString()}
  </div>
  <div class="banner">${escapeHtml(DISCLOSURES.short)} ${escapeHtml(report.approvedSourceReference)}</div>
  <div class="grid">
    <div class="card"><div class="card-label">Monthly Volume</div><div class="card-val">${formatCurrency(report.summary.totalMonthlyFundedVolume)}</div></div>
    <div class="card"><div class="card-label">Monthly Gross</div><div class="card-val">${formatCurrency(report.summary.monthlyGrossCommission)}</div></div>
    <div class="card"><div class="card-label">1st-Year Gross</div><div class="card-val">${formatCurrency(report.summary.firstYearCumulativeCommission)}</div></div>
    <div class="card"><div class="card-label">36-Mo Cumulative</div><div class="card-val">${formatCurrency(report.summary.threeYearCumulativeCommission)}</div></div>
  </div>
  ${streamsSection}
  <h2>Product Allocation Breakdown</h2>
  <table>
    <thead><tr><th>Product</th><th style="text-align:right">Mix</th><th style="text-align:right">Deals/Mo</th><th style="text-align:right">Avg Deal Size</th><th style="text-align:right">Volume</th><th style="text-align:right">Eff. Rate</th><th style="text-align:right">Monthly Gross</th></tr></thead>
    <tbody>${productRows}</tbody>
  </table>
  <h2>Scenario Projections</h2>
  <table>
    <thead><tr><th>Scenario</th><th style="text-align:right">Deals/Mo</th><th style="text-align:right">Monthly Gross</th><th style="text-align:right">12-Month Sum</th><th style="text-align:right">36-Month Sum</th></tr></thead>
    <tbody>${scenarioRows}</tbody>
  </table>
  <h2>Calculation Methodology</h2>
  <ul>
    ${METHODOLOGY_STEPS.map((s) => `<li><strong>${escapeHtml(s.title)}:</strong> ${escapeHtml(s.formula)} — ${escapeHtml(s.detail)}</li>`).join("")}
  </ul>
  <div class="disclosure">${escapeHtml(DISCLOSURES.expanded)}</div>
</body>
</html>`;
}

export function downloadFile(content, filename, mimeType = "text/plain;charset=utf-8") {
  if (typeof document === "undefined") return false;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export async function copyScenarioShareLink(state) {
  const url = buildShareableUrl(state);
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(url);
    return { ok: true, url };
  }
  return { ok: false, url };
}
