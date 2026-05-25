const visualizerStyles = `
    .visualizer-studio {
        margin-top: 40px;
        padding: 30px;
        background: #fff;
        border: var(--border);
        box-shadow: var(--shadow);
    }
    .studio-title {
        font-family: 'Archivo Black', sans-serif;
        font-size: 1.5rem;
        margin-bottom: 20px;
        border-bottom: 2px solid var(--black);
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .control-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    .control-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .control-group label {
        font-family: 'Space Mono', monospace;
        font-weight: bold;
        font-size: 0.8rem;
        text-transform: uppercase;
    }
    .theme-toggle {
        display: flex;
        gap: 10px;
    }
    .theme-btn {
        flex: 1;
        padding: 10px;
        border: 2px solid var(--black);
        font-family: 'Archivo Black', sans-serif;
        font-size: 0.7rem;
        cursor: pointer;
        transition: 0.2s;
    }
    .theme-btn.red { background: var(--red); color: white; }
    .theme-btn.black { background: var(--black); color: var(--red); }
    .theme-btn.active { outline: 4px solid var(--black); outline-offset: 2px; }
    
    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
    }
    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        background: var(--black);
        border: none;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 2px solid var(--black);
        height: 20px;
        width: 20px;
        background: var(--red);
        margin-top: -6px;
        cursor: pointer;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = visualizerStyles;
document.head.appendChild(styleSheet);

const studioHTML = `
    <div class="visualizer-studio">
        <div class="studio-title">
            BLAST RADIUS VISUALIZER
            <span style="font-size: 0.7rem; background: var(--black); color: #fff; padding: 2px 8px;">V1.0</span>
        </div>
        <div class="control-grid">
            <div class="control-group">
                <label>Theme Profile</label>
                <div class="theme-toggle">
                    <button class="theme-btn red active" data-theme="red">HIGH ALERT</button>
                    <button class="theme-btn black" data-theme="black">DEEP STATE</button>
                </div>
            </div>
            <div class="control-group">
                <label>Shrapnel Scale (Font)</label>
                <input type="range" id="font-scale" min="40" max="100" value="70">
            </div>
        </div>
        <button class="btn btn-main" id="download-canvas" style="width: 100%; font-size: 1.2rem;">EXPORT AS PNG</button>
    </div>
`;

const generatorBox = document.querySelector('.generator-box');
const visualizerContainer = document.createElement('div');
visualizerContainer.innerHTML = studioHTML;
generatorBox.appendChild(visualizerContainer);

const canvasExport = {
    theme: 'red',
    fontSize: 70,
    
    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.theme = e.target.dataset.theme;
            });
        });

        document.getElementById('font-scale').addEventListener('input', (e) => {
            this.fontSize = e.target.value;
        });

        document.getElementById('download-canvas').addEventListener('click', () => {
            this.generate();
        });
    },

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

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
        return lines;
    },

    async generate() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        const isRed = this.theme === 'red';
        const bgColor = isRed ? '#FF0000' : '#000000';
        const textColor = isRed ? '#FFFFFF' : '#FF0000';
        const borderColor = isRed ? '#000000' : '#FFFFFF';

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.lineWidth = 40;
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Quote Content
        const rawText = document.getElementById('quote-text').innerText;
        const catText = document.getElementById('quote-cat').innerText;

        // Draw Category
        ctx.fillStyle = borderColor;
        ctx.fillRect(80, 80, 300, 60);
        ctx.font = 'bold 30px "Space Mono"';
        ctx.fillStyle = isRed ? '#FFFFFF' : '#000000';
        ctx.fillText(catText, 100, 120);

        // Main Quote
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const size = parseInt(this.fontSize);
        ctx.font = `900 ${size}px "Archivo Black"`;
        
        const maxWidth = 880;
        const lineHeight = size * 1.2;
        const lines = this.wrapText(ctx, rawText.replace(/[“”]/g, ''), 540, 540, maxWidth, lineHeight);
        
        const totalHeight = lines.length * lineHeight;
        let startY = (canvas.height / 2) - (totalHeight / 2) + (lineHeight / 2);

        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), 540, startY + (i * lineHeight));
        });

        // Branding
        ctx.fillStyle = borderColor;
        ctx.font = 'bold 24px "Space Mono"';
        ctx.textAlign = 'right';
        ctx.fillText('QUOTEGRENADE.TOOL // PULL THE PIN', 1000, 1020);

        // Download
        const link = document.createElement('a');
        link.download = `quote-grenade-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
};

canvasExport.init();