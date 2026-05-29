(function() {
  // 1. Dynamic Partner / Slug Context Resolver
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const slug = pathParts[pathParts.indexOf('partners') + 1] || 'elite-partner';
  
  // Format slug for human readability if dynamic mapping is unavailable
  const formatName = (str) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const partnerContext = {
    name: formatName(slug),
    company: `${formatName(slug)} Advisory Group`,
    accentColor: '#FF5A09', // Default signal orange accent for referrers
    applicationLink: '#onboard',
    websiteUrl: 'https://moonshine.capital'
  };

  // 2. Set Page Title & Metadata
  document.title = `B2B Referral Portal | ${partnerContext.name} x Moonshine Capital`;

  // 3. Inject External Assets (Fonts & Icons)
  const injectLink = (rel, href, crossOrigin) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  };

  injectLink('preconnect', 'https://fonts.googleapis.com');
  injectLink('preconnect', 'https://fonts.gstatic.com', 'anonymous');
  injectLink('stylesheet', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  injectLink('stylesheet', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

  // 4. Inject Unified Neobrutalist Stylesheet
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --matte-black: #0D0D0D;
      --bone-white: #F4F4F0;
      --electric-green: #39FF14;
      --signal-orange: #FF5A09;
      --cobalt-blue: #0047AB;
      --graphite-gray: #1C1C1C;
      --border-gray: #2D2D2D;
      --text-muted: #8E8E93;
      
      --accent: ${partnerContext.accentColor};
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      
      --neo-border: 3px solid var(--matte-black);
      --neo-shadow: 6px 6px 0px 0px var(--matte-black);
      --neo-shadow-sm: 3px 3px 0px 0px var(--matte-black);
      --neo-shadow-green: 6px 6px 0px 0px var(--electric-green);
      --neo-shadow-orange: 6px 6px 0px 0px var(--signal-orange);
      --neo-shadow-blue: 6px 6px 0px 0px var(--cobalt-blue);
      
      --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background-color: var(--bone-white);
      color: var(--matte-black);
      font-family: var(--font-sans);
    }

    body {
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::selection {
      background-color: var(--signal-orange);
      color: var(--bone-white);
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--matte-black);
      color: var(--bone-white);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid var(--matte-black);
      letter-spacing: 0.05em;
    }

    .badge-accent {
      background: var(--accent);
      color: var(--bone-white);
      border: 2px solid var(--matte-black);
      box-shadow: 2px 2px 0px 0px var(--matte-black);
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    p {
      line-height: 1.6;
      color: rgba(13, 13, 13, 0.85);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 28px;
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      text-decoration: none;
      border: var(--neo-border);
      background-color: var(--bone-white);
      color: var(--matte-black);
      box-shadow: var(--neo-shadow);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn:hover {
      transform: translate(-3px, -3px);
      box-shadow: 9px 9px 0px 0px var(--matte-black);
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 3px 3px 0px 0px var(--matte-black);
    }

    .btn-orange {
      background-color: var(--signal-orange);
      color: var(--bone-white);
    }

    .btn-orange:hover {
      box-shadow: 9px 9px 0px 0px var(--electric-green);
    }

    .btn-black {
      background-color: var(--matte-black);
      color: var(--bone-white);
    }

    /* Header Styling */
    header {
      background-color: var(--matte-black);
      border-bottom: 3px solid var(--matte-black);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 14px 0;
    }

    header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
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
      transition: transform var(--transition-fast);
    }

    .logo-mark span {
      transform: rotate(45deg);
      color: var(--matte-black);
      font-family: var(--font-mono);
      font-weight: 900;
      font-size: 18px;
    }

    .logo-text {
      font-family: var(--font-mono);
      color: var(--bone-white);
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 0.05em;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--matte-black) 0%, var(--graphite-gray) 100%);
      color: var(--bone-white);
      padding: 80px 0 100px 0;
      border-bottom: 8px solid var(--matte-black);
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(var(--border-gray) 1.5px, transparent 1.5px);
      background-size: 30px 30px;
      opacity: 0.35;
      pointer-events: none;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 64px;
      align-items: center;
    }

    .hero-title {
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 950;
      margin-bottom: 24px;
    }

    .hero-title span {
      display: block;
      color: var(--signal-orange);
      font-family: var(--font-mono);
      font-size: clamp(24px, 4vw, 36px);
      margin-top: 8px;
    }

    .hero-desc {
      font-size: 18px;
      line-height: 1.6;
      color: rgba(244, 244, 240, 0.85);
      margin-bottom: 32px;
    }

    .hero-badge-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }

    /* Calculator Widget */
    .calc-card {
      background-color: var(--bone-white);
      border: var(--neo-border);
      box-shadow: 10px 10px 0px 0px var(--electric-green);
      padding: 36px;
      color: var(--matte-black);
    }

    .calc-title {
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      border-bottom: 3px solid var(--matte-black);
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calc-title i {
      color: var(--signal-orange);
    }

    .calc-group {
      margin-bottom: 24px;
    }

    .calc-label-wrap {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .calc-val-bubble {
      background: var(--matte-black);
      color: var(--electric-green);
      padding: 2px 8px;
      font-size: 12px;
    }

    .calc-slider {
      width: 100%;
      height: 10px;
      background: #E5E5E0;
      border: 2px solid var(--matte-black);
      appearance: none;
      outline: none;
    }

    .calc-slider::-webkit-slider-thumb {
      appearance: none;
      width: 24px;
      height: 24px;
      background: var(--signal-orange);
      border: 2px solid var(--matte-black);
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--matte-black);
    }

    .calc-results {
      background: var(--matte-black);
      color: var(--bone-white);
      padding: 24px;
      border: 2px solid var(--matte-black);
      margin-top: 32px;
    }

    .calc-res-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px dashed var(--border-gray);
    }

    .calc-res-row:last-child {
      border-bottom: none;
      padding-top: 16px;
    }

    .calc-res-label {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .calc-res-val {
      font-family: var(--font-mono);
      font-size: 22px;
      font-weight: 800;
      color: var(--electric-green);
    }

    .calc-res-grand {
      font-size: 32px;
      color: var(--signal-orange);
      font-weight: 900;
    }

    /* Benefits and Collateral grid */
    .grid-section {
      padding: 100px 0;
      background-color: var(--bone-white);
    }

    .section-title-wrap {
      margin-bottom: 48px;
      text-align: center;
    }

    .section-mono-subtitle {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--signal-orange);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
      display: block;
    }

    .section-title {
      font-size: clamp(28px, 4vw, 42px);
      text-transform: uppercase;
      font-weight: 900;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }

    .benefit-card {
      background: white;
      border: var(--neo-border);
      box-shadow: var(--neo-shadow);
      padding: 32px;
      transition: all var(--transition-fast);
    }

    .benefit-card:hover {
      transform: translate(-4px, -4px);
      box-shadow: 10px 10px 0px 0px var(--matte-black);
    }

    .benefit-icon {
      width: 54px;
      height: 54px;
      background: var(--matte-black);
      color: var(--electric-green);
      border: var(--neo-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 24px;
    }

    .benefit-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .benefit-desc {
      font-size: 14px;
      color: rgba(13, 13, 13, 0.75);
    }

    /* Mockups Interactive Preview Showcase */
    .collateral-section {
      background-color: var(--matte-black);
      color: var(--bone-white);
      padding: 100px 0;
      border-top: 8px solid var(--matte-black);
    }

    .collateral-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 64px;
      align-items: center;
    }

    .collateral-tabs {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .collateral-tab-btn {
      background: var(--graphite-gray);
      color: var(--bone-white);
      border: 2px solid var(--border-gray);
      padding: 24px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      transition: all var(--transition-fast);
    }

    .collateral-tab-btn.active {
      background: var(--bone-white);
      color: var(--matte-black);
      border: var(--neo-border);
      box-shadow: var(--neo-shadow-orange);
    }

    .collateral-tab-btn i {
      font-size: 24px;
      margin-top: 4px;
      color: var(--signal-orange);
    }

    .collateral-tab-btn.active i {
      color: var(--matte-black);
    }

    .collateral-tab-title {
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .collateral-tab-desc {
      font-size: 13px;
      opacity: 0.8;
    }

    .collateral-preview-box {
      background: var(--graphite-gray);
      border: 3px solid var(--border-gray);
      padding: 32px;
      min-height: 400px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .collateral-preview-box::before {
      content: 'PREVIEW SYSTEM';
      position: absolute;
      top: 12px;
      left: 12px;
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }

    .mockup-display {
      width: 100%;
      height: 100%;
      display: none;
      animation: fadeIn 0.3s ease-out forwards;
    }

    .mockup-display.active {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Onboarding wizard form */
    .onboard-section {
      padding: 100px 0;
      background-color: var(--bone-white);
      border-top: 8px solid var(--matte-black);
    }

    .form-box {
      max-width: 780px;
      margin: 0 auto;
      background: white;
      border: var(--neo-border);
      box-shadow: var(--neo-shadow);
      padding: 48px;
    }

    .step-indicator-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 40px;
    }

    .step-indicator {
      height: 8px;
      background: #E5E5E0;
      border: 1px solid var(--matte-black);
    }

    .step-indicator.active {
      background: var(--signal-orange);
    }

    .step-indicator.completed {
      background: var(--electric-green);
    }

    .wizard-step {
      display: none;
    }

    .wizard-step.active {
      display: block;
      animation: fadeIn 0.3s ease-out;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: block;
    }

    .form-control {
      width: 100%;
      padding: 16px;
      border: var(--neo-border);
      font-family: var(--font-sans);
      font-size: 15px;
      outline: none;
      background-color: var(--bone-white);
    }

    .form-control:focus {
      background-color: white;
      box-shadow: var(--neo-shadow-sm);
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .checkbox-btn-wrapper {
      position: relative;
    }

    .checkbox-btn-wrapper input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .checkbox-custom-label {
      display: block;
      padding: 14px;
      border: var(--neo-border);
      background: white;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      user-select: none;
      transition: all var(--transition-fast);
    }

    .checkbox-btn-wrapper input[type="checkbox"]:checked + .checkbox-custom-label {
      background: var(--electric-green);
      box-shadow: var(--neo-shadow-sm);
      transform: translate(-2px, -2px);
    }

    .wizard-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      border-top: 2px dashed var(--matte-black);
      padding-top: 24px;
    }

    /* FAQ accordion styling */
    .faq-section {
      padding: 100px 0;
      background-color: var(--bone-white);
      border-top: 8px solid var(--matte-black);
    }

    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 48px;
    }

    .faq-item {
      border: var(--neo-border);
      background-color: white;
      box-shadow: var(--neo-shadow-sm);
      transition: all var(--transition-fast);
    }

    .faq-trigger {
      width: 100%;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 16px;
      font-weight: 800;
      color: var(--matte-black);
    }

    .faq-icon-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--matte-black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: transform var(--transition-fast);
    }

    .faq-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .faq-content-inner {
      padding: 0 24px 24px 24px;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(13, 13, 13, 0.8);
    }

    .faq-item.active {
      box-shadow: 4px 4px 0px 0px var(--signal-orange);
    }

    .faq-item.active .faq-icon-circle {
      transform: rotate(45deg);
      background-color: var(--signal-orange);
      color: white;
    }

    /* Footer styling */
    footer {
      background-color: var(--matte-black);
      color: var(--bone-white);
      padding: 60px 0;
      font-size: 13px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr repeat(2, 1fr);
      gap: 48px;
      margin-bottom: 48px;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .footer-column-title {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--electric-green);
      text-transform: uppercase;
      margin-bottom: 20px;
      letter-spacing: 0.1em;
    }

    .footer-links {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--bone-white);
    }

    .compliance-box {
      border-top: 1px solid var(--border-gray);
      padding-top: 32px;
      color: var(--text-muted);
      font-size: 11px;
      line-height: 1.6;
    }

    /* Toast Notification */
    .toast-notification {
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

    .toast-notification.active {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 991px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }
      .collateral-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  // 5. Inject DOM Layout Into Body
  document.body.innerHTML = `
    <!-- HEADER -->
    <header>
      <div class="container">
        <div class="logo-container">
          <div class="logo-mark"><span>M</span></div>
          <div class="logo-text">MOONSHINE</div>
        </div>
        <div class="header-actions">
          <span class="badge badge-accent">Partner Hub System</span>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge-wrap">
              <span class="badge"><i class="fa-solid fa-handshake"></i> B2B Referral Network</span>
              <span class="badge badge-accent">Co-branded deployment</span>
            </div>
            <h1 class="hero-title">
              Mobilize Your Network's Capital Capacity
              <span>Direct Underwriting Priority Routing</span>
            </h1>
            <p class="hero-desc">
              Partner with <strong>${partnerContext.name}</strong> and Moonshine Capital. Route your client ecosystem to premier capital desks. Estimate dynamic splits, utilize co-branded templates, and onboard directly below.
            </p>
            <div style="display: flex; gap: 16px;">
              <a href="#onboard" class="btn btn-orange">Register Platform</a>
              <a href="#calculator" class="btn btn-black">Calculate Splits</a>
            </div>
          </div>

          <!-- Commission Calculator Card -->
          <div class="calc-card" id="calculator">
            <div class="calc-title">
              <span>Split Calculator</span>
              <i class="fa-solid fa-calculator"></i>
            </div>
            <div class="calc-group">
              <div class="calc-label-wrap">
                <span>Est. Average Deal Size</span>
                <span class="calc-val-bubble" id="val-deal">-$500,000</span>
              </div>
              <input type="range" class="calc-slider" id="slider-deal" min="50000" max="1500000" step="25000" value="500000">
            </div>
            <div class="calc-group">
              <div class="calc-label-wrap">
                <span>Referred monthly Volume</span>
                <span class="calc-val-bubble" id="val-qty">2 Deals</span>
              </div>
              <input type="range" class="calc-slider" id="slider-qty" min="1" max="15" step="1" value="2">
            </div>

            <div class="calc-results">
              <div class="calc-res-row">
                <span class="calc-res-label">Program Base Yield</span>
                <span class="calc-res-val" id="res-yield">3.00%</span>
              </div>
              <div class="calc-res-row">
                <span class="calc-res-label">Your Profit Allocation</span>
                <span class="calc-res-val" id="res-split">50.0%</span>
              </div>
              <div class="calc-res-row">
                <span class="calc-res-label">Estimated Monthly Return</span>
                <span class="calc-res-val calc-res-grand" id="res-monthly">$15,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STRATEGIC BENEFITS GRID -->
    <section class="grid-section">
      <div class="container">
        <div class="section-title-wrap">
          <span class="section-mono-subtitle">Partner Value Stack</span>
          <h2 class="section-title">Engineered to execute commercial deals</h2>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-coins"></i></div>
            <h3 class="benefit-title">Dynamic Commission Tiers</h3>
            <p class="benefit-desc">No ceilings. Scale your monthly splits from standard baseline revenue points to premium partner overrides directly matching portfolio momentum.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-user-shield"></i></div>
            <h3 class="benefit-title">Desk Priority Status</h3>
            <p class="benefit-desc">Your referrals execute bypassing regular retail brokerage desks, communicating straight to senior managing underwriters for high speed evaluation.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon"><i class="fa-solid fa-chart-pie"></i></div>
            <h3 class="benefit-title">Complete Pipeline Integrity</h3>
            <p class="benefit-desc">Live ledger analytics and instant SMS deployment triggers keep you aligned with document steps, milestones, and direct approval status.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CO-MARKETING PREVIEW SYSTEM -->
    <section class="collateral-section">
      <div class="container">
        <div class="section-title-wrap">
          <span class="section-mono-subtitle" style="color: var(--electric-green);">Pre-Packaged Collateral Pack</span>
          <h2 class="section-title">Co-Branded Marketing Systems</h2>
        </div>
        <div class="collateral-grid">
          <div class="collateral-tabs">
            <button class="collateral-tab-btn active" data-tab="preview-landing">
              <i class="fa-solid fa-laptop-code"></i>
              <div>
                <h4 class="collateral-tab-title">Dedicated Link Routing</h4>
                <p class="collateral-tab-desc">Fully structured portal displaying your branding with deep API triggers.</p>
              </div>
            </button>
            <button class="collateral-tab-btn" data-tab="preview-deck">
              <i class="fa-solid fa-file-pdf"></i>
              <div>
                <h4 class="collateral-tab-title">Executive Presentation Guide</h4>
                <p class="collateral-tab-desc">Direct white-labeled resource document outlining funding vehicles to clients.</p>
              </div>
            </button>
            <button class="collateral-tab-btn" data-tab="preview-comms">
              <i class="fa-solid fa-paper-plane"></i>
              <div>
                <h4 class="collateral-tab-title">Pre-Formatted Outreach sequences</h4>
                <p class="collateral-tab-desc">Cold-contact optimization templates built to secure high engagement.</p>
              </div>
            </button>
          </div>

          <!-- Dynamic Sandbox Mockup Container -->
          <div class="collateral-preview-box">
            <!-- Mockup A -->
            <div class="mockup-display active" id="preview-landing">
              <div style="background: var(--matte-black); border: 2px solid var(--border-gray); padding: 16px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 12px; font-family: var(--font-mono);">
                  <span>HTTPS://MOONSHINE.CAPITAL/SECURE-PORTAL</span>
                  <span>SSL SECURE ✓</span>
                </div>
                <div style="border: 2px solid var(--electric-green); padding: 16px; background-color: var(--graphite-gray);">
                  <span style="font-size: 10px; font-family: var(--font-mono); color: var(--electric-green);">EXCLUSIVE INTAKE ROUTE</span>
                  <h5 style="font-size: 18px; margin-top: 4px; text-transform: uppercase;">${partnerContext.name} <span style="color: var(--electric-green);">x</span> Moonshine Hub</h5>
                  <p style="font-size: 11px; margin-top: 8px; color: var(--text-muted);">Secure, direct operational pipeline. Enterprise priority onboarding active.</p>
                </div>
              </div>
            </div>

            <!-- Mockup B -->
            <div class="mockup-display" id="preview-deck">
              <div style="background: white; color: var(--matte-black); border: var(--neo-border); padding: 24px; box-shadow: var(--neo-shadow-sm);">
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--matte-black); padding-bottom: 8px; margin-bottom: 16px;">
                  <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 800;">DEAL MEMO</span>
                  <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 800;">PAGE 01</span>
                </div>
                <h4 style="font-size: 20px; font-weight: 900; line-height: 1.1; margin-bottom: 8px;">INSTITUTIONAL LIQUIDITY CHANNELS</h4>
                <p style="font-size: 12px; color: rgba(13,13,13,0.7); margin-bottom: 16px;">Comprehensive overview maps. Working capital, structured bridge credit, equipment facilities.</p>
                <div style="height: 6px; background: var(--signal-orange);"></div>
              </div>
            </div>

            <!-- Mockup C -->
            <div class="mockup-display" id="preview-comms">
              <div style="background: var(--graphite-gray); border: 2px solid var(--border-gray); padding: 20px; font-family: var(--font-mono); font-size: 12px; color: rgba(244, 244, 240, 0.9);">
                <span style="color: var(--text-muted);">SUBJECT: Direct Underwriting Integration for client portfolio liquidity</span>
                <hr style="border: none; border-top: 1px dashed var(--border-gray); margin: 12px 0;">
                <p style="margin-bottom: 12px;">Hey [Client_Name],</p>
                <p style="margin-bottom: 12px;">Through our co-branded execution desk directly with ${partnerContext.name} & Moonshine Capital, we have structured a dedicated priority route to audit and scale your credit capacity limits instantly...</p>
                <div style="display: inline-block; background: var(--signal-orange); color: white; padding: 6px 12px; font-weight: 800;">ACCESS SCHEDULER</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ONBOARDING FORM WIZARD -->
    <section class="onboard-section" id="onboard">
      <div class="container">
        <div class="section-title-wrap">
          <span class="section-mono-subtitle">Partner Registry</span>
          <h2 class="section-title">Onboarding Execution Desk</h2>
        </div>

        <div class="form-box">
          <div class="step-indicator-bar">
            <div class="step-indicator active" id="indicator-1"></div>
            <div class="step-indicator" id="indicator-2"></div>
            <div class="step-indicator" id="indicator-3"></div>
          </div>

          <form id="referral-form" onsubmit="return false;">
            <!-- Step 1: Partner Information -->
            <div class="wizard-step active" id="form-step-1">
              <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; text-transform: uppercase;">Professional Profile</h3>
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="partner-name" placeholder="Johnathan Doe" required>
              </div>
              <div class="form-group">
                <label class="form-label">Company / Practice</label>
                <input type="text" class="form-control" id="partner-company" placeholder="Consolidated Financial Advising LLC" required>
              </div>
              <div class="form-group">
                <label class="form-label">Active Professional Sector</label>
                <div class="checkbox-grid">
                  <label class="checkbox-btn-wrapper">
                    <input type="checkbox" name="sector" value="CPA">
                    <span class="checkbox-custom-label">CPA / Accountant</span>
                  </label>
                  <label class="checkbox-btn-wrapper">
                    <input type="checkbox" name="sector" value="Consultant">
                    <span class="checkbox-custom-label">Business Coach</span>
                  </label>
                  <label class="checkbox-btn-wrapper">
                    <input type="checkbox" name="sector" value="CRE Broker">
                    <span class="checkbox-custom-label">CRE Agent</span>
                  </label>
                  <label class="checkbox-btn-wrapper">
                    <input type="checkbox" name="sector" value="Other">
                    <span class="checkbox-custom-label">Corporate Advisor</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 2: Operational Targets -->
            <div class="wizard-step" id="form-step-2">
              <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; text-transform: uppercase;">Capital Direction Targets</h3>
              <div class="form-group">
                <label class="form-label">Primary Target Capital Focus</label>
                <select class="form-control" id="capital-target" required style="-webkit-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>'); background-repeat: no-repeat; background-position: right 16px center;">
                  <option value="Working Capital">Working Capital Lines</option>
                  <option value="Equipment Finance">Equipment Lease Structures</option>
                  <option value="Real Estate">CRE Bridge Financing</option>
                  <option value="SBA & Mid Market">SBA Program Coordination</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Average Anticipated Referral Speed</label>
                <select class="form-control" id="referral-volume" required style="-webkit-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>'); background-repeat: no-repeat; background-position: right 16px center;">
                  <option value="Occasional">1-2 Transactions / Quarter</option>
                  <option value="Consistent">1-4 Transactions / Month</option>
                  <option value="High Volume">5+ Transactions / Month</option>
                </select>
              </div>
            </div>

            <!-- Step 3: Payout Route Setup -->
            <div class="wizard-step" id="form-step-3">
              <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; text-transform: uppercase;">Payout Routing Verification</h3>
              <div class="form-group">
                <label class="form-label">Payout Email Address</label>
                <input type="email" class="form-control" id="partner-payout" placeholder="treasury@myfirm.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Target Routing Format</label>
                <select class="form-control" id="routing-payout" style="-webkit-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>'); background-repeat: no-repeat; background-position: right 16px center;">
                  <option value="Direct ACH">Direct ACH Transfer</option>
                  <option value="Wire Transfer">Same-day Bank Wire</option>
                  <option value="Corporate Check">Physical Draft Dispatch</option>
                </select>
              </div>
            </div>

            <div class="wizard-actions">
              <button class="btn btn-black" id="btn-prev" style="visibility: hidden;">Previous</button>
              <button class="btn btn-orange" id="btn-next">Next Step</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="faq-section">
      <div class="container">
        <div class="faq-container">
          <span class="section-mono-subtitle" style="text-align: center;">Partner Policy Audits</span>
          <h2 class="section-title" style="text-align: center;">Operational Directives</h2>
          
          <div class="faq-list">
            <div class="faq-item">
              <button class="faq-trigger">
                <span>When are referral commissions paid out?</span>
                <div class="faq-icon-circle"><i class="fa-solid fa-plus"></i></div>
              </button>
              <div class="faq-content">
                <div class="faq-content-inner">
                  Payouts settle within 48 operational hours post-clearing of the primary borrower's bank funding. All tracking ledger coordinates are transparently audited live in your executive dashboard.
                </div>
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-trigger">
                <span>Are there limitations on industries or deal classes?</span>
                <div class="faq-icon-circle"><i class="fa-solid fa-plus"></i></div>
              </button>
              <div class="faq-content">
                <div class="faq-content-inner">
                  We cover practically all standard commercial domains, including logistics, healthcare practices, real estate acquisitions, hospitality, and ecommerce pipelines. Restricted vectors conform strictly to baseline institutional compliance frameworks.
                </div>
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-trigger">
                <span>How is client communication handled?</span>
                <div class="faq-icon-circle"><i class="fa-solid fa-plus"></i></div>
              </button>
              <div class="faq-content">
                <div class="faq-content-inner">
                  We support both hands-on executive triage (joint advisory workflows) or standard digital hand-offs where our senior desks manage standard pipeline operations on behalf of your client seamlessly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo-container">
              <div class="logo-mark"><span>M</span></div>
              <div class="logo-text">MOONSHINE</div>
            </div>
            <p style="color: var(--text-muted);">Fintech infrastructure engineered for high speed execution desks and enterprise partners globally.</p>
          </div>
          <div>
            <h4 class="footer-column-title">Direct Inquiries</h4>
            <ul class="footer-links">
              <li><strong>Manager:</strong> ${partnerContext.name}</li>
              <li><strong>Ecosystem:</strong> ${partnerContext.company}</li>
              <li><strong>Execution:</strong> Worldwide Routing</li>
            </ul>
          </div>
          <div>
            <h4 class="footer-column-title">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#calculator">Dynamic Calculator</a></li>
              <li><a href="#onboard">Registry Form</a></li>
              <li><a href="${partnerContext.websiteUrl}">Corporate Portal</a></li>
            </ul>
          </div>
        </div>
        <div class="compliance-box">
          <p><strong>Affiliate Regulatory Notice:</strong> Partner payouts, processing, direct wiring speeds, and underwriting limits are strictly contingent upon target borrower document authentication, transaction clearances, and credit analysis profiles. Moonshine Capital executes operations in strict adherence to premium commercial standards.</p>
          <p style="margin-top: 12px;">&copy; ${new Date().getFullYear()} Moonshine Capital Systems & ${partnerContext.company}. All brand assets secured.</p>
        </div>
      </div>
    </footer>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toast" class="toast-notification">
      <i class="fa-solid fa-circle-check"></i> <span id="toast-message">Onboarding Step Updated</span>
    </div>
  `;

  // 6. Interactive Logic and Application Orchestration
  document.addEventListener("DOMContentLoaded", () => {
    // FAQ Accordion Mechanics
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.parentElement;
        const content = item.querySelector('.faq-content');
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-content').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });

    // Interactive Split Calculator Metrics
    const dealSlider = document.getElementById('slider-deal');
    const qtySlider = document.getElementById('slider-qty');
    const valDeal = document.getElementById('val-deal');
    const valQty = document.getElementById('val-qty');

    const resYield = document.getElementById('res-yield');
    const resSplit = document.getElementById('res-split');
    const resMonthly = document.getElementById('res-monthly');

    const updateCalculator = () => {
      const dealSize = parseInt(dealSlider.value);
      const dealCount = parseInt(qtySlider.value);
      const totalVolume = dealSize * dealCount;

      valDeal.textContent = `$${dealSize.toLocaleString()}`;
      valQty.textContent = `${dealCount} Deal${dealCount > 1 ? 's' : ''}`;

      // Progressive Tier Architecture
      let yieldRate = 0.03; 
      let splitPercent = 0.50; 

      if (totalVolume >= 1000000) {
        yieldRate = 0.045;
        splitPercent = 0.60;
      } else if (totalVolume >= 500000) {
        yieldRate = 0.035;
        splitPercent = 0.55;
      }

      const commissionVolume = totalVolume * yieldRate;
      const partnerEarnings = commissionVolume * splitPercent;

      resYield.textContent = `${(yieldRate * 100).toFixed(2)}%`;
      resSplit.textContent = `${(splitPercent * 100).toFixed(1)}%`;
      resMonthly.textContent = `$${Math.round(partnerEarnings).toLocaleString()}`;
    };

    dealSlider.addEventListener('input', updateCalculator);
    qtySlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Initial calculation trigger

    // Tab Interface Preview System
    const tabBtns = document.querySelectorAll('.collateral-tab-btn');
    const mockups = document.querySelectorAll('.mockup-display');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        mockups.forEach(m => m.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
        showToast("Preview updated successfully");
      });
    });

    // Multi-Step Registration Wizard logic
    let currentStep = 1;
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const form = document.getElementById('referral-form');

    const updateWizardUI = () => {
      // Manage steps
      document.querySelectorAll('.wizard-step').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === currentStep);
      });

      // Manage indicators
      document.querySelectorAll('.step-indicator').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === currentStep);
        el.classList.toggle('completed', index + 1 < currentStep);
      });

      // Manage Prev visibility
      btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

      // Update button labels
      if (currentStep === 3) {
        btnNext.textContent = "Submit Onboarding";
      } else {
        btnNext.textContent = "Next Step";
      }
    };

    btnNext.addEventListener('click', () => {
      if (currentStep === 3) {
        // Form Verification & submission simulated flow
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        btnNext.disabled = true;
        btnNext.textContent = "Registering...";
        setTimeout(() => {
          showToast("Registration Completed. Welcome to the Network!");
          btnNext.textContent = "Welcome Aboard";
          // Render success message inside step 3
          document.getElementById('form-step-3').innerHTML = `
            <div style="text-align: center; padding: 24px;">
              <i class="fa-solid fa-circle-check" style="color: var(--electric-green); font-size: 48px; margin-bottom: 16px;"></i>
              <h3 style="text-transform: uppercase; font-size: 22px; margin-bottom: 8px;">Security Handshake Active</h3>
              <p style="font-size: 14px; color: var(--text-muted);">Check your secure inbox. Your dedicated priority affiliate link is now compiling.</p>
            </div>
          `;
          btnPrev.style.display = 'none';
          btnNext.style.display = 'none';
        }, 1500);
      } else {
        if (currentStep === 1) {
          const nameInp = document.getElementById('partner-name');
          const compInp = document.getElementById('partner-company');
          if (!nameInp.value || !compInp.value) {
            form.reportValidity();
            return;
          }
        }
        currentStep++;
        updateWizardUI();
        showToast("Navigating registration process");
      }
    });

    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });

    // Toast Notification utility
    const showToast = (message) => {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');
      toastMsg.textContent = message;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    };
  });
})();
