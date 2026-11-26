# Broker Follow-Up Machine GPT — Static Landing Page FIXED

A deploy-ready static HTML/CSS/JS landing page for **Broker Follow-Up Machine GPT**.

Style: **Broker Ops Brutal Futurism** — neo-brutalist fintech automation meets cyberpunk broker revenue ops dashboard.

## Project Overview

This site is designed to convert loan brokers, business funding brokers, funding agency owners, broker teams, processors, VAs, and referral partner managers into users of the custom GPT.

Primary CTA:

```text
Use Broker Follow-Up Machine
```

Primary CTA URL:

```text
https://chatgpt.com/g/g-6a2152c07e488191862b272d5e3a4b44-broker-follow-up-machine
```

Secondary CTA:

```text
Download Sequence Pack
```

## File Structure

```text
broker-follow-up-machine-static/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── favicon.svg
    └── social-card.svg
```

## How to Run Locally

No build tools required.

Option 1: Open directly:

```text
Open index.html in your browser.
```

Option 2: Use a local static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deploy to Vercel

1. Create a new GitHub repository.
2. Add these files to the repository root.
3. Go to Vercel.
4. Click **Add New Project**.
5. Import the GitHub repository.
6. Framework preset: **Other**.
7. Build command: leave blank.
8. Output directory: leave blank or use root.
9. Deploy.

## Deploy to Netlify

1. Drag the project folder into Netlify Drop, or connect your GitHub repo.
2. Build command: leave blank.
3. Publish directory: root.
4. Deploy.

## Connect the Lead Magnet Form

The current lead magnet form is placeholder HTML only. It prevents default submission and shows a temporary “Connect Form Provider” message.

Fast options:

### Tally

Replace the `<form class="lead-form">...</form>` block in `index.html` with your Tally embed code.

### Typeform

Replace the form block with your Typeform embed or popup button.

### Kit / ConvertKit

Use your Kit form embed and match the fields you want.

### Beehiiv

Use Beehiiv's subscribe form embed if the Sequence Pack is tied to a newsletter.

### Google Forms or Airtable

Link the **Download Sequence Pack** button to the form URL, or embed the form iframe.

## Edit CTA Links

Search in `index.html` for:

```text
https://chatgpt.com/g/g-6a2152c07e488191862b272d5e3a4b44-broker-follow-up-machine
```

Replace with your latest GPT or destination URL if needed.

## Safety Language Reminder

This site intentionally avoids:

- funding guarantees
- approval claims
- eligibility claims
- pre-approval claims
- lender-specific promises
- underwriting claims
- aggressive borrower pressure language

Safe language used:

- A broker should review this.
- This may be worth reviewing.
- We can take a closer look.
- The next step is to complete your file.
- Human review required before sending.
- No funding promises. No approval claims. Just cleaner follow-up infrastructure.

## Customization Notes

### Colors

Edit CSS variables at the top of `styles.css`:

```css
:root {
  --void: #050505;
  --carbon: #111318;
  --cyan: #00E5FF;
  --lime: #B6FF00;
}
```

### Sections

Every section in `index.html` is labeled with clear IDs:

- `#problem`
- `#workflows`
- `#pipeline`
- `#automation`
- `#safety`
- `#lead-magnet`
- `#faq`

### Motion

Reveal-on-scroll and FAQ behavior live in `script.js`.

Reduced-motion support is built into `styles.css`.


## Fix Note

This version inlines the full CSS and JavaScript into `index.html` so the design renders even when a preview environment fails to load external `styles.css` or `script.js`. The separate CSS/JS files are still included for editing.
