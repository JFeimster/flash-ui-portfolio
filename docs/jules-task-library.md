# Jules Task Library

Use these task prompts for focused, bounded repo work. Each task should run on its own branch and stop at a pull request unless explicitly approved to merge or deploy.

## Add metadata file

```txt
Create an additive metadata file for Flash UI Portfolio OS.

Rules:
- Do not rewrite data/site-registry.json.
- Do not change livePath values.
- Do not modify /sites files.
- Do not modify ZIP files.
- Do not change vercel.json.
- Add documentation explaining the metadata purpose.
- Open a PR and stop.
```

## Add docs-only batch

```txt
Create or update docs only for Flash UI Portfolio OS.

Rules:
- Only change files under docs/.
- Include repo overview, workflow, validation, and guardrails.
- Do not modify app code, data registries, /sites, or vercel.json.
- Open a PR and stop.
```

## Audit static site readiness

```txt
Audit static site readiness for assets under /sites.

Return:
- folders with index.html
- folders missing index.html
- root-level HTML files
- archive/manual-review assets
- nested app candidates
- recommended next action for each group

Rules:
- Do not rename folders.
- Do not move files.
- Do not change livePath values.
```

## Audit public directory readiness

```txt
Review public directory mode readiness.

Check:
- assets with livePath
- curation metadata coverage
- public directory eligibility
- assets that should remain internal
- assets that need copy/design review
- assets that should become lead magnets or embeds

Return recommendations only unless explicitly assigned to edit files.
```

## Audit standalone apps

```txt
Audit standalone app deployment candidates.

Create:
- data/standalone-app-candidates.json
- docs/standalone-app-deployment-plan.md

For each candidate include:
- title
- path
- framework guess
- package manager
- build command
- output type
- likely Vercel strategy
- should remain in portfolio
- should move to separate repo
- business priority
- notes

Rules:
- Do not deploy.
- Do not move files.
- Do not rename folders.
```

## Generate slug normalization plan

```txt
Generate a slug normalization plan.

Create:
- data/slug-normalization-plan.json
- docs/slug-normalization-plan.md

For each candidate include:
- current path
- current livePath
- proposed folder slug
- proposed livePath
- risk level
- redirect recommendation
- registry impact
- asset reference risk
- manual review needed

Rules:
- Do not rename folders.
- Do not change livePath values.
- Do not add redirects yet.
```

## Fix small frontend issue

```txt
Fix one small frontend issue in Flash UI Portfolio OS.

Rules:
- Keep changes limited to assets/js/app.js and/or assets/css/styles.css.
- Preserve internal mode behavior unless the issue is specific to public mode.
- Preserve search/filter behavior.
- Preserve Advanced / Dev Details in internal mode.
- Do not modify registry files or /sites files.
- Open a PR and stop.
```
