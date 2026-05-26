/**
 * OXIDIZED LEDGER | Deal Intelligence Terminal
 * Core Financial Modeling Engine v1.0.4
 */

const TERMINAL_CONFIG = {
    colors: {
        obsidian: '#050505',
        bone: '#F5F5F0',
        acidGreen: '#C1FF00',
        copper: '#8E593E',
        bloodOrange: '#FF3D00',
        graphite: '#1A1A1A'
    },
    thresholds: {
        dscrCritical: 1.15,
        dscrWarning: 1.35,
        roiTarget: 25.0
    }
};

class DealAnalyzer {
    constructor() {
        this.inputs = {
            askingPrice: 0,
            sde: 0,
            downPaymentPct: 10,
            interestRate: 11.5,
            loanTermYears: 10,
            workingCapital: 0
        };
        this.results = {};
    }

    /**
     * Primary Calculation Engine
     */
    calculate(params) {
        this.inputs = { ...this.inputs, ...params };
        
        const loanAmount = this.inputs.askingPrice * (1 - (this.inputs.downPaymentPct / 100));
        const monthlyRate = (this.inputs.interestRate / 100) / 12;
        const numPayments = this.inputs.loanTermYears * 12;

        // Amortization (M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ])
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        const annualDebtService = monthlyPayment * 12;
        
        const cashFlowPostDebt = this.inputs.sde - annualDebtService;
        const downPaymentAmount = this.inputs.askingPrice * (this.inputs.downPaymentPct / 100);
        const totalCapitalRequired = downPaymentAmount + this.inputs.workingCapital;
        
        const dscr = this.inputs.sde / annualDebtService;
        const roi = (cashFlowPostDebt / totalCapitalRequired) * 100;
        const multiple = this.inputs.askingPrice / this.inputs.sde;

        this.results = {
            loanAmount,
            monthlyPayment,
            annualDebtService,
            cashFlowPostDebt,
            totalCapitalRequired,
            dscr,
            roi,
            multiple
        };

        return this.results;
    }

    /**
     * Generates a 5x5 sensitivity matrix for Multiple vs SDE variance
     */
    getSensitivityMatrix() {
        const multiples = [this.results.multiple * 0.8, this.results.multiple * 0.9, this.results.multiple, this.results.multiple * 1.1, this.results.multiple * 1.2];
        const sdeVariances = [0.8, 0.9, 1.0, 1.1, 1.2]; // -20% to +20%
        
        return sdeVariances.map(variance => {
            const currentSDE = this.inputs.sde * variance;
            return multiples.map(m => {
                const price = currentSDE * m;
                const loan = price * (1 - (this.inputs.downPaymentPct / 100));
                // Simplified annual debt estimation for speed in table
                const estDebt = (loan * (this.inputs.interestRate / 100)) + (loan / this.inputs.loanTermYears);
                const dscr = currentSDE / estDebt;
                return {
                    price,
                    dscr,
                    roi: ((currentSDE - estDebt) / (price * (this.inputs.downPaymentPct / 100))) * 100
                };
            });
        });
    }

    /**
     * UI Renderer for the Analyzer Modal
     */
    renderTerminal(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const riskColor = this.results.dscr < TERMINAL_CONFIG.thresholds.dscrCritical ? TERMINAL_CONFIG.colors.bloodOrange : 
                         (this.results.dscr < TERMINAL_CONFIG.thresholds.dscrWarning ? TERMINAL_CONFIG.colors.copper : TERMINAL_CONFIG.colors.acidGreen);

        const matrix = this.getSensitivityMatrix();

        container.innerHTML = `
            <div style="font-family: 'JetBrains Mono', monospace; background: ${TERMINAL_CONFIG.colors.obsidian}; color: ${TERMINAL_CONFIG.colors.bone}; border: 2px solid ${TERMINAL_CONFIG.colors.bone}; padding: 2rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 1rem; margin-bottom: 2rem;">
                    <div>
                        <div style="font-size: 0.7rem; color: #666;">TERMINAL_ID: 0x${Math.random().toString(16).slice(2, 8).toUpperCase()}</div>
                        <div style="font-weight: 900; font-size: 1.5rem;">DEAL_ANALYZER_PROGENY</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.7rem; color: #666;">STATUS: ${this.results.dscr < 1.0 ? 'FAILED_STRESS_TEST' : 'OPERATIONAL'}</div>
                        <div style="font-weight: 900; color: ${riskColor};">[ RISK_LVL: ${this.results.dscr < 1.2 ? 'CRITICAL' : 'OPTIMAL'} ]</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: ${TERMINAL_CONFIG.colors.graphite}; padding: 1rem; border: 1px solid #333;">
                        <div style="font-size: 0.6rem; color: #888;">DEBT SERVICE COVERAGE (DSCR)</div>
                        <div style="font-size: 1.8rem; font-weight: 900; color: ${riskColor};">${this.results.dscr.toFixed(2)}x</div>
                    </div>
                    <div style="background: ${TERMINAL_CONFIG.colors.graphite}; padding: 1rem; border: 1px solid #333;">
                        <div style="font-size: 0.6rem; color: #888;">CASH-ON-CASH ROI</div>
                        <div style="font-size: 1.8rem; font-weight: 900; color: ${TERMINAL_CONFIG.colors.bone};">${this.results.roi.toFixed(1)}%</div>
                    </div>
                    <div style="background: ${TERMINAL_CONFIG.colors.graphite}; padding: 1rem; border: 1px solid #333;">
                        <div style="font-size: 0.6rem; color: #888;">POST-DEBT CASH FLOW</div>
                        <div style="font-size: 1.8rem; font-weight: 900; color: ${TERMINAL_CONFIG.colors.acidGreen};">$${Math.round(this.results.cashFlowPostDebt / 1000)}K</div>
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <div style="font-size: 0.7rem; margin-bottom: 1rem; color: ${TERMINAL_CONFIG.colors.copper}; font-weight: 900;">// SENSITIVITY_ANALYSIS_MATRIX (ROI%)</div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.7rem; text-align: center;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #333; padding: 0.5rem; color: #666;">SDE \ MULT</th>
                                    <th style="border: 1px solid #333; padding: 0.5rem;">-20%</th>
                                    <th style="border: 1px solid #333; padding: 0.5rem;">-10%</th>
                                    <th style="border: 1px solid #333; padding: 0.5rem; color: ${TERMINAL_CONFIG.colors.acidGreen};">BASE</th>
                                    <th style="border: 1px solid #333; padding: 0.5rem;">+10%</th>
                                    <th style="border: 1px solid #333; padding: 0.5rem;">+20%</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${matrix.map((row, i) => `
                                    <tr>
                                        <td style="border: 1px solid #333; padding: 0.5rem; font-weight: 900;">${['80%', '90%', '100%', '110%', '120%'][i]}</td>
                                        ${row.map(cell => `
                                            <td style="border: 1px solid #333; padding: 0.5rem; color: ${cell.roi < 0 ? TERMINAL_CONFIG.colors.bloodOrange : (cell.dscr < 1.2 ? TERMINAL_CONFIG.colors.copper : '#888')};">
                                                ${Math.round(cell.roi)}%
                                            </td>
                                        `).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="border-top: 1px solid #333; padding-top: 1rem; font-size: 0.6rem; color: #555;">
                    SYSTEM NOTES: CALCULATIONS ASSUME FULLY AMORTIZING SBA 7(A) DEBT AT ${this.inputs.interestRate}% OVER ${this.inputs.loanTermYears}Y. 
                    RISK THRESHOLDS CONFIGURED AT 1.25x DSCR FLOOR. DO NOT PROCEED IF DSCR < 1.0x.
                </div>
            </div>
        `;
    }
}

// Global accessor for the terminal
window.OxidizedAnalyzer = new DealAnalyzer();

/**
 * Example Integration Function
 * To be called from the main component's "Analyze" button
 */
function runDealAnalysis(dealData) {
    const analyzer = window.OxidizedAnalyzer;
    analyzer.calculate({
        askingPrice: dealData.price,
        sde: dealData.sde,
        downPaymentPct: 10,
        interestRate: 11.25,
        loanTermYears: 10,
        workingCapital: dealData.price * 0.05
    });
    
    analyzer.renderTerminal('modalBody');
}
// END OF FILE
```