const WorkflowConfig = {
    settings: {
        maxFollowUps: 4,
        defaultIntervals: [3, 7, 14, 30],
        integrations: [
            { id: 'gmail', name: 'Gmail API', status: 'connected', latency: '42ms' },
            { id: 'make', name: 'Make.com Webhook', status: 'connected', latency: '124ms' },
            { id: 'notion', name: 'Notion CRM', status: 'connected', latency: '310ms' },
            { id: 'appsscript', name: 'Apps Script Hook', status: 'degraded', latency: '1200ms' }
        ]
    },

    init() {
        console.log("Initializing Workflow Automation Mapper...");
        this.renderAutomationUI();
        this.startHealthMonitor();
        this.bindEvents();
    },

    renderAutomationUI() {
        const container = document.querySelector('.main-canvas');
        if (!container) return;

        // Create the Mapping Section
        const mappingSection = document.createElement('section');
        mappingSection.className = 'automation-mapper';
        mappingSection.style.marginTop = '2rem';
        mappingSection.style.padding = '1.5rem';
        mappingSection.style.border = '1px solid var(--glass-border)';
        mappingSection.style.borderRadius = '8px';
        mappingSection.style.background = 'rgba(255, 255, 255, 0.01)';

        mappingSection.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1rem; color: var(--text-primary);">Sequence Logic & Trigger Health</h2>
                <div id="sync-indicator" style="font-size: 0.65rem; font-family: 'JetBrains Mono'; color: var(--text-secondary);">
                    LAST SYNC: ${new Date().toLocaleTimeString()}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Sequence Mapping -->
                <div class="sequence-intervals">
                    <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 1rem;">Outreach Cadence (Days)</label>
                    <div style="display: flex; gap: 10px;">
                        ${this.settings.defaultIntervals.map((days, i) => `
                            <div style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); padding: 10px; border-radius: 4px; text-align: center;">
                                <span style="display: block; font-size: 0.6rem; color: var(--text-secondary); margin-bottom: 4px;">FUP ${i + 1}</span>
                                <input type="number" value="${days}" style="width: 100%; background: transparent; border: none; color: var(--accent-color); text-align: center; font-family: 'JetBrains Mono'; font-size: 1rem;" />
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Integration Health -->
                <div class="integration-health">
                    <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 1rem;">System Health</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${this.settings.integrations.map(integration => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 4px; border: 1px solid var(--glass-border);">
                                <div style="display: flex; align-items: center;">
                                    <div style="width: 6px; height: 6px; border-radius: 50%; margin-right: 10px; background: ${integration.status === 'connected' ? '#4ade80' : '#fbbf24'};"></div>
                                    <span style="font-size: 0.75rem; font-family: 'JetBrains Mono';">${integration.name}</span>
                                </div>
                                <span style="font-size: 0.65rem; color: var(--text-secondary);">${integration.latency}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Webhook/Notion Mapping -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <div>
                    <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 0.5rem;">Apps Script Trigger Endpoint</label>
                    <input type="text" readonly value="https://script.google.com/macros/s/AKfycb...X92/exec" 
                           style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); padding: 8px; color: var(--text-secondary); font-family: 'JetBrains Mono'; font-size: 0.7rem; border-radius: 4px; outline: none;" />
                </div>
                <div>
                    <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 0.5rem;">Lead Routing</label>
                    <select style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); padding: 8px; color: var(--text-primary); font-size: 0.75rem; border-radius: 4px; outline: none;">
                        <option>Notion Master Database</option>
                        <option>Gmail Drafts Only</option>
                        <option>Make.com Custom Hook</option>
                    </select>
                </div>
            </div>
        `;

        container.appendChild(mappingSection);
    },

    startHealthMonitor() {
        setInterval(() => {
            const syncIndicator = document.getElementById('sync-indicator');
            if (syncIndicator) {
                syncIndicator.innerText = `LAST SYNC: ${new Date().toLocaleTimeString()}`;
                syncIndicator.style.color = '#4ade80';
                setTimeout(() => {
                    syncIndicator.style.color = 'var(--text-secondary)';
                }, 1000);
            }
        }, 15000);
    },

    bindEvents() {
        const executeBtn = document.querySelector('.btn-execute');
        if (executeBtn) {
            executeBtn.addEventListener('click', () => {
                console.log("Saving workflow configuration and initializing engine...");
                executeBtn.innerText = "Deploying Hooks...";
                executeBtn.style.opacity = "0.7";
                
                setTimeout(() => {
                    executeBtn.innerText = "Engine Active";
                    executeBtn.style.background = "#4ade80";
                    executeBtn.style.color = "#000";
                }, 1500);
            });
        }
    }
};

// Auto-initialize on load
window.addEventListener('DOMContentLoaded', () => WorkflowConfig.init());