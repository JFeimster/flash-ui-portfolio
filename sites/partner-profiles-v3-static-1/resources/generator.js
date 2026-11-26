/**
 * Moonshine Capital Partners - Affiliate Resource Hub & Launch Kit Engine
 * File: resources/generator.js
 * 
 * High-performance, zero-dependency interactive logic for partner enablement, 
 * cold outreach template generation, UTM link builder, and product directories.
 */

(function () {
    'use strict';

    // Global Namespace
    const MoonshineHub = {
        // Mock Databases
        databases: {
            products: [
                {
                    id: "working-capital",
                    name: "Revenue-Based Working Capital",
                    category: "Working Capital",
                    speed: "24-48 Hours",
                    maxAmount: "$1,000,000",
                    factorRate: "1.11 - 1.35",
                    term: "3 to 18 Months",
                    minCredit: "550",
                    bestFor: "High-volume retail, e-commerce, and businesses with stable daily credit card sales.",
                    docs: ["3 Months Bank Statements", "Voided Check", "Driver's License ID"]
                },
                {
                    id: "sba-funding",
                    name: "SBA 7(a) Bridge & Term Loans",
                    category: "SBA Funding",
                    speed: "30-90 Days",
                    maxAmount: "$5,000,000",
                    factorRate: "Prime + 2.0% - 3.75%",
                    term: "10 to 25 Years",
                    minCredit: "680",
                    bestFor: "Long-term debt consolidation, commercial real estate acquisition, or major partner buyouts.",
                    docs: ["3 Years Tax Returns", "Year-To-Date P&L", "Debt Schedule", "Personal Financial Statement"]
                },
                {
                    id: "lines-of-credit",
                    name: "Flexible Revolving Line of Credit",
                    category: "Lines of Credit",
                    speed: "3-5 Business Days",
                    maxAmount: "$250,000",
                    factorRate: "8% - 24% APR",
                    term: "Revolving (Weekly/Monthly)",
                    minCredit: "620",
                    bestFor: "Contractors managing payroll gaps, developers purchasing initial inventory raw materials.",
                    docs: ["6 Months Bank Statements", "Current Balance Sheet", "AR Aging Report (Optional)"]
                },
                {
                    id: "equipment-finance",
                    name: "Surgical Equipment & Asset Leases",
                    category: "Working Capital",
                    speed: "48-72 Hours",
                    maxAmount: "$2,000,000",
                    factorRate: "6% - 18% Fixed APR",
                    term: "2 to 7 Years",
                    minCredit: "600",
                    bestFor: "Heavy machinery purchases, medical devices, fleet logistics additions with tax write-offs.",
                    docs: ["Equipment Quote / Invoice", "6 Months Bank Statements", "Corporate Tax Return"]
                }
            ],
            outreachTemplates: [
                {
                    id: "cold-email-niche",
                    name: "Niche-Specific Problem Solver",
                    channel: "Email",
                    description: "High-conversion template focusing strictly on industry pain points (e.g., equipment purchases or cash gaps).",
                    subject: "Structured capital options for [Niche] operators",
                    body: "Hi [Prospect Name],\n\nI was reviewing [Company Name]'s recent work in the [Niche] sector. One of the biggest structural bottlenecks we see for operators right now is managing high cash gaps between milestones and invoice payouts.\n\nI run a custom Commercial Funding Desk with Moonshine Capital Partners. We specialize in configuring [Specialty] lanes engineered exactly for your business model:\n\n• Capital Limits: Up to $5M tailored options\n• Speed: Approvals generated as fast as 24-48 hours\n• Structure: Non-dilutive working capital built to support expansion\n\nIf you are currently evaluating your equipment procurement schedules or simply looking to establish a dynamic revolving line of credit to buffer receivables, you can map your direct qualification index right here: [Affiliate Link]\n\nLet's coordinate a brief strategy session this week if you want to run through raw numbers.\n\nBest regards,\n\n[Partner Name]\nMoonshine Partner Network Desk"
                },
                {
                    id: "linkedin-pitch",
                    name: "LinkedIn Warm Connector",
                    channel: "LinkedIn",
                    description: "Short, non-spammy outreach built for direct message conversations.",
                    subject: "N/A",
                    body: "Hi [Prospect Name] — noticed your team is scaling up operations in the [Niche] space. Impressive growth.\n\nI operate a custom merchant finance desk in partnership with Moonshine Capital. We provide direct structural capital solutions — specifically [Specialty] lanes that fund within 48 hours without the traditional institutional runaround.\n\nIf you're currently securing capital for upcoming projects or inventory buffers, take a look at our quick pre-qual tool: [Affiliate Link]\n\nAlways glad to connect with other professionals in the space regardless of current needs."
                },
                {
                    id: "sms-direct",
                    name: "SMS/Text Urgent Follow-Up",
                    channel: "SMS",
                    description: "Ultra-condensed touchpoint for warm opportunities or immediate cash requirements.",
                    subject: "N/A",
                    body: "Hi [Prospect Name], [Partner Name] here. Checked out our recent discussion about expanding your [Niche] project pipeline. I setup a fast-track link on my Moonshine Desk to review your capital eligibility: [Affiliate Link]. Only takes 2 mins to run the pre-qual scorecard."
                }
            ],
            brandAssets: {
                colors: [
                    { name: "Matte Black", hex: "#0d0d0d", usage: "Main Backgrounds" },
                    { name: "Graphite Gray", hex: "#1a1a1a", usage: "Cards & Panels" },
                    { name: "Electric Green", hex: "#00ff66", usage: "Primary CTA & Glows" },
                    { name: "Signal Orange", hex: "#ff5500", usage: "Urgent Highlights" },
                    { name: "Cobalt Blue", hex: "#0066ff", usage: "Specs & Accents" },
                    { name: "Bone White", hex: "#f4f3ef", usage: "Body Copy" }
                ],
                dimensions: [
                    { item: "Partner Headshot", ratio: "1:1 Aspect Ratio", size: "Minimum 400x400px (PNG/JPG)" },
                    { item: "Affiliate Desk Banner", ratio: "16:9 Aspect Ratio", size: "1200x675px (PNG Recommended)" },
                    { item: "Custom Brand Logo", ratio: "Square or Flat SVG", size: "Transparent background, single-tone white/green" }
                ]
            }
        },

        // Initialization Routine
        init: function () {
            this.bindEvents();
            this.renderProducts('all');
            this.renderOutreachTemplate();
            this.updateLinkBuilderOutput();
        },

        // Event Bindings with Defensive Selector Fallbacks
        bindEvents: function () {
            const self = this;

            // Outreach Variable Inputs
            const templateInputs = ['outreachPartnerName', 'outreachProspectName', 'outreachCompany', 'outreachNiche', 'outreachSpecialty', 'outreachLink'];
            templateInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => self.renderOutreachTemplate());
                }
            });

            // Template Selector Tab
            const templateSelect = document.getElementById('templateSelector');
            if (templateSelect) {
                templateSelect.addEventListener('change', () => self.renderOutreachTemplate());
            }

            // Copy Outreach Script
            const copyScriptBtn = document.getElementById('copyScriptBtn');
            if (copyScriptBtn) {
                copyScriptBtn.addEventListener('click', () => self.copyOutreachToClipboard());
            }

            // Link Builder Inputs
            const linkInputs = ['linkPartnerSlug', 'linkSource', 'linkMedium', 'linkCampaign', 'linkNicheValue'];
            linkInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => self.updateLinkBuilderOutput());
                }
            });

            // Copy Link Button
            const copyLinkBtn = document.getElementById('copyGeneratedLinkBtn');
            if (copyLinkBtn) {
                copyLinkBtn.addEventListener('click', () => self.copyGeneratedLinkToClipboard());
            }

            // Product Category Filter
            const productFilter = document.getElementById('productCategoryFilter');
            if (productFilter) {
                productFilter.addEventListener('change', (e) => self.renderProducts(e.target.value));
            }
        },

        // Outreach Copy Engine Logic
        renderOutreachTemplate: function () {
            const selector = document.getElementById('templateSelector');
            if (!selector) return;

            const selectedId = selector.value;
            const template = this.databases.outreachTemplates.find(t => t.id === selectedId);
            if (!template) return;

            // Gather inputs with default fallbacks
            const partnerName = document.getElementById('outreachPartnerName')?.value || "[Partner Name]";
            const prospectName = document.getElementById('outreachProspectName')?.value || "[Prospect Name]";
            const companyName = document.getElementById('outreachCompany')?.value || "[Company Name]";
            const niche = document.getElementById('outreachNiche')?.value || "[Niche]";
            const specialty = document.getElementById('outreachSpecialty')?.value || "[Specialty]";
            
            // Generate link variable (incorporate dynamic link builder if desired)
            const baseLink = document.getElementById('outreachLink')?.value || "";
            const finalLink = baseLink ? baseLink : `https://partners.moonshinecapital.com/partners/${this.slugify(partnerName)}/`;

            // Replace variables in body
            let processedBody = template.body
                .replace(/\[Partner Name\]/g, partnerName)
                .replace(/\[Prospect Name\]/g, prospectName)
                .replace(/\[Company Name\]/g, companyName)
                .replace(/\[Niche\]/g, niche)
                .replace(/\[Specialty\]/g, specialty)
                .replace(/\[Affiliate Link\]/g, finalLink);

            // Replace variables in subject if applicable
            let processedSubject = template.subject !== "N/A" ? 
                template.subject
                    .replace(/\[Niche\]/g, niche)
                    .replace(/\[Specialty\]/g, specialty) 
                : "N/A";

            // Render Output on DOM
            const subjectEl = document.getElementById('outreachSubjectPreview');
            const bodyEl = document.getElementById('outreachBodyPreview');
            const metaEl = document.getElementById('templateDescriptionText');

            if (subjectEl) {
                if (processedSubject === "N/A") {
                    subjectEl.parentElement.classList.add('hidden');
                } else {
                    subjectEl.parentElement.classList.remove('hidden');
                    subjectEl.innerText = processedSubject;
                }
            }

            if (bodyEl) {
                bodyEl.innerText = processedBody;
            }

            if (metaEl) {
                metaEl.innerText = `${template.channel} Script: ${template.description}`;
            }
        },

        copyOutreachToClipboard: function () {
            const bodyText = document.getElementById('outreachBodyPreview')?.innerText;
            const subjectText = document.getElementById('outreachSubjectPreview')?.innerText;
            const btn = document.getElementById('copyScriptBtn');

            if (!bodyText) return;

            let clipboardPayload = bodyText;
            if (subjectText && subjectText !== "N/A") {
                clipboardPayload = `Subject: ${subjectText}\n\n${bodyText}`;
            }

            navigator.clipboard.writeText(clipboardPayload).then(() => {
                if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = "COPIED SCRIPT! ✓";
                    btn.classList.add('bg-electricGreen', 'text-black');
                    btn.classList.remove('bg-white/5', 'text-white');
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('bg-electricGreen', 'text-black');
                        btn.classList.add('bg-white/5', 'text-white');
                    }, 2000);
                }
            });
        },

        // UTM & Campaign Link Generator Logic
        updateLinkBuilderOutput: function () {
            const slugInput = document.getElementById('linkPartnerSlug');
            const outputEl = document.getElementById('generatedLinkOutput');
            const previewEl = document.getElementById('generatedLinkPreviewText');

            if (!slugInput || !outputEl) return;

            const partnerSlug = this.slugify(slugInput.value || "your-name");
            const source = this.slugify(document.getElementById('linkSource')?.value || "partner");
            const medium = this.slugify(document.getElementById('linkMedium')?.value || "affiliate");
            const campaign = this.slugify(document.getElementById('linkCampaign')?.value || "desk-portal");
            const nicheValue = this.slugify(document.getElementById('linkNicheValue')?.value || "");

            // Assemble URL
            let baseUrl = `https://partners.moonshinecapital.com/partners/${partnerSlug}/`;
            const params = new URLSearchParams();
            
            if (source) params.append('utm_source', source);
            if (medium) params.append('utm_medium', medium);
            if (campaign) params.append('utm_campaign', campaign);
            if (nicheValue) params.append('target_niche', nicheValue);

            const queryString = params.toString();
            const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

            outputEl.innerText = finalUrl;
            if (previewEl) {
                previewEl.innerText = `Redirects dynamically into your localized compliance-mapped intake forms.`;
            }

            // Sync with outreach builder if link input exists there
            const outreachLinkInput = document.getElementById('outreachLink');
            if (outreachLinkInput && !outreachLinkInput.dataset.userEdited) {
                outreachLinkInput.value = finalUrl;
                this.renderOutreachTemplate();
            }
        },

        copyGeneratedLinkToClipboard: function () {
            const linkText = document.getElementById('generatedLinkOutput')?.innerText;
            const btn = document.getElementById('copyGeneratedLinkBtn');

            if (!linkText) return;

            navigator.clipboard.writeText(linkText).then(() => {
                if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = "COPIED LINK! ✓";
                    btn.classList.add('bg-electricGreen', 'text-black');
                    btn.classList.remove('bg-cobaltBlue', 'text-white');
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('bg-electricGreen', 'text-black');
                        btn.classList.add('bg-cobaltBlue', 'text-white');
                    }, 2000);
                }
            });
        },

        // Dynamic Product Finder Rendering
        renderProducts: function (categoryFilter) {
            const container = document.getElementById('productDirectoryGrid');
            if (!container) return;

            container.innerHTML = '';
            const filtered = categoryFilter === 'all' || !categoryFilter
                ? this.databases.products 
                : this.databases.products.filter(p => p.category === categoryFilter);

            filtered.forEach(product => {
                const card = document.createElement('div');
                card.className = "p-6 bg-graphiteGray/40 border-2 border-white/10 hover:border-electricGreen transition-all duration-200 shadow-neobrutalBlack flex flex-col justify-between";
                
                // Construct required docs HTML list
                const docsListHtml = product.docs.map(doc => `
                    <li class="flex items-center gap-2 text-chromeAccent text-xs">
                        <span class="text-electricGreen text-[10px]">✔</span> ${doc}
                    </li>
                `).join('');

                card.innerHTML = `
                    <div>
                        <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                            <span class="font-mono text-[10px] text-electricGreen uppercase tracking-widest font-bold">${product.category}</span>
                            <span class="font-mono text-[10px] text-white bg-white/5 border border-white/20 px-2 py-0.5">${product.speed}</span>
                        </div>
                        <h4 class="font-mono font-bold text-lg text-white mb-2">${product.name}</h4>
                        <p class="text-xs text-chromeAccent mb-4 leading-relaxed">${product.bestFor}</p>
                        
                        <!-- Mini Parameter Specs -->
                        <div class="grid grid-cols-2 gap-2 p-3 bg-matteBlack/40 border border-white/5 mb-4 rounded-sm">
                            <div>
                                <span class="block text-[9px] text-chromeAccent uppercase tracking-wider">Max Amount</span>
                                <span class="font-mono text-xs font-bold text-white">${product.maxAmount}</span>
                            </div>
                            <div>
                                <span class="block text-[9px] text-chromeAccent uppercase tracking-wider">Factor Rate / APR</span>
                                <span class="font-mono text-xs font-bold text-white">${product.factorRate}</span>
                            </div>
                            <div>
                                <span class="block text-[9px] text-chromeAccent uppercase tracking-wider">Typical Term</span>
                                <span class="font-mono text-xs font-bold text-white">${product.term}</span>
                            </div>
                            <div>
                                <span class="block text-[9px] text-chromeAccent uppercase tracking-wider">Min Credit Score</span>
                                <span class="font-mono text-xs font-bold text-electricGreen">${product.minCredit}+</span>
                            </div>
                        </div>

                        <!-- Intake Docs Required -->
                        <div class="space-y-1.5 pt-2">
                            <span class="block font-mono text-[9px] text-chromeAccent uppercase tracking-wider mb-1">Required Files for Submission:</span>
                            <ul class="space-y-1">${docsListHtml}</ul>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-white/10">
                        <button onclick="MoonshineHub.launchProductAssistance('${product.name}')" class="w-full text-center py-2 bg-white/5 hover:bg-electricGreen hover:text-black font-mono font-bold text-xs uppercase tracking-wider border border-white/15 transition-all">
                            Refer Client
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        },

        // Fast Action Modal triggers
        launchProductAssistance: function (productName) {
            alert(`Ready to refer for ${productName}? Enter this specific program specialty inside your Partner Request Form or use the Link Builder custom UTM variables to map this pathway instantly.`);
        },

        // Helper string slugifier
        slugify: function (text) {
            return text
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    };

    // Public API exposure
    window.MoonshineHub = MoonshineHub;

    // Load execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MoonshineHub.init());
    } else {
        MoonshineHub.init();
    }
})();