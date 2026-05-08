# Flash UI Portfolio

Flash UI Portfolio is the vault for GPT-generated and AI-generated starter sites, widgets, lead magnets, content hubs, partner pages, and experimental interface concepts.

This repository is intentionally being organized as a deployable static portfolio directory. It can preserve messy legacy assets while creating a cleaner path for normalized, production-ready imports.

## Repository model

Existing root-level files and folders are preserved as legacy assets. Do not delete, rename, or move them without a dedicated cleanup batch.

New normalized imports should go under:

```txt
sites/[slug]/
```

Each normalized site should generally include:

```txt
sites/[slug]/index.html
sites/[slug]/assets/
```

The root homepage reads from:

```txt
data/site-registry.json
```

That registry is the portfolio index for both legacy assets and future normalized assets.

## Static deployment

Vercel can deploy the root directory as a static directory. The root `index.html` provides the portfolio interface, while `data/site-registry.json` powers search, filters, counts, and cards.

## Legacy assets

Legacy root HTML files and root folders are indexed so they remain discoverable while the repo gets cleaned up. These assets should eventually be reviewed and normalized into `/sites/[slug]/` when they are worth keeping.

## Production promotion

Production winners can later be promoted into standalone repositories, separate Vercel projects, or app-specific build pipelines. Nested Next.js apps should be deployed separately or promoted intentionally rather than mixed into the root static shell.

## Batch sequence

1. Batch 1: create the deployable directory shell.
2. Batch 2: bulk import remaining desktop folders into `/sites`.
3. Batch 3: index everything already in the repo plus new imports.
4. Batch 4: deploy and verify on Vercel.
