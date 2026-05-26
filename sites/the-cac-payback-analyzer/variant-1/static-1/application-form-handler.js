/**
 * Emerald Circuit - Application Form Handler v1.0
 * Part of Capital Readiness Portal: Funding Conversion Layer
 */

(function() {
    const styles = `
        .portal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 8, 7, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .portal-modal {
            background: var(--bg-card);
            border: 1px solid var(--emerald-dim);
            width: 90%;
            max-width: 600px;
            padding: 40px;
            border-radius: 20px;
            position: relative;
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.1);
        }

        .portal-modal::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 60px;
            height: 60px;
            border-bottom: 2px solid var(--emerald);
            border-right: 2px solid var(--emerald);
            border-radius: 0 0 20px 0;
        }

        .form-header {
            margin-bottom: 30px;
        }

        .form-header h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            color: #fff;
            margin-bottom: 8px;
        }

        .form-header p {
            color: var(--emerald);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .full-width { grid-column: span 2; }

        .upload-zone {
            border: 1px dashed var(--emerald-dim);
            background: rgba(0, 255, 136, 0.02);
            padding: 30px;
            text-align: center;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .upload-zone:hover {
            border-color: var(--emerald);
            background: rgba(0, 255, 136, 0.05);
        }

        .upload-zone i {
            display: block;
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .loading-bar-container {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.05);
            margin: 20px 0;
            display: none;
            overflow: hidden;
            border-radius: 2px;
        }

        .loading-bar-progress {
            width: 0%;
            height: 100%;
            background: var(--emerald);
            box-shadow: 0 0 10px var(--emerald-glow);
        }

        .verification-step {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-dim);
            margin-top: 5px;
            display: none;
        }

        .close-portal {
            position: absolute;
            top: 20px;
            right: 20px;
            color: var(--text-dim);
            cursor: pointer;
            font-family: 'JetBrains Mono', monospace;
        }

        .success-state {
            display: none;
            text-align: center;
            padding: 40px 0;
        }

        .success-state h2 { color: var(--emerald); }
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Modal HTML
    const modalHTML = `
        <div class="portal-overlay" id="portalOverlay">
            <div class="portal-modal">
                <span class="close-portal" id="closePortal">[ ESC_EXIT ]</span>
                
                <div id="applicationForm">
                    <div class="form-header">
                        <p>PROTOCOL: CAPITAL_INJECTION_V2</p>
                        <h2>Unlock Growth Capital</h2>
                    </div>

                    <form id="fundingForm" class="form-grid">
                        <div class="input-group full-width">
                            <label>Company Legal Name</label>
                            <div class="input-wrapper">
                                <input type="text" required placeholder="e.g. Emerald Circuit Systems" style="padding-left: 15px;">
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Contact Email</label>
                            <div class="input-wrapper">
                                <input type="email" required placeholder="ceo@company.com" style="padding-left: 15px;">
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Desired Funding</label>
                            <div class="input-wrapper">
                                <span class="unit">$</span>
                                <input type="number" required placeholder="500,000">
                            </div>
                        </div>
                        <div class="input-group full-width">
                            <label>Financial Statements (Last 6 Months)</label>
                            <div class="upload-zone" id="dropZone">
                                <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">
                                    DRAG & DROP P&L OR LINK QUICKBOOKS<br>
                                    <span style="color: var(--text-dim); opacity: 0.6;">(PDF, CSV, or XLSX)</span>
                                </p>
                                <input type="file" id="fileInput" hidden>
                            </div>
                        </div>
                        
                        <div class="loading-bar-container" id="loader">
                            <div class="loading-bar-progress" id="progressBar"></div>
                        </div>
                        <div class="verification-step" id="verifyText">INITIALIZING_DATA_SCRUB...</div>

                        <div class="cta-container full-width" style="margin-top: 10px;">
                            <button type="submit" class="btn-primary" style="width: 100%;">Verify & Generate Offer</button>
                        </div>
                    </form>
                </div>

                <div id="successState" class="success-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">⚡</div>
                    <h2>Verification Complete</h2>
                    <p style="font-family: 'JetBrains Mono', monospace; color: var(--text-dim); margin-top: 15px;">
                        CAC metrics confirmed at <span id="finalCac" style="color: var(--emerald)">$0</span>.<br>
                        Your 'Money Printer' limit has been raised to $1.2M.<br>
                        Check your inbox for the executable term sheet.
                    </p>
                    <button class="btn-primary" style="margin-top: 30px;" onclick="window.location.reload()">Return to Dashboard</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Logic
    const overlay = document.getElementById('portalOverlay');
    const openBtn = document.querySelector('.btn-primary');
    const closeBtn = document.getElementById('closePortal');
    const form = document.getElementById('fundingForm');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');
    const verifyText = document.getElementById('verifyText');
    const formContent = document.getElementById('applicationForm');
    const successState = document.getElementById('successState');

    const openModal = () => {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.style.opacity = '1', 10);
    };

    const closeModal = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 400);
    };

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);

    dropZone.addEventListener('click', () => fileInput.click());

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Visual simulation of analysis
        loader.style.display = 'block';
        verifyText.style.display = 'block';
        form.querySelector('button').disabled = true;
        form.querySelector('button').style.opacity = '0.5';

        const steps = [
            "CONNECTING_TO_LEDGER...",
            "EXTRACTING_AD_SPEND_SIGNALS...",
            "CALCULATING_LTV_RATIOS...",
            "VALIDATING_UNIT_ECONOMICS...",
            "GENERATING_SMART_CONTRACT..."
        ];

        let progress = 0;
        let stepIdx = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (progress > (stepIdx + 1) * 20 && stepIdx < steps.length) {
                verifyText.textContent = steps[stepIdx];
                stepIdx++;
            }

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(showSuccess, 800);
            }
        }, 300);
    });

    function showSuccess() {
        const currentCac = document.getElementById('cac-val').textContent;
        document.getElementById('finalCac').textContent = currentCac;
        formContent.style.display = 'none';
        successState.style.display = 'block';
    }

    // Handle Escape Key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
})();