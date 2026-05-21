import React, { useState } from 'react';

/**
 * ExportReportButton Component
 * Part of the Moonshine Capital Earnings & Commission Ledger.
 * Provides functionality to export referral payout data to CSV format.
 */

interface CommissionRecord {
  dealName: string;
  sourceName: string;
  fundingAmount: number;
  commissionRate: number;
  payout: number;
  status: 'Pending' | 'Cleared' | 'Processing';
  dateClosed: string;
}

interface ExportReportButtonProps {
  ledgerData?: CommissionRecord[];
}

const ExportReportButton: React.FC<ExportReportButtonProps> = ({ ledgerData = [] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = () => {
    setIsExporting(true);

    // Simulate preparation delay
    setTimeout(() => {
      const headers = ["Deal Name", "Referral Source", "Funding Amount", "Comm %", "Payout", "Status", "Close Date"];
      
      const rows = ledgerData.length > 0 ? ledgerData : [
        { dealName: "Example Growth Fund", sourceName: "Marcus Thorne", fundingAmount: 250000, commissionRate: 2, payout: 5000, status: "Cleared", dateClosed: "2023-12-15" }
      ];

      const csvContent = [
        headers.join(","),
        ...rows.map(r => [
          `"${r.dealName}"`,
          `"${r.sourceName}"`,
          r.fundingAmount,
          `${r.commissionRate}%`,
          r.payout,
          r.status,
          r.dateClosed
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Moonshine_Commissions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={generateCSV}
        disabled={isExporting}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-sm
          transition-all duration-300 shadow-xl border border-transparent
          ${isExporting 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-80' 
            : 'bg-[#d4af37] text-[#020617] hover:bg-[#b8962e] hover:scale-[1.03] active:scale-95'
          }
        `}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Report...
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Ledger Summary
          </>
        )}
      </button>
      <div className="mt-2 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#10b981]"></span>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
          Live Commission Data Sync Active
        </p>
      </div>
    </div>
  );
};

export default ExportReportButton;