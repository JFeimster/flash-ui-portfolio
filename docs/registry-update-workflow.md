# Registry Update Workflow

This workflow explains how to update Flash UI Portfolio OS data without turning `data/site-registry.json` into a haunted spreadsheet.

## Registry philosophy

`data/site-registry.json` is the canonical legacy/root registry. Do not rewrite it casually.

Prefer additive files for new layers:

```txt
data/site-registry-batch-5-additions.json
data/site-registry-static-extractions.json
data/card-display-rules.json
data/asset-groups.json
data/asset-actions.json
data/asset-curation.json
```

The frontend can merge these layers at runtime or through future build tooling.

## When to update canonical registry

Only update `data/site-registry.json` when explicitly approved and when the change is truly canonical, such as:

- adding a verified root-level legacy asset
- correcting a factual registry error
- normalizing after an approved redirect plan
- removing a duplicate after an approved consolidation plan

## When to use additive metadata instead

Use additive metadata for:

- display labels
- descriptions
- card CTAs
- curation scores
- public/private visibility
- grouping and variants
- extraction reports
- smoke-test results
- standalone deployment plans
- slug normalization proposals

## Adding new static assets

1. Preserve source export or ZIP.
2. Determine if it is static HTML/CSS/JS.
3. If approved, extract under `/sites/[folder-slug]/`.
4. Confirm `index.html` exists.
5. Add extraction metadata to the appropriate additive registry/report.
6. Smoke test the live path after deployment.

## Handling root-level HTML files

Root-level HTML files under `/sites` can be represented as root HTML entries, but should eventually be normalized through a slug plan.

Do not rename them without redirects.

## Handling standalone apps

If an asset contains:

```txt
package.json
next.config.js
vite.config.*
svelte.config.*
server-only code
```

then treat it as a standalone app candidate.

Do not force it into static portfolio flow.

Add it to standalone audit metadata instead.

## Handling archives and docs

ZIPs, markdown-only exports, and raw docs should remain preserved and marked for review unless a specific extraction or publishing task is approved.

## Live path rules

Never change `livePath` casually.

Before changing live paths, create:

- slug normalization plan
- redirect recommendations
- registry impact notes
- reference-risk notes
- manual review flags

## Validation checklist

Before opening a registry/data PR:

- JSON validates.
- Changed files are scoped.
- No protected registry rewrite happened unless approved.
- New live paths are smoke-testable.
- Nested apps are not mislabeled as static sites.
- Archives are not accidentally promoted.
- Public-mode implications are understood.

## Recommended report format

```txt
Files changed:
Registry files touched:
Protected files touched: yes/no
Live paths changed: yes/no
/sites changed: yes/no
ZIPs changed: yes/no
Validation performed:
Risks:
Recommended next batch:
```
