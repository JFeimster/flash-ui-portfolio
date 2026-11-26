/**
 * Shared Application State & URL Serialization
 * Includes Modular Pay-Plan selection, Solo vs. Agency / Override Mode,
 * per-product deal sizes, and per-product commission rates.
 * Strictly omits any contact details or personal identifying information.
 */

import { COMMISSION_CONFIG, getDefaultAllocations, getEqualAllocations } from "../config/commission-config.js";
import { DEFAULT_PAY_PLAN_ID, PAY_PLANS } from "../config/pay-plans/index.js";
import {
  createDefaultAgencyState,
  createDefaultCustomPlanState,
  createDefaultIsoState,
  validateInputs,
} from "./calculator-engine.js";

export function createDefaultState(config = COMMISSION_CONFIG) {
  return {
    payPlanId: config.defaultAssumptions.payPlanId || DEFAULT_PAY_PLAN_ID,
    operatingMode: config.defaultAssumptions.operatingMode || "solo",
    monthlyDeals: config.defaultAssumptions.monthlyDeals,
    averageDealSize: config.defaultAssumptions.averageDealSize,
    allocationMode: config.defaultAssumptions.allocationMode,
    allocations: getDefaultAllocations(config),
    customRates: {},
    customDealSizes: {},
    scenario: config.defaultAssumptions.scenario,
    scenarioMultipliers: {
      conservative: config.scenarios.conservative.multiplier,
      base: config.scenarios.base.multiplier,
      optimistic: config.scenarios.optimistic.multiplier,
    },
    monthlyGrowthRate: config.defaultAssumptions.monthlyGrowthRate,
    rampUpMonths: config.defaultAssumptions.rampUpMonths,
    maxMonthlyCapacity: config.defaultAssumptions.maxMonthlyCapacity,
    customerRetentionRate: config.defaultAssumptions.customerRetentionRate,
    operatingExpenses: config.defaultAssumptions.operatingExpenses,
    paymentDelayMonths: config.defaultAssumptions.paymentDelayMonths,
    projectionHorizon: 36,
    enableBonuses: config.defaultAssumptions.enableBonuses,
    enableRecurring: config.defaultAssumptions.enableRecurring,
    enableCreditSubscription: config.defaultAssumptions.enableCreditSubscription,
    creditSubscriptionClientsPerMonth: config.defaultAssumptions.creditSubscriptionClientsPerMonth,
    targetMonthlyIncome: config.defaultAssumptions.targetMonthlyIncome,
    agency: createDefaultAgencyState(),
    iso: createDefaultIsoState(),
    customPlan: createDefaultCustomPlanState(),
  };
}

export function createBaselineDemoState(config = COMMISSION_CONFIG) {
  const base = createDefaultState(config);
  const customRates = {};
  for (const p of config.products) {
    customRates[p.id] = config.standardDemonstrationBaseline.uniformIllustrativeRate;
  }
  return {
    ...base,
    payPlanId: "direct-rate",
    operatingMode: "solo",
    monthlyDeals: config.standardDemonstrationBaseline.monthlyDeals,
    averageDealSize: config.standardDemonstrationBaseline.averageDealSize,
    customRates,
    customDealSizes: {},
    monthlyGrowthRate: 0,
    operatingExpenses: 0,
    paymentDelayMonths: 0,
    rampUpMonths: 0,
    enableBonuses: false,
    enableRecurring: false,
  };
}

export function normalizeAllocationsTo100(allocations, config = COMMISSION_CONFIG) {
  const enabled = config.products.filter((p) => p.enabled !== false);
  const total = enabled.reduce((s, p) => s + Math.max(0, Number(allocations[p.id] || 0)), 0);
  if (total <= 0) return getEqualAllocations(config);

  const next = {};
  let running = 0;
  enabled.forEach((p, idx) => {
    if (idx === enabled.length - 1) {
      next[p.id] = Math.max(0, Math.round((100 - running) * 10) / 10);
    } else {
      const scaled = Math.round(((Math.max(0, Number(allocations[p.id] || 0)) / total) * 100) * 10) / 10;
      next[p.id] = scaled;
      running += scaled;
    }
  });
  return next;
}

export function encodeScenarioToSearchParams(state, config = COMMISSION_CONFIG) {
  const params = new URLSearchParams();
  if (state.payPlanId && state.payPlanId !== DEFAULT_PAY_PLAN_ID) {
    params.set("plan", String(state.payPlanId));
  }
  if (state.operatingMode === "agency") {
    params.set("opmode", "agency");
  }
  params.set("deals", String(state.monthlyDeals));
  params.set("size", String(state.averageDealSize));
  params.set("scenario", String(state.scenario));
  params.set("mode", String(state.allocationMode));
  params.set("horizon", String(state.projectionHorizon));

  if (state.monthlyGrowthRate !== 0) params.set("growth", String(state.monthlyGrowthRate));
  if (state.operatingExpenses > 0) params.set("expenses", String(state.operatingExpenses));
  if (state.paymentDelayMonths > 0) params.set("delay", String(state.paymentDelayMonths));
  if (state.rampUpMonths > 0) params.set("ramp", String(state.rampUpMonths));
  if (state.maxMonthlyCapacity > 0) params.set("cap", String(state.maxMonthlyCapacity));
  if (state.enableBonuses) params.set("bonuses", "1");
  if (state.enableRecurring) {
    params.set("recurring", "1");
    params.set("retention", String(state.customerRetentionRate));
  }
  if (state.enableCreditSubscription && state.creditSubscriptionClientsPerMonth > 0) {
    params.set("csub", String(state.creditSubscriptionClientsPerMonth));
  }
  if (state.targetMonthlyIncome > 0) params.set("target", String(state.targetMonthlyIncome));

  const allocParts = config.products
    .filter((p) => p.enabled !== false)
    .map((p) => `${p.id}:${state.allocations[p.id] ?? p.defaultAllocation}`);
  params.set("alloc", allocParts.join(","));

  if (state.customRates && Object.keys(state.customRates).length > 0) {
    const rateParts = Object.entries(state.customRates)
      .filter(([, val]) => val !== undefined && val !== "")
      .map(([id, val]) => `${id}:${val}`);
    if (rateParts.length > 0) params.set("rates", rateParts.join(","));
  }

  if (state.customDealSizes && Object.keys(state.customDealSizes).length > 0) {
    const sizeParts = Object.entries(state.customDealSizes)
      .filter(([, val]) => val !== undefined && val !== "")
      .map(([id, val]) => `${id}:${val}`);
    if (sizeParts.length > 0) params.set("dsizes", sizeParts.join(","));
  }

  // Compact non-PII serialization for Pay-Plan / Agency parameters when non-default plan or Agency mode active
  if (state.payPlanId === "agency-override" || state.operatingMode === "agency") {
    const ag = state.agency || createDefaultAgencyState();
    const compactAg = {
      t: ag.startingTier,
      c: ag.isCertified ? 1 : 0,
      q: ag.isQCB ? 1 : 0,
      a: ag.autoAdvanceLadder ? 1 : 0,
      u: ag.uniqueClientRatioPercent,
      f: ag.frontlineQCBs,
      co: (ag.spreadCohorts || []).map((x) => [
        x.activeBrokers,
        x.avgMonthlyBR,
        x.brokerTierRate,
        x.intermediateManagerRate,
        x.intermediateIsQCB ? 1 : 0,
      ]),
      lv: (ag.fiveLevels || []).map((x) => [x.brokers, x.avgMonthlyBR]),
      ld: [
        ag.leadership?.gen1OpenlineBR || 0,
        ag.leadership?.gen2OpenlineBR || 0,
        ag.leadership?.gen3OpenlineBR || 0,
      ],
    };
    params.set("ag", JSON.stringify(compactAg));
  }

  if (state.payPlanId === "iso-volume-split" && state.iso) {
    params.set(
      "iso",
      [
        state.iso.markupPoints,
        state.iso.subBrokerCount,
        state.iso.subBrokerAvgMonthlyVolume,
        state.iso.subBrokerOverridePercent,
      ].join(",")
    );
  }

  if (state.payPlanId === "custom-partner" && state.customPlan) {
    params.set(
      "cp",
      JSON.stringify({
        b: state.customPlan.baseType,
        s: state.customPlan.personalSplitPercent,
        m: state.customPlan.markupPoints,
        br: state.customPlan.bonusRevenuePercent,
        sp: state.customPlan.spreadOverridePercent,
        lr: state.customPlan.levelRates,
      })
    );
  }

  return params.toString();
}

export function buildShareableUrl(state, currentLocation = typeof window !== "undefined" ? window.location : null) {
  const query = encodeScenarioToSearchParams(state);
  if (!currentLocation) return `?${query}`;
  return `${currentLocation.origin}${currentLocation.pathname}?${query}`;
}

export function decodeScenarioFromSearch(searchString = "", config = COMMISSION_CONFIG) {
  const base = createDefaultState(config);
  if (!searchString) return base;
  const params = new URLSearchParams(searchString.startsWith("?") ? searchString.slice(1) : searchString);
  if (config.verificationStatus === "VERIFIED PROGRAM MODE") for (const key of ["rates", "ag", "iso", "cp"]) params.delete(key);

  if (params.has("plan") && Object.hasOwn(PAY_PLANS, params.get("plan"))) {
    base.payPlanId = params.get("plan");
  }
  if (params.get("opmode") === "agency") {
    base.operatingMode = "agency";
  }

  if (params.has("deals")) base.monthlyDeals = Number(params.get("deals"));
  if (params.has("size")) base.averageDealSize = Number(params.get("size"));
  if (params.has("scenario") && Object.hasOwn(config.scenarios, params.get("scenario"))) {
    base.scenario = params.get("scenario");
  }
  if (params.get("mode") === "equal") {
    base.allocationMode = "equal";
    base.allocations = getEqualAllocations(config);
  }
  if (params.has("horizon")) base.projectionHorizon = Number(params.get("horizon"));
  if (params.has("growth")) base.monthlyGrowthRate = Number(params.get("growth"));
  if (params.has("expenses")) base.operatingExpenses = Number(params.get("expenses"));
  if (params.has("delay")) base.paymentDelayMonths = Number(params.get("delay"));
  if (params.has("ramp")) base.rampUpMonths = Number(params.get("ramp"));
  if (params.has("cap")) base.maxMonthlyCapacity = Number(params.get("cap"));
  if (params.get("bonuses") === "1") base.enableBonuses = true;
  if (params.get("recurring") === "1") base.enableRecurring = true;
  if (params.has("retention")) base.customerRetentionRate = Number(params.get("retention"));
  if (params.has("csub")) {
    base.enableCreditSubscription = true;
    base.creditSubscriptionClientsPerMonth = Number(params.get("csub"));
  }
  if (params.has("target")) base.targetMonthlyIncome = Number(params.get("target"));

  if (params.has("alloc") && base.allocationMode !== "equal") {
    const parsed = { ...base.allocations };
    params
      .get("alloc")
      .split(",")
      .forEach((pair) => {
        const [id, val] = pair.split(":");
        if (id && parsed[id] !== undefined && Number.isFinite(Number(val))) {
          parsed[id] = Number(val);
        }
      });
    base.allocations = parsed;
  }

  if (params.has("rates")) {
    const customRates = {};
    params
      .get("rates")
      .split(",")
      .forEach((pair) => {
        const [id, val] = pair.split(":");
        if (id && Number.isFinite(Number(val))) {
          customRates[id] = Number(val);
        }
      });
    base.customRates = customRates;
  }

  if (params.has("dsizes")) {
    const customDealSizes = {};
    params
      .get("dsizes")
      .split(",")
      .forEach((pair) => {
        const [id, val] = pair.split(":");
        if (id && Number.isFinite(Number(val))) {
          customDealSizes[id] = Number(val);
        }
      });
    base.customDealSizes = customDealSizes;
  }

  if (params.has("ag")) {
    try {
      const ag = JSON.parse(params.get("ag"));
      if (ag && typeof ag === "object") {
        if (Number.isFinite(Number(ag.t))) base.agency.startingTier = Number(ag.t);
        if (ag.c !== undefined) base.agency.isCertified = Boolean(ag.c);
        if (ag.q !== undefined) base.agency.isQCB = Boolean(ag.q);
        if (ag.a !== undefined) base.agency.autoAdvanceLadder = Boolean(ag.a);
        if (Number.isFinite(Number(ag.u))) base.agency.uniqueClientRatioPercent = Number(ag.u);
        if (Number.isFinite(Number(ag.f))) base.agency.frontlineQCBs = Number(ag.f);
        if (Array.isArray(ag.co)) {
          base.agency.spreadCohorts = base.agency.spreadCohorts.map((def, idx) => {
            const arr = ag.co[idx];
            if (!Array.isArray(arr)) return def;
            return {
              ...def,
              activeBrokers: Number(arr[0]) || 0,
              avgMonthlyBR: Number(arr[1]) || 0,
              brokerTierRate: Number(arr[2]) || 40,
              intermediateManagerRate: Number(arr[3]) || 0,
              intermediateIsQCB: Boolean(arr[4]),
            };
          });
        }
        if (Array.isArray(ag.lv)) {
          base.agency.fiveLevels = base.agency.fiveLevels.map((def, idx) => {
            const arr = ag.lv[idx];
            if (!Array.isArray(arr)) return def;
            return {
              ...def,
              brokers: Number(arr[0]) || 0,
              avgMonthlyBR: Number(arr[1]) || 0,
            };
          });
        }
        if (Array.isArray(ag.ld)) {
          base.agency.leadership = {
            gen1OpenlineBR: Number(ag.ld[0]) || 0,
            gen2OpenlineBR: Number(ag.ld[1]) || 0,
            gen3OpenlineBR: Number(ag.ld[2]) || 0,
          };
        }
      }
    } catch {
      // Ignore malformed query JSON safely
    }
  }

  if (params.has("iso")) {
    const parts = params.get("iso").split(",").map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      base.iso = {
        markupPoints: parts[0],
        subBrokerCount: parts[1],
        subBrokerAvgMonthlyVolume: parts[2],
        subBrokerOverridePercent: parts[3],
      };
    }
  }

  if (params.has("cp")) {
    try {
      const cp = JSON.parse(params.get("cp"));
      if (cp && typeof cp === "object") {
        if (cp.b) base.customPlan.baseType = cp.b;
        if (Number.isFinite(Number(cp.s))) base.customPlan.personalSplitPercent = Number(cp.s);
        if (Number.isFinite(Number(cp.m))) base.customPlan.markupPoints = Number(cp.m);
        if (Number.isFinite(Number(cp.br))) base.customPlan.bonusRevenuePercent = Number(cp.br);
        if (Number.isFinite(Number(cp.sp))) base.customPlan.spreadOverridePercent = Number(cp.sp);
        if (Array.isArray(cp.lr)) base.customPlan.levelRates = cp.lr.map((n) => Number(n) || 0);
      }
    } catch {
      // Ignore malformed query JSON safely
    }
  }

  return sanitizeScenarioState(base, config);
}

export const PUBLIC_PLAN_ALIASES = Object.freeze({
  "direct-rate": "direct-rate", agency: "agency-override", iso: "iso-volume-split", custom: "custom-partner",
});

export function sanitizeScenarioState(state, config = COMMISSION_CONFIG) {
  const sanitized = validateInputs(state, config).sanitized;
  if (config.verificationStatus === "VERIFIED PROGRAM MODE") sanitized.customRates = {};
  return { ...state, ...sanitized };
}

// Adapt the public embed vocabulary into the existing scenario decoder.
export function decodeEmbedOptions(search = "", config = COMMISSION_CONFIG, partners = {}) {
  const input = new URLSearchParams(search);
  const scenario = new URLSearchParams();
  for (const key of ["deals", "growth"]) {
    const value = input.get(key);
    if (value !== null && value.trim() && Number.isFinite(Number(value))) scenario.set(key, value);
  }
  for (const [alias, key] of [["amount", "size"], ["months", "horizon"]]) {
    const value = input.get(alias);
    if (value !== null && value.trim() && Number.isFinite(Number(value))) scenario.set(key, value);
  }
  const plan = Object.hasOwn(PUBLIC_PLAN_ALIASES, input.get("plan")) ? input.get("plan") : "direct-rate";
  scenario.set("plan", PUBLIC_PLAN_ALIASES[plan]);
  let state = decodeScenarioFromSearch(scenario.toString(), config);
  const rate = input.get("rate");
  if (config.verificationStatus !== "VERIFIED PROGRAM MODE" && ["direct-rate", "custom"].includes(plan) && rate !== null && rate.trim() && Number.isFinite(Number(rate))) {
    const value = Math.min(25, Math.max(0, Number(rate)));
    if (plan === "custom") state.customPlan = { ...state.customPlan, baseType: "direct-percent", personalSplitPercent: 100 };
    state.customRates = Object.fromEntries(config.products.filter(p => p.enabled !== false).map(p => [p.id, value]));
  }
  const partnerSlug = input.get("partner");
  const partner = /^[a-z0-9-]{1,64}$/.test(partnerSlug || "") && Object.hasOwn(partners, partnerSlug) && partners[partnerSlug].publicDisclosureAuthorized === true ? partnerSlug : null;
  // References are opaque public campaign IDs, never URLs or contact information.
  const reference = input.get("ref");
  return {
    state: sanitizeScenarioState(state, config),
    theme: ["dark", "light", "auto"].includes(input.get("theme")) ? input.get("theme") : "auto",
    compact: input.get("compact") !== "false", cta: input.get("cta") !== "false",
    partner, ref: /^[a-zA-Z0-9_-]{1,48}$/.test(reference || "") ? reference : null,
    currency: "USD",
  };
}
