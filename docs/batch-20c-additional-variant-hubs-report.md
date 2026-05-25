# Batch 20C: Additional Canonical Variant Hubs

Generated: 2026-05-25  
Branch: `batch-20c-more-variant-hubs`

## Purpose

Generate additional concept-level variant hub pages from high-confidence groups in `data/asset-groups.json`.

This batch continues the hub-first strategy: create clean canonical hub URLs without moving, renaming, or deleting the original variant folders.

## Hubs added

| Hub | Path | Variants linked |
|---|---|---:|
| Equipment-Trucking-Construction Referral Site | `sites/equipment-trucking-construction-referral-site/index.html` | 3 |
| High-Converting Lead Magnet | `sites/high-converting-lead-magnet/index.html` | 3 |
| Startup Credit Stacker Console | `sites/startup-credit-stacker-console/index.html` | 4 |
| Credit Incubator | `sites/credit-incubator/index.html` | 3 |
| Multi-Referral Partner Portal | `sites/multi-referral-partner-portal/index.html` | 3 |

## Manifest update

Updated:

```txt
data/site-registry-batch-5-additions.json
```

The following hub slugs were added to the existing `static` manifest:

```txt
equipment-trucking-construction-referral-site
high-converting-lead-magnet
startup-credit-stacker-console
credit-incubator
multi-referral-partner-portal
```

## Total canonical hubs after Batch 20C

Existing from Batch 20A:

- `sites/ai-lab/`
- `sites/attorney-referral-site/`
- `sites/funding-calculators-tools-library/`

Added in Batch 20C:

- `sites/equipment-trucking-construction-referral-site/`
- `sites/high-converting-lead-magnet/`
- `sites/startup-credit-stacker-console/`
- `sites/credit-incubator/`
- `sites/multi-referral-partner-portal/`

Total canonical hub pages: **8**

## Guardrails followed

- Did not rewrite `data/site-registry.json`.
- Did not move folders.
- Did not rename folders.
- Did not delete root duplicates.
- Did not change existing variant `livePath` values.
- Did not add redirects.
- Did not unlock Vercel.

## Verification plan

When ready for the controlled deploy window:

1. Temporarily unlock Vercel Git deployments.
2. Merge the approved PRs to `main`.
3. Trigger one production deployment.
4. Smoke test:
   - `/sites/ai-lab/`
   - `/sites/attorney-referral-site/`
   - `/sites/funding-calculators-tools-library/`
   - `/sites/equipment-trucking-construction-referral-site/`
   - `/sites/high-converting-lead-magnet/`
   - `/sites/startup-credit-stacker-console/`
   - `/sites/credit-incubator/`
   - `/sites/multi-referral-partner-portal/`
5. Confirm portfolio cards show hub actions and duplicate-root suppression behavior.
6. Restore Vercel deployment lock if more batching is planned.

## Recommended next step

Review and merge this PR if clean. Then choose either:

- Batch 20D: generate the remaining high-confidence hubs from `data/asset-groups.json`, or
- Controlled Vercel unlock/deploy + smoke test once this is enough to verify live behavior.
