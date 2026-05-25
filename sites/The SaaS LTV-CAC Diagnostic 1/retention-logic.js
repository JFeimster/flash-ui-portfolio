/**
 * retention-logic.js
 * 
 * CORE LOGIC: Customer Cohort Explorer
 * Calculates granular retention, weighted churn, and cohort-specific ARPU
 * to feed the LTV:CAC Diagnostic engine.
 */

const CohortExplorer = {
    // Mock Data: [Month, Initial Customers, Month 0 Revenue, Retention % by Month]
    cohorts: [
        { id: "JAN-24", size: 450, rev: 112500, retention: [100, 96.5, 94.2, 92.1, 90.5, 88.2] },
        { id: "FEB-24", size: 380, rev: 91200,  retention: [100, 95.1, 92.8, 90.2, 87.5] },
        { id: "MAR-24", size: 520, rev: 135200, retention: [100, 97.2, 95.5, 93.8] },
        { id: "APR-24", size: 610, rev: 158600, retention: [100, 94.8, 91.2] },
        { id: "MAY-24", size: 490, rev: 122500, retention: [100, 96.2] }
    ],

    /**
     * Calculates the average monthly churn for a specific cohort based on its history.
     */
    getCohortChurn(cohortId) {
        const cohort = this.cohorts.find(c => c.id === cohortId);
        if (!cohort || cohort.retention.length < 2) return 0;

        const totalDrop = cohort.retention[0] - cohort.retention[cohort.retention.length - 1];
        const periods = cohort.retention.length - 1;
        
        // Return periodic average churn
        return (totalDrop / periods);
    },

    /**
     * Calculates ARPU (Average Revenue Per User) at inception for a cohort.
     */
    getCohortARPU(cohortId) {
        const cohort = this.cohorts.find(c => c.id === cohortId);
        if (!cohort) return 0;
        return cohort.rev / cohort.size;
    },

    /**
     * Aggregates all cohort data to provide system-wide variables.
     * Weights churn by cohort size to ensure accuracy.
     */
    getAggregatedMetrics() {
        let totalWeightedChurn = 0;
        let totalWeightedARPU = 0;
        let totalSize = 0;

        this.cohorts.forEach(c => {
            const churn = this.getCohortChurn(c.id);
            const arpu = this.getCohortARPU(c.id);
            
            totalWeightedChurn += (churn * c.size);
            totalWeightedARPU += (arpu * c.size);
            totalSize += c.size;
        });

        return {
            avgChurn: (totalWeightedChurn / totalSize).toFixed(2),
            avgARPU: (totalWeightedARPU / totalSize).toFixed(2),
            sampleSize: totalSize
        };
    },

    /**
     * Injects calculated cohort metrics into the main Diagnostic UI.
     */
    syncToDiagnostic() {
        const metrics = this.getAggregatedMetrics();
        
        const arpuInput = document.getElementById('arpu');
        const churnInput = document.getElementById('churn');

        if (arpuInput && churnInput) {
            // Apply visual "sync" effect
            [arpuInput, churnInput].forEach(el => {
                el.style.borderColor = 'var(--success)';
                setTimeout(() => el.style.borderColor = 'var(--border)', 1000);
            });

            arpuInput.value = metrics.avgARPU;
            churnInput.value = metrics.avgChurn;

            // Trigger global update from base component
            if (typeof updateDiagnostic === 'function') {
                updateDiagnostic();
            }
        }
    },

    /**
     * Returns color coding based on cohort health.
     */
    getHealthStatus(churn) {
        if (churn < 2) return { label: 'ELITE', color: '#00ff88' };
        if (churn < 5) return { label: 'HEALTHY', color: '#ffffff' };
        return { label: 'DEGRADED', color: '#ff4444' };
    }
};

// Auto-init listener for UI Integration
document.addEventListener('DOMContentLoaded', () => {
    const cta = document.getElementById('cta-button');
    if (cta) {
        const cohortTrigger = document.createElement('div');
        cohortTrigger.style.cssText = `
            margin-top: 15px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            text-align: center;
            color: #444;
            cursor: pointer;
            text-decoration: underline;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        cohortTrigger.textContent = "Import Real Cohort Data";
        cohortTrigger.onclick = () => CohortExplorer.syncToDiagnostic();
        cta.parentNode.appendChild(cohortTrigger);
    }
});

// Export to window for global access
window.CohortExplorer = CohortExplorer;