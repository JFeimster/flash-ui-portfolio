/**
 * ACQUISITION INDEX // BROKER SUBMISSION PORTAL
 * Logic and UI Handler for Stealth-Mode Deal Intake
 */

(function() {
    const STATE = {
        currentStep: 1,
        totalSteps: 4,
        dealData: {
            title: '',
            industry: '',
            revenue: 0,
            sde: 0,
            asking: 0,
            description: '',
            files: []
        },
        qualityScore: 0
    };

    const style = document.createElement('style');
    style.textContent = `
        #broker-portal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--obsidian);
            z-index: 2000;
            display: none;
            flex-direction: column;
            overflow-y: auto;
            padding: 4rem 2rem;
        }

        .portal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4rem;
            border-bottom: 2px solid var(--bone);
            padding-bottom: 2rem;
        }

        .step-indicator {
            font-family: 'JetBrains Mono', monospace;
            font-size: 3rem;
            color: var(--acid-green);
        }

        .portal-content {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        .portal-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 4rem;
        }

        .form-step { display: none; }
        .form-step.active { display: block; }

        .editorial-input {
            background: transparent;
            border: none;
            border-bottom: 3px solid var(--graphite);
            color: var(--bone);
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 5vw, 4.5rem);
            width: 100%;
            padding: 1rem 0;
            outline: none;
            margin-bottom: 3rem;
            transition: border-color 0.3s;
        }

        .editorial-input:focus {
            border-color: var(--acid-green);
        }

        .label-mono {
            display: block;
            font-family: 'JetBrains Mono', monospace;
            color: var(--copper);
            text-transform: uppercase;
            margin-bottom: 1rem;
        }

        .drop-zone {
            border: 2px dashed var(--graphite);
            padding: 4rem;
            text-align: center;
            transition: all 0.3s;
            background: rgba(20, 20, 20, 0.5);
        }

        .drop-zone.drag-over {
            border-color: var(--acid-green);
            background: rgba(197, 255, 0, 0.05);
        }

        .score-card {
            background: var(--graphite);
            padding: 2rem;
            border: 1px solid var(--bone);
            position: sticky;
            top: 2rem;
        }

        .score-bar-container {
            height: 4px;
            background: #222;
            margin: 1.5rem 0;
        }

        #score-fill {
            height: 100%;
            background: var(--acid-green);
            width: 0%;
            transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portal-nav {
            margin-top: 4rem;
            display: flex;
            gap: 1rem;
        }

        .close-portal {
            position: fixed;
            top: 2rem;
            right: 2rem;
            font-size: 2rem;
            cursor: pointer;
            z-index: 2001;
        }
    `;
    document.head.appendChild(style);

    const portalHTML = `
        <div id="broker-portal-overlay">
            <div class="close-portal mono" onclick="document.getElementById('broker-portal-overlay').style.display='none'">[ ESC ]</div>
            
            <div class="portal-content">
                <div class="portal-header">
                    <div>
                        <div class="mono" style="color: var(--acid-green)">// STEALTH LISTING INTAKE</div>
                        <h2 class="editorial" style="font-size: 2rem; color: var(--bone)">Alpha Submission Room</h2>
                    </div>
                    <div class="step-indicator" id="step-num">01</div>
                </div>

                <div class="portal-grid">
                    <div id="form-container">
                        <!-- Step 1 -->
                        <div class="form-step active" data-step="1">
                            <span class="label-mono">Business Name / Project Alias</span>
                            <input type="text" class="editorial-input" id="deal-title" placeholder="e.g. Project Phoenix HVAC" oninput="updatePortalData()">
                            
                            <span class="label-mono">Primary Industry Sector</span>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                <button class="btn btn-outline category-btn" onclick="setIndustry('SaaS')">SaaS / Software</button>
                                <button class="btn btn-outline category-btn" onclick="setIndustry('Services')">Home Services</button>
                                <button class="btn btn-outline category-btn" onclick="setIndustry('Ecommerce')">Ecommerce</button>
                                <button class="btn btn-outline category-btn" onclick="setIndustry('Manufacturing')">Manufacturing</button>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="form-step" data-step="2">
                            <span class="label-mono">Financial Performance (Annual)</span>
                            <div style="display: flex; flex-direction: column; gap: 2rem;">
                                <div>
                                    <span class="label-mono" style="font-size: 0.7rem;">Gross Revenue ($)</span>
                                    <input type="number" class="editorial-input" id="deal-revenue" placeholder="0.00" oninput="updatePortalData()">
                                </div>
                                <div>
                                    <span class="label-mono" style="font-size: 0.7rem;">Seller Discretionary Earnings ($)</span>
                                    <input type="number" class="editorial-input" id="deal-sde" placeholder="0.00" oninput="updatePortalData()">
                                </div>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="form-step" data-step="3">
                            <span class="label-mono">Upload Documentation (CIM, Financials, Tax Returns)</span>
                            <div id="cim-drop-zone" class="drop-zone">
                                <p class="mono">Drag & Drop Encrypted PDF or Excel</p>
                                <p style="font-size: 0.8rem; color: var(--copper); margin-top: 1rem;">FILES REMAIN CLIENT-SIDE UNTIL SUBMISSION</p>
                            </div>
                            <div id="file-list" style="margin-top: 2rem;" class="mono"></div>
                        </div>

                        <!-- Step 4 -->
                        <div class="form-step" data-step="4">
                            <h2 class="editorial" style="font-size: 3rem; margin-bottom: 2rem;">Finalize Stealth Listing</h2>
                            <p style="color: var(--copper); margin-bottom: 2rem;">Your deal will be reviewed by our analysts within 2 hours. High-quality listings are featured on the main terminal dashboard.</p>
                            <button class="big-btn" style="width: 100%;" onclick="finalizeSubmission()">Broadcast to Terminal</button>
                        </div>

                        <div class="portal-nav">
                            <button class="btn btn-outline" id="prev-step" onclick="changeStep(-1)" style="visibility: hidden;">Back</button>
                            <button class="btn btn-primary" id="next-step" onclick="changeStep(1)">Continue</button>
                        </div>
                    </div>

                    <div class="score-sidebar">
                        <div class="score-card">
                            <div class="mono" style="font-size: 0.7rem;">Deal Quality Score</div>
                            <div id="score-value" style="font-size: 3rem; font-weight: 900;">0%</div>
                            <div class="score-bar-container">
                                <div id="score-fill"></div>
                            </div>
                            <ul id="score-requirements" class="mono" style="font-size: 0.65rem; list-style: none; color: var(--copper);">
                                <li id="req-title">× Title Provided</li>
                                <li id="req-ind">× Industry Selected</li>
                                <li id="req-fin">× Financials Input</li>
                                <li id="req-file">× CIM Document</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject Portal
    const div = document.createElement('div');
    div.innerHTML = portalHTML;
    document.body.appendChild(div);

    // Wire up the navigation link in the base component
    const submitBtn = document.querySelector('nav a[style*="acid-green"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('broker-portal-overlay').style.display = 'flex';
        });
    }

    // Portal Logic
    window.changeStep = function(delta) {
        STATE.currentStep += delta;
        if (STATE.currentStep < 1) STATE.currentStep = 1;
        if (STATE.currentStep > STATE.totalSteps) STATE.currentStep = STATE.totalSteps;

        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${STATE.currentStep}"]`).classList.add('active');
        
        document.getElementById('step-num').innerText = STATE.currentStep.toString().padStart(2, '0');
        document.getElementById('prev-step').style.visibility = STATE.currentStep === 1 ? 'hidden' : 'visible';
        document.getElementById('next-step').style.display = STATE.currentStep === 4 ? 'none' : 'block';
    };

    window.setIndustry = function(ind) {
        STATE.dealData.industry = ind;
        document.querySelectorAll('.category-btn').forEach(b => {
            b.style.borderColor = b.innerText.includes(ind) ? 'var(--acid-green)' : 'var(--bone)';
        });
        updatePortalData();
    };

    window.updatePortalData = function() {
        STATE.dealData.title = document.getElementById('deal-title').value;
        STATE.dealData.revenue = parseFloat(document.getElementById('deal-revenue').value) || 0;
        STATE.dealData.sde = parseFloat(document.getElementById('deal-sde').value) || 0;
        calculateScore();
    };

    function calculateScore() {
        let score = 0;
        const reqs = {
            title: STATE.dealData.title.length > 3,
            ind: STATE.dealData.industry !== '',
            fin: STATE.dealData.revenue > 0 && STATE.dealData.sde > 0,
            file: STATE.dealData.files.length > 0
        };

        if (reqs.title) score += 25;
        if (reqs.ind) score += 25;
        if (reqs.fin) score += 25;
        if (reqs.file) score += 25;

        STATE.qualityScore = score;
        document.getElementById('score-value').innerText = `${score}%`;
        document.getElementById('score-fill').style.width = `${score}%`;
        
        document.getElementById('req-title').style.color = reqs.title ? 'var(--acid-green)' : 'var(--copper)';
        document.getElementById('req-ind').style.color = reqs.ind ? 'var(--acid-green)' : 'var(--copper)';
        document.getElementById('req-fin').style.color = reqs.fin ? 'var(--acid-green)' : 'var(--copper)';
        document.getElementById('req-file').style.color = reqs.file ? 'var(--acid-green)' : 'var(--copper)';
        
        document.getElementById('req-title').innerText = `${reqs.title ? '✓' : '×'} Title Provided`;
        document.getElementById('req-ind').innerText = `${reqs.ind ? '✓' : '×'} Industry Selected`;
        document.getElementById('req-fin').innerText = `${reqs.fin ? '✓' : '×'} Financials Input`;
        document.getElementById('req-file').innerText = `${reqs.file ? '✓' : '×'} CIM Document`;
    }

    // Drag and Drop Logic
    const dropZone = document.getElementById('cim-drop-zone');
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        STATE.dealData.files = [...STATE.dealData.files, ...files];
        
        document.getElementById('file-list').innerHTML = STATE.dealData.files.map(f => `<div>[ FILE: ${f.name} - ${Math.round(f.size/1024)}KB ]</div>`).join('');
        updatePortalData();
    });

    window.finalizeSubmission = function() {
        if (STATE.qualityScore < 75) {
            alert("DEAL QUALITY TOO LOW FOR TERMINAL BROADCAST. PLEASE COMPLETE ALL STEPS.");
            return;
        }
        
        const btn = document.querySelector('.big-btn');
        btn.innerText = "ESTABLISHING SECURE UPLINK...";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = "BROADCAST COMPLETE // DEAL LIVE";
            btn.style.background = "var(--acid-green)";
            btn.style.color = "var(--obsidian)";
            
            setTimeout(() => {
                document.getElementById('broker-portal-overlay').style.display = 'none';
                alert("Alpha Listing Broadcast Successful. Monitoring status enabled.");
            }, 1500);
        }, 2000);
    };

})();