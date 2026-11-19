# Batch 19C import report

The supplied PowerShell inventory covered 213 ZIP candidates and 114 HTML candidates under the Flash UI source collection. Each candidate and its disposition is recorded in `data/batch-19c-import-review.json`. The exact source folders, matching ZIP exports, SHA-256 hashes, destination routes, and copied files are recorded in `data/batch-19c-import-mapping.json`.

| Result | Candidate records | Detail |
| --- | ---: | --- |
| Imported | 28 | Four new projects, 14 distinct static variants. Each has a matching source ZIP and unpacked HTML. The count includes both ZIP and HTML inventory records. |
| Already present | 0 | None of the remaining candidate entrypoints matched a repository HTML file byte for byte. |
| Duplicate | 2 | Alternate ZIP exports of an imported variant with the same entrypoint content. |
| Needs classification | 178 | Existing family identities with different bytes, multi-entrypoint packages, or source folders requiring ownership/dependency review. No existing route was overwritten. |
| Standalone application | 102 | Framework or platform exports are recorded for separate deployment review. |
| Unsupported or failed | 17 | Missing static entrypoints, malformed ZIP, or unsafe archive paths. |

## Imported projects

- Filtered Funding Directory Cards: 3 versions.
- Funding Path Comparison Matrix: 4 versions, including the complete neo-brutalist static export.
- Hard Money: 6 variants with their CSS, JavaScript, and supporting pages.
- Ecommerce Cash Flow Forecaster: 1 static site, including its embed page and documentation.

The classifier is read-only with respect to source files. It flags changed copies of already represented projects for review instead of replacing their existing published routes. `scripts/bulk-static-zip-extraction.ps1` remains the workflow for eligible ZIP extraction inside existing `sites/` folders; these four families were copied from unpacked source folders after matching their entrypoint hashes to the corresponding ZIPs, so supporting files were preserved without flattening or overwriting a route.
