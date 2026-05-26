/**
 * cohort-generator.js
 * Visual Cohort Heatmap Generator for SaaS LTV:CAC Diagnostic
 */

const CohortGenerator = {
    settings: {
        months: 7,
        cohorts: 6,
        colors: {
            high: '#00f2ff', // neon-cyan
            mid: '#9d00ff',  // neon-purple
            low: '#ff0055',  // neon-red
            empty: 'rgba(255, 255, 255, 0.03)'
        }
    },

    init(containerId, syncInputId) {
        this.container = document.getElementById(containerId);
        this.syncInput = document.getElementById(syncInputId);
        this.injectStyles();
        this.render();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cohort-container {
                margin-top: 24px;
                background: rgba(13, 13, 18, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 20px;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .cohort-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .cohort-title {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-main);
            }
            .cohort-table-wrapper {
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--neon-cyan) transparent;
            }
            .cohort-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 4px;
                font-size: 11px;
            }
            .cohort-table th {
                color: var(--text-dim);
                font-weight: 600;
                padding: 8px;
                text-align: center;
                text-transform: uppercase;
            }
            .cohort-table td {
                padding: 10px 4px;
                text-align: center;
                border-radius: 4px;
                min-width: 45px;
                font-weight: 600;
                color: white;
                transition: transform 0.2s ease;
            }
            .cohort-table td:hover {
                transform: scale(1.1);
                z-index: 10;
                cursor: crosshair;
            }
            .cohort-row-label {
                text-align: left !important;
                color: var(--text-dim) !important;
                background: transparent !important;
            }
            .leak-indicator {
                position: relative;
            }
            .leak-indicator::after {
                content: '';
                position: absolute;
                inset: 0;
                border: 1px solid var(--neon-red);
                border-radius: 4px;
                animation: pulse-red 2s infinite;
                pointer-events: none;
            }
            @keyframes pulse-red {
                0% { opacity: 0.2; }
                50% { opacity: 0.8; }
                100% { opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    },

    generateData() {
        const data = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const startMonthIndex = 2; // March

        for (let i = 0; i < this.settings.cohorts; i++) {
            const row = {
                label: months[startMonthIndex + i],
                size: 100 + Math.floor(Math.random() * 50),
                values: []
            };

            let currentRetention = 100;
            for (let j = 0; j < this.settings.months - i; j++) {
                if (j === 0) {
                    currentRetention = 100;
                } else {
                    // Simulate decay with a potential "leak" at month 2-3
                    const drop = (j === 2 || j === 3) ? (Math.random() * 15 + 10) : (Math.random() * 5 + 2);
                    currentRetention -= drop;
                }
                row.values.push(Math.max(0, Math.round(currentRetention)));
            }
            data.push(row);
        }
        return data;
    },

    getCellStyle(value) {
        if (value >= 90) return `background: rgba(0, 242, 255, 0.8); box-shadow: 0 0 10px rgba(0, 242, 255, 0.2);`;
        if (value >= 75) return `background: rgba(0, 242, 255, 0.5);`;
        if (value >= 60) return `background: rgba(157, 0, 255, 0.4);`;
        if (value >= 40) return `background: rgba(157, 0, 255, 0.2);`;
        return `background: rgba(255, 0, 85, 0.2); border: 1px solid rgba(255, 0, 85, 0.3);`;
    },

    calculateAverageChurn(data) {
        let totalMonthlyChurn = 0;
        let count = 0;

        data.forEach(row => {
            for (let i = 0; i < row.values.length - 1; i++) {
                const churn = (row.values[i] - row.values[i+1]) / row.values[i];
                if (!isNaN(churn) && churn >= 0) {
                    totalMonthlyChurn += churn;
                    count++;
                }
            }
        });

        return count > 0 ? (totalMonthlyChurn / count) * 100 : 5;
    },

    render() {
        const data = this.generateData();
        const avgChurn = this.calculateAverageChurn(data);

        // Sync with main input
        if (this.syncInput) {
            this.syncInput.value = avgChurn.toFixed(1);
            // Trigger calculation in base component
            if (typeof calculate === 'function') calculate();
        }

        let html = `
            <div class="cohort-container">
                <div class="cohort-header">
                    <div class="cohort-title">Retention Cohorts (%)</div>
                    <div style="font-size: 10px; color: var(--neon-cyan)">AVG CHURN: ${avgChurn.toFixed(1)}%</div>
                </div>
                <div class="cohort-table-wrapper">
                    <table class="cohort-table">
                        <thead>
                            <tr>
                                <th>Cohort</th>
                                <th>M0</th>
                                <th>M1</th>
                                <th>M2</th>
                                <th>M3</th>
                                <th>M4</th>
                                <th>M5</th>
                                <th>M6</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        data.forEach(row => {
            html += `<tr><td class="cohort-row-label">${row.label}</td>`;
            for (let i = 0; i < this.settings.months; i++) {
                const val = row.values[i];
                if (val !== undefined) {
                    const isLeak = (i > 0 && (row.values[i-1] - val) > 12);
                    html += `<td style="${this.getCellStyle(val)}" class="${isLeak ? 'leak-indicator' : ''}">${val}%</td>`;
                } else {
                    html += `<td style="background: var(--empty)"></td>`;
                }
            }
            html += `</tr>`;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }
};

// Auto-run if container exists
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has provided a hook in the HTML
    const hook = document.createElement('div');
    hook.id = 'cohort-hook';
    const card = document.querySelector('.diagnostic-card');
    if (card) {
        card.appendChild(hook);
        CohortGenerator.init('cohort-hook', 'churn');
    }
});
