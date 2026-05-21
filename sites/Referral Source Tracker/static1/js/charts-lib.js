/**
 * Moonshine Capital | Referral Source Tracker
 * js/charts-lib.js
 * Analytics and Visualization logic for the Network Dashboard
 */

const MoonshineCharts = {
    colors: {
        gold: '#d4af37',
        navyDeep: '#020617',
        navyMuted: '#0f172a',
        emerald: '#10b981',
        amber: '#f59e0b',
        slate: '#64748b',
        slateLight: '#e2e8f0'
    },

    /**
     * Aggregates data by category to find average quality scores
     */
    getQualityByCategory: function(sources) {
        const categories = [...new Set(sources.map(s => s.category))];
        return categories.map(cat => {
            const filtered = sources.filter(s => s.category === cat);
            const avg = filtered.reduce((acc, curr) => acc + (curr.qualityScore || 0), 0) / filtered.length;
            return {
                category: cat,
                score: Math.round(avg),
                count: filtered.length
            };
        }).sort((a, b) => b.score - a.score);
    },

    /**
     * Aggregates sources by location for the Heat Map
     */
    getGeographicClusters: function(sources) {
        const locations = {};
        sources.forEach(s => {
            if (!s.location) return;
            const loc = s.location.split(',')[0].trim();
            locations[loc] = (locations[loc] || 0) + 1;
        });
        return Object.entries(locations)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);
    },

    /**
     * Renders Quality vs Category Bar Chart
     */
    renderQualityChart: function(canvasId, sources) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const data = this.getQualityByCategory(sources);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.category),
                datasets: [{
                    label: 'Avg Quality Score',
                    data: data.map(d => d.score),
                    backgroundColor: this.colors.gold,
                    borderRadius: 4,
                    barThickness: 25
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                return `Count: ${data[context.dataIndex].count} sources`;
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: this.colors.slateLight } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    /**
     * Renders Network Growth Line Chart
     */
    renderGrowthChart: function(canvasId, sources) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Mocking growth data based on ID (timestamps) for static demo
        // In real app, this would use a 'createdAt' field
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const growthData = [2, 5, 8, 12, 18, sources.length];

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Partners',
                    data: growthData,
                    borderColor: this.colors.emerald,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: this.colors.emerald,
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: this.colors.slateLight } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    /**
     * Renders Geo Heat Map (Table Representation)
     */
    renderGeoHeatMap: function(containerId, sources) {
        const container = document.getElementById(containerId);
        const clusters = this.getGeographicClusters(sources);
        const maxCount = Math.max(...clusters.map(c => c.count));

        if (clusters.length === 0) {
            container.innerHTML = '<p class="text-slate-400 text-sm italic">No location data available.</p>';
            return;
        }

        let html = '<div class="space-y-3">';
        clusters.forEach(c => {
            const percentage = (c.count / maxCount) * 100;
            html += `
                <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                        <span class="text-slate-700">${c.city}</span>
                        <span class="text-slate-500">${c.count} Sources</span>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div class="bg-navy-muted h-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Updates the entire dashboard
     */
    refreshDashboard: function(sources) {
        // Destroy existing charts if they exist to prevent hover glitches
        if (window.qChartInst) window.qChartInst.destroy();
        if (window.gChartInst) window.gChartInst.destroy();

        if (document.getElementById('qualityChart')) {
            window.qChartInst = this.renderQualityChart('qualityChart', sources);
        }
        if (document.getElementById('growthChart')) {
            window.gChartInst = this.renderGrowthChart('growthChart', sources);
        }
        if (document.getElementById('geoHeatMap')) {
            this.renderGeoHeatMap('geoHeatMap', sources);
        }
    }
};

// Initialize if on high-level view (assuming main script calls this)
window.MoonshineCharts = MoonshineCharts;