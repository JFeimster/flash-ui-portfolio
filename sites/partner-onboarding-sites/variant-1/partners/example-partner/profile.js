// Moonshine Capital Partners - Partner Profile Desk Engine
// Configuration and interactive logic for specialized public partner desks

const PARTNER_CONFIG = {
    name: "Darwin Hanneman",
    slug: "darwin-hanneman",
    niche: "Contractors & Construction",
    specialties: ["SBA Funding", "Equipment Finance", "Working Capital", "Accounts Receivable"],
    avatar: "DH",
    tagline: "Commercial Finance Desk",
    bio: "Commercial funding expert helping contractor groups, heavy industry, and logistics operators scale through structured equipment leases, milestone bridge lines, and optimal working capital strategies.",
    trackingCode: "MCP-DH-99",
    email: "darwin.hanneman@moonshinepartners.com",
    phone: "+1 (800) 555-0199",
    calendlyUrl: "https://calendly.com/moonshine-partners/darwin-hanneman",
    fundingGoalDefault: 150000
};

// State Management
let documentState = {
    bankStatements: false,
    voidedCheck: false,
    arReport: false,
    taxReturn: false,
    businessLicense: false
};

// Initialize Partner Profile Page Elements and Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    initPartnerData();
    initReadinessScorecard();
    initDocumentChecklist();
    initMultiStepFundingForm();
    initLinkBuilder();
    initToastContainer();
});

// 1. Dynamic Data Population
function initPartnerData() {
    // Populate simple text bindings
    document.querySelectorAll('[data-partner="name"]').forEach(el => el.innerText = PARTNER_CONFIG.name);
    document.querySelectorAll('[data-partner="niche"]').forEach(el => el.innerText = PARTNER_CONFIG.niche);
    document.querySelectorAll('[data-partner="avatar"]').forEach(el => el.innerText = PARTNER_CONFIG.avatar);
    document.querySelectorAll('[data-partner="bio"]').forEach(el => el.innerText = PARTNER_CONFIG.bio);
    document.querySelectorAll('[data-partner="tracking-code"]').forEach(el => el.innerText = PARTNER_CONFIG.trackingCode);
    document.querySelectorAll('[data-partner="tagline"]').forEach(el => el.innerText = PARTNER_CONFIG.tagline);
    
    // Set specialty tags
    const specialtyContainer = document.getElementById("partnerSpecialties");
    if (specialtyContainer) {
        specialtyContainer.innerHTML = PARTNER_CONFIG.specialties
            .map(spec => `<span class="text-xs font-mono bg-white/5 text-white px-2.5 py-1 border border-white/10 rounded-sm">${spec}</span>`)
            .join("");
    }

    // Set Calendar links
    document.querySelectorAll('[data-partner-action="book"]').forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            openBookingModal();
        });
    });
}

// 2. Interactive Readiness Scorecard
function initReadinessScorecard() {
    const calcForm = document.getElementById("scorecardForm");
    if (!calcForm) return;

    const monthlyRevInput = document.getElementById("scoreRev");
    const tenureInput = document.getElementById("scoreTenure");
    const creditInput = document.getElementById("scoreCredit");
    const calculateBtn = document.getElementById("calculateScoreBtn");

    if (calculateBtn) {
        calculateBtn.addEventListener("click", () => {
            const rev = parseFloat(monthlyRevInput.value) || 0;
            const tenure = parseInt(tenureInput.value) || 0;
            const credit = parseInt(creditInput.value) || 0;

            let score = 0;
            let feedback = [];
            let colorClass = "text-signalOrange";
            let borderColorClass = "border-signalOrange/30";
            let bgClass = "bg-signalOrange/5";

            // Revenue Scoring (Max 40 points)
            if (rev >= 100000) {
                score += 40;
                feedback.push("✓ Revenue exceeds $100k/mo (Tier-1 Enterprise limits unlock).");
            } else if (rev >= 50000) {
                score += 35;
                feedback.push("✓ Strong baseline monthly revenues of $50k+.");
            } else if (rev >= 15000) {
                score += 25;
                feedback.push("✓ Eligible for standard operating capital pipelines.");
            } else if (rev >= 10000) {
                score += 15;
                feedback.push("⚠ Minimum program floor met, but leverage parameters are tight.");
            } else {
                score += 5;
                feedback.push("✗ Under $10k/mo limits access to standard revolving options.");
            }

            // Tenure Scoring (Max 30 points)
            if (tenure >= 24) {
                score += 30;
                feedback.push("✓ Well established operating tenure (>2 years).");
            } else if (tenure >= 12) {
                score += 25;
                feedback.push("✓ Solid operational foundations (1+ years in business).");
            } else if (tenure >= 6) {
                score += 15;
                feedback.push("⚠ Operational duration is restricted. Merchant Cash Advance lanes may match best.");
            } else {
                score += 5;
                feedback.push("✗ Startup territory. Options require secondary equity or strong guarantees.");
            }

            // Credit Score (Max 30 points)
            if (credit >= 720) {
                score += 30;
                feedback.push("✓ Tier-1 Personal credit rating (Unlocks lowest rate structures).");
            } else if (credit >= 650) {
                score += 25;
                feedback.push("✓ Prime credit range profiles accepted by leading banks.");
            } else if (credit >= 600) {
                score += 15;
                feedback.push("⚠ Mid-tier credit profile. Cash flow acts as primary underwriting support.");
            } else {
                score += 5;
                feedback.push("✗ Subprime scoring requires asset-backed structures or AR collateral.");
            }

            // UI adjustments depending on total calculated score
            const scoreDisplay = document.getElementById("scoreDisplay");
            const resultBox = document.getElementById("scorecardResult");
            const feedbackBox = document.getElementById("scorecardFeedback");

            if (scoreDisplay && resultBox && feedbackBox) {
                if (score >= 80) {
                    colorClass = "text-electricGreen";
                    borderColorClass = "border-electricGreen/30";
                    bgClass = "bg-electricGreen/5";
                } else if (score >= 55) {
                    colorClass = "text-cobaltBlue";
                    borderColorClass = "border-cobaltBlue/30";
                    bgClass = "bg-cobaltBlue/5";
                }

                // Apply style classes dynamically
                resultBox.className = `p-6 border ${borderColorClass} ${bgClass} transition-all duration-300`;
                scoreDisplay.className = `text-5xl font-mono font-black ${colorClass}`;
                scoreDisplay.innerText = `${score}/100`;

                // Set HTML feedback recommendations
                feedbackBox.innerHTML = `
                    <h4 class="font-mono text-xs font-bold text-white uppercase tracking-wider mb-3">System Diagnostics Output</h4>
                    <ul class="space-y-2 text-xs text-chromeAccent font-mono">
                        ${feedback.map(item => `<li>${item}</li>`).join("")}
                    </ul>
                    <div class="mt-4 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-2">
                        <span class="text-[10px] font-mono text-chromeAccent">Best Channel Match: <strong class="text-white">${score >= 80 ? "Premium Bank Line & SBA" : score >= 55 ? "Asset-Backed / Custom Line" : "Performance Advance"}</strong></span>
                        <a href="#funding-form" class="font-mono text-[10px] bg-white text-black font-extrabold px-3 py-1 hover:bg-electricGreen transition-colors">Lock Profile & Apply</a>
                    </div>
                `;

                resultBox.classList.remove("hidden");
                showToast(`Readiness Score computed: ${score}/100`, "success");
            }
        });
    }
}

// 3. Document Checklist Actions
function initDocumentChecklist() {
    const checkBoxes = document.querySelectorAll(".checklist-item input[type='checkbox']");
    if (checkBoxes.length === 0) return;

    checkBoxes.forEach(box => {
        // Initial binding
        documentState[box.id] = box.checked;

        box.addEventListener("change", (e) => {
            documentState[e.target.id] = e.target.checked;
            updateChecklistProgress();
        });
    });

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const keys = Object.keys(documentState);
    const checkedCount = keys.filter(k => documentState[k]).length;
    const totalCount = keys.length;
    const progressPercent = Math.round((checkedCount / totalCount) * 100);

    const progressBar = document.getElementById("checklistProgressBar");
    const progressText = document.getElementById("checklistProgressText");
    const activePlanBox = document.getElementById("activePlanMessage");

    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (progressText) progressText.innerText = `${checkedCount} of ${totalCount} Required Files`;

    if (activePlanBox) {
        if (checkedCount === totalCount) {
            activePlanBox.className = "mt-4 p-4 bg-electricGreen/10 border border-electricGreen/30 text-electricGreen font-mono text-xs";
            activePlanBox.innerHTML = `⚡ <strong>Ready for Accelerated Underwriting:</strong> Your checklist is 100% satisfied. Click 'Start Funding Review' to process submissions in under 2 hours.`;
        } else if (checkedCount >= 3) {
            activePlanBox.className = "mt-4 p-4 bg-cobaltBlue/10 border border-cobaltBlue/30 text-cobaltBlue font-mono text-xs";
            activePlanBox.innerHTML = `⚡ <strong>Partial Profile Ready:</strong> Your baseline core items are active. You can begin submission, but ${totalCount - checkedCount} pending files may slow down bank payouts.`;
        } else {
            activePlanBox.className = "mt-4 p-4 bg-white/5 border border-white/10 text-chromeAccent font-mono text-xs";
            activePlanBox.innerHTML = `⚠ <strong>Underwriting Friction Risk:</strong> Uploading at least 3 months bank statements is highly recommended to secure early interest quotes.`;
        }
    }
}

// 4. Multi-Step Specialized Funding Request Wizard
function initMultiStepFundingForm() {
    const form = document.getElementById("fundingForm");
    if (!form) return;

    const steps = document.querySelectorAll(".form-step");
    const nextBtns = document.querySelectorAll(".next-step-btn");
    const prevBtns = document.querySelectorAll(".prev-step-btn");
    const progressBar = document.getElementById("formWizardProgress");
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, idx) => {
            if (idx === stepIndex) {
                step.classList.remove("hidden");
            } else {
                step.classList.add("hidden");
            }
        });

        // Progress bar visual
        if (progressBar) {
            const stepWidth = ((stepIndex + 1) / steps.length) * 100;
            progressBar.style.width = `${stepWidth}%`;
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (validateStepInputs(currentStep)) {
                currentStep++;
                if (currentStep >= steps.length) {
                    currentStep = steps.length - 1;
                }
                showStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            currentStep--;
            if (currentStep < 0) {
                currentStep = 0;
            }
            showStep(currentStep);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Capture Form Data
        const formData = {
            companyName: document.getElementById("companyName")?.value || "",
            industry: document.getElementById("industry")?.value || "",
            monthlyRevenue: document.getElementById("monthlyRev")?.value || "",
            fundingAmount: document.getElementById("fundingAmount")?.value || "",
            contactName: document.getElementById("contactName")?.value || "",
            contactEmail: document.getElementById("contactEmail")?.value || "",
            contactPhone: document.getElementById("contactPhone")?.value || "",
            referrerCode: PARTNER_CONFIG.trackingCode,
            selectedDocuments: documentState
        };

        // Simulate secure submission routing to capital engine
        console.log("Routing lead structure to Moonshine Central Core API...", formData);
        
        const successBox = document.getElementById("fundingFormSuccess");
        if (successBox) {
            successBox.innerHTML = `
                <div class="space-y-4">
                    <h3 class="font-mono text-lg font-black text-electricGreen">⚡ DEPOSIT PROFILE SUCCESSFULLY ROUTED</h3>
                    <p class="text-xs text-chromeAccent">
                        Your request has been cryptographically bound with referral ID <strong>${PARTNER_CONFIG.trackingCode}</strong> (${PARTNER_CONFIG.name}).
                    </p>
                    <div class="p-3.5 bg-white/5 border border-white/10 rounded-sm text-xs space-y-1.5 text-white font-mono">
                        <div><strong>Account Officer:</strong> ${PARTNER_CONFIG.name}</div>
                        <div><strong>Target Capital Queue:</strong> ${formData.industry} Sector</div>
                        <div><strong>Routing State:</strong> Instant Processing Active</div>
                    </div>
                    <p class="text-[10px] text-chromeAccent/60">
                        Check your email inbox at <em>${formData.contactEmail}</em> for structural upload links and term confirmation pipelines.
                    </p>
                </div>
            `;
            successBox.classList.remove("hidden");
            form.classList.add("hidden");
            showToast("Application submitted successfully!", "success");
        }
    });

    showStep(currentStep);
}

function validateStepInputs(stepIndex) {
    const stepContainer = document.querySelectorAll(".form-step")[stepIndex];
    if (!stepContainer) return true;

    const requiredFields = stepContainer.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.classList.add("border-signalOrange");
            field.classList.remove("border-white/10");
        } else {
            field.classList.remove("border-signalOrange");
            field.classList.add("border-white/10");
        }
    });

    if (!valid) {
        showToast("Please fill all required operational parameters before proceeding.", "warning");
    }

    return valid;
}

// 5. Link Generator Tool (For Sub-Affiliates / Tracking Parameters)
function initLinkBuilder() {
    const srcInput = document.getElementById("linkSourceInput");
    const genBtn = document.getElementById("generateLinkBtn");
    const outputBox = document.getElementById("generatedLinkOutput");

    if (genBtn && srcInput && outputBox) {
        genBtn.addEventListener("click", () => {
            const rawSrc = srcInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
            const trackingSource = rawSrc || "direct_share";
            const generatedUrl = `${window.location.origin}/partners/${PARTNER_CONFIG.slug}/index.html?utm_source=${trackingSource}&utm_medium=partner_desk&utm_campaign=${PARTNER_CONFIG.trackingCode}`;
            
            outputBox.innerHTML = `
                <div class="mt-4 p-4 bg-white/5 border border-white/10">
                    <span class="block font-mono text-[9px] text-electricGreen uppercase tracking-widest font-bold mb-1">Target Tracking URL</span>
                    <div class="flex items-center gap-2">
                        <input type="text" readonly value="${generatedUrl}" id="copyTargetUrl" class="w-full bg-graphiteGray text-white text-[11px] font-mono p-2 border border-white/10 focus:outline-none">
                        <button onclick="copyGeneratedLink()" class="font-mono text-xs bg-white text-black hover:bg-electricGreen font-bold px-3 py-2 transition-colors">COPY</button>
                    </div>
                </div>
            `;
            showToast("Dynamic link generated with tracking metadata.", "success");
        });
    }
}

window.copyGeneratedLink = function() {
    const copyTarget = document.getElementById("copyTargetUrl");
    if (copyTarget) {
        copyTarget.select();
        navigator.clipboard.writeText(copyTarget.value).then(() => {
            showToast("Referral link copied successfully!", "success");
        });
    }
};

// 6. Integrated Modal Booking Controllers
function openBookingModal() {
    let modal = document.getElementById("bookingModal");
    
    if (!modal) {
        // Construct neobrutalist modal elements dynamically if not on page
        modal = document.createElement("div");
        modal.id = "bookingModal";
        modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300";
        modal.innerHTML = `
            <div class="bg-matteBlack border-4 border-white max-w-2xl w-full p-6 relative shadow-neobrutalGreen">
                <button onclick="closeBookingModal()" class="absolute top-4 right-4 text-white hover:text-signalOrange font-mono font-bold text-sm">CLOSE ×</button>
                <div class="mb-4">
                    <span class="font-mono text-xs text-electricGreen font-bold uppercase tracking-widest block">BOOKING ENGINE</span>
                    <h3 class="font-mono font-extrabold text-xl text-white">Direct Booking Calendar Strategy Call</h3>
                    <p class="text-xs text-chromeAccent mt-1">Configure meeting with ${PARTNER_CONFIG.name} (${PARTNER_CONFIG.niche} focus).</p>
                </div>
                <!-- Mock calendar placeholder for static setups, handles iframe loader dynamically -->
                <div class="bg-white/5 border border-white/10 rounded-sm p-4 h-[350px] flex flex-col justify-between">
                    <div class="space-y-4">
                        <p class="font-mono text-xs text-white">Select preferred strategy session format:</p>
                        <div class="grid grid-cols-2 gap-3">
                            <button onclick="selectMeetingType(15)" class="p-3 border border-white/20 bg-graphiteGray hover:border-electricGreen text-left transition-colors">
                                <span class="block text-xs font-mono font-bold text-white">15-Min Quick Intake Call</span>
                                <span class="block text-[10px] text-chromeAccent font-mono mt-1">Fast assessment & checklist verification</span>
                            </button>
                            <button onclick="selectMeetingType(45)" class="p-3 border border-white/20 bg-graphiteGray hover:border-cobaltBlue text-left transition-colors">
                                <span class="block text-xs font-mono font-bold text-white">45-Min Enterprise Strategy</span>
                                <span class="block text-[10px] text-chromeAccent font-mono mt-1">SBA structuring & large equipment line planning</span>
                            </button>
                        </div>
                    </div>
                    
                    <div id="calendarLoaderArea" class="hidden h-48 border-t border-white/10 pt-4 flex flex-col items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-electricGreen mb-2"></div>
                        <span class="text-xs font-mono text-chromeAccent">Initializing standard calendar session variables...</span>
                    </div>

                    <div id="mockSchedulerDetails" class="text-xs font-mono text-chromeAccent bg-black/40 p-3 border border-white/10">
                        ⚡ Direct Booking Active. Standard operational office hours: Mon - Fri (8am - 6pm EST).
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.classList.remove("hidden");
}

window.closeBookingModal = function() {
    const modal = document.getElementById("bookingModal");
    if (modal) modal.classList.add("hidden");
};

window.selectMeetingType = function(duration) {
    const loader = document.getElementById("calendarLoaderArea");
    const mockDetails = document.getElementById("mockSchedulerDetails");
    
    if (loader && mockDetails) {
        loader.classList.remove("hidden");
        setTimeout(() => {
            loader.classList.add("hidden");
            mockDetails.innerHTML = `
                <div class="text-white text-xs font-bold font-mono">📅 Dynamic Iframe Hook Selected (${duration}-Minute Session)</div>
                <div class="text-electricGreen text-[11px] mt-1">Redirecting to verified Calendly path: ${PARTNER_CONFIG.calendlyUrl}</div>
                <div class="mt-2.5">
                    <a href="${PARTNER_CONFIG.calendlyUrl}" target="_blank" class="inline-block bg-electricGreen text-black font-extrabold px-3 py-1 text-[10px] font-mono">Launch Live IFrame Now →</a>
                </div>
            `;
        }, 1200);
    }
};

// 7. Lightweight Custom Toast System
function initToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full";
        document.body.appendChild(container);
    }
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    let borderColor = "border-white";
    let bgAccent = "bg-matteBlack";
    let textAccent = "text-white";

    if (type === "success") {
        borderColor = "border-electricGreen";
        textAccent = "text-electricGreen";
    } else if (type === "warning") {
        borderColor = "border-signalOrange";
        textAccent = "text-signalOrange";
    }

    toast.className = `border-2 ${borderColor} ${bgAccent} p-3 shadow-neobrutalBlack text-xs font-mono ${textAccent} transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
        <div class="flex justify-between items-center gap-4">
            <span>[MCP STATE]: ${message}</span>
            <button class="font-bold hover:text-white" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    container.appendChild(toast);

    // Trigger visual transitions
    setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.add("translate-y-2", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}