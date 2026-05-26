/**
 * industry-data-api.js
 * SaaS Benchmark Library: Comparative Market Analysis
 * Provides LTV:CAC standard metrics for Enterprise, SMB, and B2C cohorts.
 */

const SAAS_BENCHMARKS = {
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise SaaS',
        median: 5.2,
        lowerQuartile: 3.5,
        upperQuartile: 7.0,
        context: 'High ACV, Long Sales Cycles'
    },
    smb: {
        id: 'smb',
        name: 'SMB / Mid-Market',
        median: 3.5,
        lowerQuartile: 2.5,
        upperQuartile: 4.8,
        context: 'Inside Sales, Medium Velocity'
    },
    b2c: {
        id: 'b2c',
        name: 'B2C / Prosumer',
        median: 2.2,
        lowerQuartile: 1.5,
        upperQuartile: 3.0,
        context: 'Self-Serve, High Volume'
    }
};

const IndustryBenchmarkAPI = {
    /**
     * Calculates comparative performance against market benchmarks
     * @param {number} ratio - The calculated LTV:CAC ratio
     */
    analyze: (ratio) => {
        return Object.entries(SAAS_BENCHMARKS).map(([key, data]) => {
            let status = 'LAGGING';
            let color = 'var(--danger)';
            let percent = 0;

            if (ratio >= data.upperQuartile) {
                status = 'OPTIMAL';
                color = 'var(--success)';
                percent = 100;
            } else if (ratio >= data.median) {
                status = 'HEALTHY';
                color = 'var(--success)';
                percent = 75;
            } else if (ratio >= data.lowerQuartile) {
                status = 'STABLE';
                color = 'var(--warning)';
                percent = 40;
            } else {
                status = 'CRITICAL';
                color = 'var(--danger)';
                percent = 15;
            }

            return {
                ...data,
                status,
                color,
                performanceWidth: percent
            };
        });
    },

    /**
     * Injects the comparison dashboard into a target container
     * @param {string} containerId - The ID of the element to inject into
     * @param {number} currentRatio - The user's current LTV:CAC ratio
     */
    renderDashboard: (containerId, currentRatio) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const analysis = IndustryBenchmarkAPI.analyze(currentRatio);

        const styles = `
            <style>
                .benchmark-grid {
                    margin-top: 32px;
                    border-top: 1px dashed var(--border);
                    padding-top: 24px;
                    animation: ui-fade-in 0.6s ease-out;
                }
                .benchmark-header {
                    font-family: var(--font-mono);
                    font-size: 10px;
                    text-transform: uppercase;
                    color: var(--text-dim);
                    margin-bottom: 16px;
                    letter-spacing: 0.1em;
                }
                .benchmark-item {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--border);
                    padding: 12px;
                    margin-bottom: 8px;
                    position: relative;
                    overflow: hidden;
                }
                .benchmark-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    position: relative;
                    z-index: 1;
                }
                .benchmark-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--accent);
                }
                .benchmark-desc {
                    font-size: 9px;
                    color: var(--text-dim);
                    margin-top: 2px;
                }
                .benchmark-status {
                    font-family: var(--font-mono);
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }
                .benchmark-bar-bg {
                    height: 2px;
                    background: #1a1a1a;
                    margin-top: 10px;
                    width: 100%;
                    position: relative;
                }
                .benchmark-bar-fill {
                    height: 100%;
                    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes ui-fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;

        const content = analysis.map(item => `
            <div class="benchmark-item">
                <div class="benchmark-meta">
                    <div>
                        <div class="benchmark-title">${item.name}</div>
                        <div class="benchmark-desc">${item.context} (Median: ${item.median}x)</div>
                    </div>
                    <div class="benchmark-status" style="color: ${item.color}">${item.status}</div>
                </div>
                <div class="benchmark-bar-bg">
                    <div class="benchmark-bar-fill" style="width: ${item.performanceWidth}%; background: ${item.color}"></div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `${styles}
            <div class="benchmark-grid">
                <div class="benchmark-header">Market Comparison Context</div>
                ${content}
            </div>`;
    }
};

window.IndustryBenchmarkAPI = IndustryBenchmarkAPI;