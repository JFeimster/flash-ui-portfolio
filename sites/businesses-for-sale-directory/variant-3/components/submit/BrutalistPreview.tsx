import React from 'react';

const BrutalistPreview = ({ 
  data = {
    title: "Project Alpha // Industrial Services",
    industry: "Manufacturing",
    location: "Chicago, IL",
    revenue: 4500000,
    sde: 1200000,
    askingPrice: 3800000,
    documents: {
      taxReturns: true,
      pandl: true,
      lease: false
    }
  } 
}) => {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateMultiple = () => {
    if (!data.askingPrice || !data.sde) return "0.0";
    return (data.askingPrice / data.sde).toFixed(2);
  };

  return (
    <div className="bg-[#0F0F0F] border-2 border-[#F5F5F0] p-8 relative overflow-hidden font-sans text-[#F5F5F0]">
      {/* Background Noise/Texture Overlay Simulation */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 border-b-2 border-[#1A1A1A] pb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#8E593E] block mb-2">
            // LIVE_PREVIEW.SH
          </span>
          <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">
            {data.title || "UNTITLED_ASSET"}
          </h2>
        </div>
        <div className="bg-[#C1FF00] text-[#050505] font-mono font-bold text-[10px] px-3 py-1 uppercase">
          Draft State
        </div>
      </div>

      {/* Core Financials Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1A1A1A] border border-[#1A1A1A] mb-8">
        <div className="bg-[#050505] p-5">
          <span className="block font-mono text-[9px] text-[#666] uppercase mb-1">Gross Revenue</span>
          <span className="text-2xl font-mono font-bold text-[#F5F5F0]">
            {formatCurrency(data.revenue)}
          </span>
        </div>
        <div className="bg-[#050505] p-5">
          <span className="block font-mono text-[9px] text-[#666] uppercase mb-1">Annual SDE</span>
          <span className="text-2xl font-mono font-bold text-[#C1FF00]">
            {formatCurrency(data.sde)}
          </span>
        </div>
        <div className="bg-[#050505] p-5 border-l border-[#1A1A1A]">
          <span className="block font-mono text-[9px] text-[#666] uppercase mb-1">Asking Multiple</span>
          <span className="text-2xl font-mono font-bold text-[#8E593E]">
            {calculateMultiple()}x
          </span>
        </div>
      </div>

      {/* Verification Ledger */}
      <div className="mb-8">
        <h4 className="font-mono text-[11px] font-bold uppercase mb-4 text-[#F5F5F0] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF3D00] inline-block"></span> 
          Document Verification Status
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-[#0F0F0F] border border-[#1A1A1A]">
            <span className="font-mono text-[12px] uppercase">3-Year Tax Returns</span>
            {data.documents?.taxReturns ? (
              <span className="text-[#C1FF00] font-mono text-[10px] font-bold">[ VERIFIED ]</span>
            ) : (
              <span className="text-[#FF3D00] font-mono text-[10px] font-bold">[ MISSING ]</span>
            )}
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0F0F0F] border border-[#1A1A1A]">
            <span className="font-mono text-[12px] uppercase">Current YTD P&L Statement</span>
            {data.documents?.pandl ? (
              <span className="text-[#C1FF00] font-mono text-[10px] font-bold">[ UPLOADED ]</span>
            ) : (
              <span className="text-[#FF3D00] font-mono text-[10px] font-bold">[ PENDING ]</span>
            )}
          </div>
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="border-2 border-[#F5F5F0] p-6 bg-[#F5F5F0] text-[#050505]">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="font-black text-2xl uppercase italic">Market Positioning</h3>
          <span className="font-mono text-[10px] font-bold uppercase">{data.location}</span>
        </div>
        <p className="text-sm font-bold leading-tight mb-6">
          ASSET REPRESENTATION: HIGH-BARRIER ENTRY INTO THE {data.industry.toUpperCase()} SECTOR. 
          PROPRIETARY OPERATIONAL FLOWS AND ESTABLISHED CLIENT BASE. INDEPENDENT AUDIT RECOMMENDED.
        </p>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-[#050505] text-[#F5F5F0] font-mono text-[10px] uppercase font-bold">Seller Financed Available</div>
          <div className="px-3 py-1 border border-[#050505] text-[#050505] font-mono text-[10px] uppercase font-bold">Absentee Potential</div>
        </div>
      </div>

      {/* System Footer */}
      <div className="mt-8 pt-6 border-t border-[#1A1A1A] flex justify-between items-center opacity-50">
        <span className="font-mono text-[9px] uppercase tracking-widest">Oxidized Ledger // The Mint Intake Portal</span>
        <span className="font-mono text-[9px] uppercase">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>

      <style jsx>{`
        h1, h2, h3, h4 {
          font-family: 'Inter', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </div>
  );
};

export default BrutalistPreview;