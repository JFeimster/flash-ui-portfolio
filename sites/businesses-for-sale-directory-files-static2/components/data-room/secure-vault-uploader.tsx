import React, { useState, useRef } from "react";

// Types for Virtual Data Room (VDR) Management
interface SecureDocument {
  id: string;
  name: string;
  category: "Financials" | "Legal" | "Operations" | "Lending";
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  status: "VERIFIED" | "PENDING" | "FLAGGED";
  hash: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  phase: string;
  status: "COMPLETE" | "IN_PROGRESS" | "AWAITING_DOCS";
  assignee: "Advisors" | "Legal" | "Lenders" | "Buyer";
}

interface AuditMessage {
  id: string;
  timestamp: string;
  sender: string;
  role: "Lead Broker" | "SBA Underwriter" | "Acquisition Counsel" | "System Audit";
  message: string;
  encrypted: boolean;
}

export default function SecureVaultUploader() {
  // Mock VDR Active States
  const [documents, setDocuments] = useState<SecureDocument[]>([
    {
      id: "DOC-001",
      name: "Project_Delta_FY23-FY25_Adjusted_EBITDA_Bridge.xlsx",
      category: "Financials",
      size: "4.8 MB",
      uploadedAt: "2026-02-14 09:41",
      uploadedBy: "M. Vance (Lead Broker)",
      status: "VERIFIED",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
      id: "DOC-002",
      name: "Three_Years_Federal_Tax_Returns_Blinded.pdf",
      category: "Financials",
      size: "18.2 MB",
      uploadedAt: "2026-02-14 11:02",
      uploadedBy: "M. Vance (Lead Broker)",
      status: "VERIFIED",
      hash: "8f56e9c4038167d3e69f1bf3d333f2a89326f6ca4e6d2466ef618cf23bb8e84b",
    },
    {
      id: "DOC-003",
      name: "Core_Machinery_Capital_Equipment_Schedule_A.pdf",
      category: "Operations",
      size: "1.2 MB",
      uploadedAt: "2026-02-15 14:15",
      uploadedBy: "J. Mercer (Acquisition Counsel)",
      status: "PENDING",
      hash: "a4f2081e8c4597b47e44e2b859341aa507ae25f16e119ba4246fe15bc8288fb2",
    },
    {
      id: "DOC-004",
      name: "Articles_of_Organization_&_State_SBA_Bylaws.pdf",
      category: "Legal",
      size: "890 KB",
      uploadedAt: "2026-02-12 10:20",
      uploadedBy: "J. Mercer (Acquisition Counsel)",
      status: "VERIFIED",
      hash: "2c72b21c469f3d33a6f6b4e54ea8933b9344446a6f6cf124d2d3ebb920bc8b6c",
    },
    {
      id: "DOC-005",
      name: "SBA_Form_1919_Borrower_Information_Draft.pdf",
      category: "Lending",
      size: "2.4 MB",
      uploadedAt: "2026-02-16 16:30",
      uploadedBy: "T. Sterling (SBA Underwriter)",
      status: "FLAGGED",
      hash: "7f4c3a2e1d0b9a8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
    },
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "CL-01", task: "Validate 36-Month trailing customer concentration ledger", phase: "Commercial Diligence", status: "IN_PROGRESS", assignee: "Advisors" },
    { id: "CL-02", task: "Submit executed LOI to SBA Preferred Lending Group", phase: "Debt Structuring", status: "COMPLETE", assignee: "Buyer" },
    { id: "CL-03", task: "Schedule site physical audit & industrial asset verification", phase: "Operational Audit", status: "AWAITING_DOCS", assignee: "Advisors" },
    { id: "CL-04", task: "Draft transitional employment agreement for key engineer", phase: "Legal Drafting", status: "IN_PROGRESS", assignee: "Legal" },
    { id: "CL-05", task: "Issue Phase I Environmental site assessment protocol", phase: "Risk Compliance", status: "COMPLETE", assignee: "Lenders" },
  ]);

  const [auditLog, setAuditLog] = useState<AuditMessage[]>([
    { id: "LOG-01", timestamp: "16:42:10", sender: "T. Sterling", role: "SBA Underwriter", message: "SBA Form 1919 has missing entity structural fields on Section II. Uploading revision request flag.", encrypted: true },
    { id: "LOG-02", timestamp: "15:20:45", sender: "J. Mercer", role: "Acquisition Counsel", message: "Industrial environmental liability waiver finalized. Ready for lender assessment.", encrypted: true },
    { id: "LOG-03", timestamp: "11:05:12", sender: "SYSTEM DECRYPTION", role: "System Audit", message: "Auto-verified SHA-256 fingerprint matching validation pool data.", encrypted: false },
  ]);

  // VDR State Mechanics
  const [activeTab, setActiveTab] = useState<"All" | "Financials" | "Legal" | "Operations" | "Lending">("All");
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Simulation
  const handleFileUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: SecureDocument = {
              id: `DOC-00${documents.length + 1}`,
              name: file.name,
              category: activeTab === "All" ? "Financials" : activeTab,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              uploadedBy: "Lead Acquiring Principal",
              status: "PENDING",
              hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
            };
            setDocuments((prevDocs) => [newDoc, ...prevDocs]);
            setIsUploading(false);
            setUploadProgress(0);

            // Append system message to Secure Advisory Feed
            const systemLog: AuditMessage = {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toTimeString().split(" ")[0],
              sender: "SYSTEM",
              role: "System Audit",
              message: `Encrypted file successfully uploaded: ${file.name}. Integrity checked.`,
              encrypted: false,
            };
            setAuditLog((prevLogs) => [systemLog, ...prevLogs]);
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  // Submit secure thread dispatch message
  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const dispatch: AuditMessage = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toTimeString().split(" ")[0],
      sender: "Primary Acquirer",
      role: "Lead Broker",
      message: newMessage,
      encrypted: true,
    };

    setAuditLog([dispatch, ...auditLog]);
    setNewMessage("");
  };

  // Calculate Progress Stats
  const completedChecklist = checklist.filter((item) => item.status === "COMPLETE").length;
  const progressPercent = Math.round((completedChecklist / checklist.length) * 100);

  // Filtered Document View Selection
  const filteredDocs = documents.filter((doc) => activeTab === "All" || doc.category === activeTab);

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans antialiased border border-[#222222] glow-copper">
      
      {/* 1. SECURE SHELL/DATA-ROOM HEADER */}
      <div className="border-b border-[#222222] bg-[#090909] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-[9px] text-[#00FF66] tracking-widest uppercase font-bold">SECURE PIPELINE KEY-SH-883</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#F9F9F9] font-mono">
            VIRTUAL DATA ROOM (VDR) — <span className="text-[#0EA5E9]">PROJECT DELTA</span>
          </h2>
          <p className="text-[11px] text-[#666666] font-mono uppercase tracking-wider">
            UNDER LOI // REGULATED ACQUISITION FLOW DILIGENCE WINDOW
          </p>
        </div>

        {/* Security / System Badging */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="bg-black border border-[#222222] px-3 py-1.5 font-mono text-[10px] text-[#888888] flex items-center space-x-2">
            <span className="text-[#00FF66] font-bold">AES-256</span>
            <span className="text-[#444444]">|</span>
            <span>END-TO-END</span>
          </div>
          <div className="bg-[#FF3333]/10 border border-[#FF3333]/20 px-3 py-1.5 font-mono text-[10px] text-[#FF3333] flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3333]"></span>
            <span>RESTRICTED LOGINS</span>
          </div>
        </div>
      </div>

      {/* 2. CORE VDR HUB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: DILIGENCE CHECKLIST & DOCUMENTS MANAGEMENT (8 COLS) */}
        <div className="lg:col-span-8 p-6 space-y-6 border-r border-[#222222]">
          
          {/* A. REAL-TIME TRANCHE OVERVIEW BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-[#090909] border border-[#222222] p-4 font-mono">
            <div>
              <span className="text-[8px] text-[#666666] block uppercase">TRANSACTING PARTIES</span>
              <span className="text-xs text-[#F9F9F9] font-semibold">Buyer, SBA Team, Legal</span>
            </div>
            <div>
              <span className="text-[8px] text-[#666666] block uppercase">DILIGENCE CLOSES</span>
              <span className="text-xs text-[#FF3333] font-semibold">March 31, 2026</span>
            </div>
            <div>
              <span className="text-[8px] text-[#666666] block uppercase">LOI ESCROW DEPOSIT</span>
              <span className="text-xs text-[#00FF66] font-semibold">$50,000 Verified</span>
            </div>
            <div>
              <span className="text-[8px] text-[#666666] block uppercase">VERIFIED SECURE CODES</span>
              <span className="text-xs text-[#0EA5E9] font-semibold">9/9 Complete</span>
            </div>
          </div>

          {/* B. UNDERWRITING DILIGENCE TRACKER CHECKLIST */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-mono text-xs uppercase text-[#888888] tracking-widest flex items-center space-x-1.5">
                  <span>01 / TRANSACTION CHECKLIST INTEGRITY</span>
                </h3>
                <p className="text-xs text-[#555555]">Comprehensive compliance tracking to reach final underwriting board submission.</p>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs bg-black px-3 py-1 border border-[#1a1a1a]">
                <span className="text-[#888888]">PROGRESS:</span>
                <span className="text-[#00FF66] font-bold">{progressPercent}%</span>
              </div>
            </div>

            {/* Micro-Progress bar (Ascii-inspired layout) */}
            <div className="w-full bg-neutral-900 border border-[#222] h-4 relative flex items-center">
              <div 
                className="bg-gradient-to-r from-[#0EA5E9] to-[#00FF66] h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <div className="absolute right-3 font-mono text-[9px] text-[#888888] font-bold z-10">
                {completedChecklist}/{checklist.length} REQUIREMENTS SOLVED
              </div>
            </div>

            {/* Diligence Rows Table */}
            <div className="border border-[#222222] overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] min-w-[600px]">
                <thead>
                  <tr className="bg-[#090909] text-[#666666] uppercase tracking-wider border-b border-[#222222] text-[9px]">
                    <th className="py-2 px-4">TASK DESCRIPTIVE METRIC</th>
                    <th className="py-2 px-4">STAGE AREA</th>
                    <th className="py-2 px-4">ACTOR RESP.</th>
                    <th className="py-2 px-4 text-right">SYSTEM TAGS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {checklist.map((item) => (
                    <tr key={item.id} className="hover:bg-black/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#F9F9F9] flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setChecklist(
                              checklist.map((c) => 
                                c.id === item.id 
                                  ? { ...c, status: c.status === "COMPLETE" ? "IN_PROGRESS" : "COMPLETE" } 
                                  : c
                              )
                            );
                          }}
                          className={`w-3.5 h-3.5 border transition-all flex items-center justify-center shrink-0 ${
                            item.status === "COMPLETE" 
                              ? "bg-[#00FF66] border-[#00FF66] text-black" 
                              : "border-[#444444] hover:border-[#0EA5E9] text-transparent"
                          }`}
                        >
                          ✓
                        </button>
                        <span>{item.task}</span>
                      </td>
                      <td className="py-3 px-4 text-[#888888]">{item.phase}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-neutral-900 border border-[#1a1a1a] text-[#888888] text-[9px]">
                          {item.assignee}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status === "COMPLETE" && (
                          <span className="text-[#00FF66] font-bold">✓ SECURED</span>
                        )}
                        {item.status === "IN_PROGRESS" && (
                          <span className="text-[#0EA5E9] font-bold">● PROCESSING</span>
                        )}
                        {item.status === "AWAITING_DOCS" && (
                          <span className="text-[#FF3333] font-bold">▲ WAITING UPLOAD</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. SECURE VAULT UPLOAD ZONE & DIRECTORY */}
          <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
            
            {/* Dynamic Headers & Directory Filter buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-mono text-xs uppercase text-[#888888] tracking-widest flex items-center space-x-2">
                  <span>02 / ENCRYPTED VAULT SYSTEM</span>
                </h3>
                <p className="text-xs text-[#555555]">Upload verified financial templates, structural filings, or execution blueprints.</p>
              </div>

              {/* Upload Action */}
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <button 
                  onClick={handleFileUploadTrigger}
                  disabled={isUploading}
                  className="h-10 bg-[#00FF66] hover:bg-white text-black font-semibold font-mono text-xs px-4 flex items-center space-x-2 transition-all rounded-none uppercase"
                >
                  {isUploading ? (
                    <>
                      <span className="inline-block w-2.5 h-2.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>UPLOADING SECURE...</span>
                    </>
                  ) : (
                    <>
                      <span>[↑] TRANSMIT DIRECT NEW FILE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upload Progress Bar if active */}
            {isUploading && (
              <div className="bg-[#090909] border border-[#0ea5e9]/30 p-4 space-y-2 font-mono">
                <div className="flex justify-between text-xs text-[#0ea5e9]">
                  <span>SHA-256 CHECK & PACKAGING ENVELOPE:</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-neutral-900 h-2">
                  <div className="bg-[#0ea5e9] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Folder Tabs / Pills */}
            <div className="flex flex-wrap gap-1 border-b border-[#222222] pb-1">
              {(["All", "Financials", "Legal", "Operations", "Lending"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-mono text-xs border-t border-x transition-all rounded-none uppercase ${
                    activeTab === tab
                      ? "bg-[#090909] border-[#222222] text-[#F9F9F9] border-b-[#050505] -mb-[1px]"
                      : "bg-transparent border-transparent text-[#666666] hover:text-[#888888]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* VDR Documents Board */}
            <div className="space-y-3">
              {filteredDocs.length === 0 ? (
                <div className="py-12 border border-dashed border-[#222222] text-center font-mono">
                  <p className="text-xs text-[#555555]">NO VAULT DIRECTORIES GENERATED FOR "{activeTab.toUpperCase()}"</p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#090909] border border-[#222222] p-4 gap-4 hover:border-[#0EA5E9] transition-all group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono text-[#0EA5E9] bg-[#0ea5e9]/10 px-2 py-0.5 border border-[#0ea5e9]/20 uppercase">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#666666]">
                          {doc.size} // Uploaded {doc.uploadedAt}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#F9F9F9] font-mono truncate group-hover:text-white">
                        {doc.name}
                      </h4>
                      <p className="text-[9px] font-mono text-[#444444] tracking-wider truncate">
                        SHA-256: {doc.hash}
                      </p>
                    </div>

                    {/* Right action columns */}
                    <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#1a1a1a]">
                      <div className="font-mono text-right">
                        <span className="text-[8px] text-[#666666] block">METRIC CHECKSUM</span>
                        {doc.status === "VERIFIED" && (
                          <span className="text-[#00FF66] text-[10px] font-bold">✓ AUTO-PASSED</span>
                        )}
                        {doc.status === "PENDING" && (
                          <span className="text-[#0EA5E9] text-[10px] font-bold">● IN ANALYSIS</span>
                        )}
                        {doc.status === "FLAGGED" && (
                          <span className="text-[#FF3333] text-[10px] font-bold">▲ AMENDMENT REQ.</span>
                        )}
                      </div>

                      {/* Download Decrypted File */}
                      <button 
                        onClick={() => {
                          alert(`Simulating secure end-to-end decrypter protocol on client browser.\nDecrypting: ${doc.name}\nVerification Hash: ${doc.hash}`);
                        }}
                        className="px-3 py-1.5 border border-[#222] bg-black text-[#888888] hover:text-[#0EA5E9] hover:border-[#0EA5E9] font-mono text-[10px] uppercase transition-all"
                      >
                        DECRYPT [↓]
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURE COLLABORATION THREAD & SYSTEM LOGGER (4 COLS) */}
        <aside className="lg:col-span-4 bg-[#080808] p-6 flex flex-col justify-between h-full space-y-6">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="border-b border-[#222222] pb-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F9F9F9] flex items-center space-x-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#0ea5e9]"></span>
                <span>SECURE TRANSMISSION LOOP</span>
              </h3>
              <p className="text-[10px] text-[#555] font-mono mt-1 uppercase">Restricted encrypted connection between underwriters, counsel, and sponsor.</p>
            </div>

            {/* Loop status indicator */}
            <div className="bg-black border border-[#222222] p-3 rounded-none font-mono text-[10px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#666666]">TRANSMISSION PROTOCOL:</span>
                <span className="text-[#00FF66] font-bold">ACTIVE ENCRYPTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">CHANNEL INTEGRITY:</span>
                <span className="text-[#00FF66]">100% SHIELDED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">SYSTEM CLASSIFICATION:</span>
                <span className="text-[#FF3333] font-bold">SBA 7(A) CONFIDENTIAL</span>
              </div>
            </div>

            {/* Secure Messages Feed / Loop Terminal */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {auditLog.map((log) => (
                <div key={log.id} className="bg-black p-3.5 border border-[#161616] space-y-1.5 relative group">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-[#F9F9F9]">
                      {log.sender} <span className="text-[#666666] font-normal">({log.role})</span>
                    </span>
                    <span className="font-mono text-[9px] text-[#444444]">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#888888] font-mono leading-relaxed">
                    {log.message}
                  </p>
                  
                  {/* Encrypted indicator watermark */}
                  <div className="flex justify-between items-center pt-1 border-t border-[#111111] text-[8px] font-mono">
                    <span className="text-[#444]">DISPATCH ID: {log.id}</span>
                    {log.encrypted ? (
                      <span className="text-[#0EA5E9] flex items-center space-x-1">
                        <span className="w-1 h-1 bg-[#0EA5E9] rounded-full"></span>
                        <span>AES SECURED</span>
                      </span>
                    ) : (
                      <span className="text-[#666666]">RAW LOG</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messenger Dispatch input panel at bottom */}
          <div className="pt-4 border-t border-[#222222]">
            <form onSubmit={handlePostMessage} className="space-y-2">
              <label className="block font-mono text-[9px] uppercase text-[#666666] tracking-wider">
                TRANSMIT ENCRYPTED DISPATCH MESSAGE:
              </label>
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Draft encrypted advisory query..."
                  rows={3}
                  className="w-full bg-black border border-[#222222] rounded-none p-3 text-xs font-mono text-[#F9F9F9] placeholder-[#444444] focus:outline-none focus:border-[#0EA5E9] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-10 bg-transparent border border-[#0ea5e9] hover:bg-[#0ea5e9] text-[#0ea5e9] hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2"
              >
                <span>TRANSMIT DISPATCH PIPELINE</span>
                <span>[ENTER]</span>
              </button>
            </form>
          </div>
        </aside>
      </div>
      
    </div>
  );
}