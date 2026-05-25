# Batch 21A: Startup Credit Stacker Console Pilot Consolidation

Generated: 2026-05-25  
Branch: `batch-21a-pilot-startup-credit-stacker-consolidation`

## Purpose

Pilot the real consolidation pattern for numbered Flash UI variants.

This batch is intentionally limited to:

```txt
Startup Credit Stacker Console 1-4
```

## Target structure

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

Added:

```txt
sites/startup-credit-stacker-console/variant-1/index.html
sites/startup-credit-stacker-console/variant-1/style.css
sites/startup-credit-stacker-console/variant-2/index.html
sites/startup-credit-stacker-console/variant-2/style.css
sites/startup-credit-stacker-console/variant-3/index.html
sites/startup-credit-stacker-console/variant-3/style.css
sites/startup-credit-stacker-console/variant-4/index.html
sites/startup-credit-stacker-console/variant-4/style.css
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

## Removed old spaced /sites variant files

Removed from the pilot branch:

```txt
sites/Startup Credit Stacker Console 1/index.html
sites/Startup Credit Stacker Console 1/style.css
sites/Startup Credit Stacker Console 2/index.html
sites/Startup Credit Stacker Console 2/style.css
```

GitHub compare now recognizes these as renames into:

```txt
sites/startup-credit-stacker-console/variant-1/
sites/startup-credit-stacker-console/variant-2/
```

## Pending removal due connector blocking

The connector blocked deletion attempts for variant 3 and variant 4 old spaced folders.

Still pending removal:

```txt
sites/Startup Credit Stacker Console 3/index.html
sites/Startup Credit Stacker Console 3/style.css
sites/Startup Credit Stacker Console 4/index.html
sites/Startup Credit Stacker Console 4/style.css
```

The new canonical copies for variant 3 and variant 4 already exist, but the old folders remain until deletion can be completed through GitHub UI, Codex, or a local filesystem migration script.

## Not touched

Root-level folders were not deleted in this pilot:

```txt
Startup Credit Stacker Console 1/
Startup Credit Stacker Console 2/
Startup Credit Stacker Console 3/
Startup Credit Stacker Console 4/
```

Those should be handled only after the `/sites` consolidation pattern is fully approved.

## Verification performed

Verified on the pilot branch:

```txt
sites/startup-credit-stacker-console/index.html
sites/startup-credit-stacker-console/variant-1/index.html
sites/startup-credit-stacker-console/variant-2/style.css
sites/startup-credit-stacker-console/variant-4/style.css
```

## Recommendation

Do not merge until one of the following is true:

1. Old variant 3 and 4 spaced folders are also removed, or
2. The PR is accepted as a partial pilot proving the structure, with a follow-up commit/task to remove the remaining old spaced folders.

Preferred next step:

Use Codex/local filesystem access to finish the old folder removals cleanly, then repeat this migration pattern across the remaining variant groups.
