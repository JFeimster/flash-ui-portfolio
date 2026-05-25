/**
 * OXIDIZED LEDGER | CHART-ENGINE.JS
 * High-performance, brutalist financial visualization engine.
 * Specifically for Individual Asset Dossier / Deep-Dive Tear Sheets.
 */

class OxidizedChart {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.colors = {
            obsidian: '#050505',
            bone: '#F5F5F0',
            acidGreen: '#C1FF00',
            copper: '#8E593E',
            bloodOrange: '#FF3D00',
            graphite: '#1A1A1A',
            muted: '#444444'
        };

        this.padding = 40;
        this.dpr = window.devicePixelRatio || 1;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height || 300;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(this.dpr, this.dpr);
    }

    clear() {
        this.ctx.fillStyle = this.colors.obsidian;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw Brutalist Grid
        this.ctx.strokeStyle = this.colors.graphite;
        this.ctx.lineWidth = 1;
        const gridSize = 40;
        
        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Renders a comparison between SDE and EBITDA over years
     */
    renderFinancials(data) {
        this.clear();
        const { labels, sde, ebitda } = data;
        const maxVal = Math.max(...sde, ...ebitda) * 1.2;
        const chartWidth = this.width - (this.padding * 2);
        const chartHeight = this.height - (this.padding * 2);
        const barWidth = (chartWidth / labels.length) * 0.4;

        labels.forEach((label, i) => {
            const x = this.padding + (i * (chartWidth / labels.length)) + (chartWidth / labels.length / 2);
            
            // Calc heights
            const sdeH = (sde[i] / maxVal) * chartHeight;
            const ebitdaH = (ebitda[i] / maxVal) * chartHeight;

            // EBITDA Bar (Back)
            this.ctx.fillStyle = this.colors.copper;
            this.ctx.fillRect(x - barWidth, this.height - this.padding - ebitdaH, barWidth, ebitdaH);
            
            // SDE Bar (Front)
            this.ctx.fillStyle = this.colors.acidGreen;
            this.ctx.fillRect(x, this.height - this.padding - sdeH, barWidth, sdeH);

            // Labels
            this.ctx.fillStyle = this.colors.muted;
            this.ctx.font = '900 10px "JetBrains Mono"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label.toUpperCase(), x, this.height - (this.padding / 2));
            
            // Values
            this.ctx.fillStyle = this.colors.bone;
            this.ctx.fillText(`$${(sde[i]/1000).toFixed(0)}K`, x + (barWidth/2), this.height - this.padding - sdeH - 10);
        });

        // Legend
        this.drawLegend([
            { label: 'SDE', color: this.colors.acidGreen },
            { label: 'EBITDA', color: this.colors.copper }
        ]);
    }

    /**
     * Renders a simple performance line chart
     */
    renderTrend(data) {
        this.clear();
        const { points } = data;
        const maxVal = Math.max(...points) * 1.1;
        const chartWidth = this.width - (this.padding * 2);
        const chartHeight = this.height - (this.padding * 2);

        this.ctx.strokeStyle = this.colors.bloodOrange;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        points.forEach((p, i) => {
            const x = this.padding + (i * (chartWidth / (points.length - 1)));
            const y = this.height - this.padding - ((p / maxVal) * chartHeight);
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
            
            // Points
            this.ctx.fillStyle = this.colors.obsidian;
            this.ctx.fillRect(x - 4, y - 4, 8, 8);
            this.ctx.strokeStyle = this.colors.bloodOrange;
            this.ctx.strokeRect(x - 4, y - 4, 8, 8);
        });
        
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.bone;
        this.ctx.font = '700 10px "JetBrains Mono"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText("HISTORICAL PERFORMANCE TREND", this.padding, 25);
    }

    drawLegend(items) {
        items.forEach((item, i) => {
            const x = this.padding + (i * 100);
            const y = 25;
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(x, y - 8, 12, 12);
            this.ctx.fillStyle = this.colors.bone;
            this.ctx.font = '700 10px "JetBrains Mono"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(item.label, x + 18, y);
        });
    }
}

/**
 * DOSSIER GENERATOR
 * Injects a high-end tear sheet into a target element
 */
const DossierEngine = {
    generate(deal) {
        return `
            <div style="background: var(--obsidian); border: 2px solid var(--bone); color: var(--bone); font-family: 'Inter', sans-serif;">
                <!-- Header / Tear Sheet Style -->
                <div style="padding: 3rem; border-bottom: 2px solid var(--graphite); display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <span class="mono" style="color: var(--oxidized-copper); font-size: 0.8rem; letter-spacing: 2px;">FILE ID: 00${deal.id}-ASSET-DOSSIER</span>
                        <h1 style="font-size: 4rem; font-weight: 900; line-height: 0.8; margin-top: 1rem; text-transform: uppercase;">${deal.title}</h1>
                        <p class="mono" style="margin-top: 1.5rem; color: #888;">LOCATED: ${deal.location} | ESTABLISHED: 2014</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="mono" style="font-size: 0.7rem; display: block; margin-bottom: 0.5rem;">ASKING PRICE</span>
                        <span style="font-size: 3rem; font-family: 'JetBrains Mono'; color: var(--acid-green); font-weight: 700;">$${(deal.price / 1000000).toFixed(2)}M</span>
                    </div>
                </div>

                <!-- Main Metrics Grid -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 2px solid var(--graphite);">
                    ${[
                        { l: 'Revenue', v: `$${(deal.revenue/1000000).toFixed(1)}M`, sub: 'TTM' },
                        { l: 'SDE', v: `$${(deal.sde/1000).toFixed(0)}K`, sub: 'Adj. 2023' },
                        { l: 'Margin', v: `${((deal.sde/deal.revenue)*100).toFixed(1)}%`, sub: 'Net' },
                        { l: 'Multiple', v: `${deal.multiple}x`, sub: 'Market Cap' }
                    ].map(m => `
                        <div style="padding: 2rem; border-right: 1px solid var(--graphite);">
                            <span class="mono" style="font-size: 0.6rem; color: #666; display: block;">${m.l}</span>
                            <span style="font-size: 1.8rem; font-family: 'JetBrains Mono'; font-weight: 700;">${m.v}</span>
                            <span class="mono" style="font-size: 0.5rem; color: var(--oxidized-copper); display: block;">${m.sub}</span>
                        </div>
                    `).join('')}
                </div>

                <!-- Financial Visualization Area -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; background: var(--panel);">
                    <div style="padding: 2rem; border-right: 2px solid var(--graphite);">
                        <h3 class="mono" style="margin-bottom: 2rem; font-size: 0.9rem;">Financial Breakdown (SDE vs EBITDA)</h3>
                        <div id="financialChart" style="height: 350px; width: 100%;"></div>
                    </div>
                    <div style="padding: 2rem;">
                        <h3 class="mono" style="margin-bottom: 2rem; font-size: 0.9rem;">Risk Assessment</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${['Market Volatility', 'Owner Dependency', 'Customer Concentration', 'Operational Debt'].map(risk => `
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 5px;" class="mono">
                                        <span>${risk}</span>
                                        <span style="color: var(--acid-green);">LOW</span>
                                    </div>
                                    <div style="height: 4px; background: var(--graphite);">
                                        <div style="height: 100%; width: ${Math.random()*40 + 10}%; background: var(--bone);"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div id="trendChart" style="height: 150px; width: 100%; margin-top: 2rem;"></div>
                    </div>
                </div>

                <!-- Inquire CTA -->
                <div style="padding: 4rem; background: var(--bone); color: var(--obsidian); text-align: center;">
                    <h2 style="font-size: 3rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1rem;">Private Treaty Acquisition</h2>
                    <p class="mono" style="max-width: 600px; margin: 0 auto 2rem auto; font-size: 0.9rem;">A full Confidential Memorandum (CIM) is available for qualified principals. Proof of funds and executed NDA required for data room access.</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button style="background: var(--obsidian); color: var(--bone); padding: 1.5rem 3rem; border: none; font-weight: 900; font-family: 'JetBrains Mono'; cursor: pointer; text-transform: uppercase;">Request Prospectus</button>
                        <button style="background: transparent; color: var(--obsidian); padding: 1.5rem 3rem; border: 2px solid var(--obsidian); font-weight: 900; font-family: 'JetBrains Mono'; cursor: pointer; text-transform: uppercase;">Connect with Broker</button>
                    </div>
                </div>
            </div>
        `;
    },

    initCharts(deal) {
        const finChart = new OxidizedChart('financialChart');
        finChart.renderFinancials({
            labels: ['2021', '2022', '2023', 'TTM'],
            sde: [deal.sde * 0.85, deal.sde * 0.92, deal.sde, deal.sde * 1.05],
            ebitda: [deal.sde * 0.6, deal.sde * 0.7, deal.sde * 0.75, deal.sde * 0.8]
        });

        const trendChart = new OxidizedChart('trendChart');
        trendChart.renderTrend({
            points: [100, 120, 115, 140, 160, 155, 180]
        });
    }
};