/**
 * scripts/dashboard-charts.js
 * Campaign Command Center - Outreach Engine Visualizer
 */

(function() {
    const campaigns = [
        { city: 'San Francisco', niche: 'SaaS Founders', progress: [100, 100, 85, 70, 45, 12, 0, 0], active: true },
        { city: 'Austin', niche: 'AI Startups', progress: [100, 90, 40, 10, 0, 0, 0, 0], active: true },
        { city: 'London', niche: 'Fintech', progress: [100, 100, 100, 95, 90, 80, 40, 5], active: true }
    ];

    const stages = ['SRC', 'RES', 'QLF', 'PSN', 'DFT', 'SND', 'FLW', 'ANZ'];

    function initDashboard() {
        const mainCanvas = document.querySelector('.main-canvas');
        if (!mainCanvas) return;

        // Create Dashboard Section
        const dashboardSection = document.createElement('section');
        dashboardSection.className = 'command-center';
        dashboardSection.style.cssText = `
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--glass-border);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        `;
        header.innerHTML = `
            <h2 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2rem; color: var(--text-secondary);">Command Center</h2>
            <div style="display: flex; gap: 10px;">
                <button class="dash-btn" id="scale-all" style="background: transparent; border: 1px solid var(--glass-border); color: var(--text-primary); padding: 4px 12px; font-size: 0.6rem; cursor: pointer; border-radius: 4px; font-family: 'JetBrains Mono';">SCALE ALL</button>
                <button class="dash-btn" id="pause-all" style="background: rgba(255, 50, 50, 0.1); border: 1px solid rgba(255, 50, 50, 0.2); color: #ff5555; padding: 4px 12px; font-size: 0.6rem; cursor: pointer; border-radius: 4px; font-family: 'JetBrains Mono';">PAUSE ALL</button>
            </div>
        `;

        dashboardSection.appendChild(header);

        const listContainer = document.createElement('div');
        listContainer.id = 'campaign-list';
        dashboardSection.appendChild(listContainer);

        // Insert before analytics-strip
        const analyticsStrip = mainCanvas.querySelector('.analytics-strip');
        mainCanvas.insertBefore(dashboardSection, analyticsStrip);

        renderCampaigns();
    }

    function renderCampaigns() {
        const container = document.getElementById('campaign-list');
        container.innerHTML = '';

        campaigns.forEach((camp, index) => {
            const row = document.createElement('div');
            row.style.cssText = `
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--glass-border);
                border-radius: 6px;
                padding: 1rem;
                margin-bottom: 0.75rem;
                display: grid;
                grid-template-columns: 180px 1fr 120px;
                align-items: center;
                gap: 1.5rem;
            `;

            const info = `
                <div>
                    <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-primary);">${camp.city}</div>
                    <div style="font-size: 0.65rem; color: var(--text-secondary); font-family: 'JetBrains Mono';">${camp.niche}</div>
                </div>
            `;

            let progressHtml = `<div style="display: flex; gap: 4px; height: 12px; align-items: flex-end;">`;
            camp.progress.forEach((val, i) => {
                progressHtml += `
                    <div style="flex: 1; background: rgba(255,255,255,0.05); height: 100%; position: relative; border-radius: 2px; overflow: hidden;" title="${stages[i]}: ${val}%">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${val}%; background: ${val === 100 ? 'var(--text-secondary)' : 'var(--accent-color)'}; opacity: ${0.3 + (val/100) * 0.7}; transition: height 1s ease-out;"></div>
                    </div>
                `;
            });
            progressHtml += `</div>`;

            const actions = `
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button onclick="window.toggleCampaign(${index})" style="background: none; border: 1px solid var(--glass-border); color: var(--text-secondary); font-size: 10px; cursor: pointer; padding: 2px 6px; border-radius: 3px;">${camp.active ? 'PAUSE' : 'RESUME'}</button>
                    <button style="background: none; border: 1px solid var(--glass-border); color: var(--text-secondary); font-size: 10px; cursor: pointer; padding: 2px 6px; border-radius: 3px;">EDIT</button>
                </div>
            `;

            row.innerHTML = info + progressHtml + actions;
            container.appendChild(row);
        });
    }

    window.toggleCampaign = function(index) {
        campaigns[index].active = !campaigns[index].active;
        renderCampaigns();
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }

    // Simulate "Real-time" updates
    setInterval(() => {
        campaigns.forEach(camp => {
            if (!camp.active) return;
            camp.progress = camp.progress.map(val => {
                if (val >= 100) return 100;
                if (val === 0) return Math.random() > 0.95 ? 5 : 0;
                return Math.min(100, val + Math.floor(Math.random() * 3));
            });
        });
        renderCampaigns();
    }, 4000);

})();