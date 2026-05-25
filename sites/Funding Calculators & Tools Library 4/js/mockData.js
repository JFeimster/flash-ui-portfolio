const CoreFlowMockData = {
    storageMetrics: {
        totalSpaceUsed: "412.8 MB",
        totalSpaceAllocated: "1.0 GB",
        usagePercentage: 41.2,
        totalFilesAnalyzed: 1482,
        ocrAccuracy: "99.4%",
        extractionSuccessRate: "96.8%",
        monthlyProcessedVolume: "12,450 pages"
    },
    
    documentCategories: [
        { id: "financials", name: "Financial Statements", color: "#00f0ff" },
        { id: "identity", name: "Identity & KYC", color: "#ff007a" },
        { id: "legal", name: "Legal & Corporate", color: "#ff5c00" },
        { id: "collateral", name: "Collateral & Equipment", color: "#39ff14" },
        { id: "tax", name: "Tax Filings", color: "#f3f4f6" }
    ],

    pendingDocumentSets: [
        {
            id: "doc-set-101",
            companyName: "Apex Trading Group",
            purpose: "Series A Revenue Funding Verification",
            fileCount: 8,
            completionRate: 85,
            priority: "HIGH",
            accentColor: "var(--accent-cyan)",
            lastActivity: "2 mins ago",
            status: "In Review",
            assignedReviewer: "Marcus Vance",
            requiredDocuments: [
                { name: "3 Months Bank Statements", status: "VERIFIED" },
                { name: "2023 Business Tax Return", status: "VERIFIED" },
                { name: "Debt Schedule Ledger", status: "PENDING_AUDIT" },
                { name: "Merchant Processing Agreement", status: "MISSING" }
            ]
        },
        {
            id: "doc-set-102",
            companyName: "Vanguard Logistics",
            purpose: "MCA Debt Consolidation Refinance",
            fileCount: 5,
            completionRate: 40,
            priority: "CRITICAL",
            accentColor: "var(--accent-orange)",
            lastActivity: "1 hour ago",
            status: "Awaiting Files",
            assignedReviewer: "Sarah Jenkins",
            requiredDocuments: [
                { name: "12 Months Processing Ledger", status: "VERIFIED" },
                { name: "UCC-1 Filing Copy", status: "UNDER_REVIEW" },
                { name: "Voided Business Check", status: "MISSING" },
                { name: "Owner Government Issued ID", status: "MISSING" }
            ]
        },
        {
            id: "doc-set-103",
            companyName: "Zenith Construction Corp",
            purpose: "Equipment Lease ROI Authorization",
            fileCount: 12,
            completionRate: 100,
            priority: "NORMAL",
            accentColor: "var(--accent-lime)",
            lastActivity: "4 hours ago",
            status: "Approved",
            assignedReviewer: "AI Engine Model 4.2",
            requiredDocuments: [
                { name: "Equipment Invoice & Spec Sheet", status: "VERIFIED" },
                { name: "Corporate Articles of Association", status: "VERIFIED" },
                { name: "Executive Guarantor Financials", status: "VERIFIED" }
            ]
        },
        {
            id: "doc-set-104",
            companyName: "Nexus Biotech Labs",
            purpose: "Alternative Revenue Capital Screening",
            fileCount: 4,
            completionRate: 15,
            priority: "LOW",
            accentColor: "var(--accent-magenta)",
            lastActivity: "1 day ago",
            status: "Initial Processing",
            assignedReviewer: "Liam Cross",
            requiredDocuments: [
                { name: "Gross Revenue Cap Ledger", status: "UNDER_REVIEW" },
                { name: "FICO Validation Release Form", status: "PENDING_SIGNATURE" }
            ]
        }
    ],

    approvalWorkflows: [
        {
            id: "wf-201",
            name: "Automated OCR Extraction Check",
            targetStep: "Step 1: Raw Parsing",
            status: "COMPLETED",
            performanceMetric: "92% automated mapping rate",
            badgeColor: "var(--accent-cyan)",
            updatedAt: "10:14 AM"
        },
        {
            id: "wf-202",
            name: "KYC/AML Identity Screen Engine",
            targetStep: "Step 2: Biometric Validation",
            status: "PASSED",
            performanceMetric: "Watchlist match cleared",
            badgeColor: "var(--accent-lime)",
            updatedAt: "09:45 AM"
        },
        {
            id: "wf-203",
            name: "DSCR Verification Pipeline",
            targetStep: "Step 3: Manual Ratio Verification",
            status: "PENDING_AUDIT",
            performanceMetric: "Estimated DSCR: 1.42x",
            badgeColor: "var(--accent-orange)",
            updatedAt: "11:22 AM"
        },
        {
            id: "wf-204",
            name: "Active UCC-1 Registry Scan",
            targetStep: "Step 4: Lien Position Priority Check",
            status: "RUNNING",
            performanceMetric: "Scanning state registries",
            badgeColor: "var(--accent-magenta)",
            updatedAt: "Just now"
        }
    ],

    recentUploads: [
        {
            id: "file-901",
            fileName: "bank_statements_2023_q4.pdf",
            fileSize: "12.4 MB",
            category: "Financial Statements",
            uploadTime: "2 mins ago",
            uploadedBy: "Alex K. (Founder)",
            status: "Processed",
            validationErrors: 0,
            hasSecurityAlerts: false
        },
        {
            id: "file-902",
            fileName: "articles_of_incorporation_scanned.pdf",
            fileSize: "4.2 MB",
            category: "Legal & Corporate",
            uploadTime: "1 hour ago",
            uploadedBy: "System API Integration",
            status: "Processed",
            validationErrors: 0,
            hasSecurityAlerts: false
        },
        {
            id: "file-903",
            fileName: "tax_return_form_1120S_unlocked.pdf",
            fileSize: "18.1 MB",
            category: "Tax Filings",
            uploadTime: "4 hours ago",
            uploadedBy: "Sarah Jenkins (Auditor)",
            status: "Processing",
            validationErrors: 1,
            hasSecurityAlerts: false
        },
        {
            id: "file-904",
            fileName: "dscr_property_ledger_v2.xlsx",
            fileSize: "1.8 MB",
            category: "Financial Statements",
            uploadTime: "Yesterday",
            uploadedBy: "Marcus Vance (Underwriter)",
            status: "Needs Action",
            validationErrors: 3,
            hasSecurityAlerts: true
        },
        {
            id: "file-905",
            fileName: "owner_id_drivers_license.jpg",
            fileSize: "2.3 MB",
            category: "Identity & KYC",
            uploadTime: "2 days ago",
            uploadedBy: "Alex K. (Founder)",
            status: "Processed",
            validationErrors: 0,
            hasSecurityAlerts: false
        }
    ]
};

// Expose mock data on window context for frontend consumption
if (typeof window !== 'undefined') {
    window.CoreFlowMockData = CoreFlowMockData;
}