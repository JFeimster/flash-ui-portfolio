# ChatGPT Project Instructions

Use this file as the working instruction layer for ChatGPT threads managing the Flash UI Portfolio OS.

## Repository

```txt
JFeimster/flash-ui-portfolio
```

## Production URL

```txt
https://flash-ui-portfolio.vercel.app/
```

## Purpose

Flash UI Portfolio OS turns Google AI Studio / Flash UI generated websites, widgets, tools, landing pages, app prototypes, ZIPs, and docs into a browsable asset command center.

The asset flow is:

```txt
Raw AI Studio exports
→ Bulk extraction
→ Registry indexing
→ Smoke testing
→ Display metadata
→ Grouping + curation
→ Public/internal directory modes
→ Promotion into lead magnets, Wix embeds, affiliate tools, or standalone apps
```

## Current operating principles

- Preserve source assets unless deletion is explicitly approved.
- Use focused batch branches named like `batch-16-project-kit-docs`.
- Do not rewrite `data/site-registry.json` unless explicitly approved.
- Prefer additive metadata files for grouping, curation, display rules, QA reports, and extraction reports.
- Static sites belong under `/sites`.
- Standalone apps should be audited before any move or deployment decision.
- Do not rename `/sites` folders until a slug normalization and redirect plan is approved.
- Do not change `livePath` values unless a redirect/normalization plan exists.
- Do not delete ZIP files.
- Do not extract ZIP files unless explicitly assigned.
- Do not convert Next.js apps in the static portfolio flow.
- Card labels should be user-facing, not implementation-facing.
- UI should prioritize viewer utility over repo plumbing.

## Vercel deployment rule

Automatic Git deployments are intentionally disabled in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

Only open a deployment window when explicitly approved:

1. Temporarily remove the `git.deploymentEnabled` lock.
2. Commit to `main`.
3. Confirm Vercel production deployment is `READY`.
4. Verify production URLs.
5. Restore the deployment lock immediately.
6. Confirm `deploymentEnabled: false` is back on `main`.

## Default ChatGPT workflow

1. Review current repo state.
2. Confirm `main` is clean.
3. Confirm `vercel.json` deployment lock.
4. Create one focused batch branch.
5. Make only scoped changes.
6. Compare branch to `main`.
7. Open a clean PR.
8. Stop before deployment unless deployment is explicitly approved.
9. If asked to merge, review PR and squash-merge only if clean.
10. If asked to deploy, use the controlled deployment window.

## Current completed batches

- Batch 8: Bulk extracted eligible static ZIP sites.
- Batch 9: Added reusable live-path smoke testing.
- Batch 10: Improved card UX and display metadata.
- Batch 12: Added display-only asset grouping and variant metadata.
- Batch 13: Added asset CTA/action metadata.
- Batch 14: Added asset curation metadata layer.
- Batch 15: Added public directory mode.

## Recommended remaining sequence

1. Batch 16: Add Flash UI Portfolio project kit docs.
2. Batch 17: Audit standalone app deployment candidates.
3. Batch 18: Generate slug normalization plan.

## Connector habits

Use GitHub connector for:

- reading files
- creating branches
- creating/updating files
- comparing branches
- opening PRs
- reviewing/merging PRs

Use Vercel connector for:

- project lookup
- deployment verification
- production readiness confirmation

If a connector call fails, report the failure honestly and avoid pretending verification happened.
