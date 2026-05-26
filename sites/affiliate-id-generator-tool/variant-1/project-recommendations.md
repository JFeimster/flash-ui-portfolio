# Recommended Pages & Project Structure

## Partner Ledger Command
> A centralized directory designed to manage and search the entire database of provisioned partners. It allows administrators to filter by Partner Type or Year, toggle status between 'Active' and 'Suspended', and view expanded profiles for each Mission ID generated in the Provisioning Terminal.

### Suggested Files:
- `src/pages/Ledger.tsx`
- `src/components/ledger/PartnerTable.tsx`
- `src/components/ledger/FilterBar.tsx`
- `src/components/ledger/StatusToggle.tsx`

---

## Performance Analytics Intelligence
> A high-fidelity visualization suite that tracks the conversion rates and traffic volume of every generated tracking link. It uses the 'Mission ID' logic to group performance by type (e.g., Broker vs. Affiliate) using emerald-accented charts against the slate background.

### Suggested Files:
- `src/pages/Analytics.tsx`
- `src/components/analytics/ConversionChart.tsx`
- `src/components/analytics/MetricsGrid.tsx`
- `src/components/analytics/TrafficMap.tsx`

---

## Treasury & Payouts Engine
> The financial hub of the application where earned commissions are calculated based on tracking link conversions. This page manages wire transfer statuses, monthly payout cycles, and maintains a luxury-styled audit log of all capital movements to partners.

### Suggested Files:
- `src/pages/Treasury.tsx`
- `src/components/treasury/PayoutList.tsx`
- `src/components/treasury/BalanceCard.tsx`
- `src/components/treasury/ExportProtocol.tsx`

---

## Security & Protocol Settings
> The backend configuration terminal where the 'Mission ID' logic is maintained. Administrators can update Type Codes (e.g., adding a new category like 'Institutional'), manage API keys for the tracking subdomains, and view a deep-level security audit log of system access.

### Suggested Files:
- `src/pages/Settings.tsx`
- `src/components/settings/LogicConfig.tsx`
- `src/components/settings/SecurityLogs.tsx`
- `src/components/settings/ApiKeyManager.tsx`

---

## Partner Portal Previewer
> A 'What You See Is What You Get' (WYSIWYG) utility that allows administrators to view the onboarding experience from the perspective of the provisioned partner. It ensures that the links generated in the main terminal lead to the correct branded landing pages for Moonshine Capital.

### Suggested Files:
- `src/pages/PortalPreview.tsx`
- `src/components/preview/LiveViewframe.tsx`
- `src/components/preview/AssetDownloader.tsx`
- `src/components/preview/OnboardingFlow.tsx`

---

