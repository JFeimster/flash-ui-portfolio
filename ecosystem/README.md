# Asset Explorer

`/ecosystem/` reads the generated `data/asset-graph.public.json`. It shows only public GitHub records, valid GPT share links, recorded Vercel URLs, existing portfolio routes, and prompt recipes. A recorded Vercel URL has unknown current availability.

Refresh the catalog from read-only exports:

```powershell
node scripts/build-asset-graph.mjs --input-dir 'C:\Users\jason\Downloads' --review-output 'C:\Users\jason\Downloads\asset-graph-review.json'
node scripts/build-asset-graph.mjs --input-dir 'C:\Users\jason\Downloads' --check
node --test tests/asset-explorer.test.mjs
```

The review report stays outside the public repository. `--summary` prints counts without writing. `--output` changes the export path. Optional `asset-relations.json` can supply reviewed relations with exact `from`, `to`, `type`, `status`, and `provenance` fields. Suggested and unknown relations are not published as edges.

The currently available exports differ from the source counts stated in the Batch 24.3 brief. The generator reports actual counts on every run. No source registry or admin URL is copied into the public graph.
