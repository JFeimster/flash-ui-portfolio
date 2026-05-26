# Batch 22C Compile Report

## Summary
- Compiled Funding Intelligence Engine variants and safe singleton legacy folders into canonical hubs under /sites/[slug]/variant-n/.
- Skipped Startup Credit Stacker Console due to reparse-point and unreadable/untracked safety issues.

## Groups inspected
- Funding Intelligence Engine 1
- Funding Intelligence Engine 2
- acquisition financing calculator 1
- CFO-in-a-Box 1
- Embed Widget Studio 2
- Partner & Account Portal 1
- Static Site Prompt Generator for FLASH-UI 1
- Stockout Death Spiral Estimator 1
- Startup Credit Stacker Console 1
- Startup Credit Stacker Console 2
- Startup Credit Stacker Console 3
- Startup Credit Stacker Console 4

## Groups compiled
- funding-intelligence-engine
- acquisition-financing-calculator
- cfo-in-a-box
- embed-widget-studio
- partner-account-portal
- static-site-prompt-generator-for-flash-ui
- stockout-death-spiral-estimator

## Groups skipped
- startup-credit-stacker-console
  - Reason: folders 1-4 are OneDrive reparse-point stubs, untracked by Git, and unreadable in this workspace.

## Hubs created
- /sites/funding-intelligence-engine/index.html
- /sites/acquisition-financing-calculator/index.html
- /sites/cfo-in-a-box/index.html
- /sites/embed-widget-studio/index.html
- /sites/partner-account-portal/index.html
- /sites/static-site-prompt-generator-for-flash-ui/index.html
- /sites/stockout-death-spiral-estimator/index.html

## Folders moved
- /sites/Funding Intelligence Engine 1 -> /sites/funding-intelligence-engine/variant-1
- /sites/Funding Intelligence Engine 2 -> /sites/funding-intelligence-engine/variant-2
- /sites/acquisition financing calculator 1 -> /sites/acquisition-financing-calculator/variant-1
- /sites/CFO-in-a-Box 1 -> /sites/cfo-in-a-box/variant-1
- /sites/Embed Widget Studio 2 -> /sites/embed-widget-studio/variant-2
- /sites/Partner & Account Portal 1 -> /sites/partner-account-portal/variant-1
- /sites/Static Site Prompt Generator for FLASH-UI 1 -> /sites/static-site-prompt-generator-for-flash-ui/variant-1
- /sites/Stockout Death Spiral Estimator 1 -> /sites/stockout-death-spiral-estimator/variant-1

## Folders deleted
- None (only canonical moves; no explicit deletions).

## Remaining legacy sibling folders
- /sites/Startup Credit Stacker Console 1
- /sites/Startup Credit Stacker Console 2
- /sites/Startup Credit Stacker Console 3
- /sites/Startup Credit Stacker Console 4

## Verification summary
- Canonical hub and variant folders exist for every compiled group.
- Variant entry points verified at index.html (or static/index.html fallback where applicable).
- Hub links point to canonical /sites/[slug]/variant-n/ paths.
- Old sibling folders no longer exist after git mv.
- ZIP files not deleted.
- data/site-registry.json unchanged.
- ercel.json unchanged.

## Explicit non-changes
- ercel.json not touched.
- data/site-registry.json not touched.
- Registry files not rewritten.
- ZIP files not deleted.
- No deployment run.
- No Vercel unlock performed.
- Standalone app conversions not performed.

## Recommended next batch
- Batch 22D: resolve Startup Credit Stacker Console OneDrive/reparse-point folder state, recover tracked source if available, then compile to canonical hub variants if safe.
