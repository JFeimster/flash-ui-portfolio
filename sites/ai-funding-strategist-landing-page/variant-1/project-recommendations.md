# Recommended Pages & Project Structure

## Interactive Readiness Dashboard
> A data-rich hub for entrepreneurs to visualize their funding health. It features a 'Funding Readiness Score' gauge, real-time business credit monitoring, and a bento-grid layout showing eligibility percentages for different loan types like SBA, Line of Credit, and Venture Debt.

### Suggested Files:
- `DashboardHome.tsx`
- `ReadinessGauge.tsx`
- `EligibilityHeatmap.tsx`
- `CreditScoreTracker.tsx`
- `ActionableGapsCard.tsx`
- `dashboard-styles.css`

---

## AI Strategist Chat Workspace
> The core interactive interface where the AI Orb visual resides. This page provides a focused chat environment for deep-diving into business financials, uploading pitch decks for instant feedback, and receiving step-by-step guidance on fixing documentation errors before they hit a lender's desk.

### Suggested Files:
- `ChatInterface.tsx`
- `AiOrbComponent.tsx`
- `DocumentUploadSidebar.tsx`
- `InsightPanel.tsx`
- `MessageThread.tsx`
- `useStrategistLogic.ts`

---

## Lender Routing & Matcher
> A curated marketplace view that uses AI to match the entrepreneur with specific lenders. Instead of a generic list, it shows 'Confidence Scores' for each lender, explains the 'Why' behind the match, and displays specific terms the user is likely to receive based on their analyzed data.

### Suggested Files:
- `LenderMarketplace.tsx`
- `MatchConfidenceCard.tsx`
- `LenderFilterSystem.tsx`
- `ComparisonModal.tsx`
- `routing-utils.js`

---

## Document Compliance Vault
> A high-security area where users manage the 'Paperwork' aspect of funding. The AI scans uploaded files (Tax returns, P&L statements, Secretary of State filings) to identify inconsistencies or missing signatures that cause 'Banker Theater' delays.

### Suggested Files:
- `VaultMain.tsx`
- `FileCategorizer.tsx`
- `AiAuditReport.tsx`
- `EncryptionBadge.tsx`
- `FolderStructure.tsx`
- `compliance-checker.ts`

---

## Data Integration & Profile Sync
> The technical nerve center where users connect their financial stack. This page manages OAuth connections to Plaid (banking), QuickBooks/Xero (accounting), and credit bureaus, allowing the AI Strategist to pull live data for accurate funding predictions.

### Suggested Files:
- `IntegrationsPage.tsx`
- `ConnectionStatusCard.tsx`
- `PlaidLinkModule.tsx`
- `DataPrivacyControls.tsx`
- `ApiSyncLog.tsx`
- `integration-config.json`

---

