/**
 * Outreach Status Tracker - Dashboard Logic
 * Maps discovered contacts vs internal logs to prevent duplicate outreach.
 */

const OutreachTracker = {
    config: {
        roles: [
            { label: 'Founders / CEOs', success: 78, color: 'var(--accent)' },
            { label: 'Managers / Ops', success: 42, color: 'var(--primary)' },
            { label: 'Direct Extensions', success: 31, color: 'var(--primary)' },
            { label: 'General / Info@', success: 9, color: 'var(--text-dim)' }
        ],
        metrics: {
            scanned: 1248,
            contacted: 412,
            duplicatesBlocked: 89
        }
    },

    init() {
        this.injectStyles();
        this.renderTracker();
        this.animateCharts();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .outreach-tracker {
                margin-top: 8px;
                padding-top: 16px;
                border-top: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            .tracker-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .tracker-mini-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 8px;
                text-align: center;
            }
            .tmc-val {
                display: block;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
                font-weight: 700;
                color: var(--text-main);
            }
            .tmc-label {
                font-size: 0.6rem;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .success-rate-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .role-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .role-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.65rem;
                font-family: 'JetBrains Mono', monospace;
                color: var(--text-dim);
            }
            .progress-track {
                height: 4px;
                background: var(--input-bg);
                border-radius: 2px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                width: 0%;
                transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .duplicate-tag {
                font-size: 0.65rem;
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
                padding: 4px 8px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 6px;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);
    },

    renderTracker() {
        const resultsPanel = document.querySelector('.results-panel');
        if (!resultsPanel) return;

        const trackerEl = document.createElement('div');
        trackerEl.className = 'outreach-tracker';

        trackerEl.innerHTML = `
            <div class="results-header">Outreach Prevention</div>
            <div class="tracker-grid">
                <div class="tracker-mini-card">
                    <span class="tmc-val">${this.config.metrics.contacted}</span>
                    <span class="tmc-label">History Hit</span>
                </div>
                <div class="tracker-mini-card" style="border-color: rgba(239, 68, 68, 0.3)">
                    <span class="tmc-val" style="color: #ef4444">${this.config.metrics.duplicatesBlocked}</span>
                    <span class="tmc-label">Duplicates Blocked</span>
                </div>
            </div>

            <div class="success-rate-container">
                <div class="results-header" style="font-size: 0.65rem; margin-bottom: 0;">Persona Success Rate</div>
                ${this.config.roles.map(role => `
                    <div class="role-row">
                        <div class="role-meta">
                            <span>${role.label}</span>
                            <span>${role.success}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="background: ${role.color}" data-width="${role.success}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="duplicate-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
                </svg>
                Real-time suppression active
            </div>
        `;

        // Insert before the terminal component
        const terminal = resultsPanel.querySelector('.log-terminal');
        resultsPanel.insertBefore(trackerEl, terminal);
    },

    animateCharts() {
        // Delay to allow DOM paint
        requestAnimationFrame(() => {
            const fills = document.querySelectorAll('.progress-fill');
            fills.forEach(fill => {
                fill.style.width = fill.getAttribute('data-width');
            });
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OutreachTracker.init());
} else {
    OutreachTracker.init();
}