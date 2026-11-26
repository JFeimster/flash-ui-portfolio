function borrowerEducation() {
  return {
    // Tab Navigation State
    activeTab: 'guides', // 'guides', 'checklists', 'glossary', 'calculators'
    
    // Glossary Section State
    glossarySearch: '',
    selectedGlossaryCategory: 'all',
    
    // Checklists Section State
    activeChecklist: 'hard-money-prep', // 'hard-money-prep', 'underwriting', 'rehab-draws'
    checklistItems: {
      'hard-money-prep': [
        { id: 'prep-1', text: 'Entity Docs (LLC Operating Agreement, Articles of Org, EIN)', done: false, desc: 'Most hard money lenders only close loans to business entities, not individuals.' },
        { id: 'prep-2', text: 'Detailed Rehab Budget (Scope of Work)', done: false, desc: 'Line-by-line breakdown of labor and materials. Vital for draw schedule approval.' },
        { id: 'prep-3', text: 'Purchase Contract / Executed Agreement', done: false, desc: 'Fully signed purchase agreement with clear escrow and closing timelines.' },
        { id: 'prep-4', text: 'Recent 2 Months Bank Statements', done: false, desc: 'Lenders need to verify you have the liquid reserves to cover points, closing costs, and the first rehab phase.' },
        { id: 'prep-5', text: 'Interior & Exterior Property Photos', done: false, desc: 'Provides immediate structural context before the formal valuation/appraisal happens.' },
        { id: 'prep-6', text: 'Clear Exit Strategy Document', done: false, desc: 'A written paragraph explaining whether you will sell (flip) or refinance into a long-term DSCR rental loan.' }
      ],
      'underwriting': [
        { id: 'uw-1', text: 'Validate ARV (After Repair Value) via comps', done: false, desc: 'Ensure active & recently sold comparable properties support your projected resale value.' },
        { id: 'uw-2', text: 'Calculate Loan-to-Cost (LTC) limits', done: false, desc: 'Verify if the lender covers 85-90% of purchase price and 100% of rehab, or has stricter caps.' },
        { id: 'uw-3', text: 'Perform environmental check & structural screening', done: false, desc: 'Look for underground tanks, extreme slopes, or fire hazards that disqualify properties immediately.' },
        { id: 'uw-4', text: 'Assess neighborhood market health', done: false, desc: 'Days on Market (DOM) should ideally be under 60 days to guarantee a fast exit strategy.' },
        { id: 'uw-5', text: 'Confirm local permitting guidelines', done: false, desc: 'Determine if your rehab requires structural permits that will drag out construction times.' }
      ],
      'rehab-draws': [
        { id: 'draw-1', text: 'Establish baseline phases with contractor', done: false, desc: 'Typically broken into 3 to 5 milestone-based draws (e.g., framing/roofing, rough-ins, finishes).' },
        { id: 'draw-2', text: 'Obtain initial property insurance with builder risk', done: false, desc: 'Required prior to loan funding to cover materials stored on-site or unexpected structural damage.' },
        { id: 'draw-3', text: 'Complete first phase of construction out-of-pocket', done: false, desc: 'Lenders rarely advance rehab cash upfront; you must fund Phase 1 and request reimbursement via draw.' },
        { id: 'draw-4', text: 'Schedule local/lender inspector walkthrough', done: false, desc: ' Lenders deploy 3rd party inspectors to verify milestones are 100% complete before releasing draw funds.' },
        { id: 'draw-5', text: 'Execute Lien Waivers from subcontractors', done: false, desc: 'Collect signed lien waivers from your main trades to prove they were paid before requesting the next draw.' }
      ]
    },

    // Glossary Database
    glossaryTerms: [
      { term: 'Points (Origination Fees)', category: 'costs', def: 'Upfront fees paid directly to the lender at closing. One point is equal to 1% of the total loan amount. Hard money lenders typically charge 1 to 3 points.' },
      { term: 'Draw Schedule', category: 'rehab', def: 'A structured timeline detailing when and how rehab funds are disbursed. Hard money lenders hold rehab money in escrow and release it in increments (draws) as construction milestones are verified.' },
      { term: 'Interest-Only Payment', category: 'payments', def: 'A payment structure where the borrower only pays the monthly interest accrued on the outstanding loan balance. The principal balance remains unchanged and is paid in full at maturity.' },
      { term: 'After Repair Value (ARV)', category: 'metrics', def: 'The estimated future market value of a real estate property after all planned renovations and repairs have been completed.' },
      { term: 'Loan-to-Value (LTV)', category: 'metrics', def: 'A ratio calculated by dividing the loan amount by the current appraised value of the asset. Lenders use this to measure risk margins.' },
      { term: 'Loan-to-Cost (LTC)', category: 'metrics', def: 'The ratio of the loan amount compared to the total cost of the project (purchase price + construction budget). Many lenders cap LTC at 80% to 90%.' },
      { term: 'DSCR (Debt Service Coverage Ratio)', category: 'metrics', def: 'A metric used to assess a property’s cash flow. Calculated by dividing net operating income (NOI) by the annual debt service. A DSCR over 1.20 is typically required for long-term rental financing.' },
      { term: 'Exit Strategy', category: 'rehab', def: 'The borrower’s documented plan for paying off the short-term hard money loan. Common exit strategies include selling the property (flipping) or refinancing into a traditional 30-year agency or DSCR loan.' },
      { term: 'Title Commitment', category: 'costs', def: 'A document issued by a title insurance company committing to insure the lender\'s lien status on the property, verifying there are no unexpected secondary liens or owner disputes.' },
      { term: 'Default Rate', category: 'payments', def: 'A significantly higher penalty interest rate applied to the loan if the borrower defaults or misses consecutive monthly payments.' }
    ],

    // Hard Money Loan Cost Calculator State
    hmCalc: {
      loanAmount: 250000,
      interestRate: 10.5,
      origPoints: 2.0,
      termMonths: 12,
      otherFees: 1250,
      
      get monthlyInterestOnly() {
        const rate = parseFloat(this.interestRate) / 100;
        const loan = parseFloat(this.loanAmount);
        if (!loan || !rate) return 0;
        return (loan * rate) / 12;
      },
      
      get totalInterest() {
        return this.monthlyInterestOnly * parseInt(this.termMonths);
      },
      
      get pointCost() {
        const points = parseFloat(this.origPoints) / 100;
        const loan = parseFloat(this.loanAmount);
        if (!loan || !points) return 0;
        return loan * points;
      },
      
      get totalFundingFees() {
        return this.pointCost + parseFloat(this.otherFees || 0);
      },
      
      get totalEstimatedCost() {
        return this.totalInterest + this.totalFundingFees;
      },

      get annualizedAPR() {
        const principal = parseFloat(this.loanAmount);
        const totalCost = this.totalEstimatedCost;
        const years = parseInt(this.termMonths) / 12;
        if (!principal || !years) return 0;
        return ((totalCost / principal) / years) * 100;
      }
    },

    // Rental / DSCR Property ROI Calculator State
    rentalCalc: {
      purchasePrice: 320000,
      rehabCost: 45000,
      loanAmount: 260000,
      interestRate: 7.25,
      monthlyRent: 2900,
      annualTaxes: 3600,
      annualInsurance: 1100,
      otherMonthlyExpenses: 250, // management, reserves, etc.

      get totalProjectCost() {
        return parseFloat(this.purchasePrice) + parseFloat(this.rehabCost);
      },

      get cashRequiredAtClosing() {
        // Simple estimate: Cost - Loan + estimated 4% closing/holding costs
        const price = parseFloat(this.purchasePrice);
        const rehab = parseFloat(this.rehabCost);
        const loan = parseFloat(this.loanAmount);
        const estimateClosing = price * 0.04;
        return Math.max(0, (price + rehab + estimateClosing) - loan);
      },

      get monthlyPrincipalAndInterest() {
        const p = parseFloat(this.loanAmount);
        const annualRate = parseFloat(this.interestRate) / 100;
        const r = annualRate / 12;
        const n = 360; // Assume standard 30-year amortization for DSCR exit
        if (!p || !annualRate) return 0;
        // Standard amortization formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
        return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      },

      get monthlyHoldingCosts() {
        const tax = parseFloat(this.annualTaxes) / 12;
        const ins = parseFloat(this.annualInsurance) / 12;
        const other = parseFloat(this.otherMonthlyExpenses);
        return tax + ins + other;
      },

      get totalMonthlyDebtService() {
        return this.monthlyPrincipalAndInterest + this.monthlyHoldingCosts;
      },

      get netMonthlyCashFlow() {
        const income = parseFloat(this.monthlyRent);
        return income - this.totalMonthlyDebtService;
      },

      get dscrValue() {
        const grossRent = parseFloat(this.monthlyRent);
        const pitia = this.totalMonthlyDebtService;
        if (!pitia) return 0;
        return grossRent / pitia;
      },

      get cashOnCashReturn() {
        const cashOut = this.netMonthlyCashFlow * 12;
        const cashIn = this.cashRequiredAtClosing;
        if (!cashIn || cashOut <= 0) return 0;
        return (cashOut / cashIn) * 100;
      }
    },

    // Glossary Filter Logic
    get filteredGlossary() {
      return this.glossaryTerms.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(this.glossarySearch.toLowerCase()) || 
                              item.def.toLowerCase().includes(this.glossarySearch.toLowerCase());
        const matchesCategory = this.selectedGlossaryCategory === 'all' || item.category === this.selectedGlossaryCategory;
        return matchesSearch && matchesCategory;
      });
    },

    // Interactive Action logging helper (integrated into core audit pipeline if available)
    logAction(msg, detail) {
      if (window.lenderDirectoryInstance) {
        window.lenderDirectoryInstance.addAuditLog(msg, detail);
      } else {
        console.log(`[Education Tracker] ${msg} - ${detail}`);
      }
    },

    // Toggle Checklist Items
    toggleItem(checklist, itemId) {
      const item = this.checklistItems[checklist].find(i => i.id === itemId);
      if (item) {
        item.done = !item.done;
        const completedCount = this.checklistItems[checklist].filter(i => i.done).length;
        const totalCount = this.checklistItems[checklist].length;
        this.logAction('Checklist Progress Updated', `${completedCount}/${totalCount} milestones completed in '${checklist}'`);
      }
    },

    // Reset Checklist
    resetChecklist(checklist) {
      this.checklistItems[checklist].forEach(item => item.done = false);
      this.logAction('Checklist Reset', `Cleared all checkmarks for: ${checklist}`);
    }
  };
}

// Global auto-registration on window load for Alpine initialization integration
window.borrowerEducation = borrowerEducation;