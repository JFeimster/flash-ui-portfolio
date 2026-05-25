# Batch 20: Canonical Variant Hubs

Generated: 2026-05-25  
Branch: `batch-20`

## Purpose

Create concept-level variant hub pages without moving, renaming, or deleting existing variant folders.

This is the safe first step toward grouped cards and canonical `/sites/[slug]/` paths while preserving every current working variant URL.

## Hubs added

| Hub | Path | Variants linked |
|---|---|---:|
| AI Lab | `sites/ai-lab/index.html` | 3 |
| Attorney Referral Site | `sites/attorney-referral-site/index.html` | 3 |
| Funding Calculators & Tools Library | `sites/funding-calculators-tools-library/index.html` | 5 |

## Registry / manifest update

Added the hub folders to:

```txt
data/site-registry-batch-5-additions.json
```

This lets the existing loader create portfolio cards for the hub pages without rewriting:

```txt
data/site-registry.json
```

## What this batch intentionally does not do

- Does not move existing `/sites/[Concept N]/` variant folders.
- Does not delete root duplicates.
- Does not rename old folders.
- Does not change existing `livePath` values.
- Does not add redirects.
- Does not unlock Vercel deployments.

## Why this approach

Moving folders now would break existing smoke-tested URLs. The hub-first model gives the portfolio a cleaner concept-level browsing path while leaving old direct variant URLs intact.

## Next recommended step

After review, continue with a deeper Batch 20B using Codex/local filesystem access:

1. Generate more hubs from `data/asset-groups.json`.
2. Add grouped-card UI support.
3. Suppress duplicate root cards where `/sites` canonical copies exist.
4. Only then consider physical folder moves into `variant-n` folders.

## Vercel deployment note

Vercel Git deployments are intentionally locked with:

```json
"git": {
  "deploymentEnabled": false
}
```

Keep this lock until cleanup and grouping changes are ready for one controlled deployment.
