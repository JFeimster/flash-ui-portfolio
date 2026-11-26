# Catalog and asset intake operator guide

## Source contract

`asset-showcase.json.projects[id].catalog` is the optional version 2 product metadata extension. The canonical registry and `transferable-design-themes.json` remain authoritative and unchanged. Do not create a second catalog. `assets/js/catalog-core.mjs` combines route identities, existing grouping and curated collections, showcase copy, previews, route contracts and external references without mutating inputs.

Supported fields: `schemaVersion`, `productCategory`, `productSubcategory`, `productType`, `industries`, `audiences`, `capabilities`, `designThemeIds`, `layoutStyles`, `lifecycle`, `architecture`, `distributionMethods`, `repositoryUrl`, `productionUrl`, `integrations`, `variantCount`, `defaultVariantId`, `tags`, `createdAt`, `updatedAt`, `provenance`, and `variants`. Unknown scalar values are null; unknown collections are empty. An empty integrations array means evidence is unavailable, not verified absence. Integration objects may contain `id`, `name`, `status` (unverified, declared, or verified) and supporting evidence. Never infer verified service connectivity from interface copy.

Category values reuse existing categories. Product types currently introduced are `calculator` and `generator`; explicit future types can be added with source evidence. Other dimensions retain source-authored classifications; no speculative bulk taxonomy is applied. Dates use ISO 8601; missing/invalid dates sort after dated records with title/identity tie breaking.

Precedence: resolved routes own IDs, original implementation fields and destinations; showcase catalog owns product classification; explicit showcase copy owns title/description; existing group/category/audience copy provides legacy fallbacks. Verified resolved group members determine counts. Variant IDs are explicit contract IDs or `group-id--variant-N`; a default must match an actual member. `catalog.variants[variantId]` can carry `designThemeIds` and provenance. Group themes are the union of explicit canonical IDs and verified member themes. Themes match exact IDs or master-defined aliases only. Unrecognized names remain suggestions, never new master definitions. Similar titles are insufficient evidence.

Directory filters keep old `q`, `category`, `type`, `style`, `browse`, `sort`, `saved`, and `view` links. Additional parameters use catalog field names. Advanced dimensions appear under disclosure. Theme filtering can choose an existing matching variant capture without changing the project destination/default. Favorites retain their existing storage key and canonical IDs.

## Migration

```powershell
node scripts/migrate-catalog.mjs
node scripts/migrate-catalog.mjs --apply
node --test tests/catalog-v2.test.mjs
```

The small cohort uses existing showcase evidence and exact source manifest IDs. Review `data/catalog-migration-review.json`. Existing classifications take precedence. Commission Estimator is absent from this worktree's base revision; its separately imported, uncommitted files remain in the original checkout. No prototype files were copied or rewritten.

## Architecture audit

`docs/catalog-v2-baseline.json` records revision, SHA-256 checksums, group IDs, all resolved/unresolved route identities, relevant tests and filename consumers before changes. `/sites/` and `/` load `app.js`, which dynamically loads the shared core and existing Voltage renderer. `grouped-directory.js` has no active HTML loader and is left untouched. `grouping-enhancements.js` belongs to the older asset-actions path; it is not the current directory renderer. Asset explorer, variant hub, graph/package builders and reuse pipeline retain their separate existing contracts. The canonical navigation CSS and homepage stacking hotfix remain untouched.

Baseline: 109 Node tests, 108 passed; the existing `batch-20-reuse` test expects `complete static site` while the implementation returns `static site`. This unrelated failure is retained. Browser smoke covers existing navigation, search, grouping, filters, pagination, quick preview and mobile width.

## Validation matrix

Pure normalization/filter tests cover source immutability, deterministic output, membership/default identity, theme union and unknown mappings, metadata search, missing dates, canonical destinations and duplicate suppression. Browser checks cover real favorites, dialogs, URL state and responsive navigation. Importer integration fixtures exercise staging, archive rejection, filesystem collisions, no-overwrite behavior, rollback, stale plans and idempotence. Local structural/reference validation does not establish live integrations or production availability. Production acceptance follows a separately authorized deployment.

## Import commands (Windows PowerShell)

```powershell
node scripts/import-asset.mjs --source="C:\Exports\site.zip" --slug=my-site --dry-run
node scripts/import-asset.mjs --source="C:\Exports\site.zip" --slug=my-site --apply
node scripts/import-static-zip.mjs "C:\Exports\site.zip" --slug=my-site --apply
node scripts/import-asset.mjs --manifest="C:\Exports\external-project.json" --mode=external --dry-run
```

The importer defaults to dry-run. ZIPs are checked for signature, unsafe paths, symlinks, collisions and expansion limits, then extracted to an isolated temporary directory. Static and grouped imports write an additive approved-import record and regenerate route resolution. Existing and external modes add only showcase catalog metadata; external records require an HTTPS production URL. Reports can be saved with `--report=docs/my-import-report.json`. Apply rejects unresolved warnings. Do not run package scripts from imported source.

Commission Estimator's four variant folders and manifests are present only as uncommitted files in the original checkout at this revision. That separate import must land before registration in this branch. Once landed, run from the target checkout:

```powershell
node scripts/import-asset.mjs --source=".\sites\commission-estimator" --mode=existing --dry-run --report=docs/commission-estimator-import.json
```

Review the report and explicit theme IDs first. `brokers-manifesto` in the imported manifest is not in the canonical theme master, so it must remain an unresolved suggestion. The catalog must retain one group, four verified routes, and variant 1 as the selected design after the separate import is integrated.
