/**
 * Deterministic Multi-Partner Financial Calculation Engine
 * Commission Estimator
 *
 * Supports:
 * 1. Direct Product Rate Plan (clean default — preserves exact 100% baseline parity)
 * 2. Agency Override & Downline Plan (Bonus Revenue base, 18-tier Performance Ladder
 *    with auto-advancement over 12–36 months, QCB qualification & fallback guardrails,
 *    differential Override Spreads with intermediate QCB roll-up, 5-Level Agency Pay
 *    4%/2%/2%/2%/2% with frontline QCB unlock gates & next-month-15th payout lag, and
 *    2-Generation Top-Tier Leadership Override at 2% Openline BR capped at Gen 2)
 * 3. ISO Points Split & Volume-Tiered Plan (Buy/Sell points × monthly volume brackets + sub-broker override)
 * 4. Custom Partner & Override Builder (configurable commission base + personal split + custom downline rates)
 */

import { COMMISSION_CONFIG, getDefaultAllocations, getEqualAllocations } from "../config/commission-config.js";
import {
  AGENCY_OVERRIDE_PLAN,
  CUSTOM_PARTNER_PLAN,
  DEFAULT_PAY_PLAN_ID,
  getPayPlanById,
  ISO_VOLUME_SPLIT_PLAN,
  PAY_PLAN_LIST,
} from "../config/pay-plans/index.js";

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function toFiniteNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createDefaultAgencyState() {
  return {
    startingTier: 10, // Tier 10 (MGA1 — 60%) illustrative agency starting point
    isCertified: true,
    isQCB: true,
    autoAdvanceLadder: true,
    uniqueClientRatioPercent: 75, // % of funded deals that are new unique clients vs renewals
    frontlineQCBs: 6, // Unlocks L1, L2, L3 by default in Agency mode
    customBRRates: {}, // Optional per-product BR % overrides
    spreadCohorts: [
      {
        id: "cohort-direct",
        label: "Direct Certified Brokers (GA1)",
        activeBrokers: 3,
        avgMonthlyBR: 6000,
        brokerTierRate: 40,
        intermediateManagerRate: 0,
        intermediateIsQCB: true,
      },
      {
        id: "cohort-managed",
        label: "Managed Team Line (GA5 → GA1)",
        activeBrokers: 2,
        avgMonthlyBR: 6000,
        brokerTierRate: 40,
        intermediateManagerRate: 50,
        intermediateIsQCB: true,
      },
    ],
    fiveLevels: [
      { level: 1, brokers: 5, avgMonthlyBR: 6000 },
      { level: 2, brokers: 6, avgMonthlyBR: 5000 },
      { level: 3, brokers: 4, avgMonthlyBR: 4000 },
      { level: 4, brokers: 2, avgMonthlyBR: 4000 },
      { level: 5, brokers: 0, avgMonthlyBR: 4000 },
    ],
    leadership: {
      gen1OpenlineBR: 100000,
      gen2OpenlineBR: 75000,
      gen3OpenlineBR: 50000, // Always pays $0 — demonstrates hard 2-gen cap
    },
  };
}

export function createDefaultIsoState() {
  return {
    markupPoints: ISO_VOLUME_SPLIT_PLAN.defaultMarkupPoints,
    subBrokerCount: 3,
    subBrokerAvgMonthlyVolume: 150000,
    subBrokerOverridePercent: ISO_VOLUME_SPLIT_PLAN.defaultSubBrokerOverridePercent,
  };
}

export function createDefaultCustomPlanState() {
  return {
    baseType: CUSTOM_PARTNER_PLAN.defaultCustomConfig.baseType,
    personalSplitPercent: CUSTOM_PARTNER_PLAN.defaultCustomConfig.personalSplitPercent,
    markupPoints: CUSTOM_PARTNER_PLAN.defaultCustomConfig.markupPoints,
    bonusRevenuePercent: CUSTOM_PARTNER_PLAN.defaultCustomConfig.bonusRevenuePercent,
    spreadOverridePercent: CUSTOM_PARTNER_PLAN.defaultCustomConfig.spreadOverridePercent,
    levelRates: [...CUSTOM_PARTNER_PLAN.defaultCustomConfig.levelRates],
  };
}

/**
 * Evaluate the 18-Tier Personal Performance Ladder with Certification & QCB Fallback rules.
 */
export function evaluateAgencyLadderTier({
  cumulativeClients = 0,
  cumulativeTPBR = 0,
  startingTier = 2,
  isCertified = true,
  isQCB = true,
  autoAdvanceLadder = true,
  plan = AGENCY_OVERRIDE_PLAN,
} = {}) {
  const ladder = plan.performanceLadder;
  const clampedStart = clamp(Math.round(toFiniteNumber(startingTier, 2)), 1, ladder.length);

  // Uncertified brokers are strictly Referral Partners (Tier 1, 10%)
  if (!isCertified) {
    const rp = ladder[0];
    return {
      earnedTier: rp,
      effectiveTier: rp,
      nextTier: ladder[1],
      qcbDropped: false,
      overridesEligible: false,
      l1Eligible: false,
      leadershipEligible: false,
      clientsToNext: 0,
      tpbrToNext: 0,
      cumulativeClients: round2(cumulativeClients),
      cumulativeTPBR: round2(cumulativeTPBR),
    };
  }

  let earnedIndex = Math.max(1, clampedStart - 1); // At least Tier 2 (GA1) once Certified

  if (autoAdvanceLadder) {
    for (let i = earnedIndex; i < ladder.length; i++) {
      const candidate = ladder[i];
      if (cumulativeClients >= candidate.minClients && cumulativeTPBR >= candidate.minTPBR) {
        earnedIndex = i;
      } else {
        break;
      }
    }
  }

  const earnedTier = ladder[earnedIndex];

  // QCB Fallback rule:
  // Losing QCB temporarily drops MGA+ (tier >= 10) to MGA1 (60%, tier 10)
  // and GA2–GA8 (tier 3..9) to GA1 (40%, tier 2), and stops overrides (except L1 4%).
  let effectiveTier = earnedTier;
  let qcbDropped = false;
  if (!isQCB && earnedTier.qcbRequired) {
    effectiveTier = ladder.find((t) => t.tier === earnedTier.fallbackTier) || ladder[1];
    qcbDropped = effectiveTier.tier < earnedTier.tier;
  }

  const nextTier = ladder[earnedIndex + 1] || null;
  const clientsToNext = nextTier ? Math.max(0, Math.ceil(nextTier.minClients - cumulativeClients)) : 0;
  const tpbrToNext = nextTier ? Math.max(0, round2(nextTier.minTPBR - cumulativeTPBR)) : 0;

  return {
    earnedTier,
    effectiveTier,
    nextTier,
    qcbDropped,
    overridesEligible: Boolean(isCertified && isQCB),
    l1Eligible: Boolean(isCertified),
    leadershipEligible: Boolean(isCertified && isQCB && effectiveTier.tier >= plan.leadershipOverride.requiredTier),
    clientsToNext,
    tpbrToNext,
    cumulativeClients: round2(cumulativeClients),
    cumulativeTPBR: round2(cumulativeTPBR),
  };
}

/**
 * Calculate Differential Override Spreads with Intermediate Manager QCB Roll-Up.
 */
export function calculateOverrideSpreads({
  userEffectiveRate = 40,
  isQCB = true,
  cohorts = [],
  overrideFixedSpreadPercent = null,
} = {}) {
  let totalTeamBR = 0;
  let totalSpreadCommission = 0;

  const cohortResults = (cohorts || []).map((c, idx) => {
    const activeBrokers = clamp(Math.max(0, toFiniteNumber(c.activeBrokers, 0)), 0, 500);
    const avgMonthlyBR = clamp(Math.max(0, toFiniteNumber(c.avgMonthlyBR, 0)), 0, 1000000);
    const brokerTierRate = clamp(toFiniteNumber(c.brokerTierRate, 40), 0, 80);
    const intermediateManagerRate = clamp(toFiniteNumber(c.intermediateManagerRate, 0), 0, 80);
    const intermediateIsQCB = c.intermediateIsQCB !== false;

    const cohortBR = round2(activeBrokers * avgMonthlyBR);
    let effectiveHighestBelow = brokerTierRate;
    let rollUpTriggered = false;

    if (intermediateManagerRate > brokerTierRate) {
      if (intermediateIsQCB) {
        effectiveHighestBelow = intermediateManagerRate;
      } else {
        // Non-QCB intermediate broker is skipped — full spread rolls up to next QCB
        rollUpTriggered = true;
      }
    }

    let spreadPercent = 0;
    if (overrideFixedSpreadPercent !== null) {
      spreadPercent = clamp(Math.max(0, toFiniteNumber(overrideFixedSpreadPercent, 0)), 0, 50);
    } else if (isQCB) {
      spreadPercent = Math.max(0, round2(userEffectiveRate - effectiveHighestBelow));
    }

    const monthlyOverride = round2(cohortBR * (spreadPercent / 100));
    totalTeamBR = round2(totalTeamBR + cohortBR);
    totalSpreadCommission = round2(totalSpreadCommission + monthlyOverride);

    return {
      id: c.id || `cohort-${idx + 1}`,
      label: c.label || `Team Cohort ${idx + 1}`,
      activeBrokers,
      avgMonthlyBR,
      cohortBR,
      brokerTierRate,
      intermediateManagerRate,
      intermediateIsQCB,
      effectiveHighestBelow,
      rollUpTriggered,
      spreadPercent,
      monthlyOverride,
    };
  });

  return {
    eligible: Boolean(isQCB || overrideFixedSpreadPercent !== null),
    totalTeamBR,
    totalSpreadCommission,
    cohorts: cohortResults,
  };
}

/**
 * Calculate 5-Level Agency Overrides (4% / 2% / 2% / 2% / 2% or custom rates)
 * with Frontline QCB Unlock Gates (0 / 3 / 6 / 10 / 20).
 */
export function calculateFiveLevelPay({
  isCertified = true,
  isQCB = true,
  frontlineQCBs = 0,
  levels = [],
  customLevelRates = null,
  ignoreQualificationGates = false,
  plan = AGENCY_OVERRIDE_PLAN,
} = {}) {
  const cleanFrontline = clamp(Math.round(Math.max(0, toFiniteNumber(frontlineQCBs, 0))), 0, 500);
  let totalDownlineBR = 0;
  let totalFiveLevelCommission = 0;

  const levelResults = plan.fiveLevelSchedule.map((sched, idx) => {
    const inputRow = levels[idx] || { level: sched.level, brokers: 0, avgMonthlyBR: 0 };
    const brokers = clamp(Math.max(0, toFiniteNumber(inputRow.brokers, 0)), 0, 1000);
    const avgMonthlyBR = clamp(Math.max(0, toFiniteNumber(inputRow.avgMonthlyBR, 0)), 0, 1000000);
    const levelBR = round2(brokers * avgMonthlyBR);

    const rate =
      Array.isArray(customLevelRates) && customLevelRates[idx] !== undefined
        ? clamp(Math.max(0, toFiniteNumber(customLevelRates[idx], sched.rate)), 0, 25)
        : sched.rate;

    let unlocked = true;
    let lockReason = "";
    if (!ignoreQualificationGates) {
      if (sched.requiresCertified && !isCertified) {
        unlocked = false;
        lockReason = "Requires Certified Broker";
      } else if (sched.requiresQCB && !isQCB) {
        unlocked = false;
        lockReason = "Requires active QCB status";
      } else if (cleanFrontline < sched.minFrontlineQCBs) {
        unlocked = false;
        lockReason = `Requires ${sched.minFrontlineQCBs} frontline QCBs (${sched.minFrontlineQCBs - cleanFrontline} more)`;
      }
    }

    const monthlyPayout = unlocked ? round2(levelBR * (rate / 100)) : 0;
    totalDownlineBR = round2(totalDownlineBR + levelBR);
    totalFiveLevelCommission = round2(totalFiveLevelCommission + monthlyPayout);

    return {
      level: sched.level,
      label: sched.label,
      brokers,
      avgMonthlyBR,
      levelBR,
      rate,
      minFrontlineQCBs: sched.minFrontlineQCBs,
      unlocked,
      lockReason,
      monthlyPayout,
    };
  });

  const unlockedCount = levelResults.filter((l) => l.unlocked).length;

  return {
    frontlineQCBs: cleanFrontline,
    unlockedLevels: unlockedCount,
    totalDownlineBR,
    totalFiveLevelCommission,
    payoutLagMonths: plan.fiveLevelPayoutLagMonths,
    levels: levelResults,
  };
}

/**
 * Calculate 2-Generation Top-Tier Leadership Override (2% of Openline BR; Gen 3+ = $0).
 */
export function calculateLeadershipOverride({
  userEffectiveTier = 2,
  isQCB = true,
  gen1OpenlineBR = 0,
  gen2OpenlineBR = 0,
  gen3OpenlineBR = 0,
  plan = AGENCY_OVERRIDE_PLAN,
} = {}) {
  const cfg = plan.leadershipOverride;
  const eligible = Boolean(isQCB && userEffectiveTier >= cfg.requiredTier);
  const g1BR = clamp(Math.max(0, toFiniteNumber(gen1OpenlineBR, 0)), 0, 50000000);
  const g2BR = clamp(Math.max(0, toFiniteNumber(gen2OpenlineBR, 0)), 0, 50000000);
  const g3BR = clamp(Math.max(0, toFiniteNumber(gen3OpenlineBR, 0)), 0, 50000000);

  const gen1Payout = eligible ? round2(g1BR * (cfg.ratePercent / 100)) : 0;
  const gen2Payout = eligible ? round2(g2BR * (cfg.ratePercent / 100)) : 0;
  const gen3Payout = 0; // Hard-capped at 2 generations deep

  return {
    eligible,
    requiredTier: cfg.requiredTier,
    ratePercent: cfg.ratePercent,
    maxGenerations: cfg.maxGenerations,
    generations: [
      { generation: 1, label: "1st-Gen Top-Tier Leader", openlineBR: g1BR, ratePercent: eligible ? cfg.ratePercent : 0, payout: gen1Payout, capped: false },
      { generation: 2, label: "2nd-Gen Top-Tier Leader", openlineBR: g2BR, ratePercent: eligible ? cfg.ratePercent : 0, payout: gen2Payout, capped: false },
      { generation: 3, label: "3rd-Gen+ (Capped)", openlineBR: g3BR, ratePercent: 0, payout: gen3Payout, capped: true },
    ],
    totalLeadershipCommission: round2(gen1Payout + gen2Payout),
  };
}

/**
 * Determine active ISO Volume Bracket from monthly funded volume.
 */
export function determineIsoVolumeBracket(monthlyVolume, plan = ISO_VOLUME_SPLIT_PLAN) {
  const vol = Math.max(0, toFiniteNumber(monthlyVolume, 0));
  let active = plan.volumeBrackets[0];
  for (const b of plan.volumeBrackets) {
    const meetsMin = vol >= b.minMonthlyVolume;
    const meetsMax = b.maxMonthlyVolume === null ? true : vol <= b.maxMonthlyVolume;
    if (meetsMin && meetsMax) {
      active = b;
      break;
    }
    if (b.maxMonthlyVolume !== null && vol > b.maxMonthlyVolume) {
      active = b;
    }
  }
  return active;
}

/**
 * Validate and sanitize raw calculator inputs (including modular Pay-Plan & Agency settings).
 */
export function validateInputs(rawInputs = {}, config = COMMISSION_CONFIG) {
  const errors = [];
  const warnings = [];
  const limits = config.limits;
  const enabledProducts = config.products.filter((p) => p.enabled !== false);

  const payPlan = getPayPlanById(rawInputs.payPlanId || config.defaultAssumptions.payPlanId || DEFAULT_PAY_PLAN_ID);
  const operatingMode = rawInputs.operatingMode === "agency" ? "agency" : "solo";

  const rawDeals = rawInputs.monthlyDeals;
  if (rawDeals !== undefined && (Number.isNaN(Number(rawDeals)) || Number(rawDeals) < 0)) {
    errors.push("Monthly funded deals cannot be negative or invalid.");
  }
  const monthlyDeals = clamp(
    Math.max(0, toFiniteNumber(rawDeals, config.defaultAssumptions.monthlyDeals)),
    limits.minMonthlyDeals,
    limits.maxMonthlyDeals
  );

  const rawDealSize = rawInputs.averageDealSize;
  if (rawDealSize !== undefined && (Number.isNaN(Number(rawDealSize)) || Number(rawDealSize) < 0)) {
    errors.push("Average funded deal size must be a valid positive dollar amount.");
  }
  const averageDealSize = clamp(
    Math.max(0, toFiniteNumber(rawDealSize, config.defaultAssumptions.averageDealSize)),
    0,
    limits.maxDealSize
  );

  const allocationMode = rawInputs.allocationMode === "equal" ? "equal" : "custom";
  const sourceAllocations =
    allocationMode === "equal"
      ? getEqualAllocations(config)
      : rawInputs.allocations || getDefaultAllocations(config);

  const allocations = {};
  let allocationTotal = 0;
  for (const product of enabledProducts) {
    const val = toFiniteNumber(sourceAllocations[product.id], product.defaultAllocation);
    if (val < 0) {
      errors.push(`Allocation for ${product.name} cannot be negative.`);
    }
    const cleanVal = clamp(Math.max(0, val), 0, 100);
    allocations[product.id] = cleanVal;
    allocationTotal += cleanVal;
  }

  allocationTotal = round2(allocationTotal);
  const allocationValid = Math.abs(allocationTotal - 100) < 0.01;
  if (!allocationValid) {
    errors.push(`Product allocations must total 100% (currently ${allocationTotal.toFixed(1)}%).`);
  }

  // Per-product custom commission rates (%)
  const customRates = {};
  if (config.verificationStatus !== "VERIFIED PROGRAM MODE" && rawInputs.customRates && typeof rawInputs.customRates === "object") {
    for (const product of enabledProducts) {
      if (rawInputs.customRates[product.id] !== undefined && rawInputs.customRates[product.id] !== "") {
        const rawRate = Number(rawInputs.customRates[product.id]);
        if (Number.isNaN(rawRate) || rawRate < 0) {
          errors.push(`Commission rate for ${product.name} cannot be negative or invalid.`);
        }
        const r = toFiniteNumber(rawInputs.customRates[product.id], product.commissionRate);
        if (r > 25) {
          warnings.push(`Rate for ${product.name} clamped to 0%–25% illustrative range.`);
        }
        customRates[product.id] = clamp(Math.max(0, r), 0, 25);
      }
    }
  }

  // Per-product custom average funded deal sizes (USD)
  const customDealSizes = {};
  if (rawInputs.customDealSizes && typeof rawInputs.customDealSizes === "object") {
    for (const product of enabledProducts) {
      if (rawInputs.customDealSizes[product.id] !== undefined && rawInputs.customDealSizes[product.id] !== "") {
        const rawSize = Number(rawInputs.customDealSizes[product.id]);
        if (Number.isNaN(rawSize) || rawSize < 0) {
          errors.push(`Average deal size for ${product.name} cannot be negative or invalid.`);
        }
        const cleanSize = clamp(Math.max(0, toFiniteNumber(rawSize, averageDealSize)), 0, limits.maxDealSize);
        customDealSizes[product.id] = cleanSize;
      }
    }
  }

  const scenarioKey =
    rawInputs.scenario && Object.hasOwn(config.scenarios, rawInputs.scenario)
      ? rawInputs.scenario
      : config.defaultAssumptions.scenario;

  const customScenarioMultipliers = {
    conservative: clamp(
      toFiniteNumber(rawInputs.scenarioMultipliers?.conservative, config.scenarios.conservative.multiplier),
      0.1,
      3.0
    ),
    base: clamp(
      toFiniteNumber(rawInputs.scenarioMultipliers?.base, config.scenarios.base.multiplier),
      0.1,
      3.0
    ),
    optimistic: clamp(
      toFiniteNumber(rawInputs.scenarioMultipliers?.optimistic, config.scenarios.optimistic.multiplier),
      0.1,
      3.0
    ),
  };

  const monthlyGrowthRate = clamp(
    toFiniteNumber(rawInputs.monthlyGrowthRate, config.defaultAssumptions.monthlyGrowthRate),
    limits.minGrowthRate,
    limits.maxGrowthRate
  );

  const rampUpMonths = clamp(
    Math.round(toFiniteNumber(rawInputs.rampUpMonths, config.defaultAssumptions.rampUpMonths)),
    0,
    limits.maxRampUpMonths
  );

  const maxMonthlyCapacity = Math.max(
    0,
    toFiniteNumber(rawInputs.maxMonthlyCapacity, config.defaultAssumptions.maxMonthlyCapacity)
  );

  const customerRetentionRate = clamp(
    toFiniteNumber(rawInputs.customerRetentionRate, config.defaultAssumptions.customerRetentionRate),
    0,
    100
  );

  const rawExpenses = rawInputs.operatingExpenses;
  if (rawExpenses !== undefined && Number(rawExpenses) < 0) {
    errors.push("Operating expenses cannot be negative.");
  }
  const operatingExpenses = clamp(
    Math.max(0, toFiniteNumber(rawExpenses, config.defaultAssumptions.operatingExpenses)),
    0,
    limits.maxOperatingExpenses
  );

  const paymentDelayMonths = clamp(
    Math.round(toFiniteNumber(rawInputs.paymentDelayMonths, config.defaultAssumptions.paymentDelayMonths)),
    0,
    limits.maxPaymentDelayMonths
  );

  const projectionHorizon = config.projectionHorizons.includes(Number(rawInputs.projectionHorizon))
    ? Number(rawInputs.projectionHorizon)
    : config.defaultAssumptions.projectionHorizon;

  const enableBonuses = Boolean(rawInputs.enableBonuses && config.featureAvailability.qualifiedBonuses);
  const enableRecurring = Boolean(rawInputs.enableRecurring && config.featureAvailability.recurringCommissions);
  const enableCreditSubscription = Boolean(
    rawInputs.enableCreditSubscription && config.featureAvailability.businessCreditSubscriptionMode
  );
  const creditSubscriptionClientsPerMonth = Math.max(
    0,
    Math.round(toFiniteNumber(rawInputs.creditSubscriptionClientsPerMonth, 0))
  );

  const targetMonthlyIncome = Math.max(
    0,
    toFiniteNumber(rawInputs.targetMonthlyIncome, config.defaultAssumptions.targetMonthlyIncome)
  );

  // Sanitize Agency Override state
  const defAgency = createDefaultAgencyState();
  const rawAgency = rawInputs.agency || {};
  const customBRRates = {};
  if (rawAgency.customBRRates && typeof rawAgency.customBRRates === "object") {
    for (const product of enabledProducts) {
      if (rawAgency.customBRRates[product.id] !== undefined && rawAgency.customBRRates[product.id] !== "") {
        customBRRates[product.id] = clamp(
          Math.max(0, toFiniteNumber(rawAgency.customBRRates[product.id], product.defaultBRRate || 6)),
          0,
          30
        );
      }
    }
  }
  const agency = {
    startingTier: clamp(Math.round(toFiniteNumber(rawAgency.startingTier, defAgency.startingTier)), 1, 18),
    isCertified: rawAgency.isCertified !== undefined ? Boolean(rawAgency.isCertified) : defAgency.isCertified,
    isQCB: rawAgency.isQCB !== undefined ? Boolean(rawAgency.isQCB) : defAgency.isQCB,
    autoAdvanceLadder:
      rawAgency.autoAdvanceLadder !== undefined ? Boolean(rawAgency.autoAdvanceLadder) : defAgency.autoAdvanceLadder,
    uniqueClientRatioPercent: clamp(
      toFiniteNumber(rawAgency.uniqueClientRatioPercent, defAgency.uniqueClientRatioPercent),
      10,
      100
    ),
    frontlineQCBs: clamp(Math.round(Math.max(0, toFiniteNumber(rawAgency.frontlineQCBs, defAgency.frontlineQCBs))), 0, 500),
    customBRRates,
    spreadCohorts: Array.isArray(rawAgency.spreadCohorts)
      ? rawAgency.spreadCohorts.map((c, idx) => ({
          id: c.id || `cohort-${idx + 1}`,
          label: c.label || `Team Cohort ${idx + 1}`,
          activeBrokers: clamp(Math.max(0, toFiniteNumber(c.activeBrokers, 0)), 0, 500),
          avgMonthlyBR: clamp(Math.max(0, toFiniteNumber(c.avgMonthlyBR, 0)), 0, 1000000),
          brokerTierRate: clamp(toFiniteNumber(c.brokerTierRate, 40), 0, 80),
          intermediateManagerRate: clamp(toFiniteNumber(c.intermediateManagerRate, 0), 0, 80),
          intermediateIsQCB: c.intermediateIsQCB !== false,
        }))
      : defAgency.spreadCohorts,
    fiveLevels: Array.isArray(rawAgency.fiveLevels)
      ? [1, 2, 3, 4, 5].map((lvl, idx) => {
          const row = rawAgency.fiveLevels[idx] || {};
          return {
            level: lvl,
            brokers: clamp(Math.max(0, toFiniteNumber(row.brokers, defAgency.fiveLevels[idx].brokers)), 0, 1000),
            avgMonthlyBR: clamp(
              Math.max(0, toFiniteNumber(row.avgMonthlyBR, defAgency.fiveLevels[idx].avgMonthlyBR)),
              0,
              1000000
            ),
          };
        })
      : defAgency.fiveLevels,
    leadership: {
      gen1OpenlineBR: clamp(
        Math.max(0, toFiniteNumber(rawAgency.leadership?.gen1OpenlineBR, defAgency.leadership.gen1OpenlineBR)),
        0,
        50000000
      ),
      gen2OpenlineBR: clamp(
        Math.max(0, toFiniteNumber(rawAgency.leadership?.gen2OpenlineBR, defAgency.leadership.gen2OpenlineBR)),
        0,
        50000000
      ),
      gen3OpenlineBR: clamp(
        Math.max(0, toFiniteNumber(rawAgency.leadership?.gen3OpenlineBR, defAgency.leadership.gen3OpenlineBR)),
        0,
        50000000
      ),
    },
  };

  // Sanitize ISO Points Split state
  const defIso = createDefaultIsoState();
  const rawIso = rawInputs.iso || {};
  const iso = {
    markupPoints: clamp(Math.max(0, toFiniteNumber(rawIso.markupPoints, defIso.markupPoints)), 0, 20),
    subBrokerCount: clamp(Math.max(0, toFiniteNumber(rawIso.subBrokerCount, defIso.subBrokerCount)), 0, 500),
    subBrokerAvgMonthlyVolume: clamp(
      Math.max(0, toFiniteNumber(rawIso.subBrokerAvgMonthlyVolume, defIso.subBrokerAvgMonthlyVolume)),
      0,
      10000000
    ),
    subBrokerOverridePercent: clamp(
      Math.max(0, toFiniteNumber(rawIso.subBrokerOverridePercent, defIso.subBrokerOverridePercent)),
      0,
      10
    ),
  };

  // Sanitize Custom Partner Builder state
  const defCustom = createDefaultCustomPlanState();
  const rawCustom = rawInputs.customPlan || {};
  const validBaseTypes = ["direct-percent", "bonus-revenue", "points-markup"];
  const customPlan = {
    baseType: validBaseTypes.includes(rawCustom.baseType) ? rawCustom.baseType : defCustom.baseType,
    personalSplitPercent: clamp(
      Math.max(0, toFiniteNumber(rawCustom.personalSplitPercent, defCustom.personalSplitPercent)),
      0,
      100
    ),
    markupPoints: clamp(Math.max(0, toFiniteNumber(rawCustom.markupPoints, defCustom.markupPoints)), 0, 20),
    bonusRevenuePercent: clamp(
      Math.max(0, toFiniteNumber(rawCustom.bonusRevenuePercent, defCustom.bonusRevenuePercent)),
      0,
      30
    ),
    spreadOverridePercent: clamp(
      Math.max(0, toFiniteNumber(rawCustom.spreadOverridePercent, defCustom.spreadOverridePercent)),
      0,
      50
    ),
    levelRates: [0, 1, 2, 3, 4].map((idx) =>
      clamp(
        Math.max(0, toFiniteNumber(rawCustom.levelRates?.[idx], defCustom.levelRates[idx])),
        0,
        25
      )
    ),
  };

  return {
    isValid: errors.length === 0,
    allocationValid,
    allocationTotal,
    errors,
    warnings,
    sanitized: {
      payPlanId: payPlan.id,
      operatingMode,
      monthlyDeals,
      averageDealSize,
      allocationMode,
      allocations,
      customRates,
      customDealSizes,
      scenario: scenarioKey,
      scenarioMultipliers: customScenarioMultipliers,
      monthlyGrowthRate,
      rampUpMonths,
      maxMonthlyCapacity,
      customerRetentionRate,
      operatingExpenses,
      paymentDelayMonths,
      projectionHorizon,
      enableBonuses,
      enableRecurring,
      enableCreditSubscription,
      creditSubscriptionClientsPerMonth,
      targetMonthlyIncome,
      agency,
      iso,
      customPlan,
    },
  };
}

/**
 * Determine partner tier using non-overlapping configured thresholds (Direct Rate Plan).
 */
export function determinePartnerTier(monthlyDeals, config = COMMISSION_CONFIG) {
  const deals = Math.max(0, toFiniteNumber(monthlyDeals, 0));
  const tiers = config.tiers;
  let currentTierIndex = 0;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const meetsMin = deals >= tier.minDeals;
    const meetsMax = tier.maxDeals === null ? true : deals <= tier.maxDeals;
    if (meetsMin && meetsMax) {
      currentTierIndex = i;
      break;
    }
    if (tier.maxDeals !== null && deals > tier.maxDeals) {
      currentTierIndex = Math.min(i + 1, tiers.length - 1);
    }
  }

  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1] || null;
  const dealsNeededForNextTier = nextTier ? Math.max(0, Math.ceil(nextTier.minDeals - deals)) : 0;

  return {
    currentTier,
    nextTier,
    dealsNeededForNextTier,
    tiersWithStatus: tiers.map((tier, idx) => ({
      ...tier,
      isCurrent: idx === currentTierIndex,
      isAchieved: idx <= currentTierIndex,
    })),
  };
}

/**
 * Calculate single-month product-level deal commission breakdown.
 * Supports Direct Rate, Agency Override (BR × Ladder Split), ISO Points × Volume Split, and Custom Partner modes.
 */
export function calculateMonthlyDealBreakdown(
  dealsCount,
  averageDealSize,
  allocations,
  customRates = {},
  tierRateBonus = 0,
  config = COMMISSION_CONFIG,
  customDealSizes = {},
  planContext = null
) {
  const enabledProducts = config.products.filter((p) => p.enabled !== false);
  const rawTotal = enabledProducts.reduce((sum, p) => sum + (allocations[p.id] ?? p.defaultAllocation), 0);
  const payPlanId = planContext?.payPlanId || "direct-rate";

  // Pre-compute total funded volume if needed for ISO monthly volume bracket lookup
  let preVolume = 0;
  for (const product of enabledProducts) {
    const rawPct = allocations[product.id] ?? product.defaultAllocation;
    const effPct = rawTotal > 0 ? (rawPct / rawTotal) * 100 : 0;
    const pDeals = dealsCount * (effPct / 100);
    const pSize = customDealSizes[product.id] !== undefined ? customDealSizes[product.id] : averageDealSize;
    preVolume += pDeals * pSize;
  }

  const isoBracket =
    payPlanId === "iso-volume-split" ? determineIsoVolumeBracket(preVolume, ISO_VOLUME_SPLIT_PLAN) : null;

  let totalFundedVolume = 0;
  let totalBonusRevenue = 0;
  let totalDealCommission = 0;

  const productResults = enabledProducts.map((product) => {
    const rawPct = allocations[product.id] ?? product.defaultAllocation;
    const effectiveAllocationPct = rawTotal > 0 ? (rawPct / rawTotal) * 100 : 0;
    const allocatedDeals = dealsCount * (effectiveAllocationPct / 100);
    const productDealSize =
      customDealSizes[product.id] !== undefined ? customDealSizes[product.id] : averageDealSize;
    const eligibleFundedVolume = allocatedDeals * productDealSize;

    const baseRate = customRates[product.id] !== undefined ? customRates[product.id] : product.commissionRate;
    let applicableRate = baseRate + (tierRateBonus || 0);
    let bonusRevenueRate = 0;
    let bonusRevenue = 0;
    let grossCommission = 0;

    if (payPlanId === "agency-override") {
      const customBR = planContext?.customBRRates?.[product.id];
      bonusRevenueRate =
        customBR !== undefined
          ? customBR
          : AGENCY_OVERRIDE_PLAN.defaultProductBRRates[product.id] ?? product.defaultBRRate ?? 6.0;
      bonusRevenue = eligibleFundedVolume * (bonusRevenueRate / 100);
      const personalSplitPct = planContext?.personalSplitPercent ?? 40;
      grossCommission = bonusRevenue * (personalSplitPct / 100);
      applicableRate = (bonusRevenueRate * personalSplitPct) / 100;
    } else if (payPlanId === "iso-volume-split") {
      const points = planContext?.iso?.markupPoints ?? ISO_VOLUME_SPLIT_PLAN.defaultMarkupPoints;
      const splitPct = isoBracket ? isoBracket.brokerSplitPercent : 60;
      bonusRevenueRate = points;
      bonusRevenue = eligibleFundedVolume * (points / 100);
      grossCommission = bonusRevenue * (splitPct / 100);
      applicableRate = (points * splitPct) / 100;
    } else if (payPlanId === "custom-partner") {
      const cp = planContext?.customPlan || createDefaultCustomPlanState();
      if (cp.baseType === "direct-percent") {
        grossCommission =
          product.compensationMethod === "fixed"
            ? allocatedDeals * toFiniteNumber(product.fixedFee, 0)
            : eligibleFundedVolume * (applicableRate / 100);
      } else if (cp.baseType === "bonus-revenue") {
        const customBR = planContext?.customBRRates?.[product.id];
        bonusRevenueRate = customBR !== undefined ? customBR : cp.bonusRevenuePercent;
        bonusRevenue = eligibleFundedVolume * (bonusRevenueRate / 100);
        grossCommission = bonusRevenue * (cp.personalSplitPercent / 100);
        applicableRate = (bonusRevenueRate * cp.personalSplitPercent) / 100;
      } else {
        // points-markup
        bonusRevenueRate = cp.markupPoints;
        bonusRevenue = eligibleFundedVolume * (cp.markupPoints / 100);
        grossCommission = bonusRevenue * (cp.personalSplitPercent / 100);
        applicableRate = (cp.markupPoints * cp.personalSplitPercent) / 100;
      }
    } else {
      // Clean default: Direct Product Rate Plan
      if (product.compensationMethod === "fixed") {
        grossCommission = allocatedDeals * toFiniteNumber(product.fixedFee, 0);
      } else {
        grossCommission = eligibleFundedVolume * (applicableRate / 100);
      }
    }

    totalFundedVolume += eligibleFundedVolume;
    totalBonusRevenue += bonusRevenue;
    totalDealCommission += grossCommission;

    return {
      productId: product.id,
      productName: product.name,
      shortName: product.shortName || product.name,
      compensationMethod: product.compensationMethod,
      commissionableBasis: product.commissionableBasis,
      allocationPercentage: round2(rawPct),
      effectiveAllocationPercentage: round2(effectiveAllocationPct),
      allocatedDeals: round2(allocatedDeals),
      dealSize: round2(productDealSize),
      hasCustomDealSize: customDealSizes[product.id] !== undefined,
      fundedVolume: round2(eligibleFundedVolume),
      bonusRevenueRate: round2(bonusRevenueRate),
      bonusRevenue: round2(bonusRevenue),
      commissionRate: round2(applicableRate),
      hasCustomRate: customRates[product.id] !== undefined,
      fixedFee: round2(product.fixedFee || 0),
      grossCommission: round2(grossCommission),
    };
  });

  const weightedAverageDealSize = dealsCount > 0 ? round2(totalFundedVolume / dealsCount) : round2(averageDealSize);

  return {
    productResults,
    totalFundedVolume: round2(totalFundedVolume),
    totalBonusRevenue: round2(totalBonusRevenue),
    totalDealCommission: round2(totalDealCommission),
    weightedAverageDealSize,
    isoBracket,
  };
}

/**
 * Compute qualified bonus for a given month (only when explicitly enabled).
 */
export function calculateQualifiedBonus(dealsCount, fundedVolume, enableBonuses, config = COMMISSION_CONFIG) {
  if (!enableBonuses || !config.bonusRules.availableInConfig) return 0;
  if (dealsCount <= 0 || fundedVolume <= 0) return 0;
  const qualifiesVolume = fundedVolume >= config.bonusRules.minMonthlyVolume;
  const qualifiesDeals = dealsCount >= config.bonusRules.minMonthlyDeals;
  if (!qualifiesVolume || !qualifiesDeals) return 0;
  return round2(fundedVolume * (config.bonusRules.bonusPercentOfVolume / 100));
}

/**
 * Compute team/agency override streams for a given month based on active pay plan and operating mode.
 */
function computeMonthlyOverrides({ inputs, payPlanId, ladderEval, teamGrowthFactor = 1 }) {
  const isAgency = inputs.operatingMode === "agency";
  if (!isAgency || payPlanId === "direct-rate") {
    return {
      overrideSpread: 0,
      fiveLevel: 0,
      leadership: 0,
      isoSubBroker: 0,
      totalOverrides: 0,
      dailyOverrides: 0,
      monthlyLaggedOverrides: 0,
      spreadDetail: null,
      fiveLevelDetail: null,
      leadershipDetail: null,
      isoSubBrokerDetail: null,
    };
  }

  const scaledCohorts = inputs.agency.spreadCohorts.map((c) => ({
    ...c,
    avgMonthlyBR: round2(c.avgMonthlyBR * teamGrowthFactor),
  }));
  const scaledLevels = inputs.agency.fiveLevels.map((l) => ({
    ...l,
    avgMonthlyBR: round2(l.avgMonthlyBR * teamGrowthFactor),
  }));

  if (payPlanId === "agency-override") {
    const spreadDetail = calculateOverrideSpreads({
      userEffectiveRate: ladderEval.effectiveTier.rate,
      isQCB: ladderEval.overridesEligible,
      cohorts: scaledCohorts,
    });
    const fiveLevelDetail = calculateFiveLevelPay({
      isCertified: inputs.agency.isCertified,
      isQCB: inputs.agency.isQCB,
      frontlineQCBs: inputs.agency.frontlineQCBs,
      levels: scaledLevels,
      plan: AGENCY_OVERRIDE_PLAN,
    });
    const leadershipDetail = calculateLeadershipOverride({
      userEffectiveTier: ladderEval.effectiveTier.tier,
      isQCB: ladderEval.overridesEligible,
      gen1OpenlineBR: round2(inputs.agency.leadership.gen1OpenlineBR * teamGrowthFactor),
      gen2OpenlineBR: round2(inputs.agency.leadership.gen2OpenlineBR * teamGrowthFactor),
      gen3OpenlineBR: round2(inputs.agency.leadership.gen3OpenlineBR * teamGrowthFactor),
      plan: AGENCY_OVERRIDE_PLAN,
    });

    const dailyOverrides = round2(spreadDetail.totalSpreadCommission + leadershipDetail.totalLeadershipCommission);
    const monthlyLaggedOverrides = fiveLevelDetail.totalFiveLevelCommission;

    return {
      overrideSpread: spreadDetail.totalSpreadCommission,
      fiveLevel: fiveLevelDetail.totalFiveLevelCommission,
      leadership: leadershipDetail.totalLeadershipCommission,
      isoSubBroker: 0,
      totalOverrides: round2(dailyOverrides + monthlyLaggedOverrides),
      dailyOverrides,
      monthlyLaggedOverrides,
      spreadDetail,
      fiveLevelDetail,
      leadershipDetail,
      isoSubBrokerDetail: null,
    };
  }

  if (payPlanId === "iso-volume-split") {
    const subBrokerTotalVol = round2(
      inputs.iso.subBrokerCount * inputs.iso.subBrokerAvgMonthlyVolume * teamGrowthFactor
    );
    const isoSubBroker = round2(subBrokerTotalVol * (inputs.iso.subBrokerOverridePercent / 100));
    return {
      overrideSpread: 0,
      fiveLevel: 0,
      leadership: 0,
      isoSubBroker,
      totalOverrides: isoSubBroker,
      dailyOverrides: isoSubBroker,
      monthlyLaggedOverrides: 0,
      spreadDetail: null,
      fiveLevelDetail: null,
      leadershipDetail: null,
      isoSubBrokerDetail: {
        subBrokerCount: inputs.iso.subBrokerCount,
        subBrokerTotalVolume: subBrokerTotalVol,
        overridePercent: inputs.iso.subBrokerOverridePercent,
        monthlyOverride: isoSubBroker,
      },
    };
  }

  if (payPlanId === "custom-partner") {
    const spreadDetail = calculateOverrideSpreads({
      userEffectiveRate: inputs.customPlan.personalSplitPercent,
      isQCB: true,
      cohorts: scaledCohorts,
      overrideFixedSpreadPercent: inputs.customPlan.spreadOverridePercent,
    });
    const fiveLevelDetail = calculateFiveLevelPay({
      isCertified: true,
      isQCB: true,
      frontlineQCBs: 20,
      levels: scaledLevels,
      customLevelRates: inputs.customPlan.levelRates,
      ignoreQualificationGates: true,
      plan: AGENCY_OVERRIDE_PLAN,
    });

    const dailyOverrides = spreadDetail.totalSpreadCommission;
    const monthlyLaggedOverrides = fiveLevelDetail.totalFiveLevelCommission;

    return {
      overrideSpread: spreadDetail.totalSpreadCommission,
      fiveLevel: fiveLevelDetail.totalFiveLevelCommission,
      leadership: 0,
      isoSubBroker: 0,
      totalOverrides: round2(dailyOverrides + monthlyLaggedOverrides),
      dailyOverrides,
      monthlyLaggedOverrides,
      spreadDetail,
      fiveLevelDetail,
      leadershipDetail: null,
      isoSubBrokerDetail: null,
    };
  }

  return {
    overrideSpread: 0,
    fiveLevel: 0,
    leadership: 0,
    isoSubBroker: 0,
    totalOverrides: 0,
    dailyOverrides: 0,
    monthlyLaggedOverrides: 0,
    spreadDetail: null,
    fiveLevelDetail: null,
    leadershipDetail: null,
    isoSubBrokerDetail: null,
  };
}

/**
 * Main deterministic calculation entry point.
 */
export function calculateCommissions(rawInputs = {}, config = COMMISSION_CONFIG) {
  const validation = validateInputs(rawInputs, config);
  const inputs = validation.sanitized;
  const activePlan = getPayPlanById(inputs.payPlanId);

  const scenarioMultiplier = inputs.scenarioMultipliers[inputs.scenario] ?? 1.0;
  const modeledMonthlyDeals = inputs.monthlyDeals * scenarioMultiplier;

  const tierInfo = determinePartnerTier(modeledMonthlyDeals, config);
  const tierRateBonus = inputs.payPlanId === "direct-rate" ? tierInfo.currentTier.tierRateBonus || 0 : 0;

  // Initial Agency Ladder state entering Month 1
  const startTierRow =
    AGENCY_OVERRIDE_PLAN.performanceLadder[inputs.agency.startingTier - 1] || AGENCY_OVERRIDE_PLAN.performanceLadder[1];
  const initialLadderEval = evaluateAgencyLadderTier({
    cumulativeClients: startTierRow.minClients,
    cumulativeTPBR: startTierRow.minTPBR,
    startingTier: inputs.agency.startingTier,
    isCertified: inputs.agency.isCertified,
    isQCB: inputs.agency.isQCB,
    autoAdvanceLadder: inputs.agency.autoAdvanceLadder,
    plan: AGENCY_OVERRIDE_PLAN,
  });

  const basePlanContext = {
    payPlanId: inputs.payPlanId,
    personalSplitPercent: initialLadderEval.effectiveTier.rate,
    customBRRates: inputs.agency.customBRRates,
    iso: inputs.iso,
    customPlan: inputs.customPlan,
  };

  const breakdown = calculateMonthlyDealBreakdown(
    modeledMonthlyDeals,
    inputs.averageDealSize,
    inputs.allocations,
    inputs.customRates,
    tierRateBonus,
    config,
    inputs.customDealSizes,
    basePlanContext
  );

  const creditProduct = config.products.find((p) => p.id === "business-credit");
  const creditMonthlyFee = creditProduct?.subscriptionMonthlyFee || 0;
  const steadyCreditSubscriptionCommission = inputs.enableCreditSubscription
    ? round2(inputs.creditSubscriptionClientsPerMonth * creditMonthlyFee)
    : 0;

  const monthlyQualifiedBonus = calculateQualifiedBonus(
    modeledMonthlyDeals,
    breakdown.totalFundedVolume,
    inputs.enableBonuses,
    config
  );

  const month1Overrides = computeMonthlyOverrides({
    inputs,
    payPlanId: inputs.payPlanId,
    ladderEval: initialLadderEval,
    teamGrowthFactor: 1,
  });

  const monthlyTrailRate = (config.recurringRules.annualizedTrailRatePercent || 0) / 100;
  const monthlyRetentionFactor = Math.pow(inputs.customerRetentionRate / 100, 1 / 12);

  const personalMonthlyCommission = round2(
    breakdown.totalDealCommission + steadyCreditSubscriptionCommission + monthlyQualifiedBonus
  );

  const monthlyGrossCommission = round2(personalMonthlyCommission + month1Overrides.totalOverrides);
  const annualizedGrossCommission = round2(monthlyGrossCommission * 12);

  const effectiveCommissionRatePercent =
    breakdown.totalFundedVolume > 0
      ? round2((breakdown.totalDealCommission / breakdown.totalFundedVolume) * 100)
      : 0;

  // 36-Month Deterministic Projection Engine (including 18-tier auto-advancement & 5-level 1-month payout lag)
  const growthDecimal = inputs.monthlyGrowthRate / 100;
  const dailyEarnedQueue = [];
  const fiveLevelEarnedQueue = [];
  const projections36 = [];

  let cumulativeEarned = 0;
  let cumulativeReceipts = 0;
  let cumulativeOperatingIncome = 0;
  let activeRetainedVolume = 0;
  let activeCreditSubscribers = 0;

  // Rolling cumulative personal stats for Agency 18-Tier Ladder Auto-Advancement
  let runningClients = startTierRow.minClients;
  let runningTPBR = startTierRow.minTPBR;
  const uniqueRatio = inputs.agency.uniqueClientRatioPercent / 100;
  let month12LadderEval = initialLadderEval;
  let month36LadderEval = initialLadderEval;

  for (let m = 1; m <= 36; m++) {
    let projectedDeals = modeledMonthlyDeals * Math.pow(1 + growthDecimal, m - 1);
    if (inputs.rampUpMonths > 0 && m <= inputs.rampUpMonths) {
      projectedDeals = projectedDeals * (m / inputs.rampUpMonths);
    }
    if (inputs.maxMonthlyCapacity > 0) {
      projectedDeals = Math.min(projectedDeals, inputs.maxMonthlyCapacity);
    }
    projectedDeals = Math.max(0, projectedDeals);

    // Evaluate ladder entering Month m (advancement earned in Month m applies to Month m+1 per pay plan rules)
    const monthLadderEval = evaluateAgencyLadderTier({
      cumulativeClients: runningClients,
      cumulativeTPBR: runningTPBR,
      startingTier: inputs.agency.startingTier,
      isCertified: inputs.agency.isCertified,
      isQCB: inputs.agency.isQCB,
      autoAdvanceLadder: inputs.agency.autoAdvanceLadder,
      plan: AGENCY_OVERRIDE_PLAN,
    });

    const monthTier = determinePartnerTier(projectedDeals, config).currentTier;
    const monthPlanContext = {
      payPlanId: inputs.payPlanId,
      personalSplitPercent: monthLadderEval.effectiveTier.rate,
      customBRRates: inputs.agency.customBRRates,
      iso: inputs.iso,
      customPlan: inputs.customPlan,
    };

    const monthBreakdown = calculateMonthlyDealBreakdown(
      projectedDeals,
      inputs.averageDealSize,
      inputs.allocations,
      inputs.customRates,
      inputs.payPlanId === "direct-rate" ? monthTier.tierRateBonus || 0 : 0,
      config,
      inputs.customDealSizes,
      monthPlanContext
    );

    const monthBonus = calculateQualifiedBonus(
      projectedDeals,
      monthBreakdown.totalFundedVolume,
      inputs.enableBonuses,
      config
    );

    let monthRecurring = 0;
    if (inputs.enableRecurring && activeRetainedVolume > 0) {
      monthRecurring = round2(activeRetainedVolume * monthlyTrailRate);
    }
    activeRetainedVolume = activeRetainedVolume * monthlyRetentionFactor + monthBreakdown.totalFundedVolume;

    let monthCreditSub = 0;
    if (inputs.enableCreditSubscription && inputs.creditSubscriptionClientsPerMonth > 0) {
      activeCreditSubscribers =
        activeCreditSubscribers * monthlyRetentionFactor + inputs.creditSubscriptionClientsPerMonth;
      monthCreditSub = round2(activeCreditSubscribers * creditMonthlyFee);
    }

    const teamGrowthFactor = Math.pow(1 + growthDecimal, m - 1);
    const monthOverrides = computeMonthlyOverrides({
      inputs,
      payPlanId: inputs.payPlanId,
      ladderEval: monthLadderEval,
      teamGrowthFactor,
    });

    const dailyEarnedThisMonth = round2(
      monthBreakdown.totalDealCommission +
        monthBonus +
        monthRecurring +
        monthCreditSub +
        monthOverrides.dailyOverrides
    );
    const fiveLevelEarnedThisMonth = monthOverrides.monthlyLaggedOverrides;
    const commissionsEarned = round2(dailyEarnedThisMonth + fiveLevelEarnedThisMonth);

    dailyEarnedQueue.push(dailyEarnedThisMonth);
    fiveLevelEarnedQueue.push(fiveLevelEarnedThisMonth);

    const dailyReceiptIndex = m - 1 - inputs.paymentDelayMonths;
    const dailyReceipts = dailyReceiptIndex >= 0 ? dailyEarnedQueue[dailyReceiptIndex] : 0;

    // 5-Level Agency Pay is calculated on prior month BR and paid on the 15th of the following month (+1 mo lag)
    const fiveLevelLag = AGENCY_OVERRIDE_PLAN.fiveLevelPayoutLagMonths + inputs.paymentDelayMonths;
    const fiveLevelReceiptIndex = m - 1 - fiveLevelLag;
    const fiveLevelReceipts = fiveLevelReceiptIndex >= 0 ? fiveLevelEarnedQueue[fiveLevelReceiptIndex] : 0;

    const commissionReceipts = round2(dailyReceipts + fiveLevelReceipts);
    const estimatedPreTaxOperatingIncome = round2(commissionReceipts - inputs.operatingExpenses);

    cumulativeEarned = round2(cumulativeEarned + commissionsEarned);
    cumulativeReceipts = round2(cumulativeReceipts + commissionReceipts);
    cumulativeOperatingIncome = round2(cumulativeOperatingIncome + estimatedPreTaxOperatingIncome);

    // Advance cumulative personal unique clients & TPBR after Month m funding completes
    runningClients = round2(runningClients + projectedDeals * uniqueRatio);
    runningTPBR = round2(runningTPBR + monthBreakdown.totalBonusRevenue);

    if (m === 12) {
      month12LadderEval = evaluateAgencyLadderTier({
        cumulativeClients: runningClients,
        cumulativeTPBR: runningTPBR,
        startingTier: inputs.agency.startingTier,
        isCertified: inputs.agency.isCertified,
        isQCB: inputs.agency.isQCB,
        autoAdvanceLadder: inputs.agency.autoAdvanceLadder,
        plan: AGENCY_OVERRIDE_PLAN,
      });
    }
    if (m === 36) {
      month36LadderEval = evaluateAgencyLadderTier({
        cumulativeClients: runningClients,
        cumulativeTPBR: runningTPBR,
        startingTier: inputs.agency.startingTier,
        isCertified: inputs.agency.isCertified,
        isQCB: inputs.agency.isQCB,
        autoAdvanceLadder: inputs.agency.autoAdvanceLadder,
        plan: AGENCY_OVERRIDE_PLAN,
      });
    }

    const displayTierName =
      inputs.payPlanId === "agency-override"
        ? `T${monthLadderEval.effectiveTier.tier} ${monthLadderEval.effectiveTier.code} (${monthLadderEval.effectiveTier.rate}%)`
        : inputs.payPlanId === "iso-volume-split"
          ? `${monthBreakdown.isoBracket?.name || "Base ISO"} (${monthBreakdown.isoBracket?.brokerSplitPercent || 60}%)`
          : inputs.payPlanId === "custom-partner"
            ? `Custom (${inputs.customPlan.personalSplitPercent}%)`
            : monthTier.name;

    projections36.push({
      month: m,
      deals: round2(projectedDeals),
      fundedVolume: monthBreakdown.totalFundedVolume,
      personalBonusRevenue: monthBreakdown.totalBonusRevenue,
      dealCommission: monthBreakdown.totalDealCommission,
      overrideSpreadCommission: monthOverrides.overrideSpread,
      fiveLevelCommission: monthOverrides.fiveLevel,
      leadershipCommission: monthOverrides.leadership,
      isoSubBrokerCommission: monthOverrides.isoSubBroker,
      totalOverrideCommission: monthOverrides.totalOverrides,
      recurringCommission: monthRecurring,
      qualifiedBonus: monthBonus,
      creditSubscriptionCommission: monthCreditSub,
      commissionsEarned,
      commissionReceipts,
      operatingExpenses: round2(inputs.operatingExpenses),
      estimatedPreTaxOperatingIncome,
      cumulativeEarned,
      cumulativeReceipts,
      cumulativeOperatingIncome,
      tierName: displayTierName,
      ladderTierNumber: monthLadderEval.effectiveTier.tier,
      ladderRate: monthLadderEval.effectiveTier.rate,
    });
  }

  const projections12 = projections36.slice(0, 12);
  const projections24 = projections36.slice(0, 24);

  const firstYearCumulativeEarned = round2(projections12.reduce((s, r) => s + r.commissionsEarned, 0));
  const firstYearCumulativeReceipts = round2(projections12.reduce((s, r) => s + r.commissionReceipts, 0));
  const twentyFourMonthCumulativeEarned = round2(projections24.reduce((s, r) => s + r.commissionsEarned, 0));
  const threeYearCumulativeEarned = round2(projections36.reduce((s, r) => s + r.commissionsEarned, 0));
  const threeYearCumulativeReceipts = round2(projections36.reduce((s, r) => s + r.commissionReceipts, 0));
  const firstYearNetOperatingIncome = round2(
    projections12.reduce((s, r) => s + r.estimatedPreTaxOperatingIncome, 0)
  );

  const month1 = projections36[0];
  const monthlyNetOperatingIncome = round2(monthlyGrossCommission - inputs.operatingExpenses);

  // Income Target Reverse Calculation (accounting for active pay plan & steady overrides)
  const unitDealBreakdown = calculateMonthlyDealBreakdown(
    1,
    inputs.averageDealSize,
    inputs.allocations,
    inputs.customRates,
    tierRateBonus,
    config,
    inputs.customDealSizes,
    basePlanContext
  );
  const commissionPerDeal = unitDealBreakdown.totalDealCommission;
  const weightedDealSizePerUnit = unitDealBreakdown.totalFundedVolume;
  const targetRemainingAfterOther = Math.max(
    0,
    inputs.targetMonthlyIncome - steadyCreditSubscriptionCommission - month1Overrides.totalOverrides
  );
  const dealsForTargetIncome =
    commissionPerDeal > 0 && targetRemainingAfterOther > 0
      ? Math.ceil(targetRemainingAfterOther / commissionPerDeal)
      : 0;
  const exactDealsForTargetIncome =
    commissionPerDeal > 0 && targetRemainingAfterOther > 0
      ? round2(targetRemainingAfterOther / commissionPerDeal)
      : 0;
  const volumeForTargetIncome = round2(dealsForTargetIncome * weightedDealSizePerUnit);
  const targetGapMonthly = round2(monthlyGrossCommission - inputs.targetMonthlyIncome);
  const targetAttainmentPercent =
    inputs.targetMonthlyIncome > 0
      ? round2((monthlyGrossCommission / inputs.targetMonthlyIncome) * 100)
      : 100;

  // Unified display tier summary
  const activeTierDisplay =
    inputs.payPlanId === "agency-override"
      ? {
          name: `Tier ${initialLadderEval.effectiveTier.tier} · ${initialLadderEval.effectiveTier.code} (${initialLadderEval.effectiveTier.rate}%)`,
          summary: initialLadderEval.qcbDropped
            ? `Temporarily reduced from Tier ${initialLadderEval.earnedTier.tier} (${initialLadderEval.earnedTier.rate}%) while QCB is inactive.`
            : `${initialLadderEval.effectiveTier.title} — ${initialLadderEval.effectiveTier.qualification}`,
        }
      : inputs.payPlanId === "iso-volume-split"
        ? {
            name: `${breakdown.isoBracket?.name || "Base ISO"} (${breakdown.isoBracket?.brokerSplitPercent || 60}% Split)`,
            summary: `${inputs.iso.markupPoints} pts markup × ${breakdown.isoBracket?.brokerSplitPercent || 60}% broker split on monthly funded volume.`,
          }
        : inputs.payPlanId === "custom-partner"
          ? {
              name: `Custom Split (${inputs.customPlan.personalSplitPercent}%)`,
              summary: `Custom partner model (${inputs.customPlan.baseType}).`,
            }
          : {
              name: tierInfo.currentTier.name,
              summary: tierInfo.currentTier.summary,
            };

  return {
    meta: {
      programName: config.programName,
      version: config.version,
      effectiveDate: config.effectiveDate,
      verificationStatus: config.verificationStatus,
      approvedSourceReference: config.approvedSourceReference,
      currency: config.currency,
      payPlanId: activePlan.id,
      payPlanName: activePlan.name,
      payPlanShortName: activePlan.shortName,
      operatingMode: inputs.operatingMode,
    },
    payPlan: activePlan,
    validation,
    inputs,
    scenario: {
      id: inputs.scenario,
      label: config.scenarios[inputs.scenario].label,
      multiplier: scenarioMultiplier,
    },
    modeledMonthlyDeals: round2(modeledMonthlyDeals),
    weightedAverageDealSize: breakdown.weightedAverageDealSize,
    totalMonthlyFundedVolume: breakdown.totalFundedVolume,
    totalMonthlyPersonalBR: breakdown.totalBonusRevenue,
    effectiveCommissionRatePercent,
    dealBasedMonthlyCommission: breakdown.totalDealCommission,
    creditSubscriptionMonthlyCommission: steadyCreditSubscriptionCommission,
    monthlyQualifiedBonus,
    personalMonthlyCommission,
    commissionStreams: {
      personal: personalMonthlyCommission,
      overrideSpread: month1Overrides.overrideSpread,
      fiveLevel: month1Overrides.fiveLevel,
      leadership: month1Overrides.leadership,
      isoSubBroker: month1Overrides.isoSubBroker,
      totalOverrides: month1Overrides.totalOverrides,
    },
    agencySummary: {
      enabled: inputs.operatingMode === "agency" && inputs.payPlanId !== "direct-rate",
      ladder: initialLadderEval,
      month12Ladder: month12LadderEval,
      month36Ladder: month36LadderEval,
      spread: month1Overrides.spreadDetail,
      fiveLevel: month1Overrides.fiveLevelDetail,
      leadership: month1Overrides.leadershipDetail,
      isoBracket: breakdown.isoBracket,
      isoSubBroker: month1Overrides.isoSubBrokerDetail,
    },
    monthlyGrossCommission,
    month1CommissionReceipts: month1 ? month1.commissionReceipts : 0,
    monthlyOperatingExpenses: round2(inputs.operatingExpenses),
    monthlyNetOperatingIncome,
    annualizedGrossCommission,
    firstYearCumulativeCommission: firstYearCumulativeEarned,
    firstYearCumulativeReceipts,
    firstYearNetOperatingIncome,
    twentyFourMonthCumulativeCommission: twentyFourMonthCumulativeEarned,
    threeYearCumulativeCommission: threeYearCumulativeEarned,
    threeYearCumulativeReceipts,
    productResults: breakdown.productResults,
    tier: {
      ...tierInfo,
      activeDisplay: activeTierDisplay,
    },
    projections12,
    projections24,
    projections36,
    incomeTarget: {
      targetMonthlyIncome: round2(inputs.targetMonthlyIncome),
      commissionPerDeal: round2(commissionPerDeal),
      dealsNeeded: dealsForTargetIncome,
      exactDealsNeeded: exactDealsForTargetIncome,
      volumeNeeded: volumeForTargetIncome,
      monthlyGap: targetGapMonthly,
      attainmentPercent: targetAttainmentPercent,
      isTargetMet: monthlyGrossCommission >= inputs.targetMonthlyIncome && inputs.targetMonthlyIncome > 0,
    },
  };
}

export function calculateAllScenarios(rawInputs = {}, config = COMMISSION_CONFIG) {
  const keys = ["conservative", "base", "optimistic"];
  const map = {};
  for (const key of keys) {
    map[key] = calculateCommissions({ ...rawInputs, scenario: key }, config);
  }
  return map;
}

/**
 * Compare the broker's current deal flow across all configured funding partner pay plans side-by-side.
 */
export function calculatePlanComparison(rawInputs = {}, config = COMMISSION_CONFIG) {
  return PAY_PLAN_LIST.map((plan) => {
    const res = calculateCommissions(
      {
        ...rawInputs,
        payPlanId: plan.id,
        operatingMode: plan.id === "direct-rate" ? "solo" : rawInputs.operatingMode || "solo",
      },
      config
    );
    return {
      planId: plan.id,
      planName: plan.name,
      shortName: plan.shortName,
      badge: plan.badge,
      monthlyPersonal: res.personalMonthlyCommission,
      monthlyOverrides: res.commissionStreams.totalOverrides,
      monthlyGross: res.monthlyGrossCommission,
      firstYearCumulative: res.firstYearCumulativeCommission,
      threeYearCumulative: res.threeYearCumulativeCommission,
      effectiveRatePercent: res.effectiveCommissionRatePercent,
      tierLabel: res.tier.activeDisplay.name,
    };
  });
}

export function formatCurrency(value, compact = false) {
  const num = Number.isFinite(Number(value)) ? Number(value) : 0;
  if (compact && Math.abs(num) >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value, decimals = 1) {
  const num = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
