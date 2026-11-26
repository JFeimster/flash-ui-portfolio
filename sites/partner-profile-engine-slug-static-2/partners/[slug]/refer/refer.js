document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. CONFIGURATION & STATE MANAGEMENT
    // -----------------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    
    // Dynamic Fallbacks with base component placeholder detection
    const config = {
        partnerName: window.PARTNER_NAME && window.PARTNER_NAME !== "[PARTNER_NAME]" ? window.PARTNER_NAME : "Alexander Sterling",
        partnerCompany: window.PARTNER_COMPANY && window.PARTNER_COMPANY !== "[PARTNER_COMPANY]" ? window.PARTNER_COMPANY : "Sterling Consulting Group",
        partnerEmail: window.PARTNER_EMAIL && window.PARTNER_EMAIL !== "[PARTNER_EMAIL]" ? window.PARTNER_EMAIL : "alex@sterlingconsulting.io",
        partnerSlug: window.location.pathname.split('/').filter(Boolean)[1] || "sterling-group",
        baseAssetPath: "https://cdn.tailwindcss.com"
    };

    const state = {
        referredClients: 3,
        avgFundingAmount: 150000,
        currentStep: 1,
        formData: {
            fullName: "",
            companyName: "",
            industry: "",
            email: "",
            phone: "",
            volume: "1-3",
            payoutMethod: "ACH",
            agreeToTerms: false
        }
    };

    // -----------------------------------------------------------------
    // 2. INJECT NEOBRUTALIST CSS ANIMATIONS & STYLES
    // -----------------------------------------------------------------
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .scanline-effect::after {
            content: " ";
            display: block;
            position: absolute;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
        }
        .neo-shadow-cobalt-lg {
            box-shadow: 8px 8px 0px 0px #2979FF;
        }
        .neo-shadow-green-sm {
            box-shadow: 3px 3px 0px 0px #00E676;
        }
        .neo-shadow-black-lg {
            box-shadow: 8px 8px 0px 0px #1E1E1E;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #2979FF !important;
            box-shadow: 4px 4px 0px 0px #2979FF !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // -----------------------------------------------------------------
    // 3. MAIN RENDER PIPELINE
    // -----------------------------------------------------------------
    const mountNode = document.getElementById("refer-portal-root") || document.body;
    
    // Clear dynamic body elements if targeting root recovery
    if (mountNode === document.body) {
        document.body.className = "bg-matteblack text-bonewhite font-sans antialiased selection:bg-cobaltblue selection:text-white pb-16";
        document.body.innerHTML = '<div id="app-container"></div>';
    }

    const appContainer = document.getElementById("app-container") || mountNode;

    const renderLayout = () => {
        appContainer.innerHTML = `
            <!-- SYSTEM STATUS TOP BAR -->
            <div class="border-b border-graphitegray bg-matteblack text-xs font-mono py-2 px-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
                <div class="max-w-7xl mx-auto flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="inline-block w-2 h-2 bg-cobaltblue rounded-full animate-pulse"></span>
                        <span class="text-zinc-400 uppercase tracking-widest text-[10px] sm:text-xs">
                            B2B PORTAL LAYER // INBOUND SPONSOR: <span class="text-white font-bold">${config.partnerCompany.toUpperCase()}</span>
                        </span>
                    </div>
                    <span class="text-zinc-500 font-mono text-[10px] sm:text-xs hidden md:inline">NODE_REF: MC-DIR-${config.partnerSlug.toUpperCase()}</span>
                </div>
            </div>

            <!-- MAIN HEADER -->
            <header class="bg-matteblack border-b border-graphitegray py-5 px-4 sm:px-6">
                <div class="max-w-7xl mx-auto flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="bg-bonewhite text-matteblack px-3 py-1 font-display font-black tracking-tighter uppercase border border-white neo-shadow-green-sm text-sm">
                            MOONSHINE <span class="text-cobaltblue">★</span> NET
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-zinc-500 font-mono uppercase leading-none">AFFILIATE ATTACHED</p>
                        <p class="text-xs font-bold text-zinc-300 font-mono mt-1">${config.partnerName}</p>
                    </div>
                </div>
            </header>

            <!-- HERO SECTION -->
            <section class="relative pt-12 pb-16 bg-gradient-to-b from-[#0e0e10] to-matteblack border-b border-graphitegray overflow-hidden">
                <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <!-- Hero Left Info -->
                        <div class="lg:col-span-7">
                            <span class="inline-flex items-center gap-2 bg-blue-950/50 border border-blue-900 text-cobaltblue text-xs font-mono px-3 py-1 uppercase rounded-full tracking-wider mb-6">
                                ✦ HIGH-YIELD CAPITAL ALLIANCE
                            </span>
                            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6">
                                Monetize Your B2B <br class="hidden sm:inline">
                                <span class="text-transparent bg-clip-text bg-gradient-to-r from-cobaltblue to-electricgreen">Client Networks</span>
                            </h1>
                            <p class="text-zinc-300 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-8">
                                Provide CPAs, financial advisors, fractional CFOs, and business coaches a secure terminal to submit capital candidates. Earn immediate institutional revenue sharing when they clear funding.
                            </p>
                            
                            <!-- Co-branded trust badge -->
                            <div class="inline-flex flex-wrap items-center gap-4 p-4 bg-graphitegray border border-zinc-800 rounded-sm neo-shadow-black">
                                <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-electricgreen text-xs border border-zinc-700">
                                    MC
                                </div>
                                <div class="text-left font-mono">
                                    <p class="text-xs text-zinc-400">Directly co-sponsored under security routing rules of:</p>
                                    <p class="text-sm text-white font-bold tracking-tight">${config.partnerName} (${config.partnerCompany})</p>
                                </div>
                            </div>
                        </div>

                        <!-- Hero Right: Dynamic Calculator Display -->
                        <div class="lg:col-span-5 bg-graphitegray border-2 border-zinc-700 p-6 relative neo-shadow-cobalt-lg">
                            <div class="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
                                <span class="font-mono text-xs text-cobaltblue font-extrabold uppercase">CO-REVENUE SIMULATOR</span>
                                <span class="font-mono text-[10px] text-zinc-500">REALTIME EST. v2.4</span>
                            </div>

                            <!-- Calculator Input 1 -->
                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between font-mono text-xs">
                                    <span class="text-zinc-400">EST. FUNDED DEALS (MONTHLY)</span>
                                    <span class="text-white font-bold" id="deals-count-label">3 DEALS</span>
                                </div>
                                <input type="range" id="deals-slider" min="1" max="15" value="3" 
                                    class="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cobaltblue">
                            </div>

                            <!-- Calculator Input 2 -->
                            <div class="space-y-3 mb-8">
                                <div class="flex justify-between font-mono text-xs">
                                    <span class="text-zinc-400">AVERAGE CONTRACT SIZE</span>
                                    <span class="text-white font-bold" id="size-amount-label">$150,000</span>
                                </div>
                                <input type="range" id="size-slider" min="50000" max="500000" step="25000" value="150000" 
                                    class="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-electricgreen">
                            </div>

                            <!-- Output display block -->
                            <div class="p-4 bg-matteblack border border-zinc-800 rounded text-center mb-4">
                                <p class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">YOUR POTENTIAL ANNUALLY RECURRING FEE SHARING</p>
                                <p class="text-3xl sm:text-4xl font-display font-black text-electricgreen tracking-tight" id="calc-payout-annual">
                                    $108,000 /yr
                                </p>
                                <p class="font-mono text-[11px] text-zinc-400 mt-2">
                                    Based on standard premium commissions averaging <span class="text-cobaltblue">2.0%</span>
                                </p>
                            </div>
                            <p class="text-[9px] font-mono text-zinc-600 text-center leading-normal">
                                *Calculator uses direct commission parameters. Actual pricing options set per deal files in underwriting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- WORKFLOW PROTOCOLS -->
            <section class="py-16 bg-matteblack border-b border-graphitegray">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center max-w-2xl mx-auto mb-12">
                        <span class="font-mono text-xs text-cobaltblue uppercase tracking-widest px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">WORKFLOW PROTOCOLS</span>
                        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-white mt-4">Structured Referral Logistics</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Step 1 -->
                        <div class="p-6 bg-graphitegray border border-zinc-800 hover:border-zinc-700 transition-colors relative neo-shadow-black">
                            <span class="font-mono text-3xl font-black text-zinc-700 absolute top-4 right-6">01</span>
                            <h3 class="font-display font-bold text-lg text-white mb-2">Register Core Profile</h3>
                            <p class="text-zinc-400 text-sm leading-relaxed">
                                Provide institutional details and payment routing credentials. We build your personalized, tracking URL terminal directly.
                            </p>
                        </div>
                        <!-- Step 2 -->
                        <div class="p-6 bg-graphitegray border border-zinc-800 hover:border-zinc-700 transition-colors relative neo-shadow-black">
                            <span class="font-mono text-3xl font-black text-zinc-700 absolute top-4 right-6">02</span>
                            <h3 class="font-display font-bold text-lg text-white mb-2">Route Candidates</h3>
                            <p class="text-zinc-400 text-sm leading-relaxed">
                                Send direct business applicants via your portal, or execute a warm custom introduction directly to the Moonshine desk.
                            </p>
                        </div>
                        <!-- Step 3 -->
                        <div class="p-6 bg-graphitegray border border-zinc-800 hover:border-zinc-700 transition-colors relative neo-shadow-black">
                            <span class="font-mono text-3xl font-black text-zinc-700 absolute top-4 right-6">03</span>
                            <h3 class="font-display font-bold text-lg text-white mb-2">Automated Settlement</h3>
                            <p class="text-zinc-400 text-sm leading-relaxed">
                                Monitor tracking states. Capital distributions clear within hours, and your referral commission settles instantly on deposit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FORM & REGISTRATION PORTAL -->
            <section class="py-16 bg-zinc-950" id="onboarding-form">
                <div class="max-w-3xl mx-auto px-4 sm:px-6">
                    <div class="bg-matteblack border border-zinc-800 p-8 neo-shadow-black-lg relative">
                        <!-- Scanline visual accent -->
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cobaltblue to-electricgreen"></div>
                        
                        <!-- Header inside box -->
                        <div class="mb-8 text-center sm:text-left">
                            <p class="font-mono text-xs text-cobaltblue uppercase tracking-widest">SECURE APPLICATION TRANSMISSION</p>
                            <h2 class="font-display text-2xl font-black text-white mt-1">Join the Referral Program</h2>
                            <p class="text-zinc-400 text-xs font-mono mt-1">Co-sponsored channel matching terminal: ${config.partnerSlug.toUpperCase()}</p>
                        </div>

                        <!-- STEPS TRACKER -->
                        <div class="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-4 text-xs font-mono">
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold ${state.currentStep >= 1 ? 'bg-cobaltblue text-white' : 'bg-zinc-800 text-zinc-500'}">1</span>
                                <span class="${state.currentStep === 1 ? 'text-white font-bold' : 'text-zinc-500'}">PROFESSIONAL DOSSIER</span>
                            </div>
                            <div class="w-8 h-px bg-zinc-800"></div>
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold ${state.currentStep === 2 ? 'bg-cobaltblue text-white' : 'bg-zinc-800 text-zinc-500'}">2</span>
                                <span class="${state.currentStep === 2 ? 'text-white font-bold' : 'text-zinc-500'}">REVENUE PREFS</span>
                            </div>
                        </div>

                        <!-- STEP 1 CONTAINER -->
                        <form id="refer-form" class="space-y-6">
                            <div id="step-1-content" class="${state.currentStep !== 1 ? 'hidden' : 'space-y-6'}">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">FULL NAME</label>
                                        <input type="text" id="field-fullName" required value="${state.formData.fullName}"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all" placeholder="Enter Full Name">
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">FIRM / COMPANY NAME</label>
                                        <input type="text" id="field-companyName" required value="${state.formData.companyName}"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all" placeholder="e.g. Apex Wealth Management">
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="font-mono text-xs text-zinc-400 uppercase">PROFESSIONAL CATEGORY</label>
                                    <select id="field-industry" required
                                        class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all">
                                        <option value="" disabled selected>Select Primary Practice Type</option>
                                        <option value="CPA / Accounting">CPA / Certified Public Accountant</option>
                                        <option value="Bookkeeping">Bookkeeper / Accounting Services</option>
                                        <option value="Consultant / Advisory">Fractional CFO / Business Consultant</option>
                                        <option value="Banking / Lender">Traditional Commercial Banker</option>
                                        <option value="Attorney">M&A / Corporate Practice Attorney</option>
                                        <option value="Other">Standard Business Referral Partner</option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">EMAIL ADDRESS</label>
                                        <input type="email" id="field-email" required value="${state.formData.email}"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all" placeholder="name@yourfirm.com">
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">SECURE PHONE</label>
                                        <input type="tel" id="field-phone" required value="${state.formData.phone}"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all" placeholder="(555) 000-0000">
                                    </div>
                                </div>

                                <div class="pt-4 border-t border-zinc-900 flex justify-end">
                                    <button type="button" id="btn-next" class="bg-cobaltblue text-white font-display font-extrabold px-6 py-3 tracking-tight border-2 border-transparent hover:bg-black hover:text-cobaltblue hover:border-cobaltblue transition-all duration-200 neo-shadow-white flex items-center gap-2">
                                        NEXT CONFIGURATION STEP 
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                                    </button>
                                </div>
                            </div>

                            <!-- STEP 2 CONTAINER -->
                            <div id="step-2-content" class="${state.currentStep !== 2 ? 'hidden' : 'space-y-6'}">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">ESTIMATED REFERRALS (MONTHLY)</label>
                                        <select id="field-volume"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all">
                                            <option value="1-3">1 to 3 Deals</option>
                                            <option value="4-7">4 to 7 Deals</option>
                                            <option value="8+">8+ Deals per month</option>
                                        </select>
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="font-mono text-xs text-zinc-400 uppercase">PREFERRED SETTLEMENT ROUTING</label>
                                        <select id="field-payoutMethod"
                                            class="w-full bg-graphitegray border border-zinc-800 p-3 text-sm text-white font-mono focus:border-cobaltblue transition-all">
                                            <option value="ACH">ACH Direct Bank Transfer</option>
                                            <option value="Wire">Same-day Corporate Wire</option>
                                            <option value="Check">Physical Company Check</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="p-4 bg-zinc-900 border border-zinc-800 rounded">
                                    <label class="flex items-start gap-3 cursor-pointer select-none">
                                        <input type="checkbox" id="field-agree" required
                                            class="form-checkbox w-4 h-4 text-cobaltblue bg-matteblack border-zinc-700 focus:ring-0 rounded mt-1">
                                        <span class="font-mono text-[11px] text-zinc-400 leading-normal">
                                            I agree to the Moonshine Net Partner Code of Ethics. I certify that representing referral operations coordinates legally with my local licensing framework, regulations, and firm guidelines.
                                        </span>
                                    </label>
                                </div>

                                <div class="pt-4 border-t border-zinc-900 flex justify-between gap-4">
                                    <button type="button" id="btn-back" class="bg-transparent border border-zinc-700 text-zinc-400 font-mono text-xs px-5 py-3 hover:border-zinc-500 hover:text-white transition-colors">
                                        BACK
                                    </button>
                                    <button type="submit" class="bg-electricgreen text-matteblack font-display font-extrabold px-8 py-3 tracking-tight border-2 border-transparent hover:bg-black hover:text-electricgreen hover:border-electricgreen transition-all duration-200 neo-shadow-white flex items-center gap-2">
                                        TRANSMIT REGISTRATION
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `;

        setupEventListeners();
    };

    // -----------------------------------------------------------------
    // 4. CALCULATOR MATH ENGINE
    // -----------------------------------------------------------------
    const updateCalculator = () => {
        const annualPayoutEl = document.getElementById("calc-payout-annual");
        const dealsCountEl = document.getElementById("deals-count-label");
        const sizeAmountEl = document.getElementById("size-amount-label");

        if (!annualPayoutEl || !dealsCountEl || !sizeAmountEl) return;

        dealsCountEl.textContent = `${state.referredClients} ${state.referredClients === 1 ? 'DEAL' : 'DEALS'}`;
        sizeAmountEl.textContent = `$${state.avgFundingAmount.toLocaleString()}`;

        // Referral math calculation logic:
        // annualPayout = (monthlyDeals * 12) * averageSize * standardPercentage (2.0%)
        const percentage = 0.02; 
        const annualVolume = state.referredClients * 12 * state.avgFundingAmount;
        const potentialPayout = annualVolume * percentage;

        annualPayoutEl.textContent = `$${potentialPayout.toLocaleString()} /yr`;
    };

    // -----------------------------------------------------------------
    // 5. INTERACTION & EVENT BINDING
    // -----------------------------------------------------------------
    const setupEventListeners = () => {
        const dealsSlider = document.getElementById("deals-slider");
        const sizeSlider = document.getElementById("size-slider");

        if (dealsSlider && sizeSlider) {
            dealsSlider.addEventListener("input", (e) => {
                state.referredClients = parseInt(e.target.value);
                updateCalculator();
            });

            sizeSlider.addEventListener("input", (e) => {
                state.avgFundingAmount = parseInt(e.target.value);
                updateCalculator();
            });
        }

        const btnNext = document.getElementById("btn-next");
        const btnBack = document.getElementById("btn-back");
        const referForm = document.getElementById("refer-form");

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                // Collect basic validations manually to slide smoothly
                const nameInp = document.getElementById("field-fullName");
                const compInp = document.getElementById("field-companyName");
                const indInp = document.getElementById("field-industry");
                const mailInp = document.getElementById("field-email");
                const phoneInp = document.getElementById("field-phone");

                if (!nameInp.value || !compInp.value || !indInp.value || !mailInp.value || !phoneInp.value) {
                    alert("Please satisfy all mandatory dossier details before proceeding.");
                    return;
                }

                state.formData.fullName = nameInp.value;
                state.formData.companyName = compInp.value;
                state.formData.industry = indInp.value;
                state.formData.email = mailInp.value;
                state.formData.phone = phoneInp.value;

                state.currentStep = 2;
                renderLayout();
                updateCalculator();
            });
        }

        if (btnBack) {
            btnBack.addEventListener("click", () => {
                state.currentStep = 1;
                renderLayout();
                updateCalculator();
            });
        }

        if (referForm) {
            referForm.addEventListener("submit", (e) => {
                e.preventDefault();
                
                // Grab second step inputs
                const volumeInp = document.getElementById("field-volume");
                const payInp = document.getElementById("field-payoutMethod");
                const agreeInp = document.getElementById("field-agree");

                if (!agreeInp.checked) {
                    alert("You must check regulatory agreement confirmation.");
                    return;
                }

                state.formData.volume = volumeInp.value;
                state.formData.payoutMethod = payInp.value;
                state.formData.agreeToTerms = true;

                // Fire Simulated Secure Endpoint Handshake
                renderSuccessBadge();
            });
        }
    };

    // -----------------------------------------------------------------
    // 6. SUCCESS GENERATOR & DIGITAL CREDENTIAL CARD
    // -----------------------------------------------------------------
    const renderSuccessBadge = () => {
        const onboardingSection = document.getElementById("onboarding-form");
        if (!onboardingSection) return;

        // Generate dynamic mock certification credential payload
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const randomCredentialId = "MC-RP-" + Math.floor(100000 + Math.random() * 900000);

        onboardingSection.innerHTML = `
            <div class="max-w-2xl mx-auto px-4">
                <div class="bg-matteblack border-4 border-emerald-500 p-8 text-center relative neo-shadow-green scanline-effect overflow-hidden">
                    <div class="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
                    
                    <div class="mb-6">
                        <div class="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto text-3xl font-bold animate-bounce">
                            ✓
                        </div>
                    </div>

                    <p class="font-mono text-xs text-electricgreen tracking-widest uppercase">CONNECTION PROTOCOL ESTABLISHED</p>
                    <h2 class="font-display text-3xl font-black text-white mt-2 mb-4">Registration Transmitted Successfully</h2>
                    <p class="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto mb-8">
                        The onboarding file has been verified and mapped to <strong class="text-white">${config.partnerName} (${config.partnerCompany})</strong>. Your direct, secure co-branded dynamic portal terminal is building now.
                    </p>

                    <!-- Dynamic Badge Card Frame -->
                    <div class="border border-zinc-800 bg-graphitegray text-left p-6 mb-8 font-mono relative">
                        <div class="flex justify-between items-start border-b border-zinc-800 pb-3 mb-4">
                            <div>
                                <p class="text-[10px] text-zinc-500 uppercase leading-none">VERIFIED MEMBER NO</p>
                                <p class="text-xs text-electricgreen font-bold mt-1">${randomCredentialId}</p>
                            </div>
                            <span class="text-[10px] bg-emerald-950 text-electricgreen border border-emerald-800 px-2 py-0.5 uppercase tracking-wider font-bold">
                                ACTIVE CO-AFFILIATE
                            </span>
                        </div>

                        <div class="space-y-2 text-xs">
                            <p class="text-zinc-400"><span class="text-zinc-600">FIRM:</span> ${state.formData.companyName.toUpperCase()}</p>
                            <p class="text-zinc-400"><span class="text-zinc-600">PARTNER:</span> ${state.formData.fullName.toUpperCase()}</p>
                            <p class="text-zinc-400"><span class="text-zinc-600">OUTLET:</span> MOONSHINE NETWORKS DIVISION</p>
                            <p class="text-zinc-400"><span class="text-zinc-600">ROUTER:</span> SECURE PORTAL TERMINAL_ID: ${config.partnerSlug.toUpperCase()}</p>
                            <p class="text-[10px] text-zinc-600 mt-4 pt-3 border-t border-zinc-800">SECURE DISPATCH RECORDED: ${timestamp} UTC</p>
                        </div>
                    </div>

                    <!-- Post onboarding next steps -->
                    <div class="space-y-4">
                        <p class="text-xs text-zinc-400 font-mono">
                            Check <span class="text-white underline">${state.formData.email}</span> within 5 minutes. We are routing terminal setup steps, promotional assets, and direct calendar links.
                        </p>
                        <button onclick="window.location.reload()" class="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs px-5 py-3 hover:text-white hover:border-white transition-colors">
                            Return to Calculator
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // Initialize Page Component
    renderLayout();
    updateCalculator();
});