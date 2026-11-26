# Flash UI Portfolio OS — Task Tracker

> Active development program (2026-11-26): see the release ledger below and `PROJECT_STATUS.md`. The historical batch roadmap remains for traceability; its earlier "next execution" text is superseded by this program.

## Active release ledger

- [ ] Release 1 — importer v1.1: manifest and variants; duplicate detection; relative dependencies; registration modes; Catalog v2 metadata; preview discovery; rollback; idempotence; bulk intake; isolated apply tests.
- [ ] Release 2 — detailed asset workspace, explainable relationships, comparison, advanced search and saved views; canonical Design Theme Gallery; Integration & MCP Advisor; existing handoffs.
- [ ] Release 3 — offline, provider-neutral Creation Copilot connecting Generator and Workbench with suggestions, prompt drafts, revision history, brief portability, and build handoff.
- [ ] Release 4 — configurable dry-run automation recipes, promotion and product lifecycle, evidence-based opportunity and readiness recommendations, distribution preparation, exportable decisions, and existing handoffs.
- [ ] Each release: focused checks, protected-data hashes, live-route preservation, commit, PR/merge where appropriate, deployment revision and production URL verification.

Implementation notes and actual evidence belong in `PROJECT_STATUS.md`; check an item only when its acceptance work is complete.

**Repository:** [JFeimster/flash-ui-portfolio](https://github.com/JFeimster/flash-ui-portfolio)  
**Production:** https://flash-ui-portfolio.vercel.app/  
**Status:** Batches 19B–20 squash-merged as PR [#91](https://github.com/JFeimster/flash-ui-portfolio/pull/91). Next priority: import/registry intake, then reusable product pipelines.

## Operating rules

- Keep original source exports and all existing public URLs.
- `data/site-registry.json` is protected: **do not edit it without explicit canonical-registry authorization** and a deliberate test/compatibility plan. Normal new imports use additive files.
- Extend existing `/sites/`, `/use-asset/`, `/factory/`, manifests, graph, and exporters instead of creating duplicate platforms.
- Work in focused batch branches. Run tests, route checks, and preview verification; squash-merge once green and authorized. No merge/deploy for merely drafted scopes.
- GitHub Issues below are the actionable checklists. Check tasks off **inside the corresponding issue**; this file tracks status and dependency order.

## Immediate next actions

- [ ] **#92 — Batch 25 / Registry intake + import triage.** Establish a single-project JSON template, safe proposed canonical edits, additive import flow, duplicate detection and source-based classification. [Issue #92](https://github.com/JFeimster/flash-ui-portfolio/issues/92)
- [ ] Triage the Batch 19C backlog from `data/batch-19c-import-review.json`: **178 needs classification, 102 standalone application exports, 17 unsupported/failed, 2 duplicate ZIPs**. Counts are candidate *records*, not distinct projects; choose a small evidence-backed cohort.
- [ ] Use the [continuous import / registry curation prompt](docs/prompts/import-and-update-project-registry.md) in a new ChatGPT project thread.
- [ ] Use the [per-project registry JSON generator prompt](docs/prompts/generate-project-registry-json.md) when preparing a record for an existing project.

## Product-building roadmap

| Order | Batch / Issue | Priority | Dependency | Status |
| --- | --- | --- | --- | --- |
| 1 | [25 — Registry intake, import triage and metadata](https://github.com/JFeimster/flash-ui-portfolio/issues/92) | P0 | Existing catalog | [ ] |
| 2 | [26 — Asset-to-Product Pipeline](https://github.com/JFeimster/flash-ui-portfolio/issues/93) | P0 | 25 identity/metadata | [ ] |
| 2 (parallel) | [27 — Tool Factory 2.0](https://github.com/JFeimster/flash-ui-portfolio/issues/94) | P0 | Existing Tool Factory | [ ] |
| 3 | [28 — Plugin, MCP & Agent Factory](https://github.com/JFeimster/flash-ui-portfolio/issues/95) | P1 | 27 specs | [ ] |
| 3 (parallel) | [29 — Project Intelligence & Reuse](https://github.com/JFeimster/flash-ui-portfolio/issues/96) | P1 | 25/26 metadata | [ ] |
| 3 (parallel) | [30 — Collections & Build Queues](https://github.com/JFeimster/flash-ui-portfolio/issues/97) | P1 | Existing saved state | [ ] |
| 3 (parallel) | [31 — Design System & Variant Mixer](https://github.com/JFeimster/flash-ui-portfolio/issues/98) | P1 | 26/27 outputs + actual themes | [ ] |
| 4 | [32 — Revenue & Distribution Toolkit](https://github.com/JFeimster/flash-ui-portfolio/issues/99) | P1 | 26/27 | [ ] |
| 4 (source inventory independent) | [33 — Reusable Component Vault](https://github.com/JFeimster/flash-ui-portfolio/issues/100) | P1 | Existing source assets / 26 exports | [ ] |
| 5 | [34 — One-Click Build Packages](https://github.com/JFeimster/flash-ui-portfolio/issues/101) | P1 | Outputs of 26–33 | [ ] |

### Batch 25 acceptance gate (do before broad importing)

- [ ] A project JSON generator matches actual canonical field names and observed types; missing values are not invented.
- [ ] Existing projects are matched by source/path/slug before proposing new entries.
- [ ] Additive files handle display, grouping, variants, previews, and new import provenance.
- [ ] Canonical edits require explicit authorization and pass deliberate registry integrity tests.
- [ ] No ZIP/HTML sources are replaced or moved without a separate approved plan.
- [ ] The first classified candidate cohort has working source evidence and local route checks.

### Batches 26–27 acceptance gate

- [ ] Asset-to-Product extends existing `/use-asset/` and supports a source-backed adaptation/packaging plan.
- [ ] Tool Factory 2.0 extends existing calculator, scorecard and checklist archetypes without regression.
- [ ] Shared exports/manifest contracts are reused rather than duplicated.

### Specialized modules acceptance gate (28–31)

- [ ] Plugin/MCP scaffolds are distinguished from working, deployed integrations.
- [ ] Project intelligence cites actual source and relationship evidence.
- [ ] Queues and collections reuse existing curated/saved state.
- [ ] Variant mixing preserves original source assets and tests any actually generated export.

### Commercialization and assembly gate (32–34)

- [ ] Distribution templates have accurate links, disclosures, and deployment conditions.
- [ ] Component vault records preserve source provenance, dependencies and license constraints.
- [ ] One-click packages use existing ZIP exporter and are downloadable and smoke-tested.

## Source-of-truth reference

| Role | Files |
| --- | --- |
| Protected canonical legacy registry | `data/site-registry.json` |
| Additive imports and extraction | `data/site-registry-batch-5-additions.json`, `data/site-registry-static-extractions.json`, `data/batch-19c-import-*.json` |
| Project grouping and ownership | `data/asset-groups.json`, `data/variant-route-contracts.json` |
| Presentation | `data/asset-showcase.json`, `data/asset-previews.json` |
| Derived route/catalog data | `data/asset-route-resolution.json`, `data/asset-packages.json` |
| Existing build/reuse entrypoints | `factory/`, `use-asset/`, `scripts/build-asset-packages.mjs`, `scripts/generate-route-resolution.ps1` |

## Completion log

- [x] Batch 19A — Correct Embed Widget Studio and Embed Code Generator variant ownership; PR #90.
- [x] Batches 19B–20 — Recovered seven project families, imported 14 distinct static variants, improved directory discovery and reuse; PR #91.
- [x] GitHub issues #92–#101 created with checklists and executable prompts.
- [x] Reusable new-thread intake and per-project JSON prompts documented.

**Next execution:** Start with [Issue #92](https://github.com/JFeimster/flash-ui-portfolio/issues/92) and the continuous-import prompt; process one verified import cohort, not the entire backlog at once.
