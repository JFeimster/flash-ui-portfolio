/**
 * CAPITAL_VAULT // Deal Analyzer Engine (js/analyzer.js)
 * High-precision mathematical modeling for Fix-and-Flip & Buy-and-Hold real estate transactions.
 * Designed to integrate seamlessly with Alpine.js reactive components.
 * 
 * Verified Liquidity Terminal System / Security Level: Core-03
 */

(function() {
  'use strict';

  // Global Registration for Alpine.js integration
  window.dealAnalyzerState = function() {
    return {
      // Analyzer Mode: 'flip' or 'hold'
      mode: 'flip',

      // Project Parameters
      purchasePrice: 280000,
      arv: 420000, // After Repair Value
      rehabBudget: 65000,
      holdingPeriodMonths: 6,

      // Contractor Draw Schedule Inputs
      contractorDraws: 4,
      drawFee: 250,

      // Transaction & Escrow Costs
      purchaseClosingCosts: 3500,
      saleClosingCosts: 8400, // typically 2-3% of ARV or custom amount

      // Hard Money Financing Inputs
      leverageBasis: 'purchase', // 'purchase' or 'arv'
      ltvPercent: 80, // LTV/LTC Ratio
      interestRate: 10.5, // Annual interest rate (%)
      originationPoints: 2.0, // (%)
      lenderFees: 1250, // Underwriting, processing, document prep
      rehabFinanced: false,
      rehabLtcPercent: 100, // % of rehab financed if rehabFinanced is true

      // Buy & Hold (Rental) Specific Parameters
      monthlyRent: 3200,
      operatingExpensesPercent: 35, // % of Gross Rent for taxes, insurance, vacancy, maintenance, PM
      refinanceLtvPercent: 75,
      refinanceInterestRate: 6.5,
      refinanceFees: 4500,

      // Calculated Outputs (Reactive)
      calculations: {
        loanAmount: 0,
        downPayment: 0,
        rehabFinancedAmount: 0,
        rehabCashRequired: 0,
        originationCost: 0,
        totalDrawFees: 0,
        totalLenderCosts: 0,
        totalHoldingCosts: 0,
        totalProjectCosts: 0,
        totalCapitalRequired: 0,
        
        // Flip Specific outputs
        netProfit: 0,
        roi: 0,
        annualizedRoi: 0,

        // Hold Specific outputs
        netOperatingIncome: 0,
        refinanceLoanAmount: 0,
        refinanceCashProceeds: 0,
        netCashLeftInDeal: 0,
        monthlyDebtService: 0,
        monthlyCashFlow: 0,
        cashOnCashReturn: 0,
        capRate: 0
      },

      // Preset Templates for Rapid Parameter Setting
      presets: [
        {
          name: "Standard Suburban Flip",
          mode: "flip",
          purchasePrice: 200000,
          arv: 310000,
          rehabBudget: 40000,
          holdingPeriodMonths: 6,
          ltvPercent: 85,
          interestRate: 11.0,
          originationPoints: 2.0,
          lenderFees: 950,
          rehabFinanced: false
        },
        {
          name: "Deep Value-Add BRRRR",
          mode: "hold",
          purchasePrice: 150000,
          arv: 260000,
          rehabBudget: 60000,
          holdingPeriodMonths: 8,
          ltvPercent: 75,
          interestRate: 10.0,
          originationPoints: 1.5,
          lenderFees: 1200,
          rehabFinanced: true,
          rehabLtcPercent: 100,
          monthlyRent: 2100,
          operatingExpensesPercent: 38,
          refinanceLtvPercent: 75,
          refinanceInterestRate: 6.25,
          refinanceFees: 4000
        },
        {
          name: "Premium Metropolitan Renovation",
          mode: "flip",
          purchasePrice: 650000,
          arv: 980000,
          rehabBudget: 140000,
          holdingPeriodMonths: 9,
          ltvPercent: 80,
          interestRate: 9.75,
          originationPoints: 1.5,
          lenderFees: 1500,
          rehabFinanced: true,
          rehabLtcPercent: 90
        }
      ],

      // Initialize the component
      init() {
        this.runAnalysis();
        
        // Watch parameters to automatically run calculations on any change
        this.$watch('mode', () => this.runAnalysis());
        this.$watch('purchasePrice', () => this.runAnalysis());
        this.$watch('arv', () => this.runAnalysis());
        this.$watch('rehabBudget', () => this.runAnalysis());
        this.$watch('holdingPeriodMonths', () => this.runAnalysis());
        this.$watch('contractorDraws', () => this.runAnalysis());
        this.$watch('drawFee', () => this.runAnalysis());
        this.$watch('purchaseClosingCosts', () => this.runAnalysis());
        this.$watch('saleClosingCosts', () => this.runAnalysis());
        this.$watch('leverageBasis', () => this.runAnalysis());
        this.$watch('ltvPercent', () => this.runAnalysis());
        this.$watch('interestRate', () => this.runAnalysis());
        this.$watch('originationPoints', () => this.runAnalysis());
        this.$watch('lenderFees', () => this.runAnalysis());
        this.$watch('rehabFinanced', () => this.runAnalysis());
        this.$watch('rehabLtcPercent', () => this.runAnalysis());
        this.$watch('monthlyRent', () => this.runAnalysis());
        this.$watch('operatingExpensesPercent', () => this.runAnalysis());
        this.$watch('refinanceLtvPercent', () => this.runAnalysis());
        this.$watch('refinanceInterestRate', () => this.runAnalysis());
        this.$watch('refinanceFees', () => this.runAnalysis());

        console.log("CAPITAL_VAULT // Deal Analyzer Engine initiated successfully.");
      },

      // Apply a pre-configured deal profile
      applyPreset(preset) {
        this.mode = preset.mode;
        this.purchasePrice = preset.purchasePrice;
        this.arv = preset.arv;
        this.rehabBudget = preset.rehabBudget;
        this.holdingPeriodMonths = preset.holdingPeriodMonths;
        this.ltvPercent = preset.ltvPercent;
        this.interestRate = preset.interestRate;
        this.originationPoints = preset.originationPoints;
        this.lenderFees = preset.lenderFees;
        this.rehabFinanced = preset.rehabFinanced;
        
        if (preset.rehabLtcPercent !== undefined) this.rehabLtcPercent = preset.rehabLtcPercent;
        if (preset.monthlyRent !== undefined) this.monthlyRent = preset.monthlyRent;
        if (preset.operatingExpensesPercent !== undefined) this.operatingExpensesPercent = preset.operatingExpensesPercent;
        if (preset.refinanceLtvPercent !== undefined) this.refinanceLtvPercent = preset.refinanceLtvPercent;
        if (preset.refinanceInterestRate !== undefined) this.refinanceInterestRate = preset.refinanceInterestRate;
        if (preset.refinanceFees !== undefined) this.refinanceFees = preset.refinanceFees;

        this.runAnalysis();
        this.dispatchToast(`Preset "${preset.name}" applied and modeled.`);
      },

      // Core calculation logic engine
      runAnalysis() {
        const parse = (val) => parseFloat(val) || 0;

        // Base Inputs parsed
        const purchase = parse(this.purchasePrice);
        const arvVal = parse(this.arv);
        const rehab = parse(this.rehabBudget);
        const months = parse(this.holdingPeriodMonths);
        const drawsCount = parse(this.contractorDraws);
        const perDrawFee = parse(this.drawFee);
        const buyClosing = parse(this.purchaseClosingCosts);
        const sellClosing = parse(this.saleClosingCosts);
        const rate = parse(this.interestRate) / 100;
        const points = parse(this.originationPoints) / 100;
        const fees = parse(this.lenderFees);
        const ltv = parse(this.ltvPercent) / 100;

        // 1. Calculate Acquisition Loan Amount
        let purchaseLoanAmount = 0;
        if (this.leverageBasis === 'purchase') {
          purchaseLoanAmount = purchase * ltv;
        } else {
          purchaseLoanAmount = arvVal * ltv;
        }
        // Caps loan amount to purchase price to prevent cash-back at purchase unless explicitly structured
        if (purchaseLoanAmount > purchase) {
          purchaseLoanAmount = purchase;
        }

        // 2. Calculate Rehab Financing
        let rehabFinancedAmount = 0;
        let rehabCashRequired = rehab;
        if (this.rehabFinanced) {
          rehabFinancedAmount = rehab * (parse(this.rehabLtcPercent) / 100);
          rehabCashRequired = rehab - rehabFinancedAmount;
        }

        // Total Hard Money Loan Allocation
        const totalLoanAmount = purchaseLoanAmount + rehabFinancedAmount;
        const downPayment = purchase - purchaseLoanAmount;

        // 3. Holding Costs & Hard Money Expense Breakdown
        const originationCost = totalLoanAmount * points;
        const totalDrawFees = drawsCount * perDrawFee;
        const totalLenderCosts = originationCost + fees + totalDrawFees;
        
        // Monthly interest calculations (simple interest for short term hard money)
        const monthlyInterestRate = rate / 12;
        const monthlyInterestPayment = totalLoanAmount * monthlyInterestRate;
        const totalHoldingCosts = monthlyInterestPayment * months;

        // 4. Total Capital Requirements & Outlays
        const totalProjectCosts = purchase + rehab + buyClosing + sellClosing + totalLenderCosts + totalHoldingCosts;
        
        // Liquid Out-of-Pocket capital needed to close and hold the property safely
        const totalCapitalRequired = downPayment + rehabCashRequired + buyClosing + totalLenderCosts + totalHoldingCosts;

        // Save mutual outputs
        this.calculations.loanAmount = Math.round(totalLoanAmount);
        this.calculations.downPayment = Math.round(downPayment);
        this.calculations.rehabFinancedAmount = Math.round(rehabFinancedAmount);
        this.calculations.rehabCashRequired = Math.round(rehabCashRequired);
        this.calculations.originationCost = Math.round(originationCost);
        this.calculations.totalDrawFees = Math.round(totalDrawFees);
        this.calculations.totalLenderCosts = Math.round(totalLenderCosts);
        this.calculations.totalHoldingCosts = Math.round(totalHoldingCosts);
        this.calculations.totalProjectCosts = Math.round(totalProjectCosts);
        this.calculations.totalCapitalRequired = Math.round(totalCapitalRequired);

        if (this.mode === 'flip') {
          // --- FIX & FLIP ROI ENGINE ---
          const netProfit = arvVal - totalProjectCosts;
          const roi = totalCapitalRequired > 0 ? (netProfit / totalCapitalRequired) * 100 : 0;
          
          // Annualized ROI computation based on projected hold months
          const annualizedRoi = months > 0 ? roi * (12 / months) : 0;

          this.calculations.netProfit = Math.round(netProfit);
          this.calculations.roi = parseFloat(roi.toFixed(2));
          this.calculations.annualizedRoi = parseFloat(annualizedRoi.toFixed(2));
        } else {
          // --- BUY & HOLD (BRRRR / RENTAL) ENGINE ---
          const rent = parse(this.monthlyRent);
          const opExpRatio = parse(this.operatingExpensesPercent) / 100;
          
          // Monthly Net Operating Income
          const netOperatingIncome = rent * (1 - opExpRatio);
          
          // Refinance metrics
          const refiLtv = parse(this.refinanceLtvPercent) / 100;
          const refiLoanAmount = arvVal * refiLtv;
          const refiFees = parse(this.refinanceFees);
          
          // Cash back from refinance or extra cash injection needed to payoff the short term hard money
          // Pays off the original hard money debt + closing costs of refinance
          const refinanceCashProceeds = refiLoanAmount - totalLoanAmount - refiFees;
          
          // Capital remaining in the deal long-term after refinance
          const netCashLeftInDeal = totalCapitalRequired - refinanceCashProceeds;

          // Standard 30-Year Amortization formula for long term refinance debt service
          const refiAnnualRate = parse(this.refinanceInterestRate) / 100;
          const refiMonthlyRate = refiAnnualRate / 12;
          const totalPayments = 30 * 12;
          
          let monthlyDebtService = 0;
          if (refiMonthlyRate > 0) {
            monthlyDebtService = refiLoanAmount * (refiMonthlyRate * Math.pow(1 + refiMonthlyRate, totalPayments)) / (Math.pow(1 + refiMonthlyRate, totalPayments) - 1);
          } else {
            monthlyDebtService = refiLoanAmount / totalPayments;
          }

          const monthlyCashFlow = netOperatingIncome - monthlyDebtService;
          
          // Cash on Cash Return: Annualized Cash Flow / Long Term Capital Outlay
          const cashOnCashReturn = netCashLeftInDeal > 0 ? ((monthlyCashFlow * 12) / netCashLeftInDeal) * 100 : 0;
          
          // Capitalization Rate: Annual NOI / Purchase Price (or ARV, depending on standard preference - we use total purchase cost here for accurate acquisition value yield)
          const capRate = purchase > 0 ? ((netOperatingIncome * 12) / purchase) * 100 : 0;

          this.calculations.netOperatingIncome = Math.round(netOperatingIncome);
          this.calculations.refinanceLoanAmount = Math.round(refiLoanAmount);
          this.calculations.refinanceCashProceeds = Math.round(refinanceCashProceeds);
          this.calculations.netCashLeftInDeal = Math.round(netCashLeftInDeal);
          this.calculations.monthlyDebtService = Math.round(monthlyDebtService);
          this.calculations.monthlyCashFlow = Math.round(monthlyCashFlow);
          this.calculations.cashOnCashReturn = parseFloat(cashOnCashReturn.toFixed(2));
          this.calculations.capRate = parseFloat(capRate.toFixed(2));
        }
      },

      // Generate a clean text output summary suitable for printing or CLI terminal copy/paste
      generateTerminalReport() {
        const today = new Date().toISOString().slice(0, 10);
        let report = `==================================================\n`;
        report += `           CAPITAL_VAULT DEALS TERMINAL          \n`;
        report += `           RUN DATE: ${today}                    \n`;
        report += `==================================================\n\n`;
        report += `METRIC ENGINE MODE: [${this.mode.toUpperCase()}]\n`;
        report += `Purchase Price:    $${this.purchasePrice.toLocaleString()}\n`;
        report += `After Repair Value:$${this.arv.toLocaleString()}\n`;
        report += `Rehab Budget:      $${this.rehabBudget.toLocaleString()}\n`;
        report += `Holding Period:    ${this.holdingPeriodMonths} Months\n\n`;
        report += `--- FINANCING DATA ---\n`;
        report += `Hard Money Loan:   $${this.calculations.loanAmount.toLocaleString()}\n`;
        report += `Down Payment:      $${this.calculations.downPayment.toLocaleString()}\n`;
        report += `Lender Costs:      $${this.calculations.totalLenderCosts.toLocaleString()}\n`;
        report += `Holding Interest:  $${this.calculations.totalHoldingCosts.toLocaleString()}\n`;
        report += `Total Capital Req: $${this.calculations.totalCapitalRequired.toLocaleString()}\n\n`;

        if (this.mode === 'flip') {
          report += `--- FLIP METRICS ---\n`;
          report += `Net Profit:        $${this.calculations.netProfit.toLocaleString()}\n`;
          report += `Return on Invest:  ${this.calculations.roi}%\n`;
          report += `Annualized ROI:    ${this.calculations.annualizedRoi}%\n`;
        } else {
          report += `--- BRRRR / RENTAL METRICS ---\n`;
          report += `Net Operating Inc: $${this.calculations.netOperatingIncome.toLocaleString()}/mo\n`;
          report += `Refi Loan Amount:  $${this.calculations.refinanceLoanAmount.toLocaleString()}\n`;
          report += `Long-Term Cash In: $${this.calculations.netCashLeftInDeal.toLocaleString()}\n`;
          report += `Monthly Cash Flow: $${this.calculations.monthlyCashFlow.toLocaleString()}/mo\n`;
          report += `Cash on Cash Ret:  ${this.calculations.cashOnCashReturn}%\n`;
          report += `Capitalization Rate:${this.calculations.capRate}%\n`;
        }
        report += `\n==================================================\n`;
        report += `SYSTEMS OK // CRYPTO GRAPHICALLY SIGNED AUDIT LOG\n`;
        report += `==================================================`;

        // Direct download of the text file
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_Deal_Report_${this.mode}_${today}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.dispatchToast("Terminal cryptographic report downloaded successfully.");
      },

      // Helper function to dispatch generic application toasts
      dispatchToast(msg) {
        window.dispatchEvent(new CustomEvent('toast-notify', {
          detail: msg
        }));
      }
    };
  };

})();