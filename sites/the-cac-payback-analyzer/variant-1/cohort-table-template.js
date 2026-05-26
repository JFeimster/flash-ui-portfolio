/**
 * cohort-table-template.js
 * Part of LTV & Unit Economics Deep-Dive
 * Emerald Circuit UI Component Extension
 */

const CohortAnalyzer = {
    styles: `
        .ltv-deep-dive {
            margin-top: 40px;
            background: var(--bg-card);
            border: 1px solid var(--emerald-dim);
            border-radius: 20px;
            padding: 30px;
            font-family: 'Outfit', sans-serif;
            animation: fadeIn 0.5s ease-out;
        }

        .ltv-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 1px solid var(--circuit-line);
            padding-bottom: 15px;
        }

        .ltv-header h2 {
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--emerald);
            font-weight: 800;
        }

        .ltv-controls {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .churn-input-group {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0,0,0,0.3);
            padding: 5px 15px;
            border-radius: 8px;
            border: 1px solid var(--emerald-dim);
        }

        .churn-input-group label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-dim);
        }

        .churn-input-group input {
            width: 60px;
            background: transparent;
            border: none;
            color: var(--emerald);
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            padding: 5px;
            outline: none;
        }

        .cohort-table-wrapper {
            overflow-x: auto;
            margin-top: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .cohort-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            text-align: left;
        }

        .cohort-table th {
            background: rgba(0, 255, 136, 0.05);
            padding: 15px;
            color: var(--text-dim);
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 1px;
            border-bottom: 1px solid var(--emerald-dim);
        }

        .cohort-table td {
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            color: var(--text-main);
        }

        .cohort-table tr:hover {
            background: rgba(0, 255, 136, 0.02);
        }

        .highlight-cell {
            color: var(--emerald);
            font-weight: 700;
        }

        .negative-cell {
            color: var(--danger);
        }

        .ltv-summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: rgba(255,255,255,0.02);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .summary-card .label {
            display: block;
            font-size: 0.65rem;
            color: var(--text-dim);
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .summary-card .value {
            font-size: 1.5rem;
            font-weight: 800;
            color: #fff;
        }

        .summary-card.prime {
            border-color: var(--emerald-dim);
            background: linear-gradient(145deg, rgba(0,255,136,0.05), transparent);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,

    render(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Inject Styles
        if (!document.getElementById('ltv-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'ltv-styles';
            styleSheet.innerText = this.styles;
            document.head.appendChild(styleSheet);
        }

        const { cac, arpu, margin, churn = 5 } = data;
        const monthlyMargin = arpu * (margin / 100);
        const ltv = monthlyMargin / (churn / 100);
        const ltvCacRatio = ltv / cac;

        let tableRows = '';
        let cumulativeProfit = -cac;

        for (let m = 1; m <= 12; m++) {
            const retention = Math.pow(1 - (churn / 100), m - 1);
            const monthlyRev = arpu * retention;
            const monthlyProfit = monthlyRev * (margin / 100);
            cumulativeProfit += monthlyProfit;
            
            const profitClass = cumulativeProfit >= 0 ? 'highlight-cell' : 'negative-cell';

            tableRows += `
                <tr>
                    <td>Month ${m}</td>
                    <td>${(retention * 100).toFixed(1)}%</td>
                    <td>$${monthlyRev.toFixed(2)}</td>
                    <td>$${monthlyProfit.toFixed(2)}</td>
                    <td class="${profitClass}">$${cumulativeProfit.toFixed(2)}</td>
                </tr>
            `;
        }

        container.innerHTML = `
            <div class="ltv-deep-dive">
                <div class="ltv-header">
                    <h2>Unit Economics Deep-Dive</h2>
                    <div class="ltv-controls">
                        <div class="churn-input-group">
                            <label>EST. CHURN</label>
                            <input type="number" id="churn-rate" value="${churn}" step="0.5" min="0">
                            <label>%</label>
                        </div>
                    </div>
                </div>

                <div class="ltv-summary-grid">
                    <div class="summary-card prime">
                        <span class="label">Lifetime Value (LTV)</span>
                        <span class="value" style="color: var(--emerald)">$${Math.round(ltv).toLocaleString()}</span>
                    </div>
                    <div class="summary-card">
                        <span class="label">LTV / CAC Ratio</span>
                        <span class="value">${ltvCacRatio.toFixed(2)}x</span>
                    </div>
                    <div class="summary-card">
                        <span class="label">Margin per User</span>
                        <span class="value">$${monthlyMargin.toFixed(2)}</span>
                    </div>
                </div>

                <div class="cohort-table-wrapper">
                    <table class="cohort-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Retention</th>
                                <th>Revenue</th>
                                <th>Gross Profit</th>
                                <th>Net Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add event listener for churn updates
        document.getElementById('churn-rate').addEventListener('input', (e) => {
            const newChurn = parseFloat(e.target.value) || 0;
            this.render(containerId, { ...data, churn: newChurn });
        });
    }
};

window.CohortAnalyzer = CohortAnalyzer;