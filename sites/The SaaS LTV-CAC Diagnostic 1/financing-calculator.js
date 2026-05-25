(function() {
    const styles = `
        #efficiency-planner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
            font-family: 'Inter', sans-serif;
            color: #ffffff;
        }

        .planner-card {
            width: 90%;
            max-width: 600px;
            background: #0d0d0d;
            border: 1px solid #222;
            padding: 40px;
            position: relative;
        }

        .planner-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #222;
            padding-bottom: 20px;
        }

        .planner-header h2 {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .planner-header p {
            color: #888;
            font-size: 13px;
        }

        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .option-box {
            background: #151515;
            padding: 20px;
            border: 1px solid #222;
        }

        .option-box.recommended {
            border-color: #00ff88;
            position: relative;
        }

        .rec-tag {
            position: absolute;
            top: -10px;
            right: 10px;
            background: #00ff88;
            color: #000;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 6px;
            font-family: 'JetBrains Mono', monospace;
        }

        .option-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #888;
            margin-bottom: 15px;
            display: block;
        }

        .cost-value {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .cost-desc {
            font-size: 11px;
            color: #555;
            line-height: 1.4;
        }

        .efficiency-verdict {
            background: #1a1a1a;
            padding: 20px;
            margin-bottom: 30px;
        }

        .verdict-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #00ff88;
            margin-bottom: 10px;
        }

        .verdict-text {
            font-size: 14px;
            line-height: 1.6;
            color: #ccc;
        }

        .close-planner {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
        }

        .close-planner:hover { color: #fff; }

        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #222;
        }

        .metric-item span {
            display: block;
            font-size: 9px;
            color: #555;
            text-transform: uppercase;
        }

        .metric-item b {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
        }
    `;

    const html = `
        <div id="efficiency-planner">
            <div class="planner-card">
                <button class="close-planner" onclick="document.getElementById('efficiency-planner').style.display='none'">[ CLOSE ]</button>
                <div class="planner-header">
                    <h2>Capital Efficiency Planner</h2>
                    <p>Comparing funding paths based on unit economics.</p>
                </div>

                <div class="comparison-grid">
                    <div id="equity-box" class="option-box">
                        <span class="option-title">Equity Financing (VC)</span>
                        <div class="cost-value" id="equity-cost">20%</div>
                        <div class="cost-desc">Estimated dilution per round. High cost due to compounded LTV growth.</div>
                    </div>
                    <div id="rbf-box" class="option-box">
                        <span class="option-title">Revenue-Based Financing</span>
                        <div class="cost-value" id="rbf-cost">6-12%</div>
                        <div class="cost-desc">Fixed capital fee. No dilution. Repaid via % of monthly revenue.</div>
                    </div>
                </div>

                <div class="efficiency-verdict">
                    <div class="verdict-title">Strategic Recommendation</div>
                    <div class="verdict-text" id="verdict-content">
                        Calculating...
                    </div>
                    <div class="metric-row">
                        <div class="metric-item">
                            <span>LTV ROI</span>
                            <b id="ltv-roi-stat">0%</b>
                        </div>
                        <div class="metric-item">
                            <span>Efficiency Score</span>
                            <b id="efficiency-stat">0.0</b>
                        </div>
                    </div>
                </div>

                <button class="primary-cta" onclick="window.print()">Export Strategic Plan</button>
            </div>
        </div>
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Inject HTML
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const cta = document.getElementById('cta-button');
    
    function calculateFinancing() {
        const arpu = parseFloat(document.getElementById('arpu').value) || 0;
        const churn = parseFloat(document.getElementById('churn').value) || 0;
        const cac = parseFloat(document.getElementById('cac').value) || 1;
        const ratio = (arpu / (churn / 100)) / cac;

        const planner = document.getElementById('efficiency-planner');
        const verdict = document.getElementById('verdict-content');
        const equityBox = document.getElementById('equity-box');
        const rbfBox = document.getElementById('rbf-box');
        const ltvRoiStat = document.getElementById('ltv-roi-stat');
        const efficiencyStat = document.getElementById('efficiency-stat');

        planner.style.display = 'flex';

        ltvRoiStat.textContent = `${Math.round(ratio * 100)}%`;
        efficiencyStat.textContent = ratio.toFixed(2);

        // Remove previous recommendations
        equityBox.classList.remove('recommended');
        rbfBox.classList.remove('recommended');
        const oldTags = document.querySelectorAll('.rec-tag');
        oldTags.forEach(t => t.remove());

        if (ratio >= 3) {
            rbfBox.classList.add('recommended');
            rbfBox.innerHTML += '<div class="rec-tag">RECOMMENDED</div>';
            verdict.textContent = `With a ${ratio.toFixed(1)}x LTV:CAC, your growth is a compounding asset. Selling equity now is mathematically inefficient. Non-dilutive capital (RBF) allows you to fuel acquisition while retaining 100% of the upside of your high-yield engine.`;
            document.querySelector('.verdict-title').style.color = 'var(--success)';
        } else if (ratio >= 1.5) {
            equityBox.classList.add('recommended');
            equityBox.innerHTML += '<div class="rec-tag">OPTIMAL</div>';
            verdict.textContent = `Your unit economics are stable. Equity financing is recommended to build enterprise value and moat. Focus on increasing LTV or lowering CAC by 20% to move into the "Non-Dilutive" zone for maximum founder wealth.`;
            document.querySelector('.verdict-title').style.color = 'var(--warning)';
        } else {
            verdict.textContent = `Warning: Capital efficiency is low. Neither Equity nor Debt is advised at this stage. Focus on reducing Churn below ${churn > 5 ? '5%' : (churn/2).toFixed(1) + '%'} or increasing ARPU before seeking external capital. Your "Leaky Bucket" will accelerate losses with more capital.`;
            document.querySelector('.verdict-title').style.color = 'var(--danger)';
        }
    }

    // Override or attach to the main CTA
    if (cta) {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            calculateFinancing();
        });
    }
})();