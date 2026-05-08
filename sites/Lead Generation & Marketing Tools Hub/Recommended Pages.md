### Partner Analytics Dashboard

A high-level command center for partners to track the performance of the leads generated through the hub. It features real-time charts showing lead volume, conversion rates from specific tools, and a live feed of recent lead activity to demonstrate the ROI of their marketing efforts.



##### Suggested Structure:

DashboardHome.tsx

LeadPerformanceChart.tsx

ConversionFunnelStats.tsx

RecentActivityFeed.tsx

ToolUsageSummary.tsx

api/getPartnerMetrics.ts

Lead Pipeline Manager

A simplified CRM interface where leads captured by the 'Funding Calculator' and 'Quiz Funnel' are automatically funneled. This allows partners to categorize, tag, and track the status of funding applications without needing an external CRM immediately.



##### Suggested Structure:

PipelineBoard.tsx

LeadCard.tsx

LeadDetailsDrawer.tsx

StatusColumn.tsx

FilterToolbar.tsx

utils/leadStatusHelpers.ts

Marketing Template Studio

An interactive workspace where partners can customize the 'Landing Page Templates' and 'Email Sequences' before exporting them. It includes a branding settings panel where they can upload their logo and primary colors to be injected into the HTML/CSS code blocks.



##### Suggested Structure:

StudioContainer.tsx

LiveTemplatePreview.tsx

BrandingConfiguration.tsx

ExportSnippetGenerator.tsx

TemplateVersionHistory.tsx

styles/templateTheme.css

Growth Strategy Academy

A deep-dive educational portal that expands on the 'Lead Generation Strategies' section. It contains video modules, downloadable PDF scripts for LinkedIn/Facebook, and a progress tracker for partners to master organic and paid outreach techniques.



##### Suggested Structure:

AcademyPortal.tsx

CourseModuleCard.tsx

VideoLessonPlayer.tsx

ResourceDownloadList.tsx

UserProgressTracker.tsx

data/strategyCurriculum.json

Premium Services Marketplace

The dedicated management area for 'Paid/Exclusive' tools. Partners can purchase one-time funnel setups, manage their 'Monthly Lead Generation Service' subscription, book strategy calls, and view the progress of 'Done-For-You' deliverables.



##### Suggested Structure:

MarketplaceGrid.tsx

ServiceDetailsPage.tsx

SubscriptionManagement.tsx

OrderHistoryTable.tsx

ServiceDeliveryTimeline.tsx

hooks/useStripeIntegration.ts

