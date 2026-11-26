(function () {
    // 1. Inject Styles Dynamically to avoid external file dependencies
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Partner Hub Section Specific Styles */
        .hub-section {
            border-top: 2px solid var(--chrome-border);
            position: relative;
        }
        
        .hub-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        @media (max-width: 1024px) {
            .hub-grid {
                grid-template-columns: 1fr;
                gap: 2.5rem;
            }
        }

        .hub-card {
            background: var(--bg-matte);
            border: 2px solid var(--chrome-border);
            padding: 2.25rem;
            position: relative;
        }

        .hub-card-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid var(--chrome-border);
            padding-bottom: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .hub-card-title span.badge {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            background: rgba(0, 85, 255, 0.1);
            border: 1px solid var(--cobalt-blue);
            color: var(--cobalt-blue);
            padding: 2px 8px;
        }

        /* Form styling */
        .hub-form-group {
            margin-bottom: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .hub-label {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            justify-content: space-between;
        }

        .hub-label span.req {
            color: var(--signal-orange);
        }

        .hub-input, .hub-select {
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            color: var(--bone-white);
            padding: 0.75rem;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .hub-input:focus, .hub-select:focus {
            border-color: var(--electric-green);
        }

        .hub-input.mono, .hub-select.mono {
            font-family: var(--font-mono);
            font-size: 0.8rem;
        }

        /* Quick-select tags for form parameters */
        .hub-tags-row {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 0.25rem;
        }

        .hub-tag-btn {
            background: var(--graphite-gray);
            border: 1px solid var(--chrome-border);
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 0.65rem;
            padding: 3px 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .hub-tag-btn:hover, .hub-tag-btn.active {
            border-color: var(--electric-green);
            color: var(--electric-green);
            background: rgba(0, 255, 102, 0.05);
        }

        /* Live UTM Builder Output Box */
        .hub-output-container {
            margin-top: 2rem;
            background: var(--bg-black);
            border: 2px dashed var(--chrome-border-bright);
            padding: 1.25rem;
            position: relative;
            transition: border-color 0.2s;
        }

        .hub-output-container.active {
            border-color: var(--electric-green);
        }

        .hub-output-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .hub-output-label {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--electric-green);
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .hub-output-link {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--bone-white);
            word-break: break-all;
            background: rgba(255, 255, 255, 0.02);
            padding: 0.75rem;
            border: 1px solid var(--chrome-border);
            line-height: 1.4;
            min-height: 40px;
        }

        .hub-action-row {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .hub-action-row .btn {
            flex-grow: 1;
            padding: 0.75rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 700;
            text-align: center;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-hub-copy {
            background: var(--electric-green);
            color: var(--bg-black);
        }

        .btn-hub-copy:hover {
            box-shadow: var(--shadow-green);
            transform: translateY(-1px);
        }

        .btn-hub-test {
            background: transparent;
            color: var(--bone-white);
            border: 2px solid var(--chrome-border) !important;
        }

        .btn-hub-test:hover {
            border-color: var(--bone-white) !important;
            background: rgba(255, 255, 255, 0.05);
        }

        /* Resources Tabs Interface */
        .hub-tabs-header {
            display: flex;
            border-bottom: 2px solid var(--chrome-border);
            margin-bottom: 1.5rem;
        }

        .hub-tab-nav {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 0.75rem 1.25rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            cursor: pointer;
            position: relative;
            transition: color 0.2s;
        }

        .hub-tab-nav:hover, .hub-tab-nav.active {
            color: var(--bone-white);
        }

        .hub-tab-nav.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--electric-green);
        }

        /* Copy Block styling */
        .copy-block-card {
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            padding: 1.25rem;
            margin-bottom: 1.25rem;
            transition: border-color 0.2s;
        }

        .copy-block-card:hover {
            border-color: var(--chrome-border-bright);
        }

        .copy-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .copy-block-title {
            font-size: 0.95rem;
            font-weight: 700;
        }

        .copy-block-tag {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            background: var(--graphite-gray);
            color: var(--electric-green);
            padding: 2px 6px;
        }

        .copy-block-text {
            font-size: 0.85rem;
            color: var(--text-muted);
            line-height: 1.5;
            background: rgba(8, 9, 10, 0.6);
            padding: 0.75rem;
            border-left: 2px solid var(--cobalt-blue);
            white-space: pre-wrap;
            word-break: break-word;
        }

        .copy-block-btn {
            background: transparent;
            border: 1px solid var(--chrome-border-bright);
            color: var(--bone-white);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            padding: 4px 10px;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .copy-block-btn:hover {
            border-color: var(--electric-green);
            color: var(--electric-green);
            background: rgba(0, 255, 102, 0.05);
        }

        /* Asset visual cards */
        .asset-visual-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }

        .asset-visual-card {
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            padding: 1rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 160px;
        }

        .asset-preview-box {
            background: linear-gradient(135deg, var(--graphite-gray) 0%, var(--bg-matte) 100%);
            border: 1px dashed var(--chrome-border-bright);
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 700;
        }

        .asset-info {
            margin-top: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
        }

        .asset-download-btn {
            background: transparent;
            border: 1px solid var(--chrome-border-bright);
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 0.65rem;
            padding: 4px 8px;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 0.5rem;
        }

        .asset-download-btn:hover {
            border-color: var(--electric-green);
            color: var(--electric-green);
        }

        /* Brand Colors Hex Palette widget */
        .color-palette {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
        }

        .color-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-black);
            border: 1px solid var(--chrome-border);
            padding: 0.5rem 1rem;
        }

        .color-preview-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .color-swatch {
            width: 24px;
            height: 24px;
            border: 1px solid var(--chrome-border-bright);
        }

        .color-name {
            font-size: 0.85rem;
            font-weight: 700;
        }

        .color-hex {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-muted);
            cursor: pointer;
            transition: color 0.2s;
        }

        .color-hex:hover {
            color: var(--electric-green);
        }
    `;
    document.head.appendChild(styleElement);

    // 2. Build and Inject Section Structure inside <main> right before the Footer
    const hubSection = document.createElement('section');
    hubSection.className = 'container hub-section';
    hubSection.id = 'partner-hub';

    hubSection.innerHTML = `
        <div class="section-header">
            <span class="section-pre">Campaign Control</span>
            <h2 class="section-title">Partner Resource Hub & Link Builder</h2>
        </div>
        
        <div class="hub-grid">
            <!-- Left Panel: Dynamic UTM Builder -->
            <div class="hub-card">
                <div class="hub-card-title">
                    <span>Tactical Link Builder</span>
                    <span class="badge">Static Engine v1.0</span>
                </div>
                
                <form id="utmBuilderForm">
                    <div class="hub-form-group">
                        <label class="hub-label">Destination Route <span class="req">*</span></label>
                        <select class="hub-select mono" id="utmDestination">
                            <option value="https://moonshine.partners/eval">Readiness Scorecard (Scorecard Tool)</option>
                            <option value="https://moonshine.partners/apply">Dynamic App Intake (Direct App)</option>
                            <option value="https://moonshine.partners/schedule">Strategy Booking Suite (Calendar)</option>
                            <option value="https://moonshine.partners/docs">Document Checklist Matcher (Packets)</option>
                        </select>
                    </div>

                    <div class="hub-form-group">
                        <label class="hub-label">Partner Slug/ID <span class="req">*</span></label>
                        <input type="text" class="hub-input mono" id="utmPartner" value="danielle-hart" placeholder="e.g. marcus-vance">
                        <div class="hub-tags-row" id="partnerQuickSelect">
                            <span class="hub-tag-btn" data-slug="danielle-hart">danielle-hart</span>
                            <span class="hub-tag-btn" data-slug="marcus-vance">marcus-vance</span>
                            <span class="hub-tag-btn" data-slug="elena-rostova">elena-rostova</span>
                        </div>
                    </div>

                    <div class="hub-form-group">
                        <label class="hub-label">Campaign Source (utm_source) <span class="req">*</span></label>
                        <input type="text" class="hub-input mono" id="utmSource" value="linkedin" placeholder="e.g. email, newsletter">
                        <div class="hub-tags-row" id="sourceQuickSelect">
                            <span class="hub-tag-btn active" data-val="linkedin">linkedin</span>
                            <span class="hub-tag-btn" data-val="email">email</span>
                            <span class="hub-tag-btn" data-val="twitter">twitter</span>
                            <span class="hub-tag-btn" data-val="newsletter">newsletter</span>
                        </div>
                    </div>

                    <div class="hub-form-group">
                        <label class="hub-label">Campaign Medium (utm_medium)</label>
                        <input type="text" class="hub-input mono" id="utmMedium" value="social" placeholder="e.g. direct, referral">
                        <div class="hub-tags-row" id="mediumQuickSelect">
                            <span class="hub-tag-btn active" data-val="social">social</span>
                            <span class="hub-tag-btn" data-val="direct">direct</span>
                            <span class="hub-tag-btn" data-val="referral">referral</span>
                        </div>
                    </div>

                    <div class="hub-form-group">
                        <label class="hub-label">Campaign Name (utm_campaign)</label>
                        <input type="text" class="hub-input mono" id="utmCampaign" value="q4-funding-drive" placeholder="e.g. fall-promotion">
                    </div>
                </form>

                <!-- Interactive Live URL Output Screen -->
                <div class="hub-output-container" id="outputContainer">
                    <div class="hub-output-header">
                        <span class="hub-output-label">⚡ Live Compiled URL</span>
                    </div>
                    <div class="hub-output-link" id="liveUrlOutput">Generating...</div>
                    <div class="hub-action-row">
                        <button class="btn btn-hub-copy" id="btnCopyUtm">Copy Link</button>
                        <button class="btn btn-hub-test" id="btnTestUtm">Test Destination</button>
                    </div>
                </div>
            </div>

            <!-- Right Panel: Marketing Kit & Copy Templates -->
            <div>
                <div class="hub-tabs-header">
                    <button class="hub-tab-nav active" data-target="copy-templates">Compliance Copy</button>
                    <button class="hub-tab-nav" data-target="social-banners">Social Kit</button>
                    <button class="hub-tab-nav" data-target="brand-assets">Brand Assets</button>
                </div>

                <!-- Tab 1: Compliance-Approved Templates -->
                <div class="hub-tab-pane" id="copy-templates">
                    <!-- Template Item 1 -->
                    <div class="copy-block-card">
                        <div class="copy-block-header">
                            <span class="copy-block-title">Non-Dilutive LinkedIn Pitch</span>
                            <span class="copy-block-tag">Social</span>
                        </div>
                        <div class="copy-block-text" id="textTemp1">Tired of dilution? We just launched our dedicated partner portal running the Moonshine Funding Engine to match scaling founders with up to $5M in non-dilutive capital. Check your readiness score instantly and request a consult directly. #NonDilutiveFinancing #GrowthCapital</div>
                        <button class="copy-block-btn" data-copy-target="textTemp1">Copy Template Copy</button>
                    </div>

                    <!-- Template Item 2 -->
                    <div class="copy-block-card">
                        <div class="copy-block-header">
                            <span class="copy-block-title">CPA Strategic Advisor Note</span>
                            <span class="copy-block-tag">Professional</span>
                        </div>
                        <div class="copy-block-text" id="textTemp2">Dear Client, as part of our strategic commitment to your scale roadmap, we have activated our custom financing portal with Moonshine Capital. Our clients can now safely run automated evaluation scorecards to identify structural debt alternatives without compromising operational equity. Reach out to schedule a consultation.</div>
                        <button class="copy-block-btn" data-copy-target="textTemp2">Copy Template Copy</button>
                    </div>

                    <!-- Template Item 3 -->
                    <div class="copy-block-card">
                        <div class="copy-block-header">
                            <span class="copy-block-title">Direct Outreach Quick Intro</span>
                            <span class="copy-block-tag">Email</span>
                        </div>
                        <div class="copy-block-text" id="textTemp3">Hi [Name], I noticed your scaling trajectory and wanted to share our dedicated portal powered by Moonshine Capital. We offer lines of credit, inventory support, and revenue-based options tailored specifically to SaaS, logistics, and real estate. Run a live scorecard check to mapping options. Let's schedule a brief sync call!</div>
                        <button class="copy-block-btn" data-copy-target="textTemp3">Copy Template Copy</button>
                    </div>
                </div>

                <!-- Tab 2: Brand/Social Kits -->
                <div class="hub-tab-pane" id="social-banners" style="display: none;">
                    <div class="asset-visual-grid">
                        <div class="asset-visual-card">
                            <div class="asset-preview-box" style="background: radial-gradient(circle, var(--cobalt-blue) 0%, var(--bg-black) 100%);">
                                <span style="color: var(--bone-white);">1200 x 630</span>
                            </div>
                            <span class="asset-info">Scorecard LinkedIn Banner</span>
                            <button class="asset-download-btn" onclick="triggerToastDownload('Scorecard_Promo_Banner.png')">Download PNG</button>
                        </div>

                        <div class="asset-visual-card">
                            <div class="asset-preview-box" style="background: radial-gradient(circle, var(--electric-green) 0%, var(--bg-black) 100%);">
                                <span style="color: var(--bg-black);">1080 x 1080</span>
                            </div>
                            <span class="asset-info">Instagram / Square Ad Kit</span>
                            <button class="asset-download-btn" onclick="triggerToastDownload('Square_Promo_Ad.png')">Download PNG</button>
                        </div>

                        <div class="asset-visual-card">
                            <div class="asset-preview-box" style="background: var(--graphite-gray);">
                                <span style="color: var(--electric-green); font-size: 1.5rem;">❖</span>
                            </div>
                            <span class="asset-info">Vector Verification Badge</span>
                            <button class="asset-download-btn" onclick="triggerToastDownload('Moonshine_Badge_Vector.svg')">Download SVG</button>
                        </div>
                    </div>
                </div>

                <!-- Tab 3: Brand Assets -->
                <div class="hub-tab-pane" id="brand-assets" style="display: none;">
                    <div class="copy-block-card">
                        <div class="copy-block-header">
                            <span class="copy-block-title">Brand Identity System</span>
                            <span class="copy-block-tag">Hex Codes</span>
                        </div>
                        <p class="hero-subheadline" style="font-size: 0.8rem; margin-bottom: 1rem;">Use exact brand codes on external landing modules to keep visual alignment high.</p>
                        <div class="color-palette">
                            <div class="color-item">
                                <div class="color-preview-group">
                                    <div class="color-swatch" style="background-color: var(--electric-green);"></div>
                                    <span class="color-name">Electric Green</span>
                                </div>
                                <span class="color-hex" onclick="copyBrandColor('#00FF66')">#00FF66</span>
                            </div>
                            <div class="color-item">
                                <div class="color-preview-group">
                                    <div class="color-swatch" style="background-color: var(--cobalt-blue);"></div>
                                    <span class="color-name">Cobalt Blue</span>
                                </div>
                                <span class="color-hex" onclick="copyBrandColor('#0055FF')">#0055FF</span>
                            </div>
                            <div class="color-item">
                                <div class="color-preview-group">
                                    <div class="color-swatch" style="background-color: var(--signal-orange);"></div>
                                    <span class="color-name">Signal Orange</span>
                                </div>
                                <span class="color-hex" onclick="copyBrandColor('#FF5500')">#FF5500</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert dynamic hub before the footer
    const mainContainer = document.querySelector('main');
    const footerElement = document.querySelector('footer');
    if (mainContainer && footerElement) {
        mainContainer.insertBefore(hubSection, footerElement);
    } else if (mainContainer) {
        mainContainer.appendChild(hubSection);
    }

    // 3. Fallback Toast Mechanism
    const nativeToast = window.triggerToast;
    function safeToast(msg) {
        if (typeof nativeToast === 'function') {
            nativeToast(msg);
        } else {
            // Built-in standalone toast implementation
            const container = document.getElementById('toastContainer') || document.body;
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '2rem';
            toast.style.right = '2rem';
            toast.style.background = '#14161D';
            toast.style.border = '2px solid #00FF66';
            toast.style.color = '#F5F5F7';
            toast.style.padding = '1rem 1.5rem';
            toast.style.fontFamily = "'JetBrains Mono', monospace";
            toast.style.fontSize = '0.8rem';
            toast.style.boxShadow = '0px 0px 20px 0px rgba(0, 255, 102, 0.25)';
            toast.style.zIndex = '10002';
            toast.innerHTML = `⚡ ${msg}`;
            container.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }
    }

    // Export download trigger to globally scoped windows element
    window.triggerToastDownload = function (filename) {
        safeToast(`Initiated download pipeline: ${filename}`);
    };

    window.copyBrandColor = function (color) {
        navigator.clipboard.writeText(color).then(() => {
            safeToast(`Copied Hex code: ${color}`);
        });
    };

    // 4. UTM Link Builder Core Logic
    const utmDestination = document.getElementById('utmDestination');
    const utmPartner = document.getElementById('utmPartner');
    const utmSource = document.getElementById('utmSource');
    const utmMedium = document.getElementById('utmMedium');
    const utmCampaign = document.getElementById('utmCampaign');
    const liveUrlOutput = document.getElementById('liveUrlOutput');
    const outputContainer = document.getElementById('outputContainer');

    function buildLiveUrl() {
        const dest = utmDestination.value;
        const partner = utmPartner.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const source = utmSource.value.trim().toLowerCase();
        const medium = utmMedium.value.trim().toLowerCase();
        const campaign = utmCampaign.value.trim().toLowerCase();

        if (!partner || !source) {
            liveUrlOutput.textContent = '[Please input Partner Slug and Campaign Source]';
            outputContainer.classList.remove('active');
            return;
        }

        let compiledUrl = `${dest}?partner=${partner}&utm_source=${encodeURIComponent(source)}`;
        
        if (medium) {
            compiledUrl += `&utm_medium=${encodeURIComponent(medium)}`;
        }
        if (campaign) {
            compiledUrl += `&utm_campaign=${encodeURIComponent(campaign)}`;
        }

        liveUrlOutput.textContent = compiledUrl;
        outputContainer.classList.add('active');
    }

    // Input change event listeners
    [utmDestination, utmPartner, utmSource, utmMedium, utmCampaign].forEach(input => {
        input.addEventListener('input', buildLiveUrl);
    });

    // Quick-select dynamic triggers helper
    function setupQuickSelect(rowId, inputId) {
        const row = document.getElementById(rowId);
        const input = document.getElementById(inputId);
        if (row && input) {
            row.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('hub-tag-btn')) {
                    row.querySelectorAll('.hub-tag-btn').forEach(btn => btn.classList.remove('active'));
                    target.classList.add('active');
                    
                    const value = target.getAttribute('data-slug') || target.getAttribute('data-val');
                    input.value = value;
                    buildLiveUrl();
                }
            });
        }
    }

    setupQuickSelect('partnerQuickSelect', 'utmPartner');
    setupQuickSelect('sourceQuickSelect', 'utmSource');
    setupQuickSelect('mediumQuickSelect', 'utmMedium');

    // Action button listeners
    document.getElementById('btnCopyUtm').addEventListener('click', () => {
        const urlToCopy = liveUrlOutput.textContent;
        if (urlToCopy && !urlToCopy.startsWith('[')) {
            navigator.clipboard.writeText(urlToCopy).then(() => {
                safeToast('Tracked campaign URL copied directly to clipboard!');
            }).catch(err => {
                safeToast(`Clipboard execution failure: ${err}`);
            });
        }
    });

    document.getElementById('btnTestUtm').addEventListener('click', () => {
        const targetUrl = liveUrlOutput.textContent;
        if (targetUrl && !targetUrl.startsWith('[')) {
            safeToast(`Initiating simulation to: ${targetUrl}`);
            setTimeout(() => {
                window.open(targetUrl, '_blank');
            }, 500);
        }
    });

    // 5. Setup Resource Hub Tabs Controller
    const tabsNav = document.querySelectorAll('.hub-tab-nav');
    const tabPanes = document.querySelectorAll('.hub-tab-pane');

    tabsNav.forEach(tab => {
        tab.addEventListener('click', () => {
            tabsNav.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.style.display = 'none');

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Compliance Copy text-copier hookups
    document.querySelectorAll('.copy-block-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy-target');
            const targetText = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(targetText).then(() => {
                safeToast('Template body copied to clipboard successfully.');
            }).catch(err => {
                safeToast(`Copy failure: ${err}`);
            });
        });
    });

    // Render Initial State on Launch
    buildLiveUrl();
})();