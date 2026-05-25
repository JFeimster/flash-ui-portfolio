# Batch 19B Root Duplicate Removal Report

Generated: 2026-05-25  
Branch: `batch-19b-remove-confirmed-root-duplicates`

## Scope

Batch 19B removes only root-level duplicate files that were connector-verifiable against their canonical `/sites` copies.

This batch intentionally avoids mass deleting folders because the GitHub connector can fetch individual files but does not provide a safe recursive folder parity listing from directory paths. Full folder deletion should be performed by Codex or a local script with filesystem access.

## Confirmed duplicate removed

### AI Lab 2

Removed from repo root:

```txt
AI Lab 2/index.html
AI Lab 2/style.css
```

Preserved canonical `/sites` copies:

```txt
sites/AI Lab 2/index.html
sites/AI Lab 2/style.css
```

Evidence:

| File | Root blob SHA | /sites blob SHA | Result |
|---|---:|---:|---|
| `index.html` | `25a189422862c9c7b7b5b6a89e24038772a7264a` | `25a189422862c9c7b7b5b6a89e24038772a7264a` | Identical |
| `style.css` | `f414f06aed37b9faca9bd40bd2bedd4d11786fa7` | `f414f06aed37b9faca9bd40bd2bedd4d11786fa7` | Identical |

## Not removed in this batch

Other likely duplicates from the Batch 19A plan were not deleted yet because they require folder-level comparison.

Examples still requiring verification:

- `AI Lab 1/` ↔ `sites/AI Lab 1/`
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

## Registry note

`data/site-registry.json` still contains legacy root entries and canonical `/sites` entries. This batch removes confirmed duplicate files but does not rewrite the primary registry.

Recommended next implementation step before or during Batch 20:

1. Add a duplicate suppression layer to the frontend or registry pipeline.
2. Prefer `/sites` entries when root and `/sites` represent the same asset.
3. Keep all variant access through future canonical variant hub pages.

## Recommended next batch

Proceed to Batch 20 with Codex/local filesystem support:

```txt
Batch 20: Consolidate variant folders into canonical group folders
```

Batch 20 should use full filesystem access to:

1. Move `/sites/[Concept N]/` folders into `/sites/[canonical-slug]/variant-n/`.
2. Generate `/sites/[canonical-slug]/index.html` as the variant hub.
3. Update registry/group metadata to point concept cards at hubs.
4. Preserve direct links to every variant.
5. Defer Vercel unlock/deploy until grouped card support and smoke tests are ready.

## Warning

This repo still needs a full duplicate cleanup pass. Do not assume all root duplicates are gone after this batch. This was a surgical strike, not a carpet bombing.
