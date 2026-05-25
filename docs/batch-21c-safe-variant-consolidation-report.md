# Batch 21C Safe Variant Consolidation Report

## Scope

- Applied groups: `ai-lab`, `credit-incubator`, `high-converting-lead-magnet`
- Batch was limited to already-hubbed groups only
- `--all --apply` was not run

## Commands Run

```bash
node scripts/consolidate-variant-group.mjs --group ai-lab
node scripts/consolidate-variant-group.mjs --group credit-incubator
node scripts/consolidate-variant-group.mjs --group high-converting-lead-magnet
node scripts/consolidate-variant-group.mjs --group ai-lab --apply
node scripts/consolidate-variant-group.mjs --group credit-incubator --apply
node scripts/consolidate-variant-group.mjs --group high-converting-lead-magnet --apply
node -e "const fs=require('fs'); ['sites/ai-lab/index.html','sites/ai-lab/variant-1/index.html','sites/ai-lab/variant-2/index.html','sites/ai-lab/variant-3/index.html','sites/credit-incubator/index.html','sites/credit-incubator/variant-1/index.html','sites/credit-incubator/variant-2/index.html','sites/credit-incubator/variant-3/index.html','sites/high-converting-lead-magnet/index.html','sites/high-converting-lead-magnet/variant-1/index.html','sites/high-converting-lead-magnet/variant-2/index.html','sites/high-converting-lead-magnet/variant-3/index.html'].forEach(p=>{if(!fs.existsSync(p)){throw new Error('Missing '+p)}; console.log('OK',p)})"
node -e "const fs=require('fs'); ['sites/AI Lab 1','sites/AI Lab 2','sites/AI Lab 3','sites/Credit Incubator 1','sites/Credit Incubator 2','sites/Credit Incubator 3','sites/High-Converting Lead Magnet 1','sites/High-Converting Lead Magnet 2','sites/High-Converting Lead Magnet 3'].forEach(p=>{if(fs.existsSync(p)){throw new Error('Still exists '+p)}; console.log('REMOVED',p)})"
git status
git diff --stat
```

## Dry-Run Results

- `ai-lab`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `credit-incubator`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`
- `high-converting-lead-magnet`: `DRY-RUN summary: groups=1, variants=3, moved=0, warnings=0, errors=0`

## Apply Results

- `ai-lab`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `credit-incubator`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`
- `high-converting-lead-magnet`: `APPLY summary: groups=1, variants=3, moved=3, warnings=0, errors=0`

## Files And Folders Moved

- `sites/AI Lab 1` -> `sites/ai-lab/variant-1`
- `sites/AI Lab 2` -> `sites/ai-lab/variant-2`
- `sites/AI Lab 3` -> `sites/ai-lab/variant-3`
- `sites/Credit Incubator 1` -> `sites/credit-incubator/variant-1`
- `sites/Credit Incubator 2` -> `sites/credit-incubator/variant-2`
- `sites/Credit Incubator 3` -> `sites/credit-incubator/variant-3`
- `sites/High-Converting Lead Magnet 1` -> `sites/high-converting-lead-magnet/variant-1`
- `sites/High-Converting Lead Magnet 2` -> `sites/high-converting-lead-magnet/variant-2`
- `sites/High-Converting Lead Magnet 3` -> `sites/high-converting-lead-magnet/variant-3`

## Old `/sites` Folders Removed

- `sites/AI Lab 1`
- `sites/AI Lab 2`
- `sites/AI Lab 3`
- `sites/Credit Incubator 1`
- `sites/Credit Incubator 2`
- `sites/Credit Incubator 3`
- `sites/High-Converting Lead Magnet 1`
- `sites/High-Converting Lead Magnet 2`
- `sites/High-Converting Lead Magnet 3`

## Hub Links Updated

- `sites/ai-lab/index.html`
  - `/sites/AI%20Lab%201/` -> `/sites/ai-lab/variant-1/`
  - `/sites/AI%20Lab%202/` -> `/sites/ai-lab/variant-2/`
  - `/sites/AI%20Lab%203/` -> `/sites/ai-lab/variant-3/`
- `sites/credit-incubator/index.html`
  - `/sites/Credit%20Incubator%201/` -> `/sites/credit-incubator/variant-1/`
  - `/sites/Credit%20Incubator%202/` -> `/sites/credit-incubator/variant-2/`
  - `/sites/Credit%20Incubator%203/` -> `/sites/credit-incubator/variant-3/`
- `sites/high-converting-lead-magnet/index.html`
  - `/sites/High-Converting%20Lead%20Magnet%201/` -> `/sites/high-converting-lead-magnet/variant-1/`
  - `/sites/High-Converting%20Lead%20Magnet%202/` -> `/sites/high-converting-lead-magnet/variant-2/`
  - `/sites/High-Converting%20Lead%20Magnet%203/` -> `/sites/high-converting-lead-magnet/variant-3/`

## Warnings And Errors

- Warnings: none
- Errors: none

## Explicit Non-Changes

- Root-level duplicate folders were not touched
- `vercel.json` was not touched
- `data/site-registry.json` was not touched
- No deploy was run
- No Vercel unlock was performed

## Recommended Next Batch

- Batch 21D: consolidate remaining already-hubbed groups after review
