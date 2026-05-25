class AcquisitionCapitalVault {
    constructor() {
        this.config = {
            sbaRate: 0.1125,
            sbaTerm: 10,
            privateRate: 0.15,
            privateTerm: 5,
            colors: {
                acid: '#C1FF00',
                blood: '#FF3D00',
                copper: '#8E593E',
                obsidian: '#050505',
                graphite: '#1A1A1A'
            }
        };

        this.lenders = [
            { name: "OXIDIZED CAPITAL", type: "Private Debt", maxLTV: "70%", focus: "SaaS/Recur", speed: "Fast" },
            { name: "LIVE OAK BANK", type: "SBA Preferred", maxLTV: "90%", focus: "General", speed: "Slow" },
            { name: "HUNTINGTON", type: "SBA Preferred", maxLTV: "90%", focus: "Industrial", speed: "Medium" },
            { name: "BYLINE BANK", type: "SBA Preferred", maxLTV: "85%", focus: "Service", speed: "Fast" }
        ];
    }

    init(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        this.renderLayout(container);
        this.attachListeners();
        this.updateCalculations();
    }

    renderLayout(container) {
        const style = `
            <style>
                #vault-ui {
                    background: var(--obsidian);
                    border: 2px solid var(--graphite);
                    color: var(--bone);
                    padding: 2rem;
                    font-family: 'Inter', sans-serif;
                }
                .vault-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 2px solid var(--bone);
                    padding-bottom: 1rem;
                    margin-bottom: 2rem;
                }
                .vault-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 3rem;
                }
                .control-group {
                    margin-bottom: 2rem;
                }
                .control-group label {
                    display: flex;
                    justify-content: space-between;
                    font-family: 'JetBrains Mono';
                    font-size: 0.75rem;
                    margin-bottom: 0.5rem;
                    color: var(--oxidized-copper);
                }
                input[type=range] {
                    width: 100%;
                    -webkit-appearance: none;
                    background: var(--graphite);
                    height: 4px;
                    outline: none;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: var(--acid-green);
                    cursor: pointer;
                    border-radius: 0;
                }
                .dashboard-panel {
                    background: #0A0A0A;
                    border: 1px solid var(--graphite);
                    padding: 1.5rem;
                }
                .data-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #1a1a1a;
                }
                .data-row .lbl { font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #666; }
                .data-row .val { font-family: 'JetBrains Mono'; font-weight: 700; color: var(--bone); }
                .data-row .val.highlight { color: var(--acid-green); }
                .lender-list {
                    margin-top: 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .lender-card {
                    border: 1px solid var(--graphite);
                    padding: 1rem;
                    background: var(--panel);
                }
                .lender-card h4 { font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--acid-green); }
                .lender-card p { font-size: 0.6rem; color: #888; text-transform: uppercase; }
                .memo-btn {
                    margin-top: 2rem;
                    background: var(--bone);
                    color: var(--obsidian);
                    padding: 1rem;
                    text-align: center;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    cursor: pointer;
                    display: block;
                    text-decoration: none;
                }
                .memo-btn:hover { background: var(--acid-green); }
                .indicator-bar {
                    height: 2px;
                    background: var(--graphite);
                    margin-top: 4px;
                    position: relative;
                }
                .indicator-fill {
                    height: 100%;
                    background: var(--acid-green);
                    width: 0%;
                    transition: width 0.3s;
                }
            </style>
        `;

        container.innerHTML = `
            ${style}
            <div id="vault-ui">
                <div class="vault-header">
                    <div>
                        <span class="mono" style="color: var(--oxidized-copper); font-size: 0.7rem;">/ / LIQUIDITY & LEVERAGE ENGINE</span>
                        <h2 class="mono" style="font-size: 1.5rem; letter-spacing: -1px;">ACQUISITION CAPITAL VAULT</h2>
                    </div>
                    <div class="mono" style="font-size: 0.8rem; color: var(--acid-green);">DEBT_SERVICE_READY</div>
                </div>

                <div class="vault-grid">
                    <div class="calculator-inputs">
                        <div class="control-group">
                            <label>PURCHASE PRICE <span id="priceVal">$1,000,000</span></label>
                            <input type="range" id="priceRange" min="100000" max="10000000" step="50000" value="1000000">
                        </div>
                        <div class="control-group">
                            <label>SELLER DISCRETIONARY EARNINGS (SDE) <span id="sdeVal">$300,000</span></label>
                            <input type="range" id="sdeRange" min="50000" max="2000000" step="10000" value="300000">
                        </div>
                        <div class="control-group">
                            <label>EQUITY INJECTION (%) <span id="equityVal">10%</span></label>
                            <input type="range" id="equityRange" min="0" max="50" step="5" value="10">
                        </div>
                        
                        <div class="lender-section">
                            <h3 class="mono" style="font-size: 0.7rem; margin-bottom: 1rem; color: #555;">VERIFIED LENDING PARTNERS</h3>
                            <div class="lender-list">
                                ${this.lenders.map(l => `
                                    <div class="lender-card">
                                        <h4>${l.name}</h4>
                                        <p>${l.type} | ${l.focus}</p>
                                        <p style="margin-top: 0.5rem; color: var(--bone);">LTV: ${l.maxLTV}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="results-panel">
                        <div class="dashboard-panel">
                            <h3 class="mono" style="font-size: 0.8rem; margin-bottom: 1.5rem; border-left: 3px solid var(--acid-green); padding-left: 10px;">LOAN MODEL: SBA 7(A)</h3>
                            
                            <div class="data-row">
                                <span class="lbl">LOAN AMOUNT</span>
                                <span class="val" id="resLoan">$0</span>
                            </div>
                            <div class="data-row">
                                <span class="lbl">ANNUAL DEBT SERVICE</span>
                                <span class="val" id="resDebt">$0</span>
                            </div>
                            <div class="data-row">
                                <span class="lbl">POST-DEBT CASH FLOW</span>
                                <span class="val highlight" id="resCashFlow">$0</span>
                            </div>
                            <div class="data-row">
                                <span class="lbl">DSCR (COVERAGE RATIO)</span>
                                <span class="val" id="resDSCR">0.00</span>
                            </div>
                            <div class="indicator-bar"><div class="indicator-fill" id="dscrFill"></div></div>

                            <div class="data-row" style="margin-top: 1rem;">
                                <span class="lbl">CASH ON CASH ROI</span>
                                <span class="val highlight" id="resROI">0%</span>
                            </div>
                            
                            <a href="#" class="memo-btn" onclick="alert('Generating Deal Memo PDF Package...')">Generate Lender Deal Memo</a>
                        </div>
                        
                        <div style="margin-top: 1rem; font-size: 0.6rem; color: #444; font-family: 'JetBrains Mono'; line-height: 1.5;">
                            * ESTIMATES BASED ON CURRENT SOFR + SPREAD (~11.25%). ACTUAL RATES SUBJECT TO UNDERWRITING AND COLLATERAL.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachListeners() {
        const inputs = ['priceRange', 'sdeRange', 'equityRange'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updateCalculations());
        });
    }

    formatCurrency(num) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    }

    calculatePMT(rate, nper, pv) {
        const r = rate / 12;
        const n = nper * 12;
        return (pv * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    updateCalculations() {
        const price = parseInt(document.getElementById('priceRange').value);
        const sde = parseInt(document.getElementById('sdeRange').value);
        const equityPct = parseInt(document.getElementById('equityRange').value) / 100;

        document.getElementById('priceVal').innerText = this.formatCurrency(price);
        document.getElementById('sdeVal').innerText = this.formatCurrency(sde);
        document.getElementById('equityVal').innerText = (equityPct * 100) + '%';

        const loanPrincipal = price * (1 - equityPct);
        const monthlyPmt = this.calculatePMT(this.config.sbaRate, this.config.sbaTerm, loanPrincipal);
        const annualDebtService = monthlyPmt * 12;
        const postDebtCashFlow = sde - annualDebtService;
        const dscr = sde / annualDebtService;
        const equityInjected = price * equityPct;
        const roi = (postDebtCashFlow / equityInjected) * 100;

        document.getElementById('resLoan').innerText = this.formatCurrency(loanPrincipal);
        document.getElementById('resDebt').innerText = this.formatCurrency(annualDebtService);
        document.getElementById('resCashFlow').innerText = this.formatCurrency(postDebtCashFlow);
        document.getElementById('resDSCR').innerText = dscr.toFixed(2);
        document.getElementById('resROI').innerText = roi.toFixed(1) + '%';

        // Update indicator
        const dscrPercent = Math.min(Math.max((dscr - 1) / 1.5 * 100, 0), 100);
        const fill = document.getElementById('dscrFill');
        fill.style.width = dscrPercent + '%';
        fill.style.backgroundColor = dscr < 1.25 ? '#FF3D00' : '#C1FF00';

        if (postDebtCashFlow < 0) {
            document.getElementById('resCashFlow').style.color = '#FF3D00';
        } else {
            document.getElementById('resCashFlow').style.color = '#C1FF00';
        }
    }
}

// Auto-initialize if the container exists
document.addEventListener('DOMContentLoaded', () => {
    const vault = new AcquisitionCapitalVault();
    // Assuming the main page adds a container with this ID
    if(document.getElementById('vault-container')) {
        vault.init('#vault-container');
    }
});

window.AcquisitionCapitalVault = AcquisitionCapitalVault;
```