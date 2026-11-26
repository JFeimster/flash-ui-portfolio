/**
 * Authoritative Compensation Configuration
 * Commission Estimator
 *
 * Single source of truth imported by all four visual design variants,
 * the production root, reporting exports, and automated test suites.
 *
 * Replace illustrative values only after an approved compensation schedule
 * has been formally verified, then switch verificationStatus to
 * 'VERIFIED PROGRAM MODE' and populate approvedSourceReference.
 */

export const COMMISSION_CONFIG = {
  programName: "Moonshine Capital Partner Program",
  version: "1.0.0",
  effectiveDate: "2026-01-01",
  verificationStatus: "DEMONSTRATION MODE", // 'DEMONSTRATION MODE' | 'VERIFIED PROGRAM MODE'
  approvedSourceReference: "Illustrative Demonstration Schedule (Unverified — Replace with Approved Partner Agreement)",
  publicExportAllowed: true, // Existing illustrative assumptions only; never a contractual schedule.
  currency: "USD",
  locale: "en-US",
  limits: {
    minMonthlyDeals: 0,
    sliderMaxMonthlyDeals: 50,
    maxMonthlyDeals: 250,
    minDealSize: 1000,
    maxDealSize: 10000000,
    minGrowthRate: -25,
    maxGrowthRate: 25,
    maxOperatingExpenses: 250000,
    maxPaymentDelayMonths: 6,
    maxRampUpMonths: 12,
  },
  dealSizePresets: [10000, 25000, 50000, 100000, 250000, 500000],
  projectionHorizons: [12, 24, 36],
  scenarios: {
    conservative: {
      id: "conservative",
      label: "Conservative",
      multiplier: 0.6,
      description: "0.60x hypothetical planning multiplier applied to monthly funded deal volume.",
    },
    base: {
      id: "base",
      label: "Base Case",
      multiplier: 1.0,
      description: "1.00x baseline production volume from your selected inputs.",
    },
    optimistic: {
      id: "optimistic",
      label: "Optimistic",
      multiplier: 1.4,
      description: "1.40x hypothetical planning multiplier applied to monthly funded deal volume.",
    },
  },
  /**
   * Supported funding product categories.
   * Preserves user-configured commission rates (Business Capital 4.0%, Revenue-Based 4.0%).
   * Set compensationMethod to 'percentage' or 'fixed' as specified by an approved schedule.
   */
  products: [
    {
      id: "business-capital",
      name: "Business Capital",
      shortName: "Business Capital",
      enabled: true,
      compensationMethod: "percentage", // 'percentage' | 'fixed'
      commissionRate: 4.0,
      defaultBRRate: 8.0,
      fixedFee: 0,
      defaultDealSize: 50000,
      commissionableBasis: "Funded principal amount",
      defaultAllocation: 30,
      description: "Working capital loans and term debt for established operating businesses.",
    },
    {
      id: "revenue-based",
      name: "Revenue-Based Funding",
      shortName: "Revenue-Based",
      enabled: true,
      compensationMethod: "percentage",
      commissionRate: 4.0,
      defaultBRRate: 6.0,
      fixedFee: 0,
      defaultDealSize: 50000,
      commissionableBasis: "Funded advance amount",
      defaultAllocation: 25,
      description: "Flexible capital structured against future business receivables.",
    },
    {
      id: "asset-backed",
      name: "Asset-Backed Funding",
      shortName: "Asset-Backed",
      enabled: true,
      compensationMethod: "percentage",
      commissionRate: 2.5,
      defaultBRRate: 5.0,
      fixedFee: 0,
      defaultDealSize: 50000,
      commissionableBasis: "Eligible collateralized funding amount",
      defaultAllocation: 15,
      description: "Secured credit lines backed by equipment, inventory, or accounts receivable.",
    },
    {
      id: "saas-ecommerce",
      name: "SaaS / E-commerce Funding",
      shortName: "SaaS & E-comm",
      enabled: true,
      compensationMethod: "percentage",
      commissionRate: 3.5,
      defaultBRRate: 6.0,
      fixedFee: 0,
      defaultDealSize: 50000,
      commissionableBasis: "Funded growth tranche",
      defaultAllocation: 20,
      description: "Growth capital designed for recurring-revenue and digital commerce businesses.",
    },
    {
      id: "business-credit",
      name: "Business Credit",
      shortName: "Business Credit",
      enabled: true,
      compensationMethod: "percentage",
      commissionRate: 2.8,
      defaultBRRate: 2.5,
      fixedFee: 350,
      defaultDealSize: 50000,
      subscriptionMonthlyFee: 45, // Used only when subscription credit modeling is explicitly enabled
      commissionableBasis: "Funded credit facility or fixed program fee",
      defaultAllocation: 10,
      description: "Corporate credit lines and structured business credit building programs.",
    },
  ],
  /**
   * Demonstration tier thresholds (non-overlapping).
   * tierRateBonus defaults to 0 so commission rates are NEVER automatically inflated
   * unless explicitly defined in an approved compensation schedule.
   */
  tiers: [
    {
      id: "pre-production",
      name: "Pre-production",
      minDeals: 0,
      maxDeals: 0,
      tierRateBonus: 0,
      summary: "Onboarding & pipeline preparation (0 monthly funded deals).",
    },
    {
      id: "bronze",
      name: "Bronze",
      minDeals: 1,
      maxDeals: 10,
      tierRateBonus: 0,
      summary: "Active independent partner tier (1–10 monthly funded deals).",
    },
    {
      id: "silver",
      name: "Silver",
      minDeals: 11,
      maxDeals: 25,
      tierRateBonus: 0,
      summary: "Consistent producer tier (11–25 monthly funded deals).",
    },
    {
      id: "gold",
      name: "Gold",
      minDeals: 26,
      maxDeals: 50,
      tierRateBonus: 0,
      summary: "High-volume partner tier (26–50 monthly funded deals).",
    },
    {
      id: "platinum",
      name: "Platinum",
      minDeals: 51,
      maxDeals: null,
      tierRateBonus: 0,
      summary: "Enterprise brokerage tier (51+ monthly funded deals).",
    },
  ],
  bonusRules: {
    enabledByDefault: false,
    availableInConfig: true,
    label: "Hypothetical Qualified Volume Bonus",
    minMonthlyVolume: 500000,
    minMonthlyDeals: 10,
    bonusPercentOfVolume: 0.25, // Illustrative 0.25% volume kicker only when explicitly enabled
    description: "Illustrative qualified volume bonus when monthly funded volume meets threshold.",
  },
  recurringRules: {
    enabledByDefault: false,
    availableInConfig: true,
    label: "Hypothetical Portfolio Recurring Trail",
    annualizedTrailRatePercent: 0.15, // Monthly trail rate applied to retained funded cohorts
    defaultRetentionRatePercent: 85, // Annualized retention modeled monthly
    description: "Illustrative recurring trail on retained active portfolio when enabled.",
  },
  paymentDelay: {
    defaultMonths: 0,
    options: [0, 1, 2, 3],
    note: "Modeled lag between deal funding (earned) and commission disbursement (receipts).",
  },
  deductionsAndClawbacks: {
    modeledAutomatically: false,
    disclosure: "Clawbacks, early-payoff adjustments, syndication splits, and underwriting chargebacks are governed by the executed Partner Agreement and are not deducted automatically.",
  },
  featureAvailability: {
    recurringCommissions: true,
    qualifiedBonuses: true,
    businessCreditSubscriptionMode: true,
    operatingExpenses: true,
    rampUpSchedule: true,
    capacityCap: true,
    customProductRates: true,
    teamOverrides: true,
    multiPartnerPayPlans: true,
  },
  /**
   * Standardized demonstration baseline (Section 13 reference test).
   * Using 10 deals x $50,000 x 3.0% uniform illustrative rate:
   * Monthly volume = $500,000 | Monthly gross = $15,000 | Annualized = $180,000 | 36-mo = $540,000.
   */
  standardDemonstrationBaseline: {
    monthlyDeals: 10,
    averageDealSize: 50000,
    uniformIllustrativeRate: 3.0,
    monthlyGrowthRate: 0,
    operatingExpenses: 0,
    paymentDelayMonths: 0,
    rampUpMonths: 0,
    enableBonuses: false,
    enableRecurring: false,
  },
  defaultAssumptions: {
    payPlanId: "direct-rate",
    operatingMode: "solo", // 'solo' | 'agency'
    monthlyDeals: 10,
    averageDealSize: 50000,
    allocationMode: "custom", // 'equal' | 'custom'
    monthlyGrowthRate: 0,
    rampUpMonths: 0,
    maxMonthlyCapacity: 0, // 0 = uncapped
    customerRetentionRate: 85,
    operatingExpenses: 0,
    paymentDelayMonths: 0,
    scenario: "base",
    projectionHorizon: 12,
    enableBonuses: false,
    enableRecurring: false,
    enableCreditSubscription: false,
    creditSubscriptionClientsPerMonth: 0,
    targetMonthlyIncome: 25000,
  },
};

export function getDefaultAllocations(config = COMMISSION_CONFIG) {
  const allocations = {};
  for (const product of config.products) {
    if (product.enabled !== false) {
      allocations[product.id] = product.defaultAllocation;
    }
  }
  return allocations;
}

export function getEqualAllocations(config = COMMISSION_CONFIG) {
  const enabled = config.products.filter((p) => p.enabled !== false);
  const count = enabled.length;
  if (count === 0) return {};
  const base = Math.floor(100 / count);
  let remainder = 100 - base * count;
  const allocations = {};
  enabled.forEach((product) => {
    allocations[product.id] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
  });
  return allocations;
}
