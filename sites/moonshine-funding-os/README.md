# Funding Intelligence Engine Frontend MVP v0.1.0

A deployable static MVP for Moonshine Capital's Funding Intelligence Engine.

## Recommended frontend baseline

Use the **static Flash-UI export** as the immediate MVP baseline, not Next.js.

Why:

- The current objective is a visible, testable MVP, not a full application framework.
- The static export already matches the requested Flash-UI direction and avoids build tooling.
- Vercel can deploy this folder directly with no install command and no build command.
- The MVP still consumes the FIE JSON/routing files in `/data`.

Next.js can come later when the project needs auth, API routes, server-side CRM submission, database writes, or partner dashboards.

## What this MVP demonstrates

1. Borrower intake
2. Funding readiness scoring
3. Borrower archetype classification
4. Funding-family routing
5. White-labeled public recommendations
6. Internal analyst/debug panel
7. Compliance-safe language
8. Vercel deployment readiness

## File structure

```txt
fie-frontend-mvp-v0.1.0/
├── index.html
├── styles.css
├── app.js
├── vercel.json
├── README.md
├── data/
│   ├── app_config.json
│   ├── providers.json
│   ├── products.json
│   ├── routing_logic.json
│   ├── recommendation_weights.json
│   ├── borrower_archetypes.json
│   ├── readiness_dimensions.json
│   ├── risk_flags.json
│   └── partner_fit_scoring.json
└── docs/
    └── implementation-notes.md
```

## Local testing

Do not open `index.html` directly with `file://` because the browser may block JSON fetches.

Use a simple local static server:

```bash
cd fie-frontend-mvp-v0.1.0
python -m http.server 8080
```

Then open:

```txt
http://localhost:8080
```

## Deploy to Vercel

### Option A — Vercel dashboard

1. Create a new GitHub repo, for example `funding-intelligence-engine-frontend`.
2. Upload/commit the contents of this folder.
3. In Vercel, import the repo.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank or `.`.
7. Install command: leave blank.
8. Deploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd fie-frontend-mvp-v0.1.0
vercel
vercel --prod
```

## GitHub commit suggestion

```bash
git init
git add .
git commit -m "Add Funding Intelligence Engine frontend MVP"
```

## Integration hook

After each calculation, the frontend exposes:

```js
window.fieMvpResult
```

and dispatches:

```js
fieMvpCalculated
```

Use that event later for HubSpot, n8n, Airtable, Google Sheets, or a backend API handoff.

## Compliance guardrails

The public output intentionally avoids:

- approved
- guaranteed
- you qualify
- instant approval
- best rates guaranteed

It uses:

- funding readiness
- potential funding paths
- may be a fit
- based on your answers
- subject to review
- not an approval
- not a funding offer

## Next-step backlog

### P0 — MVP hardening

- Add form validation for required contact fields.
- Add HubSpot/n8n webhook submission.
- Add UTM capture and hidden attribution fields.
- Add event tracking for quiz started, completed, and CTA clicked.
- Add more granular desired funding amount logic.

### P1 — Data/routing improvements

- Replace fallback formulas with fully normalized `readiness_dimensions.json` execution.
- Add `funding_families.json`, `funding_use_cases.json`, `document_requirements.json`, and `monetization_routes.json` once finalized.
- Add provider/product source-status labels inside analyst panel.
- Add manual-review reasons from product/provider records.

### P2 — Productization

- Create embeddable widget variant.
- Create broker/affiliate co-branded version.
- Add partner referral ID support.
- Add vertical-specific variants: ecommerce, contractors, real estate, gig workers, startups.

### P3 — Next.js upgrade trigger

Move to Next.js only when you need:

- authenticated internal analyst views
- API routes
- secure lead submission
- CRM writes
- user accounts
- partner dashboards
- server-side logging
```
