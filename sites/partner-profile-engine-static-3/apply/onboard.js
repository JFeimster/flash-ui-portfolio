(function () {
    // 1. INJECT BASE STYLES AND WEB FONTS (IF NOT ALREADY LOADED)
    const initStylesAndFonts = () => {
        if (!document.getElementById('onboard-styles')) {
            const style = document.createElement('style');
            style.id = 'onboard-styles';
            style.type = 'text/css';
            style.innerHTML = `
                .wizard-step-active {
                    border-color: #00FF66 !important;
                    background-color: #1E1E22 !important;
                    color: #00FF66 !important;
                }
                .wizard-step-completed {
                    border-color: #004BFF !important;
                    background-color: #121214 !important;
                    color: #F3F3F3 !important;
                }
                /* Custom scrollbar for preview */
                .preview-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .preview-scroll::-webkit-scrollbar-track {
                    background: #0A0A0C;
                }
                .preview-scroll::-webkit-scrollbar-thumb {
                    background: #2A2A30;
                }
                .preview-scroll::-webkit-scrollbar-thumb:hover {
                    background: #00FF66;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // 2. STATE ENGINE
    const state = {
        step: 1,
        totalSteps: 5,
        name: 'Alex Rivera',
        email: 'alex@riveracapital.co',
        title: 'Managing Partner // Rivera Capital',
        bio: 'Helping high-growth digital brands and retail operators secure fast, non-dilutive inventory lines and structural working capital.',
        avatarType: 'initials', // 'initials' | 'url'
        avatarInitials: 'AR',
        avatarUrl: '',
        avatarColor: '#004BFF', // Default brand blue
        niches: ['e-commerce', 'local-business'],
        bestFit: 'Revenue-Based',
        calendar: 'https://calendly.com/riveracapital',
        slug: 'alex-rivera',
        docs: [
            '6 Months Bank Statements',
            'Corporate Tax Returns',
            'Interim P&L Statement'
        ],
        fundsRouted: '$1.2M',
        customDocInput: '',
        isCompiling: false,
        compileLog: []
    };

    // Load draft state from localStorage if exists
    const loadDraft = () => {
        const saved = localStorage.getItem('moonshine_onboard_draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(state, parsed);
                // Force step back to 1 on initial load to guide user, but keep data
                state.step = 1;
            } catch (e) {
                console.error("Failed to parse onboarding draft", e);
            }
        }
    };

    const saveDraft = () => {
        localStorage.setItem('moonshine_onboard_draft', JSON.stringify(state));
    };

    // 3. TELEMETRY TOAST NOTIFIER (Matching base component specs)
    const triggerOnboardToast = (title, message, theme = 'green') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-24 right-4 md:right-8 bg-[#0A0A0C] border-2 p-4 max-w-sm z-50 transform transition-all duration-300 pointer-events-auto`;
        
        let shadow = '4px 4px 0px #00FF66';
        let textClass = 'text-brand-green';
        let borderClass = 'border-brand-green';

        if (theme === 'orange') {
            shadow = '4px 4px 0px #FF5500';
            textClass = 'text-brand-orange';
            borderClass = 'border-brand-orange';
        } else if (theme === 'blue') {
            shadow = '4px 4px 0px #004BFF';
            textClass = 'text-brand-blue';
            borderClass = 'border-brand-blue';
        }

        toast.style.boxShadow = shadow;
        toast.classList.add(borderClass);

        toast.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-4 h-4 bg-current ${textClass} text-xs font-mono font-bold flex items-center justify-center text-black">i</div>
                <div>
                    <span class="block font-mono text-[10px] ${textClass} uppercase tracking-wider">${title}</span>
                    <span class="block text-xs text-[#F3F3F3] font-sans">${message}</span>
                </div>
            </div>
        `;

        document.body.appendChild(toast);
        
        // Quick slide-in
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // Helper to sanitize slug
    const generateSlug = (val) => {
        return val.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // 4. MAIN LAYOUT AND MOUNT ENGINE
    const renderOnboardWizard = (containerElement) => {
        if (!containerElement) return;

        // Container Layout Grid
        containerElement.innerHTML = `
            <div class="w-full max-w-7xl mx-auto px-4 py-8 relative">
                <!-- TOP CONTROL BAR -->
                <div class="w-full bg-[#121214] border-2 border-[#2A2A30] p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="flex items-center space-x-3">
                        <div class="bg-[#00FF66] p-2 text-[#0A0A0C] font-mono font-bold text-xs tracking-tighter shadow-[2px_2px_0px_#004BFF]">
                            MS//OPS
                        </div>
                        <div>
                            <span class="font-bold text-sm tracking-tight uppercase block text-[#F3F3F3]">PARTNER DESK SETUP MATRIX</span>
                            <span class="text-[9px] font-mono text-zinc-500 block -mt-1 tracking-widest uppercase">STAGING PROTOCOL // LOCALHOST</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="btn-reset-onboard" class="px-3 py-1.5 border border-brand-orange text-brand-orange hover:bg-brand-orange/10 font-mono text-[10px] uppercase">
                            [RESET_DRAFT]
                        </button>
                        <span class="text-zinc-500 font-mono text-xs hidden md:inline">|</span>
                        <div class="bg-[#0A0A0C] border border-[#2A2A30] py-1 px-3 text-[10px] font-mono text-brand-green">
                            CLIENT_STORAGE: <span id="storage-status">ACTIVE</span>
                        </div>
                    </div>
                </div>

                <!-- MAIN WIZARD INTERFACE GRID -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <!-- LEFT COLUMN: INPUT FORM CONTROL (7 Cols) -->
                    <div class="lg:col-span-7 space-y-6">
                        
                        <!-- PROGRESS STEP TRACKER -->
                        <div class="bg-[#121214] border-2 border-[#2A2A30] p-4 flex justify-between items-center relative overflow-hidden">
                            <div class="absolute left-0 top-0 h-1 bg-[#00FF66] transition-all duration-300" style="width: ${(state.step / state.totalSteps) * 100}%"></div>
                            
                            <div class="flex space-x-2 md:space-x-4 items-center">
                                <div class="w-8 h-8 rounded-none border-2 border-brand-green flex items-center justify-center font-mono font-bold text-xs text-brand-green bg-brand-green/10">
                                    0${state.step}
                                </div>
                                <div class="leading-tight">
                                    <span class="text-[9px] font-mono text-zinc-500 block">DEPLOYMENT PROTOCOL</span>
                                    <span id="step-title-display" class="font-bold text-xs md:text-sm text-[#F3F3F3] uppercase tracking-wide">Step Heading</span>
                                </div>
                            </div>

                            <span class="text-[10px] font-mono text-zinc-500">
                                COMPILATION PHASE: ${state.step} / ${state.totalSteps}
                            </span>
                        </div>

                        <!-- WIZARD STEP PANEL -->
                        <div class="neo-card bg-[#121214] border-2 border-[#2A2A30] p-6 relative">
                            <div id="step-form-mount"></div>

                            <!-- BOTTOM NAVIGATION -->
                            <div class="border-t border-[#2A2A30] pt-6 mt-8 flex justify-between items-center">
                                <button id="btn-prev-step" class="neo-btn-dark px-4 py-2 font-mono text-xs uppercase ${state.step === 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}">
                                    ◀ BACK
                                </button>
                                
                                <div class="flex space-x-1.5">
                                    ${Array.from({ length: state.totalSteps }).map((_, i) => `
                                        <div class="w-2.5 h-2.5 border border-[#2A2A30] ${state.step > i + 1 ? 'bg-brand-blue' : (state.step === i + 1 ? 'bg-brand-green animate-pulse' : 'bg-[#0A0A0C]')}"></div>
                                    `).join('')}
                                </div>

                                <button id="btn-next-step" class="neo-btn-green px-5 py-2 font-mono text-xs uppercase">
                                    ${state.step === state.totalSteps ? 'COMPILE & DEPLOY ▶' : 'CONTINUE ▶'}
                                </button>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN: LIVE DESK TELEMETRY PREVIEW (5 Cols) -->
                    <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                        <div class="bg-[#121214] border-2 border-[#2A2A30] p-3 flex justify-between items-center font-mono text-[10px] text-zinc-400">
                            <span class="flex items-center space-x-1.5">
                                <span class="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping"></span>
                                <span class="text-[#F3F3F3]">LIVE PREVIEW RENDER</span>
                            </span>
                            <span>STATUS: REALTIME_SYNC</span>
                        </div>

                        <!-- MOCK PROFILE PREVIEW PANEL -->
                        <div class="bg-[#0A0A0C] border-2 border-[#2A2A30] shadow-[6px_6px_0px_#1E1E22] overflow-hidden p-5 relative">
                            <div class="absolute inset-0 radial-green-glow pointer-events-none opacity-40"></div>
                            
                            <div class="relative z-10 space-y-4">
                                <!-- Console Title bar -->
                                <div class="flex justify-between items-center border-b border-[#2A2A30] pb-3 text-[9px] font-mono text-zinc-500">
                                    <span class="text-[#00FF66]">/partners/${state.slug || 'untitled'}</span>
                                    <span>TIER: ELITE_DESK</span>
                                </div>

                                <!-- Inner Mock Header -->
                                <div class="flex items-start space-x-4">
                                    <!-- Avatar Render -->
                                    <div class="w-16 h-16 border border-[#2A2A30] p-1 flex items-center justify-center relative bg-[#121214]">
                                        ${state.avatarType === 'initials' 
                                            ? `<div class="w-full h-full flex items-center justify-center font-mono text-[#0A0A0C] font-extrabold text-lg" style="background-color: ${state.avatarColor};">
                                                 ${state.avatarInitials || 'MS'}
                                               </div>`
                                            : `<img src="${state.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'64\\' height=\\'64\\' viewBox=\\'0 0 64 64\\'><rect width=\\'64\\' height=\\'64\\' fill=\\'%231E1E22\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'monospace\\' font-size=\\'18\\' fill=\\'%23F3F3F3\\'>IMG_ERR</text></svg>'">`
                                        }
                                        <span class="absolute -bottom-1 -right-1 bg-[#00FF66] text-[#0A0A0C] text-[8px] font-mono font-bold px-1 py-0.2 border border-black">PRO</span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="font-bold text-base text-[#F3F3F3] leading-none truncate">${state.name || 'Anonymous Partner'}</h3>
                                        <p class="text-[10px] text-[#00FF66] font-mono uppercase tracking-wider mt-1 truncate">${state.title || 'Funding Partner'}</p>
                                        <p class="text-[9px] text-zinc-500 mt-1 uppercase">Serving CPAs, Agencies & Operators</p>
                                    </div>
                                </div>

                                <!-- Bio -->
                                <p class="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-3">
                                    ${state.bio || 'Provide a brief bio summary on Step 1 to declare your financing background and general target customer profiles.'}
                                </p>

                                <!-- Mini Metrics -->
                                <div class="grid grid-cols-3 gap-1.5 py-2 px-3 bg-[#121214] border border-[#2A2A30] text-center font-mono text-[9px]">
                                    <div>
                                        <span class="text-zinc-500 block uppercase text-[7px]">Best Fit</span>
                                        <span class="font-bold text-[#F3F3F3] truncate block">${state.bestFit || 'SBA / REV'}</span>
                                    </div>
                                    <div>
                                        <span class="text-zinc-500 block uppercase text-[7px]">Checklist Docs</span>
                                        <span class="font-bold text-brand-orange block">${state.docs.length} REQUIRED</span>
                                    </div>
                                    <div>
                                        <span class="text-zinc-500 block uppercase text-[7px]">Routed (Mock)</span>
                                        <span class="font-bold text-brand-green block">${state.fundsRouted || '$0.0M'}</span>
                                    </div>
                                </div>

                                <!-- Active Niche Declarations -->
                                <div class="space-y-1">
                                    <span class="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">DECLARED SECTOR SPECS</span>
                                    <div class="flex flex-wrap gap-1">
                                        ${state.niches.length > 0 
                                            ? state.niches.map(n => `<span class="bg-brand-blue/10 text-brand-blue text-[8px] font-mono px-1.5 py-0.5 border border-brand-blue/30 uppercase tracking-wide">${n.replace('-', ' ')}</span>`).join('')
                                            : `<span class="text-zinc-600 font-mono text-[8px]">NO ALIGNMENTS SPECIFIED</span>`
                                        }
                                    </div>
                                </div>

                                <!-- App Link Simulators -->
                                <div class="space-y-1.5">
                                    <div class="bg-[#1E1E22]/60 border border-[#2A2A30] p-2 flex justify-between items-center text-[10px]">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                                            <span class="font-bold text-zinc-300">Launch Rapid Intake Application</span>
                                        </div>
                                        <span class="font-mono text-[8px] text-zinc-500">UTM_ID: /${state.slug}</span>
                                    </div>
                                    <div class="bg-[#1E1E22]/60 border border-[#2A2A30] p-2 flex justify-between items-center text-[10px]">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
                                            <span class="font-bold text-zinc-300">Schedule Strategic Review</span>
                                        </div>
                                        <span class="font-mono text-[8px] text-zinc-500 underline truncate max-w-[120px]">${state.calendar || 'No Link'}</span>
                                    </div>
                                </div>

                                <!-- Pre-flight Underwriting Checklist -->
                                <div class="border-t border-[#2A2A30] pt-3 mt-3">
                                    <div class="flex justify-between items-center mb-1.5 text-[8px] font-mono">
                                        <span class="text-zinc-500">UNDERWRITING PRE-FLIGHT</span>
                                        <span class="text-brand-green bg-brand-green/10 px-1 border border-brand-green/20">CONFIGURED</span>
                                    </div>
                                    <div class="grid grid-cols-1 gap-1 text-[9px] font-mono text-zinc-400">
                                        ${state.docs.length > 0 
                                            ? state.docs.slice(0, 4).map(doc => `
                                                <div class="flex items-center space-x-1.5">
                                                    <span class="text-brand-green">✓</span>
                                                    <span class="truncate">${doc}</span>
                                                </div>
                                            `).join('') + (state.docs.length > 4 ? `<span class="text-[8px] text-zinc-500 font-sans italic">+ ${state.docs.length - 4} more checklists</span>` : '')
                                            : `<div class="text-zinc-600 italic">No pre-flight list items specified.</div>`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- LOCALSTORAGE STATUS -->
                        <div class="bg-[#121214] border border-[#2A2A30] p-3 text-[10px] font-mono text-zinc-500 space-y-1">
                            <div class="flex justify-between"><span>DRAFT COMPILATION:</span><span class="text-[#F3F3F3]">/sandbox/build-state.json</span></div>
                            <div class="flex justify-between"><span>LAST LOCAL AUTO-SAVE:</span><span class="text-brand-blue" id="autosave-timestamp">Just Now</span></div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        // Install Handlers
        bindFormControls(containerElement);
        renderCurrentStep();
        initAutosaveTime();
    };

    // 5. STEP CONTENT RENDERERS
    const renderCurrentStep = () => {
        const stepMount = document.getElementById('step-form-mount');
        const titleDisplay = document.getElementById('step-title-display');
        if (!stepMount || !titleDisplay) return;

        switch (state.step) {
            case 1:
                titleDisplay.innerText = "Dossier Identity Configuration";
                stepMount.innerHTML = `
                    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Declare your core identities. We use these profiles parameters dynamically to construct the static high-fidelity index files inside your Vercel pipeline asset folder.
                    </p>
                    
                    <div class="space-y-4 font-mono text-xs">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-zinc-500 uppercase mb-1">Full Partner Name</label>
                                <input type="text" id="inboard-name" value="${state.name}" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-2.5 text-[#F3F3F3] focus:outline-none focus:border-brand-green">
                            </div>
                            <div>
                                <label class="block text-zinc-500 uppercase mb-1">Corporate Email Address</label>
                                <input type="email" id="inboard-email" value="${state.email}" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-2.5 text-[#F3F3F3] focus:outline-none focus:border-brand-green">
                            </div>
                        </div>

                        <div>
                            <label class="block text-zinc-500 uppercase mb-1">Professional Title & Firm (Or Designation)</label>
                            <input type="text" id="inboard-title" value="${state.title}" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-2.5 text-[#F3F3F3] focus:outline-none focus:border-brand-green" placeholder="e.g. Managing Partner // Rivera Capital">
                        </div>

                        <div>
                            <label class="block text-zinc-500 uppercase mb-1">Professional Profile Biography</label>
                            <textarea id="inboard-bio" rows="4" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-2.5 text-[#F3F3F3] focus:outline-none focus:border-brand-green font-sans" placeholder="Describe your experience and client alignments...">${state.bio}</textarea>
                        </div>

                        <!-- Avatar Picker -->
                        <div>
                            <label class="block text-zinc-500 uppercase mb-2">Avatar Identity Graphic Mode</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0A0C] border border-[#2A2A30] p-4">
                                <div class="space-y-3">
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="avatar-mode" value="initials" ${state.avatarType === 'initials' ? 'checked' : ''} class="accent-brand-green">
                                        <span class="text-[#F3F3F3] font-bold">A // INITIALS RECTANGLE</span>
                                    </label>
                                    <div class="flex gap-2 items-center pl-6">
                                        <input type="text" id="inboard-initials" value="${state.avatarInitials}" maxlength="3" class="w-16 bg-[#121214] border border-[#2A2A30] p-1.5 text-center text-[#F3F3F3]">
                                        <div class="flex gap-1">
                                            ${['#004BFF', '#00FF66', '#FF5500', '#E5E5E5'].map(color => `
                                                <button class="w-6 h-6 border ${state.avatarColor === color ? 'border-[#F3F3F3]' : 'border-transparent'}" style="background-color: ${color};" onclick="window.onboardSetAvatarColor('${color}')"></button>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="avatar-mode" value="url" ${state.avatarType === 'url' ? 'checked' : ''} class="accent-brand-blue">
                                        <span class="text-[#F3F3F3] font-bold">B // CUSTOM PHOTO URL</span>
                                    </label>
                                    <div class="pl-6">
                                        <input type="url" id="inboard-avatar-url" value="${state.avatarUrl}" class="w-full bg-[#121214] border border-[#2A2A30] p-1.5 text-xs text-zinc-400" placeholder="https://example.com/photo.jpg">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                // Register local event listeners for Step 1
                document.getElementById('inboard-name').addEventListener('input', e => {
                    state.name = e.target.value;
                    state.slug = generateSlug(e.target.value);
                    const init = e.target.value.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    state.avatarInitials = init || 'MS';
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-email').addEventListener('input', e => {
                    state.email = e.target.value;
                    saveDraft();
                });
                document.getElementById('inboard-title').addEventListener('input', e => {
                    state.title = e.target.value;
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-bio').addEventListener('input', e => {
                    state.bio = e.target.value;
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-initials').addEventListener('input', e => {
                    state.avatarInitials = e.target.value.toUpperCase();
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-avatar-url').addEventListener('input', e => {
                    state.avatarUrl = e.target.value;
                    saveDraft();
                    updatePreview();
                });
                document.querySelectorAll('input[name="avatar-mode"]').forEach(radio => {
                    radio.addEventListener('change', e => {
                        state.avatarType = e.target.value;
                        saveDraft();
                        updatePreview();
                    });
                });
                break;

            case 2:
                titleDisplay.innerText = "Financing Sector Alignments";
                stepMount.innerHTML = `
                    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Identify your target sectors and preferred capital models. Our routing logic assigns special matching triggers to ensure borrowers qualify automatically against these parameters.
                    </p>
                    
                    <div class="space-y-6 font-mono text-xs">
                        <!-- Niche Alignments Checkboxes -->
                        <div>
                            <label class="block text-zinc-500 uppercase mb-3">Primary Client Target Sectors (Select All That Apply)</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${[
                                    { id: 'e-commerce', label: 'E-Commerce / Shopify Brands', icon: '🛒' },
                                    { id: 'real-estate', label: 'RE Developers & Flippers', icon: '🏗️' },
                                    { id: 'local-business', label: 'Main Street & Local Services', icon: '🏪' },
                                    { id: 'contractors', label: 'Commercial Builders & Trades', icon: '🔨' },
                                    { id: 'saas-tech', label: 'Software & Technology firms', icon: '💻' },
                                    { id: 'wholesale-logistics', label: 'B2B Wholesale / Supply Chains', icon: '📦' }
                                ].map(n => `
                                    <label class="flex items-center space-x-3 bg-[#0A0A0C] border ${state.niches.includes(n.id) ? 'border-brand-green' : 'border-[#2A2A30]'} p-3 cursor-pointer hover:border-brand-green transition-colors">
                                        <input type="checkbox" value="${n.id}" ${state.niches.includes(n.id) ? 'checked' : ''} class="niche-checkbox accent-brand-green">
                                        <div class="flex-1">
                                            <span class="block text-[#F3F3F3] font-bold">${n.icon} ${n.label}</span>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Best Fit Select -->
                        <div>
                            <label class="block text-zinc-500 uppercase mb-2">Primary Capital Product / Best-Fit Program Alignment</label>
                            <select id="inboard-best-fit" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-3 text-[#F3F3F3] focus:outline-none focus:border-brand-green">
                                ${['Revenue-Based', 'SBACRE Loans', 'Invoice Factoring', 'Bridge Debt Options', 'Unsecured Lines'].map(p => `
                                    <option value="${p}" ${state.bestFit === p ? 'selected' : ''}>${p}</option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Target Funds Routed Slider (Simulated Setup stats) -->
                        <div>
                            <label class="block text-zinc-500 uppercase mb-1">Mock Portfolio Setup Volume (Routed Funds Indicator)</label>
                            <div class="flex items-center space-x-4 bg-[#0A0A0C] border border-[#2A2A30] p-3">
                                <input type="range" id="inboard-funds-slider" min="0" max="20" step="1" value="${parseFloat(state.fundsRouted.replace(/[^0-9.]/g, '')) || 0}" class="flex-1 accent-brand-green">
                                <span class="text-brand-green font-bold text-sm min-w-[70px] text-right" id="funds-display">${state.fundsRouted}</span>
                            </div>
                        </div>
                    </div>
                `;
                // Register Step 2 Listeners
                document.querySelectorAll('.niche-checkbox').forEach(cb => {
                    cb.addEventListener('change', () => {
                        const active = Array.from(document.querySelectorAll('.niche-checkbox:checked')).map(el => el.value);
                        state.niches = active;
                        saveDraft();
                        updatePreview();
                        renderCurrentStep(); // Re-render step to update borders
                    });
                });
                document.getElementById('inboard-best-fit').addEventListener('change', e => {
                    state.bestFit = e.target.value;
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-funds-slider').addEventListener('input', e => {
                    const val = e.target.value;
                    state.fundsRouted = `$${val}.0M`;
                    document.getElementById('funds-display').innerText = state.fundsRouted;
                    saveDraft();
                    updatePreview();
                });
                break;

            case 3:
                titleDisplay.innerText = "Integrations & Custom Routing Paths";
                stepMount.innerHTML = `
                    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Declare your dynamic destination endpoints. When borrowers complete self-assessment structures or book consultations, their signals direct to these parameters.
                    </p>
                    
                    <div class="space-y-4 font-mono text-xs">
                        <div>
                            <label class="block text-zinc-500 uppercase mb-1">Calendar Booking Bridge URL (Calendly / SavvyCal)</label>
                            <input type="url" id="inboard-calendar" value="${state.calendar}" class="w-full bg-[#0A0A0C] border border-[#2A2A30] p-2.5 text-[#F3F3F3] focus:outline-none focus:border-brand-green" placeholder="https://calendly.com/yourname">
                        </div>

                        <div>
                            <label class="block text-zinc-500 uppercase mb-1">Target Static Route Slug (Custom Host Path)</label>
                            <div class="flex items-center bg-[#0A0A0C] border border-[#2A2A30] p-2">
                                <span class="text-zinc-600 select-none">moonshine.capital/partners/</span>
                                <input type="text" id="inboard-slug" value="${state.slug}" class="flex-1 bg-transparent border-none text-brand-green p-0 pl-1 font-bold focus:outline-none">
                            </div>
                            <span class="text-[9px] text-zinc-600 block mt-1 uppercase">ALPHANUMERIC CHARACTERS AND DASHES ONLY</span>
                        </div>

                        <div class="bg-[#1E1E22] border border-[#2A2A30] p-4 text-zinc-400">
                            <span class="text-brand-orange font-bold uppercase text-[9px] block mb-1">System Notice // Deep UTM Tracking</span>
                            <p class="text-[10px] font-sans leading-relaxed">
                                We automatically inject customized URL queries to all dynamic links inside your profile: <code>?ref=${state.slug}&utm_source=moonshine_portal</code>. This guarantees instant conversion matching inside the CRM engine.
                            </p>
                        </div>
                    </div>
                `;
                document.getElementById('inboard-calendar').addEventListener('input', e => {
                    state.calendar = e.target.value;
                    saveDraft();
                    updatePreview();
                });
                document.getElementById('inboard-slug').addEventListener('input', e => {
                    const sanitized = generateSlug(e.target.value);
                    state.slug = sanitized;
                    saveDraft();
                    updatePreview();
                });
                break;

            case 4:
                titleDisplay.innerText = "Pre-Flight Underwriting Documents";
                stepMount.innerHTML = `
                    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Customize the files borrowers must prepare to qualify for structural debt facilities. Pre-flight declarations prevent long underwriting delay cycles.
                    </p>

                    <div class="space-y-4 font-mono text-xs">
                        <div>
                            <label class="block text-zinc-500 uppercase mb-2">Required Core Items Checklist</label>
                            <div class="space-y-1.5" id="docs-list-mount">
                                <!-- Dynamic check items -->
                            </div>
                        </div>

                        <div class="pt-2">
                            <label class="block text-zinc-500 uppercase mb-1">Add Custom Document Requirement</label>
                            <div class="flex space-x-2">
                                <input type="text" id="inboard-custom-doc" value="${state.customDocInput}" class="flex-1 bg-[#0A0A0C] border border-[#2A2A30] p-2 text-[#F3F3F3] focus:outline-none focus:border-brand-green" placeholder="e.g. Current Rent Roll / Merchant History">
                                <button id="btn-add-doc" class="px-4 py-2 bg-brand-green text-[#0A0A0C] font-bold hover:bg-[#00e55c]">ADD</button>
                            </div>
                        </div>
                    </div>
                `;
                // Render documents list helper
                renderDocsList();

                document.getElementById('inboard-custom-doc').addEventListener('input', e => {
                    state.customDocInput = e.target.value;
                    saveDraft();
                });
                document.getElementById('btn-add-doc').addEventListener('click', () => {
                    const val = state.customDocInput.trim();
                    if (val && !state.docs.includes(val)) {
                        state.docs.push(val);
                        state.customDocInput = '';
                        saveDraft();
                        updatePreview();
                        renderCurrentStep(); // Re-render step to display new lists
                        triggerOnboardToast("DOCUMENT TRIGGER ADDED", `Requirement: "${val}" injected to dynamic scorecard.`, 'green');
                    }
                });
                break;

            case 5:
                titleDisplay.innerText = "Deployment Compilation Protocol";
                stepMount.innerHTML = `
                    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Verify your parameters, compile your static schema, and deploy your custom static partner landing deck. This acts as your direct staging portal.
                    </p>

                    <div class="space-y-4">
                        <div class="bg-[#0A0A0C] border border-[#2A2A30] p-4 font-mono text-[11px] space-y-1.5">
                            <div class="flex justify-between border-b border-[#2A2A30] pb-2 text-zinc-400 text-[10px]">
                                <span>CONFIG PARAMETER</span>
                                <span>COMPILED OUTPUT STATE</span>
                            </div>
                            <div class="flex justify-between"><span>NAME:</span><span class="text-[#F3F3F3]">${state.name}</span></div>
                            <div class="flex justify-between"><span>EMAIL:</span><span class="text-[#F3F3F3]">${state.email}</span></div>
                            <div class="flex justify-between"><span>DESK SLUG:</span><span class="text-brand-green">/partners/${state.slug}</span></div>
                            <div class="flex justify-between"><span>BEST FIT:</span><span class="text-brand-blue">${state.bestFit}</span></div>
                            <div class="flex justify-between"><span>CHECKLIST COUNT:</span><span class="text-brand-orange">${state.docs.length} Items</span></div>
                        </div>

                        <!-- LIVE COMPILATION SIMULATOR TERMINAL -->
                        <div id="compilation-terminal" class="bg-[#0A0A0C] border-2 border-brand-blue/30 p-4 font-mono text-[10px] text-zinc-400 min-h-[140px] space-y-1 overflow-y-auto max-h-48">
                            <span class="text-[#00FF66] block">// PIPELINE READY FOR COMPILER BIND</span>
                            <span class="text-zinc-600 block">Click "COMPILE & DEPLOY" below to execute local schema testing...</span>
                        </div>
                    </div>
                `;
                break;
        }
    };

    // Sub-renderer for pre-flight document toggling
    const renderDocsList = () => {
        const mount = document.getElementById('docs-list-mount');
        if (!mount) return;

        mount.innerHTML = state.docs.map((doc, i) => `
            <div class="flex justify-between items-center bg-[#0A0A0C] border border-[#2A2A30] p-2 text-xs">
                <span class="text-zinc-300 font-bold">✓ ${doc}</span>
                <button onclick="window.onboardRemoveDoc(${i})" class="text-brand-orange hover:text-red-500 px-1 text-[10px]">[REMOVE]</button>
            </div>
        `).join('');
    };

    // Global hook for removing documents
    window.onboardRemoveDoc = (index) => {
        const removed = state.docs.splice(index, 1);
        saveDraft();
        updatePreview();
        renderCurrentStep();
        triggerOnboardToast("DOCUMENT REMOVED", `Requirement: "${removed[0]}" extracted.`, 'orange');
    };

    // Global hook for setting color picker selection
    window.onboardSetAvatarColor = (color) => {
        state.avatarColor = color;
        saveDraft();
        updatePreview();
        renderCurrentStep();
    };

    // 6. UPDATE LIVE PREVIEW ONLY (Faster than full render cycle)
    const updatePreview = () => {
        // Redraw preview elements on change
        const renderMount = document.querySelector('.radial-green-glow').parentElement;
        if (!renderMount) return;

        // Custom initials colored layout template
        const avatarLayout = state.avatarType === 'initials' 
            ? `<div class="w-full h-full flex items-center justify-center font-mono text-[#0A0A0C] font-extrabold text-lg" style="background-color: ${state.avatarColor};">
                 ${state.avatarInitials || 'MS'}
               </div>`
            : `<img src="${state.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'64\\' height=\\'64\\' viewBox=\\'0 0 64 64\\'><rect width=\\'64\\' height=\\'64\\' fill=\\'%231E1E22\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'monospace\\' font-size=\\'18\\' fill=\\'%23F3F3F3\\'>IMG_ERR</text></svg>'">`;

        // Deep HTML injections for real-time fidelity
        const avatarTarget = renderMount.querySelector('.w-16.h-16');
        if (avatarTarget) avatarTarget.innerHTML = `${avatarLayout} <span class="absolute -bottom-1 -right-1 bg-[#00FF66] text-[#0A0A0C] text-[8px] font-mono font-bold px-1 py-0.2 border border-black">PRO</span>`;

        const nameTarget = renderMount.querySelector('h3.font-bold');
        if (nameTarget) nameTarget.innerText = state.name || 'Anonymous Partner';

        const titleTarget = renderMount.querySelector('.text-\\[10px\\]\\.text-brand-green');
        if (titleTarget) titleTarget.innerText = state.title || 'Funding Partner';

        const bioTarget = renderMount.querySelector('p.text-\\[11px\\]');
        if (bioTarget) bioTarget.innerText = state.bio || 'Provide a brief bio summary on Step 1 to declare your financing background and general target customer profiles.';

        const bestFitTarget = renderMount.querySelector('.grid.grid-cols-3 > div:nth-child(1) > span:nth-child(2)');
        if (bestFitTarget) bestFitTarget.innerText = state.bestFit || 'SBA / REV';

        const docCountTarget = renderMount.querySelector('.grid.grid-cols-3 > div:nth-child(2) > span:nth-child(2)');
        if (docCountTarget) docCountTarget.innerText = `${state.docs.length} REQUIRED`;

        const fundsTarget = renderMount.querySelector('.grid.grid-cols-3 > div:nth-child(3) > span:nth-child(2)');
        if (fundsTarget) fundsTarget.innerText = state.fundsRouted || '$0.0M';

        const nicheContainer = renderMount.querySelector('.flex.flex-wrap');
        if (nicheContainer) {
            nicheContainer.innerHTML = state.niches.length > 0 
                ? state.niches.map(n => `<span class="bg-brand-blue/10 text-brand-blue text-[8px] font-mono px-1.5 py-0.5 border border-brand-blue/30 uppercase tracking-wide">${n.replace('-', ' ')}</span>`).join('')
                : `<span class="text-zinc-600 font-mono text-[8px]">NO ALIGNMENTS SPECIFIED</span>`;
        }

        const calLinkTarget = renderMount.querySelector('.space-y-1\\.5 > div:nth-child(2) span.underline');
        if (calLinkTarget) calLinkTarget.innerText = state.calendar || 'No Link';

        const slugTarget = renderMount.querySelector('.border-b.border-\\[\\#2A2A30\\] span.text-\\[\\#00FF66\\]');
        if (slugTarget) slugTarget.innerText = `/partners/${state.slug || 'untitled'}`;

        const listTarget = renderMount.querySelector('.grid.grid-cols-1.gap-1');
        if (listTarget) {
            listTarget.innerHTML = state.docs.length > 0 
                ? state.docs.slice(0, 4).map(doc => `
                    <div class="flex items-center space-x-1.5">
                        <span class="text-brand-green">✓</span>
                        <span class="truncate">${doc}</span>
                    </div>
                `).join('') + (state.docs.length > 4 ? `<span class="text-[8px] text-zinc-500 font-sans italic">+ ${state.docs.length - 4} more checklists</span>` : '')
                : `<div class="text-zinc-600 italic">No pre-flight list items specified.</div>`;
        }
    };

    // 7. MULTI-STEP NAVIGATION ACTIONS
    const bindFormControls = (containerElement) => {
        containerElement.addEventListener('click', (e) => {
            const prevBtn = e.target.closest('#btn-prev-step');
            const nextBtn = e.target.closest('#btn-next-step');
            const resetBtn = e.target.closest('#btn-reset-onboard');

            if (resetBtn) {
                if (confirm("Reset setup matrix? This clears your local draft data cache.")) {
                    localStorage.removeItem('moonshine_onboard_draft');
                    Object.assign(state, {
                        step: 1,
                        name: 'Alex Rivera',
                        email: 'alex@riveracapital.co',
                        title: 'Managing Partner // Rivera Capital',
                        bio: 'Helping high-growth digital brands and retail operators secure fast, non-dilutive inventory lines and structural working capital.',
                        avatarType: 'initials',
                        avatarInitials: 'AR',
                        avatarUrl: '',
                        avatarColor: '#004BFF',
                        niches: ['e-commerce', 'local-business'],
                        bestFit: 'Revenue-Based',
                        calendar: 'https://calendly.com/riveracapital',
                        slug: 'alex-rivera',
                        docs: [
                            '6 Months Bank Statements',
                            'Corporate Tax Returns',
                            'Interim P&L Statement'
                        ],
                        fundsRouted: '$1.2M',
                        customDocInput: '',
                        isCompiling: false,
                        compileLog: []
                    });
                    renderOnboardWizard(containerElement);
                    triggerOnboardToast("DRAFT ERASED", "Partner parameter matrices restored to template system default.", 'orange');
                }
            }

            if (prevBtn) {
                if (state.step > 1) {
                    state.step--;
                    renderOnboardWizard(containerElement);
                    triggerOnboardToast("STEP MOVED BACK", `Retreating setup to step ${state.step}.`, 'blue');
                }
            }

            if (nextBtn) {
                if (state.step < state.totalSteps) {
                    // Quick validations before moving
                    if (state.step === 1 && !state.name.trim()) {
                        triggerOnboardToast("VALIDATION ERROR", "You must declare a full partner name to allocate static file routing.", 'orange');
                        return;
                    }
                    if (state.step === 3 && !state.calendar.trim()) {
                        triggerOnboardToast("VALIDATION ERROR", "Booking bridge endpoint URL cannot exist empty.", 'orange');
                        return;
                    }

                    state.step++;
                    renderOnboardWizard(containerElement);
                    triggerOnboardToast("PROGRESS RE-ROUTED", `Step configuration step ${state.step} validated.`, 'green');
                } else if (state.step === state.totalSteps) {
                    // Trigger Live Dynamic Compile Process!
                    executeOnboardCompilation();
                }
            }
        });
    };

    // 8. COMPILE AND PACKAGING PIPELINE (Interactive simulation + static generation)
    const executeOnboardCompilation = () => {
        const terminal = document.getElementById('compilation-terminal');
        const nextBtn = document.getElementById('btn-next-step');
        if (!terminal || state.isCompiling) return;

        state.isCompiling = true;
        nextBtn.classList.add('opacity-50', 'pointer-events-none');
        nextBtn.innerText = "COMPILING...";

        terminal.innerHTML = "";
        const logs = [
            `[INITIALIZING] Spawning dynamic pipeline process for: /partners/${state.slug}`,
            `[INFO] Parsing partner configurations assets...`,
            `[INFO] Injected routing key: ?ref=${state.slug}&source=moonshine`,
            `[INFO] Synchronizing dynamic static checklists [Count: ${state.docs.length}]`,
            `[SECURITY] Secure SSL parameters assigned securely. Bypass cold broker index hooks.`,
            `[COMPILE] Rendering HTML file assets inside /partners/${state.slug}/index.html...`,
            `[JSON] Packaging partner asset file configuration schema...`,
            `[SUCCESS] Static HTML build ready. Edge cached, static index.html warmed.`
        ];

        let logIndex = 0;
        const printLog = () => {
            if (logIndex < logs.length) {
                const color = logs[logIndex].includes('SUCCESS') ? 'text-brand-green font-bold' : (logs[logIndex].includes('ERROR') ? 'text-brand-orange' : 'text-zinc-400');
                terminal.innerHTML += `<span class="${color} block">${logs[logIndex]}</span>`;
                terminal.scrollTop = terminal.scrollHeight;
                logIndex++;
                setTimeout(printLog, 600);
            } else {
                state.isCompiling = false;
                nextBtn.classList.remove('opacity-50', 'pointer-events-none');
                nextBtn.innerText = "COMPILE & DEPLOY ▶";

                // Generate raw JSON payload schema
                const configPayload = {
                    metadata: {
                        engine: "Moonshine Partner Profile Engine",
                        version: "v1.0.8_RELEASE",
                        timestamp: new Date().toISOString()
                    },
                    partner: {
                        name: state.name,
                        email: state.email,
                        title: state.title,
                        bio: state.bio,
                        slug: state.slug,
                        avatar: {
                            type: state.avatarType,
                            initials: state.avatarInitials,
                            url: state.avatarUrl,
                            color: state.avatarColor
                        },
                        targeting: {
                            niches: state.niches,
                            bestFit: state.bestFit,
                            fundsRouted: state.fundsRouted
                        },
                        routing: {
                            calendar: state.calendar,
                            deepLink: `https://moonshine.capital/intake?ref=${state.slug}&utm_source=moonshine_portal`
                        },
                        checklist: state.docs
                    }
                };

                // Render compiled result presentation cards
                terminal.parentElement.innerHTML = `
                    <div class="space-y-4">
                        <div class="bg-brand-green/10 border-2 border-[#00FF66] p-4 text-xs space-y-2">
                            <span class="font-mono text-brand-green font-bold block">// COMPILATION COMPLETION SUCCESSFUL</span>
                            <p class="text-zinc-300 font-sans leading-relaxed">
                                Your landing desk portfolio route <code>/partners/${state.slug}</code> is built inside local memory! Use the JSON schema package below to inject your static profile setup directly to your system repository.
                            </p>
                        </div>

                        <div>
                            <span class="block text-zinc-500 uppercase font-mono text-[9px] mb-1">COMPILED SCHEMA CONFIG (JSON)</span>
                            <textarea readonly id="compiled-json" class="w-full h-32 bg-[#0A0A0C] border border-[#2A2A30] p-2 font-mono text-[9px] text-[#00FF66] focus:outline-none select-all">${JSON.stringify(configPayload, null, 2)}</textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button onclick="window.onboardCopyJson()" class="w-full py-3 bg-brand-blue text-[#F3F3F3] border border-black font-mono font-bold text-xs uppercase hover:bg-blue-600 transition-colors">
                                Copy Config JSON
                            </button>
                            <button onclick="window.onboardDeployTally()" class="w-full py-3 bg-brand-green text-[#0A0A0C] border border-black font-mono font-bold text-xs uppercase hover:bg-[#00e55c] transition-colors">
                                Submit to Registrar
                            </button>
                        </div>
                    </div>
                `;

                triggerOnboardToast("PORTAL COMPILED", "Static desk route created successfully.", 'green');
            }
        };

        printLog();
    };

    // Global copy schema hook
    window.onboardCopyJson = () => {
        const txt = document.getElementById('compiled-json');
        if (txt) {
            navigator.clipboard.writeText(txt.value).then(() => {
                triggerOnboardToast("SCHEMA COPIED", "Config JSON package copied to clipboard. Ready to submit!", 'green');
            }).catch(err => {
                triggerOnboardToast("COPY FAILURE", "Unable to write clipboard cache.", 'orange');
            });
        }
    };

    // Global submission dispatcher
    window.onboardDeployTally = () => {
        triggerOnboardToast("SUBMITTING PROFILE", "Connecting to Moonshine static indexer server API...", 'blue');
        setTimeout(() => {
            triggerOnboardToast("REGISTRY SUCCESS", "Profile configuration asset parsed. Warm queues scheduled.", 'green');
        }, 1500);
    };

    // Auto-save time helper
    const initAutosaveTime = () => {
        setInterval(() => {
            const stamp = document.getElementById('autosave-timestamp');
            if (stamp) {
                const now = new Date();
                stamp.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            }
        }, 5000);
    };

    // 9. INSTANT STANDALONE PORTAL INITIALIZATION
    const initOnboardEngine = () => {
        initStylesAndFonts();
        loadDraft();

        // Seek mountpoint
        let mountNode = document.getElementById('onboard-portal') || document.getElementById('onboard-wizard');
        if (!mountNode) {
            // Standalone Fallback: Create dynamic container block if script loaded without explicit elements
            mountNode = document.createElement('section');
            mountNode.id = 'onboard-portal';
            mountNode.className = 'py-12 bg-[#0A0A0C] min-h-screen text-[#F3F3F3]';
            document.body.appendChild(mountNode);
        }

        renderOnboardWizard(mountNode);
    };

    // Safe execution setup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnboardEngine);
    } else {
        initOnboardEngine();
    }
})();