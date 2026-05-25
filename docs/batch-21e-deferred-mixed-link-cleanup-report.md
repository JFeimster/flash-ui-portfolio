# Batch 21E: Deferred Mixed-Link Cleanup Report

## Scope
Conservative review-and-repair batch for deferred mixed-link/mixed-state groups only:
- ai-agent-library-for-entrepreneurs
- the-radical-libertarian
- ai-lab
- credit-incubator
- high-converting-lead-magnet

## Groups Reviewed
- ai-agent-library-for-entrepreneurs
- the-radical-libertarian
- ai-lab
- credit-incubator
- high-converting-lead-magnet

## Current-State Findings
- `ai-agent-library-for-entrepreneurs`
  - Canonical hub exists: `sites/ai-agent-library-for-entrepreneurs/index.html`
  - Canonical `variant-*` folders: none
  - Hub links target legacy encoded folders with `/static/` subpaths
  - Old source folders contain extracted files and ZIP artifacts; links resolve to valid `static/index.html`
- `the-radical-libertarian`
  - Canonical hub exists: `sites/the-radical-libertarian/index.html`
  - Canonical `variant-*` folders: none
  - Hub was mixed: variant 1 root path; variants 2/3 `/static/`
  - Variants 2/3 have both root and static index files with identical content
- `ai-lab`
  - Canonical hub and variant-1/2/3 folders exist with `index.html`
  - Hub already points to canonical `variant-*` paths
  - Old source folders (`AI Lab 1/2/3`) were empty remnants
- `credit-incubator`
  - Canonical hub and variant-1/2/3 folders exist with `index.html`
  - Hub already points to canonical `variant-*` paths
  - Old source folders (`Credit Incubator 1/2/3`) were empty remnants
- `high-converting-lead-magnet`
  - Canonical hub and variant-1/2/3 folders exist with `index.html`
  - Hub already points to canonical `variant-*` paths
  - Old source folders (`High-Converting Lead Magnet 1/2/3`) were empty remnants

## Groups Fixed
- `the-radical-libertarian`
  - Hub links updated to consistent root path shape for variants 1/2/3
- `ai-lab`
  - Empty old source remnants removed from local `/sites` workspace (`AI Lab 1/2/3`)
- `credit-incubator`
  - Empty old source remnants removed from local `/sites` workspace (`Credit Incubator 1/2/3`)
- `high-converting-lead-magnet`
  - Empty old source remnants removed from local `/sites` workspace (`High-Converting Lead Magnet 1/2/3`)

## Groups Left Planning-Only
- `ai-agent-library-for-entrepreneurs`
  - Deferred due missing canonical `variant-*` target structure and potentially intentional `/static/` link shape

## Groups Skipped
- none

## Hub Links Updated
- `sites/the-radical-libertarian/index.html`
  - `/sites/The%20Radical%20Libertarian%202/static/` -> `/sites/The%20Radical%20Libertarian%202/`
  - `/sites/The%20Radical%20Libertarian%203/static/` -> `/sites/The%20Radical%20Libertarian%203/`

## Old Folders Removed
- Removed from local workspace only (empty, untracked directories):
  - `sites/AI Lab 1`
  - `sites/AI Lab 2`
  - `sites/AI Lab 3`
  - `sites/Credit Incubator 1`
  - `sites/Credit Incubator 2`
  - `sites/Credit Incubator 3`
  - `sites/High-Converting Lead Magnet 1`
  - `sites/High-Converting Lead Magnet 2`
  - `sites/High-Converting Lead Magnet 3`

## Verification Summary
- All five hubs exist.
- For updated group (`the-radical-libertarian`), all hub link targets now resolve to existing folders with `index.html`.
- `ai-lab`, `credit-incubator`, and `high-converting-lead-magnet` hub links resolve to canonical `variant-*` targets with `index.html`.
- No old `/static/` links remain for Radical variants 2/3 after update.
- No unrelated tracked files changed.

## Exact Commands Run
- `git fetch origin`
- `git checkout main`
- `git reset --hard origin/main`
- `git clean -fd`
- `git status`
- `git checkout -b batch-21e-deferred-mixed-link-cleanup`
- targeted PowerShell inspections for hubs, links, variant folders, and old source folders
- created:
  - `data/migration-reports/batch-21e-deferred-group-review.json`
  - `docs/batch-21e-deferred-group-review.md`
- updated hub links in:
  - `sites/the-radical-libertarian/index.html`
- removed empty old local remnants under `/sites` for:
  - ai-lab
  - credit-incubator
  - high-converting-lead-magnet

## Files Changed
- `data/migration-reports/batch-21e-deferred-group-review.json`
- `docs/batch-21e-deferred-group-review.md`
- `docs/batch-21e-deferred-mixed-link-cleanup-report.md`
- `sites/the-radical-libertarian/index.html`

## Explicit Non-Changes
- `vercel.json` not touched
- `data/site-registry.json` not touched
- no registry file rewrite performed
- no `livePath` edits performed
- no root-level duplicate folder cleanup performed
- no ZIP file deletion performed
- no standalone app folder edits performed
- no deployment run
- no Vercel unlock performed
- no `--all --apply` usage

## Remaining Risks
- `ai-agent-library-for-entrepreneurs` still depends on legacy encoded folder links and `/static/` subpaths; canonical `variant-*` migration target remains undefined.
- Legacy encoded source folders for `the-radical-libertarian` remain in place by design in this conservative batch.

## Recommended Next Batch
- Dedicated canonicalization decision batch for unresolved legacy-link groups:
  - define approved canonical URL shapes for groups without `variant-*` targets
  - perform per-group migrations only after explicit structure validation
