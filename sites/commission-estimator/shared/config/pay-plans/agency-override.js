/**
 * Pay Plan Profile: Agency Override & Downline Plan (Generically Labeled)
 *
 * Parameterized from a multi-tier commercial funding agency compensation structure:
 * - Bonus Revenue (BR) base per product category
 * - 18-Tier Personal Performance Ladder (10% -> 40% -> 80% in 2.5% steps)
 *   gated by cumulative unique clients + Total Personal Bonus Revenue (TPBR)
 * - Qualified Certified Broker (QCB) rolling 6-month / first-30-days guardrail & fallback rules
 * - Differential Override Spreads with intermediate-manager QCB roll-up
 * - 5-Level Agency Pay (4% / 2% / 2% / 2% / 2%) with frontline QCB unlock gates & next-month-15th lag
 * - 2-Generation Top-Tier Leadership Override (2% Openline BR for Gen 1 & Gen 2; hard cap at Gen 3+)
 */

export const AGENCY_PERFORMANCE_LADDER = [
  { tier: 1, rate: 10.0, minClients: 0, minTPBR: 0, code: "RP", title: "Referral Partner", qualification: "Renew Annually", qcbRequired: false, fallbackTier: 1 },
  { tier: 2, rate: 40.0, minClients: 0, minTPBR: 0, code: "GA1", title: "General Agency", qualification: "Certified Broker", qcbRequired: false, fallbackTier: 2 },
  { tier: 3, rate: 42.5, minClients: 1, minTPBR: 1000, code: "GA2", title: "General Agency 2", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 4, rate: 45.0, minClients: 1, minTPBR: 2000, code: "GA3", title: "General Agency 3", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 5, rate: 47.5, minClients: 2, minTPBR: 3000, code: "GA4", title: "General Agency 4", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 6, rate: 50.0, minClients: 2, minTPBR: 5000, code: "GA5", title: "General Agency 5", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 7, rate: 52.5, minClients: 4, minTPBR: 7500, code: "GA6", title: "General Agency 6", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 8, rate: 55.0, minClients: 5, minTPBR: 10000, code: "GA7", title: "General Agency 7", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 9, rate: 57.5, minClients: 6, minTPBR: 25000, code: "GA8", title: "General Agency 8", qualification: "QCB", qcbRequired: true, fallbackTier: 2 },
  { tier: 10, rate: 60.0, minClients: 7, minTPBR: 50000, code: "MGA1", title: "Managing Agency", qualification: "Certified Broker", qcbRequired: false, fallbackTier: 10 },
  { tier: 11, rate: 62.5, minClients: 8, minTPBR: 70000, code: "MGA2", title: "Managing Agency 2", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 12, rate: 65.0, minClients: 9, minTPBR: 80000, code: "MGA3", title: "Managing Agency 3", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 13, rate: 67.5, minClients: 10, minTPBR: 90000, code: "MGA4", title: "Managing Agency 4", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 14, rate: 70.0, minClients: 12, minTPBR: 100000, code: "SGA1", title: "Supervising Agency", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 15, rate: 72.5, minClients: 14, minTPBR: 150000, code: "SGA2", title: "Supervising Agency 2", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 16, rate: 75.0, minClients: 16, minTPBR: 200000, code: "SGA3", title: "Supervising Agency 3", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 17, rate: 77.5, minClients: 18, minTPBR: 250000, code: "SGA4", title: "Supervising Agency 4", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
  { tier: 18, rate: 80.0, minClients: 20, minTPBR: 300000, code: "NA", title: "National Agency (Top Tier)", qualification: "QCB", qcbRequired: true, fallbackTier: 10 },
];

export const AGENCY_FIVE_LEVEL_SCHEDULE = [
  { level: 1, label: "Level 1 (Personally Enrolled)", rate: 4.0, requiresQCB: false, requiresCertified: true, minFrontlineQCBs: 0 },
  { level: 2, label: "Level 2 Downline", rate: 2.0, requiresQCB: true, requiresCertified: true, minFrontlineQCBs: 3 },
  { level: 3, label: "Level 3 Downline", rate: 2.0, requiresQCB: true, requiresCertified: true, minFrontlineQCBs: 6 },
  { level: 4, label: "Level 4 Downline", rate: 2.0, requiresQCB: true, requiresCertified: true, minFrontlineQCBs: 10 },
  { level: 5, label: "Level 5 Downline", rate: 2.0, requiresQCB: true, requiresCertified: true, minFrontlineQCBs: 20 },
];

export const AGENCY_OVERRIDE_PLAN = {
  id: "agency-override",
  verificationStatus: "illustrative",
  publicExportAllowed: true,
  disclosure: "Unverified configurable planning assumptions. Not a contractual compensation schedule.",
  name: "Agency Override & Downline Plan",
  shortName: "Agency Override",
  version: "1.0.0",
  badge: "18-TIER + DOWNLINE",
  summary:
    "Bonus Revenue (BR) agency compensation model featuring an 18-tier personal performance ladder (10%–80%), differential Override Spreads with QCB roll-up, 5-Level Downline Pay (4%/2%/2%/2%/2%), and 2-Generation Top-Tier Leadership Overrides.",
  payoutBasisLabel: "Bonus Revenue (BR)",
  capabilities: {
    usesBonusRevenue: true,
    usesPointsMarkup: false,
    tierSystem: "cumulative-ladder",
    overrideModels: ["spread", "five-level", "leadership-gen"],
    qualificationRule: "qcb-6mo",
    supportsAgencyMode: true,
  },
  // Illustrative Bonus Revenue % of funded amount per product category (editable by user)
  defaultProductBRRates: {
    "business-capital": 8.0,
    "revenue-based": 6.0,
    "asset-backed": 5.0,
    "saas-ecommerce": 6.0,
    "business-credit": 2.5,
  },
  qcbRule: {
    rollingWindowMonths: 6,
    minRollingPersonalBR: 1000,
    newBrokerGraceDays: 30,
    summary: "Certified Broker + either first 30 days or $1,000+ cumulative Personal BR in the last 6 months.",
  },
  performanceLadder: AGENCY_PERFORMANCE_LADDER,
  fiveLevelSchedule: AGENCY_FIVE_LEVEL_SCHEDULE,
  fiveLevelPayoutLagMonths: 1, // Paid on the 15th of the following month for prior month's BR
  leadershipOverride: {
    requiredTier: 18,
    requiredRate: 80.0,
    ratePercent: 2.0,
    maxGenerations: 2,
    summary: "Paid daily at 2% of Openline BR for up to 2 top-tier (80%) leadership generations per line, stacked in addition to 5-Level Pay.",
  },
};
