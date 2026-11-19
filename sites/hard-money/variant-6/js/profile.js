/**
 * Capital_Vault // Profile & Comparison Engine
 * Interactive Lender Profile & Underwriting Evaluation System
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('profileComparison', () => ({
    // Extended dataset with detailed underwriting parameters
    lenders: [
      {
        "Lender": "Colony American Finance",
        "State": "Alaska",
        "City": "Anchorage",
        "Lender City & State": "Los Angeles, CA 90071",
        "Lender Phone": "(844) 223-2231",
        "Lender Website": "https://www.colonyamericanfinance.com",
        "Lending Location": "National",
        "Loan Types Offered": "Investment Property Loans, Refinance / Cash Out Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "Colony American Finance is a private money lender providing institutional-grade capital for residential and multi-family investment properties. They specialize in portfolio refinancing and single asset bridge financing options with flexible long-term capabilities.",
        // Enhanced Underwriting Profile Metrics
        "MinCreditScore": 620,
        "MaxLTC": 85,
        "MaxLTV": 75,
        "MinLoanAmount": 150000,
        "MaxLoanAmount": 10000000,
        "OriginationFee": "1.5% - 2.5%",
        "InterestRates": "7.49% - 9.99%",
        "SpeedToClose": "10 - 14 Days",
        "BankruptcyWaitTime": "2 Years",
        "ForeclosureWaitTime": "3 Years",
        "AuditConfidence": "98%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Asset Avenue",
        "State": "Alabama",
        "City": "Birmingham",
        "Lender City & State": "Los Angeles, CA 90024",
        "Lender Phone": "(310) 905-3050",
        "Lender Website": "https://www.assetavenue.com/",
        "Lending Location": "AL, AR, CA, CO, CT, FL, GA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "Asset Avenue offers swift capital deployment for real estate investment opportunities. They prioritize sponsor equity and property cashflow over traditional high-threshold credit barriers.",
        "MinCreditScore": 600,
        "MaxLTC": 90,
        "MaxLTV": 80,
        "MinLoanAmount": 100000,
        "MaxLoanAmount": 2000000,
        "OriginationFee": "2.0% - 3.0%",
        "InterestRates": "8.50% - 11.00%",
        "SpeedToClose": "7 - 10 Days",
        "BankruptcyWaitTime": "1 Year",
        "ForeclosureWaitTime": "2 Years",
        "AuditConfidence": "94%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Jason Wheeler",
        "State": "California",
        "City": "San Jose",
        "Lender City & State": "Pleasant Hill, CA 94523",
        "Lender Phone": "(925) 285-0777",
        "Lender Website": "http://www.jasonwheeler.biz",
        "Lending Location": "CA",
        "Loan Types Offered": "Investment Property Loans, Refinance / Cash Out Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "A boutique private capital adviser serving regional developers throughout California with low barriers to entry and direct underwriting lines.",
        "MinCreditScore": 580,
        "MaxLTC": 80,
        "MaxLTV": 70,
        "MinLoanAmount": 75000,
        "MaxLoanAmount": 3000000,
        "OriginationFee": "1.0% - 2.0%",
        "InterestRates": "6.99% - 9.50%",
        "SpeedToClose": "5 - 7 Days",
        "BankruptcyWaitTime": "No Requirement",
        "ForeclosureWaitTime": "1 Year",
        "AuditConfidence": "91%",
        "LiquidityVerified": false
      },
      {
        "Lender": "Source Capital",
        "State": "Arizona",
        "City": "Phoenix",
        "Lender City & State": "Los Angeles, CA 90071",
        "Lender Phone": "(323) 352-9292",
        "Lender Website": "http://www.hardmoneyfirst.com",
        "Lending Location": "CA, AZ, MN",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Apartment, Industrial, Mixed Use, Multi Family, Office, Retail, Single Family",
        "About the Lender": "Asset-based lender focusing heavily on prime commercial properties, mixed-use assets, and high-density residential subdivisions across California and Arizona.",
        "MinCreditScore": 500,
        "MaxLTC": 85,
        "MaxLTV": 70,
        "MinLoanAmount": 250000,
        "MaxLoanAmount": 15000000,
        "OriginationFee": "1.5% - 2.5%",
        "InterestRates": "7.99% - 10.99%",
        "SpeedToClose": "5 - 10 Days",
        "BankruptcyWaitTime": "No Requirement",
        "ForeclosureWaitTime": "No Requirement",
        "AuditConfidence": "99%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Green Oak Capital",
        "State": "Pennsylvania",
        "City": "Philadelphia",
        "Lender City & State": "Bala Cynwyd, PA 19004",
        "Lender Phone": "(215) 600-3419",
        "Lender Website": "http://www.greatoakcapital.com/",
        "Lending Location": "PA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Land, Multi Family, Single Family",
        "About the Lender": "Green Oak provides fast funding structures for infill developments, raw land bank options, and rehab properties within Pennsylvania and the mid-Atlantic.",
        "MinCreditScore": 650,
        "MaxLTC": 85,
        "MaxLTV": 75,
        "MinLoanAmount": 50000,
        "MaxLoanAmount": 1500000,
        "OriginationFee": "2.5% - 3.5%",
        "InterestRates": "9.00% - 12.00%",
        "SpeedToClose": "12 - 15 Days",
        "BankruptcyWaitTime": "3 Years",
        "ForeclosureWaitTime": "3 Years",
        "AuditConfidence": "90%",
        "LiquidityVerified": false
      },
      {
        "Lender": "CIVIC Private Money Lending",
        "State": "Arizona",
        "City": "Mesa",
        "Lender City & State": "Redondo Beach, CA 90278",
        "Lender Phone": "(877) 589-7533",
        "Lender Website": "http://www.civicfs.com/",
        "Lending Location": "AZ, CA, CO, FL, GA, NV, OR, TX, WA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "CIVIC operates as a high-volume non-bank lender delivering streamlined products designed for serial flippers, single-family syndicates, and build-to-rent projects.",
        "MinCreditScore": 600,
        "MaxLTC": 90,
        "MaxLTV": 80,
        "MinLoanAmount": 100000,
        "MaxLoanAmount": 5000000,
        "OriginationFee": "1.75% - 2.5%",
        "InterestRates": "7.99% - 11.25%",
        "SpeedToClose": "7 - 9 Days",
        "BankruptcyWaitTime": "1 Year",
        "ForeclosureWaitTime": "2 Years",
        "AuditConfidence": "97%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Corevest",
        "State": "Alaska",
        "City": "Palmer",
        "Lender City & State": "Irvine, CA 92614",
        "Lender Phone": "(888) 375-7977",
        "Lender Website": "https://www.corevestfinance.com",
        "Lending Location": "National",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "CoreVest is a leading nationwide lender to residential real estate investors, offering long term rental portfolio loans, single asset term loans, and short term lines of credit.",
        "MinCreditScore": 660,
        "MaxLTC": 80,
        "MaxLTV": 75,
        "MinLoanAmount": 500000,
        "MaxLoanAmount": 50000000,
        "OriginationFee": "1.25% - 2.0%",
        "InterestRates": "6.50% - 8.99%",
        "SpeedToClose": "14 - 21 Days",
        "BankruptcyWaitTime": "3 Years",
        "ForeclosureWaitTime": "4 Years",
        "AuditConfidence": "99%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Charleston Private Lending",
        "State": "South Carolina",
        "City": "Charleston",
        "Lender City & State": "Charleston, SC",
        "Lender Phone": "(843) 779-5626",
        "Lender Website": "http://www.charlestonprivatelending.com/",
        "Lending Location": "Charleston",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "Regional bespoke private funding partner with deep localized market insights, offering quick approvals and specialized project development oversight.",
        "MinCreditScore": 620,
        "MaxLTC": 85,
        "MaxLTV": 75,
        "MinLoanAmount": 100000,
        "MaxLoanAmount": 1500000,
        "OriginationFee": "2.0% - 3.0%",
        "InterestRates": "8.00% - 10.50%",
        "SpeedToClose": "7 - Days",
        "BankruptcyWaitTime": "2 Years",
        "ForeclosureWaitTime": "2 Years",
        "AuditConfidence": "92%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Texas Mortgage Place",
        "State": "Texas",
        "City": "Dallas",
        "Lender City & State": "Garland, TX 75041",
        "Lender Phone": "(214) 824-0417",
        "Lender Website": "http://www.texasmortgageplace.com/",
        "Lending Location": "Dallas, Fort Worth",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "Texas-centric direct private money lender focused on small and medium balance commercial and residential transition projects throughout DFW.",
        "MinCreditScore": 550,
        "MaxLTC": 80,
        "MaxLTV": 70,
        "MinLoanAmount": 50000,
        "MaxLoanAmount": 750000,
        "OriginationFee": "1.5% - 2.5%",
        "InterestRates": "8.25% - 10.00%",
        "SpeedToClose": "5 - 7 Days",
        "BankruptcyWaitTime": "No Requirement",
        "ForeclosureWaitTime": "1 Year",
        "AuditConfidence": "93%",
        "LiquidityVerified": false
      },
      {
        "Lender": "LendingOne",
        "State": "Alabama",
        "City": "Birmingham",
        "Lender City & State": "Boca Raton, FL 33431",
        "Lender Phone": "(866) 782-3464",
        "Lender Website": "http://www.lendingone.com/",
        "Lending Location": "AL, AR, CA, CO, CT, DE, FL, GA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "One of the country's preeminent direct private lenders. Uses algorithmic pricing models to expedite fix and flip and long-term rental allocations.",
        "MinCreditScore": 640,
        "MaxLTC": 90,
        "MaxLTV": 80,
        "MinLoanAmount": 150000,
        "MaxLoanAmount": 10000000,
        "OriginationFee": "1.5% - 2.25%",
        "InterestRates": "7.25% - 9.75%",
        "SpeedToClose": "8 - 12 Days",
        "BankruptcyWaitTime": "2 Years",
        "ForeclosureWaitTime": "3 Years",
        "AuditConfidence": "98%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Pine Financial Group",
        "State": "Colorado",
        "City": "Boulder",
        "Lender City & State": "Wheat Ridge, CO 80033",
        "Lender Phone": "(303) 835-4445",
        "Lender Website": "http://www.pinefinancialgroup.com/",
        "Lending Location": "CO, MN",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "About the Lender": "Famed for its 100% funding and zero-down capabilities for highly experienced and profitable fix and flip development projects in select territories.",
        "MinCreditScore": 600,
        "MaxLTC": 100,
        "MaxLTV": 75,
        "MinLoanAmount": 100000,
        "MaxLoanAmount": 2500000,
        "OriginationFee": "2.5% - 4.0%",
        "InterestRates": "9.99% - 12.00%",
        "SpeedToClose": "10 - 15 Days",
        "BankruptcyWaitTime": "1 Year",
        "ForeclosureWaitTime": "2 Years",
        "AuditConfidence": "95%",
        "LiquidityVerified": true
      },
      {
        "Lender": "Adler Private Lending",
        "State": "Washington DC",
        "City": "Washington DC",
        "Lender City & State": "Fairfax, VA 22030",
        "Lender Phone": "(703) 591-0345",
        "Lender Website": "http://www.adlerprivatelending.com/",
        "Lending Location": "DC, MD, VA",
        "Loan Types Offered": "Bridge Loans, Commercial Hard Money Loans, Fix and Flip Loans",
        "Property Types": "Apartment, Industrial, Mixed Use, Multi Family, Office, Retail, Single Family",
        "About the Lender": "Boutique capital firm specialized in short-duration commercial real estate asset stabilization and transition loans within the Mid-Atlantic states.",
        "MinCreditScore": 620,
        "MaxLTC": 80,
        "MaxLTV": 75,
        "MinLoanAmount": 200000,
        "MaxLoanAmount": 5000000,
        "OriginationFee": "2.0% - 3.0%",
        "InterestRates": "8.25% - 10.50%",
        "SpeedToClose": "7 - 10 Days",
        "BankruptcyWaitTime": "2 Years",
        "ForeclosureWaitTime": "2 Years",
        "AuditConfidence": "94%",
        "LiquidityVerified": true
      }
    ],

    // Active Selected Lender for Detailed Profile View Modal/Panel
    activeProfile: null,

    // Dynamic Comparison Selection Array (Max 3)
    comparisonList: [],

    // Comparison Mode View Toggle State
    isComparing: false,

    // Search query specific to the profile system
    searchQuery: '',

    init() {
      this.activeProfile = this.lenders[0];
    },

    get filteredLenders() {
      if (!this.searchQuery.trim()) {
        return this.lenders;
      }
      return this.lenders.filter(l => 
        l.Lender.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.State.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    // Set the designated lender for detailed profile views
    selectProfile(lenderName) {
      const lender = this.lenders.find(l => l.Lender === lenderName);
      if (lender) {
        this.activeProfile = lender;
        // Dispatch global event for visual highlight synchronization if applicable
        window.dispatchEvent(new CustomEvent('lender-profile-selected', { detail: lender }));
      }
    },

    // Manage Comparison Array
    toggleComparison(lenderName) {
      const index = this.comparisonList.findIndex(l => l.Lender === lenderName);
      
      if (index !== -1) {
        // Remove if already present
        this.comparisonList.splice(index, 1);
        this.dispatchToast(`Removed ${lenderName} from Comparison Engine.`);
      } else {
        // Enforce maximum of 3 selections
        if (this.comparisonList.length >= 3) {
          this.dispatchToast('Underwriting Pipeline Cap: Maximum of 3 lenders can be compared simultaneously.');
          return;
        }
        
        const lender = this.lenders.find(l => l.Lender === lenderName);
        if (lender) {
          this.comparisonList.push(lender);
          this.dispatchToast(`Added ${lenderName} to Comparison Pipeline.`);
        }
      }
    },

    isInComparison(lenderName) {
      return this.comparisonList.some(l => l.Lender === lenderName);
    },

    clearComparison() {
      this.comparisonList = [];
      this.isComparing = false;
      this.dispatchToast('Comparison matrix cleared successfully.');
    },

    // Global communication dispatcher
    dispatchToast(msg) {
      window.dispatchEvent(new CustomEvent('toast-notify', {
        detail: msg
      }));
    },

    // Mathematical highlighting logic for comparison cards
    getBestLTC() {
      if (this.comparisonList.length === 0) return 0;
      return Math.max(...this.comparisonList.map(l => l.MaxLTC));
    },

    getLowestMinCredit() {
      if (this.comparisonList.length === 0) return Infinity;
      return Math.min(...this.comparisonList.map(l => l.MinCreditScore));
    },

    getBestLTV() {
      if (this.comparisonList.length === 0) return 0;
      return Math.max(...this.comparisonList.map(l => l.MaxLTV));
    },

    // Parse values like "5 - 7 Days" to estimate minimum speed for highlighting advantages
    getFastestCloseDays() {
      if (this.comparisonList.length === 0) return Infinity;
      return Math.min(...this.comparisonList.map(l => {
        const matches = l.SpeedToClose.match(/\d+/);
        return matches ? parseInt(matches[0]) : 999;
      }));
    }
  }));
});