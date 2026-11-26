// Moonshine Partner Profile Engine - Command Center Script
// Path: partners/[slug]/profile.js
// Powers dynamic interactive widgets, calculators, and document checks on individual partner desks.

document.addEventListener('DOMContentLoaded', () => {
    // 1. EXTRACT PARTNER DATA & SLUG FROM URL
    const partnerData = {
        'darwin-hanneman': {
            name: "Darwin Hanneman",
            initials: "DH",
            title: "Real Estate Investor Funding Partner",
            niche: "Fix & Flip Portfolios",
            maxFunding: "$15,000,000",
            primaryTool: "Asset-Route Matcher",
            description: "Unlocking dynamic short-term bridge products, portfolio lines, and transactional asset-based debt channels tailored for institutional operators.",
            email: "darwin.h@moonshine.partners",
            calendarLink: "https://calendly.com/darwin-moonshine",
            specialty: "realestate",
            allowedDocs: ["6 Months Bank Statements", "Property Debt Schedule", "Recent Appraisal", "Corporate Entity Docs"]
        },
        'marcus-vance': {
            name: "Marcus Vance",
            initials: "MV",
            title: "Ecommerce Funding Specialist",
            niche: "High-Scale DTC",
            maxFunding: "$3,500,000",
            primaryTool: "Inventory Checker",
            description: "Releasing optimized revenue-based growth capital tailored for international direct-to-consumer pipelines and scaling supply loops.",
            email: "marcus.v@moonshine.partners",
            calendarLink: "https://calendly.com/marcus-moonshine",
            specialty: "ecommerce",
            allowedDocs: ["3 Months Processing Statements", "Merchant Account Ledger", "Ad Spend Performance Report", "ID Verified Check"]
        },
        'elena-rostova': {
            name: "Elena Rostova",
            initials: "ER",
            title: "Logistics & Fleet Advisory",
            niche: "Middle-Mile Fleet",
            maxFunding: "$8,000,000",
            primaryTool: "Equipment Matrix",
            description: "Specialized logistics financing structuring asset equity, complex equipment leasing, and dispatch invoice factoring streams.",
            email: "elena.r@moonshine.partners",
            calendarLink: "https://calendly.com/elena-moonshine",
            specialty: "logistics",
            allowedDocs: ["Fleet Registration Audit", "6 Months Corporate Bank Statements", "Active Trucking Contracts", "A/R Aging Ledger"]
        },
        'jack-sterling': {
            name: "Jack Sterling",
            initials: "JS",
            title: "Contractor Funding Partner",
            niche: "HVAC & Electrical",
            maxFunding: "$2,000,000",
            primaryTool: "Contract Accelerator",
            description: "Enabling high-capacity commercial contractors to fund immediate supply purchases, payroll allocations, and multi-month projects safely.",
            email: "jack.s@moonshine.partners",
            calendarLink: "https://calendly.com/jack-moonshine",
            specialty: "contractors",
            allowedDocs: ["Signed Work Orders", "W-9 Form", "Previous Year Corporate Tax Returns", "4 Months Bank Records"]
        },
        'sarah-jenkins': {
            name: "Sarah Jenkins",
            initials: "SJ",
            title: "Real Estate Investor Specialist",
            niche: "10-50 Unit Assets",
            maxFunding: "$25,000,000",
            primaryTool: "Yield Matcher",
            description: "Focusing on private multi-family syndication funding models, flexible bridge notes, and joint venture cash flow setups.",
            email: "sarah.j@moonshine.partners",
            calendarLink: "https://calendly.com/sarah-moonshine",
            specialty: "realestate",
            allowedDocs: ["Rent Roll Projections", "Operating Agreement", "Personal Financial Statement", "Phase 1 Environmental Report"]
        },
        'devon-mills': {
            name: "Devon Mills",
            initials: "DM",
            title: "Merchant Capital Specialist",
            niche: "Physical Goods Scaling",
            maxFunding: "$1,500,000",
            primaryTool: "Merchant Calculator",
            description: "Fast-paced, optimization-driven capital models specifically calibrated for scaling immediate inventory ahead of critical seasonal sales.",
            email: "devon.m@moonshine.partners",
            calendarLink: "https://calendly.com/devon-mills",
            specialty: "ecommerce",
            allowedDocs: ["Point-of-Sale Export Logs", "Inventory Valuation Audit", "Business License Proof", "Last 3 Bank Statements"]
        }
    };

    // Detect Current Partner slug based on URL path or fallback
    function getActiveSlug() {
        const pathSegments = window.location.pathname.split('/');
        // Usually: /partners/[slug]/index.html or /partners/[slug]/
        const index = pathSegments.indexOf('partners');
        if (index !== -1 && pathSegments[index + 1]) {
            return pathSegments[index + 1];
        }
        // Query param fallback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('partner')) {
            return urlParams.get('partner');
        }
        // Absolute fallback to first index partner
        return 'darwin-hanneman';
    }

    const currentSlug = getActiveSlug();
    const currentPartner = partnerData[currentSlug] || partnerData['darwin-hanneman'];

    // 2. INJECT PARTNER PROFILE DATA DYNAMICALLY
    function populatePartnerProfile() {
        const elements = {
            'profile-name': currentPartner.name,
            'profile-initials': currentPartner.initials,
            'profile-title': currentPartner.title,
            'profile-niche': currentPartner.niche,
            'profile-max-funding': currentPartner.maxFunding,
            'profile-primary-tool': currentPartner.primaryTool,
            'profile-desc': currentPartner.description,
            'profile-email': currentPartner.email,
            'profile-nav-name': currentPartner.name.split(' ')[0] + "'s Desk"
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'A' && id === 'profile-email') {
                    el.href = `mailto:${value}?subject=Inquiry%20via%20Moonshine%20Funding%20Desk`;
                    el.textContent = value;
                } else {
                    el.textContent = value;
                }
            }
        }

        // Render profile avatar/logo
        const avatarEl = document.getElementById('profile-avatar-block');
        if (avatarEl) {
            avatarEl.textContent = currentPartner.initials;
        }

        // Setup the localized document checklist
        const checklistContainer = document.getElementById('document-checklist-items');
        if (checklistContainer && currentPartner.allowedDocs) {
            checklistContainer.innerHTML = ''; // Clear template mocks
            currentPartner.allowedDocs.forEach((doc, idx) => {
                const docRow = document.createElement('div');
                docRow.className = 'blueprint-row';
                docRow.style.cursor = 'default';
                docRow.style.borderStyle = 'solid';
                docRow.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <input type="checkbox" class="doc-checkbox" id="doc-chk-${idx}" style="accent-color: var(--electric-green); cursor: pointer;">
                        <label for="doc-chk-${idx}" style="cursor: pointer; font-size: 0.8rem; font-family: var(--font-mono);">${doc}</label>
                    </div>
                    <span class="doc-status text-orange" id="doc-status-${idx}" style="font-family: var(--font-mono); font-size: 0.7rem;">PENDING</span>
                `;
                checklistContainer.appendChild(docRow);
            });
            setupChecklistListeners();
        }
    }

    // 3. SECURE INTERACTIVE SCORECARD / EVALUATION CALCULATOR
    const revSlider = document.getElementById('calc-monthly-rev');
    const revValue = document.getElementById('calc-rev-val');
    const timeInBusiness = document.getElementById('calc-time');
    const ficoSlider = document.getElementById('calc-fico');
    const ficoValue = document.getElementById('calc-fico-val');
    
    const scoreNum = document.getElementById('scorecard-score');
    const scoreRating = document.getElementById('scorecard-rating');
    const matchStatus = document.getElementById('scorecard-match');

    function updateScorecard() {
        if (!revSlider || !ficoSlider) return;

        const rev = parseInt(revSlider.value);
        const fico = parseInt(ficoSlider.value);
        const months = parseInt(timeInBusiness ? timeInBusiness.value : 12);

        // Display labels formatted
        revValue.textContent = `$${rev.toLocaleString()}`;
        ficoValue.textContent = fico;

        // Scoring algorithm simulation
        let score = 30; // base score

        // Revenue scaling (max 35 points)
        if (rev >= 100000) score += 35;
        else if (rev >= 50000) score += 28;
        else if (rev >= 25000) score += 20;
        else if (rev >= 10000) score += 12;
        else score += 5;

        // FICO scaling (max 25 points)
        if (fico >= 720) score += 25;
        else if (fico >= 650) score += 18;
        else if (fico >= 600) score += 10;
        else score += 2;

        // Time in Business scaling (max 15 points)
        if (months >= 24) score += 15;
        else if (months >= 12) score += 10;
        else if (months >= 6) score += 5;
        else score += 1;

        // Industry multiplier (base 5 points bonus for standard compliance)
        score += 5;

        // Absolute boundaries
        score = Math.min(Math.max(score, 10), 100);

        // UI Outputs
        if (scoreNum) scoreNum.textContent = `${score}%`;

        if (score >= 80) {
            scoreRating.textContent = "EXCELLENT (FAST TRACK APPROVED)";
            scoreRating.className = "text-green mono";
            matchStatus.textContent = `A+ Fit for ${currentPartner.niche} pathways. Initial offer dynamic match available.`;
        } else if (score >= 55) {
            scoreRating.textContent = "QUALIFIED (MID-TIER CLEARANCE)";
            scoreRating.className = "text-blue mono";
            matchStatus.textContent = "Requires standard verification. Fully eligible for structured lines and working capital.";
        } else {
            scoreRating.textContent = "CO-SIGNER OR COLLATERAL ADVISED";
            scoreRating.className = "text-orange mono";
            matchStatus.textContent = "Extended review required. Consider utilizing real-estate options or invoice streams.";
        }
    }

    if (revSlider && ficoSlider) {
        revSlider.addEventListener('input', updateScorecard);
        ficoSlider.addEventListener('input', updateScorecard);
        if (timeInBusiness) timeInBusiness.addEventListener('change', updateScorecard);
        updateScorecard();
    }

    // 4. CHECKLIST MANAGEMENT & SIMULATION
    function setupChecklistListeners() {
        const checkboxes = document.querySelectorAll('.doc-checkbox');
        const progressBar = document.getElementById('checklist-progress');
        const progressPercent = document.getElementById('checklist-percent-text');

        function updateProgress() {
            if (checkboxes.length === 0) return;
            let checkedCount = 0;
            checkboxes.forEach((cb, idx) => {
                const statusEl = document.getElementById(`doc-status-${idx}`);
                if (cb.checked) {
                    checkedCount++;
                    statusEl.textContent = "VERIFIED";
                    statusEl.className = "doc-status text-green";
                } else {
                    statusEl.textContent = "PENDING";
                    statusEl.className = "doc-status text-orange";
                }
            });

            const percent = Math.round((checkedCount / checkboxes.length) * 100);
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressPercent) progressPercent.textContent = `${percent}% Prepared`;

            if (percent === 100) {
                triggerProfileToast("⚡ Critical Document Check COMPLETE. Launch desk request enabled!");
            }
        }

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateProgress);
        });
        updateProgress();
    }

    // 5. CALENDAR MOCK BOOKING MANAGEMENT
    const calendarDays = document.querySelectorAll('.cal-day');
    const calendarSlots = document.querySelectorAll('.cal-time-slot');
    const bookBtn = document.getElementById('btn-confirm-booking');
    
    let selectedDay = null;
    let selectedTime = null;

    if (calendarDays.length > 0) {
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                calendarDays.forEach(d => d.style.borderColor = 'var(--chrome-border)');
                day.style.borderColor = 'var(--electric-green)';
                selectedDay = day.getAttribute('data-day');
                triggerProfileToast(`Date Locked: ${selectedDay}`);
                validateBookingState();
            });
        });
    }

    if (calendarSlots.length > 0) {
        calendarSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                calendarSlots.forEach(s => {
                    s.style.backgroundColor = 'transparent';
                    s.style.color = 'var(--bone-white)';
                });
                slot.style.backgroundColor = 'var(--electric-green)';
                slot.style.color = 'var(--bg-black)';
                selectedTime = slot.getAttribute('data-time');
                triggerProfileToast(`Slot Chosen: ${selectedTime}`);
                validateBookingState();
            });
        });
    }

    function validateBookingState() {
        if (bookBtn) {
            if (selectedDay && selectedTime) {
                bookBtn.style.opacity = '1';
                bookBtn.style.cursor = 'pointer';
                bookBtn.removeAttribute('disabled');
            } else {
                bookBtn.style.opacity = '0.5';
                bookBtn.setAttribute('disabled', 'true');
            }
        }
    }

    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            if (selectedDay && selectedTime) {
                triggerProfileToast(`⚡ SUCCESS: Desk Call Scheduled with ${currentPartner.name} on ${selectedDay} at ${selectedTime}!`);
                bookBtn.textContent = "BOOKING LOCKED ✓";
                bookBtn.style.backgroundColor = 'var(--chrome-border-bright)';
                bookBtn.style.color = 'var(--electric-green)';
                bookBtn.setAttribute('disabled', 'true');
            }
        });
    }

    // 6. UTILITY TOAST NOTIFICATIONS (Bridged to System Layout)
    function triggerProfileToast(message) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>⚡</span> <span class="mono">${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) scale(0.9)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    // 7. CUSTOM REF LINK CONFIGURATOR FOR CPA & REFERRALS
    const refCodeInput = document.getElementById('ref-subid-input');
    const refGenerateBtn = document.getElementById('ref-generate-btn');
    const refOutputUrl = document.getElementById('ref-output-url');

    if (refGenerateBtn && refCodeInput) {
        refGenerateBtn.addEventListener('click', () => {
            const subId = refCodeInput.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
            if (subId.length === 0) {
                triggerProfileToast("⚠️ Error: Please enter a valid tracking keyword.");
                return;
            }
            const activeUrl = `https://moonshine.partners/partners/${currentSlug}?ref=${subId}`;
            if (refOutputUrl) {
                refOutputUrl.value = activeUrl;
                refOutputUrl.select();
                navigator.clipboard.writeText(activeUrl);
                triggerProfileToast(`🔗 Generated & Copied Tracking URL: ${subId}`);
            }
        });
    }

    // Initialize the execution flow
    populatePartnerProfile();
    validateBookingState();
});