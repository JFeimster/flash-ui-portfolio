/**
 * Moonshine Capital | Analytics Engine
 * Logic for processing referral source data and generating dashboard visualizations.
 */

const AnalyticsEngine = {
    sources: [],

    init() {
        this.loadData();
        this.renderDashboard();
        // Re-render when data changes
        window.addEventListener('storage', () => {
            this.loadData();
            this.renderDashboard();
        });
    },

    loadData() {
        const stored = localStorage.getItem('moonshine_referrals');
        this.sources = stored ? JSON.parse(stored) : [];
    },

    getCategoryPerformance() {
        const categories = {};
        this.sources.forEach(s => {
            if (!categories[s.category]) {
                categories[s.category] = { totalScore: 0, count: 0 };
            }
            categories[s.category].totalScore += (s.qualityScore || 0);
            categories[s.category].count++;
        });

        return Object.keys(categories).map(cat => ({
            name: cat,
            avg: Math.round(categories[cat].totalScore / categories[cat].count),
            count: categories[cat].count
        })).sort((a, b) => b.avg - a.avg);
    },

    getGeoClusters() {
        const clusters = {};
        this.sources.forEach(s => {
            const loc = s.location || "Unknown";
            clusters[loc] = (clusters[loc] || 0) + 1;
        });

        return Object.keys(clusters).map(loc => ({
            location: loc,
            count: clusters[loc]
        })).sort((a, b) => b.count - a.count);
    },

    getGrowthMetrics() {
        // Since original data uses IDs as timestamps (Date.now())
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        const recent = this.sources.filter(s => s.id > thirtyDaysAgo).length;
        const total = this.sources.length;
        const growthRate = total > 0 ? Math.round((recent / total) * 100) : 0;
        
        return { recent, total, growthRate };
    },

    renderDashboard() {
        const container = document.getElementById('analytics-dashboard');
        if (!container) return;

        const perf = this.getCategoryPerformance();
        const clusters = this.getGeoClusters();
        const growth = this.getGrowthMetrics();

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Metric Cards -->
                <div class="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/40">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network Volume</p>
                    <div class="flex items-end gap-2">
                        <span class="text-3xl font-black text-white">${growth.total}</span>
                        <span class="text-emerald-400 text-sm font-bold mb-1">Sources</span>
                    </div>
                </div>
                <div class="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/40">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">30-Day Growth</p>
                    <div class="flex items-end gap-2">
                        <span class="text-3xl font-black text-white">+${growth.recent}</span>
                        <span class="text-amber-400 text-sm font-bold mb-1">${growth.growthRate}% Expansion</span>
                    </div>
                </div>
                <div class="glass-card p-6 rounded-xl border border-white/10 bg-slate-900/40">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Top Hub</p>
                    <div class="flex items-end gap-2">
                        <span class="text-3xl font-black text-white text-ellipsis overflow-hidden whitespace-nowrap">
                            ${clusters[0]?.location || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Quality Chart -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-slate-800 uppercase text-xs tracking-tighter">Quality Leaderboard by Category</h4>
                        <span class="text-[10px] text-slate-400 font-medium">AVG SCORE (0-100)</span>
                    </div>
                    <div class="space-y-4">
                        ${perf.map(p => `
                            <div>
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="font-bold text-slate-600">${p.name}</span>
                                    <span class="font-black text-slate-900">${p.avg}</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div class="bg-[#d4af37] h-full rounded-full transition-all duration-1000" style="width: ${p.avg}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Geo Heat Map List -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-slate-800 uppercase text-xs tracking-tighter">Geographic Referral Clusters</h4>
                        <span class="text-[10px] text-slate-400 font-medium">PARTNER DENSITY</span>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        ${clusters.map(c => `
                            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span class="text-sm font-medium text-slate-700">${c.location}</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="text-xs font-bold text-slate-400">${c.count} Sources</span>
                                    <div class="flex gap-0.5">
                                        ${Array.from({length: Math.min(c.count, 5)}).map(() => `<div class="w-1.5 h-4 bg-slate-200 rounded-sm"></div>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        ${clusters.length === 0 ? '<p class="text-slate-400 text-sm italic py-10 text-center">No geographic data available yet.</p>' : ''}
                    </div>
                </div>
            </div>
        `;
    }
};

// Initialize the engine when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add the analytics container to the page if it doesn't exist
    // This allows the script to be dropped into the existing HTML
    if (!document.getElementById('analytics-dashboard')) {
        const main = document.querySelector('main');
        const analyticsSection = document.createElement('section');
        analyticsSection.className = 'max-w-[1600px] mx-auto px-6 mb-12';
        analyticsSection.innerHTML = `
            <div class="mb-6 flex items-center gap-3">
                <h2 class="text-2xl font-black text-slate-800">Network Insights</h2>
                <div class="h-px flex-1 bg-slate-200"></div>
            </div>
            <div id="analytics-dashboard"></div>
        `;
        main.prepend(analyticsSection);
    }
    AnalyticsEngine.init();
});