/**
 * EQUITY TERMINAL | Market Intelligence Data Engine
 * Real-time acquisition multiples and deal flow heatmaps
 */

const MARKET_INTELLIGENCE = {
    industries: [
        { label: "SaaS & Digital Assets", median: 4.2, change: "+0.4", volume: "High", color: "#C1FF00" },
        { label: "HVAC & Home Services", median: 3.1, change: "+0.1", volume: "Moderate", color: "#8E522F" },
        { label: "Manufacturing / CNC", median: 3.8, change: "-0.2", volume: "Low", color: "#F5F5F0" },
        { label: "E-Commerce (FBA)", median: 2.6, change: "-0.5", volume: "High", color: "#FF4500" },
        { label: "Professional Agencies", median: 2.2, change: "0.0", volume: "Moderate", color: "#FFFDD0" },
        { label: "Logistics & Routes", median: 2.9, change: "+0.2", volume: "High", color: "#D97706" }
    ],
    
    monthlyTrends: [
        { month: "JAN", deals: 88, multiples: 2.9 },
        { month: "FEB", deals: 92, multiples: 3.0 },
        { month: "MAR", deals: 105, multiples: 3.1 },
        { month: "APR", deals: 98, multiples: 3.1 },
        { month: "MAY", deals: 115, multiples: 3.3 },
        { month: "JUN", deals: 124, multiples: 3.4 }
    ],

    regions: [
        { state: "Texas", score: 98, status: "Overheated" },
        { state: "Florida", score: 92, status: "High Demand" },
        { state: "California", score: 85, status: "Stable" },
        { state: "Arizona", score: 79, status: "Growing" },
        { state: "Georgia", score: 74, status: "Stable" },
        { state: "North Carolina", score: 68, status: "Emerging" },
        { state: "Illinois", score: 55, status: "Buyer Market" },
        { state: "Ohio", score: 48, status: "Value Play" }
    ]
};

class AcquisitionCharts {
    constructor() {
        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; width: 100%;">
                <!-- Median Multiples Bar Chart -->
                <div class="brutalist-border" style="background: var(--graphite); padding: 2rem;">
                    <h3 class="mono" style="margin-bottom: 2rem; font-size: 1rem; border-bottom: 2px solid var(--bone); padding-bottom: 1rem;">
                        MEDIAN SDE MULTIPLES BY SECTOR (LTM)
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        ${MARKET_INTELLIGENCE.industries.map(ind => this.createBar(ind)).join('')}
                    </div>
                </div>

                <!-- Deal Flow Heat Map -->
                <div class="brutalist-border" style="background: var(--graphite); padding: 2rem;">
                    <h3 class="mono" style="margin-bottom: 2rem; font-size: 1rem; border-bottom: 2px solid var(--bone); padding-bottom: 1rem;">
                        GEOGRAPHIC CONCENTRATION INDEX
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        ${MARKET_INTELLIGENCE.regions.map(reg => this.createHeatBox(reg)).join('')}
                    </div>
                </div>

                <!-- Trend Line Placeholder -->
                <div class="brutalist-border" style="grid-column: span 2; background: var(--bone); color: var(--obsidian); padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h3 class="mono" style="font-weight: 800;">MARKET VELOCITY & VALUATION TRENDS</h3>
                        <div class="mono" style="font-size: 0.7rem;">SOURCE: EQUITY TERMINAL AGGREGATE DATA</div>
                    </div>
                    <div style="height: 200px; display: flex; align-items: flex-end; gap: 1rem; padding-top: 2rem; border-left: 4px solid var(--obsidian); border-bottom: 4px solid var(--obsidian);">
                        ${MARKET_INTELLIGENCE.monthlyTrends.map(t => this.createTrendBar(t)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createBar(item) {
        const percentage = (item.median / 5) * 100;
        return `
            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 0.5rem;" class="mono">
                    <span>${item.label}</span>
                    <span style="color: ${item.color}">${item.median}x [${item.change}]</span>
                </div>
                <div style="width: 100%; height: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--graphite-light);">
                    <div style="width: ${percentage}%; height: 100%; background: ${item.color};"></div>
                </div>
            </div>
        `;
    }

    createHeatBox(item) {
        const opacity = item.score / 100;
        return `
            <div style="border: 1px solid var(--graphite-light); padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; background: rgba(193, 255, 0, ${opacity * 0.15})">
                <div class="mono" style="font-size: 0.7rem; color: #888;">${item.state}</div>
                <div style="font-weight: 800; font-size: 1.2rem;">${item.score}</div>
                <div class="mono" style="font-size: 0.6rem; padding: 2px 4px; background: ${item.score > 80 ? 'var(--blood-orange)' : 'var(--graphite-light)'}; width: fit-content;">
                    ${item.status}
                </div>
            </div>
        `;
    }

    createTrendBar(trend) {
        const height = (trend.deals / 150) * 100;
        return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div class="mono" style="font-size: 0.6rem; transform: rotate(-90deg); margin-bottom: 1rem;">${trend.deals} DEALS</div>
                <div style="width: 100%; height: ${height}%; background: var(--obsidian); min-width: 30px;"></div>
                <div class="mono" style="font-size: 0.7rem; font-weight: 800; margin-top: 0.5rem;">${trend.month}</div>
            </div>
        `;
    }
}

// Global instance for usage in the report page
const AcquisitionIntelligence = new AcquisitionCharts();

// Styles injection for the charts
const style = document.createElement('style');
style.textContent = `
    .chart-tooltip {
        position: absolute;
        background: var(--obsidian);
        border: 1px solid var(--bone);
        padding: 0.5rem;
        pointer-events: none;
        z-index: 100;
    }
`;
document.head.appendChild(style);

// Export for window
window.AcquisitionIntelligence = AcquisitionIntelligence;
window.MARKET_DATA = MARKET_INTELLIGENCE;