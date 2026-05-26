/**
 * Obsidian AI SDR Engine - ROI & Performance Analytics Module
 * Purpose: Handles data-driven logic for the 'Analyze' (Step 08) pipeline component.
 * Integrates niche and city metrics to optimize outreach parameters.
 */

class OutreachAnalytics {
    constructor() {
        this.baseValuePerLead = 1200; // Estimated LTV in USD
        this.costPerCompute = 0.04;   // LLM + API cost per lead
        this.performanceData = {
            niches: {
                "SaaS Founders": { leads: 450, replies: 82, conversions: 12 },
                "B2B Agencies": { leads: 310, replies: 45, conversions: 5 },
                "Fintech": { leads: 180, replies: 41, conversions: 9 }
            },
            cities: {
                "San Francisco": { leads: 200, replies: 44, conversions: 8 },
                "New York": { leads: 250, replies: 38, conversions: 4 },
                "London": { leads: 150, replies: 32, conversions: 7 }
            }
        };
    }

    /**
     * Calculates Core KPIs for the analytics strip
     */
    getCoreMetrics() {
        let totalLeads = 0;
        let totalReplies = 0;
        let totalConversions = 0;

        Object.values(this.performanceData.niches).forEach(niche => {
            totalLeads += niche.leads;
            totalReplies += niche.replies;
            totalConversions += niche.conversions;
        });

        const replyRate = (totalReplies / totalLeads) * 100;
        const conversionRate = (totalConversions / totalLeads) * 100;
        const totalRevenue = totalConversions * this.baseValuePerLead;
        const totalCost = totalLeads * this.costPerCompute;
        const roi = ((totalRevenue - totalCost) / totalCost) * 100;

        return {
            replyRate: replyRate.toFixed(1) + '%',
            conversionRate: conversionRate.toFixed(1) + '%',
            roi: roi.toFixed(0) + '%',
            healthScore: this.calculateHealthScore(replyRate, conversionRate)
        };
    }

    /**
     * Determines which segment is yielding the highest return
     */
    getTopPerformers() {
        const nicheROI = Object.entries(this.performanceData.niches).map(([name, data]) => ({
            name,
            score: (data.conversions / data.leads) * 100
        })).sort((a, b) => b.score - a.score);

        return {
            optimalNiche: nicheROI[0].name,
            confidence: (nicheROI[0].score * 10).toFixed(0) + '%'
        };
    }

    /**
     * Internal logic for AI Confidence metrics
     */
    calculateHealthScore(replyRate, conversionRate) {
        const score = (replyRate * 0.4) + (conversionRate * 0.6);
        return Math.min(Math.round(score * 10), 98); // Weighted confidence cap
    }

    /**
     * Updates the UI elements from the BASE COMPONENT
     */
    updateEngineUI() {
        const metrics = this.getCoreMetrics();
        const performers = this.getTopPerformers();

        // Target stats from the UI
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 3) {
            statValues[1].innerText = metrics.replyRate;
            statValues[2].innerText = metrics.healthScore + '%';
        }

        // Log optimization signals for the engine config
        console.log(`[ENGINE_OPTIMIZATION] Recommended Niche: ${performers.optimalNiche}`);
        console.log(`[ENGINE_OPTIMIZATION] System Health: ${metrics.healthScore}%`);
        
        return {
            status: "ANALYSIS_COMPLETE",
            timestamp: new Date().toISOString(),
            recommendation: performers.optimalNiche
        };
    }
}

// Initialize and expose to the engine
const EngineAnalytics = new OutreachAnalytics();

// Execution trigger for the 'Initialize Engine' button
document.querySelector('.btn-execute')?.addEventListener('click', () => {
    setTimeout(() => {
        const report = EngineAnalytics.updateEngineUI();
        const analyzeStep = document.querySelectorAll('.step-card')[7];
        if (analyzeStep) {
            analyzeStep.classList.add('active');
            analyzeStep.querySelector('.step-desc').innerText = `ROI Optimization: ${report.recommendation} identified as primary target.`;
        }
    }, 1500);
});

export default EngineAnalytics;