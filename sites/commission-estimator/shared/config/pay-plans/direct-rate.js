/**
 * Pay Plan Profile: Direct Product Rate Plan (Clean Default)
 * Flat / per-product direct percentage of funded volume (or fixed fee).
 */

export const DIRECT_RATE_PLAN = {
  id: "direct-rate",
  verificationStatus: "illustrative",
  publicExportAllowed: true,
  disclosure: "Unverified configurable planning assumptions. Not a contractual compensation schedule.",
  name: "Direct Product Rate Plan",
  shortName: "Direct Rate",
  version: "1.0.0",
  badge: "DEFAULT",
  summary:
    "Direct commission percentage (or fixed fee) calculated on funded deal volume per product category. Ideal for standard direct lender and solo broker schedules.",
  payoutBasisLabel: "Funded Deal Volume",
  capabilities: {
    usesBonusRevenue: false,
    usesPointsMarkup: false,
    tierSystem: "deal-count",
    overrideModels: [],
    qualificationRule: "none",
    supportsAgencyMode: false,
  },
};
