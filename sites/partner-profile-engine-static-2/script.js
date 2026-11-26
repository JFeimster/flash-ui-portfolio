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

        // Simulate Navigation internally on mock profiles
        function simulateNav(slug) {
            triggerToast(`Simulation: Navigating to '/partners/${slug}/index.html'`);
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

        // Interactive UI Blueprint breakdown highlights
        const blueprintParts = {
            hero: {
                title: "Partner Hero & Bio",
                desc: "The dynamic entry screen of your custom space. Spotlights your distinct strategic positioning, operational target niche, and professional history instantly, avoiding generic marketing design."
            },
            ctas: {
                title: "Integrated CTAs & Action Blocks",
                desc: "Clean buttons linked seamlessly with system referral channels, instant lead setups, and call integration systems to maximize client signups safely."
            },
            tools: {
                title: "Scorecard & Dynamic Utilities",
                desc: "A fully active collection of functional widgets that help visitors map out their cash positions, business balance status, and funding potential in seconds."
            },
            checklist: {
                title: "Document Requirement Checklist",
                desc: "An automated guide detailing the precise underwriting files required, ensuring complete compliance and drastically minimizing processing timelines."
            },
            referrals: {
                title: "Professional Partner Entry Node",
                desc: "A dedicated interface segment explicitly configured for supporting tax professionals, financial planners, and strategic business consultants."
            }
        };

        const rows = document.querySelectorAll('.blueprint-row');
        const infoTitle = document.getElementById('anatomyTitle');
        const infoDesc = document.getElementById('anatomyDesc');

        rows.forEach(row => {
            row.addEventListener('click', () => {
                rows.forEach(r => r.classList.remove('active'));
                row.classList.add('active');
                
                const part = row.getAttribute('data-part');
                if (blueprintParts[part]) {
                    infoTitle.textContent = blueprintParts[part].title;
                    infoDesc.textContent = blueprintParts[part].desc;
                    triggerToast(`Viewing: ${blueprintParts[part].title}`);
                }
            });
        });

        // Filtering & live searching system in directory grid
        const searchInput = document.getElementById('directorySearch');
        const filterTabs = document.querySelectorAll('.filter-tab');
        const partnerCards = document.querySelectorAll('.partner-card');

        function filterPartners() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');

            partnerCards.forEach(card => {
                const name = card.getAttribute('data-name');
                const market = card.getAttribute('data-market').toLowerCase();
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

        searchInput.addEventListener('input', filterPartners);

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
        }

        // Hook Input listeners
        inputName.addEventListener('input', updateLivePreviews);
        inputTitle.addEventListener('input', updateLivePreviews);
        inputFunding.addEventListener('input', updateLivePreviews);
        inputDesc.addEventListener('input', updateLivePreviews);

        // Neobrutalist Specialty Pill Logic
        function togglePill(element) {
            element.classList.toggle('active');
            updateLivePreviews();
            triggerToast(`Layout Tag updated: ${element.textContent}`);
        }

        // Copy dynamic pill selector configurations
        function copyNotionPillConfig() {
            const activePills = Array.from(document.querySelectorAll('.neobrutalist-pill.active')).map(p => p.textContent);
            const configPayload = {
                partner_id: inputName.value.toLowerCase().replace(/\s+/g, '-'),
                configured_specialties: activePills,
                timestamp: new Date().toISOString(),
                author: "Moonshine Layout Studio"
            };
            
            navigator.clipboard.writeText(JSON.stringify(configPayload, null, 2)).then(() => {
                triggerToast("Notion Partner Configuration JSON copied to clipboard!");
            });
        }

        // AI Notion-to-Static Optimizer
        function optimizeBio() {
            triggerToast("AI Agent: Polishing raw text for fintech appeal...");
            
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
                const mockSeo = `<!-- AI Optimized SEO Deployment Tags -->\n<meta name="description" content="${selected.substring(0, 150)}...">\n<meta name="keywords" content="fintech, revenue financing, venture capital debt, partner engine">`;
                triggerToast("Fintech Bio Polished & SEO deployment tags compiled!");
                console.log(mockSeo);
                
                updateLivePreviews();
            }, 1000);
        }

        // AI Deal-Route Matcher Engine (Simulated Logic)
        function evaluateDealRoute() {
            const revenue = document.getElementById('route-rev').value;
            const credit = document.getElementById('route-credit').value;
            const routeOutput = document.getElementById('route-output-box');

            routeOutput.innerHTML = "Processing criteria via underwriter logic models...";
            
            setTimeout(() => {
                const numericCredit = parseInt(credit.replace(/\D/g, '')) || 650;
                const numericRev = parseInt(revenue.replace(/\D/g, '')) || 50000;
                
                let matchingStatus = "";
                let routeCode = "ROUTE_REJECTED";
                let matchedPartner = "General Inbound Queue";
                
                if (numericCredit > 700 && numericRev > 500000) {
                    matchingStatus = "⚡ EXCELLENT MATCH - Optimal underwriting corridor unlocked.";
                    routeCode = "ROUTE_NOTION_PIPELINE_LEVEL_3";
                    matchedPartner = inputName.value || "Danielle Hart";
                } else if (numericCredit > 620 && numericRev > 100000) {
                    matchingStatus = "✔ STANDARD MATCH - Capital bridge tier assigned.";
                    routeCode = "ROUTE_NOTION_PIPELINE_LEVEL_2";
                    matchedPartner = "Alternative Desk Network";
                } else {
                    matchingStatus = "⚠ SUB-OPTIMAL - Manual structural review required.";
                    routeCode = "ROUTE_NOTION_PIPELINE_LEVEL_1";
                    matchedPartner = "General Incubation Workspace";
                }

                routeOutput.innerHTML = `MATCH STATUS: ${matchingStatus}\nROUTED PARTNER: ${matchedPartner}\nTARGET PIPELINE ID: ${routeCode}\nSTRICT RULES: PASSED\nCAPTURED TO NOTION: DB_DEALS_MAIN`;
                triggerToast(`AI Route Matcher mapped lead to: ${matchedPartner}`);
            }, 1200);
        }

        // Interactive integrations activation
        function toggleIntegration(elementId, toastMessage) {
            const dot = document.getElementById(elementId);
            dot.classList.toggle('connected');
            if(dot.classList.contains('connected')) {
                triggerToast(toastMessage);
            } else {
                triggerToast("System disconnected from direct endpoint stream.");
            }
        }

        // Simulate Stripe billing checkout routing
        function simulateStripeCheckout() {
            triggerToast("Stripe checkout session initialized... launching package portal.");
            setTimeout(() => {
                const url = "https://checkout.stripe.com/pay/cs_live_moonshine_partner_engine";
                triggerToast(`Redirecting simulated gateway session to: ${url}`);
            }, 1000);
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
        }

        // Anonymized Live Deal Flow updates simulation
        setInterval(() => {
            const feedBox = document.getElementById('tracker-feed-box');
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
        }, 8000);

        // ==========================================
        // DEVELOPER CODE STENCILS CONTROLLER
        // ==========================================
        const stencils = {
            'notion-register': `/**
 * POST /api/register-notion-partner
 * Triggered upon new partner onboarding checkout completion.
 * Maps parameters directly to Notion Partner Registry & triggers static Vercel rebuild.
 */
import { Client } from '@notionhq/client';

export async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { partnerName, specialty, maxFunding, rawBio } = req.body;
  const notion = new Client({ auth: process.env.NOTION_API_KEY }); // Put secret in Vercel environment

  try {
    const page = await notion.pages.create({
      parent: { database_id: process.env.NOTION_PARTNERS_DB_ID },
      properties: {
        'Partner Name': { title: [{ text: { content: partnerName } }] },
        'Specialty': { select: { name: specialty } },
        'Capital Assignment Limit': { number: parseFloat(maxFunding.replace(/[^0-9.]/g, '')) },
        'Strategic Bio': { rich_text: [{ text: { content: rawBio } }] },
        'Vercel Auto Deploy Status': { checkbox: true }
      }
    });

    // Trigger Github deploy action payload hook
    await fetch('https://api.github.com/repos/moonshine-capital/partner-desk/dispatches', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${process.env.GITHUB_DEPLOY_TOKEN}\`, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({ event_type: 'vercel-rebuild-hook' })
    });

    return res.status(200).json({ success: true, pageId: page.id, message: 'Notion database synchronized & Vercel build triggered.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}`,
            'notion-lead': `/**
 * POST /api/capture-lead-to-notion
 * High performance lead application capture mapping straight 
 * into nested Notion Deals Pipeline database with explicit Partner ID validation.
 */
import { Client } from '@notionhq/client';

export async function handler(req, res) {
  const { partnerId, leadRevenue, creditScore, clientEmail } = req.body;
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const entry = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DEALS_DB_ID },
      properties: {
        'Title': { title: [{ text: { content: \`Deal for Partner: \${partnerId}\` } }] },
        'Target Volume': { number: parseFloat(leadRevenue.replace(/[^0-9.]/g, '')) },
        'FICO Grade': { number: parseInt(creditScore) },
        'Client Email Address': { email: clientEmail },
        'Associated Partner ID Reference': { relation: [{ id: process.env.PARTNER_NOTION_REF_ID }] }
      }
    });

    return res.status(200).json({ success: true, databasePageId: entry.id });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}`,
            'github-sync': `/**
 * Github Deployment Webhook Hookup Stencil
 * Commits layout configuration artifacts directly as JSON files inside targeted build structures.
 */
const { Octokit } = require("@octokit/rest");

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
 * HubSpot CRM API Contact Pipeline Synchronization
 * Auto registers active deals pipeline into CRM tracking matrices.
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

        function switchStencilTab(stencilId, tabBtn) {
            // Remove active tabs
            const tabBtns = document.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');

            const codeBox = document.getElementById('stencil-code-box');
            codeBox.textContent = stencils[stencilId] || "Stencil not found.";
        }

        // Initialize Workspace with defaults
        document.addEventListener('DOMContentLoaded', () => {
            updateLivePreviews();
            switchStencilTab('notion-register', document.querySelector('.tab-btn.active'));
        });