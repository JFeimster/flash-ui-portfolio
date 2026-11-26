# Funding Workflow Guardrail Builder Launch Site

Two static website versions for the **Funding Workflow Guardrail Builder** Custom GPT:

1. A full standalone launch site
2. A compact iframe-safe embed designed for a maximum canvas of **1200 × 940**

No build tools, package manager, framework, or backend are required.

## File Tree

```text
funding-workflow-guardrail-launch-site/
├── index.html
├── styles.css
├── script.js
├── embed.html
├── embed.css
├── embed.js
├── README.md
├── robots.txt
└── assets/
    ├── favicon.svg
    └── og-image.svg
```

## GPT and Resource URLs

- GPT: https://chatgpt.com/g/g-6a57c12bd01c8191acf2a3a0b038961c-funding-workflow-guardrail-builder
- Human Review Checkpoint Map: https://docs.google.com/document/d/14ruSLY4yOFT50nSbCNeuB5c_H1O-zrWLNM1qHBz7yns/copy
- Funding Agency Automation Pack: https://drive.google.com/drive/folders/1jkd-9yCnccVC7Jc21YTVgu8h1aElrgDB

These URLs are already wired into the primary and embed versions.

## Primary Site

Open `index.html` directly or serve the directory through any static host.

The primary site includes:

- Conversion-focused hero
- Green, Yellow, and Red framework
- Workflow output grid
- Eight human checkpoints
- Guardrail report preview
- 40-point scorecard
- Persona and fit sections
- Four-step process
- Resource CTAs
- FAQ
- JSON-LD for SoftwareApplication, FAQPage, and BreadcrumbList
- Open Graph and Twitter metadata
- Responsive mobile navigation
- Reduced-motion support
- Privacy-conscious analytics hooks

## Embed Version

Use `embed.html` in an iframe or custom HTML block.

Desktop target:

- Maximum width: `1200px`
- Maximum height: `940px`

At smaller widths the embed becomes vertically responsive and may require normal page scrolling.

### Generic Iframe

```html
<iframe
  src="https://YOUR-DOMAIN.com/embed.html"
  width="100%"
  height="940"
  style="max-width:1200px;border:0;overflow:hidden;"
  loading="lazy"
  title="Funding Workflow Guardrail Builder"
  allow="clipboard-write"
></iframe>
```

### Wix

1. Deploy this folder to a public static URL.
2. In Wix, add **Embed Code → Embed a Site**.
3. Paste the public `embed.html` URL.
4. Set the element width to `100%`.
5. Set height to `940px`.
6. Set a maximum width of `1200px` where the Wix layout permits.

### Notion

Notion’s native embed may add its own frame and spacing. Deploy the project, paste the `embed.html` URL into an `/embed` block, then resize the block to the available width.

## Local Preview

From the project directory:

```bash
python3 -m http.server 8080
```

Then open:

- Primary: `http://localhost:8080/index.html`
- Embed: `http://localhost:8080/embed.html`

## Vercel Deployment

### Drag-and-Drop

1. Place the files in one folder.
2. Import the folder into a new Vercel project.
3. Select **Other** as the framework preset.
4. Leave the build command empty.
5. Use the project root as the output directory.

### Git Deployment

Push the folder to a Git repository, import it into Vercel, and deploy without a build command.

After deployment, replace these placeholders in `index.html`:

- `https://YOUR-DOMAIN.com/funding-workflow-guardrail-builder`
- `https://YOUR-DOMAIN.com/`
- `https://YOUR-DOMAIN.com/ai-agents`
- `https://YOUR-DOMAIN.com/assets/og-image.svg`

## Other Static Hosts

The same folder works on:

- Netlify
- GitHub Pages
- Cloudflare Pages
- Amazon S3 static hosting
- Any traditional web server
- Wix or Webflow through an iframe
- Carrd through an embed block

## Customization Points

### Brand

Edit CSS variables near the top of:

- `styles.css`
- `embed.css`

### Copy

Edit the text directly in:

- `index.html`
- `embed.html`

### Calls to Action

Search for these URLs:

```text
https://chatgpt.com/g/g-6a57c12bd01c8191acf2a3a0b038961c-funding-workflow-guardrail-builder
https://docs.google.com/document/d/14ruSLY4yOFT50nSbCNeuB5c_H1O-zrWLNM1qHBz7yns/copy
https://drive.google.com/drive/folders/1jkd-9yCnccVC7Jc21YTVgu8h1aElrgDB
```

### Canonical and Social Metadata

Replace `YOUR-DOMAIN.com` values in `index.html`.

## Accessibility

Included:

- Semantic landmarks
- Skip link
- Keyboard-focus styles
- Accessible labels
- Text labels in addition to zone colors
- Native FAQ disclosure controls
- Responsive layouts
- Reduced-motion fallbacks
- No forced audio or modal interactions

## Analytics Hooks

The JavaScript emits a browser event named:

```text
guardrail:cta
```

CTA IDs:

```text
cta-launch-gpt-hero
cta-launch-gpt-mid
cta-launch-gpt-final
cta-download-checkpoint-map
cta-open-automation-pack
cta-embed-launch-gpt
```

Example listener:

```js
window.addEventListener("guardrail:cta", (event) => {
  console.log(event.detail);
});
```

If `window.dataLayer` exists, events are pushed as `guardrail_cta`.

If `window.plausible` exists, events are sent as `Guardrail CTA`.

The site works normally without analytics.

## Important Limitation

The site and GPT provide educational and operational workflow guidance. They do not provide legal, lending, underwriting, tax, accounting, or compliance advice and do not guarantee funding approval, eligibility, timing, terms, business results, or regulatory compliance.
