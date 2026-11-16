# Batch 36 data lineage

The canonical deployed inventory is `data/site-registry.json`; the canonical generator input is `data/site-generator-prompts.json` (169 unique IDs). Discovery records only point to those prompts and never create deployed-site records.

`scripts/build-data-discovery.mjs` derives the 169-entry discovery index and 169-row crosswalk from the generator file, and validates the external 305-entry library before copying its four sparse source indexes. Set `FLASH_UI_PROMPTS_SOURCE` to a checked-out `flash-ui-prompts/data` directory and `FLASH_UI_NOTION_REGISTRY_SOURCE` to the directory containing the three verified Notion registry JSON files. The external source was checked at commit `6e82a2ab62b812f6bbf5df90ef2197eee44c89ef`.

Crosswalk matches use normalized exact titles only. The 100 title overlaps are review candidates, and the remaining 69 generator entries have no title match. The external category, visual style, brand, and CTA labels retain their source taxonomy and cover only subsets of the 305 records. They do not change the 12 generator style options. Blank style tags in the discovery index mean that no reliable style mapping was established.

The three Notion registry pages and their source JSON were read. Their public candidate files contain IDs, names, source file references, and review status only; they omit internal prompt prose. All 28 vertical candidates remain draft because their source rows contain TODO fields. Source dates and URLs are in `data/idea-source-index.json`.

The four **exact uploaded** FLASH-UI Ideas v2 JSON Schema/template files were recovered and added at `data/schemas/` and `data/templates/`. Both Draft 2020-12 schemas and both blank templates were validated before import. The source-inventory report is now at `docs/flash-ui-data-import-opportunities.json`; it remains a candidate list, not an instruction to promote every row. These are reference materials, not deployed-site records or additional generator entries.

Archived ZIP demo values were not imported. External project references contain verified GitHub links only, without copying private JSON or asserting production deployment.
