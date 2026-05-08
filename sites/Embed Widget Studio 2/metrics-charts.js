/**
 * metrics-charts.js
 * Moonshine Capital Affiliate Dashboard Analytics
 * Handles real-time performance visualization and metric updates.
 */

class AffiliateDashboard {
    constructor() {
        this.colors = {
            blue: '#00f2ff',
            green: '#39ff14',
            border: '#30363d',
            text: '#e6edf3',
            textDim: '#8b949e',
            grid: 'rgba(48, 54, 61, 0.3)'
        };
        
        this.data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            impressions: [1200, 1900, 1500, 2100, 2800, 3200, 3100],
            clicks: [45, 82, 61, 95, 130, 158, 142],
            leads: [4, 8, 5, 11, 14, 19, 15]
        };
    }

    init() {
        this.renderPerformanceChart();
        this.renderConversionDonut();
        this.animateCounters();
    }

    renderPerformanceChart() {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;

        // Gradient for the line
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.labels,
                datasets: [{
                    label: 'Widget Impressions',
                    data: this.data.impressions,
                    borderColor: this.colors.blue,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.blue,
                    pointBorderColor: '#05070a',
                    pointHoverRadius: 6
                }, {
                    label: 'Clicks',
                    data: this.data.clicks.map(v => v * 10), // Scaled for visibility
                    borderColor: this.colors.green,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.green,
                    pointBorderColor: '#05070a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: this.colors.textDim, font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: '#0d1117',
                        titleColor: this.colors.blue,
                        bodyColor: this.colors.text,
                        borderColor: this.colors.border,
                        borderWidth: 1,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: { color: this.colors.grid },
                        ticks: { color: this.colors.textDim }
                    },
                    y: {
                        grid: { color: this.colors.grid },
                        ticks: { color: this.colors.textDim }
                    }
                }
            }
        });
    }

    renderConversionDonut() {
        const ctx = document.getElementById('conversionChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Leads', 'In Progress', 'Declined'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        this.colors.green,
                        this.colors.blue,
                        '#30363d'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: this.colors.textDim, usePointStyle: true }
                    }
                }
            }
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.metric-value');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isCurrency = counter.innerText.includes('$');
            let count = 0;
            const increment = target / 50;
            
            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = isCurrency 
                        ? `$${Math.floor(count).toLocaleString()}` 
                        : Math.floor(count).toLocaleString();
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = isCurrency 
                        ? `$${target.toLocaleString()}` 
                        : target.toLocaleString();
                }
            };
            updateCount();
        });
    }

    /**
     * Updates the lead activity feed with mock data
     */
    updateActivityFeed() {
        const feed = document.getElementById('recentActivity');
        if (!feed) return;

        const activities = [
            { id: 'LD-882', partner: 'Acme Corp', status: 'Approved', amount: '$450.00' },
            { id: 'LD-881', partner: 'Global SaaS', status: 'Pending', amount: '--' },
            { id: 'LD-880', partner: 'Acme Corp', status: 'Approved', amount: '$120.00' }
        ];

        feed.innerHTML = activities.map(act => `
            <div style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.85rem; font-weight: 600;">Lead ${act.id}</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">${act.partner}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.85rem; color: ${act.status === 'Approved' ? 'var(--accent-green)' : 'var(--accent-blue)'};">${act.status}</div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-dim);">${act.amount}</div>
                </div>
            </div>
        `).join('');
    }
}

// Global initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // If Chart.js isn't loaded via CDN, this will fail gracefully
    if (typeof Chart !== 'undefined') {
        const dashboard = new AffiliateDashboard();
        dashboard.init();
        dashboard.updateActivityFeed();
    } else {
        console.warn('Moonshine Capital Dashboard: Chart.js library not detected.');
    }
});