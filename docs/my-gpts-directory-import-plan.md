# My GPTs Directory Import Plan

## Purpose
Batch 21G adds a structured GPT directory data layer for the AI Agent Library for Entrepreneurs so later batches can render Jason's Custom GPTs, agents, assistants, and AI-powered tools from a normalized source file.

## Source Export Used
- Source: `My GPTs. (4-26-26).json`
- Companion reference: `My GPTs. (4-26-26).csv`
- Source label written to records: `chatgpt-gpt-export-2026-04-26`
- Import scope: 82 GPT entries

## Directory Schema
Records are stored in `data/my-gpts-directory.json` as an array with fields:
- `name`, `slug`, `accessUrl`, `description`, `profileImageUrl`
- `category`, `subcategory`, `primaryUseCase`
- `audience` (array), `status`, `visibility`, `source`
- `recommendedDirectorySection`, `tags` (array), `notes`

## Category Taxonomy
Approved categories applied in this import:
- Funding & Capital
- Affiliate & Partner Growth
- Site Builders & UI
- Content & SEO
- Automation & API Ops
- FinanceOps & Cash Flow
- Business Buying & Valuation
- Community & Productization
- Creative & Media
- Prompt Engineering
- Personal Development
- Compliance & Disclosures
- Uncategorized

## How This Feeds Variants Later
In Batch 21H, AI Agent Library variants can read this file as a single source of truth for:
- card listing data
- category and section filters
- status/visibility badges
- featured groups and search index inputs

## Suggested Batch 21H Wiring Plan
1. Choose one AI Agent Library variant as first integration target.
2. Add a read-only loader for `data/my-gpts-directory.json`.
3. Render cards from directory records (no hardcoded GPT cards).
4. Add basic filter controls for `category` and `recommendedDirectorySection`.
5. Hide or label `draft-or-editor-link` entries by status/visibility.
6. Keep remaining variants unchanged until first integration is validated.

## Data Quality Warnings
- Categories, audience, section placement, and tags are inferred from GPT names/descriptions and should be reviewed before launch UX wiring.
- Access URLs are preserved exactly from export data (no URL enrichment/fetch performed).

## Editor/Private URL Notes
- Entries with `/gpts/editor/` are marked:
  - `status: draft-or-editor-link`
  - `visibility: private-or-editor-link`
  - `notes: Editor URL detected; may not be public share link.`

## Missing Profile Image Notes
- Profile image URLs are preserved as-is from export.
- Empty profile image values are stored as an empty string.
- Missing profile image count in this import: 1.
