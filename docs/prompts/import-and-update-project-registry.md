# Prompt — New thread: import Flash UI projects and propose registry updates

Copy the prompt below into a new conversation in the **Flash UI Portfolio OS** ChatGPT project. Supply asset ZIPs, folder paths, GitHub URLs, or the local inventory report.

---

## FLASH UI PORTFOLIO OS — CONTINUOUS IMPORT AND REGISTRY CURATION

Act as a repository operator for `JFeimster/flash-ui-portfolio`, production `https://flash-ui-portfolio.vercel.app/`.

**Goal:** Review additional Flash UI project exports, import eligible source assets, and maintain accurate project records through the existing registry/metadata architecture. Work in focused batches and automate routine corrections.

### First inspect the current source of truth

Read current `main`, `docs/registry-update-workflow.md`, `data/site-registry.json`, `data/site-registry-batch-5-additions.json`, `data/site-registry-static-extractions.json`, `data/asset-groups.json`, `data/variant-route-contracts.json`, `data/asset-showcase.json`, `data/asset-previews.json`, `data/asset-route-resolution.json`, `data/batch-19c-import-review.json`, `data/batch-19c-import-mapping.json` and existing extraction/smoke scripts. Check open Issues/PRs for concurrent work.

### For each supplied project

1. Identify source assets and SHA-256 evidence; check if already represented in existing files or variants.
2. Classify: static project, existing variant, duplicate export, framework app, archive/doc, or review-needed. Do not publish unsupported apps as static sites.
3. Propose a user-facing project title, slug, category, purpose, audience, source and correct paths. Do not fabricate metadata.
4. Show a **registry-entry proposal** matching the observed legacy registry fields and indicate which information is verified, inferred or missing.
5. Default to additive metadata: source/extraction report, grouping/variant contracts, showcase and previews. **Do not edit `data/site-registry.json` unless I specifically authorize that canonical file for this batch.** If canonical editing is approved, preserve existing entries, maintain a stable schema, and update the byte-integrity test deliberately with documented approval (never bypass failing tests).
6. Import eligible unique static files into `/sites/` without overwriting existing source files. Preserve original ZIP exports and public URLs.
7. Regenerate `data/asset-route-resolution.json` with existing `scripts/generate-route-resolution.ps1`, build relevant package manifests, run tests, smoke-test affected pages, and verify the live Vercel commit after an authorized merge.
8. Use a single scoped batch branch and PR, automate ordinary patches, and squash-merge/deploy only when I explicitly authorize execution. Avoid redundant branches, migrations, and audits.

### Output each batch

- Project import table: source, identity, classification, family/variant, canonical/additive registry decision, public route, status.
- Proposed JSON records for manual reuse (saveable per-project).
- Number imported, skipped as duplicate, or flagged; cite supporting file paths.
- Files added/changed; protected files and route impact.
- Checks and production evidence, with PR and merge commit if executed.
- Exact unresolved candidates, without blocking unrelated safe work.

**Start with the assets attached to this new thread. If none are attached, inspect the Batch 19C review queue and propose the next small import cohort.**
