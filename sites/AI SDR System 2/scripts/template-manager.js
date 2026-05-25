/**
 * scripts/template-manager.js
 * AI Personalization Studio Component
 * Dedicated interface logic for the 'Personalize' and 'Draft' stages of the Obsidian SDR Engine.
 */

const TemplateManager = {
    data: {
        activeLead: {
            name: "Sarah Chen",
            company: "Veridian AI",
            research: [
                "Recent LinkedIn Post: 'The future of RAG is context-aware filtering and semantic caching...'",
                "Company News: Veridian AI closed $4.2M Seed Round led by Sequoia last Tuesday.",
                "Website: Specializes in NLP for legal discovery and automated due diligence.",
                "Technology Stack: Python, Pinecone, LangChain, AWS Bedrock."
            ],
            draft: `Subject: Veridian AI's $4.2M seed / RAG filtering strategies

Hi Sarah,

Huge congrats on Veridian AI’s seed round—closing $4.2M in this market is a massive signal for what you're building in the legal NLP space.

I was reading your post on context-aware filtering for RAG. It's a fresh take compared to the standard chunking strategies most are using. We're actually working with a few Pinecone-heavy teams to automate their technical outreach using similar context-injection logic.

Would you be open to a brief chat about how we might help scale your infra team's outbound efforts?

Best,
[SDR Instance 0x82]`
        },
        tones: ["Professional & Direct", "Technical Peer", "Conversational", "Challenger"],
        models: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"]
    },

    init() {
        this.injectStyles();
        this.bindEvents();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .studio-overlay {
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                gap: 2rem;
                margin-top: 1rem;
                animation: studioFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .studio-panel {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--glass-border);
                border-radius: 8px;
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
            }
            .preview-area {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 6px;
                padding: 1.5rem;
                font-family: 'Inter', sans-serif;
                font-size: 0.85rem;
                line-height: 1.7;
                color: #d1d1d1;
                white-space: pre-wrap;
                border: 1px solid rgba(255,255,255,0.05);
                flex-grow: 1;
                transition: opacity 0.3s ease;
            }
            .data-point {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.65rem;
                padding: 10px;
                border-left: 1px solid var(--text-secondary);
                background: rgba(255, 255, 255, 0.01);
                margin-bottom: 8px;
                color: var(--text-secondary);
            }
            .config-label {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 0.1rem;
                color: var(--text-secondary);
                margin-bottom: 0.75rem;
                display: block;
            }
            @keyframes studioFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .studio-active-step {
                border-color: var(--accent-color) !important;
                box-shadow: 0 0 15px rgba(255,255,255,0.05);
            }
        `;
        document.head.appendChild(style);
    },

    openStudio() {
        const grid = document.querySelector('.pipeline-grid');
        const main = document.querySelector('.main-canvas');
        const stats = document.querySelector('.analytics-strip');
        
        if (grid) grid.style.display = 'none';
        if (stats) stats.style.display = 'none';

        const studioHTML = `
            <div id="personalization-studio" class="studio-overlay">
                <!-- Left: Prompt Engineering & Research Context -->
                <div class="studio-panel">
                    <span class="config-label">Model Configuration</span>
                    
                    <div class="input-group">
                        <label>Tone of Voice Profile</label>
                        <select class="input-field" style="appearance: none; cursor: pointer;">
                            ${this.data.tones.map(t => `<option>${t}</option>`).join('')}
                        </select>
                    </div>

                    <div class="input-group">
                        <label>Research Feed (Enriched)</label>
                        <div style="max-height: 180px; overflow-y: auto; padding-right: 10px;">
                            ${this.data.activeLead.research.map(r => `<div class="data-point">${r}</div>`).join('')}
                        </div>
                    </div>

                    <div class="input-group" style="flex-grow: 1;">
                        <label>Dynamic Prompt Overlay</label>
                        <textarea class="input-field" style="height: 120px; resize: none; font-family: 'JetBrains Mono'; font-size: 0.75rem;">Generate a high-relevance icebreaker bridging the lead's RAG expertise with our infrastructure automation. Use a 'technical peer' persona. Avoid standard marketing jargon.</textarea>
                    </div>
                    
                    <button class="btn-execute" style="margin-top: 1rem; background: transparent; color: white; border: 1px solid var(--glass-border);" onclick="TemplateManager.refreshDraft()">
                        Re-run Generation
                    </button>
                </div>

                <!-- Right: Side-by-Side Draft Preview -->
                <div class="studio-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span class="config-label" style="margin-bottom: 0;">Draft Preview (Lead: ${this.data.activeLead.name})</span>
                        <div class="status-badge" style="font-size: 0.6rem;">
                            <div class="status-dot"></div> AI OPTIMIZED
                        </div>
                    </div>
                    
                    <div class="preview-area" id="email-preview-content">${this.data.activeLead.draft}</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-top: 1.5rem;">
                        <button class="btn-execute" style="margin-top: 0; background: transparent; color: white; border: 1px solid var(--glass-border);" onclick="TemplateManager.closeStudio()">Cancel</button>
                        <button class="btn-execute" style="margin-top: 0;" onclick="TemplateManager.confirmDraft()">Approve & Push to SMTP</button>
                    </div>
                </div>
            </div>
        `;

        main.insertAdjacentHTML('beforeend', studioHTML);
        document.querySelector('.engine-status h1').textContent = 'Personalization Studio';
        document.querySelector('.engine-status p').textContent = 'Refining outbound copy with GPT-4o context injection';
    },

    closeStudio() {
        const studio = document.getElementById('personalization-studio');
        if (studio) studio.remove();
        
        document.querySelector('.pipeline-grid').style.display = 'grid';
        document.querySelector('.analytics-strip').style.display = 'flex';
        document.querySelector('.engine-status h1').textContent = 'Outbound Pipeline';
        document.querySelector('.engine-status p').textContent = 'Autonomous SDR System v2.4';
    },

    refreshDraft() {
        const preview = document.getElementById('email-preview-content');
        preview.style.opacity = '0.3';
        
        // Simulated LLM Latency
        setTimeout(() => {
            preview.style.opacity = '1';
            preview.textContent = `Subject: Veridian AI / Infrastructure Scaling for Legal NLP

Hi Sarah,

Caught your notes on semantic caching—it's a critical solve for the latency issues inherent in legal discovery workflows. 

With Veridian's recent $4.2M round, I imagine the pressure to scale your RAG infrastructure is mounting. We've helped three Sequoia-backed teams automate their technical outbound while keeping the level of specific detail you see in this email.

Would you be open to a 10-minute sync on how we bridge research data into high-conversion outreach?

Cheers,
SDR Engine`;
        }, 800);
    },

    confirmDraft() {
        const btn = event.currentTarget;
        btn.textContent = "QUEUED FOR SEND...";
        btn.style.opacity = "0.7";
        btn.disabled = true;
        
        setTimeout(() => {
            this.closeStudio();
        }, 1000);
    },

    bindEvents() {
        // Map to steps 04 (Personalize) and 05 (Draft)
        const stepCards = document.querySelectorAll('.step-card');
        const triggerSteps = [stepCards[3], stepCards[4]];
        
        triggerSteps.forEach(step => {
            if (step) {
                step.style.cursor = 'pointer';
                step.addEventListener('mouseover', () => step.classList.add('studio-active-step'));
                step.addEventListener('mouseout', () => step.classList.remove('studio-active-step'));
                step.addEventListener('click', () => this.openStudio());
            }
        });
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TemplateManager.init());
} else {
    TemplateManager.init();
}