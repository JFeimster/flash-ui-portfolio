// assets/js/profile-actions.js
// Interactive Partner Profile Template & Funding Desk Orchestration Engine
// Powered by Moonshine Capital Partners

(function () {
    // 1. Comprehensive Partner Database for Live Hydration
    const PARTNER_DIRECTORY = {
        "darwin-hanneman": {
            id: "MCP-DH-4029",
            name: "Darwin Hanneman",
            initials: "DH",
            title: "Elite Capital Director",
            niche: "Real Estate & Complex Merchant Portfolios",
            bio: "Providing fast capital pipelines for commercial real estate development, asset restructuring, and complex merchant portfolios with rapid underwriting.",
            specialties: ["SBA 7(a) & 504", "Bridge Loans", "Revolving Credit", "Commercial Mortgages"],
            metrics: {
                directed: "$42.8M",
                closeRate: "48 Hours",
                satisfaction: "99.4%"
            },
            ctaPrimary: "Start Funding Review",
            accentColor: "var(--electric-green)",
            recentFundings: [
                { client: "Pacific Development Group", amount: "$3.4M", type: "Bridge Loan", time: "2 hours ago" },
                { client: "Starlight Hospitality LLC", amount: "$750K", type: "Working Capital", time: "1 day ago" }
            ]
        },
        "marcus-vance": {
            id: "MCP-MV-8812",
            name: "Marcus Vance",
            initials: "MV",
            title: "Contractor Funding Partner",
            niche: "Industrial & Subcontracting Infrastructure",
            bio: "Expert in working capital lines, payroll-driven bridge facilities, and structural asset funding programs built specifically for general commercial contractors.",
            specialties: ["Equipment Leasing", "Line of Credit", "SBA 7(a)", "Invoice Factoring"],
            metrics: {
                directed: "$29.1M",
                closeRate: "5-10 Days",
                satisfaction: "98.1%"
            },
            ctaPrimary: "Review Contracting Line",
            accentColor: "var(--electric-green)",
            recentFundings: [
                { client: "Apex Steel Erectors", amount: "$1.2M", type: "Invoice Factoring", time: "4 hours ago" },
                { client: "Vanguard Concrete Co", amount: "$450K", type: "Equipment Lease", time: "3 days ago" }
            ]
        },
        "evelyn-thorne": {
            id: "MCP-ET-5041",
            name: "Evelyn Thorne",
            initials: "ET",
            title: "Ecommerce Scaling Specialist",
            niche: "High-Velocity Brands & Multichannel Retail",
            bio: "Focused on lightning-fast revenue-based financing structures designed for multichannel sellers on Amazon, Shopify, and TikTok Shop platforms.",
            specialties: ["Revenue Financing", "Inventory Advances", "Acquisition Capital"],
            metrics: {
                directed: "$18.5M",
                closeRate: "24 Hours",
                satisfaction: "99.7%"
            },
            ctaPrimary: "Verify Store Revenue",
            accentColor: "var(--signal-orange)",
            recentFundings: [
                { client: "HoloGlow Cosmetics", amount: "$320K", type: "Revenue Advance", time: "15 mins ago" },
                { client: "Zenith Home Goods", amount: "$600K", type: "Inventory Finance", time: "12 hours ago" }
            ]
        },
        "silas-sterling": {
            id: "MCP-SS-9110",
            name: "Silas Sterling",
            initials: "SS",
            title: "Real Estate Funding Specialist",
            niche: "Residential Portfolios & Commercial Rehabs",
            bio: "Delivering custom bridge solutions, rehab allocations, and fast hard-money paths for residential fix-and-flip operators and portfolio developers.",
            specialties: ["Commercial Rehab", "Hard Money Path", "Asset Backed Lending"],
            metrics: {
                directed: "$51.2M",
                closeRate: "7 Days",
                satisfaction: "97.6%"
            },
            ctaPrimary: "Analyze Property File",
            accentColor: "var(--cobalt-blue)",
            recentFundings: [
                { client: "Metro Loft Builders", amount: "$2.1M", type: "Commercial Acquisition", time: "5 hours ago" },
                { client: "Oakwood Properties", amount: "$850K", type: "Bridge Loan", time: "2 days ago" }
            ]
        }
    };

    // Global state holding dynamic properties
    let currentPartnerKey = "darwin-hanneman";
    let activeUnderwritingScore = 75;

    // Initialize CSS Injection for dynamic elements
    function injectCustomDeskStyles() {
        if (document.getElementById("funding-desk-custom-css")) return;
        
        const style = document.createElement("style");
        style.id = "funding-desk-custom-css";
        style.innerHTML = `
            /* Live Transaction Toasts */
            .live-toast-container {
                position: fixed;
                bottom: 80px;
                right: 24px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                z-index: 1000;
                pointer-events: none;
            }
            .live-toast {
                background: var(--deep-gray);
                border: 1px solid var(--glass-border);
                border-left: 4px solid var(--electric-green);
                border-radius: 6px;
                padding: 14px 18px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 340px;
                animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                pointer-events: auto;
            }
            @keyframes toastSlideIn {
                from { transform: translateX(100%) translateY(10px); opacity: 0; }
                to { transform: translateX(0) translateY(0); opacity: 1; }
            }
            .live-toast-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(0,255,102,0.1);
                color: var(--electric-green);
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-space);
                font-size: 0.8rem;
                flex-shrink: 0;
            }

            /* Funding Desk Calculator Elements */
            .desk-calc-container {
                margin-top: 32px;
                background: rgba(18, 24, 36, 0.6);
                border: 1px solid var(--glass-border);
                border-radius: 8px;
                padding: 24px;
            }
            .desk-calc-grid {
                display: grid;
                grid-template-columns: 1.2fr 0.8fr;
                gap: 24px;
            }
            @media (max-width: 768px) {
                .desk-calc-grid { grid-template-columns: 1fr; }
            }
            .desk-input-group {
                margin-bottom: 18px;
            }
            .desk-input-label {
                display: flex;
                justify-content: space-between;
                font-family: var(--font-space);
                font-size: 0.8rem;
                margin-bottom: 8px;
                color: var(--chrome-accent);
            }
            .desk-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: var(--graphite);
                outline: none;
                transition: background 0.3s;
            }
            .desk-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--electric-green);
                cursor: pointer;
                box-shadow: var(--neon-glow);
                transition: transform 0.1s;
            }
            .desk-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            /* Live Leads Activity Console */
            .desk-console {
                margin-top: 32px;
                background: #06090F;
                border: 2px solid var(--glass-border);
                border-radius: 8px;
                font-family: var(--font-mono);
                overflow: hidden;
            }
            .desk-console-header {
                background: rgba(255,255,255,0.02);
                border-bottom: 1px solid var(--glass-border);
                padding: 10px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.75rem;
            }
            .desk-console-row {
                padding: 10px 16px;
                border-bottom: 1px solid rgba(255,255,255,0.02);
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                animation: consoleFade 0.3s ease;
            }
            @keyframes consoleFade {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Underwriting Score Gauge */
            .score-gauge-wrap {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-left: 1px solid var(--glass-border);
                padding-left: 24px;
            }
            @media (max-width: 768px) {
                .score-gauge-wrap {
                    border-left: none;
                    border-top: 1px solid var(--glass-border);
                    padding-left: 0;
                    padding-top: 24px;
                }
            }
            .score-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: radial-gradient(circle, var(--matte-black) 55%, transparent 56%),
                            conic-gradient(var(--electric-green) var(--percentage), var(--graphite) var(--percentage));
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: var(--neon-glow);
                transition: background 0.4s ease;
            }
            .score-circle::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .score-text {
                font-family: var(--font-space);
                font-weight: bold;
                font-size: 1.6rem;
                color: var(--bone-white);
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .score-text span {
                font-size: 0.65rem;
                color: var(--chrome-accent);
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            /* Form Wizard Modal Overlay */
            .wizard-overlay {
                position: fixed;
                inset: 0;
                background: rgba(6, 9, 15, 0.95);
                backdrop-filter: blur(8px);
                z-index: 1010;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 24px;
            }
            .wizard-box {
                max-width: 580px;
                width: 100%;
                border: 2px solid var(--glass-border);
                animation: wizardPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes wizardPop {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .wizard-step-indicator {
                height: 4px;
                background: var(--graphite);
                border-radius: 2px;
                margin-bottom: 24px;
                display: flex;
            }
            .wizard-progress-fill {
                height: 100%;
                background: var(--electric-green);
                width: 33.33%;
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            .wizard-input {
                width: 100%;
                background: rgba(0,0,0,0.4);
                border: 1px solid var(--glass-border);
                padding: 12px 16px;
                border-radius: 6px;
                color: var(--bone-white);
                font-family: var(--font-sans);
                font-size: 1rem;
                outline: none;
                margin-bottom: 16px;
                transition: border-color 0.2s;
            }
            .wizard-input:focus {
                border-color: var(--electric-green);
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Hydrate & Overwrite the Hero with Personalized Dynamic Partner Data
    function hydratePartnerProfile(partnerKey) {
        const partner = PARTNER_DIRECTORY[partnerKey];
        if (!partner) return;

        currentPartnerKey = partnerKey;
        
        // Update URL to match context dynamically (aesthetic simulation)
        const mockUrlEl = document.querySelector(".mock-url");
        if (mockUrlEl) {
            mockUrlEl.textContent = `moonshine.cap/partners/${partnerKey}`;
        }

        // Hydrate avatar and badging
        const avatarEl = document.querySelector(".mock-avatar");
        if (avatarEl) {
            avatarEl.textContent = partner.initials;
            avatarEl.style.border = `2px solid ${partner.accentColor}`;
        }

        // Title and name block
        const nameHeader = document.querySelector(".mock-partner-header h3");
        if (nameHeader) {
            nameHeader.textContent = partner.name;
        }

        const badgeEl = document.querySelector(".mock-badge");
        if (badgeEl) {
            badgeEl.textContent = partner.title;
            badgeEl.style.borderColor = partner.accentColor;
            badgeEl.style.color = partner.accentColor;
            badgeEl.style.background = `rgba(${partner.accentColor === "var(--signal-orange)" ? "255, 87, 34" : "0, 255, 102"}, 0.1)`;
        }

        // Bio update
        const bioEl = document.querySelector(".mock-body p");
        if (bioEl) {
            bioEl.textContent = partner.bio;
        }

        // Specialty Tag rendering
        const specialtiesWrapper = document.querySelector(".mock-specialties");
        if (specialtiesWrapper) {
            specialtiesWrapper.innerHTML = "";
            partner.specialties.forEach(spec => {
                const tag = document.createElement("span");
                tag.className = "mock-spec-tag";
                tag.textContent = spec;
                specialtiesWrapper.appendChild(tag);
            });
        }

        // Metrics widgets
        const widgets = document.querySelectorAll(".mock-widget");
        if (widgets.length >= 2) {
            // First widget: Pipeline
            const widget1Title = widgets[0].querySelector("h4");
            const widget1Val = widgets[0].querySelector("p");
            if (widget1Title) widget1Title.textContent = "Desk Underwritten";
            if (widget1Val) {
                widget1Val.textContent = partner.metrics.directed;
                widget1Val.style.color = partner.accentColor;
            }

            // Second widget: Closing Rate
            const widget2Title = widgets[1].querySelector("h4");
            const widget2Val = widgets[1].querySelector("p");
            if (widget2Title) widget2Title.textContent = "Closing Target";
            if (widget2Val) {
                widget2Val.textContent = partner.metrics.closeRate;
                widget2Val.style.color = partner.accentColor;
            }
        }

        // Configure CTA Actions
        const primaryCta = document.querySelector(".mock-body .btn-orange");
        if (primaryCta) {
            primaryCta.textContent = partner.ctaPrimary;
            primaryCta.onclick = (e) => {
                e.preventDefault();
                launchUnderwritingWizard(partnerKey);
            };
        }

        const secondaryCta = document.querySelector(".mock-body .btn-secondary");
        if (secondaryCta) {
            secondaryCta.textContent = "Book Call with Desk";
            secondaryCta.onclick = (e) => {
                e.preventDefault();
                simulateScheduler(partner.name);
            };
        }

        // Update Calculator header if present
        const dynamicTitle = document.getElementById("desk-dynamic-header");
        if (dynamicTitle) {
            dynamicTitle.textContent = `${partner.name}'s Interactive Underwriting Desk`;
        }

        // Add partner ID tag for attribution transparency
        const trackingLabel = document.getElementById("attributed-partner-badge");
        if (trackingLabel) {
            trackingLabel.innerHTML = `Desk Auth Token: <span class="highlight-green">${partner.id}</span>`;
        }
    }

    // 3. Simulated Calendar & Call Scheduler Overlay
    function simulateScheduler(partnerName) {
        const schedulerModal = document.createElement("div");
        schedulerModal.className = "wizard-overlay";
        schedulerModal.innerHTML = `
            <div class="glass-card wizard-box" style="border-color: var(--electric-green);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <span class="mono highlight-green">DIRECT BOOKING GATEWAY</span>
                    <button id="close-scheduler" style="background:none; border:none; color:white; cursor:pointer; font-size:1.25rem;">✕</button>
                </div>
                <h3 style="font-family: var(--font-space); font-size: 1.5rem; margin-bottom: 12px;">Secure Strategic Allocation with ${partnerName}</h3>
                <p style="color: var(--chrome-accent); font-size: 0.9rem; margin-bottom: 24px;">Select an allocation window from this desk's prioritized scheduling routing. Live calendar metrics will apply dynamically.</p>
                
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:24px;">
                    <button class="filter-btn active" style="padding:14px 10px; font-size:0.8rem; text-align:center;">Today<br/><span style="opacity:0.6;font-size:0.7rem;">2 Slots Left</span></button>
                    <button class="filter-btn" style="padding:14px 10px; font-size:0.8rem; text-align:center;">Tomorrow<br/><span style="opacity:0.6;font-size:0.7rem;">4 Slots Left</span></button>
                    <button class="filter-btn" style="padding:14px 10px; font-size:0.8rem; text-align:center;">Wednesday<br/><span style="opacity:0.6;font-size:0.7rem;">5 Slots Left</span></button>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">
                    <label style="font-size:0.8rem; color:var(--chrome-accent);">CONFIRM YOUR CONTACT EMAIL</label>
                    <input type="email" id="scheduler-email" class="wizard-input" placeholder="name@business.com" style="margin-bottom:0;">
                </div>

                <div style="display:flex; justify-content:flex-end; gap:12px;">
                    <button id="cancel-scheduler" class="btn btn-secondary" style="padding:10px 20px; font-size:0.8rem;">Cancel</button>
                    <button id="confirm-scheduler" class="btn btn-primary" style="padding:10px 20px; font-size:0.8rem;">Reserve Allocation</button>
                </div>
            </div>
        `;

        document.body.appendChild(schedulerModal);

        const closeBtn = () => { schedulerModal.remove(); };
        document.getElementById("close-scheduler").onclick = closeBtn;
        document.getElementById("cancel-scheduler").onclick = closeBtn;
        
        document.getElementById("confirm-scheduler").onclick = () => {
            const email = document.getElementById("scheduler-email").value;
            if (!email || !email.includes("@")) {
                alert("Please provide a valid business email for system confirmation.");
                return;
            }
            schedulerModal.remove();
            
            // Add to simulated local storage logs
            const partner = PARTNER_DIRECTORY[currentPartnerKey];
            addLeadToConsole(email, "Call Scheduled", partner.id);
            
            triggerSuccessToast("Allocation Reserved!", `A direct meeting notification has been routed back to ${partner.name}.`);
        };
    }

    // 4. Interactive Multistep Underwriting Wizard
    function launchUnderwritingWizard(partnerKey) {
        const partner = PARTNER_DIRECTORY[partnerKey];
        if (!partner) return;

        let activeStep = 1;
        const wizardState = {
            revenue: "",
            timeInBusiness: "",
            creditBand: "",
            businessName: "",
            email: ""
        };

        const wizardOverlay = document.createElement("div");
        wizardOverlay.className = "wizard-overlay";
        wizardOverlay.id = "underwriting-wizard";
        
        renderWizardStep(wizardOverlay, partner, activeStep, wizardState);
        document.body.appendChild(wizardOverlay);
    }

    function renderWizardStep(overlay, partner, step, state) {
        let stepContent = "";
        const progress = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

        if (step === 1) {
            stepContent = `
                <h3 style="font-family: var(--font-space); font-size: 1.5rem; margin-bottom: 12px;">Establish Business Scale</h3>
                <p style="color: var(--chrome-accent); font-size: 0.9rem; margin-bottom: 24px;">Underwriting filters apply based on monthly volume thresholds. Select matching revenue parameters below.</p>
                
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                    <button class="filter-btn wizard-choice-btn" data-value="Under $10k" style="width:100%; text-align:left; padding:14px 20px;">Under $10,000 / month</button>
                    <button class="filter-btn wizard-choice-btn" data-value="$10k - $50k" style="width:100%; text-align:left; padding:14px 20px;">$10,000 - $50,000 / month</button>
                    <button class="filter-btn wizard-choice-btn" data-value="$50k - $150k" style="width:100%; text-align:left; padding:14px 20px;">$50,000 - $150,000 / month</button>
                    <button class="filter-btn wizard-choice-btn" data-value="$150k+" style="width:100%; text-align:left; padding:14px 20px;">$150,000+ / month</button>
                </div>
            `;
        } else if (step === 2) {
            stepContent = `
                <h3 style="font-family: var(--font-space); font-size: 1.5rem; margin-bottom: 12px;">Operational Longevity</h3>
                <p style="color: var(--chrome-accent); font-size: 0.9rem; margin-bottom: 24px;">How long has your entity been operating active ledgers under its primary EIN?</p>
                
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                    <button class="filter-btn wizard-choice-btn" data-value="Under 1 Year" style="width:100%; text-align:left; padding:14px 20px;">Pre-revenue or under 1 year</button>
                    <button class="filter-btn wizard-choice-btn" data-value="1 - 3 Years" style="width:100%; text-align:left; padding:14px 20px;">1 to 3 Years active operation</button>
                    <button class="filter-btn wizard-choice-btn" data-value="3+ Years" style="width:100%; text-align:left; padding:14px 20px;">3+ Years stable operating history</button>
                </div>
            `;
        } else if (step === 3) {
            stepContent = `
                <h3 style="font-family: var(--font-space); font-size: 1.5rem; margin-bottom: 12px;">Verify Lead Destination</h3>
                <p style="color: var(--chrome-accent); font-size: 0.9rem; margin-bottom: 24px;">Attach active attribution tokens so ${partner.name} can monitor your underwriting speed directly.</p>
                
                <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; color:var(--chrome-accent); margin-bottom:6px;">BUSINESS TRADING NAME</label>
                        <input type="text" id="wizard-biz-name" class="wizard-input" placeholder="Acme Logistics LLC" style="margin-bottom:0;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; color:var(--chrome-accent); margin-bottom:6px;">DIRECT EMAIL ADDRESS</label>
                        <input type="email" id="wizard-email" class="wizard-input" placeholder="ceo@acmelogistics.com" style="margin-bottom:0;">
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:12px; border:1px solid var(--glass-border); border-radius:6px; margin-bottom:24px;">
                    <span style="font-size:0.75rem; color:var(--chrome-accent);">ATTRIBUTED DESK OWNER:</span>
                    <span class="mono highlight-green" style="font-size:0.75rem;">${partner.name} (${partner.id})</span>
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="glass-card wizard-box" style="border-color: ${partner.accentColor}; position:relative;">
                <button id="close-wizard" style="position:absolute; top:20px; right:20px; background:none; border:none; color:white; cursor:pointer; font-size:1.25rem;">✕</button>
                <div class="wizard-step-indicator">
                    <div class="wizard-progress-fill" style="width: ${progress}; background: ${partner.accentColor};"></div>
                </div>
                <span class="mono highlight-green" style="font-size:0.7rem; color:${partner.accentColor}">UNDERWRITING DISCOVERY // STEP ${step} OF 3</span>
                <div style="margin-top:12px;">
                    ${stepContent}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    ${step > 1 ? `<button id="wizard-prev" class="btn btn-secondary" style="padding:10px 20px; font-size:0.8rem;">Back</button>` : `<div></div>`}
                    ${step === 3 ? `<button id="wizard-submit" class="btn btn-primary" style="padding:10px 20px; font-size:0.8rem; background:${partner.accentColor}; border-color:${partner.accentColor}; color:var(--matte-black)">Submit File to Desk</button>` : `<div></div>`}
                </div>
            </div>
        `;

        // Bind event listeners
        document.getElementById("close-wizard").onclick = () => overlay.remove();
        
        if (step > 1) {
            document.getElementById("wizard-prev").onclick = () => {
                renderWizardStep(overlay, partner, step - 1, state);
            };
        }

        if (step === 3) {
            document.getElementById("wizard-submit").onclick = () => {
                const bizName = document.getElementById("wizard-biz-name").value;
                const email = document.getElementById("wizard-email").value;
                
                if (!bizName || !email || !email.includes("@")) {
                    alert("Please fill out all operational inputs before desk submission.");
                    return;
                }

                state.businessName = bizName;
                state.email = email;

                // Process lead submission
                overlay.remove();
                addLeadToConsole(bizName, "Review Triggered", partner.id);
                triggerSuccessToast("Underwriting Pipeline Triggered!", `The review has been routed to ${partner.name}. Tracking key has been registered.`);
            };
        }

        // Choice button binds for steps 1 and 2
        overlay.querySelectorAll(".wizard-choice-btn").forEach(btn => {
            btn.onclick = () => {
                const val = btn.getAttribute("data-value");
                if (step === 1) {
                    state.revenue = val;
                    renderWizardStep(overlay, partner, 2, state);
                } else if (step === 2) {
                    state.timeInBusiness = val;
                    renderWizardStep(overlay, partner, 3, state);
                }
            };
        });
    }

    // 5. Build Dynamic Underwriting Calculator Widget
    function createUnderwritingCalculator() {
        const directorySection = document.getElementById("profiles");
        if (!directorySection) return;

        // Container creation
        const calcContainer = document.createElement("div");
        calcContainer.className = "desk-calc-container glass-card";
        calcContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--glass-border); padding-bottom:12px; margin-bottom:24px;">
                <span class="mono highlight-green" id="attributed-partner-badge">Attributed Partner Gateway</span>
                <span id="desk-dynamic-header" style="font-family: var(--font-space); font-weight:700; font-size:1.1rem; color: var(--bone-white);">Interactive Underwriting Desk</span>
            </div>
            
            <div class="desk-calc-grid">
                <div>
                    <h3 style="font-family: var(--font-space); font-size:1.3rem; margin-bottom:12px;">Pre-Underwrite Your Pipeline</h3>
                    <p style="color:var(--chrome-accent); font-size:0.85rem; line-height:1.4; margin-bottom:24px;">Adjust metrics directly matching your current balance sheets to simulate credit readiness parameters on-the-fly.</p>
                    
                    <div class="desk-input-group">
                        <div class="desk-input-label">
                            <span>MONTHLY GROSS REVENUES</span>
                            <span id="label-val-revenue" class="highlight-green">$75,000</span>
                        </div>
                        <input type="range" id="slider-revenue" class="desk-slider" min="5000" max="250000" step="5000" value="75000">
                    </div>

                    <div class="desk-input-group">
                        <div class="desk-input-label">
                            <span>ESTIMATED FICO SCORE BANDS</span>
                            <span id="label-val-fico" class="highlight-green">680</span>
                        </div>
                        <input type="range" id="slider-fico" class="desk-slider" min="500" max="850" step="10" value="680">
                    </div>

                    <div class="desk-input-group" style="margin-bottom:0;">
                        <div class="desk-input-label">
                            <span>EIN LONGEVITY (MONTHS)</span>
                            <span id="label-val-longevity" class="highlight-green">24 Months</span>
                        </div>
                        <input type="range" id="slider-longevity" class="desk-slider" min="1" max="120" step="1" value="24">
                    </div>
                </div>

                <div class="score-gauge-wrap">
                    <div class="score-circle" id="dynamic-score-circle" style="--percentage: 75%;">
                        <div class="score-text">
                            <span id="dynamic-score-percentage">75%</span>
                            <span>Readiness</span>
                        </div>
                    </div>
                    <div style="text-align:center; margin-top:16px;">
                        <h4 id="calc-readiness-label" style="font-family: var(--font-space); font-size:1rem; margin-bottom:4px; color:var(--electric-green);">High Desk Match</h4>
                        <p style="font-size:0.75rem; color:var(--chrome-accent);">Ready for priority partner review.</p>
                    </div>
                </div>
            </div>
        `;

        // Insert after the Controls section but before the Grid
        const controls = directorySection.querySelector(".directory-controls");
        if (controls) {
            controls.parentNode.insertBefore(calcContainer, controls.nextSibling);
        } else {
            directorySection.querySelector(".container").appendChild(calcContainer);
        }

        // Add event listeners to calculators
        const sliderRevenue = document.getElementById("slider-revenue");
        const sliderFico = document.getElementById("slider-fico");
        const sliderLongevity = document.getElementById("slider-longevity");

        const updateCalcValues = () => {
            const revenue = parseInt(sliderRevenue.value);
            const fico = parseInt(sliderFico.value);
            const longevity = parseInt(sliderLongevity.value);

            // Print display labels
            document.getElementById("label-val-revenue").textContent = `$${revenue.toLocaleString()}`;
            document.getElementById("label-val-fico").textContent = fico;
            document.getElementById("label-val-longevity").textContent = `${longevity} Month${longevity > 1 ? "s" : ""}`;

            // Underwriting algorithm
            let score = 20; // baseline
            if (revenue > 100000) score += 30;
            else if (revenue > 50000) score += 20;
            else if (revenue > 20000) score += 10;

            if (fico > 720) score += 30;
            else if (fico > 650) score += 20;
            else if (fico > 600) score += 10;

            if (longevity > 36) score += 20;
            else if (longevity > 12) score += 10;

            // Constrain
            score = Math.min(Math.max(score, 15), 100);
            activeUnderwritingScore = score;

            // Visual update
            const circle = document.getElementById("dynamic-score-circle");
            const scoreText = document.getElementById("dynamic-score-percentage");
            const label = document.getElementById("calc-readiness-label");

            if (circle && scoreText && label) {
                scoreText.textContent = `${score}%`;
                circle.style.setProperty("--percentage", `${score}%`);
                
                // Color scaling
                if (score >= 80) {
                    label.textContent = "Elite Match Opportunity";
                    label.style.color = "var(--electric-green)";
                    circle.style.setProperty("conic-gradient", "var(--electric-green)");
                } else if (score >= 50) {
                    label.textContent = "Strong Match Opportunity";
                    label.style.color = "var(--electric-green)";
                } else {
                    label.textContent = "Advisory Track Match";
                    label.style.color = "var(--signal-orange)";
                }
            }
        };

        sliderRevenue.oninput = updateCalcValues;
        sliderFico.oninput = updateCalcValues;
        sliderLongevity.oninput = updateCalcValues;

        // Initialize display values
        updateCalcValues();
    }

    // 6. Real-time Lead Attribution Console
    function createAttributionConsole() {
        const directorySection = document.getElementById("profiles");
        if (!directorySection) return;

        const consoleWrapper = document.createElement("div");
        consoleWrapper.className = "desk-console";
        consoleWrapper.innerHTML = `
            <div class="desk-console-header">
                <span>LOCAL ATTRIBUTION REGISTRY (LOCAL STORAGE SESSION)</span>
                <span class="highlight-green" style="animation: pulse 1.5s infinite;">• ENGINE ONLINE</span>
            </div>
            <div id="attribution-log-container">
                <!-- Dynamically hydrated logs -->
                <div class="desk-console-row" style="color:var(--chrome-accent);">
                    <span>[BOOT] Secure handshake established. Desk routing active.</span>
                    <span>MCP-SYS-LOG</span>
                </div>
            </div>
        `;

        directorySection.querySelector(".container").appendChild(consoleWrapper);
        hydrateLocalStorageLeads();
    }

    function addLeadToConsole(entity, statusType, partnerId) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Save to LocalStorage
        const localLeads = JSON.parse(localStorage.getItem("mcp_desk_leads") || "[]");
        localLeads.unshift({ timestamp, entity, statusType, partnerId });
        localStorage.setItem("mcp_desk_leads", JSON.stringify(localLeads));

        renderLeadRows();
    }

    function hydrateLocalStorageLeads() {
        const localLeads = JSON.parse(localStorage.getItem("mcp_desk_leads") || "[]");
        if (localLeads.length === 0) {
            // Seed a mock lead so it is not empty
            addLeadToConsole("Vanguard Hospitality Corp", "Review Completed", "MCP-DH-4029");
        } else {
            renderLeadRows();
        }
    }

    function renderLeadRows() {
        const container = document.getElementById("attribution-log-container");
        if (!container) return;

        const localLeads = JSON.parse(localStorage.getItem("mcp_desk_leads") || "[]");
        
        let html = `
            <div class="desk-console-row" style="color:var(--chrome-accent); border-bottom:1px solid var(--glass-border);">
                <span>TIMESTAMP // ENTITY TRADING IDENTIFIER</span>
                <span>DESK DESTINATION // ENGINE STATUS</span>
            </div>
        `;

        localLeads.slice(0, 5).forEach(lead => {
            html += `
                <div class="desk-console-row">
                    <span>[${lead.timestamp}] ${lead.entity}</span>
                    <span style="color:var(--electric-green);">${lead.partnerId} // ${lead.statusType}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // 7. Dynamic Social Proof Live Feed Overlay (Toasts)
    function setupSocialProofTickers() {
        const toastContainer = document.createElement("div");
        toastContainer.className = "live-toast-container";
        document.body.appendChild(toastContainer);

        // Periodically trigger mock fundings based on active partner profile
        setInterval(() => {
            const partner = PARTNER_DIRECTORY[currentPartnerKey];
            if (!partner) return;

            // Pick randomized transaction from partner directory
            const funding = partner.recentFundings[Math.floor(Math.random() * partner.recentFundings.length)];
            triggerTransactionToast(funding.client, funding.amount, funding.type, partner.accentColor);
        }, 15000); // trigger every 15 seconds
    }

    function triggerTransactionToast(client, value, termType, colorHex) {
        const container = document.querySelector(".live-toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "live-toast";
        toast.style.borderLeftColor = colorHex;
        
        toast.innerHTML = `
            <div class="live-toast-avatar" style="color: ${colorHex}">$</div>
            <div>
                <h4 style="font-family: var(--font-space); font-size: 0.85rem; margin-bottom: 2px;">Funded: ${client}</h4>
                <p style="font-size:0.75rem; color:var(--chrome-accent);">${termType} // <span style="color: ${colorHex}; font-weight:bold;">${value}</span></p>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = "toastSlideIn 0.4s reverse forwards";
            setTimeout(() => { toast.remove(); }, 400);
        }, 6000);
    }

    function triggerSuccessToast(title, body) {
        const container = document.querySelector(".live-toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "live-toast";
        toast.style.borderLeftColor = "var(--electric-green)";
        toast.innerHTML = `
            <div class="live-toast-avatar">✓</div>
            <div>
                <h4 style="font-family: var(--font-space); font-size: 0.85rem; margin-bottom: 2px;">${title}</h4>
                <p style="font-size:0.75rem; color:var(--chrome-accent);">${body}</p>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 6000);
    }

    // 8. Partner Interlocking Engine Hooks (Tying Directory Cards directly to Workspace)
    function hijackDirectoryListingCTAs() {
        // Rewrite existing card actions so they hydrate the main Funding Desk mock space instantly
        const cards = document.querySelectorAll(".partner-card");
        cards.forEach(card => {
            const footer = card.querySelector(".partner-card-footer");
            if (!footer) return;

            const nameEl = card.querySelector("h3");
            if (!nameEl) return;

            // Generate lookup key mapping (e.g. "Evelyn Thorne" -> "evelyn-thorne")
            const lookupKey = nameEl.textContent.trim().toLowerCase().replace(" ", "-");

            if (PARTNER_DIRECTORY[lookupKey]) {
                const viewBtn = footer.querySelector(".btn-secondary");
                const actionBtn = footer.querySelector(".btn-primary");

                if (viewBtn) {
                    viewBtn.textContent = "Hydrate Desk";
                    viewBtn.onclick = (e) => {
                        e.preventDefault();
                        hydratePartnerProfile(lookupKey);
                        // Smooth scroll to hero
                        document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
                    };
                }

                if (actionBtn) {
                    actionBtn.textContent = "Instant Match";
                    actionBtn.onclick = (e) => {
                        e.preventDefault();
                        hydratePartnerProfile(lookupKey);
                        launchUnderwritingWizard(lookupKey);
                    };
                }
            }
        });
    }

    // Initialize all custom Desk modules on document complete
    document.addEventListener("DOMContentLoaded", () => {
        injectCustomDeskStyles();
        createUnderwritingCalculator();
        createAttributionConsole();
        setupSocialProofTickers();
        hijackDirectoryListingCTAs();
        
        // Initial fallbacks
        hydratePartnerProfile("darwin-hanneman");
    });
})();