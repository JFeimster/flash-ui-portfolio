/**
 * Carbon Kinetic | Sequence & Workflow Architect Logic
 * Manages the visual mapping of SDR outreach sequences, timing, and integration triggers.
 */

const SEQUENCE_TYPES = {
    EMAIL: { icon: '✉️', color: 'var(--accent)', label: 'Outreach Email' },
    DELAY: { icon: '⏳', color: '#ffcc00', label: 'Wait Period' },
    WEBHOOK: { icon: '⚡', color: '#ff3366', label: 'Make.com Hook' },
    NOTION: { icon: '📔', color: '#ffffff', label: 'Notion Sync' }
};

class SequenceArchitect {
    constructor() {
        this.steps = [
            { id: 1, type: 'EMAIL', value: 'Initial Hook', params: { template: 'v4_intro', variant: 'A' }, delay: 0 },
            { id: 2, type: 'DELAY', value: '2 Days', params: { hours: 48 }, delay: 48 },
            { id: 3, type: 'EMAIL', value: 'Case Study Follow-up', params: { template: 'v4_social_proof', variant: 'B' }, delay: 0 },
            { id: 4, type: 'NOTION', value: 'Update Lead Status', params: { database: 'SDR_Pipeline_2024' }, delay: 0 },
            { id: 5, type: 'DELAY', value: '3 Days', params: { hours: 72 }, delay: 72 },
            { id: 6, type: 'WEBHOOK', value: 'Trigger Make.com', params: { url: 'https://hook.make.com/k82f...' }, delay: 0 }
        ];
        
        this.initStyles();
        this.render();
    }

    initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .seq-builder-container {
                display: flex;
                flex-direction: column;
                gap: 0;
                padding: 20px;
                background: rgba(0,0,0,0.2);
                border-radius: 12px;
                border: 1px solid var(--border);
            }
            .seq-step {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-bottom: 10px;
                transition: var(--transition);
                position: relative;
                cursor: pointer;
            }
            .seq-step:hover {
                border-color: var(--accent);
                transform: translateX(5px);
            }
            .seq-step::after {
                content: '';
                position: absolute;
                bottom: -11px;
                left: 32px;
                width: 2px;
                height: 10px;
                background: var(--border);
                z-index: 0;
            }
            .seq-step:last-child::after { display: none; }
            .seq-icon {
                width: 35px;
                height: 35px;
                border-radius: 6px;
                background: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(255,255,255,0.1);
                font-size: 14px;
            }
            .seq-info { flex: 1; }
            .seq-type {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-dim);
                display: block;
            }
            .seq-val {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-main);
            }
            .seq-meta {
                font-family: var(--font-mono);
                font-size: 10px;
                color: var(--accent);
                background: var(--accent-soft);
                padding: 2px 8px;
                border-radius: 4px;
            }
            .seq-add-btn {
                background: transparent;
                border: 1px dashed var(--border);
                color: var(--text-dim);
                padding: 10px;
                border-radius: 8px;
                text-align: center;
                font-size: 11px;
                text-transform: uppercase;
                cursor: pointer;
                transition: var(--transition);
            }
            .seq-add-btn:hover {
                border-color: var(--success);
                color: var(--success);
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        const engineConsole = document.querySelector('.engine-console');
        if (!engineConsole) return;

        // Create sequence architect section
        const section = document.createElement('section');
        section.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px;">
                <div>
                    <h3 style="font-size: 12px; text-transform: uppercase; color: var(--accent);">Sequence Architect</h3>
                    <p style="font-size: 11px; color: var(--text-dim);">Map outbound logic and automation triggers</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-launch" style="padding: 6px 12px; font-size: 10px; background: #1a1a1a; color: #fff; border: 1px solid var(--border);">Reset Flow</button>
                    <button class="btn-launch" style="padding: 6px 12px; font-size: 10px;">Deploy Sequence</button>
                </div>
            </div>
            <div class="seq-builder-container" id="sequence-list"></div>
        `;

        // Insert before the output grid
        engineConsole.insertBefore(section, document.querySelector('.output-grid'));
        
        this.refreshList();
    }

    refreshList() {
        const list = document.getElementById('sequence-list');
        if (!list) return;

        list.innerHTML = this.steps.map(step => {
            const config = SEQUENCE_TYPES[step.type];
            return `
                <div class="seq-step" data-id="${step.id}">
                    <div class="seq-icon" style="border-left: 2px solid ${config.color}">${config.icon}</div>
                    <div class="seq-info">
                        <span class="seq-type">${config.label}</span>
                        <span class="seq-val">${step.value}</span>
                    </div>
                    <div class="seq-meta">
                        ${step.type === 'DELAY' ? 'T +' + step.params.hours + 'h' : 'TRIGGER: ACTIVE'}
                    </div>
                </div>
            `;
        }).join('') + `
            <div class="seq-add-btn">+ Add Step to Workflow</div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const addButton = document.querySelector('.seq-add-btn');
        addButton.addEventListener('click', () => {
            const newId = this.steps.length + 1;
            this.steps.push({
                id: newId,
                type: 'EMAIL',
                value: 'New Follow-up Step',
                params: { template: 'custom' },
                delay: 24
            });
            this.refreshList();
            
            // Log the action to the UI log window if it exists
            const logWindow = document.querySelector('.log-window');
            if (logWindow) {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.innerHTML = `
                    <span class="ts">[${new Date().toLocaleTimeString('en-GB', {hour12: false})}]</span>
                    <span class="tag" style="color: var(--success)">ARCHITECT</span>
                    <span class="msg">Added sequence node #${newId}: Outreach Email</span>
                `;
                logWindow.prepend(entry);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.architect = new SequenceArchitect();
});