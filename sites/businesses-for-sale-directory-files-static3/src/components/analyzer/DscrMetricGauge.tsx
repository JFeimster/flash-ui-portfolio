```tsx
import React, { useState, useMemo } from 'react';

interface DscrMetricGaugeProps {
  initialEbitda?: number;
  initialAsking?: number;
}

export default function DscrMetricGauge({
  initialEbitda = 620000,
  initialAsking = 1850000,
}: DscrMetricGaugeProps) {
  // --- FINANCIAL STATE ---
  const [ebitda, setEbitda] = useState<number>(initialEbitda);
  const [askingPrice, setAskingPrice] = useState<number>(initialAsking);

  // Debt Structure Allocations (%)
  const [sbaAllocation, setSbaAllocation] = useState<number>(75); // 75% standard
  const [sellerAllocation, setSellerAllocation] = useState<number>(15); // 15% standby
  const [equityAllocation, setEquityAllocation] = useState<number>(10); // 10% equity

  // Debt Terms
  const [sbaInterest, setSbaInterest] = useState<number>(10.5); // Current SBA 7(a) variable rates
  const [sbaTerm, setSbaTerm] = useState<number>(10); // 10 years standard for business acquisition
  const [sellerInterest, setSellerInterest] = useState<number>(8.0);
  const [sellerTerm, setSellerTerm] = useState<number>(5); // 5 years balloon/standby

  // Downside stress-test scenario
  const [ebitdaStress, setEbitdaStress] = useState<number>(0); // % reduction (0 to 50)

  // --- CALCULATIONS ---
  const calculatedMetrics = useMemo(() => {
    const sbaPrincipal = (askingPrice * sbaAllocation) / 100;
    const sellerPrincipal = (askingPrice * sellerAllocation) / 100;
    const equityRequired = (askingPrice * equityAllocation) / 100;

    // Amortization Calculator
    const calculateAnnualPayment = (principal: number, annualRate: number, years: number) => {
      if (principal <= 0 || years <= 0) return 0;
      if (annualRate === 0) return principal / years;
      const r = annualRate / 100;
      const n = years;
      return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };

    const sbaAnnualService = calculateAnnualPayment(sbaPrincipal, sbaInterest, sbaTerm);
    const sellerAnnualService = calculateAnnualPayment(sellerPrincipal, sellerInterest, sellerTerm);
    const totalDebtService = sbaAnnualService + sellerAnnualService;

    // Adjusted EBITDA under downside stress
    const stressedEbitda = ebitda * (1 - ebitdaStress / 100);

    // DSCR ratios
    const baseDscr = totalDebtService > 0 ? ebitda / totalDebtService : 0;
    const stressedDscr = totalDebtService > 0 ? stressedEbitda / totalDebtService : 0;

    // Cash-on-cash yield
    const cashYieldBase = equityRequired > 0 ? (ebitda - totalDebtService) / equityRequired * 100 : 0;
    const cashYieldStressed = equityRequired > 0 ? (stressedEbitda - totalDebtService) / equityRequired * 100 : 0;

    return {
      sbaPrincipal,
      sellerPrincipal,
      equityRequired,
      sbaAnnualService,
      sellerAnnualService,
      totalDebtService,
      stressedEbitda,
      baseDscr,
      stressedDscr,
      cashYieldBase,
      cashYieldStressed,
    };
  }, [askingPrice, ebitda, sbaAllocation, sellerAllocation, equityAllocation, sbaInterest, sbaTerm, sellerInterest, sellerTerm, ebitdaStress]);

  const {
    sbaPrincipal,
    sellerPrincipal,
    equityRequired,
    sbaAnnualService,
    sellerAnnualService,
    totalDebtService,
    stressedEbitda,
    baseDscr,
    stressedDscr,
    cashYieldBase,
    cashYieldStressed,
  } = calculatedMetrics;

  // Gauge Classification logic
  const getDscrStatus = (ratio: number) => {
    if (ratio >= 1.5) return { label: 'OPTIMAL (SECURE SECTOR)', color: 'text-[#00FF66]', border: 'border-[#00FF66]', bg: 'bg-[#00FF66]/10' };
    if (ratio >= 1.25) return { label: 'SBA COMPLIANT (STABLE)', color: 'text-[#0EA5E9]', border: 'border-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10' };
    if (ratio >= 1.15) return { label: 'MARGINAL WARN ZONE', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' };
    return { label: 'CRITICAL VALUE (DEFAULT THREAT)', color: 'text-[#FF3333]', border: 'border-[#FF3333]', bg: 'bg-[#FF3333]/10' };
  };

  const currentStatus = getDscrStatus(stressedDscr);

  return (
    <div className="bg-[#050505] border border-[#222] text-[#F9F9F9] font-sans antialiased grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden" style={{ borderRadius: '0px' }}>
      
      {/* LEFT COLUMN: CONTROL & STRUCTURING PORTAL */}
      <div className="lg:col-span-5 border-r border-[#222] p-6 space-y-6 bg-[#080808]">
        
        {/* Module Header */}
        <div className="border-b border-[#222] pb-3 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold tracking-wider text-[#0EA5E9] flex items-center gap-2">
            <span className="inline-block w-1.5 h-3 bg-[#0EA5E9]"></span>
            LBO STRUCTURING TERMINAL
          </h3>
          <span className="text-[9px] font-mono bg-[#111] border border-[#222] px-2 py-0.5 text-[#888]">
            ENGINE V4.0
          </span>
        </div>

        {/* Input: Base Purchase & Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-mono text-[9px] text-[#888] uppercase tracking-wider">Purchase Asking Price</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#444]">$</span>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#0EA5E9] text-xs font-mono text-white p-2 pl-6 outline-none"
                style={{ borderRadius: '0px' }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block font-mono text-[9px] text-[#888] uppercase tracking-wider">Operating EBITDA</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#444]">$</span>
              <input
                type="number"
                value={ebitda}
                onChange={(e) => setEbitda(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#050505] border border-[#222] focus:border-[#00FF66] text-xs font-mono text-[#00FF66] font-bold p-2 pl-6 outline-none"
                style={{ borderRadius: '0px' }}
              />
            </div>
          </div>
        </div>

        {/* Capital Stack Allocation */}
        <div className="space-y-3 bg-[#0a0a0a] p-4 border border-[#222]">
          <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-1.5">
            <span className="font-mono text-[10px] text-[#F9F9F9] font-bold tracking-wider">CAPITAL STACK STRUCTURE</span>
            <span className="font-mono text-[9px] text-[#0EA5E9] font-bold">
              {sbaAllocation + sellerAllocation + equityAllocation}% TOTAL
            </span>
          </div>

          <div className="space-y-3">
            {/* SBA Allocation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#888]">SBA 7(a) Guarantee Loan</span>
                <span className="text-[#0EA5E9]">{sbaAllocation}% (${(sbaPrincipal).toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={sbaAllocation}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSbaAllocation(val);
                  // Dynamic adjustment to guarantee 100% total
                  const remainder = 100 - val;
                  setSellerAllocation(Math.max(0, Math.min(remainder, sellerAllocation)));
                  setEquityAllocation(Math.max(0, 100 - val - Math.max(0, Math.min(remainder, sellerAllocation))));
                }}
                className="w-full accent-[#0EA5E9] bg-[#222] h-1 cursor-pointer"
              />
            </div>

            {/* Seller Standby Note */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#888]">Seller Standby Note</span>
                <span className="text-white">{sellerAllocation}% (${(sellerPrincipal).toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={sellerAllocation}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSellerAllocation(val);
                  const remainder = 100 - val;
                  setSbaAllocation(Math.max(0, Math.min(remainder, sbaAllocation)));
                  setEquityAllocation(Math.max(0, 100 - val - Math.max(0, Math.min(remainder, sbaAllocation))));
                }}
                className="w-full accent-white bg-[#222] h-1 cursor-pointer"
              />
            </div>

            {/* Buyer Equity Cash */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#888]">Buyer Equity Required</span>
                <span className="text-[#00FF66] font-bold">{equityAllocation}% (${(equityRequired).toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={equityAllocation}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setEquityAllocation(val);
                  const remainder = 100 - val;
                  setSbaAllocation(Math.max(0, Math.min(remainder, sbaAllocation)));
                  setSellerAllocation(Math.max(0, 100 - val - Math.max(0, Math.min(remainder, sbaAllocation))));
                }}
                className="w-full accent-[#00FF66] bg-[#222] h-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Debt Terms Panel */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 bg-[#0a0a0a] p-3 border border-[#222]">
            <span className="block font-mono text-[9px] text-[#0EA5E9] tracking-wider uppercase font-bold">SBA Loan Settings</span>
            <div className="space-y-2">
              <div>
                <label className="flex justify-between font-mono text-[8px] text-[#888]">Interest Rate: <span className="text-white">{sbaInterest}%</span></label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.25"
                  value={sbaInterest}
                  onChange={(e) => setSbaInterest(parseFloat(e.target.value))}
                  className="w-full accent-[#0EA5E9] bg-[#222] h-1"
                />
              </div>
              <div>
                <label className="flex justify-between font-mono text-[8px] text-[#888]">Amortization (Yrs): <span className="text-white">{sbaTerm}</span></label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={sbaTerm}
                  onChange={(e) => setSbaTerm(parseInt(e.target.value))}
                  className="w-full accent-[#0EA5E9] bg-[#222] h-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-[#0a0a0a] p-3 border border-[#222]">
            <span className="block font-mono text-[9px] text-white tracking-wider uppercase font-bold">Seller Note Settings</span>
            <div className="space-y-2">
              <div>
                <label className="flex justify-between font-mono text-[8px] text-[#888]">Interest Rate: <span className="text-white">{sellerInterest}%</span></label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.25"
                  value={sellerInterest}
                  onChange={(e) => setSellerInterest(parseFloat(e.target.value))}
                  className="w-full accent-white bg-[#222] h-1"
                />
              </div>
              <div>
                <label className="flex justify-between font-mono text-[8px] text-[#888]">Maturity (Yrs): <span className="text-white">{sellerTerm}</span></label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={sellerTerm}
                  onChange={(e) => setSellerTerm(parseInt(e.target.value))}
                  className="w-full accent-white bg-[#222] h-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Downside Scenario Stresser */}
        <div className="p-3 bg-red-950/10 border border-[#FF3333]/30 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-[#FF3333] font-bold tracking-widest">STRESS-TEST OPERATIONAL REVENUE</span>
            <span className="font-mono text-xs text-[#FF3333] font-bold">-{ebitdaStress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={ebitdaStress}
            onChange={(e) => setEbitdaStress(parseInt(e.target.value))}
            className="w-full accent-[#FF3333] bg-[#222] h-1 cursor-pointer"
          />
          <p className="text-[9px] text-[#888] font-mono leading-tight">
            Simulates dynamic revenue/earnings crash. Real-time stress models target the critical leverage limit threshold of debt default.
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: GAUGE METRIC TERMINAL */}
      <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
        
        {/* Metric Header Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] border border-[#222] font-mono text-center">
          <div className="bg-[#0c0c0c] p-3">
            <div className="text-[8px] text-[#888]">TOTAL ANNUAL DEBT</div>
            <div className="text-sm font-bold text-white">${(totalDebtService).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-[#0c0c0c] p-3">
            <div className="text-[8px] text-[#888]">STRESSED EBITDA</div>
            <div className="text-sm font-bold text-[#FF3333]">${(stressedEbitda).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-[#0c0c0c] p-3">
            <div className="text-[8px] text-[#888]">BASE DSCR</div>
            <div className="text-sm font-bold text-[#00FF66]">{baseDscr.toFixed(2)}x</div>
          </div>
          <div className="bg-[#0c0c0c] p-3">
            <div className="text-[8px] text-[#888]">STRESSED DSCR</div>
            <div className="text-sm font-bold text-[#0EA5E9]">{stressedDscr.toFixed(2)}x</div>
          </div>
        </div>

        {/* VISUAL GAUGE METRIC ELEMENT */}
        <div className="relative border border-[#222] bg-[#080808] p-8 flex flex-col items-center justify-center">
          
          {/* Neon Pulse Signal Indicator */}
          <div className="absolute top-4 right-4 flex items-center space-x-1.5 font-mono text-[9px] text-[#888]">
            <span className="inline-block w-2 h-2 bg-[#00FF66] animate-pulse rounded-none"></span>
            <span>MODEL HEALTH PROTOCOL ACTIVE</span>
          </div>

          <div className="text-center space-y-1">
            <div className="font-mono text-[10px] text-[#888] tracking-widest uppercase">STRESSED DEBT SERVICE COVERAGE RATIO</div>
            <div className={`font-mono text-5xl font-black tracking-tighter ${currentStatus.color}`}>
              {stressedDscr.toFixed(2)}<span className="text-lg">x</span>
            </div>
            <div className={`inline-block px-3 py-1 font-mono text-[9px] font-bold border ${currentStatus.border} ${currentStatus.bg} tracking-widest uppercase`}>
              STATUS: {currentStatus.label}
            </div>
          </div>

          {/* Stepped LED Bar Graph Indicator */}
          <div className="w-full max-w-md mt-6 space-y-2">
            <div className="flex items-center justify-between font-mono text-[8px] text-neutral-600">
              <span>0.00x [CRITICAL FAIL]</span>
              <span>1.15x [SBA FLOOR]</span>
              <span>1.50x+ [HIGH CASH]</span>
            </div>
            
            {/* Segment Grid (Interactive-looking) */}
            <div className="grid grid-cols-20 gap-1 w-full">
              {Array.from({ length: 20 }).map((_, index) => {
                const thresholdValue = (index + 1) * 0.1; // 0.1x to 2.0x range
                const isActive = stressedDscr >= thresholdValue;
                
                // Color zone for each block
                let blockBg = 'bg-[#111]';
                if (isActive) {
                  if (thresholdValue < 1.15) blockBg = 'bg-[#FF3333]';
                  else if (thresholdValue < 1.4) blockBg = 'bg-[#0ea5e9]';
                  else blockBg = 'bg-[#00FF66]';
                }

                return (
                  <div
                    key={index}
                    className={`h-4 transition-all duration-300 ${blockBg} border border-black/50`}
                    style={{ borderRadius: '0px' }}
                    title={`Leverage Threshold: ${thresholdValue.toFixed(1)}x`}
                  />
                );
              })}
            </div>
          </div>

          {/* Core DSCR Rules Panel */}
          <div className="mt-6 w-full max-w-md border-t border-[#1a1a1a] pt-4 grid grid-cols-2 gap-4 font-mono text-[10px] text-[#888]">
            <div>
              <span className="text-[#0EA5E9] font-bold">● SBA Minimum DSCR:</span> SBA guidelines demand a minimum trailing 1.15x debt calculation post-management salaries.
            </div>
            <div>
              <span className="text-[#00FF66] font-bold">● Margin of Safety:</span> Premium acquirers target &gt;1.35x to comfortably fund operational expansion.
            </div>
          </div>

        </div>

        {/* BOTTOM METRICS FLOW: CO-C CASH FLOWS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Amortization Table Preview */}
          <div className="border border-[#222] bg-[#0a0a0a] p-4 space-y-2">
            <span className="block font-mono text-[10px] text-[#0EA5E9] font-bold tracking-wider">ANNUAL DEBT COMPOSITION</span>
            <ul className="text-xs font-mono space-y-1.5 text-[#888]">
              <li className="flex justify-between border-b border-[#111] pb-1">
                <span>SBA 7(a) Amortization:</span>
                <span className="text-white">${(sbaAnnualService).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </li>
              <li className="flex justify-between border-b border-[#111] pb-1">
                <span>Seller Note Service:</span>
                <span className="text-white">${(sellerAnnualService).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </li>
              <li className="flex justify-between font-bold text-white">
                <span>Total Amortization Pool:</span>
                <span className="text-[#FF3333]">${(totalDebtService).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </li>
            </ul>
          </div>

          {/* Cash Yield Performance */}
          <div className="border border-[#222] bg-[#0a0a0a] p-4 space-y-2">
            <span className="block font-mono text-[10px] text-[#00FF66] font-bold tracking-wider">PROJECTED CASH-ON-CASH YIELD</span>
            <ul className="text-xs font-mono space-y-1.5 text-[#888]">
              <li className="flex justify-between border-b border-[#111] pb-1">
                <span>Base Scenario Yield:</span>
                <span className="text-[#00FF66] font-bold">{cashYieldBase.toFixed(2)}%</span>
              </li>
              <li className="flex justify-between border-b border-[#111] pb-1">
                <span>Stressed Yield (-{ebitdaStress}%):</span>
                <span className={cashYieldStressed > 0 ? 'text-[#0EA5E9]' : 'text-[#FF3333] font-bold'}>
                  {cashYieldStressed.toFixed(2)}%
                </span>
              </li>
              <li className="flex justify-between font-bold text-white">
                <span>Downside Cash Buffer:</span>
                <span className="text-white">
                  ${(stressedEbitda - totalDebtService > 0 ? stressedEbitda - totalDebtService : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
```