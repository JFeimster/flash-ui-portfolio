/**
 * Eligibility Logic for Funding Options
 * Part of Swiss Ledger CAC Payback Analyzer
 * Integrated Financing & Capital Efficiency Logic
 */

(function() {
    // Selection of UI elements for the financing section
    // Assumes these elements are appended to the main container
    const financingUI = {
        setup() {
            const container = document.querySelector('.main-grid');
            if (!container) return;

            const existingSection = document.getElementById('financing-explorer');
            if (existingSection) return;

            const section = document.createElement('section');
            section.id = 'financing-explorer';
            section.className = 'analysis-section';
            section.style.borderTop = '2px solid var(--border)';
            section.style.gridColumn = '1 / -1';
            section.style.background = 'white';

            section.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px;">
                    <div>
                        <div class="badge">FINANCING VEHICLES</div>
                        <h2 style="font-size: 24px; font-weight: 800; margin: 10px 0; text-transform: uppercase;">Capital Strategy</h2>
                        <div id="financing-recommendation" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; margin-top: 15px;">
                            Analyzing yield against cost of capital...
                        </div>
                    </div>
                    <div>
                        <table class="results-table" style="margin-top: 0;">
                            <tr>
                                <td class="label">Projected ROAS (12mo)</td>
                                <td class="value" id="roasTarget">0.0x</td>
                            </tr>
                            <tr>
                                <td class="label">RBF Est. Cost of Cap.</td>
                                <td class="value" id="rbfCost">--</td>
                            </tr>
                            <tr>
                                <td class="label">Venture Debt Est. APR</td>
                                <td class="value" id="debtCost">--</td>
                            </tr>
                            <tr>
                                <td class="label">Capital Arbitrage Spread</td>
                                <td class="value" id="spreadValue" style="color: var(--success);">--</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="comparison-grid" style="display: grid; grid-template-columns: 1fr 1fr; border-top: 2px solid var(--border);">
                    <div style="padding: 30px; border-right: 2px solid var(--border);">
                        <label style="color: var(--accent);">Option A: Revenue-Based</label>
                        <p style="font-size: 12px; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">Non-dilutive. Flexible repayment as % of gross revenue. Ideal for high-margin SaaS with stable CAC.</p>
                    </div>
                    <div style="padding: 30px;">
                        <label style="color: var(--accent);">Option B: Venture Debt</label>
                        <p style="font-size: 12px; margin-top: 8px; font-family: 'JetBrains Mono', monospace;">Term loan with warrants. Lower interest but requires equity backing. Best for rapid scaling pre-Series B.</p>
                    </div>
                </div>
            `;
            container.appendChild(section);
        },

        update(metrics) {
            const roasTarget = document.getElementById('roasTarget');
            const rbfCost = document.getElementById('rbfCost');
            const debtCost = document.getElementById('debtCost');
            const spreadValue = document.getElementById('spreadValue');
            const recommendation = document.getElementById('financing-recommendation');

            if (!roasTarget) return;

            // Math for ROI and Capital Comparison
            const annualRevenuePerCustomer = metrics.arpu * 12;
            const annualGrossProfitPerCustomer = annualRevenuePerCustomer * metrics.margin;
            const roas = annualGrossProfitPerCustomer / metrics.cac;
            
            // Market standard estimates
            const rbfEstFee = 0.08; // 8% flat fee
            const ventureDebtAPR = 0.12; // 12% APR
            
            roasTarget.innerText = `${roas.toFixed(2)}x`;
            rbfCost.innerText = `${(rbfEstFee * 100).toFixed(1)}%`;
            debtCost.innerText = `${(ventureDebtAPR * 100).toFixed(1)}%`;

            const spread = (roas - 1) - ventureDebtAPR;
            spreadValue.innerText = `${(spread * 100).toFixed(1)}%`;
            spreadValue.style.color = spread > 0.5 ? 'var(--success)' : 'var(--danger)';

            // Eligibility Logic
            if (metrics.payback < 6 && roas > 3) {
                recommendation.innerHTML = `<strong>VERDICT: SCALE AGGRESSIVELY.</strong> Your unit economics show high capital efficiency. ROAS outpaces cost of capital by ${ (spread * 100).toFixed(0) }%. Revenue-Based Financing is recommended for immediate deployment.`;
            } else if (metrics.payback < 12) {
                recommendation.innerHTML = `<strong>VERDICT: MODERATE GROWTH.</strong> Efficiency is within bounds. Venture Debt may be preferable to preserve cash flow, though RBF is available at higher premiums.`;
            } else {
                recommendation.innerHTML = `<strong>VERDICT: OPTIMIZE UNIT ECON.</strong> Cost of capital exceeds or nears growth yield. Funding not recommended until CAC Payback is under 12 months.`;
            }
        }
    };

    function runAnalysis() {
        const spend = parseFloat(document.getElementById('spend').value) || 0;
        const customers = parseFloat(document.getElementById('customers').value) || 0;
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const margin = (parseFloat(document.getElementById('margin').value) / 100) || 0;

        if (customers === 0 || arpu === 0) return;

        const cac = spend / customers;
        const monthlyGrossProfit = arpu * margin;
        const payback = cac / monthlyGrossProfit;

        financingUI.setup();
        financingUI.update({
            spend,
            customers,
            arpu,
            margin,
            cac,
            payback
        });
    }

    // Attach listeners to base component inputs
    const inputIds = ['spend', 'customers', 'arpu', 'margin'];
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runAnalysis);
    });

    // Initial Execution
    setTimeout(runAnalysis, 100);
})();