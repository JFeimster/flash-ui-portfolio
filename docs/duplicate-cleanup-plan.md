# Duplicate Cleanup Plan

Batch: 19A  
Generated: 2026-05-25  
Repository: `JFeimster/flash-ui-portfolio`

## Purpose

This is a planning-only report for cleaning duplicate Flash UI assets that currently exist both at the repository root and under `/sites`.

The canonical asset root should be:

```txt
/sites
```

Root-level copies should be deleted only after confirming that the `/sites` copy is complete and that registry entries are updated to prevent stale cards.

## Current finding

Confirmed sample duplicate:

| Asset | Root path | Sites path | Evidence | Recommendation |
|---|---|---|---|---|
| AI Lab 2 | `AI Lab 2/index.html` | `sites/AI Lab 2/index.html` | Matching blob SHA: `25a189422862c9c7b7b5b6a89e24038772a7264a` | Safe to delete root copy after folder-level parity check |

## Deletion decision rules

### Safe to delete root copy

A root duplicate may be deleted when:

- A matching `/sites` copy exists.
- `index.html` matches or `/sites` is confirmed canonical.
- Supporting CSS, JS, and media files match or `/sites` contains a complete superset.
- The registry is updated to point only to `/sites`.
- Smoke test passes after cleanup.

### Needs manual review

Mark as manual review when:

- Root and `/sites` file counts differ.
- Root has files missing under `/sites`.
- Either copy contains package files, ZIPs, markdown docs, or other source packages.
- The root URL may have been shared externally.

### Keep root-only asset for now

Keep root assets when:

- No `/sites` copy exists.
- The asset is a nested app, archive, or non-static source package.
- More import work is needed.

## Likely duplicate folders to verify

- `AI Lab 1/` ↔ `sites/AI Lab 1/`
- `AI Lab 2/` ↔ `sites/AI Lab 2/`
- `AI Lab 3/` ↔ `sites/AI Lab 3/`
- `Attorney Referral Site 1/` ↔ `sites/Attorney Referral Site 1/`
- `Attorney Referral Site 2/` ↔ `sites/Attorney Referral Site 2/`
- `Attorney Referral Site 3/` ↔ `sites/Attorney Referral Site 3/`
- `Equipment-Trucking-Construction Referral Site 2/` ↔ `sites/Equipment-Trucking-Construction Referral Site 2/`
- `Equipment-Trucking-Construction Referral Site 3/` ↔ `sites/Equipment-Trucking-Construction Referral Site 3/`
- `Multi-Referral Partner Portal 2/` ↔ `sites/Multi-Referral Partner Portal 2/`
- `Partner & Account Portal 1/` ↔ `sites/Partner & Account Portal 1/`
- `Startup Credit Stacker Console 4/` ↔ `sites/Startup Credit Stacker Console 4/`
- `Stockout Death Spiral Estimator 1/` ↔ `sites/Stockout Death Spiral Estimator 1/`

## Likely duplicate root HTML files to verify

- `Editorial Bento Grid Marketing Site 3 index.html` ↔ `sites/Editorial Bento Grid Marketing Site 3 index.html`
- `Business Loan Affiliate Pillar 1 index.html` ↔ `sites/Business Loan Affiliate Pillar 1 index.html`
- `Business Loan Affiliate Pillar 2 index.html` ↔ `sites/Business Loan Affiliate Pillar 2 index.html`
- `Niche_Factory_1 index.html` ↔ `sites/Niche_Factory_1 index.html`
- `Niche_Factory_2 index.html` ↔ `sites/Niche_Factory_2 index.html`

## Registry files affected

- `data/site-registry.json`
- `data/site-registry-batch-5-additions.json`
- `data/site-registry-static-extractions.json`
- `data/asset-groups.json`
- `data/asset-actions.json`
- `data/asset-curation.json`
- `data/live-path-smoke-test.json`

## Recommended Batch 19B

Batch 19B should:

1. Perform full filesystem tree scan.
2. Confirm folder-level parity between root and `/sites` duplicates.
3. Delete only confirmed root duplicates.
4. Preserve root-only and manual-review candidates.
5. Update registry/index files so duplicate root cards are removed or suppressed.
6. Keep Vercel locked until the cleanup, consolidation, and UI updates are ready for one controlled deployment.

## Warning

Do not delete root copies without registry cleanup. That would reduce file clutter but leave stale index cards — the directory equivalent of cleaning your garage by throwing everything into the hallway.
