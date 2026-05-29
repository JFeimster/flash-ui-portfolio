/**
 * Moonshine Capital Partners - Affiliate Resource Hub & UTM Campaign Link Builder
 * Integrated workspace script for partner platforms.
 * Self-renders a high-fidelity, interactive marketing console.
 */

(function () {
    // Inject Styles to match the Moonshine brand identity and CSS variables
    const styles = `
        .mcp-hub-wrapper {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #F9FAF1;
            background: rgba(18, 24, 36, 0.75);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 32px;
            margin: 40px auto;
            max-width: 1200px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .mcp-hub-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 24px;
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 16px;
        }

        .mcp-hub-title-area h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.2;
            color: #F9FAF1;
            margin-bottom: 8px;
        }

        .mcp-hub-title-area h2 span {
            color: #00FF66;
        }

        .mcp-hub-subtitle {
            color: #9CA3AF;
            font-size: 0.95rem;
            max-width: 700px;
        }

        .mcp-badge {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(0, 255, 102, 0.1);
            color: #00FF66;
            border: 1px solid rgba(0, 255, 102, 0.2);
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .mcp-hub-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 32px;
        }

        @media (max-width: 968px) {
            .mcp-hub-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Forms & Inputs */
        .mcp-section-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mcp-form-group {
            margin-bottom: 18px;
        }

        .mcp-label {
            display: block;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #9CA3AF;
            margin-bottom: 6px;
        }

        .mcp-input, .mcp-select {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            padding: 12px 14px;
            color: #F9FAF1;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }

        .mcp-input:focus, .mcp-select:focus {
            outline: none;
            border-color: #00FF66;
            background: rgba(0, 0, 0, 0.5);
            box-shadow: 0 0 10px rgba(0, 255, 102, 0.15);
        }

        /* Output Console */
        .mcp-console {
            background: #0B0F17;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 20px;
            margin-top: 24px;
            position: relative;
        }

        .mcp-console-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: #FF5722;
        }

        .mcp-link-display {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            padding: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: #00FF66;
            word-break: break-all;
            margin-bottom: 16px;
            min-height: 44px;
            display: flex;
            align-items: center;
        }

        /* Custom buttons following the base component Neobrutalist design */
        .mcp-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 24px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            border: 2px solid transparent;
            text-decoration: none;
        }

        .mcp-btn-primary {
            background-color: #00FF66;
            color: #0B0F17;
            border-color: #00FF66;
            box-shadow: 4px 4px 0px 0px rgba(0, 255, 102, 0.2);
        }

        .mcp-btn-primary:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px #00FF66;
        }

        .mcp-btn-secondary {
            background-color: transparent;
            color: #F9FAF1;
            border-color: #F9FAF1;
            box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.1);
        }

        .mcp-btn-secondary:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px #F9FAF1;
            background-color: rgba(255, 255, 255, 0.05);
        }

        /* Swipe Copy Tabs */
        .mcp-tabs {
            display: flex;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 20px;
            gap: 4px;
        }

        .mcp-tab {
            background: none;
            border: none;
            color: #9CA3AF;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 10px 16px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .mcp-tab.active {
            color: #00FF66;
            border-bottom-color: #00FF66;
        }

        .mcp-swipe-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 20px;
            position: relative;
        }

        .mcp-swipe-body {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #9CA3AF;
            white-space: pre-wrap;
            margin-bottom: 20px;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mcp-swipe-body strong {
            color: #F9FAF1;
        }

        /* Brand Kit Grid */
        .mcp-brand-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 24px;
        }

        .mcp-asset-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .mcp-asset-info h4 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .mcp-asset-info p {
            font-size: 0.75rem;
            color: #9CA3AF;
        }

        .mcp-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #0B0F17;
            border: 2px solid #00FF66;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.25);
            color: #F9FAF1;
            padding: 12px 24px;
            border-radius: 4px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 0.85rem;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mcp-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;

    // Swipe Swipe Copy Library templates
    const swipeTemplates = {
        linkedin: `🚀 Ready to scale your operations but tired of filling out blind funding applications?

My new Partner Funding Desk with Moonshine Capital Partners is live! Instead of guesswork, calculate your actual readiness score in 60 seconds with our built-in real-time pipeline diagnostics.

Whether you're looking into SBA loans, flexible Revenue-Based Financing, or specialized Real Estate Bridge facilities, we've got you covered with deep underwriting automation.

👉 Check out my custom platform and run your readiness match immediately:
[TRACKING_URL]

#Fintech #CommercialFunding #SMEFinance #MoonshinePartners`,

        email: `Subject: Introducing Your New 24/48-Hour Funding Desk

Hi [First Name],

I wanted to reach out because business operators frequently run into a massive wall of friction when attempting to secure working capital: long credit applications, complex criteria, and zero transparency.

To fix this, I have teamed up with Moonshine Capital Partners to establish a direct-access public Funding Desk.

Through this portal, you can bypass the traditional friction points:
1. Run a 60-second diagnostic on your readiness score.
2. Select target tracks matching your business model (SBA, Revenue-Based Financing, Asset Backed, or Tier 1 Corporate Credit Building).
3. Access direct checklists mapping out underwriting requirements up front.

You can explore my customized workstation page and evaluate your setup here:
[TRACKING_URL]

Let's coordinate a quick strategic call once you review your matches.

Best regards,

[Your Name]
Partner, Moonshine Capital`,

        outbound: `Hey! Set up an interactive workspace page that maps out custom funding channels in real-time. You can run a self-service diagnostic score to check SBA & Revenue-based matches instantly without hard credit pulls. Let me know what your readiness tier says: [TRACKING_URL]`
    };

    // State object to manage variables inside the interactive system
    const state = {
        username: 'your-slug',
        destination: 'directory',
        source: 'linkedin',
        medium: 'social',
        campaign: 'partner_launch',
        generatedUrl: '',
        activeTab: 'linkedin'
    };

    // Auto-inject styles into head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    /**
     * Calculates and renders the finalized UTM marketing tracking link
     */
    function updateTrackingLink() {
        const base = window.location.origin || 'https://moonshine.cap';
        const slug = state.username.trim() ? state.username.toLowerCase().replace(/[^a-z0-9-_]/g, '') : 'your-slug';
        
        let path = '';
        if (state.destination === 'scorecard') {
            path = `/partners/${slug}?tool=scorecard`;
        } else if (state.destination === 'checklist') {
            path = `/partners/${slug}?tool=checklist`;
        } else {
            path = `/partners/${slug}`;
        }

        // Clean query variables
        const utmSource = encodeURIComponent(state.source || 'affiliate');
        const utmMedium = encodeURIComponent(state.medium || 'referral');
        const utmCampaign = encodeURIComponent(state.campaign || 'partner_desk');

        state.generatedUrl = `${base}${path}&utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
        
        // Update DOM elements
        const display = document.getElementById('mcp-generated-url');
        if (display) {
            display.textContent = state.generatedUrl;
        }

        // Update swipe copies with the new URL
        updateSwipeCard();
    }

    /**
     * Renders swipe copy with dynamic replacement rules
     */
    function updateSwipeCard() {
        const bodyEl = document.getElementById('mcp-swipe-body');
        if (!bodyEl) return;

        let template = swipeTemplates[state.activeTab];
        // Apply tracking URL replacement
        let processed = template.replace(/\[TRACKING_URL\]/g, state.generatedUrl);
        
        // Highlight critical variables for visual styling
        bodyEl.textContent = processed;
    }

    /**
     * Triggers a temporary toast notification message matching UI styling
     */
    function showToast(message) {
        const toast = document.getElementById('mcp-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    /**
     * Copies specified content text to clipboard securely
     */
    function copyText(text, successMsg) {
        if (!navigator.clipboard) {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast(successMsg);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => {
            showToast("Clipboard write failed. Please select manually.");
        });
    }

    /**
     * Renders the complete HTML template into target container
     */
    function renderHub(targetElement) {
        targetElement.innerHTML = `
            <div class="mcp-hub-wrapper">
                <div class="mcp-hub-header">
                    <div class="mcp-hub-title-area">
                        <span class="mcp-badge">Partner Toolkit v1.1</span>
                        <h2 style="margin-top: 10px;">Affiliate Hub & <span>UTM Campaign Link Builder</span></h2>
                        <p class="mcp-hub-subtitle">Equip your media platforms with conversion-focused tracking setups, dynamic text templates, and approved brand assets to align with Moonshine underwritings.</p>
                    </div>
                </div>

                <div class="mcp-hub-grid">
                    <!-- Column 1: Configurator -->
                    <div>
                        <h3 class="mcp-section-title">
                            <svg width="20" height="20" fill="none" stroke="#00FF66" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            Link Generator Configuration
                        </h3>

                        <div class="mcp-form-group">
                            <label class="mcp-label">Partner Slug (Your ID)</label>
                            <input type="text" id="mcp-input-username" class="mcp-input" value="hanneman" placeholder="e.g. hanneman, marcus-vance">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="mcp-form-group">
                                <label class="mcp-label">Workspace Destination</label>
                                <select id="mcp-select-destination" class="mcp-select">
                                    <option value="directory">Partner Base Profile</option>
                                    <option value="scorecard">Embedded Scorecard</option>
                                    <option value="checklist">Doc Prep Checklist</option>
                                </select>
                            </div>
                            <div class="mcp-form-group">
                                <label class="mcp-label">UTM Campaign Name</label>
                                <input type="text" id="mcp-input-campaign" class="mcp-input" value="partner_launch" placeholder="campaign name">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="mcp-form-group">
                                <label class="mcp-label">UTM Source</label>
                                <input type="text" id="mcp-input-source" class="mcp-input" value="linkedin" placeholder="e.g. linkedin, newsletter">
                            </div>
                            <div class="mcp-form-group">
                                <label class="mcp-label">UTM Medium</label>
                                <input type="text" id="mcp-input-medium" class="mcp-input" value="social" placeholder="e.g. social, email, referral">
                            </div>
                        </div>

                        <!-- Generated Tracking Console -->
                        <div class="mcp-console">
                            <div class="mcp-console-header">
                                <span>LIVE TRACKING LINK PROCESSED</span>
                                <span style="color: #00FF66;">ACTIVE SECURE REDIRECT</span>
                            </div>
                            <div id="mcp-generated-url" class="mcp-link-display">Generating...</div>
                            <div style="display: flex; gap: 12px;">
                                <button id="mcp-btn-copy-link" class="mcp-btn mcp-btn-primary" style="flex: 1;">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                    Copy Link
                                </button>
                                <button id="mcp-btn-test-link" class="mcp-btn mcp-btn-secondary" style="flex: 1;">
                                    Test Link
                                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Swipes & Creative Assets -->
                    <div>
                        <h3 class="mcp-section-title">
                            <svg width="20" height="20" fill="none" stroke="#FF5722" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            High-Conversion Outreach Templates
                        </h3>

                        <div class="mcp-tabs">
                            <button class="mcp-tab active" data-tab="linkedin">LinkedIn/Twitter</button>
                            <button class="mcp-tab" data-tab="email">Email Outreach</button>
                            <button class="mcp-tab" data-tab="outbound">Direct Message</button>
                        </div>

                        <div class="mcp-swipe-card">
                            <div id="mcp-swipe-body" class="mcp-swipe-body">Loading Swipes...</div>
                            <button id="mcp-btn-copy-swipe" class="mcp-btn mcp-btn-secondary" style="width: 100%; justify-content: center;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                Copy Swipe Template
                            </button>
                        </div>

                        <h3 class="mcp-section-title" style="margin-top: 32px;">
                            <svg width="20" height="20" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Brand Resources & Pitch Packs
                        </h3>
                        
                        <div class="mcp-brand-grid">
                            <div class="mcp-asset-card">
                                <div class="mcp-asset-info">
                                    <h4>Pitch Deck v2</h4>
                                    <p>High-res PDF guide</p>
                                </div>
                                <button class="mcp-btn mcp-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('Asset Simulation: Pitch Deck PDF download initiated.')">PDF</button>
                            </div>
                            <div class="mcp-asset-card">
                                <div class="mcp-asset-info">
                                    <h4>Brand Kit SVG</h4>
                                    <p>Vector assets & guidelines</p>
                                </div>
                                <button class="mcp-btn mcp-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('Asset Simulation: Vector brand kit download initiated.')">SVG</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Toast notification element -->
            <div id="mcp-toast" class="mcp-toast">Notification</div>
        `;

        // Attach Form Interactive Event Listeners
        const inputSlug = document.getElementById('mcp-input-username');
        const selectDest = document.getElementById('mcp-select-destination');
        const inputCampaign = document.getElementById('mcp-input-campaign');
        const inputSource = document.getElementById('mcp-input-source');
        const inputMedium = document.getElementById('mcp-input-medium');

        const listen = (element, key) => {
            if (!element) return;
            element.addEventListener('input', (e) => {
                state[key] = e.target.value;
                updateTrackingLink();
            });
        };

        listen(inputSlug, 'username');
        listen(selectDest, 'destination');
        listen(inputCampaign, 'campaign');
        listen(inputSource, 'source');
        listen(inputMedium, 'medium');

        // Copy Tracking URL
        const btnCopyLink = document.getElementById('mcp-btn-copy-link');
        if (btnCopyLink) {
            btnCopyLink.addEventListener('click', () => {
                copyText(state.generatedUrl, "UTM TRACKING LINK COPIED!");
            });
        }

        // Test Generated URL Link
        const btnTestLink = document.getElementById('mcp-btn-test-link');
        if (btnTestLink) {
            btnTestLink.addEventListener('click', () => {
                window.open(state.generatedUrl, '_blank');
            });
        }

        // Handle Swipe Tab Navigation Switches
        const tabs = document.querySelectorAll('.mcp-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                state.activeTab = e.target.getAttribute('data-tab');
                updateSwipeCard();
            });
        });

        // Copy Outreach Swipe Text
        const btnCopySwipe = document.getElementById('mcp-btn-copy-swipe');
        if (btnCopySwipe) {
            btnCopySwipe.addEventListener('click', () => {
                const swipeBody = document.getElementById('mcp-swipe-body').textContent;
                copyText(swipeBody, "SWIPE COPY TEMPLATE COPIED!");
            });
        }

        // Initialize state view limits
        updateTrackingLink();
    }

    // Auto initialization check inside host setups
    function checkAndInject() {
        const target = document.getElementById('affiliate-builder-target') || document.querySelector('[data-mcp-builder]');
        if (target) {
            renderHub(target);
        }
    }

    // Export globally for manual injection controls if needed
    window.initAffiliateHub = function (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            renderHub(el);
        }
    };

    // Execute setup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInject);
    } else {
        checkAndInject();
    }
})();