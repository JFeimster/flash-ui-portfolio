const CoreFlowDashboardData = {
    stats: {
        totalFolders: 18,
        activeUploads: 247,
        pendingApprovals: 9,
        storageUsed: "78.4 GB",
        storageLimit: "128 GB",
        storagePercentage: 61.25,
        bandwidthUsed: "342.1 GB",
        bandwidthLimit: "500 GB",
        bandwidthPercentage: 68.42,
        systemHealth: "OPTIMAL",
        activeUsers: 34
    },

    activeFolders: [
        {
            id: "FLD-101",
            name: "UNDERWRITING-MATRIX-PACKS",
            owner: "Marcus Vance",
            filesCount: 42,
            size: "18.4 GB",
            securityLevel: "SECURE-LVL3",
            accent: "cyan",
            lastUpdated: "2024-11-04 14:32"
        },
        {
            id: "FLD-102",
            name: "BROKER-COMMISSION-REPORTS",
            owner: "Elena Rostova",
            filesCount: 29,
            size: "11.2 GB",
            securityLevel: "SECURE-LVL2",
            accent: "magenta",
            lastUpdated: "2024-11-04 16:15"
        },
        {
            id: "FLD-103",
            name: "MCA-FACTOR-Historical",
            owner: "Devon Carter",
            filesCount: 114,
            size: "34.8 GB",
            securityLevel: "SECURE-LVL1",
            accent: "orange",
            lastUpdated: "2024-11-03 09:44"
        },
        {
            id: "FLD-104",
            name: "REVENUE-FINANCING-AGREEMENTS",
            owner: "Marcus Vance",
            filesCount: 37,
            size: "9.5 GB",
            securityLevel: "SECURE-LVL3",
            accent: "cyan",
            lastUpdated: "2024-11-04 11:20"
        },
        {
            id: "FLD-105",
            name: "COMPLIANCE-AUDIT-2024",
            owner: "Sarah Jenkins",
            filesCount: 15,
            size: "4.5 GB",
            securityLevel: "CRITICAL",
            accent: "magenta",
            lastUpdated: "2024-11-01 17:30"
        }
    ],

    recentUploads: [
        {
            id: "UPL-9021",
            fileName: "CoreFlow_DecisionMatrix_v4.2.xlsx",
            folderId: "FLD-101",
            size: "24.2 MB",
            uploadedBy: "Marcus Vance",
            timestamp: "10 mins ago",
            status: "SUCCESS",
            type: "spreadsheet"
        },
        {
            id: "UPL-9022",
            fileName: "Apex_Broker_Agreement_Signed.pdf",
            folderId: "FLD-102",
            size: "4.8 MB",
            uploadedBy: "Elena Rostova",
            timestamp: "42 mins ago",
            status: "SUCCESS",
            type: "document"
        },
        {
            id: "UPL-9023",
            fileName: "Q3_Revenue_Verification_Batch.zip",
            folderId: "FLD-104",
            size: "342.1 MB",
            uploadedBy: "Devon Carter",
            timestamp: "2 hours ago",
            status: "SUCCESS",
            type: "archive"
        },
        {
            id: "UPL-9024",
            fileName: "Audit_Trail_Log_Nov03.json",
            folderId: "FLD-105",
            size: "1.2 MB",
            uploadedBy: "Automated System",
            timestamp: "4 hours ago",
            status: "SUCCESS",
            type: "code"
        },
        {
            id: "UPL-9025",
            fileName: "SBA_Readiness_Scorecard_Template.pdf",
            folderId: "FLD-103",
            size: "12.4 MB",
            uploadedBy: "Sarah Jenkins",
            timestamp: "Yesterday",
            status: "SUCCESS",
            type: "document"
        }
    ],

    pendingApprovals: [
        {
            id: "APP-0041",
            documentName: "High_Volume_Factor_Override_Cap.pdf",
            submittedBy: "Marcus Vance",
            department: "Risk Underwriting",
            priority: "CRITICAL",
            dateSubmitted: "2024-11-04 13:10",
            size: "8.1 MB"
        },
        {
            id: "APP-0042",
            documentName: "Broker_Split_Structure_60_40.docx",
            submittedBy: "Elena Rostova",
            department: "Broker Relations",
            priority: "MEDIUM",
            dateSubmitted: "2024-11-04 15:40",
            size: "1.4 MB"
        },
        {
            id: "APP-0043",
            documentName: "Equipment_ROI_Verification_Framework.xlsx",
            submittedBy: "Devon Carter",
            department: "Capital Deployment",
            priority: "HIGH",
            dateSubmitted: "2024-11-03 11:15",
            size: "14.5 MB"
        }
    ],

    storageDistribution: [
        {
            category: "Financial Matrices",
            size: "34.5 GB",
            percentage: 44.0,
            accent: "cyan"
        },
        {
            category: "Signed Agreements",
            size: "22.1 GB",
            percentage: 28.2,
            accent: "magenta"
        },
        {
            category: "Compliance & Audits",
            size: "12.8 GB",
            percentage: 16.3,
            accent: "orange"
        },
        {
            category: "System Log Backups",
            size: "9.0 GB",
            percentage: 11.5,
            accent: "lime"
        }
    ],

    bandwidthTimeline: [
        { label: "00:00", value: 14.2 },
        { label: "04:00", value: 8.5 },
        { label: "08:00", value: 34.9 },
        { label: "12:00", value: 89.4 },
        { label: "16:00", value: 112.5 },
        { label: "20:00", value: 65.1 }
    ]
};

// Global exports for vanilla JS compatibility
if (typeof window !== 'undefined') {
    window.CoreFlowDashboardData = CoreFlowDashboardData;
}

// Module export for ES6 systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoreFlowDashboardData;
}