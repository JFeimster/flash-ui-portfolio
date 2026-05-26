const LTV_CAC_STORE = {
    // Initial mock data to simulate historical performance
    history: [
        { month: 'Oct', arpu: 110, churn: 7.2, cac: 850, ratio: 1.8 },
        { month: 'Nov', arpu: 115, churn: 6.8, cac: 820, ratio: 2.1 },
        { month: 'Dec', arpu: 125, churn: 6.0, cac: 780, ratio: 2.7 },
        { month: 'Jan', arpu: 135, churn: 5.5, cac: 700, ratio: 3.5 },
        { month: 'Feb', arpu: 145, churn: 5.2, cac: 650, ratio: 4.3 },
        { month: 'Mar', arpu: 150, churn: 5.0, cac: 600, ratio: 5.0 }
    ],

    /**
     * Replicates the calculation logic from the diagnostic tool
     */
    calculateRatio(arpu, churn, cac) {
        const churnDecimal = churn / 100;
        const ltv = churnDecimal > 0 ? arpu / churnDecimal : 0;
        return cac > 0 ? parseFloat((ltv / cac).toFixed(2)) : 0;
    },

    /**
     * Records a new point in the history based on current inputs
     */
    saveSnapshot(arpu, churn, cac) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = monthNames[new Date().getMonth()];
        const ratio = this.calculateRatio(arpu, churn, cac);
        
        const entry = {
            month: currentMonth,
            arpu: parseFloat(arpu),
            churn: parseFloat(churn),
            cac: parseFloat(cac),
            ratio: ratio
        };

        this.history.push(entry);
        
        // Keep only last 12 points for the dashboard
        if (this.history.length > 12) {
            this.history.shift();
        }

        return entry;
    },

    /**
     * Returns data formatted for Chart.js or similar visualization tools
     */
    getChartData() {
        return {
            labels: this.history.map(h => h.month),
            datasets: [
                {
                    label: 'LTV:CAC Ratio',
                    data: this.history.map(h => h.ratio),
                    borderColor: '#00f2ff', // var(--neon-cyan)
                    backgroundColor: 'rgba(0, 242, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#00f2ff',
                    pointBorderColor: '#050507',
                    pointHoverRadius: 6
                }
            ]
        };
    },

    /**
     * Returns summary stats for the dashboard header
     */
    getGrowthStats() {
        if (this.history.length < 2) return { trend: 0, status: 'stable' };
        
        const current = this.history[this.history.length - 1].ratio;
        const previous = this.history[this.history.length - 2].ratio;
        const diff = current - previous;
        const percentChange = (diff / previous) * 100;

        return {
            currentRatio: current,
            percentageChange: percentChange.toFixed(1),
            isImproving: diff > 0,
            isOptimal: current >= 3
        };
    }
};

// Export for use in dashboard scripts
if (typeof module !== 'undefined') {
    module.exports = LTV_CAC_STORE;
}