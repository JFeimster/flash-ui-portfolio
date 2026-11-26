# Funding Product Matrix Hub

A static, mobile-first link-in-bio style resource page for Moonshine Capital / DistilledFunding.

## Purpose

This page helps brokers, referral partners, consultants, ISOs, broker VAs, and funding agency operators quickly access the Funding Product Matrix resources:

- PDF download
- CSV download
- Interactive Notion version
- YouTube breakdown
- Full article
- Funding agency CTA
- Funding options
- Broker automation resources

## File Structure

```txt
site/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Deployment

This is a no-build static site.

### Local Preview

Open `site/index.html` in your browser.

### Vercel

1. Create a new Vercel project.
2. Upload or connect the repository containing the `site` folder.
3. Set the project root or output directory to `site` if needed.
4. No build command is required.
5. Deploy.

## Link Placeholders

The page uses the requested placeholder URLs exactly as provided:

- `https://www.distilledfunding.com/go/funding-matrix-pdf`
- `https://www.distilledfunding.com/go/funding-matrix-csv`
- `https://www.distilledfunding.com/go/funding-matrix-notion`
- `https://www.distilledfunding.com/go/funding-matrix-video`
- `https://www.distilledfunding.com/go/funding-matrix-article`
- `https://www.distilledfunding.com/go/start-funding-agency`
- `https://www.distilledfunding.com/go/funding-options`
- `https://www.distilledfunding.com/go/broker-automation`

## Notes

- No React.
- No Tailwind.
- No external dependencies.
- JavaScript is optional enhancement only.
- The page works without JavaScript.
- Uses semantic HTML, accessible links, focus states, and responsive CSS.
