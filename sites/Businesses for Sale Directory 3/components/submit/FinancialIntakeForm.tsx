import React, { useState } from 'react';

const FinancialIntakeForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    revenue: '',
    sde: '',
    ebitda: '',
    inventory: '',
    realEstate: false,
    ownerHours: '',
    employees: '',
    industry: 'Local Service'
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const inputStyles = "w-full bg-[#1A1A1A] border-2 border-[#1A1A1A] focus:border-[#F5F5F0] text-[#F5F5F0] p-4 font-mono text-xl outline-none transition-colors mb-6";
  const labelStyles = "block text-[10px] uppercase font-black tracking-widest text-[#8E593E] mb-2";

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#C1FF00] selection:text-[#050505] p-4 md:p-8 relative">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9999]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-4xl mx-auto border-2 border-[#1A1A1A] bg-[#0F0F0F] relative">
        {/* Header */}
        <header className="border-b-2 border-[#1A1A1A] p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="font-mono text-[#C1FF00] text-xs tracking-widest block mb-2">/ / THE MINT: INTAKE PROTOCOL</span>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                Financial <br/>Intelligence
              </h1>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold">{step}/03</span>
              <div className="w-32 h-1 bg-[#1A1A1A] mt-2">
                <div 
                  className="h-full bg-[#C1FF00] transition-all duration-500" 
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Form Body */}
        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[#F5F5F0] font-mono mb-10 text-sm border-b border-[#1A1A1A] pb-4 uppercase">Step 01: Core P&L Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelStyles}>Gross Revenue (TTM)</label>
                  <input 
                    type="text" 
                    placeholder="$0.00" 
                    className={inputStyles}
                    value={formData.revenue}
                    onChange={(e) => updateField('revenue', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Seller's Discretionary Earnings (SDE)</label>
                  <input 
                    type="text" 
                    placeholder="$0.00" 
                    className={inputStyles}
                    value={formData.sde}
                    onChange={(e) => updateField('sde', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                  <label className={labelStyles}>EBITDA</label>
                  <input 
                    type="text" 
                    placeholder="$0.00" 
                    className={inputStyles}
                    value={formData.ebitda}
                    onChange={(e) => updateField('ebitda', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Inventory Value</label>
                  <input 
                    type="text" 
                    placeholder="$0.00" 
                    className={inputStyles}
                    value={formData.inventory}
                    onChange={(e) => updateField('inventory', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[#F5F5F0] font-mono mb-10 text-sm border-b border-[#1A1A1A] pb-4 uppercase">Step 02: Verification Vault</h2>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-[#1A1A1A] hover:border-[#8E593E] p-12 text-center transition-colors cursor-pointer group">
                  <div className="text-[#8E593E] group-hover:text-[#F5F5F0] transition-colors">
                    <span className="block font-black text-xl uppercase mb-2">Upload P&L Statements</span>
                    <span className="font-mono text-xs text-[#555]">PDF, XLSX (LAST 3 YEARS PREFERRED)</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-[#1A1A1A] hover:border-[#8E593E] p-12 text-center transition-colors cursor-pointer group">
                  <div className="text-[#8E593E] group-hover:text-[#F5F5F0] transition-colors">
                    <span className="block font-black text-xl uppercase mb-2">Tax Returns</span>
                    <span className="font-mono text-xs text-[#555]">U.S. FEDERAL FILINGS (FORM 1120/1065)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[#F5F5F0] font-mono mb-10 text-sm border-b border-[#1A1A1A] pb-4 uppercase">Step 03: Operational Complexity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelStyles}>Owner Hours / Week</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className={inputStyles}
                    value={formData.ownerHours}
                    onChange={(e) => updateField('ownerHours', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Total Employee Count</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className={inputStyles}
                    value={formData.employees}
                    onChange={(e) => updateField('employees', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 p-6 bg-[#1A1A1A]">
                <input 
                  type="checkbox" 
                  id="realEstate" 
                  className="w-6 h-6 accent-[#C1FF00]"
                  checked={formData.realEstate}
                  onChange={(e) => updateField('realEstate', e.target.checked)}
                />
                <label htmlFor="realEstate" className="font-black uppercase tracking-widest text-xs">Deal Includes Real Estate Assets</label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t-2 border-[#1A1A1A] p-8 flex justify-between bg-[#0F0F0F]">
          <button 
            onClick={prevStep}
            className={`px-8 py-4 font-black uppercase text-xs tracking-widest border border-[#F5F5F0] hover:bg-[#F5F5F0] hover:text-[#050505] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="px-8 py-4 bg-[#F5F5F0] text-[#050505] font-black uppercase text-xs tracking-widest border border-[#F5F5F0] hover:bg-transparent hover:text-[#F5F5F0] transition-all"
            >
              Continue Protocol
            </button>
          ) : (
            <button 
              className="px-8 py-4 bg-[#C1FF00] text-[#050505] font-black uppercase text-xs tracking-widest border border-[#C1FF00] hover:bg-transparent hover:text-[#C1FF00] transition-all"
            >
              Submit to Ledger
            </button>
          )}
        </div>
      </div>

      {/* Side Metadata */}
      <div className="hidden lg:block fixed left-8 bottom-8 text-[#1A1A1A] font-mono text-[10px] vertical-text">
        OXIDIZED_LEDGER_SYSTEM_V.2.0.4 // INTAKE_MODULE
      </div>
      
      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};

export default FinancialIntakeForm;