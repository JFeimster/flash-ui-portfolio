/**
 * Moonshine Capital Affiliate Performance Dashboard
 * Handles real-time stats, charting, and activity logs.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Theme Colors (Matching CSS Variables)
    const colors = {
        blue: '#00f2ff',
        green: '#00ff9d',
        dim: '#8b949e',
        border: '#30363d',
        card: '#0d1117'
    };

    // Initialize Performance Chart
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
                datasets: [
                    {
                        label: 'Impressions',
                        data: [120, 450, 890, 1200, 980, 1500, 1842],
                        borderColor: colors.blue,
                        backgroundColor: 'rgba(0, 242, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: colors.blue
                    },
                    {
                        label: 'Clicks',
                        data: [12, 48, 92, 140, 110, 185, 212],
                        borderColor: colors.green,
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: colors.green
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.text,
                            font: { family: 'Inter', size: 12 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(48, 54, 61, 0.5)' },
                        ticks: { color: colors.dim }
                    },
                    y: {
                        grid: { color: 'rgba(48, 54, 61, 0.5)' },
                        ticks: { color: colors.dim }
                    }
                }
            }
        });
    }

    // Mock Real-time Activity Log
    const activityList = document.getElementById('activityLog');
    const sites = [
        'fintech-insider.io',
        'startup-hub.com',
        'agency-growth-daily.net',
        'saas-tools.co',
        'local-business-portal.com',
        'capital-match-blog.uk'
    ];

    const actions = [
        'Widget Loaded',
        'Apply Clicked',
        'Readiness Check Completed',
        'Route Matcher Started'
    ];

    function addActivityEntry() {
        if (!activityList) return;

        const site = sites[Math.floor(Math.random() * sites.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const entry = document.createElement('div');
        entry.className = 'recent-item';
        entry.style.display = 'flex';
        entry.style.justifyContent = 'space-between';
        entry.style.alignItems = 'center';
        entry.style.padding = '0.75rem';
        entry.style.borderBottom = `1px solid ${colors.border}`;
        entry.style.opacity = '0';
        entry.style.transition = 'opacity 0.5s ease-in';

        entry.innerHTML = `
            <div>
                <span style="color: ${colors.green}; font-family: 'Fira Code'; font-size: 0.7rem;">[${time}]</span>
                <span style="color: #e6edf3; margin-left: 10px;">${site}</span>
            </div>
            <div style="font-size: 0.7rem; color: ${colors.dim}; text-transform: uppercase; letter-spacing: 0.5px;">
                ${action}
            </div>
        `;

        activityList.prepend(entry);
        
        // Remove old items to keep list clean
        if (activityList.children.length > 8) {
            activityList.removeChild(activityList.lastChild);
        }

        setTimeout(() => entry.style.opacity = '1', 50);
    }

    // Simulation Interval
    setInterval(addActivityEntry, 4000);
    addActivityEntry();
    addActivityEntry();
    addActivityEntry();

    // Stats Pulse Effect
    function updateCounter(id, delta) {
        const el = document.getElementById(id);
        if (!el) return;
        let val = parseInt(el.innerText.replace(/[^0-9]/g, ''));
        val += delta;
        
        if (id === 'fundingVolume') {
            el.innerText = '$' + val.toLocaleString();
        } else if (id === 'ctrPercent') {
            el.innerText = (val / 10).toFixed(1) + '%';
        } else {
            el.innerText = val.toLocaleString();
        }
    }

    setInterval(() => {
        const rand = Math.random();
        if (rand > 0.7) updateCounter('impressionCount', 1);
        if (rand > 0.95) updateCounter('fundingVolume', 2500);
    }, 2000);
});

/**
 * HTML structure requirement for this JS:
 * <canvas id="performanceChart"></canvas>
 * <div id="activityLog"></div>
 * <span id="impressionCount">1,842</span>
 * <span id="fundingVolume">$142,500</span>
 * <span id="ctrPercent">11.5%</span>
 */