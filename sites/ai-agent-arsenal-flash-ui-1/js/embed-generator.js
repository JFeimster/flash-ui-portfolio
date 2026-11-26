(function () {
  // 1. Inject specialized partner portal styles matching the Neo-Brutalist & Cyberpunk theme
  const partnerStyles = `
    /* Partner Customizer specific elements */
    .partner-setup-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2.5rem;
    }
    @media (max-width: 900px) {
      .partner-setup-grid {
        grid-template-columns: 1fr;
      }
    }
    .partner-control-pane {
      background: var(--carbon-black);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .partner-input-row {
      margin-bottom: 1.2rem;
    }
    .partner-color-selectors {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.4rem;
    }
    .partner-color-btn {
      width: 35px;
      height: 35px;
      border: 3px solid var(--off-white);
      cursor: pointer;
      position: relative;
      transition: transform 0.1s;
    }
    .partner-color-btn:hover {
      transform: scale(1.1);
    }
    .partner-color-btn.selected::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--deep-black);
      font-weight: 900;
      font-size: 1rem;
    }
    .partner-preview-pane {
      background: var(--graphite);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .partner-mock-widget {
      background: var(--deep-black);
      border: 3px solid var(--off-white);
      padding: 1.5rem;
      position: relative;
      margin-top: 1rem;
      box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
    }
    .mock-widget-header {
      border-bottom: 2px dashed var(--off-white);
      padding-bottom: 0.6rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mock-widget-title {
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .mock-widget-body {
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .partner-indicator-tag {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      background: var(--magenta);
      color: var(--deep-black);
      padding: 0.15rem 0.5rem;
      font-weight: bold;
    }
    .partner-embed-box {
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      color: var(--cyan);
      font-family: 'Share Tech Mono', monospace;
      padding: 0.8rem;
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
      height: 120px;
      overflow-y: auto;
      margin-top: 1rem;
    }
    .partner-btn-copy {
      background: var(--magenta);
      color: var(--off-white);
      border: 2px solid var(--off-white);
      box-shadow: 3px 3px 0px var(--deep-black);
      cursor: pointer;
      font-weight: 800;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
      width: 100%;
      margin-top: 0.5rem;
    }
    .partner-btn-copy:hover {
      background: var(--off-white);
      color: var(--deep-black);
    }
  `;

  // Append styling block to the head
  const styleElement = document.createElement('style');
  styleElement.textContent = partnerStyles;
  document.head.appendChild(styleElement);

  // 2. Setup standard tools targeting white-label embedding configs
  const embeddableTools = [
    {
      id: "runway-sba-engine",
      name: "SBA & Financial Runway Engine",
      tagline: "Indicative borrowing bases mapped instantaneously based on merchant ledger parameters.",
      defaultInputs: { val1: "Monthly Topline", val2: "Outstanding Debts" }
    },
    {
      id: "cash-flow-buffer",
      name: "Ecommerce Cash Flow Forecaster",
      tagline: "Processes historic checkout volumes and payment processor reserves to isolate cash-out risks.",
      defaultInputs: { val1: "Store Revenue", val2: "Processor Holdback" }
    },
    {
      id: "mrr-to-capital",
      name: "SaaS MRR to Capital Planner",
      tagline: "Leverage asset-backed structures dynamically against subscription metrics.",
      defaultInputs: { val1: "Monthly Recurrent Revenue", val2: "Churn Threshold Rate" }
    }
  ];

  // Config State
  let selectedToolId = "runway-sba-engine";
  let partnerReferralId = "REF-OPERATOR-99";
  let partnerBrandName = "Apex Capital Services";
  let partnerBrandColor = "var(--cyan)";
  let partnerColorName = "cyan";
  let partnerWebhook = "https://your-crm.n8n.cloud/webhook/lead-ingestion";

  // 3. Construct and Mount Portal DOM elements dynamically prior to the lead maximizer section
  window.addEventListener('DOMContentLoaded', () => {
    const targetSection = document.getElementById('lead-maximizer');
    if (!targetSection) return;

    // Create container element
    const portalSection = document.createElement('section');
    portalSection.id = "partner-portal";
    portalSection.style.marginBottom = "5rem";

    // Set structure for Brutalist Section Header
    portalSection.innerHTML = `
      <div class="section-header" style="--accent: var(--magenta); margin-top: 5rem;">
        <div class="section-eyebrow mono">WHITE-LABEL PARTNER SYSTEM v1.2</div>
        <h2 class="section-title">White-Label Partner Portal</h2>
        <p class="section-subtitle">Empower your loan broker business, financial agency, or content platforms. Customize, skin, and configure deployment scripts for dynamic leads generators pointing directly back to your endpoints.</p>
      </div>

      <div class="calculator-gate-container" style="box-shadow: var(--neo-shadow-magenta); border-color: var(--off-white);">
        <div class="gate-strip mono" style="background: var(--magenta); color: var(--deep-black);">PARTNER ACCESS GATEWAY // WHITE-LABEL WIDGET COMPILER</div>
        
        <div class="partner-setup-grid">
          
          <!-- LEFT SIDE: CUSTOMIZER FORM -->
          <div class="partner-control-pane">
            <div>
              <div class="partner-input-row">
                <label class="calc-label">Select Arsenal Tool Template</label>
                <select id="partnerToolSelect" class="terminal-field" style="width: 100%; font-size: 0.9rem; padding: 0.6rem;">
                  ${embeddableTools.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>

              <div class="partner-input-row">
                <label class="calc-label">Partner Brand Name</label>
                <input type="text" id="partnerBrandNameInput" class="terminal-field" value="${partnerBrandName}" style="width: 100%;">
              </div>

              <div class="partner-input-row">
                <label class="calc-label">Affiliate Tracking ID (Ref)</label>
                <input type="text" id="partnerRefInput" class="terminal-field" value="${partnerReferralId}" style="width: 100%;">
              </div>

              <div class="partner-input-row">
                <label class="calc-label">Routing Destination Webhook</label>
                <input type="url" id="partnerWebhookInput" class="terminal-field" value="${partnerWebhook}" style="width: 100%; color: var(--cyan);">
              </div>

              <div class="partner-input-row">
                <label class="calc-label">Primary Brand Accent Color</label>
                <div class="partner-color-selectors">
                  <div class="partner-color-btn selected" data-color="var(--cyan)" data-name="cyan" style="background: var(--cyan);"></div>
                  <div class="partner-color-btn" data-color="var(--acid-green)" data-name="green" style="background: var(--acid-green);"></div>
                  <div class="partner-color-btn" data-color="var(--magenta)" data-name="magenta" style="background: var(--magenta);"></div>
                  <div class="partner-color-btn" data-color="var(--yellow)" data-name="yellow" style="background: var(--yellow);"></div>
                  <div class="partner-color-btn" data-color="var(--orange)" data-name="orange" style="background: var(--orange);"></div>
                </div>
              </div>
            </div>

            <button class="pipeline-trigger-btn mono" id="testPartnerWebhookBtn" style="background: var(--magenta); color: var(--off-white); margin-top: 1rem; box-shadow: 4px 4px 0px var(--cyan);">
              TEST WEBHOOK TRANSMISSION
            </button>
          </div>

          <!-- RIGHT SIDE: LIVE GENERATOR PREVIEW & EMBED SNIPPET -->
          <div class="partner-preview-pane">
            <div>
              <div class="payload-title-bar" style="margin-bottom: 0.5rem;">
                <span class="mono" style="color: var(--magenta); font-weight: 800;">LIVE INTERACTIVE PREVIEW</span>
                <span class="mono" id="mockTrackingBadge" style="color: var(--yellow); font-size: 0.7rem;">REF: ${partnerReferralId}</span>
              </div>

              <!-- Simulator Window -->
              <div class="partner-mock-widget" id="mockWidgetContainer" style="border-color: ${partnerBrandColor};">
                <div class="mock-widget-header">
                  <span class="mock-widget-title" id="mockWidgetBrandName" style="color: ${partnerBrandColor};">${partnerBrandName}</span>
                  <span class="partner-indicator-tag" id="mockIndicatorColor" style="background: ${partnerBrandColor}; color: var(--deep-black);">ACTIVE PARTNER WIDGET</span>
                </div>
                
                <div class="mock-widget-body">
                  <p style="font-weight: 700; margin-bottom: 0.5rem;" id="mockWidgetToolName">SBA & Financial Runway Engine</p>
                  <p style="color: #bbb; font-size: 0.8rem; margin-bottom: 1rem;" id="mockWidgetToolTagline">Indicative borrowing bases mapped instantaneously based on merchant ledger parameters.</p>
                  
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem;">
                      <span id="mockLabel1">Monthly Topline</span>
                      <span style="color: var(--acid-green);">$85,000</span>
                    </div>
                    <div style="height: 6px; background: #222; border: 1px solid var(--off-white); position: relative;">
                      <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 65%; background: var(--acid-green);"></div>
                    </div>
                  </div>

                  <button class="terminal-btn mono" style="font-size: 0.75rem; padding: 0.5rem; width: 100%; border-color: var(--off-white); background: ${partnerBrandColor}; color: var(--deep-black); font-weight: 800; cursor: default;">
                    SUBMIT TO PARTNER DATABASE
                  </button>
                </div>
              </div>
            </div>

            <!-- Embed Code Exporter Section -->
            <div style="margin-top: 1.5rem;">
              <span class="mono" style="font-size: 0.75rem; color: var(--yellow); display: block; margin-bottom: 0.2rem;">READY TO SHIP DEPLOYMENT EMBED SNIPPET</span>
              <div class="partner-embed-box" id="partnerCodeDisplay">Loading Snippet...</div>
              <button class="partner-btn-copy mono" id="copyPartnerEmbedBtn">COPY WIDGET EMBED CODE</button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Inject into parent container layout before targetSection
    targetSection.parentNode.insertBefore(portalSection, targetSection);

    // Initial load configurations
    updateDynamicPartnerDisplays();
    if (window.addConsoleLine) {
      window.addConsoleLine("PARTNER PORTAL LOADER: White-Label System dynamically mounted.", "PORTAL");
    }

    // 4. Set up interactive dynamic event listeners for partner customizer inputs
    document.getElementById('partnerToolSelect').addEventListener('change', (e) => {
      selectedToolId = e.target.value;
      updateDynamicPartnerDisplays();
      if (window.addConsoleLine) {
        window.addConsoleLine(`PARTNER PORTAL: Tool mapped changed to [${selectedToolId}]`);
      }
    });

    document.getElementById('partnerBrandNameInput').addEventListener('input', (e) => {
      partnerBrandName = e.target.value || "Partner Brand";
      updateDynamicPartnerDisplays();
    });

    document.getElementById('partnerRefInput').addEventListener('input', (e) => {
      partnerReferralId = e.target.value || "REF-ID";
      updateDynamicPartnerDisplays();
    });

    document.getElementById('partnerWebhookInput').addEventListener('input', (e) => {
      partnerWebhook = e.target.value || "";
      updateDynamicPartnerDisplays();
    });

    // Handle interactive color block picker events
    const colorButtons = document.querySelectorAll('.partner-color-btn');
    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        colorButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        partnerBrandColor = btn.getAttribute('data-color');
        partnerColorName = btn.getAttribute('data-name');
        updateDynamicPartnerDisplays();
      });
    });

    // Handle Embed Snippet Copy events
    document.getElementById('copyPartnerEmbedBtn').addEventListener('click', () => {
      const codeToCopy = document.getElementById('partnerCodeDisplay').textContent;
      navigator.clipboard.writeText(codeToCopy).then(() => {
        if (window.addConsoleLine) {
          window.addConsoleLine("PARTNER PORTAL: Config copied directly to local clipboard.", "CLIPBOARD");
        }
        
        const copyBtn = document.getElementById('copyPartnerEmbedBtn');
        const origText = copyBtn.textContent;
        copyBtn.textContent = "COPIED SUCCESSFULLY!";
        copyBtn.style.background = "var(--acid-green)";
        copyBtn.style.color = "var(--deep-black)";
        
        setTimeout(() => {
          copyBtn.textContent = origText;
          copyBtn.style.background = "var(--magenta)";
          copyBtn.style.color = "var(--off-white)";
        }, 1500);
      });
    });

    // Handle live mock webhook simulation triggers
    document.getElementById('testPartnerWebhookBtn').addEventListener('click', () => {
      const webhookBtn = document.getElementById('testPartnerWebhookBtn');
      const origText = webhookBtn.textContent;
      
      webhookBtn.textContent = "TRANSMITTING DATA METRICS TO ENDPOINT...";
      webhookBtn.style.background = "var(--yellow)";
      webhookBtn.style.color = "var(--deep-black)";

      if (window.addConsoleLine) {
        window.addConsoleLine(`DISPATCHING WEBH00K MOCK CALL FOR ${partnerReferralId} TO: ${partnerWebhook}`, "POST");
      }

      setTimeout(() => {
        webhookBtn.textContent = "TRANSMISSION DELIVERED - SUCCESS (200 OK)";
        webhookBtn.style.background = "var(--acid-green)";
        webhookBtn.style.color = "var(--deep-black)";

        if (window.addConsoleLine) {
          window.addConsoleLine(`TRANSMISSION COMPLETE // SUCCESS RESPONSE LOGGED IN ${partnerBrandName} CRM DATA`);
        }

        setTimeout(() => {
          webhookBtn.textContent = origText;
          webhookBtn.style.background = "var(--magenta)";
          webhookBtn.style.color = "var(--off-white)";
        }, 2000);
      }, 1500);
    });
  });

  // 5. Update UI values and rebuild deployment configs
  function updateDynamicPartnerDisplays() {
    // Locate match configs object
    const selectedToolObj = embeddableTools.find(t => t.id === selectedToolId) || embeddableTools[0];

    // Update Simulator elements
    document.getElementById('mockWidgetContainer').style.borderColor = partnerBrandColor;
    document.getElementById('mockWidgetBrandName').textContent = partnerBrandName;
    document.getElementById('mockWidgetBrandName').style.color = partnerBrandColor;
    
    const indicatorNode = document.getElementById('mockIndicatorColor');
    indicatorNode.textContent = `${partnerColorName.toUpperCase()} THEME ACTIVE`;
    indicatorNode.style.background = partnerBrandColor;

    document.getElementById('mockWidgetToolName').textContent = selectedToolObj.name;
    document.getElementById('mockWidgetToolTagline').textContent = selectedToolObj.tagline;
    document.getElementById('mockLabel1').textContent = selectedToolObj.defaultInputs.val1;
    document.getElementById('mockTrackingBadge').textContent = `TRACKING: ${partnerReferralId.toUpperCase()}`;

    // Rebuild embed code dynamically
    const dynamicSnippet = `<!-- AI Agent Arsenal Partner Lead Magnet Embed [${partnerBrandName}] -->
<div id="arsenal-embed-${selectedToolObj.id}" class="arsenal-partner-widget"></div>
<script src="https://arsenal.jasonfeimster.com/dist/embed-core.js" defer></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    ArsenalPartner.initialize({
      elementId: "arsenal-embed-${selectedToolObj.id}",
      toolId: "${selectedToolObj.id}",
      refId: "${partnerReferralId}",
      accentColor: "${partnerBrandColor}",
      brandName: "${partnerBrandName}",
      webhookUrl: "${partnerWebhook}"
    });
  });
</script>
<noscript>Enable JS to load customized partner widget calculators.</noscript>`;

    document.getElementById('partnerCodeDisplay').textContent = dynamicSnippet;
  }
})();