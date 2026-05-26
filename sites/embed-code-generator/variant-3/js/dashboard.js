const DashboardData = {
    metrics: {
        impressions: 42890,
        clicks: 1243,
        conversions: 58,
        commissions: 14500.25,
        ctr: "2.9%"
    },
    topWidgets: [
        { name: "Funding Readiness", type: "score", impressions: 12400, conversions: 24, earned: 6000 },
        { name: "Application CTA", type: "cta", impressions: 8900, conversions: 18, earned: 4500 },
        { name: "Route Matcher", type: "matcher", impressions: 15200, conversions: 12, earned: 3000 },
        { name: "Comm. Estimator", type: "calc", impressions: 6390, conversions: 4, earned: 1000.25 }
    ],
    chartData: [45, 52, 48, 70, 65, 85, 92, 88, 105, 110, 95, 120]
};

function initDashboard() {
    updateMetricCards();
    renderPerformanceChart();
    renderTopWidgets();
    setupTimeFilters();
    animateValue("total-impressions", 0, DashboardData.metrics.impressions, 1500);
    animateValue("total-commissions", 0, DashboardData.metrics.commissions, 2000, true);
}

function updateMetricCards() {
    const ctrEl = document.getElementById('ctr-display');
    const convEl = document.getElementById('conversions-display');
    if (ctrEl) ctrEl.innerText = DashboardData.metrics.ctr;
    if (convEl) convEl.innerText = DashboardData.metrics.conversions;
}

function renderPerformanceChart() {
    const chartContainer = document.getElementById('performance-chart');
    if (!chartContainer) return;

    const maxVal = Math.max(...DashboardData.chartData);
    const height = 200;
    const width = chartContainer.clientWidth;
    const padding = 20;
    const points = DashboardData.chartData.map((val, i) => {
        const x = (i / (DashboardData.chartData.length - 1)) * (width - (padding * 2)) + padding;
        const y = height - ((val / maxVal) * (height - (padding * 2))) - padding;
        return `${x},${y}`;
    }).join(' ');

    chartContainer.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: ${height}px;">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--neon-blue)" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="var(--neon-blue)" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polyline 
                fill="none" 
                stroke="var(--neon-blue)" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                points="${points}"
                style="filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));"
            />
            <path 
                d="M ${padding},${height} L ${points} L ${width - padding},${height} Z" 
                fill="url(#chartGradient)"
            />
        </svg>
    `;
}

function renderTopWidgets() {
    const listContainer = document.getElementById('top-widgets-list');
    if (!listContainer) return;

    listContainer.innerHTML = DashboardData.topWidgets.map(widget => `
        <div class="history-item animate" style="padding: 1rem 0;">
            <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600; color: var(--text-primary);">${widget.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Type: ${widget.type}</span>
            </div>
            <div style="text-align: right;">
                <div style="color: var(--neon-green); font-family: 'JetBrains Mono'; font-size: 0.9rem;">
                    $${widget.earned.toLocaleString()}
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">
                    ${widget.impressions.toLocaleString()} views
                </div>
            </div>
        </div>
    `).join('');
}

function animateValue(id, start, end, duration, isCurrency = false) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        
        if (isCurrency) {
            obj.innerHTML = '$' + current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } else {
            obj.innerHTML = Math.floor(current).toLocaleString();
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function setupTimeFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // Logic to fetch new data would go here
            initDashboard(); 
        });
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);
window.addEventListener('resize', renderPerformanceChart);