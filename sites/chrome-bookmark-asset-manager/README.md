# Asset Command Center v3 — Local Upgrade

## Install once into your existing folder

Extract this ZIP to Downloads (temporary). Open PowerShell in the extracted directory and run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Install-Into-Existing-Folder.ps1
```

The installer updates **only four named files** in `C:\Users\jason\OneDrive\Desktop\chrome-bookmark-asset-manager`: the HTML dashboard, enrichment script, launcher and README. It does not remove or replace the existing bookmark or registry JSON files. If your existing folder is elsewhere, use `-Destination "C:\your\path"`. You can delete the extracted download after installing.

## Daily use — no more ZIP downloads

Open the existing `OPEN-BOOKMARK-LIBRARY-ASSET-MANAGER.html` directly, or run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME\OneDrive\Desktop\chrome-bookmark-asset-manager\Open-Asset-Command-Center.ps1"
```

## Refresh public website and GitHub metadata

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME\OneDrive\Desktop\chrome-bookmark-asset-manager\Open-Asset-Command-Center.ps1" -Refresh
```

Optional `-Limit 10` checks only 10 targets per category and **preserves previous checks** for other targets. No remote writes or scheduled jobs are performed.

## What's changed

- Single navigation: Projects, Bookmark Explorer, Review Queue, How to Use
- Compact table default, optional cards; search, status filters, pagination
- Project details with source folders, public website evidence, GitHub evidence, and copyable project JSON
- JSON/CSV filtered project exports
- Original complete bookmark folder explorer and selection/export interface retained
- Partial enrichment runs merge with prior results instead of erasing them
- Registry change reports compare stable source links, not enrichment fluctuations

## Known limits

- The embedded project registry is a **snapshot** of the imported Vibe/Folder bookmarks. Fresh Chrome bookmark changes do **not** automatically reindex projects. Use your original Chrome exporter for a new bookmark snapshot; a full reindex is a separate step.
- A reachable website and a verified GitHub repository do not prove they belong to the same project.
- The dashboard HTML contains private bookmark URLs. **Do not publish or commit it publicly.**
- There is no live browser synchronization, hosted backend, automated scheduled refresh, or Vercel API authentication.
- The installer is an in-place update, but it overwrites the four named application files. It preserves all existing JSON data files.
