const style = `
    .projection-engine {
        margin-top: 30px;
        padding-top: 25px;
        border-top: 1px dashed var(--border);
    }
    .projection-title {
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--accent);
        letter-spacing: 0.1em;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .projection-title::before {
        content: "•";
        color: var(--success);
        animation: pulse 2s infinite;
    }
    .slider-group {
        margin-bottom: 20px;
    }
    .slider-header {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 9px;
        color: var(--text-dim);
        text-transform: uppercase;
        margin-bottom: 10px;
    }
    .slider-header span.val {
        color: var(--accent);
    }
    .range-input {
        width: 100%;
        -webkit-appearance: none;
        background: #1a1a1a;
        height: 4px;
        outline: none;
        border-radius: 2px;
    }
    .range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: var(--accent);
        cursor: pointer;
        border-radius: 0;
        border: 2px solid var(--bg);
    }
    .impact-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 20px;
        padding: 15px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
    }
    .impact-stat-item {
        display: flex;
        flex-direction: column;
    }
    .impact-stat-label {
        font-family: var(--font-mono);
        font-size: 8px;
        color: var(--text-dim);
        text-transform: uppercase;
    }
    .impact-stat-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--success);
    }
    .delta-badge {
        font-family: var(--font-mono);
        font-size: 8px;
        background: rgba(0, 255, 136, 0.1);
        color: var(--success);
        padding: 2px 4px;
        margin-left: 5px;
    }
`;

const html = `
    <div class="projection-engine">
        <div class="projection-title">GROWTH SENSITIVITY SIMULATOR</div>
        
        <div class="slider-group">
            <div class="slider-header">
                Churn Reduction <span class="val" id="churn-opt-val">0%</span>
            </div>
            <input type="range" id="churn-opt" class="range-input" min="0" max="80" value="0">
        </div>

        <div class="slider-group">
            <div class="slider-header">
                Expansion Revenue <span class="val" id="expansion-val">0%</span>
            </div>
            <input type="range" id="expansion-opt" class="range-input" min="0" max="10" value="0" step="0.1">
        </div>

        <div class="impact-stats">
            <div class="impact-stat-item">
                <div class="impact-stat-label">Projected LTV</div>
                <div class="impact-stat-value" id="proj-ltv">$0.00</div>
            </div>
            <div class="impact-stat-item">
                <div class="impact-stat-label">LTV Improvement</div>
                <div class="impact-stat-value" id="ltv-delta">+0%</div>
            </div>
        </div>
    </div>
`;

document.addEventListener('DOMContentLoaded', () => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);

    const container = document.querySelector('.ltv-display');
    container.insertAdjacentHTML('afterend', html);

    const churnOpt = document.getElementById('churn-opt');
    const expansionOpt = document.getElementById('expansion-opt');
    const churnOptVal = document.getElementById('churn-opt-val');
    const expansionVal = document.getElementById('expansion-val');
    const projLtvDisp = document.getElementById('proj-ltv');
    const ltvDeltaDisp = document.getElementById('ltv-delta');

    const arpuIn = document.getElementById('arpu');
    const churnIn = document.getElementById('churn');
    const cacIn = document.getElementById('cac');

    function runProjection() {
        const baseArpu = parseFloat(arpuIn.value) || 0;
        const baseChurn = parseFloat(churnIn.value) || 0;
        const cac = parseFloat(cacIn.value) || 1;

        const optChurnReduction = parseFloat(churnOpt.value) / 100;
        const optExpansion = parseFloat(expansionOpt.value) / 100;

        // Visual Updates
        churnOptVal.textContent = `${churnOpt.value}%`;
        expansionVal.textContent = `${expansionOpt.value}%`;

        // Logic
        const improvedChurnRate = baseChurn * (1 - optChurnReduction);
        const netChurnRate = (improvedChurnRate / 100) - optExpansion;
        
        // Cap net churn to avoid infinity (0.1% floor)
        const effectiveChurn = Math.max(netChurnRate, 0.001);
        const projectedLtv = baseArpu / effectiveChurn;
        const projectedRatio = projectedLtv / cac;

        const baseLtv = (baseChurn / 100) > 0 ? (baseArpu / (baseChurn / 100)) : 0;
        const ltvImprovement = baseLtv > 0 ? ((projectedLtv - baseLtv) / baseLtv) * 100 : 0;

        // Update Projector UI
        projLtvDisp.textContent = `$${projectedLtv.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        ltvDeltaDisp.textContent = `+${ltvImprovement.toFixed(0)}%`;

        // Drive Main UI
        const ratioDisplay = document.getElementById('ratio-display');
        const gaugePath = document.getElementById('gauge-path');
        const statusText = document.getElementById('status-text');
        const ctaButton = document.getElementById('cta-button');
        const glow = document.getElementById('status-glow');

        ratioDisplay.textContent = projectedRatio.toFixed(1);
        const maxGaugeRatio = 6;
        const percentage = Math.min(projectedRatio / maxGaugeRatio, 1);
        const offset = 314 - (percentage * 314);
        gaugePath.style.strokeDashoffset = offset;

        if (projectedRatio >= 3) {
            gaugePath.style.stroke = 'var(--success)';
            statusText.textContent = "High Velocity Engine";
            statusText.style.color = 'var(--success)';
            glow.style.background = 'radial-gradient(circle, var(--success) 0%, transparent 70%)';
            ctaButton.textContent = `Projected ${projectedRatio.toFixed(1)}:1 — Scale Immediately`;
        } else if (projectedRatio >= 1.5) {
            gaugePath.style.stroke = 'var(--warning)';
            statusText.textContent = "Growth Viable";
            statusText.style.color = 'var(--warning)';
            glow.style.background = 'radial-gradient(circle, var(--warning) 0%, transparent 70%)';
        } else {
            gaugePath.style.stroke = 'var(--danger)';
            statusText.textContent = "Unit Economics Risk";
            statusText.style.color = 'var(--danger)';
            glow.style.background = 'radial-gradient(circle, var(--danger) 0%, transparent 70%)';
        }
    }

    [churnOpt, expansionOpt, arpuIn, churnIn, cacIn].forEach(el => {
        el.addEventListener('input', runProjection);
    });
});