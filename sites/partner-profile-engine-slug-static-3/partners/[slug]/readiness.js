/**
 * Moonshine Capital - Self-Service Funding Readiness Scorecard
 * Interactive Diagnostic System (Neobrutalist Luxury Fintech Edition)
 */

(function () {
  // 1. INJECT STYLES MATCHING THE NEOBRUTALIST DESIGN SYSTEM
  const styleId = "moonshine-readiness-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      #readiness-app {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #F4F4F0; /* --bone-white */
        color: #0D0D0D; /* --matte-black */
        border: 3px solid #0D0D0D;
        box-shadow: 8px 8px 0px 0px #0D0D0D;
        padding: 40px;
        margin: 40px auto;
        max-width: 800px;
        box-sizing: border-box;
        position: relative;
      }

      #readiness-app *, #readiness-app *::before, #readiness-app *::after {
        box-sizing: border-box;
      }

      #readiness-app h2 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 28px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 24px;
        line-height: 1.1;
        letter-spacing: -0.02em;
        border-bottom: 3px solid #0D0D0D;
        padding-bottom: 12px;
      }

      .readiness-progress-container {
        margin-bottom: 32px;
      }

      .readiness-progress-text {
        display: flex;
        justify-content: space-between;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 8px;
        text-transform: uppercase;
      }

      .readiness-progress-bar {
        height: 16px;
        background-color: #0D0D0D;
        border: 2px solid #0D0D0D;
        position: relative;
        overflow: hidden;
      }

      .readiness-progress-fill {
        height: 100%;
        background-color: #39FF14; /* --electric-green */
        width: 0%;
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .readiness-step {
        display: none;
      }

      .readiness-step.active {
        display: block;
        animation: readinessFadeIn 0.3s ease-out;
      }

      .readiness-question {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .readiness-question-num {
        font-family: 'JetBrains Mono', monospace;
        background-color: #0D0D0D;
        color: #F4F4F0;
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 800;
      }

      .readiness-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .readiness-option-btn {
        width: 100%;
        padding: 16px 20px;
        text-align: left;
        font-family: inherit;
        font-size: 16px;
        font-weight: 700;
        background-color: #FFFFFF;
        border: 3px solid #0D0D0D;
        cursor: pointer;
        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .readiness-option-btn:hover {
        background-color: #39FF14; /* --electric-green */
        transform: translate(-3px, -3px);
        box-shadow: 4px 4px 0px 0px #0D0D0D;
      }

      .readiness-option-btn:active {
        transform: translate(1px, 1px);
        box-shadow: 1px 1px 0px 0px #0D0D0D;
      }

      .readiness-option-btn::after {
        content: '→';
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        opacity: 0.5;
        transition: transform 0.15s;
      }

      .readiness-option-btn:hover::after {
        transform: translateX(4px);
        opacity: 1;
      }

      /* Results Styling */
      .readiness-results-layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 32px;
      }

      @media (max-width: 768px) {
        .readiness-results-layout {
          grid-template-columns: 1fr;
        }
      }

      .readiness-gauge-box {
        background-color: #FFFFFF;
        border: 3px solid #0D0D0D;
        box-shadow: 6px 6px 0px 0px #0D0D0D;
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .readiness-gauge-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 16px;
        letter-spacing: 0.05em;
      }

      .readiness-gauge-circle {
        position: relative;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: conic-gradient(#39FF14 var(--score-deg, 0deg), #0D0D0D 0deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #0D0D0D;
        margin-bottom: 20px;
      }

      .readiness-gauge-circle::after {
        content: '';
        position: absolute;
        width: 110px;
        height: 110px;
        background-color: #FFFFFF;
        border-radius: 50%;
        border: 3px solid #0D0D0D;
        z-index: 1;
      }

      .readiness-gauge-value {
        position: relative;
        z-index: 2;
        font-family: 'JetBrains Mono', monospace;
        font-size: 36px;
        font-weight: 900;
        color: #0D0D0D;
      }

      .readiness-tier-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 800;
        padding: 6px 14px;
        background-color: #0D0D0D;
        color: #FFFFFF;
        text-transform: uppercase;
        border: 2px solid #0D0D0D;
        display: inline-block;
      }

      .readiness-actions-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .readiness-action-item {
        background-color: #FFFFFF;
        border: 2px solid #0D0D0D;
        padding: 16px;
        position: relative;
        padding-left: 48px;
      }

      .readiness-action-item::before {
        content: '⚡';
        position: absolute;
        left: 14px;
        top: 14px;
        font-size: 18px;
        color: #FF5A09; /* --signal-orange */
      }

      .readiness-action-title {
        font-weight: 800;
        font-size: 15px;
        margin-bottom: 4px;
      }

      .readiness-action-desc {
        font-size: 13px;
        color: rgba(13, 13, 13, 0.75);
        line-height: 1.4;
      }

      .readiness-lane-match-card {
        background-color: #0047AB; /* --cobalt-blue */
        color: #F4F4F0;
        border: 3px solid #0D0D0D;
        box-shadow: 6px 6px 0px 0px #0D0D0D;
        padding: 24px;
        margin-top: 24px;
      }

      .readiness-lane-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 18px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .readiness-lane-desc {
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 20px;
        color: rgba(244, 244, 240, 0.9);
      }

      .readiness-btn-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 24px;
      }

      .readiness-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 24px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        text-decoration: none;
        border: 3px solid #0D0D0D;
        cursor: pointer;
        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .readiness-btn-green {
        background-color: #39FF14;
        color: #0D0D0D;
        box-shadow: 4px 4px 0px 0px #0D0D0D;
      }

      .readiness-btn-green:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px 0px #0D0D0D;
      }

      .readiness-btn-black {
        background-color: #0D0D0D;
        color: #F4F4F0;
        box-shadow: 4px 4px 0px 0px #0047AB;
      }

      .readiness-btn-black:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px 0px #0047AB;
      }

      @keyframes readinessFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // 2. DEFINE SYSTEM STATE
  let currentStep = 0;
  let totalScore = 0;
  const userResponses = {
    revenue: null,
    timeInBusiness: null,
    creditScore: null,
    bankStatus: null,
    liensDebt: null,
  };

  // 3. DEFINE DIAGNOSTIC METRICS AND STEPS
  const stepsConfig = [
    {
      key: "revenue",
      question: "What is your baseline average monthly sales volume?",
      options: [
        { text: "Under $5,000 / mo", points: 5 },
        { text: "$5,000 to $15,000 / mo", points: 12 },
        { text: "$15,000 to $50,000 / mo", points: 20 },
        { text: "Over $50,000 / mo", points: 25 },
      ],
    },
    {
      key: "timeInBusiness",
      question: "How long has your business entity been operational?",
      options: [
        { text: "Less than 6 months", points: 3 },
        { text: "6 to 12 months", points: 10 },
        { text: "1 to 2 years", points: 16 },
        { text: "Over 2 years", points: 20 },
      ],
    },
    {
      key: "creditScore",
      question: "What is the primary business owner's approximate personal credit score (FICO)?",
      options: [
        { text: "Below 550 (Challenged)", points: 5 },
        { text: "550 to 600 (Fair)", points: 12 },
        { text: "600 to 680 (Good)", points: 20 },
        { text: "Above 680 (Excellent)", points: 25 },
      ],
    },
    {
      key: "bankStatus",
      question: "How are your operating bank deposits structured?",
      options: [
        { text: "Personal Account or irregular cash / checks", points: 2 },
        { text: "Business Account with < 4 deposit transactions monthly", points: 8 },
        { text: "Business Account with 4 to 10 deposits monthly", points: 12 },
        { text: "Business Account with 10+ recurring deposits monthly", points: 15 },
      ],
    },
    {
      key: "liensDebt",
      question: "Are there any active positions, legal liens, or tax issues on your files?",
      options: [
        { text: "Yes, 2+ active cash positions or tax liens", points: 3 },
        { text: "Yes, 1 active financing position (Clean ledger otherwise)", points: 10 },
        { text: "No, clear of all operational positions & UCC liens", points: 15 },
      ],
    },
  ];

  // 4. GENERATE STRATEGIC SYSTEM ADVISORIES & MATCHES
  function compileResults() {
    totalScore =
      userResponses.revenue.points +
      userResponses.timeInBusiness.points +
      userResponses.creditScore.points +
      userResponses.bankStatus.points +
      userResponses.liensDebt.points;

    let tierName = "Pre-Advisory Tier";
    let tierColor = "#FF5A09"; // Signal Orange
    let laneMatch = {
      title: "Business Credit Prep",
      desc: "Based on baseline ledger attributes, establishing an optimized commercial credit register (D&B, Experian Corporate) is the absolute immediate tactical gateway prior to institutional filings.",
      badge: "Pre-Funding optimization"
    };
    let advisories = [];

    // Evaluate core requirements
    if (totalScore >= 75) {
      tierName = "A-Grade Premium Routing Ready";
      tierColor = "#39FF14"; // Electric Green
      laneMatch = {
        title: "Revenue Funding & Structured Facilities",
        desc: "You have verified elite pre-requisite indicators. You are fully positioned for expedited direct underwriter access with optimized dynamic pricing models.",
        badge: "Direct capital lane access"
      };
    } else if (totalScore >= 50) {
      tierName = "Accelerated Funding Lane Ready";
      tierColor = "#0047AB"; // Cobalt Blue
      laneMatch = {
        title: "Fast-Track Working Capital",
        desc: "Solid business profile with moderate exposure risks. Positioned to trigger secondary capital structures backed by ongoing sales ledgers.",
        badge: "Fast-track alignment"
      };
    }

    // Build critical dynamic advisories
    if (userResponses.creditScore.points <= 12) {
      advisories.push({
        title: "Execute Personal Profile Triage",
        desc: "FICO scoring trends under 600 require targeted adjustment of structural credit indexes to maximize long-term deployment pathways."
      });
    }

    if (userResponses.bankStatus.points <= 8) {
      advisories.push({
        title: "Streamline Corporate Banking Route",
        desc: "Immediately convert all processing deposits into a verified business entity checkout path. Underwriters require institutional transactional checks."
      });
    } else {
      advisories.push({
        title: "Maintain Deposit Velocity",
        desc: "Consistent monthly deposits provide strong validation, opening options for more attractive repayment terms."
      });
    }

    if (userResponses.revenue.points >= 20 && userResponses.timeInBusiness.points >= 16) {
      advisories.push({
        title: "Leverage Equipment or Receivables Portfolio",
        desc: "Your established cash flow parameters are prime candidates for high-speed dynamic asset leverage channels."
      });
    }

    if (userResponses.liensDebt.points <= 3) {
      advisories.push({
        title: "UCC Filings Restructuring Necessary",
        desc: "Double exposure on operational ledgers limits total volume capacity. Aim to settle secondary liens to clear underwriting channels."
      });
    }

    return { totalScore, tierName, tierColor, laneMatch, advisories };
  }

  // 5. RENDER THE INTERACTIVE APPLICATION HUB
  function renderApp() {
    const container = document.getElementById("readiness-scorecard");
    if (!container) return;

    // Build application container structure
    container.innerHTML = `
      <div id="readiness-app">
        <h2>Self-Service Funding Readiness Scorecard</h2>
        
        <div class="readiness-progress-container" id="progress-wrapper">
          <div class="readiness-progress-text">
            <span id="progress-step-indicator">Initialization Status</span>
            <span id="progress-percent-indicator">0%</span>
          </div>
          <div class="readiness-progress-bar">
            <div class="readiness-progress-fill" id="progress-fill-element"></div>
          </div>
        </div>

        <div id="steps-container"></div>
      </div>
    `;

    const stepsContainer = document.getElementById("steps-container");

    // Dynamic step elements injection
    stepsConfig.forEach((stepData, idx) => {
      const stepDiv = document.createElement("div");
      stepDiv.className = `readiness-step ${idx === 0 ? "active" : ""}`;
      stepDiv.id = `readiness-step-${idx}`;

      const questionEl = document.createElement("div");
      questionEl.className = "readiness-question";
      questionEl.innerHTML = `
        <span class="readiness-question-num">0${idx + 1}</span>
        <span>${stepData.question}</span>
      `;
      stepDiv.appendChild(questionEl);

      const optionsDiv = document.createElement("div");
      optionsDiv.className = "readiness-options";

      stepData.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "readiness-option-btn";
        btn.textContent = opt.text;
        btn.onclick = () => handleChoice(stepData.key, opt, idx);
        optionsDiv.appendChild(btn);
      });

      stepDiv.appendChild(optionsDiv);
      stepsContainer.appendChild(stepDiv);
    });

    updateProgressBar();
  }

  // 6. CONTROL SYSTEMS & NAVIGATION
  function handleChoice(key, option, index) {
    userResponses[key] = option;

    if (index + 1 < stepsConfig.length) {
      // Transition to subsequent step
      document.getElementById(`readiness-step-${index}`).classList.remove("active");
      currentStep = index + 1;
      document.getElementById(`readiness-step-${currentStep}`).classList.add("active");
      updateProgressBar();
    } else {
      // Run calculations and show outputs
      showResults();
    }
  }

  function updateProgressBar() {
    const progressFill = document.getElementById("progress-fill-element");
    const stepText = document.getElementById("progress-step-indicator");
    const percentText = document.getElementById("progress-percent-indicator");

    if (!progressFill) return;

    const percent = Math.round((currentStep / stepsConfig.length) * 100);
    progressFill.style.width = `${percent}%`;
    stepText.textContent = `Analyzing Metrics: Step ${currentStep + 1} of ${stepsConfig.length}`;
    percentText.textContent = `${percent}%`;
  }

  // 7. PRESENT COMPREHENSIVE FINANCIAL ADVISORY
  function showResults() {
    const appEl = document.getElementById("readiness-app");
    const progressWrapper = document.getElementById("progress-wrapper");
    if (progressWrapper) progressWrapper.style.display = "none";

    const results = compileResults();
    const scoreDegrees = (results.totalScore / 100) * 360;

    // Fallbacks for URLs
    const appLink = window.MOONSHINE_APP_LINK || "[APPLICATION_LINK]";
    const bookingLink = window.MOONSHINE_BOOKING_LINK || "[BOOKING_LINK]";

    appEl.innerHTML = `
      <h2>Strategic Audit Complete</h2>
      
      <div class="readiness-results-layout" style="--score-deg: ${scoreDegrees}deg;">
        
        <!-- Diagnostic Gauge Dashboard -->
        <div>
          <div class="readiness-gauge-box">
            <span class="readiness-gauge-title">Calculated Readiness</span>
            <div class="readiness-gauge-circle">
              <span class="readiness-gauge-value">${results.totalScore}</span>
            </div>
            <span class="readiness-tier-badge" style="background-color: ${results.tierColor}; color: ${results.totalScore >= 75 ? '#0D0D0D' : '#F4F4F0'}">
              ${results.tierName}
            </span>
          </div>

          <div class="readiness-lane-match-card">
            <span class="readiness-gauge-title" style="color: #39FF14; margin-bottom: 8px; display: block;">Optimal Capital Lane</span>
            <div class="readiness-lane-title">⚡ ${results.laneMatch.title}</div>
            <p class="readiness-lane-desc">${results.laneMatch.desc}</p>
            <span class="readiness-tier-badge" style="background-color: #F4F4F0; color: #0D0D0D; font-size: 10px;">
              ${results.laneMatch.badge}
            </span>
          </div>
        </div>

        <!-- Actionable Directives list -->
        <div>
          <h3 style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px;">
            Target Underwriting Actions
          </h3>
          <div class="readiness-actions-list">
            ${results.advisories.map(adv => `
              <div class="readiness-action-item">
                <div class="readiness-action-title">${adv.title}</div>
                <div class="readiness-action-desc">${adv.desc}</div>
              </div>
            `).join('')}
          </div>

          <div class="readiness-btn-group">
            <a href="${appLink}" class="readiness-btn readiness-btn-green">Initialize Underwriting App</a>
            <a href="${bookingLink}" class="readiness-btn readiness-btn-black">Book Direct Consultation</a>
          </div>
          
          <button class="readiness-btn" onclick="window.location.reload()" style="background: none; border: none; margin-top: 16px; color: #FF5A09; text-decoration: underline; padding: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; cursor: pointer;">
            Restart Diagnostic Scorecard
          </button>
        </div>

      </div>
    `;
  }

  // 8. SYSTEM INITIALIZATION
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderApp);
  } else {
    renderApp();
  }
})();