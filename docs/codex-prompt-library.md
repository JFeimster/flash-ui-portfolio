# Codex Prompt Library

This library contains copy/paste prompts for Codex-style repo work on Flash UI Portfolio OS.

## Batch implementation prompt

```txt
Repository:
JFeimster/flash-ui-portfolio

Task:
Implement Batch [NUMBER]: [TITLE]

Branch:
batch-[NUMBER]-[short-name]

Rules:
- Keep changes scoped to the batch.
- Do not rewrite data/site-registry.json unless explicitly approved.
- Do not modify /sites assets unless explicitly assigned.
- Do not delete ZIP files.
- Do not change livePath values.
- Do not change vercel.json unless this is an approved deployment-window task.
- Prefer additive metadata and docs.
- Compare branch to main before opening PR.
- Open a clean PR and stop before deployment.

Return:
- files changed
- validation performed
- risks
- PR title
```

## PR review prompt

```txt
Review PR #[NUMBER] for JFeimster/flash-ui-portfolio.

Verify:
- changed files match the batch scope
- no protected registry files changed unless approved
- no /sites files changed unless approved
- no ZIP files changed
- no livePath values changed
- vercel.json unchanged unless this is deployment-control work
- JS syntax risk is low
- docs are internally consistent

If clean, summarize readiness.
If not clean, identify blocking issues and exact file/line concerns.
```

## Merge prompt

```txt
Review and merge PR #[NUMBER] if clean.

Use squash merge.
Commit title:
Batch [NUMBER]: [TITLE]

Commit message:
[One sentence describing the batch.]

After merge:
- confirm PR is closed/merged
- return merge commit SHA
- do not deploy unless explicitly approved
```

## Controlled Vercel deployment prompt

```txt
Repository:
JFeimster/flash-ui-portfolio

Production URL:
https://flash-ui-portfolio.vercel.app/

Task:
Open a controlled Vercel deployment window, verify production, then lock deployments back down.

Steps:
1. Confirm vercel.json currently has git.deploymentEnabled false.
2. Remove the git deployment lock from vercel.json.
3. Commit to main with neutral deployment-window wording.
4. Verify Vercel production deployment is READY.
5. Verify:
   - /
   - /?view=public
   - /data/site-registry.json
   - /data/asset-actions.json
   - /data/asset-curation.json
6. Restore vercel.json with git.deploymentEnabled false.
7. Confirm lock is back on main.
8. Confirm no unexpected extra production deployment occurred after lock restore.

Return:
- deployment commit
- production deployment status
- verified URLs
- lock restore commit
- final vercel.json status
```

## Static ZIP extraction prompt

```txt
Repository:
JFeimster/flash-ui-portfolio

Task:
Run the static ZIP extraction workflow for newly added assets only.

Rules:
- Do not delete ZIP files.
- Do not overwrite existing extracted folders unless approved.
- Extract eligible static HTML/CSS/JS sites under /sites.
- Do not convert Next.js apps in this flow.
- Add or update extraction reports only.
- Do not rewrite canonical registry unless explicitly approved.

Return:
- ZIPs inspected
- ZIPs extracted
- ZIPs skipped
- reasons for skips
- files changed
```

## Smoke test prompt

```txt
Repository:
JFeimster/flash-ui-portfolio
Production URL:
https://flash-ui-portfolio.vercel.app/

Task:
Run or update live-path smoke tests.

Verify:
- root homepage loads
- data/site-registry.json loads
- representative livePath URLs load
- one root legacy HTML asset loads
- one /sites folder index.html loads
- one /sites root-level HTML file loads
- nested app candidates remain marked as candidates, not opened as static sites
- archive/ZIP cards remain marked for review

Update:
- data/live-path-smoke-test.json
- docs/live-path-smoke-test.md
```

## Public mode QA prompt

```txt
Repository:
JFeimster/flash-ui-portfolio
Production URL:
https://flash-ui-portfolio.vercel.app/

Task:
QA public directory mode.

Verify:
- / loads internal mode by default
- /?view=public loads public mode
- public mode hides archives
- public mode hides standalone app candidates
- public mode hides Advanced / Dev Details
- public mode preserves Open Site and Copy Link
- search works in both modes
- filters work in both modes
- data/asset-curation.json loads

Return issues with exact reproduction steps.
```
