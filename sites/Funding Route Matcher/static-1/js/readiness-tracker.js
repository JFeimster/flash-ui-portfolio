const ReadinessTracker = {
    tasks: [
        { id: 'ein', category: 'Entity', label: 'Verify EIN / Tax ID', completed: false, tip: 'Ensure your IRS documents match your current business address exactly.' },
        { id: 'address', category: 'Entity', label: 'Physical Business Address', completed: false, tip: 'Avoid PO Boxes. Lenders prefer a physical location or a verified virtual office.' },
        { id: 'duns', category: 'Credit', label: 'Register for D-U-N-S Number', completed: false, tip: 'This is the "Social Security Number" for your business credit profile.' },
        { id: 'tradeline', category: 'Credit', label: 'Open 3 Tier-1 Tradelines', completed: false, tip: 'Vendors like Uline, Grainger, or Quill report quickly to build your score.' },
        { id: 'plaid', category: 'Banking', label: 'Connect 3 Months Bank Data', completed: false, tip: 'Stable daily balances are more important than total monthly volume.' },
        { id: 'identity', category: 'Compliance', label: 'Upload Clear Gov ID', completed: false, tip: 'High-resolution color scan of front and back to pass AI fraud checks.' }
    ],

    injectStyles() {
        if (document.getElementById('readiness-styles')) return;
        const style = document.createElement('style');
        style.id = 'readiness-styles';
        style.textContent = `
            .readiness-portal {
                padding: 40px;
                animation: fadeIn 0.5s ease-out;
            }
            .tracker-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 30px;
            }
            .progress-ring-container {
                text-align: right;
            }
            .percent-display {
                font-size: 2.5rem;
                font-weight: 800;
                color: var(--neon-green);
                font-family: 'JetBrains Mono', monospace;
            }
            .task-group {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .task-item {
                background: #1a1d26;
                border: 1px solid var(--card-border);
                border-radius: 12px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: var(--transition);
            }
            .task-item:hover {
                border-color: var(--electric-blue);
            }
            .task-item.done {
                border-color: rgba(57, 255, 20, 0.3);
                background: rgba(57, 255, 20, 0.02);
            }
            .checkbox-custom {
                width: 24px;
                height: 24px;
                border: 2px solid var(--card-border);
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
                flex-shrink: 0;
            }
            .task-item.done .checkbox-custom {
                background: var(--neon-green);
                border-color: var(--neon-green);
            }
            .task-item.done .checkbox-custom::after {
                content: "✓";
                color: #000;
                font-weight: 800;
                font-size: 14px;
            }
            .task-content {
                flex-grow: 1;
            }
            .task-label {
                font-weight: 600;
                display: block;
                font-size: 1rem;
            }
            .task-tip {
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 4px;
            }
            .category-tag {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--electric-blue);
                background: rgba(0, 242, 255, 0.1);
                padding: 2px 8px;
                border-radius: 4px;
                margin-bottom: 6px;
                display: inline-block;
            }
            .portal-actions {
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid var(--card-border);
                display: flex;
                gap: 15px;
            }
        `;
        document.head.appendChild(style);
    },

    init(containerId) {
        this.container = document.getElementById(containerId);
        this.injectStyles();
        this.render();
    },

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.render();
        }
    },

    calculateProgress() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        return Math.round((completedCount / this.tasks.length) * 100);
    },

    render() {
        const progress = this.calculateProgress();
        
        this.container.innerHTML = `
            <div class="readiness-portal">
                <div class="tracker-header">
                    <div>
                        <div class="route-badge">PHASE: PRE-FUNDING</div>
                        <h2 style="font-size: 2rem;">Readiness Roadmap</h2>
                        <p style="color: var(--text-muted);">Complete these steps to unlock prime funding rates.</p>
                    </div>
                    <div class="progress-ring-container">
                        <div class="percent-display">${progress}%</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Ready</div>
                    </div>
                </div>

                <div class="task-group">
                    ${this.tasks.map(task => `
                        <div class="task-item ${task.completed ? 'done' : ''}" onclick="ReadinessTracker.toggleTask('${task.id}')">
                            <div class="checkbox-custom"></div>
                            <div class="task-content">
                                <span class="category-tag">${task.category}</span>
                                <span class="task-label">${task.label}</span>
                                <p class="task-tip">${task.tip}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="portal-actions">
                    <button class="cta-button btn-primary" style="flex: 2;" onclick="alert('Our specialists are reviewing your roadmap.')">
                        ${progress === 100 ? 'Submit for Final Review' : 'Save Progress'}
                    </button>
                    <button class="cta-button btn-outline" style="flex: 1;" onclick="location.reload()">
                        Exit Portal
                    </button>
                </div>
            </div>
        `;
    }
};

// Override the base "Start Prep Plan" functionality if needed
window.startPrepPlan = function() {
    const container = document.getElementById('moonshine-matcher-container');
    // Clear and prepare container for portal injection
    container.innerHTML = '<div id="portal-root"></div>';
    ReadinessTracker.init('portal-root');
};

// Hook into existing UI buttons from the base component
document.addEventListener('click', function(e) {
    if (e.target.innerText === 'START PREP PLAN') {
        window.startPrepPlan();
    }
});