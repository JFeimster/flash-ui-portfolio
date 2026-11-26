# Acquisition Deal Fundability Calculator

A lightweight acquisition-underwriting and seller-exit intelligence tool with provider-aware marketplace imports, debt-capacity screening, seller financing, buyer-cash analysis, sources-and-uses modeling, and seller valuation.

**Current version:** 1.5.0  
**Calculator:** https://acquisition-fundability.vercel.app/  
**Import Listing:** https://acquisition-fundability.vercel.app/import  
**Seller Valuation:** https://acquisition-fundability.vercel.app/seller-valuation  
**Methodology:** https://acquisition-fundability.vercel.app/methodology  
**Repository:** https://github.com/JFeimster/acquisition-fundability

## Purpose

Built for acquisition entrepreneurs, first-time buyers, brokers, financing prospects, and online-business sellers. The buyer workflow screens transferable cash flow, senior debt capacity, seller financing, buyer cash requirements, and unresolved diligence assumptions. The seller workflow provides a market-backed valuation estimate through Empire Flippers' Referral Partner Valuation Tool API.

Educational screening only; not lender approval, investment advice, a formal appraisal, or a guarantee of sale price.

## v1.5 — Multi-marketplace import adapters

The normalized import workflow now supports four marketplaces:

| Marketplace | Import method | Notes |
| --- | --- | --- |
| Empire Flippers | Official public Marketplace API | Automatic listing import; similar-listing recommendations remain available |
| Acquire.com | User-supplied public listing text | URL whitelisted; no automated crawling |
| BizBuySell | User-supplied public listing text | URL whitelisted; explicit SDE/EBITDA labels preserved |
| Flippa | User-supplied public listing text | Monthly revenue/profit can be normalized when supplied |

### Why some adapters use pasted listing text

Acquire.com and BizBuySell restrict automated scraping/data extraction in their published terms. v1.5 therefore parses only public listing text supplied by the user instead of fetching those listing pages server-side. Flippa uses the same controlled input pattern in v1.5 so the non-Empire-Flippers provider architecture remains predictable and does not become a general-purpose crawler.

### Provider terminology guardrail

Marketplace profit terminology is not silently converted:

- Acquire.com `TTM Profit` remains TTM Profit until the user confirms SDE vs. EBITDA treatment.
- BizBuySell maps to SDE only when the pasted listing explicitly identifies `Cash Flow (SDE)` / Seller's Discretionary Earnings; explicit EBITDA maps to EBITDA.
- Flippa `Monthly Profit` can be annualized for calculator use, but SDE/EBITDA basis remains unresolved unless confirmed.

Missing management cost, owner dependence, capex, working capital, customer concentration, books quality, or retained-debt facts remain **Needs confirmation** rather than being invented.

### Multi-marketplace endpoint

`POST /api/import-listing`

Empire Flippers:

```json
{
  "url": "https://empireflippers.com/..."
}
```

Acquire.com / BizBuySell / Flippa:

```json
{
  "url": "https://supported-marketplace.example/listing/...",
  "sourceText": "public listing text copied by the user"
}
```

The endpoint whitelists supported marketplace hosts and is not an arbitrary URL-fetch proxy.

Detailed adapter notes: `docs/v1.5-marketplace-adapters.md`

## v1.4 — Seller Valuation Tool

`/seller-valuation` uses the Empire Flippers Referral Partner Valuation Tool API through a server-side Vercel function.

### Serverless endpoint

`GET /api/empire-flippers/valuation`

The function:

- reads `EMPIRE_FLIPPERS_API_KEY` only from the Vercel server environment
- sends the secret to Empire Flippers only from the server
- accepts required average monthly net profit plus supported optional valuation inputs
- supports SaaS refinements such as current/previous MRR and churn
- normalizes absolute low, typical low, suggested listing price, typical high, and absolute high valuation ranges
- returns whether the provider is using a profit or recurring-revenue multiple
- never exposes the API key to browser JavaScript or HTML

Production verification returned a live valuation successfully after v1.4 deployment.

## v1.3.2 — Similar Empire Flippers Listings

After an Empire Flippers listing is imported, the Import page can surface up to three similar marketplace opportunities using Empire Flippers' official Recommendations API.

- Uses the provider's internal listing UUID, with a listing-number resolution fallback.
- Similar listings never change the analyzed deal's fundability score.
- Cards can show asking price, monthly profit/revenue, multiple, owner hours, listing status, and other available provider context.
- Every outbound Empire Flippers recommended-listing URL includes referral attribution.
- Empty/error recommendation states do not break importing or manual underwriting.

Endpoint:

`GET /api/recommendations?id=<internal-uuid>&listingNumber=<listing-number>`

## v1.3.1 — Import Intelligence + Financing Structure

The importer separates four data states:

- **Imported** — directly reported or directly parsed from the supplied marketplace source
- **Inferred** — calculated directly from source facts
- **Recommended** — editable screening heuristic
- **Needs confirmation** — source data cannot safely support the assumption

The financing layer includes:

- Target DSCR — default 1.35x
- Acquisition loan and maximum supportable senior acquisition loan
- Seller note
- Buyer cash available
- Working/operating capital at close
- Transaction/closing costs
- Total project cost
- Required buyer cash
- Financing gap/surplus
- Purchase-price equity
- Conservative / Balanced / Aggressive debt-capacity scenarios at 1.50x / 1.35x / 1.20x DSCR

### Core formulas

`Cash Flow Available for Senior Debt Service = Stated Cash Flow - Applicable Replacement Management - Capex Reserve - Other Annual Debt Service`

`DSCR = Cash Flow Available for Senior Debt Service / Annual Senior Acquisition Debt Service`

`Max Annual Senior Debt Service = Cash Flow Available for Senior Debt Service / Target DSCR`

`Total Project Cost = Purchase Price + Working Capital at Close + Transaction / Closing Costs`

`Required Buyer Cash = Total Project Cost - Acquisition Loan - Seller Note`

`Financing Gap / Surplus = Total Project Cost - Acquisition Loan - Seller Note - Buyer Cash Available`

Working/operating capital at close is a **use of funds**, not an annual DSCR deduction.

## Empire Flippers affiliate attribution

Referral code: `6I8WK4WSMYC9KGJD`

Approved Empire Flippers outbound paths append referral attribution while retaining source URLs separately.

## Fundability Score

| Component | Maximum |
| --- | ---: |
| DSCR | 35 |
| Books quality / verifiability | 20 |
| Owner dependence / transferability | 15 |
| Customer concentration | 10 |
| Capex burden | 10 |
| Recurring revenue | 10 |
| **Total** | **100** |

Unknown imported diligence fields receive no score credit until confirmed.

## Wix embed

Compact calculator URL:

`https://acquisition-fundability.vercel.app/?embed=1`

```html
<iframe
  src="https://acquisition-fundability.vercel.app/?embed=1"
  title="Acquisition Deal Fundability Calculator"
  width="100%"
  height="1180"
  style="width:100%;max-width:940px;border:0;display:block;margin:0 auto;"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
></iframe>
```

## Vercel deployment policy

Project setting:

`Project Settings → Build and Deployment → Ignored Build Step → Only build production`

Expected behavior:

- feature/release/hotfix branches → skipped/canceled before build
- pull-request branches → skipped
- `main` → production build

Release workflow:

1. Create a release/hotfix branch.
2. Commit and review changes.
3. Open a PR.
4. Squash-merge approved PR into `main`.
5. Vercel deploys production automatically.
6. Verify affected pages/endpoints in production.

## Project structure

```text
/
├── api/
│   ├── import-listing.js
│   ├── recommendations.js
│   └── empire-flippers/
│       └── valuation.js
├── lib/
│   └── providers/
│       ├── empire-flippers.js
│       ├── empire-flippers-recommendations.js
│       └── manual-marketplaces.js
├── docs/
│   ├── vercel-deployment-policy.md
│   └── v1.5-marketplace-adapters.md
├── index.html
├── import.html
├── seller-valuation.html
├── methodology.html
├── README.md
├── vercel.json
├── css/
│   ├── calculator.css
│   ├── v1.3.1.css
│   ├── v1.3.2.css
│   ├── v1.4.css
│   └── v1.5.css
├── js/
│   ├── app-shell.js
│   ├── calculator.js
│   ├── import-v1.5.js
│   └── seller-valuation.js
└── assets/
    └── logo.svg
```

## Roadmap / Issues

- **#5 — v1.3:** Dedicated Import Listing page + Empire Flippers Marketplace API — completed
- **#7 — v1.3.1:** Import Intelligence + Financing Structure — completed
- **#13 — v1.3.2:** Similar Empire Flippers Listings / Recommendations — completed
- **#8 — v1.4:** Seller Valuation Tool powered by Empire Flippers Referral Partner API — completed
- **#10 — v1.5:** Multi-marketplace import adapters — Acquire.com, BizBuySell, Flippa — completed
- **#9 — Future:** Empire Flippers Marketplace & Valuation Snippet integrations
- **#11 — Future:** Acquisition Deal Lab / acquisition-tool ecosystem consolidation

## Related Moonshine Capital resources

- Distilled Funding / Moonshine Capital: https://www.distilledfunding.com/
- Business Acquisition & Exit Network: https://www.distilledfunding.com/group/business-acquisition-exit-network
- Funding application: https://www.distilledfunding.com/apply

## Disclaimer

Marketplace data, pasted listing text, import recommendations, similar-listing suggestions, seller valuation outputs, debt-capacity estimates, score outputs, and financing scenarios are screening/discovery inputs only. Verify financial definitions, lender requirements, equity injection, fees, debt terms, working capital, transaction costs, tax treatment, legal diligence, acquisition structure, and source financials with qualified professionals before making a transaction decision.
