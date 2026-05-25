/**
 * EQUITY TERMINAL | LISTING ARCHITECT
 * Submission Engine & Intelligence Scorer
 */

const ListingArchitect = (() => {
    let currentScore = 0;
    const scoreWeights = {
        title: 5,
        industry: 5,
        revenue: 10,
        sde: 15,
        description: 15,
        taxReturns: 25,
        pAndL: 20,
        askingPrice: 5
    };

    const state = {
        data: {},
        verifications: {
            taxReturns: false,
            pAndL: false
        }
    };

    const styles = `
        .architect-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--obsidian);
            z-index: 3000;
            display: none;
            overflow-y: auto;
            padding: 2rem;
        }

        .architect-container {
            max-width: 1000px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 2rem;
        }

        .architect-form {
            background: var(--graphite);
            padding: 3rem;
            border: var(--border-thick) solid var(--graphite-light);
        }

        .architect-sidebar {
            position: sticky;
            top: 2rem;
            height: fit-content;
        }

        .score-box {
            background: var(--graphite-light);
            padding: 2rem;
            border: var(--border-thick) solid var(--bone);
            text-align: center;
        }

        .score-value {
            font-size: 5rem;
            font-weight: 800;
            line-height: 1;
            margin: 1rem 0;
            color: var(--acid-green);
        }

        .score-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: var(--bone);
            letter-spacing: 2px;
        }

        .progress-container {
            height: 8px;
            background: #333;
            margin: 1rem 0;
            position: relative;
        }

        .progress-bar {
            height: 100%;
            background: var(--acid-green);
            width: 0%;
            transition: width 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .form-section { margin-bottom: 3rem; }
        .section-header { 
            font-family: 'JetBrains Mono', monospace; 
            font-size: 0.7rem; 
            color: var(--oxidized-copper); 
            margin-bottom: 1.5rem; 
            border-bottom: 1px solid var(--graphite-light);
            padding-bottom: 0.5rem;
        }

        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .input-group input, .input-group textarea, .input-group select {
            width: 100%;
            background: transparent;
            border: 1px solid var(--graphite-light);
            padding: 1rem;
            color: var(--bone);
            font-family: 'Inter', sans-serif;
            outline: none;
        }
        .input-group input:focus { border-color: var(--acid-green); }

        .file-upload-zone {
            border: 2px dashed var(--graphite-light);
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .file-upload-zone:hover { border-color: var(--acid-green); background: rgba(193, 255, 0, 0.02); }
        .file-upload-zone.active { border-color: var(--acid-green); background: rgba(193, 255, 0, 0.1); }

        .requirement-list { margin-top: 2rem; }
        .requirement-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem;
            margin-bottom: 0.5rem;
            color: #666;
        }
        .requirement-item.met { color: var(--acid-green); }
        .requirement-item.met::before { content: "✓"; }
        .requirement-item:not(.met)::before { content: "○"; }

        .architect-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4rem;
        }
    `;

    function init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const architectHTML = `
            <div id="listingArchitect" class="architect-overlay">
                <div class="architect-nav">
                    <div class="logo mono">LISTING.ARCHITECT v1.0</div>
                    <button class="btn btn-secondary mono" onclick="ListingArchitect.close()" style="padding: 0.5rem 1rem;">Exit Portal</button>
                </div>
                
                <div class="architect-container">
                    <main class="architect-form">
                        <div class="form-section">
                            <div class="section-header">01 // BASIC DISCLOSURE</div>
                            <div class="input-group">
                                <label>DEAL TITLE (PUBLIC)</label>
                                <input type="text" id="arc_title" placeholder="e.g. High-Margin HVAC Enterprise" oninput="ListingArchitect.updateScore()">
                            </div>
                            <div class="input-group">
                                <label>INDUSTRY CLASSIFICATION</label>
                                <select id="arc_industry" onchange="ListingArchitect.updateScore()">
                                    <option value="">SELECT SECTOR...</option>
                                    <option value="Home Services">Home Services</option>
                                    <option value="Digital">Digital / SaaS</option>
                                    <option value="Industrial">Industrial</option>
                                    <option value="Retail">Retail</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-header">02 // FINANCIAL VITALS (TTM)</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="input-group">
                                    <label>GROSS REVENUE ($)</label>
                                    <input type="number" id="arc_revenue" placeholder="0.00" oninput="ListingArchitect.updateScore()">
                                </div>
                                <div class="input-group">
                                    <label>SELLER DISCRETIONARY EARNINGS ($)</label>
                                    <input type="number" id="arc_sde" placeholder="0.00" oninput="ListingArchitect.updateScore()">
                                </div>
                            </div>
                            <div class="input-group">
                                <label>ASKING PRICE ($)</label>
                                <input type="number" id="arc_price" placeholder="0.00" oninput="ListingArchitect.updateScore()">
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-header">03 // VERIFICATION DOCUMENTS (ENCRYPTED)</div>
                            <div style="display: grid; gap: 1rem;">
                                <div class="file-upload-zone" onclick="ListingArchitect.simulateUpload('taxReturns')">
                                    <div class="mono" style="font-size: 0.7rem;">UPLOAD LAST 3 YEARS TAX RETURNS (PDF)</div>
                                    <div id="status_taxReturns" style="font-size: 0.6rem; margin-top: 0.5rem; color: #555;">NO FILE ATTACHED</div>
                                </div>
                                <div class="file-upload-zone" onclick="ListingArchitect.simulateUpload('pAndL')">
                                    <div class="mono" style="font-size: 0.7rem;">UPLOAD CURRENT P&L STATEMENT</div>
                                    <div id="status_pAndL" style="font-size: 0.6rem; margin-top: 0.5rem; color: #555;">NO FILE ATTACHED</div>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-header">04 // ASSET DESCRIPTION</div>
                            <div class="input-group">
                                <label>OPERATIONAL OVERVIEW (MIN 200 CHARS)</label>
                                <textarea id="arc_desc" rows="6" placeholder="Describe day-to-day operations, growth opportunities, and reason for sale..." oninput="ListingArchitect.updateScore()"></textarea>
                            </div>
                        </div>

                        <button id="submitDealBtn" class="btn btn-primary mono" style="width: 100%; opacity: 0.3; pointer-events: none;">Initialize Submission</button>
                    </main>

                    <aside class="architect-sidebar">
                        <div class="score-box">
                            <div class="score-label">INTELLIGENCE SCORE</div>
                            <div id="intelligenceScore" class="score-value">0</div>
                            <div class="progress-container">
                                <div id="scoreProgress" class="progress-bar"></div>
                            </div>
                            <p class="mono" style="font-size: 0.6rem; color: #888; text-align: left;">
                                High-signal listings (Score > 80) receive 4x more engagement and priority placement in the Terminal.
                            </p>
                        </div>

                        <div class="requirement-list">
                            <div id="req_basic" class="requirement-item">Basic Identity</div>
                            <div id="req_fin" class="requirement-item">Financial Verification</div>
                            <div id="req_docs" class="requirement-item">Tax Documentation</div>
                            <div id="req_quality" class="requirement-item">Description Depth</div>
                            <div id="req_pricing" class="requirement-item">Realistic Multiple (< 4.5x)</div>
                        </div>
                    </aside>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = architectHTML;
        document.body.appendChild(div);
    }

    function updateScore() {
        let score = 0;
        
        // Input Checks
        const title = document.getElementById('arc_title').value;
        const industry = document.getElementById('arc_industry').value;
        const revenue = document.getElementById('arc_revenue').value;
        const sde = document.getElementById('arc_sde').value;
        const price = document.getElementById('arc_price').value;
        const desc = document.getElementById('arc_desc').value;

        if (title.length > 5) score += scoreWeights.title;
        if (industry) score += scoreWeights.industry;
        if (revenue > 0) score += scoreWeights.revenue;
        if (sde > 0) score += scoreWeights.sde;
        if (price > 0) score += scoreWeights.askingPrice;
        if (desc.length > 200) score += scoreWeights.description;
        
        // Simulated Doc Checks
        if (state.verifications.taxReturns) score += scoreWeights.taxReturns;
        if (state.verifications.pAndL) score += scoreWeights.pAndL;

        // Visual Updates
        const scoreEl = document.getElementById('intelligenceScore');
        const progressEl = document.getElementById('scoreProgress');
        const submitBtn = document.getElementById('submitDealBtn');

        scoreEl.innerText = score;
        progressEl.style.width = score + '%';

        // Requirement Indicators
        document.getElementById('req_basic').classList.toggle('met', title.length > 5 && industry);
        document.getElementById('req_fin').classList.toggle('met', revenue > 0 && sde > 0);
        document.getElementById('req_docs').classList.toggle('met', state.verifications.taxReturns);
        document.getElementById('req_quality').classList.toggle('met', desc.length > 200);
        
        if (sde > 0 && price > 0) {
            const mult = price / sde;
            document.getElementById('req_pricing').classList.toggle('met', mult < 4.5);
        }

        if (score >= 70) {
            submitBtn.style.opacity = "1";
            submitBtn.style.pointerEvents = "all";
            scoreEl.style.color = "var(--acid-green)";
        } else {
            submitBtn.style.opacity = "0.3";
            submitBtn.style.pointerEvents = "none";
            scoreEl.style.color = "var(--bone)";
        }

        currentScore = score;
    }

    function simulateUpload(type) {
        const statusEl = document.getElementById(`status_${type}`);
        statusEl.innerText = "UPLOADING...";
        statusEl.style.color = "var(--copper-glow)";

        setTimeout(() => {
            state.verifications[type] = true;
            statusEl.innerText = "VERIFIED: " + (type === 'taxReturns' ? "TAX_RETURNS_3YR.PDF" : "P_AND_L_2023.XLSX");
            statusEl.style.color = "var(--acid-green)";
            updateScore();
        }, 1200);
    }

    function open() {
        document.getElementById('listingArchitect').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function close() {
        document.getElementById('listingArchitect').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Attach to window for the "SUBMIT" nav link in base component
    window.onload = () => {
        init();
        const submitLinks = document.querySelectorAll('a');
        submitLinks.forEach(link => {
            if (link.textContent === 'SUBMIT') {
                link.href = "javascript:void(0)";
                link.onclick = (e) => {
                    e.preventDefault();
                    open();
                };
            }
        });
    };

    return {
        updateScore,
        simulateUpload,
        open,
        close
    };
})();