const alchemyStyles = `
    .alchemy-section {
        margin-top: 80px;
        border-top: 1px solid var(--border);
        padding-top: 60px;
    }

    .alchemy-header {
        margin-bottom: 40px;
    }

    .alchemy-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 20px;
    }

    .edu-card {
        grid-column: span 4;
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        transition: transform 0.3s ease;
    }

    .edu-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
    }

    .edu-card h3 {
        font-size: 1.1rem;
        margin-bottom: 12px;
        color: var(--accent);
    }

    .edu-card p {
        font-size: 0.85rem;
        color: var(--text-dim);
    }

    .calculator-card {
        grid-column: span 12;
        background: linear-gradient(145deg, #0d0d0d 0%, #050505 100%);
        border: 1px solid var(--accent-glow);
        border-radius: 16px;
        padding: 30px;
        margin-top: 20px;
    }

    .calc-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }

    .calc-input-area textarea {
        height: 150px;
        background: #000;
        border: 1px solid var(--border);
        margin-bottom: 15px;
    }

    .metrics-display {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
    }

    .metric-item {
        width: 100%;
    }

    .metric-label {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        margin-bottom: 8px;
        text-transform: uppercase;
    }

    .bar-bg {
        width: 100%;
        height: 4px;
        background: #222;
        border-radius: 2px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: var(--accent);
        width: 0%;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px var(--accent-glow);
    }

    @media (max-width: 768px) {
        .edu-card { grid-column: span 12; }
        .calc-container { grid-template-columns: 1fr; }
    }
`;

const alchemyHTML = `
    <section class="alchemy-section">
        <div class="alchemy-header">
            <div class="card-label">Optimization Guide</div>
            <h2 style="font-size: 2rem; margin-top: 10px;">Prompt Alchemy</h2>
        </div>

        <div class="alchemy-grid">
            <div class="edu-card">
                <div class="card-label">Tip 01</div>
                <h3>Atomic Specificity</h3>
                <p>Instead of "modern button", use "semi-transparent pill-shaped button with 2px frosted border and 15px backdrop-blur". High-fidelity details reduce AI hallucination.</p>
            </div>
            <div class="edu-card">
                <div class="card-label">Tip 02</div>
                <h3>Negative Constraints</h3>
                <p>Explicitly define what to avoid. "No rounded corners, no gradients, no serif fonts" creates a much tighter visual boundary for the generator.</p>
            </div>
            <div class="edu-card">
                <div class="card-label">Tip 03</div>
                <h3>Structural Anchors</h3>
                <p>Group components by their layout relationship. Define 'Container > Wrapper > Item' to help the LLM understand nested CSS logic.</p>
            </div>

            <div class="calculator-card">
                <div class="card-label">Impact Calculator</div>
                <div class="calc-container">
                    <div class="calc-input-area">
                        <textarea id="calcInput" placeholder="Paste your draft prompt here for analysis..."></textarea>
                        <button class="btn-outline" style="width: 100%" onclick="analyzePrompt()">Run Structural Analysis</button>
                    </div>
                    <div class="metrics-display">
                        <div class="metric-item">
                            <div class="metric-label"><span>Clarity Score</span><span id="clarityVal">0%</span></div>
                            <div class="bar-bg"><div id="clarityBar" class="bar-fill"></div></div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label"><span>Keyword Density</span><span id="densityVal">0%</span></div>
                            <div class="bar-bg"><div id="densityBar" class="bar-fill"></div></div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label"><span>Structural Integrity</span><span id="structVal">0%</span></div>
                            <div class="bar-bg"><div id="structBar" class="bar-fill"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

function injectAlchemy() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = alchemyStyles;
    document.head.appendChild(styleSheet);

    const historySection = document.querySelector('.history');
    const alchemyWrapper = document.createElement('div');
    alchemyWrapper.innerHTML = alchemyHTML;
    historySection.parentNode.insertBefore(alchemyWrapper, historySection);
}

function analyzePrompt() {
    const input = document.getElementById('calcInput').value;
    
    // Logic for scores
    const clarity = Math.min(Math.round((input.length / 300) * 100), 100);
    
    const keywords = ['layout', 'flex', 'grid', 'color', 'font', 'border', 'padding', 'glass', 'neon', 'shadow'];
    let foundKeywords = 0;
    keywords.forEach(word => { if(input.toLowerCase().includes(word)) foundKeywords++; });
    const density = Math.min((foundKeywords / keywords.length) * 100, 100);
    
    const hasBreaks = (input.match(/\n/g) || []).length;
    const hasList = (input.match(/[-*•]/g) || []).length;
    const structure = Math.min(((hasBreaks + hasList) / 8) * 100, 100);

    updateMetric('clarity', clarity);
    updateMetric('density', density);
    updateMetric('struct', structure);
}

function updateMetric(id, val) {
    document.getElementById(id + 'Bar').style.width = val + '%';
    document.getElementById(id + 'Val').innerText = val + '%';
}

// Initialize on load
window.addEventListener('DOMContentLoaded', injectAlchemy);