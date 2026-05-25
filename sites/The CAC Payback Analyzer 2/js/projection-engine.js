/**
 * Swiss Ledger: Projection Engine
 * Logic for 12-month Growth & Scaling Simulator
 */

class ProjectionEngine {
    constructor() {
        this.scaleMultiplier = 2.0;
        this.retentionRate = 0.92; // Default 92% monthly retention
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectUI();
        this.setupListeners();
        this.update();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .projection-wrapper {
                grid-column: 1 / -1;
                border-top: 2px solid var(--border);
                background: white;
                padding: 40px;
                z-index: 1;
            }
            .projection-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 30px;
            }
            .projection-controls {
                display: flex;
                gap: 40px;
                align-items: center;
                background: var(--paper);
                padding: 20px;
                border: 1px solid var(--border);
            }
            .slider-group {
                flex-grow: 1;
            }
            input[type=range] {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: var(--border);
                outline: none;
                margin: 15px 0;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: var(--accent);
                cursor: pointer;
                border: 2px solid var(--ink);
            }
            .viz-container {
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                gap: 10px;
                height: 200px;
                align-items: flex-end;
                margin: 40px 0;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--grid);
            }
            .viz-bar {
                background: var(--ink);
                position: relative;
                transition: height 0.3s ease;
            }
            .viz-bar.gap {
                background: var(--accent);
                opacity: 0.3;
            }
            .viz-bar.profit {
                background: var(--success);
            }
            .viz-label {
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #666;
            }
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            .stat-card {
                border: 1px solid var(--border);
                padding: 15px;
            }
            .stat-card .label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #666;
                display: block;
                margin-bottom: 5px;
            }
            .stat-card .val {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.02em;
            }
            .highlight-red { color: var(--accent); }
            .highlight-green { color: var(--success); }
        `;
        document.head.appendChild(style);
    }

    injectUI() {
        const container = document.querySelector('.main-grid');
        const projectionHTML = `
            <div class="projection-wrapper">
                <div class="projection-header">
                    <div>
                        <div class="badge">SIMULATOR V1.0</div>
                        <h2 style="text-transform: uppercase; font-weight: 800; font-size: 24px;">Growth & Scaling Forecast</h2>
                    </div>
                    <div class="projection-controls">
                        <div class="slider-group">
                            <label>Scaling Multiplier: <span id="multiplierVal">2.0</span>x Spend</label>
                            <input type="range" id="scaleSlider" min="1" max="10" step="0.5" value="2">
                        </div>
                    </div>
                </div>

                <div class="viz-container" id="chartArea">
                    <!-- Bars injected by JS -->
                </div>

                <div class="summary-grid">
                    <div class="stat-card">
                        <span class="label">Projected 12m Revenue</span>
                        <span class="val" id="totalRev">$0</span>
                    </div>
                    <div class="stat-card">
                        <span class="label">Max Cash Flow Gap</span>
                        <span class="val highlight-red" id="maxGap">$0</span>
                    </div>
                    <div class="stat-card">
                        <span class="label">Est. Funding Requirement</span>
                        <span class="val" id="fundingReq">$0</span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterend', projectionHTML);
    }

    setupListeners() {
        const slider = document.getElementById('scaleSlider');
        const multiplierVal = document.getElementById('multiplierVal');
        
        slider.addEventListener('input', (e) => {
            this.scaleMultiplier = parseFloat(e.target.value);
            multiplierVal.innerText = this.scaleMultiplier.toFixed(1);
            this.update();
        });

        // Listen to changes in base component
        ['spend', 'customers', 'arpu', 'margin'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.update());
        });
    }

    update() {
        const baseSpend = parseFloat(document.getElementById('spend').value) || 0;
        const baseCustomers = parseFloat(document.getElementById('customers').value) || 0;
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const margin = parseFloat(document.getElementById('margin').value) / 100 || 0;

        const scaledMonthlySpend = baseSpend * this.scaleMultiplier;
        const cac = baseCustomers > 0 ? baseSpend / baseCustomers : 0;
        const newCustomersPerMonth = cac > 0 ? scaledMonthlySpend / cac : 0;

        let data = [];
        let totalActiveCustomers = 0;
        let cumulativeGrossProfit = 0;
        let cumulativeSpend = 0;
        let maxGap = 0;

        for (let m = 1; m <= 12; m++) {
            totalActiveCustomers = (totalActiveCustomers * this.retentionRate) + newCustomersPerMonth;
            const monthlyRevenue = totalActiveCustomers * arpu;
            const monthlyGrossProfit = monthlyRevenue * margin;
            
            cumulativeSpend += scaledMonthlySpend;
            cumulativeGrossProfit += monthlyGrossProfit;
            
            const netCashFlow = cumulativeGrossProfit - cumulativeSpend;
            if (netCashFlow < maxGap) maxGap = netCashFlow;

            data.push({
                month: m,
                revenue: monthlyRevenue,
                net: netCashFlow
            });
        }

        this.render(data, maxGap);
    }

    render(data, maxGap) {
        const chartArea = document.getElementById('chartArea');
        const totalRev = document.getElementById('totalRev');
        const maxGapEl = document.getElementById('maxGap');
        const fundingReq = document.getElementById('fundingReq');

        chartArea.innerHTML = '';
        
        const maxRev = Math.max(...data.map(d => d.revenue));
        const total12mRev = data.reduce((sum, d) => sum + d.revenue, 0);

        data.forEach(d => {
            const height = (d.revenue / maxRev) * 100;
            const bar = document.createElement('div');
            bar.className = 'viz-bar';
            if (d.net < 0) bar.classList.add('gap');
            if (d.month === 12) bar.classList.add('profit');
            
            bar.style.height = `${height}%`;
            bar.innerHTML = `<span class="viz-label">M${d.month}</span>`;
            chartArea.appendChild(bar);
        });

        totalRev.innerText = `$${Math.round(total12mRev).toLocaleString()}`;
        maxGapEl.innerText = `$${Math.round(Math.abs(maxGap)).toLocaleString()}`;
        fundingReq.innerText = `$${Math.round(Math.abs(maxGap) * 1.2).toLocaleString()}`;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.projectionEngine = new ProjectionEngine();
});