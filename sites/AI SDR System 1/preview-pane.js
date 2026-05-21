const style = document.createElement('style');
style.textContent = `
    .studio-container {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 20px;
        height: 500px;
        animation: fadeIn 0.4s ease-out;
    }

    .studio-pane {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .pane-header {
        padding: 12px 20px;
        border-bottom: 1px solid var(--border);
        background: rgba(255,255,255,0.02);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pane-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-dim);
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pane-content {
        padding: 20px;
        overflow-y: auto;
        flex-grow: 1;
        font-size: 13px;
        line-height: 1.6;
    }

    /* Research Data Styling */
    .research-item {
        margin-bottom: 20px;
    }

    .research-label {
        font-family: var(--font-mono);
        color: var(--accent);
        font-size: 10px;
        margin-bottom: 6px;
        display: block;
    }

    .data-pill {
        display: inline-block;
        padding: 4px 10px;
        background: var(--accent-soft);
        border: 1px solid rgba(0, 242, 255, 0.2);
        border-radius: 4px;
        font-size: 11px;
        margin-right: 6px;
        margin-bottom: 6px;
        color: var(--accent);
    }

    .social-snippet {
        background: #000;
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 8px;
        font-style: italic;
        color: #aaa;
    }

    /* Editor Styling */
    .email-editor {
        background: transparent;
        border: none;
        color: var(--text-main);
        width: 100%;
        height: 100%;
        resize: none;
        font-family: var(--font-sans);
        outline: none;
        line-height: 1.6;
    }

    .model-selector {
        display: flex;
        background: #000;
        padding: 4px;
        border-radius: 6px;
        border: 1px solid var(--border);
    }

    .model-btn {
        padding: 4px 12px;
        font-size: 10px;
        border: none;
        background: transparent;
        color: var(--text-dim);
        cursor: pointer;
        border-radius: 4px;
        transition: var(--transition);
    }

    .model-btn.active {
        background: var(--border);
        color: #fff;
    }

    .refine-bar {
        padding: 15px 20px;
        background: rgba(0,0,0,0.3);
        border-top: 1px solid var(--border);
        display: flex;
        gap: 12px;
    }

    .prompt-input {
        flex-grow: 1;
        background: #000;
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 8px 12px;
        color: #fff;
        font-size: 12px;
    }

    .btn-action {
        background: var(--border);
        color: #fff;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
    }

    .btn-action:hover {
        background: var(--accent);
        color: #000;
    }

    .token-counter {
        font-family: var(--font-mono);
        font-size: 9px;
        color: var(--text-dim);
    }
`;
document.head.appendChild(style);

const LeadStudio = {
    currentLead: {
        name: "Alex Rivera",
        title: "CTO at NeoFinance",
        research: {
            recentPost: "Just scaled our core ledger to 10k TPS using a custom Rust implementation. Latency is finally under 5ms.",
            techStack: ["Rust", "Kubernetes", "PostgreSQL", "Kafka"],
            news: "NeoFinance recently raised $12M Series A led by FinTech Collective.",
            painPoint: "High cloud egress costs during data replication across regions."
        },
        drafts: {
            gpt4: `Subject: Rust performance at NeoFinance / Scaling the ledger\n\nHi Alex,\n\nI saw your update about scaling the core ledger to 10k TPS—hitting sub-5ms latency with Rust is no small feat. \n\nGiven NeoFinance's recent Series A and your focus on high-throughput infrastructure, I thought you might be interested in how we're helping Series A fintechs optimize Kubernetes egress costs. We've seen similar Rust-heavy stacks drop infra spend by 22% without touching the logic.\n\nWorth a brief chat about your data replication setup?\n\nBest,\n[Your Name]`,
            gemini: `Subject: Question regarding NeoFinance's sub-5ms latency goals\n\nAlex,\n\nImpressive work on the 10k TPS milestone. Scaling custom Rust implementations is a challenge most CTOs shy away from.\n\nSince you're scaling fast post-Series A, are cloud egress costs becoming a bottleneck for your Kafka replication? Carbon Kinetic automates the network layer optimization for high-frequency fintech platforms.\n\nWould you be open to a 10-minute technical exchange next Thursday?\n\nCheers,\n[Your Name]`
        }
    },

    init() {
        const consoleContainer = document.querySelector('.engine-console');
        const outputGrid = document.querySelector('.output-grid');
        
        // Replace output grid with studio
        outputGrid.style.display = 'none';
        
        const studio = document.createElement('div');
        studio.className = 'studio-container';
        studio.innerHTML = `
            <div class="studio-pane">
                <div class="pane-header">
                    <div class="pane-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        Intelligence Profile: ${this.currentLead.name}
                    </div>
                </div>
                <div class="pane-content">
                    <div class="research-item">
                        <span class="research-label">CRITICAL CONTEXT (X/LINKEDIN)</span>
                        <div class="social-snippet">"${this.currentLead.research.recentPost}"</div>
                    </div>
                    <div class="research-item">
                        <span class="research-label">TECHNOLOGY GRAPH</span>
                        ${this.currentLead.research.techStack.map(t => `<span class="data-pill">${t}</span>`).join('')}
                    </div>
                    <div class="research-item">
                        <span class="research-label">COMPANY MILESTONES</span>
                        <p style="color: #ccc;">${this.currentLead.research.news}</p>
                    </div>
                    <div class="research-item">
                        <span class="research-label">IDENTIFIED FRICTION</span>
                        <p style="color: var(--success); font-weight: 500;">→ ${this.currentLead.research.painPoint}</p>
                    </div>
                </div>
            </div>

            <div class="studio-pane">
                <div class="pane-header">
                    <div class="pane-title">Email Draft Studio</div>
                    <div class="model-selector">
                        <button class="model-btn active" id="btn-gpt">GPT-4o</button>
                        <button class="model-btn" id="btn-gemini">Gemini Pro</button>
                    </div>
                </div>
                <div class="pane-content">
                    <textarea class="email-editor" id="draft-area">${this.currentLead.drafts.gpt4}</textarea>
                </div>
                <div class="refine-bar">
                    <input type="text" class="prompt-input" placeholder="Ask AI to refine (e.g. 'Make it shorter' or 'More technical')">
                    <button class="btn-action">Refine</button>
                    <button class="btn-action" style="background: var(--accent); color: #000;">Approve</button>
                </div>
                <div style="padding: 5px 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <span class="token-counter">~142 Tokens</span>
                    <span style="font-size: 9px; color: var(--success);">● AI QUALITY SCORE: 98%</span>
                </div>
            </div>
        `;

        consoleContainer.insertBefore(studio, consoleContainer.lastElementChild);
        this.bindEvents();
    },

    bindEvents() {
        const draftArea = document.getElementById('draft-area');
        const gptBtn = document.getElementById('btn-gpt');
        const geminiBtn = document.getElementById('btn-gemini');

        gptBtn.addEventListener('click', () => {
            gptBtn.classList.add('active');
            geminiBtn.classList.remove('active');
            draftArea.value = this.currentLead.drafts.gpt4;
        });

        geminiBtn.addEventListener('click', () => {
            geminiBtn.classList.add('active');
            gptBtn.classList.remove('active');
            draftArea.value = this.currentLead.drafts.gemini;
        });
    }
};

// Auto-run when Personalize step is focused (Mock behavior)
document.querySelectorAll('.step-node')[3].addEventListener('click', () => LeadStudio.init());
// Initial timeout for demo
setTimeout(() => {
    console.log("Personalization Studio Module Loaded.");
}, 500);
```