# Applications directory

The Flash UI Portfolio remains a static site. Its dedicated `/apps/` page reads `data/app-registry.json` and links to independently deployed applications. No Next.js runtime is embedded in the portfolio.

## Registry

`data/app-registry.json` contains a top-level `apps` array. Each record supports:

- `id`: stable unique slug
- `title`, `description`: user-facing copy
- `category`: `SaaS Applications`, `AI Tools`, or `Prototypes`
- `framework`: verified stack or `Unverified`
- `status`: `listed` (not an uptime/health assertion)
- `deploymentUrl`: HTTPS destination; omit if not deployed
- `repositoryUrl`: HTTPS source repository; omit if unavailable
- `sourceRegistrySlug`: optional link to a legacy site-registry entry
- `tags`: searchable keywords
- `notes`: optional operator context, not displayed publicly

To add an application, append one record with a unique `id` and the correct URLs. Keep secrets and internal-only configuration out of the registry. Confirm deployment availability separately before claiming it is live.

## Existing legacy entries

Three existing external applications were indexed from `data/site-registry.json`. The site registry remains unchanged. The static directory excludes these entries when their slugs are present in the app registry, avoiding duplicate catalog cards while preserving original source metadata.

## UI and deployment

- `/sites/` remains the static-site and variant directory.
- `/apps/` supports search, category filters, and source/deployment actions.
- Homepage navigation links to Static Sites, SaaS Applications, AI Tools, and Prototypes.
- Applications remain deployed in their own Vercel projects/repositories.
- Do not copy Next.js source into `/sites/` or change existing live paths.

## Verification

Check JSON syntax, load `/apps/`, exercise category filters and search, verify external links and `/sites/` browsing, and run the existing live-path smoke test for major directory changes. These checks must be reported as run only when actually executed.
