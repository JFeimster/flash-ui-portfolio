const ValuationTerminal = {
    config: {
        riskThresholds: {
            dscr: 1.25,
            roi: 15,
            leverage: 4.0
        },
        colors: {
            safe: '#C1FF00',
            risk: '#FF3D00',
            neutral: '#8E593E',
            text: '#F5F5F0'
        }
    },

    init() {
        console.log("OXIDIZED LEDGER: Valuation Logic Module Initialized");
        this.setupEventListeners();
    },

    /**
     * Core Financial Calculations
     */
    calculateSDE(revenue, cogs, operatingExpenses, addBacks) {
        return (revenue - cogs - operatingExpenses) + addBacks;
    },

    calculateDebtService(loanAmount, annualRate, years) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        return monthlyPayment * 12;
    },

    /**
     * High-Fidelity Terminal Projection
     */
    runAnalysis(inputs) {
        const {
            askingPrice,
            revenue,
            cogs,
            opex,
            addBacks,
            downPaymentPercent,
            interestRate,
            loanTerm
        } = inputs;

        const sde = this.calculateSDE(revenue, cogs, opex, addBacks);
        const equity = askingPrice * (downPaymentPercent / 100);
        const loanAmount = askingPrice - equity;
        const annualDebtService = this.calculateDebtService(loanAmount, interestRate, loanTerm);
        
        const dscr = sde / annualDebtService;
        const postDebtCashFlow = sde - annualDebtService;
        const roi = (postDebtCashFlow / equity) * 100;
        const multiple = askingPrice / sde;

        return {
            metrics: {
                sde,
                multiple,
                dscr,
                roi,
                postDebtCashFlow,
                leverageRatio: loanAmount / sde
            },
            risks: {
                dscrRisk: dscr < this.config.riskThresholds.dscr,
                roiRisk: roi < this.config.riskThresholds.roi,
                leverageRisk: (loanAmount / sde) > this.config.riskThresholds.leverage
            }
        };
    },

    /**
     * Generates a sensitivity matrix (Multiple vs. SDE Growth)
     */
    generateSensitivityMatrix(baseSde, basePrice) {
        const multiples = [2.0, 2.5, 3.0, 3.5, 4.0];
        const growthRates = [-0.1, 0, 0.1, 0.2, 0.3];
        
        const matrix = [];
        multiples.forEach(m => {
            const row = [];
            growthRates.forEach(g => {
                const projectedSde = baseSde * (1 + g);
                const impliedValuation = projectedSde * m;
                row.push({
                    val: impliedValuation,
                    isOvervalued: impliedValuation < basePrice
                });
            });
            matrix.push(row);
        });
        return matrix;
    },

    /**
     * Terminal-Style Chart Renderer (SVG)
     */
    renderMiniChart(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const width = 300;
        const height = 100;
        const max = Math.max(...data);
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d / max) * height;
            return `${x},${y}`;
        }).join(' ');

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" style="filter: drop-shadow(0 0 5px ${this.config.colors.safe}44)">
                <polyline 
                    fill="none" 
                    stroke="${this.config.colors.safe}" 
                    stroke-width="2" 
                    points="${points}" 
                />
                <rect width="${width}" height="${height}" fill="url(#grid)" />
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
                    </pattern>
                </defs>
            </svg>
        `;
    },

    /**
     * UI Updates for Terminal Display
     */
    updateTerminalDisplay(results) {
        const dscrEl = document.querySelector('[data-metric="dscr"]');
        const roiEl = document.querySelector('[data-metric="roi"]');
        
        if (dscrEl) {
            dscrEl.textContent = results.metrics.dscr.toFixed(2);
            dscrEl.style.color = results.risks.dscrRisk ? this.config.colors.risk : this.config.colors.safe;
        }

        if (roiEl) {
            roiEl.textContent = results.metrics.roi.toFixed(1) + '%';
            roiEl.style.color = results.risks.roiRisk ? this.config.colors.risk : this.config.colors.safe;
        }

        // Pulse warning if risky
        if (Object.values(results.risks).some(v => v === true)) {
            document.body.style.borderTop = `4px solid ${this.config.colors.risk}`;
            console.warn("VALUATION ALERT: High Risk Thresholds Breached");
        } else {
            document.body.style.borderTop = "none";
        }
    },

    /**
     * Internal Tool: Formatter
     */
    formatCurrency(val) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    }
};

// Integration Hook for the existing "Analyze" buttons
window.analyzeDeal = function(id) {
    const deal = listings.find(l => l.id === id);
    if (!deal) return;

    const analysis = ValuationTerminal.runAnalysis({
        askingPrice: deal.price,
        revenue: deal.revenue,
        cogs: deal.revenue * 0.4, // Estimated
        opex: deal.revenue * 0.3, // Estimated
        addBacks: deal.sde - (deal.revenue * 0.3), // Reverse calculated
        downPaymentPercent: 10,
        interestRate: 11.5,
        loanTerm: 10
    });

    const modalBody = document.getElementById('modalBody');
    const riskClass = analysis.risks.dscrRisk ? 'color: var(--blood-orange)' : 'color: var(--acid-green)';

    modalBody.innerHTML = `
        <div class="mono" style="font-size: 0.7rem; color: #666; margin-bottom: 2rem;">[ TERMINAL ANALYSIS ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} ]</div>
        <h2 class="mono" style="margin-bottom: 2rem;">DEAL: ${deal.title}</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <div class="metric-box" style="margin-bottom: 1rem;">
                    <span class="label">SDE Multiple</span>
                    <span class="value">${analysis.metrics.multiple.toFixed(2)}x</span>
                </div>
                <div class="metric-box" style="margin-bottom: 1rem;">
                    <span class="label">Debt Service Coverage (DSCR)</span>
                    <span class="value" style="${riskClass}">${analysis.metrics.dscr.toFixed(2)}</span>
                </div>
                <div class="metric-box">
                    <span class="label">Projected Annual ROI</span>
                    <span class="value" style="${analysis.risks.roiRisk ? 'color: var(--blood-orange)' : 'color: var(--acid-green)'}">
                        ${analysis.metrics.roi.toFixed(1)}%
                    </span>
                </div>
            </div>
            
            <div style="border-left: 1px solid var(--graphite); padding-left: 2rem;">
                <h4 class="mono" style="font-size: 0.6rem; color: #555; margin-bottom: 1rem;">PROJECTION TREND</h4>
                <div id="miniChart" style="height: 100px; background: #000;"></div>
                <p class="mono" style="font-size: 0.6rem; color: #444; margin-top: 1rem;">
                    Leverage Ratio: ${analysis.metrics.leverageRatio.toFixed(2)}x<br>
                    Post-Debt Flow: ${ValuationTerminal.formatCurrency(analysis.metrics.postDebtCashFlow)}
                </p>
            </div>
        </div>

        <div style="margin-top: 3rem;">
            <h4 class="mono" style="font-size: 0.7rem; margin-bottom: 1rem;">SENSITIVITY MATRIX (VALUATION VS GROWTH)</h4>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 2px; background: var(--graphite);">
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">Mult \\ Gr</div>
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">-10%</div>
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">0%</div>
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">+10%</div>
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">+20%</div>
                <div class="metric-box mono" style="font-size: 0.5rem; background: #080808;">+30%</div>
                ${ValuationTerminal.generateSensitivityMatrix(deal.sde, deal.price).map((row, i) => `
                    <div class="metric-box mono" style="font-size: 0.6rem; font-weight: 900;">${(2 + (i * 0.5)).toFixed(1)}x</div>
                    ${row.map(cell => `
                        <div class="metric-box mono" style="font-size: 0.5rem; color: ${cell.isOvervalued ? 'var(--blood-orange)' : '#888'}">
                            ${ValuationTerminal.formatCurrency(cell.val / 1000)}k
                        </div>
                    `).join('')}
                `).join('')}
            </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;">EXPORT FINANCIAL MODEL (XLSX)</button>
    `;

    document.getElementById('dealModal').style.display = 'flex';
    
    // Render dynamic chart
    const trendData = [deal.sde * 0.9, deal.sde * 0.95, deal.sde, deal.sde * 1.05, deal.sde * 1.12, deal.sde * 1.2];
    ValuationTerminal.renderMiniChart(trendData, 'miniChart');
};

ValuationTerminal.init();