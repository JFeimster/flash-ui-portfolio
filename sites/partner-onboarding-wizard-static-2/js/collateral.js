const style = document.createElement('style');
style.textContent = `
  .collateral-grid { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 30px; 
    margin-top: 20px; 
  }
  @media (min-width: 768px) { 
    .collateral-grid { grid-template-columns: 1fr 1fr; } 
  }
  .collateral-card { 
    border: var(--border-thick); 
    background: var(--bg); 
    padding: 24px; 
    box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000; 
    position: relative; 
  }
  .collateral-card-title { 
    font-family: 'Archivo Black', sans-serif; 
    text-transform: uppercase; 
    font-size: 18px; 
    margin-bottom: 15px; 
    border-bottom: var(--border-thin); 
    padding-bottom: 8px; 
  }
  .banner-preview { 
    border: var(--border-thin); 
    background: var(--dark); 
    color: #fff; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    position: relative; 
    overflow: hidden; 
    margin-bottom: 15px; 
  }
  .banner-preview-300x250 { 
    width: 100%; 
    height: 250px; 
  }
  .banner-preview-728x90 { 
    width: 100%; 
    height: 90px; 
  }
  .banner-text { 
    font-family: 'Archivo Black', sans-serif; 
    font-size: 22px; 
    color: var(--accent); 
    text-align: center; 
    line-height: 1.1; 
    z-index: 10; 
    padding: 10px; 
    text-transform: uppercase; 
  }
  .banner-subtext { 
    font-size: 10px; 
    font-weight: 800; 
    color: #fff; 
    z-index: 10; 
    margin-top: 5px; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
  }
  .banner-stripe-bg { 
    position: absolute; 
    width: 200%; 
    height: 40px; 
    background: var(--accent); 
    transform: rotate(-25deg); 
    opacity: 0.35; 
  }
  .swipe-selector-btn { 
    border: var(--border-thin); 
    padding: 8px 12px; 
    font-weight: 800; 
    background: var(--bg); 
    cursor: pointer; 
    font-size: 11px; 
    text-transform: uppercase; 
  }
  .swipe-selector-btn.active { 
    background: var(--accent); 
    color: var(--dark); 
  }
  .swipe-textarea { 
    width: 100%; 
    height: 160px; 
    font-family: monospace; 
    font-size: 13px; 
    font-weight: bold; 
    border: var(--border-thin); 
    padding: 10px; 
    background: #fafafa; 
    resize: none; 
    margin-top: 10px; 
    outline: none;
  }
  .brutal-toast { 
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    background: var(--accent); 
    border: var(--border-thick); 
    color: var(--dark); 
    padding: 15px 25px; 
    font-family: 'Archivo Black', sans-serif; 
    font-size: 13px; 
    box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000; 
    z-index: 99999; 
    display: none; 
    text-transform: uppercase;
  }
  .brutal-select { 
    width: 100%; 
    padding: 12px; 
    border: var(--border-thin); 
    font-family: 'Archivo Black', sans-serif; 
    font-size: 14px; 
    outline: none; 
    background: white; 
    margin-bottom: 15px; 
    appearance: none; 
    -webkit-appearance: none; 
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>"); 
    background-repeat: no-repeat; 
    background-position: right 10px center; 
  }
  .asset-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); 
    gap: 15px; 
  }
  .logo-asset-box { 
    border: var(--border-thin); 
    padding: 15px; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 10px; 
    text-align: center; 
  }
`;
document.head.appendChild(style);

const stepCollateralHTML = `
  <section id="step-collateral" class="step-section">
    <div class="step-header">
      <h2 class="step-title font-display" style="font-size: 52px;">Asset Command & Link Vault</h2>
      <p class="step-desc">Access high-converting brand collateral, raw copy files, and configure real-time customized referral paths.</p>
    </div>

    <!-- Dynamic Link Builder -->
    <div style="border: var(--border-thick); padding: 30px; background-color: var(--bg-alt); margin-bottom: 30px;">
      <h3 class="font-display" style="font-size: 20px; margin-bottom: 15px; border-bottom: var(--border-thin); padding-bottom: 5px;">Tactical Link Configurator</h3>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
          <label class="input-label">Select Campaign Destination Node</label>
          <select id="link-destination" class="brutal-select" onchange="generateVaultLink()">
            <option value="high-yield" selected>High-Yield Working Capital [Core Offer]</option>
            <option value="bridge-loan">Bridge Loan Accelerator Portal</option>
            <option value="equipment">Equipment Lease Finance Funnel</option>
            <option value="mca">Merchant Cash Fast-Track</option>
          </select>
        </div>
        <div>
          <label class="input-label">Affiliate Tracking Key Reference</label>
          <input type="text" id="link-aff-id" class="input-brutal" style="padding: 12px; font-size: 16px;" placeholder="partner-demo" oninput="generateVaultLink()">
        </div>
      </div>

      <div style="background: var(--dark); color: #fff; padding: 20px; border: var(--border-thin); margin-bottom: 20px;">
        <p style="font-family: 'Archivo Black', sans-serif; font-size: 11px; text-transform: uppercase; color: var(--accent); margin-bottom: 5px;">Generated Sourcing Link</p>
        <div id="vault-generated-link" style="font-family: monospace; font-size: 16px; font-weight: bold; word-break: break-all;">Configure destination above...</div>
      </div>

      <button id="btn-copy-vault-link" class="btn-brutal" style="width: 100%;" onclick="copyVaultLink()">
        COPY GENERATED SECURE LINK →
      </button>
    </div>

    <!-- Collateral Grid -->
    <div class="collateral-grid">
      
      <!-- Brand Assets -->
      <div class="collateral-card">
        <h3 class="collateral-card-title">Brand Identity Core</h3>
        <p style="font-size: 13px; font-weight: 800; margin-bottom: 15px;">Inject authentic Moonshine assets into your platforms.</p>
        
        <div class="asset-grid">
          <div class="logo-asset-box bg-dark text-white">
            <div style="width: 30px; height: 30px; background: var(--accent); border: var(--border-thin)"></div>
            <span style="font-size: 10px; font-weight: 900;">Logo Dark</span>
            <button class="swipe-selector-btn" style="padding: 4px 8px; font-size: 9px;" onclick="copyAssetCode('dark-logo')">Get SVG</button>
          </div>
          <div class="logo-asset-box" style="background: var(--accent);">
            <div style="width: 30px; height: 30px; background: #fff; border: var(--border-thin)"></div>
            <span style="font-size: 10px; font-weight: 900; color: #000;">Logo Orange</span>
            <button class="swipe-selector-btn" style="padding: 4px 8px; font-size: 9px;" onclick="copyAssetCode('orange-logo')">Get SVG</button>
          </div>
          <div class="logo-asset-box" style="background: #e5e5e5;">
            <div style="width: 30px; height: 30px; background: var(--dark); border: var(--border-thin)"></div>
            <span style="font-size: 10px; font-weight: 900; color: #000;">Logo Light</span>
            <button class="swipe-selector-btn" style="padding: 4px 8px; font-size: 9px;" onclick="copyAssetCode('light-logo')">Get SVG</button>
          </div>
        </div>
      </div>

      <!-- High-Contrast Display Banners -->
      <div class="collateral-card">
        <h3 class="collateral-card-title">Banners Preview & Embed</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
          <button id="btn-banner-300" class="swipe-selector-btn active" onclick="switchBanner('300')">MREC (300x250)</button>
          <button id="btn-banner-728" class="swipe-selector-btn" onclick="switchBanner('728')">Leaderboard (728x90)</button>
        </div>

        <!-- 300x250 Preview -->
        <div id="banner-300-wrapper" class="banner-preview banner-preview-300x250">
          <div class="banner-stripe-bg"></div>
          <div class="banner-text">UNLIMITED<br>CAPITAL DEPLOYED</div>
          <div class="banner-subtext">Moonshine Capital Partner Engine</div>
          <div style="background: var(--accent); border: var(--border-thin); color: var(--dark); font-weight: 900; padding: 6px 12px; margin-top: 15px; font-size: 10px; text-transform: uppercase;">Apply Online</div>
        </div>

        <!-- 728x90 Preview -->
        <div id="banner-728-wrapper" class="banner-preview banner-preview-728x90" style="display: none;">
          <div class="banner-stripe-bg"></div>
          <div style="display: flex; align-items: center; gap: 20px; z-index: 10;">
            <div class="banner-text" style="font-size: 16px; margin: 0;">CAPITAL ACCELERATOR // MOONSHINE</div>
            <div style="background: var(--accent); border: var(--border-thin); color: var(--dark); font-weight: 900; padding: 4px 10px; font-size: 10px; text-transform: uppercase;">GET FUNDED NOW</div>
          </div>
        </div>

        <button class="btn-brutal" style="width: 100%; font-size: 14px; padding: 12px;" onclick="copyBannerEmbed()">
          COPY EMBED HTML CODE →
        </button>
      </div>

      <!-- Pre-written Email Swipes -->
      <div class="collateral-card" style="grid-column: 1 / -1;">
        <h3 class="collateral-card-title">Pre-Written Email Pipelines</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
          <button id="btn-swipe-cold" class="swipe-selector-btn active" onclick="switchSwipe('cold')">Cold Operator Pitch</button>
          <button id="btn-swipe-warm" class="swipe-selector-btn" onclick="switchSwipe('warm')">Warm Referral Intro</button>
          <button id="btn-swipe-urgency" class="swipe-selector-btn" onclick="switchSwipe('urgency')">Urgency / Capital Call</button>
        </div>

        <div>
          <label class="input-label" style="font-size: 11px;">Subject Line Preview</label>
          <div id="swipe-subject" style="border: var(--border-thin); padding: 10px; background: var(--bg-alt); font-weight: 900; font-size: 14px; margin-bottom: 12px;"></div>
          
          <label class="input-label" style="font-size: 11px;">Body Copy</label>
          <textarea id="swipe-body" class="swipe-textarea" readonly></textarea>
        </div>

        <div style="display: flex; gap: 15px; margin-top: 15px;">
          <button class="btn-brutal" style="flex: 1; font-size: 14px; padding: 12px;" onclick="copySwipe('subject')">COPY SUBJECT LINE</button>
          <button class="btn-brutal" style="flex: 1; font-size: 14px; padding: 12px;" onclick="copySwipe('body')">COPY BODY COPY</button>
        </div>
      </div>

    </div>

    <div style="margin-top: 40px; display: flex; gap: 20px;">
      <button class="btn-brutal btn-secondary" onclick="goToStep(4)">
        ← BACK TO DASHBOARD
      </button>
    </div>
  </section>
`;

const mainContent = document.querySelector('.main-content');
if (mainContent) {
  mainContent.insertAdjacentHTML('beforeend', stepCollateralHTML);
}

const toastDiv = document.createElement('div');
toastDiv.id = 'brutal-toast';
toastDiv.className = 'brutal-toast';
document.body.appendChild(toastDiv);

window.showToast = function(msg) {
  const toast = document.getElementById('brutal-toast');
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
};

const step4 = document.getElementById('step-dashboard');
if (step4) {
  const buttons = step4.querySelectorAll('.btn-actions-row button');
  buttons.forEach(btn => {
    if (btn.textContent.includes('RESOURCES & IMAGES')) {
      btn.setAttribute('onclick', 'goToCollateralView()');
    }
  });
}

const sidebarChecklist = document.querySelector('.sidebar-block');
if (sidebarChecklist) {
  const newChk = document.createElement('div');
  newChk.className = 'checklist-item';
  newChk.id = 'chk-5';
  newChk.innerHTML = `
    <div class="checkbox-mock"></div>
    <span>Asset Command</span>
  `;
  sidebarChecklist.appendChild(newChk);
}

const originalGoToStep = window.goToStep;
window.goToStep = function(stepNum) {
  if (stepNum === 5 || stepNum === 'collateral') {
    goToCollateralView();
  } else {
    const collatSec = document.getElementById('step-collateral');
    if (collatSec) collatSec.classList.remove('active');
    originalGoToStep(stepNum);
  }
};

window.goToCollateralView = function() {
  document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));
  
  const collatSec = document.getElementById('step-collateral');
  if (collatSec) {
    collatSec.classList.add('active');
  }

  for (let i = 0; i <= 5; i++) {
    const item = document.getElementById('chk-' + i);
    if (!item) continue;
    item.classList.remove('active');
  }
  const activeItem = document.getElementById('chk-5');
  if (activeItem) {
    activeItem.classList.add('active');
  }

  if (typeof window.markStepCompleted === 'function') {
    window.markStepCompleted(5);
    const item = document.getElementById('chk-5');
    if (item) item.classList.add('completed');
  }

  // Auto populate dynamic tracking ID from step 1
  const linkAffInput = document.getElementById('link-aff-id');
  if (linkAffInput && window.userAffiliateId) {
    linkAffInput.value = window.userAffiliateId;
  }
  
  generateVaultLink();
  window.scrollTo(0, 0);
};

window.generateVaultLink = function() {
  const dest = document.getElementById('link-destination').value;
  const affIdInput = document.getElementById('link-aff-id');
  
  let affId = affIdInput.value.trim() || window.userAffiliateId || 'partner-demo';
  affId = affId.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  affIdInput.value = affId;

  let basePath = "https://moonshine.capital/";
  if (dest === "high-yield") basePath += "offers/high-yield";
  else if (dest === "bridge-loan") basePath += "offers/bridge-accelerator";
  else if (dest === "equipment") basePath += "offers/equipment-lease";
  else if (dest === "mca") basePath += "offers/merchant-fasttrack";
  else {
    document.getElementById('vault-generated-link').innerText = "Please select a landing pipeline above...";
    return;
  }

  const generated = `${basePath}?ref=${affId}`;
  document.getElementById('vault-generated-link').innerText = generated;
  
  // Refresh current swipe previews as well
  const currentActiveBtn = document.querySelector('.swipe-selector-btn.active');
  if (currentActiveBtn) {
    const activeSwipeType = currentActiveBtn.id.replace('btn-swipe-', '');
    renderSwipe(activeSwipeType, generated);
  }
};

window.copyVaultLink = function() {
  const text = document.getElementById('vault-generated-link').innerText;
  if (text.includes('Configure destination')) {
    alert("Please select a target destination before copying.");
    return;
  }
  navigator.clipboard.writeText(text);
  showToast("Link secured to clipboard.");
};

window.switchBanner = function(size) {
  document.getElementById('btn-banner-300').classList.remove('active');
  document.getElementById('btn-banner-728').classList.remove('active');
  
  document.getElementById('banner-300-wrapper').style.display = 'none';
  document.getElementById('banner-728-wrapper').style.display = 'none';

  document.getElementById(`btn-banner-${size}`).classList.add('active');
  document.getElementById(`banner-${size}-wrapper`).style.display = 'flex';
};

window.copyBannerEmbed = function() {
  const trackingUrl = document.getElementById('vault-generated-link').innerText;
  const embedCode = `<a href="${trackingUrl}" target="_blank"><img src="https://moonshine.capital/assets/brand-placement.png" alt="Moonshine Capital Partners" style="border: 4px solid #000; box-shadow: 4px 4px 0px #000;" /></a>`;
  navigator.clipboard.writeText(embedCode);
  showToast("Banner HTML embed secured to clipboard.");
};

const swipes = {
  cold: {
    subject: "Mid-Market Capital Pipeline: Instant Allocation Match",
    body: "Hello [Executive Name],\n\nI’ve been monitoring mid-market supply chains in your sector, and liquidity allocation speeds have become a primary competitive differentiator. Moonshine Capital is currently setting structural fast-track paths with over $250M deployed directly to operational scale nodes.\n\nWe specialize in non-dilutive, zero-API friction cash injection with parameters engineered around your processor volume.\n\nSecure your deployment roadmap direct at our dashboard:\n{{LINK}}\n\nBest regards,\n[Your Name]"
  },
  warm: {
    subject: "Introduction to fast-track underwriting engine (Moonshine Capital)",
    body: "Hey [Name],\n\nFollowing up on our recent chat regarding growth bottlenecks and liquidity constraints. I wanted to map your pipeline directly to the team at Moonshine Capital.\n\nThey bypass standard institutional friction completely. You can run an asset preview node directly through my partner line. No credit hard-pulls to establish baseline metrics:\n{{LINK}}\n\nLet me know once you initialize the telemetry.\n\nBest,\n[Your Name]"
  },
  urgency: {
    subject: "[Final Window] Operational scaling reserve capacity closing soon",
    body: "To the Ownership Team,\n\nWe are closing the quarterly high-velocity funding window. If your enterprise is processing over $75k/month and needs non-restrictive working capital deployed within 48 hours, this is the absolute terminal threshold to register pipeline metrics.\n\nInitiate direct underwriter check here:\n{{LINK}}\n\nParameters are set on 180-day cookied link-mapping.\n\nRespectfully,\n[Your Name]"
  }
};

window.renderSwipe = function(type, currentLink) {
  const linkToInject = currentLink || "https://moonshine.capital/?ref=partner-demo";
  const data = swipes[type];
  if (data) {
    document.getElementById('swipe-subject').innerText = data.subject;
    document.getElementById('swipe-body').value = data.body.replace('{{LINK}}', linkToInject);
  }
};

window.switchSwipe = function(type) {
  document.getElementById('btn-swipe-cold').classList.remove('active');
  document.getElementById('btn-swipe-warm').classList.remove('active');
  document.getElementById('btn-swipe-urgency').classList.remove('active');

  document.getElementById(`btn-swipe-${type}`).classList.add('active');
  
  const linkText = document.getElementById('vault-generated-link').innerText;
  const isFallback = linkText.includes('Configure destination');
  renderSwipe(type, isFallback ? null : linkText);
};

window.copySwipe = function(field) {
  let text = "";
  if (field === 'subject') {
    text = document.getElementById('swipe-subject').innerText;
  } else if (field === 'body') {
    text = document.getElementById('swipe-body').value;
  }
  navigator.clipboard.writeText(text);
  showToast(`Email ${field} secured to clipboard.`);
};

window.copyAssetCode = function(logoKey) {
  let svgCode = "";
  if (logoKey === 'dark-logo') {
    svgCode = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#000000"/><rect x="4" y="4" width="16" height="16" fill="#FF5100" stroke="#000000" stroke-width="2"/></svg>`;
  } else if (logoKey === 'orange-logo') {
    svgCode = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#FF5100"/><rect x="4" y="4" width="16" height="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/></svg>`;
  } else {
    svgCode = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#E5E5E5"/><rect x="4" y="4" width="16" height="16" fill="#000000" stroke="#000000" stroke-width="2"/></svg>`;
  }
  navigator.clipboard.writeText(svgCode);
  showToast("Raw SVG vector asset secured.");
};

// Start default configurations
switchSwipe('cold');
generateVaultLink();