# Applicant Workspace — Future Integration Contracts

**Status:** Documentation only. These names describe inert future interfaces, not live connectors. This prototype makes no authenticated calls and never transmits any applicant or document data.

## Product boundary

- Existing public site: `https://get-funded-six.vercel.app/`
- Existing application form: `https://get-funded-six.vercel.app/apply/` (existing Tally form `w4R2Ad`)
- Existing repo: `JFeimster/get-funded`
- Operational source of truth when authorized: Supabase `platform-core`
- Intended future authenticated application: `app.distilledfunding.com`, where **Applicant Workspace** would be an applicant-role module.

The public application form must remain the intake entry point. Do **not** add a replacement intake UI, a parallel CRM, duplicated applicant tables, new authentication authority, or inferred lender status. Applicant views are a *projection* of authoritative operational records, not a competing data source.

## Proposed inert adapters

| Interface | Production responsibility | Critical guardrail |
|---|---|---|
| `AuthProvider` | Verified passwordless/approved identity provider session | Authenticate server-side and validate session on every protected request |
| `ApplicantRepository` | Return the current verified applicant's permitted profile | Never load profiles by unverified email or querystring |
| `ApplicationRepository` | List/get applications belonging to applicant | Server-enforced row ownership; least privilege, tenant boundaries |
| `DocumentRepository` | List document requests; issue authorized upload/download URLs | Signed short-lived URLs, allowed MIME/type/size, content scanning, event log |
| `MessageRepository` | Return applicant-visible messages; post permitted replies | Exclude staff-only messages; protect cross-application access |
| `NotificationRepository` | Read/mutate only the current applicant's notifications | Server-side ownership authorization and idempotent read handling |
| `FundingStatusMapper` | Translate provider/operations event states into safe client labels | Source-backed mapping; distinguish submitted, documents needed, review, offer, decline, complete |

## Conceptual shapes (not implemented)

```ts
interface AuthProvider {
  currentSession(): Promise<{ subjectId: string; verified: true } | null>;
}
interface ApplicantRepository {
  getCurrentApplicant(): Promise<ApplicantView>;
}
interface ApplicationRepository {
  listMine(): Promise<ApplicationView[]>;
  getMine(id: string): Promise<ApplicationView | null>;
}
interface DocumentRepository {
  requestsForApplication(id: string): Promise<DocumentRequestView[]>;
  createAuthorizedUploadSession(requestId: string, metadata: SafeFileMetadata): Promise<ShortLivedUploadGrant>;
}
interface MessageRepository {
  visibleThreads(applicationId?: string): Promise<MessageThreadView[]>;
  sendApplicantReply(threadId: string, body: string): Promise<ApplicantMessageView>;
}
interface NotificationRepository {
  listMine(): Promise<NotificationView[]>;
  markRead(id: string): Promise<void>;
}
interface FundingStatusMapper {
  fromAuthoritativeRecord(record: OperationalStatusRecord): ApplicantSafeStatus;
}
```

These types are a design contract only. None of the methods, types, credentials or API routes are part of the static prototype.

## Approval and status rules

1. `Submitted` only means received in the underlying workflow. Never promote it to `Under Review`, `Approved`, or `Funded` by heuristics.
2. Source event metadata should include source system, external record ID, verified timestamp and mapping version. If missing or contradictory, show `Status unavailable` rather than infer.
3. Offer presentation requires a specific authoritative offer record and explicit applicant visibility. The current demo has **no offer example or APR/term details**.
4. Use applicant-safe activity events; exclude internal-only notes and partner routing details.
5. Unknown or ambiguous states fall back to support guidance and a clear timestamp.

## Production security gates

- Authenticate through the existing approved unified app infrastructure. Authorization is independent from authentication.
- Enforce applicant and application ownership on the server for **every** application, message, notification and document request. A matching email or guessed reference ID is insufficient.
- Use private document storage; signed short-lived, request-scoped access; restrict extensions/MIME/size, scan for malware, audit writes/reads, and never make buckets public.
- Store no API secrets in frontend bundles; rate-limit and log server operations with minimization/redaction; encrypt data using approved infrastructure.
- Implement consent and notification preferences in the canonical backend, with service communications separated from optional marketing consent.
- Conduct security, privacy, legal and user-acceptance reviews before any real applicant access. `noindex,nofollow` is **not** access control.

## Current demo implementation

- `data/demo.json` = three deterministic fictional applications and linked document/message/activity/notification records.
- `data/status-map.json` = display-only state labels and guardrail notes.
- `assets/js/app.js` = in-memory UI state. File input reads **metadata only**. No file bytes, localStorage, sessionStorage, IndexedDB, cookies, credential calls, analytics or remote data fetches.
- The only outbound links are existing public application URL and a support `mailto:` action, initiated by the viewer.

Preserve portability as a nested static preview `/sites/user-account-portals/variant-1/`. Do not edit `JFeimster/flash-ui-portfolio` or its registry from this prototype.
