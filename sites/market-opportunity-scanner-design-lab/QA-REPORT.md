# Design Lab — QA Summary

## Deliverable

Ten self-contained variation routes, one interactive comparison gallery, shared demo scoring logic, and the unmodified original scanner under `/scanner/`.

## Acceptance coverage

- 10 variations tested in headless Chromium with actual theme HTML, CSS, original fixture data, and shared JavaScript.
- 140 primary behavior assertions plus relative-path and fragment verification: ranking, missing payer signals, opportunity selection, source records, shortlist actions, shortlist filtering, track/window scanning, Markdown export, accessibility/navigation hooks, and responsive widths.
- Additional layout checks at 320, 375, 390, 768, and 1440 px; no horizontal overflow in the 10 variations.
- Gallery tested at 390 and 1440 px: 10 cards, filtering, search, shortlist and selected-theme comparison, source image paths and destination routes.
- Original scanner acceptance suite passed separately, retaining CSV import behavior, scoring adjustments, honest briefs, responsive card tables, and keyboard-accessible semantics.
- Captured screenshot PNGs from the HTML pages in Chromium; gallery references these screenshots, not artificial concept art.

## Known intentionally incomplete features

- No live external APIs, AI inference, Supabase, n8n, OAuth or third-party data ingestion in these design previews.
- The design studies expose a focused subset of the original scanner. `scanner/index.html` preserves the richer original workflow.
- Fixture scores and source events are simulated; source provenance in the demo does **not** indicate actual market verification.
- The gallery and variation preferences are stored locally in the browser and are not shared across devices. Serve via localhost/static hosting for reliable origin-specific persistence.

## Deployment caution

This package did not modify GitHub or any Vercel project. If integrating with Flash UI Portfolio, place the entire package in a new additive subfolder (for example `/sites/ai-driven-market-opportunity-scanner/design-lab/`) and run the existing live-path smoke tests. Do not overwrite the canonical `data/site-registry.json` or existing production URL.
