const cacStyles = `
    .breakdown-trigger {
        cursor: pointer;
        color: var(--text-dim);
        font-size: 9px;
        text-decoration: underline;
        transition: color 0.2s ease;
    }
    .breakdown-trigger:hover {
        color: var(--accent);
    }
    .cac-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(4px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .cac-modal {
        background: var(--card-bg);
        border: 1px solid var(--border);
        width: 90%;
        max-width: 400px;
        padding: 30px;
        position: relative;
    }
    .cac-modal h2 {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 10px;
    }
    .cac-modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
        font-family: var(--font-mono);
        font-size: 14px;
        color: var(--text-dim);
    }
    .agg-grid {
        display: grid;
        gap: 15px;
    }
    .agg-input-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .agg-input-group label {
        font-family: var(--font-mono);
        font-size: 9px;
        color: var(--text-dim);
        text-transform: uppercase;
    }
    .agg-input-group input {
        background: #151515;
        border: 1px solid var(--border);
        color: var(--accent);
        padding: 10px;
        font-family: var(--font-mono);
        font-size: 14px;
        outline: none;
    }
    .agg-input-group input:focus {
        border-color: var(--accent);
    }
    .cac-summary {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px dashed var(--border);
    }
    .cac-summary-row {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 11px;
        margin-bottom: 5px;
    }
    .cac-total-highlight {
        color: var(--success);
        font-weight: 700;
        font-size: 14px;
    }
`;

const cacHtml = `
    <div class="cac-modal-overlay" id="cac-modal-overlay">
        <div class="cac-modal">
            <div class="cac-modal-close" id="close-aggregator">×</div>
            <h2>Fully Loaded CAC Breakdown</h2>
            <div class="agg-grid">
                <div class="agg-input-group">
                    <label>Paid Media / Ad Spend</label>
                    <input type="number" id="agg-ads" value="10000" placeholder="0">
                </div>
                <div class="agg-input-group">
                    <label>Sales & Marketing Salaries</label>
                    <input type="number" id="agg-salaries" value="5000" placeholder="0">
                </div>
                <div class="agg-input-group">
                    <label>S&M Software & Tools</label>
                    <input type="number" id="agg-tools" value="1000" placeholder="0">
                </div>
                <div class="agg-input-group" style="margin-top: 10px;">
                    <label style="color: var(--accent)">New Customers Acquired</label>
                    <input type="number" id="agg-custs" value="15" placeholder="1">
                </div>
            </div>
            <div class="cac-summary">
                <div class="cac-summary-row">
                    <span>Total Monthly Spend:</span>
                    <span id="agg-total-spend">$0</span>
                </div>
                <div class="cac-summary-row">
                    <span>Calculated CAC:</span>
                    <span id="agg-cac-result" class="cac-total-highlight">$0</span>
                </div>
            </div>
            <button class="primary-cta" id="apply-cac" style="margin-top: 20px; padding: 12px; font-size: 11px;">Apply to Diagnostic</button>
        </div>
    </div>
`;

function initExpenseAggregator() {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = cacStyles;
    document.head.appendChild(styleSheet);

    // Inject Modal
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = cacHtml;
    document.body.appendChild(modalContainer);

    // Add Breakdown link to the main CAC label
    const cacLabel = document.querySelector('label[for="cac"]');
    if (cacLabel) {
        const trigger = document.createElement("span");
        trigger.className = "breakdown-trigger";
        trigger.innerText = "Breakdown";
        trigger.onclick = () => document.getElementById('cac-modal-overlay').style.display = 'flex';
        cacLabel.appendChild(trigger);
    }

    const modal = document.getElementById('cac-modal-overlay');
    const closeBtn = document.getElementById('close-aggregator');
    const applyBtn = document.getElementById('apply-cac');
    
    const inputAds = document.getElementById('agg-ads');
    const inputSalaries = document.getElementById('agg-salaries');
    const inputTools = document.getElementById('agg-tools');
    const inputCusts = document.getElementById('agg-custs');
    
    const displayTotal = document.getElementById('agg-total-spend');
    const displayCac = document.getElementById('agg-cac-result');

    function calculateAggregatedCac() {
        const ads = parseFloat(inputAds.value) || 0;
        const salaries = parseFloat(inputSalaries.value) || 0;
        const tools = parseFloat(inputTools.value) || 0;
        const custs = Math.max(parseFloat(inputCusts.value) || 1, 1);

        const totalSpend = ads + salaries + tools;
        const finalCac = totalSpend / custs;

        displayTotal.textContent = `$${totalSpend.toLocaleString()}`;
        displayCac.textContent = `$${finalCac.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        return finalCac;
    }

    const refresh = () => calculateAggregatedCac();
    [inputAds, inputSalaries, inputTools, inputCusts].forEach(el => el.addEventListener('input', refresh));

    closeBtn.onclick = () => modal.style.display = 'none';
    
    applyBtn.onclick = () => {
        const result = calculateAggregatedCac();
        const mainCacInput = document.getElementById('cac');
        if (mainCacInput) {
            mainCacInput.value = Math.round(result);
            // Trigger the original app's update logic
            if (typeof updateDiagnostic === 'function') {
                updateDiagnostic();
            }
        }
        modal.style.display = 'none';
    };

    // Initial calc
    refresh();
}

// Run on load
if (document.readyState === 'complete') {
    initExpenseAggregator();
} else {
    window.addEventListener('load', initExpenseAggregator);
}
```