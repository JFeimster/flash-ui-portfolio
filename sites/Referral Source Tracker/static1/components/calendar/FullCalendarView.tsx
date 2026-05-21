import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Phone, Mail, User, Clock, AlertCircle, Filter, CheckCircle2 } from 'lucide-react';

interface ReferralSource {
  id: number;
  name: string;
  company: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  stage: string;
  nextFollowUp: string;
  qualityScore: number;
  notes: string;
}

const FullCalendarView: React.FC = () => {
  // Mock data based on the base component's structure
  const [sources] = useState<ReferralSource[]>([
    { id: 1, name: "Marcus Thorne", company: "Thorne & Co Accountants", category: "CPA/Accountant", location: "New York, NY", email: "m.thorne@example.com", phone: "212-555-0192", stage: "Active Source", nextFollowUp: "2024-05-20", qualityScore: 92, notes: "Top tier CPA. Enjoys golf." },
    { id: 2, name: "Sarah Jenkins", company: "Main St Realty", category: "Real Estate Agent", location: "Austin, TX", email: "sarah@mainst.com", phone: "512-555-0100", stage: "Contacted", nextFollowUp: "2024-05-21", qualityScore: 45, notes: "Met at chamber event. Needs info on bridge loans." },
    { id: 3, name: "David Chen", company: "Chen Business Brokerage", category: "Business Broker", location: "San Francisco, CA", email: "d.chen@brokers.com", phone: "415-555-0988", stage: "Conversation Started", nextFollowUp: "2024-05-20", qualityScore: 78, notes: "Has 3 potential deals closing next month." },
    { id: 4, name: "Elena Rodriguez", company: "First National Bank", category: "Bank Manager", location: "Miami, FL", email: "elena@fnb.com", phone: "305-555-0221", stage: "Referral Agreement Discussed", nextFollowUp: "2024-05-23", qualityScore: 85, notes: "Focuses on owner-occupied CRE." },
    { id: 5, name: "Robert Miller", company: "Miller Equipment", category: "Equipment Dealer", location: "Chicago, IL", email: "rob@millerequip.com", phone: "312-555-0772", stage: "Identified", nextFollowUp: "2024-05-24", qualityScore: 30, notes: "Cold outreach needed." },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 20)); // May 20, 2024
  const [view, setView] = useState<'week' | 'agenda'>('week');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weekDates = useMemo(() => {
    const dates = [];
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return dates;
  }, [currentDate]);

  const getFollowUpsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sources.filter(s => s.nextFollowUp === dateStr);
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'border-emerald-500 bg-emerald-50';
    if (score > 50) return 'border-amber-500 bg-amber-50';
    return 'border-slate-300 bg-slate-50';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen font-['Inter']">
      {/* Calendar Header */}
      <div className="bg-[#020617] text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#d4af37] p-2 rounded-lg text-[#020617]">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Follow-Up Calendar</h1>
              <p className="text-slate-400 text-sm">Unified Outreach Scheduler</p>
            </div>
          </div>

          <div className="flex items-center bg-white/10 rounded-xl p-1 backdrop-blur-md">
            <button 
              onClick={() => setView('week')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'week' ? 'bg-[#d4af37] text-[#020617]' : 'text-white hover:bg-white/10'}`}
            >
              Weekly View
            </button>
            <button 
              onClick={() => setView('agenda')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'agenda' ? 'bg-[#d4af37] text-[#020617]' : 'text-white hover:bg-white/10'}`}
            >
              Agenda
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold min-w-[140px] text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-grow">
        {view === 'week' ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-full">
            {weekDates.map((date, idx) => {
              const dayFollowUps = getFollowUpsForDate(date);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div key={idx} className={`flex flex-col min-h-[500px] rounded-2xl border transition-all ${isToday ? 'bg-white border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/20' : 'bg-slate-50/50 border-slate-200'}`}>
                  <div className={`p-3 border-b text-center ${isToday ? 'bg-[#d4af37]/10' : ''}`}>
                    <p className={`text-[10px] uppercase font-black tracking-widest ${isToday ? 'text-[#d4af37]' : 'text-slate-400'}`}>
                      {daysOfWeek[idx]}
                    </p>
                    <p className={`text-xl font-bold ${isToday ? 'text-slate-900' : 'text-slate-600'}`}>
                      {date.getDate()}
                    </p>
                  </div>
                  
                  <div className="p-2 space-y-3 overflow-y-auto max-h-[600px] scrollbar-hide">
                    {dayFollowUps.length > 0 ? (
                      dayFollowUps.map(source => (
                        <div key={source.id} className={`p-3 rounded-xl border-l-4 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer bg-white ${getScoreColor(source.qualityScore)}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">{source.name}</h4>
                            <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-500">
                              {source.qualityScore}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mb-2">{source.company}</p>
                          <div className="flex gap-2">
                            <button className="p-1.5 bg-[#020617] text-white rounded-md hover:bg-slate-800">
                              <Phone size={10} />
                            </button>
                            <button className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50">
                              <Mail size={10} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-20">
                        <CheckCircle2 size={24} className="text-slate-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-500">CLEAR</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Clock size={18} className="text-[#d4af37]" />
                  Upcoming Batch Outreach
                </h3>
                <button className="text-xs bg-[#d4af37] text-[#020617] px-4 py-1.5 rounded-lg font-bold">
                  Export Daily Call List
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {sources.sort((a, b) => new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime()).map(source => (
                  <div key={source.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-inner ${source.qualityScore > 75 ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                        {source.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{source.name}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold border border-slate-200 uppercase">
                            {source.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{source.company} • {source.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Follow Up</p>
                        <p className={`font-bold ${new Date(source.nextFollowUp) < new Date() ? 'text-red-500' : 'text-slate-700'}`}>
                          {new Date(source.nextFollowUp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                          <Phone size={14} />
                          Call
                        </button>
                        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
                          <Mail size={14} />
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto w-full px-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-4">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">High Priority Reached</h4>
            <p className="text-emerald-700 text-xs mt-1">You have contacted 85% of your Tier 1 partners this month. Keep the momentum!</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-4">
          <div className="bg-amber-500 text-white p-2 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Action Required</h4>
            <p className="text-amber-700 text-xs mt-1">3 CPAs have missed their check-in date. A quick touchpoint could unlock new deals.</p>
          </div>
        </div>
        <div className="bg-[#020617] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-black">Weekly Goal</p>
            <p className="text-white font-bold">12 / 15 Follow-ups</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#d4af37] flex items-center justify-center text-white text-[10px] font-bold">
            80%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCalendarView;