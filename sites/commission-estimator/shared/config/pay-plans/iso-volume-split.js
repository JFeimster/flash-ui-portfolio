/**
 * Pay Plan Profile: ISO Points Split & Volume-Tiered Plan
 *
 * Models wholesale ISO / commercial funding partners that pay a percentage split
 * of Buy/Sell markup points, stepped up by monthly funded volume brackets,
 * plus an optional direct sub-broker referral override.
 */

export const ISO_VOLUME_BRACKETS = [
  { id: "iso-base", name: "Base ISO", minMonthlyVolume: 0, maxMonthlyVolume: 249999, brokerSplitPercent: 60 },
  { id: "iso-growth", name: "Growth ISO", minMonthlyVolume: 250000, maxMonthlyVolume: 499999, brokerSplitPercent: 70 },
  { id: "iso-exec", name: "Executive ISO", minMonthlyVolume: 500000, maxMonthlyVolume: 999999, brokerSplitPercent: 75 },
  { id: "iso-inst", name: "Institutional ISO", minMonthlyVolume: 1000000, maxMonthlyVolume: null, brokerSplitPercent: 80 },
];

export const ISO_VOLUME_SPLIT_PLAN = {
  id: "iso-volume-split",
  verificationStatus: "illustrative",
  publicExportAllowed: true,
  disclosure: "Unverified configurable planning assumptions. Not a contractual compensation schedule.",
  name: "ISO Points Split & Volume-Tiered Plan",
  shortName: "ISO Volume Split",
  version: "1.0.0",
  badge: "BUY/SELL SPLIT",
  summary:
    "Models wholesale lender buy/sell points markup multiplied by monthly funded-volume split tiers (60%–80%), plus an optional direct sub-broker override.",
  payoutBasisLabel: "Buy/Sell Markup Points × Split",
  capabilities: {
    usesBonusRevenue: false,
    usesPointsMarkup: true,
    tierSystem: "monthly-volume",
    overrideModels: ["iso-sub-broker"],
    qualificationRule: "none",
    supportsAgencyMode: true,
  },
  defaultMarkupPoints: 8.0, // e.g., 8 points gross commissionable markup before house/broker split
  volumeBrackets: ISO_VOLUME_BRACKETS,
  defaultSubBrokerOverridePercent: 1.0, // 1.0% of sub-broker funded volume
};
