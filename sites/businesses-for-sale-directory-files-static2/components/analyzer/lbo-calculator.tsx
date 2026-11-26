"use client";

import React, { useState, useEffect } from "react";

// Types
interface Scenario {
  name: string;
  growth: number;
  margin: number;
  exitMultiple: number;
}

const SCENARIOS: Record<string, Scenario> = {
  conservative: { name: "Downside / Bear", growth: 1, margin: 26, exitMultiple: 2.8 },
  base: { name: "Base Scenario", growth: 5, margin: 29.5, exitMultiple: 3.2 },
  optimistic: { name: "Target / Bull", growth: 12, margin: 33, exitMultiple: 3.8 },
};

export default function LboCalculator() {
  // Core Transaction State
  const [purchasePrice, setPurchasePrice] = useState<number>(2500000);
  const [ebitda, setEbitda] = useState<number>(650000);
  const [revenue, setRevenue] = useState<number>(2200000);

  // Capital Stack Percentages
  const [equityPct, setEquityPct] = useState<number>(10); // Buyer equity (Min SBA is typically 10%)
  const [sellerNotePct, setSellerNotePct] = useState<number>(15); // Standby Seller debt

  // Derived Senior Debt %
  const seniorDebtPct = Math.max(0, 100 - equityPct - sellerNotePct);

  // Debt Parameters
  const [seniorRate, setSeniorRate] = useState<number>(11.25); // SBA prevailing rate
  const [seniorTerm, setSeniorTerm] = useState<number>(10); // Standard SBA term (10 Years)
  const [sellerRate, setSellerRate] = useState<number>(7.5);
  const [sellerTerm, setSellerTerm] = useState<number>(10);
  const [isSellerStandby, setIsSellerStandby] = useState<boolean>(true); // Standby notes don't amortize (interest-only or accrued)
  const [sellerStandbyMode, setSellerStandbyMode] = useState<"interest-only" | "accrued">("interest-only");

  // Operational Projections State
  const [activeScenario, setActiveScenario] = useState<string>("base");
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [ebitdaMargin, setEbitdaMargin] = useState<number>(29.5);
  const [exitMultiple, setExitMultiple] = useState<number>(3.2);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);

  // Handle Scenario Switch
  const applyScenario = (key: string) => {
    setActiveScenario(key);
    const sc = SCENARIOS[key];
    setGrowthRate(sc.growth);
    setEbitdaMargin(sc.margin);
    setExitMultiple(sc.exitMultiple);
  };

  // Keep manual updates synced with Custom Scenario if they deviate
  const handleOperationalChange = (type: "growth" | "margin" | "exit", value: number) => {
    setActiveScenario("custom");
    if (type === "growth") setGrowthRate(value);
    if (type === "margin") setEbitdaMargin(value);
    if (type === "exit") setExitMultiple(value);
  };

  // Capital Stack Absolute Sums
  const equityAmt = (purchasePrice * equityPct) / 100;
  const sellerAmt = (purchasePrice * sellerNotePct) / 100;
  const seniorAmt = (purchasePrice * seniorDebtPct) / 100;

  // Monthly Debt Service Calculations (Amortization PMT Formula)
  const calculatePMT = (principal: number, annualRate: number, years: number) => {
    if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  };

  // Debt Service (Annualized)
  const seniorAnnualPMT = calculatePMT(seniorAmt, seniorRate, seniorTerm) * 12;
  
  let sellerAnnualPMT = 0;
  if (sellerAmt > 0) {
    if (isSellerStandby) {
      if (sellerStandbyMode === "interest-only") {
        sellerAnnualPMT = (sellerAmt * sellerRate) / 100;
      } else {
        // Accrued: added to principal, paid at exit, 0 annual payment
        sellerAnnualPMT = 0;
      }
    } else {
      sellerAnnualPMT = calculatePMT(sellerAmt, sellerRate, sellerTerm) * 12;
    }
  }

  const totalYear1DebtService = seniorAnnualPMT + sellerAnnualPMT;
  const year1Dscr = totalYear1DebtService > 0 ? ebitda / totalYear1DebtService : 0;
  const year1Fcf = ebitda - totalYear1DebtService;
  const year1Coc = equityAmt > 0 ? (year1Fcf / equityAmt) * 100 : 0;

  // Compute Remaining Debt Balance at year t
  const getRemainingBalance = (principal: number, annualRate: number, termYears: number, elapsedYears: number) => {
    if (elapsedYears >= termYears) return 0;
    const r = annualRate / 12 / 100;
    const n = termYears * 12;
    const p = elapsedYears * 12;
    return principal * (Math.pow(1 + r, n) - Math.pow(1 + r, p)) / (Math.pow(1 + r, n) - 1);
  };

  // Multi-Year Model Projection Engine
  const projection = Array.from({ length: holdingPeriod }, (_, i) => {
    const year = i + 1;
    const projectedRev = revenue * Math.pow(1 + growthRate / 100, year);
    const projectedEbitda = projectedRev * (ebitdaMargin / 100);

    // Remaining Senior Balance at start of year
    const seniorBalStart = getRemainingBalance(seniorAmt, seniorRate, seniorTerm, i);
    const seniorBalEnd = getRemainingBalance(seniorAmt, seniorRate, seniorTerm, year);

    // Seller note balance projection
    let sellerBalEnd = sellerAmt;
    if (sellerAmt > 0) {
      if (!isSellerStandby) {
        sellerBalEnd = getRemainingBalance(sellerAmt, sellerRate, sellerTerm, year);
      } else if (sellerStandbyMode === "accrued") {
        // Accrues annually compounded
        sellerBalEnd = sellerAmt * Math.pow(1 + sellerRate / 100, year);
      }
    }

    const netCashflow = projectedEbitda - totalYear1DebtService; // Simplification of flat-debt schedule

    return {
      year,
      revenue: projectedRev,
      ebitda: projectedEbitda,
      seniorDebtBalance: seniorBalEnd,
      sellerDebtBalance: sellerBalEnd,
      totalDebtBalance: seniorBalEnd + sellerBalEnd,
      debtService: totalYear1DebtService,
      fcf: netCashflow,
    };
  });

  // Exit Return Analysis
  const exitYearData = projection[projection.length - 1] || { ebitda: ebitda, totalDebtBalance: seniorAmt + sellerAmt };
  const exitEnterpriseValue = exitYearData.ebitda * exitMultiple;
  
  // Total ending debt paydown calculations
  const exitDebtOutstanding = exitYearData.totalDebtBalance;
  const exitEquityValue = Math.max(0, exitEnterpriseValue - exitDebtOutstanding);

  // Cumulative FCF during holds
  const cumulativeFcf = projection.reduce((sum, item) => sum + item.fcf, 0);

  // IRR Calculation
  // Cash Outflows: Year 0 = -EquityAmt
  // Cash Inflows: Year 1..n-1 = FCF, Year n = FCF + ExitEquityValue
  const cashFlows = [-equityAmt, ...projection.map((p, idx) => (idx === projection.length - 1 ? p.fcf + exitEquityValue : p.fcf))];

  const calculateIRR = (cfs: number[]): number => {
    let r = 0.1; // initial guess
    const maxIterations = 200;
    const precision = 0.0001;

    for (let k = 0; k < maxIterations; k++) {
      let npv = 0;
      let dNpv = 0; // first derivative
      for (let t = 0; t < cfs.length; t++) {
        npv += cfs[t] / Math.pow(1 + r, t);
        dNpv -= (t * cfs[t]) / Math.pow(1 + r, t + 1);
      }
      const newR = r - npv / dNpv;
      if (Math.abs(newR - r) < precision) {
        return newR * 100;
      }
      r = newR;
    }
    return r * 100;
  };

  const irrResult = equityAmt > 0 ? calculateIRR(cashFlows) : 0;
  const moicResult = equityAmt > 0 ? (cumulativeFcf + exitEquityValue) / equityAmt : 0;

  // Formatting utilities
  const formatCompact = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <div className="w-full bg-[#050505] text-[#F9F9F9] font-sans border border-[#222222] glow-toxic">
      {/* Top Header / System Banner */}
      <div className="border-b border-[#222222] bg-[#090909] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#00FF66] animate-pulse"></span>
            <span className="font-mono text-xs text-[#00FF66] tracking-widest uppercase">
              SECURE DEBT MODELLING ENGINE v4.18
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-1">
            Leveraged Buyout (LBO) Interactive Workspace
          </h2>
        </div>

        {/* Dynamic Risk Rating */}
        <div className="flex items-center space-x-2 bg-black border border-[#222222] px-4 py-2">
          <span className="font-mono text-[10px] text-[#888]">QUALIFIED DSCR STATUS:</span>
          <span
            className={`font-mono text-xs font-bold ${
              year1Dscr >= 1.25 ? "text-[#00FF66]" : year1Dscr >= 1.1 ? "text-[#0EA5E9]" : "text-[#FF3333]"
            }`}
          >
            {year1Dscr >= 1.25 ? "SBA PASS" : year1Dscr >= 1.1 ? "CAUTION / TIGHT" : "REJECTED"}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
        {/* Left Control Panel Column */}
        <div className="xl:col-span-5 border-r border-[#222222] p-6 space-y-6 bg-[#080808]">
          
          {/* Target Valuation Fields */}
          <div>
            <span className="font-mono text-[10px] text-[#888] block tracking-wider mb-2">
              01 / ENTRY TRANSACTION ASSUMPTIONS
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black p-3 border border-[#222222]">
                <label className="font-mono text-[9px] text-[#666] block">PURCHASE PRICE</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-transparent border-0 text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 focus:outline-none p-0 mt-1"
                />
              </div>
              <div className="bg-black p-3 border border-[#222222]">
                <label className="font-mono text-[9px] text-[#666] block">CURRENT EBITDA</label>
                <input
                  type="number"
                  value={ebitda}
                  onChange={(e) => setEbitda(Number(e.target.value))}
                  className="w-full bg-transparent border-0 text-xs font-mono font-bold text-[#00FF66] focus:ring-0 focus:outline-none p-0 mt-1"
                />
              </div>
              <div className="bg-black p-3 border border-[#222222]">
                <label className="font-mono text-[9px] text-[#666] block">ANNUAL REVENUE</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full bg-transparent border-0 text-xs font-mono font-bold text-[#0EA5E9] focus:ring-0 focus:outline-none p-0 mt-1"
                />
              </div>
            </div>
            <div className="mt-1 flex justify-between text-[9px] font-mono text-[#555]">
              <span>IMPLIED MULTIPLE: {(purchasePrice / Math.max(1, ebitda)).toFixed(2)}x</span>
              <span>EBITDA MARGIN: {((ebitda / Math.max(1, revenue)) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Capital Stack Sliders */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-[#888] tracking-wider">
                02 / CAPITAL STRUCTURE STACK (%)
              </span>
              <span className="font-mono text-[9px] text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5">
                TOTAL: {equityPct + sellerNotePct + seniorDebtPct}%
              </span>
            </div>

            <div className="bg-black p-4 border border-[#222222] space-y-4">
              {/* Cash Equity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">Buyer Cash Equity</span>
                  <span className="text-[#F9F9F9] font-bold">{equityPct}% ({formatCompact(equityAmt)})</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={equityPct}
                  onChange={(e) => setEquityPct(Number(e.target.value))}
                  className="w-full h-1 bg-[#222] accent-[#00FF66] cursor-pointer appearance-none rounded-none"
                />
              </div>

              {/* Seller Note Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#888]">Seller Standby Note</span>
                  <span className="text-[#F9F9F9] font-bold">{sellerNotePct}% ({formatCompact(sellerAmt)})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={sellerNotePct}
                  onChange={(e) => setSellerNotePct(Number(e.target.value))}
                  className="w-full h-1 bg-[#222] accent-[#0EA5E9] cursor-pointer appearance-none rounded-none"
                />
              </div>

              {/* Calculated Senior Debt Stack */}
              <div className="pt-2 border-t border-[#161616] flex justify-between items-center text-xs font-mono">
                <span className="text-[#888]">Required Senior Debt (SBA 7a):</span>
                <span className="text-[#00FF66] font-bold">
                  {seniorDebtPct}% ({formatCompact(seniorAmt)})
                </span>
              </div>
            </div>
          </div>

          {/* Debt Modeling Parameters */}
          <div>
            <span className="font-mono text-[10px] text-[#888] block tracking-wider mb-2">
              03 / UNDERWRITING DEBT TERMS
            </span>
            <div className="grid grid-cols-2 gap-4 bg-black p-4 border border-[#222222]">
              
              {/* Senior Debt Rates */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#666] block border-b border-[#222] pb-1">
                  SENIOR LEVERAGE (SBA)
                </span>
                <div>
                  <label className="font-mono text-[9px] text-[#888] block">INTEREST RATE (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={seniorRate}
                    onChange={(e) => setSeniorRate(Number(e.target.value))}
                    className="w-full bg-transparent border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 focus:outline-none p-0 mt-1"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-[#888] block">AMORTIZATION (YRS)</label>
                  <input
                    type="number"
                    value={seniorTerm}
                    onChange={(e) => setSeniorTerm(Number(e.target.value))}
                    className="w-full bg-transparent border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 focus:outline-none p-0 mt-1"
                  />
                </div>
              </div>

              {/* Seller Note Options */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#666] block border-b border-[#222] pb-1">
                  SELLER STANDBY NOTE
                </span>
                <div>
                  <label className="font-mono text-[9px] text-[#888] block">INTEREST RATE (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={sellerRate}
                    onChange={(e) => setSellerRate(Number(e.target.value))}
                    className="w-full bg-transparent border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 focus:outline-none p-0 mt-1"
                  />
                </div>

                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="font-mono text-[9px] text-[#888]">FULL STANDBY</span>
                  <input
                    type="checkbox"
                    checked={isSellerStandby}
                    onChange={(e) => setIsSellerStandby(e.target.checked)}
                    className="rounded-none bg-black border-[#333] text-[#00FF66] focus:ring-0"
                  />
                </div>

                {isSellerStandby && (
                  <div className="flex space-x-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setSellerStandbyMode("interest-only")}
                      className={`text-[8px] font-mono px-1.5 py-0.5 border ${
                        sellerStandbyMode === "interest-only"
                          ? "border-[#0EA5E9] text-[#0EA5E9] bg-[#0ea5e9]/10"
                          : "border-[#222] text-[#666]"
                      }`}
                    >
                      INT ONLY
                    </button>
                    <button
                      type="button"
                      onClick={() => setSellerStandbyMode("accrued")}
                      className={`text-[8px] font-mono px-1.5 py-0.5 border ${
                        sellerStandbyMode === "accrued"
                          ? "border-[#0EA5E9] text-[#0EA5E9] bg-[#0ea5e9]/10"
                          : "border-[#222] text-[#666]"
                      }`}
                    >
                      ACCRUE EXIT
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Operational Hold/Growth Assumptions */}
          <div>
            <span className="font-mono text-[10px] text-[#888] block tracking-wider mb-2">
              04 / POST-ACQUISITION OPERATIONAL SCENARIOS
            </span>
            <div className="space-y-4">
              {/* Scenario Toggles */}
              <div className="grid grid-cols-3 gap-1">
                {Object.keys(SCENARIOS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyScenario(key)}
                    className={`text-[10px] font-mono py-2 text-center border uppercase transition-colors ${
                      activeScenario === key
                        ? "bg-[#00FF66] text-black font-bold border-[#00FF66]"
                        : "border-[#222222] text-[#888] hover:border-[#444] hover:text-[#fff]"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Adjustable Inputs */}
              <div className="bg-black p-4 border border-[#222222] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#888]">Revenue Growth Rate</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={growthRate}
                      onChange={(e) => handleOperationalChange("growth", Number(e.target.value))}
                      className="w-12 bg-transparent text-right border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 p-0"
                    />
                    <span className="font-mono text-xs text-[#666]">%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#888]">EBITDA Margin</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={ebitdaMargin}
                      onChange={(e) => handleOperationalChange("margin", Number(e.target.value))}
                      className="w-12 bg-transparent text-right border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 p-0"
                    />
                    <span className="font-mono text-xs text-[#666]">%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#888]">Exit Multiple (x)</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={exitMultiple}
                      onChange={(e) => handleOperationalChange("exit", Number(e.target.value))}
                      className="w-12 bg-transparent text-right border-0 border-b border-[#333] text-xs font-mono font-bold text-[#F9F9F9] focus:ring-0 p-0"
                    />
                    <span className="font-mono text-xs text-[#666]">x</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#161616]">
                  <span className="font-mono text-xs text-[#888]">Holding Period</span>
                  <div className="flex items-center space-x-1">
                    <select
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                      className="bg-[#050505] border border-[#222] font-mono text-xs text-[#F9F9F9] px-2 py-1 focus:ring-0"
                    >
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                      <option value={7}>7 Years</option>
                      <option value={10}>10 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output HUD & Table Projection */}
        <div className="xl:col-span-7 p-6 space-y-6 flex flex-col justify-between">
          
          {/* Key Metric Blocks */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[#888] block tracking-wider">
              05 / CORE TRANSACTION RETURN RATIOS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="bg-black border border-[#222222] p-4 text-center">
                <span className="font-mono text-[8px] text-[#666] block uppercase">PROJECTED IRR</span>
                <span className="text-xl font-bold text-[#00FF66] tracking-tight block mt-1">
                  {irrResult.toFixed(1)}%
                </span>
                <span className="font-mono text-[8px] text-[#444] block mt-0.5">UNLEVERED CASH ROI</span>
              </div>

              <div className="bg-black border border-[#222222] p-4 text-center">
                <span className="font-mono text-[8px] text-[#666] block uppercase">MULTIPLE ON INVESTED (MoIC)</span>
                <span className="text-xl font-bold text-[#0EA5E9] tracking-tight block mt-1">
                  {moicResult.toFixed(2)}x
                </span>
                <span className="font-mono text-[8px] text-[#444] block mt-0.5">CAPITAL RETURN MULTIPLE</span>
              </div>

              <div className="bg-black border border-[#222222] p-4 text-center">
                <span className="font-mono text-[8px] text-[#666] block uppercase">YEAR 1 FCF YIELD (CoC)</span>
                <span className="text-xl font-bold text-[#F9F9F9] tracking-tight block mt-1">
                  {year1Coc.toFixed(1)}%
                </span>
                <span className="font-mono text-[8px] text-[#444] block mt-0.5">YEAR 1 CASH REVENUE</span>
              </div>

              <div className="bg-black border border-[#222222] p-4 text-center">
                <span className="font-mono text-[8px] text-[#666] block uppercase">MIN DSCR</span>
                <span
                  className={`text-xl font-bold tracking-tight block mt-1 ${
                    year1Dscr >= 1.25 ? "text-[#00FF66]" : "text-[#FF3333]"
                  }`}
                >
                  {year1Dscr.toFixed(2)}x
                </span>
                <span className="font-mono text-[8px] text-[#444] block mt-0.5">SBA MIN REQ: 1.15x</span>
              </div>
            </div>

            {/* Visual Capital Stack Bar */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#888] block tracking-wider">
                DEAL STRUCTURE CAPITAL STACK DYNAMICS
              </span>
              <div className="w-full h-8 bg-black flex border border-[#222222] overflow-hidden">
                <div
                  style={{ width: `${equityPct}%` }}
                  className="bg-[#00FF66] h-full flex items-center justify-center font-mono text-[9px] text-black font-extrabold"
                  title={`Buyer Equity: ${equityPct}%`}
                >
                  {equityPct >= 10 && `EQUITY: ${equityPct}%`}
                </div>
                <div
                  style={{ width: `${sellerNotePct}%` }}
                  className="bg-[#0EA5E9] h-full flex items-center justify-center font-mono text-[9px] text-black font-extrabold"
                  title={`Seller Note: ${sellerNotePct}%`}
                >
                  {sellerNotePct >= 10 && `SELLER NOTE: ${sellerNotePct}%`}
                </div>
                <div
                  style={{ width: `${seniorDebtPct}%` }}
                  className="bg-neutral-800 h-full flex items-center justify-center font-mono text-[9px] text-[#aaa] font-semibold"
                  title={`Senior SBA Debt: ${seniorDebtPct}%`}
                >
                  {seniorDebtPct >= 10 && `SBA SENIOR DEBT: ${seniorDebtPct}%`}
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#555]">
                <span>EQUITY: {formatCompact(equityAmt)}</span>
                <span>SELLER NOTE: {formatCompact(sellerAmt)}</span>
                <span>SBA SENIOR: {formatCompact(seniorAmt)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Projection Grid */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-[#888] block tracking-wider">
              06 / HOLDING PERIOD ANNUAL CASH Projections
            </span>

            <div className="border border-[#222222] overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                <thead>
                  <tr className="bg-[#090909] text-[#888] border-b border-[#222222]">
                    <th className="p-3">YEAR</th>
                    <th className="p-3">REVENUE</th>
                    <th className="p-3">EBITDA</th>
                    <th className="p-3">DEBT SERVICE</th>
                    <th className="p-3">NET CASH FLOW</th>
                    <th className="p-3">DEBT REMAINING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818] bg-black">
                  {projection.map((row) => (
                    <tr key={row.year} className="hover:bg-[#080808]">
                      <td className="p-3 text-white font-bold">{row.year}</td>
                      <td className="p-3 text-[#ccc]">{formatCompact(row.revenue)}</td>
                      <td className="p-3 text-[#00FF66] font-semibold">{formatCompact(row.ebitda)}</td>
                      <td className="p-3 text-[#FF3333]">{formatCompact(row.debtService)}</td>
                      <td className="p-3 text-white font-bold">{formatCompact(row.fcf)}</td>
                      <td className="p-3 text-[#0EA5E9]">{formatCompact(row.totalDebtBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sizing Advisory */}
          <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 p-4 mt-4 space-y-2">
            <span className="font-mono text-[9px] text-[#00FF66] font-bold block uppercase tracking-wider">
              UNDERWRITING COMPLIANCE SIGNALS
            </span>
            <p className="text-xs text-[#888] leading-relaxed">
              Based on your custom settings, the exit valuation of the business is projected at{" "}
              <span className="text-white font-bold">{formatCompact(exitEnterpriseValue)}</span> using a multiple of{" "}
              <span className="text-white font-bold">{exitMultiple}x</span>. Over the holding cycle, you pay down{" "}
              <span className="text-[#0EA5E9] font-bold">
                {formatCompact(seniorAmt + sellerAmt - exitDebtOutstanding)}
              </span>{" "}
              in total liabilities, returning an equity distribution of{" "}
              <span className="text-[#00FF66] font-bold">{formatCompact(exitEquityValue)}</span> to shareholders upon liqudation exit.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}