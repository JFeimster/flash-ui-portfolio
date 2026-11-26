"use strict";

const API_URL = "https://api.empireflippers.com/api/v1/listings/list";
const REFERRER = "6I8WK4WSMYC9KGJD";
const PROVIDER = "empire_flippers";
const VERSION = "1.3.1";

function asNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value).replace(/[$,%\s,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function firstDefined(object, keys) {
  for (const key of keys) {
    if (object && object[key] !== undefined && object[key] !== null) return object[key];
  }
  return null;
}

function labelValue(value) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    return value
      .map((item) => typeof item === "object" && item ? (item.name || item.label || item.title) : item)
      .filter(Boolean)
      .join(", ") || null;
  }
  if (typeof value === "object") return value.name || value.label || value.title || null;
  return String(value);
}

function addReferrer(url) {
  try {
    const target = new URL(url || "https://empireflippers.com/marketplace/");
    target.searchParams.set("referrer", REFERRER);
    return target.toString();
  } catch {
    return `https://empireflippers.com/marketplace/?referrer=${encodeURIComponent(REFERRER)}`;
  }
}

function normalizeHost(hostname) {
  return String(hostname || "").toLowerCase().replace(/^www\./, "");
}

function isEmpireFlippersHost(hostname) {
  const host = normalizeHost(hostname);
  return host === "empireflippers.com" || host.endsWith(".empireflippers.com");
}

function extractListingNumber(input) {
  const raw = String(input || "").trim();
  if (!raw) throw new Error("Enter an Empire Flippers listing URL or listing number.");

  if (/^#?\d{4,9}$/.test(raw)) return raw.replace("#", "");

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Enter a valid Empire Flippers URL or listing number.");
  }

  if (!isEmpireFlippersHost(url.hostname)) {
    throw new Error("v1.3.1 currently supports Empire Flippers listing URLs only.");
  }

  const explicit = url.searchParams.get("listing_number") || url.searchParams.get("listingNumber");
  if (explicit && /^\d{4,9}$/.test(explicit)) return explicit;

  const query = url.searchParams.get("q");
  if (query && /^#?\d{4,9}$/.test(query.trim())) return query.trim().replace("#", "");

  const pathMatch = url.pathname.match(/(?:listing|listings)[^0-9]*(\d{4,9})/i)
    || url.pathname.match(/\/(\d{4,9})(?:\/|$)/);
  if (pathMatch) return pathMatch[1];

  throw new Error("Could not find a listing number in that Empire Flippers URL. You can paste the listing number directly instead.");
}

function extractListings(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.data,
    payload.listings,
    payload.results,
    payload.items,
    payload.data && payload.data.listings,
    payload.data && payload.data.data,
    payload.response && payload.response.data,
    payload.response && payload.response.listings
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (payload.listing && typeof payload.listing === "object") return [payload.listing];
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    const possibleListingNumber = firstDefined(payload.data, ["listing_number", "listingNumber"]);
    if (possibleListingNumber) return [payload.data];
  }

  return [];
}

function buildSourceUrl(listing, submittedUrl, listingNumber) {
  const providerUrl = firstDefined(listing, ["listing_url", "marketplace_url", "url", "public_url"]);
  if (providerUrl) return String(providerUrl);

  if (submittedUrl) {
    try {
      const parsed = new URL(submittedUrl);
      if (isEmpireFlippersHost(parsed.hostname)) return parsed.toString();
    } catch {
      // Listing-number input falls through to marketplace URL.
    }
  }

  return `https://empireflippers.com/marketplace/?q=${encodeURIComponent(listingNumber)}`;
}

function textIncludesAny(value, terms) {
  const text = String(value || "").toLowerCase();
  return terms.some((term) => text.includes(term));
}

function roundTo(value, increment = 500) {
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.round(value / increment) * increment);
}

function recommendCashFlowBasis(listing, annualCashFlow) {
  const explicitSde = asNumber(firstDefined(listing, ["annual_sde", "sde"]));
  const explicitEbitda = asNumber(firstDefined(listing, ["annual_ebitda", "ebitda"]));
  if (explicitSde !== null) {
    return { value: "sde", confidence: "high", rationale: "The provider data explicitly reports SDE.", annualCashFlow: explicitSde };
  }
  if (explicitEbitda !== null) {
    return { value: "ebitda", confidence: "high", rationale: "The provider data explicitly reports EBITDA.", annualCashFlow: explicitEbitda };
  }
  return {
    value: annualCashFlow === null ? null : "sde",
    confidence: annualCashFlow === null ? "low" : "moderate",
    rationale: annualCashFlow === null
      ? "No defensible cash-flow basis could be inferred from the public listing."
      : "Empire Flippers reports average monthly net profit rather than EBITDA. SDE is a conservative small-business screening starting point; verify the source financial definition before relying on it."
  };
}

function recommendRecurringRevenue(monetization, monthlyRecurringRevenue, monthlyRevenue) {
  if (monthlyRecurringRevenue !== null && monthlyRevenue !== null && monthlyRevenue > 0) {
    const value = Math.max(0, Math.min(100, monthlyRecurringRevenue / monthlyRevenue * 100));
    return {
      value: Number(value.toFixed(1)),
      provenance: "inferred",
      confidence: "high",
      sourceLabel: "Monthly recurring revenue ÷ average monthly gross revenue"
    };
  }

  const recurringModel = textIncludesAny(monetization, ["saas", "subscription", "membership", "recurring"]);
  const nonRecurringModel = textIncludesAny(monetization, [
    "affiliate", "display", "lead gen", "digital product", "info product", "amazon fba", "amazon", "ecommerce", "e-commerce", "dropship", "content"
  ]);

  if (nonRecurringModel) {
    return {
      value: 0,
      provenance: "recommended",
      confidence: "moderate",
      sourceLabel: "Conservative 0% starting point: no MRR was reported and the listed monetization is not inherently contractual recurring revenue. Override if diligence supports recurring revenue."
    };
  }

  if (recurringModel) {
    return {
      value: null,
      provenance: "needs_confirmation",
      confidence: "moderate",
      sourceLabel: "The business model can be recurring, but the public listing did not provide enough MRR data to calculate a percentage. Confirm from source metrics."
    };
  }

  return {
    value: null,
    provenance: "needs_confirmation",
    confidence: "low",
    sourceLabel: "Not enough public data to calculate or recommend recurring-revenue percentage."
  };
}

function recommendOwnerDependence(hours) {
  if (hours === null) return { value: "unknown", confidence: "low", rationale: "Owner hours/week were not available publicly." };
  if (hours <= 5) return { value: "low", confidence: "moderate", rationale: `${hours} reported owner hours/week suggests low day-to-day owner dependence, subject to diligence on relationships and know-how.` };
  if (hours <= 20) return { value: "med", confidence: "moderate", rationale: `${hours} reported owner hours/week suggests meaningful but potentially replaceable owner involvement.` };
  return { value: "high", confidence: "moderate", rationale: `${hours} reported owner hours/week suggests material owner dependence until transition planning proves otherwise.` };
}

function recommendManagementCost(hours) {
  if (hours === null) return { value: null, confidence: "low", rationale: "No public owner-hours data is available; estimate the market cost to replace the seller's actual role." };
  if (hours <= 5) return { value: 0, confidence: "moderate", rationale: `${hours} reported owner hours/week supports a $0 screening starting point for replacement management, but verify whether key relationships, strategy, or specialist work still needs replacement.` };
  return { value: null, confidence: "moderate", rationale: `${hours} reported owner hours/week is too material to convert into a salary without knowing the role. Estimate replacement cost from the actual duties and market compensation.` };
}

function recommendCapex(monetization, annualCashFlow) {
  if (annualCashFlow === null) return { value: null, profile: "Unknown", confidence: "low", rationale: "Cash flow was unavailable, so no annual capex screening reserve was calculated." };
  const assetLight = textIncludesAny(monetization, ["affiliate", "display", "lead gen", "digital product", "info product", "saas", "subscription", "content", "service"]);
  const ecommerce = textIncludesAny(monetization, ["amazon", "fba", "ecommerce", "e-commerce", "dropship"]);
  const pct = assetLight || ecommerce ? 0.02 : 0.05;
  return {
    value: roundTo(annualCashFlow * pct, 500),
    profile: assetLight || ecommerce ? "Low" : "Moderate",
    confidence: "low",
    rationale: `${Math.round(pct * 100)}% of annualized cash flow is used only as a screening reserve. Inventory is working capital, not capex; replace this estimate with diligence on actual fixed assets and software/equipment needs.`
  };
}

function recommendWorkingCapital(monetization, monthlyExpenses) {
  if (monthlyExpenses === null) return { value: null, confidence: "low", rationale: "Average monthly expenses were unavailable, so working capital at close needs manual estimation." };
  const inventoryModel = textIncludesAny(monetization, ["amazon", "fba", "ecommerce", "e-commerce", "dropship", "physical product"]);
  const months = inventoryModel ? 2 : 1;
  return {
    value: roundTo(monthlyExpenses * months, 500),
    confidence: "moderate",
    rationale: `${months} month${months === 1 ? "" : "s"} of reported average monthly expenses is used as an operating-reserve screening estimate${inventoryModel ? "; inventory requirements may require additional cash" : ""}. This is a use of funds at close, not an annual DSCR deduction.`
  };
}

function normalizeListing(listing, submittedUrl, requestedListingNumber) {
  const listingNumber = String(firstDefined(listing, ["listing_number", "listingNumber"]) || requestedListingNumber);
  const listingPrice = asNumber(firstDefined(listing, ["listing_price", "price", "asking_price"]));
  const monthlyNetProfit = asNumber(firstDefined(listing, ["average_monthly_net_profit", "monthly_net_profit", "net_profit"]));
  const monthlyRevenue = asNumber(firstDefined(listing, ["average_monthly_gross_revenue", "monthly_gross_revenue", "monthly_revenue", "gross_revenue"]));
  const monthlyExpenses = asNumber(firstDefined(listing, ["average_monthly_expenses", "monthly_expenses"]));
  const monthlyRecurringRevenue = asNumber(firstDefined(listing, ["monthly_recurring_revenue", "mrr"]));
  const inventoryCost = asNumber(firstDefined(listing, ["inventory_cost", "inventory_value", "inventory"]));
  const monthlyNetAnnualized = monthlyNetProfit === null ? null : Math.round(monthlyNetProfit * 12);
  const monetization = labelValue(firstDefined(listing, ["monetizations", "monetization", "max_monetization"]));
  const niche = labelValue(firstDefined(listing, ["niches", "niche", "max_niche"]));
  const hoursWorkedPerWeek = asNumber(firstDefined(listing, ["hours_worked_per_week", "hours_per_week"]));

  const basisRecommendation = recommendCashFlowBasis(listing, monthlyNetAnnualized);
  const annualCashFlow = Number.isFinite(basisRecommendation.annualCashFlow)
    ? basisRecommendation.annualCashFlow
    : monthlyNetAnnualized;
  const recurringRecommendation = recommendRecurringRevenue(monetization, monthlyRecurringRevenue, monthlyRevenue);
  const ownerRecommendation = recommendOwnerDependence(hoursWorkedPerWeek);
  const managementRecommendation = recommendManagementCost(hoursWorkedPerWeek);
  const capexRecommendation = recommendCapex(monetization, annualCashFlow);
  const workingCapitalRecommendation = recommendWorkingCapital(monetization, monthlyExpenses);
  const transactionCosts = listingPrice === null ? null : roundTo(listingPrice * 0.03, 500);

  const sourceUrl = buildSourceUrl(listing, submittedUrl, listingNumber);

  return {
    provider: PROVIDER,
    providerLabel: "Empire Flippers",
    listingNumber,
    sourceUrl,
    affiliateUrl: addReferrer(sourceUrl),
    extractedAt: new Date().toISOString(),
    fields: {
      purchasePrice: {
        value: listingPrice,
        provenance: listingPrice === null ? "needs_confirmation" : "imported",
        sourceLabel: "Empire Flippers listing price"
      },
      annualCashFlow: {
        value: annualCashFlow,
        provenance: annualCashFlow === null ? "needs_confirmation" : "inferred",
        sourceLabel: basisRecommendation.annualCashFlow ? "Provider-reported annual earnings figure" : "Average monthly net profit × 12"
      },
      cashFlowBasis: {
        value: basisRecommendation.value,
        provenance: basisRecommendation.value ? "recommended" : "needs_confirmation",
        confidence: basisRecommendation.confidence,
        sourceLabel: basisRecommendation.rationale
      },
      recurringRevenuePct: {
        value: recurringRecommendation.value,
        provenance: recurringRecommendation.provenance,
        confidence: recurringRecommendation.confidence,
        sourceLabel: recurringRecommendation.sourceLabel
      },
      managementCost: {
        value: managementRecommendation.value,
        provenance: managementRecommendation.value === null ? "needs_confirmation" : "recommended",
        confidence: managementRecommendation.confidence,
        sourceLabel: managementRecommendation.rationale
      },
      ownerDependence: {
        value: ownerRecommendation.value,
        provenance: ownerRecommendation.value === "unknown" ? "needs_confirmation" : "recommended",
        confidence: ownerRecommendation.confidence,
        sourceLabel: ownerRecommendation.rationale
      },
      capexReserve: {
        value: capexRecommendation.value,
        provenance: capexRecommendation.value === null ? "needs_confirmation" : "recommended",
        confidence: capexRecommendation.confidence,
        profile: capexRecommendation.profile,
        sourceLabel: capexRecommendation.rationale
      },
      workingCapitalAtClose: {
        value: workingCapitalRecommendation.value,
        provenance: workingCapitalRecommendation.value === null ? "needs_confirmation" : "recommended",
        confidence: workingCapitalRecommendation.confidence,
        sourceLabel: workingCapitalRecommendation.rationale
      },
      otherAnnualDebtService: {
        value: 0,
        provenance: "needs_confirmation",
        confidence: "low",
        sourceLabel: "Public listing data does not establish retained debt obligations. Confirm equipment loans, lines of credit, leases treated as debt, merchant debt, and any current-pay seller note separately."
      },
      transactionCosts: {
        value: transactionCosts,
        provenance: transactionCosts === null ? "needs_confirmation" : "recommended",
        confidence: "low",
        sourceLabel: transactionCosts === null ? "Enter known transaction and closing costs." : "3% of purchase price is used only as a screening placeholder; replace with actual lender, legal, diligence, and closing costs."
      },
      customerConcentrationPct: {
        value: null,
        provenance: "needs_confirmation",
        confidence: "low",
        sourceLabel: "Public listing data does not establish top-customer concentration."
      },
      booksVerifiability: {
        value: "unknown",
        provenance: "needs_confirmation",
        confidence: "low",
        sourceLabel: "Public listing data cannot establish books verifiability. Confirm against source financials and deposits."
      }
    },
    context: {
      internalId: firstDefined(listing, ["id", "uuid", "listing_id"]),
      listingStatus: firstDefined(listing, ["listing_status", "status"]),
      title: firstDefined(listing, ["title", "listing_title", "name"]),
      summary: firstDefined(listing, ["description", "summary", "short_description"]),
      monetization,
      niche,
      monthlyNetProfit,
      monthlyRevenue,
      monthlyExpenses,
      monthlyRecurringRevenue,
      inventoryCost,
      listingMultiple: asNumber(firstDefined(listing, ["listing_multiple", "monthly_multiple", "multiple"])),
      saleMultiple: asNumber(firstDefined(listing, ["sale_multiple"])),
      hoursWorkedPerWeek,
      sbaFinancingApproved: firstDefined(listing, ["sba_financing_approved", "sba_approved"]),
      firstMadeMoneyAt: firstDefined(listing, ["first_made_money_at", "business_created_at", "created_date"]),
      daysOnMarketplace: asNumber(firstDefined(listing, ["days_on_marketplace"])),
      lastUpdated: firstDefined(listing, ["last_updated", "updated_at"])
    }
  };
}

async function importEmpireFlippersListing(input) {
  const submitted = String(input || "").trim();
  const listingNumber = extractListingNumber(submitted);
  const endpoint = new URL(API_URL);
  endpoint.searchParams.set("listing_number", listingNumber);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": `Micro-Acquisition-Fundability-Calculator/${VERSION}`
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`Empire Flippers returned HTTP ${response.status}. Try again shortly or enter the deal manually.`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Empire Flippers returned an unexpected response. Enter the deal manually or try again shortly.");
  }

  const listings = extractListings(payload);
  const listing = listings.find((item) => String(firstDefined(item, ["listing_number", "listingNumber"])) === listingNumber)
    || listings[0];

  if (!listing) {
    throw new Error(`Empire Flippers listing #${listingNumber} was not found in the public Marketplace API.`);
  }

  return normalizeListing(listing, submitted.startsWith("http") ? submitted : null, listingNumber);
}

module.exports = {
  REFERRER,
  extractListingNumber,
  importEmpireFlippersListing,
  normalizeListing
};