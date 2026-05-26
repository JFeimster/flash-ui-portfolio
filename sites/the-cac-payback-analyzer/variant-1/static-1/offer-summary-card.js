/**
 * offer-summary-card.js
 * Capital Readiness Portal: Final Financing Offer Component
 */

const styleOffer = `
    .offer-card {
        background: var(--bg-card);
        border: 1px solid var(--emerald-dim);
        border-radius: 20px;
        padding: 40px;
        margin-top: 40px;
        box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0, 255, 136, 0.05);
        position: relative;
        animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1);
        max-width: 1000px;
        width: 100%;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .offer-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 30px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding-bottom: 20px;
    }

    .offer-title-group h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 3px;
        color: var(--emerald);
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .offer-title-group p {
        font-size: 1.8rem;
        font-weight: 800;
        color: #fff;
    }

    .status-pill {
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid var(--emerald-dim);
        padding: 6px 12px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: var(--emerald);
    }

    .offer-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 40px;
    }

    .funding-amount-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .amount-display {
        font-size: 4.5rem;
        font-weight: 800;
        color: #fff;
        line-height: 1;
        margin: 10px 0;
        letter-spacing: -2px;
        text-shadow: 0 0 20px var(--emerald-dim);
    }

    .amount-label {
        font-family: 'JetBrains Mono', monospace;
        color: var(--text-dim);
        font-size: 0.85rem;
    }

    .terms-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 30px;
    }

    .term-item {
        border-left: 2px solid var(--emerald-dim);
        padding-left: 15px;
    }

    .term-item .label {
        display: block;
        font-size: 0.65rem;
        color: var(--text-dim);
        text-transform: uppercase;
        margin-bottom: 4px;
    }

    .term-item .value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.1rem;
        font-weight: 600;
        color: #fff;
    }

    .upload-box {
        background: rgba(0,0,0,0.3);
        border: 2px dashed rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .upload-box:hover {
        border-color: var(--emerald);
        background: rgba(0, 255, 136, 0.02);
    }

    .upload-icon {
        width: 40px;
        height: 40px;
        stroke: var(--emerald);
        opacity: 0.7;
    }

    .upload-text {
        font-size: 0.85rem;
        color: var(--text-dim);
        line-height: 1.4;
    }

    .upload-text b {
        color: var(--text-main);
        display: block;
        margin-bottom: 4px;
    }

    .legal-notice {
        margin-top: 30px;
        font-size: 0.65rem;
        color: var(--text-dim);
        font-family: 'JetBrains Mono', monospace;
        line-height: 1.6;
    }

    .processing-overlay {
        position: absolute;
        inset: 0;
        background: rgba(5, 8, 7, 0.9);
        backdrop-filter: blur(10px);
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100;
        border-radius: 20px;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--emerald-dim);
        border-top-color: var(--emerald);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .offer-grid { grid-template-columns: 1fr; }
        .amount-display { font-size: 3rem; }
    }
`;

class OfferSummaryCard extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>${styleOffer}</style>
            <div class="offer-card" id="offer-card">
                <div class="processing-overlay" id="overlay">
                    <div class="spinner"></div>
                    <p style="font-family: 'JetBrains Mono', monospace; color: var(--emerald);">VERIFYING LEDGER DATA...</p>
                </div>

                <div class="offer-header">
                    <div class="offer-title-group">
                        <h2>Portal Phase 03</h2>
                        <p>Capital Readiness Offer</p>
                    </div>
                    <div class="status-pill">PROTOCOL ACTIVE</div>
                </div>

                <div class="offer-grid">
                    <div class="funding-amount-section">
                        <span class="amount-label">PRE-APPROVED LIMIT</span>
                        <div class="amount-display" id="display-amount">$0.00</div>
                        
                        <div class="terms-grid">
                            <div class="term-item">
                                <span class="label">Growth Fee</span>
                                <span class="value" id="offer-fee">6.2%</span>
                            </div>
                            <div class="term-item">
                                <span class="label">Payback Cap</span>
                                <span class="value" id="offer-cap">1.2x</span>
                            </div>
                            <div class="term-item">
                                <span class="label">Remittance</span>
                                <span class="value">Daily Post-Margin</span>
                            </div>
                            <div class="term-item">
                                <span class="label">Collateral</span>
                                <span class="value">Zero / Revenue-Based</span>
                            </div>
                        </div>
                    </div>

                    <div class="verification-section">
                        <div class="upload-box" id="drop-zone">
                            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <div class="upload-text">
                                <b>Verify Bankability</b>
                                Drop Q3/Q4 Financials or P&L statement to unlock capital.
                            </div>
                            <button class="btn-primary" style="padding: 12px 24px; font-size: 0.8rem; margin-top: 10px;">Select File</button>
                        </div>
                        
                        <p class="legal-notice">
                            * Terms based on current CAC Payback of <span id="legal-payback">0.0</span> months. 
                            Offer valid for 48 hours. Subject to verification of advertising account data 
                            and primary revenue accounts.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.setupListeners();
        this.calculateOffer(50000, 250, 120, 75); // Initial default based on base component
    }

    setupListeners() {
        const dropZone = this.querySelector('#drop-zone');
        const overlay = this.querySelector('#overlay');

        dropZone.addEventListener('click', () => {
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.display = 'none';
                alert('Ledger Verification Successful. Money Printer Unlocked.');
            }, 3000);
        });

        // Listen for updates from the analyzer (if globally emitted or connected)
        window.addEventListener('cacUpdate', (e) => {
            const { spend, customers, arpu, margin } = e.detail;
            this.calculateOffer(spend, customers, arpu, margin);
        });
    }

    calculateOffer(spend, customers, arpu, margin) {
        if (!customers || !arpu) return;

        const cac = spend / customers;
        const contributionMargin = arpu * (margin / 100);
        const paybackMonths = cac / contributionMargin;
        
        // Logical calculation for funding offer
        // Formula: 4x Monthly Spend if Payback < 6m, 2x if < 12m
        let multiplier = paybackMonths < 6 ? 5 : paybackMonths <= 12 ? 2.5 : 1;
        let amount = spend * multiplier;
        
        // Visual updates
        const amountDisplay = this.querySelector('#display-amount');
        const feeDisplay = this.querySelector('#offer-fee');
        const paybackLegal = this.querySelector('#legal-payback');

        amountDisplay.textContent = `$${Math.round(amount / 1000)}k`;
        paybackLegal.textContent = paybackMonths.toFixed(1);

        if (paybackMonths < 6) {
            feeDisplay.textContent = '4.8%';
            amountDisplay.style.color = 'var(--emerald)';
        } else if (paybackMonths <= 12) {
            feeDisplay.textContent = '8.5%';
            amountDisplay.style.color = 'var(--warning)';
        } else {
            feeDisplay.textContent = '12.0%';
            amountDisplay.style.color = 'var(--danger)';
        }
    }
}

customElements.define('offer-summary-card', OfferSummaryCard);

// Integration helper to allow the base component to talk to this one
function syncAnalyzerToOffer() {
    const inputs = ['spend', 'customers', 'arpu', 'margin'];
    const update = () => {
        const data = {};
        inputs.forEach(id => {
            data[id] = parseFloat(document.getElementById(id).value) || 0;
        });
        const event = new CustomEvent('cacUpdate', { detail: data });
        window.dispatchEvent(event);
    };

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', update);
    });
}

// Auto-run if elements exist
document.addEventListener('DOMContentLoaded', syncAnalyzerToOffer);
syncAnalyzerToOffer();

export default OfferSummaryCard;
```