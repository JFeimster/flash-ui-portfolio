import React from 'react';

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505] relative overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b-2 border-[#1A1A1A] sticky top-0 bg-[#050505] z-[100]">
        <a href="/" className="font-[900] text-2xl tracking-tighter uppercase flex items-center gap-2">
          OXIDIZED<span className="text-[#8E593E]">LEDGER</span>
        </a>
        <div className="hidden md:flex gap-8 items-center">
          <span className="font-mono text-[0.7rem] text-[#C1FF00] border border-[#C1FF00] px-2 py-1 uppercase tracking-widest">
            Intake Terminal v1.0.4
          </span>
          <a href="/" className="text-[0.7rem] font-bold uppercase tracking-widest hover:text-[#C1FF00] transition-colors">
            Exit to Directory
          </a>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
        {/* Progress Sidebar */}
        <aside className="border-r-2 border-[#1A1A1A] p-8 hidden lg:block h-[calc(100vh-80px)] sticky top-20">
          <div className="mb-12">
            <span className="text-[#8E593E] font-mono text-[0.65rem] block mb-4 uppercase font-black tracking-tighter">
              // Submission Pipeline
            </span>
            <div className="flex flex-col gap-8">
              <div className="group">
                <span className="block font-mono text-[0.6rem] text-[#444] group-hover:text-[#F5F5F0]">01</span>
                <span className="block font-black text-sm uppercase tracking-tighter text-[#F5F5F0]">Core Identity</span>
                <div className="w-full h-[2px] bg-[#C1FF00] mt-2"></div>
              </div>
              <div className="group opacity-40">
                <span className="block font-mono text-[0.6rem] text-[#444]">02</span>
                <span className="block font-black text-sm uppercase tracking-tighter">Financial Proofs</span>
                <div className="w-full h-[2px] bg-[#1A1A1A] mt-2"></div>
              </div>
              <div className="group opacity-40">
                <span className="block font-mono text-[0.6rem] text-[#444]">03</span>
                <span className="block font-black text-sm uppercase tracking-tighter">Ops & Metrics</span>
                <div className="w-full h-[2px] bg-[#1A1A1A] mt-2"></div>
              </div>
              <div className="group opacity-40">
                <span className="block font-mono text-[0.6rem] text-[#444]">04</span>
                <span className="block font-black text-sm uppercase tracking-tighter">Verification</span>
                <div className="w-full h-[2px] bg-[#1A1A1A] mt-2"></div>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t-2 border-[#1A1A1A] pt-8">
            <div className="bg-[#0F0F0F] p-4 border border-[#1A1A1A]">
              <span className="block text-[0.6rem] font-mono text-[#666] mb-2 uppercase">Status:</span>
              <span className="block text-[0.7rem] font-bold text-[#FF3D00] uppercase animate-pulse">Drafting Intake</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="p-8 lg:p-16 min-h-screen">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <footer className="p-8 border-t-2 border-[#1A1A1A] bg-[#050505]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-md">
            <span className="font-mono text-[0.6rem] text-[#444] block mb-2 uppercase tracking-widest">Legal Notice</span>
            <p className="text-[0.65rem] text-[#444] leading-relaxed uppercase">
              By submitting data to The Mint, you affirm that all financial representations are accurate and derived from verified tax documents. Fraudulent submissions result in permanent platform blacklisting.
            </p>
          </div>
          <div className="text-right font-mono text-[0.65rem] text-[#444]">
            &copy; 2024 Oxidized Ledger / Submission Gateway
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        input, select, textarea {
          background: #1A1A1A !important;
          border: 2px solid #1A1A1A !important;
          color: #F5F5F0 !important;
          padding: 1rem !important;
          font-family: 'JetBrains Mono', monospace !important;
          text-transform: uppercase !important;
          width: 100% !important;
          outline: none !important;
          transition: border-color 0.2s ease !important;
        }

        input:focus {
          border-color: #C1FF00 !important;
        }

        label {
          display: block;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          color: #8E593E;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}