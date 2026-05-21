const AI_ENGINE_CONFIG = {
    activeLead: {
        id: "0x492",
        name: "Alex Rivera",
        title: "CTO",
        company: "Neo-Finance.io",
        intent_score: 94,
        research_intel: [
            {
                source: "LinkedIn",
                timestamp: "2h ago",
                data: "Posted regarding Rust migration for high-frequency trading latency optimization.",
                tag: "TECH_STACK"
            },
            {
                source: "Crunchbase",
                timestamp: "3mo ago",
                data: "Secured $12M Series A funding led by Paradigm for institutional liquidity protocols.",
                tag: "FUNDING"
            },
            {
                source: "SEC Filings",
                timestamp: "1mo ago",
                data: "Expansion into APAC markets mentioned in quarterly risk assessment.",
                tag: "STRATEGY"
            }
        ]
    },
    prompts: {
        chatgpt: {
            engine: "gpt-4o-2024-05-13",
            system: "You are an elite SDR at Carbon Kinetic. Write high-signal, short emails. Focus on technical alignment and 'Founders-to-Founders' tone.",
            user_template: "Mention the {{research.0.data}} and bridge it to our kinetic engine's sub-5ms processing. Keep it under 50 words. No fluff."
        },
        gemini: {
            engine: "gemini-1.5-pro",
            system: "Analytical outbound specialist. Use growth-oriented language and focus on ROI/Efficiency metrics.",
            user_template: "Acknowledge the {{research.1.data}} and suggest a strategy for scaling lead outreach without increasing headcount. Focus on efficiency."
        }
    },
    ui: {
        colors: {
            accent: "#00f2ff",
            success: "#00ff88",
            border: "#222222",
            surface: "#0d0d0d"
        }
    }
};

/**
 * AI Personalization & Draft Studio Renderer
 * Injects the side-by-side workspace into the .engine-console
 */
function initializeStudio() {
    const consoleContainer = document.querySelector('.engine-console');
    if (!consoleContainer) return;

    const studioStyles = `
        <style>
            .studio-workspace {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .studio-pane {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                height: 480px;
                overflow: hidden;
            }
            .pane-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.02);
            }
            .pane-title {
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .intel-card {
                margin: 15px;
                padding: 15px;
                background: #000;
                border: 1px solid var(--border);
                border-radius: 8px;
                position: relative;
            }
            .intel-card::before {
                content: '';
                position: absolute;
                left: -1px;
                top: 10px;
                bottom: 10px;
                width: 3px;
                background: var(--accent);
                border-radius: 0 4px 4px 0;
            }
            .intel-tag {
                font-size: 9px;
                font-family: var(--font-mono);
                color: var(--accent);
                margin-bottom: 6px;
            }
            .draft-area {
                padding: 20px;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .prompt-box {
                background: #000;
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 12px;
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--text-main);
                resize: none;
                height: 100px;
                transition: var(--transition);
            }
            .prompt-box:focus {
                border-color: var(--accent);
                outline: none;
            }
            .email-preview {
                background: #050505;
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 20px;
                font-size: 13px;
                line-height: 1.6;
                color: #fff;
                flex: 1;
                overflow-y: auto;
            }
            .model-toggle {
                display: flex;
                background: #000;
                padding: 3px;
                border-radius: 6px;
                border: 1px solid var(--border);
            }
            .model-btn {
                padding: 4px 12px;
                font-size: 9px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                background: transparent;
                color: var(--text-dim);
                text-transform: uppercase;
                font-weight: 600;
            }
            .model-btn.active {
                background: var(--accent);
                color: #000;
            }
        </style>
    `;

    const studioHTML = `
        <div class="studio-workspace">
            <!-- Left: Research Intel -->
            <div class="studio-pane">
                <div class="pane-header">
                    <div class="pane-title" style="color: var(--accent);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Lead Intelligence
                    </div>
                    <div style="font-size: 10px; color: var(--text-dim);">ID: ${AI_ENGINE_CONFIG.activeLead.id}</div>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 5px;">
                    <div style="padding: 15px 20px 0;">
                        <h3 style="font-size: 16px; margin-bottom: 4px;">${AI_ENGINE_CONFIG.activeLead.name}</h3>
                        <p style="font-size: 12px; color: var(--text-dim);">${AI_ENGINE_CONFIG.activeLead.title} @ ${AI_ENGINE_CONFIG.activeLead.company}</p>
                    </div>
                    ${AI_ENGINE_CONFIG.activeLead.research_intel.map(intel => `
                        <div class="intel-card">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span class="intel-tag">${intel.tag}</span>
                                <span style="font-size: 9px; color: var(--text-dim);">${intel.source} // ${intel.timestamp}</span>
                            </div>
                            <div style="font-size: 12px; line-height: 1.4; color: #ccc;">${intel.data}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Right: AI Draft Composer -->
            <div class="studio-pane">
                <div class="pane-header">
                    <div class="pane-title" style="color: var(--success);">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                        Draft Composer
                    </div>
                    <div class="model-toggle">
                        <button class="model-btn active">GPT-4o</button>
                        <button class="model-btn">Gemini</button>
                    </div>
                </div>
                <div class="draft-area">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size: 9px; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Prompt Fine-Tuning</label>
                        <textarea class="prompt-box">${AI_ENGINE_CONFIG.prompts.chatgpt.user_template}</textarea>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                        <label style="font-size: 9px; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Output Preview</label>
                        <div class="email-preview">
                            <span style="color: var(--text-dim);">Subject: Rust migration at ${AI_ENGINE_CONFIG.activeLead.company}</span><br><br>
                            Hi Alex,<br><br>
                            I saw your post about migrating to Rust for latency optimization. Carbon Kinetic was built for exactly this—we handle sub-5ms data signals for SDR workflows.<br><br>
                            Would it be worth a 5-minute sync on how we've handled similar high-frequency scaling for Fintech firms?<br><br>
                            Best,<br>
                            [AI Agent]
                        </div>
                    </div>
                    <button class="btn-launch" style="background: var(--success); margin: 0; width: 100%; height: 40px;">
                        Approve & Send Email
                    </button>
                </div>
            </div>
        </div>
    `;

    // Inject styles and replace existing content
    document.head.insertAdjacentHTML('beforeend', studioStyles);
    
    const outputGrid = consoleContainer.querySelector('.output-grid');
    if (outputGrid) {
        outputGrid.innerHTML = studioHTML;
        outputGrid.style.height = 'auto';
    }

    // Update workflow step
    const steps = document.querySelectorAll('.step-node');
    steps.forEach(s => s.classList.remove('active'));
    steps[4].classList.add('active'); // Step 05: Draft
    steps[3].classList.add('complete'); // Step 04: Personalize
}

// Event handler for engine initialization button
document.addEventListener('DOMContentLoaded', () => {
    const launchBtn = document.querySelector('.btn-launch');
    if (launchBtn) {
        launchBtn.addEventListener('click', () => {
            const originalText = launchBtn.innerHTML;
            launchBtn.innerHTML = '<span class="status-dot"></span> ANALYZING...';
            setTimeout(() => {
                initializeStudio();
                launchBtn.innerHTML = originalText;
                launchBtn.style.opacity = '0.5';
                launchBtn.style.pointerEvents = 'none';
            }, 1200);
        });
    }
});