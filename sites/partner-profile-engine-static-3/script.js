// Set Year in Footer Dynamically
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Sticky Header scroll styling effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Trigger dynamic system notifications
        function triggerToast(message) {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
            container.appendChild(toast);

            // Auto-destruction of toast element after delay
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px) scale(0.9)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }

        // Copy dynamic partner URLs to clipboard with alert state
        function copyPartnerLink(slug) {
            const url = `https://moonshine.partners/partners/${slug}/index.html`;
            navigator.clipboard.writeText(url).then(() => {
                triggerToast(`Copied URL: moonshine.partners/partners/${slug}`);
            }).catch(err => {
                triggerToast(`Error copying link: ${err}`);
            });
        }

        // Bookmark and save affiliate cards inside localstorage cache
        function toggleFavorite(id, btn) {
            let favorites = JSON.parse(localStorage.getItem('moonshine_favorites')) || [];
            
            if (favorites.includes(id)) {
                favorites = favorites.filter(fav => fav !== id);
                btn.classList.remove('active');
                triggerToast('Removed from saved profiles.');
            } else {
                favorites.push(id);
                btn.classList.add('active');
                triggerToast('Saved to your dashboard directory!');
            }
            localStorage.setItem('moonshine_favorites', JSON.stringify(favorites));
        }

        // Filtering & live searching system in directory grid
        const searchInput = document.getElementById('directorySearch');
        const filterTabs = document.querySelectorAll('.filter-tab');
        const partnerCards = document.querySelectorAll('.partner-card');

        function filterPartners() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');

            partnerCards.forEach(card => {
                const name = card.getAttribute('data-name');
                const market = card.getAttribute('data-market') ? card.getAttribute('data-market').toLowerCase() : '';
                const specialty = card.getAttribute('data-specialty');
                
                const matchesSearch = name.includes(searchTerm) || market.includes(searchTerm);
                const matchesFilter = (activeFilter === 'all') || (specialty === activeFilter);

                if (matchesSearch && matchesFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterPartners);
        }

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterPartners();
            });
        });

        // ==========================================
        // WORKSPACE STUDIO GENERATOR LOGIC
        // ==========================================
        const inputName = document.getElementById('input-partner-name');
        const inputTitle = document.getElementById('input-partner-title');
        const inputFunding = document.getElementById('input-partner-funding');
        const inputDesc = document.getElementById('input-partner-desc');

        // Target Preview IDs
        const genAvatar = document.getElementById('gen-avatar');
        const genName = document.getElementById('gen-name');
        const genTitle = document.getElementById('gen-title');
        const genDesc = document.getElementById('gen-desc');
        const genFunding = document.getElementById('gen-funding');
        const genTags = document.getElementById('gen-tags');

        // Hero Target Sync
        const heroInitials = document.getElementById('live-card-initials');
        const heroName = document.getElementById('live-card-name');
        const heroTitle = document.getElementById('live-card-title');
        const heroDesc = document.getElementById('live-card-desc');
        const heroFunding = document.getElementById('live-card-funding');
        const heroTags = document.getElementById('live-card-tags');

        // Console logger helper
        function appendConsoleLog(system, message) {
            const consoleBox = document.getElementById('terminal-console');
            const timestamp = new Date().toTimeString().split(' ')[0];
            const logEntry = document.createElement('div');
            logEntry.innerHTML = `[${timestamp}] <span class="text-green">${system}:</span> ${message}`;
            consoleBox.appendChild(logEntry);
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        function updateLivePreviews() {
            const name = inputName.value || "Partner Name";
            const title = inputTitle.value || "Fintech Advisor";
            const funding = inputFunding.value || "$1,000,000";
            const desc = inputDesc.value || "";
            
            // Generate initials
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            // Preview panels
            genAvatar.textContent = initials;
            genName.textContent = name;
            genTitle.textContent = title;
            genDesc.textContent = desc;
            genFunding.textContent = funding;

            // Hero sync
            heroInitials.textContent = initials;
            heroName.textContent = name;
            heroTitle.textContent = title;
            heroDesc.textContent = desc;
            heroFunding.textContent = funding;

            // Render selected tags in both previews
            const activePills = document.querySelectorAll('.neobrutalist-pill.active');
            let tagHTML = '';
            activePills.forEach(pill => {
                tagHTML += `<span class="mock-tag">${pill.textContent}</span>`;
            });

            genTags.innerHTML = tagHTML || `<span class="mock-tag">Capital Affiliate</span>`;
            heroTags.innerHTML = tagHTML || `<span class="mock-tag">Capital Affiliate</span>`;

            // Update domain path display
            const domainSlug = name.toLowerCase().replace(/\s+/g, '-');
            document.getElementById('live-url-indicator').textContent = `moonshine.partners/${domainSlug}`;
        }

        // Hook Input listeners
        inputName.addEventListener('input', () => {
            updateLivePreviews();
            appendConsoleLog('NOTION SYNC', `Partner name updated properties dynamically.`);
        });
        inputTitle.addEventListener('input', updateLivePreviews);
        inputFunding.addEventListener('input', updateLivePreviews);
        inputDesc.addEventListener('input', updateLivePreviews);

        // Neobrutalist Specialty Pill Logic
        function togglePill(element) {
            element.classList.toggle('active');
            updateLivePreviews();
            triggerToast(`Layout Tag updated: ${element.textContent}`);
            appendConsoleLog('PILL SELECTOR', `Toggled specialty tags criteria mapping: [${element.textContent}]`);
        }

        // Copy dynamic pill selector configurations
        function copyNotionPillConfig() {
            const activePills = Array.from(document.querySelectorAll('.neobrutalist-pill.active')).map(p => p.textContent);
            const configPayload = {
                partner_id: inputName.value.toLowerCase().replace(/\s+/g, '-'),
                configured_specialties: activePills,
                timestamp: new Date().toISOString(),
                author: "Moonshine Layout Studio v2.5"
            };
            
            navigator.clipboard.writeText(JSON.stringify(configPayload, null, 2)).then(() => {
                triggerToast("Notion Partner Configuration JSON copied to clipboard!");
                appendConsoleLog('EXPORT', 'Copied current tag schema settings directly to host clipboard.');
            });
        }

        // AI Notion-to-Static Optimizer
        function optimizeBio() {
            triggerToast("AI Agent: Polishing bio content and generating Vercel SEO tags...");
            appendConsoleLog('AI_AGENT', 'Running tone and conversions optimizer logic on raw copy bio input...');
            
            setTimeout(() => {
                const optimizedTexts = [
                    "Empowering enterprise-grade scaleups with institutional, non-dilutive asset monetization instruments and tactical line of credit configurations.",
                    "Pioneering structured debt architecture to yield optimal treasury optimization without diluting precious founder equity stakes.",
                    "Unlocking tailored liquidity pipelines for hyper-scaling companies via automated underwriting mapping rules and strategic venture alignments."
                ];
                // Select a random variation
                const selected = optimizedTexts[Math.floor(Math.random() * optimizedTexts.length)];
                inputDesc.value = selected;
                
                // Add SEO tag feedback
                const metaTitle = `${inputName.value} | ${inputTitle.value}`;
                const mockSeo = `<meta name="title" content="${metaTitle}">\n<meta name="description" content="${selected.substring(0, 150)}...">\n<meta name="keywords" content="fintech, revenue financing, venture capital debt, partner engine">\n<meta name="vercel-deployment-mode" content="static-optimized">`;
                
                document.getElementById('seo-meta-output').textContent = mockSeo;
                triggerToast("Fintech Bio Polished & SEO deployment tags compiled!");
                appendConsoleLog('AI_AGENT', 'Bio content optimized and Vercel edge SEO tags rendered.');
                
                updateLivePreviews();
            }, 1000);
        }

        // Toggle Preview mobile/desktop state
        function toggleViewMode(mode) {
            const wrapper = document.getElementById('preview-frame-wrap');
            const btnDesk = document.getElementById('btn-view-desktop');
            const btnMob = document.getElementById('btn-view-mobile');

            if (mode === 'mobile') {
                wrapper.classList.add('mobile-view');
                btnMob.classList.add('active');
                btnDesk.classList.remove('active');
                appendConsoleLog('VIEWPORT', 'Flipped preview environment format output to Mobile.');
            } else {
                wrapper.classList.remove('mobile-view');
                btnDesk.classList.add('active');
                btnMob.classList.remove('active');
                appendConsoleLog('VIEWPORT', 'Flipped preview environment format output to Desktop.');
            }
        }

        // Firebase simulated saves
        function simulateFirebaseSave() {
            triggerToast("Firebase Firestore: Saving layout artifact to Cloud Storage...");
            appendConsoleLog('FIREBASE', 'Sending transaction patch write request into path "users/uid_98721/configs"...');
            setTimeout(() => {
                triggerToast("Artifact successfully written to Firebase Firestore DB!");
                appendConsoleLog('FIREBASE', 'Database transaction processed successfully. Document ref updated: "config_doc_81273".');
            }, 8000 * 0.1);
        }

        // Google Picker simulation functions
        function openGooglePickerModal() {
            document.getElementById('google-picker-modal').style.display = 'flex';
            appendConsoleLog('GOOGLE_PICKER', 'Connecting to Google Drive dynamic storage folder API stream...');
        }

        function closeGooglePickerModal() {
            document.getElementById('google-picker-modal').style.display = 'none';
        }

        function selectDriveAsset(initials, url) {
            document.getElementById('google-drive-url').value = url;
            genAvatar.textContent = initials;
            heroInitials.textContent = initials;
            closeGooglePickerModal();
            triggerToast(`Google Picker Asset Loaded: ${url}`);
            appendConsoleLog('GOOGLE_PICKER', `Selected storage file target: "${url}"`);
        }

        // Stripe modal operations
        let selectedTier = 'Enterprise';
        let selectedPrice = '$299/mo';
        function openStripeModal() {
            document.getElementById('stripe-checkout-modal').style.display = 'flex';
        }
        function closeStripeModal() {
            document.getElementById('stripe-checkout-modal').style.display = 'none';
        }
        function selectStripeTier(tier, price, cardId) {
            document.querySelectorAll('.stripe-tier-card').forEach(c => c.classList.remove('active'));
            document.getElementById(cardId).classList.add('active');
            selectedTier = tier;
            selectedPrice = price;
        }
        function processSimulatedSubscriptionPayment() {
            triggerToast(`Stripe Subscriptions: Processing payment for ${selectedTier} plan...`);
            appendConsoleLog('STRIPE_API', `Requesting subscription checkout overlay endpoint for billing reference "${selectedTier}"...`);
            setTimeout(() => {
                document.getElementById('billing-status-pill').innerHTML = `<span class="status-dot connected"></span> Active Package: ${selectedTier}`;
                triggerToast(`Stripe Billing Activated: ${selectedTier} tier processed successfully!`);
                appendConsoleLog('STRIPE_API', `Subscription successfully created. Status: ACTIVE. Billing amount: ${selectedPrice}.`);
                closeStripeModal();
            }, 1000);
        }

        // Dynamic table matching values update
        let sTechRev = 300000;
        let sTechFico = 680;
        let sReRev = 500000;
        let sReFico = 700;
        let sLogRev = 150000;
        let sLogFico = 620;

        function updateSheetsGroundingRules() {
            sTechRev = parseInt(document.getElementById('sheet-saas-rev').value.replace(/,/g, '')) || 0;
            sTechFico = parseInt(document.getElementById('sheet-saas-fico').value) || 0;
            sReRev = parseInt(document.getElementById('sheet-re-rev').value.replace(/,/g, '')) || 0;
            sReFico = parseInt(document.getElementById('sheet-re-fico').value) || 0;
            sLogRev = parseInt(document.getElementById('sheet-log-rev').value.replace(/,/g, '')) || 0;
            sLogFico = parseInt(document.getElementById('sheet-log-fico').value) || 0;

            triggerToast("Google Sheets Grounding Matrix updated successfully!");
            appendConsoleLog('GOOGLESHEETS_GROUNDING', `Inlined qualification configurations update stored. SaaS: $${sTechRev}/FICO ${sTechFico}.`);
        }

        // AI Deal Route Matcher Engine Simulation
        function runAiRouteMatching() {
            const niche = document.getElementById('matcher-niche-select').value;
            const revInput = parseInt(document.getElementById('matcher-revenue').value) || 0;
            const ficoInput = parseInt(document.getElementById('matcher-fico').value) || 0;
            const outputLog = document.getElementById('matching-output-log');

            outputLog.textContent = "AI matcher scanning submitted credentials against grounded values...";
            appendConsoleLog('AI_ROUTE_MATCHER', `Initializing decision tree assessment for: Niche=[${niche}], Rev=[$${revInput}], FICO=[${ficoInput}]...`);

            setTimeout(() => {
                let pass = false;
                let targetMinRev = 0;
                let targetMinFico = 0;

                if (niche === 'SaaS & Tech') {
                    targetMinRev = sTechRev;
                    targetMinFico = sTechFico;
                } else if (niche === 'Real Estate') {
                    targetMinRev = sReRev;
                    targetMinFico = sReFico;
                } else if (niche === 'Logistics') {
                    targetMinRev = sLogRev;
                    targetMinFico = sLogFico;
                }

                if (revInput >= targetMinRev && ficoInput >= targetMinFico) {
                    pass = true;
                }

                if (pass) {
                    outputLog.innerHTML = `<span class="text-green">RULE MATCH PASSED!</span>\nRouting target: ${inputName.value || 'Danielle Hart'} (ID: ${inputName.value.toLowerCase().replace(/\s+/g, '-')})\nPipeline Destination: NOTION_DEALS_MAIN\nScore rating: Excellent [95%]`;
                    triggerToast("AI Route Matcher: Lead criteria match passed!");
                    appendConsoleLog('AI_ROUTE_MATCHER', `Matching route validated. Underwriting corridor passed rules for target: "${inputName.value}".`);
                } else {
                    outputLog.innerHTML = `<span class="text-orange">CRITERIA UNMET: ROUTED TO MANUAL REVIEW</span>\nDestination: General Incubation Queue\nReasoning: Metrics fall short of minimum requirements (Rev Target: $${targetMinRev}, FICO Target: ${targetMinFico})`;
                    triggerToast("AI Route Matcher: Criteria unmet. Routed to alternative queue.");
                    appendConsoleLog('AI_ROUTE_MATCHER', `Lead criteria below requirements threshold. Auto routed to incubator workspace queue.`);
                }
            }, 1000);
        }

        // Simulated Lead capture from preview card
        function triggerDirectLeadIntake() {
            triggerToast("Simulator Interface: Mock application form submitted.");
            appendConsoleLog('CLIENT_INTAKE', "Fired client application payload checkout logic.");
            
            // Auto route matching simulation
            const revenueMock = 600000;
            const ficoMock = 720;
            const nicheMock = "SaaS & Tech";

            setTimeout(() => {
                appendConsoleLog('API_ROUTE', "Routing REST post command target to endpoint /api/capture-lead-to-notion...");
                
                // Add lead to live stream tracker
                const feedBox = document.getElementById('tracker-feed-box');
                const leadsVal = document.getElementById('val-pipelines');
                
                const randomId = Math.floor(Math.random() * 1000) + 8000;
                let curCount = parseInt(leadsVal.textContent) || 24;
                leadsVal.textContent = curCount + 1;

                const row = document.createElement('div');
                row.className = 'tracker-feed-row';
                row.innerHTML = `<span>Lead #9${randomId} targeting ${nicheMock}</span><span class="feed-success">Routed [Notion DB]</span>`;
                
                feedBox.insertBefore(row, feedBox.firstChild);
                if (feedBox.children.length > 3) {
                    feedBox.removeChild(feedBox.lastChild);
                }

                triggerToast("Notion capture successful! Pipeline database refreshed.");
                appendConsoleLog('NOTION_SYNC', `Created new transaction document inside target Notion workspace: "Lead #9${randomId}"`);
            }, 8000 * 0.1);
        }

        // Toggle Realtime database services
        function toggleRealtimeService(dotId, serviceName) {
            const dot = document.getElementById(dotId);
            const metaDotMap = {
                'firebase-state': 'meta-firebase',
                'supabase-state': 'meta-supabase'
            };
            const metaDot = document.getElementById(metaDotMap[dotId]);

            dot.classList.toggle('connected');
            if (metaDot) metaDot.classList.toggle('connected');

            if (dot.classList.contains('connected')) {
                triggerToast(`${serviceName} connected.`);
                appendConsoleLog('REALTIME_ENGINE', `Opened communication pathway for stream channel: ${serviceName}.`);
            } else {
                triggerToast(`${serviceName} connection severed.`);
                appendConsoleLog('REALTIME_ENGINE', `Pathway terminated for service channel: ${serviceName}.`);
            }
        }

        // Load card from directory down into layout studio
        function loadPartnerToWorkspace(name, title, bio, funding) {
            inputName.value = name;
            inputTitle.value = title;
            inputDesc.value = bio;
            inputFunding.value = funding;
            
            updateLivePreviews();
            triggerToast(`Synced '${name}' properties directly into Studio Workspace.`);
            document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
            appendConsoleLog('STUDIO_WORKSPACE', `Loaded layout profile dataset target: "${name}" from memory.`);
        }

        // Anonymized Live Deal Flow updates simulation
        setInterval(() => {
            const feedBox = document.getElementById('tracker-feed-box');
            if (!feedBox) return;
            const leadsVal = document.getElementById('val-pipelines');
            
            const randomId = Math.floor(Math.random() * 1000) + 8000;
            const targetSectors = ["Ecommerce", "Real Estate", "Logistics", "Commercial Contracts"];
            const sector = targetSectors[Math.floor(Math.random() * targetSectors.length)];
            const matchRating = Math.floor(Math.random() * 20) + 80;

            // Increment count safely
            let curCount = parseInt(leadsVal.textContent) || 24;
            leadsVal.textContent = curCount + 1;

            const row = document.createElement('div');
            row.className = 'tracker-feed-row';
            row.innerHTML = `<span>Lead #9${randomId} targeting ${sector}</span><span class="feed-success">Matched [${matchRating}%]</span>`;
            
            feedBox.insertBefore(row, feedBox.firstChild);
            if (feedBox.children.length > 5) {
                feedBox.removeChild(feedBox.lastChild);
            }
        }, 12000);

        // ==========================================
        // DEVELOPER CODE STENCILS CONTROLLER
        // ==========================================
        const stencils = {
            'notion-register': `/**
 * POST /api/register-notion-partner
 * Webhook triggered to establish new partner database record and execute static auto-deploy steps.
 */
import { Client } from '@notionhq/client';
import axios from 'axios';

export async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { partnerName, specialty, maxFunding, rawBio, stripeSessionId } = req.body;
  const notion = new Client({ auth: process.env.NOTION_API_KEY }); // Put secret in Vercel environment

  try {
    // 1. Write the new configuration to your master database in Notion
    const page = await notion.pages.create({
      parent: { database_id: process.env.NOTION_PARTNERS_DB_ID },
      properties: {
        'Partner Name': { title: [{ text: { content: partnerName } }] },
        'Specialty': { select: { name: specialty } },
        'Capital Assignment Limit': { number: parseFloat(maxFunding.replace(/[^0-9.]/g, '')) },
        'Strategic Bio': { rich_text: [{ text: { content: rawBio } }] },
        'Stripe Checkout Session': { rich_text: [{ text: { content: stripeSessionId } }] },
        'Vercel Auto Deploy Status': { checkbox: true }
      }
    });

    // 2. Trigger automatic redeployment of your edge host build via GitHub actions payload hook
    await axios.post('https://api.github.com/repos/moonshine-capital/partner-desk/dispatches', {
      event_type: 'vercel-rebuild-hook',
      client_payload: { partner_slug: partnerName.toLowerCase().replace(/\\s+/g, '-') }
    }, {
      headers: { 
        'Authorization': \`Bearer \${process.env.GITHUB_DEPLOY_TOKEN}\`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return res.status(200).json({ success: true, pageId: page.id, message: 'Notion database synchronized & Vercel build triggered.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}`,
            'notion-lead': `/**
 * POST /api/capture-lead-to-notion
 * Captures live application entries directly into nested Notion Pipeline Database.
 */
import { Client } from '@notionhq/client';

export async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { partnerId, leadRevenue, creditScore, clientEmail, matchingStatus } = req.body;
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const entry = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DEALS_DB_ID },
      properties: {
        'Title': { title: [{ text: { content: \`Deal ID: \${partnerId}-\${Math.floor(Math.random() * 10000)}\` } }] },
        'Annual Revenue Target': { number: parseFloat(leadRevenue) },
        'Credit Score FICO': { number: parseInt(creditScore) },
        'Client Email Address': { email: clientEmail },
        'Routing Status': { select: { name: matchingStatus } },
        'Attribution Partner': { relation: [{ id: process.env.PARTNER_NOTION_REF_ID }] }
      }
    });

    return res.status(200).json({ success: true, databasePageId: entry.id });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}`,
            'stripe-subs': `/**
 * Stripe Billing & Subscriptions API Integration
 * Maps dynamic checkout hooks to partner profile generation workspaces.
 */
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Create secure checkout overlay sessions
export async function createCheckoutSession(userId, planType) {
  const priceId = planType === 'Enterprise' ? 'price_enterprise_id' : 'price_pro_id';
  
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: 'https://moonshine.capital/workspace?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://moonshine.capital/billing',
    client_reference_id: userId,
  });
}`,
            'github-sync': `/**
 * Github Repository API integration stencil.
 * Commits edge deployed JSON configuration parameters into source host directory.
 */
import { Octokit } from '@octokit/rest';

async function commitPartnerPayload(partnerSlug, layoutPayload) {
  const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
  
  const contentEncoded = Buffer.from(JSON.stringify(layoutPayload, null, 2)).toString("base64");
  
  return await octokit.repos.createOrUpdateFileContents({
    owner: "moonshine-capital",
    repo: "vercel-static-partners",
    path: \`config/partners/\${partnerSlug}.json\`,
    message: \`Production synchronization: Syncing layouts for partner \${partnerSlug}\`,
    content: contentEncoded,
    committer: { name: "Moonshine Engine Bot", email: "engine-sync@moonshine.capital" }
  });
}`,
            'hubspot-crm': `/**
 * HubSpot CRM Contacts & Pipeline Sync API Stencil
 * Direct push of validated client data applications to hub pipeline slots.
 */
import hubspot from '@hubspot/api-client';

async function syncContactToHubSpot(clientData, attributionPartner) {
  const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
  
  const contactProperties = {
    email: clientData.email,
    firstname: clientData.firstName,
    lastname: clientData.lastName,
    associated_partner: attributionPartner,
    deal_stage: "underwriting_evaluation_inbox"
  };
  
  return await hubspotClient.crm.contacts.basicApi.create({ properties: contactProperties });
}`
        };

        let activeStencilId = 'notion-register';

        function switchStencilTab(stencilId, tabBtn) {
            const tabBtns = document.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');

            activeStencilId = stencilId;
            const codeBox = document.getElementById('stencil-code-box');
            codeBox.textContent = stencils[stencilId] || "Stencil not found.";
        }

        function copyCurrentCodeStencil() {
            const currentCode = stencils[activeStencilId];
            navigator.clipboard.writeText(currentCode).then(() => {
                triggerToast("Code stencil copied to clipboard!");
            });
        }

        // Initialize Workspace with defaults
        document.addEventListener('DOMContentLoaded', () => {
            updateLivePreviews();
            switchStencilTab('notion-register', document.querySelector('.tab-btn.active'));
        });