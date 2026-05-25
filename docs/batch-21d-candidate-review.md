# Batch 21D Candidate Review

## Scope

- Reviewed already-hubbed variant groups with canonical hubs under `sites/[group-slug]/index.html`
- Goal: select only high-confidence, low-risk groups for narrow, reversible consolidation
- Excluded mass normalization, registry rewrites, root duplicate cleanup, and deploy actions

## Candidate Review

| groupSlug | variantCount | confidence | riskLevel | applyRecommendation | notes |
| --- | ---: | --- | --- | --- | --- |
| `ai-lab` | 3 | high | medium | skip | Hub already uses canonical `variant-n` links while old source folders and targets both exist (mixed state). |
| `credit-incubator` | 3 | high | medium | skip | Hub already uses canonical `variant-n` links while old source folders and targets both exist (mixed state). |
| `high-converting-lead-magnet` | 3 | high | medium | skip | Hub already uses canonical `variant-n` links while old source folders and targets both exist (mixed state). |
| `attorney-referral-site` | 3 | high | low | apply | Clean old-folder link pattern, clear variant count, no existing `variant-n` targets. |
| `equipment-trucking-construction-referral-site` | 3 | high | low | apply | Clean old-folder link pattern, clear variant count, no existing `variant-n` targets. |
| `multi-referral-partner-portal` | 3 | high | low | apply | Clean old-folder link pattern, clear variant count, no existing `variant-n` targets. |
| `personal-founder-brand-site` | 3 | high | low | apply | Clean old-folder link pattern, clear variant count, no existing `variant-n` targets. |
| `bank-decline-referral-partner-program` | 3 | high | low | apply | Clean old-folder link pattern, clear variant count, no existing `variant-n` targets. |
| `funding-calculators-tools-library` | 5 | medium | medium | skip | Larger 5-variant move with mixed bundles/ZIP-heavy internals; deferred for narrower review batch. |
| `ai-agent-library-for-entrepreneurs` | 3 | medium | medium | skip | Hub links rely on `/static/` subpaths; requires explicit canonical URL-shape decision. |
| `the-radical-libertarian` | 3 | medium | medium | skip | Mixed root and `/static/` hub link styles; deferred until link convention is standardized. |

## Selected For Apply In Batch 21D

- `attorney-referral-site`
- `equipment-trucking-construction-referral-site`
- `multi-referral-partner-portal`
- `personal-founder-brand-site`
- `bank-decline-referral-partner-program`

## Skipped For This Batch

- `ai-lab`
- `credit-incubator`
- `high-converting-lead-magnet`
- `funding-calculators-tools-library`
- `ai-agent-library-for-entrepreneurs`
- `the-radical-libertarian`
