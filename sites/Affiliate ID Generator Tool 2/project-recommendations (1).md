# Recommended Pages & Project Structure

## Executive Command Center
> A high-level dashboard offering a bird's-eye view of the Moonshine Capital ecosystem. It features real-time telemetry on partner onboarding velocity, total capital influenced by partner types, and a global heat map of active Mission IDs. The UI maintains the luxury-futurist aesthetic with glowing emerald sparklines against deep slate data cards.

### Suggested Files:
- `dashboard/page.tsx`
- `dashboard/components/GlobalMetrics.tsx`
- `dashboard/components/OnboardingVelocityChart.tsx`
- `dashboard/components/PartnerTypeDistribution.tsx`
- `dashboard/components/StatusAlerts.tsx`

---

## Partner Intelligence Vault
> A sophisticated CRM-style directory used to manage the full lifecycle of provisioned partners. It allows administrators to search by Mission ID, filter by Partner Type (Broker, Vendor, etc.), and view detailed dossiers including contact history and conversion rates. The interface uses high-contrast monospace tables for maximum readability.

### Suggested Files:
- `partners/page.tsx`
- `partners/components/PartnerTable.tsx`
- `partners/components/AdvancedFilterSidebar.tsx`
- `partners/components/DossierModal.tsx`
- `partners/utils/exportEngine.ts`

---

## Treasury & Commission Ledger
> The financial hub of the application, tracking all payouts and referral commissions linked to specific Mission IDs. It provides a granular audit trail of every dollar generated through the provisioning terminal, featuring a 'Marine Direct' styled ledger with emerald-green success indicators for completed transfers.

### Suggested Files:
- `treasury/page.tsx`
- `treasury/components/PayoutLedger.tsx`
- `treasury/components/CommissionCalculator.tsx`
- `treasury/components/TransactionDetails.tsx`
- `treasury/hooks/usePaymentStatus.ts`

---

## Strategic Analytics Engine
> A deep-dive data visualization suite that analyzes the performance of tracking links. It breaks down clicks, conversions, and ROI per Mission ID, helping the firm identify which 'Type Codes' are the most profitable. The layout utilizes the multi-column bento grid for focused data exploration.

### Suggested Files:
- `analytics/page.tsx`
- `analytics/components/ConversionFunnel.tsx`
- `analytics/components/TypePerformanceMatrix.tsx`
- `analytics/components/LinkTelemetry.tsx`
- `analytics/utils/formatCurrency.ts`

---

## Protocol Configuration & Logic
> An administrative control panel to manage the 'Mission ID' generation logic and system settings. Admins can update 'Type Codes' (e.g., adding a new code for 'Strategic Partners'), manage API keys for external tracking integrations, and customize the emerald-green visual theme parameters.

### Suggested Files:
- `settings/page.tsx`
- `settings/components/LogicFormulaEditor.tsx`
- `settings/components/TypeCodeManager.tsx`
- `settings/components/SecurityAuditLog.tsx`
- `settings/components/ThemeCustomizer.tsx`

---

