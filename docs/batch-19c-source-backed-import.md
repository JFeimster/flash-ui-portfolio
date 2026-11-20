# Batch 19C — source-backed incremental imports

The attached `flash-ui-portfolio-codex.zip` is an older local repository snapshot, not the current GitHub checkout. We inspected actual nested archive contents and recorded evidence in `data/batch-19c-source-evidence.json`.

## Workflow

1. Place a candidate ZIP on the local machine and run `node scripts/import-static-zip.mjs /absolute/source.zip --slug=unique-slug` (dry-run).
2. Only after reviewing the preview, rerun with `--apply`. It extracts a **new** static directory under `sites/` and adds an entry to `data/batch-19c-approved-imports.json`. It refuses existing paths, framework packages, unsafe archives and missing root index.html.
3. Commit the imported source files and additive manifest, regenerate route/package metadata with the existing scripts, and smoke-test the new public route.
4. Update `data/site-registry.json` only when a real static source has been committed and verified, and only add the specific new record. Never replace the entire registry.

The High Converting Lead Magnet family already has a canonical group and three variants; do not re-import it. The SMB Financial OS archive has a root HTML and CSS but no working JavaScript. Treat it as a static visual prototype, not a connected financial SaaS.
