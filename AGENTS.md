# Flash UI Portfolio OS development rules

Read `TASKS.md` and `PROJECT_STATUS.md` before changing a release. Work from the next dependency-ready item and record evidence after each release.

- Preserve `data/site-registry.json` and `data/transferable-design-themes.json` byte-for-byte. Preserve original source assets, live routes, local browser state, and the shared navigation stacking fix.
- Use additive records and existing catalog, asset graph, route contracts, collection, packaging, Generator, and Workbench infrastructure. Do not create a parallel catalog or similarity registry.
- Portfolio-owned interfaces use Voltage Brutalism. Imported sites and theme previews retain their own designs.
- Do not infer working integrations, external market demand, revenue, or deployment readiness from catalog metadata alone. Label rule-based output accurately.
- Keep imports transactional and idempotent. Test apply and rollback in isolated temporary workspaces. Do not overwrite an existing destination or delete a source export.
- Use focused checks, protected-file hash checks, route checks, and production verification. Record the actual revision and observed URLs before marking a release live.
- No paid API activation, new external infrastructure, secret exposure, or external recipe execution without separate authorization.

Release order: importer contract; Asset Intelligence and Design Studio; AI Creation Copilot; automation and opportunity/commercialization. Independent modules may proceed in parallel after the importer contract is established. Avoid simultaneous edits to shared registries, catalog core, renderer, or global styles.
