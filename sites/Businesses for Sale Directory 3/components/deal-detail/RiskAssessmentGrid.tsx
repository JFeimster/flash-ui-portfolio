import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, Target, Lock, FileText, ChevronRight } from 'lucide-react';

const RiskAssessmentGrid = () => {
  const riskFactors = [
    {
      id: 'R1',
      title: 'Customer Concentration',
      level: 'High',
      score: 78,
      status: 'Critical',
      description: 'Top 3 clients account for 62% of annual recurring revenue. Loss of single anchor client significantly impacts debt service coverage.',
      trend: 'increasing'
    },
    {
      id: 'R2',
      title: 'Technical Debt',
      level: 'Medium',
      score: 45,
      status: 'Stable',
      description: 'Legacy codebase requires modernization. Migration to cloud-native infrastructure estimated at $120k CAPEX within 18 months.',
      trend: 'flat'
    },
    {
      id: 'R3',
      title: 'Key-Man Dependency',
      level: 'High',
      score: 82,
      status: 'Urgent',
      description: 'Founding CEO holds 100% of technical architecture knowledge and key strategic relationships. 12-month transition period required.',
      trend: 'decreasing'
    }
  ];

  return (
    <div className="bg-[#050505] text-[#F5F5F0] font-sans border-2 border-[#1A1A1A] p-6 mb-12">
      {/* Terminal Header */}
      <div className="flex justify-between items-end border-b-2 border-[#1A1A1A] pb-4 mb-8">
        <div>
          <span className="font-mono text-[0.65rem] text-[#8E593E] uppercase tracking-widest block mb-1">
            / / intelligence_module.v2
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">
            Risk <span className="text-[#FF3D00]">Intelligence</span> Terminal
          </h2>
        </div>
        <div className="text-right font-mono">
          <div className="text-[#C1FF00] text-xs">SECURITY LEVEL: OMEGA</div>
          <div className="text-[#666] text-[0.6rem]">SCAN_TIME: {new Date().toISOString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Risk Score & SWOT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SWOT Grid */}
          <div className="grid grid-cols-2 gap-[2px] bg-[#1A1A1A] border-2 border-[#1A1A1A]">
            <div className="bg-[#0F0F0F] p-5 border-b border-r border-[#1A1A1A]">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="text-[#C1FF00] w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C1FF00]">Strengths</span>
              </div>
              <ul className="text-xs space-y-2 text-[#aaa]">
                <li>• Proprietary IP with 2 active patents</li>
                <li>• 94% Net Revenue Retention (NRR)</li>
                <li>• High-margin (82% Gross) automated delivery</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-5 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-[#FF3D00] w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3D00]">Weaknesses</span>
              </div>
              <ul className="text-xs space-y-2 text-[#aaa]">
                <li>• No dedicated internal sales force</li>
                <li>• Underspent on R&D relative to sector</li>
                <li>• Heavy reliance on third-party API (Azure)</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-5 border-r border-[#1A1A1A]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-[#8E593E] w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8E593E]">Opportunities</span>
              </div>
              <ul className="text-xs space-y-2 text-[#aaa]">
                <li>• Untapped European market expansion</li>
                <li>• Potential for $2M annual upselling</li>
                <li>• Roll-up strategy for smaller competitors</li>
              </ul>
            </div>
            <div className="bg-[#0F0F0F] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="text-[#FF3D00] w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3D00]">Threats</span>
              </div>
              <ul className="text-xs space-y-2 text-[#aaa]">
                <li>• Pending regulatory shifts in data privacy</li>
                <li>• New well-funded VC entrant (Series B)</li>
                <li>• Labor cost inflation in core engineering hub</li>
              </ul>
            </div>
          </div>

          {/* Deep Dive Factors */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-black uppercase tracking-widest text-[#666]">Detailed Risk Analysis</h3>
            {riskFactors.map((risk) => (
              <div key={risk.id} className="group border border-[#1A1A1A] hover:border-[#F5F5F0] transition-colors p-5 bg-[#0F0F0F]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-8 ${risk.level === 'High' ? 'bg-[#FF3D00]' : 'bg-[#C1FF00]'}`}></span>
                    <div>
                      <span className="font-mono text-[0.6rem] text-[#666] block">{risk.id} // LEVEL: {risk.level}</span>
                      <h4 className="text-lg font-bold uppercase tracking-tight">{risk.title}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-black text-[#F5F5F0]">{risk.score}</span>
                    <span className="font-mono text-[0.6rem] text-[#666] block">RISK_INDEX</span>
                  </div>
                </div>
                <p className="text-sm text-[#888] leading-relaxed mb-4 max-w-2xl">{risk.description}</p>
                <div className="flex gap-4 border-t border-[#1A1A1A] pt-4">
                  <span className="font-mono text-[0.65rem] px-2 py-1 bg-[#1A1A1A] text-[#F5F5F0]">{risk.status}</span>
                  <span className="font-mono text-[0.65rem] px-2 py-1 text-[#666]">TREND: {risk.trend.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Data Room & Actions */}
        <div className="space-y-6">
          <div className="bg-[#FF3D00] p-6 text-black">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={18} strokeWidth={3} />
              <span className="font-mono font-black text-sm uppercase italic tracking-widest">Secure Access</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">Confidential Data Room</h3>
            <p className="text-xs font-bold leading-tight mb-6 opacity-80">
              Access to full financials, employee censuses, and legal disclosures requires a verified Proof of Funds (POF) and an executed NDA.
            </p>
            <button className="w-full bg-black text-white font-mono text-xs font-black py-4 uppercase flex items-center justify-between px-4 hover:bg-[#F5F5F0] hover:text-black transition-colors">
              Request Full Prospectus
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="border-2 border-[#1A1A1A] p-6 bg-[#0F0F0F]">
            <h4 className="font-mono text-[0.65rem] text-[#666] uppercase mb-4 tracking-[0.2em]">Available Documents</h4>
            <div className="space-y-3">
              {[
                { name: 'FY23_Tax_Returns.pdf', size: '4.2MB', status: 'Locked' },
                { name: 'Quality_of_Earnings_Q3.pdf', size: '12.8MB', status: 'Locked' },
                { name: 'Customer_Churn_Analysis.xlsx', size: '1.1MB', status: 'Locked' },
                { name: 'Operating_Agreement.pdf', size: '0.8MB', status: 'Locked' }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#1A1A1A] group cursor-pointer hover:bg-[#1A1A1A]">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-[#8E593E]" />
                    <div>
                      <span className="text-[0.7rem] font-bold block group-hover:text-[#C1FF00]">{doc.name}</span>
                      <span className="text-[0.6rem] text-[#444] font-mono">{doc.size}</span>
                    </div>
                  </div>
                  <Lock size={12} className="text-[#444]" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#C1FF00] p-4 flex flex-col items-center justify-center text-black text-center italic">
            <span className="font-mono text-[0.6rem] font-black uppercase tracking-[0.3em] mb-1">Financial Integrity Score</span>
            <span className="text-5xl font-black tracking-tighter">A+</span>
            <span className="font-mono text-[0.5rem] mt-2 text-black/60 uppercase">Verified via 3rd Party Audit</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .bg-[#050505] {
          position: relative;
          overflow: hidden;
        }
        .bg-[#050505]::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: rgba(193, 255, 0, 0.05);
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RiskAssessmentGrid;