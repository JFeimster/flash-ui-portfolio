class ChromaForge {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.state = {
            primary: '#00f2ff',
            secondary: '#7000ff',
            surface: '#0d0d0d',
            fontPair: 'Space Grotesk / Space Mono',
            glitch: true
        };
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const style = `
            .chroma-forge {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 24px;
                font-family: var(--font-main);
            }

            .forge-controls {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .control-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .control-label {
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--accent);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .color-picker-wrapper {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .color-input-custom {
                -webkit-appearance: none;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                background: none;
            }

            .color-input-custom::-webkit-color-swatch-wrapper { padding: 0; }
            .color-input-custom::-webkit-color-swatch {
                border: 2px solid var(--border);
                border-radius: 8px;
            }

            .hex-display {
                font-family: var(--font-mono);
                font-size: 0.8rem;
                color: var(--text-dim);
                background: var(--glass);
                padding: 4px 10px;
                border-radius: 4px;
                border: 1px solid var(--border);
            }

            .forge-preview {
                background: #050505;
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
            }

            .preview-ui-mockup {
                border: 1px solid var(--primary);
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 0 20px var(--primary-glow);
                background: linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(20,20,20,1) 100%);
            }

            .preview-text {
                font-family: var(--font-main);
                color: white;
                margin-bottom: 10px;
                font-size: 1.2rem;
                font-weight: 700;
            }

            .preview-btn {
                background: var(--secondary);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-family: var(--font-mono);
                display: inline-block;
                text-transform: uppercase;
            }

            .token-output {
                grid-column: span 2;
                background: rgba(0,0,0,0.5);
                border: 1px dashed var(--border);
                padding: 15px;
                border-radius: 8px;
                margin-top: 10px;
            }

            .token-text {
                font-family: var(--font-mono);
                font-size: 0.75rem;
                color: #00ff41; /* Matrix green for the token */
                white-space: pre-wrap;
                word-break: break-all;
            }

            @media (max-width: 768px) {
                .chroma-forge { grid-template-columns: 1fr; }
                .token-output { grid-column: span 1; }
            }
        `;

        const html = `
            <style>${style}</style>
            <div class="chroma-forge">
                <div class="forge-controls">
                    <div class="card-label">Chroma Forge // Visual Style Lab</div>
                    
                    <div class="control-group">
                        <label class="control-label">Primary Identity</label>
                        <div class="color-picker-wrapper">
                            <input type="color" id="primaryPick" class="color-input-custom" value="${this.state.primary}">
                            <span class="hex-display" id="primaryHex">${this.state.primary}</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label">Accent Action</label>
                        <div class="color-picker-wrapper">
                            <input type="color" id="secondaryPick" class="color-input-custom" value="${this.state.secondary}">
                            <span class="hex-display" id="secondaryHex">${this.state.secondary}</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label">Typography Preset</label>
                        <select id="fontSelect" style="margin-top:0">
                            <option value="Space Grotesk / Space Mono">Cyber-Technical</option>
                            <option value="Inter / Roboto Mono">Modern SaaS</option>
                            <option value="Playfair Display / Montserrat">Luxury Minimal</option>
                            <option value="Archivo Black / Courier">Brutalist</option>
                        </select>
                    </div>
                </div>

                <div class="forge-preview" id="forgePreview">
                    <div class="preview-ui-mockup" id="mockupCard">
                        <div class="preview-text">System Overdrive</div>
                        <div class="preview-btn" id="mockupBtn">Execute Protocol</div>
                    </div>
                    <div style="margin-top: 15px; font-size: 0.6rem; color: var(--text-dim); font-family: var(--font-mono);">
                        REAL-TIME STYLE PREVIEW
                    </div>
                </div>

                <div class="token-output">
                    <div class="control-label" style="margin-bottom: 8px;">Visual Style Token [Injectable]</div>
                    <div class="token-text" id="tokenDisplay"></div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.updateStyles();
    }

    setupEventListeners() {
        const pPick = document.getElementById('primaryPick');
        const sPick = document.getElementById('secondaryPick');
        const fSelect = document.getElementById('fontSelect');

        pPick.addEventListener('input', (e) => {
            this.state.primary = e.target.value;
            document.getElementById('primaryHex').innerText = this.state.primary;
            this.updateStyles();
        });

        sPick.addEventListener('input', (e) => {
            this.state.secondary = e.target.value;
            document.getElementById('secondaryHex').innerText = this.state.secondary;
            this.updateStyles();
        });

        fSelect.addEventListener('change', (e) => {
            this.state.fontPair = e.target.value;
            this.updateStyles();
        });
    }

    updateStyles() {
        const mockupCard = document.getElementById('mockupCard');
        const mockupBtn = document.getElementById('mockupBtn');
        const tokenDisplay = document.getElementById('tokenDisplay');

        mockupCard.style.borderColor = this.state.primary;
        mockupCard.style.boxShadow = `0 0 20px ${this.state.primary}44`;
        mockupBtn.style.backgroundColor = this.state.secondary;

        const token = {
            v: "1.0",
            p: this.state.primary,
            s: this.state.secondary,
            f: this.state.fontPair,
            mode: "dark-core"
        };

        const tokenString = `FLASH_TOKEN::${btoa(JSON.stringify(token))}`;
        tokenDisplay.innerText = tokenString;
        
        // Expose to window for main script
        window.activeStyleToken = tokenString;
    }
}

// Auto-initialize if container exists
if (document.getElementById('chromaForgeContainer')) {
    new ChromaForge('chromaForgeContainer');
} else {
    // Fallback for direct integration into bento-grid
    const bento = document.querySelector('.bento-grid');
    if (bento) {
        const forgeWrapper = document.createElement('div');
        forgeWrapper.id = 'chromaForgeContainer';
        forgeWrapper.style.gridColumn = 'span 12';
        bento.insertBefore(forgeWrapper, document.querySelector('.btn-generate'));
        new ChromaForge('chromaForgeContainer');
    }
}