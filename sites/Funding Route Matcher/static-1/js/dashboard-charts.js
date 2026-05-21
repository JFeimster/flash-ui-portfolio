/**
 * Moonshine Capital Affiliate Dashboard
 * Analytics Engine v2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboardCharts();
});

function initDashboardCharts() {
    // Shared configurations for Chart.js
    const fontStack = "'Inter', sans-serif";
    const monoStack = "'JetBrains Mono', monospace";
    const gridColor = '#1f222c';
    const textMuted = '#8a8f9d';
    const electricBlue = '#00f2ff';
    const neonGreen = '#39ff14';

    Chart.defaults.color = textMuted;
    Chart.defaults.font.family = fontStack;
    Chart.defaults.plugins.tooltip.backgroundColor = '#111318';
    Chart.defaults.plugins.tooltip.borderColor = '#1f222c';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600', family: fontStack };
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    // 1. Traffic vs Conversion Chart (Line)
    const trafficCtx = document.getElementById('trafficConversionChart')?.getContext('2d');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Impressions',
                        data: [420, 580, 510, 790, 820, 610, 450],
                        borderColor: electricBlue,
                        backgroundColor: 'rgba(0, 242, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Conversions',
                        data: [22, 35, 29, 48, 52, 31, 24],
                        borderColor: neonGreen,
                        backgroundColor: 'rgba(57, 255, 20, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6
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
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10, family: monoStack } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { font: { size: 10, family: monoStack } }
                    }
                }
            }
        });
    }

    // 2. Funding Route Distribution (Horizontal Bar)
    const routeCtx = document.getElementById('routeDistributionChart')?.getContext('2d');
    if (routeCtx) {
        new Chart(routeCtx, {
            type: 'bar',
            data: {
                labels: ['Working Capital', 'Real Estate', 'Equipment', 'E-commerce', 'Micro-Funding'],
                datasets: [{
                    data: [45, 28, 15, 32, 10],
                    backgroundColor: [
                        'rgba(0, 242, 255, 0.8)',
                        'rgba(57, 255, 20, 0.8)',
                        '#1f222c',
                        'rgba(0, 242, 255, 0.5)',
                        '#8a8f9d'
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 20
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
                        grid: { color: gridColor },
                        ticks: { font: { size: 10, family: monoStack } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { 
                            font: { size: 11, weight: '500' },
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    // 3. Lead Quality breakdown (Donut)
    const qualityCtx = document.getElementById('leadQualityChart')?.getContext('2d');
    if (qualityCtx) {
        new Chart(qualityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Tier 1 (High)', 'Tier 2 (Mid)', 'Tier 3 (Nurture)'],
                datasets: [{
                    data: [35, 45, 20],
                    backgroundColor: [
                        neonGreen,
                        electricBlue,
                        '#1f222c'
                    ],
                    borderWidth: 0,
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
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Utility to refresh dashboard data for specific partner_id
 * @param {string} partnerId 
 */
function refreshAffiliateStats(partnerId) {
    console.log(`Fetching real-time metrics for: ${partnerId}`);
    const metricsCards = document.querySelectorAll('.metric-value');
    
    // UI Loading state simulation
    metricsCards.forEach(card => card.style.opacity = '0.5');
    
    setTimeout(() => {
        metricsCards.forEach(card => card.style.opacity = '1');
        // Logic to update innerText based on fetched data would go here
    }, 800);
}

// Hook into the existing "Copy Result" logic to log affiliate events
const originalCopyResult = window.copyResult;
window.copyResult = function() {
    if (typeof originalCopyResult === 'function') {
        originalCopyResult();
        const partnerId = document.querySelector('input[name="partner_id"]')?.value || 'UNKNOWN';
        console.log(`[Affiliate Analytics] Clip-copy event tracked for Partner: ${partnerId}`);
    }
};