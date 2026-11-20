# Partner workspace integration contracts

All integrations are documentation-only and inactive.

The future partner surface must use server-validated organization membership and role permissions. Organization membership must not be inferred from an email address or browser route. Internal lender/provider logic must remain server-side and must not be exposed as applicant-confidential routing.

Recommended interface boundaries:

- `PartnerOrganizationRepository`
- `PartnerTeamRepository`
- `PartnerReferralRepository`
- `PartnerPerformanceRepository`
- `IllustrativeRevenueShareRepository`
- `PartnerResourceRepository`
- `PartnerMessageRepository`

Every referral, team member and revenue-share event requires verified organization ownership. Demonstration data must remain deterministic and fictional.
