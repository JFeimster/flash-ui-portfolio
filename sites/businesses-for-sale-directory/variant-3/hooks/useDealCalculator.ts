import { useState, useMemo } from 'react';

interface CalculatorInputs {
  purchasePrice: number;
  sde: number;
  addBacks: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
}

interface CalculationResults {
  totalSde: number;
  loanAmount: number;
  equityContribution: number;
  annualDebtService: number;
  dscr: number;
  postDebtCashFlow: number;
  roi: number;
  paybackYears: number;
  sensitivityData: { rate: number; dscr: number; cashFlow: number }[];
}

export const useDealCalculator = (initialInputs: Partial<CalculatorInputs> = {}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    purchasePrice: initialInputs.purchasePrice || 1000000,
    sde: initialInputs.sde || 300000,
    addBacks: initialInputs.addBacks || 25000,
    downPaymentPercent: initialInputs.downPaymentPercent || 10,
    interestRate: initialInputs.interestRate || 11.5,
    loanTermYears: initialInputs.loanTermYears || 10,
  });

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const results = useMemo((): CalculationResults => {
    const totalSde = inputs.sde + inputs.addBacks;
    const equityContribution = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
    const loanAmount = inputs.purchasePrice - equityContribution;

    // Standard PMT formula for annual debt service
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTermYears * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = 
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }

    const annualDebtService = monthlyPayment * 12;
    const dscr = annualDebtService > 0 ? totalSde / annualDebtService : 0;
    const postDebtCashFlow = totalSde - annualDebtService;
    const roi = equityContribution > 0 ? (postDebtCashFlow / equityContribution) * 100 : 0;
    const paybackYears = postDebtCashFlow > 0 ? equityContribution / postDebtCashFlow : 0;

    // Generate Sensitivity Data for Interest Rate Variations (+/- 3%)
    const sensitivityData = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
      const testRate = Math.max(0.1, inputs.interestRate + offset);
      const testMonthlyRate = testRate / 100 / 12;
      const testMonthlyPayment = 
        (loanAmount * testMonthlyRate * Math.pow(1 + testMonthlyRate, numberOfPayments)) /
        (Math.pow(1 + testMonthlyRate, numberOfPayments) - 1);
      
      const testAnnualDebt = testMonthlyPayment * 12;
      return {
        rate: testRate,
        dscr: totalSde / testAnnualDebt,
        cashFlow: totalSde - testAnnualDebt
      };
    });

    return {
      totalSde,
      loanAmount,
      equityContribution,
      annualDebtService,
      dscr,
      postDebtCashFlow,
      roi,
      paybackYears,
      sensitivityData
    };
  }, [inputs]);

  return {
    inputs,
    results,
    updateInput
  };
};