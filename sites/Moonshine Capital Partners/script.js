/* ==========================================================================
       DATA MODELS (MAPPED ACCORDING TO SYSTEM CONFIGURATIONS)
       ========================================================================== */
    const partners = [
      {
        partnerName: "Jane Smith",
        partnerCompany: "Jane Smith Consulting",
        partnerSlug: "jane-smith",
        partnerType: "Broker Partner",
        partnerAudience: "small business owners and real estate investors",
        partnerIntro: "Jane helps entrepreneurs and investors prepare for better business funding conversations.",
        partnerBio: "Jane Smith works with growth-minded business owners who want to better understand funding readiness, documentation, and capital options.",
        partnerReferralCode: "JANE2026",
        partnerPageUrl: "https://moonshinecapital.com/partners/jane-smith/",
        partnerTallyFormUrl: "https://tally.so/r/YOUR_TALLY_FORM_ID",
        partnerTools: ["get-funded", "funding-readiness-scorecard"],
        partnerScorecardMode: "native"
      },
      {
        partnerName: "Marcus Vance",
        partnerCompany: "Vance Tax & Wealth Alliance",
        partnerSlug: "marcus-vance",
        partnerType: "Strategic CPA Partner",
        partnerAudience: "high-revenue business owners and corporate tax advisory clients",
        partnerIntro: "Marcus creates strategic liquidity routes for established corporate portfolios.",
        partnerBio: "Marcus Vance leverages years of tax practice experience to organize client profiles before presenting documentation to lending pipelines.",
        partnerReferralCode: "VANCECPA",
        partnerPageUrl: "https://moonshinecapital.com/partners/marcus-vance/",
        partnerTallyFormUrl: "https://tally.so/r/YOUR_TALLY_FORM_ID",
        partnerTools: ["funding-readiness-scorecard"],
        partnerScorecardMode: "embed"
      }
    ];

    const fundingTypes = [
      {
        name: "Moonshine Startup Funding Path",
        slug: "startup",
        category: "Startup / Credit-Leverage",
        bestFor: "New founders, new entities, and early-stage operators with strong personal credit or income.",
        commonUses: ["Launch capital", "Setup costs", "Bridge liquidity"],
        readinessMarkers: ["Strong personal credit profile (>680)", "Verifiable income stream"],
        typicalDocs: ["ID", "Credit review authorization", "Personal bank statements"],
        speedExpectation: "7 to 14 Business Days",
        cautionFlags: "Weak personal credit, active collections, lack of structured planning.",
        ctaLabel: "Explore Startup Funding"
      },
      {
        name: "Moonshine Revenue Advance Program",
        slug: "working-capital",
        category: "Fast Capital / Revenue Advance",
        bestFor: "Active operating businesses with urgent cash requirements and steady daily sales.",
        commonUses: ["Payroll cycles", "Emergency inventory", "Materials acquisition"],
        readinessMarkers: ["Consistent active monthly deposits", "Minimum 6 months operational history"],
        typicalDocs: ["3 months business bank statements", "Entity validation paperwork"],
        speedExpectation: "24 to 48 Hours",
        cautionFlags: "Heavy negative day trends, low cash reserves, existing platform stacking.",
        ctaLabel: "Explore Working Capital"
      },
      {
        name: "Moonshine Business Line Access",
        slug: "lines",
        category: "Revolving Access",
        bestFor: "Established enterprises needing flexible cash pools rather than lump loans.",
        commonUses: ["Seasonal purchasing spikes", "Accounts receivable bridges"],
        readinessMarkers: ["Clean deposit activity", "Favorable operating margins"],
        typicalDocs: ["6 months bank reports", "Financial performance sheets"],
        speedExpectation: "3 to 5 Business Days",
        cautionFlags: "Unmanaged bank overdraft status, short credit file thickness.",
        ctaLabel: "Explore Revolving Lines"
      },
      {
        name: "Moonshine Asset & Commercial Capital",
        slug: "asset",
        category: "Asset-Secured / Real Estate",
        bestFor: "Real estate investment flippers, DSCR builders, and machinery acquisitions.",
        commonUses: ["Equipment purchases", "Fix and Flip bridges", "Commercial builds"],
        readinessMarkers: ["Underlying collateral value", "Sufficient equity stake"],
        typicalDocs: ["Purchase contracts", "Detailed asset sheets", "Corporate structures"],
        speedExpectation: "10 to 30 Business Days",
        cautionFlags: "Weak valuation support, unvetted contractor timeline files.",
        ctaLabel: "Explore Asset Pathways"
      }
    ];

    const verticals = {
      cpas: {
        title: "CPA & Accounting Solutions",
        sub: "Enable clear capital conversations without risking your client trust status.",
        points: [
          "Provide a structured, dynamic Funding Readiness Scorecard branded to you.",
          "Prevent clients from submitting chaotic, multiple loan requests that damage credit metrics.",
          "Identify seasonal tax liquidity requirements before operating cycles hit pressure blocks."
        ],
        scenarios: ["Tax Season Operations", "Debt Cleanups", "Equipment Investment Tracking", "Structure Optimization"]
      },
      "real-estate": {
        title: "Real Estate Brokers & Developers",
        sub: "Keep your investment buyers funded and projects moving on schedule.",
        points: [
          "Quick pre-screening bridges for bridge lines of credit and DSCR single-family options.",
          "Educated readiness analysis so buyers understand loan-to-value calculations.",
          "Attributed tracking links to assure direct pipeline visualization."
        ],
        scenarios: ["Flippers & Renovators", "Commercial Builders", "Bridge Liquidations", "Equipment Acquisitions"]
      },
      ecommerce: {
        title: "E-Commerce Consultants & Advisors",
        sub: "Fund high inventory cycles, logistics chains, and digital marketing programs.",
        points: [
          "Integrate directly with online marketplace performance parameters.",
          "Track fast-moving working capital options designed for ad spend payback speeds.",
          "Establish robust entity credit builds to decouple personal metrics from platforms."
        ],
        scenarios: ["Inventory Buys", "Ad Scale Optimization", "Marketplace Disruptions", "Asset Acquisitions"]
      }
    };

    /* ==========================================================================
       STATE MANAGER
       ========================================================================== */
    let currentPartner = partners[0]; // Active selection
    let scorecardState = {
      currentStep: 1,
      totalSteps: 6,
      score: 0,
      answers: {}
    };

    // Initialize Page
    window.addEventListener('DOMContentLoaded', () => {
      renderFundingDirectory('all');
      switchSessionPartner('jane-smith');
      switchVerticalTab('cpas', document.querySelector('.vertical-tab'));
    });

    /* ==========================================================================
       SESSION SWAPPER ENGINE
       ========================================================================== */
    function switchSessionPartner(slug) {
      if (slug === 'direct') {
        currentPartner = {
          partnerName: "Direct",
          partnerCompany: "Moonshine Capital",
          partnerSlug: "direct",
          partnerType: "General Channel",
          partnerReferralCode: "DIRECT",
          partnerIntro: "Check your business parameters directly.",
          partnerBio: "Explore our static pathways.",
          partnerScorecardMode: "native"
        };
      } else {
        currentPartner = partners.find(p => p.partnerSlug === slug);
      }

      // Update Header Text & Display Dynamic States
      const navLink = document.getElementById('partner-nav-link');
      if (navLink) {
        navLink.textContent = slug === 'direct' ? "Direct Hub" : `${currentPartner.partnerName}'s Lead Hub`;
      }

      // Update Home preview widgets
      document.getElementById('hero-preview-badge').textContent = `Active Session: ${currentPartner.partnerName}`;
      document.getElementById('preview-val-name').textContent = currentPartner.partnerName;
      document.getElementById('preview-val-code').textContent = currentPartner.partnerReferralCode;
      document.getElementById('hero-preview-url').textContent = `https://moonshinecapital.com/partners/${currentPartner.partnerSlug}/`;

      // Update View 2 (Partner Lead Hub) elements
      document.getElementById('mini-avatar').textContent = currentPartner.partnerName.split(' ').map(n => n[0]).join('');
      document.getElementById('mini-co-name').textContent = currentPartner.partnerCompany;
      document.getElementById('partner-badge-label').textContent = currentPartner.partnerType;
      document.getElementById('partner-code-label').textContent = `Code: ${currentPartner.partnerReferralCode}`;
      document.getElementById('partner-hero-sub').textContent = `${currentPartner.partnerName} partnered with Moonshine Capital to help business owners take a clearer, more organized next step toward funding readiness.`;
      
      document.getElementById('partner-portrait').textContent = slug === 'jane-smith' ? "👩‍💼" : "👨‍💼";
      document.getElementById('partner-note-sig').textContent = currentPartner.partnerName;
      document.getElementById('partner-note-comp').textContent = currentPartner.partnerCompany;
      document.getElementById('partner-note-body').textContent = `"${currentPartner.partnerIntro}"`;

      // Update Embed iframe links
      document.getElementById('iframe-src-mock').textContent = `https://funding-quiz.vercel.app/?ref=${currentPartner.partnerReferralCode}&partner=${currentPartner.partnerSlug}`;

      // Update sandbox inspector
      document.getElementById('sim-ref').value = currentPartner.partnerReferralCode;
      document.getElementById('sim-name').value = currentPartner.partnerName;
      document.getElementById('sim-slug').value = currentPartner.partnerSlug;
      updateLiveSimulator();

      // Reset Native Scorecard parameters
      resetNativeScorecard();
      toggleScorecardMode(currentPartner.partnerScorecardMode);
    }

    /* ==========================================================================
       VIEW MANAGER (STATIC ROUTER)
       ========================================================================== */
    function switchView(viewId, event) {
      if (event) event.preventDefault();
      
      // Update Active Navigation Class
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${viewId}`) {
          link.classList.add('active');
        }
      });

      // Update Views Display
      document.querySelectorAll('.system-view').forEach(view => {
        view.classList.remove('active-view');
      });

      const activeView = document.getElementById(`view-${viewId}`);
      if (activeView) {
        activeView.classList.add('active-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    /* ==========================================================================
       NATIVE SCORECARD LOGIC ENGINE
       ========================================================================== */
    function toggleScorecardMode(mode) {
      const nativeContainer = document.getElementById('native-scorecard-container');
      const iframeContainer = document.getElementById('iframe-scorecard-container');
      const btnNative = document.getElementById('mode-btn-native');
      const btnEmbed = document.getElementById('mode-btn-embed');

      if (mode === 'native') {
        nativeContainer.style.display = 'block';
        iframeContainer.style.display = 'none';
        btnNative.style.background = 'var(--bg-card-hover)';
        btnNative.style.borderColor = 'var(--vivid-yellow)';
        btnEmbed.style.background = 'var(--bg-card)';
        btnEmbed.style.borderColor = '#FFFFFF';
      } else {
        nativeContainer.style.display = 'none';
        iframeContainer.style.display = 'block';
        btnEmbed.style.background = 'var(--bg-card-hover)';
        btnEmbed.style.borderColor = 'var(--vivid-yellow)';
        btnNative.style.background = 'var(--bg-card)';
        btnNative.style.borderColor = '#FFFFFF';
      }
    }

    function selectScoreOption(step, value, choiceLabel) {
      scorecardState.answers[step] = value;
      
      // Highlight selection visual state
      const currentStepEl = document.querySelector(`.scorecard-step[data-step="${step}"]`);
      if (currentStepEl) {
        currentStepEl.querySelectorAll('.option-button').forEach(btn => {
          btn.classList.remove('selected');
          if (btn.textContent.trim() === choiceLabel) {
            btn.classList.add('selected');
          }
        });
      }

      // Automatically move forward to ease flow
      setTimeout(() => {
        nextScoreStep();
      }, 250);
    }

    function nextScoreStep() {
      if (scorecardState.currentStep < scorecardState.totalSteps) {
        // Validate answer chosen before proceeding
        if (scorecardState.answers[scorecardState.currentStep] === undefined) {
          alert("Please select a parameter option to continue.");
          return;
        }

        const currentStepEl = document.querySelector(`.scorecard-step[data-step="${scorecardState.currentStep}"]`);
        currentStepEl.classList.remove('step-active');

        scorecardState.currentStep++;
        const nextStepEl = document.querySelector(`.scorecard-step[data-step="${scorecardState.currentStep}"]`);
        nextStepEl.classList.add('step-active');

        updateScorecardMeta();
      } else if (scorecardState.currentStep === scorecardState.totalSteps) {
        // We reached the final parameter step, route to Lead Capture Form
        const currentStepEl = document.querySelector(`.scorecard-step[data-step="${scorecardState.currentStep}"]`);
        currentStepEl.classList.remove('step-active');
        
        document.getElementById('scorecard-lead-capture').classList.add('step-active');
        document.getElementById('scorecard-nav-group').style.display = 'none';
        document.getElementById('scorecard-step-label').textContent = "Verify Report Destination";
      }
    }

    function prevScoreStep() {
      if (scorecardState.currentStep > 1) {
        const currentStepEl = document.querySelector(`.scorecard-step[data-step="${scorecardState.currentStep}"]`);
        currentStepEl.classList.remove('step-active');

        scorecardState.currentStep--;
        const prevStepEl = document.querySelector(`.scorecard-step[data-step="${scorecardState.currentStep}"]`);
        prevStepEl.classList.add('step-active');

        updateScorecardMeta();
      }
    }

    function updateScorecardMeta() {
      const pct = Math.round((scorecardState.currentStep / scorecardState.totalSteps) * 100);
      document.getElementById('scorecard-pct').textContent = `${pct}%`;
      document.getElementById('scorecard-progress').style.width = `${pct}%`;
      
      const labels = [
        "Category 1 of 6: Volume",
        "Category 2 of 6: Time Horizon",
        "Category 3 of 6: Credit Profile",
        "Category 4 of 6: Liquidity Assets",
        "Category 5 of 6: Entity Integrity",
        "Category 6 of 6: Capital Intention"
      ];
      document.getElementById('scorecard-step-label').textContent = labels[scorecardState.currentStep - 1];
    }

    function processScorecardLead() {
      const name = document.getElementById('lead-name').value;
      const email = document.getElementById('lead-email').value;
      const consent = document.getElementById('lead-consent').checked;

      if (!name || !email) {
        alert("Please complete required contact details.");
        return;
      }
      if (!consent) {
        alert("Please authorize the communication compliance checkbox.");
        return;
      }

      // Calculate score points sum
      let sum = 0;
      for (let s in scorecardState.answers) {
        sum += scorecardState.answers[s];
      }
      
      scorecardState.score = sum;

      // Classify Tiers
      let tier = "Highly Fundable";
      let desc = "Your business metrics reflect peak fundability standards. You possess the documentation framework and volume levels needed to proceed cleanly.";
      let path = "Revenue Advance & Lines of Credit";

      if (sum < 45) {
        tier = "Fixable - Needs Prep";
        desc = "Your operating entity parameters suggest structural items require immediate attention. We advise reviewing entity setup basics and account deposits.";
        path = "Business Credit Builder Path";
      } else if (sum < 65) {
        tier = "Select Fits Eligible";
        desc = "Your file holds promise, but requires strict validation of cash balances and manual evaluation of bank statements before clean routing.";
        path = "Revenue Advance Track";
      } else if (sum < 85) {
        tier = "Needs Advisor Review";
        desc = "Strong core numbers. We recommend speaking with an advisor to package documents properly and resolve structural items before submission.";
        path = "Structured Growth Pathways";
      }

      // Render Results Screen
      document.getElementById('scorecard-lead-capture').classList.remove('step-active');
      document.getElementById('scorecard-results-screen').classList.add('step-active');
      document.getElementById('result-score-val').textContent = sum;
      document.getElementById('result-tier').textContent = tier;
      document.getElementById('result-desc').textContent = desc;
      document.getElementById('result-path').textContent = path;
      document.getElementById('result-attribution').textContent = currentPartner.partnerName;

      // Adjust circle progress dashoffset
      const circle = document.getElementById('gauge-progress-bar');
      const radius = 80;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (sum / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    function resetNativeScorecard() {
      scorecardState = {
        currentStep: 1,
        totalSteps: 6,
        score: 0,
        answers: {}
      };

      // Reset options visual selection
      document.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
      document.querySelectorAll('.scorecard-step').forEach(step => step.classList.remove('step-active'));
      
      document.querySelector('.scorecard-step[data-step="1"]').classList.add('step-active');
      document.getElementById('scorecard-nav-group').style.display = 'flex';
      
      // Reset input values
      document.getElementById('lead-name').value = "";
      document.getElementById('lead-email').value = "";
      document.getElementById('lead-biz').value = "";
      document.getElementById('lead-consent').checked = false;

      updateScorecardMeta();
    }

    /* ==========================================================================
       TALLY INTEGRATION & URL ATTRIBUTION ENGINE
       ========================================================================== */
    function getActiveTallyUrl() {
      return `https://tally.so/r/YOUR_TALLY_FORM_ID?ref=${currentPartner.partnerReferralCode}&partner=${currentPartner.partnerSlug}&partner_name=${encodeURIComponent(currentPartner.partnerName)}&partner_type=${encodeURIComponent(currentPartner.partnerType)}&utm_source=partner&utm_medium=referral&utm_campaign=${currentPartner.partnerSlug}`;
    }

    function updateLiveSimulator() {
      const ref = document.getElementById('sim-ref').value;
      const name = document.getElementById('sim-name').value;
      const slug = document.getElementById('sim-slug').value;
      const medium = document.getElementById('sim-medium').value;

      const output = `https://tally.so/r/YOUR_TALLY_FORM_ID?ref=${ref}&partner=${slug}&partner_name=${encodeURIComponent(name)}&utm_source=partner&utm_medium=${medium}&utm_campaign=${slug}`;
      document.getElementById('sim-url-output').textContent = output;

      // Display parameters list
      document.getElementById('tally-query-display').innerHTML = `
        ref: ${ref}<br>
        partner: ${slug}<br>
        partner_name: ${name}<br>
        partner_type: Attributed Broker<br>
        utm_source: partner<br>
        utm_medium: ${medium}
      `;

      // Update live schemas view
      const demoSchema = {
        meta: "Simulation Active Parameters Model",
        activeReferrer: {
          code: ref,
          advisor: name,
          campaignId: slug,
          mediumChannel: medium
        }
      };
      document.getElementById('json-viewer').textContent = JSON.stringify(demoSchema, null, 2) + "\n\n// Full Local Config Data:\n" + JSON.stringify(partners, null, 2);
    }

    function copyAttributedURL() {
      const target = getActiveTallyUrl();
      navigator.clipboard.writeText(target).then(() => {
        alert("Referral URL successfully generated and copied to clipboard:\n" + target);
      });
    }

    /* ==========================================================================
       DIRECTORY RENDERING & PILL FILTERS
       ========================================================================== */
    function renderFundingDirectory(filter) {
      const container = document.getElementById('directory-cards-container');
      if (!container) return;

      container.innerHTML = "";

      const list = filter === 'all' ? fundingTypes : fundingTypes.filter(f => f.slug === filter);

      list.forEach(item => {
        const card = document.createElement('div');
        card.className = "funding-detail-card";
        card.innerHTML = `
          <div>
            <div class="card-meta-row">
              <span>${item.category}</span>
              <span class="badge badge-gold" style="font-size:8px;">STATIC-TRACKED</span>
            </div>
            <h3>${item.name}</h3>
            
            <div class="detail-section">
              <strong>Best Profile Match</strong>
              <p>${item.bestFor}</p>
            </div>

            <div class="detail-section">
              <strong>Common Intentions</strong>
              <p>${item.commonUses.join(', ')}</p>
            </div>

            <div class="detail-section">
              <strong>Required Verification Files</strong>
              <p>${item.typicalDocs.join(', ')}</p>
            </div>

            <div class="detail-section">
              <strong>Expected Timeline</strong>
              <p style="color:var(--vivid-yellow); font-weight:700;">${item.speedExpectation}</p>
            </div>
          </div>

          <div style="margin-top:24px;">
            <div class="caution-box" style="margin-bottom:20px;">
              ⚠️ <strong>Caution Markers:</strong> ${item.cautionFlags}
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="switchView('partner-page', event)">Pre-Qualify Now</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function filterDirectory(cat, el) {
      document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active-pill'));
      el.classList.add('active-pill');
      renderFundingDirectory(cat);
    }

    /* ==========================================================================
       VERTICAL RECRUITMENT TABS
       ========================================================================== */
    function switchVerticalTab(vertKey, el) {
      document.querySelectorAll('.vertical-tab').forEach(t => t.classList.remove('active-tab'));
      el.classList.add('active-tab');

      const data = verticals[vertKey];
      const box = document.getElementById('vertical-content-box');

      let pointsHtml = "";
      data.points.forEach(p => {
        pointsHtml += `<li style="margin-bottom:14px; font-size:15px; color:var(--text-muted); list-style:none;">✦ ${p}</li>`;
      });

      let scenariosHtml = "";
      data.scenarios.forEach(s => {
        scenariosHtml += `
          <div class="scenario-pill">
            <span style="color:var(--vivid-green);">✔</span>
            <span>${s}</span>
          </div>
        `;
      });

      box.innerHTML = `
        <div class="vertical-layout">
          <div>
            <span class="badge badge-gold" style="margin-bottom:20px;">RECRUITING PARTNERS</span>
            <h3 style="font-family:var(--font-heading); font-size:32px; text-transform:uppercase; margin-bottom:20px;">${data.title}</h3>
            <p style="font-size:16px; color:var(--text-muted); margin-bottom:30px; border-left:6px solid var(--vivid-pink); padding-left:18px;">${data.sub}</p>
            
            <ul style="list-style:none; margin-bottom:30px;">
              ${pointsHtml}
            </ul>

            <button class="btn btn-primary" onclick="switchView('sandbox', event)">INITIALIZE THIS STATIC NODE</button>
          </div>

          <div>
            <h4 style="font-family:var(--font-heading); font-size:18px; margin-bottom:16px; text-transform:uppercase; color:var(--vivid-yellow);">Best Client Context Targets</h4>
            <div class="scenario-pill-grid">
              ${scenariosHtml}
            </div>

            <div class="preview-card" style="margin-top:30px; border-color:var(--vivid-cyan); box-shadow: 4px 4px 0px var(--vivid-cyan);">
              <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:8px; font-weight:700;">CO-BRANDED SOLUTION PREVIEW</span>
              <p style="font-size:14px; font-weight:700; text-transform:uppercase;">Custom Referral Endpoint Assigned</p>
              <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Every signed up accountant gets a dedicated route like <code>/verticals/cpas/${currentPartner.partnerSlug}/</code></p>
              <span style="font-family:monospace; font-size:11px; color:var(--vivid-yellow); font-weight:700;">https://moonshinecapital.com/partners/${currentPartner.partnerSlug}</span>
            </div>
          </div>
        </div>
      `;
    }

    /* ==========================================================================
       UTILITIES
       ========================================================================== */
    function toggleFaq(btn) {
      const item = btn.parentElement;
      const panel = item.querySelector('.faq-panel');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-panel').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }