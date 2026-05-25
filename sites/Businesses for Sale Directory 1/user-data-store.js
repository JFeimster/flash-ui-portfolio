/**
 * EQUITY.TERMINAL | USER DATA STORE & WAR ROOM ENGINE
 * Provides state management and UI rendering for the Buyer Dashboard.
 */

const UserDataStore = {
    // Pipeline configuration
    stages: [
        { id: 'review', label: 'INITIAL REVIEW', color: 'var(--bone)' },
        { id: 'diligence', label: 'DUE DILIGENCE', color: 'var(--oxidized-copper)' },
        { id: 'loi', label: 'LOI SENT', color: 'var(--copper-glow)' },
        { id: 'closed', label: 'CLOSED/ACQUIRED', color: 'var(--acid-green)' }
    ],

    // Storage Keys
    STORAGE_KEY: 'equity_terminal_war_room',

    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.seedInitialData();
        }
        this.injectStyles();
    },

    seedInitialData() {
        const seed = [
            { id: 1, stage: 'review', notes: 'Reviewing tax returns.', lastContact: '2023-10-24' },
            { id: 4, stage: 'diligence', notes: 'Quality of Earnings in progress.', lastContact: '2023-10-25' },
            { id: 8, stage: 'loi', notes: 'Waiting for seller signature.', lastContact: '2023-10-26' }
        ];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed));
    },

    getPipelineData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    },

    updateDealStage(dealId, newStage) {
        let data = this.getPipelineData();
        const index = data.findIndex(d => d.id === dealId);
        if (index > -1) {
            data[index].stage = newStage;
        } else {
            data.push({ id: dealId, stage: newStage, notes: '', lastContact: new Date().toISOString().split('T')[0] });
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.renderWarRoom();
    },

    injectStyles() {
        if (document.getElementById('war-room-styles')) return;
        const style = document.createElement('style');
        style.id = 'war-room-styles';
        style.textContent = `
            #warRoomRoot {
                background: var(--obsidian);
                padding: 4rem 2rem;
                border-top: var(--border-thick) solid var(--bone);
            }
            .war-room-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 4rem;
                border-bottom: 1px solid var(--graphite-light);
                padding-bottom: 2rem;
            }
            .pipeline-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                align-items: flex-start;
            }
            .pipeline-column {
                background: var(--graphite);
                border: 1px solid var(--graphite-light);
                min-height: 500px;
            }
            .column-header {
                padding: 1rem;
                font-family: 'JetBrains Mono', monospace;
                font-weight: 800;
                font-size: 0.75rem;
                background: var(--graphite-light);
                border-bottom: 2px solid var(--bone);
                display: flex;
                justify-content: space-between;
            }
            .pipeline-card {
                margin: 1rem;
                padding: 1.2rem;
                background: var(--obsidian);
                border: 1px solid var(--graphite-light);
                position: relative;
            }
            .pipeline-card:hover {
                border-color: var(--bone);
            }
            .card-name { font-weight: 800; font-size: 0.9rem; margin-bottom: 0.5rem; }
            .card-val { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--acid-green); }
            .card-notes { font-size: 0.75rem; color: #777; margin: 1rem 0; font-style: italic; }
            
            .move-controls {
                display: flex;
                gap: 4px;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--graphite-light);
            }
            .move-dot {
                width: 12px;
                height: 12px;
                border: 1px solid var(--bone);
                cursor: pointer;
                transition: background 0.2s;
            }
            .move-dot:hover { background: var(--bone); }
            .move-dot.active { background: var(--acid-green); border-color: var(--acid-green); }

            .comm-log {
                margin-top: 4rem;
                background: var(--graphite);
                padding: 2rem;
                border: 1px solid var(--graphite-light);
            }
            .comm-entry {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem 0;
                border-bottom: 1px solid var(--graphite-light);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
            }
        `;
        document.head.appendChild(style);
    },

    renderWarRoom() {
        const root = document.getElementById('warRoomRoot');
        if (!root) return;

        const pipeline = this.getPipelineData();
        // Assuming dealData is available globally from the main script
        const deals = typeof dealData !== 'undefined' ? dealData : [];

        let html = `
            <div class="war-room-header">
                <div>
                    <h2 class="mono" style="font-size: 3.5rem; line-height: 1;">THE WAR ROOM</h2>
                    <p class="mono" style="color: var(--oxidized-copper); margin-top: 0.5rem;">BUYER MISSION CONTROL // SESSION_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div class="mono" style="text-align: right; font-size: 0.8rem;">
                    <div style="color: var(--acid-green);">SYSTEM STATUS: ONLINE</div>
                    <div>ACTIVE PURSUITS: ${pipeline.length}</div>
                </div>
            </div>

            <div class="pipeline-container">
                ${this.stages.map(stage => `
                    <div class="pipeline-column">
                        <div class="column-header" style="border-bottom-color: ${stage.color}">
                            <span>${stage.label}</span>
                            <span style="opacity:0.4;">${pipeline.filter(p => p.stage === stage.id).length}</span>
                        </div>
                        <div class="column-body">
                            ${pipeline.filter(p => p.stage === stage.id).map(entry => {
                                const deal = deals.find(d => d.id === entry.id);
                                if (!deal) return '';
                                return `
                                    <div class="pipeline-card">
                                        <div class="card-name">${deal.title}</div>
                                        <div class="card-val">$${(deal.askingPrice / 1000000).toFixed(2)}M • ${deal.multiple}x</div>
                                        <div class="card-notes">"${entry.notes || 'No notes added...'}"</div>
                                        <div class="move-controls">
                                            ${this.stages.map(s => `
                                                <div 
                                                    class="move-dot ${s.id === stage.id ? 'active' : ''}" 
                                                    title="Move to ${s.label}"
                                                    onclick="UserDataStore.updateDealStage(${deal.id}, '${s.id}')"
                                                ></div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="comm-log">
                <h4 class="mono" style="margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--acid-green);">BROKER COMMS FEED</h4>
                ${pipeline.map(p => {
                    const deal = deals.find(d => d.id === p.id);
                    return `
                        <div class="comm-entry">
                            <span>RE: ${deal ? deal.title : 'Unknown'}</span>
                            <span style="color: #666;">LAST CONTACT: ${p.lastContact}</span>
                            <span style="color: var(--oxidized-copper);">[ENCRYPTED]</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        root.innerHTML = html;
    }
};

// Auto-init and render if the container exists
document.addEventListener('DOMContentLoaded', () => {
    UserDataStore.init();
    // In a real application, we'd call renderWarRoom() after ensuring dealData is loaded
    // For this static demo, we'll try to render after a brief delay
    setTimeout(() => UserDataStore.renderWarRoom(), 100);
});

// Export for global access
window.UserDataStore = UserDataStore;