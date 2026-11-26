# Capital Stack Marketplace (Static Demo)

A structure-first acquisition financing website:
- Home
- Stack Builder wizard (client-side)
- Capital Lanes directory + lane pages
- Deal Structure Library + example pages
- Deal Review intake (demo form)

## Run locally

Any static server works.

### Python
```bash
cd capital-stack-marketplace
python3 -m http.server 5173
```

Then open:
- http://localhost:5173/

## Notes
- The Stack Builder is a heuristic demo (not financial advice).
- Wire `/deal-review/` form into your CRM (HubSpot/Airtable/Retool/etc.) in production.
