document.addEventListener('DOMContentLoaded', () => {
    // Inject custom style tags for builder-specific animations and transitions
    const style = document.createElement('style');
    style.textContent = `
        .transition-all-300 { transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1); }
        .tab-active {
            background-color: #00ff66 !important;
            color: #0d0d0d !important;
            border-color: #0d0d0d !important;
            box-shadow: none !important;
            transform: translate(2px, 2px);
        }
        .preview-pane {
            position: sticky;
            top: 100px;
        }
        .step-progress-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            position: relative;
        }
        .step-progress-fill {
            height: 100%;
            background: #00ff66;
            width: 20%;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
    `;
    document.head.appendChild(style);

    // Default Configuration State
    const state = {
        currentStep: 1,
        totalSteps: 5,
        formData: {
            name: "Alexander Mercer",
            title: "Commercial Capital Partner",
            bio: "Helping fast-growth developers and contractors secure structural capital lines and equipment leases with sub-24h turnaround.",
            market: "Contractors",
            specialty: "Lines of Credit",
            avatar: "AM",
            calendarLink: "https://calendly.com/moonshine-mercer",
            ctaPrimaryText: "Start Capital Review",
            ctaPrimaryUrl: "https://apply.moonshinecapital.com/?partner=mercer",
            targetClient: "Mid-market contractors scaling municipal bids",
            themeColor: "electricGreen", // electricGreen, signalOrange, cobaltBlue, boneWhite
            checklist: [
                { id: 1, text: "3 Months Bank Statements", checked: true },
                { id: 2, text: "Current Accounts Receivable Aging Report", checked: true },
                { id: 3, text: "Voided Corporate Check", checked: false },
                { id: 4, text: "YTD Profit & Loss Statement", checked: false }
            ]
        }
    };

    // Color definitions corresponding to Tailwind configuration
    const themeMeta = {
        electricGreen: { hex: '#00ff66', bgClass: 'bg-electricGreen', textClass: 'text-electricGreen', borderClass: 'border-electricGreen', shadow: 'shadow-neobrutalGreen', glow: 'text-glow-green' },
        signalOrange: { hex: '#ff5500', bgClass: 'bg-signalOrange', textClass: 'text-signalOrange', borderClass: 'border-signalOrange', shadow: 'shadow-neobrutalOrange', glow: 'text-glow-orange' },
        cobaltBlue: { hex: '#0066ff', bgClass: 'bg-cobaltBlue', textClass: 'text-cobaltBlue', borderClass: 'border-cobaltBlue', shadow: 'shadow-neobrutalBlue', glow: 'text-glow-blue' },
        boneWhite: { hex: '#f4f3ef', bgClass: 'bg-boneWhite', textClass: 'text-boneWhite', borderClass: 'border-boneWhite', shadow: 'shadow-neobrutalWhite', glow: '' }
    };

    // Find mount point or build inside container
    let container = document.getElementById('builder-app');
    if (!container) {
        // Fallback target: replace first section or mount to body
        container = document.createElement('div');
        container.id = 'builder-app';
        container.className = 'max-w-7xl mx-auto px-4 py-12';
        const targetSection = document.getElementById('request-form');
        if (targetSection) {
            targetSection.innerHTML = '';
            targetSection.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
    }

    // Render App Framework
    container.className = "max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start";

    // Left Column: The Form Wizard
    const formCol = document.createElement('div');
    formCol.className = "lg:col-span-7 space-y-8";
    formCol.innerHTML = `
        <div class="bg-matteBlack border-4 border-white p-6 lg:p-8 shadow-neobrutalWhite relative">
            <!-- Step Navigation Tracker -->
            <div class="flex items-center justify-between mb-6">
                <span class="font-mono text-xs uppercase tracking-widest text-chromeAccent font-extrabold">Partner Setup Engine</span>
                <span id="stepCounter" class="font-mono text-sm font-bold text-electricGreen">Step 1 of 5</span>
            </div>
            
            <h2 class="font-mono text-2xl lg:text-3xl font-extrabold text-white mb-2">Build Your Desk</h2>
            <p class="text-chromeAccent text-sm mb-6 leading-relaxed">Customize your public URL, landing actions, tracking variables, and dynamic tools. Generates immediate deployable JSON code.</p>

            <div class="step-progress-bar mb-8">
                <div id="progressBarFill" class="step-progress-fill"></div>
            </div>

            <!-- Dynamic Form Steps Container -->
            <div id="stepsContainer"></div>

            <!-- Navigation Actions -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button id="prevBtn" class="font-mono bg-transparent hover:bg-white/5 text-chromeAccent hover:text-white text-xs font-bold px-5 py-3 border-2 border-white/20 transition-all uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none">
                    ← Back
                </button>
                <button id="nextBtn" class="font-mono bg-electricGreen hover:bg-white text-black text-xs font-bold px-6 py-3 border-2 border-black shadow-[2px_2px_0px_#fff] hover:shadow-none transition-all uppercase tracking-wider">
                    Next Step →
                </button>
            </div>
        </div>
    `;

    // Right Column: Live Desk Simulator Preview
    const previewCol = document.createElement('div');
    previewCol.className = "lg:col-span-5 preview-pane space-y-6";
    previewCol.innerHTML = `
        <div class="relative">
            <span class="absolute -top-3 left-4 bg-matteBlack text-white border-2 border-white font-mono text-[10px] font-black px-3 py-1 uppercase tracking-wider z-10 shadow-[2px_2px_0px_#00ff66]">
                LIVE PREVIEW SIMULATOR
            </span>
            <div id="liveDeskPreview" class="bg-matteBlack border-4 border-white p-6 shadow-neobrutalGreen transition-all-300">
                <!-- Live view renders inside here -->
            </div>
        </div>

        <div class="bg-graphiteGray/40 border-2 border-white/10 p-5 font-mono text-xs text-chromeAccent">
            <div class="flex items-center gap-2 mb-2 text-white font-bold">
                <span class="w-2.5 h-2.5 bg-electricGreen inline-block"></span>
                <span>ASYNCHRONOUS DEPLOYMENT</span>
            </div>
            <span>Every edit modifies the output package variables instantly. Run on-demand testing loops to prove client setup speeds.</span>
        </div>
    `;

    // Mount structural layout elements
    container.appendChild(formCol);
    container.appendChild(previewCol);

    // Step Renderer Map
    const steps = {
        1: {
            title: "Identity & Core Profile",
            render: () => `
                <div class="space-y-5">
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Partner Full Name *</label>
                        <input type="text" id="fieldName" value="${state.formData.name}" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                    </div>
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Professional Title *</label>
                        <input type="text" id="fieldTitle" value="${state.formData.title}" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-mono text-xs text-white uppercase mb-2">Avatar Initials / Monogram</label>
                            <input type="text" maxlength="3" id="fieldAvatar" value="${state.formData.avatar}" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                        </div>
                        <div>
                            <label class="block font-mono text-xs text-white uppercase mb-2">Primary Market Niche</label>
                            <select id="fieldMarket" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                                <option value="Contractors" ${state.formData.market === 'Contractors' ? 'selected' : ''}>Contractor Focus</option>
                                <option value="Ecommerce" ${state.formData.market === 'Ecommerce' ? 'selected' : ''}>Ecommerce & SaaS</option>
                                <option value="Real Estate" ${state.formData.market === 'Real Estate' ? 'selected' : ''}>Real Estate Developers</option>
                                <option value="Local Business" ${state.formData.market === 'Local Business' ? 'selected' : ''}>Local Brick-and-Mortar</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Short Professional Bio</label>
                        <textarea id="fieldBio" rows="3" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">${state.formData.bio}</textarea>
                    </div>
                </div>
            `,
            bind: () => {
                document.getElementById('fieldName').addEventListener('input', (e) => {
                    state.formData.name = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldTitle').addEventListener('input', (e) => {
                    state.formData.title = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldAvatar').addEventListener('input', (e) => {
                    state.formData.avatar = e.target.value.toUpperCase();
                    updatePreview();
                });
                document.getElementById('fieldMarket').addEventListener('change', (e) => {
                    state.formData.market = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldBio').addEventListener('input', (e) => {
                    state.formData.bio = e.target.value;
                    updatePreview();
                });
            }
        },
        2: {
            title: "Capital Strategy & Specialty",
            render: () => `
                <div class="space-y-5">
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Primary Funding Lane Specialty</label>
                        <select id="fieldSpecialty" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                            <option value="Lines of Credit" ${state.formData.specialty === 'Lines of Credit' ? 'selected' : ''}>Corporate Lines of Credit</option>
                            <option value="Working Capital" ${state.formData.specialty === 'Working Capital' ? 'selected' : ''}>Rapid Working Capital</option>
                            <option value="Merchant Cash Advance" ${state.formData.specialty === 'Merchant Cash Advance' ? 'selected' : ''}>Merchant Revenue Splits</option>
                            <option value="SBA Funding" ${state.formData.specialty === 'SBA Funding' ? 'selected' : ''}>SBA 7(a) Bridge Loans</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Target Client Summary Profile</label>
                        <input type="text" id="fieldTarget" value="${state.formData.targetClient}" placeholder="e.g. Mid-market operators looking for dynamic equipment lines" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                        <span class="text-[10px] font-mono text-chromeAccent mt-1.5 block">Helps prospective clients verify alignment immediately upon landing.</span>
                    </div>
                </div>
            `,
            bind: () => {
                document.getElementById('fieldSpecialty').addEventListener('change', (e) => {
                    state.formData.specialty = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldTarget').addEventListener('input', (e) => {
                    state.formData.targetClient = e.target.value;
                    updatePreview();
                });
            }
        },
        3: {
            title: "Action Links & Intake Routing",
            render: () => `
                <div class="space-y-5">
                    <div>
                        <label class="block font-mono text-xs text-white uppercase mb-2">Calendar Booking Endpoint</label>
                        <input type="url" id="fieldCalendar" value="${state.formData.calendarLink}" placeholder="https://calendly.com/your-username" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-mono text-xs text-white uppercase mb-2">Primary Intake CTA Text</label>
                            <input type="text" id="fieldCtaText" value="${state.formData.ctaPrimaryText}" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                        </div>
                        <div>
                            <label class="block font-mono text-xs text-white uppercase mb-2">Primary Intake Destination URL</label>
                            <input type="url" id="fieldCtaUrl" value="${state.formData.ctaPrimaryUrl}" class="w-full bg-graphiteGray border-2 border-white/10 focus:border-electricGreen text-white px-4 py-3 text-sm font-mono focus:outline-none transition-all">
                        </div>
                    </div>
                </div>
            `,
            bind: () => {
                document.getElementById('fieldCalendar').addEventListener('input', (e) => {
                    state.formData.calendarLink = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldCtaText').addEventListener('input', (e) => {
                    state.formData.ctaPrimaryText = e.target.value;
                    updatePreview();
                });
                document.getElementById('fieldCtaUrl').addEventListener('input', (e) => {
                    state.formData.ctaPrimaryUrl = e.target.value;
                    updatePreview();
                });
            }
        },
        4: {
            title: "Theme Alignment & Checklist",
            render: () => {
                const colors = ['electricGreen', 'signalOrange', 'cobaltBlue', 'boneWhite'];
                const colorSelectors = colors.map(col => {
                    const meta = themeMeta[col];
                    const activeStyle = state.formData.themeColor === col ? 'border-white bg-white/20 scale-105' : 'border-white/10 hover:border-white/40';
                    return `
                        <button type="button" data-color="${col}" class="color-swatch-btn flex items-center gap-3 p-3 bg-graphiteGray border-2 ${activeStyle} transition-all duration-200">
                            <span class="w-4 h-4 ${meta.bgClass} border border-black inline-block"></span>
                            <span class="font-mono text-xs text-white capitalize">${col.replace(/([A-Z])/g, ' $1')}</span>
                        </button>
                    `;
                }).join('');

                const checklistItems = state.formData.checklist.map((item, index) => {
                    return `
                        <div class="flex items-center justify-between gap-3 p-2.5 bg-graphiteGray/50 border border-white/10 font-mono text-xs">
                            <div class="flex items-center gap-3 w-full">
                                <span class="text-chromeAccent text-[10px]">0${index+1}</span>
                                <input type="text" data-index="${index}" class="checklist-item-input w-full bg-transparent border-none text-white focus:outline-none focus:ring-0" value="${item.text}">
                            </div>
                            <button type="button" data-index="${index}" class="remove-checklist-btn text-signalOrange hover:text-white transition-colors px-2 font-bold font-sans">×</button>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block font-mono text-xs text-white uppercase mb-3">Accent Theme Palette</label>
                            <div class="grid grid-cols-2 gap-3">
                                ${colorSelectors}
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="block font-mono text-xs text-white uppercase">Client Document Checklist</label>
                                <button type="button" id="addChecklistItem" class="font-mono text-[10px] text-electricGreen hover:text-white transition-colors bg-white/5 border border-white/10 px-2 py-1">+ Add Check</button>
                            </div>
                            <div id="checklistBuilder" class="space-y-2">
                                ${checklistItems}
                            </div>
                        </div>
                    </div>
                `;
            },
            bind: () => {
                // Color swatch handler
                document.querySelectorAll('.color-swatch-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const targetColor = btn.getAttribute('data-color');
                        state.formData.themeColor = targetColor;
                        document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('border-white', 'bg-white/20', 'scale-105'));
                        btn.classList.add('border-white', 'bg-white/20', 'scale-105');
                        updatePreview();
                    });
                });

                // Update checklist text dynamic binds
                document.querySelectorAll('.checklist-item-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        const index = parseInt(input.getAttribute('data-index'));
                        state.formData.checklist[index].text = e.target.value;
                        updatePreview();
                    });
                });

                // Delete checklist item
                document.querySelectorAll('.remove-checklist-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(btn.getAttribute('data-index'));
                        state.formData.checklist.splice(index, 1);
                        renderStep(); // Rerender current step view to refresh list indexes
                        updatePreview();
                    });
                });

                // Add item to checklist
                document.getElementById('addChecklistItem').addEventListener('click', () => {
                    if (state.formData.checklist.length < 6) {
                        state.formData.checklist.push({ id: Date.now(), text: "New Requirement Checklist Document", checked: false });
                        renderStep();
                        updatePreview();
                    } else {
                        alert("Maximally 6 checklist items supported to maintain design integrity.");
                    }
                });
            }
        },
        5: {
            title: "Build Blueprint & Submit JSON",
            render: () => {
                const cleanJson = JSON.stringify({
                    $schema: "https://partners.moonshinecapital.com/schemas/partner.json",
                    metadata: {
                        created_at: new Date().toISOString().split('T')[0],
                        engine_version: "v2.0-static-first"
                    },
                    profile: {
                        name: state.formData.name,
                        title: state.formData.title,
                        avatar: state.formData.avatar,
                        bio: state.formData.bio,
                        market: state.formData.market,
                        specialty: state.formData.specialty,
                        target_client: state.formData.targetClient
                    },
                    routing: {
                        calendar_link: state.formData.calendarLink,
                        intake_cta: {
                            text: state.formData.ctaPrimaryText,
                            destination: state.formData.ctaPrimaryUrl
                        }
                    },
                    theme: {
                        accent_color: state.formData.themeColor,
                        interactive_scorecard: true
                    },
                    checklist_requirements: state.formData.checklist.map(c => c.text)
                }, null, 4);

                return `
                    <div class="space-y-5">
                        <div class="p-4 bg-electricGreen/10 border border-electricGreen/30 text-xs text-electricGreen font-mono leading-relaxed mb-2">
                            ✔ Static variables built. Your /partners/[slug] schema structure is compiled. Complete the step by copying the block below to your PR folder or hitting Submit configuration.
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block font-mono text-[10px] text-white uppercase font-bold">Generated JSON Schema</label>
                                <button id="copyJsonBtn" class="font-mono text-[10px] text-white bg-white/5 border border-white/10 hover:border-white px-2.5 py-1 transition-all">Copy Schema</button>
                            </div>
                            <pre class="bg-graphiteGray border-2 border-white/10 p-4 text-xs font-mono text-chromeAccent overflow-x-auto max-h-64 no-scrollbar select-all">${cleanJson}</pre>
                        </div>

                        <div>
                            <button id="simSubmitBtn" class="w-full font-mono bg-white hover:bg-electricGreen hover:text-black text-black text-xs font-extrabold py-4 border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.15)] uppercase tracking-wider transition-all">
                                ⚡ Submit Configuration Directly
                            </button>
                        </div>
                    </div>
                `;
            },
            bind: () => {
                document.getElementById('copyJsonBtn').addEventListener('click', () => {
                    const codeBlock = document.querySelector('pre');
                    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                        const copyBtn = document.getElementById('copyJsonBtn');
                        copyBtn.innerText = "COPIED! ✓";
                        copyBtn.className = "font-mono text-[10px] text-electricGreen bg-white/5 border border-electricGreen/30 px-2.5 py-1 transition-all";
                        setTimeout(() => {
                            copyBtn.innerText = "Copy Schema";
                            copyBtn.className = "font-mono text-[10px] text-white bg-white/5 border border-white/10 px-2.5 py-1 transition-all";
                        }, 2000);
                    });
                });

                document.getElementById('simSubmitBtn').addEventListener('click', () => {
                    const btn = document.getElementById('simSubmitBtn');
                    btn.innerText = "Processing submission build...";
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.innerText = "SUCCESSFULLY SENT TO MERGE ENGINE! ✓";
                        btn.className = "w-full font-mono bg-electricGreen text-black text-xs font-extrabold py-4 border-2 border-black uppercase tracking-wider";
                        
                        // Check if parent form success selector exists to unhide
                        const successAlert = document.getElementById('formSuccessMessage');
                        if (successAlert) {
                            successAlert.classList.remove('hidden');
                            successAlert.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1800);
                });
            }
        }
    };

    // Live Simulator Update logic
    function updatePreview() {
        const previewEl = document.getElementById('liveDeskPreview');
        if (!previewEl) return;

        const data = state.formData;
        const colorMeta = themeMeta[data.themeColor];

        // Clear existing classes and set new active brutalist accent
        previewEl.className = `bg-matteBlack border-4 border-white p-6 shadow-neobrutalGreen transition-all-300`;
        // Apply direct inline shadow overrides dynamically based on accent selections
        previewEl.style.boxShadow = `6px 6px 0px 0px ${colorMeta.hex}`;

        // Build list items markup dynamically
        const listItemsMarkup = data.checklist.map((item, index) => {
            const checkIcon = colorMeta.hex;
            return `
                <div class="flex items-center gap-2.5 text-xs text-chromeAccent">
                    <span style="color: ${checkIcon}">✔</span>
                    <span class="truncate">${item.text || `Requirement ${index + 1}`}</span>
                </div>
            `;
        }).join('');

        // Generate full template simulator frame mockup
        previewEl.innerHTML = `
            <!-- Top bar styling wrapper -->
            <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 bg-white/5 flex items-center justify-center font-mono font-black text-white text-sm border-2" style="border-color: ${colorMeta.hex}">
                        ${data.avatar || 'M'}
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="font-mono font-bold text-white text-sm tracking-wide truncate max-w-[160px]">${data.name || 'Anonymous Partner'}</h3>
                            <span class="text-[9px] font-mono px-1.5 py-0.5 border" style="background-color: ${colorMeta.hex}10; color: ${colorMeta.hex}; border-color: ${colorMeta.hex}30">DESK</span>
                        </div>
                        <p class="text-[10px] text-chromeAccent truncate max-w-[180px]">${data.title || 'Capital Advisor'}</p>
                    </div>
                </div>
            </div>

            <!-- Focus and Bio Area -->
            <div class="space-y-3 mb-4">
                <div class="flex flex-wrap gap-1.5">
                    <span class="text-[9px] font-mono bg-white/5 text-white px-2 py-0.5 border border-white/10 uppercase">${data.market} Focus</span>
                    <span class="text-[9px] font-mono bg-white/5 text-white px-2 py-0.5 border border-white/10 uppercase">${data.specialty}</span>
                </div>
                <p class="text-xs text-chromeAccent/95 leading-relaxed italic line-clamp-3">
                    "${data.bio || 'Provide a professional biography statement for your landing page...'}"
                </p>
            </div>

            <!-- Action CTAs Simulated -->
            <div class="space-y-2 mb-4">
                <a href="#" onclick="return false;" class="block w-full text-center py-2.5 font-mono font-bold text-xs uppercase tracking-wider border-2 border-black transition-all" style="background-color: ${colorMeta.hex}; color: #0d0d0d">
                    ${data.ctaPrimaryText || 'Start Review'}
                </a>
                <a href="#" onclick="return false;" class="block w-full text-center py-2 bg-transparent text-white border border-white/30 font-mono font-bold text-xs uppercase tracking-wider">
                    Book Strategy Session
                </a>
            </div>

            <!-- Document pre-req widget -->
            <div class="bg-white/5 border border-white/10 p-3 rounded-sm">
                <div class="flex justify-between items-center mb-2.5">
                    <span class="font-mono text-[9px] text-chromeAccent uppercase tracking-widest font-bold">Required Documents</span>
                    <span class="font-mono text-[9px]" style="color: ${colorMeta.hex}">${data.checklist.length} Identified</span>
                </div>
                <div class="space-y-2 max-h-28 overflow-hidden no-scrollbar">
                    ${listItemsMarkup || `<span class="text-[10px] text-chromeAccent font-mono">No documents selected</span>`}
                </div>
            </div>

            <!-- Mock Target client -->
            <div class="mt-3.5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span class="text-chromeAccent">Target Segment:</span>
                <span class="text-white truncate max-w-[180px]">${data.targetClient || 'Any business'}</span>
            </div>
        `;
    }

    // Step navigation controller
    function renderStep() {
        const step = steps[state.currentStep];
        
        // Update Title & Progress state visual cues
        document.getElementById('stepCounter').innerText = `Step ${state.currentStep} of ${state.totalSteps}`;
        const pct = (state.currentStep / state.totalSteps) * 100;
        document.getElementById('progressBarFill').style.width = `${pct}%`;

        // Update steps container markup
        const container = document.getElementById('stepsContainer');
        container.innerHTML = `
            <div class="mb-5">
                <span class="font-mono text-xs text-electricGreen uppercase tracking-widest font-extrabold block mb-1">SECTION 0${state.currentStep}</span>
                <h3 class="font-mono text-lg font-bold text-white uppercase">${step.title}</h3>
            </div>
            ${step.render()}
        `;

        // Run logic binds
        step.bind();

        // Control action button states
        document.getElementById('prevBtn').disabled = state.currentStep === 1;
        
        const nextBtn = document.getElementById('nextBtn');
        if (state.currentStep === state.totalSteps) {
            nextBtn.innerText = "Review Complete";
            nextBtn.disabled = true;
            nextBtn.className = "font-mono bg-white/10 text-chromeAccent text-xs font-bold px-6 py-3 border-2 border-white/10 cursor-not-allowed uppercase tracking-wider";
        } else {
            nextBtn.innerText = "Next Step →";
            nextBtn.disabled = false;
            nextBtn.className = "font-mono bg-electricGreen hover:bg-white text-black text-xs font-bold px-6 py-3 border-2 border-black shadow-[2px_2px_0px_#fff] hover:shadow-none transition-all uppercase tracking-wider";
        }
    }

    // Bind Core Application Controls
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (state.currentStep > 1) {
            state.currentStep--;
            renderStep();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (state.currentStep < state.totalSteps) {
            state.currentStep++;
            renderStep();
        }
    });

    // Run Initial Layout Calculations
    renderStep();
    updatePreview();
});