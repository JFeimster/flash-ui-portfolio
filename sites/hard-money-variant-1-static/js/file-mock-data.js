const filesDatabase = [
    {
        id: "file-001",
        name: "Phase_I_Environmental_Oak_Ridge.pdf",
        size: "14.2 MB",
        rawSize: 14889728,
        type: "pdf",
        category: "Underwriting",
        tags: ["Phase I", "Environmental", "Due Diligence"],
        uploadDate: "2023-11-20T09:45:00Z",
        uploadedBy: "Sponsor Alex M.",
        associatedDeal: "Oak Ridge Multifamily Bridge",
        associatedLenderId: 1, // Apex Velocity Capital
        associatedLenderName: "Apex Velocity Capital",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "file-002",
        name: "Title_Commitment_Fortress_Corp_Signed.pdf",
        size: "3.8 MB",
        rawSize: 3984588,
        type: "pdf",
        category: "Legal & Title",
        tags: ["Title Report", "Lien Search", "Executed"],
        uploadDate: "2023-11-22T14:15:00Z",
        uploadedBy: "Underwriter Sarah K.",
        associatedDeal: "Fortress Commercial Trust Acquisitions",
        associatedLenderId: 2, // Fortress Commercial Trust
        associatedLenderName: "Fortress Commercial Trust",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-003",
        name: "Pro_Forma_Rehab_Schedules_v4.xlsx",
        size: "1.2 MB",
        rawSize: 1258291,
        type: "xlsx",
        category: "Financials",
        tags: ["Rehab Budget", "Schedules", "Pro Forma"],
        uploadDate: "2023-11-23T11:30:00Z",
        uploadedBy: "Sponsor Alex M.",
        associatedDeal: "Oak Ridge Multifamily Bridge",
        associatedLenderId: 1, // Apex Velocity Capital
        associatedLenderName: "Apex Velocity Capital",
        status: "Pending Review",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-004",
        name: "Property_Survey_Plat_Map.dwg",
        size: "24.5 MB",
        rawSize: 25690112,
        type: "zip",
        category: "Property Assets",
        tags: ["Survey", "Plat Map", "CAD Drawings"],
        uploadDate: "2023-11-18T16:20:00Z",
        uploadedBy: "Surveyor Dave R.",
        associatedDeal: "Sovereign Mixed-Use Development",
        associatedLenderId: 8, // Sovereign Private Equity
        associatedLenderName: "Sovereign Private Equity",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "file-005",
        name: "Exterior_Facade_West_Rendering.jpg",
        size: "8.4 MB",
        rawSize: 8808038,
        type: "jpg",
        category: "Property Assets",
        tags: ["Rendering", "Marketing", "Exterior Architecture"],
        uploadDate: "2023-11-24T08:05:00Z",
        uploadedBy: "Architect Julia W.",
        associatedDeal: "Pacific Rim High LTV Rehab",
        associatedLenderId: 4, // Pacific Rim Funding Group
        associatedLenderName: "Pacific Rim Funding Group",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "file-006",
        name: "Borrower_Entity_Docs_Emberstone_LLC.zip",
        size: "18.1 MB",
        rawSize: 18979225,
        type: "zip",
        category: "Legal & Title",
        tags: ["Entity", "Operating Agreement", "EIN Certificate"],
        uploadDate: "2023-11-21T15:55:00Z",
        uploadedBy: "Broker Keith P.",
        associatedDeal: "Emberstone Value-Add Stabilization",
        associatedLenderId: 3, // Emberstone Capital
        associatedLenderName: "Emberstone Capital",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-007",
        name: "Hazard_Insurance_Binder_Emberstone_LLC.pdf",
        size: "2.1 MB",
        rawSize: 2202009,
        type: "pdf",
        category: "Legal & Title",
        tags: ["Insurance", "Binder", "Coverage"],
        uploadDate: "2023-11-24T10:12:00Z",
        uploadedBy: "Broker Keith P.",
        associatedDeal: "Emberstone Value-Add Stabilization",
        associatedLenderId: 3, // Emberstone Capital
        associatedLenderName: "Emberstone Capital",
        status: "Action Required",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-008",
        name: "Raw_Land_Zoning_Report_Sovereign.pdf",
        size: "11.6 MB",
        rawSize: 12163481,
        type: "pdf",
        category: "Underwriting",
        tags: ["Zoning", "Development Report", "Land Use"],
        uploadDate: "2023-11-19T13:40:00Z",
        uploadedBy: "Surveyor Dave R.",
        associatedDeal: "Vanguard Land Bridge Program",
        associatedLenderId: 5, // Vanguard Land Alliance
        associatedLenderName: "Vanguard Land Alliance",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "file-009",
        name: "Rent_Roll_Stabilized_Projections.xlsx",
        size: "920 KB",
        rawSize: 942080,
        type: "xlsx",
        category: "Financials",
        tags: ["Rent Roll", "Projections", "Financial Statement"],
        uploadDate: "2023-11-24T12:00:00Z",
        uploadedBy: "Underwriter Sarah K.",
        associatedDeal: "Keystone Bridge Conversion Debt",
        associatedLenderId: 6, // Keystone Bridge Fund
        associatedLenderName: "Keystone Bridge Fund",
        status: "Pending Review",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-010",
        name: "Sponsor_FICO_Credit_Memo_Confidential.pdf",
        size: "1.8 MB",
        rawSize: 1887436,
        type: "pdf",
        category: "Underwriting",
        tags: ["Credit Report", "KYC", "Confidential"],
        uploadDate: "2023-11-22T17:05:00Z",
        uploadedBy: "Fintech Desk Sync",
        associatedDeal: "Neon Fast Capital Residential Match",
        associatedLenderId: 7, // Neon Fast Capital
        associatedLenderName: "Neon Fast Capital",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: ""
    },
    {
        id: "file-011",
        name: "Interior_Rehab_Progress_Photo_04.png",
        size: "12.5 MB",
        rawSize: 13107200,
        type: "png",
        category: "Property Assets",
        tags: ["Construction Photo", "Draw Request", "Interior Finish"],
        uploadDate: "2023-11-23T14:45:00Z",
        uploadedBy: "Inspector Mark G.",
        associatedDeal: "Oak Ridge Multifamily Bridge",
        associatedLenderId: 1, // Apex Velocity Capital
        associatedLenderName: "Apex Velocity Capital",
        status: "Verified",
        downloadUrl: "#",
        previewUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "file-012",
        name: "Escrow_Holdback_Draft_Agreement.docx",
        size: "740 KB",
        rawSize: 757760,
        type: "docx",
        category: "Legal & Title",
        tags: ["Escrow Holdback", "Draft Agreement", "Closing Document"],
        uploadDate: "2023-11-24T15:22:00Z",
        uploadedBy: "Attorney Elena V.",
        associatedDeal: "Fortress Commercial Trust Acquisitions",
        associatedLenderId: 2, // Fortress Commercial Trust
        associatedLenderName: "Fortress Commercial Trust",
        status: "Action Required",
        downloadUrl: "#",
        previewUrl: ""
    }
];

const fileCategories = [
    { code: "ALL", name: "All Folders" },
    { code: "Underwriting", name: "Underwriting / DD" },
    { code: "Legal & Title", name: "Legal & Title Reports" },
    { code: "Financials", name: "Financial Audits" },
    { code: "Property Assets", name: "Property Media & GIS" }
];

const fileTypes = ["all", "pdf", "xlsx", "docx", "jpg", "png", "zip"];