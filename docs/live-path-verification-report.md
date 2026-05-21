# Batch 4C Live Path Verification Report

Production URL:

```txt
https://flash-ui-portfolio.vercel.app/
```

## Summary

The deployed Flash UI Portfolio is live and serving the root homepage, registry JSON, and representative static assets from both legacy root paths and `/sites` paths.

## Results

| Check | Status | Notes |
|---|---:|---|
| Root homepage | Pass | `200`, `text/html; charset=utf-8` |
| `/data/site-registry.json` | Pass | `200`, `application/json; charset=utf-8` |
| Root legacy HTML asset | Pass | `Niche_Factory_1 index.html` loaded |
| Root legacy partner HTML asset | Pass | `Business Loan Affiliate Pillar 1 index.html` loaded |
| `/sites` folder with `index.html` | Pass | `sites/AI Lab 1/` loaded |
| `/sites` funding tool folder | Pass | `sites/Startup Credit Stacker Console 1/` loaded |
| `/sites` estimator folder | Pass | `sites/Stockout Death Spiral Estimator 1/` loaded |
| `/sites` root-level HTML file | Not applicable | No `sites-root-html` entries currently exist in the registry |
| Nested app card behavior | Pass | `financing-widget` has empty `livePath` and is flagged as standalone deploy needed |
| Archive / ZIP card behavior | Pass | `Flash UI ZIP Archives` has empty `livePath`, `hasZip: true`, and `archive-needs-review` |

## Verified URLs

```txt
https://flash-ui-portfolio.vercel.app/
https://flash-ui-portfolio.vercel.app/data/site-registry.json
https://flash-ui-portfolio.vercel.app/Niche_Factory_1%20index.html
https://flash-ui-portfolio.vercel.app/Business%20Loan%20Affiliate%20Pillar%201%20index.html
https://flash-ui-portfolio.vercel.app/sites/AI%20Lab%201/
https://flash-ui-portfolio.vercel.app/sites/Startup%20Credit%20Stacker%20Console%201/
https://flash-ui-portfolio.vercel.app/sites/Stockout%20Death%20Spiral%20Estimator%201/
```

## Broken paths

None found in this representative verification pass.

## MIME/type issues

None found in this representative verification pass.

## Missing assets

No missing assets were found in the tested live paths.

## Warnings

- This was a representative verification pass, not a full crawl of all 52 deployable static assets.
- The requested `/sites` root-level HTML file test is currently not applicable because the registry does not contain any `sites-root-html` entries.
- Nested apps should remain non-openable from the static shell unless separately deployed.
- Archive/ZIP assets should remain Needs Review until a later ZIP inventory/extraction batch.

## Recommended next batch

Choose one:

1. **Exhaustive livePath crawl:** test every deployable registry `livePath` and create a broken-link table.
2. **Priority normalization:** select the best 10 live static starters and normalize/copy them into cleaner `/sites/[slug]/` paths.
3. **Deep ZIP inventory:** inspect ZIP contents before extracting anything.
