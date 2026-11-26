# Site Architecture

- Production shell: root `index.html`, `assets/css/site.css`, `assets/js/site.js`.
- Sections: statically rendered section directories, self-contained indexes.
- Variation studies: `sites/[slug]/` with independent legacy CSS/JS, no dependence on main shell.
- Public downloads: original non-proprietary templates under `downloads/`.
- Structured metadata: `/data/*.json`; no private applicant records committed.
- **Future integration:** verified editorial registry, article pages, partner source refresh, resource attribution, forms and analytics.
- **Never assume:** publication status, active provider terms, lender approvals or real-time partner availability.
- **Production mount:** relative navigation supports prefix routes when all URLs are rewritten by the media site.

## Source registry model
`id`, `title`, `source_url`, `source_kind`, `status`, `last_verified_at`, `access`, `integration`, `notes`.

## UX acceptance checks
All 12 routes link from header and footer; nav exposes mobile toggle; calculator numbers update; launch-path quiz returns an action; partner directory filters; prompt copy works in secure contexts; variation links resolve; no secrets or backend writes.
