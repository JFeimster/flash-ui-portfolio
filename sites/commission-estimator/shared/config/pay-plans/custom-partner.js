/**
 * Pay Plan Profile: Custom Partner & Override Builder
 *
 * Allows modeling any funding partner company by selecting the commission base
 * (Direct %, Bonus Revenue × Split, or Points Markup × Split) and configuring
 * custom personal split, direct spread override, and 5-level override percentages.
 */

export const CUSTOM_PARTNER_PLAN = {
  id: "custom-partner",
  verificationStatus: "illustrative",
  publicExportAllowed: true,
  disclosure: "Unverified configurable planning assumptions. Not a contractual compensation schedule.",
  name: "Custom Partner & Override Builder",
  shortName: "Custom Partner",
  version: "1.0.0",
  badge: "CUSTOMIZABLE",
  summary:
    "Configure any external funding partner's compensation structure: choose Direct %, Bonus Revenue × Split, or Points Markup × Split with editable personal split and custom downline override rates.",
  payoutBasisLabel: "Custom Partner Formula",
  capabilities: {
    usesBonusRevenue: true,
    usesPointsMarkup: true,
    tierSystem: "custom-split",
    overrideModels: ["spread", "five-level"],
    qualificationRule: "none",
    supportsAgencyMode: true,
  },
  defaultCustomConfig: {
    baseType: "bonus-revenue", // 'direct-percent' | 'bonus-revenue' | 'points-markup'
    personalSplitPercent: 60,
    markupPoints: 8.0,
    bonusRevenuePercent: 7.0,
    spreadOverridePercent: 10.0,
    levelRates: [4.0, 2.0, 2.0, 2.0, 2.0],
  },
};
