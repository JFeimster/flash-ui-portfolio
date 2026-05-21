'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Phone, Mail, User, Briefcase, ExternalLink, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

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

export default function FollowUpCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sources, setSources] = useState<ReferralSource[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem('moonshine_referrals');
    if (saved) {
      setSources(JSON.parse(saved));
    }
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const calendarDays = [];
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const startDay = firstDayOfMonth(year, currentDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getFollowUpsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sources.filter(s => s.nextFollowUp === dateStr);
  };

  const selectedDateFollowUps = sources.filter(s => s.nextFollowUp === selectedDate);
  const overdueCount = sources.filter(s => s.nextFollowUp && new Date(s.nextFollowUp) < new Date(new Date().setHours(0,0,0,0))).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#d4af37] selection:text-navy-deep">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-xl font-bold text-white">Follow-Up Calendar</h1>
              <p className="text-xs text-[#d4af37] font-bold uppercase tracking-widest">Unified Partner Scheduling</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm font-medium">{overdueCount} Overdue Tasks</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CalendarIcon className="text-[#d4af37]" />
                {monthName} <span className="text-slate-500 font-light">{year}</span>
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg border border-white/10 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold hover:bg-white/10 transition-all">Today</button>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg border border-white/10 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-white/10">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayFollowUps = getFollowUpsForDate(day);
                const isSelected = day && selectedDate === `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = day && new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => day && setSelectedDate(`${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                    className={`min-h-[100px] p-2 border-r border-b border-white/5 transition-all cursor-pointer hover:bg-white/[0.03] relative group
                      ${!day ? 'bg-black/20' : ''}
                      ${isSelected ? 'bg-[#d4af37]/10' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-sm font-bold ${isToday ? 'bg-[#d4af37] text-navy-deep w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                          {day}
                        </span>
                        <div className="mt-2 space-y-1">
                          {dayFollowUps.slice(0, 3).map((f, i) => (
                            <div key={i} className="text-[10px] truncate bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.5 rounded font-medium">
                              {f.name}
                            </div>
                          ))}
                          {dayFollowUps.length > 3 && (
                            <div className="text-[9px] text-slate-500 pl-1 font-bold">
                              + {dayFollowUps.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agenda Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">Agenda for</p>
                <h3 className="text-xl font-bold">{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
              </div>
              <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold">
                {selectedDateFollowUps.length} Partners
              </div>
            </div>

            {selectedDateFollowUps.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-medium">No follow-ups scheduled for this day.</p>
                <button className="mt-4 text-[#d4af37] text-sm font-bold hover:underline">Schedule Outreach</button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateFollowUps.map((source) => (
                  <div key={source.id} className="group p-4 rounded-xl border border-slate-100 hover:border-[#d4af37]/50 hover:bg-slate-50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{source.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{source.company}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${source.qualityScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {source.qualityScore}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <a href={`tel:${source.phone}`} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-[#d4af37]">
                        <div className="p-1.5 bg-slate-100 rounded-md group-hover:bg-white"><Phone size={12} /></div>
                        Call
                      </a>
                      <a href={`mailto:${source.email}`} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-[#d4af37]">
                        <div className="p-1.5 bg-slate-100 rounded-md group-hover:bg-white"><Mail size={12} /></div>
                        Email
                      </a>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200">
                      <p className="text-[11px] text-slate-600 italic line-clamp-2">"{source.notes || 'No specific notes for this follow-up...'}"</p>
                    </div>
                  </div>
                ))}

                <button className="w-full py-3 bg-[#020617] text-white rounded-xl font-bold text-sm shadow-lg shadow-navy-deep/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4">
                  <ExternalLink size={16} className="text-[#d4af37]" />
                  Launch Batch Outreach
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#d4af37] rounded-2xl p-6 text-navy-deep">
            <h4 className="font-black text-sm uppercase tracking-widest mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium opacity-80">Weekly Target</span>
                <span className="text-2xl font-black">12/20</span>
              </div>
              <div className="w-full bg-navy-deep/10 h-2 rounded-full overflow-hidden">
                <div className="bg-navy-deep h-full w-[60%]"></div>
              </div>
              <p className="text-[11px] font-bold leading-relaxed">
                You have <span className="underline">5 high-priority</span> CPAs that haven't been contacted in over 30 days. Focus on "Active Source" stages first.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-10 mt-10 border-t border-white/10 text-center">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
          Moonshine Capital Intelligence &copy; 2024 • Relationship Management System
        </p>
      </footer>

      <style jsx global>{`
        body {
          background-color: #020617;
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
```