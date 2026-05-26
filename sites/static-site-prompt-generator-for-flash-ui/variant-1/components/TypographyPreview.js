const TypographyPreview = {
    inject(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const style = document.createElement('style');
        style.textContent = `
            .typo-lab {
                display: grid;
                grid-template-columns: 1fr 1.5fr;
                gap: 20px;
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 24px;
                margin-top: 20px;
            }

            .typo-controls {
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding-right: 20px;
                border-right: 1px solid var(--border);
            }

            .control-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .control-header {
                display: flex;
                justify-content: space-between;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--text-dim);
                text-transform: uppercase;
            }

            .typo-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: var(--border);
                border-radius: 2px;
                outline: none;
                margin: 10px 0;
            }

            .typo-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                background: var(--accent);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px var(--accent-glow);
            }

            .typo-display {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 20px;
                padding-left: 10px;
                min-height: 300px;
            }

            .preview-h1 {
                line-height: 1.1;
                font-weight: 700;
                color: #fff;
                word-break: break-word;
            }

            .preview-p {
                color: var(--text-dim);
                font-family: var(--font-main);
            }

            .token-output {
                grid-column: span 2;
                background: #000;
                border: 1px dashed var(--border);
                padding: 12px;
                border-radius: 8px;
                margin-top: 10px;
                font-family: var(--font-mono);
                font-size: 0.75rem;
                color: var(--accent);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            @media (max-width: 768px) {
                .typo-lab { grid-template-columns: 1fr; }
                .typo-controls { border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; padding-bottom: 20px; }
            }
        `;

        const html = `
            <div class="typo-lab">
                <div class="typo-controls">
                    <div class="card-label">Typography DNA</div>
                    
                    <div class="control-group">
                        <div class="control-header">
                            <span>Heading Size</span>
                            <span id="hSizeVal">4.5rem</span>
                        </div>
                        <input type="range" class="typo-slider" id="hSize" min="2" max="8" step="0.1" value="4.5">
                    </div>

                    <div class="control-group">
                        <div class="control-header">
                            <span>Heading Weight</span>
                            <span id="hWeightVal">700</span>
                        </div>
                        <input type="range" class="typo-slider" id="hWeight" min="300" max="800" step="100" value="700">
                    </div>

                    <div class="control-group">
                        <div class="control-header">
                            <span>Letter Spacing</span>
                            <span id="hSpaceVal">-2px</span>
                        </div>
                        <input type="range" class="typo-slider" id="hSpace" min="-5" max="5" step="0.5" value="-2">
                    </div>

                    <div class="control-group">
                        <div class="control-header">
                            <span>Body Line Height</span>
                            <span id="pHeightVal">1.6</span>
                        </div>
                        <input type="range" class="typo-slider" id="pHeight" min="1" max="2" step="0.1" value="1.6">
                    </div>
                </div>

                <div class="typo-display">
                    <h1 class="preview-h1" id="hPreview">Hyper-Structure</h1>
                    <p class="preview-p" id="pPreview">
                        This is a preview of your custom visual token. The system 
                        automatically adjusts the high-fidelity prompt based on these 
                        geometric parameters.
                    </p>
                </div>

                <div class="token-output">
                    <span id="tokenString">TOKEN: TYPO-H4.5-W700-S-2-LH1.6</span>
                    <button class="btn-outline" style="padding: 4px 10px;" onclick="TypographyPreview.copyToken()">Export Token</button>
                </div>
            </div>
        `;

        document.head.appendChild(style);
        container.innerHTML = html;
        this.initListeners();
    },

    initListeners() {
        const controls = [
            { id: 'hSize', el: 'hPreview', style: 'fontSize', unit: 'rem', valId: 'hSizeVal' },
            { id: 'hWeight', el: 'hPreview', style: 'fontWeight', unit: '', valId: 'hWeightVal' },
            { id: 'hSpace', el: 'hPreview', style: 'letterSpacing', unit: 'px', valId: 'hSpaceVal' },
            { id: 'pHeight', el: 'pPreview', style: 'lineHeight', unit: '', valId: 'pHeightVal' }
        ];

        controls.forEach(ctrl => {
            const slider = document.getElementById(ctrl.id);
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                document.getElementById(ctrl.el).style[ctrl.style] = val + ctrl.unit;
                document.getElementById(ctrl.valId).innerText = val + ctrl.unit;
                this.updateToken();
            });
        });
    },

    updateToken() {
        const hs = document.getElementById('hSize').value;
        const hw = document.getElementById('hWeight').value;
        const hsp = document.getElementById('hSpace').value;
        const ph = document.getElementById('pHeight').value;
        const token = `TYPO-H${hs}-W${hw}-S${hsp}-LH${ph}`;
        document.getElementById('tokenString').innerText = `TOKEN: ${token}`;
    },

    copyToken() {
        const token = document.getElementById('tokenString').innerText;
        navigator.clipboard.writeText(token);
        const btn = document.querySelector('.token-output .btn-outline');
        btn.innerText = "COPIED";
        setTimeout(() => btn.innerText = "Export Token", 2000);
    }
};

window.TypographyPreview = TypographyPreview;