# Batch 24: Physical Repository Canonicalization Report

## Scope
- Branch: `batch-24-physical-canonicalization`
- Canonical asset root enforced: `/sites`
- `vercel.json`: unchanged

## Tree Inspection Outputs
- Root-level listing: `data/migration-reports/batch-24-root-level-list.json`
- Full `/sites` folder+file listing: `data/migration-reports/batch-24-sites-full-list.json`
- Duplicate audit (initial): `data/migration-reports/batch-24-physical-audit.json`
- Duplicate audit (final): `data/migration-reports/batch-24-physical-audit-final.json`

## Variant Canonicalization
- Processed confirmed variant groups and ensured canonical hubs/variant folders under `sites/{groupId}/variant-*`.
- Regenerated simple hub pages at `sites/{groupId}/index.html` for confirmed groups.
- Migration detail report: `data/migration-reports/batch-24-group-canonicalization.json`

### Moved Legacy `/sites` Variant Files Into Canonical Group Folders
- `sites/Editorial Bento Grid Marketing Site 1 index.html` -> `sites/editorial-bento-grid-marketing-site/variant-1/index.html`
- `sites/Editorial Bento Grid Marketing Site 2 index.html` -> `sites/editorial-bento-grid-marketing-site/variant-2/index.html`
- `sites/Editorial Bento Grid Marketing Site 3 index.html` -> `sites/editorial-bento-grid-marketing-site/variant-3/index.html`
- `sites/Business Loan Affiliate Pillar 1 index.html` -> `sites/business-loan-affiliate-pillar/variant-1/index.html`
- `sites/Business Loan Affiliate Pillar 2 index.html` -> `sites/business-loan-affiliate-pillar/variant-2/index.html`
- `sites/Niche_Factory_1 index.html` -> `sites/niche-factory/variant-1/index.html`
- `sites/Niche_Factory_2 index.html` -> `sites/niche-factory/variant-2/index.html`

### Newly Materialized Canonical Group Folders
- `sites/editorial-bento-grid-marketing-site/`
- `sites/business-loan-affiliate-pillar/`
- `sites/niche-factory/`

## Deleted Root Duplicates (Confirmed Safe)
Deleted only after canonical path verification (`/sites` target exists, canonical index present where required, and duplicate/superseded comparison passed).

- `AI Lab 1`
- `AI Lab 2`
- `AI Lab 3`
- `Attorney Referral Site 2`
- `Attorney Referral Site 3`
- `Bank Decline Referral Partner Program (1)`
- `Bank Decline Referral Partner Program (2)`
- `Bank Decline Referral Partner Program (3)`
- `Business Loan Affiliate Pillar 1 index.html`
- `Business Loan Affiliate Pillar 2 index.html`
- `Cinematic Dark Luxe (ETA 1) index.html`
- `Cinematic Dark Luxe (ETA 2) index.html`
- `Cinematic Dark Luxe (Personal Site) index.html`
- `Credit Incubator 1`
- `Credit Incubator 2`
- `Credit Incubator 3`
- `Editorial Bento Grid Marketing Site 1 index.html`
- `Editorial Bento Grid Marketing Site 2 index.html`
- `Editorial Bento Grid Marketing Site 3 index.html`
- `Embed Widget Studio`
- `Equipment-Trucking-Construction Referral Site 1`
- `Equipment-Trucking-Construction Referral Site 2`
- `Equipment-Trucking-Construction Referral Site 3`
- `framer template copy index.html`
- `High-Converting Lead Magnet 1`
- `High-Converting Lead Magnet 2`
- `High-Converting Lead Magnet 3`
- `Lead Generation & Marketing Tools Hub`
- `Modern Agency Landing Page index.html`
- `Multi-Referral Partner Portal 1`
- `Multi-Referral Partner Portal 2`
- `Multi-Referral Partner Portal 3`
- `Neo-Brutalist content hub 1 (Acquisition Financing) index.html`
- `Neo-Brutalist content hub 2 (Acquisition Financing) index.html`
- `Neo-Brutalist Marketing Site index.html`
- `Neo-Brutalist Marketing Site-2 index.html`
- `Neo-Brutalist Personal Agency Portfolio index.html`
- `Niche_Factory_1 index.html`
- `Niche_Factory_2 index.html`
- `Startup Funding Pillar 1 index.html`
- `Startup Funding Pillar 4 (Neo-Brutalist) index.html`
- `White-Label Financing Widget for B2B Partners.html`
- `Startup Credit Stacker Console 1`
- `Startup Credit Stacker Console 2`
- `Startup Credit Stacker Console 3`
- `Startup Credit Stacker Console 4`

## Preserved Root-Only / Manual-Review Assets
- `Attorney Referral Site 1` (canonical variant exists, but mismatch in `Recommended Pages.md`; preserved)
- `1. Fash UI Templates (Notion)` (docs archive)
- `financing-widget` (nested app candidate)
- `Moonshine Editorial Bento` (nested app candidate)
- `moonshine-affiliate-hub` (nested app candidate)
- `Partner & Account Portal 1` (root-only unique)
- `Stockout Death Spiral Estimator 1` (root-only unique)

## Registry Rebuild
- Rebuilt `data/site-registry.json` from current filesystem state.
- Registry entry count: `75`
- Canonical group hubs prioritized as top-level entries.
- Variants represented in `variants` metadata on hub entries instead of duplicate top-level records.
- Stale deleted root paths removed.
- Nested apps marked as `nextjs-app` with `needsStandaloneDeploy: true`.
- Archive/docs entries marked `archive-needs-review`.

## Group Display Rules Update
- Added `data/group-display-rules.json`.
- `canonicalGroupIds` includes only groups whose `sites/{groupId}/index.html` exists.
- No missing hub paths referenced.

## Known Unresolved Items
- `Attorney Referral Site 1` vs `sites/attorney-referral-site/variant-1`: `Recommended Pages.md` content mismatch requires manual adjudication.
- Existing smoke script validates production URL state and currently fails all remote checks (see below), which is external to local filesystem canonicalization.

## Smoke Test Results
- JSON validation: passed (`data/*.json` all parse)
- JS syntax validation: passed (`assets/**/*.js`, `scripts/**/*.js`, `scripts/**/*.mjs`)
- Local registry path check: passed (`61` livePath entries, `0` missing)
- `scripts/live-path-smoke-test.ps1`: ran successfully but reported remote URL failures
  - candidate URLs: `176`
  - passed: `0`
  - failed: `176`
  - skipped: `37`

## Notes
- `data/live-path-smoke-test.json` and `docs/live-path-smoke-test.md` were refreshed by running the smoke-test script.
- `docs/migration-reports/all-variant-consolidation-report.md` and `data/migration-reports/all-variant-consolidation-report.json` were refreshed by running the variant-consolidation script.
