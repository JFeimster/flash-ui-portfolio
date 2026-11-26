# AI-Driven Market Opportunity Scanner

**Juliet Foxtrot Ventures** · Interactive Flash UI static prototype · **Quiet Intelligence OS**

Find a buyer with a costly problem and decide how to test it.

## Launch

Open `index.html` directly in a modern browser, or serve this folder:

```bash
python -m http.server 8765
# open http://localhost:8765/
```

No build, dependencies, API key or network access required. Deploy the folder as a static Vercel project, or **separately** add it to `sites/ai-driven-market-opportunity-scanner/` in `JFeimster/flash-ui-portfolio` following its existing metadata and smoke-test workflow. This package makes no external changes.

## Functional scope

- Scan by research track, buyer segment, U.S. geography and window. Run Sample Scan to update source coverage, priority and results.
- Synthetic trend chart with **no inference from searches to accounts or revenue**. Coverage explicitly shows missing sources.
- Three distinct opportunities covering sub-$5M acquisition financing, managed FinOps and broker-partner technology; the broker opportunity has a strong fictional trend but weak payer evidence.
- Evidence ledger supports category/type/stance/text filters and details. Deduplicate repeated reports by opportunity and stable `event_key`, retaining all original report details. Contradictions and assumptions cannot inflate priority.
- Compare buyer/payer, workaround, urgency, competitors, downside, uncertain dimensions, and priority separately from confidence.
- Edit reachable units, adoption bounds and price bounds; validate range and calculate bottom-up revenue scenarios with explicit units.
- Enter observations manually or import CSV with row-numbered errors and atomic validation (all rows pass or none imported). Exact duplicate rows are skipped; imported observations can change ranking.
- Shortlist, scenario assumptions and experiment edits survive page reload via localStorage. Select a row to produce and copy/download an honest, deterministic Markdown brief even when evidence is missing.
- Semantic tables, keyboard navigation, visible focus, responsive stacked mobile layout and reduced-motion support.

## Evidence import

Required CSV headers (order independent):

```csv
opportunity_id,source,source_category,date,geography,evidence_type,excerpt,event_key,signal,stance
```

Optional header: `value`.

| Field | Allowed values |
| --- | --- |
| `opportunity_id` | `acq`, `finops`, `broker` |
| `source_category` | `search`, `community`, `technology`, `regulatory`, `business`, `buyer` |
| `evidence_type` | `measured`, `anecdote`, `assumption` |
| `date` | valid `YYYY-MM-DD` |
| `signal` | `pain`, `spend`, `reach`, `timing`, `trend`, `technology`, `regulatory`, `demographic` |
| `stance` | `support`, `contradict` |
| `event_key` | Same ID for reports of the same underlying event |

CSV parser handles quoted commas, escaped quotes and multiline quoted cells. Max file size 2 MB, up to 1,000 data rows. Download or inspect `data/example-broker-import.csv` for **synthetic sample data that change the ranking**. Reimporting exact records does not inflate event counts.

## Decision model

Each distinct supporting event adds 5 points for measured behavior (6 for spend) or 3 for anecdote (4 for spend) to one 0–10 dimension. Assumptions add no score; contradictions are displayed and penalize confidence. Four weights: **pain 30%, spend 30%, reachability 20%, timing 20%**. Unknown dimensions show `Unknown`, not invented zeros or unearned points. Confidence is a *separate demonstration heuristic* based on support mix, contradictions and missing dimensions. Threshold for Test: 45 priority + positive spending indication. Weak evidence remains Watch or Pass. These are **prototype heuristics, not statistical probabilities**.

## Local data and safety

**Every bundled observation, quantified event and trend is Demo data — simulated or fictional**, including those called “measured behavior.” There is no live source connection or factual claim about actual buyer demand. Imported/manual records show **USER-ENTERED / UNVERIFIED**. Integrations are explicitly **Setup required**. Do not put confidential customer data in browser storage; there is no backend, authentication, encryption or synchronization.

Storage key: `jf-opportunity-scanner-v1`. Clearing browser site storage resets shortlist, custom observations, and edits. The page works with `file://` because `data/fixtures.js` is a byte-equivalent JavaScript representation of canonical `data/fixtures.json`.

## Files

```text
index.html
styles.css
app.js
data/fixtures.json
data/fixtures.js
data/example-broker-import.csv
README.md
tests/browser_test.py
```
