# Asset Command Center v4 — permanent local installation

**Only one permanent folder is required:** `Desktop\chrome-bookmark-asset-manager`.

## Upgrade once

Extract the **upgrade ZIP** anywhere temporarily and execute:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Install-Into-Existing-Folder.ps1
```

The installer copies the new local server, redesigned interface, launcher, and this guide into your **existing** Desktop folder. It preserves all existing JSON files and enrichment results. You can remove the temporary extracted ZIP contents afterward. Future code updates should target that same folder.

## Daily operation

From your permanent folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Open-Asset-Command-Center.ps1
```

Or use the full Desktop path. Browser opens at **http://127.0.0.1:8765/**. Keep the PowerShell window open for the local server and 10-minute Chrome polling. Closing PowerShell stops the local process. Do not open the old `OPEN-BOOKMARK-LIBRARY-ASSET-MANAGER.html` for v4; that is a static snapshot and cannot save edits.

## Source and project identity

- The initial source is `folder-vibe-bookmarks.json`, captured by selecting **Folder** and **Vibe** under Chrome **Bookmarks bar**, including their nested descendants.
- 222 project candidates were previously derived from that selected export, not 222 actual computer files.
- The original JSON stays in `bookmarks-original.json`. Auto-import reads Chrome's current `Bookmarks` files across profiles (read-only), specifically `Folder` and `Vibe`, and reindexes when changed.
- A live source import is recorded in `import-history.json`, with a fingerprint, date, source name, included folders, bookmark count, and candidate count.
- URL-based matching is only a candidate. The Review Queue allows editorial approval, not technical verification.

## Saved state / backup

- `user-overrides.json` — names, descriptions, custom tags, favorites, approvals/rejections, saved views, manual URL associations. **Keep and back this up.** It is never reset during reindexing.
- `project-registry-enriched.json` — derived projects + public GitHub/site status.
- `bookmarks-original.json` — latest selected bookmark snapshot.
- `import-history.json` — provenance snapshots.
- `link-health-report.json` and `github-enrichment.json` — external read-only checks.

## Views

**Projects:** working search, platform/folder/status filters, table/cards, saved views, details, favorites, approve/reject, filtered exports.

**Bookmark Explorer:** nested tree with checkboxes for branches and links, folder search, copy URLs, selected JSON/CSV.

**Review Queue:** approve/reject project candidates, review individual unmatched links. Bulk-approve applies only to the visible queue.

**Imports & Sources:** exact source lineage and manual JSON import.

**Automations:** transparent list of working and not-yet-enabled behaviors.

## Automation boundaries

- **Automatic:** Chrome Folder/Vibe polling every 10 minutes *while running*, and registry rebuild on changes.
- **User-initiated:** public site and GitHub API checks via **Refresh sites + GitHub**.
- **Not enabled:** authenticated Vercel matching, screenshots, scheduled tasks when app is closed, hosted backend, remote/cloud sync. Those need separate setup; they are explicitly not represented as complete.
- This local app listens on `127.0.0.1` only, has **no public authentication**, and contains private bookmarks. Do not expose port 8765 to the network or publish any JSON/HTML from this folder.

If Chrome has unsaved bookmark changes, they will appear on the next polling cycle or when **Reimport Chrome** is pressed.
