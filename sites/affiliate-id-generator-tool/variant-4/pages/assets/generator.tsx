import React, { useState, useEffect } from 'react';

const AssetGenerator = () => {
  const [partnerId, setPartnerId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<any[]>([]);

  const assets = [
    { id: 'deck-01', title: 'Investor Pitch Deck', type: 'PDF', size: '12.4 MB', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'ban-02', title: 'Affiliate Banner Pack', type: 'ZIP/SVG', size: '4.8 MB', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'doc-03', title: 'One-Pager Summary', type: 'PDF', size: '1.2 MB', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
  ];

  const handleGenerate = (assetId: string) => {
    if (!partnerId) return alert('ERROR: PARTNER ID REQUIRED FOR INJECTION');
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const asset = assets.find(a => a.id === assetId);
      setGeneratedAssets(prev => [{
        ...asset,
        timestamp: new Date().toLocaleTimeString(),
        status: 'READY',
        url: `https://moonshinecapital.com/assets/${assetId}/${partnerId}`
      }, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" 
           style={{ background: 'linear-gradient(0deg, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 1) 50%, rgba(16, 185, 129, 0) 100%)', backgroundSize: '100% 4px' }}>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .terminal-grid {
            background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
            background-size: 30px 30px;
        }
        .btn-execute {
            clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        .bento-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 0%;
            background: #10b981;
            transition: height 0.3s ease;
        }
        .bento-card:hover::before {
            height: 100%;
        }
      `}} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1a] pb-6">
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Asset Distribution Hub // 77-401</div>
            <h1 className="text-3xl md:text-4xl font-bold italic tracking-tighter" style={{ textShadow: '2px 0 #000, -2px 0 #10b98122' }}>
              DISTRIBUTION <span className="text-white">CENTER</span>
            </h1>
            <div className="text-[10px] mt-2 text-emerald-500/60 font-light flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                REPOSITORY ACTIVE
              </span>
              <span>NODE: DIST-04</span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs opacity-40 uppercase">Branded Asset Generator</div>
            <div className="text-lg font-bold">V.2.1.0-STABLE</div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Configuration */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0a]/80 border border-[#1a1a1a] p-6 bento-card relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-emerald-500"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Parameter Injection</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase mb-2 opacity-60">Target Partner ID</label>
                  <input 
                    type="text" 
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
                    placeholder="MC-XXXX-XXXX" 
                    className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-sm text-[#10b981] focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded text-[10px] leading-relaxed opacity-70 italic">
                  ID injection will automatically replace all placeholder tokens in PDF, PPTX, and HTML assets with the specified partner's referral link.
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a]/80 border border-[#1a1a1a] p-6 bento-card relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-white"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">System Status</h2>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-[#1a1a1a] pb-1">
                  <span className="opacity-50">LATENCY</span>
                  <span>14MS</span>
                </div>
                <div className="flex justify-between border-b border-[#1a1a1a] pb-1">
                  <span className="opacity-50">ENCRYPTION</span>
                  <span>AES-256</span>
                </div>
                <div className="flex justify-between border-b border-[#1a1a1a] pb-1">
                  <span className="opacity-50">PDF ENGINE</span>
                  <span className="text-white">v4.2-GOLD</span>
                </div>
              </div>
            </div>
          </section>

          {/* Center: Asset Grid */}
          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-[#0a0a0a]/80 border border-[#1a1a1a] p-5 bento-card flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={asset.icon}></path>
                        </svg>
                      </div>
                      <span className="text-[10px] bg-white/5 px-2 py-1 border border-white/10 uppercase">{asset.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{asset.title}</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest mb-6">Payload Size: {asset.size}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleGenerate(asset.id)}
                    disabled={isGenerating}
                    className="btn-execute w-full py-3 bg-[#10b981] text-[#010101] font-bold text-xs uppercase tracking-tighter hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? 'Processing...' : 'Generate Branded Asset'}
                  </button>
                </div>
              ))}
            </div>

            {/* Generated Log */}
            <div className="bg-[#0a0a0a]/80 border border-[#1a1a1a] p-6 bento-card">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-emerald-500"></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider">Deployment Queue</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] opacity-40 uppercase tracking-widest">
                      <th className="pb-3 font-normal">Asset Name</th>
                      <th className="pb-3 font-normal">Target ID</th>
                      <th className="pb-3 font-normal">Timestamp</th>
                      <th className="pb-3 font-normal text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {generatedAssets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center opacity-30 italic">NO ASSETS IN CURRENT SESSION QUEUE</td>
                      </tr>
                    ) : (
                      generatedAssets.map((ga, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="py-4 text-white font-bold">{ga.title}</td>
                          <td className="py-4 text-[#10b981]">{partnerId}</td>
                          <td className="py-4 opacity-50">{ga.timestamp}</td>
                          <td className="py-4 text-right">
                            <button className="text-[10px] px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors uppercase font-bold">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 border-t border-[#1a1a1a] pt-6 flex justify-between items-center opacity-30 text-[10px]">
          <div>MOONSHINE CAPITAL // ASSET DISTRIBUTION ENCRYPTED CHANNEL</div>
          <div>EST. 2024 - ALL RIGHTS RESERVED</div>
        </footer>
      </div>
    </div>
  );
};

export default AssetGenerator;