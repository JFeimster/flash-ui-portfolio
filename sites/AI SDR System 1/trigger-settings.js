/**
 * trigger-settings.js
 * Sequence & Workflow Architect Logic
 * Carbon Kinetic AI SDR Engine
 */

const TriggerSettings = (() => {
    const config = {
        steps: [
            { id: 1, type: 'email', delay: 0, label: 'Initial Outreach', status: 'active' },
            { id: 2, type: 'delay', value: 48, unit: 'hours' },
            { id: 3, type: 'email', delay: 2, label: 'Follow-up: Value Prop', status: 'pending' },
            { id: 4, type: 'delay', value: 72, unit: 'hours' },
            { id: 5, type: 'trigger', label: 'Push to Notion', platform: 'notion', action: 'database_insert' }
        ],
        webhooks: {
            make: "https://hook.us1.make.com/xk92j...",
            notion: "kinetic_db_8821"
        }
    };

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .architect-overlay {
                margin-top: 24px;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 24px;
                animation: fadeIn 0.5s ease-out;
            }

            .architect-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
            }

            .architect-title {
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-main);
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .sequence-timeline {
                display: flex;
                flex-direction: column;
                gap: 12px;
                position: relative;
            }

            .sequence-step {
                background: #000;
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: var(--transition);
                position: relative;
            }

            .sequence-step:hover {
                border-color: var(--accent-soft);
                transform: translateX(4px);
            }

            .step-icon {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                background: var(--accent-soft);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--accent);
            }

            .step-info { flex: 1; }
            .step-info .label { font-size: 12px; font-weight: 500; color: #fff; }
            .step-info .meta { font-size: 10px; color: var(--text-dim); font-family: var(--font-mono); }

            .delay-node {
                margin-left: 40px;
                padding: 8px 15px;
                border-left: 2px dashed var(--border);
                font-size: 11px;
                color: var(--accent);
                font-family: var(--font-mono);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .trigger-node {
                border: 1px solid var(--success);
                background: rgba(0, 255, 136, 0.05);
            }

            .webhook-config {
                margin-top: 30px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                padding: 20px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
            }

            .webhook-card label {
                font-size: 10px;
                color: var(--text-dim);
                text-transform: uppercase;
                margin-bottom: 8px;
                display: block;
            }

            .webhook-input {
                width: 100%;
                background: #050505;
                border: 1px solid var(--border);
                padding: 10px;
                border-radius: 4px;
                color: var(--success);
                font-family: var(--font-mono);
                font-size: 11px;
            }

            .add-step-btn {
                background: transparent;
                border: 1px dashed var(--border);
                color: var(--text-dim);
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 11px;
                text-align: center;
                transition: var(--transition);
                margin-top: 10px;
            }

            .add-step-btn:hover {
                border-color: var(--accent);
                color: var(--accent);
            }
        `;
        document.head.appendChild(style);
    };

    const createArchitectUI = () => {
        const container = document.querySelector('.engine-console');
        if (!container) return;

        const architectSection = document.createElement('section');
        architectSection.className = 'architect-overlay';
        
        architectSection.innerHTML = `
            <div class="architect-header">
                <div class="architect-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    Sequence Architect
                </div>
                <div style="font-size: 10px; color: var(--text-dim);">V4.0_FLOW_BUILDER</div>
            </div>
            
            <div class="sequence-timeline" id="sequence-list">
                <!-- Steps injected here -->
            </div>

            <button class="add-step-btn">+ Add Sequence Node</button>

            <div class="webhook-config">
                <div class="webhook-card">
                    <label>Make.com Webhook (Trigger)</label>
                    <input type="text" class="webhook-input" value="${config.webhooks.make}" readonly>
                </div>
                <div class="webhook-card">
                    <label>Notion DB Integration</label>
                    <input type="text" class="webhook-input" value="${config.webhooks.notion}" readonly>
                </div>
            </div>
        `;

        container.appendChild(architectSection);
        renderSteps();
    };

    const renderSteps = () => {
        const list = document.getElementById('sequence-list');
        list.innerHTML = config.steps.map(step => {
            if (step.type === 'delay') {
                return `<div class="delay-node">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    WAIT ${step.value} ${step.unit.toUpperCase()}
                </div>`;
            }
            
            const isTrigger = step.type === 'trigger';
            return `
                <div class="sequence-step ${isTrigger ? 'trigger-node' : ''}">
                    <div class="step-icon">
                        ${isTrigger ? 
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>' :
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
                        }
                    </div>
                    <div class="step-info">
                        <div class="label">${step.label}</div>
                        <div class="meta">${isTrigger ? `ACTION: ${step.action}` : `CHANNEL: EMAIL | TEMPLATE: ${step.id}_DEFAULT`}</div>
                    </div>
                    <div class="step-status">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${step.status === 'active' ? 'var(--accent)' : 'var(--border)'}" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
            `;
        }).join('');
    };

    // Public init
    return {
        init: () => {
            injectStyles();
            createArchitectUI();
            console.log("TriggerSettings: Architect initialized.");
        }
    };
})();

// Auto-init if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    TriggerSettings.init();
} else {
    document.addEventListener('DOMContentLoaded', TriggerSettings.init);
}

// Function to simulate adding a step from the main UI
window.addSequenceStep = (type, label) => {
    // This would typically interface with a backend API
    const logWindow = document.querySelector('.log-window');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="ts">[${new Date().toLocaleTimeString([], {hour12: false})}]</span>
        <span class="tag" style="color: var(--success)">CONFIG</span>
        <span class="msg">New node added to sequence: ${label}</span>
    `;
    logWindow.prepend(entry);
};