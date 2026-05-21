/**
 * Moonshine Capital | Relationship Performance Dashboard
 * Visualize the health, conversion, and velocity of the referral ecosystem.
 */

const DashboardCharts = {
    colors: {
        gold: '#d4af37',
        navy: '#020617',
        emerald: '#10b981',
        slate: '#64748b',
        blue: '#3b82f6',
        lightGold: '#fef3c7'
    },

    init() {
        this.injectStyles();
        this.injectContainer();
        this.loadChartJS();
        
        // Data Sync: Poll for changes in the global 'sources' array from the base script
        let lastCount = 0;
        setInterval(() => {
            if (window.sources && window.sources.length !== lastCount) {
                lastCount = window.sources.length;
                this.render();
            }
        }, 1000);
    },

    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .kpi-card { transition: all 0.3s ease; }
            .kpi-card:hover { transform: translateY(-3px); }
            .chart-container { position: relative; height: 260px; width: 100%; }
        `;
        document.head.appendChild(style);
    },

    injectContainer() {
        const header = document.querySelector('header');
        const dashboardHTML = `
            <section id="relationship-performance-dashboard" class="max-w-7xl mx-auto px-6 -mt-8 mb-12 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    <!-- KPI Cards -->
                    <div class="bg-white p-5 rounded-xl shadow-xl border border-slate-200 kpi-card">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Partners</p>
                        <div class="flex items-end gap-2">
                            <h4 id="kpi-active-count" class="text-3xl font-black text-slate-900">0</h4>
                            <span class="text-emerald-500 text-xs font-bold mb-1">↑ Active</span>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl shadow-xl border border-slate-200 kpi-card">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Quality</p>
                        <div class="flex items-end gap-2">
                            <h4 id="kpi-avg-quality" class="text-3xl font-black text-slate-900">0%</h4>
                            <span class="text-gold text-xs font-bold mb-1">Avg Score</span>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl shadow-xl border border-slate-200 kpi-card">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Velocity</p>
                        <div class="flex items-end gap-2">
                            <h4 id="kpi-velocity" class="text-3xl font-black text-slate-900">12.4d</h4>
                            <span class="text-blue-500 text-xs font-bold mb-1">Avg Move</span>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl shadow-xl border border-slate-200 kpi-card">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Rate</p>
                        <div class="flex items-end gap-2">
                            <h4 id="kpi-conv-rate" class="text-3xl font-black text-slate-900">0%</h4>
                            <span class="text-slate-400 text-xs font-bold mb-1">Contact → Active</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Conversion Chart -->
                    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                                <span class="w-2 h-4 bg-gold rounded-full"></span>
                                Conversion Efficiency by Category
                            </h3>
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Live Metrics</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="conversionChart"></canvas>
                        </div>
                    </div>

                    <!-- Category Health -->
                    <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-tight">
                            <span class="w-2 h-4 bg-navy-deep rounded-full" style="background-color:#020617"></span>
                            Source Mix
                        </h3>
                        <div class="chart-container">
                            <canvas id="mixChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>
        `;
        header.insertAdjacentHTML('afterend', dashboardHTML);
    },

    loadChartJS() {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.render();
            document.head.appendChild(script);
        } else {
            this.render();
        }
    },

    render() {
        const sources = window.sources || [];
        if (typeof Chart === 'undefined' || !document.getElementById('conversionChart')) return;

        // KPI Calculations
        const activeCount = sources.filter(s => s.stage === 'Active Source').length;
        const avgQuality = sources.length ? Math.round(sources.reduce((acc, s) => acc + s.qualityScore, 0) / sources.length) : 0;
        const conversionRate = sources.length ? Math.round((activeCount / sources.length) * 100) : 0;

        document.getElementById('kpi-active-count').innerText = activeCount;
        document.getElementById('kpi-avg-quality').innerText = `${avgQuality}%`;
        document.getElementById('kpi-conv-rate').innerText = `${conversionRate}%`;

        // Data Processing for Charts
        const categories = [...new Set(sources.map(s => s.category))];
        const categoryData = categories.map(cat => {
            const catSources = sources.filter(s => s.category === cat);
            const active = catSources.filter(s => s.stage === 'Active Source').length;
            return { category: cat, total: catSources.length, active: active };
        }).sort((a, b) => b.total - a.total).slice(0, 6);

        // Conversion Chart (Grouped Bar)
        const ctxConv = document.getElementById('conversionChart').getContext('2d');
        if (window.convChartInstance) window.convChartInstance.destroy();
        window.convChartInstance = new Chart(ctxConv, {
            type: 'bar',
            data: {
                labels: categoryData.map(d => d.category),
                datasets: [
                    {
                        label: 'Active Sources',
                        data: categoryData.map(d => d.active),
                        backgroundColor: this.colors.gold,
                        borderRadius: 4,
                        barPercentage: 0.6
                    },
                    {
                        label: 'Total Prospects',
                        data: categoryData.map(d => d.total),
                        backgroundColor: '#f1f5f9',
                        borderRadius: 4,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 10, weight: '600' } } },
                    y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { font: { size: 10 } } }
                }
            }
        });

        // Mix Chart (Doughnut)
        const ctxMix = document.getElementById('mixChart').getContext('2d');
        if (window.mixChartInstance) window.mixChartInstance.destroy();
        window.mixChartInstance = new Chart(ctxMix, {
            type: 'doughnut',
            data: {
                labels: categoryData.map(d => d.category),
                datasets: [{
                    data: categoryData.map(d => d.total),
                    backgroundColor: [this.colors.navy, this.colors.gold, this.colors.emerald, '#3b82f6', '#8b5cf6', '#f59e0b'],
                    borderWidth: 4,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 10, weight: '600' }
                        }
                    }
                }
            }
        });
    }
};

// Initialize on script load
DashboardCharts.init();