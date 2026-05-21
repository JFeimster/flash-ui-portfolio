import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const NicheHeatMap = () => {
  const categories = [
    { name: 'CPA/Accountants', value: 88, count: 12, color: 'bg-[#d4af37]' },
    { name: 'Business Brokers', value: 72, count: 8, color: 'bg-[#d4af37]/80' },
    { name: 'Bank Managers', value: 45, count: 5, color: 'bg-[#d4af37]/60' },
    { name: 'RE Agents', value: 28, count: 15, color: 'bg-slate-200' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-900">Niche Productivity Heat Map</h3>
          <p className="text-xs text-slate-500">Relative conversion strength by professional category</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-tighter">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d4af37]"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Low</span>
        </div>
      </div>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">{cat.name} ({cat.count} partners)</span>
              <span className="text-slate-900 font-bold">{cat.value}% Yield</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`${cat.color} h-2 rounded-full transition-all duration-1000`} 
                style={{ width: `${cat.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReferralAnalyticsDashboard: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Deal Volume" 
          value="$4.2M" 
          trend={{ value: '12.5%', isPositive: true }}
          subtitle="From referral sources YTD"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <MetricCard 
          title="Avg. Conversion" 
          value="24.8%" 
          trend={{ value: '3.2%', isPositive: true }}
          subtitle="Lead to funded ratio"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1. 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
        />
        <MetricCard 
          title="Active Partners" 
          value="42" 
          trend={{ value: '4', isPositive: true }}
          subtitle="+4 new this month"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        />
        <MetricCard 
          title="Follow-up Health" 
          value="92%" 
          trend={{ value: '2.1%', isPositive: false }}
          subtitle="On-time touchpoints"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NicheHeatMap />
        
        <div className="bg-[#020617] rounded-xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Top Performer</h3>
            <p className="text-slate-400 text-xs mb-6 text-balance">The partner with the highest funding volume this quarter.</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-navy-deep font-black text-xl">
                MT
              </div>
              <div>
                <p className="font-bold">Marcus Thorne</p>
                <p className="text-xs text-[#d4af37]">Thorne & Co Accountants</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span className="text-slate-400">Total Referrals</span>
                <span className="font-bold">28</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span className="text-slate-400">Funded Volume</span>
                <span className="font-bold text-[#d4af37]">$840,000</span>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            View Partner Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralAnalyticsDashboard;