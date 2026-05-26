(function() {
    const style = document.createElement('style');
    style.textContent = `
        .sim-box {
            margin: 20px 0;
            padding: 24px;
            background: #0a0a0a;
            border: 1px solid var(--border);
            position: relative;
        }
        .sim-box::before {
            content: "SENSITIVITY ANALYSIS";
            position: absolute;
            top: -7px;
            left: 15px;
            background: var(--card-bg);
            padding: 0 8px;
            font-family: var(--font-mono);
            font-size: 9px;
            color: var(--text-dim);
            letter-spacing: 0.1em;
        }
        .sim-row {
            margin-bottom: 20px;
        }
        .sim-row:last-child {
            margin-bottom: 0;
        }
        .sim-header-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
        }
        .sim-header-row .label { color: var(--text-dim); }
        .sim-header-row .val { color: var(--success); font-weight: 700; }
        
        .sim-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 2px;
            background: #222;
            outline: none;
            cursor: pointer;
        }
        .sim-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: var(--accent);
            border: 2px solid #0a0a0a;
            cursor: pointer;
            transition: transform 0.1s ease;
        }
        .sim-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: var(--success);
        }
        .sim-indicator {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--text-dim);
            border-radius: 50%;
            margin-right: 6px;
        }
        .sim-active .sim-indicator {
            background: var(--success);
            box-shadow: 0 0 8px var(--success);
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);

    const inputsGrid = document.querySelector('.inputs-grid');
    const simContainer = document.createElement('div');
    simContainer.className = 'sim-box';
    simContainer.id = 'sim-engine';
    simContainer.innerHTML = `
        <div class="sim-row">
            <div class="sim-header-row">
                <span class="label"><span class="sim-indicator"></span>Churn Improvement</span>
                <span class="val" id="churn-opt-val">0%</span>
            </div>
            <input type="range" id="churn-opt" class="sim-slider" min="0" max="80" value="0">
        </div>
        <div class="sim-row">
            <div class="sim-header-row">
                <span class="label"><span class="sim-indicator"></span>Expansion Lift</span>
                <span class="val" id="exp-lift-val">0%</span>
            </div>
            <input type="range" id="exp-lift" class="sim-slider" min="0" max="100" value="0">
        </div>
    `;
    inputsGrid.parentNode.insertBefore(simContainer, inputsGrid.nextSibling);

    const churnOpt = document.getElementById('churn-opt');
    const expLift = document.getElementById('exp-lift');
    const churnOptVal = document.getElementById('churn-opt-val');
    const expLiftVal = document.getElementById('exp-lift-val');
    const simEngine = document.getElementById('sim-engine');

    const arpuInput = document.getElementById('arpu');
    const churnInput = document.getElementById('churn');
    const cacInput = document.getElementById('cac');
    const ratioDisplay = document.getElementById('ratio-display');
    const ltvDisplay = document.getElementById('ltv-calc');
    const statusText = document.getElementById('status-text');
    const gaugePath = document.getElementById('gauge-path');
    const ctaButton = document.getElementById('cta-button');
    const glow = document.getElementById('status-glow');

    function calculateSimulation() {
        const baseArpu = parseFloat(arpuInput.value) || 0;
        const baseChurn = parseFloat(churnInput.value) || 0;
        const cac = parseFloat(cacInput.value) || 1;

        const cReduction = parseFloat(churnOpt.value) / 100;
        const eLift = parseFloat(expLift.value) / 100;

        churnOptVal.textContent = churnOpt.value + '%';
        expLiftVal.textContent = '+' + expLift.value + '%';

        const simChurn = baseChurn * (1 - cReduction);
        const simArpu = baseArpu * (1 + eLift);
        const simChurnDecimal = simChurn / 100;
        
        const ltv = simChurnDecimal > 0 ? (simArpu / simChurnDecimal) : 0;
        const ratio = ltv / cac;

        const isSimulated = churnOpt.value > 0 || expLift.value > 0;
        if (isSimulated) {
            simEngine.classList.add('sim-active');
            ltvDisplay.style.color = 'var(--success)';
            ltvDisplay.textContent = `Forecasted LTV: $${ltv.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        } else {
            simEngine.classList.remove('sim-active');
            ltvDisplay.style.color = 'var(--text-dim)';
            ltvDisplay.textContent = `Calculated LTV: $${ltv.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }

        ratioDisplay.textContent = ratio.toFixed(1);
        
        const maxGaugeRatio = 6;
        const percentage = Math.min(ratio / maxGaugeRatio, 1);
        const offset = 314 - (percentage * 314);
        gaugePath.style.strokeDashoffset = offset;

        if (ratio >= 3) {
            gaugePath.style.stroke = 'var(--success)';
            statusText.textContent = isSimulated ? "Optimal Engine" : "Compounding Asset";
            statusText.style.color = 'var(--success)';
            glow.style.background = 'radial-gradient(circle, var(--success) 0%, transparent 70%)';
            ctaButton.textContent = isSimulated ? "Download Growth Roadmap" : "Analyze Engine Power";
        } else if (ratio >= 1.5) {
            gaugePath.style.stroke = 'var(--warning)';
            statusText.textContent = "Sustainable Growth";
            statusText.style.color = 'var(--warning)';
            glow.style.background = 'radial-gradient(circle, var(--warning) 0%, transparent 70%)';
            ctaButton.textContent = "Optimize for Scale";
        } else {
            gaugePath.style.stroke = 'var(--danger)';
            statusText.textContent = "Efficiency Gap";
            statusText.style.color = 'var(--danger)';
            glow.style.background = 'radial-gradient(circle, var(--danger) 0%, transparent 70%)';
            ctaButton.textContent = "Review Churn Diagnostics";
        }

        if (isSimulated) {
            ctaButton.style.background = 'var(--success)';
            ctaButton.style.color = '#000';
        } else {
            ctaButton.style.background = 'var(--accent)';
            ctaButton.style.color = 'var(--bg)';
        }
    }

    [churnOpt, expLift].forEach(input => input.addEventListener('input', calculateSimulation));
    [arpuInput, churnInput, cacInput].forEach(input => input.addEventListener('input', calculateSimulation));
})();