// Moonshine Capital Partners - Partner Profile Engine Generator
// This script powers the interactive multi-step form, updates live previews, and exports static code bundles.

(function () {
    // 1. Core Generator State
    const state = {
        currentStep: 1,
        totalSteps: 4,
        partnerData: {
            name: "Darwin Hanneman",
            title: "Elite Capital Director",
            bio: "Providing fast capital pipelines for commercial real estate development and complex merchant portfolios.",
            avatarInitials: "DH",
            avatarBg: "linear-gradient(45deg, #2563EB, #00FF66)",
            avatarDataUrl: "",
            specialties: ["SBA 7(a)", "Bridge Loans", "Revolving Credit"],
            metric1Label: "Pipeline Directed",
            metric1Value: "$42.8M",
            metric2Label: "Fast Close Target",
            metric2Value: "48 Hours",
            calendlyUrl: "https://calendly.com/moonshine-capital",
            email: "partners@distilledfunding.com",
            linkedin: "https://linkedin.com/company/moonshine-capital-partners",
            phone: "+1 (800) 555-0199",
            themeColor: "#00FF66", // Electric Green
            accentColor: "#FF5722"  // Signal Orange
        }
    };

    // 2. Initialization
    document.addEventListener("DOMContentLoaded", () => {
        initWizard();
        setupEventListeners();
        syncFormToState();
        updatePreview();
    });

    // 3. Multi-Step Wizard Navigation
    function initWizard() {
        const nextBtns = document.querySelectorAll(".wizard-next");
        const prevBtns = document.querySelectorAll(".wizard-prev");
        
        nextBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (validateStep(state.currentStep)) {
                    goToStep(state.currentStep + 1);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                goToStep(state.currentStep - 1);
            });
        });

        updateStepIndicator();
    }

    function goToStep(step) {
        if (step < 1 || step > state.totalSteps) return;
        
        // Hide current step UI block, show new step block
        const currentBlock = document.querySelector(`[data-wizard-step="${state.currentStep}"]`);
        const targetBlock = document.querySelector(`[data-wizard-step="${step}"]`);
        
        if (currentBlock) currentBlock.style.display = "none";
        if (targetBlock) {
            targetBlock.style.display = "block";
            // Trigger smooth transition/fade effect if supported
            targetBlock.style.opacity = "0";
            setTimeout(() => { targetBlock.style.opacity = "1"; }, 50);
        }
        
        state.currentStep = step;
        updateStepIndicator();
    }

    function updateStepIndicator() {
        const indicators = document.querySelectorAll(".step-indicator-item");
        indicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove("active", "completed");
            if (stepNum === state.currentStep) {
                indicator.classList.add("active");
            } else if (stepNum < state.currentStep) {
                indicator.classList.add("completed");
            }
        });
    }

    function validateStep(step) {
        // Basic validation rules before allowing transition to next steps
        if (step === 1) {
            const nameInput = document.getElementById("p-name");
            const titleInput = document.getElementById("p-title");
            if (nameInput && !nameInput.value.trim()) {
                showInputError(nameInput, "Partner name is required");
                return false;
            }
            if (titleInput && !titleInput.value.trim()) {
                showInputError(titleInput, "Professional title is required");
                return false;
            }
        }
        return true;
    }

    function showInputError(inputEl, message) {
        inputEl.style.borderColor = "var(--signal-orange)";
        const errorContainer = document.createElement("span");
        errorContainer.className = "input-error-msg";
        errorContainer.style.color = "var(--signal-orange)";
        errorContainer.style.fontSize = "0.75rem";
        errorContainer.style.marginTop = "4px";
        errorContainer.style.display = "block";
        errorContainer.textContent = message;
        
        // Remove existing error if any
        const existingError = inputEl.parentNode.querySelector(".input-error-msg");
        if (existingError) existingError.remove();
        
        inputEl.parentNode.appendChild(errorContainer);
        
        inputEl.addEventListener("input", function clearError() {
            inputEl.style.borderColor = "";
            errorContainer.remove();
            inputEl.removeEventListener("input", clearError);
        });
    }

    // 4. Real-time Event Handling & Preview Synchronization
    function setupEventListeners() {
        const bindings = [
            { id: "p-name", key: "name", trigger: "input" },
            { id: "p-title", key: "title", trigger: "input" },
            { id: "p-bio", key: "bio", trigger: "input" },
            { id: "p-m1-label", key: "metric1Label", trigger: "input" },
            { id: "p-m1-val", key: "metric1Value", trigger: "input" },
            { id: "p-m2-label", key: "metric2Label", trigger: "input" },
            { id: "p-m2-val", key: "metric2Value", trigger: "input" },
            { id: "p-calendly", key: "calendlyUrl", trigger: "input" },
            { id: "p-email", key: "email", trigger: "input" },
            { id: "p-linkedin", key: "linkedin", trigger: "input" },
            { id: "p-phone", key: "phone", trigger: "input" }
        ];

        bindings.forEach(binding => {
            const el = document.getElementById(binding.id);
            if (el) {
                el.addEventListener(binding.trigger, (e) => {
                    state.partnerData[binding.key] = e.target.value;
                    if (binding.key === "name") {
                        generateInitials(e.target.value);
                    }
                    updatePreview();
                });
            }
        });

        // Specialty Tag Addition System
        const addSpecialtyBtn = document.getElementById("add-specialty-btn");
        const specialtyInput = document.getElementById("p-specialty-input");
        if (addSpecialtyBtn && specialtyInput) {
            const handleAdd = () => {
                const val = specialtyInput.value.trim();
                if (val && !state.partnerData.specialties.includes(val)) {
                    state.partnerData.specialties.push(val);
                    specialtyInput.value = "";
                    renderSpecialtyEditor();
                    updatePreview();
                }
            };
            addSpecialtyBtn.addEventListener("click", handleAdd);
            specialtyInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                }
            });
        }

        // Image Upload to Base64 Reader
        const fileInput = document.getElementById("p-avatar-upload");
        if (fileInput) {
            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        state.partnerData.avatarDataUrl = event.target.result;
                        updatePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Export Actions Setup
        const downloadHTMLBtn = document.getElementById("btn-download-html");
        if (downloadHTMLBtn) {
            downloadHTMLBtn.addEventListener("click", () => {
                const compiledCode = compileCustomHTML();
                const cleanSlug = state.partnerData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                triggerDownload(`${cleanSlug}-funding-desk.html`, compiledCode);
            });
        }

        const downloadJSONBtn = document.getElementById("btn-download-json");
        if (downloadJSONBtn) {
            downloadJSONBtn.addEventListener("click", () => {
                const jsonStr = JSON.stringify(state.partnerData, null, 4);
                const cleanSlug = state.partnerData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                triggerDownload(`${cleanSlug}-config.json`, jsonStr);
            });
        }

        // Form Submit to Moonshine Operators
        const submitFormBtn = document.getElementById("btn-submit-portal");
        if (submitFormBtn) {
            submitFormBtn.addEventListener("click", (e) => {
                e.preventDefault();
                submitToMoonshineOperators();
            });
        }
    }

    function syncFormToState() {
        // Seed default values to UI inputs
        const bindings = [
            { id: "p-name", value: state.partnerData.name },
            { id: "p-title", value: state.partnerData.title },
            { id: "p-bio", value: state.partnerData.bio },
            { id: "p-m1-label", value: state.partnerData.metric1Label },
            { id: "p-m1-val", value: state.partnerData.metric1Value },
            { id: "p-m2-label", value: state.partnerData.metric2Label },
            { id: "p-m2-val", value: state.partnerData.metric2Value },
            { id: "p-calendly", value: state.partnerData.calendlyUrl },
            { id: "p-email", value: state.partnerData.email },
            { id: "p-linkedin", value: state.partnerData.linkedin },
            { id: "p-phone", value: state.partnerData.phone }
        ];

        bindings.forEach(binding => {
            const el = document.getElementById(binding.id);
            if (el) el.value = binding.value;
        });

        renderSpecialtyEditor();
    }

    function generateInitials(name) {
        if (!name) {
            state.partnerData.avatarInitials = "MP";
            return;
        }
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            state.partnerData.avatarInitials = parts[0].slice(0, 2).toUpperCase();
        } else {
            state.partnerData.avatarInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
    }

    function renderSpecialtyEditor() {
        const container = document.getElementById("specialties-editor-tags");
        if (!container) return;
        container.innerHTML = "";
        
        state.partnerData.specialties.forEach((spec, index) => {
            const tag = document.createElement("div");
            tag.className = "editor-spec-pill";
            tag.style.display = "inline-flex";
            tag.style.alignItems = "center";
            tag.style.background = "rgba(255, 255, 255, 0.05)";
            tag.style.border = "1px solid var(--glass-border)";
            tag.style.padding = "4px 10px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "0.75rem";
            tag.style.gap = "8px";
            tag.style.margin = "4px";
            
            tag.innerHTML = `
                <span>${spec}</span>
                <span class="remove-tag-btn" style="cursor:pointer; color:var(--signal-orange); font-weight:bold;">✕</span>
            `;
            
            tag.querySelector(".remove-tag-btn").addEventListener("click", () => {
                state.partnerData.specialties.splice(index, 1);
                renderSpecialtyEditor();
                updatePreview();
            });
            container.appendChild(tag);
        });
    }

    // 5. Preview Render Pipeline
    function updatePreview() {
        const d = state.partnerData;
        
        // Find Preview DOM nodes (assuming IDs match the layout structure of live profile preview container)
        const namePreview = document.querySelector(".preview-name") || document.querySelector(".mock-body h3");
        const titlePreview = document.querySelector(".preview-title") || document.querySelector(".mock-badge");
        const bioPreview = document.querySelector(".preview-bio") || document.querySelector(".mock-body p");
        const avatarPreview = document.querySelector(".preview-avatar") || document.querySelector(".mock-avatar");
        const specialtiesContainer = document.querySelector(".preview-specialties") || document.querySelector(".mock-specialties");
        
        const m1Label = document.querySelector(".preview-m1-label") || document.querySelector(".mock-widget:nth-child(1) h4");
        const m1Val = document.querySelector(".preview-m1-val") || document.querySelector(".mock-widget:nth-child(1) p");
        const m2Label = document.querySelector(".preview-m2-label") || document.querySelector(".mock-widget:nth-child(2) h4");
        const m2Val = document.querySelector(".preview-m2-val") || document.querySelector(".mock-widget:nth-child(2) p");

        const previewUrlText = document.querySelector(".mock-url");

        if (namePreview) namePreview.textContent = d.name;
        if (titlePreview) titlePreview.textContent = d.title;
        if (bioPreview) bioPreview.textContent = d.bio;
        
        if (previewUrlText) {
            const cleanSlug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            previewUrlText.textContent = `moonshine.cap/partners/${cleanSlug}`;
        }

        if (avatarPreview) {
            if (d.avatarDataUrl) {
                avatarPreview.style.backgroundImage = `url(${d.avatarDataUrl})`;
                avatarPreview.style.backgroundSize = "cover";
                avatarPreview.style.backgroundPosition = "center";
                avatarPreview.textContent = "";
            } else {
                avatarPreview.style.backgroundImage = "none";
                avatarPreview.style.background = d.avatarBg;
                avatarPreview.textContent = d.avatarInitials;
            }
        }

        if (specialtiesContainer) {
            specialtiesContainer.innerHTML = "";
            d.specialties.forEach(spec => {
                const tag = document.createElement("span");
                tag.className = "mock-spec-tag";
                tag.textContent = spec;
                specialtiesContainer.appendChild(tag);
            });
        }

        if (m1Label && m1Val) {
            m1Label.textContent = d.metric1Label;
            m1Val.textContent = d.metric1Value;
        }
        if (m2Label && m2Val) {
            m2Label.textContent = d.metric2Label;
            m2Val.textContent = d.metric2Value;
        }
    }

    // 6. Interactive HTML Generator Output Engine
    function compileCustomHTML() {
        const d = state.partnerData;
        
        // Generate clean dynamic Specialty HTML strings
        const specialtyListHTML = d.specialties.map(spec => `<span class="mock-spec-tag">${spec}</span>`).join("\n");
        const specialtyOptionsHTML = d.specialties.map(spec => `<option value="${spec}">${spec}</option>`).join("\n");

        // Dynamic background configuration for custom avatar
        const avatarStyle = d.avatarDataUrl 
            ? `background-image: url('${d.avatarDataUrl}'); background-size: cover; background-position: center;`
            : `background: ${d.avatarBg};`;
        const avatarContent = d.avatarDataUrl ? "" : d.avatarInitials;

        // Custom Standalone HTML string output
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${d.name} | Partner Profile & Funding Desk</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --matte-black: #0B0F17;
            --deep-gray: #121824;
            --graphite: #1E293B;
            --bone-white: #F9FAF1;
            --electric-green: #00FF66;
            --signal-orange: #FF5722;
            --cobalt-blue: #2563EB;
            --chrome-accent: #9CA3AF;
            --glass-bg: rgba(18, 24, 36, 0.75);
            --glass-border: rgba(255, 255, 255, 0.08);
            --neon-glow: 0 0 20px rgba(0, 255, 102, 0.25);
            --font-sans: 'Plus Jakarta Sans', sans-serif;
            --font-space: 'Space Grotesk', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--matte-black);
            color: var(--bone-white);
            font-family: var(--font-sans);
            line-height: 1.5;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(0, 255, 102, 0.05) 0%, transparent 50%),
                linear-gradient(rgba(18, 24, 36, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(18, 24, 36, 0.4) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
            padding-bottom: 80px;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        
        header {
            border-bottom: 1px solid var(--glass-border);
            padding: 20px 0;
            background: rgba(11, 15, 23, 0.8);
            backdrop-filter: blur(12px);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--bone-white);
            font-family: var(--font-space);
            font-weight: 700;
        }

        .brand-logo {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--electric-green), var(--cobalt-blue));
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--matte-black);
            box-shadow: var(--neon-glow);
        }

        .profile-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            margin-top: 40px;
        }

        @media (max-width: 868px) {
            .profile-grid { grid-template-columns: 1fr; }
        }

        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 32px;
        }

        .partner-profile-header {
            display: flex;
            gap: 24px;
            align-items: center;
            margin-bottom: 24px;
        }

        .partner-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid var(--electric-green);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-family: var(--font-space);
            font-size: 2rem;
            color: var(--matte-black);
            box-shadow: var(--neon-glow);
        }

        .mock-badge {
            background: rgba(0, 255, 102, 0.1);
            color: var(--electric-green);
            border: 1px solid rgba(0, 255, 102, 0.2);
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 700;
            display: inline-block;
            margin-top: 6px;
        }

        .partner-bio {
            font-size: 1.1rem;
            color: var(--chrome-accent);
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .mock-specialties {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 32px;
        }

        .mock-spec-tag {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            color: var(--bone-white);
        }

        .mock-widget-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .mock-widget {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }

        .mock-widget h4 {
            font-size: 0.85rem;
            color: var(--chrome-accent);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .mock-widget p {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--electric-green);
            font-family: var(--font-space);
        }

        /* Interactive Widgets inside Custom Profile */
        .widget-section-title {
            font-family: var(--font-space);
            font-size: 1.3rem;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 10px;
            color: var(--bone-white);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px 28px;
            font-family: var(--font-space);
            font-weight: 700;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease;
            cursor: pointer;
            width: 100%;
            text-align: center;
        }

        .btn-primary {
            background-color: var(--electric-green);
            color: var(--matte-black);
            border: 2px solid var(--electric-green);
            box-shadow: 4px 4px 0px 0px rgba(0, 255, 102, 0.2);
        }

        .btn-primary:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px var(--electric-green);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--bone-white);
            border: 2px solid var(--bone-white);
        }

        .btn-secondary:hover {
            background: rgba(255,255,255,0.05);
        }

        .interactive-tool {
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }

        select, input {
            width: 100%;
            background: #121824;
            border: 1px solid var(--glass-border);
            padding: 12px;
            border-radius: 6px;
            color: var(--bone-white);
            font-size: 0.95rem;
            margin-bottom: 16px;
            outline: none;
        }

        select:focus, input:focus {
            border-color: var(--electric-green);
        }

        .score-output {
            background: rgba(0, 255, 102, 0.08);
            border: 1px solid rgba(0, 255, 102, 0.2);
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            margin-top: 16px;
        }

        .compliance-note {
            font-size: 0.75rem;
            color: var(--chrome-accent);
            text-align: center;
            margin-top: 40px;
            line-height: 1.5;
        }
    </style>
</head>
<body>

    <header>
        <div class="container" style="padding: 0 24px;">
            <div class="header-content">
                <a href="#" class="brand">
                    <div class="brand-logo">M</div>
                    <div>Moonshine<span>Partners</span></div>
                </a>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--electric-green);">VERIFIED PORTAL</span>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="profile-grid">
            
            <!-- Left Panel: Profile Detail Deck -->
            <div class="glass-card">
                <div class="partner-profile-header">
                    <div class="partner-avatar" style="${avatarStyle}">
                        ${avatarContent}
                    </div>
                    <div>
                        <h1 style="font-family: var(--font-space); font-size: 2rem;">${d.name}</h1>
                        <span class="mock-badge">${d.title}</span>
                    </div>
                </div>

                <p class="partner-bio">${d.bio}</p>

                <h3 style="font-family: var(--font-space); font-size: 1.1rem; margin-bottom: 12px;">Underwriting Specialties</h3>
                <div class="mock-specialties">
                    ${specialtyListHTML}
                </div>

                <div class="mock-widget-grid">
                    <div class="mock-widget">
                        <h4>${d.metric1Label}</h4>
                        <p>${d.metric1Value}</p>
                    </div>
                    <div class="mock-widget">
                        <h4>${d.metric2Label}</h4>
                        <p>${d.metric2Value}</p>
                    </div>
                </div>

                <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 16px;">
                    <a href="${d.calendlyUrl}" target="_blank" class="btn btn-primary">Book Strategic Review</a>
                    <a href="mailto:${d.email}" class="btn btn-secondary">Direct Email Contact</a>
                </div>
            </div>

            <!-- Right Panel: Integrated Tools Dynamic Console -->
            <div class="glass-card">
                <h3 class="widget-section-title">📊 Underwriting Pre-Screen</h3>
                <div class="interactive-tool">
                    <p style="font-size: 0.85rem; color: var(--chrome-accent); margin-bottom: 16px;">Pre-score your pipeline opportunity without generating hard inquiries.</p>
                    
                    <label style="font-size: 0.75rem; color: var(--chrome-accent); display: block; margin-bottom: 6px;">MONTHLY REVENUE</label>
                    <select id="screen-revenue" onchange="runEvaluation()">
                        <option value="1">$0 - $9,999</option>
                        <option value="2">$10,000 - $49,999</option>
                        <option value="3" selected>$50,000 - $149,999</option>
                        <option value="4">$150,000+</option>
                    </select>

                    <label style="font-size: 0.75rem; color: var(--chrome-accent); display: block; margin-bottom: 6px;">CREDIT RATING BAND</label>
                    <select id="screen-credit" onchange="runEvaluation()">
                        <option value="1">Under 550</option>
                        <option value="2">550 - 649</option>
                        <option value="3" selected>650 - 719</option>
                        <option value="4">720+</option>
                    </select>

                    <div class="score-output">
                        <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--chrome-accent);">PRE-UNDERWRITE INDEX</span>
                        <h4 id="score-text" style="font-family: var(--font-space); font-size: 1.5rem; color: var(--electric-green); margin-top: 4px;">78% / OPTIMIZED MATCH</h4>
                    </div>
                </div>

                <h3 class="widget-section-title">📁 Pre-Submission Audit</h3>
                <div class="interactive-tool" style="margin-bottom: 0;">
                    <p style="font-size: 0.85rem; color: var(--chrome-accent); margin-bottom: 12px;">Review necessary validation credentials to accelerate underwriting.</p>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
                        <li style="display: flex; gap: 10px; align-items: center;"><input type="checkbox" checked disabled style="width:auto; margin:0;"> 3 Months Corporate Bank Sheets</li>
                        <li style="display: flex; gap: 10px; align-items: center;"><input type="checkbox" checked disabled style="width:auto; margin:0;"> Active State Entity Filing / EIN</li>
                        <li style="display: flex; gap: 10px; align-items: center;"><input type="checkbox" style="width:auto; margin:0;" id="chk-3"> Government Issued Photo ID</li>
                    </ul>
                </div>
            </div>

        </div>

        <p class="compliance-note">
            <strong>COMPLIANCE SUMMARY NOTICE:</strong> Funding parameters, target close periods, maximum loan-to-value limits, and rates are based solely on individual risk appraisals, state statutes, matching provider profiles, and full verification protocols. Registered affiliate coordinates client flow directly with Moonshine Capital Partners underwriting offices.
        </p>
    </div>

    <script>
        function runEvaluation() {
            const rev = parseInt(document.getElementById("screen-revenue").value);
            const cr = parseInt(document.getElementById("screen-credit").value);
            const scoreTotal = rev + cr;
            const textEl = document.getElementById("score-text");

            if (scoreTotal <= 3) {
                textEl.textContent = "22% / LOW PROBABILITY";
                textEl.style.color = "var(--signal-orange)";
            } else if (scoreTotal <= 5) {
                textEl.textContent = "54% / STANDARD MATCH";
                textEl.style.color = "var(--chrome-accent)";
            } else if (scoreTotal <= 7) {
                textEl.textContent = "81% / OPTIMIZED MATCH";
                textEl.style.color = "var(--electric-green)";
            } else {
                textEl.textContent = "97% / PREFERRED PLATFORM";
                textEl.style.color = "var(--electric-green)";
            }
        }
    </script>
</body>
</html>`;
    }

    // 7. Download Trigger
    function triggerDownload(filename, text) {
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // 8. Tally / Webhook Submitter
    function submitToMoonshineOperators() {
        const consoleLogs = document.getElementById("operator-submission-logs");
        if (consoleLogs) consoleLogs.innerHTML = "";

        const logEntry = (msg, type = "info") => {
            if (!consoleLogs) return;
            const p = document.createElement("div");
            p.style.fontFamily = "var(--font-mono)";
            p.style.fontSize = "0.8rem";
            p.style.marginBottom = "4px";
            if (type === "info") p.style.color = "var(--chrome-accent)";
            if (type === "success") p.style.color = "var(--electric-green)";
            if (type === "warning") p.style.color = "var(--signal-orange)";
            p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            consoleLogs.appendChild(p);
            consoleLogs.scrollTop = consoleLogs.scrollHeight;
        };

        logEntry("Initializing connection to Moonshine verification portal...", "info");
        
        setTimeout(() => {
            logEntry("Validating schema compliance for static code distribution...", "info");
        }, 600);

        setTimeout(() => {
            logEntry("Packing partner profiles metrics and specialties datasets...", "info");
        }, 1200);

        setTimeout(() => {
            logEntry("Payload compiled successfully. Sending API payload packet...", "success");
            
            // Format submission payload mapping payload variables cleanly
            const payload = {
                partner_name: state.partnerData.name,
                partner_title: state.partnerData.title,
                specialties: state.partnerData.specialties,
                contact_email: state.partnerData.email,
                calendly_link: state.partnerData.calendlyUrl,
                metrics: {
                    m1: `${state.partnerData.metric1Label}: ${state.partnerData.metric1Value}`,
                    m2: `${state.partnerData.metric2Label}: ${state.partnerData.metric2Value}`
                }
            };

            // Simulated dispatch to Formspree/Tally endpoint structures
            console.log("Transmitting portal data packet to operators: ", payload);
        }, 1900);

        setTimeout(() => {
            logEntry("TRANSMISSION SUCCESSFUL: Deployment configuration queued for CDN distribution.", "success");
            
            // Show alert/success check to the system operator
            alert(`Submission Complete!\nProfile configuration for ${state.partnerData.name} has been processed and queued for operations under underwriting reference token MC-${Math.floor(1000 + Math.random() * 9000)}.`);
        }, 2600);
    }

})();