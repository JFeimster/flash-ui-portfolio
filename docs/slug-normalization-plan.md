# Slug Normalization Plan

Batch 18 creates a planning layer for cleaner Flash UI Portfolio OS URLs.

This batch does not rename folders, change `livePath` values, rewrite registries, or add redirects. It only identifies candidates and implementation risk.

## Created file

```txt
data/slug-normalization-plan.json
```

## Why this matters

The portfolio now contains several URL types:

- legacy root HTML files with encoded spaces
- legacy root folders
- `/sites` folders with spaces, punctuation, and version suffixes
- duplicate root and `/sites` copies
- standalone app folders that should not be treated like static sites
- docs/archive folders that may remain internal forever

Cleaner slugs will eventually make the portfolio easier to share, embed, and promote, but careless renaming would break working URLs. That is how a tidy person accidentally becomes a vandal with prettier folders.

## Normalization standard

Preferred folder slug format:

```txt
lowercase-kebab-case
```

Preferred public static asset URL format:

```txt
/sites/[folder-slug]/
```

Avoid:

- spaces
- parentheses
- mixed case
- special characters
- ambiguous version names
- root-level HTML files with encoded spaces

## Hard rule

Do not change a working public URL without a redirect plan.

Every changed public URL should receive an explicit redirect from the current `livePath` to the proposed `livePath`.

## Candidate categories

### Phase 1: High-value `/sites` folders

Start with assets that already live under `/sites` and have obvious public/lead-magnet value:

- `Embed Widget Studio`
- `Funding Calculators & Tools Library`
- `The CAC Payback Analyzer`
- `The SaaS LTV-CAC Diagnostic`
- `Affiliate Agency Launch Funnel`
- `Attorney Referral Site`
- `Bank Decline Referral Partner Program`
- `Equipment-Trucking-Construction Referral Site`
- `Startup Credit Stacker Console`

These are medium-risk because they already have working `/sites` URLs but can be redirected cleanly.

### Phase 2: Legacy root HTML URLs

Root HTML files are higher risk because current URLs may already be shared or internally referenced.

Examples:

- `White-Label Financing Widget for B2B Partners.html`
- `Niche_Factory_1 index.html`
- `Business Loan Affiliate Pillar 1 index.html`

Normalize these only after creating equivalent `/sites` folders and adding redirects.

### Phase 3: Curated libraries

AI/prompt/content libraries should be normalized only after deciding whether they are public-facing or internal reference material.

Example:

- `AI Agent Library for Entrepreneurs`

### Phase 4: Duplicate root-vs-sites copies

Some assets exist as both legacy root folders and `/sites` folders. These require consolidation planning before renaming anything.

Example:

- `AI Lab 1`
- `sites/AI Lab 1`

### Phase 5: Standalone apps

Standalone apps should not be normalized into `/sites` static paths.

Examples:

- `financing-widget`
- `moonshine-affiliate-hub`
- `Moonshine Editorial Bento`

These need dedicated deployment URLs or separate repo/project decisions.

### Phase 6: Archive/docs cleanup

Docs/archive folders are low risk while internal, but they should not be renamed unless there is a public reason.

Example:

- `sites/1. Fash UI Templates (Notion)`

## Redirect strategy

Recommended redirect type:

```txt
308 permanent redirect
```

Redirect examples for a future implementation batch:

```json
{
  "source": "/sites/Embed%20Widget%20Studio/",
  "destination": "/sites/embed-widget-studio/",
  "permanent": true
}
```

Root HTML example:

```json
{
  "source": "/White-Label%20Financing%20Widget%20for%20B2B%20Partners.html",
  "destination": "/sites/white-label-financing-widget-b2b-partners/",
  "permanent": true
}
```

Do not add these redirects until the destination folders exist and have been smoke-tested.

## Registry impact

A normalization implementation may require updates to:

- `data/site-registry.json`
- `data/site-registry-batch-5-additions.json`
- `data/site-registry-static-extractions.json`
- `data/asset-groups.json`
- `data/asset-actions.json`
- `data/asset-curation.json`
- smoke-test data/docs

Because of that, implementation should be its own batch after this plan is reviewed.

## Recommended implementation order

1. Select 3 to 5 high-value `/sites` assets.
2. Create normalized duplicate folders or rename only with redirects ready.
3. Add redirect rules.
4. Update metadata references.
5. Run smoke tests against old and new URLs.
6. Update docs.
7. Only then consider root HTML migrations.

## Do not do yet

- do not rename folders
- do not change `livePath` values
- do not rewrite registries
- do not add redirects
- do not move standalone apps
- do not delete duplicate-looking assets

## Recommended next move

Review this plan, then decide between:

1. a small slug-normalization implementation batch for 3 to 5 high-value `/sites` assets
2. a build-readiness audit for `financing-widget`
3. a public-directory polish pass using the new curation and standalone-app metadata
