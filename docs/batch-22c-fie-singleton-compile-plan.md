# Batch 22C Pre-Apply Compile Plan

## Scope
- Primary target: Funding Intelligence Engine (1, 2)
- Singleton candidates: acquisition financing calculator 1, CFO-in-a-Box 1, Embed Widget Studio 2, Partner & Account Portal 1, Static Site Prompt Generator for FLASH-UI 1, Stockout Death Spiral Estimator 1
- Manual-review group: Startup Credit Stacker Console (1-4)

## Groups inspected
- 12 folders under /sites were inspected for entry points, package markers, zip/source artifacts, and readability.

## Proposed for compile
- unding-intelligence-engine from:
  - /sites/Funding Intelligence Engine 1 -> /sites/funding-intelligence-engine/variant-1
  - /sites/Funding Intelligence Engine 2 -> /sites/funding-intelligence-engine/variant-2
- cquisition-financing-calculator:
  - /sites/acquisition financing calculator 1 -> /sites/acquisition-financing-calculator/variant-1
- cfo-in-a-box:
  - /sites/CFO-in-a-Box 1 -> /sites/cfo-in-a-box/variant-1
- mbed-widget-studio:
  - /sites/Embed Widget Studio 2 -> /sites/embed-widget-studio/variant-2
- partner-account-portal:
  - /sites/Partner & Account Portal 1 -> /sites/partner-account-portal/variant-1
- static-site-prompt-generator-for-flash-ui:
  - /sites/Static Site Prompt Generator for FLASH-UI 1 -> /sites/static-site-prompt-generator-for-flash-ui/variant-1
- stockout-death-spiral-estimator:
  - /sites/Stockout Death Spiral Estimator 1 -> /sites/stockout-death-spiral-estimator/variant-1

## Skipped groups
- startup-credit-stacker-console skipped.
- Reason: folders Startup Credit Stacker Console 1-4 are reparse-point stubs in this workspace, not tracked by Git, and unreadable (index.html not accessible).

## Proposed hubs
- /sites/funding-intelligence-engine/index.html
- /sites/acquisition-financing-calculator/index.html
- /sites/cfo-in-a-box/index.html
- /sites/embed-widget-studio/index.html
- /sites/partner-account-portal/index.html
- /sites/static-site-prompt-generator-for-flash-ui/index.html
- /sites/stockout-death-spiral-estimator/index.html

## Risks
- OneDrive reparse-point attributes exist on all inspected legacy folders.
- Safe compile in this run limited to tracked + readable folders.
- Startup Credit Stacker remains blocked by permission/read anomalies.

## Explicit non-changes
- ercel.json not touched.
- data/site-registry.json not touched.
- Registry files not rewritten.
- livePath values not changed.
- ZIP files not deleted.
- Source packages not deleted.
- No deployment run.
- No Vercel unlock.
- No standalone app conversion.
