# Batch 21D Safe Variant Consolidation Report

## Scope

- Consolidated only selected already-hubbed groups into canonical `sites/[group-slug]/variant-[n]/`
- No mass normalization and no registry rewrites
- No root-level duplicate cleanup
- No deployment or Vercel unlock actions

## Candidate Groups Reviewed

- `ai-lab` (skip)
- `credit-incubator` (skip)
- `high-converting-lead-magnet` (skip)
- `attorney-referral-site` (apply)
- `equipment-trucking-construction-referral-site` (apply)
- `multi-referral-partner-portal` (apply)
- `personal-founder-brand-site` (apply)
- `bank-decline-referral-partner-program` (apply)
- `funding-calculators-tools-library` (skip)
- `ai-agent-library-for-entrepreneurs` (skip)
- `the-radical-libertarian` (skip)

## Groups Applied

- `attorney-referral-site`
- `equipment-trucking-construction-referral-site`
- `multi-referral-partner-portal`
- `personal-founder-brand-site`
- `bank-decline-referral-partner-program`

## Groups Skipped And Why

- `ai-lab`: mixed state (old source folders still exist while canonical `variant-n` targets and hub updates already exist)
- `credit-incubator`: mixed state (old source folders still exist while canonical `variant-n` targets and hub updates already exist)
- `high-converting-lead-magnet`: mixed state (old source folders still exist while canonical `variant-n` targets and hub updates already exist)
- `funding-calculators-tools-library`: larger 5-variant move with higher review surface; deferred to narrower dedicated batch
- `ai-agent-library-for-entrepreneurs`: hub currently uses `/static/` subpath variant links; deferred pending explicit canonical URL-shape decision
- `the-radical-libertarian`: mixed root/static hub link style; deferred pending explicit canonical URL-shape decision

## Commands Run

```bash
git fetch origin
git reset --hard origin/main
git clean -fd
git checkout -B batch-21d-consolidate-remaining-hubbed-groups origin/main

node scripts/consolidate-variant-group.mjs --group attorney-referral-site
node scripts/consolidate-variant-group.mjs --group equipment-trucking-construction-referral-site
node scripts/consolidate-variant-group.mjs --group multi-referral-partner-portal
node scripts/consolidate-variant-group.mjs --group personal-founder-brand-site
node scripts/consolidate-variant-group.mjs --group bank-decline-referral-partner-program

node scripts/consolidate-variant-group.mjs --group attorney-referral-site --apply
node scripts/consolidate-variant-group.mjs --group equipment-trucking-construction-referral-site --apply
node scripts/consolidate-variant-group.mjs --group multi-referral-partner-portal --apply
node scripts/consolidate-variant-group.mjs --group personal-founder-brand-site --apply
node scripts/consolidate-variant-group.mjs --group bank-decline-referral-partner-program --apply

git status
git diff --stat
```

## Dry-Run Results

- `attorney-referral-site`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `equipment-trucking-construction-referral-site`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `multi-referral-partner-portal`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `personal-founder-brand-site`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `bank-decline-referral-partner-program`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`

## Apply Results

- `attorney-referral-site`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `equipment-trucking-construction-referral-site`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `multi-referral-partner-portal`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `personal-founder-brand-site`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `bank-decline-referral-partner-program`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`

## Files/Folders Moved

- `sites/Attorney Referral Site 1` -> `sites/attorney-referral-site/variant-1`
- `sites/Attorney Referral Site 2` -> `sites/attorney-referral-site/variant-2`
- `sites/Attorney Referral Site 3` -> `sites/attorney-referral-site/variant-3`
- `sites/Equipment-Trucking-Construction Referral Site 1` -> `sites/equipment-trucking-construction-referral-site/variant-1`
- `sites/Equipment-Trucking-Construction Referral Site 2` -> `sites/equipment-trucking-construction-referral-site/variant-2`
- `sites/Equipment-Trucking-Construction Referral Site 3` -> `sites/equipment-trucking-construction-referral-site/variant-3`
- `sites/Multi-Referral Partner Portal 1` -> `sites/multi-referral-partner-portal/variant-1`
- `sites/Multi-Referral Partner Portal 2` -> `sites/multi-referral-partner-portal/variant-2`
- `sites/Multi-Referral Partner Portal 3` -> `sites/multi-referral-partner-portal/variant-3`
- `sites/Personal Founder Brand Site 1` -> `sites/personal-founder-brand-site/variant-1`
- `sites/Personal Founder Brand Site 2` -> `sites/personal-founder-brand-site/variant-2`
- `sites/Personal Founder Brand Site 3` -> `sites/personal-founder-brand-site/variant-3`
- `sites/Bank Decline Referral Partner Program (1)` -> `sites/bank-decline-referral-partner-program/variant-1`
- `sites/Bank Decline Referral Partner Program (2)` -> `sites/bank-decline-referral-partner-program/variant-2`
- `sites/Bank Decline Referral Partner Program (3)` -> `sites/bank-decline-referral-partner-program/variant-3`

## Old `/sites` Folders Removed

- `sites/Attorney Referral Site 1`
- `sites/Attorney Referral Site 2`
- `sites/Attorney Referral Site 3`
- `sites/Equipment-Trucking-Construction Referral Site 1`
- `sites/Equipment-Trucking-Construction Referral Site 2`
- `sites/Equipment-Trucking-Construction Referral Site 3`
- `sites/Multi-Referral Partner Portal 1`
- `sites/Multi-Referral Partner Portal 2`
- `sites/Multi-Referral Partner Portal 3`
- `sites/Personal Founder Brand Site 1`
- `sites/Personal Founder Brand Site 2`
- `sites/Personal Founder Brand Site 3`
- `sites/Bank Decline Referral Partner Program (1)`
- `sites/Bank Decline Referral Partner Program (2)`
- `sites/Bank Decline Referral Partner Program (3)`

## Hub Links Updated

- `sites/attorney-referral-site/index.html`
  - `/sites/Attorney%20Referral%20Site%201/` -> `/sites/attorney-referral-site/variant-1/`
  - `/sites/Attorney%20Referral%20Site%202/` -> `/sites/attorney-referral-site/variant-2/`
  - `/sites/Attorney%20Referral%20Site%203/` -> `/sites/attorney-referral-site/variant-3/`
- `sites/equipment-trucking-construction-referral-site/index.html`
  - `/sites/Equipment-Trucking-Construction%20Referral%20Site%201/` -> `/sites/equipment-trucking-construction-referral-site/variant-1/`
  - `/sites/Equipment-Trucking-Construction%20Referral%20Site%202/` -> `/sites/equipment-trucking-construction-referral-site/variant-2/`
  - `/sites/Equipment-Trucking-Construction%20Referral%20Site%203/` -> `/sites/equipment-trucking-construction-referral-site/variant-3/`
- `sites/multi-referral-partner-portal/index.html`
  - `/sites/Multi-Referral%20Partner%20Portal%201/` -> `/sites/multi-referral-partner-portal/variant-1/`
  - `/sites/Multi-Referral%20Partner%20Portal%202/` -> `/sites/multi-referral-partner-portal/variant-2/`
  - `/sites/Multi-Referral%20Partner%20Portal%203/` -> `/sites/multi-referral-partner-portal/variant-3/`
- `sites/personal-founder-brand-site/index.html`
  - `/sites/Personal%20Founder%20Brand%20Site%201/` -> `/sites/personal-founder-brand-site/variant-1/`
  - `/sites/Personal%20Founder%20Brand%20Site%202/` -> `/sites/personal-founder-brand-site/variant-2/`
  - `/sites/Personal%20Founder%20Brand%20Site%203/` -> `/sites/personal-founder-brand-site/variant-3/`
- `sites/bank-decline-referral-partner-program/index.html`
  - `/sites/Bank%20Decline%20Referral%20Partner%20Program%20(1)/` -> `/sites/bank-decline-referral-partner-program/variant-1/`
  - `/sites/Bank%20Decline%20Referral%20Partner%20Program%20(2)/` -> `/sites/bank-decline-referral-partner-program/variant-2/`
  - `/sites/Bank%20Decline%20Referral%20Partner%20Program%20(3)/` -> `/sites/bank-decline-referral-partner-program/variant-3/`

## Warnings/Errors

- Dry-runs: warnings=0, errors=0 for all selected groups
- Applies: warnings=0, errors=0 for all selected groups
- Post-apply verification: pass for hub existence, `variant-n/index.html` existence, old source removal, and old-link removal

## Explicit Non-Changes

- `vercel.json` not touched
- `data/site-registry.json` not touched
- Root-level duplicate folders not touched
- ZIP files not deleted (moved only when inside selected source folders)
- No standalone app folders touched
- No deploy run
- No Vercel unlock performed
- No `--all --apply` used

## Recommended Next Batch

- Batch 21E: handle deferred medium-risk mixed-link groups (`ai-agent-library-for-entrepreneurs`, `the-radical-libertarian`) and separately plan mixed-state cleanup for `ai-lab`, `credit-incubator`, and `high-converting-lead-magnet`.
