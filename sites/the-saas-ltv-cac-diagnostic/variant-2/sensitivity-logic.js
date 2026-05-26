const styles = `
    .sensitivity-planner {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px dashed rgba(255, 255, 255, 0.1);
    }

    .planner-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        color: var(--neon-cyan);
        text-transform: uppercase;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .slider-row {
        margin-bottom: 20px;
    }

    .slider-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .slider-header span:first-child {
        font-size: 11px;
        color: var(--text-dim);
        font-weight: 700;
        text-transform: uppercase;
    }

    .slider-header .impact-val {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13px;
        color: var(--text-main);
    }

    .custom-range {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
    }

    .custom-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: var(--neon-cyan);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
        border: 2px solid white;
    }

    .leverage-reco {
        margin-top: 20px;
        padding: 12px;
        background: rgba(157, 0, 255, 0.05);
        border-left: 3px solid var(--neon-purple);
        border-radius: 4px;
    }

    .leverage-reco h4 {
        font-size: 12px;
        color: var(--neon-purple);
        text-transform: uppercase;
        margin-bottom: 4px;
    }

    .leverage-reco p {
        font-size: 12px;
        color: var(--text-dim);
        line-height: 1.4;
    }

    .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 15px;
    }

    .comp-stat {
        background: rgba(255,255,255,0.02);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
    }

    .comp-stat label {
        display: block;
        font-size: 9px;
        color: var(--text-dim);
        margin-bottom: 4px;
    }

    .comp-stat .val {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px;
        font-weight: 700;
    }
`;

const plannerHTML = `
    <div class="sensitivity-planner">
        <div class="planner-title">
            <span>Growth Lever Simulator</span>
            <span style="font-size: 10px; opacity: 0.6">Sensitivity Analysis</span>
        </div>

        <div class="slider-row">
            <div class="slider-header">
                <span>Optimize Pricing (ARPU)</span>
                <span class="impact-val" id="arpuImpactText">+0%</span>
            </div>
            <input type="range" id="arpuSlider" class="custom-range" min="0" max="50" value="0">
        </div>

        <div class="slider-row">
            <div class="slider-header">
                <span>Optimize Retention (Churn)</span>
                <span class="impact-val" id="churnImpactText">-0%</span>
            </div>
            <input type="range" id="churnSlider" class="custom-range" min="0" max="50" value="0">
        </div>

        <div class="comparison-grid">
            <div class="comp-stat">
                <label>Projected LTV:CAC</label>
                <div class="val" id="projRatio" style="color: var(--neon-cyan)">--</div>
            </div>
            <div class="comp-stat">
                <label>Efficiency Gain</label>
                <div class="val" id="efficiencyGain" style="color: var(--neon-green)">+0%</div>
            </div>
        </div>

        <div class="leverage-reco" id="recoBox">
            <h4 id="recoTitle">Strategic Priority</h4>
            <p id="recoText">Adjust sliders to see where product vs sales effort yields higher returns.</p>
        </div>
    </div>
`;

function injectPlanner() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const card = document.querySelector('.diagnostic-card');
    const plannerContainer = document.createElement('div');
    plannerContainer.innerHTML = plannerHTML;
    card.appendChild(plannerContainer);

    const arpuSlider = document.getElementById('arpuSlider');
    const churnSlider = document.getElementById('churnSlider');

    const updateSimulation = () => {
        const baseArpu = parseFloat(document.getElementById('arpu').value) || 0;
        const baseChurn = parseFloat(document.getElementById('churn').value) || 0;
        const baseCac = parseFloat(document.getElementById('cac').value) || 0;

        const arpuBoost = parseFloat(arpuSlider.value);
        const churnReduction = parseFloat(churnSlider.value);

        document.getElementById('arpuImpactText').innerText = `+${arpuBoost}%`;
        document.getElementById('churnImpactText').innerText = `-${churnReduction}%`;

        // Calculate Simulation
        const simArpu = baseArpu * (1 + (arpuBoost / 100));
        const simChurn = baseChurn * (1 - (churnReduction / 100));
        
        const baseLtv = baseChurn > 0 ? (baseArpu / (baseChurn / 100)) : 0;
        const simLtv = simChurn > 0 ? (simArpu / (simChurn / 100)) : 0;
        
        const baseRatio = baseCac > 0 ? baseLtv / baseCac : 0;
        const simRatio = baseCac > 0 ? simLtv / baseCac : 0;

        const ratioEl = document.getElementById('projRatio');
        ratioEl.innerText = simRatio.toFixed(1) + ':1';

        const gain = baseRatio > 0 ? ((simRatio - baseRatio) / baseRatio) * 100 : 0;
        document.getElementById('efficiencyGain').innerText = `+${gain.toFixed(0)}%`;

        // Recommendation Logic
        const recoTitle = document.getElementById('recoTitle');
        const recoText = document.getElementById('recoText');
        const recoBox = document.getElementById('recoBox');

        if (baseChurn > 7) {
            recoTitle.innerText = "Priority: Product Retention";
            recoText.innerText = "Your churn is the bottleneck. Even small retention gains outperform pricing increases currently.";
            recoBox.style.borderColor = 'var(--neon-red)';
        } else if (baseRatio < 2) {
            recoTitle.innerText = "Priority: Sales & Pricing";
            recoText.innerText = "Unit economics are tight. Focus on increasing ARPU to reach a sustainable 3:1 margin.";
            recoBox.style.borderColor = 'var(--neon-purple)';
        } else {
            recoTitle.innerText = "Priority: Scaling CAC";
            recoText.innerText = "Your engine is healthy. Focus on maintaining these ratios while increasing total spend.";
            recoBox.style.borderColor = 'var(--neon-green)';
        }
    };

    arpuSlider.addEventListener('input', updateSimulation);
    churnSlider.addEventListener('input', updateSimulation);
    
    // Sync with main inputs
    document.getElementById('arpu').addEventListener('input', updateSimulation);
    document.getElementById('churn').addEventListener('input', updateSimulation);
    document.getElementById('cac').addEventListener('input', updateSimulation);

    updateSimulation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPlanner);
} else {
    injectPlanner();
}