(function () {
  const extendDirectory = (baseFn) => {
    return function () {
      const base = baseFn.call(this);

      return {
        ...base,

        // Premium Interactive Calculator State
        calculator: {
          active: false,
          purchasePrice: 280000,
          rehabBudget: 55000,
          arv: 420000,
          timelineMonths: 12,
          interestRate: 9.25,
          originationPoints: 2.0,
          otherFees: 1850,
          strategy: 'Fix and Flip Loans', // Strategy alignable with database Loan Types
          autoCalculate: true,
          customLoanAmount: 250000,
        },

        // Initialize Extended Flow Controls
        init() {
          if (base.init) base.init.call(this);
          this.addAuditLog('Calculator Engine Online', 'LTV/LTC cross-matching criteria active');
        },

        // Total Capital Cost (Purchase + Rehab)
        get totalProjectCost() {
          return (Number(this.calculator.purchasePrice) || 0) + (Number(this.calculator.rehabBudget) || 0);
        },

        // Estimated Underwritten Loan Amount
        get calculatedLoanAmount() {
          if (!this.calculator.autoCalculate) {
            return Math.min(Number(this.calculator.customLoanAmount) || 0, this.totalProjectCost);
          }

          const purchase = Number(this.calculator.purchasePrice) || 0;
          const rehab = Number(this.calculator.rehabBudget) || 0;
          const arv = Number(this.calculator.arv) || 0;

          // Institutional Leveraged Rules
          if (this.calculator.strategy === 'Fix and Flip Loans') {
            // Standard: Max 85% of purchase + 100% of rehab up to 70% ARV
            const ltcCap = (purchase * 0.85) + rehab;
            const ltvCap = arv * 0.70;
            return Math.round(Math.min(ltcCap, ltvCap));
          } else if (this.calculator.strategy === 'New Construction Loans') {
            // Max 65% ARV / 80% LTC
            return Math.round(Math.min(arv * 0.65, this.totalProjectCost * 0.80));
          } else if (this.calculator.strategy === 'Refinance / Cash Out Loans') {
            // Max 75% of current ARV
            return Math.round(arv * 0.75);
          } else {
            // General bridge guidelines: 75% LTV / 85% LTC
            return Math.round(Math.min(arv * 0.75, this.totalProjectCost * 0.85));
          }
        },

        // Computed Loan-to-Value (LTV)
        get calculatedLTV() {
          const arv = Number(this.calculator.arv) || 0;
          if (!arv) return 0;
          return Math.round((this.calculatedLoanAmount / arv) * 1000) / 10;
        },

        // Computed Loan-to-Cost (LTC)
        get calculatedLTC() {
          const totalCost = this.totalProjectCost;
          if (!totalCost) return 0;
          return Math.round((this.calculatedLoanAmount / totalCost) * 1000) / 10;
        },

        // Estimated Interest Payment (Monthly)
        get estimatedMonthlyPayment() {
          const rate = (Number(this.calculator.interestRate) || 0) / 100;
          return Math.round((this.calculatedLoanAmount * rate) / 12);
        },

        // Calculated Points / Origination Cost
        get estimatedPointsCost() {
          const points = (Number(this.calculator.originationPoints) || 0) / 100;
          return Math.round(this.calculatedLoanAmount * points);
        },

        // Liquid Capital Required for Closing (Out of pocket)
        get totalCashRequired() {
          const purchaseEquity = this.totalProjectCost - this.calculatedLoanAmount;
          const premiumFees = this.estimatedPointsCost + (Number(this.calculator.otherFees) || 0);
          return Math.round(purchaseEquity + premiumFees);
        },

        // Sum of all debt service costs + frontend fees over timeline
        get totalFinancingCost() {
          const timeline = Number(this.calculator.timelineMonths) || 0;
          const debtService = this.estimatedMonthlyPayment * timeline;
          return Math.round(debtService + this.estimatedPointsCost + (Number(this.calculator.otherFees) || 0));
        },

        // Estimated net project spread after financing costs
        get projectedProfit() {
          const arv = Number(this.calculator.arv) || 0;
          return Math.round(arv - this.totalProjectCost - this.totalFinancingCost);
        },

        // Return on Invested Capital (ROI)
        get projectedROI() {
          const cashRequired = this.totalCashRequired;
          if (cashRequired <= 0) return 0;
          return Math.round((this.projectedProfit / cashRequired) * 1000) / 10;
        },

        // Live parameter alteration notifier & dynamic routing
        triggerCalcUpdate(field) {
          this.calculator.active = true;
          
          // Switch to Best Match scoring automatically to sort by high matching lenders
          if (this.sortBy !== 'best_match' && this.sortBy !== 'match_score') {
            this.sortBy = 'best_match';
          }

          // Throttle logging events to preserve sleek thread response
          if (!this._lastCalcLog || Date.now() - this._lastCalcLog > 2500) {
            this.addAuditLog(
              `Project model evaluated`, 
              `Leverage Level: LTV ${this.calculatedLTV}% | LTC ${this.calculatedLTC}%`
            );
            this._lastCalcLog = Date.now();
          }
        },

        // Multi-constraint matching engine giving exact dynamic fit scores
        getLenderMatchScore(lender) {
          let score = 100;

          // 1. Geography Strictness Integration
          if (this.filters.state && lender.State !== this.filters.state) {
            score -= 40; // Severe match reduction if manual state selection doesn't match
          }

          // 2. Loan Type Fitment Score
          const strategy = this.calculator.strategy;
          const programs = (lender['Loan Types Offered'] || '').toLowerCase();
          const primaryType = (lender['LoanType'] || '').toLowerCase();
          
          const supportsStrategy = programs.includes(strategy.toLowerCase()) || primaryType.includes(strategy.toLowerCase());
          if (!supportsStrategy) {
            score -= 20; // Moderate deduction
          }

          // 3. Underwriting Constraints check (LTV boundaries)
          const matches = lender['About the Lender'].match(/LTV of (\d+)%/i);
          const maxLTVAllowed = matches && matches[1] ? parseInt(matches[1]) : 75; // Default system baseline LTV
          const computedLTV = this.calculatedLTV;

          if (computedLTV > maxLTVAllowed) {
            const excess = computedLTV - maxLTVAllowed;
            score -= Math.min(30, Math.round(excess * 2.5)); // Progressive penalty for exceeding safe LTV ranges
          } else {
            score += 5; // Direct fitness reward for safety margins
          }

          // 4. Asset Focus Alignment
          const lenderAssets = (lender['Property Types'] || '').toLowerCase();
          if (strategy === 'Fix and Flip Loans' || strategy === 'New Construction Loans') {
            if (!lenderAssets.includes('single family') && !lenderAssets.includes('multi family')) {
              score -= 10;
            }
          }

          return Math.max(0, Math.min(100, score));
        },

        // Override default list pipeline to handle Match scoring structures dynamically
        get filteredLenders() {
          let temp = base.filteredLenders;

          if (this.calculator.active) {
            // Inject dynamically generated score values for list layout rendering
            temp = temp.map(l => {
              return {
                ...l,
                matchScore: this.getLenderMatchScore(l)
              };
            });

            // Re-order active stream to bring top-matching liquidity to the top
            if (this.sortBy === 'best_match' || this.sortBy === 'match_score') {
              temp.sort((a, b) => b.matchScore - a.matchScore);
            }
          }

          return temp;
        }
      };
    };
  };

  // Intercept and merge global Alpines core definition
  if (window.lenderDirectory) {
    window.lenderDirectory = extendDirectory(window.lenderDirectory);
  } else {
    let originalValue = undefined;
    Object.defineProperty(window, 'lenderDirectory', {
      get() {
        return originalValue;
      },
      set(newVal) {
        originalValue = extendDirectory(newVal);
      },
      configurable: true
    });
  }
})();