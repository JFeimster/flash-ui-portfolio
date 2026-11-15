# Jester Quotes synchronization

`scripts/sync-jester-quotes.mjs` reads the approved `JFeimster/jester-quotes/main` commit, builds `sites/dada-riot`, and updates only changed static files under `sites/jester-quotes/`. It preserves the portfolio editions hub at `sites/jester-quotes/variants/` and all other portfolio sites. The existing eight-edition registry must match the canonical source's slugs, destinations, and statuses; a change in that contract requires review.

The script records the exact source commit and SHA-256 hashes of exported files in `data/jester-quotes-sync.json`. The committed manifest starts uninitialized so this mechanism PR does not reimport the site. The first sync creates a separate content update PR. Repeating a sync at the same commit leaves the tree unchanged. It validates required nested routes and local links before writing. It never copies source development files.

Manual local run from the portfolio root (Node 22):

```sh
node scripts/sync-jester-quotes.mjs
```

Pin a reviewed source commit with `--source-sha <40-character SHA>`. For local tests, `--source-dir <checkout>` and `--built-dir <static-output>` avoid a network clone and build. The source directory must be a Git checkout.

Manual Actions trigger:

```sh
gh workflow run sync-jester-quotes.yml --repo JFeimster/flash-ui-portfolio --ref main
```

The daily scheduled check compares the canonical `main` revision. A changed revision builds and opens one update PR on `codex/jester-quotes-auto-sync`; if that PR is already open, the workflow updates that branch. Nothing merges or deploys automatically. The sync job remains inactive until the repository variable `JESTER_QUOTES_SYNC_ENABLED` is set to `true`; this also gates manual dispatches.

Repository setting prerequisite: Actions must be allowed to create pull requests. As checked on 2026-11-15, the repository currently reports `can_approve_pull_request_reviews: false` and has no Actions secrets. Enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**, then set **Settings → Secrets and variables → Actions → Variables → `JESTER_QUOTES_SYNC_ENABLED`** to `true` before running the workflow. The workflow needs PR creation permission but does not approve or merge PRs.
