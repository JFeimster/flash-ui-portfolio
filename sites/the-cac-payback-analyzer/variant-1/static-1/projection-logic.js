/**
 * Emerald Circuit | Scale & Efficiency Simulator Logic
 * Provides diminishing returns modeling for CAC Payback analysis.
 */

const ScaleSimulator = {
    // Sensitivity factor: how quickly CAC increases as spend scales (0.1 - 0.5)
    SATURATION_FACTOR: 0.18,
    BANKABILITY_THRESHOLD: 6,

    /**
     * Calculates projected metrics based on a spend multiplier.
     * Uses a power law model: CAC_new = CAC_initial * (Multiplier ^ (1 + Saturation))
     */
    calculateProjection(baseMetrics, multiplier) {
        const { spend, customers, arpu, margin } = baseMetrics;
        const initialCAC = spend / customers;
        const contributionMargin = arpu * (margin / 100);

        // Projected Spend
        const projectedSpend = spend * multiplier;
        
        // Projected CAC (Diminishing Returns Model)
        // As spend increases, efficiency drops non-linearly
        const projectedCAC = initialCAC * Math.pow(multiplier, 1 + this.SATURATION_FACTOR);
        
        const projectedPayback = projectedCAC / contributionMargin;
        const projectedCustomers = projectedSpend / projectedCAC;

        return {
            spend: projectedSpend,
            cac: projectedCAC,
            payback: projectedPayback,
            customers: projectedCustomers,
            isBankable: projectedPayback <= this.BANKABILITY_THRESHOLD
        };
    },

    /**
     * Finds the exact dollar amount of spend where the business hits the 6-month payback ceiling.
     */
    findScalingLimit(baseMetrics) {
        let low = 1;
        let high = 50; // Max 50x scaling simulation
        let limitMultiplier = 1;

        // Binary search for the 6-month threshold
        for (let i = 0; i < 20; i++) {
            let mid = (low + high) / 2;
            let projection = this.calculateProjection(baseMetrics, mid);
            
            if (projection.payback <= this.BANKABILITY_THRESHOLD) {
                limitMultiplier = mid;
                low = mid;
            } else {
                high = mid;
            }
        }

        return this.calculateProjection(baseMetrics, limitMultiplier);
    }
};

/**
 * UI Integration Logic
 * Hooks into the existing CAC Payback Analyzer DOM
 */
function initSimulator() {
    const inputs = ['spend', 'customers', 'arpu', 'margin'];
    const ctaMessage = document.getElementById('cta-message');
    const ctaContainer = document.querySelector('.cta-container');

    // Create simulator display element if it doesn't exist
    let simDisplay = document.getElementById('sim-display');
    if (!simDisplay) {
        simDisplay = document.createElement('div');
        simDisplay.id = 'sim-display';
        simDisplay.style.cssText = `
            margin-top: 15px;
            padding: 12px;
            background: rgba(0, 255, 136, 0.05);
            border: 1px solid var(--emerald-dim);
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: var(--text-dim);
            transition: all 0.3s ease;
        `;
        ctaContainer.insertBefore(simDisplay, ctaMessage);
    }

    function updateSimulation() {
        const metrics = {
            spend: parseFloat(document.getElementById('spend').value) || 0,
            customers: parseFloat(document.getElementById('customers').value) || 0,
            arpu: parseFloat(document.getElementById('arpu').value) || 0,
            margin: parseFloat(document.getElementById('margin').value) || 0
        };

        if (metrics.spend && metrics.customers && metrics.arpu && metrics.margin) {
            const currentPayback = (metrics.spend / metrics.customers) / (metrics.arpu * (metrics.margin / 100));
            
            if (currentPayback > ScaleSimulator.BANKABILITY_THRESHOLD) {
                simDisplay.style.borderColor = 'var(--danger)';
                simDisplay.innerHTML = `<span style="color:var(--danger)">[CRITICAL]</span> Efficiency threshold exceeded. Scale-back required to regain bankability.`;
                return;
            }

            const limit = ScaleSimulator.findScalingLimit(metrics);
            const formattedSpend = new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD', 
                maximumFractionDigits: 0 
            }).format(limit.spend);

            simDisplay.style.borderColor = 'var(--emerald-dim)';
            simDisplay.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>SCALING CEILING:</span>
                    <span style="color:var(--emerald); font-weight:700;">${formattedSpend}/mo</span>
                </div>
                <div style="font-size: 0.65rem; margin-top: 4px; opacity: 0.8;">
                    Max capacity before CAC Payback exceeds 6.0 months.
                </div>
            `;
        } else {
            simDisplay.innerHTML = "Awaiting protocol parameters for scale simulation...";
        }
    }

    // Attach listeners to existing inputs
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateSimulation);
    });

    // Initial run
    setTimeout(updateSimulation, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
} else {
    initSimulator();
}