// Onboarding Engine Initialization
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('onboarding-root');
    if (root) {
        initOnboarding(root);
    } else {
        // Fallback: If no explicit root, try to find request section and inject
        const requestSection = document.getElementById('request');
        if (requestSection) {
            const container = document.createElement('div');
            container.id = 'onboarding-root';
            container.style.maxWidth = '1200px';
            container.style.margin = '4rem auto 0 auto';
            container.style.padding = '0 1rem';
            requestSection.parentNode.insertBefore(container, requestSection);
            initOnboarding(container);
        }
    }
});

function initOnboarding(container) {
    // Inject custom onboarding styles congruent with Moonshine design tokens
    const styles = `
        .onboard-wrapper {
            background: var(--bg-matte);
            border: 2px solid var(--chrome-border);
            box-shadow: var(--shadow-neo);
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            min-height: 650px;
            font-family: var(--font-sans);
            color: var(--bone-white);
            margin-bottom: 5rem;
        }

        @media (max-width: 968px) {
            .onboard-wrapper {
                grid-template-columns: 1fr;
            }
        }

        /* Form Workspace */
        .onboard-form-side {
            padding: 3rem;
            border-right: 2px solid var(--chrome-border);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        @media (max-width: 600px) {
            .onboard-form-side {
                padding: 1.5rem;
            }
        }

        /* Live Preview/Config Panel */
        .onboard-preview-side {
            padding: 3rem;
            background: var(--bg-black);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        @media (max-width: 600px) {
            .onboard-preview-side {
                padding: 1.5rem;
            }
        }

        /* Progress Steps bar */
        .onboard-progress-tracker {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2.5rem;
        }

        .onboard-progress-line-bg {
            flex-grow: 1;
            height: 4px;
            background: var(--graphite-gray);
            margin: 0 1rem;
            position: relative;
        }

        .onboard-progress-line-fill {
            position: absolute;
            height: 100%;
            background: var(--electric-green);
            left: 0;
            top: 0;
            width: 25%;
            transition: width 0.3s ease;
        }

        .step-indicator {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .step-indicator.active {
            color: var(--electric-green);
            font-weight: 700;
        }

        /* Dynamic Slide Elements */
        .onboard-slide {
            display: none;
            animation: fadeIn 0.3s ease-out forwards;
        }

        .onboard-slide.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .slide-title {
            font-size: 1.75rem;
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 0.5rem;
        }

        .slide-subtitle {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
        }

        /* Form Styling Elements */
        .onboard-field-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .onboard-label {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
        }

        .onboard-input, .onboard-textarea, .onboard-select {
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            color: var(--bone-white);
            padding: 0.85rem 1rem;
            font-family: var(--font-sans);
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
        }

        .onboard-input:focus, .onboard-textarea:focus, .onboard-select:focus {
            border-color: var(--electric-green);
        }

        .onboard-textarea {
            resize: vertical;
            min-height: 100px;
        }

        /* Grid inputs */
        .onboard-grid-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .onboard-option-box {
            border: 2px solid var(--chrome-border);
            background: var(--bg-black);
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .onboard-option-box:hover {
            border-color: var(--chrome-border-bright);
        }

        .onboard-option-box.selected {
            border-color: var(--electric-green);
            background: rgba(0, 255, 102, 0.05);
        }

        .onboard-option-box input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }

        .onboard-option-title {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            font-weight: 700;
        }

        /* Action Nav Buttons */
        .onboard-action-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--chrome-border);
            padding-top: 2rem;
            margin-top: 2rem;
        }

        .btn-nav-back {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--chrome-border);
            padding: 0.75rem 1.5rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-nav-back:hover {
            color: var(--bone-white);
            border-color: var(--bone-white);
        }

        .btn-nav-next {
            background: var(--electric-green);
            color: var(--bg-black);
            border: none;
            padding: 0.75rem 1.75rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-nav-next:hover {
            background: var(--electric-green-hover);
        }

        /* Config Viewers */
        .json-preview-container {
            border: 1px solid var(--chrome-border);
            background: var(--bg-matte);
            padding: 1rem;
            height: 250px;
            overflow-y: auto;
            position: relative;
        }

        .json-preview {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--electric-green);
            white-space: pre-wrap;
            margin: 0;
        }

        .btn-copy-config {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--graphite-gray);
            border: 1px solid var(--chrome-border);
            color: var(--bone-white);
            font-family: var(--font-mono);
            font-size: 0.65rem;
            padding: 3px 6px;
            cursor: pointer;
        }

        /* Console Terminal Output style for webhook deploy step */
        .deploy-console {
            background: #000;
            border: 2px solid var(--chrome-border);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: #00ff00;
            padding: 1rem;
            height: 180px;
            overflow-y: auto;
        }

        .console-line {
            margin-bottom: 4px;
        }

        .console-line-info { color: var(--cobalt-blue); }
        .console-line-success { color: var(--electric-green); }
        .console-line-warning { color: var(--signal-orange); }

        /* Sync Visual Badge mockup status */
        .sync-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(0, 85, 255, 0.15);
            border: 1px solid var(--cobalt-blue);
            color: var(--cobalt-blue);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            padding: 4px 10px;
            text-transform: uppercase;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Initial state storage for configuration setup
    const state = {
        step: 1,
        totalSteps: 5,
        config: {
            fullName: 'Alexander Hayes',
            title: 'Equipment & Commercial Asset Specialist',
            initials: 'AH',
            theme: 'cobalt-blue',
            specialties: ['logistics', 'contractors'],
            maxFunding: '$2,500,000',
            bookingLink: 'https://calendly.com/moonshine/alexander',
            slug: 'alex-hayes',
            bio: 'Assisting physical logistics networks, transport providers, and heavy mechanics secure streamlined funding pipelines directly supported by existing machinery assets.',
            email: 'alex.hayes@moonshine-partners.com',
            webhookUrl: ''
        }
    };

    // Render Main structure
    container.innerHTML = `
        <div style="margin-bottom: 3rem;">
            <span class="section-pre">Workspace Engine</span>
            <h2 class="section-title">Interactive Partner Setup Wizard</h2>
            <p style="color: var(--text-muted); margin-top: 0.5rem; max-width: 650px;">
                Complete your branding, specialties, and workflow configuration below to generate your deployable JSON configuration blocks or run a live deployment via integration webhook dispatchers.
            </p>
        </div>
        
        <div class="onboard-wrapper">
            <!-- Left Workspace Form Side -->
            <div class="onboard-form-side">
                <div>
                    <!-- Step Progress -->
                    <div class="onboard-progress-tracker">
                        <span class="step-indicator active" id="indicator-step">Step 1 of 5</span>
                        <div class="onboard-progress-line-bg">
                            <div class="onboard-progress-line-fill" id="progress-bar"></div>
                        </div>
                        <span class="step-indicator" id="indicator-title">Identity & Niche</span>
                    </div>

                    <!-- Slide 1: General Identity -->
                    <div class="onboard-slide active" id="slide-1">
                        <h3 class="slide-title">Define Partner Brand Profile</h3>
                        <p class="slide-subtitle">Set up the baseline visual and identity components for your public profile desk.</p>
                        
                        <div class="onboard-field-group">
                            <label class="onboard-label">Full Name / Trading Identity</label>
                            <input type="text" id="input-fullName" class="onboard-input" placeholder="e.g. Alexander Hayes" value="${state.config.fullName}">
                        </div>

                        <div class="onboard-grid-options" style="grid-template-columns: 1fr 2fr;">
                            <div class="onboard-field-group">
                                <label class="onboard-label">Initials Icon</label>
                                <input type="text" id="input-initials" class="onboard-input" maxlength="2" placeholder="AH" value="${state.config.initials}" style="text-transform: uppercase; text-align: center;">
                            </div>
                            <div class="onboard-field-group">
                                <label class="onboard-label">Specialist Designation</label>
                                <input type="text" id="input-title" class="onboard-input" placeholder="e.g. Asset Finance Director" value="${state.config.title}">
                            </div>
                        </div>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Select Profile Visual Brand Accent</label>
                            <div class="onboard-grid-options" style="margin-bottom: 0;">
                                <div class="onboard-option-box selected" data-theme="cobalt-blue">
                                    <div class="onboard-option-title" style="color: var(--cobalt-blue);">Cobalt</div>
                                </div>
                                <div class="onboard-option-box" data-theme="electric-green">
                                    <div class="onboard-option-title" style="color: var(--electric-green);">Electric</div>
                                </div>
                                <div class="onboard-option-box" data-theme="signal-orange">
                                    <div class="onboard-option-title" style="color: var(--signal-orange);">Signal</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 2: Dynamic Specialization Setup -->
                    <div class="onboard-slide" id="slide-2">
                        <h3 class="slide-title">Niche Specialties & Scope</h3>
                        <p class="slide-subtitle">Map the primary target industries you underwrite and your max capital caps.</p>
                        
                        <div class="onboard-field-group">
                            <label class="onboard-label">Underwriting Specializations (Multi-Select)</label>
                            <div class="onboard-grid-options" id="specialties-grid">
                                <div class="onboard-option-box selected" data-spec="realestate">
                                    <div class="onboard-option-title">Real Estate</div>
                                </div>
                                <div class="onboard-option-box" data-spec="ecommerce">
                                    <div class="onboard-option-title">Ecommerce</div>
                                </div>
                                <div class="onboard-option-box selected" data-spec="logistics">
                                    <div class="onboard-option-title">Logistics</div>
                                </div>
                                <div class="onboard-option-box selected" data-spec="contractors">
                                    <div class="onboard-option-title">Contractors</div>
                                </div>
                            </div>
                        </div>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Max Funding Offering Limit</label>
                            <select id="input-maxFunding" class="onboard-select">
                                <option value="$500,000" ${state.config.maxFunding === '$500,000' ? 'selected' : ''}>$500,000 Max Limit</option>
                                <option value="$1,000,000" ${state.config.maxFunding === '$1,000,000' ? 'selected' : ''}>$1,000,000 Max Limit</option>
                                <option value="$2,500,000" ${state.config.maxFunding === '$2,500,000' ? 'selected' : ''}>$2,500,000 Max Limit</option>
                                <option value="$5,000,000" ${state.config.maxFunding === '$5,000,000' ? 'selected' : ''}>$5,000,000 Max Limit</option>
                                <option value="$10,000,000+" ${state.config.maxFunding === '$10,000,000+' ? 'selected' : ''}>Unlimited / Enterprise</option>
                            </select>
                        </div>
                    </div>

                    <!-- Slide 3: Strategy & Bio -->
                    <div class="onboard-slide" id="slide-3">
                        <h3 class="slide-title">Capital Pitch & Biography</h3>
                        <p class="slide-subtitle">This core bio text appears directly inside the custom Hero Desk interface block.</p>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Value Proposition Bio (2-3 Sentences)</label>
                            <textarea id="input-bio" class="onboard-textarea" placeholder="Describe how you structure capital or assist target business groups...">${state.config.bio}</textarea>
                        </div>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Personal Routing Email</label>
                            <input type="email" id="input-email" class="onboard-input" placeholder="e.g. partner@firm.com" value="${state.config.email}">
                        </div>
                    </div>

                    <!-- Slide 4: Links & Mapping -->
                    <div class="onboard-slide" id="slide-4">
                        <h3 class="slide-title">Consultation Channels & Slug</h3>
                        <p class="slide-subtitle">Point clients directly to scheduling and custom subdomain structures.</p>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Custom Calendar Scheduling Link</label>
                            <input type="url" id="input-bookingLink" class="onboard-input" placeholder="e.g. https://calendly.com/user" value="${state.config.bookingLink}">
                        </div>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Target Profile URL Slug Suggestion</label>
                            <div style="display: flex; align-items: center;">
                                <span style="background: var(--graphite-gray); border: 1px solid var(--chrome-border); border-right: none; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">moonshine.partners/</span>
                                <input type="text" id="input-slug" class="onboard-input" placeholder="slug-name" value="${state.config.slug}" style="flex-grow: 1;">
                            </div>
                        </div>
                    </div>

                    <!-- Slide 5: Webhook and Deploy Engine -->
                    <div class="onboard-slide" id="slide-5">
                        <h3 class="slide-title">Deploy Dynamic Static Profile</h3>
                        <p class="slide-subtitle">Transmit your config directly to your custom webhook automation handler or trigger a static simulation.</p>

                        <div class="onboard-field-group">
                            <label class="onboard-label">Automated Profile Webhook Endpoint (Optional)</label>
                            <input type="url" id="input-webhook" class="onboard-input" placeholder="e.g. https://make.com/webhooks/... or Zapier hook" value="${state.config.webhookUrl}">
                            <span style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Leave blank to run simulated local engine build operations safely.</span>
                        </div>

                        <div style="margin-top: 1.5rem;">
                            <button id="btn-deploy-engine" class="btn-primary" style="width: 100%; text-align: center; font-family: var(--font-mono); justify-content: center; box-shadow: none;">
                                🚀 Trigger Deploy Command
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation Elements -->
                <div class="onboard-action-nav">
                    <button class="btn-nav-back" id="btn-back" style="visibility: hidden;">&larr; Previous Step</button>
                    <button class="btn-nav-next" id="btn-next">Next Step &rarr;</button>
                </div>
            </div>

            <!-- Right Visual Preview Panel -->
            <div class="onboard-preview-side">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span class="sync-badge">⚙️ Engine Synced</span>
                        <span class="step-indicator" id="preview-slug">moonshine.partners/${state.config.slug}</span>
                    </div>

                    <!-- Live Desk Visual Mockup congruent with main visual profile -->
                    <div class="mock-desk" style="margin-bottom: 2rem; box-shadow: none; border-color: var(--chrome-border-bright);">
                        <div class="mock-header">
                            <div class="mock-dots">
                                <span class="mock-dot active" style="background-color: var(--cobalt-blue);" id="preview-mock-dot"></span>
                                <span class="mock-dot"></span>
                                <span class="mock-dot"></span>
                            </div>
                            <div class="mock-url" id="preview-mock-url">moonshine.partners/${state.config.slug}</div>
                        </div>
                        <div class="mock-profile-card">
                            <div class="mock-avatar-row">
                                <div class="mock-avatar" id="preview-avatar" style="border-color: var(--cobalt-blue);">${state.config.initials}</div>
                                <div class="mock-meta">
                                    <h3 id="preview-name">${state.config.fullName}</h3>
                                    <p id="preview-title" style="color: var(--cobalt-blue);">${state.config.title}</p>
                                </div>
                            </div>
                            <p class="mock-desc" id="preview-bio">${state.config.bio}</p>
                            <div class="mock-action-box" style="padding: 0.75rem;">
                                <div class="mock-action-val">
                                    <span>Max Funding</span>
                                    <span id="preview-funding">${state.config.maxFunding}</span>
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.65rem; background: var(--graphite-gray); color: var(--electric-green); padding: 4px 8px; border: 1px solid var(--chrome-border);">Active Route</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lower Output: JSON Config block or Deploy Terminal -->
                <div>
                    <label class="onboard-label" style="display: block; margin-bottom: 0.5rem;" id="terminal-label">Configuration State (JSON)</label>
                    <div id="lower-preview-box">
                        <div class="json-preview-container">
                            <button class="btn-copy-config" id="btn-copy-json">COPY JSON</button>
                            <pre class="json-preview" id="preview-json"></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // References
    const elements = {
        slide1: container.querySelector('#slide-1'),
        slide2: container.querySelector('#slide-2'),
        slide3: container.querySelector('#slide-3'),
        slide4: container.querySelector('#slide-4'),
        slide5: container.querySelector('#slide-5'),
        btnBack: container.querySelector('#btn-back'),
        btnNext: container.querySelector('#btn-next'),
        btnDeploy: container.querySelector('#btn-deploy-engine'),
        btnCopyJson: container.querySelector('#btn-copy-json'),
        progressBar: container.querySelector('#progress-bar'),
        indicatorStep: container.querySelector('#indicator-step'),
        indicatorTitle: container.querySelector('#indicator-title'),
        previewSlug: container.querySelector('#preview-slug'),
        previewMockUrl: container.querySelector('#preview-mock-url'),
        previewMockDot: container.querySelector('#preview-mock-dot'),
        previewAvatar: container.querySelector('#preview-avatar'),
        previewName: container.querySelector('#preview-name'),
        previewTitle: container.querySelector('#preview-title'),
        previewBio: container.querySelector('#preview-bio'),
        previewFunding: container.querySelector('#preview-funding'),
        previewJson: container.querySelector('#preview-json'),
        lowerPreviewBox: container.querySelector('#lower-preview-box'),
        terminalLabel: container.querySelector('#terminal-label')
    };

    // Fields
    const fields = {
        fullName: container.querySelector('#input-fullName'),
        initials: container.querySelector('#input-initials'),
        title: container.querySelector('#input-title'),
        maxFunding: container.querySelector('#input-maxFunding'),
        bio: container.querySelector('#input-bio'),
        email: container.querySelector('#input-email'),
        bookingLink: container.querySelector('#input-bookingLink'),
        slug: container.querySelector('#input-slug'),
        webhook: container.querySelector('#input-webhook')
    };

    // Step Config Setup
    const stepTitles = [
        "Identity & Niche",
        "Target Sectors",
        "Strategic Bio",
        "Booking Pathways",
        "Engine Deployment"
    ];

    // Helper functions
    function updateProgressUI() {
        const percentage = ((state.step - 1) / (state.totalSteps - 1)) * 100;
        elements.progressBar.style.width = `${percentage}%`;
        elements.indicatorStep.textContent = `Step ${state.step} of ${state.totalSteps}`;
        elements.indicatorTitle.textContent = stepTitles[state.step - 1];

        // Back button visibility logic
        if (state.step === 1) {
            elements.btnBack.style.visibility = 'hidden';
        } else {
            elements.btnBack.style.visibility = 'visible';
        }

        // Next button visual name toggling
        if (state.step === state.totalSteps) {
            elements.btnNext.style.display = 'none';
        } else {
            elements.btnNext.style.display = 'block';
            elements.btnNext.textContent = state.step === state.totalSteps - 1 ? "Complete Configuration \u2192" : "Next Step \u2192";
        }

        // Active slide visibility toggle
        for (let i = 1; i <= state.totalSteps; i++) {
            const slide = elements[`slide${i}`];
            if (i === state.step) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        }
    }

    function syncStateToPreview() {
        // Build JSON structure
        elements.previewName.textContent = state.config.fullName || 'Anonymous Partner';
        elements.previewTitle.textContent = state.config.title || 'Capital Funding Partner';
        elements.previewAvatar.textContent = (state.config.initials || 'AP').toUpperCase();
        elements.previewBio.textContent = state.config.bio || 'Your strategic capital pitch overview outputted dynamically here.';
        elements.previewFunding.textContent = state.config.maxFunding;
        elements.previewSlug.textContent = `moonshine.partners/${state.config.slug || 'slug'}`;
        elements.previewMockUrl.textContent = `moonshine.partners/${state.config.slug || 'slug'}`;

        // Color Accents mapping
        let activeColorHex = 'var(--cobalt-blue)';
        if (state.config.theme === 'electric-green') activeColorHex = 'var(--electric-green)';
        if (state.config.theme === 'signal-orange') activeColorHex = 'var(--signal-orange)';

        elements.previewTitle.style.color = activeColorHex;
        elements.previewAvatar.style.borderColor = activeColorHex;
        elements.previewMockDot.style.backgroundColor = activeColorHex;

        // Render clean dynamic JSON output block
        elements.previewJson.textContent = JSON.stringify(state.config, null, 4);
    }

    // Input monitoring setups
    function setupInputSync(fieldKey, element) {
        element.addEventListener('input', () => {
            state.config[fieldKey] = element.value;
            syncStateToPreview();
        });
    }

    setupInputSync('fullName', fields.fullName);
    setupInputSync('initials', fields.initials);
    setupInputSync('title', fields.title);
    setupInputSync('bio', fields.bio);
    setupInputSync('email', fields.email);
    setupInputSync('bookingLink', fields.bookingLink);
    setupInputSync('webhookUrl', fields.webhook);

    // Auto format slug clean strings
    fields.slug.addEventListener('input', () => {
        const cleaned = fields.slug.value
            .toLowerCase()
            .replace(/[^a-z0-9\-]/g, '-')
            .replace(/-+/g, '-');
        state.config.slug = cleaned;
        fields.slug.value = cleaned;
        syncStateToPreview();
    });

    fields.maxFunding.addEventListener('change', () => {
        state.config.maxFunding = fields.maxFunding.value;
        syncStateToPreview();
    });

    // Color theme choices handler
    const themeBoxes = container.querySelectorAll('[data-theme]');
    themeBoxes.forEach(box => {
        box.addEventListener('click', () => {
            themeBoxes.forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            state.config.theme = box.getAttribute('data-theme');
            syncStateToPreview();
        });
    });

    // Multi select checkbox specialties elements
    const specBoxes = container.querySelectorAll('[data-spec]');
    specBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const specVal = box.getAttribute('data-spec');
            if (state.config.specialties.includes(specVal)) {
                state.config.specialties = state.config.specialties.filter(s => s !== specVal);
                box.classList.remove('selected');
            } else {
                state.config.specialties.push(specVal);
                box.classList.add('selected');
            }
            syncStateToPreview();
        });
    });

    // Navigation triggers
    elements.btnNext.addEventListener('click', () => {
        if (state.step < state.totalSteps) {
            state.step++;
            updateProgressUI();
        }
    });

    elements.btnBack.addEventListener('click', () => {
        if (state.step > 1) {
            state.step--;
            updateProgressUI();
        }
    });

    // Clipboard config copy capability
    elements.btnCopyJson.addEventListener('click', () => {
        navigator.clipboard.writeText(JSON.stringify(state.config, null, 4)).then(() => {
            const originalText = elements.btnCopyJson.textContent;
            elements.btnCopyJson.textContent = "COPIED!";
            elements.btnCopyJson.style.color = "var(--electric-green)";
            setTimeout(() => {
                elements.btnCopyJson.textContent = originalText;
                elements.btnCopyJson.style.color = "var(--bone-white)";
            }, 1500);
        });
    });

    // Deploy Engine Trigger Simulator & Webhook Connector
    elements.btnDeploy.addEventListener('click', () => {
        elements.terminalLabel.textContent = "Deployment Console Terminal Output";
        elements.lowerPreviewBox.innerHTML = `<div class="deploy-console" id="console-output"></div>`;
        const consoleOutput = container.querySelector('#console-output');

        function appendLine(text, type = 'normal') {
            const line = document.createElement('div');
            line.className = `console-line console-line-${type}`;
            line.innerHTML = `&gt; ${text}`;
            consoleOutput.appendChild(line);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }

        appendLine("Initializing deployment pipeline framework...", "info");
        
        setTimeout(() => {
            appendLine("Parsing dynamic state JSON parameters...", "normal");
        }, 600);

        setTimeout(() => {
            appendLine(`Configuring static-first architecture for slug: '/partners/${state.config.slug}'`, "normal");
        }, 1200);

        setTimeout(() => {
            appendLine("Connecting to Git Version Control repository pipelines...", "normal");
        }, 1800);

        // Check if there's a webhook URL
        if (state.config.webhookUrl && state.config.webhookUrl.trim() !== '') {
            setTimeout(() => {
                appendLine(`Active Dispatch Target: Fire custom webhook schema: ${state.config.webhookUrl}`, "warning");
            }, 2400);

            setTimeout(() => {
                fetch(state.config.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: "partner_onboarding_deploy",
                        timestamp: new Date().toISOString(),
                        config: state.config
                    })
                })
                .then(res => {
                    appendLine("Webhook dispatch responded successfully. Payload processed.", "success");
                    finishSimulation();
                })
                .catch(err => {
                    appendLine(`Webhook Dispatch Error: ${err.message}`, "warning");
                    appendLine("Proceeding with internal static build execution stack...", "info");
                    finishSimulation();
                });
            }, 3000);
        } else {
            setTimeout(() => {
                appendLine("Simulating Vercel build configuration setup commands...", "info");
            }, 2400);
            setTimeout(() => {
                finishSimulation();
            }, 3200);
        }

        function finishSimulation() {
            setTimeout(() => {
                appendLine("Compiling production bundle files successfully.", "success");
            }, 400);
            setTimeout(() => {
                appendLine("Optimizing static bundle assets... complete.", "success");
            }, 1000);
            setTimeout(() => {
                appendLine(`DEPLOYMENT SYSTEM READY: Static portal deployed live at: moonshine.partners/${state.config.slug}`, "success");
                if (typeof triggerToast === 'function') {
                    triggerToast(`Profile Generated: moonshine.partners/${state.config.slug}`);
                }
            }, 1600);
        }
    });

    // Initialize UI Elements
    updateProgressUI();
    syncStateToPreview();
}
