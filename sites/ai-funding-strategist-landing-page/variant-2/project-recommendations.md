# Recommended Pages & Project Structure

## Interactive Assessment Lab
> A focused, immersive multi-step interface where the AI Strategist (represented by the glowing orb) interviews the user. It features real-time data visualization of the user's 'funding probability' as they answer questions about their revenue, business credit, and industry.

### Suggested Files:
- `AssessmentLayout.tsx`
- `AiConversationalOrb.tsx`
- `DynamicProgressBar.tsx`
- `QuestionRenderer.tsx`
- `LiveEligibilityChart.tsx`
- `assessment-store.ts`

---

## Entrepreneur Funding Dashboard
> A high-end bento grid command center showing the user's current readiness score, identified 'Banker Red Flags', and a checklist of required documents. It uses dark mode aesthetics with neon accents to highlight critical funding gaps.

### Suggested Files:
- `DashboardHome.tsx`
- `BentoGridContainer.tsx`
- `ReadinessScoreGauge.tsx`
- `RedFlagAlerts.tsx`
- `NextStepsTimeline.tsx`
- `useDashboardData.ts`

---

## AI Document Audit Vault
> A secure portal where users upload financial statements. The AI performs a 'pre-underwriting' scan, highlighting discrepancies or missing data that would cause a traditional banker to reject the application.

### Suggested Files:
- `VaultLayout.tsx`
- `SmartUploader.tsx`
- `AuditResultsList.tsx`
- `DocumentCategorizer.tsx`
- `SecurityEncryptionBadge.tsx`
- `pdf-parser-util.ts`

---

## Precision Lender Matcher
> A marketplace view that filters lenders based on the AI's analysis. Instead of a generic list, it shows 'Match Confidence' percentages and specific reasons why the user fits a particular lender's current 'buy box'.

### Suggested Files:
- `LenderMarketplace.tsx`
- `LenderCard.tsx`
- `MatchLogicSidebar.tsx`
- `ProbabilityBadge.tsx`
- `RoutingActionButtons.tsx`
- `lender-api.ts`

---

## Strategist Handoff Portal
> A bridge page for users who have completed the AI workflow and are ready to speak with a human advisor. It summarizes the AI’s findings into a 'Funding Brief' that can be shared instantly with human strategists or lenders.

### Suggested Files:
- `HandoffCenter.tsx`
- `BriefGenerator.tsx`
- `AdvisorScheduler.tsx`
- `BriefExportButton.tsx`
- `SummaryStatistics.tsx`
- `email-service.ts`

---

