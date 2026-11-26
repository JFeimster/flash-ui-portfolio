# AI-Driven Market Opportunity Scanner — Interactive Design Lab

Juliet Foxtrot Ventures · 10 functioning HTML/CSS design directions · v1.0

## Start

**No install or build required.** Extract this folder, then open `index.html` to access the gallery and select a variation. Every variation has a real responsive website with a functional research interface. Static file paths are relative and work when hosted in a subdirectory.

For the most consistent browser storage and file loading behavior, use a local HTTP server:

```bash
cd market-opportunity-scanner-design-lab
python -m http.server 8765
# Open http://localhost:8765/
```

Deploy this entire directory as a static site, or copy it under `sites/ai-driven-market-opportunity-scanner/design-lab/` **without changing the existing scanner root route**. Copying under `design-lab/` preserves original production URLs. No GitHub, Vercel, registry or database writes were performed to create this deliverable.

## Contents

| Path | Description |
| --- | --- |
| `index.html` | Interactive gallery: search, filters, shortlist style preferences, compare modal, links to all 10 demos |
| `variations/<slug>/index.html` | Ten distinct fully responsive layout designs (each is an actual HTML page) |
| `assets/css/core.css` | Shared accessible layout and component styles |
| `assets/css/themes.css` | Ten bespoke theme systems, including signature CSS-only hero artwork |
| `assets/js/preview.js` | Shared deterministic evidence grouping/scoring, track/window filters, shortlist, opportunity details, Markdown export |
| `assets/css/gallery.css` and `assets/js/gallery.js` | Design selection/gallery functionality |
| `assets/screenshots/*.png` | Screenshots of **actual rendered HTML designs** |
| `assets/theme-references/*.webp` | Your supplied archived theme-library reference images (not new HTML screenshots) |
| `data/fixtures.json` / `data/fixtures.js` | Original fictional opportunity scanner demo fixtures |
| `data/design-variations.json` | Additive variation registry for portfolio integration |
| `data/master-theme-reference.json` | Exact relevant theme objects from supplied v1.3.0 master JSON |
| `scanner/` | **Unmodified original functional scanner**, including CSV import, editable sizing and browser acceptance tests |
| `tests/` | Browser acceptance scripts for variations and gallery |

## Ten distinct design routes

1. `/variations/brokers-manifesto/`
2. `/variations/violet-ledger/`
3. `/variations/punk-utility-brutalism/`
4. `/variations/ember-matrix/`
5. `/variations/the-capital-machine/`
6. `/variations/celestial-capital/`
7. `/variations/liquid-amethyst-ai/`
8. `/variations/lime-precision-fintech/`
9. `/variations/violet-event-horizon/`
10. `/variations/cobalt-velocity-agency/`

`/scanner/` is the full original research application. The 10 variations are interactive design studies that intentionally expose a slimmer set of research functions; they do not replace the original, more extensive CSV/market-sizing workflow.

## Working functionality in each variation

- Navigation links jump to live page sections: Scan, Opportunities, Evidence, Brief; the header selector opens other variations, gallery link goes home.
- Run sample scan from the hero or filter toolbar. Filter by one of three research tracks and the research time window.
- Deterministic 4-factor priority scoring (pain 30%, spend 30%, reachability 20%, timing 20%) from distinct evidence events. Contradictory and repeated reports never create artificial buyer demand; missing spending evidence prevents a `Test` decision.
- Visual demo trend chart updates with the selected research scope.
- Click an opportunity to inspect its buyer, payer, workaround, trigger, alternatives, decision, priority score, confidence heuristic and source ledger.
- Filter the ledger by source category. Research claims show stance and supporting source dates.
- Save/unsave opportunities to a cross-variation local shortlist. Filter to shortlisted opportunities.
- Download or copy an honest one-page Markdown decision brief, including uncertainty and experiment/stop conditions.
- Keyboard-visible focus styles, reduced-motion styling, mobile layouts, semantic navigation and source/label descriptions.

All data is **fictional/simulated**, including any "measured behavior" in fixture labels. Nothing here asserts verified actual market demand. No live integrations, OAuth flows, AI model calls, payments, or remote database access. Priority and confidence are transparent **demo heuristics** rather than forecasts or verified probabilities. `localStorage` is browser-local, not a secure shared customer database.

## Quality checks

```bash
python tests/browser_test.py
python tests/gallery_test.py
python scanner/tests/browser_test.py
```

These Playwright scripts require Chromium and `playwright`. The suite injects browser assets into a local test page because some test environments block `file://` and localhost navigation. This restriction does not reflect normal static-hosted behavior. All relative paths, anchors, gallery screenshots, and functional interactions are tested separately.

## Integration guidance

Follow the Flash UI Portfolio repo conventions:

- Do not rewrite `data/site-registry.json` unless the owner explicitly approves.
- Keep live scanner URLs intact. Use a subdirectory for these previews if the app already has a home route.
- Add curation/variation metadata separately from the canonical registry.
- After a real repository update/deployment, verify live static paths and CSS/JS/data asset URLs using the existing smoke test workflow.
- Do not independently deploy or create database/app integrations without explicit authorization.
