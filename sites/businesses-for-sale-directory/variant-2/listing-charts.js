const DealIntelligence = {
    theme: {
        obsidian: '#050505',
        graphite: '#141414',
        bone: '#F5F5F0',
        acidGreen: '#C5FF00',
        copper: '#8B9D83',
        bloodOrange: '#FF3D00'
    },

    financials: {
        labels: ['2021', '2022', '2023', '2024 (PROJ)'],
        revenue: [2800000, 3100000, 3400000, 3500000],
        sde: [380000, 410000, 440000, 450000]
    },

    init() {
        this.injectStyles();
        this.renderIntelligenceRoom();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .intel-room {
                background: var(--obsidian);
                padding: 4rem 2rem;
                border-top: var(--border-width) solid var(--bone);
            }
            .intel-grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 4rem;
                max-width: 1400px;
                margin: 0 auto;
            }
            .chart-container {
                border: 1px solid var(--graphite);
                padding: 2rem;
                background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
                position: relative;
            }
            .chart-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2rem;
                border-bottom: 1px solid var(--graphite);
                padding-bottom: 1rem;
            }
            .visual-bar-group {
                display: flex;
                align-items: flex-end;
                gap: 1.5rem;
                height: 300px;
                padding-top: 2rem;
            }
            .bar-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                gap: 0.5rem;
            }
            .bar-rev {
                width: 100%;
                background: var(--bone);
                transition: height 1s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
            }
            .bar-sde {
                width: 60%;
                background: var(--acid-green);
                position: absolute;
                bottom: 0;
            }
            .narrative-box {
                padding: 3rem;
                border: 1px solid var(--copper);
                background: #0a0a0a;
                position: relative;
            }
            .narrative-box::after {
                content: "EYE ONLY";
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-family: 'JetBrains Mono';
                font-size: 0.6rem;
                color: var(--copper);
                border: 1px solid var(--copper);
                padding: 2px 4px;
            }
            .vault-preview {
                margin-top: 4rem;
                border: var(--border-width) solid var(--bone);
            }
            .vault-header {
                background: var(--bone);
                color: var(--obsidian);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vault-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid var(--graphite);
                font-family: 'JetBrains Mono';
                font-size: 0.8rem;
                align-items: center;
            }
            .vault-row:hover { background: #0f0f0f; }
            .lock-icon { color: var(--blood-orange); margin-right: 10px; }
            .asset-tag {
                display: inline-block;
                padding: 4px 10px;
                background: var(--graphite);
                border: 1px solid var(--copper);
                font-size: 0.7rem;
                margin: 0.2rem;
            }
        `;
        document.head.appendChild(style);
    },

    formatMoney(val) {
        return '$' + (val / 1000000).toFixed(1) + 'M';
    },

    renderIntelligenceRoom() {
        const container = document.createElement('section');
        container.className = 'intel-room';
        container.id = 'deal-intelligence';
        
        const maxVal = Math.max(...this.financials.revenue);

        container.innerHTML = `
            <div class="intel-grid">
                <div class="left-col">
                    <div class="mono" style="color: var(--acid-green); margin-bottom: 2rem;">[ INTEL_REPORT_0882 ]</div>
                    <h2 class="editorial" style="font-size: 3.5rem; margin-bottom: 3rem; color: var(--bone);">Financial Performance & <span style="color: var(--acid-green);">Trajectory</span></h2>
                    
                    <div class="chart-container">
                        <div class="chart-header">
                            <div>
                                <span class="mono" style="color: var(--bone); margin-right: 20px;">■ REVENUE</span>
                                <span class="mono" style="color: var(--acid-green);">■ SDE (EARNINGS)</span>
                            </div>
                            <div class="mono">Scale: USD Millions</div>
                        </div>
                        <div class="visual-bar-group">
                            ${this.financials.revenue.map((rev, i) => `
                                <div class="bar-col">
                                    <div class="mono" style="font-size: 0.6rem; color: var(--copper);">${this.formatMoney(rev)}</div>
                                    <div class="bar-rev" style="height: ${(rev / maxVal) * 100}%">
                                        <div class="bar-sde" style="height: ${(this.financials.sde[i] / rev) * 100}%"></div>
                                    </div>
                                    <div class="mono" style="margin-top: 1rem;">${this.financials.labels[i]}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="vault-preview">
                        <div class="vault-header">
                            <h3 class="mono">Due Diligence Vault</h3>
                            <div class="mono" style="font-size: 0.7rem;">Secure File Access Enabled</div>
                        </div>
                        <div class="vault-row">
                            <span><span class="lock-icon">🔒</span> Quality of Earnings Report</span>
                            <span style="color: var(--copper);">PDF // 4.2MB</span>
                            <button class="btn btn-outline" style="padding: 5px; font-size: 0.6rem;">Request Access</button>
                        </div>
                        <div class="vault-row">
                            <span><span class="lock-icon">🔒</span> 3-Year P&L Detailed (Monthly)</span>
                            <span style="color: var(--copper);">XLSX // 1.8MB</span>
                            <button class="btn btn-outline" style="padding: 5px; font-size: 0.6rem;">Request Access</button>
                        </div>
                        <div class="vault-row">
                            <span><span class="lock-icon">🔒</span> Asset Schedule & Fleet Registry</span>
                            <span style="color: var(--copper);">PDF // 0.9MB</span>
                            <button class="btn btn-outline" style="padding: 5px; font-size: 0.6rem;">Request Access</button>
                        </div>
                    </div>
                </div>

                <div class="right-col">
                    <div class="narrative-box">
                        <h4 class="mono" style="color: var(--copper); margin-bottom: 1.5rem;">Seller's Narrative</h4>
                        <p class="editorial" style="font-size: 1.4rem; line-height: 1.6; color: var(--bone);">
                            "Our dominance in the Austin corridor isn't just about service—it's about the <span style="color: var(--acid-green);">algorithmic routing</span> we built for our 12-truck fleet. We've achieved a 94% retention rate on commercial maintenance contracts, providing a floor of cash flow that sustains growth even in off-peak seasons."
                        </p>
                    </div>

                    <div style="margin-top: 3rem;">
                        <h4 class="mono" style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--graphite); padding-bottom: 0.5rem;">Asset Inventory</h4>
                        <div class="asset-grid">
                            <div class="asset-tag">12x Ford F-150 Fully Loaded</div>
                            <div class="asset-tag">Proprietary Dispatch Software</div>
                            <div class="asset-tag">EPA Certified Clean-Facility</div>
                            <div class="asset-tag">Centralized Inventory Hub</div>
                            <div class="asset-tag">Trademarked Brand Assets</div>
                        </div>
                    </div>

                    <div style="margin-top: 3rem; background: var(--graphite); padding: 2rem;">
                        <h4 class="mono" style="color: var(--blood-orange); margin-bottom: 1rem;">Investment Risk Profile</h4>
                        <div style="display: flex; gap: 4px; margin-bottom: 1rem;">
                            <div style="flex:1; height: 4px; background: var(--acid-green);"></div>
                            <div style="flex:1; height: 4px; background: var(--acid-green);"></div>
                            <div style="flex:1; height: 4px; background: var(--acid-green);"></div>
                            <div style="flex:1; height: 4px; background: #333;"></div>
                            <div style="flex:1; height: 4px; background: #333;"></div>
                        </div>
                        <p class="mono" style="font-size: 0.7rem; color: var(--copper);">Risk Score: Low-Medium. Primary sensitivity: Local labor market volatility.</p>
                    </div>
                </div>
            </div>
        `;

        // Append before CTA section
        const cta = document.querySelector('.cta-section');
        if (cta) {
            cta.parentNode.insertBefore(container, cta);
        } else {
            document.body.appendChild(container);
        }
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    DealIntelligence.init();
});
```