const WizardStyles = `
    .onboarding-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--obsidian);
        z-index: 2000;
        display: none;
        grid-template-columns: 1fr 450px;
        overflow: hidden;
    }

    .wizard-container {
        padding: 4rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        border-right: var(--border-width) solid var(--graphite);
    }

    .preview-container {
        background: #0a0a0a;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .preview-label {
        position: absolute;
        top: 2rem;
        left: 2rem;
        color: var(--oxidized-copper);
    }

    .wizard-header {
        margin-bottom: 4rem;
    }

    .step-indicator {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .step-dot {
        height: 4px;
        flex-grow: 1;
        background: var(--graphite);
        transition: background 0.3s;
    }

    .step-dot.active {
        background: var(--acid-green);
    }

    .wizard-step {
        display: none;
        animation: fadeIn 0.4s ease-out;
    }

    .wizard-step.active {
        display: block;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .form-group {
        margin-bottom: 2.5rem;
    }

    .form-group label {
        display: block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: #666;
        margin-bottom: 1rem;
        text-transform: uppercase;
    }

    .form-input {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 2px solid var(--graphite);
        color: var(--bone);
        font-size: 2rem;
        font-weight: 700;
        padding: 0.5rem 0;
        outline: none;
        transition: border-color 0.3s;
    }

    .form-input:focus {
        border-color: var(--acid-green);
    }

    .form-input::placeholder {
        color: #222;
    }

    .wizard-nav {
        margin-top: auto;
        display: flex;
        gap: 1rem;
        padding-top: 4rem;
    }

    .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        padding: 1rem;
        border: 1px solid var(--graphite);
    }

    .checkbox-group:hover {
        border-color: var(--bone);
    }

    .checkbox-group input {
        accent-color: var(--acid-green);
        width: 20px;
        height: 20px;
    }
`;

class AssetOnboardingWizard {
    constructor() {
        this.currentStep = 1;
        this.data = {
            title: "",
            industry: "Local Service",
            location: "Remote",
            price: 0,
            revenue: 0,
            sde: 0,
            multiple: 0,
            sellerFin: false,
            featured: false,
            status: "Active",
            category: "Local Service"
        };

        this.injectStyles();
        this.createDOM();
        this.bindEvents();
    }

    injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = WizardStyles;
        document.head.appendChild(styleSheet);
    }

    createDOM() {
        const overlay = document.createElement('div');
        overlay.id = 'onboardingWizard';
        overlay.className = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="wizard-container">
                <div class="wizard-header">
                    <span class="mono" style="color: var(--oxidized-copper); font-size: 0.8rem; margin-bottom: 1rem; display: block;">/ / ASSET SUBMISSION PORTAL</span>
                    <h2 style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase;">List Your Acquisition</h2>
                </div>

                <div class="step-indicator">
                    <div class="step-dot active" data-step="1"></div>
                    <div class="step-dot" data-step="2"></div>
                    <div class="step-dot" data-step="3"></div>
                </div>

                <!-- Step 1: Identity -->
                <div class="wizard-step active" data-step="1">
                    <div class="form-group">
                        <label>Business Name / Listing Title</label>
                        <input type="text" class="form-input" data-key="title" placeholder="e.g. Precision HVAC & Cooling">
                    </div>
                    <div class="input-row">
                        <div class="form-group">
                            <label>Industry</label>
                            <input type="text" class="form-input" style="font-size: 1.2rem;" data-key="industry" placeholder="SaaS, Agency, etc.">
                        </div>
                        <div class="form-group">
                            <label>Primary Location</label>
                            <input type="text" class="form-input" style="font-size: 1.2rem;" data-key="location" placeholder="City, State or Remote">
                        </div>
                    </div>
                </div>

                <!-- Step 2: Financials -->
                <div class="wizard-step" data-step="2">
                    <div class="form-group">
                        <label>Asking Price (USD)</label>
                        <input type="number" class="form-input" data-key="price" placeholder="0.00">
                    </div>
                    <div class="input-row">
                        <div class="form-group">
                            <label>Annual Revenue</label>
                            <input type="number" class="form-input" style="font-size: 1.2rem;" data-key="revenue" placeholder="0.00">
                        </div>
                        <div class="form-group">
                            <label>Annual SDE / Cash Flow</label>
                            <input type="number" class="form-input" style="font-size: 1.2rem;" data-key="sde" placeholder="0.00">
                        </div>
                    </div>
                </div>

                <!-- Step 3: Terms & Validation -->
                <div class="wizard-step" data-step="3">
                    <div class="form-group">
                        <label>Terms & Conditions</label>
                        <div style="display: grid; gap: 1rem;">
                            <label class="checkbox-group">
                                <input type="checkbox" data-key="sellerFin">
                                <span class="mono" style="font-size: 0.8rem;">Offer Seller Financing</span>
                            </label>
                            <label class="checkbox-group">
                                <input type="checkbox" data-key="featured">
                                <span class="mono" style="font-size: 0.8rem;">Apply for Premium Placement</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Internal Notes / Risk Level</label>
                        <select class="form-input" style="font-size: 1.2rem; background: var(--panel);" data-key="risk">
                            <option value="Low">Low Risk (Stable)</option>
                            <option value="Medium">Medium Risk (Growth)</option>
                            <option value="High">High Risk (Turnaround)</option>
                        </select>
                    </div>
                </div>

                <div class="wizard-nav">
                    <button class="btn btn-secondary" id="wizPrev" style="display:none;">Back</button>
                    <button class="btn btn-primary" id="wizNext" style="flex-grow: 1;">Next Step</button>
                    <button class="btn btn-secondary" onclick="document.getElementById('onboardingWizard').style.display='none'">Exit</button>
                </div>
            </div>

            <div class="preview-container">
                <span class="preview-label mono">LIVE DIRECTORY PREVIEW</span>
                <div id="livePreviewCard" style="width: 100%; max-width: 400px;">
                    <!-- Rendered Card -->
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.updatePreview();
    }

    bindEvents() {
        const inputs = document.querySelectorAll('.form-input, input[type="checkbox"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.getAttribute('data-key');
                const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                this.data[key] = val;
                
                if (this.data.sde > 0 && this.data.price > 0) {
                    this.data.multiple = (this.data.price / this.data.sde).toFixed(2);
                }

                this.updatePreview();
            });
        });

        document.getElementById('wizNext').addEventListener('click', () => this.navigate(1));
        document.getElementById('wizPrev').addEventListener('click', () => this.navigate(-1));
    }

    navigate(dir) {
        const steps = document.querySelectorAll('.wizard-step');
        const dots = document.querySelectorAll('.step-dot');
        const nextBtn = document.getElementById('wizNext');
        const prevBtn = document.getElementById('wizPrev');

        if (this.currentStep === 3 && dir === 1) {
            alert('Listing Submitted for Verification.');
            document.getElementById('onboardingWizard').style.display = 'none';
            return;
        }

        steps[this.currentStep - 1].classList.remove('active');
        dots[this.currentStep - 1].classList.remove('active');

        this.currentStep += dir;

        steps[this.currentStep - 1].classList.add('active');
        dots[this.currentStep - 1].classList.add('active');

        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
        nextBtn.innerText = this.currentStep === 3 ? 'Finalize & Submit' : 'Next Step';
    }

    formatCurrency(num) {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 0 
        }).format(num || 0);
    }

    updatePreview() {
        const preview = document.getElementById('livePreviewCard');
        preview.innerHTML = `
            <div class="listing-card" style="box-shadow: 10px 10px 0px var(--oxidized-copper);">
                <span class="industry-tag">${this.data.industry || 'INDUSTRY'}</span>
                <h3 class="listing-title">${this.data.title || 'LISTING TITLE'}</h3>
                <span class="price-display">${this.formatCurrency(this.data.price)}</span>
                <div class="metrics-grid">
                    <div class="metric-box">
                        <span class="label">Annual Revenue</span>
                        <span class="value">${this.formatCurrency(this.data.revenue)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="label">Annual SDE</span>
                        <span class="value">${this.formatCurrency(this.data.sde)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="label">Multiple</span>
                        <span class="value">${this.data.multiple}x</span>
                    </div>
                    <div class="metric-box">
                        <span class="label">Location</span>
                        <span class="value">${this.data.location || 'Remote'}</span>
                    </div>
                </div>
                <div class="badge-row">
                    ${this.data.sellerFin ? '<span class="badge badge-green">Seller Financing</span>' : ''}
                    ${this.data.featured ? '<span class="badge badge-copper">Premium Asset</span>' : ''}
                    <span class="badge badge-orange">Draft Preview</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary">View Deal</button>
                    <button class="btn btn-secondary">Analyze</button>
                </div>
            </div>
        `;
    }

    open() {
        document.getElementById('onboardingWizard').style.display = 'grid';
    }
}

// Global accessor for the system
window.ListingWizard = new AssetOnboardingWizard();

// Hook into existing navigation if present
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = Array.from(document.querySelectorAll('.nav-links a')).find(a => a.textContent === 'Submit Listing');
    if(submitBtn) {
        submitBtn.onclick = (e) => {
            e.preventDefault();
            window.ListingWizard.open();
        };
    }
});