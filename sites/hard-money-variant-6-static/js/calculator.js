document.addEventListener('alpine:init', () => {
  Alpine.data('dealCalculator', () => ({
    // Reactive Inputs (Default typical fix-and-flip scenarios)
    purchasePrice: 250000,
    rehabBudget: 50000,
    arv: 400000,
    desiredLTC: 85,         // Max Loan-to-Cost limit
    desiredLTV: 70,         // Max Loan-to-Value limit
    interestRate: 10.5,     // Interest-Only Annual Rate (%)
    originationPoints: 2.0, // Estimated Points / Origination Fees (%)

    // Output Matching Pool
    eligibleLenders: [],
    showEligibleLenders: false,

    // Calculated Metrics
    get totalCost() {
      return Math.max(0, parseFloat(this.purchasePrice || 0) + parseFloat(this.rehabBudget || 0));
    },

    get maxLoanLTC() {
      return this.totalCost * (parseFloat(this.desiredLTC || 0) / 100);
    },

    get maxLoanLTV() {
      return parseFloat(this.arv || 0) * (parseFloat(this.desiredLTV || 0) / 100);
    },

    get estimatedLoanAmount() {
      // Direct hard money constraint: Lower of Max LTC and Max LTV
      const calculatedLoan = Math.min(this.maxLoanLTC, this.maxLoanLTV);
      return Math.max(0, calculatedLoan);
    },

    get actualLTC() {
      if (this.totalCost === 0) return 0;
      return (this.estimatedLoanAmount / this.totalCost) * 100;
    },

    get actualLTV() {
      const arvVal = parseFloat(this.arv || 0);
      if (arvVal === 0) return 0;
      return (this.estimatedLoanAmount / arvVal) * 100;
    },

    get estimatedPointsCost() {
      return this.estimatedLoanAmount * (parseFloat(this.originationPoints || 0) / 100);
    },

    get monthlyInterestPayment() {
      const annualRate = parseFloat(this.interestRate || 0) / 100;
      return (this.estimatedLoanAmount * annualRate) / 12;
    },

    get totalCashRequired() {
      const required = this.totalCost - this.estimatedLoanAmount + this.estimatedPointsCost;
      return Math.max(0, required);
    },

    get dealMargin() {
      return Math.max(0, parseFloat(this.arv || 0) - this.totalCost);
    },

    get roiEstimate() {
      const cash = this.totalCashRequired;
      if (cash <= 0) return 0;
      return (this.dealMargin / cash) * 100;
    },

    // Scrapes static baseline constraints for verification matches
    matchLenders() {
      const baseLenders = [
        { name: "Colony American Finance", maxLTV: 75, maxLTC: 85, minLoan: 100000, maxLoan: 5000000, rates: "8.5% - 10.5%" },
        { name: "Asset Avenue", maxLTV: 85, maxLTC: 90, minLoan: 150000, maxLoan: 2000000, rates: "9.0% - 11.5%" },
        { name: "Jason Wheeler", maxLTV: 70, maxLTC: 80, minLoan: 50000, maxLoan: 3000000, rates: "7.99% - 9.5%" },
        { name: "Source Capital", maxLTV: 70, maxLTC: 85, minLoan: 100000, maxLoan: 10000000, rates: "7.99% - 10.0%" },
        { name: "Green Oak Capital", maxLTV: 75, maxLTC: 85, minLoan: 75000, maxLoan: 1500000, rates: "8.99% - 11.0%" },
        { name: "CIVIC Private Money Lending", maxLTV: 80, maxLTC: 90, minLoan: 100000, maxLoan: 5000000, rates: "8.49% - 10.99%" },
        { name: "Corevest", maxLTV: 75, maxLTC: 80, minLoan: 150000, maxLoan: 15000000, rates: "7.5% - 9.0%" },
        { name: "Charleston Private Lending", maxLTV: 75, maxLTC: 85, minLoan: 50000, maxLoan: 2000000, rates: "8.0% - 11.0%" },
        { name: "Texas Mortgage Place", maxLTV: 70, maxLTC: 80, minLoan: 50000, maxLoan: 400000, rates: "9.5% - 12.0%" },
        { name: "LendingOne", maxLTV: 75, maxLTC: 90, minLoan: 75000, maxLoan: 10000000, rates: "8.25% - 10.5%" },
        { name: "Pine Financial Group", maxLTV: 100, maxLTC: 100, minLoan: 50000, maxLoan: 2000000, rates: "10.0% - 13.0%" },
        { name: "Adler Private Lending", maxLTV: 75, maxLTC: 85, minLoan: 150000, maxLoan: 5000000, rates: "8.5% - 10.5%" }
      ];

      const currentLTV = this.actualLTV;
      const currentLTC = this.actualLTC;
      const currentLoan = this.estimatedLoanAmount;

      this.eligibleLenders = baseLenders.filter(lender => {
        const matchesLTV = currentLTV <= lender.maxLTV;
        const matchesLTC = currentLTC <= lender.maxLTC;
        const matchesLoanSize = currentLoan >= lender.minLoan && currentLoan <= lender.maxLoan;
        return matchesLTV && matchesLTC && matchesLoanSize;
      });

      // Dispatch dynamic system update notice triggers
      window.dispatchEvent(new CustomEvent('toast-notify', {
        detail: `System recalibrated: ${this.eligibleLenders.length} capital networks match transaction parameters.`
      }));
    },

    // Initialization hook watching key metric updates
    init() {
      this.$watch('purchasePrice', () => this.matchLenders());
      this.$watch('rehabBudget', () => this.matchLenders());
      this.$watch('arv', () => this.matchLenders());
      this.$watch('desiredLTC', () => this.matchLenders());
      this.$watch('desiredLTV', () => this.matchLenders());
      this.matchLenders();
    }
  }));
});