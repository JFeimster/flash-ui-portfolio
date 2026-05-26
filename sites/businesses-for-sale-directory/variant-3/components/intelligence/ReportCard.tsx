import React from 'react';

interface DataPoint {
  label: string;
  value: string;
}

interface ReportCardProps {
  category?: string;
  title?: string;
  summary?: string;
  readTime?: string;
  dataPoints?: DataPoint[];
  date?: string;
  id?: string;
  isConfidential?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  category = "Market Analysis",
  title = "The 2024 HVAC Consolidation Report",
  summary = "A deep dive into private equity roll-up strategies within regional residential services and the impact of interest rate shifts on SDE multiples.",
  readTime = "12 min",
  dataPoints = [
    { label: "Avg Multiple", value: "3.2x - 4.1x" },
    { label: "Sector Growth", value: "+14.2%" },
    { label: "Deal Volume", value: "High" },
    { label: "Financing", value: "SBA Preferred" }
  ],
  date = "Q3-2024",
  id = "INTEL-0992",
  isConfidential = true,
}) => {
  return (
    <div className="group relative bg-[#0F0F0F] border-2 border-[#1A1A1A] hover:border-[#F5F5F0] transition-all duration-500 flex flex-col p-8 h-full overflow-hidden">
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Header Metadata */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="space-y-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E593E] font-bold">
            // Intelligence Archive
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#666]">
            Ref: {id} — {date}
          </span>
        </div>
        
        {isConfidential && (
          <div className="border border-[#FF3D00] px-3 py-1 -rotate-2 bg-[#FF3D00]/5">
            <span className="text-[#FF3D00] font-mono text-[10px] font-black uppercase tracking-tighter">
              Classified
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mb-10 relative z-10">
        <span className="inline-block text-[#C1FF00] font-mono text-[10px] uppercase mb-4 border-b border-[#C1FF00] pb-1">
          {category}
        </span>
        <h3 className="text-3xl font-light text-[#F5F5F0] leading-[1.1] mb-6 group-hover:text-[#C1FF00] transition-colors duration-300" style={{ fontFamily: 'serif' }}>
          {title}
        </h3>
        <p className="text-[#888] text-sm leading-relaxed font-sans max-w-sm">
          {summary}
        </p>
      </div>

      {/* Brutalist Data Grid */}
      <div className="grid grid-cols-2 gap-px bg-[#1A1A1A] border border-[#1A1A1A] mt-auto relative z-10">
        {dataPoints.map((point, idx) => (
          <div key={idx} className="bg-[#0F0F0F] p-4 group-hover:bg-[#151515] transition-colors">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#555] mb-2 font-bold">
              {point.label}
            </span>
            <span className="block font-mono text-sm text-[#F5F5F0] group-hover:text-[#C1FF00]">
              {point.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="flex items-center justify-between pt-8 mt-4 border-t border-[#1A1A1A] relative z-10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-[#666] uppercase">
            {readTime} Read
          </span>
          <div className="w-1 h-1 rounded-full bg-[#333]"></div>
          <span className="font-mono text-[10px] text-[#666] uppercase">
            PDF Available
          </span>
        </div>
        
        <button className="flex items-center gap-2 text-[#F5F5F0] group/btn">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest group-hover/btn:mr-2 transition-all">
            Open Dossier
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="arcs">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>

      {/* Hover Corner Detail */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-r-[40px] border-r-transparent group-hover:border-r-[#C1FF00] transition-all duration-500 opacity-20"></div>
    </div>
  );
};

export default ReportCard;