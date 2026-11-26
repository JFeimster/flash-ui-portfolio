# Commercial Finance GPT File Arsenal

A zero-build static command center for the generated Commercial Finance Referral GPT file library.

The portal renders:

- 8 major libraries
- 89 batches
- 492 indexed files
- 89 ZIP packages
- Markdown, JSON, YAML, CSV, OpenAPI, environment example, and ZIP assets
- Search, filters, batch cards, download hub, route simulator, safety center, and roadmap

## Files

```txt
index.html
styles.css
script.js
data/site-map.json
data/download-manifest.json
data/batch-inventory.json
data/search-index.json
data/library-cards.json
data/build-paths.json
vercel.json
README.md
```

## Local preview

Option A: open `index.html` directly.

The shell, layout, and fallback cards work immediately. Some browsers block `fetch()` for local JSON under `file://`, so use Option B for the full 492-file explorer.

Option B: run a tiny static server from the repo root.

```bash
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
```

## GitHub → Vercel deploy

1. Create a new GitHub repository.
2. Add every file from this repo.
3. Commit and push to `main`.
4. In Vercel, choose **New Project**.
5. Import the GitHub repo.
6. Framework preset: **Other**.
7. Build command: leave blank.
8. Output directory: `.`.
9. Deploy.

## Download activation

The UI uses static placeholder download paths:

```txt
downloads/zip-packages/{librarySlug}/batch-{nn}/{zipFilename}
downloads/individual-files/{librarySlug}/batch-{nn}/{filename}
```

Create those folders and drop the generated files into matching paths to activate real downloads.

## SEO checklist

- Replace canonical `/` with the production domain.
- Add a social preview image under `/assets` and update Open Graph tags.
- Keep page title under 60 characters when finalizing.
- Keep meta description under 160 characters.
- Add real GitHub and Vercel links in the admin/footer placeholders.
- Confirm all download paths resolve before public launch.

## Performance checklist

- No external JavaScript dependencies.
- No external font dependency.
- Data is repo-local JSON.
- CSS uses native features and reduced-motion handling.
- File explorer renders the first 48 results and lazy-loads more on demand.
- ZIP table is static and filterable.

## Safety and compliance checklist

- Do not make guaranteed funding, approval, income, commission, legal, tax, accounting, or personalized financial advice claims.
- Review all copy, compliance, privacy, API-key, OAuth, and workflow files before deployment.
- Require human confirmation for send, publish, CRM-write, data enrichment, and workflow automation actions.
- Keep API keys out of this static site.
- Treat every file as draft-first and review-required.

## Troubleshooting

### The search explorer is empty when opening `index.html`

Your browser may block local JSON fetches from `file://`. Run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Download buttons show missing files

Add the real generated files into the `downloads/` folders using the paths shown by each card.

### Vercel shows a 404 on deep routes

This is a single-page static site that simulates routes with hash navigation. Use the homepage URL plus section hashes, or add physical HTML pages later.

### Data updates do not show

Hard refresh the browser, or update the `generated` field in each JSON file when replacing the inventory.

## Recommended next improvements

- Add physical static route pages for each library and batch.
- Add generated ZIP files under `/downloads/zip-packages`.
- Add individual generated files under `/downloads/individual-files`.
- Add a precomputed `assets/og-image.png`.
- Add a static sitemap and robots file after choosing the production domain.
