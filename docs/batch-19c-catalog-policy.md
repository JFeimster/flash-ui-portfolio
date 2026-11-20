# Batch 19C catalog policy

Every candidate in the original 327-record inventory is discoverable at `/imports/`, including incomplete, ZIP, HTML, framework, and previously declined sources. Duplicate source hashes are linked rather than excluded. `previousStatus` is historical metadata, not an approval state.

Source references are **not** deployed previews. To promote to a live site, add the actual files under `/sites/` and only then append the corresponding entry to `data/site-registry.json`. Do not create broken `/sites/` URLs for local-only archives.
