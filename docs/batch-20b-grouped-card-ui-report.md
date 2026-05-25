# Batch 20B: Grouped Card UI + Duplicate Root Suppression

Generated: 2026-05-25  
Branch: `batch-20b`

## Purpose

Add a frontend grouping layer that uses `data/asset-groups.json` to make repeated Flash UI variants easier to browse without moving or renaming files.

This batch keeps Vercel locked and avoids physical folder migration.

## Files changed

```txt
assets/js/grouping-enhancements.js
assets/js/asset-actions.js
docs/batch-20b-grouped-card-ui-report.md
```

## What changed

### 1. Grouping enhancement layer

Added:

```txt
assets/js/grouping-enhancements.js
```

This script:

- Loads `data/asset-groups.json`.
- Builds group indexes from `groupId`, `displayTitle`, `recommendedPrimary`, and `items`.
- Annotates matching cards with group metadata.
- Adds `Variant Hub`, `Variant Set`, and `Recommended Primary` badges.
- Adds `Open Variant Hub` actions when a canonical hub exists.
- Suppresses duplicate root cards when an equivalent `/sites` card exists.

### 2. Existing helper lane reused

Updated:

```txt
assets/js/asset-actions.js
```

The existing helper script now loads `grouping-enhancements.js` automatically. This avoids editing `index.html` and keeps the change low-risk.

### 3. Card action behavior preserved

The action helper still supports:

- Open Site
- Copy Link
- Copy Embed
- Landing Draft
- Campaign Notes
- View Source
- Deployment Plan
- Review Notes

It also respects variant hub links created by the grouping enhancement layer.

## Duplicate-root suppression behavior

Root cards are suppressed only when:

1. The item is a legacy root/root-folder entry, and
2. A matching `/sites` item exists after title normalization.

This is display suppression only. No root files are deleted in this batch.

## Guardrails followed

- Did not rewrite `data/site-registry.json`.
- Did not move `/sites` folders.
- Did not rename folders.
- Did not delete duplicate root files.
- Did not change existing `livePath` values.
- Did not add redirects.
- Did not unlock or trigger Vercel deployment.

## Known limitation

Because `index.html` was not modified directly, the grouping layer is loaded through the internal helper path that already loads `asset-actions.js`. This means grouped-card behavior is tied to the existing internal helper loading flow.

## Recommended next step

After this PR is merged, proceed with one of these:

1. Batch 20C: Generate additional canonical hub pages from more high-confidence groups in `data/asset-groups.json`.
2. Batch 21: Add first-class grouped-card support directly in `assets/js/app.js` once ready for a larger renderer refactor.
3. Batch 22: Unlock Vercel for one controlled production deployment and run smoke tests.
