'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Download, 
  ArrowLeft,
  ChevronRight,
  Info,
  Activity,
  Zap,
  Target,
  Skull
} from 'lucide-react';

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVerified, setIsVerified] = useState(false);

  // Simulated deal data (Sync with base component dataset)
  const deal = {
    id: params.id,
    title: "Precision HVAC & Cooling",
    industry: "Local Service",
    location: "Austin, TX",
    price: 1200000,
    revenue: 3500000,
    sde: 450000,
    ebitda: 380000,
    multiple: 2.6,
    yearEstablished: 2012,
    employees: 14,
    realEstate: "Leased",
    sellerFin: "Up to 20% available",
    summary: "A market-leading HVAC service provider with a focus on high-margin commercial maintenance contracts. The business operates with a fleet of 8 branded vehicles and a trained team of NATE-certified technicians.",
    swot: {
      strengths: ["High recurring revenue (60%)", "Prime location", "Modern fleet"],
      weaknesses: ["Owner-heavy sales", "Tight labor market"],
      opportunities: ["Expand to plumbing", "Residential service launch"],
      threats: ["Rising material costs", "New franchise entrant"]
    },
    risks: [
      { level: "Low", label: "Customer Concentration", detail: "Top 5 clients represent < 8% of revenue." },
      { level: "High", label: "Key Man Risk", detail: "Owner manages all municipal bidding processes." },
      { level: "Medium", label: "Seasonality", detail: "Q3 revenue typically 40% higher than Q1." }
    ]
  };

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
          --acid-green: #C1FF00;
          --oxidized-copper: #8E593E;
          --blood-orange: #FF3D00;
          --graphite: #1A1A1A;
          --bone: #F5F5F0;
        }

        .mono { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        
        .noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>

      <div className="noise" />

      {/* Navigation Replicated */}
      <nav className="flex justify-between items-center p-6 border-b-2 border-[#1A1A1A] sticky top-0 bg-[#050505] z-[100]">
        <Link href="/" className="font-black text-2xl tracking-tighter flex items-center gap-2">
          OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
        </Link>
        <div className="hidden md:flex gap-8">
          {['Browse Deals', 'Analyzer', 'Financing', 'Submit'].map(link => (
            <a key={link} href="#" className="text-[0.7rem] font-bold uppercase tracking-widest hover:text-[#C1FF00] transition-colors">{link}</a>
          ))}
        </div>
        <div className="mono text-[0.7rem] text-[#C1FF00]">Verified Portal // User_8821</div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Header Section */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-[0.7rem] font-bold text-[#8E593E] uppercase mb-8 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} /> Back to Market Terminal
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-block bg-[#8E593E] text-white text-[0.6rem] font-black px-2 py-1 mb-4 uppercase tracking-tighter">
                {deal.industry} // ID: {deal.id}
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-6">
                {deal.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <span className="mono text-2xl text-[#C1FF00]">{formatCurrency(deal.price)}</span>
                <span className="text-[#1A1A1A] text-2xl font-black">/</span>
                <span className="mono text-xl text-[#8E593E]">{deal.multiple}x Multiple</span>
                <div className="h-6 w-[2px] bg-[#1A1A1A] mx-2 hidden md:block"></div>
                <div className="flex items-center gap-2 mono text-[0.7rem] text-[#666]">
                  <Activity size={14} /> {deal.location}
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
                <span className="mono text-[0.6rem] text-[#666]">Status</span>
                <span className="mono text-[0.7rem] text-[#C1FF00]">● Active Listing</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
                <span className="mono text-[0.6rem] text-[#666]">Lender Score</span>
                <span className="mono text-[0.7rem] text-[#F5F5F0]">Tier-1 Eligible</span>
              </div>
              <button className="w-full bg-[#F5F5F0] text-[#050505] font-black uppercase py-4 hover:bg-[#C1FF00] transition-colors text-sm">
                Initiate LOI Request
              </button>
            </div>
          </div>
        </div>

        {/* Core Financial Tear-Sheet */}
        <div className="grid lg:grid-cols-4 gap-px bg-[#1A1A1A] border-2 border-[#1A1A1A] mb-12">
          {[
            { label: "Annual Revenue", val: deal.revenue },
            { label: "Annual SDE", val: deal.sde },
            { label: "EBITDA", val: deal.ebitda },
            { label: "Net Margin", val: `${Math.round((deal.sde / deal.revenue) * 100)}%` }
          ].map((m, i) => (
            <div key={i} className="bg-[#050505] p-8">
              <span className="block mono text-[0.6rem] text-[#666] mb-2">{m.label}</span>
              <span className="block mono text-2xl text-[#F5F5F0]">
                {typeof m.val === 'number' ? formatCurrency(m.val) : m.val}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Details & SWOT */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="mono text-sm font-black mb-6 border-b border-[#1A1A1A] pb-2 text-[#8E593E]">Executive Summary</h3>
              <p className="text-xl text-[#AAA] leading-relaxed">
                {deal.summary}
              </p>
            </section>

            <section>
              <h3 className="mono text-sm font-black mb-6 border-b border-[#1A1A1A] pb-2 text-[#8E593E]">Financial Trajectory (36MO)</h3>
              <div className="h-64 bg-[#0F0F0F] border border-[#1A1A1A] relative flex items-end p-4 gap-2">
                {[45, 52, 48, 60, 65, 58, 72, 85, 80, 95, 100, 92].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className="bg-[#1A1A1A] group-hover:bg-[#C1FF00] transition-colors w-full" 
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute -top-8 left-0 hidden group-hover:block mono text-[0.6rem] bg-white text-black p-1">
                      ${h*10}k
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 mono text-[0.5rem] text-[#444]">
                <span>JAN 2021</span>
                <span>DEC 2023</span>
              </div>
            </section>

            <section>
              <h3 className="mono text-sm font-black mb-6 border-b border-[#1A1A1A] pb-2 text-[#8E593E]">SWOT Analysis</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-[#1A1A1A] p-6 bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-4 text-[#C1FF00]">
                    <Zap size={16} /> <span className="mono text-xs font-black">Strengths</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#888]">
                    {deal.swot.strengths.map(s => <li key={s} className="flex gap-2"><span>+</span> {s}</li>)}
                  </ul>
                </div>
                <div className="border border-[#1A1A1A] p-6 bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-4 text-[#8E593E]">
                    <Target size={16} /> <span className="mono text-xs font-black">Weaknesses</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#888]">
                    {deal.swot.weaknesses.map(s => <li key={s} className="flex gap-2"><span>-</span> {s}</li>)}
                  </ul>
                </div>
                <div className="border border-[#1A1A1A] p-6 bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-4 text-blue-500">
                    <TrendingUp size={16} /> <span className="mono text-xs font-black">Opportunities</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#888]">
                    {deal.swot.opportunities.map(s => <li key={s} className="flex gap-2"><span>&gt;</span> {s}</li>)}
                  </ul>
                </div>
                <div className="border border-[#1A1A1A] p-6 bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-4 text-[#FF3D00]">
                    <Skull size={16} /> <span className="mono text-xs font-black">Threats</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#888]">
                    {deal.swot.threats.map(s => <li key={s} className="flex gap-2"><span>!</span> {s}</li>)}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Risks & Data Room */}
          <div className="space-y-8">
            <div className="bg-[#0F0F0F] border-2 border-[#FF3D00] p-6">
              <h3 className="mono text-xs font-black mb-6 flex items-center gap-2 text-[#FF3D00]">
                <AlertTriangle size={16} /> Critical Risk Factors
              </h3>
              <div className="space-y-6">
                {deal.risks.map((risk, i) => (
                  <div key={i} className="border-l-2 border-[#1A1A1A] pl-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="mono text-[0.6rem] font-bold">{risk.label}</span>
                      <span className={`text-[0.5rem] px-2 py-0.5 mono font-black ${
                        risk.level === 'High' ? 'bg-[#FF3D00] text-white' : 
                        risk.level === 'Medium' ? 'bg-[#8E593E] text-white' : 'bg-[#1A1A1A] text-[#666]'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-[#666] leading-tight">{risk.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-8 relative overflow-hidden group">
              {!isVerified && (
                <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                  <Lock className="text-[#8E593E] mb-4" size={32} />
                  <h4 className="mono text-sm font-black mb-2">Secure Data Room</h4>
                  <p className="text-[0.65rem] text-[#666] mb-6 uppercase tracking-widest">Signed NDA Required for Prospectus</p>
                  <button 
                    onClick={() => setIsVerified(true)}
                    className="bg-transparent border border-[#F5F5F0] text-[#F5F5F0] px-6 py-2 mono text-[0.7rem] hover:bg-[#F5F5F0] hover:text-black transition-all"
                  >
                    Unlock Terminal
                  </button>
                </div>
              )}
              
              <div className={isVerified ? 'opacity-100' : 'opacity-20 blur-sm'}>
                <h3 className="mono text-xs font-black mb-6 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#C1FF00]" /> Confidential Assets
                </h3>
                <div className="space-y-3">
                  {[
                    '2023_Tax_Returns.pdf',
                    'Employee_Roster_v2.xlsx',
                    'Equipment_Inventory_2024.pdf',
                    'Lease_Agreement_Final.pdf'
                  ].map(file => (
                    <div key={file} className="flex justify-between items-center p-3 bg-[#050505] border border-[#1A1A1A] hover:border-[#C1FF00] cursor-pointer group/file">
                      <span className="mono text-[0.6rem] text-[#AAA] group-hover/file:text-[#F5F5F0]">{file}</span>
                      <Download size={12} className="text-[#666]" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-[#1A1A1A]">
                  <div className="flex items-center gap-4 text-[#444] mb-4">
                    <Info size={14} />
                    <span className="mono text-[0.5rem]">Access expires in 47h 12m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[#1A1A1A] mono text-[0.6rem]">
              <span className="text-[#666] block mb-4">// SELLER TERMS</span>
              <div className="space-y-2 text-[#AAA]">
                <div className="flex justify-between">
                  <span>Seller Financing:</span>
                  <span className="text-[#C1FF00]">{deal.sellerFin}</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Period:</span>
                  <span>90 Days Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Non-Compete:</span>
                  <span>50 Mile / 5 Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#1A1A1A] mt-24 py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="font-black text-xl mb-4 uppercase">Oxidized Ledger</div>
            <p className="mono text-[0.6rem] text-[#444] max-w-xs uppercase leading-loose">
              Deals are provided as-is. Independent verification is required for all financial metrics.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="mono text-[0.7rem] text-[#8E593E] mb-4">Support</div>
              <div className="flex flex-col gap-2 mono text-[0.6rem]">
                <a href="#">Help Center</a>
                <a href="#">Contact Broker</a>
              </div>
            </div>
            <div>
              <div className="mono text-[0.7rem] text-[#8E593E] mb-4">Legal</div>
              <div className="flex flex-col gap-2 mono text-[0.6rem]">
                <a href="#">Terms of Use</a>
                <a href="#">Privacy Engine</a>
              </div>
            </div>
          </div>
          <div className="mono text-[0.6rem] text-[#222]">
            &copy; 2024 OXIDIZED LEDGER INC. // SYSTEM_STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
'