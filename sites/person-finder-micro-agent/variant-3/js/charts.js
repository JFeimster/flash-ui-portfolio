/**
 * Prism Scan | Analytics & Reporting Logic
 * Associated with the Person-Finder Micro-Agent Dashboard
 */

const PrismDashboard = (() => {
    const THEME = {
        cyan: '#00f2ff',
        magenta: '#ff00ea',
        lime: '#bcff00',
        text: '#e0e6ed',
        textDim: '#7a869a',
        bg: '#05070a',
        fontMono: "'JetBrains Mono', monospace",
        fontSans: "'Inter', sans-serif"
    };

    const mockData = {
        successRate: 84.7,
        roles: [
            { label: 'Director/VP', count: 42, color: THEME.cyan },
            { label: 'Founder/CEO', count: 28, color: THEME.magenta },
            { label: 'Operations Lead', count: 35, color: THEME.lime },
            { label: 'HR/People Ops', count: 19, color: '#ffffff' }
        ],
        recentLookups: [
            { name: 'Marcus Thorne', role: 'Chief Technical Officer', entity: 'Neural-Sync Systems', time: '2m ago', status: 'verified' },
            { name: 'Elena Rodriguez', role: 'Head of Logistics', entity: 'Vanguard Freight', time: '14m ago', status: 'verified' },
            { name: 'Sarah Jenkins', role: 'Director of Operations', entity: 'Acme Dynamics', time: '1h ago', status: 'verified' },
            { name: 'Julian Vane', role: 'Managing Partner', entity: 'Blackwood Capital', time: '3h ago', status: 'partial' }
        ]
    };

    const initSuccessChart = (canvasId) => {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        // Custom gauge-style visualization using Chart.js if available or Canvas API
        if (window.Chart) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [mockData.successRate, 100 - mockData.successRate],
                        backgroundColor: [THEME.cyan, 'rgba(255,255,255,0.05)'],
                        borderWidth: 0,
                        circumference: 270,
                        rotation: 225
                    }]
                },
                options: {
                    cutout: '85%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } }
                }
            });
        }
    };

    const initRolesChart = (canvasId) => {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx || !window.Chart) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mockData.roles.map(r => r.label),
                datasets: [{
                    label: 'Profiles Found',
                    data: mockData.roles.map(r => r.count),
                    backgroundColor: mockData.roles.map(r => r.color),
                    borderColor: 'transparent',
                    barThickness: 12
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: THEME.textDim, font: { family: THEME.fontMono, size: 10 } }
                    },
                    y: { 
                        grid: { display: false },
                        ticks: { color: THEME.text, font: { family: THEME.fontMono, size: 10 } }
                    }
                }
            }
        });
    };

    const populateActivityFeed = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = mockData.recentLookups.map(item => `
            <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 13px; font-weight: 600; color: ${THEME.text}">${item.name}</div>
                    <div style="font-size: 11px; color: ${THEME.textDim}">${item.role} • ${item.entity}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-family: ${THEME.fontMono}; font-size: 10px; color: ${item.status === 'verified' ? THEME.lime : THEME.magenta}">[${item.status.toUpperCase()}]</div>
                    <div style="font-size: 10px; color: ${THEME.textDim}">${item.time}</div>
                </div>
            </div>
        `).join('');
    };

    const animateCounters = () => {
        const elements = document.querySelectorAll('[data-prism-counter]');
        elements.forEach(el => {
            const target = parseFloat(el.getAttribute('data-prism-counter'));
            let current = 0;
            const step = target / 50;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.innerText = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    el.innerText = Math.floor(current).toLocaleString();
                }
            }, 20);
        });
    };

    return {
        init: () => {
            initSuccessChart('successChart');
            initRolesChart('rolesChart');
            populateActivityFeed('activityFeed');
            animateCounters();
            console.log("Prism Analytics Engine Online");
        }
    };
})();

// Initialize on Load
document.addEventListener('DOMContentLoaded', PrismDashboard.init);