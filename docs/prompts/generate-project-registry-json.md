# Prompt — Generate an existing-project registry JSON record

Copy the prompt below to generate a reviewable `<slug>.json` file for **one current project**. Provide a project name, GitHub source link, site URL or source folder.

---

## FLASH UI PORTFOLIO — PROJECT JSON RECORD GENERATOR

Repository: `JFeimster/flash-ui-portfolio`.
Reference: `data/site-registry.json` on current `main`, plus `docs/registry-update-workflow.md`.

**Task:** Find the project in the current repository and produce one precise, valid, downloadable JSON record that follows the *existing* legacy registry's field names and types. Inspect the project files, index.html, source route, variants, existing registry and additive metadata. Do not infer the source from the display name alone.

### The current registry record structure

All 31 canonical entries inspected on 2026-11-19 have these eleven keys:

- `title` — string; required in the recommended generator.
- `slug` — lowercase kebab-case string; required.
- `category` — string, prefer an existing category; required.
- `type` — string, use evidenced asset type such as `group-hub`; required.
- `status` — string, use an existing status value supported by the project; required.
- `source` — string, evidence/provenance label; required.
- `path` — repository-relative path, no leading slash; required for a local project.
- `livePath` — exact deployed path beginning with `/`; required for a published site.
- `hasIndex` — boolean, verified by actual entrypoint; required for a local site.
- `variantNumbers` — array of integers; include when variants are verified. For canonical group-hub parity, include even if empty.
- `notes` — string; optional generally, but include for group-hub parity.

**Important:** The repository currently has no standalone formal JSON Schema defining required vs optional registry fields. The requirements above are a proposed validation contract based on existing canonical objects, not a claim that the repo enforces them. Preserve keys/values from the actual source of truth when a record already exists.

### Rules

1. Verify actual file paths and index files; never invent a live route, deployment, variant or working feature.
2. First search for an existing record by `slug`, `path`, and `livePath`; do not create a duplicate.
3. If the project has several variants, distinguish *one project-level record* from per-variant route contracts and show which metadata belongs in `data/variant-route-contracts.json` instead.
4. If it is a Next.js/Vite/other framework app, do not claim it is a static published project; return a standalone-app candidate record with missing fields explicitly marked **outside** the strict registry record.
5. Report missing/uncertain values *before* producing the JSON; never fill them with guesses.
6. Output a single JSON object with only supported registry keys (no invented `id`, `description`, `tags`, `url` or other fields). Put rich descriptions in `data/asset-showcase.json` or appropriate additive metadata.
7. For an **existing** project, generate a downloadable `<slug>.json` containing that object. If file generation is unavailable, provide a copyable JSON code block.
8. State whether the record is already in the canonical registry, should be proposed as a canonical change, or should be stored as additive metadata.
9. **Do not mutate repository files in this generation task.** Updating `data/site-registry.json` is a separate explicitly authorized operation; it is protected by a byte-integrity test.

### Return

- Verified project name and source file path.
- Existing or proposed JSON object.
- Exact suggested save filename and destination.
- Provenance notes and missing fields, if any.
- Recommendation: existing entry / additive grouping / canonical amendment after explicit approval.

**Project to process:** [PASTE NAME, PATH OR LINK HERE]
