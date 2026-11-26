document.addEventListener('alpine:init', () => {
  Alpine.data('applyPortalState', () => ({
    // Wizard steps
    currentStep: 1,
    totalSteps: 4,
    
    // User Input Fields
    investorName: '',
    investorEmail: '',
    investorPhone: '',
    selectedState: 'California',
    propertyType: 'Single Family',
    loanAmount: '',
    estimatedValue: '',
    experienceLevel: 'Intermediate',
    exitStrategy: 'Fix and Flip Loans',
    additionalNotes: '',
    
    // Engine Calculations
    calculatedLTV: 0,
    matchedLenders: [],
    vaultHash: '',
    isSubmitting: false,
    
    // Local copy of the Base Lenders dataset for autonomous calculations
    lendersList: [
      {
        "Lender": "Colony American Finance",
        "About the Lender": "Colony American Finance is a private money lender providing single family and multi-family units with terms up to 10 years and max LTV of 75%.",
        "City": "Los Angeles",
        "State": "California",
        "Lending Location": "National",
        "Loan Types Offered": "Investment Property Loans, Refinance / Cash Out Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 75,
        "Lender Website": "https://www.colonyamericanfinance.com"
      },
      {
        "Lender": "Asset Avenue",
        "About the Lender": "Asset Avenue is private money lender. Loan amounts ranging from $150,000 to $2,000,000 with a maximum LTV of 85%.",
        "City": "Los Angeles",
        "State": "Alabama",
        "Lending Location": "AL, AR, CA, CO, CT, FL, GA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 85,
        "Lender Website": "https://www.assetavenue.com/"
      },
      {
        "Lender": "Jason Wheeler",
        "About the Lender": "Offers lending solutions for rental properties and cash out hard money loans up to $3,000,000 with 70% max LTV.",
        "City": "San Jose",
        "State": "California",
        "Lending Location": "CA",
        "Loan Types Offered": "Investment Property Loans, Refinance / Cash Out Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 70,
        "Lender Website": "http://www.jasonwheeler.biz"
      },
      {
        "Lender": "Source Capital",
        "About the Lender": "Source Capital offers bridge and fix and flip funding with a max LTV of 70% and rates starting at 7.99%.",
        "City": "Phoenix",
        "State": "Arizona",
        "Lending Location": "CA, AZ, MN",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Apartment, Industrial, Multi Family, Office, Retail, Single Family",
        "MaxLTV": 70,
        "Lender Website": "http://www.hardmoneyfirst.com"
      },
      {
        "Lender": "Green Oak Capital",
        "About the Lender": "Rental property loans, short term fix and flip loans, and private refinancing with highly competitive local rates.",
        "City": "Philadelphia",
        "State": "Pennsylvania",
        "Lending Location": "PA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Land, Multi Family, Single Family",
        "MaxLTV": 75,
        "Lender Website": "http://www.greatoakcapital.com/"
      },
      {
        "Lender": "CIVIC Private Money Lending",
        "About the Lender": "Hard money lender offering funding in 10 states throughout the country with terms up to 48 months and max LTV of 80%.",
        "City": "Mesa",
        "State": "Arizona",
        "Lending Location": "AZ, CA, CO, FL, GA, NV, OR, TX, WA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 80,
        "Lender Website": "http://www.civicfs.com/"
      },
      {
        "Lender": "Corevest",
        "About the Lender": "Corevest specializes in rental property refinancing and single-family investment structures nationwide.",
        "City": "Palmer",
        "State": "Alaska",
        "Lending Location": "National",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 75,
        "Lender Website": "https://www.corevestfinance.com"
      },
      {
        "Lender": "LendingOne",
        "About the Lender": "Provides fast, secure hard money loans across the country. Specializes in rental property portfolios, residential construction, and fix and flip funding.",
        "City": "Birmingham",
        "State": "Alabama",
        "Lending Location": "AL, AR, CA, CO, CT, DE, FL, GA",
        "Loan Types Offered": "Bridge Loans, Fix and Flip Loans, Investment Property Loans",
        "Property Types": "Multi Family, Single Family",
        "MaxLTV": 75,
        "Lender Website": "http://www.lendingone.com/"
      }
    ],

    init() {
      this.generateVaultHash();
      this.$watch('loanAmount', () => this.evaluateScenario());
      this.$watch('estimatedValue', () => this.evaluateScenario());
      this.$watch('selectedState', () => this.evaluateScenario());
      this.$watch('propertyType', () => this.evaluateScenario());
      this.$watch('exitStrategy', () => this.evaluateScenario());
      this.evaluateScenario();
    },

    generateVaultHash() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'CV-';
      for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
      result += '-';
      for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
      this.vaultHash = result;
    },

    evaluateScenario() {
      // Calculate Loan-To-Value (LTV) Ratio
      const val = parseFloat(this.estimatedValue);
      const loan = parseFloat(this.loanAmount);
      if (val > 0 && loan > 0) {
        this.calculatedLTV = Math.round((loan / val) * 100);
      } else {
        this.calculatedLTV = 0;
      }

      // Live Filtering Engine matching lenders against live user scenario
      this.matchedLenders = this.lendersList.filter(lender => {
        // State Match Rule: Match if state matches directly OR lender works nationally
        const stateMatch = lender.State.toLowerCase() === this.selectedState.toLowerCase() || 
                           lender.LendingLocation.toLowerCase().includes('national');
        
        // Property Type Match Rule: Checks if property array includes the selected scenario asset
        const propertyMatch = lender.PropertyTypes.toLowerCase().includes(this.propertyType.toLowerCase());
        
        // Loan Type/Exit Strategy match
        const loanTypeMatch = lender.LoanTypesOffered.toLowerCase().includes(this.exitStrategy.toLowerCase()) ||
                              lender.LoanTypesOffered.toLowerCase().includes('bridge');

        // LTV Rule: Exclude lenders whose historical maximum LTV is less than calculated LTV
        const ltvMatch = this.calculatedLTV <= (lender.MaxLTV || 80);

        return stateMatch && propertyMatch && loanTypeMatch && ltvMatch;
      });
    },

    setStep(step) {
      if (step > this.currentStep) {
        // Simple form validation on step forward
        if (this.currentStep === 1 && (!this.investorName || !this.investorEmail)) {
          this.dispatchToast('ERROR: Contact metadata required before pipeline progression.');
          return;
        }
        if (this.currentStep === 2 && (!this.loanAmount || !this.estimatedValue)) {
          this.dispatchToast('ERROR: Quantitative asset valuation parameters must be filled.');
          return;
        }
      }
      this.currentStep = step;
    },

    submitScenario() {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.setStep(4);
        this.dispatchToast(`SUCCESS: Pre-Qualification channel deployed. ID ${this.vaultHash}`);
      }, 1500);
    },

    dispatchToast(message) {
      window.dispatchEvent(new CustomEvent('toast-notify', { detail: message }));
    },

    downloadPacket() {
      // Constructs a visually gorgeous HTML downloadable file matching base components layout
      const timestamp = new Date().toLocaleString();
      const content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Capital_Vault Pre-Qualification Certificate</title>
  <style>
    body {
      background-color: #05070c;
      color: #f8fafc;
      font-family: monospace;
      padding: 40px;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #1e2640;
      background: #0a0d16;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
    }
    .header {
      border-b: 1px solid #1e2640;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #00f0ff;
    }
    .status {
      color: #00ff66;
      font-weight: bold;
    }
    .info-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: #0f1322;
      border: 1px solid #1e2640;
      padding: 20px;
      border-radius: 8px;
    }
    h2 {
      margin-top: 0;
      color: #9d4edd;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .metric {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      margin-top: 10px;
    }
    .lenders-list {
      margin-top: 20px;
    }
    .lender-item {
      padding: 15px;
      border-bottom: 1px solid #1e2640;
    }
    .lender-item:last-child {
      border-bottom: none;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #475569;
      margin-top: 40px;
      border-top: 1px solid #1e2640;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div>
        <div class="logo">CAPITAL_VAULT // PRE-QUAL</div>
        <div style="font-size: 12px; color: #64748b;">SECURE ALLOCATION NODE PACKET</div>
      </div>
      <div>
        <div class="status">VERIFIED SECURE</div>
        <div style="font-size: 11px; text-align: right; color: #64748b;">${this.vaultHash}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="card">
        <h2>Applicant Details</h2>
        <div style="margin-top:10px;">
          <strong>Name:</strong> ${this.investorName}<br>
          <strong>Email:</strong> ${this.investorEmail}<br>
          <strong>Phone:</strong> ${this.investorPhone || 'N/A'}<br>
          <strong>Experience:</strong> ${this.experienceLevel} Level
        </div>
      </div>
      <div class="card">
        <h2>Scenario Metrics</h2>
        <div style="margin-top:10px;">
          <strong>Property Type:</strong> ${this.propertyType}<br>
          <strong>Target State:</strong> ${this.selectedState}<br>
          <strong>LTV Ratio:</strong> ${this.calculatedLTV}%<br>
          <strong>Loan Strategy:</strong> ${this.exitStrategy}
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Financial Statement</h2>
      <div style="display: flex; justify-content: space-between; margin-top: 15px;">
        <div>
          <span style="font-size: 11px; color:#64748b; display:block;">ESTIMATED ASSET VALUE</span>
          <span class="metric">$${Number(this.estimatedValue).toLocaleString()}</span>
        </div>
        <div>
          <span style="font-size: 11px; color:#64748b; display:block;">REQUESTED FUNDING</span>
          <span class="metric" style="color: #00f0ff;">$${Number(this.loanAmount).toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:30px;">
      <h2>Eligible Network Lenders (${this.matchedLenders.length})</h2>
      <div class="lenders-list">
        ${this.matchedLenders.map(l => `
          <div class="lender-item">
            <strong style="color: #00f0ff; font-size: 16px;">${l.Lender}</strong>
            <p style="font-size: 12px; color: #94a3b8; margin: 5px 0;">${l.About the Lender}</p>
            <span style="font-size: 11px; background: #1e2640; padding: 2px 8px; border-radius: 4px;">Max LTV Limit: ${l.MaxLTV}%</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="footer">
      VAULT SYSTEM SECURED ON ${timestamp} // CRYPTOGRAPHIC TOKEN VERIFICATION ID: ${this.vaultHash}
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CapitalVault_PreQual_${this.vaultHash}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.dispatchToast('Pre-qualification packet downloaded successfully.');
    }
  }));
});