# Operator Runbook

This runbook describes how to operate Flash UI Portfolio OS without turning the repo into a junk drawer with a deployment button.

## Core loop

1. Add or receive new Flash UI exports.
2. Preserve raw source assets.
3. Extract eligible static ZIPs under `/sites` only when assigned.
4. Index or add metadata without rewriting canonical registry unless approved.
5. Smoke test live paths.
6. Improve display metadata and grouping.
7. Curate assets by business value.
8. Expose clean assets through public mode.
9. Promote winners into lead magnets, Wix embeds, partner tools, or standalone apps.

## Branch workflow

Use batch branches:

```txt
batch-[number]-[task-name]
```

Examples:

```txt
batch-13-asset-actions
batch-14-asset-curation
batch-15-public-directory-mode
batch-16-project-kit-docs
```

## Protected files and folders

Treat these as protected unless explicitly assigned:

```txt
data/site-registry.json
data/site-registry-batch-5-additions.json
data/site-registry-static-extractions.json
/sites
*.zip
vercel.json
```

`vercel.json` may only change during a controlled deployment window or deployment-lock restore.

## PR checklist

Before opening a PR:

- compare branch to `main`
- list changed files
- confirm protected files are untouched
- confirm no accidental `/sites` changes
- confirm no ZIP changes
- confirm no `livePath` changes
- confirm no Vercel deployment-lock change unless approved
- describe risk clearly

## Merge checklist

Before merging:

- confirm PR is mergeable
- inspect changed files
- read review comments
- patch valid review findings
- squash merge
- record merge commit SHA
- do not deploy unless deployment is explicitly approved

## Deployment-window checklist

Only when approved:

1. Confirm `vercel.json` has:

```json
"git": {
  "deploymentEnabled": false
}
```

2. Remove the `git` block.
3. Commit to `main`.
4. Confirm production deployment is ready.
5. Verify production paths.
6. Restore the `git.deploymentEnabled: false` block.
7. Commit lock restore.
8. Verify final `vercel.json` state.

## Production verification paths

Common checks:

```txt
https://flash-ui-portfolio.vercel.app/
https://flash-ui-portfolio.vercel.app/?view=public
https://flash-ui-portfolio.vercel.app/data/site-registry.json
https://flash-ui-portfolio.vercel.app/data/asset-actions.json
https://flash-ui-portfolio.vercel.app/data/asset-curation.json
```

## What not to do

- Do not bulk rewrite registry data because a title looks ugly.
- Do not normalize slugs without a redirect plan.
- Do not deploy every small PR automatically.
- Do not treat nested app folders as static sites.
- Do not delete archives because they are messy.
- Do not bury user-facing card labels under implementation jargon.

## Escalation triggers

Pause and ask for explicit approval if a task requires:

- changing live paths
- renaming folders
- moving assets
- deleting files
- extracting ZIPs
- deploying standalone apps
- changing Vercel deployment settings outside a deployment window
- rewriting canonical registry files
