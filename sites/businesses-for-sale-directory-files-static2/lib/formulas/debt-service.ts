export interface LBOInput {
  askingPrice: number;
  ebitda: number;
  buyerEquityPct: number;       // e.g., 10 for 10%
  sellerNotePct: number;        // e.g., 15 for 15%
  sbaInterestRate: number;      // e.g., 0.1125 for 11.25%
  sellerNoteInterestRate: number; // e.g., 0.08 for 8%
  sbaTermYears?: number;        // Standard 10 years for SBA 7(a)
  sellerNoteTermYears?: number; // Standard 5-7 years
  isSellerNoteAmortized?: boolean; // Amortized vs Interest-only standby
}

export interface LBOModelResult {
  buyerEquityAmount: number;
  sellerNoteAmount: number;
  sbaDebtAmount: number;
  sbaAnnualDebtService: number;
  sellerNoteAnnualDebtService: number;
  totalAnnualDebtService: number;
  netPostDebtCashFlow: number;
  dscr: number;
  cashOnCashReturn: number;
  debtToEbitdaRatio: number;
}

/**
 * Standard Amortizing Loan Payment (PMT) Formula
 * PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  
  const monthlyRate = annualRate / 12;
  const totalPayments = termYears * 12;
  
  try {
    const payment = 
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    return isNaN(payment) || !isFinite(payment) ? 0 : payment;
  } catch (error) {
    return 0;
  }
}

/**
 * Executes high-fidelity SBA 7(a) and LBO structure simulations
 * for acquisition modeling workspace.
 */
export function runLBOModel(input: LBOInput): LBOModelResult {
  const {
    askingPrice,
    ebitda,
    buyerEquityPct,
    sellerNotePct,
    sbaInterestRate,
    sellerNoteInterestRate,
    sbaTermYears = 10,
    sellerNoteTermYears = 5,
    isSellerNoteAmortized = false,
  } = input;

  // Derive structural allocations (Equity + Seller Note + SBA Debt must equal 100%)
  const rawSbaPct = 100 - buyerEquityPct - sellerNotePct;
  const sbaDebtPct = Math.max(0, rawSbaPct);

  // Capital Stack Absolute Dollar Projections
  const buyerEquityAmount = askingPrice * (buyerEquityPct / 100);
  const sellerNoteAmount = askingPrice * (sellerNotePct / 100);
  const sbaDebtAmount = askingPrice * (sbaDebtPct / 100);

  // Calculate SBA 7(a) Debt Service (Always fully amortized)
  const sbaMonthlyPayment = calculateMonthlyPayment(sbaDebtAmount, sbaInterestRate, sbaTermYears);
  const sbaAnnualDebtService = sbaMonthlyPayment * 12;

  // Calculate Seller Note Debt Service
  let sellerNoteAnnualDebtService = 0;
  if (sellerNoteAmount > 0) {
    if (isSellerNoteAmortized) {
      const sellerMonthlyPayment = calculateMonthlyPayment(sellerNoteAmount, sellerNoteInterestRate, sellerNoteTermYears);
      sellerNoteAnnualDebtService = sellerMonthlyPayment * 12;
    } else {
      // Interest-Only Standby Structure
      sellerNoteAnnualDebtService = sellerNoteAmount * sellerNoteInterestRate;
    }
  }

  // Combined debt load calculations
  const totalAnnualDebtService = sbaAnnualDebtService + sellerNoteAnnualDebtService;
  const netPostDebtCashFlow = ebitda - totalAnnualDebtService;

  // DSCR = EBITDA / Total Annual Debt Service
  const dscr = totalAnnualDebtService > 0 ? ebitda / totalAnnualDebtService : 99.9;

  // Cash-on-Cash Return = Net Cash Flow / Buyer Cash Equity
  const cashOnCashReturn = buyerEquityAmount > 0 ? (netPostDebtCashFlow / buyerEquityAmount) * 100 : 0;

  // Leverage Multiple = Total Debt / EBITDA
  const totalDebt = sbaDebtAmount + sellerNoteAmount;
  const debtToEbitdaRatio = ebitda > 0 ? totalDebt / ebitda : 0;

  return {
    buyerEquityAmount: Math.round(buyerEquityAmount),
    sellerNoteAmount: Math.round(sellerNoteAmount),
    sbaDebtAmount: Math.round(sbaDebtAmount),
    sbaAnnualDebtService: Math.round(sbaAnnualDebtService),
    sellerNoteAnnualDebtService: Math.round(sellerNoteAnnualDebtService),
    totalAnnualDebtService: Math.round(totalAnnualDebtService),
    netPostDebtCashFlow: Math.round(netPostDebtCashFlow),
    dscr: parseFloat(dscr.toFixed(2)),
    cashOnCashReturn: parseFloat(cashOnCashReturn.toFixed(2)),
    debtToEbitdaRatio: parseFloat(debtToEbitdaRatio.toFixed(2)),
  };
}