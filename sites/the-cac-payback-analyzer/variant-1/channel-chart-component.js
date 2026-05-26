class ChannelPerformanceDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.channels = [
            { name: 'Google Search', cac: 145, payback: 4.2, spend: 12000, status: 'bankable' },
            { name: 'Meta Ads', cac: 210, payback: 7.8, spend: 15000, status: 'neutral' },
            { name: 'LinkedIn B2B', cac: 450, payback: 11.2, spend: 8000, status: 'neutral' },
            { name: 'TikTok Spark', cac: 85, payback: 14.5, spend: 5000, status: 'risky' },
            { name: 'YouTube Brand', cac: 320, payback: 5.1, spend: 10000, status: 'bankable' }
        ];
    }

    connectedCallback() {
        this.render();
    }

    getStatusClass(payback) {
        if (payback < 6) return 'status-bankable';
        if (payback <= 12) return 'status-neutral';
        return 'status-risky';
    }

    render() {
        const style = `
            <style>
                :host {
                    display: block;
                    font-family: 'Outfit', sans-serif;
                    color: #e0e0e0;
                }
                .dashboard-card {
                    background: #0c1210;
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    border-radius: 20px;
                    padding: 32px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    position: relative;
                    overflow: hidden;
                }
                .dashboard-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 60px;
                    height: 60px;
                    border-top: 2px solid #00ff88;
                    border-right: 2px solid #00ff88;
                    border-radius: 0 20px 0 0;
                    opacity: 0.3;
                }
                header {
                    margin-bottom: 30px;
                }
                .tag {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    color: #00ff88;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                h2 {
                    font-size: 1.8rem;
                    margin: 5px 0;
                    font-weight: 800;
                    background: linear-gradient(to right, #fff, #00ff88);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .channel-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .channel-row {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 2fr 1fr;
                    align-items: center;
                    padding: 16px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    transition: transform 0.2s ease;
                }
                .channel-row:hover {
                    transform: scale(1.01);
                    border-color: rgba(0, 255, 136, 0.3);
                    background: rgba(0, 255, 136, 0.03);
                }
                .name-box .channel-name {
                    display: block;
                    font-weight: 600;
                    font-size: 1rem;
                }
                .name-box .channel-spend {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    color: #889990;
                }
                .stat-box {
                    text-align: left;
                }
                .stat-box .label {
                    display: block;
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    color: #889990;
                    font-family: 'JetBrains Mono', monospace;
                }
                .stat-box .value {
                    font-weight: 700;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                }
                .visual-box {
                    padding: 0 20px;
                }
                .progress-bg {
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    position: relative;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                .status-bankable { color: #00ff88; border: 1px solid #00ff88; background: rgba(0, 255, 136, 0.1); }
                .status-neutral { color: #ffa502; border: 1px solid #ffa502; background: rgba(255, 165, 2, 0.1); }
                .status-risky { color: #ff4757; border: 1px solid #ff4757; background: rgba(255, 71, 87, 0.1); }
                .fill-bankable { width: 30%; background: #00ff88; box-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
                .fill-neutral { width: 60%; background: #ffa502; }
                .fill-risky { width: 90%; background: #ff4757; }
                
                @media (max-width: 600px) {
                    .channel-row {
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    .visual-box { display: none; }
                }
            </style>
        `;

        const rows = this.channels.map(ch => {
            const statusClass = this.getStatusClass(ch.payback);
            const fillClass = `fill-${statusClass.split('-')[1]}`;
            const fillWidth = Math.min((ch.payback / 18) * 100, 100);

            return `
                <div class="channel-row">
                    <div class="name-box">
                        <span class="channel-name">${ch.name}</span>
                        <span class="channel-spend">SPEND: $${ch.spend.toLocaleString()}</span>
                    </div>
                    <div class="stat-box">
                        <span class="label">CAC</span>
                        <span class="value">$${ch.cac}</span>
                    </div>
                    <div class="visual-box">
                        <span class="label" style="margin-bottom: 4px;">Payback Velocity (${ch.payback}m)</span>
                        <div class="progress-bg">
                            <div class="progress-fill ${fillClass}" style="width: ${fillWidth}%"></div>
                        </div>
                    </div>
                    <div class="status-box">
                        <div class="status-badge ${statusClass}">
                            ${statusClass.split('-')[1]}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.shadowRoot.innerHTML = `
            ${style}
            <div class="dashboard-card">
                <header>
                    <div class="tag">System Overview // Efficiency</div>
                    <h2>Channel Performance</h2>
                </header>
                <div class="channel-list">
                    ${rows}
                </div>
            </div>
        `;
    }
}

customElements.define('channel-performance-dashboard', ChannelPerformanceDashboard);
```