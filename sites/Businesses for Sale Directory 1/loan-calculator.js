/**
 * LOAN-CALCULATOR.JS
 * Part of Creative Finance & Seller Note Vault
 * Logic for non-traditional acquisition structures: Seller Notes, Earn-outs, and Equity Rollovers.
 */

class CreativeFinanceCalculator {
    constructor() {
        this.baseStyles = `
            .calculator-vault {
                background: var(--graphite);
                border: 2px solid var(--bone);
                padding: 2.5rem;
                margin: 2rem 0;
                font-family: 'Inter', sans-serif;
                color: var(--bone);
            }
            .vault-header {
                border-bottom: 2px solid var(--oxidized-copper);
                margin-bottom: 2rem;
                padding-bottom: 1rem;
            }
            .vault-header h2 {
                font-family: 'JetBrains Mono', monospace;
                font-size: 1.5rem;
                text-transform: uppercase;
                color: var(--acid-green);
            }
            .calc-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
            }
            .input-group {
                margin-bottom: 1.5rem;
            }
            .input-group label {
                display: block;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                margin-bottom: 0.5rem;
                color: #888;
            }
            .input-group input, .input-group select {
                width: 100%;
                background: var(--obsidian);
                border: 1px solid var(--graphite-light);
                padding: 1rem;
                color: var(--bone);
                font-family: 'JetBrains Mono', monospace;
                outline: none;
            }
            .input-group input:focus {
                border-color: var(--acid-green);
            }
            .results-panel {
                background: var(--obsidian);
                border: 1px solid var(--graphite-light);
                padding: 2rem;
            }
            .result-item {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px dashed #333;
            }
            .result-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                color: var(--oxidized-copper);
            }
            .result-value {
                font-size: 1.4rem;
                font-weight: 800;
            }
            .highlight-value {
                color: var(--acid-green);
            }
            .vault-tabs {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .vault-tab {
                padding: 0.5rem 1rem;
                border: 1px solid var(--graphite-light);
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
            }
            .vault-tab.active {
                background: var(--bone);
                color: var(--obsidian);
                border-color: var(--bone);
            }
        `;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = this.baseStyles;
        document.head.appendChild(styleSheet);

        this.renderStructure(container);
        this.setupListeners();
        this.calculateSellerNote(); // Initial run
    }

    renderStructure(container) {
        container.innerHTML = `
            <div class="calculator-vault">
                <div class="vault-header">
                    <h2>Structure Analysis Tool</h2>
                    <p style="font-size: 0.8rem; color: #666;">Private Equity Grade Modeling for Acquisitions</p>
                </div>

                <div class="vault-tabs">
                    <div class="vault-tab active" data-tab="seller-note">SELLER NOTE</div>
                    <div class="vault-tab" data-tab="earn-out">EARN-OUT</div>
                    <div class="vault-tab" data-tab="rollover">EQUITY ROLLOVER</div>
                </div>

                <div id="calc-content">
                    <!-- Dynamic Content -->
                </div>
            </div>
        `;
        this.showTab('seller-note');
    }

    showTab(tabName) {
        const content = document.getElementById('calc-content');
        if (tabName === 'seller-note') {
            content.innerHTML = `
                <div class="calc-grid">
                    <div class="inputs">
                        <div class="input-group">
                            <label>PRINCIPAL AMOUNT ($)</label>
                            <input type="number" id="sn-principal" value="500000" step="1000">
                        </div>
                        <div class="input-group">
                            <label>INTEREST RATE (%)</label>
                            <input type="number" id="sn-rate" value="8" step="0.1">
                        </div>
                        <div class="input-group">
                            <label>AMORTIZATION TERM (YEARS)</label>
                            <input type="number" id="sn-term" value="10">
                        </div>
                        <div class="input-group">
                            <label>BALLOON PAYMENT (YEAR)</label>
                            <input type="number" id="sn-balloon" value="5">
                        </div>
                    </div>
                    <div class="results-panel">
                        <div class="result-item">
                            <span class="result-label">MONTHLY DEBT SERVICE</span>
                            <span class="result-value highlight-value" id="res-monthly">$-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">TOTAL INTEREST PAID</span>
                            <span class="result-value" id="res-interest">$-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">BALLOON DUE YEAR <span id="res-balloon-year">5</span></span>
                            <span class="result-value" id="res-balloon-amount">$-</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (tabName === 'earn-out') {
            content.innerHTML = `
                <div class="calc-grid">
                    <div class="inputs">
                        <div class="input-group">
                            <label>BENCHMARK METRIC (e.g. EBITDA)</label>
                            <input type="number" id="eo-metric" value="1000000">
                        </div>
                        <div class="input-group">
                            <label>METRIC THRESHOLD</label>
                            <input type="number" id="eo-threshold" value="800000">
                        </div>
                        <div class="input-group">
                            <label>PAYOUT % OF SURPLUS</label>
                            <input type="number" id="eo-percentage" value="25">
                        </div>
                    </div>
                    <div class="results-panel">
                        <div class="result-item">
                            <span class="result-label">ESTIMATED PAYOUT</span>
                            <span class="result-value highlight-value" id="res-eo-payout">$-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">SURPLUS ABOVE CAP</span>
                            <span class="result-value" id="res-eo-surplus">$-</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (tabName === 'rollover') {
            content.innerHTML = `
                <div class="calc-grid">
                    <div class="inputs">
                        <div class="input-group">
                            <label>TOTAL ENTERPRISE VALUE ($)</label>
                            <input type="number" id="er-val" value="5000000">
                        </div>
                        <div class="input-group">
                            <label>ROLLOVER PERCENTAGE (%)</label>
                            <input type="number" id="er-percent" value="20">
                        </div>
                    </div>
                    <div class="results-panel">
                        <div class="result-item">
                            <span class="result-label">CASH TO SELLER</span>
                            <span class="result-value highlight-value" id="res-er-cash">$-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">EQUITY VALUE RETAINED</span>
                            <span class="result-value" id="res-er-equity">$-</span>
                        </div>
                    </div>
                </div>
            `;
        }
        this.setupListeners();
        this.runCurrentCalc(tabName);
    }

    setupListeners() {
        const inputs = document.querySelectorAll('.inputs input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const activeTab = document.querySelector('.vault-tab.active').dataset.tab;
                this.runCurrentCalc(activeTab);
            });
        });

        const tabs = document.querySelectorAll('.vault-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showTab(tab.dataset.tab);
            };
        });
    }

    runCurrentCalc(tab) {
        if (tab === 'seller-note') this.calculateSellerNote();
        if (tab === 'earn-out') this.calculateEarnOut();
        if (tab === 'rollover') this.calculateRollover();
    }

    format(num) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    }

    calculateSellerNote() {
        const p = parseFloat(document.getElementById('sn-principal').value);
        const r = parseFloat(document.getElementById('sn-rate').value) / 100 / 12;
        const n = parseFloat(document.getElementById('sn-term').value) * 12;
        const bY = parseFloat(document.getElementById('sn-balloon').value);
        
        const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        
        let balance = p;
        let totalInterest = 0;
        const balloonMonths = bY * 12;

        for(let i = 1; i <= Math.min(n, balloonMonths); i++) {
            let interest = balance * r;
            let principal = monthly - interest;
            totalInterest += interest;
            balance -= principal;
        }

        document.getElementById('res-monthly').innerText = this.format(monthly);
        document.getElementById('res-interest').innerText = this.format(totalInterest);
        document.getElementById('res-balloon-year').innerText = bY;
        document.getElementById('res-balloon-amount').innerText = this.format(Math.max(0, balance));
    }

    calculateEarnOut() {
        const metric = parseFloat(document.getElementById('eo-metric').value);
        const threshold = parseFloat(document.getElementById('eo-threshold').value);
        const pct = parseFloat(document.getElementById('eo-percentage').value) / 100;

        const surplus = Math.max(0, metric - threshold);
        const payout = surplus * pct;

        document.getElementById('res-eo-payout').innerText = this.format(payout);
        document.getElementById('res-eo-surplus').innerText = this.format(surplus);
    }

    calculateRollover() {
        const val = parseFloat(document.getElementById('er-val').value);
        const pct = parseFloat(document.getElementById('er-percent').value) / 100;

        const equity = val * pct;
        const cash = val - equity;

        document.getElementById('res-er-cash').innerText = this.format(cash);
        document.getElementById('res-er-equity').innerText = this.format(equity);
    }
}

// Global accessor for Equity Terminal integration
window.FinanceVault = new CreativeFinanceCalculator();

// auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('finance-vault-mount')) {
        window.FinanceVault.init('finance-vault-mount');
    }
});