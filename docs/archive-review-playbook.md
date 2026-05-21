# Batch 3 Archive Review Playbook

This batch is an audit and reconciliation pass. It does **not** delete, move, extract, convert, or deploy anything.

## Current archive policy

ZIP files, Notion exports, Markdown exports, and nested app folders are preserved as source assets. They should remain visible in the portfolio as review-needed assets until a later approval-gated cleanup batch decides what to do with them.

## Why ZIP files are not extracted yet

ZIP files can contain:

- duplicate copies of already indexed sites
- nested folders with broken relative paths
- generated app projects rather than static HTML
- `package.json` build systems
- junk files such as `__MACOSX`, `.DS_Store`, or old exports
- assets that are useful but not ready for direct production routing

Extracting all ZIP files directly into `/sites` would create a digital junk drawer with a loading spinner. Inventory first. Surgery second.

## Recommended ZIP workflow

### Step 1: Inventory

For every ZIP archive, capture:

- archive filename
- archive path
- file size
- top-level folder name
- whether it contains `index.html`
- whether it contains `package.json`
- whether it contains markdown/docs
- whether it contains nested ZIPs
- likely category
- likely duplicate status
- recommended action

### Step 2: Classify

Use one of these recommended actions:

- `extract-to-sites`
- `archive-only`
- `duplicate-ignore`
- `standalone-app-review`
- `docs-conversion-review`
- `needs-human-review`

### Step 3: Extract selectively

Only selected static winners should be extracted later into:

```txt
sites/[clean-slug]/
```

A clean static extraction should usually include:

```txt
index.html
style.css or styles.css
script.js or app.js
assets/
```

### Step 4: Update registry

After approved extraction, update `data/site-registry.json` with:

```json
{
  "type": "static-site",
  "status": "portfolio-site",
  "source": "zip-extract",
  "livePath": "/sites/[slug]/",
  "hasIndex": true,
  "hasZip": true,
  "needsNormalization": false
}
```

## Nested app policy

Folders with `package.json` should stay visible in the portfolio, but they should not receive static `Open Site` links unless they are actually deployed separately or exported intentionally.

Current nested app treatment:

```txt
type: nextjs-app
status: nested-app-needs-standalone-deploy
livePath: ""
needsStandaloneDeploy: true
```

## Docs archive policy

Notion and Markdown exports should be preserved until they can be reviewed for value, duplicates, and conversion opportunities.

Good candidates for later conversion:

- reusable prompt libraries
- template documentation
- design notes
- reusable implementation briefs
- deployment instructions

Bad candidates for direct conversion:

- duplicate exports
- stale scratch notes
- broken Notion asset folders
- files with no reusable portfolio value

## Recommended next batch

Batch 4 should be one of the following:

1. **Deep ZIP Inventory:** enumerate actual ZIP filenames and contents before extraction.
2. **Priority Normalization:** copy selected root/static assets into clean `/sites/[slug]/` folders.
3. **Registry Verification:** test every livePath and mark broken routes.

The cleanest next move is Deep ZIP Inventory if archive recovery matters. If speed matters, prioritize normalizing the best 10 static assets already visible in the portfolio.
