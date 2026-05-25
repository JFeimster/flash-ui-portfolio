# Flash UI Generation Prompt

Use this prompt when generating new Flash UI / Google AI Studio assets intended for eventual inclusion in the Flash UI Portfolio OS.

## Master prompt

```txt
Create a production-quality static website, widget, landing page, lead magnet, tool, calculator, directory, or app prototype for the following idea:

[DESCRIBE IDEA]

Audience:
[WHO USES IT]

Primary user action:
[OPEN SITE / COMPLETE QUIZ / COPY EMBED / APPLY / BOOK CALL / JOIN PARTNER PROGRAM]

Business purpose:
[LEAD MAGNET / WIX EMBED / AFFILIATE TOOL / PARTNER ENABLEMENT / CONTENT HUB / INTERNAL TOOL / STANDALONE APP CANDIDATE]

Style:
Premium dark-luxe fintech. High contrast. Clean editorial cards. Modern product UI. Avoid cheesy stock-photo energy. Make it feel useful, credible, and shippable.

Technical output:
- Prefer static HTML, CSS, and vanilla JavaScript unless a framework is truly necessary.
- Keep all assets self-contained when possible.
- Use clear file names.
- Include index.html at the root of the export.
- Avoid external paid dependencies.
- Avoid hidden API requirements.
- Avoid fragile build steps unless explicitly requested.

Content rules:
- Use clear headings.
- Use user-facing labels.
- Include a concise description of the asset's purpose.
- Include primary and secondary CTAs.
- Avoid claiming guaranteed funding, approval, or outcomes.
- Use compliance-safe language for funding and finance tools.
- If the asset uses scoring, explain that scores are directional and not an approval decision.

Portfolio metadata to include in notes or README:
- title
- category
- recommended use
- target audience
- primary CTA
- secondary CTA
- embed suitability
- public-directory suitability
- standalone deployment suitability
```

## Static-first guidance

The portfolio works best with assets that can be opened directly from `/sites/[folder]/`.

Prefer:

```txt
index.html
styles.css
script.js
README.md
```

Avoid unless intentionally building a standalone app:

```txt
package.json
next.config.js
vite.config.ts
node_modules
server-only API dependencies
```

## Finance and funding language guardrails

Use:

- funding readiness
- estimated fit
- likely documentation needs
- possible funding paths
- review recommended
- may qualify
- directional estimate

Avoid:

- guaranteed approval
- guaranteed funding
- instant approval claims unless tied to a specific verified partner flow
- lender-specific underwriting promises
- legal, tax, or accounting advice claims

## Good portfolio categories

Use labels like:

- Funding Tools
- Lead Magnets
- Partner Sites
- Widgets
- AI Agent Libraries
- Content Hubs
- Personal Brand Sites
- Static Site Factories
- Apps
- Experiments

## Recommended handoff note

After generating the asset, include:

```txt
Portfolio handoff:
- Suggested folder slug:
- Suggested title:
- Suggested category:
- Recommended use:
- Public directory candidate: yes/no
- Embed candidate: yes/no
- Standalone app candidate: yes/no
- Review notes:
```
