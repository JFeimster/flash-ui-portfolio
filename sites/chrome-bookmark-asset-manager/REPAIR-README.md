# Asset Command Center 5.1 utility repair

Extract the ZIP. Double-click INSTALL-REPAIR.cmd. The installer targets the existing installation at C:\Users\jason\OneDrive\Desktop\chrome-bookmark-asset-manager, backs up its root files, replaces application code, and opens http://127.0.0.1:8765/. Leave the launcher window open.

Alternative destination: run Install-Repair.ps1 -Destination 'your-existing-folder'. The installer stops only a Python app_server.py process whose command line identifies that exact installation. If it cannot identify the old process, close the app's old server window and run the installer again.

## Start here

1. Bookmark Explorer: the complete recovered library has 4,566 bookmarks, 417 folders, and two profiles. Existing bookmark exports are merged into the saved view without deleting older folders. Select individual items or branches; export HTML/JSON/CSV or add selected URLs to Projects.
2. Files & Sources: click **Index included Registries**. Your provided collection is included. Then click **Fill missing info · all projects**. Alternatively index a local folder, choose a folder, upload files, or drop files onto the drop zone.
3. Projects: open an entry. Edit name, description, notes, tags, typed GitHub/Vercel/live links, properties, attachments, approvals, and favorites. Click **Save all changes**. Empty properties can be created directly in the editor.
4. Files & Sources: search names or file contents, view/edit an indexed copy, combine checked sources into a JSON export, add unmatched project records, or complete missing file values from matched projects and export the result.
5. Enrichment results: inspect progress and per-project results. Local filling uses exact identifiers. Read-only GitHub/site enrichment is on demand. GITHUB_TOKEN is optional and remains server-side.

## Preservation and limits

The recovered v4 code is the source for this repair because the latest Windows-only v5 implementation is unavailable in this workspace. This is a packaged repair, not a direct edit of the running Windows app. Existing project-registry.json, project-registry-enriched.json, user-overrides.json, attachments, and other data files are not replaced. Local repair additions use command-center-repair-state.json and command-center-attachments. Existing v5-specific fields stored in an unknown format remain on disk but are not automatically migrated into this interface. The root-file backup includes them.

Full-library reimport and file indexing run only on user actions. Starting the app does not scan Chrome, index folders, or contact external services. No scheduled automation, paid AI, authenticated Vercel API synchronization, PDF/OCR, or executable source-file handling is included. Vercel associations are recovered from existing project data and explicit imported registry records. The repair currently indexes JSON, CSV, Markdown, plain text, HTML, and ZIP archives containing these formats. Nested ZIP archives are not recursively expanded. JSON merges preserve each record with source attribution rather than silently resolving conflicting records.

GitHub and production reachability checks run in a cancellable job with a timeout per URL. They fetch metadata; they do not verify every application feature. Existing nonempty project descriptions/manual overrides survive filling. Ambiguous names alone do not trigger merges. File editing indexes a copy; downloaded completed files do not overwrite originals. Bulk projects are selected through the current filters, and bookmark items can be selected individually.

## Restore previous application

Close the server window. Copy the previous code files from the installer's repair-backup folder into the installation, then launch the previous launcher. Do not replace newer user data unless you intend to restore that data too.
