/**
 * Chroma Forge: Visual Style Lab
 * Part of FLASH-UI // System Utilities
 * Generates cryptographic Visual Style Tokens for design injection.
 */

class TokenGenerator {
    constructor(options = {}) {
        this.state = {
            accent: options.accent || '#00f2ff',
            glow: options.glow || 'rgba(0, 242, 255, 0.3)',
            surface: options.surface || '#0d0d0d',
            radius: options.radius || '12',
            font: options.font || 'Space Grotesk',
            density: options.density || 'medium'
        };
        this.initStyles();
    }

    initStyles() {
        if (document.getElementById('forge-internal-styles')) return;
        const style = document.createElement('style');
        style.id = 'forge-internal-styles';
        style.textContent = `
            .forge-wrapper {
                background: var(--card-bg, #0d0d0d);
                border: 1px solid var(--border, #222);
                border-radius: 16px;
                padding: 24px;
                font-family: 'Space Grotesk', sans-serif;
                margin-top: 20px;
                position: relative;
                overflow: hidden;
            }
            .forge-wrapper::before {
                content: 'CHROMA FORGE V1.0';
                position: absolute;
                top: 10px;
                right: 15px;
                font-family: 'Space Mono', monospace;
                font-size: 0.6rem;
                color: #444;
            }
            .forge-title {
                font-family: 'Space Mono', monospace;
                font-size: 0.8rem;
                color: var(--accent, #00f2ff);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .forge-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 20px;
            }
            .forge-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .forge-label {
                font-size: 0.7rem;
                color: #888;
                text-transform: uppercase;
                font-weight: 700;
            }
            .forge-input-color {
                width: 100%;
                height: 38px;
                border: 1px solid #333;
                background: #050505;
                padding: 4px;
                border-radius: 4px;
                cursor: pointer;
            }
            .forge-input-range {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: #222;
                border-radius: 2px;
                outline: none;
            }
            .forge-input-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                background: var(--accent, #00f2ff);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 8px var(--accent, #00f2ff);
            }
            .forge-select {
                background: #111;
                border: 1px solid #333;
                color: #fff;
                padding: 8px;
                border-radius: 4px;
                font-size: 0.85rem;
            }
            .forge-preview {
                margin-top: 25px;
                background: #050505;
                border: 1px solid #222;
                border-radius: var(--p-radius, 12px);
                padding: 20px;
                position: relative;
            }
            .forge-preview-chip {
                display: inline-block;
                padding: 4px 12px;
                background: var(--p-accent, #00f2ff);
                color: #000;
                font-size: 0.7rem;
                font-weight: 700;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            .forge-token-display {
                margin-top: 20px;
                background: rgba(0, 242, 255, 0.05);
                border: 1px dashed var(--accent, #00f2ff);
                padding: 15px;
                border-radius: 8px;
                font-family: 'Space Mono', monospace;
                font-size: 0.75rem;
                color: var(--accent, #00f2ff);
                word-break: break-all;
                cursor: pointer;
                transition: all 0.2s;
            }
            .forge-token-display:hover {
                background: rgba(0, 242, 255, 0.1);
            }
            .forge-status {
                margin-top: 10px;
                font-size: 0.65rem;
                color: #555;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    createToken() {
        const payload = {
            acc: this.state.accent,
            rad: this.state.radius,
            fnt: this.state.font,
            den: this.state.density,
            ts: Date.now()
        };
        const raw = JSON.stringify(payload);
        return `FLASH_${btoa(raw).replace(/=/g, '')}`;
    }

    mount(elementId) {
        const target = document.getElementById(elementId);
        if (!target) return;
        this.render(target);
    }

    update(key, value, target) {
        this.state[key] = value;
        this.render(target);
    }

    render(target) {
        const token = this.createToken();
        target.innerHTML = `
            <div class="forge-wrapper" style="--p-accent: ${this.state.accent}; --p-radius: ${this.state.radius}px;">
                <div class="forge-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Chroma Forge // Visual Style Lab
                </div>

                <div class="forge-controls">
                    <div class="forge-field">
                        <label class="forge-label">Brand Accent</label>
                        <input type="color" class="forge-input-color" value="${this.state.accent}" id="f-accent">
                    </div>
                    <div class="forge-field">
                        <label class="forge-label">Hardness (Radius)</label>
                        <input type="range" class="forge-input-range" min="0" max="30" value="${this.state.radius}" id="f-radius">
                    </div>
                    <div class="forge-field">
                        <label class="forge-label">Typography</label>
                        <select class="forge-select" id="f-font">
                            <option value="Space Grotesk" ${this.state.font === 'Space Grotesk' ? 'selected' : ''}>Space Grotesk</option>
                            <option value="Space Mono" ${this.state.font === 'Space Mono' ? 'selected' : ''}>Technical Mono</option>
                            <option value="Inter" ${this.state.font === 'Inter' ? 'selected' : ''}>Neutral Sans</option>
                        </select>
                    </div>
                </div>

                <div class="forge-preview">
                    <div class="forge-preview-chip">DNA PREVIEW</div>
                    <h4 style="margin: 0 0 10px 0; font-family: ${this.state.font}">The grid is the canvas.</h4>
                    <p style="font-size: 0.8rem; color: #888; margin: 0; font-family: ${this.state.font}">
                        Implementing visual tokens for a ${this.state.radius}px radius architecture.
                    </p>
                </div>

                <div class="forge-token-display" id="f-copy">
                    ${token}
                </div>
                <div class="forge-status">CLICK TOKEN TO SYNC WITH PROMPT ENGINE</div>
            </div>
        `;

        // Listeners
        target.querySelector('#f-accent').addEventListener('input', (e) => this.update('accent', e.target.value, target));
        target.querySelector('#f-radius').addEventListener('input', (e) => this.update('radius', e.target.value, target));
        target.querySelector('#f-font').addEventListener('change', (e) => this.update('font', e.target.value, target));
        
        target.querySelector('#f-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(token);
            const disp = target.querySelector('#f-copy');
            const original = disp.innerText;
            disp.innerText = "TOKEN COPIED TO SYSTEM CLIPBOARD";
            disp.style.borderColor = "#fff";
            setTimeout(() => {
                disp.innerText = token;
                disp.style.borderColor = this.state.accent;
            }, 1000);
        });
    }
}

window.ChromaForge = TokenGenerator;