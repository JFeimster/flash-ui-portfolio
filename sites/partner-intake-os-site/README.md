# Partner Intake OS — Marketing Site

Production-ready static marketing site generated from the Partner Intake OS website brief.

## Files

```text
partner-intake-os-site/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Run locally

From the folder:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Primary CTA

The site links directly to the live GPT:

```text
https://chatgpt.com/g/g-6a4b8054aaac8191a197ca527ce9ad11-partner-intake-os
```

## Implementation notes

- Plain HTML/CSS/JS.
- No build step.
- No external JS libraries.
- Responsive from mobile through wide desktop.
- Accessibility-minded semantic structure and reduced-motion support.
- Interactive Partner Intelligence Console.
- Animated score counter and workflow rail.
- Prompt cards copy example prompts to clipboard.
- Architecture copy is intentionally framed as system design / expansion path where capabilities may not yet be deployed.
- Unknown footer destinations are explicitly marked `URL TBD` rather than fabricated.

## Deployment

This folder can be deployed directly to:

- Vercel static hosting
- Netlify
- GitHub Pages
- Any conventional static web host

For a Vercel deployment, point the project root to this folder and use no build command.

## Suggested next production pass

1. Add real Moonshine Capital / Partner Command Center URLs.
2. Add an Open Graph image.
3. Add analytics.
4. Add optional live demo data from the Partner Intake API once the endpoint contract is stable.
5. If this becomes part of an existing Next.js/Vercel app, port sections into reusable components while preserving the visual system.
