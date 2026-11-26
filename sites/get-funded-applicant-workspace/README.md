# Get Funded — Applicant Workspace

**Capital Dispatch / Punk Utility** · Moonshine Capital / Distilled Funding

A complete static, navigable **applicant-only frontend prototype**. The demo uses three coherent fictional funding request records for **Alex Morgan**. It is **not** a real funding portal: no authentication, real applicants, lender connectivity, document uploads, message delivery, CRM changes or live financial information.

## Preview

From the directory containing `applicant-workspace/`, run:

```powershell
py -m http.server 4173 --directory applicant-workspace
```

Open `http://localhost:4173/`, then select **Explore demo workspace**. Python 3 users on macOS/Linux can substitute `python3 -m http.server 4173 --directory applicant-workspace`.

**Do not** open `index.html` directly via `file://`; the UI fetches local JSON fixture files through the HTTP server. No dependency installation or build command is needed.

## Files

```text
applicant-workspace/
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   ├── demo.json
│   └── status-map.json
├── integrations/
│   └── contracts.md
└── README.md
```

## Screens

1. **Entry** — clearly labeled fictional demo; no pretend login.
2. **Overview** — Action Dispatch, active application, progress rail, activity ledger, support links.
3. **My Applications** — search, five status filters, sort, table/mobile cards, detail routing.
4. **Application Detail** — dossier, contextual next action, related document requests, progress and applicant-visible messages.
5. **Documents** — application/category/state filtering; drag/drop or picker; allowed `.pdf`, `.jpg`, `.jpeg`, `.png` up to 10 MB; cancel/retry; **metadata only**, no upload.
6. **Messages** — conversation list, search, read/unread state, draft and simulated send with explicit **“Demo only — no message sent.”**
7. **Funding History** — one fictional completed record and a clear no-more-results state.
8. **Account & Settings** — in-memory profile and separate service vs marketing preferences; reset demo.
9. **Resources & Support** — five resources, FAQ accordion and `admin@distilledfunding.com`.

## Data integrity and safety

- `GF-26-1042` — action-required, Harborline Supply Co., equipment expansion, $185,000 sample request.
- `GF-26-0928` — in-progress fictional review sample, Northline Studio LLC, working capital, $75,000 sample request.
- `GF-26-0604` — completed fictional sample, A.M. Toolworks LLC, equipment purchase, $48,000 sample request.
- Application IDs are cross-referenced by all documents, event logs, alerts, conversation threads and history.
- No hardcoded passwords, API keys, auth backend, account registration, SSN, DOB, full bank details, financial obligations, fabricated offer terms or private staff notes.
- No persistent browser storage. Refreshing the browser resets demo edits, selected file metadata and unsent replies.
- `robots` noindex/nofollow is a crawler hint, **not** security or authorization.
- Hash navigation supports back/forward and nested static hosting; all local asset paths are relative.
- Public **Start another funding request** opens existing `https://get-funded-six.vercel.app/apply/`. This app does not copy that intake form.

## Keyboard and reduced-motion support

Navigation uses native links and buttons. The mobile drawer includes Escape handling, the notification panel is keyboard accessible, stage details and FAQs use native `<details>` elements, document drop zones are keyboard-activatable, and focus indicators and reduced-motion behavior are provided.

## Future integration boundary

Read `integrations/contracts.md` for inert adapter interfaces (`AuthProvider`, `ApplicantRepository`, `ApplicationRepository`, `DocumentRepository`, `MessageRepository`, `NotificationRepository`, `FundingStatusMapper`) and required ownership/security controls. The intended final role is an **Applicant** module within `app.distilledfunding.com` backed by approved canonical operations (Supabase `platform-core`), not a separate auth service or CRM.

## Portability

The folder can be copied as-is into a nested static path such as `/sites/user-account-portals/variant-1/`; no existing `flash-ui-portfolio` registry change is implied or made.

## Validation

Run `node --check assets/js/app.js` to check JavaScript syntax. Start a local server for browser checks; see the accompanying delivery notes in the ZIP creation response for test coverage.
