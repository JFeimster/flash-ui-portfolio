/**
 * BenchmarkChart.js
 * Swiss Ledger CAC Payback Analyzer Extension
 * Visualizes user metrics against industry-standard medians.
 */

const INDUSTRY_MEDIANS = {
    saas: {
        label: 'SaaS (B2B)',
        payback: { median: 12, max: 24, label: 'Months' },
        margin: { median: 82, min: 60, max: 95, label: '%' }
    },
    ecommerce: {
        label: 'E-Commerce (D2C)',
        payback: { median: 4, max: 12, label: 'Months' },
        margin: { median: 35, min: 15, max: 60, label: '%' }
    },
    fintech: {
        label: 'Fintech (Consumer)',
        payback: { median: 18, max: 36, label: 'Months' },
        margin: { median: 65, min: 40, max: 85, label: '%' }
    }
};

class IndustryBenchmark {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.currentIndustry = 'saas';
        this.init();
    }

    init() {
        if (!this.container) return;
        this.renderBase();
        this.attachEvents();
    }

    renderBase() {
        this.container.innerHTML = `
            <div class="benchmark-wrapper">
                <div class="benchmark-header">
                    <label>Industry Comparison</label>
                    <select id="industrySelector" class="swiss-select">
                        <option value="saas">SaaS / B2B</option>
                        <option value="ecommerce">E-Commerce</option>
                        <option value="fintech">Fintech</option>
                    </select>
                </div>

                <div class="benchmark-body">
                    <div class="benchmark-row">
                        <div class="row-header">
                            <span class="row-title">Efficiency Percentile</span>
                            <span id="percentileRank" class="row-rank">--</span>
                        </div>
                        <div class="benchmark-track">
                            <div id="paybackMarker" class="benchmark-marker"></div>
                            <div class="median-line" title="Industry Median"></div>
                        </div>
                        <div class="benchmark-labels">
                            <span>Laggard</span>
                            <span>Median</span>
                            <span>Top 10%</span>
                        </div>
                    </div>

                    <div class="benchmark-row">
                        <div class="row-header">
                            <span class="row-title">Gross Margin vs Peers</span>
                            <span id="marginRank" class="row-rank">--</span>
                        </div>
                        <div class="benchmark-track">
                            <div id="marginMarker" class="benchmark-marker"></div>
                            <div class="median-line" title="Industry Median"></div>
                        </div>
                        <div class="benchmark-labels">
                            <span>Below</span>
                            <span>Median</span>
                            <span>Above</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .benchmark-wrapper {
                    margin-top: 30px;
                    padding-top: 30px;
                    border-top: 2px solid var(--border);
                }
                .benchmark-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }
                .swiss-select {
                    background: var(--paper);
                    border: 1px solid var(--border);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 5px 10px;
                    text-transform: uppercase;
                    outline: none;
                }
                .benchmark-row {
                    margin-bottom: 24px;
                }
                .row-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .row-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #666;
                }
                .row-rank {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 12px;
                    font-weight: 800;
                }
                .benchmark-track {
                    height: 8px;
                    background: rgba(26, 26, 26, 0.05);
                    position: relative;
                    border: 1px solid var(--border);
                }
                .median-line {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--border);
                    opacity: 0.4;
                }
                .benchmark-marker {
                    position: absolute;
                    width: 4px;
                    height: 16px;
                    background: var(--accent);
                    top: -5px;
                    left: 0%;
                    transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                    z-index: 2;
                }
                .benchmark-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 6px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px;
                    color: #999;
                    text-transform: uppercase;
                }
            </style>
        `;
    }

    attachEvents() {
        const selector = this.container.querySelector('#industrySelector');
        selector.addEventListener('change', (e) => {
            this.currentIndustry = e.target.value;
            // Trigger recalculation if the main component is available
            if (typeof calculate === 'function') calculate();
        });
    }

    /**
     * Updates the UI based on current CAC Payback and Margin
     * @param {number} payback - Months to payback
     * @param {number} margin - Gross Margin percentage
     */
    update(payback, margin) {
        const data = INDUSTRY_MEDIANS[this.currentIndustry];

        // 1. Payback Percentile Calculation
        // Invert: Lower payback is higher percentile. Median at 50%.
        let paybackPos;
        if (payback <= 0) paybackPos = 100;
        else if (payback >= data.payback.max) paybackPos = 0;
        else {
            // Logarithmic feel for ranking
            const ratio = data.payback.median / payback;
            paybackPos = Math.min(95, Math.max(5, 50 * ratio));
        }

        // 2. Margin Percentile Calculation
        let marginPos = ((margin - data.margin.min) / (data.margin.max - data.margin.min)) * 100;
        marginPos = Math.min(98, Math.max(2, marginPos));

        // Update Markers
        const pMarker = document.getElementById('paybackMarker');
        const mMarker = document.getElementById('marginMarker');
        
        pMarker.style.left = `${paybackPos}%`;
        mMarker.style.left = `${marginPos}%`;

        // Update Text
        document.getElementById('percentileRank').innerText = `${Math.round(paybackPos)}th PCTL`;
        document.getElementById('marginRank').innerText = margin > data.margin.median ? 'ABOVE MEDIAN' : 'BELOW MEDIAN';

        // Color Logic
        const getColor = (pos) => pos > 70 ? 'var(--success)' : (pos < 30 ? 'var(--danger)' : 'var(--ink)');
        pMarker.style.backgroundColor = getColor(paybackPos);
        mMarker.style.backgroundColor = getColor(marginPos);
    }
}

// Instantiate and hook into existing logic
document.addEventListener('DOMContentLoaded', () => {
    // Create an anchor in the analysis section if it doesn't exist
    const analysisSection = document.querySelector('.analysis-section');
    if (analysisSection) {
        const benchContainer = document.createElement('div');
        benchContainer.id = 'benchmarkComponent';
        // Insert before the CTA button
        analysisSection.insertBefore(benchContainer, document.querySelector('.cta-button'));
        
        window.benchmarkUI = new IndustryBenchmark('#benchmarkComponent');

        // Monkey-patch the existing calculate function to include benchmark updates
        const originalCalculate = window.calculate;
        window.calculate = function() {
            originalCalculate();
            
            // Re-fetch derived values from the DOM or state
            const paybackText = document.getElementById('paybackValue').innerText;
            const payback = parseFloat(paybackText);
            const margin = parseFloat(document.getElementById('margin').value) || 0;
            
            if (window.benchmarkUI) {
                window.benchmarkUI.update(payback, margin);
            }
        };

        // Run once
        window.calculate();
    }
});