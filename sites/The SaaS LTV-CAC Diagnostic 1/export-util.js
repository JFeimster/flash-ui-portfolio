(function() {
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #efficiency-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(5, 5, 5, 0.98);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999; backdrop-filter: blur(8px);
                opacity: 0; transition: opacity 0.3s ease;
                padding: 20px;
            }
            .efficiency-modal {
                background: #0d0d0d; border: 1px solid #222;
                width: 100%; max-width: 440px; padding: 40px;
                box-shadow: 0 0 50px rgba(0,0,0,0.8);
                transform: translateY(20px); transition: transform 0.3s ease;
                position: relative;
            }
            .eff-header { margin-bottom: 24px; border-bottom: 1px solid #222; padding-bottom: 20px; }
            .eff-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 4px; }
            .eff-value { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
            .eff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #222; border: 1px solid #222; margin: 20px 0; }
            .eff-cell { background: #0d0d0d; padding: 15px; }
            .eff-rec { background: #111; padding: 20px; margin-top: 20px; border-left: 2px solid var(--accent); }
            .eff-rec-text { font-size: 13px; line-height: 1.6; color: #aaa; }
            .eff-close {
                width: 100%; background: #fff; color: #000; border: none;
                padding: 16px; margin-top: 25px; font-family: 'JetBrains Mono', monospace;
                font-weight: 700; cursor: pointer; font-size: 12px;
                transition: opacity 0.2s;
            }
            .eff-close:hover { opacity: 0.9; }
        `;
        document.head.appendChild(style);
    };

    const calculateFundingCosts = () => {
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const churn = parseFloat(document.getElementById('churn').value) || 0;
        const cac = parseFloat(document.getElementById('cac').value) || 1;
        const ltv = (churn > 0) ? (arpu / (churn / 100)) : 0;
        const ratio = ltv / cac;

        // Baseline: Funding 100 new customer acquisitions
        const capNeeded = cac * 100;
        
        // RBF Model: 8-12% flat fee of the principal
        const rbfCost = capNeeded * 0.10;
        
        // Equity Model: Estimated long-term cost of dilution 
        // Based on selling ~5% of equity for this capital tranche at a 10x exit multiple
        const equityCost = capNeeded * 5.0; 

        return { ratio, capNeeded, rbfCost, equityCost };
    };

    const triggerPlanner = () => {
        const data = calculateFundingCosts();
        let strategy, strategyColor, strategyTag;

        if (data.ratio >= 3) {
            strategyTag = "ELITE UNIT ECONOMICS";
            strategyColor = "#00ff88";
            strategy = "Your acquisition engine is highly efficient. Diluting equity for growth capital here is objectively expensive. Revenue-based financing (RBF) or venture debt provides the lowest cost of capital while preserving founder ownership.";
        } else if (data.ratio >= 1.5) {
            strategyTag = "STABLE SCALING";
            strategyColor = "#ffaa00";
            strategy = "Unit economics support a hybrid funding approach. Use equity to fund high-risk R&D and product development, but switch to non-dilutive capital to fund customer acquisition once CAC payback periods are stabilized.";
        } else {
            strategyTag = "INDIRECT EFFICIENCY";
            strategyColor = "#ff4444";
            strategy = "Current LTV:CAC suggests a capital-inefficient growth model. Seeking any external funding (Equity or RBF) before fixing churn or ARPU will likely result in a 'Leaky Bucket' outcome. Focus on retention before capitalization.";
        }

        const modal = document.createElement('div');
        modal.id = 'efficiency-modal-overlay';
        modal.innerHTML = `
            <div class="efficiency-modal">
                <div class="eff-header">
                    <div class="eff-label" style="color: ${strategyColor}">Engine Diagnostic: ${strategyTag}</div>
                    <div class="eff-value">Efficiency Planner</div>
                </div>
                
                <div class="eff-label">Growth Capital Simulation (100 Users)</div>
                <div class="eff-value" style="margin-bottom: 20px;">$${data.capNeeded.toLocaleString()}</div>

                <div class="eff-grid">
                    <div class="eff-cell">
                        <div class="eff-label">Non-Dilutive Fee</div>
                        <div style="color: #00ff88; font-weight: 600; font-size: 18px;">$${data.rbfCost.toLocaleString()}</div>
                        <div class="eff-label" style="font-size: 8px; margin-top: 4px;">Flat Cost of Debt</div>
                    </div>
                    <div class="eff-cell">
                        <div class="eff-label">Equity Dilution Cost</div>
                        <div style="color: #ff4444; font-weight: 600; font-size: 18px;">$${data.equityCost.toLocaleString()}</div>
                        <div class="eff-label" style="font-size: 8px; margin-top: 4px;">Est. Value Foregone</div>
                    </div>
                </div>

                <div class="eff-rec" style="border-color: ${strategyColor}">
                    <div class="eff-label" style="color: ${strategyColor}">Strategic Recommendation</div>
                    <p class="eff-rec-text">${strategy}</p>
                </div>

                <button class="eff-close" id="close-eff">RETURN TO CALCULATOR</button>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.efficiency-modal').style.transform = 'translateY(0)';
        }, 10);

        document.getElementById('close-eff').onclick = () => {
            modal.style.opacity = '0';
            modal.querySelector('.efficiency-modal').style.transform = 'translateY(20px)';
            setTimeout(() => modal.remove(), 300);
        };
    };

    const init = () => {
        injectStyles();
        const btn = document.getElementById('cta-button');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                triggerPlanner();
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();