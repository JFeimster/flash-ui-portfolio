(function () {
  // 1. Inject styling specific to the Leaderboard & Milestones interface
  const style = document.createElement('style');
  style.textContent = `
    .brutal-card-leaderboard {
      border: var(--border-thick);
      padding: 30px;
      background: var(--bg);
      box-shadow: var(--shadow-offset) var(--shadow-offset) 0px #000;
      margin-top: 40px;
      margin-bottom: 40px;
      position: relative;
    }
    .tier-badge-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .tier-badge {
      border: var(--border-thick);
      padding: 16px;
      text-align: center;
      background: var(--bg-alt);
      font-weight: 900;
      text-transform: uppercase;
      font-family: 'Archivo Black', sans-serif;
      font-size: 13px;
      position: relative;
      box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000;
      transition: all var(--transition-speed) ease;
    }
    .tier-badge.unlocked {
      background: var(--accent);
      color: var(--dark);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000;
    }
    .tier-badge.unlocked::before {
      content: "★ ACTIVE";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--dark);
      color: var(--bg);
      font-size: 8px;
      padding: 2px 6px;
      border: var(--border-thin);
    }
    .tier-badge.locked {
      opacity: 0.6;
      background: #EAEAEA;
      color: #777;
      border-style: dashed;
      box-shadow: 2px 2px 0px #000;
    }
    .tier-badge .badge-yield {
      display: block;
      font-size: 18px;
      margin-top: 4px;
      color: var(--dark);
    }
    .tier-badge.locked .badge-yield {
      color: #888;
    }
    .progress-track-wrapper {
      margin-bottom: 35px;
    }
    .progress-label-row {
      display: flex;
      justify-content: space-between;
      font-weight: 900;
      margin-bottom: 10px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .thick-progress-bar {
      border: var(--border-thick);
      height: 40px;
      background: var(--bg-alt);
      position: relative;
      box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent);
      width: 0%; /* Dynamic */
      transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1);
      border-right: var(--border-thick);
    }
    .progress-markers {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
    }
    .leaderboard-flex-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 30px;
    }
    @media (max-width: 768px) {
      .leaderboard-flex-grid {
        grid-template-columns: 1fr;
      }
      .tier-badge-container {
        grid-template-columns: 1fr;
      }
    }
    .ranking-list {
      border: var(--border-thick);
      background: var(--bg);
      box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000;
    }
    .ranking-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: var(--border-thin);
      font-weight: 800;
      transition: background-color var(--transition-speed);
    }
    .ranking-item:last-child {
      border-bottom: none;
    }
    .ranking-item.highlight-user {
      background: var(--accent-muted);
      border-left: 8px solid var(--accent);
    }
    .ranking-pos {
      font-family: 'Archivo Black', sans-serif;
      font-size: 16px;
      width: 40px;
    }
    .ranking-name {
      flex-grow: 1;
      padding-left: 10px;
      text-transform: uppercase;
      font-size: 13px;
    }
    .ranking-val {
      font-family: 'Archivo Black', sans-serif;
      font-size: 14px;
    }
    .gamify-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .notification-banner {
      background: var(--dark);
      color: #fff;
      border: var(--border-thick);
      padding: 15px;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 13px;
      margin-bottom: 25px;
      display: none;
      align-items: center;
      justify-content: space-between;
      animation: alertFlash 0.5s ease-in-out infinite alternate;
    }
    @keyframes alertFlash {
      0% { border-color: var(--accent); }
      100% { border-color: var(--dark); }
    }
  `;
  document.head.appendChild(style);

  // 2. Base state initialization
  window.LeaderboardState = {
    userVolume: 250000,
    currentTier: 'Bootlegger',
    ranks: [
      { name: "Valkyrie Dealflow", volume: 3200000, badge: "Kingpin" },
      { name: "Shadow Broker Syndicate", volume: 1850000, badge: "Distiller" },
      { name: "Kodiak Leverage", volume: 1100000, badge: "Distiller" },
      { name: "Whiskey Capital", volume: 650000, badge: "Distiller" },
      { name: "Apex Sourcing Node", volume: 480000, badge: "Bootlegger" }
    ]
  };

  // Helper mapping volume to a progress percentage
  function getProgressPercent(vol) {
    if (vol <= 0) return 0;
    if (vol <= 500000) {
      return (vol / 500000) * 50; // First half of bar is 0 - 500k
    } else if (vol <= 2500000) {
      return 50 + ((vol - 500000) / 2000000) * 50; // Second half is 500k - 2.5M
    }
    return 100;
  }

  // Helper logic to find active tier
  function getTierForVolume(vol) {
    if (vol >= 2500000) return 'Kingpin';
    if (vol >= 500000) return 'Distiller';
    return 'Bootlegger';
  }

  function getRateForTier(tier) {
    if (tier === 'Kingpin') return '4.0%';
    if (tier === 'Distiller') return '2.5%';
    return '1.5%';
  }

  // 3. Render Dashboard Interface
  function renderLeaderboard() {
    // Attempt to pull real-time amount from baseline interface if exists
    const baselineSumElement = document.getElementById('dash-pipeline-sum');
    if (baselineSumElement) {
      const parsedVal = parseInt(baselineSumElement.innerText.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedVal)) {
        window.LeaderboardState.userVolume = parsedVal;
      }
    }

    const vol = window.LeaderboardState.userVolume;
    const tier = getTierForVolume(vol);
    const rate = getRateForTier(tier);

    // Trigger Notification of level up if registered
    if (tier !== window.LeaderboardState.currentTier) {
      const banner = document.getElementById('syndicate-notification-banner');
      if (banner) {
        banner.innerHTML = `<span>⚡ TIER UPGRADE UNLOCKED: NOW OPERATING AT ${tier.toUpperCase()} LEVEL (${rate} Yield) ⚡</span>`;
        banner.style.display = 'flex';
      }
      window.LeaderboardState.currentTier = tier;
    }

    // Update Progress Bar
    const percent = Math.min(Math.round(getProgressPercent(vol)), 100);
    const fill = document.getElementById('milestone-progress-fill');
    const label = document.getElementById('milestone-percentage-label');
    if (fill) fill.style.width = percent + '%';
    if (label) label.innerText = `${percent}% OF TARGET SECURED`;

    // Update Tier Badges UI state
    const badgeContainer = document.getElementById('tier-badge-container');
    if (badgeContainer) {
      badgeContainer.innerHTML = `
        <div class="tier-badge ${tier === 'Bootlegger' || vol >= 0 ? 'unlocked' : 'locked'}">
          Bootlegger
          <span class="badge-yield">1.5% Base</span>
        </div>
        <div class="tier-badge ${vol >= 500000 ? 'unlocked' : 'locked'}">
          Distiller
          <span class="badge-yield">2.5% Payout</span>
          ${vol < 500000 ? '<span class="lock-icon">🔒 Unlocks at $500k</span>' : ''}
        </div>
        <div class="tier-badge ${vol >= 2500000 ? 'unlocked' : 'locked'}">
          Kingpin
          <span class="badge-yield">4.0% Yield</span>
          ${vol < 2500000 ? '<span class="lock-icon">🔒 Unlocks at $2.5M</span>' : ''}
        </div>
      `;
    }

    // Render Rankings including active dynamic key
    const listContainer = document.getElementById('global-ranking-list');
    if (listContainer) {
      // Establish active node username/label
      const userKeyInput = document.getElementById('affiliate-input');
      const userKey = (userKeyInput && userKeyInput.value.trim()) 
        ? userKeyInput.value.trim().toLowerCase() 
        : (window.userAffiliateId || "demo-partner");

      const combinedRanks = [
        ...window.LeaderboardState.ranks,
        { name: `${userKey} (You)`, volume: vol, isUser: true, badge: tier }
      ];

      // Sort Descending
      combinedRanks.sort((a, b) => b.volume - a.volume);

      listContainer.innerHTML = '';
      combinedRanks.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = `ranking-item ${item.isUser ? 'highlight-user' : ''}`;
        row.innerHTML = `
          <div class="ranking-pos">#${index + 1}</div>
          <div class="ranking-name">${item.name} <span style="font-size: 10px; color: var(--accent); font-weight: 900; margin-left: 5px;">[${item.badge.toUpperCase()}]</span></div>
          <div class="ranking-val">$${item.volume.toLocaleString()}</div>
        `;
        listContainer.appendChild(row);
      });
    }

    // Update operational badge rate text
    const rateBadge = document.getElementById('current-payout-rate-badge');
    if (rateBadge) rateBadge.innerText = rate;
  }

  // 4. Inject Gamified Hub structure into DOM inside dashboard view
  function injectComponent() {
    const dashboard = document.getElementById('step-dashboard');
    if (!dashboard) return;

    // Check if container already exists to avoid double mounting
    if (document.getElementById('gamified-hub-container')) return;

    const gamifiedSection = document.createElement('div');
    gamifiedSection.id = 'gamified-hub-container';
    gamifiedSection.innerHTML = `
      <div class="notification-banner" id="syndicate-notification-banner"></div>
      
      <div class="brutal-card-leaderboard">
        <h3 class="font-display" style="font-size: 24px; margin-bottom: 5px;">Affiliate Syndicate Hub</h3>
        <p style="font-weight: 800; font-size: 13px; color: #555; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;">
          Accelerate your operational volume // Unlock premium tier metrics // Dominate rankings
        </p>

        <!-- Dynamic Tier Badges -->
        <div class="tier-badge-container" id="tier-badge-container"></div>

        <!-- Milestones Progress Bar -->
        <div class="progress-track-wrapper">
          <div class="progress-label-row">
            <span>Quarterly Commission Milestone Track</span>
            <span id="milestone-percentage-label">0%</span>
          </div>
          <div class="thick-progress-bar">
            <div class="progress-fill" id="milestone-progress-fill"></div>
          </div>
          <div class="progress-markers">
            <span>$0 (1.5%)</span>
            <span>$500k Milestone (2.5%)</span>
            <span>$2.5M Ultimate Target (4.0% Kingpin)</span>
          </div>
        </div>

        <!-- Leaderboard & Interaction Columns -->
        <div class="leaderboard-flex-grid">
          <!-- Left: Global Rankings -->
          <div>
            <h4 class="font-display" style="font-size: 15px; margin-bottom: 12px; border-bottom: var(--border-thin); padding-bottom: 5px;">
              Active Network Leaderboard (Monthly Volume)
            </h4>
            <div class="ranking-list" id="global-ranking-list"></div>
          </div>

          <!-- Right: Action Module -->
          <div class="gamify-actions">
            <h4 class="font-display" style="font-size: 15px; margin-bottom: 5px; border-bottom: var(--border-thin); padding-bottom: 5px;">
              Syndicate Controls
            </h4>
            <p style="font-size: 12px; font-weight: 800; line-height: 1.4; margin-bottom: 10px;">
              Inject simulated transaction value directly onto your node tracking system to audit dashboard calculations.
            </p>

            <button class="btn-brutal" id="btn-boost-volume" style="font-size: 13px; padding: 14px; width: 100%;">
              SIMULATE DEAL CLOSURE (+ $350k)
            </button>

            <button class="btn-brutal btn-secondary" id="btn-share-achievement" style="font-size: 12px; padding: 10px; width: 100%; border: var(--border-thick); box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000;">
              SHARE MY PARTNER STATUS →
            </button>
            
            <div style="border: var(--border-thin); background: var(--bg-alt); padding: 12px; font-size: 11px; font-weight: 900; text-transform: uppercase; text-align: center;">
              Current Placement Payout Rate: <span id="current-payout-rate-badge" style="color: var(--accent); font-weight: 900;">1.5%</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert directly above the active transaction registry
    const tableHeader = Array.from(dashboard.getElementsByTagName('h3'))
      .find(h => h.innerText.includes('Active Transaction Registry'));

    if (tableHeader) {
      dashboard.insertBefore(gamifiedSection, tableHeader);
    } else {
      dashboard.appendChild(gamifiedSection);
    }

    // Wire up simulations event actions
    document.getElementById('btn-boost-volume').addEventListener('click', function() {
      // Simulate deal submission increase
      window.LeaderboardState.userVolume += 350000;
      
      // Update baseline pipeline sum component for structural parity
      const baselineSumElement = document.getElementById('dash-pipeline-sum');
      if (baselineSumElement) {
        baselineSumElement.innerText = '$' + window.LeaderboardState.userVolume.toLocaleString();
      }

      // Re-evaluate system
      renderLeaderboard();
    });

    document.getElementById('btn-share-achievement').addEventListener('click', function() {
      alert(`SYNDICATE NETWORK COMPILATION:\nDirect status parameters secured. Level: [${window.LeaderboardState.currentTier.toUpperCase()}] running at ${getRateForTier(window.LeaderboardState.currentTier)} commission rates.`);
    });

    // Run baseline render
    renderLeaderboard();
  }

  // 5. Establish Observer to sync values automatically when base component modifies metrics
  function initObserver() {
    const targetNode = document.getElementById('dash-pipeline-sum');
    if (targetNode) {
      const observer = new MutationObserver(function() {
        renderLeaderboard();
      });
      observer.observe(targetNode, { childList: true, characterData: true, subtree: true });
    }
  }

  // 6. Execution Hooks
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectComponent();
      initObserver();
    });
  } else {
    injectComponent();
    initObserver();
  }

  // Wrap check inside existing flow step changes
  const originalGoToStep = window.goToStep;
  if (typeof originalGoToStep === 'function') {
    window.goToStep = function(stepNum) {
      originalGoToStep(stepNum);
      if (stepNum === 4) {
        // Ensure component renders and mounts once Step 4 Dashboard becomes active
        setTimeout(injectComponent, 50);
      }
    };
  }
})();