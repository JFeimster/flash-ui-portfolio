import React, { useState, useEffect } from 'react';

const AssetPreview = () => {
  const [partnerId, setPartnerId] = useState('MC-BRK-AT24');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const assets = [
    {
      id: 'deck-01',
      title: 'Executive Pitch Deck',
      type: 'PDF / 16:9',
      size: '12.4 MB',
      category: 'Presentation'
    },
    {
      id: 'banner-01',
      title: 'Global Affiliate Banner',
      type: 'PNG / 1200x628',
      size: '2.1 MB',
      category: 'Social Media'
    },
    {
      id: 'wp-01',
      title: 'Institutional Whitepaper',
      type: 'PDF / A4',
      size: '4.8 MB',
      category: 'Technical'
    },
    {
      id: 'sig-01',
      title: 'Branded Email Signature',
      type: 'HTML / Snippet',
      size: '15 KB',
      category: 'Identity'
    }
  ];

  const handleGenerate = (id: string) => {
    setIsGenerating(id);
    setTimeout(() => {
      setIsGenerating(null);
      alert(`ASSET ${id} GENERATED WITH ID: ${partnerId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#10b981] font-['JetBrains_Mono',monospace] p-4 md:p-8 relative overflow-hidden">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute w-full h-[100px] bg-gradient-to-b from-transparent via-[#10b981] to-transparent animate-[scanline_8s_linear_infinite] -bottom-full"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .bento-card {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #1a1a1a;
          position: relative;
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
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        .terminal-grid {
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-10 border-b border-[#1a1a1a] pb-6 flex flex-col md:flex-row justify-between items-end">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-1">Asset Distribution Hub // Repository 0-1</div>
            <h1 className="text-3xl font-bold italic tracking-tighter">
              DIGITAL <span className="text-white">ASSETS</span>
            </h1>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-72">
            <label className="block text-[10px] uppercase mb-2 opacity-60">Target Partner ID</label>
            <input 
              type="text" 
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
              className="w-full bg-[#050505] border border-[#1a1a1a] p-2 text-sm text-[#10b981] focus:border-[#10b981] outline-none transition-all"
              placeholder="ENTER ID..."
            />
          </div>
        </header>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bento-card p-5 flex flex-col h-full group">
              <div className="aspect-video bg-[#050505] border border-[#1a1a1a] mb-4 relative overflow-hidden flex items-center justify-center group-hover:border-[#10b98155] transition-colors">
                {/* Mock Preview Content */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#10b981,#10b981_1px,transparent_1px,transparent_10px)]"></div>
                <div className="z-10 text-center">
                  <div className="text-[10px] opacity-40 mb-1">PREVIEW_STUB</div>
                  <div className="text-[8px] border border-[#10b981] px-2 py-1">
                    ID_LINK: moonshinecapital.com/ref/{partnerId}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] text-white opacity-40 uppercase mb-1">{asset.category}</div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-1 text-white group-hover:text-[#10b981] transition-colors">
                  {asset.title}
                </h3>
                <div className="flex justify-between items-center text-[10px] opacity-60">
                  <span>{asset.type}</span>
                  <span>{asset.size}</span>
                </div>
              </div>

              <button 
                onClick={() => handleGenerate(asset.id)}
                disabled={isGenerating !== null}
                className={`mt-auto w-full py-3 text-[11px] font-bold uppercase tracking-widest transition-all btn-execute flex items-center justify-center gap-2 ${isGenerating === asset.id ? 'animate-pulse opacity-80' : ''}`}
              >
                {isGenerating === asset.id ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Generate & Download
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Status Footer */}
        <footer className="mt-12 border-t border-[#1a1a1a] pt-6 flex justify-between items-center opacity-40 text-[10px]">
          <div className="flex items-center gap-4">
            <span>REPOSITORY_STATUS: ONLINE</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
          <div>INTERNAL USE ONLY - MOONSHINE CAPITAL v4.0.2</div>
        </footer>
      </div>
    </div>
  );
};

export default AssetPreview;