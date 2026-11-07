# Batch 31 — Routing repair and grouped directory

This local-only change consolidates the Flash UI portfolio around additive route evidence and canonical project families.

## Route evidence

- Source entries examined: 153 merged entries from the existing registry, extraction registry, and Batch 5 manifest.
- Canonical families: 31.
- Locally resolved routes: 127.
- Unresolved: 10.
- Missing entrypoint: 2.
- Standalone app candidates: 3.
- Archive / source-only entries: 11.
- Production verified: 0. Production verification remains pending until an authorized deployment smoke test is performed.

The original route is preserved as `originalPath` in `data/asset-route-resolution.json`. A `resolvedPath` is only emitted when an existing local entrypoint or explicit canonical group/migration evidence identifies the destination. For example, `sites/Embed Code Generator 3` resolves to `/sites/embed-code-generator/variant-3/` because the canonical family membership and existing variant entrypoint agree.

## Local checks

```powershell
node --check assets/js/app.js
node --check assets/js/variant-hub.js
./scripts/generate-route-resolution.ps1
./scripts/local-route-smoke-test.ps1 -BaseUrl http://127.0.0.1:4173
git diff --check
```

The local HTTP smoke test checked the homepage, catalog, shared assets, all 127 resolved routes, the stale Embed Code Generator path, and an unknown route. Result: 135 checked, 135 passed, both negative cases 404 with no redirect.

## Release boundary

No source assets were deleted or moved. `data/site-registry.json` and historical smoke reports were not rewritten. No push, PR, merge, deployment, or external configuration change is part of this batch.
