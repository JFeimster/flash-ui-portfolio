/**
 * Moonshine Capital | Affiliate Performance Dashboard Logic
 * Handles real-time stats, neon-accented charts, and activity logs.
 */

const DashboardCharts = (() => {
    // Theme Colors from Base Component
    const COLORS = {
        blue: '#00f2ff',
        green: '#00ff9d',
        textMain: '#e6edf3',
        textDim: '#8b949e',
        border: '#30363d',
        bgCard: '#0d1117',
        glowBlue: 'rgba(0, 242, 255, 0.2)',
        glowGreen: 'rgba(0, 255, 157, 0.2)'
    };

    // Mock Data for the dashboard
    const mockPerformanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        impressions: [1200, 1900, 1700, 2100, 2800, 3200, 3100],
        conversions: [45, 52, 48, 70, 85, 92, 88]
    };

    const recentActivity = [
        { site: 'fintech-blog.io', action: 'Impression', time: '2m ago', status: 'verified' },
        { site: 'startup-directory.com', action: 'CTA Click', time: '15m ago', status: 'verified' },
        { site: 'local-biz-funding.net', action: 'Impression', time: '1h ago', status: 'verified' },
        { site: 'fintech-blog.io', action: 'Application Start', time: '3h ago', status: 'flagged' },
        { site: 'partner-portal.internal', action: 'Impression', time: '5h ago', status: 'verified' }
    ];

    /**
     * Initialize all dashboard charts
     * Assumes Chart.js is loaded in the global scope
     */
    const init = () => {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not found. Performance charts require Chart.js.');
            return;
        }

        setupChartDefaults();
        renderMainPerformanceChart();
        renderActivityLog();
    };

    const setupChartDefaults = () => {
        Chart.defaults.color = COLORS.textDim;
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.plugins.tooltip.backgroundColor = COLORS.bgCard;
        Chart.defaults.plugins.tooltip.borderColor = COLORS.border;
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.titleColor = COLORS.blue;
    };

    const renderMainPerformanceChart = () => {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;

        // Create Gradients
        const blueGradient = ctx.createLinearGradient(0, 0, 0, 400);
        blueGradient.addColorStop(0, COLORS.glowBlue);
        blueGradient.addColorStop(1, 'transparent');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: mockPerformanceData.labels,
                datasets: [
                    {
                        label: 'Impressions',
                        data: mockPerformanceData.impressions,
                        borderColor: COLORS.blue,
                        backgroundColor: blueGradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: COLORS.blue,
                        pointBorderColor: COLORS.bgCard,
                        pointHoverRadius: 6,
                        shadowBlur: 10,
                        shadowColor: COLORS.blue
                    },
                    {
                        label: 'Conversions',
                        data: mockPerformanceData.conversions.map(v => v * 20), // Scaled for visual balance
                        borderColor: COLORS.green,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        borderDash: [5, 5],
                        pointBackgroundColor: COLORS.green,
                        pointBorderColor: COLORS.bgCard
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: { usePointStyle: true, boxWidth: 6 }
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: { 
                        grid: { color: COLORS.border }, 
                        border: { display: false },
                        ticks: { stepSize: 1000 }
                    }
                }
            }
        });
    };

    const renderActivityLog = () => {
        const container = document.getElementById('activityLogContainer');
        if (!container) return;

        const html = recentActivity.map(activity => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid ${COLORS.border}; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${activity.status === 'verified' ? COLORS.green : '#ff4757'}; box-shadow: 0 0 8px ${activity.status === 'verified' ? COLORS.green : '#ff4757'}"></div>
                    <div>
                        <div style="color: ${COLORS.textMain}; font-weight: 500;">${activity.site}</div>
                        <div style="color: ${COLORS.textDim}; font-size: 0.75rem;">${activity.action}</div>
                    </div>
                </div>
                <div style="color: ${COLORS.textDim}; font-family: 'Fira Code', monospace; font-size: 0.7rem;">
                    ${activity.time}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    };

    return { init };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', DashboardCharts.init);