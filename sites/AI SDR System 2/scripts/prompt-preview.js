const studioStyles = `
    .studio-overlay {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 1.5rem;
        height: 100%;
        animation: fadeIn 0.4s ease-out;
    }

    .studio-panel {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .panel-header {
        padding: 1rem;
        border-bottom: 1px solid var(--glass-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.01);
    }

    .panel-title {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        color: var(--text-secondary);
    }

    .panel-body {
        padding: 1.25rem;
        flex: 1;
        overflow-y: auto;
    }

    .prompt-editor {
        width: 100%;
        height: 150px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--glass-border);
        border-radius: 4px;
        color: #a5d6ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        padding: 1rem;
        resize: none;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    .tone-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .tone-btn {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tone-btn.active {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-color);
        border-color: var(--accent-color);
    }

    .context-chip {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        border-left: 2px solid var(--text-secondary);
    }

    .context-chip.news { border-left-color: #3b82f6; }
    .context-chip.linkedin { border-left-color: #0077b5; }

    .context-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        margin-bottom: 0.4rem;
        display: block;
    }

    .context-text {
        font-size: 0.75rem;
        line-height: 1.4;
    }

    .preview-container {
        background: rgba(255, 255, 255, 0.01);
        border-radius: 6px;
        padding: 1.5rem;
        font-family: 'Inter', sans-serif;
        border: 1px dashed var(--glass-border);
        min-height: 200px;
        white-space: pre-wrap;
    }

    .preview-subject {
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--accent-color);
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 0.5rem;
    }

    .preview-body {
        font-size: 0.9rem;
        color: var(--text-primary);
        line-height: 1.6;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .back-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.7rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .back-btn:hover { color: var(--accent-color); }
`;

const LeadData = {
    name: "Alex Rivera",
    company: "Nexus Stream",
    role: "Head of Growth",
    news: "Recently secured Series B funding for AI video infrastructure.",
    linkedin: "Posted about the inefficiency of traditional SDR teams and the shift towards 'Automated Personalization' last Tuesday.",
    prompt: "Write a short, punchy email. Reference their recent Series B and their specific LinkedIn take on SDR efficiency. Keep it under 100 words. Tone: Professional but slightly provocative."
};

class PersonalizationStudio {
    constructor() {
        this.injectStyles();
        this.originalContent = document.querySelector('.main-canvas').innerHTML;
        this.init();
    }

    injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = studioStyles;
        document.head.appendChild(styleSheet);
    }

    init() {
        // Attach to steps 04 and 05
        const cards = document.querySelectorAll('.step-card');
        cards.forEach((card, index) => {
            if (index === 3 || index === 4) { // Step 4 or 5
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => this.renderStudio());
            }
        });
    }

    renderStudio() {
        const container = document.querySelector('.main-canvas');
        container.innerHTML = `
            <button class="back-btn" id="studio-back">← Back to Pipeline</button>
            <div class="studio-overlay">
                <!-- Left Column: Config -->
                <div class="studio-panel">
                    <div class="panel-header">
                        <span class="panel-title">Prompt Configuration</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.6rem; color: #4ade80;">GPT-4O ACTIVE</span>
                    </div>
                    <div class="panel-body">
                        <label class="context-label">System Instruction</label>
                        <textarea class="prompt-editor" id="system-prompt">${LeadData.prompt}</textarea>
                        
                        <label class="context-label">Tone of Voice</label>
                        <div class="tone-selector">
                            <button class="tone-btn">Direct</button>
                            <button class="tone-btn active">Provocative</button>
                            <button class="tone-btn">Empathetic</button>
                            <button class="tone-btn">Academic</button>
                        </div>

                        <label class="context-label">Variables</label>
                        <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: var(--text-secondary);">
                            {{first_name}}, {{company}}, {{linkedin_post}}, {{funding_news}}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Context & Preview -->
                <div class="studio-panel">
                    <div class="panel-header">
                        <span class="panel-title">Lead Context & Live Preview</span>
                        <button class="tone-btn" style="padding: 2px 8px; border-color: var(--accent-color); color: var(--accent-color);">Regenerate</button>
                    </div>
                    <div class="panel-body" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem;">
                        <div class="context-feed">
                            <div class="context-chip news">
                                <span class="context-label">Company News</span>
                                <p class="context-text">${LeadData.news}</p>
                            </div>
                            <div class="context-chip linkedin">
                                <span class="context-label">Recent LinkedIn</span>
                                <p class="context-text">${LeadData.linkedin}</p>
                            </div>
                        </div>
                        <div class="preview-container">
                            <div class="preview-subject">Subject: Your take on SDR efficiency // Nexus Stream</div>
                            <div class="preview-body" id="email-preview">Hi Alex,

Saw your post about the shift towards automated personalization—hit the nail on the head. Most SDR teams are still spray-and-paying while the tech curve is moving under them.

Congrats on the Series B at Nexus Stream. Building AI video infra is capital intensive, but clearly you're winning the growth game.

We've built an engine that executes exactly the logic you described. Worth a 2-minute look?

Best,
[Your Name]</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('studio-back').addEventListener('click', () => {
            container.innerHTML = this.originalContent;
            this.init(); // Re-init listeners
        });

        this.setupLiveUpdate();
    }

    setupLiveUpdate() {
        const editor = document.getElementById('system-prompt');
        const preview = document.getElementById('email-preview');
        
        editor.addEventListener('input', (e) => {
            // Mock dynamic update
            if (e.target.value.length % 5 === 0) {
                preview.style.opacity = '0.5';
                setTimeout(() => {
                    preview.style.opacity = '1';
                }, 200);
            }
        });

        const toneBtns = document.querySelectorAll('.tone-btn');
        toneBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toneBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.studio = new PersonalizationStudio();
});const studioStyles = `
    .studio-overlay {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 1.5rem;
        height: 100%;
        animation: fadeIn 0.4s ease-out;
    }

    .studio-panel {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .panel-header {
        padding: 1rem;
        border-bottom: 1px solid var(--glass-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.01);
    }

    .panel-title {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        color: var(--text-secondary);
    }

    .panel-body {
        padding: 1.25rem;
        flex: 1;
        overflow-y: auto;
    }

    .prompt-editor {
        width: 100%;
        height: 150px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--glass-border);
        border-radius: 4px;
        color: #a5d6ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        padding: 1rem;
        resize: none;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    .tone-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .tone-btn {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tone-btn.active {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-color);
        border-color: var(--accent-color);
    }

    .context-chip {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        border-left: 2px solid var(--text-secondary);
    }

    .context-chip.news { border-left-color: #3b82f6; }
    .context-chip.linkedin { border-left-color: #0077b5; }

    .context-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        margin-bottom: 0.4rem;
        display: block;
    }

    .context-text {
        font-size: 0.75rem;
        line-height: 1.4;
    }

    .preview-container {
        background: rgba(255, 255, 255, 0.01);
        border-radius: 6px;
        padding: 1.5rem;
        font-family: 'Inter', sans-serif;
        border: 1px dashed var(--glass-border);
        min-height: 200px;
        white-space: pre-wrap;
    }

    .preview-subject {
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--accent-color);
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 0.5rem;
    }

    .preview-body {
        font-size: 0.9rem;
        color: var(--text-primary);
        line-height: 1.6;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .back-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.7rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .back-btn:hover { color: var(--accent-color); }
`;

const LeadData = {
    name: "Alex Rivera",
    company: "Nexus Stream",
    role: "Head of Growth",
    news: "Recently secured Series B funding for AI video infrastructure.",
    linkedin: "Posted about the inefficiency of traditional SDR teams and the shift towards 'Automated Personalization' last Tuesday.",
    prompt: "Write a short, punchy email. Reference their recent Series B and their specific LinkedIn take on SDR efficiency. Keep it under 100 words. Tone: Professional but slightly provocative."
};

class PersonalizationStudio {
    constructor() {
        this.injectStyles();
        this.originalContent = null;
        this.init();
    }

    injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = studioStyles;
        document.head.appendChild(styleSheet);
    }

    init() {
        const cards = document.querySelectorAll('.step-card');
        cards.forEach((card, index) => {
            if (index === 3 || index === 4) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => this.renderStudio());
            }
        });
    }

    renderStudio() {
        const container = document.querySelector('.main-canvas');
        if (!this.originalContent) this.originalContent = container.innerHTML;
        
        container.innerHTML = `
            <button class="back-btn" id="studio-back">← Back to Pipeline</button>
            <div class="studio-overlay">
                <div class="studio-panel">
                    <div class="panel-header">
                        <span class="panel-title">Prompt Configuration</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.6rem; color: #4ade80;">GPT-4O ACTIVE</span>
                    </div>
                    <div class="panel-body">
                        <label class="context-label">System Instruction</label>
                        <textarea class="prompt-editor" id="system-prompt">${LeadData.prompt}</textarea>
                        
                        <label class="context-label">Tone of Voice</label>
                        <div class="tone-selector">
                            <button class="tone-btn">Direct</button>
                            <button class="tone-btn active">Provocative</button>
                            <button class="tone-btn">Empathetic</button>
                            <button class="tone-btn">Academic</button>
                        </div>

                        <label class="context-label">Variables</label>
                        <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: var(--text-secondary);">
                            {{first_name}}, {{company}}, {{linkedin_post}}, {{funding_news}}
                        </div>
                    </div>
                </div>

                <div class="studio-panel">
                    <div class="panel-header">
                        <span class="panel-title">Lead Context & Live Preview</span>
                        <button class="tone-btn" style="padding: 2px 8px; border-color: var(--accent-color); color: var(--accent-color);">Regenerate</button>
                    </div>
                    <div class="panel-body" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem;">
                        <div class="context-feed">
                            <div class="context-chip news">
                                <span class="context-label">Company News</span>
                                <p class="context-text">${LeadData.news}</p>
                            </div>
                            <div class="context-chip linkedin">
                                <span class="context-label">Recent LinkedIn</span>
                                <p class="context-text">${LeadData.linkedin}</p>
                            </div>
                        </div>
                        <div class="preview-container">
                            <div class="preview-subject">Subject: Your take on SDR efficiency // Nexus Stream</div>
                            <div class="preview-body" id="email-preview">Hi Alex,

Saw your post about the shift towards automated personalization—hit the nail on the head. Most SDR teams are still spray-and-paying while the tech curve is moving under them.

Congrats on the Series B at Nexus Stream. Building AI video infra is capital intensive, but clearly you're winning the growth game.

We've built an engine that executes exactly the logic you described. Worth a 2-minute look?

Best,
[Your Name]</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('studio-back').addEventListener('click', () => {
            container.innerHTML = this.originalContent;
            this.init();
        });

        this.setupLiveUpdate();
    }

    setupLiveUpdate() {
        const editor = document.getElementById('system-prompt');
        const preview = document.getElementById('email-preview');
        
        editor.addEventListener('input', (e) => {
            if (e.target.value.length % 5 === 0) {
                preview.style.opacity = '0.5';
                setTimeout(() => preview.style.opacity = '1', 200);
            }
        });

        const toneBtns = document.querySelectorAll('.tone-btn');
        toneBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toneBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.studio = new PersonalizationStudio();
});