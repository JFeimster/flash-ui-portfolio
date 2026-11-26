// Hard Money Resource Center & Terminology Glossary
// Designed to integrate with Capital_Vault's terminal-style visual system.

const HardMoneyGlossary = [
  {
    term: "Loan-To-Value",
    abbr: "LTV",
    category: "Metrics",
    definition: "The ratio of the loan amount to the appraised value of the property. For hard money, this is often calculated as 'As-Is' LTV or 'After Repair Value' (ARV) LTV.",
    formula: "LTV = (Loan Amount / Property Value) × 100",
    importance: "Lenders use LTV to determine systemic risk. Higher LTV means lower borrower equity, increasing default risk.",
    proTip: "Ask lenders if they base their LTV on 'As-Is' or 'As-Completed' value. An As-Completed (ARV) structure unlocks significantly more capital upfront.",
    riskLevel: "High Risk if > 75%"
  },
  {
    term: "Loan-To-Cost",
    abbr: "LTC",
    category: "Metrics",
    definition: "The ratio comparing the loan amount to the total cost of the acquisition and renovation project. This limits the total leverage on the actual cash outflow.",
    formula: "LTC = (Loan Amount / Total Project Cost) × 100",
    importance: "Ensures the investor has skin in the game. Many hard money lenders cap LTC at 85% to 90%, forcing the developer to fund the remainder.",
    proTip: "If you purchase a property significantly under market value, LTC limits might restrict your loan amount more than LTV.",
    riskLevel: "Medium Risk"
  },
  {
    term: "Debt Service Coverage Ratio",
    abbr: "DSCR",
    category: "Metrics",
    definition: "A metric comparing rental income against debt obligations, used to determine if a property produces enough cash flow to cover the loan payments.",
    formula: "DSCR = Gross Monthly Rental Income / Monthly Debt Service (PITI)",
    importance: "Mainly used for long-term rental conversions or DSCR-based cash-out loans. A ratio below 1.0 means the property loses money monthly.",
    proTip: "Aim for a 1.25 DSCR. Many institutional private lenders offer pricing breaks, reduced points, or faster approvals once you pass the 1.20x threshold.",
    riskLevel: "Critical Metric"
  },
  {
    term: "Points",
    abbr: "PTS",
    category: "Costs",
    definition: "Prepaid interest charged by the lender at closing. One point is equivalent to 1% of the total loan amount.",
    formula: "Cost of Points = Loan Amount × (Number of Points / 100)",
    importance: "This is the primary way hard money lenders generate yield on short-term instruments. Points are paid out of pocket or wrapped into the loan.",
    proTip: "Points are often highly negotiable. If a lender demands 3 points, offer to pay a slightly higher interest rate in exchange for reducing it to 1.5 points to preserve closing cash.",
    riskLevel: "High Expense"
  },
  {
    term: "Usury Laws",
    abbr: "USR",
    category: "Legal",
    definition: "State-level regulations setting legal limits on the maximum interest rates and fees lenders can charge.",
    formula: "Varies by State jurisdiction",
    importance: "Protects borrowers from predatory interest rates. However, many states exempt business-purpose or commercial loans from usury caps.",
    proTip: "Always borrow under an LLC or corporate entity structure. Doing so typically classifies the transaction as a commercial venture, bypassing restrictive consumer protection/usury rules.",
    riskLevel: "Regulatory Framework"
  },
  {
    term: "Draw Schedule",
    abbr: "DRW",
    category: "Structures",
    definition: "A structured timeline detailing when rehab funds are released. Funds are held in escrow and drawn down as physical milestones are completed.",
    formula: "Total Rehab Pool / Milestones",
    importance: "Prevents contractors from running off with unspent funds. Protects the lender's collateral value at each phase of the renovation.",
    proTip: "Negotiate for an initial draw at closing if possible to fund material purchases. Ensure your contractor agrees to the draw milestones before signing the loan docs.",
    riskLevel: "Operational Critical"
  },
  {
    term: "Prepayment Penalty",
    abbr: "PPP",
    category: "Costs",
    definition: "A fee charged if the borrower pays off the loan before a specified period, protecting the lender's expected interest yield.",
    formula: "Minimum Guaranteed Interest Period (e.g., 3-6 months)",
    importance: "Can devastate profits if a rehab project is completed ahead of schedule and sold before the lockout period ends.",
    proTip: "Negotiate hard for a 'no prepay penalty' clause. If impossible, try to limit the minimum interest to 3 months max.",
    riskLevel: "High Impact"
  }
];

const NegotiatorScenarios = [
  {
    id: "points_vs_rate",
    title: "Points vs. Interest Rate Strategy",
    description: "You are short on upfront closing cash but expect high rental income or a quick exit.",
    script: "Lender, I appreciate your term sheet at 10.5% and 2.5 points. Since our exit strategy is extremely fast (under 4 months), I'd like to propose moving the rate to 11.25% in exchange for reducing points to 1.25%. This protects our upfront liquidity while giving you higher active yields during our fast-turn cycle."
  },
  {
    id: "draw_flexibility",
    title: "Draw Inspection Delays",
    description: "Your general contractor needs faster cash flow to maintain momentum, but inspections take 5 days.",
    script: "We need to optimize the draw mechanism to avoid site stalls. Can we establish a 'Self-Certification' path for minor draws under $10,000 using geo-tagged video walkthroughs, followed by formal physical inspections only on major structural milestone releases?"
  },
  {
    id: "ltv_negotiation",
    title: "Increasing Leverage on High-ARV deals",
    description: "The property has an exceptional ARV but the lender caps entry LTV at 70%.",
    script: "Given that our projected ARV is supported by three active neighborhood comps under contract within 0.2 miles, can we restructure this into an 85% LTC loan? We are adding substantial value, and this structure ensures our interests remain perfectly aligned."
  }
];

// Alpine.js Educational & Resource State Register
window.resourceCenterState = function() {
  return {
    glossary: HardMoneyGlossary,
    scenarios: NegotiatorScenarios,
    activeCategory: 'All',
    searchQuery: '',
    selectedTerm: null,
    
    // Calculator States
    calcType: 'ltv', // 'ltv', 'dscr', 'draw'
    
    // LTV/LTC calculator inputs
    purchasePrice: 350000,
    rehabBudget: 75000,
    arv: 520000,
    desiredLTV: 75,
    desiredLTC: 85,
    
    // DSCR calculator inputs
    monthlyRent: 35000,
    mortgagePITI: 28000,
    
    // Draw scheduler inputs
    totalRehab: 80000,
    drawStages: 4,

    // Negotiation Selector
    selectedScenario: NegotiatorScenarios[0],

    init() {
      // Automatic initializer setup
    },

    get filteredGlossary() {
      return this.glossary.filter(item => {
        const matchesCategory = this.activeCategory === 'All' || item.category === this.activeCategory;
        const matchesSearch = this.searchQuery === '' || 
          item.term.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.abbr.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.definition.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },

    // Computational properties for calculators
    get ltvCalculations() {
      const loanByLTV = parseFloat(this.arv) * (parseFloat(this.desiredLTV) / 100);
      const totalProjectCost = parseFloat(this.purchasePrice) + parseFloat(this.rehabBudget);
      const loanByLTC = totalProjectCost * (parseFloat(this.desiredLTC) / 100);
      
      // Traditional hard money limits to the lower of LTV or LTC
      const recommendedLoan = Math.min(loanByLTV, loanByLTC);
      const requiredCash = totalProjectCost - recommendedLoan;

      return {
        loanByLTV: loanByLTV.toFixed(0),
        loanByLTC: loanByLTC.toFixed(0),
        recommendedLoan: recommendedLoan.toFixed(0),
        requiredCash: requiredCash.toFixed(0),
        leveragePercent: ((recommendedLoan / totalProjectCost) * 100).toFixed(1)
      };
    },

    get dscrCalculations() {
      const rent = parseFloat(this.monthlyRent) || 0;
      const piti = parseFloat(this.mortgagePITI) || 1; // avoid division by zero
      const ratio = rent / piti;
      
      let status = 'REJECTED';
      let color = 'text-red-500';
      if (ratio >= 1.25) {
        status = 'OPTIMAL';
        color = 'text-brand-neonGreen';
      } else if (ratio >= 1.0) {
        status = 'ACCURATE (MARGINAL)';
        color = 'text-brand-accent';
      }

      return {
        ratio: ratio.toFixed(2),
        status,
        color
      };
    },

    get generatedDrawSchedule() {
      const total = parseFloat(this.totalRehab) || 0;
      const stages = parseInt(this.drawStages) || 3;
      const costPerStage = total / stages;
      const schedule = [];

      for (let i = 1; i <= stages; i++) {
        let milestone = "Rehab Phase Complete";
        if (i === 1) milestone = "Demolition & Structural Rough-Ins";
        else if (i === stages) milestone = "Final Fixtures, Punchlist & Closeout";
        else if (i === 2) milestone = "Drywall, Mechanicals & Framing";
        else milestone = "Finishes, Cabinets & Flooring";

        schedule.push({
          stage: i,
          milestone,
          payout: costPerStage.toFixed(0),
          inspectionFee: "$150"
        });
      }

      return schedule;
    },

    selectCategory(cat) {
      this.activeCategory = cat;
    },

    setCalculator(type) {
      this.calcType = type;
    },

    selectScenarioById(id) {
      this.selectedScenario = this.scenarios.find(s => s.id === id);
    },

    copyScriptToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        window.dispatchEvent(new CustomEvent('toast-notify', {
          detail: "Negotiation script copied to tactical system buffer."
        }));
      }).catch(() => {
        alert("Failed to copy text. Script is: " + text);
      });
    }
  };
};

// Automatic integration check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.Alpine) {
      window.Alpine.data('resourceCenterState', window.resourceCenterState);
    }
  });
} else {
  if (window.Alpine) {
    window.Alpine.data('resourceCenterState', window.resourceCenterState);
  }
}