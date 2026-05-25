/**
 * Report Formatter: Investor Readiness Synthesis
 * Generates a high-fidelity, print-optimized diagnostic summary.
 */

(function() {
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            .report-overlay {
                position: fixed;
                inset: 0;
                background: #050507;
                z-index: 9999;
                padding: 60px;
                display: none;
                overflow-y: auto;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: white;
            }

            @media print {
                .report-overlay { display: block !important; position: static; padding: 0; background: white; color: black; }
                .no-print { display: none !important; }
                .report-card { border: 1px solid #eee !important; box-shadow: none !important; }
                .benchmark-row { border-bottom: 1px solid #eee !important; }
                .neon-text { color: #000 !important; text-shadow: none !important; }
            }

            .report-content {
                max-width: 900px;
                margin: 0 auto;
            }

            .report-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 24px;
                margin-bottom: 40px;
            }

            .report-title h2 {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 32px;
                letter-spacing: -1px;
            }

            .report-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
            }

            .metric-box {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                padding: 32px;
            }

            .benchmark-list {
                list-style: none;
            }

            .benchmark-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .benchmark-row span:last-child {
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
            }

            .status-indicator {
                padding: 4px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
            }

            .btn-generate {
                background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple));
                border: none;
                color: white;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                margin-top: 20px;
                width: 100%;
                font-family: 'Space Grotesk', sans-serif;
                transition: transform 0.2s;
            }

            .btn-generate:hover { transform: scale(1.02); }

            .close-report {
                position: absolute;
                top: 30px;
                right: 30px;
                color: var(--text-dim);
                cursor: pointer;
                font-weight: 800;
            }
        `;
        document.head.appendChild(style);
    };

    const createReportUI = () => {
        const overlay = document.createElement('div');
        overlay.id = 'reportOverlay';
        overlay.className = 'report-overlay';
        overlay.innerHTML = `
            <div class="report-content">
                <span class="close-report no-print" onclick="document.getElementById('reportOverlay').style.display='none'">[ ESC TO CLOSE ]</span>
                <div class="report-header">
                    <div class="report-title">
                        <p style="color: #00f2ff; font-weight: 800; font-size: 12px; letter-spacing: 2px;">INVESTOR READINESS REPORT</p>
                        <h2>Growth Engine Diagnosis</h2>
                    </div>
                    <div style="text-align: right; color: #94a3b8; font-size: 14px;">
                        Generated: ${new Date().toLocaleDateString()}<br>
                        Confidential Strategic Analysis
                    </div>
                </div>

                <div class="report-grid">
                    <div class="metric-box">
                        <h3 style="margin-bottom: 20px; font-family: 'Space Grotesk'">Efficiency Core</h3>
                        <div id="reportGaugeContainer" style="transform: scale(1.2); transform-origin: top left; margin-bottom: 40px;"></div>
                        <div id="narrativeSection">
                            <h4 id="reportStatus" style="font-size: 24px; margin-bottom: 12px;"></h4>
                            <p id="reportDescription" style="line-height: 1.6; color: #94a3b8;"></p>
                        </div>
                    </div>

                    <div class="metric-box">
                        <h3 style="margin-bottom: 20px; font-family: 'Space Grotesk'">Vertical Benchmarks</h3>
                        <div class="benchmark-list">
                            <div class="benchmark-row"><span>Enterprise SaaS</span><span>5.0x +</span></div>
                            <div class="benchmark-row"><span>Mid-Market SaaS</span><span>4.0x +</span></div>
                            <div class="benchmark-row"><span>SMB / Prosumer</span><span>3.0x +</span></div>
                            <div class="benchmark-row"><span>E-Commerce / B2C</span><span>2.0x +</span></div>
                        </div>
                        
                        <div style="margin-top: 32px; padding: 20px; background: rgba(0,242,255,0.05); border-radius: 12px; border-left: 4px solid #00f2ff;">
                            <p style="font-size: 13px; font-style: italic; color: #e2e8f0;">
                                "A ratio above 3.0x signifies a compounding asset where customer acquisition cost is recouped quickly enough to fund the next cohort without external capital."
                            </p>
                        </div>

                        <button class="btn-generate no-print" onclick="window.print()" style="margin-top: 40px;">DOWNLOAD PDF REPORT</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    };

    const attachButton = () => {
        const container = document.querySelector('.diagnostic-card');
        const btn = document.createElement('button');
        btn.className = 'btn-generate';
        btn.innerText = 'GENERATE INVESTOR REPORT';
        btn.onclick = openReport;
        container.appendChild(btn);
    };

    const openReport = () => {
        const arpu = document.getElementById('arpu').value;
        const churn = document.getElementById('churn').value;
        const cac = document.getElementById('cac').value;
        const ratio = document.getElementById('ratioVal').innerText;
        
        const overlay = document.getElementById('reportOverlay');
        const gaugeClone = document.querySelector('.gauge-svg').cloneNode(true);
        
        document.getElementById('reportGaugeContainer').innerHTML = '';
        document.getElementById('reportGaugeContainer').appendChild(gaugeClone);
        
        const numericRatio = parseFloat(ratio);
        const status = document.getElementById('reportStatus');
        const desc = document.getElementById('reportDescription');

        if (numericRatio >= 3) {
            status.innerText = "Tier 1: Compounding Asset";
            status.style.color = "#00ff88";
            desc.innerText = "The business demonstrates exceptional unit economics. Growth is efficiently self-funded, making the entity a primary candidate for non-dilutive financing or aggressive venture scaling.";
        } else if (numericRatio > 1.5) {
            status.innerText = "Tier 2: Efficient Growth";
            status.style.color = "#00f2ff";
            desc.innerText = "Healthy unit economics with room for optimization. The LTV covers CAC sufficiently, but CAC sensitivity should be monitored as the channel scales.";
        } else {
            status.innerText = "Tier 3: Structural Risk";
            status.style.color = "#ff0055";
            desc.innerText = "Current unit economics are unsustainable. High churn or excessive acquisition costs are eroding the capital base. Immediate focus on product-market fit or retention is required.";
        }

        overlay.style.display = 'block';
    };

    // Initialize
    injectStyles();
    createReportUI();
    attachButton();

    // Listen for Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.getElementById('reportOverlay').style.display = 'none';
    });
})();