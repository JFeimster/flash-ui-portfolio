# Batch 24.1: Idea and Prompt Workbench

## Rebuild

Run `node scripts/build-ideas-discovery.mjs` after changing the canonical `data/site-generator-prompts.json`, optional `data/ideas-metadata.json`, or `data/asset-links.public.json`. The builder writes the discovery index, public Site Generator projection, one prompt payload and detail route per visible idea, and a generated route manifest. It detects duplicate IDs and slugs and removes stale generated routes and prompt payloads recorded in the previous manifest.

The canonical prompt library remains the only prompt source. Generated JSON files are projections, not independent registries. New unflagged site ideas publish automatically. `private: true`, `hidden: true`, or `visibility: "private"` / `"hidden"` on the canonical entry exclude it. The optional metadata override accepts the same visibility values. Design templates do not get idea detail pages.

The optional metadata file is keyed by canonical idea ID. Supported fields include `summary`, `tags`, `target_audience`, `key_features`, `design_style`, `complexity`, `monetization`, `marketing_tool`, `build_status`, and `visibility`. `marketing_tool` may supply the optional blueprint fields shown in the UI. Omitted values stay open.

## Public boundary

The generated discovery index has brief metadata and links. Original prompts are served only from per-idea payloads and the generated public Site Generator projection. Hidden ideas are absent from those outputs and their stale generated files are removed on rebuild. `.vercelignore` excludes the canonical prompt source and optional metadata file from hosted static assets. The Site Generator uses the generated public projection.

This is a public Git repository. A genuinely confidential prompt must never be put in the committed canonical source: exclusion from the deployed site cannot remove it from Git history. Before publishing a change with a private flag, regenerate outputs and verify the deployment's source-file exclusion in a preview. No deployment is part of this batch.

## Connected assets

`data/asset-links.public.json` is an explicit public allowlist, with `assets` and `relationships` arrays. A relationship has `idea_id`, `asset_id`, `type`, `verification`, and `provenance`. Types are `implements`, `inspired_by`, `variation_of`, `source_repository`, `deployed_as`, `related_tool`, `powered_by`, and `potential_integration`. Only `verified` or `recorded` relationships with provenance and a public HTTPS asset render as links. Suggested and unknown relationships remain unlinked.

GitHub records require public visibility and a stable `repo_key` or `repo_full_name`; Vercel records require `vercel_project_id`; GPT records require a valid public GPT access URL and stable ID or slug. Editor links are rejected. The importer deliberately copies only public display fields. Current exact slug matches to local portfolio site index pages are recorded automatically, with neutral labels and no deployment-health claim.

The GitHub, Vercel, deployment, and custom GPT inventories are not part of this worktree. To add connections later, review those inventories locally, verify each proposed relationship, and add only explicitly allowed public assets to this manifest. Never copy a raw inventory into `data/` or `assets/`.

## Prompt recipes

`data/prompt-recipes.public.json` is a public-safe projection of the supplied local command inventory, with 12 purposes, inputs, outputs, and deterministic instruction templates. To refresh it from an approved local file, run `node scripts/import-prompt-recipes.mjs <local-registry-path>`. This import does not copy source metadata or execute commands. The workbench appends chosen instructions to a browser-local draft.

## Reference distinctions

The optional tool blueprint separates a proposed standalone tool, embedded widget, calculator, and lead capture opportunity. Empty blueprint fields remain `To define`. This follows the scope distinction in [Engineering-as-Marketing Tools](https://myfunding.notion.site/engineering-as-marketing-tools), [Eng-as-Marketing](https://myfunding.notion.site/engineering-as-marking?v=dfd70890f96143c383aba1872df00060), [Funding Tools & Calculators](https://myfunding.notion.site/tools?v=3154bc1bd63c8088a833000c8d9db993), and [Embedded Tools & Widgets](https://myfunding.notion.site/embedded-tools?v=36b4bc1bd63c80fb9783000c59e5284f). The workbench does not collect leads or run integrations.
