/**
 * metrics-charts.js
 * Part of Campaign Command Center: High-level dashboard for real-time outbound visibility.
 */

class CampaignCommandCenter {
    constructor() {
        this.colors = {
            accent: '#00f2ff',
            success: '#00ff88',
            border: '#222222',
            textDim: '#777777',
            textMain: '#e0e0e0',
            bg: '#050505'
        };
        this.fonts = {
            mono: '10px "JetBrains Mono", monospace',
            sans: '11px "Inter", sans-serif'
        };
        this.init();
    }

    init() {
        this.injectStyles();
        this.createDashboard();
        this.renderVolumeChart();
        this.renderCityDistribution();
        this.startRealtimeUpdates();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .command-center-grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 20px;
                margin-top: 20px;
                animation: fadeIn 1.2s ease-out;
            }
            .chart-card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 16px;
                position: relative;
            }
            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .chart-title {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-dim);
                font-weight: 600;
            }
            .chart-value {
                font-family: var(--font-mono);
                color: var(--accent);
                font-size: 14px;
            }
            canvas {
                width: 100% !important;
                height: 140px !important;
            }
            .distribution-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .dist-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .dist-info {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                font-family: var(--font-mono);
            }
            .dist-bar-bg {
                height: 4px;
                background: #1a1a1a;
                border-radius: 2px;
                overflow: hidden;
            }
            .dist-bar-fill {
                height: 100%;
                background: var(--accent);
                width: 0%;
                transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 10px var(--accent-soft);
            }
        `;
        document.head.appendChild(style);
    }

    createDashboard() {
        const console = document.querySelector('.engine-console');
        const grid = document.createElement('div');
        grid.className = 'command-center-grid';
        
        grid.innerHTML = `
            <div class="chart-card">
                <div class="chart-header">
                    <span class="chart-title">Outbound Volume (7D)</span>
                    <span class="chart-value" id="total-vol">8,421 units</span>
                </div>
                <canvas id="volumeChart"></canvas>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <span class="chart-title">Geo-Niche Reach</span>
                    <span class="chart-value">Active</span>
                </div>
                <div class="distribution-list" id="geo-list">
                    ${this.renderDistRow('Austin / Fintech', 85)}
                    ${this.renderDistRow('SF / SaaS', 62)}
                    ${this.renderDistRow('NYC / Web3', 41)}
                    ${this.renderDistRow('London / AI', 28)}
                </div>
            </div>
        `;
        
        // Insert before footer meta
        console.insertBefore(grid, console.lastElementChild);
    }

    renderDistRow(label, percent) {
        return `
            <div class="dist-row">
                <div class="dist-info">
                    <span style="color: var(--text-dim)">${label}</span>
                    <span style="color: var(--text-main)">${percent}%</span>
                </div>
                <div class="dist-bar-bg">
                    <div class="dist-bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    }

    renderVolumeChart() {
        const canvas = document.getElementById('volumeChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);

        const data = [40, 65, 55, 90, 75, 110, 95];
        const padding = 20;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const stepX = (width - (padding * 2)) / (data.length - 1);

        // Draw Grid
        ctx.strokeStyle = this.colors.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i = 0; i < 4; i++) {
            const y = padding + (i * (height - padding * 2) / 3);
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
        }
        ctx.stroke();

        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        data.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = height - padding - (val / 120 * (height - padding * 2));
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Gradient Fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');
        
        ctx.lineTo(padding + (data.length - 1) * stepX, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Data Points
        ctx.fillStyle = this.colors.accent;
        data.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = height - padding - (val / 120 * (height - padding * 2));
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    renderCityDistribution() {
        // Bars are handled via CSS transition on width defined in renderDistRow
    }

    startRealtimeUpdates() {
        setInterval(() => {
            const volEl = document.getElementById('total-vol');
            if (volEl) {
                const current = parseInt(volEl.textContent.replace(/,/g, ''));
                const next = current + Math.floor(Math.random() * 5);
                volEl.textContent = next.toLocaleString() + ' units';
            }

            // Randomly pulse a bar
            const bars = document.querySelectorAll('.dist-bar-fill');
            const randomBar = bars[Math.floor(Math.random() * bars.length)];
            const currentWidth = parseFloat(randomBar.style.width);
            const shift = (Math.random() - 0.5) * 2;
            randomBar.style.width = Math.min(100, Math.max(10, currentWidth + shift)) + '%';
        }, 3000);
    }
}

// Initialize on Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CampaignCommandCenter());
} else {
    new CampaignCommandCenter();
}