# Flash UI Portfolio

Flash UI Portfolio is the vault for GPT-generated and AI-generated starter sites, widgets, lead magnets, content hubs, partner pages, interface experiments, and raw export archives.

This repository is organized as a browsable static portfolio directory. It preserves messy creative output without pretending every experiment is production-ready. The point is simple: capture the assets, index the assets, browse the assets, then promote the winners.

## Repository model

Legacy root-level files and folders are preserved as legacy assets. Do not delete, rename, or move them without a dedicated cleanup batch.

Bulk-imported assets live under:

```txt
sites/
```

New normalized imports should use:

```txt
sites/[slug]/
```

Each normalized static site should generally include:

```txt
sites/[slug]/index.html
sites/[slug]/style.css
sites/[slug]/script.js
```

The root homepage reads from:

```txt
data/site-registry.json
```

That registry powers the cards, counts, search, category filters, and status filters.

## Static deployment

Vercel can deploy the root directory as a static directory. The root `index.html` provides the portfolio interface, while `data/site-registry.json` powers the browsable vault.

## Asset types

The registry tracks:

- Legacy root-level HTML starter files
- Legacy root-level starter folders
- Bulk-imported `/sites` folders
- `/sites` root-level HTML files that still need normalization
- Nested Next.js apps
- ZIP/archive assets preserved for later extraction or review
- Markdown/Notion/doc exports

## Batch 3 archive audit

Batch 3 adds an archive review layer without extracting or modifying source assets.

New audit files:

```txt
data/archive-audit.json
docs/archive-review-playbook.md
```

Use these files to decide what happens to ZIPs, Notion exports, Markdown docs, and nested app folders before any extraction or cleanup.

## Nested apps

Folders with `package.json`, such as nested Next.js apps, may need their own standalone Vercel projects or later promotion into dedicated repositories. They are intentionally not converted in this indexing batch.

## ZIP and docs archives

ZIP archives and Markdown/Notion exports are preserved. They should be extracted, reviewed, or converted only in a future cleanup batch.

Recommended order:

1. Inventory archive contents.
2. Detect duplicates.
3. Identify whether an archive contains `index.html`, `package.json`, docs, or nested ZIPs.
4. Extract only selected static winners.
5. Update `data/site-registry.json` after approved extraction.

## Production promotion

Production winners can later be promoted into standalone repositories, separate Vercel projects, polished templates, product pages, or white-label partner assets.

## Batch sequence

1. Batch 1: create the deployable directory shell.
2. Batch 2: index existing and bulk-imported Flash UI assets.
3. Batch 3: archive audit and orphan/review reconciliation.
4. Batch 4: deep ZIP inventory or priority static normalization.
