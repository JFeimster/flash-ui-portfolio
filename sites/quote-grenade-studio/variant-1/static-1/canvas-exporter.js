const VisualFallout = {
    themes: {
        'anarcho-black': { bg: '#000000', text: '#ffffff', accent: '#ff3c00' },
        'warning-red': { bg: '#ff3c00', text: '#000000', accent: '#ffffff' },
        'vintage-cream': { bg: '#f4f1ea', text: '#000000', accent: '#ff3c00' }
    },
    
    currentTheme: 'anarcho-black',
    borderWeight: 20,

    init() {
        this.injectStyles();
        this.injectUI();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fallout-customizer {
                border: 4px solid #000;
                background: #fff;
                margin-top: 20px;
                padding: 20px;
                box-shadow: 8px 8px 0px #000;
            }
            .customizer-title {
                font-family: 'Syne', sans-serif;
                font-weight: 800;
                font-size: 1.2rem;
                margin-bottom: 15px;
                text-transform: uppercase;
                border-bottom: 4px solid #000;
                display: inline-block;
            }
            .theme-selector {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .theme-swatch {
                width: 40px;
                height: 40px;
                border: 3px solid #000;
                cursor: pointer;
                transition: transform 0.1s;
            }
            .theme-swatch:hover { transform: scale(1.1); }
            .theme-swatch.active { outline: 3px solid #ff3c00; outline-offset: 2px; }
            .range-input {
                width: 100%;
                margin: 10px 0;
                accent-color: #ff3c00;
            }
            #export-preview-canvas {
                display: none;
            }
        `;
        document.head.appendChild(style);
    },

    injectUI() {
        const container = document.querySelector('aside.controls');
        if (!container) return;

        const customizerHTML = `
            <div class="fallout-customizer">
                <div class="customizer-title">Visual Fallout Tool</div>
                <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; margin-bottom: 10px;">[ THEME SELECTION ]</div>
                <div class="theme-selector">
                    <div class="theme-swatch active" data-theme="anarcho-black" style="background: #000;"></div>
                    <div class="theme-swatch" data-theme="warning-red" style="background: #ff3c00;"></div>
                    <div class="theme-swatch" data-theme="vintage-cream" style="background: #f4f1ea;"></div>
                </div>
                
                <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; margin-bottom: 5px;">[ BORDER THICKNESS ]</div>
                <input type="range" class="range-input" min="0" max="60" value="20" id="border-range">
                
                <button class="btn" style="width: 100%; margin-top: 10px; background: #000; color: #fff;" onclick="VisualFallout.exportPNG()">EXPORT .PNG</button>
                <canvas id="export-preview-canvas" width="1080" height="1080"></canvas>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = customizerHTML;
        container.appendChild(wrapper);

        // Event Listeners
        document.querySelectorAll('.theme-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTheme = e.target.dataset.theme;
            });
        });

        document.getElementById('border-range').addEventListener('input', (e) => {
            this.borderWeight = parseInt(e.target.value);
        });
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
        return lines;
    },

    async exportPNG() {
        const canvas = document.getElementById('export-preview-canvas');
        const ctx = canvas.getContext('2d');
        const theme = this.themes[this.currentTheme];
        const quote = document.getElementById('quote-text').innerText;
        const meta = document.getElementById('quote-meta').innerText;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        if (this.borderWeight > 0) {
            ctx.strokeStyle = theme.accent;
            ctx.lineWidth = this.borderWeight;
            ctx.strokeRect(this.borderWeight/2, this.borderWeight/2, canvas.width - this.borderWeight, canvas.height - this.borderWeight);
        }

        // Header Text
        ctx.fillStyle = theme.accent;
        ctx.font = "900 30px 'Space Grotesk'";
        ctx.fillText("QUOTE GRENADE // UNSTABLE CONTENT", 60, 90);
        
        ctx.beginPath();
        ctx.moveTo(60, 110);
        ctx.lineTo(1020, 110);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Quote Text
        ctx.fillStyle = theme.text;
        ctx.font = "800 80px 'Syne'";
        const maxWidth = 900;
        const lineHeight = 95;
        const x = 60;
        const lines = this.wrapText(ctx, quote.toUpperCase(), x, 0, maxWidth, lineHeight);
        
        // Vertical Center
        const totalHeight = lines.length * lineHeight;
        let y = (canvas.height / 2) - (totalHeight / 2);

        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), x, y + (index * lineHeight));
        });

        // Footer Meta
        ctx.fillStyle = theme.bg;
        const metaText = meta.split('//')[0].trim();
        const metaWidth = ctx.measureText(metaText).width + 40;
        
        ctx.fillStyle = theme.text === '#ffffff' ? '#ffffff' : '#000000';
        ctx.fillRect(60, canvas.height - 120, metaWidth, 50);
        
        ctx.fillStyle = theme.text === '#ffffff' ? '#000000' : '#ffffff';
        ctx.font = "500 24px 'IBM Plex Mono'";
        ctx.fillText(metaText, 80, canvas.height - 85);

        // Download
        const link = document.createElement('a');
        link.download = `grenade-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
};

// Auto-init when loaded
if (document.readyState === 'complete') {
    VisualFallout.init();
} else {
    window.addEventListener('load', () => VisualFallout.init());
}