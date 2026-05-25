# Variant Consolidation Workflow

## Purpose

`scripts/consolidate-variant-group.mjs` makes the post-pilot variant move process repeatable. It validates a mapped variant group, rewrites the canonical hub links, and emits JSON plus Markdown reports before any destructive action is allowed.

The default mode is dry-run. Actual directory movement requires `--apply`.

## Why `/sites` Is Canonical

This portfolio already serves static concept hubs and static site outputs from `/sites`. Consolidating numbered variant folders under canonical `/sites/[slug]/variant-n/` paths keeps live portfolio URLs, future smoke testing, and on-disk organization centered in one place instead of splitting state across root folders and ad hoc destinations.

## Why `variant-n` Instead of `Version N`

These folders are alternate Flash UI creative directions, not sequential product releases. `variant-1`, `variant-2`, and `variant-3` communicate parallel options and align with the approved pilot structure:

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

## Exact Commands

Dry-run a single group:

```bash
node scripts/consolidate-variant-group.mjs --group ai-lab
```

Apply a single group:

```bash
node scripts/consolidate-variant-group.mjs --group ai-lab --apply
```

Dry-run all pending groups:

```bash
node scripts/consolidate-variant-group.mjs --all
```

Apply all pending groups:

```bash
node scripts/consolidate-variant-group.mjs --all --apply
```

## Approved Pilot Pattern

`startup-credit-stacker-console` is the approved reference implementation for this workflow:

- The canonical hub remains at `sites/startup-credit-stacker-console/index.html`.
- Each old numbered site became `sites/startup-credit-stacker-console/variant-n/`.
- Hub CTA links point at `/sites/startup-credit-stacker-console/variant-n/`.
- The canonical hub file was preserved rather than replaced by a moved variant.

## What the Script Is Allowed To Move

- Only mapped folders under `/sites/[Old Variant Folder]`
- Only into `/sites/[canonical-slug]/variant-n/`
- Only when the source folder exists and the target folder does not create an unsafe overwrite

## What the Script Must Not Touch

- `vercel.json`
- `data/site-registry.json`
- Root-level folders
- The script must not delete, extract, modify, or rewrite ZIP archives, source packages, or standalone app source files. If these files live inside a mapped `/sites` variant folder, they may be preserved by moving the entire folder into its canonical `variant-n` destination.
- Standalone app candidates
- Canonical hub `index.html` files except for link updates from old encoded variant paths to new `variant-n` paths

## Reports

Every run writes machine-readable and review-friendly reports:

- Single-group runs:
  - `data/migration-reports/[groupId]-variant-consolidation-report.json`
  - `docs/migration-reports/[groupId]-variant-consolidation-report.md`
- `--all` runs:
  - `data/migration-reports/all-variant-consolidation-report.json`
  - `docs/migration-reports/all-variant-consolidation-report.md`

Reports include:

- group id and title
- hub path
- dry-run state
- source and target paths per variant
- files planned or moved
- skipped items
- warnings
- errors
- whether the old path was removed
- whether hub links were updated

## PR Review After Script Execution

Review the pull request with this sequence:

1. Confirm only expected `/sites/[canonical-slug]/variant-n/` targets changed.
2. Confirm canonical hub `index.html` files still exist and only their variant links changed.
3. Read the generated JSON and Markdown migration reports for warnings or skipped variants.
4. Confirm no root-level folders, no ZIP archives, and no standalone app candidates were moved.
5. Confirm `vercel.json` and `data/site-registry.json` remain untouched.

## Smoke Test Checklist

After an `--apply` batch:

1. Open the canonical hub URL for each migrated group.
2. Open every `/sites/[canonical-slug]/variant-n/` URL from the hub.
3. Confirm each variant still loads its expected HTML, CSS, JS, and asset paths.
4. Confirm there are no remaining hub CTAs pointing at old encoded folder URLs.

## Deploy Reminder

Vercel stays locked until an explicit controlled deploy window. Consolidation can be prepared, reviewed, and smoke tested locally first; deployment remains a separate decision.
