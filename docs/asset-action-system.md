# Asset Action System

Batch 13 adds display metadata for portfolio card actions.

Created files:
- data/asset-actions.json
- assets/js/asset-actions.js
- docs/asset-action-system.md

Purpose:
The action system lets cards show better next steps based on asset type. Live sites get open and copy actions. Widget assets can expose embed-oriented actions. Funding tools can point toward landing-page planning. Partner assets can point toward campaign planning. Nested app candidates and archive assets point users toward source and review details.

Guardrails:
- Do not rewrite data/site-registry.json.
- Do not change livePath values.
- Do not rename or move /sites folders.
- Do not delete ZIP files.
- Do not change vercel.json.
- Preserve Advanced / Dev Details.

Current supported action labels:
- Open Site
- Copy Link
- View Details
- View Source
- Preview Embed
- Copy Embed Code
- Landing Draft
- Campaign Notes
- Deploy Candidate
- Review Notes
- Smoke Test Result

Rule order:
1. Nested app candidates
2. Archive and manual-review assets
3. Widget or embed assets
4. Funding tools and calculators
5. Partner, referral, and affiliate assets
6. AI agent and prompt libraries
7. Generic live static sites

Frontend behavior:
The helper script loads data/asset-actions.json, chooses the best rule for each rendered card, and replaces the visible action row. If metadata loading fails, the existing app.js card actions remain in place.

Future upgrades:
Later batches can connect these action labels to richer modals, curation reports, campaign notes, public-directory mode, or dedicated planning pages.
