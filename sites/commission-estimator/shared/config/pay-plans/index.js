/**
 * Modular Multi-Partner Pay-Plan Registry
 * Single source of truth for swappable compensation profiles.
 */

import { AGENCY_OVERRIDE_PLAN } from "./agency-override.js";
import { CUSTOM_PARTNER_PLAN } from "./custom-partner.js";
import { DIRECT_RATE_PLAN } from "./direct-rate.js";
import { ISO_VOLUME_SPLIT_PLAN } from "./iso-volume-split.js";

export const DEFAULT_PAY_PLAN_ID = "direct-rate";

export const PAY_PLANS = {
  "direct-rate": DIRECT_RATE_PLAN,
  "agency-override": AGENCY_OVERRIDE_PLAN,
  "iso-volume-split": ISO_VOLUME_SPLIT_PLAN,
  "custom-partner": CUSTOM_PARTNER_PLAN,
};

export const PAY_PLAN_LIST = [
  DIRECT_RATE_PLAN,
  AGENCY_OVERRIDE_PLAN,
  ISO_VOLUME_SPLIT_PLAN,
  CUSTOM_PARTNER_PLAN,
];

export function getPayPlanById(planId) {
  return Object.hasOwn(PAY_PLANS, planId) ? PAY_PLANS[planId] : PAY_PLANS[DEFAULT_PAY_PLAN_ID];
}

export {
  AGENCY_OVERRIDE_PLAN,
  CUSTOM_PARTNER_PLAN,
  DIRECT_RATE_PLAN,
  ISO_VOLUME_SPLIT_PLAN,
};
