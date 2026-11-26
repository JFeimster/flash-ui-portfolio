# Asset Command Center v5

Launch `Open-Asset-Command-Center.ps1`, then open http://127.0.0.1:8765/.

## Safety and persistence

- This app listens only on `127.0.0.1`.
- Existing `project-registry-enriched.json` and `user-overrides.json` remain the project registry and saved editorial decisions.
- v5 additions are stored in `asset-command-center-v5.json`; uploaded/indexed copies live in `managed-sources/`. Original selected source files are not edited.
- A pre-v5 copy of application and JSON data is in `.backup-before-v5-20261119-222000/`.

## Chrome

Startup only loads saved local state. It does not read, import, watch, poll, or reindex Chrome bookmarks.

Use **Discover Chrome profiles** to browse available profiles and all available roots (Bookmarks bar, Other bookmarks, Mobile bookmarks). This is browse-only. Select a folder scope and click **Reimport Chrome** to explicitly update matching project records. Existing records, saved decisions, and records from other scopes are retained.

## Sources and enrichment

Use **Files & Sources** to scan the supplied Registry directory or upload files/folders. The parser supports JSON arrays, nested object collections including `entries` and `assets`, CSV, Markdown, HTML, text, ZIP listings, and XLSX text extraction. Malformed inputs retain a parse error record.

The merge workflow only applies unambiguous identifier matches and only fills currently empty, unlocked saved fields. Website verification and the pipeline are manual jobs. GitHub and Vercel authenticated adapters remain unavailable until credentials/integration setup is explicitly added; no tokens are stored by this app.
