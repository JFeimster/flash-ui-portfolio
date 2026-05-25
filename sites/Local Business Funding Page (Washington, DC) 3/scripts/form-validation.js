/**
 * District Capital Partners - Secure Accelerated Application Portal
 * Logic for multi-step frictionless onboarding and DC-specific validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const portalForm = document.getElementById('accelerated-funding-form');
    if (!portalForm) return;

    const steps = Array.from(document.querySelectorAll('.portal-step'));
    const progressBar = document.querySelector('.portal-progress-fill');
    const stepLabels = document.querySelectorAll('.step-label');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    let currentStep = 0;

    /**
     * Navigation Logic
     */
    const updatePortalUI = () => {
        // Toggle Step Visibility
        steps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
            step.setAttribute('aria-hidden', index !== currentStep);
        });

        // Update Progress Bar (Visual representation of the 'Accelerated' path)
        const progressPercent = (currentStep / (steps.length - 1)) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }

        // Update Step Indicators
        stepLabels.forEach((label, index) => {
            if (index <= currentStep) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });

        // Smooth scroll to top of portal on change
        const portalContainer = document.querySelector('.portal-container');
        if (portalContainer) {
            portalContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /**
     * Validation Logic
     */
    const validateStep = (stepIndex) => {
        const currentStepEl = steps[stepIndex];
        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            // Reset state
            input.classList.remove('input-error');
            const errorMsg = input.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();

            // Basic presence check
            if (!input.value.trim()) {
                markInvalid(input, 'This field is required for your District profile.');
                isValid = false;
            } 
            
            // Email Validation
            else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                markInvalid(input, 'Please enter a valid business email.');
                isValid = false;
            }

            // DC Tax ID / EIN Validation (Placeholder logic for District compliance)
            else if (input.dataset.type === 'ein' && !/^\d{2}-\d{7}$/.test(input.value)) {
                markInvalid(input, 'Format: XX-XXXXXXX');
                isValid = false;
            }
        });

        return isValid;
    };

    const markInvalid = (input, message) => {
        input.classList.add('input-error');
        const msg = document.createElement('span');
        msg.className = 'error-message';
        msg.style.color = '#ff4444';
        msg.style.fontSize = '0.75rem';
        msg.style.marginTop = '4px';
        msg.innerText = message;
        input.parentNode.appendChild(msg);
    };

    /**
     * Event Listeners
     */
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updatePortalUI();
                } else {
                    handlePortalSubmit();
                }
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentStep > 0) {
                currentStep--;
                updatePortalUI();
            }
        });
    });

    /**
     * Document Upload Handling (Bank-grade visuals)
     */
    const dropZones = document.querySelectorAll('.secure-drop-zone');
    dropZones.forEach(zone => {
        const fileInput = zone.querySelector('input[type="file"]');
        
        zone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                zone.innerHTML = `
                    <div class="upload-success">
                        <span class="icon">🔒</span>
                        <p>${fileName}</p>
                        <small>Encrypted for DC Compliance</small>
                    </div>
                `;
                zone.style.borderColor = 'var(--gold)';
                zone.style.background = 'rgba(197, 160, 89, 0.05)';
            }
        });

        // Drag & Drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--gold)';
        });

        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = 'var(--border)';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        });
    });

    /**
     * Currency Formatting for Revenue Input
     */
    const revenueInput = document.querySelector('.revenue-mask');
    if (revenueInput) {
        revenueInput.addEventListener('blur', (e) => {
            let value = e.target.value.replace(/[$,]/g, '');
            if (value && !isNaN(value)) {
                e.target.value = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                }).format(value);
            }
        });
    }

    /**
     * Final Submission Logic
     */
    const handlePortalSubmit = () => {
        const submitBtn = document.querySelector('.btn-submit-final');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Securing Funds...";
        }

        // Simulate secure API handshake
        setTimeout(() => {
            const container = document.querySelector('.portal-container');
            container.innerHTML = `
                <div class="success-screen" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🏛️</div>
                    <h2 style="font-family: 'Playfair Display', serif; color: var(--gold); margin-bottom: 15px;">Application Transmitted Securely</h2>
                    <p style="color: var(--white); max-width: 500px; margin: 0 auto;">A District Capital specialist is reviewing your file. Expect a call within 4 business hours to discuss your funding options.</p>
                    <div style="margin-top: 30px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Security ID: DC-${Math.floor(Math.random()*1000000)}</span>
                    </div>
                </div>
            `;
        }, 1500);
    };

    // Initialize the portal
    updatePortalUI();
});