# Batch 21E Deferred Group Review

## Scope
Review and risk-classify deferred mixed-link/mixed-state groups from Batch 21D:
- ai-agent-library-for-entrepreneurs
- the-radical-libertarian
- ai-lab
- credit-incubator
- high-converting-lead-magnet

## Safe-to-fix-now
- the-radical-libertarian
  - Issue: mixed root vs `/static/` hub links
  - Verified: all three legacy target folders have root `index.html`; variant 2 and 3 also have `/static/index.html` with byte-identical content
  - Planned safe repair: update hub links for variants 2/3 to root folder paths
- ai-lab
  - Issue: empty old source remnants coexist with canonical variants
  - Verified: canonical variant-1/2/3 exist with `index.html`; old source folders are empty
  - Planned safe repair: remove empty old source remnants
- credit-incubator
  - Issue: empty old source remnants coexist with canonical variants
  - Verified: canonical variant-1/2/3 exist with `index.html`; old source folders are empty
  - Planned safe repair: remove empty old source remnants
- high-converting-lead-magnet
  - Issue: empty old source remnants coexist with canonical variants
  - Verified: canonical variant-1/2/3 exist with `index.html`; old source folders are empty
  - Planned safe repair: remove empty old source remnants

## Planning-only
- ai-agent-library-for-entrepreneurs
  - Issue: hub links target legacy encoded `/static/` subpaths; canonical `variant-*` folders do not exist
  - Verified: old source folders contain actual extracted content and ZIP artifacts; root and `/static/index.html` are identical, but canonical migration target is not established
  - Action: defer execution; keep links unchanged in Batch 21E

## Skip/manual-review
- none

## Notes
- No registry edits are required for this batch.
- No Vercel/deploy actions are required for this batch.
