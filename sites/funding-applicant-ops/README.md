# Funding Applicant OPSCAN — Starter Site

Static starter UI for **Funding Applicant OPSCAN**.

The design direction is intentionally high-contrast, neo-brutalist fintech: oversized type, cream/ink base, electric blue, safety orange, acid lime, hard borders, dense operational UI, and minimal dependency overhead.

## Files

- `index.html` — complete single-page starter site
- `styles.css` — responsive UI, layout, motion, and design tokens
- `script.js` — reveal motion, demo OPSCAN interaction, and subtle card parallax

## Run locally

No build system is required.

Open `index.html` directly in a browser, or use any simple static server.

### PowerShell

```powershell
cd "PATH\TO\funding-applicant-opscan"
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Starter behavior

The interactive OPSCAN panel is a **front-end demonstration only**. It is not an underwriting model, credit decision, funding approval, or financial recommendation.

## Recommended next build

1. Replace demo inputs with the repository's real applicant schema.
2. Connect applicant intake data.
3. Define deterministic readiness/risk rules.
4. Add product-route recommendations.
5. Add operator notes and explainable scan findings.
6. Add persistence only after the scan contract is stable.

## Brand direction

- `--cream` — `#f3ede2`
- `--ink` — `#111111`
- `--orange` — `#ff5b2d`
- `--blue` — `#2650ff`
- `--lime` — `#c6ff45`

No external libraries or font dependencies are required.
