/**
 * ACQUISITION INDEX // FORM-STEPPER.JS
 * Premium Intake Portal Controller
 */

(function() {
    const styles = `
        .portal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--obsidian);
            z-index: 2000;
            display: none;
            overflow-y: auto;
            padding: 4rem 2rem;
        }

        .portal-container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .portal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4rem;
            border-bottom: 1px solid var(--graphite);
            padding-bottom: 2rem;
        }

        .deal-quality-meter {
            text-align: right;
        }

        .quality-bar-bg {
            width: 200px;
            height: 4px;
            background: var(--graphite);
            margin-top: 0.5rem;
            position: relative;
        }

        .quality-bar-fill {
            position: absolute;
            top: 0; left: 0; height: 100%;
            background: var(--acid-green);
            width: 0%;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 10px var(--acid-green);
        }

        .step-indicator {
            font-size: 0.7rem;
            margin-bottom: 1rem;
            display: block;
            color: var(--copper);
        }

        .portal-step {
            display: none;
            animation: stepFade 0.4s ease-out;
        }

        .portal-step.active { display: block; }

        @keyframes stepFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .portal-step h2 {
            font-size: clamp(2rem, 6vw, 5rem);
            line-height: 1;
            margin-bottom: 3rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .input-group {
            border-bottom: 1px solid var(--graphite);
            padding: 1rem 0;
            transition: border-color 0.2s;
        }

        .input-group:focus-within {
            border-color: var(--acid-green);
        }

        .input-group label {
            display: block;
            font-family: 'JetBrains Mono';
            font-size: 0.65rem;
            color: var(--copper);
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }

        .input-group input, .input-group select {
            width: 100%;
            background: transparent;
            border: none;
            color: var(--bone);
            font-size: 1.5rem;
            outline: none;
            font-family: 'Inter';
        }

        .upload-zone {
            border: 2px dashed var(--graphite);
            padding: 4rem 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            grid-column: span 2;
        }

        .upload-zone:hover, .upload-zone.dragover {
            border-color: var(--acid-green);
            background: rgba(197, 255, 0, 0.05);
        }

        .portal-nav {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        .close-portal {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: var(--bone);
            font-size: 2rem;
            cursor: pointer;
            z-index: 2001;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const steps = [
        {
            title: "Financial <span class='editorial'>Core.</span>",
            fields: ['revenue', 'sde', 'asking_price'],
            html: `
                <div class="form-grid">
                    <div class="input-group">
                        <label>Annual Revenue (LTM)</label>
                        <input type="number" placeholder="0.00" data-field="revenue">
                    </div>
                    <div class="input-group">
                        <label>Seller Discretionary Earnings</label>
                        <input type="number" placeholder="0.00" data-field="sde">
                    </div>
                    <div class="input-group">
                        <label>Asking Price</label>
                        <input type="number" placeholder="0.00" data-field="asking_price">
                    </div>
                    <div class="input-group">
                        <label>Inventory Included?</label>
                        <select data-field="inventory">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            `
        },
        {
            title: "Operations <span class='editorial'>DNA.</span>",
            fields: ['industry', 'location', 'employees'],
            html: `
                <div class="form-grid">
                    <div class="input-group">
                        <label>Primary Industry</label>
                        <input type="text" placeholder="e.g. HVAC, SaaS, Retail" data-field="industry">
                    </div>
                    <div class="input-group">
                        <label>HQ Location</label>
                        <input type="text" placeholder="City, State / Remote" data-field="location">
                    </div>
                    <div class="input-group">
                        <label>Full-time Employees</label>
                        <input type="number" placeholder="0" data-field="employees">
                    </div>
                    <div class="input-group">
                        <label>Year Established</label>
                        <input type="number" placeholder="YYYY" data-field="year">
                    </div>
                </div>
            `
        },
        {
            title: "The <span class='editorial'>Vault.</span>",
            fields: ['cim_upload'],
            html: `
                <div class="form-grid">
                    <div class="upload-zone" id="cim-dropzone">
                        <div class="mono" style="margin-bottom: 1rem;">[ Upload CIM / Pitch Deck ]</div>
                        <p class="editorial" style="font-size: 1.2rem; color: var(--copper);">Drag and drop PDF or DOCX files here</p>
                        <input type="file" id="cim-file" style="display:none">
                    </div>
                    <div class="input-group" style="grid-column: span 2;">
                        <label>Listing Teaser (Stealth Mode)</label>
                        <input type="text" placeholder="One sentence high-level description..." data-field="teaser">
                    </div>
                </div>
            `
        }
    ];

    class BrokerPortal {
        constructor() {
            this.currentStep = 0;
            this.formData = {};
            this.init();
        }

        init() {
            const overlay = document.createElement('div');
            overlay.className = 'portal-overlay';
            overlay.id = 'broker-portal';
            
            overlay.innerHTML = `
                <button class="close-portal" onclick="document.getElementById('broker-portal').style.display='none'">×</button>
                <div class="portal-container">
                    <div class="portal-header">
                        <div>
                            <div class="mono" style="color: var(--acid-green);">[ SECURE INTAKE TERMINAL ]</div>
                            <div class="logo" style="margin-top: 1rem;">ACQUISITION <span>INDEX</span></div>
                        </div>
                        <div class="deal-quality-meter">
                            <div class="mono">Deal Fidelity Score</div>
                            <div class="value mono" id="quality-val" style="font-size: 1.5rem; color: var(--acid-green);">0%</div>
                            <div class="quality-bar-bg">
                                <div class="quality-bar-fill" id="quality-fill"></div>
                            </div>
                        </div>
                    </div>
                    <div id="steps-container"></div>
                    <div class="portal-nav">
                        <button class="btn btn-outline" id="prev-step" style="display:none">Previous</button>
                        <button class="btn btn-primary" id="next-step" style="width: 200px">Next Step</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.renderSteps();
            this.attachEvents();
        }

        renderSteps() {
            const container = document.getElementById('steps-container');
            container.innerHTML = steps.map((step, idx) => `
                <div class="portal-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">
                    <span class="mono step-indicator">PHASE 0${idx + 1} / 03</span>
                    <h2>${step.title}</h2>
                    ${step.html}
                </div>
            `).join('');
        }

        attachEvents() {
            document.getElementById('next-step').addEventListener('click', () => this.navigate(1));
            document.getElementById('prev-step').addEventListener('click', () => this.navigate(-1));
            
            const inputs = document.querySelectorAll('.portal-overlay input, .portal-overlay select');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    this.formData[e.target.dataset.field] = e.target.value;
                    this.updateQualityScore();
                });
            });

            const dropzone = document.getElementById('cim-dropzone');
            if(dropzone) {
                dropzone.addEventListener('click', () => document.getElementById('cim-file').click());
                dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
                dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
                dropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('dragover');
                    const files = e.dataTransfer.files;
                    if(files.length) this.handleFileUpload(files[0]);
                });
            }
        }

        handleFileUpload(file) {
            const dz = document.getElementById('cim-dropzone');
            dz.innerHTML = `<div class="mono" style="color: var(--acid-green);">[ FILE ATTACHED: ${file.name.toUpperCase()} ]</div>`;
            this.formData.cim_upload = true;
            this.updateQualityScore();
        }

        navigate(dir) {
            const newStep = this.currentStep + dir;
            if (newStep >= 0 && newStep < steps.length) {
                document.querySelector(`.portal-step[data-step="${this.currentStep}"]`).classList.remove('active');
                this.currentStep = newStep;
                document.querySelector(`.portal-step[data-step="${this.currentStep}"]`).classList.add('active');
                
                document.getElementById('prev-step').style.display = this.currentStep === 0 ? 'none' : 'block';
                document.getElementById('next-step').innerText = this.currentStep === steps.length - 1 ? 'Submit Alpha' : 'Next Step';
            } else if (newStep === steps.length) {
                this.submitForm();
            }
        }

        updateQualityScore() {
            const totalFields = 8; // required logic fields
            let filled = Object.values(this.formData).filter(v => v && v !== '').length;
            let score = Math.min(Math.round((filled / totalFields) * 100), 100);
            
            document.getElementById('quality-val').innerText = `${score}%`;
            document.getElementById('quality-fill').style.width = `${score}%`;
        }

        submitForm() {
            const container = document.getElementById('steps-container');
            container.innerHTML = `
                <div class="portal-step active">
                    <h2 class="editorial">Transmission <br>Complete.</h2>
                    <p class="mono" style="font-size: 1.2rem; color: var(--acid-green);">Your listing has been queued for analyst review.</p>
                    <div style="margin-top: 3rem; padding: 2rem; border: 1px solid var(--graphite);">
                        <p class="mono">Reference ID: AI-TX-${Math.floor(Math.random()*100000)}</p>
                    </div>
                </div>
            `;
            document.querySelector('.portal-nav').style.display = 'none';
            setTimeout(() => {
                document.getElementById('broker-portal').style.display = 'none';
                location.reload(); // Reset for demo
            }, 3000);
        }
    }

    // Export to global scope
    window.initBrokerPortal = () => {
        const portal = new BrokerPortal();
        document.getElementById('broker-portal').style.display = 'block';
    };

    // Attach to the "Submit Listing" nav link if it exists
    document.addEventListener('DOMContentLoaded', () => {
        const submitLink = Array.from(document.querySelectorAll('nav a')).find(a => a.textContent.includes('Submit Listing'));
        if (submitLink) {
            submitLink.href = 'javascript:void(0)';
            submitLink.addEventListener('click', window.initBrokerPortal);
        }
    });
})();