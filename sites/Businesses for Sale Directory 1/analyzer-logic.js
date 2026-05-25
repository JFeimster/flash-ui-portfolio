/**
 * EQUITY TERMINAL | Financial Workbench Logic
 * High-stakes Deal Analyzer Calculation Engine
 */

const DealAnalyzer = {
    params: {
        minDSCR: 1.25,
        targetROI: 0.25,
        maxMultiple: 4.0
    },

    init() {
        this.registerEventListeners();
        this.runAnalysis(); // Initial calculation
    },

    registerEventListeners() {
        // Listen to all inputs within the analyzer scope
        const inputs = document.querySelectorAll('.analyzer-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.runAnalysis());
        });
    },

    getVal(id) {
        const el = document.getElementById(id);
        return el ? parseFloat(el.value) || 0 : 0;
    },

    formatCurrency(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    },

    calculateDebtService(principal, annualRate, years) {
        if (principal <= 0 || years <= 0) return 0;
        const monthlyRate = (annualRate / 100) / 12;
        const numberOfPayments = years * 12;
        
        if (monthlyRate === 0) return principal / numberOfPayments;

        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                               (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment * 12; // Returns Annual Debt Service
    },

    runAnalysis() {
        // Inputs
        const sde = this.getVal('an-sde');
        const askingPrice = this.getVal('an-asking-price');
        const downPayment = this.getVal('an-down-payment');
        const interestRate = this.getVal('an-interest-rate');
        const loanTerm = this.getVal('an-loan-term');
        const closingCosts = this.getVal('an-closing-costs');

        // Logic
        const loanAmount = Math.max(0, askingPrice - downPayment);
        const annualDebtService = this.calculateDebtService(loanAmount, interestRate, loanTerm);
        const multiple = sde > 0 ? (askingPrice / sde) : 0;
        const postDebtCashFlow = sde - annualDebtService;
        const dscr = annualDebtService > 0 ? (sde / annualDebtService) : 0;
        const totalCashAtRisk = downPayment + closingCosts;
        const roi = totalCashAtRisk > 0 ? (postDebtCashFlow / totalCashAtRisk) : 0;

        this.updateUI({
            multiple,
            dscr,
            roi,
            postDebtCashFlow,
            annualDebtService,
            loanAmount
        });
    },

    updateUI(results) {
        // Update Raw Values
        this.safeUpdateText('out-multiple', results.multiple.toFixed(2) + 'x');
        this.safeUpdateText('out-dscr', results.dscr.toFixed(2));
        this.safeUpdateText('out-roi', (results.roi * 100).toFixed(1) + '%');
        this.safeUpdateText('out-net-cashflow', this.formatCurrency(results.postDebtCashFlow));
        this.safeUpdateText('out-debt-service', this.formatCurrency(results.annualDebtService));

        // High-Stakes Indicators
        this.toggleFlag('out-multiple', results.multiple > this.params.maxMultiple);
        this.toggleFlag('out-dscr', results.dscr < this.params.minDSCR);
        this.toggleFlag('out-roi', results.roi < this.params.targetROI);

        // Terminal Verdict
        const verdictEl = document.getElementById('analyzer-verdict');
        if (verdictEl) {
            const isViable = results.dscr >= this.params.minDSCR && results.roi >= this.params.targetROI;
            verdictEl.innerText = isViable ? '>>> GREEN LIT' : '>>> RED FLAG';
            verdictEl.style.color = isViable ? 'var(--acid-green)' : 'var(--blood-orange)';
            verdictEl.style.borderColor = isViable ? 'var(--acid-green)' : 'var(--blood-orange)';
            
            // Background Pulse for extreme viability
            verdictEl.style.textShadow = isViable ? '0 0 10px rgba(193, 255, 0, 0.4)' : 'none';
        }
    },

    safeUpdateText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    },

    toggleFlag(id, isRed) {
        const el = document.getElementById(id);
        if (!el) return;
        
        if (isRed) {
            el.style.color = 'var(--blood-orange)';
            el.classList.add('flagged');
        } else {
            el.style.color = 'var(--acid-green)';
            el.classList.remove('flagged');
        }
    },

    // Export Data for Memo Generation
    generateSummary() {
        return {
            timestamp: new Date().toISOString(),
            metrics: {
                dscr: document.getElementById('out-dscr')?.innerText,
                roi: document.getElementById('out-roi')?.innerText,
                multiple: document.getElementById('out-multiple')?.innerText
            }
        };
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    DealAnalyzer.init();
    
    // Terminal Log Simulation
    console.log("%c EQUITY TERMINAL ANALYZER v1.0.4 ONLINE ", "background: #C1FF00; color: #050505; font-weight: bold;");
});