# Batch 20D: Remaining High-Confidence Variant Hubs

Generated: 2026-05-25  
Branch: `batch-20d-remaining-variant-hubs`

## Purpose

Add the next remaining high-confidence canonical variant hubs where existing registry/manifest data provides safe static URL patterns.

This continues the hub-first cleanup strategy: concept-level browsing without moving, renaming, deleting, or breaking current variant URLs.

## Hubs added

| Hub | Path | Variants linked |
|---|---|---:|
| Bank Decline Referral Partner Program | `sites/bank-decline-referral-partner-program/index.html` | 3 |
| The Radical Libertarian | `sites/the-radical-libertarian/index.html` | 3 |
| Personal Founder Brand Site | `sites/personal-founder-brand-site/index.html` | 3 |
| AI Agent Library for Entrepreneurs | `sites/ai-agent-library-for-entrepreneurs/index.html` | 3 |

## Manifest update

Updated:

```txt
data/site-registry-batch-5-additions.json
```

Added the following hub slugs to the existing `static` manifest:

```txt
bank-decline-referral-partner-program
the-radical-libertarian
personal-founder-brand-site
ai-agent-library-for-entrepreneurs
```

## Total canonical hubs after Batch 20D

Existing from previous batches:

- `sites/ai-lab/`
- `sites/attorney-referral-site/`
- `sites/funding-calculators-tools-library/`
- `sites/equipment-trucking-construction-referral-site/`
- `sites/high-converting-lead-magnet/`
- `sites/startup-credit-stacker-console/`
- `sites/credit-incubator/`
- `sites/multi-referral-partner-portal/`

Added in Batch 20D:

- `sites/bank-decline-referral-partner-program/`
- `sites/the-radical-libertarian/`
- `sites/personal-founder-brand-site/`
- `sites/ai-agent-library-for-entrepreneurs/`

Total canonical hub pages: **12**

## Guardrails followed

- Did not rewrite `data/site-registry.json`.
- Did not move folders.
- Did not rename folders.
- Did not delete root duplicates.
- Did not change existing variant `livePath` values.
- Did not add redirects.
- Did not unlock Vercel.

## Deferred groups

The remaining high-confidence groups include mixed root-HTML, docs/archive, or static-extraction paths that need a path-confidence pass before creating hubs. They were intentionally deferred to avoid adding broken hub buttons.

Examples include:

- Affiliate Agency Launch Funnel
- Local Business Funding Page (Washington, DC)
- Meme Propaganda Department
- Quote Grenade Studio
- Social Media Post Generator for Affiliates
- From Idea to URL Static Site Factory
- The CAC Payback Analyzer
- The SaaS LTV-CAC Diagnostic
- Editorial Bento Grid Marketing Site
- Business Loan Affiliate Pillar
- Niche Factory

## Controlled deploy plan

After this PR is reviewed and merged:

1. Temporarily unlock Vercel Git deployments.
2. Trigger one production deployment from `main`.
3. Smoke test all 12 hub URLs.
4. Smoke test representative variant links from each hub.
5. Verify duplicate-root suppression behavior on the portfolio UI.
6. Re-lock Vercel if more batching is planned.
