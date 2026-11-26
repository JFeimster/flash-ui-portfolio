<img width="1672" height="941" alt="repo-social-preview" src="https://github.com/user-attachments/assets/be6d7f69-facb-4430-8b11-47687e672d0e" />

# The Funding Agency Blueprint

**Primary design:** Broker’s Manifesto — neo-brutalist editorial.
**Publisher:** Moonshine Capital. **Author:** Jason Feimster.

## What is included

- Static publication homepage (`index.html`) and 11 companion section pages (`/editions/`, `/blueprint/`, `/playbooks/`, `/ai-lab/`, `/automations/`, `/tools/`, `/partners/`, `/resources/`, `/field-notes/`, `/start/`, `/about/`).
- Independent visual variations under `sites/blueprint-press/`, `sites/agency-signal/`, and `sites/brokers-manifesto/`.
- Client-side commission/funding volume, deal-flow calculators, directory filtering, AI prompt copy and launch-path quiz.
- Original CSV/Markdown downloads under `downloads/`; structured data under `data/`.
- No frontend build chain, API keys or database required for the demo.

## Editorial integrity

The newsletter article data is **in production**, **unverified**, or **planned**, as labeled. No edition is falsely presented as published. Partner records are **research/unverified** and are not current financial product offers or current commercial partnership representations. No DAC or other proprietary materials are redistributed. Input assumptions in calculators are not income or funding forecasts.

## Test locally

Run `python -m http.server 8000` in the repository root. Open `http://localhost:8000/`.

All routes also work as static folders with `index.html` under a relative base path. Test via a local server rather than `file://`.

## Publishing URL planning

Intended future URL: `https://media.distilledfunding.com/the-funding-agency/`. This is a **proposed** URL, not a claimed live deployment. `media.distilledfunding.com` requires an existing media host and routing/proxy configuration to mount the site at `/the-funding-agency/`. A subdomain is not created just by setting a Vercel hostname or uploading these files. If hosted on its own Vercel project, publish the project on its Vercel URL first; then configure a rewrite on the media host or use a dedicated `blueprint.distilledfunding.com`. Relative assets and links were chosen to support a prefix mount. Update canonical/sitemap values if public hostname differs.

## Source-of-truth strategy

`data/editions.json`, `partners.json`, `resources.json`, `prompts.json` are seed content. `data/source-registry.schema.json` defines the eventual cross-platform inventory; The 259-record master inventory is now stored in `registry/`. Avoid creating fake sources or treating placeholders as live integrations.

## Deploy / GitHub

The file `scripts/publish-github.ps1` creates a new GitHub repository and pushes the site with the user’s authenticated GitHub CLI. It is not run automatically. For GitHub repo creation, the GitHub integration currently exposes no repository-create action.

## Additional design studies

Independent Magazine Editorial, Nocturnal Editorial Noir, and Dada Riot are standalone homepage prototypes under `sites/`. Broker’s Manifesto remains the primary 12-route publication. All six studies retain the illustrative calculator; photography is not yet supplied.


## Canonical registry (Phase 4)

The private master remains under `registry/`, excluded by `.vercelignore`. `registry/public-release.json` is the curated release manifest; only explicit display fields and allowed public URLs are emitted. Original editorial adaptations use local links and do not expose private source text or links. `data/blueprint-public.json` is the generated catalog. Run `node scripts/generate-public-registry.mjs` after editing the release manifest or master; `node scripts/generate-public-registry.mjs --check` checks generated files. Commit the generated JSON and HTML together. Existing calculators, quiz, prompts and six design studies remain intact. Configured domains and historical source-reported statuses are not runtime verification. Scheduled editions are not represented as published.

### Development catalog

All 119 tool concepts without deployment URLs are exported as a separate public-safe `toolConcepts` collection and rendered on `/tools/`. Missing deployments do not prevent inclusion. Titles and types are published without internal partner routing, private source URLs or invented launch links.
