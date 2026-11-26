import { useState, useMemo, useCallback } from 'react';

export interface LboInputs {
  purchasePrice: number;
  ebitda: number;
  revenue: number;
  workingCapitalReserve: number;
  buyerEquityPct: number;
  sellerNotePct: number;
  sellerNoteType: 'deferred' | 'interest-only' | 'amortizing';
  sellerNoteInterestRate: number;
  sellerNoteTermYears: number;
  sbaInterestRate: number;
  sbaTermYears: number;
  capexReservePct: number;
}

export interface LboOutputs {
  totalEnterpriseValue: number;
  buyerEquityAmount: number;
  sellerNoteAmount: number;
  sbaDebtAmount: number;
  sbaAnnualDebtService: number;
  sellerNoteAnnualDebtService: number;
  totalAnnualDebtService: number;
  capexReserveAmount: number;
  postDebtCashFlow: number;
  dscr: number;
  cashOnCashReturn: number;
  sbaPct: number;
  impliedMultiple: number;
  ebitdaMargin: number;
  isCompliant: boolean;
  warnings: string[];
}

export type LboPreset = 'sba-standard' | 'high-seller-note' | 'aggressive-leverage' | 'conservative-equity';

const INITIAL_INPUTS: LboInputs = {
  purchasePrice: 1800000,
  ebitda: 620000,
  revenue: 2400000,
  workingCapitalReserve: 150000,
  buyerEquityPct: 10,
  sellerNotePct: 15,
  sellerNoteType: 'deferred',
  sellerNoteInterestRate: 8.0,
  sellerNoteTermYears: 10,
  sbaInterestRate: 11.25,
  sbaTermYears: 10,
  capexReservePct: 5,
};

const PRESETS: Record<LboPreset, Partial<LboInputs>> = {
  'sba-standard': {
    buyerEquityPct: 10,
    sellerNotePct: 15,
    sellerNoteType: 'deferred',
    sbaInterestRate: 11.25,
    sbaTermYears: 10,
  },
  'high-seller-note': {
    buyerEquityPct: 10,
    sellerNotePct: 25,
    sellerNoteType: 'interest-only',
    sellerNoteInterestRate: 7.5,
    sbaInterestRate: 11.25,
    sbaTermYears: 10,
  },
  'aggressive-leverage': {
    buyerEquityPct: 5,
    sellerNotePct: 5,
    sellerNoteType: 'deferred',
    sbaInterestRate: 11.5,
    sbaTermYears: 10,
  },
  'conservative-equity': {
    buyerEquityPct: 25,
    sellerNotePct: 10,
    sellerNoteType: 'amortizing',
    sellerNoteInterestRate: 6.5,
    sellerNoteTermYears: 5,
    sbaInterestRate: 11.0,
    sbaTermYears: 10,
  },
};

export function useLboCalculator(initialDealOverride?: Partial<LboInputs>) {
  const [inputs, setInputs] = useState<LboInputs>({
    ...INITIAL_INPUTS,
    ...initialDealOverride,
  });

  const updateInput = useCallback(<K extends keyof LboInputs>(key: K, value: LboInputs[K]) => {
    setInputs((prev) => {
      const next = { ...prev, [key]: value };

      // Maintain valid equity/seller note bounds (max 100% combined)
      if (key === 'buyerEquityPct' || key === 'sellerNotePct') {
        const equity = next.buyerEquityPct;
        const seller = next.sellerNotePct;
        if (equity + seller > 100) {
          if (key === 'buyerEquityPct') {
            next.sellerNotePct = 100 - equity;
          } else {
            next.buyerEquityPct = 100 - seller;
          }
        }
      }
      return next;
    });
  }, []);

  const applyPreset = useCallback((preset: LboPreset) => {
    setInputs((prev) => ({
      ...prev,
      ...PRESETS[preset],
    }));
  }, []);

  const outputs = useMemo<LboOutputs>(() => {
    const {
      purchasePrice,
      ebitda,
      revenue,
      workingCapitalReserve,
      buyerEquityPct,
      sellerNotePct,
      sellerNoteType,
      sellerNoteInterestRate,
      sellerNoteTermYears,
      sbaInterestRate,
      sbaTermYears,
      capexReservePct,
    } = inputs;

    const sbaPct = Math.max(0, 100 - buyerEquityPct - sellerNotePct);
    const impliedMultiple = ebitda > 0 ? purchasePrice / ebitda : 0;
    const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

    const sbaDebtAmount = purchasePrice * (sbaPct / 100);
    const sellerNoteAmount = purchasePrice * (sellerNotePct / 100);
    const buyerEquityAmount = purchasePrice * (buyerEquityPct / 100) + workingCapitalReserve;
    const totalEnterpriseValue = purchasePrice + workingCapitalReserve;

    // Standard Amortization PMT calculation
    const calculateAnnualPmt = (principal: number, annualRate: number, termYears: number): number => {
      if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
      const r = annualRate / 100 / 12;
      const n = termYears * 12;
      const monthlyPmt = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      return monthlyPmt * 12;
    };

    const sbaAnnualDebtService = calculateAnnualPmt(sbaDebtAmount, sbaInterestRate, sbaTermYears);

    let sellerNoteAnnualDebtService = 0;
    if (sellerNoteType === 'interest-only') {
      sellerNoteAnnualDebtService = sellerNoteAmount * (sellerNoteInterestRate / 100);
    } else if (sellerNoteType === 'amortizing') {
      sellerNoteAnnualDebtService = calculateAnnualPmt(sellerNoteAmount, sellerNoteInterestRate, sellerNoteTermYears);
    } // 'deferred' type yields 0 current debt service (full standby rules)

    const totalAnnualDebtService = sbaAnnualDebtService + sellerNoteAnnualDebtService;
    const capexReserveAmount = ebitda * (capexReservePct / 100);
    const postDebtCashFlow = ebitda - totalAnnualDebtService - capexReserveAmount;

    const dscr = totalAnnualDebtService > 0 ? ebitda / totalAnnualDebtService : 99.9;
    const cashOnCashReturn = buyerEquityAmount > 0 ? (postDebtCashFlow / buyerEquityAmount) * 100 : 0;

    // SBA Compliance Checks & Safety Thresholds
    const warnings: string[] = [];
    if (dscr < 1.25) {
      warnings.push('CRITICAL: Debt Service Coverage Ratio (DSCR) falls below standard SBA threshold of 1.25x.');
    } else if (dscr < 1.5) {
      warnings.push('CAUTION: Leveraged cash flow offers thin operational cushion (DSCR < 1.50x).');
    }

    const totalEquityInjectedPct = buyerEquityPct + (sellerNoteType === 'deferred' ? sellerNotePct : 0);
    if (totalEquityInjectedPct < 10) {
      warnings.push('SBA COMPLIANCE: Combined buyer equity and standby seller note must total at least 10% of transaction size.');
    }

    if (sbaDebtAmount > 5000000) {
      warnings.push('LIMIT EXCEEDED: Calculated SBA 7(a) senior debt exceeds the statutory cap of $5.0M.');
    }

    if (postDebtCashFlow < 0) {
      warnings.push('NEGATIVE FLOW: Post-leverage cash flow is highly negative. Insolvency risk detected.');
    }

    const isCompliant = dscr >= 1.25 && totalEquityInjectedPct >= 10 && sbaDebtAmount <= 5000000 && postDebtCashFlow > 0;

    return {
      totalEnterpriseValue,
      buyerEquityAmount,
      sellerNoteAmount,
      sbaDebtAmount,
      sbaAnnualDebtService,
      sellerNoteAnnualDebtService,
      totalAnnualDebtService,
      capexReserveAmount,
      postDebtCashFlow,
      dscr,
      cashOnCashReturn,
      sbaPct,
      impliedMultiple,
      ebitdaMargin,
      isCompliant,
      warnings,
    };
  }, [inputs]);

  return {
    inputs,
    outputs,
    updateInput,
    applyPreset,
  };
}