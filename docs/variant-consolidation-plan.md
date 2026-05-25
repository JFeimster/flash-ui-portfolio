# Variant Consolidation Plan

Batch: 19A  
Generated: 2026-05-25  
Repository: `JFeimster/flash-ui-portfolio`

## Purpose

This is a planning-only report for consolidating numbered Flash UI variants into canonical `/sites` group folders while preserving access to every variant.

The goal is not to hide variants. The goal is to stop duplicate concepts from clogging the directory while still making every alternate Flash UI output easy to inspect.

## Recommended structure

Use one canonical folder per concept:

```txt
sites/[canonical-slug]/
  index.html
  variant-1/
    index.html
  variant-2/
    index.html
  variant-3/
    index.html
```

Use `variant`, not `version`, because these are usually alternate Flash UI design outputs rather than chronological product versions.

## Expected portfolio behavior

The portfolio card should show one concept card:

```txt
AI Lab
3 variants
Recommended primary: Variant 1
```

Recommended actions:

- Open Variant Hub
- Open Recommended Variant
- View All Variants
- Copy Hub Link

The variant hub page should list every variant with direct links.

## Priority groups

### AI Lab

Current:

```txt
sites/AI Lab 1/
sites/AI Lab 2/
sites/AI Lab 3/
```

Future:

```txt
sites/ai-lab/
  index.html
  variant-1/
  variant-2/
  variant-3/
```

### Attorney Referral Site

Future:

```txt
sites/attorney-referral-site/
  index.html
  variant-1/
  variant-2/
  variant-3/
```

### Funding Calculators & Tools Library

Future:

```txt
sites/funding-calculators-tools-library/
  index.html
  variant-1/
  variant-2/
  variant-3/
  variant-4/
  variant-5/
```

### Startup Credit Stacker Console

Future:

```txt
sites/startup-credit-stacker-console/
  index.html
  variant-1/
  variant-2/
  variant-3/
  variant-4/
```

### Moonshine Capital Partners

This is not currently a numbered variant set. It should become a clean single-site canonical folder:

```txt
sites/moonshine-capital-partners/
  index.html
  style.css
  script.js
```

## Existing grouping metadata

The repo already includes:

```txt
data/asset-groups.json
```

That file should be used as the source of truth for detecting variant groups before Batch 20 moves folders.

## Registry strategy

### Short term

Suppress duplicate root entries when a `/sites` copy exists.

### Medium term

Create group-card registry entries that point to variant hub pages.

### Long term

Render variants from `data/asset-groups.json` or a dedicated `data/asset-variants.json` file so the UI can show:

- one card per concept
- variant count
- recommended primary
- direct links to all variants

## URL risk

Moving paths will change existing URLs.

Example:

```txt
/sites/AI%20Lab%202/
```

would become:

```txt
/sites/ai-lab/variant-2/
```

Do not add a massive redirect table unless needed. Add redirects only for URLs that were externally shared or are high-value.

## Recommended Batch 20

Batch 20 should:

1. Create canonical folder for each approved group.
2. Move existing `/sites` variants into `variant-n` folders.
3. Generate a lightweight hub `index.html` for each canonical group.
4. Update registry/grouping metadata.
5. Preserve all direct variant links.
6. Run a smoke test after unlocking Vercel for a controlled deploy.

## Warning

Do not collapse variants into one hidden primary site. The whole point of this portfolio is to compare and reuse variants, not bury the good weird stuff in a folder crypt.
