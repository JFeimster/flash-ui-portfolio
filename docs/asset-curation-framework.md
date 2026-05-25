# Asset Curation Framework

Batch 14 adds a lightweight curation layer for the Flash UI Portfolio OS.

## Purpose

The portfolio already answers: what assets exist and which ones load.

The curation layer starts answering the more useful operator questions:

- Which assets are worth polishing?
- Which should become lead magnets?
- Which should become Wix embeds or partner widgets?
- Which should become affiliate or referral tools?
- Which deserve standalone deployment review?
- Which should stay archived?

This is intentionally a first-pass decision layer, not a final judgment from Mount Spreadsheet.

## Created file

```txt
data/asset-curation.json
```

## Guardrails

The curation file is additive and display-oriented.

It must not:

- rewrite `data/site-registry.json`
- rename folders
- move `/sites` assets
- change `livePath` values
- delete ZIP files
- extract archives
- convert Next.js apps
- change Vercel deployment settings

Working links stay sacred until a slug normalization or redirect plan is approved.

## Scoring scale

| Score | Meaning |
|---:|---|
| 1 | Low priority / archive only unless specifically needed |
| 2 | Rough prototype / useful concept but needs heavy review |
| 3 | Viable internal asset / needs polish before public sharing |
| 4 | Strong candidate / worth polishing or embedding |
| 5 | Priority asset / ready or near-ready for promotion |

## Core fields

Each curated asset can include:

| Field | Purpose |
|---|---|
| `slug` | Registry slug or stable inferred slug |
| `title` | Human-readable title |
| `qualityScore` | First-pass 1-5 score |
| `businessValue` | Commercial usefulness: low, medium, high |
| `brandFit` | Fit with Moonshine / Flash UI Portfolio direction |
| `monetizationPotential` | Likelihood the asset can support leads, partners, services, or products |
| `recommendedUse` | Best current use case |
| `targetAudience` | Most likely audience |
| `needsCopyReview` | Whether copy requires human review |
| `needsDesignReview` | Whether design requires human review |
| `readyForPublicDirectory` | Whether it should appear in future public mode |
| `recommendedNextAction` | Practical next move |

## Recommended use values

Current use categories:

```txt
lead-magnet
embed-widget
affiliate-tool
partner-enablement
content-hub
internal-tool
standalone-app-candidate
archive
manual-review
```

These values are meant to drive future directory modes and workflows, especially Batch 15 public mode and Batch 17 standalone app audit.

## First-pass heuristic rules

The metadata includes heuristic scoring rules for broad asset families:

- funding tools, calculators, analyzers, scorecards, and diagnostics
- partner, referral, affiliate, and vertical microsite assets
- widgets and embed assets
- AI agent and prompt libraries
- content hubs and editorial/library assets
- standalone app candidates
- archives, docs, ZIPs, and manual-review items

These rules are not meant to be perfect. They are a triage system. The goal is to create a usable first-pass curation map without pretending every AI-generated asset received a full product audit.

## Manual review flags

The framework uses review flags to prevent premature promotion:

| Flag | Meaning |
|---|---|
| `logic-review-required` | Calculator/scoring/routing logic needs review |
| `cta-review-required` | CTA path needs review |
| `variant-primary-selection` | A human should choose the best variant |
| `standalone-build-review` | App candidate needs build/deploy review |
| `archive-source-review` | Archive/source files need review before promotion |

## Public directory relationship

Batch 15 should use this file to decide what is safe to show publicly.

Suggested public-mode behavior:

- show `readyForPublicDirectory: true`
- hide `recommendedUse: archive`
- hide `recommendedUse: manual-review`
- hide `recommendedUse: standalone-app-candidate` unless explicitly approved
- prioritize high `businessValue` and high `monetizationPotential`
- keep Advanced / Dev Details hidden by default

For now, most entries are marked `readyForPublicDirectory: false` because Batch 14 is a curation layer, not a public release gate.

## Standalone app relationship

Batch 17 should use records marked:

```txt
standalone-app-candidate
```

as seed inputs for:

- framework guess
- package manager
- build command
- Vercel strategy
- separate repo recommendation
- business priority

Known candidates include:

- `financing-widget`
- `moonshine-affiliate-hub`
- `Moonshine Editorial Bento`

## Recommended workflow

Use the curation layer like this:

1. Pick a view, such as Best Funding Tools or Best for Affiliates.
2. Inspect the top-scored assets.
3. Choose the strongest variant from each variant set.
4. Review copy, logic, design, and CTA.
5. Decide whether the asset becomes:
   - public directory entry
   - Wix embed
   - lead magnet
   - partner campaign asset
   - standalone deployment candidate
   - internal-only reference
6. Update `data/asset-curation.json` as decisions become real.

## Batch 14 acceptance

Batch 14 is complete when:

- `data/asset-curation.json` exists
- `docs/asset-curation-framework.md` exists
- no registry files are rewritten
- no `/sites` files are changed
- no Vercel deployment settings are changed
- the curation layer can seed Batch 15, Batch 17, and Batch 18
