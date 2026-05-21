import React, { useState } from 'react';

const VideoPlayer: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(0);

  const playlist = [
    {
      id: "vid-1",
      title: "Understanding Merchant Cash Advances",
      duration: "12:45",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400",
      description: "A comprehensive breakdown of MCA products vs. traditional term loans. Learn how to explain factor rates and daily holdbacks to professional CPAs without losing credibility.",
      tags: ["Fundamentals", "Products"]
    },
    {
      id: "vid-2",
      title: "The Professional Broker Referral Pitch",
      duration: "08:12",
      thumbnail: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=400",
      description: "Master the high-level elevator pitch specifically designed for Business Brokers and M&A Advisors. Focus on speed-to-close and certainty of funding.",
      tags: ["Pitching", "Brokers"]
    },
    {
      id: "vid-3",
      title: "Closing High-Value Equipment Deals",
      duration: "15:30",
      thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400",
      description: "Deep dive into equipment financing. Learn the documentation requirements and how to partner with dealers to provide instant capital at the point of sale.",
      tags: ["Equipment", "Sales"]
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-[#0f172a] p-6 rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-['Inter',sans-serif]">
      {/* Primary Video Display Area */}
      <div className="flex-1">
        <div className="relative aspect-video bg-[#020617] rounded-xl overflow-hidden border border-white/5 shadow-2xl group cursor-pointer">
          <img 
            src={playlist[activeVideo].thumbnail} 
            alt="Video Preview" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Overlay Play Interface */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#020617] via-transparent to-transparent">
            <button className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-[#020617] ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span className="mt-4 text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Click to Start Module</span>
          </div>

          {/* Custom Controls Bar (Mockup) */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#d4af37] w-1/3 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/50 font-black tracking-widest uppercase">
              <div className="flex gap-4">
                <span>04:15 / {playlist[activeVideo].duration}</span>
                <span className="text-[#d4af37]">Live Training</span>
              </div>
              <div className="flex gap-3">
                <span>CC</span>
                <span>1080p HD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            {playlist[activeVideo].tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold uppercase rounded border border-[#d4af37]/20">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            {playlist[activeVideo].title}
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl mb-8">
            {playlist[activeVideo].description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-[#d4af37] text-[#020617] px-6 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Pitch Deck
            </button>
            <button className="flex items-center gap-2 bg-white/5 text-white border border-white/10 px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              View Sales Script
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="w-full lg:w-[380px] bg-[#020617] rounded-xl border border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Partner Training</h3>
            <span className="text-[#d4af37] text-[10px] font-black">74% COMPLETE</span>
          </div>
          <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
            <div className="h-full bg-[#10b981] w-[74%]"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
          {playlist.map((video, index) => (
            <button 
              key={video.id}
              onClick={() => setActiveVideo(index)}
              className={`w-full p-5 flex gap-4 transition-all border-b border-white/5 text-left items-center group ${activeVideo === index ? 'bg-[#d4af37]/5 border-l-4 border-l-[#d4af37]' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
            >
              <div className="relative shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt="" 
                  className={`w-20 h-14 rounded object-cover shadow-lg ${activeVideo === index ? 'ring-2 ring-[#d4af37]' : 'opacity-60 grayscale group-hover:grayscale-0'}`}
                />
                {activeVideo === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#d4af37]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate mb-1 ${activeVideo === index ? 'text-[#d4af37]' : 'text-slate-300'}`}>
                  {video.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{video.duration}</span>
                  {index < 2 && (
                    <span className="text-[#10b981] text-[8px] font-black uppercase bg-[#10b981]/10 px-1 rounded">Completed</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10 mt-auto">
          <div className="bg-[#1e293b] rounded-lg p-4 border border-white/5">
            <p className="text-[10px] text-[#d4af37] font-black uppercase mb-1 tracking-widest">Next Step</p>
            <h5 className="text-white font-bold text-sm mb-3">Partner Certification Quiz</h5>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-xs transition-all uppercase tracking-widest">
              Unlock Exam
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default VideoPlayer;