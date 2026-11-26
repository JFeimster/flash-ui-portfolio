# NeuLedger — Banking MVP Marketing Site (Static)

A multi-page, bank-like marketing site for a Unit.co-powered business checking + debit MVP.

## Pages
- `index.html` — Home
- `product.html` — Product overview
- `how-it-works.html` — Simple 3-step flow
- `who-its-for.html` — Eligibility + KYB checklist + not-supported list
- `roadmap.html` — Tasteful roadmap
- `company.html` — Company + compliance notes (important)
- `early-access.html` — Waitlist form (local demo storage)

## Tech
- Pure HTML/CSS/JS (no build step)
- Deploy anywhere (Vercel recommended)

## Local dev
Just open `index.html` in your browser, or run a simple static server:

### Node
```bash
npx serve .
```

### Python
```bash
python -m http.server 3000
```

## Deploy to Vercel
1. Create a GitHub repo (example: `neubanking-mvp-site`)
2. Push these files to the repo
3. Import the repo into Vercel as a **Static Site**

## Notes
- The waitlist form currently saves submissions to `localStorage` for demo/testing.
- Swap it for Tally/Typeform/Wix (or your own endpoint) when ready.
- The compliance language is intentionally conservative. Don’t “bank cosplay.”

---
Owned by JF Ventures (recommended). Banking rails via Unit partner banks.
