"use strict";

const RECOMMENDATIONS_API_URL = "https://api.empireflippers.com/api/v1/listings/recommendations";
const REFERRER = "6I8WK4WSMYC9KGJD";
const VERSION = "1.3.2";

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

function extractListings(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.data,
    payload.recommendations,
    payload.listings,
    payload.results,
    payload.items,
    payload.data && payload.data.recommendations,
    payload.data && payload.data.listings,
    payload.data && payload.data.data,
    payload.response && payload.response.data,
    payload.response && payload.response.recommendations
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function unwrapListing(item) {
  if (!item || typeof item !== "object") return item;
  for (const key of ["listing", "recommended_listing", "recommendedListing", "result"]) {
    if (item[key] && typeof item[key] === "object") return item[key];
  }
  return item;
}

function buildSourceUrl(listing, listingNumber) {
  const providerUrl = firstDefined(listing, ["listing_url", "marketplace_url", "url", "public_url"]);
  if (providerUrl) return String(providerUrl);
  return `https://empireflippers.com/marketplace/?q=${encodeURIComponent(listingNumber || "")}`;
}

function normalizeRecommendation(item, index) {
  const listing = unwrapListing(item);
  const listingNumber = String(firstDefined(listing, ["listing_number", "listingNumber"]) || "");
  const sourceUrl = buildSourceUrl(listing, listingNumber);

  return {
    provider: "empire_flippers",
    providerLabel: "Empire Flippers",
    providerRank: index + 1,
    listingNumber,
    sourceUrl,
    affiliateUrl: addReferrer(sourceUrl),
    title: firstDefined(listing, ["title", "listing_title", "name"]),
    summary: firstDefined(listing, ["description", "summary", "short_description"]),
    listingStatus: firstDefined(listing, ["listing_status", "status"]),
    askingPrice: asNumber(firstDefined(listing, ["listing_price", "price", "asking_price"])),
    monthlyNetProfit: asNumber(firstDefined(listing, ["average_monthly_net_profit", "monthly_net_profit", "net_profit"])),
    monthlyRevenue: asNumber(firstDefined(listing, ["average_monthly_gross_revenue", "monthly_gross_revenue", "monthly_revenue", "gross_revenue"])),
    monthlyRecurringRevenue: asNumber(firstDefined(listing, ["monthly_recurring_revenue", "mrr"])),
    listingMultiple: asNumber(firstDefined(listing, ["listing_multiple", "monthly_multiple", "multiple"])),
    monetization: labelValue(firstDefined(listing, ["monetizations", "monetization", "max_monetization"])),
    niche: labelValue(firstDefined(listing, ["niches", "niche", "max_niche"])),
    hoursWorkedPerWeek: asNumber(firstDefined(listing, ["hours_worked_per_week", "hours_per_week"])),
    firstMadeMoneyAt: firstDefined(listing, ["first_made_money_at", "business_created_at", "created_date"]),
    sbaFinancingApproved: firstDefined(listing, ["sba_financing_approved", "sba_approved"])
  };
}

async function getEmpireFlippersRecommendations(internalId, options = {}) {
  const id = String(internalId || "").trim();
  if (!/^[A-Za-z0-9-]{8,100}$/.test(id)) {
    throw new Error("A valid Empire Flippers internal listing ID is required for recommendations.");
  }

  const maxResults = Math.max(1, Math.min(5, Number(options.limit) || 3));
  const excludeListingNumber = options.excludeListingNumber ? String(options.excludeListingNumber) : null;
  const endpoint = new URL(RECOMMENDATIONS_API_URL);
  endpoint.searchParams.set("id", id);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": `Acquisition-Deal-Fundability-Calculator/${VERSION}`
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`Empire Flippers recommendations returned HTTP ${response.status}.`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Empire Flippers recommendations returned an unexpected response.");
  }

  const listings = extractListings(payload)
    .map(unwrapListing)
    .filter((item) => {
      if (!excludeListingNumber) return true;
      const listingNumber = String(firstDefined(item, ["listing_number", "listingNumber"]) || "");
      return listingNumber !== excludeListingNumber;
    })
    .filter((item) => firstDefined(item, ["listing_number", "listingNumber", "listing_price", "price"]) !== null)
    .slice(0, maxResults)
    .map(normalizeRecommendation);

  return listings;
}

module.exports = {
  getEmpireFlippersRecommendations,
  normalizeRecommendation
};