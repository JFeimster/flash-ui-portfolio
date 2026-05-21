# Batch 6 ZIP Review and Safe Extraction Report

## Summary

Reviewed the currently detected `.zip` assets and found that the inspected files are not true ZIP archives. They are HTML documents saved with `.zip` extensions.

No originals were deleted, moved, renamed, removed, or extracted in place.

## Findings

| Source path | Detected type | Action | Review copy |
|---|---|---|---|
| `sites/Funding Route Matcher/static-1/assets/marketing-banner-pack.zip` | HTML file with `.zip` extension | Copied as `.html` for review | `sites/_archive-review/funding-route-matcher-marketing-banner-pack.html` |
| `sites/Referral Source Tracker/static1/assets/marketing-kit.zip` | HTML file with `.zip` extension | Copied as `.html` for review | `sites/_archive-review/referral-source-tracker-marketing-kit.html` |

## Rules followed

- No files deleted.
- No files moved.
- No ZIP files removed.
- No real ZIP archives extracted.
- No Next.js apps converted.
- Originals remain preserved at their existing paths.

## Why this matters

These assets were flagged as ZIP/archive items because of their file extensions, but the file contents begin with `<!DOCTYPE html>`. That means the useful recovery action is not archive extraction. The safer move is to preserve the originals and create `.html` review copies that can be opened, inspected, and later promoted if useful.

## Review copies created

```txt
/sites/_archive-review/funding-route-matcher-marketing-banner-pack.html
/sites/_archive-review/referral-source-tracker-marketing-kit.html
```

## Recommended next steps

1. Preview the two review HTML files after Vercel deploys the merged PR.
2. Decide whether either asset should become a normalized portfolio item under `/sites/[slug]/`.
3. If promoted, add registry entries with `type: "static-site"` or `type: "sites-root-html"` depending on final location.
4. Run a deeper ZIP inventory if more archive folders are added later.

## Warnings

- This is not an exhaustive crawl of every possible archive-like file in the repository.
- The two reviewed `.zip` paths were copied, not renamed, so duplicate content now exists intentionally for review.
- These review copies are not yet added to the public registry/directory cards.
