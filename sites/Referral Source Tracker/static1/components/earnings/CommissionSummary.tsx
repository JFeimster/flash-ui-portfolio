import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight, 
  Filter, 
  Download,
  Users
} from 'lucide-react';

const CommissionSummary = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = [
    { label: 'Total Commissions', value: '$42,850.00', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Payouts', value: '$8,200.00', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Cleared This Month', value: '$12,400.00', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Deal Volume', value: '$1.2M', icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const ledger = [
    { id: 1, date: '2024-05-12', source: 'Marcus Thorne', deal: 'Global Logistics Expansion', amount: '$250,000', rate: '2%', commission: '$5,000', status: 'Cleared' },
    { id: 2, date: '2024-05-10', source: 'Sarah Jenkins', deal: 'Austin Tech Hub Reno', amount: '$120,000', rate: '3%', commission: '$3,600', status: 'Pending' },
    { id: 3, date: '2024-05-08', source: 'Bank Manager Dan', deal: 'Riverside Manufacturing', amount: '$500,000', rate: '1.5%', commission: '$7,500', status: 'Cleared' },
    { id: 4, date: '2024-05-01', source: 'Nexus CPAs', deal: 'SBA Bridge - Smith Co', amount: '$85,000', rate: '4%', commission: '$3,400', status: 'Cleared' },
    { id: 5, date: '2024-04-28', source: 'Equipment Dealer Pete', deal: 'Heavy Fleet Purchase', amount: '$310,000', rate: '2%', commission: '$6,200', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      {/* Header */}
      <div className="bg-[#020617] text-white p-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#d4af37] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Financials</span>
              <h2 className="text-slate-400 text-sm font-medium">Earnings & Commission Ledger</h2>
            </div>
            <h1 className="text-3xl font-bold">Performance <span className="text-[#d4af37]">Revenue Dashboard</span></h1>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
              <Download size={16} /> Export Statement
            </button>
            <button className="bg-[#d4af37] hover:bg-[#b8962e] text-[#020617] px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all">
              Request Payout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Sync</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Ledger Section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Transaction History</h3>
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <div className="flex gap-2">
                {['All', 'Cleared', 'Pending'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === f ? 'bg-[#020617] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search source or deal..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <th className="px-6 py-4">Close Date</th>
                  <th className="px-6 py-4">Referral Source</th>
                  <th className="px-6 py-4">Funded Deal</th>
                  <th className="px-6 py-4">Deal Amount</th>
                  <th className="px-6 py-4">Comm. %</th>
                  <th className="px-6 py-4">Earnings</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{row.source}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Affiliate Partner</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 italic">{row.deal}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.rate}</td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-600">{row.commission}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${row.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 
                          row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded border border-slate-200 transition-all">
                        <ArrowUpRight size={14} className="text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <button className="text-xs font-bold text-slate-500 hover:text-[#020617] uppercase tracking-widest transition-colors">
              Load More Transactions
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="bg-[#fef3c7] border border-[#fde68a] p-4 rounded-lg flex items-start gap-3 max-w-md">
            <div className="bg-[#d4af37] p-1.5 rounded-full text-white">
              <DollarSign size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Payout Schedule</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Commissions are calculated daily and released every Friday for all "Cleared" status deals. Processing times vary by bank.
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl flex-1 w-full lg:max-w-xs">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Referral Link Performance</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Link Clicks</span>
                <span className="font-bold">1,240</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#d4af37] h-full w-[65%]"></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Conv. Rate</span>
                <span className="font-bold text-emerald-600">4.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSummary;