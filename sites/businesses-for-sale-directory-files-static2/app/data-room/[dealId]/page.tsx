"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Dynamic Type Definition for Deal Structure under LOI
interface DealVDR {
  id: string;
  codename: string;
  sector: string;
  location: string;
  revenue: number;
  ebitda: number;
  asking: number;
  loiValue: number;
  targetClosing: string;
  diligenceDaysTotal: number;
  diligenceDaysElapsed: number;
  escrowAgent: string;
  documents: {
    id: string;
    category: "Financial" | "Legal" | "Tax" | "Operations";
    name: string;
    size: string;
    dateAdded: string;
    securityLevel: "Unrestricted" | "Protected" | "Highly Sensitive (LOI-Only)";
    isRedacted: boolean;
    encryptedHash: string;
  }[];
  checklist: {
    id: string;
    task: string;
    assignee: "Buyer Legal" | "Lender Team" | "Underwriter" | "SBA Advisor";
    status: "Completed" | "Pending Review" | "Outstanding";
    criticality: "High" | "Medium" | "Low";
  }[];
  collaboration: {
    id: string;
    sender: string;
    role: string;
    message: string;
    timestamp: string;
    isSystem: boolean;
  }[];
}

const DEALS_VDR_DATA: Record<string, DealVDR> = {
  delta: {
    id: "delta",
    codename: "Project Delta",
    sector: "Logistics & Transport",
    location: "Midwest Territory",
    revenue: 2400000,
    ebitda: 620000,
    asking: 1800000,
    loiValue: 1720000,
    targetClosing: "2026-04-15",
    diligenceDaysTotal: 60,
    diligenceDaysElapsed: 28,
    escrowAgent: "Premier Escrow Partners, LLC",
    documents: [
      { id: "doc-1", category: "Financial", name: "FY23-FY25 Consolidated Quality of Earnings (QofE) Report.pdf", size: "14.2 MB", dateAdded: "2026-01-10", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: false, encryptedHash: "0x8F9A...C71" },
      { id: "doc-2", category: "Financial", name: "2025 Trailing Twelve Months (TTM) General Ledger.xlsx", size: "28.1 MB", dateAdded: "2026-01-12", securityLevel: "Protected", isRedacted: false, encryptedHash: "0xE3B8...42F" },
      { id: "doc-3", category: "Tax", name: "IRS Form 1120-S Federal Tax Returns (3-Year Cycle).pdf", size: "8.7 MB", dateAdded: "2026-01-08", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: true, encryptedHash: "0x4A11...9B0" },
      { id: "doc-4", category: "Operations", name: "Commercial Fleet Asset Registry & Equipment Valuation.xlsx", size: "3.2 MB", dateAdded: "2026-01-15", securityLevel: "Unrestricted", isRedacted: false, encryptedHash: "0xC201...D62" },
      { id: "doc-5", category: "Legal", name: "Customer Concentration Matrix - Key Accounts (Amended).pdf", size: "5.1 MB", dateAdded: "2026-01-20", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: true, encryptedHash: "0x9E7D...B22" }
    ],
    checklist: [
      { id: "chk-1", task: "SBA 7(a) Third-Party Phase I Environmental Site Audit", assignee: "Lender Team", status: "Completed", criticality: "High" },
      { id: "chk-2", task: "Working Capital Peg Target Calibration Structure", assignee: "Underwriter", status: "Pending Review", criticality: "High" },
      { id: "chk-3", task: "UCC-1 Lien Filings Check & Clearance Validation", assignee: "Buyer Legal", status: "Completed", criticality: "Medium" },
      { id: "chk-4", task: "Execution of Key Account Transitional Indemnity Frameworks", assignee: "Buyer Legal", status: "Outstanding", criticality: "High" },
      { id: "chk-5", task: "Post-LOI Seller Multi-State License Transfer Application", assignee: "SBA Advisor", status: "Outstanding", criticality: "Medium" }
    ],
    collaboration: [
      { id: "msg-1", sender: "System Terminal", role: "VDR AUTOMATION", message: "Virtual Data Room session validated. Secure network connection verified via secure shell terminal.", timestamp: "09:00:02 AM", isSystem: true },
      { id: "msg-2", sender: "Marcus Vance", role: "Underwriting Partner", message: "Adjusted EBITDA has been reconciled to $618,500 following minor freight expense adjusters. Adjusted multiple is updated accordingly.", timestamp: "10:14:25 AM", isSystem: false },
      { id: "msg-3", sender: "Sarah Chen", role: "SBA Preferred Underwriter", message: "Equity injector rules updated. 10% standby seller note must hold structural interest-only terms for matching 10-year term.", timestamp: "11:32:10 AM", isSystem: false }
    ]
  },
  kestrel: {
    id: "kestrel",
    codename: "Project Kestrel",
    sector: "SaaS & Digital Infrastructure",
    location: "100% Remote / US Corporate Base",
    revenue: 1200000,
    ebitda: 450000,
    asking: 1900000,
    loiValue: 1850000,
    targetClosing: "2026-05-01",
    diligenceDaysTotal: 45,
    diligenceDaysElapsed: 12,
    escrowAgent: "Sovereign Legal Escrow, PC",
    documents: [
      { id: "doc-1", category: "Financial", name: "SaaS Segmented MRR / ARR Cohort Analytics Report.xlsx", size: "12.4 MB", dateAdded: "2026-01-18", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: false, encryptedHash: "0x7E3A...B22" },
      { id: "doc-2", category: "Legal", name: "Proprietary IP Ownership Assignment & GitHub History Audit.pdf", size: "18.9 MB", dateAdded: "2026-01-20", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: false, encryptedHash: "0xF29B...10D" },
      { id: "doc-3", category: "Tax", name: "2023-2024 State & Local Tax Nexus Analysis.pdf", size: "4.1 MB", dateAdded: "2026-01-22", securityLevel: "Protected", isRedacted: true, encryptedHash: "0x3C19...E91" },
      { id: "doc-4", category: "Operations", name: "AWS Production Infrastructure Running Cost Profiles.xlsx", size: "1.9 MB", dateAdded: "2026-01-25", securityLevel: "Unrestricted", isRedacted: false, encryptedHash: "0x11B8...33A" }
    ],
    checklist: [
      { id: "chk-1", task: "Black Duck Open-Source Licensing Compliance Review", assignee: "Buyer Legal", status: "Completed", criticality: "High" },
      { id: "chk-2", task: "SBA Preferred Lender Fast-Track Term Authorization", assignee: "Lender Team", status: "Pending Review", criticality: "High" },
      { id: "chk-3", task: "Critical Engineering Transition Agreement Execution", assignee: "Buyer Legal", status: "Outstanding", criticality: "High" }
    ],
    collaboration: [
      { id: "msg-1", sender: "System Terminal", role: "VDR AUTOMATION", message: "Virtual Data Room session validated. Remote cloud IP checks matched. Logged.", timestamp: "08:12:05 AM", isSystem: true },
      { id: "msg-2", sender: "David Hayes", role: "LBO Associate", message: "SaaS Churn metrics show Q4 expansion offset minor localized customer attrition. Modeling remains on track.", timestamp: "03:45:19 PM", isSystem: false }
    ]
  },
  "hvac-nova": {
    id: "hvac-nova",
    codename: "Project Nova",
    sector: "Home Services / HVAC",
    location: "Franconia, VA",
    revenue: 3100000,
    ebitda: 810000,
    asking: 2600000,
    loiValue: 2450000,
    targetClosing: "2026-06-10",
    diligenceDaysTotal: 75,
    diligenceDaysElapsed: 34,
    escrowAgent: "Mid-Atlantic Escrow Solutions",
    documents: [
      { id: "doc-1", category: "Financial", name: "Detailed 3-Year Recurring Maintenance Contract Registry.xlsx", size: "15.8 MB", dateAdded: "2026-01-05", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: false, encryptedHash: "0x89D2...F2B" },
      { id: "doc-2", category: "Tax", name: "Reconciled Form 941 Quarterly Payroll Statements (2024-2025).pdf", size: "6.2 MB", dateAdded: "2026-01-11", securityLevel: "Protected", isRedacted: true, encryptedHash: "0x44B7...8D1" },
      { id: "doc-3", category: "Legal", name: "EPA Certified Freon Inventory & Environmental Disposal Logbook.pdf", size: "9.3 MB", dateAdded: "2026-01-14", securityLevel: "Unrestricted", isRedacted: false, encryptedHash: "0xCC90...7E5" }
    ],
    checklist: [
      { id: "chk-1", task: "State HVAC Master License Transfer Verification", assignee: "Buyer Legal", status: "Pending Review", criticality: "High" },
      { id: "chk-2", task: "Valuation of Mobile Fleet Service Vehicles & GPS Tracking Assets", assignee: "Underwriter", status: "Completed", criticality: "Medium" },
      { id: "chk-3", task: "Working Capital PEG Definition & Accrued Job Margins", assignee: "SBA Advisor", status: "Outstanding", criticality: "High" }
    ],
    collaboration: [
      { id: "msg-1", sender: "System Terminal", role: "VDR AUTOMATION", message: "VDR Channel SECURE NOVA // Activated for registered partners.", timestamp: "09:15:33 AM", isSystem: true }
    ]
  },
  onyx: {
    id: "onyx",
    codename: "Project Onyx",
    sector: "Precision Manufacturing",
    location: "Atlanta Hub",
    revenue: 5800000,
    ebitda: 1200000,
    asking: 3800000,
    loiValue: 3600000,
    targetClosing: "2026-07-20",
    diligenceDaysTotal: 90,
    diligenceDaysElapsed: 45,
    escrowAgent: "Federal Escrow Trust Company",
    documents: [
      { id: "doc-1", category: "Financial", name: "Aerospace Supplier Quality Audit Compliance Documentation.pdf", size: "22.3 MB", dateAdded: "2025-12-28", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: false, encryptedHash: "0x12EE...8AA" },
      { id: "doc-2", category: "Operations", name: "Real Estate & Plant Facility Industrial Appraisal Report.pdf", size: "11.1 MB", dateAdded: "2026-01-04", securityLevel: "Protected", isRedacted: false, encryptedHash: "0x77E1...0F4" },
      { id: "doc-3", category: "Legal", name: "ITAR Compliance Verification & Registration Confirmation.pdf", size: "4.7 MB", dateAdded: "2026-01-08", securityLevel: "Highly Sensitive (LOI-Only)", isRedacted: true, encryptedHash: "0xBB02...3C2" }
    ],
    checklist: [
      { id: "chk-1", task: "ITAR Registration Status & Defense Trade Controls Audit", assignee: "Buyer Legal", status: "Outstanding", criticality: "High" },
      { id: "chk-2", task: "Phase II Soil and Machinery Environmental Core Assessment", assignee: "Lender Team", status: "Completed", criticality: "High" },
      { id: "chk-3", task: "Industrial Machine Tool Lease Assumability Review", assignee: "Buyer Legal", status: "Completed", criticality: "Medium" }
    ],
    collaboration: [
      { id: "msg-1", sender: "System Terminal", role: "VDR AUTOMATION", message: "Defense-grade secure container launched.", timestamp: "11:22:45 AM", isSystem: true }
    ]
  },
  titan: {
    id: "titan",
    codename: "Project Titan",
    sector: "Logistics & Fleet Systems",
    location: "Chicagoland Area",
    revenue: 4200000,
    ebitda: 950000,
    asking: 2800000,
    loiValue: 2650000,
    targetClosing: "2026-06-30",
    diligenceDaysTotal: 60,
    diligenceDaysElapsed: 15,
    escrowAgent: "Windy City Title & Escrow",
    documents: [
      { id: "doc-1", category: "Financial", name: "Quarterly Carrier Performance & Fuel Surcharge Reports.xlsx", size: "9.5 MB", dateAdded: "2026-01-12", securityLevel: "Protected", isRedacted: false, encryptedHash: "0xDE21...44B" },
      { id: "doc-2", category: "Legal", name: "Owner-Operator Non-Union Service Agreements Template.pdf", size: "5.4 MB", dateAdded: "2026-01-14", securityLevel: "Unrestricted", isRedacted: false, encryptedHash: "0x9E99...5F1" }
    ],
    checklist: [
      { id: "chk-1", task: "Owner-Operator Independent Contractor Classification Review", assignee: "Buyer Legal", status: "Pending Review", criticality: "High" },
      { id: "chk-2", task: "Department of Transportation Safety Auditing Logs Verification", assignee: "Lender Team", status: "Outstanding", criticality: "High" }
    ],
    collaboration: [
      { id: "msg-1", sender: "System Terminal", role: "VDR AUTOMATION", message: "VDR secure channel activated for Project Titan.", timestamp: "08:44:11 AM", isSystem: true }
    ]
  }
};

export default function VDRPage() {
  const params = useParams();
  const router = useRouter();

  const rawDealId = params?.dealId;
  const dealIdStr = typeof rawDealId === "string" ? rawDealId.toLowerCase() : "delta";
  const dealData: DealVDR = DEALS_VDR_DATA[dealIdStr] || DEALS_VDR_DATA.delta;

  // Tabs Management
  const [activeTab, setActiveTab] = useState<"documents" | "checklist" | "underwriting" | "collaboration">("documents");

  // Authentication State
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [securityKey, setSecurityKey] = useState("");
  const [authError, setAuthError] = useState("");

  // Document Management States
  const [docCategoryFilter, setDocCategoryFilter] = useState<"All" | "Financial" | "Legal" | "Tax" | "Operations">("All");
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  // Checklist Interactive State
  const [checklistItems, setChecklistItems] = useState(dealData.checklist);

  // Messaging Thread State
  const [messages, setMessages] = useState(dealData.collaboration);
  const [newMessageText, setNewMessageText] = useState("");

  // Interactive Debt Structuring Engine (Post-LOI Adjuster)
  const [buyerEquityPct, setBuyerEquityPct] = useState(10);
  const [sellerStandbyPct, setSellerStandbyPct] = useState(15);
  const [prevailingSbaRate, setPrevailingSbaRate] = useState(11.25);

  useEffect(() => {
    setChecklistItems(dealData.checklist);
    setMessages(dealData.collaboration);
  }, [dealData]);

  const handleKeyAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityKey.trim().toUpperCase() === "SECURE123" || securityKey.trim().toLowerCase() === "demo") {
      setIsDecrypted(true);
      setAuthError("");
    } else {
      setAuthError("CRYPTOGRAPHIC ACCESS DENIED: INVALID KEY SIGNATURE");
    }
  };

  const simulateDownload = (docId: string, docName: string) => {
    if (!isDecrypted && (docName.includes("Highly Sensitive") || docName.includes("Tax") || docName.includes("QofE"))) {
      alert("SESSION IS ENCRYPTED. Enter Security Session Key first.");
      return;
    }
    setDownloadProgress((prev) => ({ ...prev, [docId]: 1 }));
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const current = prev[docId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert(`SECURE SYSTEM: Document "${docName}" successfully decrypted and cached to local system.`);
          }, 300);
          return prev;
        }
        return { ...prev, [docId]: current + 20 };
      });
    }, 150);
  };

  const toggleChecklistStatus = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatusMap: Record<string, "Completed" | "Pending Review" | "Outstanding"> = {
            Outstanding: "Pending Review",
            "Pending Review": "Completed",
            Completed: "Outstanding"
          };
          return { ...item, status: nextStatusMap[item.status] };
        }
        return item;
      })
    );
  };

  const postNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: "Lead Principal (You)",
      role: "LOI Principal",
      message: newMessageText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      isSystem: false
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessageText("");

    // Simulate Agent Auto-Response
    setTimeout(() => {
      const autoResponse = {
        id: `msg-auto-${Date.now()}`,
        sender: "Secured Port Terminal",
        role: "VDR COMPLIANCE GATEWAY",
        message: "Acknowledged. Secure ledger updated. Compliance audit node dispatched.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }),
        isSystem: true
      };
      setMessages((prev) => [...prev, autoResponse]);
    }, 1200);
  };

  // Live Math Calculations for Underwriting Tab
  const loiVal = dealData.loiValue;
  const rawEbitda = dealData.ebitda;
  const buyerEquityVal = loiVal * (buyerEquityPct / 100);
  const sellerStandbyVal = loiVal * (sellerStandbyPct / 100);
  const sbaDebtVal = Math.max(0, loiVal - buyerEquityVal - sellerStandbyVal);

  const monthlyRate = (prevailingSbaRate / 100) / 12;
  const totalMonths = 120; // 10 years maturity
  let annualDebtService = 0;
  if (sbaDebtVal > 0) {
    const calculatedPmt = sbaDebtVal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    annualDebtService = calculatedPmt * 12;
  }

  const netCashFlow = rawEbitda - annualDebtService;
  const dscrVal = annualDebtService > 0 ? (rawEbitda / annualDebtService).toFixed(2) : "N/A";

  const checklistProgress = Math.round(
    (checklistItems.filter((item) => item.status === "Completed").length / checklistItems.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F9F9] font-sans antialiased flex flex-col terminal-grid relative selection:bg-[#00FF66] selection:text-black">
      
      {/* 1. TOP GLOBAL SECURE TELEMETRY BAR */}
      <header className="w-full bg-[#090909] border-b border-[#222222] h-11 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-[#00FF66] text-black font-mono text-[9px] font-bold px-2.5 py-0.5 tracking-wider uppercase flex items-center space-x-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
            <span>SECURE CRYPTO-LINK ACTIVE</span>
          </div>
          <span className="font-mono text-[10px] text-[#666] hidden md:inline">| SHA-256 SESSION KEY STATUS: INITIALIZED</span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push("/")} 
            className="font-mono text-[10px] uppercase text-[#0EA5E9] hover:underline flex items-center space-x-1.5"
          >
            <span>← TERMINAL DEALS</span>
          </button>
          <span className="text-[#222222]">/</span>
          <span className="font-mono text-[10px] text-[#FF3333]">LOI AUTO-LOCK EXPIRES IN 42 DAYS</span>
        </div>
      </header>

      {/* 2. TRANSACTION METADATA MASTERPLATE BENTO BLOCK */}
      <div className="border-b border-[#222222] bg-gradient-to-b from-[#080808] to-[#040404] p-6 lg:p-8">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0ea5e9]/20 px-2.5 py-0.5 uppercase">
                {dealData.sector}
              </span>
              <span className="font-mono text-xs text-[#555]">•</span>
              <span className="font-mono text-xs text-[#888888]">{dealData.location}</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase flex items-center gap-3">
              {dealData.codename}
              <span className="text-sm font-mono text-[#00FF66] px-2.5 py-0.5 border border-[#00ff66]/30 bg-[#00ff66]/5 rounded-none font-normal tracking-wider">
                LOI STAGE
              </span>
            </h1>
            <p className="text-xs text-[#666] font-mono">
              Virtual Transaction Room and Document Safe (Escrow Agent: <span className="text-[#0EA5E9]">{dealData.escrowAgent}</span>)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-4">
            <div className="bg-[#090909] border border-[#222222] p-4 min-w-[150px]">
              <span className="block font-mono text-[9px] text-[#666] uppercase">LOI VALUATION</span>
              <span className="text-lg font-bold text-white tracking-tight font-mono">
                ${dealData.loiValue.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#090909] border border-[#222222] p-4 min-w-[150px]">
              <span className="block font-mono text-[9px] text-[#666] uppercase">TARGET CLOSING</span>
              <span className="text-lg font-bold text-[#0EA5E9] tracking-tight font-mono">
                {dealData.targetClosing}
              </span>
            </div>
            <div className="bg-[#090909] border border-[#222222] p-4 min-w-[150px]">
              <span className="block font-mono text-[9px] text-[#666] uppercase">DILIGENCE TIMELINE</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-[#00FF66] font-mono">
                  {dealData.diligenceDaysElapsed}/{dealData.diligenceDaysTotal} Days
                </span>
                <span className="text-[10px] text-[#555] font-mono">
                  ({Math.round((dealData.diligenceDaysElapsed / dealData.diligenceDaysTotal) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#222] h-1.5 mt-2 rounded-none overflow-hidden">
                <div 
                  className="bg-[#00FF66] h-full" 
                  style={{ width: `${(dealData.diligenceDaysElapsed / dealData.diligenceDaysTotal) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-[#090909] border border-[#222222] p-4 min-w-[150px]">
              <span className="block font-mono text-[9px] text-[#666] uppercase">DILIGENCE CHECKS</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-white font-mono">{checklistProgress}% Verified</span>
                <span className="text-[10px] text-[#555] font-mono">
                  {checklistItems.filter(i => i.status === "Completed").length}/{checklistItems.length}
                </span>
              </div>
              <div className="w-full bg-[#222] h-1.5 mt-2 rounded-none overflow-hidden">
                <div 
                  className="bg-[#0EA5E9] h-full" 
                  style={{ width: `${checklistProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DUAL-ROW HIGH-SECURITY ACCESS CONSOLE (SECURITY KEY INPUT) */}
      {!isDecrypted && (
        <section className="bg-[#0E0E0E] border-b border-[#222222] px-6 py-4">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="inline-block w-3.5 h-3.5 bg-[#FF3333] shrink-0 border border-black animate-pulse"></span>
              <div className="space-y-0.5">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#FF3333] font-bold">
                  CRYPTOGRAPHIC LOCKOUT IN PLACE
                </h4>
                <p className="text-[11px] text-[#888] font-mono">
                  Redacted & Level-3 files will remain locked. Authenticate using Security Key. (Demo Key: <span className="text-[#00FF66] font-bold">SECURE123</span>)
                </p>
              </div>
            </div>

            <form onSubmit={handleKeyAuth} className="flex items-center space-x-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Enter Session Key" 
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                className="bg-black border border-[#222222] px-3 py-2 text-xs font-mono text-[#F9F9F9] placeholder-[#444] rounded-none focus:outline-none focus:border-[#0EA5E9] w-full md:w-64"
              />
              <button 
                type="submit" 
                className="bg-[#FF3333]/15 border border-[#FF3333] hover:bg-[#FF3333] hover:text-black transition-all px-4 py-2 font-mono text-xs font-bold uppercase shrink-0 text-[#FF3333]"
              >
                AUTHORIZE KEY
              </button>
            </form>
          </div>
          {authError && (
            <div className="max-w-[1500px] mx-auto mt-2 text-right">
              <p className="font-mono text-[10px] text-[#FF3333] font-semibold">{authError}</p>
            </div>
          )}
        </section>
      )}

      {isDecrypted && (
        <section className="bg-[#051C12] border-b border-[#00FF66]/20 px-6 py-3">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="inline-block w-3.5 h-3.5 bg-[#00FF66] shrink-0"></span>
              <div>
                <p className="font-mono text-xs text-[#00FF66] font-bold uppercase tracking-wider">
                  SECURITY CLEARED — ENHANCED DECRYPTION ENGINE ACTIVE
                </p>
                <p className="text-[10px] text-[#88D3B0] font-mono">
                  All redacted, financials, QofE files, and secure legal contracts are accessible for transaction modeling.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsDecrypted(false)} 
              className="font-mono text-[10px] uppercase text-[#FF3333] border border-[#FF3333]/30 px-2 py-1 hover:bg-[#FF3333]/10"
            >
              [ LOGOUT DECRYPT ]
            </button>
          </div>
        </section>
      )}

      {/* 4. WORKSPACE TABS */}
      <nav className="w-full bg-[#080808] border-b border-[#222222] px-6">
        <div className="max-w-[1500px] mx-auto flex overflow-x-auto space-x-1">
          {(["documents", "checklist", "underwriting", "collaboration"] as const).map((tab) => {
            const labelMap = {
              documents: "01 / SECURE VDR SAFEHOUSE",
              checklist: "02 / LOI DILIGENCE STATUS",
              underwriting: "03 / SBA LBO INTERACTIVE MODELER",
              collaboration: "04 / ADVISOR CHANNELS"
            };
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-5 font-mono text-[11px] font-bold tracking-widest uppercase transition-all shrink-0 rounded-none border-b-2 ${
                  active 
                    ? "border-[#00FF66] text-[#00FF66] bg-black/40" 
                    : "border-transparent text-[#666] hover:text-[#999] hover:border-[#333]"
                }`}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 5. MAIN WORKSPACE CONTAINER */}
      <main className="flex-grow max-w-[1500px] w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT WORKSPACE COL - MAIN WORKSPACE INTERACTIVITY */}
        <section className="flex-grow bg-[#080808] border border-[#222222] min-h-[500px]">
          
          {/* TAB 1: DOCUMENT VDR SAFEHOUSE */}
          {activeTab === "documents" && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4">
                <div>
                  <h3 className="font-mono text-sm text-white font-bold uppercase">
                    UNDERWRITING & SECURE VIRTUAL DATA ROOM
                  </h3>
                  <p className="text-xs text-[#666] font-mono mt-0.5">
                    Select dynamic operational categories and audit trails.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(["All", "Financial", "Legal", "Tax", "Operations"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDocCategoryFilter(cat)}
                      className={`px-3 py-1 text-[10px] font-mono border rounded-none uppercase transition-all ${
                        docCategoryFilter === cat 
                          ? "border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#0ea5e9]" 
                          : "border-[#222222] bg-black text-[#666] hover:text-[#999]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#222] text-[#555] uppercase text-[10px]">
                      <th className="py-3 px-4">DOCUMENT DESCRIPTION</th>
                      <th className="py-3 px-4">SIZE</th>
                      <th className="py-3 px-4">SECURITY TIER</th>
                      <th className="py-3 px-4">STATE</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181818]">
                    {dealData.documents
                      .filter((doc) => docCategoryFilter === "All" || doc.category === docCategoryFilter)
                      .map((doc) => {
                        const isHighlySensitive = doc.securityLevel === "Highly Sensitive (LOI-Only)";
                        const locked = isHighlySensitive && !isDecrypted;
                        
                        return (
                          <tr key={doc.id} className="hover:bg-[#0A0A0A] transition-colors group">
                            <td className="py-4 px-4 font-semibold text-white">
                              <div className="flex items-center space-x-2.5">
                                <span className={`w-2 h-2 shrink-0 ${
                                  doc.category === "Financial" ? "bg-[#0ea5e9]" :
                                  doc.category === "Tax" ? "bg-[#FF3333]" :
                                  doc.category === "Legal" ? "bg-amber-500" : "bg-[#00FF66]"
                                }`}></span>
                                <div className="space-y-0.5">
                                  <span className="block font-medium tracking-tight text-[#f9f9f9] max-w-[320px] md:max-w-md truncate">
                                    {doc.name}
                                  </span>
                                  <span className="block text-[9px] text-[#444] uppercase tracking-wider">
                                    HASH: {doc.encryptedHash} • UPLOADED {doc.dateAdded}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[#888]">{doc.size}</td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] px-2 py-0.5 border ${
                                isHighlySensitive 
                                  ? "border-[#FF3333]/30 bg-[#FF3333]/5 text-[#FF3333]" 
                                  : doc.securityLevel === "Protected"
                                  ? "border-[#0ea5e9]/30 bg-[#0ea5e9]/5 text-[#0ea5e9]"
                                  : "border-[#222] bg-black text-[#888]"
                              }`}>
                                {doc.securityLevel}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {locked ? (
                                <span className="text-[#FF3333] text-[10px] uppercase font-bold flex items-center space-x-1">
                                  <span>🔒 CRYPTO REDACTED</span>
                                </span>
                              ) : doc.isRedacted ? (
                                <span className="text-amber-500 text-[10px] uppercase font-bold flex items-center space-x-1">
                                  <span>⚠️ AUDITED REDACTION</span>
                                </span>
                              ) : (
                                <span className="text-[#00FF66] text-[10px] uppercase font-bold">
                                  ✓ CLEAR TEXT
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              {downloadProgress[doc.id] !== undefined ? (
                                <div className="inline-block text-right w-24">
                                  <div className="text-[9px] text-[#00FF66] mb-1">
                                    DECRYPTING ({downloadProgress[doc.id]}%)
                                  </div>
                                  <div className="w-full bg-[#222] h-1.5 rounded-none overflow-hidden">
                                    <div 
                                      className="bg-[#00FF66] h-full" 
                                      style={{ width: `${downloadProgress[doc.id]}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => simulateDownload(doc.id, doc.name)}
                                  className={`px-3 py-1.5 font-mono text-[10px] border transition-all uppercase ${
                                    locked 
                                      ? "border-[#222222] text-[#444] cursor-not-allowed" 
                                      : "border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black"
                                  }`}
                                  disabled={locked}
                                >
                                  {locked ? "UNAUTHORIZED" : "DOWNLOAD"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Secure Download Disclaimer */}
              <div className="border border-[#222222] p-4 bg-black space-y-2">
                <span className="font-mono text-[9px] text-[#555] block tracking-widest uppercase">
                  FINCEN DECRYPTION & AUDIT COMPLIANCE LOGS
                </span>
                <p className="text-[10px] text-[#666] leading-relaxed font-mono">
                  Downloads triggers logging event dispatch to IP audit trail database. Your digital fingerprint has been mapped onto the security ledger. Decryption uses end-to-end symmetric keys.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DILIGENCE CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="p-6 space-y-6">
              <div className="border-b border-[#1A1A1A] pb-4">
                <h3 className="font-mono text-sm text-white font-bold uppercase">
                  LOI UNDERWRITING DILIGENCE MATRIX
                </h3>
                <p className="text-xs text-[#666] font-mono mt-0.5">
                  Secure collaboration checklists across target buyer, advisor, and SBA preferred lender channels. Click state button to simulate action pipeline.
                </p>
              </div>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-black border border-[#222222] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => toggleChecklistStatus(item.id)}
                        className={`w-5 h-5 shrink-0 border mt-0.5 flex items-center justify-center transition-all ${
                          item.status === "Completed" 
                            ? "bg-[#00FF66] border-[#00FF66] text-black" 
                            : item.status === "Pending Review"
                            ? "bg-amber-500/20 border-amber-500 text-amber-500"
                            : "border-[#333] hover:border-[#666] bg-[#0A0A0A]"
                        }`}
                      >
                        {item.status === "Completed" && (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {item.status === "Pending Review" && (
                          <span className="text-[9px] font-bold">?</span>
                        )}
                      </button>

                      <div className="space-y-1">
                        <span className="font-mono text-[10px] text-[#0EA5E9] tracking-wider uppercase font-semibold">
                          {item.assignee}
                        </span>
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-snug">
                          {item.task}
                        </h4>
                        <div className="flex items-center space-x-2.5 font-mono text-[9px] text-[#555]">
                          <span>CRITICALITY:</span>
                          <span className={
                            item.criticality === "High" ? "text-[#FF3333] font-bold" :
                            item.criticality === "Medium" ? "text-amber-500 font-bold" : "text-[#888]"
                          }>
                            {item.criticality.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-1 ${
                        item.status === "Completed" 
                          ? "text-[#00FF66] border border-[#00FF66]/20 bg-[#00FF66]/5" 
                          : item.status === "Pending Review"
                          ? "text-amber-500 border border-amber-500/20 bg-amber-500/5"
                          : "text-[#FF3333] border border-[#FF3333]/20 bg-[#FF3333]/5"
                      }`}>
                        {item.status}
                      </span>

                      <button
                        onClick={() => toggleChecklistStatus(item.id)}
                        className="bg-[#0c0c0c] border border-[#222222] hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all px-3 py-1 font-mono text-[9px] text-[#888]"
                      >
                        CYCLE STATE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SBA UNDERWRITING MODELER */}
          {activeTab === "underwriting" && (
            <div className="p-6 space-y-8">
              <div className="border-b border-[#1A1A1A] pb-4">
                <h3 className="font-mono text-sm text-white font-bold uppercase">
                  SBA LBO CAPITAL STRUCTURING ENGINE (LOI STAGE)
                </h3>
                <p className="text-xs text-[#666] font-mono mt-0.5">
                  Iterate the final transactional structure below. Balance equity injection vs. seller standby notes to monitor target debt service coverage ratio.
                </p>
              </div>

              {/* Inputs Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black border border-[#1c1c1c] p-6">
                
                {/* Equity Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#888] uppercase tracking-wider">Equity Injection</span>
                    <span className="text-[#0ea5e9] font-bold">{buyerEquityPct}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="40" 
                    step="1" 
                    value={buyerEquityPct}
                    onChange={(e) => setBuyerEquityPct(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#222] accent-[#0EA5E9]" 
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#555]">
                    <span>Min (10%)</span>
                    <span>Max (40%)</span>
                  </div>
                </div>

                {/* Seller Note Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#888] uppercase tracking-wider">Seller Standby (IO)</span>
                    <span className="text-[#00FF66] font-bold">{sellerStandbyPct}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="25" 
                    step="1" 
                    value={sellerStandbyPct}
                    onChange={(e) => setSellerStandbyPct(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#222] accent-[#00FF66]" 
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#555]">
                    <span>0% (No Note)</span>
                    <span>Max (25%)</span>
                  </div>
                </div>

                {/* SBA Variable Rate Input */}
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#888] uppercase tracking-wider">SBA Variable Rate</span>
                    <span className="text-[#FF3333] font-bold">{prevailingSbaRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="9.0" 
                    max="12.5" 
                    step="0.25" 
                    value={prevailingSbaRate}
                    onChange={(e) => setPrevailingSbaRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#222] accent-[#FF3333]" 
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#555]">
                    <span>SOFR Benchmark</span>
                    <span>12.5% Cap</span>
                  </div>
                </div>

              </div>

              {/* Mathematical Outputs stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0C0C0C] border border-[#222] p-4 space-y-1">
                  <span className="font-mono text-[9px] text-[#666] block uppercase">BUYER CASH REQ.</span>
                  <span className="text-lg font-bold font-mono text-white">
                    ${buyerEquityVal.toLocaleString()}
                  </span>
                  <span className="block font-mono text-[9px] text-[#888]">{buyerEquityPct}% injection</span>
                </div>

                <div className="bg-[#0C0C0C] border border-[#222] p-4 space-y-1">
                  <span className="font-mono text-[9px] text-[#666] block uppercase">SELLER VENDOR LOAN</span>
                  <span className="text-lg font-bold font-mono text-[#00FF66]">
                    ${sellerStandbyVal.toLocaleString()}
                  </span>
                  <span className="block font-mono text-[9px] text-[#888]">{sellerStandbyPct}% subordination</span>
                </div>

                <div className="bg-[#0C0C0C] border border-[#222] p-4 space-y-1">
                  <span className="font-mono text-[9px] text-[#666] block uppercase">SBA 7(A) DEBT</span>
                  <span className="text-lg font-bold font-mono text-[#0EA5E9]">
                    ${sbaDebtVal.toLocaleString()}
                  </span>
                  <span className="block font-mono text-[9px] text-[#888]">
                    {100 - buyerEquityPct - sellerStandbyPct}% loan-to-value
                  </span>
                </div>

                <div className="bg-[#0C0C0C] border border-[#222] p-4 space-y-1">
                  <span className="font-mono text-[9px] text-[#666] block uppercase">ANNUAL DEBT COST</span>
                  <span className="text-lg font-bold font-mono text-[#FF3333]">
                    ${Math.round(annualDebtService).toLocaleString()}
                  </span>
                  <span className="block font-mono text-[9px] text-[#888]">Amortized over 10yr</span>
                </div>
              </div>

              {/* Performance Telemetry Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-black border border-[#222222] p-5 space-y-4">
                  <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase block">
                    Underwriting Capacity Analytics
                  </span>

                  <div className="space-y-3.5 font-mono text-xs">
                    <div className="flex justify-between border-b border-[#111] pb-2">
                      <span className="text-[#666]">Target Deal Cashflow (Reconciled EBITDA)</span>
                      <span className="text-white font-semibold">${rawEbitda.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] pb-2">
                      <span className="text-[#666]">Annual Senior Debt Repayments</span>
                      <span className="text-[#FF3333] font-semibold">${Math.round(annualDebtService).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#111] pb-2">
                      <span className="text-[#666]">Net Post-Closing Working Capital Cushion</span>
                      <span className="text-[#00FF66] font-semibold">${Math.round(netCashFlow).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black border border-[#222222] p-5 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#888] tracking-widest uppercase block mb-2">
                      Lender Quality Rating
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-4xl font-extrabold tracking-tighter font-mono ${
                        parseFloat(dscrVal) >= 1.5 ? "text-[#00FF66]" : "text-amber-500"
                      }`}>
                        {dscrVal}x
                      </span>
                      <span className="font-mono text-xs text-[#555]">DEBT SERVICE COVERAGE RATIO (DSCR)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#888] font-mono leading-relaxed mt-4">
                    {parseFloat(dscrVal) >= 1.5 
                      ? "STRONGLY COMPLIANT: The projected DSCR exceeds the industry SBA threshold (1.25x), signaling high-quality leverage safety margins."
                      : "CRITICAL LEVEL: Projected DSCR is hovering low. Consider scaling up Seller Standby note allocation to preserve target operational safety."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COLLABORATION THREAD */}
          {activeTab === "collaboration" && (
            <div className="p-6 flex flex-col h-[550px]">
              <div className="border-b border-[#1A1A1A] pb-4 mb-4 shrink-0">
                <h3 className="font-mono text-sm text-white font-bold uppercase">
                  VDR COMPLIANCE INTERCOM
                </h3>
                <p className="text-xs text-[#666] font-mono mt-0.5">
                  Encrypted communication pipeline between advisors, lenders, and key underwriting principals.
                </p>
              </div>

              {/* Chat Thread */}
              <div className="flex-grow overflow-y-auto bg-black border border-[#1a1a1a] p-4 font-mono text-xs space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-3.5 ${
                    msg.isSystem 
                      ? "bg-[#111] border-l-2 border-[#0EA5E9] text-[#888]" 
                      : "bg-[#0A0A0A] border-l-2 border-[#00FF66] text-[#F9F9F9]"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0EA5E9]">{msg.sender} <span className="text-[#555] font-normal">({msg.role})</span></span>
                      <span className="text-[10px] text-[#444]">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed mt-1 text-[#AAA]">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Text Input console */}
              <form onSubmit={postNewMessage} className="flex gap-2 shrink-0">
                <input 
                  type="text" 
                  placeholder="Transmit securely encrypted message..." 
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-grow bg-black border border-[#222] px-4 text-xs font-mono text-white placeholder-[#555] rounded-none focus:outline-none focus:border-[#00FF66]"
                />
                <button 
                  type="submit" 
                  className="bg-[#00FF66] text-black font-mono font-bold text-xs uppercase px-6 py-3 hover:bg-white transition-colors rounded-none"
                >
                  TRANSMIT
                </button>
              </form>
            </div>
          )}

        </section>

        {/* RIGHT SIDEBAR PANEL - CRYPTO ENCRYPT TELEMETRY & TRUST LOGS */}
        <aside className="w-full lg:w-[350px] space-y-6 shrink-0">
          
          {/* SECURE BLOCKCHAIN SYSTEM HASH BADGE */}
          <div className="bg-[#080808] border border-[#222222] p-5 space-y-4">
            <span className="font-mono text-[9px] text-[#FF3333] tracking-widest uppercase block">
              DILIGENCE KEY ACCESS LOGS
            </span>

            <div className="space-y-3 font-mono text-[10px]">
              <div className="bg-black p-3 border border-[#111] space-y-1">
                <div className="text-white flex justify-between">
                  <span>01 / PREMIER TITLE</span>
                  <span className="text-[#00FF66]">✓ OK</span>
                </div>
                <p className="text-[#555] text-[9px]">UCC liens audited. Record is free of pre-closing encumbrances.</p>
              </div>

              <div className="bg-black p-3 border border-[#111] space-y-1">
                <div className="text-white flex justify-between">
                  <span>02 / SBA AUDITING</span>
                  <span className="text-[#0EA5E9]">PENDING</span>
                </div>
                <p className="text-[#555] text-[9px]">Awaiting environmental audit execution reports.</p>
              </div>

              <div className="bg-black p-3 border border-[#111] space-y-1">
                <div className="text-white flex justify-between">
                  <span>03 / ADVISER BOARD</span>
                  <span className="text-[#00FF66]">✓ ACTIVE</span>
                </div>
                <p className="text-[#555] text-[9px]">Buyer attorney assigned and draft definitive contracts queued.</p>
              </div>
            </div>
          </div>

          {/* SECURE TUNNEL PROTOCOLS CARD */}
          <div className="bg-[#080808] border border-[#222222] p-5 space-y-4">
            <span className="font-mono text-[9px] text-[#666] tracking-widest uppercase block">
              VDR SYSTEM AUDIT NODE
            </span>

            <div className="space-y-2 text-[11px] font-mono text-[#888] leading-relaxed">
              <p>
                This terminal represents a cryptographic tunnel connecting principal underwriters with validated sellers and brokers directly.
              </p>
              <div className="border-t border-[#1C1C1C] pt-3 space-y-1 text-[10px] text-[#555]">
                <p>CIPHER: AES-GCM-256</p>
                <p>PROTOCOL: TLS 1.3</p>
                <p>IP RANGE: 198.162.0.1 (VPN-ENC)</p>
              </div>
            </div>
          </div>

        </aside>

      </main>

      {/* 6. SYSTEM STATUS FOOTER */}
      <footer className="mt-auto bg-[#080808] border-t border-[#222222] py-6 px-6 shrink-0">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#555]">
          <span>ACQUIREMETA SECURE CRYPTO PIPELINE SH-883</span>
          <span className="uppercase text-[#888]">
            SBA Preferred Platform Model • Active Deal Ref: {dealIdStr.toUpperCase()}
          </span>
          <span>© 2026 ACQUIREMETA INC. SECURE VDR SAFEHOUSE</span>
        </div>
      </footer>

    </div>
  );
}