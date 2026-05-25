# Standalone App Deployment Plan

Batch 17 audits standalone app deployment candidates in Flash UI Portfolio OS.

This batch is audit-only. It does not deploy apps, move folders, rename folders, rewrite registries, or change live paths.

## Created file

```txt
data/standalone-app-candidates.json
```

## Why this exists

The portfolio contains two broad asset classes:

1. static assets that can live safely inside the portfolio
2. standalone app candidates that need their own build/deploy review

Static assets can be opened under the portfolio. Standalone apps usually contain package manifests, framework code, build steps, dependencies, or app routing. They should not be forced into the static portfolio flow just because they happen to sit in the same repo.

## Primary candidates audited

| Priority | Candidate | Path | Framework guess | Business priority | Recommendation |
|---:|---|---|---|---|---|
| 1 | Financing Widget | `financing-widget` | Next.js 15 / React 19 | High | Build-audit first; likely dedicated repo/project candidate |
| 2 | Moonshine Affiliate Hub | `moonshine-affiliate-hub` | Next.js 15 / React 19 | High | Build/typecheck audit; decide if it becomes canonical partner app |
| 3 | Moonshine Editorial Bento | `Moonshine Editorial Bento` | Next.js 14 / React 18 | Medium | Keep in portfolio until editorial role is clearer |

## Candidate details

### Financing Widget

Package evidence:

- `next` 15.1.6
- `react` 19.0.0
- `react-dom` 19.0.0
- scripts include `next dev`, `next build`, `next start`, and `next lint`

Recommended Vercel strategy:

```txt
Root directory: financing-widget
Framework preset: Next.js
Build command: npm run build
Output directory: Vercel default
```

Recommended next action:

Run a build-readiness audit. If it passes, split into a dedicated Vercel project and likely a dedicated repo.

Why it matters:

This is the strongest monetization candidate because it maps directly to embedded financing, partner lead capture, and B2B funding flows.

### Moonshine Affiliate Hub

Package evidence:

- `next` 15.3.0
- `react` 19.1.0
- `react-dom` 19.1.0
- scripts include `next dev`, `next build`, `next start`, `next lint`, and `typecheck`

Recommended Vercel strategy:

```txt
Root directory: moonshine-affiliate-hub
Framework preset: Next.js
Build command: npm run build
Output directory: Vercel default
```

Recommended next action:

Run typecheck/build and compare its role against existing partner enablement assets. Promote only if it becomes the canonical partner/affiliate hub.

Why it matters:

It could become the actual partner OS, but deploying it prematurely could fragment partner workflows.

### Moonshine Editorial Bento

Package evidence:

- `next` 14.2.11
- `react` 18.3.1
- `react-dom` 18.3.1
- scripts include `next dev`, `next build`, `next start`, and `next lint`

Recommended Vercel strategy:

```txt
Root directory: Moonshine Editorial Bento
Framework preset: Next.js
Build command: npm run build
Output directory: Vercel default
```

Recommended next action:

Inspect routes and design ideas. Fold useful patterns into content hub strategy unless a standalone product use case emerges.

Why it matters:

It may be useful, but its direct monetization path is weaker than the financing and affiliate candidates.

## Source-package candidates

The static extraction registry also contains many archived Next.js packages inside `/sites` folders. These are not primary deployment candidates yet because static alternatives were already extracted.

Examples include:

```txt
sites/Affiliate Agency Launch Funnel */Next.js/*.zip
sites/Affiliate ID Generator Tool */flash-ui-nextjs-*.zip
sites/AI Agent Library for Entrepreneurs */flash-ui-nextjs-*.zip
sites/AI Funding Strategist Landing Page */Next.js/*.zip
```

Recommended handling:

- preserve them
- do not delete them
- do not deploy from archive by default
- review only if the extracted static version is insufficient
- promote only if there is a specific product reason

## Recommended priority order

1. `financing-widget`
2. `moonshine-affiliate-hub`
3. `moonshine-editorial-bento`

## Build audit checklist

Before deploying any candidate:

- inspect package manager / lockfile
- install dependencies in isolated environment
- run typecheck if available
- run lint if practical
- run build
- inspect routes/pages/app structure
- identify required env vars
- identify forms/API calls
- identify external service dependencies
- test local preview or Vercel preview
- review copy/compliance language
- define canonical production URL
- decide whether it remains in portfolio, moves to `/apps`, or becomes a separate repo

## Vercel deployment checklist for standalone app

When approved:

1. Create or select dedicated Vercel project.
2. Set root directory to candidate folder.
3. Use Next.js framework preset.
4. Set build command to `npm run build` unless audit says otherwise.
5. Add required environment variables.
6. Deploy preview.
7. Smoke test homepage and key routes.
8. Decide whether to connect a custom domain.
9. Add deployment metadata back to portfolio.

## Do not do yet

- do not deploy any candidate from Batch 17
- do not move folders
- do not rename folders
- do not rewrite `data/site-registry.json`
- do not change `livePath` values
- do not delete source ZIPs

## Recommended next move

After Batch 17, proceed to Batch 18 for slug normalization planning, or run a dedicated build-readiness audit for `financing-widget` if standalone deployment becomes the priority.
