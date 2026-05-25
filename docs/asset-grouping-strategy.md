# Asset Grouping Strategy

Batch 12 adds a display-only grouping layer for Flash UI Portfolio assets.

## Why this exists

Flash UI / Google AI Studio often produces several variants of the same asset concept. The portfolio currently shows many of those as separate unrelated cards, such as:

- AI Lab 1, AI Lab 2, AI Lab 3
- Attorney Referral Site 1, Attorney Referral Site 2, Attorney Referral Site 3
- Funding Calculators & Tools Library 1–5
- The CAC Payback Analyzer 1–3

These are usually not deletion candidates. They are variant sets. Treat them like creative alternatives until one is reviewed and promoted.

## Files added

- `data/asset-groups.json`
- `docs/asset-grouping-strategy.md`

## Guardrails

This batch does not:

- rewrite `data/site-registry.json`
- rename folders
- move `/sites` files
- change `livePath` values
- delete ZIP files
- choose final winners
- collapse cards in the UI by default

Working links stay working. Pretty cleanup can wait for a redirect/normalization plan.

## Group types

### `variant-set`

Multiple assets with the same base concept and numeric suffixes.

Example:

```txt
Attorney Referral Site 1
Attorney Referral Site 2
Attorney Referral Site 3
```

### `legacy-plus-sites-copy`

An asset may exist as both a legacy root file/folder and a `/sites` copy. These should be treated as related copies, not duplicates to delete.

### `tool-family`

Assets that belong to the same product/tool family but may not be direct variants.

### `manual-review`

Groups that need human confirmation before being treated as direct variants.

## Recommended UI behavior

Short-term:

- Keep individual cards visible.
- Add or preserve a `Variant` badge.
- Optionally display group metadata such as `Variant Set: Attorney Referral Site`.
- Allow future filters such as `Grouped Assets` or `Has Variants`.

Medium-term:

- Add expandable parent group cards.
- Show variant count.
- Let the user choose or mark `Recommended Primary`.
- Add compare links.

Long-term:

- Build a group detail view:

```txt
/groups/attorney-referral-site
```

or use query parameters:

```txt
?group=attorney-referral-site
```

## Matching rules

For display matching only:

1. Strip leading `sites ` from display titles.
2. Remove `index.html` suffixes.
3. Collapse whitespace.
4. Compare case-insensitively.
5. Match against title, slug, and path where possible.

Do not mutate the underlying registry or filesystem based only on these display rules.

## Recommended primary logic

`recommendedPrimary` is a soft recommendation. It does not mean the asset is final or production-grade.

Initial rule:

- Use Variant 1 when no better signal exists.
- Prefer `/sites` entries over legacy root entries when both work.
- Prefer smoke-tested live paths.
- Later, use curation score to determine winner.

## Next recommended batch

Batch 13 should add an action metadata layer so grouped assets can support richer actions:

- Open Site
- Copy Link
- View Details
- View Source
- Preview Embed
- Landing Draft
- Deploy Candidate
- Review Notes

Do not build public directory mode until grouping and action metadata exist. Otherwise the public view will inherit duplicate chaos with nicer shoes.
