import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Download, 
  Filter, 
  Search, 
  TrendingUp,
  ChevronDown
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  dealName: string;
  partnerName: string;
  partnerCategory: string;
  fundingAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'Cleared' | 'Pending' | 'Scheduled';
  date: string;
}

const PayoutTable: React.FC = () => {
  const [payouts] = useState<PayoutRecord[]>([
    {
      id: 'TXN-90210',
      dealName: 'Blue Ridge Logistics Expansion',
      partnerName: 'Marcus Thorne',
      partnerCategory: 'CPA/Accountant',
      fundingAmount: 250000,
      commissionRate: 2.5,
      commissionAmount: 6250,
      status: 'Cleared',
      date: '2024-03-12'
    },
    {
      id: 'TXN-90211',
      dealName: 'Sunrise Cafe Inventory Loan',
      partnerName: 'Sarah Jenkins',
      partnerCategory: 'Real Estate Agent',
      fundingAmount: 45000,
      commissionRate: 3.0,
      commissionAmount: 1350,
      status: 'Pending',
      date: '2024-03-14'
    },
    {
      id: 'TXN-90212',
      dealName: 'Apex Tech Equipment Lease',
      partnerName: 'David Chen',
      partnerCategory: 'Equipment Dealer',
      fundingAmount: 120000,
      commissionRate: 2.0,
      commissionAmount: 2400,
      status: 'Scheduled',
      date: '2024-03-18'
    },
    {
      id: 'TXN-90213',
      dealName: 'Oakwood Medical Working Capital',
      partnerName: 'Marcus Thorne',
      partnerCategory: 'CPA/Accountant',
      fundingAmount: 500000,
      commissionRate: 2.0,
      commissionAmount: 10000,
      status: 'Cleared',
      date: '2024-02-28'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cleared': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Commission</p>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#020617]">{formatCurrency(20000)}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight size={12} /> +12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Payouts</p>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#020617]">{formatCurrency(1350)}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">1 transaction in verification</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Partners</p>
            <div className="p-2 bg-[#fef3c7] rounded-lg">
              <DollarSign size={18} className="text-[#d4af37]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#020617]">17</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Generating revenue this quarter</p>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Header/Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#020617]">Commission Ledger</h2>
            <p className="text-xs text-slate-500">Track and manage referral payout history</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search deals..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d4af37] outline-none w-full md:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Filter size={14} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#020617] text-white rounded-lg text-sm font-semibold hover:bg-[#0f172a]">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Deal & ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Referral Source</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Funding Amount</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Comm. %</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{row.dealName}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tight">{row.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{row.partnerName}</div>
                    <div className="text-xs text-slate-500">{row.partnerCategory}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {formatCurrency(row.fundingAmount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {row.commissionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#020617] text-sm">
                    {formatCurrency(row.commissionAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(row.status)}`}>
                      {row.status === 'Cleared' && <CheckCircle2 size={10} />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium tracking-wide">Showing 4 of 128 transactions</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-xs font-bold text-slate-400 bg-white cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutTable;