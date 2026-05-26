/**
 * LTV & Unit Economics Deep-Dive Extension
 * Part of the Emerald Circuit Liquidity Protocol Suite
 */

(function() {
    const ltvStyles = `
        .ltv-deep-dive-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 8, 7, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .ltv-deep-dive-overlay.active {
            display: flex;
            opacity: 1;
        }

        .ltv-modal {
            background: var(--bg-card);
            border: 1px solid var(--emerald-dim);
            border-radius: 24px;
            width: 90%;
            max-width: 600px;
            padding: 40px;
            position: relative;
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.1);
        }

        .ltv-modal::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 60px;
            height: 60px;
            border-bottom: 2px solid var(--emerald);
            border-right: 2px solid var(--emerald);
            border-radius: 0 0 24px 0;
            opacity: 0.5;
        }

        .ltv-header {
            margin-bottom: 30px;
            border-left: 3px solid var(--emerald);
            padding-left: 20px;
        }

        .ltv-header h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .ltv-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .close-ltv {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.2rem;
        }

        .ltv-result-card {
            background: rgba(0, 255, 136, 0.05);
            border: 1px solid var(--emerald-dim);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
        }

        .ltv-result-val {
            display: block;
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--emerald);
            font-family: 'JetBrains Mono', monospace;
        }

        .ltv-subtext {
            font-size: 0.7rem;
            color: var(--text-dim);
            font-family: 'JetBrains Mono', monospace;
            margin-top: 5px;
            text-transform: uppercase;
        }

        .deep-dive-btn-trigger {
            background: transparent;
            border: 1px dashed var(--emerald-dim);
            color: var(--emerald);
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            margin-top: 5px;
            transition: all 0.2s ease;
            width: fit-content;
        }

        .deep-dive-btn-trigger:hover {
            background: var(--emerald-dim);
            border-style: solid;
        }
    `;

    const ltvHtml = `
        <div class="ltv-deep-dive-overlay" id="ltvOverlay">
            <div class="ltv-modal">
                <button class="close-ltv" id="closeLtv">×</button>
                <div class="ltv-header">
                    <h2>Unit Economics</h2>
                    <p style="color: var(--text-dim); font-size: 0.8rem; font-family: 'JetBrains Mono', monospace;">LTV & Churn Impact Analysis</p>
                </div>

                <div class="ltv-grid">
                    <div class="input-group">
                        <label>Avg Order Value</label>
                        <div class="input-wrapper">
                            <span class="unit">$</span>
                            <input type="number" id="ltv-aov" value="60" placeholder="0">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Frequency (Orders/Mo)</label>
                        <div class="input-wrapper">
                            <span class="unit">#</span>
                            <input type="number" id="ltv-freq" value="2" placeholder="0">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Monthly Churn</label>
                        <div class="input-wrapper">
                            <span class="unit">%</span>
                            <input type="number" id="ltv-churn" value="5" placeholder="0">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Variable Costs / Order</label>
                        <div class="input-wrapper">
                            <span class="unit">$</span>
                            <input type="number" id="ltv-costs" value="15" placeholder="0">
                        </div>
                    </div>
                </div>

                <div class="ltv-result-card">
                    <span class="ltv-subtext">Estimated Lifetime Value (Net)</span>
                    <span id="ltv-calculated-val" class="ltv-result-val">$0</span>
                    <span class="ltv-subtext" id="lifespan-val">Lifespan: 0 Months</span>
                </div>

                <button id="applyLtv" class="btn-primary" style="width: 100%; margin-top: 20px; font-size: 0.9rem; padding: 15px;">Sync to Payback Analyzer</button>
            </div>
        </div>
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = ltvStyles;
    document.head.appendChild(styleSheet);

    // Inject Modal
    const container = document.createElement("div");
    container.innerHTML = ltvHtml;
    document.body.appendChild(container);

    // Add "Deep Dive" trigger to original UI
    const arpuInputGroup = document.querySelector('#arpu').closest('.input-group');
    const trigger = document.createElement('button');
    trigger.className = 'deep-dive-btn-trigger';
    trigger.innerText = 'PRO: CALCULATE FROM UNIT ECON';
    arpuInputGroup.appendChild(trigger);

    // State Elements
    const overlay = document.getElementById('ltvOverlay');
    const closeBtn = document.getElementById('closeLtv');
    const applyBtn = document.getElementById('applyLtv');
    
    const inputAov = document.getElementById('ltv-aov');
    const inputFreq = document.getElementById('ltv-freq');
    const inputChurn = document.getElementById('ltv-churn');
    const inputCosts = document.getElementById('ltv-costs');
    
    const displayLtv = document.getElementById('ltv-calculated-val');
    const displayLifespan = document.getElementById('lifespan-val');

    function calculateLtv() {
        const aov = parseFloat(inputAov.value) || 0;
        const freq = parseFloat(inputFreq.value) || 0;
        const churn = parseFloat(inputChurn.value) / 100 || 0;
        const costs = parseFloat(inputCosts.value) || 0;

        if (churn === 0) {
            displayLtv.textContent = "∞";
            displayLifespan.textContent = "Lifespan: Infinite";
            return;
        }

        const arpu = aov * freq;
        const marginPerOrder = aov - costs;
        const monthlyContribution = marginPerOrder * freq;
        const lifespanMonths = 1 / churn;
        const ltv = monthlyContribution * lifespanMonths;

        displayLtv.textContent = `$${Math.round(ltv).toLocaleString()}`;
        displayLifespan.textContent = `Lifespan: ${lifespanMonths.toFixed(1)} Months`;
    }

    function syncBack() {
        const aov = parseFloat(inputAov.value) || 0;
        const freq = parseFloat(inputFreq.value) || 0;
        const costs = parseFloat(inputCosts.value) || 0;
        
        const arpuField = document.getElementById('arpu');
        const marginField = document.getElementById('margin');

        const arpu = aov * freq;
        const marginPercent = ((aov - costs) / aov) * 100;

        arpuField.value = Math.round(arpu);
        marginField.value = Math.round(marginPercent);

        // Trigger original calculation
        const event = new Event('input', { bubbles: true });
        arpuField.dispatchEvent(event);
        
        overlay.classList.remove('active');
    }

    // Event Listeners
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        calculateLtv();
    });

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    [inputAov, inputFreq, inputChurn, inputCosts].forEach(input => {
        input.addEventListener('input', calculateLtv);
    });

    applyBtn.addEventListener('click', syncBack);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

})();