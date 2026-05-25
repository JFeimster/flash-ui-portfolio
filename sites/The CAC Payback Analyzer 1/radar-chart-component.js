class IndustryRadarChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.metrics = [
            { label: 'PAYBACK SPEED', key: 'payback' },
            { label: 'CAC EFFICIENCY', key: 'cac' },
            { label: 'MARGIN STRENGTH', key: 'margin' },
            { label: 'ARPU SCALING', key: 'arpu' },
            { label: 'LTV POTENTIAL', key: 'ltv' }
        ];

        this.benchmarks = {
            saas: [0.6, 0.7, 0.9, 0.8, 0.9],
            ecom: [0.9, 0.5, 0.4, 0.3, 0.4],
            b2b: [0.4, 0.6, 0.8, 0.9, 0.7]
        };

        this.userData = [0, 0, 0, 0, 0];
        
        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.animate();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);
        this.size = Math.min(rect.width, rect.height);
    }

    updateData(inputs) {
        const { spend, customers, arpu, margin } = inputs;
        const cac = spend / customers || 0;
        const contributionMargin = arpu * (margin / 100) || 0;
        const payback = contributionMargin > 0 ? cac / contributionMargin : 18;

        // Normalize metrics 0.0 to 1.0 for chart
        const nPayback = Math.max(0, Math.min(1, 1 - (payback / 18)));
        const nCac = Math.max(0, Math.min(1, 1000 / (cac + 1))); 
        const nMargin = margin / 100;
        const nArpu = Math.min(1, arpu / 1000);
        const nLtv = Math.min(1, (contributionMargin * 24) / (cac + 1));

        this.userData = [nPayback, nCac, nMargin, nArpu, nLtv];
    }

    drawGrid(centerX, centerY, radius) {
        const levels = 4;
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 1; i <= levels; i++) {
            const r = (radius / levels) * i;
            this.ctx.beginPath();
            for (let j = 0; j < this.metrics.length; j++) {
                const angle = (Math.PI * 2 / this.metrics.length) * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (j === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        // Axis lines
        this.metrics.forEach((m, i) => {
            const angle = (Math.PI * 2 / this.metrics.length) * i - Math.PI / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            this.ctx.stroke();

            // Labels
            this.ctx.font = '700 10px "JetBrains Mono"';
            this.ctx.fillStyle = '#889990';
            this.ctx.textAlign = 'center';
            const lx = centerX + Math.cos(angle) * (radius + 25);
            const ly = centerY + Math.sin(angle) * (radius + 25);
            this.ctx.fillText(m.label, lx, ly);
        });
    }

    drawShape(data, centerX, centerY, radius, color, fill, glow = false) {
        this.ctx.beginPath();
        data.forEach((val, i) => {
            const angle = (Math.PI * 2 / this.metrics.length) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius * val;
            const y = centerY + Math.sin(angle) * radius * val;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.closePath();

        if (glow) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
        }

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = fill;
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
    }

    animate() {
        const centerX = this.canvas.width / (2 * (window.devicePixelRatio || 1));
        const centerY = this.canvas.height / (2 * (window.devicePixelRatio || 1));
        const radius = this.size * 0.3;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid(centerX, centerY, radius);
        
        // Industry Comparison (SaaS Average)
        this.drawShape(
            this.benchmarks.saas, 
            centerX, centerY, radius, 
            'rgba(255, 255, 255, 0.1)', 
            'rgba(255, 255, 255, 0.02)'
        );

        // User Data
        this.drawShape(
            this.userData, 
            centerX, centerY, radius, 
            '#00ff88', 
            'rgba(0, 255, 136, 0.15)',
            true
        );

        requestAnimationFrame(() => this.animate());
    }
}

// Integration Styles
const style = document.createElement('style');
style.textContent = `
    .radar-wrapper {
        grid-column: span 2;
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--emerald-dim);
        border-radius: 16px;
        padding: 30px;
        margin-top: 20px;
        position: relative;
        overflow: hidden;
    }
    .radar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .radar-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: var(--emerald);
        letter-spacing: 1px;
    }
    .radar-legend {
        display: flex;
        gap: 15px;
        font-size: 0.7rem;
        font-family: 'JetBrains Mono', monospace;
    }
    .legend-item { display: flex; align-items: center; gap: 5px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.user { background: var(--emerald); box-shadow: 0 0 5px var(--emerald); }
    .dot.bench { background: rgba(255,255,255,0.3); }
    #radar-chart-container {
        width: 100%;
        height: 350px;
    }
`;
document.head.appendChild(style);

// DOM Injection
const ctaContainer = document.querySelector('.cta-container');
const radarWrapper = document.createElement('div');
radarWrapper.className = 'radar-wrapper';
radarWrapper.innerHTML = `
    <div class="radar-header">
        <div class="radar-title">INDUSTRY BENCHMARK COMPARISON</div>
        <div class="radar-legend">
            <div class="legend-item"><span class="dot user"></span> YOUR ENGINE</div>
            <div class="legend-item"><span class="dot bench"></span> SAAS AVG</div>
        </div>
    </div>
    <div id="radar-chart-container"></div>
`;
ctaContainer.parentNode.insertBefore(radarWrapper, ctaContainer);

const radar = new IndustryRadarChart('radar-chart-container');

// Hook into existing analyzer logic
const originalUpdate = window.updateAnalyzer;
window.updateAnalyzer = function() {
    if (originalUpdate) originalUpdate();
    
    const inputs = {
        spend: parseFloat(document.getElementById('spend').value) || 0,
        customers: parseFloat(document.getElementById('customers').value) || 0,
        arpu: parseFloat(document.getElementById('arpu').value) || 0,
        margin: parseFloat(document.getElementById('margin').value) || 0
    };
    
    radar.updateData(inputs);
};

// Initial update
window.updateAnalyzer();