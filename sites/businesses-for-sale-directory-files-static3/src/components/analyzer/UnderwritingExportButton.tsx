import React, { useState } from "react";

interface LboUnderwritingData {
  dealCodename: string;
  purchasePrice: number;
  ebitda: number;
  sbaLoanAmount: number;
  sbaInterestRate: number; // e.g. 10.5 for 10.5%
  sbaTermYears: number; // e.g. 10
  sellerNoteAmount: number;
  sellerNoteInterest: number; // e.g. 8.0
  sellerNoteTermYears: number; // e.g. 5
  equityContribution: number;
  dscr: number;
  cashOnCashYield: number;
  downsideScenarioReduction: number; // e.g. 25 for 25% drop
  downsideDscr: number;
}

interface UnderwritingExportButtonProps {
  data?: LboUnderwritingData;
  onExportStart?: () => void;
  onExportComplete?: () => void;
}

export default function UnderwritingExportButton({
  data = {
    dealCodename: "PROJECT DELTA",
    purchasePrice: 1850000,
    ebitda: 620000,
    sbaLoanAmount: 1387500,
    sbaInterestRate: 10.5,
    sbaTermYears: 10,
    sellerNoteAmount: 277500,
    sellerNoteInterest: 8.0,
    sellerNoteTermYears: 5,
    equityContribution: 185000,
    dscr: 2.12,
    cashOnCashYield: 38.4,
    downsideScenarioReduction: 30,
    downsideDscr: 1.48,
  },
  onExportStart,
  onExportComplete,
}: UnderwritingExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Simple monthly payment calculator
  const calculateSbaMonthlyPayment = () => {
    const principal = data.sbaLoanAmount;
    const monthlyRate = (data.sbaInterestRate / 100) / 12;
    const totalMonths = data.sbaTermYears * 12;
    if (monthlyRate === 0) return principal / totalMonths;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  };

  const calculateSellerNoteMonthlyPayment = () => {
    const principal = data.sellerNoteAmount;
    const monthlyRate = (data.sellerNoteInterest / 100) / 12;
    const totalMonths = data.sellerNoteTermYears * 12;
    if (monthlyRate === 0 || totalMonths === 0) return principal / (totalMonths || 1);
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  };

  // Generate CSV data dynamically
  const generateCsvAmortization = () => {
    const sbaMonthly = calculateSbaMonthlyPayment();
    const sellerMonthly = calculateSellerNoteMonthlyPayment();
    
    let sbaBalance = data.sbaLoanAmount;
    let sellerBalance = data.sellerNoteAmount;
    
    const sbaRateMonthly = (data.sbaInterestRate / 100) / 12;
    const sellerRateMonthly = (data.sellerNoteInterest / 100) / 12;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SECURE LBO UNDERWRITING EXPORT - " + data.dealCodename + "\n";
    csvContent += `Purchase Price,${data.purchasePrice}\n`;
    csvContent += `Base EBITDA,${data.ebitda}\n`;
    csvContent += `Equity Cash Injection,${data.equityContribution}\n`;
    csvContent += `Target DSCR,${data.dscr}x\n`;
    csvContent += `Downside EBITDA Drop,${data.downsideScenarioReduction}%\n`;
    csvContent += `Downside DSCR,${data.downsideDscr}x\n\n`;
    
    csvContent += "Month,Beginning Balance (SBA),Principal Paid (SBA),Interest Paid (SBA),Ending Balance (SBA),Seller Note Balance,Seller Note Payment,Total Combined Debt Service,Projected EBITDA,Monthly DSCR\n";

    const totalMonths = data.sbaTermYears * 12;
    const monthlyEbitda = data.ebitda / 12;

    for (let month = 1; month <= totalMonths; month++) {
      // SBA calculation
      const sbaInterest = sbaBalance * sbaRateMonthly;
      let sbaPrincipal = sbaMonthly - sbaInterest;
      if (sbaBalance < sbaPrincipal) {
        sbaPrincipal = sbaBalance;
      }
      const sbaEnd = Math.max(0, sbaBalance - sbaPrincipal);

      // Seller note calculation (often interest only or standard amort)
      let sellerPayment = 0;
      if (month <= data.sellerNoteTermYears * 12) {
        const sellerInterest = sellerBalance * sellerRateMonthly;
        let sellerPrincipal = sellerMonthly - sellerInterest;
        if (sellerBalance < sellerPrincipal) {
          sellerPrincipal = sellerBalance;
        }
        sellerPayment = sellerMonthly;
        sellerBalance = Math.max(0, sellerBalance - sellerPrincipal);
      } else {
        sellerBalance = 0;
      }

      const totalDebtServiceMonth = (sbaPrincipal + sbaInterest) + sellerPayment;
      const currentDscr = totalDebtServiceMonth > 0 ? (monthlyEbitda / totalDebtServiceMonth).toFixed(2) : "N/A";

      csvContent += `${month},${sbaBalance.toFixed(2)},${sbaPrincipal.toFixed(2)},${sbaInterest.toFixed(2)},${sbaEnd.toFixed(2)},${sellerBalance.toFixed(2)},${sellerPayment.toFixed(2)},${totalDebtServiceMonth.toFixed(2)},${monthlyEbitda.toFixed(2)},${currentDscr}\n`;
      
      sbaBalance = sbaEnd;
    }

    return encodeURI(csvContent);
  };

  const runTerminalSimulation = (formatType: "CSV" | "JSON" | "MEMO") => {
    setIsExporting(true);
    setExportProgress([]);
    setCurrentStep(0);
    
    if (onExportStart) onExportStart();

    const steps = [
      `[01/05] CONNECTING TO SECURE LBO SANDBOX TERMINAL... ENGINE COMPLIANT`,
      `[02/05] PULLING LOAN PARAMETERS FOR: ${data.dealCodename}`,
      `[03/05] CALCULATING 10-YEAR DEBT AMORTIZATION MATRIX...`,
      `[04/05] RUNNING 1000x MONTE CARLO DOWNSIDE SCENARIOS (${data.downsideScenarioReduction}% EBITDA STRESS TEST)...`,
      `[05/05] PACKAGING SECURE DATA ENVELOPE VIA COMPLIANT SHA-256 EXPEDITION PORT...`,
    ];

    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setExportProgress((prev) => [...prev, step]);
        setCurrentStep(index + 1);
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            triggerActualDownload(formatType);
            setIsExporting(false);
            setIsOpen(false);
            if (onExportComplete) onExportComplete();
          }, 800);
        }
      }, delay);
      delay += 400 + Math.random() * 400; // randomized cyber-feel speed
    });
  };

  const triggerActualDownload = (formatType: "CSV" | "JSON" | "MEMO") => {
    if (formatType === "CSV") {
      const encodedUri = generateCsvAmortization();
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${data.dealCodename.replace(/\s+/g, "_")}_LBO_UNDERWRITING_MODEL.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === "JSON") {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const link = document.createElement("a");
      link.setAttribute("href", jsonString);
      link.setAttribute("download", `${data.dealCodename.replace(/\s+/g, "_")}_underwriting_parameters.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === "MEMO") {
      // Mock Text file structured credit memorandum
      const memoText = `=====================================================================
UNDERGROUND DEAL FLOW TERMINAL - INVESTMENT COMMITTE CREDIT MEMORANDUM
CONFIDENTIAL // SECURE ACQUISITION ORIGINATION PROTOCOL
=====================================================================
TARGET CODENAME:   ${data.dealCodename}
PURCHASE PRICE:    $${data.purchasePrice.toLocaleString()}
ADJUSTED EBITDA:   $${data.ebitda.toLocaleString()}
IMPLIED MULTIPLE:  ${(data.purchasePrice / data.ebitda).toFixed(2)}x

SOURCES AND USES OF FUNDS:
---------------------------------------------------------------------
SBA 7(a) Loan Amortization (75%):       $${data.sbaLoanAmount.toLocaleString()} @ ${data.sbaInterestRate}% (${data.sbaTermYears} Yr Term)
Seller Standby Subordinated Note (15%): $${data.sellerNoteAmount.toLocaleString()} @ ${data.sellerNoteInterest}% (${data.sellerNoteTermYears} Yr Term)
Buyer Equity Contribution Required:     $${data.equityContribution.toLocaleString()}

KEY METRICS & COVERAGE STRESS TESTING:
---------------------------------------------------------------------
* TARGET DEBT SERVICE COVERAGE RATIO (DSCR):   ${data.dscr}x
* IMPLIED CASH-ON-CASH ANNUALIZED YIELD:       ${data.cashOnCashYield}%
* CRITICAL DOWNSIDE EBITDA STRESS:            -${data.downsideScenarioReduction}%
* DOWNSIDE DEBT SERVICE COVERAGE RATIO (DSCR): ${data.downsideDscr}x

DISCLAIMER: Prepared via secure Sector-1031 API linkages. Dynamic math simulation model only. Valid for micro-PE credit analysis execution framework.`;
      
      const uri = `data:text/plain;charset=utf-8,${encodeURIComponent(memoText)}`;
      const link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute("download", `${data.dealCodename.replace(/\s+/g, "_")}_CREDIT_MEMO.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative inline-block text-left font-mono">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#050505] border border-[#0ea5e9] hover:border-[#00FF66] text-[#0ea5e9] hover:text-[#00FF66] px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-2"
        style={{ borderRadius: "0px" }}
      >
        <span>[EXPORT UNDERWRITING]</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
      </button>

      {/* Main Action Menu Popover */}
      {isOpen && !isExporting && (
        <div 
          className="absolute right-0 mt-2 w-72 bg-[#0c0c0c] border-2 border-[#0ea5e9] shadow-lg z-50 p-4 space-y-3"
          style={{ borderRadius: "0px" }}
        >
          <div className="border-b border-[#222] pb-2">
            <span className="text-[10px] text-[#888] block tracking-widest uppercase">Select Output Protocol</span>
            <span className="text-xs font-bold text-[#F9F9F9] tracking-tight">{data.dealCodename} Structuring</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => runTerminalSimulation("CSV")}
              className="w-full text-left p-2 hover:bg-[#00FF66]/10 hover:text-[#00FF66] border border-transparent hover:border-[#00FF66] transition-all text-xs flex items-center justify-between"
              style={{ borderRadius: "0px" }}
            >
              <span>1. Dynamic CSV Amortization</span>
              <span className="text-[9px] text-[#00FF66]">[.CSV]</span>
            </button>

            <button
              onClick={() => runTerminalSimulation("MEMO")}
              className="w-full text-left p-2 hover:bg-[#0EA5E9]/10 hover:text-[#0EA5E9] border border-transparent hover:border-[#0EA5E9] transition-all text-xs flex items-center justify-between"
              style={{ borderRadius: "0px" }}
            >
              <span>2. Credit Memo Summary</span>
              <span className="text-[9px] text-[#0EA5E9]">[.TXT]</span>
            </button>

            <button
              onClick={() => runTerminalSimulation("JSON")}
              className="w-full text-left p-2 hover:bg-neutral-800/50 hover:text-white border border-transparent hover:border-neutral-700 transition-all text-xs flex items-center justify-between"
              style={{ borderRadius: "0px" }}
            >
              <span>3. Raw JSON Configuration</span>
              <span className="text-[9px] text-white/50">[.JSON]</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#1a1a1a] flex justify-between items-center text-[8px] text-[#444]">
            <span>SHA-256 SECURED EXPORTS</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:text-red-500 uppercase font-bold text-[9px]"
            >
              [Cancel]
            </button>
          </div>
        </div>
      )}

      {/* Cyberpunk Loading / Compile Terminal Screen overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div 
            className="w-full max-w-lg bg-[#050505] border-2 border-[#00FF66] p-6 space-y-4 shadow-[0_0_20px_rgba(0,255,102,0.15)]"
            style={{ borderRadius: "0px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
                <span className="text-xs font-bold text-[#00FF66] tracking-widest uppercase">UNDERWRITING ENGINE COMPILING DEALS</span>
              </div>
              <span className="text-[10px] text-neutral-600">SECURE CONDUIT</span>
            </div>

            {/* Scroll area simulating command outputs */}
            <div className="bg-[#0a0a0a] border border-[#222] p-4 h-48 overflow-y-auto text-left space-y-2 select-none">
              {exportProgress.map((prog, index) => (
                <div 
                  key={index} 
                  className="text-[11px] text-[#00FF66] font-mono leading-relaxed tracking-wider animate-fadeIn"
                >
                  {prog}
                </div>
              ))}
              {currentStep < 5 && (
                <div className="text-[11px] text-white/40 animate-pulse font-mono tracking-widest">
                  {"$ -> STANDBY SYSTEM PROCESSING..."}
                </div>
              )}
            </div>

            {/* Simulated progress bar tracker */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#888]">
                <span>ENCRYPTING EXPORT PACKAGE</span>
                <span>{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-[#111] h-1.5 border border-[#222]">
                <div 
                  className="bg-[#00FF66] h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-[9px] text-neutral-600 text-center uppercase tracking-widest pt-1">
              Do not close window or terminate sandbox session. Fincen Compliance verified.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}