# Batch 25B and 19C — additive catalog and intake

The existing canonical entry `user-account-portals` already records variants 1–4 and is intentionally unchanged. The new `data/portal-catalog-batch-25b.json` provides role-level metadata without moving or overwriting files.

Batch 19C has 327 candidate records. `data/batch-19c-incremental-triage.json` assigns a review disposition to every existing candidate. These are **not** verified import approvals: local ZIP archives are not in this repository, and no standalone app is converted to a static site without its source.

## Single-project intake

Run `node scripts/preview-project-intake.mjs path/to/project.json` from the repo root. The CLI reads a JSON record, checks its title/slug/type/path/livePath, checks existing canonical and additive registries and route resolution for collisions, and prints a preview only. It does not write any registry or import files. Supply source provenance and a real static index before proposing promotion. Do not modify `data/site-registry.json` without separate approval.

## Portal roles

- applicant: /sites/user-account-portals/variant-1/
- affiliate: /sites/user-account-portals/variant-2/
- partner: /sites/user-account-portals/variant-3/
- administrator: /sites/user-account-portals/variant-4/

All four are static demonstrations, not live authenticated workspaces.
