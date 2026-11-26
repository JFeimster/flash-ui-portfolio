# Deal Calculator Embed (Static)

A lightweight, dependency-free deal calculator for **small business acquisition financing**.

It estimates:
- Buyer down payment amount
- Bank/SBA percentage (auto-calculated as the remainder)
- Monthly debt payments (seller note + bank/SBA)
- DSCR (simplified lender-style view)

## Files
- `index.html` — markup
- `styles.css` — styling (responsive, no external fonts)
- `script.js` — calculator logic
- `README.md` — setup instructions

## Run locally
Just open `index.html` in your browser.

Or use a simple static server (optional):
```bash
# Python (if installed)
python -m http.server 3000
```
Then open: http://localhost:3000

## Deploy (Vercel)
This is a static site. Two easy options:

### Option 1: Vercel (no build)
1. Create a new GitHub repo and push these files.
2. In Vercel: **New Project** → import the repo.
3. Framework preset: **Other**
4. Build command: (leave blank)
5. Output directory: (leave blank)
6. Deploy.

### Option 2: Drag-and-drop
Some hosts allow uploading a folder as a static site. Ensure `index.html` is at the project root.

## Embed in Wix (iFrame)
In Wix: Add → Embed Code → Embed HTML, then paste:

```html
<iframe
  src="https://YOUR-DEPLOYED-URL"
  style="width:100%; height:860px; border:0; border-radius:14px;"
  loading="lazy"
  title="Business Acquisition Deal Calculator"
></iframe>
```

### Notes
- If your Wix section is narrow, increase the iframe height.
- You can tweak the DSCR thresholds inside `script.js`.
- This is an educational estimator only — not underwriting.
