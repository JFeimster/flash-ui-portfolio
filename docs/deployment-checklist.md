# Deployment Checklist

Use this checklist for controlled Flash UI Portfolio OS deployments.

## Deployment policy

Automatic Vercel Git deployments are normally disabled to preserve deployment quota and avoid noisy preview churn.

Locked state in `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": true,
  "git": {
    "deploymentEnabled": false
  }
}
```

## When to deploy

Deploy only after a meaningful release checkpoint, such as:

- frontend behavior change
- public directory mode change
- registry/data change that affects visible cards
- smoke-test improvement that should be visible in production
- major documentation release if docs are intended to be live-accessible

Do not deploy every small metadata/doc PR by default.

## Pre-deployment checklist

Before opening the deployment window:

- PR is merged into `main`.
- `main` is clean.
- Expected release commit is known.
- `vercel.json` is locked before the deployment window.
- Production URL is known:

```txt
https://flash-ui-portfolio.vercel.app/
```

## Open deployment window

1. Edit `vercel.json` on `main`.
2. Remove the `git` block.
3. Leave:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": true
}
```

4. Commit with neutral wording such as:

```txt
Update Vercel deployment window
```

## Verify deployment

Use Vercel connector or Vercel UI to confirm:

- project: `flash-ui-portfolio`
- production deployment is `READY`
- deployment points to the intended commit

Then verify key URLs:

```txt
https://flash-ui-portfolio.vercel.app/
https://flash-ui-portfolio.vercel.app/?view=public
https://flash-ui-portfolio.vercel.app/data/site-registry.json
https://flash-ui-portfolio.vercel.app/data/card-display-rules.json
https://flash-ui-portfolio.vercel.app/data/asset-actions.json
https://flash-ui-portfolio.vercel.app/data/asset-curation.json
```

If live-path changes were part of the release, also verify representative card links.

## Restore deployment lock

Immediately restore `vercel.json` to:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": true,
  "git": {
    "deploymentEnabled": false
  }
}
```

Commit with neutral wording such as:

```txt
Restore Vercel deployment guard
```

## Post-lock verification

Confirm:

- `vercel.json` on `main` includes `deploymentEnabled: false`
- no unexpected additional production deployment was created after lock restore
- production remains on the intended release deployment

## Deployment report format

Return:

```txt
Release batch:
Merge commit:
Deployment-window commit:
Production deployment status:
Verified URLs:
Lock restore commit:
Final vercel.json status:
Warnings:
```
