document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.querySelector('.main-canvas');
    const analyticsStrip = document.querySelector('.analytics-strip');
    const executeBtn = document.querySelector('.btn-execute');
    const stepCards = document.querySelectorAll('.step-card');

    // Campaign Data Store
    let campaigns = [
        { id: 'SF-AI-01', city: 'San Francisco', niche: 'SaaS Founders', progress: 65, status: 'Active', volume: 150 },
        { id: 'TX-WEB-02', city: 'Austin', niche: 'B2B Agencies', progress: 32, status: 'Active', volume: 85 }
    ];

    // Create Dashboard Container
    const dashboardSection = document.createElement('section');
    dashboardSection.className = 'command-center';
    dashboardSection.style.cssText = `
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
    `;

    const dashboardHeader = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15rem; color: var(--text-secondary);">Campaign Command Center</h2>
            <div style="display: flex; gap: 10px;">
                <button id="scale-up" style="background: transparent; border: 1px solid var(--glass-border); color: var(--text-primary); padding: 4px 10px; border-radius: 4px; font-size: 0.65rem; cursor: pointer;">SCALE ALL</button>
                <button id="pause-all" style="background: transparent; border: 1px solid #ff444455; color: #ff8888; padding: 4px 10px; border-radius: 4px; font-size: 0.65rem; cursor: pointer;">HALT ENGINE</button>
            </div>
        </div>
        <div id="campaign-list"></div>
    `;

    dashboardSection.innerHTML = dashboardHeader;
    mainCanvas.insertBefore(dashboardSection, analyticsStrip);

    const renderCampaigns = () => {
        const list = document.getElementById('campaign-list');
        list.innerHTML = campaigns.map(campaign => `
            <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.03);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: var(--accent-color);">${campaign.id}</span>
                        <span style="font-size: 0.8rem; margin-left: 10px;">${campaign.city} • ${campaign.niche}</span>
                    </div>
                    <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">${campaign.status} — ${campaign.volume} / DAY</span>
                </div>
                <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; display: flex; gap: 2px;">
                    <div style="width: ${campaign.progress}%; background: #ffffff; transition: width 1s ease;"></div>
                    <div style="width: ${100 - campaign.progress}%; background: rgba(255,255,255,0.1);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                    <div style="display: flex; gap: 15px;">
                        <span style="font-size: 0.6rem; color: ${campaign.progress > 20 ? 'var(--text-primary)' : 'var(--text-secondary)'}">Research</span>
                        <span style="font-size: 0.6rem; color: ${campaign.progress > 40 ? 'var(--text-primary)' : 'var(--text-secondary)'}">Qualify</span>
                        <span style="font-size: 0.6rem; color: ${campaign.progress > 70 ? 'var(--text-primary)' : 'var(--text-secondary)'}">Outbound</span>
                    </div>
                    <button class="toggle-btn" data-id="${campaign.id}" style="background: none; border: none; color: var(--text-secondary); font-family: 'JetBrains Mono'; font-size: 0.6rem; cursor: pointer; text-decoration: underline;">[ TOGGLE STATE ]</button>
                </div>
            </div>
        `).join('');

        // Re-attach listeners
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                campaigns = campaigns.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c);
                renderCampaigns();
            };
        });
    };

    renderCampaigns();

    // Interaction Logic
    executeBtn.addEventListener('click', () => {
        let currentStep = 0;
        executeBtn.innerText = "Processing Pipeline...";
        executeBtn.style.opacity = "0.5";
        executeBtn.disabled = true;

        const interval = setInterval(() => {
            stepCards.forEach(c => c.classList.remove('active'));
            if (currentStep < stepCards.length) {
                stepCards[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(interval);
                executeBtn.innerText = "Initialize Engine";
                executeBtn.style.opacity = "1";
                executeBtn.disabled = false;
                
                // Add new mock campaign on completion
                const newId = `ID-${Math.floor(Math.random()*999)}`;
                campaigns.push({
                    id: newId,
                    city: document.querySelector('input[placeholder*="San Francisco"]').value || 'Remote',
                    niche: document.querySelector('input[placeholder*="SaaS Founders"]').value || 'General',
                    progress: 10,
                    status: 'Active',
                    volume: 50
                });
                renderCampaigns();
            }
        }, 800);
    });

    document.getElementById('pause-all').onclick = () => {
        campaigns = campaigns.map(c => ({ ...c, status: 'Paused' }));
        renderCampaigns();
    };

    document.getElementById('scale-up').onclick = () => {
        campaigns = campaigns.map(c => ({ ...c, volume: c.volume + 25 }));
        renderCampaigns();
    };
});