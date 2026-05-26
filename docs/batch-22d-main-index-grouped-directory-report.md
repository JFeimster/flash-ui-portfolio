# Batch 22D — Main Index Grouped Visual Directory

## Summary

Batch 22D adds an additive grouped-directory layer to the main Flash UI Portfolio homepage.

The main index now prefers canonical group hub cards where hub metadata exists, while preserving access to individual variants through advanced toggles.

## Branch

`batch-22d-directory`

## Files changed

- `index.html`
- `assets/js/grouped-directory.js`
- `assets/css/styles.css`
- `data/group-display-rules.json`
- `docs/batch-22d-main-index-grouped-directory-report.md`

## Implementation model

This batch intentionally avoids rewriting the existing `assets/js/app.js` loader.

Instead, it adds `assets/js/grouped-directory.js` after the existing app script. The grouped layer fetches the same registry sources plus grouping metadata and then re-renders the card grid into grouped directory mode.

## Data sources consumed

- `data/site-registry.json`
- `data/site-registry-batch-5-additions.json`
- `data/site-registry-static-extractions.json`
- `data/asset-groups.json`
- `data/group-display-rules.json`

## Main behavior

- Shows one primary card per canonical group hub where a group is allowed by `data/group-display-rules.json`.
- Uses `/sites/{groupId}/` as the canonical hub URL.
- Hides individual variant cards by default when they are covered by a canonical group.
- Preserves ungrouped assets.
- Adds toggle controls for:
  - Show individual variants
  - Show archives / source packages
  - Show needs-review assets
- Preserves search.
- Rebuilds category and status filters for grouped-mode rows.
- Adds group hub cards with:
  - title
  - category
  - variant count
  - variant text strip
  - Open Hub CTA
  - Copy Hub Link action

## Guardrail verification

- `data/site-registry.json` unchanged.
- `vercel.json` unchanged.
- No files deleted.
- No `/sites` folders moved.
- No extracted site files modified.
- No Vercel deployment run.
- No Vercel unlock performed.

## Grouped asset count

The first-pass allowlist in `data/group-display-rules.json` contains 33 canonical group IDs.

## Suppressed variant count

Individual variants are suppressed dynamically at render time when their title/path matches a canonical group from `data/asset-groups.json`. Suppression is reversible with the “Show individual variants” toggle.

## Remaining ungrouped assets

Ungrouped assets remain visible by default unless they are archive/needs-review entries hidden by display rules.

## Risks

- This is a browser-layer grouping pass, not a registry rewrite.
- If a group is listed in `canonicalGroupIds` but the corresponding hub path does not exist, the card may link to a non-existent hub. The allowlist was built from known canonical hub work through Batch 22C.
- The base app still renders first, then the grouped overlay re-renders shortly afterward. This keeps the change reversible but may show a brief loading transition.

## Recommended next batch

Batch 22E — Add screenshot-based variant hub previews.
