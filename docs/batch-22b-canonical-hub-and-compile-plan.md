# Batch 22B Canonical Hub and Compile Plan

## Scope
- the-cac-payback-analyzer
- the-saas-ltv-cac-diagnostic
- quote-grenade-studio
- veteran-jester-dispatch
- meme-propaganda-department
- affiliate-agency-launch-funnel
- affiliate-id-generator-tool
- ai-funding-strategist-landing-page
- ai-sdr-system
- businesses-for-sale-directory
- embed-code-generator
- from-idea-to-url-static-site-factory
- local-business-funding-page-washington-dc
- person-finder-micro-agent
- social-media-post-generator-for-affiliates
- funding-intelligence-engine
- startup-credit-stacker-console
- acquisition-financing-calculator
- cfo-in-a-box
- embed-widget-studio
- partner-account-portal
- static-site-prompt-generator-for-flash-ui
- stockout-death-spiral-estimator

## High-confidence groups to compile
- the-cac-payback-analyzer
- the-saas-ltv-cac-diagnostic
- quote-grenade-studio
- veteran-jester-dispatch
- meme-propaganda-department
- affiliate-agency-launch-funnel
- affiliate-id-generator-tool
- ai-funding-strategist-landing-page
- ai-sdr-system
- businesses-for-sale-directory
- embed-code-generator
- from-idea-to-url-static-site-factory
- local-business-funding-page-washington-dc
- person-finder-micro-agent
- social-media-post-generator-for-affiliates

## Groups to skip in this batch
- startup-credit-stacker-console: Manual-review group with OneDrive permission/reparsepoint anomalies; left untouched by instruction.
- funding-intelligence-engine: Out of this batch target scope; deferred to next cleanup pass.
- acquisition-financing-calculator: Singleton deferred by instruction.
- cfo-in-a-box: Singleton deferred by instruction.
- embed-widget-studio: Singleton deferred by instruction.
- partner-account-portal: Singleton deferred by instruction.
- static-site-prompt-generator-for-flash-ui: Singleton deferred by instruction.
- stockout-death-spiral-estimator: Singleton deferred by instruction.

## Verification checklist
- Canonical hub exists per compiled group.
- Every compiled variant has index.html at root or a documented static/index.html fallback.
- Hub buttons link to canonical /sites/[group-slug]/variant-n/ paths.
- Compiled legacy sibling folders are removed after git mv.
- No ZIP files deleted.
- vercel.json unchanged.
- data/site-registry.json unchanged.

## Explicit non-changes
- vercel.json not touched
- data/site-registry.json not touched
- registry files not rewritten
- livePath values not changed
- ZIP files not deleted
- no deployment run
- no Vercel unlock performed
- no app conversions performed

## Recommended next batch
- Compile funding-intelligence-engine (1/2) into /sites/funding-intelligence-engine/variant-{1,2}/ with a canonical hub.
- Handle singleton canonicalization decisions for deferred one-off groups.
- Run dedicated manual review and cleanup for startup-credit-stacker-console once OneDrive permission/reparsepoint behavior is stable.
