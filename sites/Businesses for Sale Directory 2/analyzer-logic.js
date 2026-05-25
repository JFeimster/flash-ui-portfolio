/**
 * THE UNDERWRITING LAB // LOGIC CORE
 * Acquisition Index Proprietary Underwriting Terminal v1.0.4
 */

document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        'analyzer-price', 
        'analyzer-sde', 
        'analyzer-downpayment', 
        'analyzer-interest', 
        'analyzer-amortization'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', runUnderwriting);
        }
    });

    // Initial run
    runUnderwriting();
});

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(num);
}

function runUnderwriting() {
    // Input Retrieval
    const price = parseFloat(document.getElementById('analyzer-price')?.value) || 0;
    const sde = parseFloat(document.getElementById('analyzer-sde')?.value) || 0;
    const downPaymentPct = parseFloat(document.getElementById('analyzer-downpayment')?.value) || 0;
    const interestRate = parseFloat(document.getElementById('analyzer-interest')?.value) || 0;
    const amortization = parseInt(document.getElementById('analyzer-amortization')?.value) || 0;

    // Financial Constants
    const downPaymentAmount = price * (downPaymentPct / 100);
    const loanPrincipal = price - downPaymentAmount;
    const monthlyRate = (interestRate / 100) / 12;
    const totalPayments = amortization * 12;

    // Monthly Debt Service Calculation (Amortization Formula)
    let monthlyPayment = 0;
    if (loanPrincipal > 0 && monthlyRate > 0 && totalPayments > 0) {
        monthlyPayment = loanPrincipal * 
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
            (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (loanPrincipal > 0 && totalPayments > 0) {
        monthlyPayment = loanPrincipal / totalPayments;
    }

    const annualDebtService = monthlyPayment * 12;
    const netCashFlow = sde - annualDebtService;
    
    // Key Metrics
    const dscr = annualDebtService > 0 ? (sde / annualDebtService) : 0;
    const cashOnCash = downPaymentAmount > 0 ? (netCashFlow / downPaymentAmount) * 100 : 0;
    const capRate = price > 0 ? (sde / price) * 100 : 0;
    const multiple = sde > 0 ? (price / sde) : 0;

    updateUI({
        loanPrincipal,
        downPaymentAmount,
        annualDebtService,
        netCashFlow,
        dscr,
        cashOnCash,
        capRate,
        multiple
    });
}

function updateUI(data) {
    // DOM Updates
    const updateText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    updateText('out-loan-amount', formatCurrency(data.loanPrincipal));
    updateText('out-downpayment', formatCurrency(data.downPaymentAmount));
    updateText('out-debt-service', formatCurrency(data.annualDebtService));
    updateText('out-cashflow', formatCurrency(data.netCashFlow));
    updateText('out-dscr', data.dscr.toFixed(2) + 'x');
    updateText('out-coc', data.cashOnCash.toFixed(1) + '%');
    updateText('out-cap-rate', data.capRate.toFixed(1) + '%');
    updateText('out-multiple', data.multiple.toFixed(2) + 'x');

    // Visual Signaling (Brutalist logic)
    const dscrEl = document.getElementById('out-dscr');
    if (dscrEl) {
        if (data.dscr < 1.25) {
            dscrEl.style.color = 'var(--blood-orange)';
            updateText('dscr-warning', '[CRITICAL: LOW COVERAGE]');
        } else if (data.dscr >= 1.5) {
            dscrEl.style.color = 'var(--acid-green)';
            updateText('dscr-warning', '[OPTIMAL: BANKABLE]');
        } else {
            dscrEl.style.color = 'var(--bone)';
            updateText('dscr-warning', '[MARGINAL]');
        }
    }

    const cocEl = document.getElementById('out-coc');
    if (cocEl) {
        if (data.cashOnCash > 25) {
            cocEl.style.color = 'var(--acid-green)';
        } else if (data.cashOnCash < 10) {
            cocEl.style.color = 'var(--blood-orange)';
        } else {
            cocEl.style.color = 'var(--bone)';
        }
    }

    // Terminal Status Pulse
    const statusLine = document.getElementById('terminal-status');
    if (statusLine) {
        statusLine.innerText = `CALC_COMPLETE: ${new Date().toLocaleTimeString('en-US', { hour12: false })} // SYSTEM_READY`;
    }
}

/**
 * UTILITY: Deal Scenario Injection
 * Allows users to click preset buttons to test different deal structures
 */
function injectScenario(type) {
    const presets = {
        'micro': { price: 150000, sde: 60000, down: 10, rate: 11, term: 10 },
        'standard-sba': { price: 1200000, sde: 400000, down: 10, rate: 9.5, term: 10 },
        'high-leverage': { price: 5000000, sde: 1200000, down: 5, rate: 10, term: 10 }
    };

    const p = presets[type];
    if (!p) return;

    document.getElementById('analyzer-price').value = p.price;
    document.getElementById('analyzer-sde').value = p.sde;
    document.getElementById('analyzer-downpayment').value = p.down;
    document.getElementById('analyzer-interest').value = p.rate;
    document.getElementById('analyzer-amortization').value = p.term;

    runUnderwriting();
}