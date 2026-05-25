# AI Agent Library Canonicalization Report

## Scope
- Batch: 21F
- Group: `ai-agent-library-for-entrepreneurs`
- Objective: Canonicalize public variant URLs while preserving complete legacy source contents.

## Approved Canonical URL Shape
- `/sites/ai-agent-library-for-entrepreneurs/variant-1/`
- `/sites/ai-agent-library-for-entrepreneurs/variant-2/`
- `/sites/ai-agent-library-for-entrepreneurs/variant-3/`

## Legacy Folders Found
- `sites/AI Agent Library for Entrepreneurs 1`
- `sites/AI Agent Library for Entrepreneurs 2`
- `sites/AI Agent Library for Entrepreneurs 3`

## Files/Folders Moved
- `sites/AI Agent Library for Entrepreneurs 1` -> `sites/ai-agent-library-for-entrepreneurs/variant-1`
- `sites/AI Agent Library for Entrepreneurs 2` -> `sites/ai-agent-library-for-entrepreneurs/variant-2`
- `sites/AI Agent Library for Entrepreneurs 3` -> `sites/ai-agent-library-for-entrepreneurs/variant-3`

## Internal Structure Preserved
- Full legacy folder contents were moved for each variant.
- ZIP files were preserved in place inside each canonical variant folder.
- `static/` folders were retained for all three variants.
- Root `index.html` and `static/index.html` existed in each legacy folder and were identical (hash match).

## Wrapper/Redirect Index Requirement
- Not needed.
- Each canonical variant root already contains a working `index.html`.

## Hub Links Updated
Updated only:
- `sites/ai-agent-library-for-entrepreneurs/index.html`

Replaced legacy encoded links:
- `/sites/AI%20Agent%20Library%20for%20Entrepreneurs%201/static/`
- `/sites/AI%20Agent%20Library%20for%20Entrepreneurs%202/static/`
- `/sites/AI%20Agent%20Library%20for%20Entrepreneurs%203/static/`

With canonical links:
- `/sites/ai-agent-library-for-entrepreneurs/variant-1/`
- `/sites/ai-agent-library-for-entrepreneurs/variant-2/`
- `/sites/ai-agent-library-for-entrepreneurs/variant-3/`

## Verification Results
- Canonical variant folders exist: pass
- Each variant root has `index.html`: pass
- Hub links point to canonical variant root paths: pass
- Hub link targets contain `index.html`: pass
- Old encoded hub links removed from hub: pass
- ZIP files deleted: no
- `vercel.json` unchanged: pass
- `data/site-registry.json` unchanged: pass
- Unrelated groups changed: no

## Explicit Non-Changes
- `vercel.json` not touched
- `data/site-registry.json` not touched
- Registry files not rewritten
- `livePath` values not changed
- ZIP files not deleted
- No deployment run
- No Vercel unlock performed
- No `--all --apply` usage

## Remaining Risks
- Direct external references to old filesystem-style legacy paths may need follow-up updates if used outside this hub.

## Recommended Next Batch
- Batch 21G — Add GPT directory data layer