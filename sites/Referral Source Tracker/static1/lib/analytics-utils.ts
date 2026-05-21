/**
 * Moonshine Capital | Referral Analytics Engine
 * This module processes referral source data to generate performance metrics,
 * category distributions, and network health scores.
 */

const ReferralAnalytics = {
    /**
     * Calculates high-level KPIs for the dashboard
     * @param {Array} sources - The array of referral source objects
     */
    getSummaryMetrics: function(sources) {
        const total = sources.length;
        const active = sources.filter(s => s.stage === 'Active Source').length;
        const needsAttention = sources.filter(s => {
            if (!s.nextFollowUp) return false;
            return new Date(s.nextFollowUp) < new Date();
        }).length;

        const avgQuality = total > 0 
            ? Math.round(sources.reduce((acc, curr) => acc + (curr.qualityScore || 0), 0) / total) 
            : 0;

        return {
            totalPartners: total,
            activePartners: active,
            activationRate: total > 0 ? Math.round((active / total) * 100) : 0,
            overdueFollowUps: needsAttention,
            networkHealthScore: avgQuality
        };
    },

    /**
     * Groups sources by category and calculates performance per group
     * @param {Array} sources 
     */
    getCategoryBreakdown: function(sources) {
        const categories = {};
        
        sources.forEach(source => {
            if (!categories[source.category]) {
                categories[source.category] = {
                    count: 0,
                    avgQuality: 0,
                    activeCount: 0
                };
            }
            const cat = categories[source.category];
            cat.count++;
            cat.avgQuality += (source.qualityScore || 0);
            if (source.stage === 'Active Source') cat.activeCount++;
        });

        // Finalize averages
        Object.keys(categories).forEach(key => {
            categories[key].avgQuality = Math.round(categories[key].avgQuality / categories[key].count);
        });

        return categories;
    },

    /**
     * Projects potential deal flow based on referral source stages
     * Weights: Active (1.0), Agreement Discussed (0.5), Conversation Started (0.2)
     */
    getPipelineProjection: function(sources) {
        const weights = {
            'Active Source': 1.0,
            'Referral Agreement Discussed': 0.6,
            'Conversation Started': 0.3,
            'Contacted': 0.1,
            'Identified': 0.05,
            'Dormant': 0
        };

        const score = sources.reduce((acc, s) => {
            const weight = weights[s.stage] || 0;
            return acc + (weight * (s.qualityScore / 100));
        }, 0);

        return parseFloat(score.toFixed(1));
    },

    /**
     * Generates a CSV string for export
     */
    generateExportCSV: function(sources) {
        const headers = ["Name", "Company", "Category", "Stage", "Location", "Quality Score", "Last Follow Up"];
        const rows = sources.map(s => [
            `"${s.name}"`,
            `"${s.company}"`,
            `"${s.category}"`,
            `"${s.stage}"`,
            `"${s.location}"`,
            s.qualityScore,
            s.nextFollowUp || 'N/A'
        ]);

        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    /**
     * Identifies "Top Movers" - high quality sources that haven't been contacted recently
     */
    getPriorityTargets: function(sources, limit = 3) {
        return [...sources]
            .filter(s => s.stage !== 'Dormant')
            .sort((a, b) => {
                // Priority = High quality + Overdue status
                const aOverdue = new Date(a.nextFollowUp) < new Date() ? 20 : 0;
                const bOverdue = new Date(b.nextFollowUp) < new Date() ? 20 : 0;
                return (b.qualityScore + bOverdue) - (a.qualityScore + aOverdue);
            })
            .slice(0, limit);
    }
};

/**
 * UI Component Extension: Performance Dashboard HTML
 * Use this to inject an analytics view into the main container
 */
const renderAnalyticsDashboard = (sources) => {
    const metrics = ReferralAnalytics.getSummaryMetrics(sources);
    const projection = ReferralAnalytics.getPipelineProjection(sources);
    
    return `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Reach</p>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-black text-slate-900">${metrics.totalPartners}</span>
                    <span class="text-emerald-500 text-xs font-bold mb-1">Sources</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Activation Rate</p>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-black text-slate-900">${metrics.activationRate}%</span>
                    <div class="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                        <div class="bg-gold h-full" style="width: ${metrics.activationRate}%"></div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pipeline Power</p>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-black text-slate-900">${projection}</span>
                    <span class="text-slate-400 text-xs font-bold mb-1">Weighted Score</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Action Required</p>
                <div class="flex items-end gap-2">
                    <span class="text-3xl font-black text-slate-900">${metrics.overdueFollowUps}</span>
                    <span class="text-amber-600 text-xs font-bold mb-1">Overdue</span>
                </div>
            </div>
        </div>
    `;
};

// Export for use in main script
if (typeof module !== 'undefined') {
    module.exports = { ReferralAnalytics, renderAnalyticsDashboard };
}