/**
 * Zero-Dependency Responsive Accessible SVG Chart Engine
 * Includes filled-area cumulative trajectory chart (Variant 1 signature),
 * bar projection chart, scenario comparison chart, and accessible ring donut chart.
 */

import { formatCurrency } from "./calculator-engine.js";

function escapeXml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render Filled-Area Cumulative Commission Trajectory Chart (Variant 1 signature style)
 * Features crisp ascending green line, green gradient fill, milestone dots (12 MO / 24 MO / 36 MO),
 * and an electric-green end-value callout badge.
 */
export function renderAreaProjectionChartSVG(projections, options = {}) {
  const {
    lineColor = "#00F23D",
    gridColor = "#292929",
    axisColor = "#F7F7F4",
    textColor = "#B8B8B2",
    badgeBg = "#00F23D",
    badgeText = "#080808",
    metric = "cumulative", // 'cumulative' | 'earned'
    title = "Commission Projection Trajectory",
  } = options;

  const width = 620;
  const height = 270;
  const pad = { top: 44, right: 24, bottom: 48, left: 74 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const values = projections.map((p) => (metric === "earned" ? p.commissionsEarned : p.cumulativeEarned));
  const rawMax = Math.max(1000, ...values);
  const niceMax = Math.ceil(rawMax / 50000) * 50000 || rawMax * 1.15;
  const maxVal = Math.max(niceMax, rawMax * 1.08);
  const count = projections.length || 1;

  // Horizontal gridlines (5 steps)
  const steps = 5;
  let gridLines = "";
  for (let i = 0; i <= steps; i++) {
    const val = (maxVal / steps) * i;
    const y = pad.top + plotH - (plotH * i) / steps;
    gridLines += `
      <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="${i === 0 ? axisColor : gridColor}" stroke-width="${i === 0 ? "1.5" : "1"}" />
      <text x="${pad.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="${textColor}" font-size="11" font-family="inherit">${escapeXml(formatCurrency(val))}</text>
    `;
  }

  // Plot coordinates
  const coords = projections.map((row, idx) => {
    const val = metric === "earned" ? row.commissionsEarned : row.cumulativeEarned;
    const x = pad.left + (count === 1 ? plotW : (idx / (count - 1)) * plotW);
    const y = pad.top + plotH - (val / maxVal) * plotH;
    return { x, y, row, val };
  });

  const linePath = coords.map((c, idx) => `${idx === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath =
    coords.length > 0
      ? `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(pad.top + plotH).toFixed(1)} L${coords[0].x.toFixed(1)},${(pad.top + plotH).toFixed(1)} Z`
      : "";

  // Determine 3 clean milestone markers (e.g. 12, 24, 36 or 4, 8, 12)
  const milestoneIndices =
    count >= 36
      ? [11, 23, 35]
      : count >= 24
        ? [7, 15, 23]
        : [3, 7, Math.max(0, count - 1)];

  let milestoneMarkup = "";
  milestoneIndices.forEach((mIdx) => {
    const pt = coords[mIdx];
    if (!pt) return;
    milestoneMarkup += `
      <line x1="${pt.x.toFixed(1)}" y1="${pt.y.toFixed(1)}" x2="${pt.x.toFixed(1)}" y2="${(pad.top + plotH).toFixed(1)}" stroke="${lineColor}" stroke-opacity="0.28" stroke-dasharray="3 3" />
      <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="5" fill="#F7F7F4" stroke="${lineColor}" stroke-width="2">
        <title>${escapeXml(`Month ${pt.row.month}: ${formatCurrency(pt.val)}`)}</title>
      </circle>
      <text x="${pt.x.toFixed(1)}" y="${(pad.top + plotH + 18).toFixed(1)}" text-anchor="middle" fill="${axisColor}" font-size="11" font-weight="700" font-family="inherit">${pt.row.month} MO</text>
      <text x="${pt.x.toFixed(1)}" y="${(pad.top + plotH + 34).toFixed(1)}" text-anchor="middle" fill="${textColor}" font-size="11" font-family="inherit">${escapeXml(formatCurrency(pt.val))}</text>
    `;
  });

  // End callout badge above last data point
  const lastPt = coords[coords.length - 1];
  let endBadge = "";
  if (lastPt) {
    const labelStr = formatCurrency(lastPt.val);
    const badgeW = Math.max(92, labelStr.length * 10 + 20);
    const bx = Math.min(width - pad.right - badgeW, Math.max(pad.left, lastPt.x - badgeW + 10));
    const by = Math.max(6, lastPt.y - 34);
    endBadge = `
      <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${badgeW}" height="24" fill="${badgeBg}" />
      <text x="${(bx + badgeW / 2).toFixed(1)}" y="${(by + 16).toFixed(1)}" text-anchor="middle" fill="${badgeText}" font-size="13" font-weight="800" font-family="inherit">${escapeXml(labelStr)}</text>
    `;
  }

  const gradId = `mcAreaGrad_${count}_${metric}`;
  const desc = `${count}-month ${metric} trajectory reaching ${lastPt ? formatCurrency(lastPt.val) : "$0"}.`;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}" class="chart-svg">
      <title>${escapeXml(title)}</title>
      <desc>${escapeXml(desc)}</desc>
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.45" />
          <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.04" />
        </linearGradient>
      </defs>
      ${gridLines}
      <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}" stroke="${axisColor}" stroke-width="1.5" />
      <path d="${areaPath}" fill="url(#${gradId})" />
      <path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="3" stroke-linejoin="round" />
      ${milestoneMarkup}
      ${endBadge}
    </svg>
  `;
}

/**
 * Render Monthly + Cumulative Projection Bar SVG Chart (12, 24, or 36 months)
 */
export function renderProjectionChartSVG(projections, options = {}) {
  const {
    barColor = "#00F23D",
    secondaryColor = "#F7F7F4",
    gridColor = "#292929",
    textColor = "#929292",
    metric = "earned",
    rounded = 0,
    title = "Projected Commission Trajectory",
  } = options;

  const width = 640;
  const height = 260;
  const pad = { top: 24, right: 18, bottom: 38, left: 66 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const values = projections.map((p) => (metric === "cumulative" ? p.cumulativeEarned : p.commissionsEarned));
  const maxVal = Math.max(1000, ...values) * 1.12;
  const count = projections.length || 1;
  const stepX = plotW / count;
  const barW = Math.max(4, stepX * 0.64);

  const ticks = 4;
  let gridLines = "";
  for (let i = 0; i <= ticks; i++) {
    const val = (maxVal / ticks) * i;
    const y = pad.top + plotH - (plotH * i) / ticks;
    gridLines += `
      <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="${i === 0 ? "none" : "3 3"}" />
      <text x="${pad.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="${textColor}" font-size="11" font-family="inherit">${escapeXml(formatCurrency(val, true))}</text>
    `;
  }

  let bars = "";
  let linePoints = [];
  const labelInterval = count <= 12 ? 1 : count <= 24 ? 3 : 6;

  projections.forEach((row, idx) => {
    const val = metric === "cumulative" ? row.cumulativeEarned : row.commissionsEarned;
    const h = Math.max(2, (val / maxVal) * plotH);
    const x = pad.left + idx * stepX + (stepX - barW) / 2;
    const y = pad.top + plotH - h;
    const cx = x + barW / 2;
    linePoints.push(`${cx.toFixed(1)},${y.toFixed(1)}`);

    const tooltip = `Month ${row.month}: Earned ${formatCurrency(row.commissionsEarned)} | Receipts ${formatCurrency(row.commissionReceipts)} | Cumulative ${formatCurrency(row.cumulativeEarned)}`;
    bars += `
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="${rounded}" fill="${barColor}" opacity="${metric === "cumulative" ? "0.28" : "0.92"}">
        <title>${escapeXml(tooltip)}</title>
      </rect>
    `;

    if (row.month === 1 || row.month === count || row.month % labelInterval === 0) {
      bars += `<text x="${cx.toFixed(1)}" y="${height - 14}" text-anchor="middle" fill="${textColor}" font-size="10" font-family="inherit">M${row.month}</text>`;
    }
  });

  const cumulativeLine =
    metric === "cumulative" && linePoints.length > 1
      ? `<polyline fill="none" stroke="${barColor}" stroke-width="2.5" points="${linePoints.join(" ")}" />`
      : "";

  const totalEnd = projections.length ? projections[projections.length - 1].cumulativeEarned : 0;
  const desc = `${count}-month ${metric} projection ending at ${formatCurrency(totalEnd)} cumulative gross commission.`;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}" class="chart-svg">
      <title>${escapeXml(title)}</title>
      <desc>${escapeXml(desc)}</desc>
      ${gridLines}
      ${bars}
      ${cumulativeLine}
      <line x1="${pad.left}" y1="${pad.top + plotH}" x2="${width - pad.right}" y2="${pad.top + plotH}" stroke="${secondaryColor}" stroke-opacity="0.35" stroke-width="1" />
    </svg>
  `;
}

/**
 * Render Scenario Comparison Grouped Bar SVG Chart
 */
export function renderScenarioComparisonSVG(scenariosMap, options = {}) {
  const {
    colors = ["#929292", "#00F23D", "#F7F7F4"],
    gridColor = "#292929",
    textColor = "#929292",
    valueColor = "#F7F7F4",
    rounded = 0,
    horizon = 12,
  } = options;

  const width = 560;
  const height = 220;
  const pad = { top: 28, right: 20, bottom: 42, left: 66 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const list = [
    { key: "conservative", label: "Conservative (0.6x)", data: scenariosMap.conservative, color: colors[0] },
    { key: "base", label: "Base Case (1.0x)", data: scenariosMap.base, color: colors[1] },
    { key: "optimistic", label: "Optimistic (1.4x)", data: scenariosMap.optimistic, color: colors[2] },
  ];

  const getVal = (res) =>
    horizon === 36
      ? res.threeYearCumulativeCommission
      : horizon === 24
        ? res.twentyFourMonthCumulativeCommission
        : res.firstYearCumulativeCommission;

  const maxVal = Math.max(1000, ...list.map((i) => getVal(i.data))) * 1.18;
  const colW = plotW / list.length;
  const barW = Math.min(84, colW * 0.48);

  let grid = "";
  for (let i = 0; i <= 3; i++) {
    const val = (maxVal / 3) * i;
    const y = pad.top + plotH - (plotH * i) / 3;
    grid += `
      <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="${i === 0 ? "none" : "3 3"}" />
      <text x="${pad.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="${textColor}" font-size="11">${escapeXml(formatCurrency(val, true))}</text>
    `;
  }

  let bars = "";
  list.forEach((item, idx) => {
    const val = getVal(item.data);
    const h = Math.max(3, (val / maxVal) * plotH);
    const cx = pad.left + idx * colW + colW / 2;
    const x = cx - barW / 2;
    const y = pad.top + plotH - h;

    bars += `
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="${rounded}" fill="${item.color}">
        <title>${escapeXml(`${item.label}: ${formatCurrency(val)} over ${horizon} months`)}</title>
      </rect>
      <text x="${cx.toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle" fill="${valueColor}" font-size="11" font-weight="700">${escapeXml(formatCurrency(val, true))}</text>
      <text x="${cx.toFixed(1)}" y="${height - 14}" text-anchor="middle" fill="${textColor}" font-size="11">${escapeXml(item.label)}</text>
    `;
  });

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Scenario comparison over ${horizon} months" class="chart-svg">
      <title>Scenario Comparison (${horizon}-Month Cumulative Gross Commission)</title>
      <desc>${escapeXml(list.map((i) => `${i.label}: ${formatCurrency(getVal(i.data))}`).join("; "))}</desc>
      ${grid}
      ${bars}
    </svg>
  `;
}

/**
 * Render Accessible Product Mix Donut SVG Chart
 */
export function renderProductDonutSVG(productResults, options = {}) {
  const {
    palette = ["#00F23D", "#787878", "#D4D8E0", "#00A82B", "#4B525A"],
    centerTitle = "PER MONTH",
    centerValue = "$0",
    textColor = "#F7F7F4",
    mutedColor = "#B8B8B2",
    strokeWidth = 30,
  } = options;

  const size = 220;
  const cx = 110;
  const cy = 110;
  const r = 78;
  const circumference = 2 * Math.PI * r;

  const total = productResults.reduce((s, p) => s + p.grossCommission, 0);
  let offset = 0;

  let segments = "";
  if (total <= 0) {
    segments = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${mutedColor}" stroke-opacity="0.25" stroke-width="${strokeWidth}" />`;
  } else {
    productResults.forEach((p, idx) => {
      const fraction = p.grossCommission / total;
      if (fraction <= 0) return;
      const segLen = fraction * circumference;
      const color = palette[idx % palette.length];
      segments += `
        <circle
          cx="${cx}"
          cy="${cy}"
          r="${r}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${segLen.toFixed(2)} ${(circumference - segLen).toFixed(2)}"
          stroke-dashoffset="${(-offset).toFixed(2)}"
          transform="rotate(-90 ${cx} ${cy})"
        >
          <title>${escapeXml(`${p.productName}: ${formatCurrency(p.grossCommission)} (${Math.round(fraction * 100)}%)`)}</title>
        </circle>
      `;
      offset += segLen;
    });
  }

  return `
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Product commission share breakdown" class="donut-svg">
      <title>Product Commission Contribution</title>
      <desc>${escapeXml(productResults.map((p) => `${p.productName}: ${formatCurrency(p.grossCommission)}`).join(", "))}</desc>
      ${segments}
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${textColor}" font-size="22" font-weight="800" font-family="inherit">${escapeXml(centerValue)}</text>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" fill="${mutedColor}" font-size="11" font-weight="700" letter-spacing="0.06em" font-family="inherit">${escapeXml(centerTitle)}</text>
    </svg>
  `;
}

/**
 * Build donut chart slices for Multi-Stream Commission breakdown
 * when Agency / Override earnings are active.
 */
export function buildCommissionStreamSlices(results) {
  const streams = results?.commissionStreams;
  if (!streams || streams.totalOverrides <= 0) return null;

  const raw = [
    {
      productName: "Personal Production",
      shortName: "Personal Production",
      grossCommission: streams.personal || 0,
      meta: `${results.payPlan?.shortName || "Personal"} · ${results.modeledMonthlyDeals} deals/mo`,
    },
    {
      productName: "Override Spreads",
      shortName: "Override Spreads",
      grossCommission: streams.overrideSpread || 0,
      meta: "Differential spread on direct team",
    },
    {
      productName: "5-Level Downline",
      shortName: "5-Level Downline",
      grossCommission: streams.fiveLevel || 0,
      meta: "L1–L5 recurring agency pay (+1 mo lag)",
    },
    {
      productName: "2-Gen Leadership",
      shortName: "2-Gen Leadership",
      grossCommission: streams.leadership || 0,
      meta: "2% Openline BR (Gen 1–2 cap)",
    },
    {
      productName: "Sub-Broker Overrides",
      shortName: "Sub-Broker Overrides",
      grossCommission: streams.isoSubBroker || 0,
      meta: "ISO direct sub-broker spread",
    },
  ].filter((item) => item.grossCommission > 0);

  const total = Math.max(1, raw.reduce((s, r) => s + r.grossCommission, 0));
  return raw.map((item) => ({
    ...item,
    sharePercent: Math.round((item.grossCommission / total) * 100),
  }));
}

