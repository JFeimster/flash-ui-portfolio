"use strict";

const API_URL = "https://api.empireflippers.com/api/v1/partner-toolkit/valuation-tool/valuation";
const VERSION = "1.4.0";

const ALLOWED_PARAMS = new Set([
  "average_monthly_net_profit",
  "monetization",
  "business_created_at",
  "debug_mode",
  "social_media_followers",
  "unique_users",
  "unique_visitors",
  "email_subscribers",
  "number_of_products",
  "number_of_paid_subscribers",
  "number_of_revenue_channels",
  "active_customers",
  "number_of_downloads",
  "saas_model",
  "first_subscriber_at",
  "mrr_now",
  "mrr_3_months_ago",
  "mrr_12_months_ago",
  "average_monthly_net_profit_3_months",
  "average_monthly_net_profit_6_months",
  "average_monthly_churn_percent",
  "hours_worked_per_week",
  "average_monthly_gross_revenue",
  "revenue_diversity",
  "recurring_revenue",
  "client_acquisition"
]);

function send(res, status, payload) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function cleanValue(value) {
  if (Array.isArray(value)) return cleanValue(value[0]);
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function asInteger(value) {
  const raw = cleanValue(value);
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed);
}

function normalize(data) {
  return {
    absoluteLowMultiple: data.absolute_low_multiple ?? null,
    typicalLowMultiple: data.typical_low_multiple ?? null,
    suggestedListingMultiple: data.suggested_listing_multiple ?? null,
    typicalHighMultiple: data.typical_high_multiple ?? null,
    absoluteHighMultiple: data.absolute_high_multiple ?? null,
    absoluteLowValuation: data.absolute_low_valuation ?? null,
    typicalLowValuation: data.typical_low_valuation ?? null,
    suggestedListingPrice: data.suggested_listing_price ?? null,
    typicalHighValuation: data.typical_high_valuation ?? null,
    absoluteHighValuation: data.absolute_high_valuation ?? null,
    isProfitMultiple: data.is_profit_multiple !== false
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { ok: false, error: "Method not allowed. Request a valuation with GET." });
  }

  const apiKey = process.env.EMPIRE_FLIPPERS_API_KEY;
  if (!apiKey) {
    return send(res, 503, { ok: false, error: "Seller valuation is temporarily unavailable because the server credential is not configured." });
  }

  const profit = asInteger(req.query && req.query.average_monthly_net_profit);
  if (profit === null) {
    return send(res, 400, { ok: false, error: "Average monthly net profit is required and must be zero or greater." });
  }

  const endpoint = new URL(API_URL);
  endpoint.searchParams.set("average_monthly_net_profit", String(profit));

  for (const [key, raw] of Object.entries(req.query || {})) {
    if (!ALLOWED_PARAMS.has(key) || key === "average_monthly_net_profit") continue;
    const value = cleanValue(raw);
    if (value !== "") endpoint.searchParams.set(key, value);
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Empire-Flippers-API-Key": apiKey,
        "User-Agent": `Acquisition-Deal-Fundability-Calculator/${VERSION}`
      },
      signal: AbortSignal.timeout(12000)
    });

    let payload = null;
    try { payload = await response.json(); } catch { /* handled below */ }

    if (!response.ok || !payload || !payload.data) {
      const errors = payload && Array.isArray(payload.errors) ? payload.errors.filter(Boolean) : [];
      const message = errors.length ? errors.join(" ") : `Empire Flippers valuation returned HTTP ${response.status}.`;
      const status = response.status === 400 ? 400 : response.status === 403 ? 502 : response.status === 429 ? 429 : 502;
      return send(res, status, { ok: false, error: message });
    }

    return send(res, 200, {
      ok: true,
      provider: "empire_flippers",
      valuation: normalize(payload.data),
      assumptions: Object.fromEntries(endpoint.searchParams.entries()),
      disclaimer: "Automated marketplace valuation estimate only; not a formal appraisal, broker opinion, lender approval, or guarantee of sale price."
    });
  } catch (error) {
    return send(res, 502, {
      ok: false,
      error: error && error.name === "TimeoutError"
        ? "Empire Flippers valuation timed out. Try again shortly."
        : "Seller valuation is temporarily unavailable. Try again shortly."
    });
  }
};
