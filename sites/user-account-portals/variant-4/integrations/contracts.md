# Administrator workspace integration contracts

All integrations are documentation-only and inactive.

Production administration must use server-enforced role-based access control, tenant/operation scope, immutable audit logging and least privilege. Browser routes and labels must never grant access.

Recommended interface boundaries:

- `AdminSessionProvider`
- `IntakeRepository`
- `DealRepository`
- `DocumentMetadataRepository`
- `PartnerAffiliateRepository`
- `CommunicationDispatchRepository`
- `CommissionReconciliationRepository`
- `AuditRepository`
- `RolePolicyRepository`

Document review is metadata-only until private object access is implemented with server authorization. No payment, messaging or administrative API call is available in this static demo.
