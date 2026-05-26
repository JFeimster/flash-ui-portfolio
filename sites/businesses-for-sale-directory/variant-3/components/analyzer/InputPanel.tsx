import React from 'react';

interface AnalyzerInputs {
  askingPrice: number;
  sde: number;
  addBacks: number;
  interestRate: number;
  loanTerm: number;
  downPaymentPct: number;
}

interface InputPanelProps {
  inputs: AnalyzerInputs;
  setInputs: React.Dispatch<React.SetStateAction<AnalyzerInputs>>;
}

const InputPanel: React.FC<InputPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const inputGroupStyle = "flex flex-col gap-2 mb-6";
  const labelStyle = "text-[0.65rem] font-black uppercase tracking-widest text-[#8E593E] font-mono";
  const inputStyle = "bg-[#050505] border-2 border-[#1A1A1A] p-3 text-[#F5F5F0] font-mono text-lg focus:border-[#C1FF00] outline-none transition-colors w-full";

  return (
    <div className="bg-[#0F0F0F] border-2 border-[#1A1A1A] p-8 h-full relative overflow-hidden">
      {/* Decorative Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#C1FF00] opacity-20 animate-scan"></div>
      
      <div className="mb-8 border-b border-[#1A1A1A] pb-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[#F5F5F0]">
          The <span className="text-[#C1FF00]">Underwriter</span>
        </h2>
        <p className="font-mono text-[0.6rem] text-[#666] mt-1 italic">
          v2.0.4 // REAL-TIME DEBT SERVICE CALCULATOR
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <div className="mb-4">
            <span className="font-mono text-[0.6rem] bg-[#1A1A1A] px-2 py-1 text-[#C1FF00]">
              SECTION 01: ASSET VALUATION
            </span>
          </div>
          
          <div className={inputGroupStyle}>
            <label className={labelStyle}>Asking Price ($)</label>
            <input
              type="number"
              name="askingPrice"
              value={inputs.askingPrice}
              onChange={handleChange}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>

          <div className={inputGroupStyle}>
            <label className={labelStyle}>Reported SDE ($)</label>
            <input
              type="number"
              name="sde"
              value={inputs.sde}
              onChange={handleChange}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>

          <div className={inputGroupStyle}>
            <label className={labelStyle}>Verified Add-backs ($)</label>
            <input
              type="number"
              name="addBacks"
              value={inputs.addBacks}
              onChange={handleChange}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <span className="font-mono text-[0.6rem] bg-[#1A1A1A] px-2 py-1 text-[#FF3D00]">
              SECTION 02: LEVERAGE TERMS
            </span>
          </div>

          <div className={inputGroupStyle}>
            <label className={labelStyle}>Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="interestRate"
              value={inputs.interestRate}
              onChange={handleChange}
              className={inputStyle}
              placeholder="11.5"
            />
          </div>

          <div className={inputGroupStyle}>
            <label className={labelStyle}>Loan Term (Years)</label>
            <input
              type="number"
              name="loanTerm"
              value={inputs.loanTerm}
              onChange={handleChange}
              className={inputStyle}
              placeholder="10"
            />
          </div>

          <div className={inputGroupStyle}>
            <label className={labelStyle}>Down Payment (%)</label>
            <input
              type="number"
              name="downPaymentPct"
              value={inputs.downPaymentPct}
              onChange={handleChange}
              className={inputStyle}
              placeholder="10"
            />
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-[#1A1A1A] flex justify-between items-center">
        <div className="font-mono text-[0.65rem] text-[#444]">
          SYSTEM STATUS: <span className="text-[#C1FF00]">READY</span>
        </div>
        <button 
          className="bg-[#F5F5F0] text-[#050505] px-6 py-3 font-black uppercase text-xs hover:bg-[#C1FF00] transition-colors cursor-pointer"
          onClick={() => console.log('Recalculating...')}
        >
          Force Recalculate
        </button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(600px); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default InputPanel;