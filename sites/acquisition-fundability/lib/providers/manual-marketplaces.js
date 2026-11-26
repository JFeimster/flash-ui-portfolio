"use strict";

const VERSION = "1.5.0";

function moneyToNumber(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).replace(/[$,\s]/g, "").toLowerCase();
  if (!normalized) return null;
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)([kmb])?$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  const factor = match[2] === "k" ? 1e3 : match[2] === "m" ? 1e6 : match[2] === "b" ? 1e9 : 1;
  return Math.round(amount * factor);
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] !== undefined) return match[1];
  }
  return null;
}

function numberMatch(text, patterns) {
  return moneyToNumber(firstMatch(text, patterns));
}

function percentMatch(text, patterns) {
  const raw = firstMatch(text, patterns);
  if (raw === null) return null;
  const parsed = Number(String(raw).replace(/[%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeHost(hostname) {
  return String(hostname || "").toLowerCase().replace(/^www\./, "");
}

function detectProvider(input) {
  let url;
  try { url = new URL(String(input || "").trim()); } catch { return null; }
  const host = normalizeHost(url.hostname);
  if (host === "app.acquire.com" || host === "acquire.com" || host.endsWith(".acquire.com")) return "acquire";
  if (host === "bizbuysell.com" || host.endsWith(".bizbuysell.com")) return "bizbuysell";
  if (host === "flippa.com" || host.endsWith(".flippa.com")) return "flippa";
  return null;
}

function listingIdFromUrl(provider, url) {
  const path = url.pathname;
  if (provider === "acquire") {
    const match = path.match(/\/public\/([^/?#]+)/i);
    return match ? match[1] : path.split("/").filter(Boolean).pop() || null;
  }
  if (provider === "bizbuysell") {
    const match = path.match(/\/(\d{5,})(?:\/)?$/);
    return match ? match[1] : path.split("/").filter(Boolean).pop() || null;
  }
  if (provider === "flippa") {
    const match = path.match(/\/(\d{4,})(?:[-/?#]|$)/);
    return match ? match[1] : path.split("/").filter(Boolean).pop() || null;
  }
  return null;
}

function parseAcquire(text) {
  return {
    purchasePrice: numberMatch(text, [/Asking Price\s*\$?([\d,.]+\s*[kmb]?)/i]),
    annualRevenue: numberMatch(text, [/TTM Revenue[^$\d-]*\$?(-?[\d,.]+\s*[kmb]?)/i, /last 12 months gross revenue[^$\d-]*\$?(-?[\d,.]+\s*[kmb]?)/i]),
    annualProfit: numberMatch(text, [/TTM Profit[^$\d-]*\$?(-?[\d,.]+\s*[kmb]?)/i, /Profit\s*\$?(-?[\d,.]+\s*[kmb]?)/i]),
    recurringRevenuePct: null,
    ownerHours: null,
    industry: firstMatch(text, [/Startup\s+([^\n]+?)(?:\s+United States|\s+Canada|\s+United Kingdom|\n)/i]),
    businessModel: firstMatch(text, [/Business Model\s+([^\n]+)/i]),
    cashFlowLabel: "TTM Profit",
    cashFlowBasis: null
  };
}

function parseBizBuySell(text) {
  const explicitSde = /Cash Flow\s*\(SDE\)/i.test(text) || /Seller['’]s Discretionary Earnings/i.test(text);
  return {
    purchasePrice: numberMatch(text, [/Asking Price[^$\d]*\$?([\d,.]+\s*[kmb]?)/i]),
    annualRevenue: numberMatch(text, [/Gross Revenue[^$\d]*\$?([\d,.]+\s*[kmb]?)/i, /Revenue[^$\d]*\$?([\d,.]+\s*[kmb]?)/i]),
    annualProfit: numberMatch(text, [/Cash Flow(?:\s*\(SDE\))?[^$\d]*\$?([\d,.]+\s*[kmb]?)/i, /EBITDA[^$\d]*\$?([\d,.]+\s*[kmb]?)/i]),
    recurringRevenuePct: null,
    ownerHours: null,
    industry: firstMatch(text, [/Industry\s*([^\n]+)/i]),
    businessModel: null,
    cashFlowLabel: explicitSde ? "Cash Flow (SDE)" : /EBITDA/i.test(text) ? "EBITDA" : "Cash Flow",
    cashFlowBasis: explicitSde ? "sde" : /EBITDA/i.test(text) ? "ebitda" : null
  };
}

function parseFlippa(text) {
  const monthlyProfit = numberMatch(text, [/Monthly Profit[^$\d-]*\$?(-?[\d,.]+\s*[kmb]?)/i]);
  const monthlyRevenue = numberMatch(text, [/Monthly Revenue[^$\d-]*\$?(-?[\d,.]+\s*[kmb]?)/i]);
  return {
    purchasePrice: numberMatch(text, [/USD\s*\$?([\d,.]+\s*[kmb]?)/i, /Price[^$\d]*\$?([\d,.]+\s*[kmb]?)/i]),
    annualRevenue: monthlyRevenue === null ? null : monthlyRevenue * 12,
    annualProfit: monthlyProfit === null ? null : monthlyProfit * 12,
    recurringRevenuePct: percentMatch(text, [/Recurring Revenue[^\d]*(\d+(?:\.\d+)?)%/i]),
    ownerHours: null,
    industry: firstMatch(text, [/Industry\s+([^\n]+)/i]),
    businessModel: firstMatch(text, [/Asset Type\s+([^\n]+)/i]),
    cashFlowLabel: monthlyProfit === null ? "Profit" : "Monthly Profit × 12",
    cashFlowBasis: null
  };
}

function field(value, sourceLabel, provenance = "imported", extra = {}) {
  return { value, provenance: value === null ? "needs_confirmation" : provenance, sourceLabel, ...extra };
}

function normalizeManualMarketplaceImport(input, sourceText) {
  const submitted = String(input || "").trim();
  const text = String(sourceText || "").trim();
  const provider = detectProvider(submitted);
  if (!provider) throw new Error("Supported marketplace URL required: Acquire.com, BizBuySell, or Flippa.");
  if (!text) throw new Error("Paste the public listing details from this marketplace so the importer can extract the facts without automated scraping.");

  const url = new URL(submitted);
  const parsed = provider === "acquire" ? parseAcquire(text) : provider === "bizbuysell" ? parseBizBuySell(text) : parseFlippa(text);
  const providerLabel = provider === "acquire" ? "Acquire.com" : provider === "bizbuysell" ? "BizBuySell" : "Flippa";
  const listingId = listingIdFromUrl(provider, url);

  return {
    provider,
    providerLabel,
    listingNumber: listingId,
    sourceUrl: url.toString(),
    affiliateUrl: url.toString(),
    extractedAt: new Date().toISOString(),
    importMethod: "user_pasted_public_listing_text",
    fields: {
      purchasePrice: field(parsed.purchasePrice, `${providerLabel} public listing text — asking price`),
      annualCashFlow: field(parsed.annualProfit, `${providerLabel} public listing text — ${parsed.cashFlowLabel}. Provider terminology is preserved; confirm accounting definition before underwriting.`),
      cashFlowBasis: field(parsed.cashFlowBasis, parsed.cashFlowBasis ? `${parsed.cashFlowLabel} explicitly identifies the cash-flow basis.` : `${providerLabel} profit/cash-flow terminology does not safely establish SDE vs. EBITDA. Confirm before calculating.`, parsed.cashFlowBasis ? "imported" : "needs_confirmation", { confidence: parsed.cashFlowBasis ? "high" : "low" }),
      recurringRevenuePct: field(parsed.recurringRevenuePct, parsed.recurringRevenuePct === null ? "Public pasted text did not establish a defensible recurring-revenue percentage." : `${providerLabel} pasted public listing text`),
      managementCost: field(null, "Replacement-management cost requires diligence on seller duties and market compensation."),
      ownerDependence: field("unknown", "Owner dependence requires diligence unless the listing explicitly provides transferable owner-hours/role data.", "needs_confirmation", { confidence: "low" }),
      capexReserve: field(null, "Capex reserve requires diligence on actual fixed assets and replacement needs."),
      workingCapitalAtClose: field(null, "Working capital at close requires diligence on operating and inventory needs."),
      otherAnnualDebtService: field(0, "Starting screening value only. Confirm retained debt, leases treated as debt, seller-note current pay, and other obligations.", "needs_confirmation", { confidence: "low" }),
      transactionCosts: field(parsed.purchasePrice === null ? null : Math.round(parsed.purchasePrice * 0.03 / 500) * 500, "3% screening placeholder only; replace with actual lender, legal, diligence, and closing costs.", parsed.purchasePrice === null ? "needs_confirmation" : "recommended", { confidence: "low" }),
      customerConcentrationPct: field(null, "Public pasted text did not establish top-customer concentration."),
      booksVerifiability: field("unknown", "Public marketplace text cannot establish books verifiability.", "needs_confirmation", { confidence: "low" })
    },
    context: {
      internalId: null,
      listingStatus: null,
      title: firstMatch(text, [/^#?\s*([^\n]{8,160})/m]),
      summary: null,
      monetization: parsed.businessModel,
      niche: parsed.industry,
      monthlyNetProfit: parsed.annualProfit === null ? null : Math.round(parsed.annualProfit / 12),
      monthlyRevenue: parsed.annualRevenue === null ? null : Math.round(parsed.annualRevenue / 12),
      annualRevenue: parsed.annualRevenue,
      listingMultiple: parsed.purchasePrice && parsed.annualProfit > 0 ? Number((parsed.purchasePrice / parsed.annualProfit).toFixed(2)) : null,
      hoursWorkedPerWeek: parsed.ownerHours,
      importMethod: "Pasted public listing text",
      complianceNote: provider === "acquire"
        ? "Acquire.com terms prohibit automated scraping/data extraction; this adapter only parses text the user supplies."
        : provider === "bizbuysell"
          ? "BizBuySell terms prohibit scraping/data extraction without written permission; this adapter only parses text the user supplies."
          : "This adapter parses user-supplied public listing text rather than operating as a general-purpose crawler."
    },
    version: VERSION
  };
}

module.exports = { detectProvider, normalizeManualMarketplaceImport };
