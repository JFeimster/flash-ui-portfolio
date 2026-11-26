(function () {
    // 1. Core State Management
    const state = {
        currentStep: 1,
        totalSteps: 4,
        data: {
            fullName: 'Darwin Hanneman',
            slug: 'darwin-hanneman',
            role: 'Enterprise Funding Operator',
            bio: 'Providing direct access to commercial cash flow solutions, working capital, and equipment funding for growing companies.',
            avatarInitials: 'DH',
            avatarColor: 'electricGreen',
            market: 'enterprise',
            specialty: 'Revenue-Based Financing',
            bestFit: 'High Volume Retailers & Contractors',
            maxLimit: '$5M+',
            bookingUrl: 'https://calendly.com/moonshine/darwin',
            applyUrl: 'https://portal.moonshine.capital/apply?ref=darwin',
            prequalActive: true,
            requiredDocs: ['Tax Returns (2 Yrs)', 'Bank Statements (6 Mos)'],
            twitter: 'darwin_funding',
            linkedin: 'linkedin.com/in/darwin',
            cpaSplit: '50/50'
        }
    };

    // Standard Document Checklist Options
    const documentOptions = [
        'Tax Returns (2 Yrs)',
        'Bank Statements (6 Mos)',
        'Year-To-Date P&L Statement',
        'Outstanding Debt Schedule',
        'Accounts Receivable Aging',
        'Business License / Articles'
    ];

    // Color definitions for Avatar themes
    const avatarThemes = {
        electricGreen: { bg: 'bg-electricGreen/10', border: 'border-electricGreen/30', text: 'text-electricGreen' },
        cobaltBlue: { bg: 'bg-cobaltBlue/10', border: 'border-cobaltBlue/30', text: 'text-cobaltBlue' },
        signalOrange: { bg: 'bg-signalOrange/10', border: 'border-signalOrange/30', text: 'text-signalOrange' },
        boneWhite: { bg: 'bg-white/10', border: 'border-white/20', text: 'text-boneWhite' }
    };

    // Market helper labels
    const marketLabels = {
        local: 'Local Business',
        ecommerce: 'E-Commerce',
        contractor: 'Contractors',
        realestate: 'Real Estate',
        enterprise: 'Enterprise'
    };

    // Helper: auto slugification
    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    // 2. Generate JSON Configuration
    function getJsonString() {
        return JSON.stringify({
            "$schema": "https://moonshine.capital/schemas/partner.v1.json",
            "id": state.data.slug,
            "profile": {
                "name": state.data.fullName,
                "title": state.data.role,
                "bio": state.data.bio,
                "avatar": {
                    "initials": state.data.avatarInitials,
                    "themeColor": state.data.avatarColor
                }
            },
            "underwriting": {
                "market": state.data.market,
                "specialty": state.data.specialty,
                "bestFitClients": state.data.bestFit,
                "maxLimit": state.data.maxLimit
            },
            "integrations": {
                "bookingUrl": state.data.bookingUrl,
                "portalApplyUrl": state.data.applyUrl,
                "prequalifier": state.data.prequalActive,
                "requiredDocuments": state.data.requiredDocs
            },
            "channels": {
                "twitter": state.data.twitter ? `https://x.com/${state.data.twitter}` : "",
                "linkedin": state.data.linkedin,
                "referralFeeSplit": state.data.cpaSplit
            },
            "deployedAt": new Date().toISOString()
        }, null, 2);
    }

    // 3. Initialize & Build UI Skeleton
    function init() {
        const root = document.getElementById('generator-root');
        if (!root) return;

        // Clean background, layout, and panels
        root.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 font-sans";
        root.innerHTML = `
            <!-- Top Heading Frame -->
            <div class="mb-12 border-b border-glassBorder pb-8 relative">
                <span class="text-electricGreen font-mono text-xs uppercase tracking-widest block mb-2">// PARTNER PROFILES v1.0</span>
                <h1 class="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">Partner Profile Engine</h1>
                <p class="text-boneWhite/50 mt-2 font-light max-w-2xl">
                    Generate your lightweight static deployment config. Live edit your focus parameters, matching guidelines, custom widgets, and download your production file.
                </p>
                
                <!-- Toast Alert Built-In -->
                <div id="generator-toast" class="absolute top-0 right-0 bg-electricGreen text-matteBlack font-mono text-xs px-4 py-2 rounded border border-black transition-all duration-300 transform opacity-0 translate-y-2 pointer-events-none uppercase tracking-wider font-bold">
                    Copied to Clipboard!
                </div>
            </div>

            <!-- Parent Split Column Container -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Left: Forms and Wizard Controls (Col 7) -->
                <div class="lg:col-span-7 space-y-6">
                    <!-- Progress Bar Header -->
                    <div class="glass-panel p-4 rounded-lg flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span id="step-indicator" class="text-xs font-mono text-electricGreen bg-electricGreen/10 border border-electricGreen/20 px-3 py-1 rounded">
                                STEP 1 OF 4
                            </span>
                            <span id="step-title" class="text-sm font-display font-bold text-white uppercase tracking-wider">
                                Identity Details
                            </span>
                        </div>
                        <div class="w-24 bg-graphiteGray h-1 rounded overflow-hidden">
                            <div id="step-progress-bar" class="bg-electricGreen h-full transition-all duration-300" style="width: 25%"></div>
                        </div>
                    </div>

                    <!-- Main Dynamic Form Panel -->
                    <div id="wizard-form-container" class="glass-panel p-6 sm:p-8 rounded-xl border border-glassBorder space-y-6 min-h-[400px]">
                        <!-- Rendered Reactively -->
                    </div>

                    <!-- Wizard Navigation Actions -->
                    <div class="flex justify-between items-center pt-4">
                        <button id="btn-prev" class="border border-glassBorder hover:border-white text-boneWhite font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none">
                            Back
                        </button>
                        <button id="btn-next" class="bg-electricGreen hover:bg-white text-matteBlack font-display font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded transition-all duration-300 neo-glow-green">
                            Next Step
                        </button>
                    </div>
                </div>

                <!-- Right: Profile Preview Matrix (Col 5) -->
                <div class="lg:col-span-5 space-y-6 sticky top-24">
                    <div class="glass-panel rounded-xl p-6 border border-glassBorder shadow-2xl relative overflow-hidden">
                        
                        <!-- Mini Preview Banner Tag -->
                        <div class="absolute top-0 right-0 bg-electricGreen/15 text-electricGreen border-l border-b border-glassBorder font-mono text-[8px] tracking-widest uppercase px-3 py-1">
                            Live Preview
                        </div>

                        <!-- Card Top Ident Block -->
                        <div class="flex items-center gap-4 border-b border-glassBorder pb-6 mb-6">
                            <!-- Dynamic Avatar Circle -->
                            <div id="preview-avatar" class="w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-lg border transition-all duration-300">
                                DH
                            </div>
                            <div>
                                <h3 id="preview-name" class="font-display font-bold text-lg text-white leading-tight flex items-center gap-2">
                                    Darwin Hanneman
                                    <span class="w-2.5 h-2.5 rounded-full bg-electricGreen inline-block animate-pulse"></span>
                                </h3>
                                <p id="preview-role" class="text-xs font-mono text-boneWhite/50 mt-0.5">Enterprise Funding Operator</p>
                            </div>
                        </div>

                        <!-- Underwriting Metric Box -->
                        <div class="p-4 bg-matteBlack rounded-lg border border-glassBorder grid grid-cols-2 gap-4 mb-6 text-xs">
                            <div>
                                <span class="text-[9px] font-mono text-boneWhite/40 block uppercase tracking-wider">Market Segment</span>
                                <span id="preview-market" class="font-display font-semibold text-white mt-1 block">Enterprise</span>
                            </div>
                            <div>
                                <span class="text-[9px] font-mono text-boneWhite/40 block uppercase tracking-wider">Max Ticket Limit</span>
                                <span id="preview-limit" class="font-mono font-bold text-electricGreen mt-1 block text-sm">$5M+</span>
                            </div>
                            <div class="col-span-2 pt-2 border-t border-glassBorder/40">
                                <span class="text-[9px] font-mono text-boneWhite/40 block uppercase tracking-wider">Funding Specialty</span>
                                <span id="preview-specialty" class="font-display text-white mt-0.5 block">Revenue-Based Financing</span>
                            </div>
                        </div>

                        <!-- Context Profile Bio -->
                        <div class="space-y-2 mb-6 text-xs">
                            <span class="text-[9px] font-mono text-boneWhite/40 block uppercase tracking-wider">Partner Positioning</span>
                            <p id="preview-bio" class="text-boneWhite/70 leading-relaxed font-light">
                                Providing direct access to commercial cash flow solutions, working capital, and equipment funding for growing companies.
                            </p>
                        </div>

                        <!-- Checklist Requirements Preview -->
                        <div class="p-4 bg-graphiteGray/20 rounded-lg border border-glassBorder space-y-2 mb-6">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[9px] font-mono text-boneWhite/40 uppercase">Underwriting Checklist</span>
                                <span class="text-[8px] font-mono text-electricGreen bg-electricGreen/10 px-1.5 py-0.5 rounded">AUTO-ROUTING</span>
                            </div>
                            <div id="preview-checklist" class="space-y-1.5 text-[10px] font-mono text-boneWhite/60">
                                <!-- Dynamic checklists -->
                            </div>
                        </div>

                        <!-- Primary Active Call To Action Blocks -->
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <button id="preview-btn-apply" class="bg-electricGreen hover:bg-white text-matteBlack text-center py-2.5 rounded text-[10px] font-display font-bold uppercase tracking-wider transition-colors">
                                Apply Direct
                            </button>
                            <button id="preview-btn-book" class="border border-glassBorder hover:bg-white/5 text-boneWhite text-center py-2.5 rounded text-[10px] font-mono uppercase transition-colors">
                                Book Strategy
                            </button>
                        </div>

                        <!-- Trust Badge footer -->
                        <div class="pt-4 border-t border-glassBorder flex justify-between items-center text-[8px] font-mono text-boneWhite/30">
                            <span>OPERATIONS INTEGRATION: ACTIVE</span>
                            <span id="preview-cpa-split">FEE SPLIT: 50/50</span>
                        </div>
                    </div>

                    <!-- JSON / Export Raw Code Block -->
                    <div class="glass-panel rounded-xl p-6 border border-glassBorder space-y-4">
                        <div class="flex justify-between items-center border-b border-glassBorder pb-3">
                            <div>
                                <h4 class="font-display font-bold text-sm text-white">Generated Manifest</h4>
                                <p class="text-[10px] font-mono text-boneWhite/40">partner-config.json</p>
                            </div>
                            <div class="flex gap-2">
                                <button id="btn-copy-json" class="bg-graphiteGray hover:bg-white/10 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 rounded border border-glassBorder transition-colors">
                                    Copy Raw
                                </button>
                                <button id="btn-download-json" class="bg-cobaltBlue hover:bg-white text-matteBlack font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1.5 rounded transition-colors">
                                    Export Config
                                </button>
                            </div>
                        </div>
                        <pre class="bg-matteBlack p-4 rounded-lg border border-glassBorder text-[10px] font-mono text-boneWhite/80 overflow-x-auto max-h-[180px] scrollbar-thin"><code id="raw-json-display"></code></pre>
                    </div>
                </div>

            </div>
        `;

        // Bind DOM interactions
        bindEvents();
        // Render step one
        updateUI();
    }

    // 4. Bind Form Listeners & Core Events
    function bindEvents() {
        const root = document.getElementById('generator-root');
        if (!root) return;

        // Navigation controls
        document.getElementById('btn-prev').addEventListener('click', () => {
            if (state.currentStep > 1) {
                state.currentStep--;
                updateUI();
            }
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            if (state.currentStep < state.totalSteps) {
                // Simple validation check for fields before moving ahead
                if (validateCurrentStep()) {
                    state.currentStep++;
                    updateUI();
                }
            } else {
                // Submit action on final step
                triggerConfigDownload();
            }
        });

        // Copy JSON to clipboard
        document.getElementById('btn-copy-json').addEventListener('click', () => {
            const rawJson = getJsonString();
            navigator.clipboard.writeText(rawJson).then(() => {
                showToast('Copied JSON Config!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        // Download JSON file
        document.getElementById('btn-download-json').addEventListener('click', triggerConfigDownload);
    }

    // 5. Validation Step Constraints
    function validateCurrentStep() {
        if (state.currentStep === 1) {
            const nameVal = state.data.fullName.trim();
            const slugVal = state.data.slug.trim();
            if (!nameVal || !slugVal) {
                alert('Please enter a valid Full Name and Slug.');
                return false;
            }
        }
        return true;
    }

    // Trigger config browser download utility
    function triggerConfigDownload() {
        const jsonStr = getJsonString();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `partner-${state.data.slug || 'config'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Config exported successfully!');
    }

    // Toast alert presentation handler
    function showToast(message) {
        const toast = document.getElementById('generator-toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.remove('opacity-0', 'translate-y-2');
            toast.classList.add('opacity-100', 'translate-y-0');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                toast.classList.remove('opacity-100', 'translate-y-0');
            }, 3000);
        }
    }

    // Write input actions dynamically from form fields into state
    function bindDynamicInputs() {
        // Step 1 input monitors
        const fullNameInput = document.getElementById('field-fullName');
        if (fullNameInput) {
            fullNameInput.addEventListener('input', (e) => {
                state.data.fullName = e.target.value;
                // Auto generate slug if user hasn't modified slug directly
                const slugInput = document.getElementById('field-slug');
                if (slugInput) {
                    const dynamicSlug = slugify(e.target.value);
                    state.data.slug = dynamicSlug;
                    slugInput.value = dynamicSlug;
                }
                updateLivePreviewOnly();
            });
        }

        const slugInput = document.getElementById('field-slug');
        if (slugInput) {
            slugInput.addEventListener('input', (e) => {
                state.data.slug = slugify(e.target.value);
                slugInput.value = state.data.slug;
                updateLivePreviewOnly();
            });
        }

        const roleInput = document.getElementById('field-role');
        if (roleInput) {
            roleInput.addEventListener('input', (e) => {
                state.data.role = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const bioInput = document.getElementById('field-bio');
        if (bioInput) {
            bioInput.addEventListener('input', (e) => {
                state.data.bio = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const initialsInput = document.getElementById('field-initials');
        if (initialsInput) {
            initialsInput.addEventListener('input', (e) => {
                state.data.avatarInitials = e.target.value.substring(0, 3).toUpperCase();
                updateLivePreviewOnly();
            });
        }

        // Color toggle buttons
        const colorBtns = document.querySelectorAll('.color-toggle-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                state.data.avatarColor = btn.getAttribute('data-color');
                colorBtns.forEach(b => b.classList.remove('ring-2', 'ring-white'));
                btn.classList.add('ring-2', 'ring-white');
                updateLivePreviewOnly();
            });
        });

        // Step 2 input monitors
        const marketSelect = document.getElementById('field-market');
        if (marketSelect) {
            marketSelect.addEventListener('change', (e) => {
                state.data.market = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const specialtyInput = document.getElementById('field-specialty');
        if (specialtyInput) {
            specialtyInput.addEventListener('input', (e) => {
                state.data.specialty = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const bestFitInput = document.getElementById('field-bestFit');
        if (bestFitInput) {
            bestFitInput.addEventListener('input', (e) => {
                state.data.bestFit = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const limitSelect = document.getElementById('field-limit');
        if (limitSelect) {
            limitSelect.addEventListener('change', (e) => {
                state.data.maxLimit = e.target.value;
                updateLivePreviewOnly();
            });
        }

        // Step 3 input monitors
        const bookingInput = document.getElementById('field-bookingUrl');
        if (bookingInput) {
            bookingInput.addEventListener('input', (e) => {
                state.data.bookingUrl = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const applyInput = document.getElementById('field-applyUrl');
        if (applyInput) {
            applyInput.addEventListener('input', (e) => {
                state.data.applyUrl = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const splitInput = document.getElementById('field-cpaSplit');
        if (splitInput) {
            splitInput.addEventListener('input', (e) => {
                state.data.cpaSplit = e.target.value;
                updateLivePreviewOnly();
            });
        }

        // Step 4 Checklist & Channels monitors
        const checkItems = document.querySelectorAll('.checklist-opt-check');
        checkItems.forEach(check => {
            check.addEventListener('change', () => {
                const arr = [];
                checkItems.forEach(ci => {
                    if (ci.checked) {
                        arr.push(ci.value);
                    }
                });
                state.data.requiredDocs = arr;
                updateLivePreviewOnly();
            });
        });

        const twitterInput = document.getElementById('field-twitter');
        if (twitterInput) {
            twitterInput.addEventListener('input', (e) => {
                state.data.twitter = e.target.value;
                updateLivePreviewOnly();
            });
        }

        const linkedinInput = document.getElementById('field-linkedin');
        if (linkedinInput) {
            linkedinInput.addEventListener('input', (e) => {
                state.data.linkedin = e.target.value;
                updateLivePreviewOnly();
            });
        }
    }

    // 6. Complete UI updates & form render
    function updateUI() {
        // Step details rendering
        const stepInd = document.getElementById('step-indicator');
        const stepTitle = document.getElementById('step-title');
        const stepProgress = document.getElementById('step-progress-bar');
        const formContainer = document.getElementById('wizard-form-container');
        const btnNext = document.getElementById('btn-next');
        const btnPrev = document.getElementById('btn-prev');

        stepInd.textContent = `STEP ${state.currentStep} OF ${state.totalSteps}`;
        stepProgress.style.width = `${(state.currentStep / state.totalSteps) * 100}%`;

        // Switch headers and set interactive layouts
        if (state.currentStep === 1) {
            stepTitle.textContent = "Identity & Bio Details";
            btnPrev.disabled = true;
            btnNext.textContent = "Next Step";
            formContainer.innerHTML = renderStepOne();
        } else if (state.currentStep === 2) {
            stepTitle.textContent = "Underwriting Scope";
            btnPrev.disabled = false;
            btnNext.textContent = "Next Step";
            formContainer.innerHTML = renderStepTwo();
        } else if (state.currentStep === 3) {
            stepTitle.textContent = "Core Integrations";
            btnPrev.disabled = false;
            btnNext.textContent = "Next Step";
            formContainer.innerHTML = renderStepThree();
        } else if (state.currentStep === 4) {
            stepTitle.textContent = "Compliance & Export";
            btnPrev.disabled = false;
            btnNext.textContent = "Finish & Download";
            formContainer.innerHTML = renderStepFour();
        }

        // Hook fields with events
        bindDynamicInputs();

        // Update live preview & JSON file
        updateLivePreviewOnly();
    }

    // 7. Dynamic Mini Form Template Builders
    function renderStepOne() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Full Professional Name</label>
                    <input type="text" id="field-fullName" value="${state.data.fullName}" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Custom Path Slug (URL Safe)</label>
                    <input type="text" id="field-slug" value="${state.data.slug}" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Profile Title / Focus Area</label>
                        <input type="text" id="field-role" value="${state.data.role}" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    </div>
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Avatar Initials (Max 3)</label>
                        <input type="text" id="field-initials" value="${state.data.avatarInitials}" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Avatar Accent Profile Theme</label>
                    <div class="flex items-center gap-3 pt-1">
                        <button class="color-toggle-btn w-10 h-10 rounded-full bg-electricGreen border border-black ${state.data.avatarColor === 'electricGreen' ? 'ring-2 ring-white' : ''}" data-color="electricGreen" title="Electric Green"></button>
                        <button class="color-toggle-btn w-10 h-10 rounded-full bg-cobaltBlue border border-black ${state.data.avatarColor === 'cobaltBlue' ? 'ring-2 ring-white' : ''}" data-color="cobaltBlue" title="Cobalt Blue"></button>
                        <button class="color-toggle-btn w-10 h-10 rounded-full bg-signalOrange border border-black ${state.data.avatarColor === 'signalOrange' ? 'ring-2 ring-white' : ''}" data-color="signalOrange" title="Signal Orange"></button>
                        <button class="color-toggle-btn w-10 h-10 rounded-full bg-boneWhite border border-black ${state.data.avatarColor === 'boneWhite' ? 'ring-2 ring-white' : ''}" data-color="boneWhite" title="Bone White"></button>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Partner Biography Statement</label>
                    <textarea id="field-bio" rows="3" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-sans leading-relaxed">${state.data.bio}</textarea>
                </div>
            </div>
        `;
    }

    function renderStepTwo() {
        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Primary Target Market</label>
                        <select id="field-market" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                            <option value="local" ${state.data.market === 'local' ? 'selected' : ''}>Local Business</option>
                            <option value="ecommerce" ${state.data.market === 'ecommerce' ? 'selected' : ''}>E-Commerce</option>
                            <option value="contractor" ${state.data.market === 'contractor' ? 'selected' : ''}>Contractors</option>
                            <option value="realestate" ${state.data.market === 'realestate' ? 'selected' : ''}>Real Estate</option>
                            <option value="enterprise" ${state.data.market === 'enterprise' ? 'selected' : ''}>Enterprise & National</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Max Underwriting Limit</label>
                        <select id="field-limit" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                            <option value="$250k" ${state.data.maxLimit === '$250k' ? 'selected' : ''}>$250k Limits</option>
                            <option value="$1M" ${state.data.maxLimit === '$1M' ? 'selected' : ''}>$1M Limits</option>
                            <option value="$5M+" ${state.data.maxLimit === '$5M+' ? 'selected' : ''}>$5M+ Limits</option>
                            <option value="$10M+" ${state.data.maxLimit === '$10M+' ? 'selected' : ''}>$10M+ Enterprise Limits</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Asset Specialty / Funding Type</label>
                    <input type="text" id="field-specialty" value="${state.data.specialty}" placeholder="e.g. Accounts Receivable, MCA, CRE Bridge" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Best-Fit Clients Profiling</label>
                    <input type="text" id="field-bestFit" value="${state.data.bestFit}" placeholder="e.g. Online Sellers with $30k+/mo sales" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                </div>
            </div>
        `;
    }

    function renderStepThree() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Booking Calendar URL</label>
                    <input type="url" id="field-bookingUrl" value="${state.data.bookingUrl}" placeholder="e.g. https://calendly.com/username" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    <span class="text-[9px] font-mono text-boneWhite/30 block mt-1">Accepts any custom calendar embedding link (Calendly, Cal.com, TidyCal)</span>
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Direct Referral Intake / Application URL</label>
                    <input type="url" id="field-applyUrl" value="${state.data.applyUrl}" placeholder="e.g. https://portal.moonshine.capital/apply?ref=id" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    <span class="text-[9px] font-mono text-boneWhite/30 block mt-1">Core backend integration link tracking affiliate commissions</span>
                </div>
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Standard Sub-Affiliate CPA Split Pattern</label>
                    <input type="text" id="field-cpaSplit" value="${state.data.cpaSplit}" placeholder="e.g. 50/50, 30% Net Net" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                </div>
            </div>
        `;
    }

    function renderStepFour() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-2">Required Document Checklist Items</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${documentOptions.map((doc, idx) => {
            const isChecked = state.data.requiredDocs.includes(doc);
            return `
                                <label class="flex items-center gap-2 p-2.5 bg-graphiteGray/20 rounded border border-glassBorder hover:border-white/10 cursor-pointer select-none">
                                    <input type="checkbox" value="${doc}" class="checklist-opt-check h-3.5 w-3.5 rounded border-glassBorder bg-matteBlack text-electricGreen focus:ring-0" ${isChecked ? 'checked' : ''}>
                                    <span class="text-[10px] font-mono text-boneWhite/70">${doc}</span>
                                </label>
                            `;
        }).join('')}
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">Twitter/X Username (Optional)</label>
                        <input type="text" id="field-twitter" value="${state.data.twitter}" placeholder="e.g. handle" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    </div>
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-boneWhite/60 mb-1.5">LinkedIn Profile Link (Optional)</label>
                        <input type="text" id="field-linkedin" value="${state.data.linkedin}" placeholder="e.g. linkedin.com/in/user" class="w-full bg-graphiteGray/50 border border-glassBorder focus:border-electricGreen focus:ring-1 focus:ring-electricGreen focus:outline-none text-boneWhite px-4 py-3 text-xs rounded font-mono">
                    </div>
                </div>
            </div>
        `;
    }

    // 8. Live Sync to Preview Render Block only
    function updateLivePreviewOnly() {
        // Name and bio
        document.getElementById('preview-name').innerHTML = `
            ${state.data.fullName || 'Darwin Hanneman'}
            <span class="w-2.5 h-2.5 rounded-full bg-electricGreen inline-block animate-pulse"></span>
        `;
        document.getElementById('preview-role').textContent = state.data.role || 'Enterprise Funding Operator';
        document.getElementById('preview-bio').textContent = state.data.bio || 'Your bio details go here...';

        // Underwriting metrics
        const marketSlug = state.data.market;
        document.getElementById('preview-market').textContent = marketLabels[marketSlug] || 'Enterprise';
        document.getElementById('preview-limit').textContent = state.data.maxLimit || '$5M+';
        document.getElementById('preview-specialty').textContent = state.data.specialty || 'Revenue-Based Financing';

        // Custom theme elements for Avatar
        const previewAvatar = document.getElementById('preview-avatar');
        if (previewAvatar) {
            previewAvatar.textContent = state.data.avatarInitials || 'DH';
            const theme = avatarThemes[state.data.avatarColor] || avatarThemes.electricGreen;

            // Remove previous style configurations safely
            previewAvatar.className = "w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-lg border transition-all duration-300 " +
                `${theme.bg} ${theme.border} ${theme.text}`;
        }

        // Live updating checklist layout
        const checklistDiv = document.getElementById('preview-checklist');
        if (checklistDiv) {
            if (state.data.requiredDocs.length === 0) {
                checklistDiv.innerHTML = `<span class="text-boneWhite/30 block italic">No required docs selected...</span>`;
            } else {
                checklistDiv.innerHTML = state.data.requiredDocs.map((doc, idx) => `
                    <div class="flex justify-between items-center text-[9px] font-mono">
                        <span>${idx + 1}. ${doc}</span>
                        <span class="text-electricGreen">✓ Required</span>
                    </div>
                `).join('');
            }
        }

        // Set commission rate tag preview
        const cpaTag = document.getElementById('preview-cpa-split');
        if (cpaTag) {
            cpaTag.textContent = `FEE SPLIT: ${state.data.cpaSplit || '50/50'}`;
        }

        // Action button maps
        const applyBtn = document.getElementById('preview-btn-apply');
        if (applyBtn) {
            applyBtn.onclick = () => {
                const target = state.data.applyUrl || '#';
                alert(`Directing application route to:\n${target}`);
            };
        }

        const bookBtn = document.getElementById('preview-btn-book');
        if (bookBtn) {
            bookBtn.onclick = () => {
                const target = state.data.bookingUrl || '#';
                alert(`Opening Strategy Scheduler at:\n${target}`);
            };
        }

        // Raw code panel update
        const rawJsonEl = document.getElementById('raw-json-display');
        if (rawJsonEl) {
            rawJsonEl.textContent = getJsonString();
        }
    }

    // Run core setup immediately on window complete load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();