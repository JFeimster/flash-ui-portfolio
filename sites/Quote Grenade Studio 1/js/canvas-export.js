/**
 * QUOTE GRENADE | PAYLOAD CUSTOMIZER
 * Handles high-resolution canvas exports for social media deployment.
 */

(function() {
    const styles = `
        .export-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: none;
            padding: 40px;
            overflow-y: auto;
            backdrop-filter: blur(5px);
        }

        .export-container {
            max-width: 1100px;
            margin: 0 auto;
            background: var(--cream);
            border: 6px solid var(--black);
            display: grid;
            grid-template-columns: 1fr 380px;
            min-height: 600px;
            box-shadow: 20px 20px 0px var(--red);
        }

        @media (max-width: 900px) {
            .export-container { grid-template-columns: 1fr; }
        }

        .export-preview {
            background: #222;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 6px solid var(--black);
        }

        #export-canvas {
            max-width: 100%;
            max-height: 70vh;
            background: white;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        .export-controls {
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            background: var(--white);
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .control-group label {
            font-family: 'IBM Plex Mono', monospace;
            font-weight: bold;
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        .control-group input[type="range"] {
            appearance: none;
            width: 100%;
            height: 12px;
            background: var(--black);
            outline: none;
            border: 2px solid var(--black);
        }

        .control-group input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            background: var(--red);
            cursor: pointer;
            border: 2px solid var(--black);
        }

        .color-swatches {
            display: flex;
            gap: 10px;
        }

        .swatch {
            width: 35px;
            height: 35px;
            border: 3px solid var(--black);
            cursor: pointer;
            transition: transform 0.1s;
        }

        .swatch:hover { transform: scale(1.1); }
        .swatch.active { outline: 3px solid var(--red); outline-offset: 2px; }

        .export-actions {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Build UI Elements
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.id = 'export-modal';
    modal.innerHTML = `
        <div class="export-container">
            <div class="export-preview">
                <canvas id="export-canvas" width="1200" height="1200"></canvas>
            </div>
            <div class="export-controls">
                <h2 style="font-family:'Syne'; text-transform:uppercase; margin-bottom:10px;">Payload Specs</h2>
                
                <div class="control-group">
                    <label>Background Color</label>
                    <div class="color-swatches" id="bg-swatches">
                        <div class="swatch active" data-color="#f4f1ea" style="background:#f4f1ea"></div>
                        <div class="swatch" data-color="#ffffff" style="background:#ffffff"></div>
                        <div class="swatch" data-color="#ff3c00" style="background:#ff3c00"></div>
                        <div class="swatch" data-color="#000000" style="background:#000000"></div>
                    </div>
                </div>

                <div class="control-group">
                    <label>Text Color</label>
                    <div class="color-swatches" id="text-swatches">
                        <div class="swatch active" data-color="#000000" style="background:#000000"></div>
                        <div class="swatch" data-color="#ffffff" style="background:#ffffff"></div>
                        <div class="swatch" data-color="#f4f1ea" style="background:#f4f1ea"></div>
                    </div>
                </div>

                <div class="control-group">
                    <label>Font Size</label>
                    <input type="range" id="font-size-slider" min="40" max="120" value="80">
                </div>

                <div class="control-group">
                    <label>Border Weight</label>
                    <input type="range" id="border-weight-slider" min="0" max="40" value="12">
                </div>

                <div class="export-actions">
                    <button class="btn btn-main" onclick="PayloadCustomizer.download()">DOWNLOAD PNG</button>
                    <button class="btn" onclick="PayloadCustomizer.close()">CANCEL</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Logic Object
    window.PayloadCustomizer = {
        config: {
            fontSize: 80,
            bgColor: '#f4f1ea',
            textColor: '#000000',
            borderWidth: 12,
            padding: 80
        },

        init() {
            const btnContainer = document.querySelector('.generator-grid section div[style*="margin-top"]');
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn';
            exportBtn.style.flex = '1';
            exportBtn.innerText = 'EXPORT IMAGE';
            exportBtn.onclick = () => this.open();
            btnContainer.appendChild(exportBtn);

            this.setupListeners();
        },

        setupListeners() {
            document.getElementById('font-size-slider').oninput = (e) => {
                this.config.fontSize = parseInt(e.target.value);
                this.render();
            };
            document.getElementById('border-weight-slider').oninput = (e) => {
                this.config.borderWidth = parseInt(e.target.value);
                this.render();
            };
            
            document.querySelectorAll('#bg-swatches .swatch').forEach(s => {
                s.onclick = () => {
                    document.querySelectorAll('#bg-swatches .swatch').forEach(x => x.classList.remove('active'));
                    s.classList.add('active');
                    this.config.bgColor = s.dataset.color;
                    this.render();
                };
            });

            document.querySelectorAll('#text-swatches .swatch').forEach(s => {
                s.onclick = () => {
                    document.querySelectorAll('#text-swatches .swatch').forEach(x => x.classList.remove('active'));
                    s.classList.add('active');
                    this.config.textColor = s.dataset.color;
                    this.render();
                };
            });
        },

        open() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.render();
        },

        close() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        },

        wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            let lines = [];

            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
            
            const totalHeight = lines.length * lineHeight;
            let startY = (ctx.canvas.height / 2) - (totalHeight / 2) + (lineHeight / 2);

            for (let k = 0; k < lines.length; k++) {
                ctx.fillText(lines[k].toUpperCase(), x, startY + (k * lineHeight));
            }
        },

        render() {
            const canvas = document.getElementById('export-canvas');
            const ctx = canvas.getContext('2d');
            const text = document.getElementById('quote-text').innerText;
            const meta = document.getElementById('quote-meta').innerText;

            // Background
            ctx.fillStyle = this.config.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Border
            if (this.config.borderWidth > 0) {
                ctx.lineWidth = this.config.borderWidth * 2;
                ctx.strokeStyle = this.config.textColor;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }

            // Text Setup
            ctx.fillStyle = this.config.textColor;
            ctx.textAlign = 'center';
            ctx.font = `800 ${this.config.fontSize}px 'Syne', sans-serif`;
            
            this.wrapText(ctx, text, canvas.width/2, canvas.height/2, canvas.width - (this.config.padding * 2), this.config.fontSize * 1.1);

            // Meta
            ctx.font = `500 24px 'IBM Plex Mono', monospace`;
            ctx.textAlign = 'left';
            const metaPadding = this.config.padding + (this.config.borderWidth);
            ctx.fillText(meta, metaPadding, canvas.height - metaPadding);
            
            // Logo Mark
            ctx.textAlign = 'right';
            ctx.fillText('QUOTE GRENADE v1.0', canvas.width - metaPadding, canvas.height - metaPadding);
        },

        download() {
            const canvas = document.getElementById('export-canvas');
            const link = document.createElement('a');
            link.download = `grenade-payload-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        }
    };

    // Initialize on load
    if (document.readyState === 'complete') {
        PayloadCustomizer.init();
    } else {
        window.addEventListener('load', () => PayloadCustomizer.init());
    }
})();