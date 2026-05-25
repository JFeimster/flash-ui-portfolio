# Batch 21A: Startup Credit Stacker Console Pilot Consolidation

Generated: 2026-05-25  
Branch: `batch-21a-startup-credit-stacker-complete`

## Purpose

Pilot the real consolidation pattern for numbered Flash UI variants.

This batch is intentionally limited to:

```txt
Startup Credit Stacker Console 1-4
```

## Final structure

```txt
sites/startup-credit-stacker-console/
  index.html
  variant-1/
    index.html
    style.css
  variant-2/
    index.html
    style.css
  variant-3/
    index.html
    style.css
  variant-4/
    index.html
    style.css
```

## Completed

Created canonical variant folders using the original source blob SHAs from the existing `/sites/Startup Credit Stacker Console N/` folders.

Moved all four old spaced `/sites` folders into canonical variant folders:

```txt
sites/Startup Credit Stacker Console 1/index.html -> sites/startup-credit-stacker-console/variant-1/index.html
sites/Startup Credit Stacker Console 1/style.css -> sites/startup-credit-stacker-console/variant-1/style.css
sites/Startup Credit Stacker Console 2/index.html -> sites/startup-credit-stacker-console/variant-2/index.html
sites/Startup Credit Stacker Console 2/style.css -> sites/startup-credit-stacker-console/variant-2/style.css
sites/Startup Credit Stacker Console 3/index.html -> sites/startup-credit-stacker-console/variant-3/index.html
sites/Startup Credit Stacker Console 3/style.css -> sites/startup-credit-stacker-console/variant-3/style.css
sites/Startup Credit Stacker Console 4/index.html -> sites/startup-credit-stacker-console/variant-4/index.html
sites/Startup Credit Stacker Console 4/style.css -> sites/startup-credit-stacker-console/variant-4/style.css
```

Updated hub page:

```txt
sites/startup-credit-stacker-console/index.html
```

The hub now links to:

```txt
/sites/startup-credit-stacker-console/variant-1/
/sites/startup-credit-stacker-console/variant-2/
/sites/startup-credit-stacker-console/variant-3/
/sites/startup-credit-stacker-console/variant-4/
```

## GitHub compare result

GitHub compare recognizes all eight variant files as renames into the canonical folder structure. This is the desired consolidation pattern.

## Not touched

Root-level folders were not deleted in this pilot:

```txt
Startup Credit Stacker Console 1/
Startup Credit Stacker Console 2/
Startup Credit Stacker Console 3/
Startup Credit Stacker Console 4/
```

Those should be handled after `/sites` consolidation is approved and repeated for the remaining groups.

## Verification performed

Verified on the completed pilot branch:

```txt
sites/startup-credit-stacker-console/index.html
sites/startup-credit-stacker-console/variant-1/index.html
sites/startup-credit-stacker-console/variant-2/style.css
sites/startup-credit-stacker-console/variant-4/style.css
```

## Recommendation

Use this pilot pattern for the next consolidation batch:

```txt
copy/move real files -> update hub links -> verify canonical variant paths -> remove old spaced /sites folders -> then consider root duplicate cleanup
```
