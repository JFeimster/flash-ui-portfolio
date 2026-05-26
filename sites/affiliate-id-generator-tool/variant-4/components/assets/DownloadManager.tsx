import React, { useState, useEffect } from 'react';
import { Download, FileText, Layout, Image as ImageIcon, Cpu, Terminal, ShieldCheck, Zap } from 'lucide-react';

const DownloadManager = () => {
  const [partnerId, setPartnerId] = useState('MC-BRK-AT24');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>(['[SYSTEM]: READY_FOR_DISTRIBUTION', '[AUTH]: SESSION_ENCRYPTED']);

  const addLog = (msg: string) => {
    setActiveLogs(prev => [`[${new Date().toLocaleTimeString()}]: ${msg}`, ...prev].slice(0, 5));
  };

  const handleGenerate = (assetName: string) => {
    setIsGenerating(true);
    addLog(`COMPILING_ASSET: ${assetName}`);
    addLog(`INJECTING_ID: ${partnerId}`);
    
    setTimeout(() => {
      setIsGenerating(false);
      addLog(`SUCCESS: ${assetName}_V4.PDF_READY`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',_monospace] p-4 md:p-8 relative overflow-hidden">
      {/* CSS Injection to match BASE COMPONENT */}
      <style dangerouslySetInnerHTML={{ __html: `
        .terminal-grid {
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .scanline {
          width: 100%;
          height: 100px;
          z-index: 10;
          background: linear-gradient(0deg, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .bento-card {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #1a1a1a;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 2px; height: 0%;
          background: #10b981;
          transition: height 0.3s ease;
        }
        .bento-card:hover::before { height: 100%; }
        .btn-execute {
          background: #10b981;
          color: #010101;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        .btn-execute:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
        }
        .status-dot {
          height: 6px; width: 6px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input {
          background: #050505 !important;
          border: 1px solid #1a1a1a !important;
          color: #10b981 !important;
        }
      `}} />

      <div className="scanline"></div>
      <div className="terminal-grid absolute inset-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Asset Repository // DIST-77</div>
            <h1 className="text-3xl md:text-4xl font-bold italic tracking-wider">
              DIGITAL <span className="text-white">DISTRIBUTION</span>
            </h1>
            <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
              <span>NODE: MEDIA-01</span>
              <span className="flex items-center gap-2"><span className="status-dot"></span> DISTRIBUTION ACTIVE</span>
              <span>SECURED_UPLOADS: 1.2TB</span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs opacity-40 uppercase">Provisioning Interface</div>
            <div className="text-lg font-bold">V.4.0.2-BETA</div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Configuration Card */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-sm font-bold uppercase">Asset Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase mb-2 opacity-60">Inject Partner Identifier</label>
                  <input 
                    type="text" 
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
                    className="w-full p-3 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="MC-XXXX-XX"
                  />
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold text-white">Dynamic Watermarking</span>
                  </div>
                  <p className="text-[10px] opacity-60 leading-relaxed">
                    All generated assets will be embedded with ID <span className="text-emerald-400">[{partnerId}]</span> and unique referral metadata for attribution tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Console Output */}
            <div className="bento-card p-6 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={14} />
                <span className="text-[10px] uppercase tracking-widest">Process Log</span>
              </div>
              <div className="space-y-2 font-mono text-[9px]">
                {activeLogs.map((log, i) => (
                  <div key={i} className={i === 0 ? "text-white" : "opacity-40"}>{log}</div>
                ))}
              </div>
            </div>
          </section>

          {/* Asset Grid */}
          <section className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset 1 */}
              <div className="bento-card p-6 group hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Layout size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-40 uppercase">Format: PDF</div>
                    <div className="text-[10px] opacity-40 uppercase">Size: 12.4MB</div>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Strategic Pitch Deck</h3>
                <p className="text-xs opacity-60 mb-6 h-12">Complete project overview with financial modeling and deployment roadmaps.</p>
                <button 
                  onClick={() => handleGenerate('PITCH_DECK')}
                  disabled={isGenerating}
                  className="btn-execute w-full py-3 flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  {isGenerating ? "Processing..." : "Generate Branded Deck"}
                </button>
              </div>

              {/* Asset 2 */}
              <div className="bento-card p-6 group hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-40 uppercase">Format: DOCX</div>
                    <div className="text-[10px] opacity-40 uppercase">Size: 1.8MB</div>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Executive Summary</h3>
                <p className="text-xs opacity-60 mb-6 h-12">One-page high-level summary for institutional stakeholders and partners.</p>
                <button 
                  onClick={() => handleGenerate('EXEC_SUMMARY')}
                  disabled={isGenerating}
                  className="btn-execute w-full py-3 flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  {isGenerating ? "Processing..." : "Download Summary"}
                </button>
              </div>

              {/* Asset 3 */}
              <div className="bento-card p-6 group hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <ImageIcon size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-40 uppercase">Format: ZIP</div>
                    <div className="text-[10px] opacity-40 uppercase">Size: 45.0MB</div>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Social Media Kit</h3>
                <p className="text-xs opacity-60 mb-6 h-12">Curated banners and assets pre-sized for LinkedIn, X, and Instagram feeds.</p>
                <button 
                  onClick={() => handleGenerate('MEDIA_KIT')}
                  disabled={isGenerating}
                  className="btn-execute w-full py-3 flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  {isGenerating ? "Processing..." : "Generate Media Kit"}
                </button>
              </div>

              {/* Asset 4 */}
              <div className="bento-card p-6 group hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Zap size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-40 uppercase">Format: SVG</div>
                    <div className="text-[10px] opacity-40 uppercase">Size: 0.5MB</div>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Co-Branded Logo Kit</h3>
                <p className="text-xs opacity-60 mb-6 h-12">Dynamic Moonshine Capital logos injected with your unique referral QR code.</p>
                <button 
                  onClick={() => handleGenerate('LOGO_KIT')}
                  disabled={isGenerating}
                  className="btn-execute w-full py-3 flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  {isGenerating ? "Processing..." : "Export Vector Kit"}
                </button>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 bento-card p-4 flex flex-wrap justify-between items-center bg-[#0a0a0a]">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-[9px] uppercase opacity-40">System Uptime</div>
                        <div className="text-xs font-bold text-white">99.998%</div>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                        <div className="text-[9px] uppercase opacity-40">Total Downloads</div>
                        <div className="text-xs font-bold text-white">12,402</div>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                        <div className="text-[9px] uppercase opacity-40">Encryption</div>
                        <div className="text-xs font-bold text-emerald-400">AES-256</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Cpu size={14} className="opacity-40" />
                    <span className="text-[9px] opacity-40 uppercase tracking-tighter">Powered by Moonshine Core Engine v4</span>
                </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DownloadManager;

```