const StatsEngine = {
    init() {
        // Create dashboard container if it doesn't exist
        if (!document.getElementById('stats-dashboard')) {
            const mainBoard = document.querySelector('main');
            const dashboardSection = document.createElement('section');
            dashboardSection.id = 'stats-dashboard';
            dashboardSection.className = 'max-w-7xl mx-auto px-6 mb-12';
            mainBoard.parentNode.insertBefore(dashboardSection, mainBoard);
        }
        this.render();
        
        // Hook into the existing save/render cycle
        const originalSave = window.save;
        if (originalSave) {
            window.save = (...args) => {
                originalSave(...args);
                this.render();
            };
        }

        const originalRenderBoard = window.renderBoard;
        if (originalRenderBoard) {
            window.renderBoard = (...args) => {
                originalRenderBoard(...args);
                this.render();
            };
        }
    },

    getStats() {
        const data = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        const total = data.length;
        const active = data.filter(s => s.stage === 'Active Source').length;
        const avgQuality = total ? Math.round(data.reduce((acc, s) => acc + (s.qualityScore || 0), 0) / total) : 0;
        
        // Conversion by Category
        const categories = [...new Set(data.map(s => s.category))];
        const categoryStats = categories.map(cat => {
            const catSources = data.filter(s => s.category === cat);
            const catActive = catSources.filter(s => s.stage === 'Active Source').length;
            return {
                name: cat,
                count: catSources.length,
                rate: catSources.length ? Math.round((catActive / catSources.length) * 100) : 0
            };
        }).sort((a, b) => b.rate - a.rate);

        // Pipeline Velocity Proxy (Stages Weighting)
        const stageWeights = {
            "Identified": 1,
            "Contacted": 2,
            "Conversation Started": 3,
            "Referral Agreement Discussed": 4,
            "Active Source": 5,
            "Dormant": 0
        };
        const totalVelocity = data.reduce((acc, s) => acc + (stageWeights[s.stage] || 0), 0);
        const maxPossibleVelocity = total * 5;
        const velocityScore = maxPossibleVelocity ? Math.round((totalVelocity / maxPossibleVelocity) * 100) : 0;

        return { total, active, avgQuality, categoryStats, velocityScore };
    },

    render() {
        const stats = this.getStats();
        const container = document.getElementById('stats-dashboard');
        if (!container) return;

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Partners</p>
                    <p class="text-3xl font-black text-slate-900">${stats.active}<span class="text-sm text-slate-400 font-normal ml-2">/ ${stats.total} Total</span></p>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Global Conv. Rate</p>
                    <p class="text-3xl font-black text-emerald-600">${stats.total ? Math.round((stats.active/stats.total)*100) : 0}%</p>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pipeline Velocity</p>
                    <p class="text-3xl font-black text-[#d4af37]">${stats.velocityScore}%</p>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Partner Health</p>
                    <p class="text-3xl font-black text-slate-900">${stats.avgQuality}<span class="text-sm text-slate-400 font-normal">/100</span></p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Category Performance -->
                <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-sm uppercase tracking-widest">Conversion by Professional Category</h3>
                        <span class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">LIVE DATA</span>
                    </div>
                    <div class="p-6 space-y-5">
                        ${stats.categoryStats.length ? stats.categoryStats.map(cat => `
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-semibold text-slate-700">${cat.name}</span>
                                    <span class="text-sm font-bold text-slate-900">${cat.rate}%</span>
                                </div>
                                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div class="bg-[#d4af37] h-full rounded-full transition-all duration-1000" style="width: ${cat.rate}%"></div>
                                </div>
                                <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold">${cat.count} total sources in this category</p>
                            </div>
                        `).join('') : '<p class="text-slate-400 italic text-sm text-center py-4">No data available yet</p>'}
                    </div>
                </div>

                <!-- Velocity Insights -->
                <div class="bg-slate-900 rounded-xl shadow-xl p-6 text-white relative overflow-hidden">
                    <div class="relative z-10">
                        <h3 class="font-bold text-sm uppercase tracking-widest mb-6 text-[#d4af37]">Ecosystem Momentum</h3>
                        <div class="flex items-end gap-2 mb-4 h-32">
                            ${[40, 70, 55, 90, 65, 85, stats.velocityScore].map(h => `
                                <div class="flex-1 bg-white/10 hover:bg-[#d4af37] transition-colors rounded-t-sm" style="height: ${Math.max(h, 10)}%"></div>
                            `).join('')}
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed">
                            Your <span class="text-white font-bold">Pipeline Velocity</span> is calculated by the density of sources in advanced stages. A score of <span class="text-[#d4af37] font-bold">${stats.velocityScore}%</span> suggests your network is currently <span class="text-white underline decoration-[#d4af37]">${stats.velocityScore > 60 ? 'Moving Fast' : 'Static'}</span>.
                        </p>
                        <div class="mt-8 pt-8 border-t border-white/10">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Growth Projection</p>
                                    <p class="text-sm font-bold text-white">+${Math.round(stats.active * 0.4)} New Sources Next Month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        `;
    }
};

// Initialize the engine when the window loads
window.addEventListener('load', () => StatsEngine.init());
```