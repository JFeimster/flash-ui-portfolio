import React, { useState } from 'react';

const ReminderSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [leadTime, setLeadTime] = useState('2');
  const [scoreThreshold, setScoreThreshold] = useState(50);
  const [channels, setChannels] = useState({
    email: true,
    browser: false,
    sms: false
  });

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#020617] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d4af37] rounded-lg text-[#020617]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Follow-Up Notifications</h3>
            <p className="text-slate-400 text-xs">Configure how you receive your relationship-building alerts.</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Master Toggle */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h4 className="font-semibold text-slate-900">Enable Reminders</h4>
            <p className="text-sm text-slate-500">Receive alerts for scheduled partner follow-ups.</p>
          </div>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${enabled ? 'bg-[#10b981]' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${enabled ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        <div className={enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Frequency Settings */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Agenda Digest</label>
              <div className="space-y-2">
                {['daily', 'weekly', 'none'].map((freq) => (
                  <label key={freq} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      name="frequency" 
                      checked={digestFrequency === freq}
                      onChange={() => setDigestFrequency(freq)}
                      className="text-[#d4af37] focus:ring-[#d4af37]" 
                    />
                    <span className="text-sm font-medium text-slate-700 capitalize">{freq} summary</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lead Time Settings */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Reminder Lead Time</label>
              <select 
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#d4af37] outline-none"
              >
                <option value="0">On the same day</option>
                <option value="1">1 day before</option>
                <option value="2">2 days before</option>
                <option value="7">1 week before</option>
              </select>
              <p className="text-[11px] text-slate-400 italic leading-relaxed">
                We'll notify you in advance so you have time to prepare research or materials for the partner.
              </p>
            </div>

            {/* Quality Filter */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Threshold</label>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-700">Score &gt; {scoreThreshold}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                step="10"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
              <p className="text-xs text-slate-500">Only trigger notifications for partners with a Quality Score above this level.</p>
            </div>

            {/* Notification Channels */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Channels</label>
              <div className="flex flex-wrap gap-4">
                {Object.entries(channels).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setChannels({...channels, [key]: !val})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                      val 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {val && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                    <span className="capitalize">{key}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
          <button className="text-sm font-bold text-slate-400 hover:text-slate-600 px-4 py-2 transition-colors">
            Reset to Default
          </button>
          <button className="bg-[#d4af37] hover:bg-[#b8962e] text-[#020617] px-8 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-amber-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
            Update Settings
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }
      `}} />
    </div>
  );
};

export default ReminderSettings;