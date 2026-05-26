/**
 * StackVisualizer.js
 * High-fidelity prospectus generator for Capital Architecture.
 */

(function() {
    const styles = `
        .prospectus-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--black);
            z-index: 9999;
            display: none;
            padding: 40px;
            overflow-y: auto;
            color: var(--bone-white);
        }

        .prospectus-container {
            max-width: 1000px;
            margin: 0 auto;
            border: 1px solid var(--bone-white);
            padding: 60px;
            position: relative;
            background: var(--black);
        }

        .prospectus-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 10px solid var(--bone-white);
            padding-bottom: 40px;
            margin-bottom: 60px;
        }

        .prospectus-title {
            font-family: 'DM Serif Display', serif;
            font-size: 5rem;
            line-height: 0.8;
            text-transform: uppercase;
        }

        .confidential-tag {
            background: var(--acid-green);
            color: var(--black);
            padding: 5px 15px;
            font-weight: 900;
            font-size: 0.8rem;
            letter-spacing: 3px;
            transform: rotate(90deg) translateX(40px);
            transform-origin: right bottom;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 60px;
        }

        .visual-stack {
            display: flex;
            flex-direction: column;
            border: 4px solid var(--bone-white);
            height: 500px;
        }

        .stack-segment {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            transition: all 0.8s ease;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid var(--bone-white);
        }

        .stack-segment:last-child { border-bottom: none; }

        .segment-equity { background: var(--bone-white); color: var(--black); }
        .segment-sba { background: var(--verdigris); color: var(--black); }
        .segment-seller { background: var(--oxidized-dark); color: var(--bone-white); }

        .segment-label {
            font-family: 'Inter', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 2px;
        }

        .segment-value {
            font-family: 'DM Serif Display', serif;
            font-size: 3rem;
        }

        .data-column {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .metric-box {
            border-bottom: 1px solid #333;
            padding: 20px 0;
        }

        .metric-label {
            font-size: 0.6rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--verdigris);
            margin-bottom: 10px;
            display: block;
        }

        .metric-value {
            font-family: 'DM Serif Display', serif;
            font-size: 2rem;
        }

        .btn-prospectus-trigger {
            margin-top: 20px;
            width: 100%;
            background: transparent;
            color: var(--bone-white);
            border: 2px solid var(--bone-white);
            padding: 15px;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 2px;
            cursor: pointer;
        }

        .btn-prospectus-trigger:hover {
            background: var(--bone-white);
            color: var(--black);
        }

        .close-prospectus {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: var(--bone-white);
            font-size: 2rem;
            cursor: pointer;
        }

        @media print {
            .close-prospectus, .btn-prospectus-trigger { display: none; }
            body { background: white; }
            .prospectus-overlay { position: relative; display: block !important; padding: 0; }
            .prospectus-container { border: none; }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const init = () => {
        const container = document.querySelector('.calc-container');
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'btn-prospectus-trigger';
        triggerBtn.innerText = 'Generate Visual Summary';
        triggerBtn.onclick = showProspectus;
        container.appendChild(triggerBtn);

        const overlay = document.createElement('div');
        overlay.className = 'prospectus-overlay';
        overlay.id = 'prospectusOverlay';
        document.body.appendChild(overlay);
    };

    const showProspectus = () => {
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const sbaVal = parseFloat(document.getElementById('sba-val').innerText);
        const sellerVal = parseFloat(document.getElementById('seller-val').innerText);
        const rate = document.getElementById('interestRate').value;
        
        const overlay = document.getElementById('prospectusOverlay');
        overlay.style.display = 'block';
        
        overlay.innerHTML = `
            <div class="prospectus-container">
                <button class="close-prospectus" onclick="document.getElementById('prospectusOverlay').style.display='none'">×</button>
                <div class="confidential-tag">INTERNAL USE ONLY</div>
                
                <header class="prospectus-header">
                    <div>
                        <div class="metric-label" style="color: var(--acid-green)">Project Memorandum</div>
                        <h2 class="prospectus-title">Capital<br>Stack</h2>
                    </div>
                    <div style="text-align: right">
                        <div class="metric-label">Ref. Serial</div>
                        <div class="metric-value" style="font-size: 1.2rem">#${Math.floor(Math.random()*900000 + 100000)}</div>
                    </div>
                </header>

                <div class="summary-grid">
                    <div class="visual-stack">
                        <div class="stack-segment segment-equity" style="height: ${downPayment}%">
                            <span class="segment-label">Equity Position</span>
                            <span class="segment-value">${downPayment}%</span>
                        </div>
                        <div class="stack-segment segment-sba" style="height: ${sbaVal}%">
                            <span class="segment-label">Senior Debt (SBA)</span>
                            <span class="segment-value">${sbaVal}%</span>
                        </div>
                        <div class="stack-segment segment-seller" style="height: ${sellerVal}%">
                            <span class="segment-label">Seller Carry</span>
                            <span class="segment-value">${sellerVal}%</span>
                        </div>
                    </div>

                    <div class="data-column">
                        <div class="metric-box">
                            <span class="metric-label">Market Weighted Rate</span>
                            <span class="metric-value">${rate}%</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-label">Leverage Multiplier</span>
                            <span class="metric-value">${(100/downPayment).toFixed(2)}x</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-label">Risk Profile</span>
                            <span class="metric-value" style="color: var(--acid-green)">Institutional</span>
                        </div>
                        <div class="metric-box" style="border: none; margin-top: auto;">
                            <p style="font-size: 0.6rem; line-height: 1.5; opacity: 0.5;">
                                This capital architecture summary is generated based on current SBA 7(a) guidelines and 
                                secondary market liquidity constraints. Figures are indicative of Tier-1 asset performance.
                            </p>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="font-family: 'DM Serif Display'; font-style: italic; font-size: 1.5rem;">
                        Verdigris Brutalist / 2024
                    </div>
                    <button onclick="window.print()" class="btn-calculate" style="width: auto; margin-bottom: 0; padding: 10px 30px; font-size: 0.8rem;">Export PDF</button>
                </div>
            </div>
        `;
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();