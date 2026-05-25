/**
 * Moonshine Capital | Affiliate Dashboard Charts
 * Theme-aware data visualizations for partner performance tracking.
 */

const MOONSHINE_THEME = {
    blue: '#00f2ff',
    green: '#00ff9d',
    textMain: '#e6edf3',
    textDim: '#8b949e',
    border: '#30363d',
    bgCard: '#0d1117',
    fontSans: "'Inter', sans-serif"
};

// Global Chart.js Defaults
if (window.Chart) {
    Chart.defaults.color = MOONSHINE_THEME.textDim;
    Chart.defaults.font.family = MOONSHINE_THEME.fontSans;
    Chart.defaults.borderColor = MOONSHINE_THEME.border;
}

/**
 * Initialize all dashboard charts
 */
const initDashboardCharts = () => {
    renderTrafficChart();
    renderConversionFunnel();
    renderWidgetPerformance();
};

/**
 * Line Chart: Impressions vs Clicks over time
 */
function renderTrafficChart() {
    const ctx = document.getElementById('trafficTrendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun 01', 'Jun 05', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30'],
            datasets: [
                {
                    label: 'Impressions',
                    data: [4200, 5100, 4800, 7200, 6800, 9100, 10500],
                    borderColor: MOONSHINE_THEME.blue,
                    backgroundColor: 'rgba(0, 242, 255, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: MOONSHINE_THEME.blue
                },
                {
                    label: 'Clicks',
                    data: [840, 1020, 960, 1440, 1360, 1820, 2100],
                    borderColor: MOONSHINE_THEME.green,
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { boxWidth: 10, usePointStyle: true, color: MOONSHINE_THEME.textMain }
                },
                tooltip: {
                    backgroundColor: MOONSHINE_THEME.bgCard,
                    titleColor: MOONSHINE_THEME.blue,
                    bodyColor: MOONSHINE_THEME.textMain,
                    borderColor: MOONSHINE_THEME.border,
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: MOONSHINE_THEME.border },
                    ticks: { padding: 10 }
                },
                x: {
                    grid: { display: false },
                    ticks: { padding: 10 }
                }
            }
        }
    });
}

/**
 * Doughnut Chart: Conversion Funnel Breakdown
 */
function renderConversionFunnel() {
    const ctx = document.getElementById('conversionFunnelChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed Leads', 'In-Progress', 'Drop-offs'],
            datasets: [{
                data: [35, 45, 20],
                backgroundColor: [
                    MOONSHINE_THEME.green,
                    MOONSHINE_THEME.blue,
                    '#21262d'
                ],
                borderColor: MOONSHINE_THEME.bgCard,
                borderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: MOONSHINE_THEME.textDim, padding: 20 }
                }
            }
        }
    });
}

/**
 * Horizontal Bar Chart: Leads per Widget Type
 */
function renderWidgetPerformance() {
    const ctx = document.getElementById('widgetLeadsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Readiness Score', 'Route Matcher', 'Checklist', 'CTA Button'],
            datasets: [{
                label: 'Leads Generated',
                data: [128, 94, 45, 202],
                backgroundColor: 'rgba(0, 242, 255, 0.2)',
                borderColor: MOONSHINE_THEME.blue,
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: MOONSHINE_THEME.blue
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: MOONSHINE_THEME.border },
                    ticks: { color: MOONSHINE_THEME.textDim }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: MOONSHINE_THEME.textMain }
                }
            }
        }
    });
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded, otherwise wait or handle error
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initDashboardCharts;
        document.head.appendChild(script);
    } else {
        initDashboardCharts();
    }
});

/**
 * Utility: Update real-time metric counters with animation
 */
function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = Math.round(target).toLocaleString();
            clearInterval(timer);
        } else {
            el.innerText = Math.round(current).toLocaleString();
        }
    }, 20);
}

// Export functions for manual refresh
window.refreshDashboardCharts = initDashboardCharts;
window.animateDashboardStats = () => {
    animateCounter('stat-impressions', 48290);
    animateCounter('stat-clicks', 12402);
    animateCounter('stat-conversions', 1142);
};