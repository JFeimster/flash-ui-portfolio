(function() {
  if (typeof window === 'undefined') return;

  // 1. Inject Typography & FontAwesome
  if (!document.getElementById('moonshine-fonts')) {
    const fonts = document.createElement('link');
    fonts.id = 'moonshine-fonts';
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fonts);
  }
  if (!document.getElementById('font-awesome-css')) {
    const fa = document.createElement('link');
    fa.id = 'font-awesome-css';
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fa);
  }

  // 2. CSS Injector
  const styles = `
    :root {
      --matte-black: #0D0D0D;
      --bone-white: #F4F4F0;
      --electric-green: #39FF14;
      --signal-orange: #FF5A09;
      --cobalt-blue: #0047AB;
      --graphite-gray: #1C1C1C;
      --border-gray: #2D2D2D;
      --text-muted: #8E8E93;
      --accent: var(--electric-green);
      
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      
      --neo-border: 3px solid var(--matte-black);
      --neo-shadow: 6px 6px 0px 0px var(--matte-black);
      --neo-shadow-sm: 3px 3px 0px 0px var(--matte-black);
      --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }

    body {
      background-color: var(--bone-white);
      color: var(--matte-black);
      font-family: var(--font-sans);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    * {
      box-sizing: border-box;
    }

    /* Header Styling */
    .locker-header {
      background-color: var(--matte-black);
      border-bottom: 3px solid var(--matte-black);
      padding: 16px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .locker-header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .logo-mark {
      width: 32px;
      height: 32px;
      background: var(--electric-green);
      border: 2px solid var(--bone-white);
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-mark span {
      transform: rotate(45deg);
      color: var(--matte-black);
      font-family: var(--font-mono);
      font-weight: 900;
      font-size: 18px;
    }

    .brand-text {
      font-family: var(--font-mono);
      color: var(--bone-white);
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 0.05em;
    }

    .header-badge {
      font-family: var(--font-mono);
      background-color: var(--electric-green);
      color: var(--matte-black);
      border: 2px solid var(--matte-black);
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      box-shadow: 2px 2px 0px 0px var(--matte-black);
    }

    /* Main Grid */
    .locker-layout {
      max-width: 1200px;
      width: 100%;
      margin: 40px auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 40px;
    }

    @media (max-width: 991px) {
      .locker-layout {
        grid-template-columns: 1fr;
      }
    }

    /* Typography */
    h1, h2, h3, h4 {
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
    }

    p {
      line-height: 1.6;
      color: rgba(13, 13, 13, 0.8);
      margin: 0;
    }

    /* Lane Selectors */
    .lane-nav {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    @media (max-width: 600px) {
      .lane-nav {
        grid-template-columns: 1fr;
      }
    }

    .lane-btn {
      background-color: white;
      border: var(--neo-border);
      padding: 20px;
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);
      box-shadow: var(--neo-shadow-sm);
    }

    .lane-btn.active {
      background-color: var(--accent);
      transform: translate(-3px, -3px);
      box-shadow: var(--neo-shadow);
    }

    .lane-btn:hover:not(.active) {
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0px 0px var(--matte-black);
    }

    .lane-btn-title {
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .lane-btn-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: rgba(13, 13, 13, 0.6);
    }

    /* Core Card */
    .locker-card {
      background: white;
      border: var(--neo-border);
      box-shadow: var(--neo-shadow);
      padding: 40px;
      margin-bottom: 32px;
    }

    @media (max-width: 600px) {
      .locker-card {
        padding: 24px;
      }
    }

    .card-title-wrap {
      border-bottom: 3px solid var(--matte-black);
      padding-bottom: 20px;
      margin-bottom: 32px;
    }

    /* Checklist Items */
    .checklist-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .checklist-row {
      border: var(--neo-border);
      background-color: var(--bone-white);
      padding: 24px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 20px;
      align-items: center;
      transition: all var(--transition-fast);
    }

    @media (max-width: 600px) {
      .checklist-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .checklist-row.checked-completed {
      background-color: #ffffff;
      border-color: var(--border-gray);
      opacity: 0.95;
    }

    /* Checkbox Neobrutalist styling */
    .checkbox-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .neo-checkbox {
      appearance: none;
      width: 28px;
      height: 28px;
      border: 3px solid var(--matte-black);
      background-color: white;
      cursor: pointer;
      position: relative;
      transition: all var(--transition-fast);
    }

    .neo-checkbox:checked {
      background-color: var(--electric-green);
    }

    .neo-checkbox:checked::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--matte-black);
      font-family: var(--font-mono);
      font-weight: 900;
      font-size: 18px;
    }

    /* Item Details */
    .item-desc-wrap {
      display: flex;
      flex-direction: column;
    }

    .item-label {
      font-size: 18px;
      font-weight: 800;
      color: var(--matte-black);
      margin-bottom: 4px;
    }

    .item-details {
      font-size: 13px;
      color: rgba(13, 13, 13, 0.7);
    }

    /* Simulated Uploader Area */
    .uploader-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-upload {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 10px 16px;
      border: 2px solid var(--matte-black);
      background-color: white;
      cursor: pointer;
      box-shadow: 2px 2px 0px 0px var(--matte-black);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .btn-upload:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px 0px var(--matte-black);
    }

    .upload-status {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge {
      padding: 4px 8px;
      border: 1px solid var(--matte-black);
    }

    .status-badge.empty {
      background-color: transparent;
      color: var(--text-muted);
      border-color: #cccccc;
    }

    .status-badge.scanning {
      background-color: var(--signal-orange);
      color: white;
    }

    .status-badge.verified {
      background-color: var(--electric-green);
      color: var(--matte-black);
    }

    /* Side Panel Widgets */
    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .widget-box {
      background-color: var(--matte-black);
      color: var(--bone-white);
      border: var(--neo-border);
      box-shadow: var(--neo-shadow);
      padding: 32px;
    }

    .widget-box-white {
      background-color: white;
      color: var(--matte-black);
      border: var(--neo-border);
      box-shadow: 6px 6px 0px 0px var(--signal-orange);
      padding: 32px;
    }

    .gauge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 20px 0;
    }

    .radial-gauge {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 8px solid var(--border-gray);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 20px;
      transition: border-color var(--transition-fast);
    }

    .gauge-percent {
      font-family: var(--font-mono);
      font-size: 36px;
      font-weight: 900;
      color: var(--electric-green);
    }

    .btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      text-decoration: none;
      border: var(--neo-border);
      background-color: var(--electric-green);
      color: var(--matte-black);
      box-shadow: var(--neo-shadow-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-action:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px 0px var(--matte-black);
    }

    .btn-clear {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--bone-white);
      background: none;
      border: none;
      text-decoration: underline;
      cursor: pointer;
      margin-top: 12px;
      opacity: 0.7;
    }

    .btn-clear:hover {
      opacity: 1;
    }

    /* Toast Notification */
    .toast-popup {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: var(--matte-black);
      color: var(--electric-green);
      border: 2px solid var(--electric-green);
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      padding: 12px 24px;
      z-index: 120;
      box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .toast-popup.active {
      opacity: 1;
      transform: translateY(0);
    }

    .hidden-input {
      display: none;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);

  // 3. Document Data Structures
  const lanesData = {
    working_capital: {
      name: "Working Capital",
      accent: "#39FF14", // Electric Green
      docs: [
        {
          id: "wc_bank_statements",
          title: "3 Months Bank Statements",
          desc: "Full operational PDFs including all account pages (even empty summaries).",
          weight: 35
        },
        {
          id: "wc_voided_check",
          title: "Voided Operating Check",
          desc: "Clean pre-printed business bank check associated with deposit ledger.",
          weight: 15
        },
        {
          id: "wc_tax_returns",
          title: "Recent Business Tax Return",
          desc: "Institutional or IRS accepted file (First 2 pages at minimum).",
          weight: 30
        },
        {
          id: "wc_debt_schedule",
          title: "Current Debt Schedule",
          desc: "Listing active MCA, traditional financing pipelines, or balance sheets.",
          weight: 20
        }
      ]
    },
    equipment: {
      name: "Equipment Financing",
      accent: "#0047AB", // Cobalt Blue
      docs: [
        {
          id: "eq_invoice",
          title: "Equipment Invoice / Dealer Quote",
          desc: "Detailed spec list, seller ID parameters, serial data, and final pricing matrix.",
          weight: 40
        },
        {
          id: "eq_bank_statements",
          title: "3 Months Bank Statements",
          desc: "Verify baseline dynamic cash capacity metrics support deployment lease rate.",
          weight: 30
        },
        {
          id: "eq_pfs",
          title: "Personal Financial Statement (PFS)",
          desc: "Outlining assets, liabilities, real estate holdings, and liquid net-worth metrics.",
          weight: 30
        }
      ]
    },
    real_estate: {
      name: "Real Estate Investor",
      accent: "#FF5A09", // Signal Orange
      docs: [
        {
          id: "re_purchase_contract",
          title: "Executed Purchase & Sale Agreement",
          desc: "Full acquisition document countersigned by buyers and target property deeds.",
          weight: 30
        },
        {
          id: "re_deal_spec",
          title: "Property Appraisal or Deal Spec Sheets",
          desc: "Underwriting detail, structural condition status, dynamic exit values.",
          weight: 30
        },
        {
          id: "re_entity_docs",
          title: "Entity Formation Filing Papers",
          desc: "State certified corporate setup structures verifying transactional legitimacy.",
          weight: 20
        },
        {
          id: "re_experience_log",
          title: "Asset/Flip Track Record Resume",
          desc: "Concise timeline outlining previous holdings, completions, and performance yield.",
          weight: 20
        }
      ]
    }
  };

  // 4. Client State Setup
  let currentLane = localStorage.getItem('moonshine_locker_lane') || 'working_capital';
  if (!lanesData[currentLane]) currentLane = 'working_capital';

  // Initialize document structure dynamically
  document.title = "Secure Document Locker | Moonshine Capital System";
  
  // Render layout structure
  const rootContainer = document.createElement('div');
  rootContainer.className = 'locker-page-wrap';
  document.body.appendChild(rootContainer);

  function renderPageStructure() {
    rootContainer.innerHTML = `
      <header class="locker-header">
        <div class="locker-header-container">
          <a href="#" class="brand-group">
            <div class="logo-mark"><span>M</span></div>
            <span class="brand-text">MOONSHINE CAPITAL</span>
          </a>
          <span class="header-badge">SECURE CLIENT LOCKER</span>
        </div>
      </header>

      <div class="locker-layout">
        <main class="locker-main">
          <div style="margin-bottom: 24px;">
            <span style="font-family: var(--font-mono); font-size: 12px; color: var(--signal-orange); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Audit Preparation Dashboard</span>
            <h1 style="font-size: clamp(32px, 5vw, 42px); text-transform: uppercase;">Dynamic Prep Locker</h1>
            <p style="margin-top: 10px;">Select your primary funding lane target below to initialize a customized, secure checklist.</p>
          </div>

          <!-- Dynamic Lane Selection -->
          <nav class="lane-nav">
            <button class="lane-btn ${currentLane === 'working_capital' ? 'active' : ''}" onclick="window.switchLane('working_capital')">
              <div class="lane-btn-tag">Fast-Track</div>
              <div class="lane-btn-title">Working Capital</div>
            </button>
            <button class="lane-btn ${currentLane === 'equipment' ? 'active' : ''}" onclick="window.switchLane('equipment')">
              <div class="lane-btn-tag">Asset-Backed</div>
              <div class="lane-btn-title">Equipment Lease</div>
            </button>
            <button class="lane-btn ${currentLane === 'real_estate' ? 'active' : ''}" onclick="window.switchLane('real_estate')">
              <div class="lane-btn-tag">Debt & Equity</div>
              <div class="lane-btn-title">Real Estate</div>
            </button>
          </nav>

          <!-- Core Locker Checklist Card -->
          <div class="locker-card">
            <div class="card-title-wrap">
              <h2 id="lane-card-headline" style="font-size: 24px; text-transform: uppercase;">Required Application Stack</h2>
              <p style="font-size: 14px; margin-top: 4px; color: var(--text-muted);">Audit checks are stored locally on your device's browser runtime environment.</p>
            </div>

            <div id="checklist-render-target" class="checklist-list">
              <!-- Rendered items go here -->
            </div>
          </div>
        </main>

        <aside class="side-panel">
          <!-- Live Underwriting Status -->
          <div class="widget-box">
            <h3 style="font-size: 20px; text-transform: uppercase; border-bottom: 2px solid var(--border-gray); padding-bottom: 12px; margin-bottom: 20px;">Locker Integrity</h3>
            
            <div class="gauge-container">
              <div id="dynamic-radial-gauge" class="radial-gauge">
                <span id="gauge-percent-text" class="gauge-percent">0%</span>
              </div>
              <h4 style="font-size: 18px; margin-bottom: 4px; text-transform: uppercase;">Audit Readiness</h4>
              <p style="font-size: 13px; color: var(--text-muted); max-width: 240px;">Reach 100% to initialize fast-track route deployment algorithms.</p>
            </div>

            <button class="btn-action" onclick="window.submitPack()">
              <i class="fa-solid fa-cloud-arrow-up"></i> Export Docket Stack
            </button>
            <center>
              <button class="btn-clear" onclick="window.resetLockerState()">
                <i class="fa-solid fa-trash-can"></i> Clear All Files & Reset Checkbox State
              </button>
            </center>
          </div>

          <!-- Dynamic Underwriting Insight Box -->
          <div class="widget-box-white">
            <h3 style="font-size: 18px; text-transform: uppercase; margin-bottom: 12px;"><i class="fa-solid fa-shield-halved" style="color: var(--signal-orange);"></i> Encryption Node</h3>
            <p style="font-size: 13px; line-height: 1.5;">This operational workspace simulates an end-to-end sandbox client file room. Real files are analyzed locally in-memory; no storage data is piped outward to external server environments without authorization protocol clearance.</p>
          </div>
        </aside>
      </div>

      <!-- Live Notification Toast -->
      <div id="locker-toast" class="toast-popup">
        <i class="fa-solid fa-circle-check"></i> <span id="toast-message-target">Action complete</span>
      </div>
    `;
  }

  // Render Core layout first
  renderPageStructure();

  // 5. App State Management & Handlers
  window.switchLane = function(laneId) {
    if (!lanesData[laneId]) return;
    currentLane = laneId;
    localStorage.setItem('moonshine_locker_lane', laneId);
    
    // Update Document CSS Variable for Custom Accents dynamically
    document.documentElement.style.setProperty('--accent', lanesData[laneId].accent);

    // Redraw Buttons Active State
    document.querySelectorAll('.lane-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Trigger Interface Update
    updateChecklistUI();
    showToast(`Switched workspace to ${lanesData[laneId].name}`);
  };

  window.toggleCheckState = function(docId) {
    const key = `ms_locker_${docId}_chk`;
    const checkbox = document.getElementById(`chk_${docId}`);
    if (!checkbox) return;

    localStorage.setItem(key, checkbox.checked ? "true" : "false");
    
    const parentRow = document.getElementById(`row_${docId}`);
    if (checkbox.checked) {
      parentRow.classList.add('checked-completed');
    } else {
      parentRow.classList.remove('checked-completed');
    }
    
    calculateProgress();
  };

  window.triggerFileUpload = function(docId) {
    const fileInput = document.getElementById(`input_${docId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  window.handleFileChange = function(docId, event) {
    const files = event.target.files;
    if (files.length === 0) return;
    const file = files[0];

    // Simulate direct network security scan
    const statusBox = document.getElementById(`status_${docId}`);
    statusBox.innerHTML = `<span class="status-badge scanning"><i class="fa-solid fa-spinner fa-spin"></i> Scanning Draft...</span>`;

    setTimeout(() => {
      // Complete Analysis Simulation
      const metadata = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        timestamp: new Date().toLocaleDateString()
      };

      localStorage.setItem(`ms_locker_${docId}_file`, JSON.stringify(metadata));

      // Check the box if not already checked
      const keyCheck = `ms_locker_${docId}_chk`;
      localStorage.setItem(keyCheck, "true");
      
      const checkbox = document.getElementById(`chk_${docId}`);
      if (checkbox) checkbox.checked = true;

      const parentRow = document.getElementById(`row_${docId}`);
      if (parentRow) parentRow.classList.add('checked-completed');

      // Update UI
      updateChecklistUI();
      showToast(`Document validated: ${metadata.name}`);
    }, 1200);
  };

  window.resetLockerState = function() {
    if (confirm("Are you sure you want to clear your local secure sandbox storage configuration?")) {
      const activeLane = lanesData[currentLane];
      activeLane.docs.forEach(doc => {
        localStorage.removeItem(`ms_locker_${doc.id}_chk`);
        localStorage.removeItem(`ms_locker_${doc.id}_file`);
      });
      updateChecklistUI();
      showToast("Storage stack cleared successfully.");
    }
  };

  window.submitPack = function() {
    let currentScore = calculateProgress();
    if (currentScore < 100) {
      alert(`Pack building process currently sits at ${currentScore}%. Ensure all required criteria are fully compiled & validated.`);
    } else {
      alert("Congratulations! Your prep docket holds a verified 100% readiness score. Ready for dynamic routing integration!");
    }
  };

  function calculateProgress() {
    const activeLane = lanesData[currentLane];
    let totalScore = 0;
    
    activeLane.docs.forEach(doc => {
      const isChecked = localStorage.getItem(`ms_locker_${doc.id}_chk`) === "true";
      const hasFile = localStorage.getItem(`ms_locker_${doc.id}_file`) !== null;
      
      // Checking off or uploading dynamic metadata contributes to score build
      if (isChecked || hasFile) {
        totalScore += doc.weight;
      }
    });

    const progressText = document.getElementById('gauge-percent-text');
    const radialGauge = document.getElementById('dynamic-radial-gauge');

    if (progressText && radialGauge) {
      progressText.textContent = `${totalScore}%`;
      
      // Update visual border state based on score range
      if (totalScore === 100) {
        radialGauge.style.borderColor = "var(--electric-green)";
        progressText.style.color = "var(--electric-green)";
      } else if (totalScore >= 50) {
        radialGauge.style.borderColor = "var(--signal-orange)";
        progressText.style.color = "var(--signal-orange)";
      } else {
        radialGauge.style.borderColor = "var(--border-gray)";
        progressText.style.color = "white";
      }
    }
    return totalScore;
  }

  function updateChecklistUI() {
    const activeLane = lanesData[currentLane];
    
    // Update custom variables
    document.documentElement.style.setProperty('--accent', activeLane.accent);

    // Headline Update
    const headline = document.getElementById('lane-card-headline');
    if (headline) headline.textContent = `${activeLane.name} Documentation Pack`;

    const targetList = document.getElementById('checklist-render-target');
    if (!targetList) return;

    targetList.innerHTML = '';

    activeLane.docs.forEach(doc => {
      const isChecked = localStorage.getItem(`ms_locker_${doc.id}_chk`) === "true";
      const fileDataRaw = localStorage.getItem(`ms_locker_${doc.id}_file`);
      const fileData = fileDataRaw ? JSON.parse(fileDataRaw) : null;

      const checkedClass = isChecked ? 'checked-completed' : '';

      const rowHtml = `
        <div class="checklist-row ${checkedClass}" id="row_${doc.id}">
          <div class="checkbox-container">
            <input type="checkbox" class="neo-checkbox" id="chk_${doc.id}" onchange="window.toggleCheckState('${doc.id}')" ${isChecked ? 'checked' : ''}>
          </div>
          
          <div class="item-desc-wrap">
            <span class="item-label">${doc.title}</span>
            <span class="item-details">${doc.desc}</span>
            ${fileData ? `
              <div style="font-family: var(--font-mono); font-size: 11px; margin-top: 8px; color: var(--text-muted); display: flex; gap:10px;">
                <span><i class="fa-solid fa-file-pdf"></i> ${fileData.name} (${fileData.size})</span>
                <span>• Uploaded ${fileData.timestamp}</span>
              </div>
            ` : ''}
          </div>

          <div class="uploader-area">
            <div id="status_${doc.id}" class="upload-status">
              ${fileData ? `
                <span class="status-badge verified"><i class="fa-solid fa-shield-halved"></i> Docket Logged</span>
              ` : `
                <span class="status-badge empty">Draft Missing</span>
              `}
            </div>
            <button class="btn-upload" onclick="window.triggerFileUpload('${doc.id}')">Upload Draft</button>
            <input type="file" id="input_${doc.id}" class="hidden-input" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onchange="window.handleFileChange('${doc.id}', event)">
          </div>
        </div>
      `;

      targetList.insertAdjacentHTML('beforeend', rowHtml);
    });

    calculateProgress();
  }

  // Toast System implementation matching parent theme
  function showToast(message) {
    const toast = document.getElementById('locker-toast');
    const toastMsg = document.getElementById('toast-message-target');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('active');
      
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    }
  }

  // 6. Run initial application rendering pass
  updateChecklistUI();
})();