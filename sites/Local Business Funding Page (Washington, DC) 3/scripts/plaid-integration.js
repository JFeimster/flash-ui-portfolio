/**
 * District Capital - Secure Accelerated Application Portal
 * File: scripts/plaid-integration.js
 * Purpose: Handles Plaid Link flow, multi-step wizard state, and document upload validation
 */

class DistrictFundingPortal {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            businessName: '',
            requestedAmount: '',
            plaidToken: null,
            taxDocs: []
        };

        this.init();
    }

    init() {
        this.injectStyles();
        this.renderPortal();
        this.bindEvents();
    }

    injectStyles() {
        const styles = `
            .portal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 22, 41, 0.98);
                z-index: 9999;
                display: none;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(10px);
            }

            .portal-container {
                background: #162B45;
                width: 90%;
                max-width: 600px;
                padding: 50px;
                border: 1px solid rgba(197, 160, 89, 0.3);
                position: relative;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }

            .portal-progress {
                height: 4px;
                background: rgba(255,255,255,0.1);
                margin-bottom: 40px;
                position: relative;
            }

            .progress-bar {
                height: 100%;
                background: #C5A059;
                width: 25%;
                transition: width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            }

            .security-badge {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.7rem;
                color: #94A3B8;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                margin-bottom: 20px;
            }

            .security-badge svg {
                width: 14px;
                height: 14px;
                fill: #C5A059;
            }

            .portal-step {
                display: none;
                animation: fadeIn 0.4s ease-out;
            }

            .portal-step.active {
                display: block;
            }

            .portal-input {
                width: 100%;
                background: rgba(10, 22, 41, 0.5);
                border: 1px solid rgba(197, 160, 89, 0.2);
                padding: 15px;
                color: white;
                font-family: 'Inter', sans-serif;
                margin-bottom: 20px;
                outline: none;
            }

            .portal-input:focus {
                border-color: #C5A059;
            }

            .plaid-mock-button {
                width: 100%;
                padding: 20px;
                background: #fff;
                color: #0A1629;
                font-weight: 700;
                text-align: center;
                cursor: pointer;
                margin: 20px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s;
            }

            .plaid-mock-button:hover {
                transform: scale(1.02);
            }

            .upload-zone {
                border: 2px dashed rgba(197, 160, 89, 0.3);
                padding: 40px;
                text-align: center;
                cursor: pointer;
                margin-bottom: 20px;
                transition: background 0.3s;
            }

            .upload-zone:hover {
                background: rgba(197, 160, 89, 0.05);
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    renderPortal() {
        const portalHtml = `
            <div class="portal-overlay" id="portalOverlay">
                <div class="portal-container">
                    <div class="security-badge">
                        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.94h6.7c-.47 3.84-3 7.31-6.7 8.53V11.94z"/></svg>
                        256-bit AES Bank-Grade Security
                    </div>
                    
                    <div class="portal-progress">
                        <div class="progress-bar" id="portalProgressBar"></div>
                    </div>

                    <div id="step1" class="portal-step active">
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 10px;">Business Profile</h2>
                        <p style="color: #94A3B8; margin-bottom: 30px;">Let's start with the basics of your District operation.</p>
                        <input type="text" class="portal-input" placeholder="Legal Business Name" id="bizName">
                        <input type="number" class="portal-input" placeholder="Desired Funding Amount ($)" id="fundAmount">
                        <button class="cta-button" style="width: 100%; border: none; cursor: pointer;" onclick="districtPortal.nextStep()">Continue to Verification</button>
                    </div>

                    <div id="step2" class="portal-step">
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 10px;">Connect Finances</h2>
                        <p style="color: #94A3B8; margin-bottom: 30px;">Securely link your business bank account via Plaid for instant verification.</p>
                        <div class="plaid-mock-button" onclick="districtPortal.handlePlaidLink()">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Plaid_logo.svg" style="height: 20px;" alt="Plaid">
                            Link Bank Account
                        </div>
                        <p style="font-size: 0.75rem; color: #94A3B8; text-align: center;">We never see your login credentials. Read-only access for verification.</p>
                    </div>

                    <div id="step3" class="portal-step">
                        <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 10px;">DC Compliance</h2>
                        <p style="color: #94A3B8; margin-bottom: 30px;">Upload your most recent FR-800M or Clean Hands Certification.</p>
                        <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
                            <p id="fileNameDisplay">Drag & Drop or Click to Upload</p>
                            <input type="file" id="fileInput" hidden onchange="districtPortal.handleFileUpload(this)">
                        </div>
                        <button class="cta-button" style="width: 100%; border: none; cursor: pointer;" onclick="districtPortal.nextStep()">Finalize Application</button>
                    </div>

                    <div id="step4" class="portal-step">
                        <div style="text-align: center; padding: 20px;">
                            <div style="color: #C5A059; font-size: 4rem; margin-bottom: 20px;">✓</div>
                            <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 10px;">Application Submitted</h2>
                            <p style="color: #94A3B8; margin-bottom: 30px;">Our DC-based team is reviewing your profile. Expect a wire offer within 4 hours.</p>
                            <button class="cta-button cta-secondary" style="width: 100%;" onclick="districtPortal.closePortal()">Return to Site</button>
                        </div>
                    </div>

                    <button onclick="districtPortal.closePortal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; cursor: pointer; font-size: 1.5rem;">&times;</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', portalHtml);
    }

    bindEvents() {
        const triggers = document.querySelectorAll('a[href="#apply"], .nav-links .cta-button, .hero .cta-button:first-child');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPortal();
            });
        });
    }

    openPortal() {
        document.getElementById('portalOverlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closePortal() {
        document.getElementById('portalOverlay').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            document.getElementById(`step${this.currentStep}`).classList.remove('active');
            this.currentStep++;
            document.getElementById(`step${this.currentStep}`).classList.add('active');
            
            const progress = (this.currentStep / this.totalSteps) * 100;
            document.getElementById('portalProgressBar').style.width = `${progress}%`;
        }
    }

    handlePlaidLink() {
        // Mock Plaid Integration Flow
        const btn = document.querySelector('.plaid-mock-button');
        btn.innerText = 'Authenticating...';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            this.formData.plaidToken = 'tok_mock_123456789';
            this.nextStep();
        }, 1500);
    }

    handleFileUpload(input) {
        if (input.files && input.files[0]) {
            const fileName = input.files[0].name;
            document.getElementById('fileNameDisplay').innerText = `Attached: ${fileName}`;
            document.getElementById('fileNameDisplay').style.color = '#C5A059';
            this.formData.taxDocs.push(fileName);
        }
    }
}

// Global initialization
window.districtPortal = new DistrictFundingPortal();