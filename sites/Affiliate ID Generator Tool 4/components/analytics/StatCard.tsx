import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  dataPoints: number[];
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  trend, 
  trendLabel, 
  dataPoints, 
  color = "#10b981" 
}) => {
  // Generate SVG path for the sparkline
  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min;
  const width = 200;
  const height = 40;
  
  const points = dataPoints.map((p, i) => {
    const x = (i / (dataPoints.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bento-card group p-5 flex flex-col h-full bg-[#0a0a0a]/80 border border-[#1a1a1a] relative overflow-hidden transition-all duration-300 hover:border-[#10b981]/30">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-[#10b981]"></div>
        <div className="absolute top-0 right-0 w-full h-[1px] bg-[#10b981]"></div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/60 font-medium mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono uppercase italic leading-none">
            {value}
          </div>
        </div>
        <div className={`text-[10px] px-2 py-1 border rounded ${trend >= 0 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      </div>

      <div className="flex-grow flex items-end mt-4">
        <div className="w-full relative h-12">
          {/* Sparkline Shadow */}
          <svg className="w-full h-full overflow-visible opacity-20 blur-sm" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              points={points}
            />
          </svg>
          {/* Sparkline Path */}
          <svg className="w-full h-full overflow-visible absolute top-0 left-0" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* End Point Glow */}
            <circle 
              cx={width} 
              cy={height - ((dataPoints[dataPoints.length - 1] - min) / range) * height} 
              r="2" 
              fill={color} 
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-[9px] uppercase opacity-40 tracking-widest">{trendLabel}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1 h-1 bg-emerald-500/20 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Hover Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default StatCard;