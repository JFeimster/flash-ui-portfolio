// Moonshine Capital — Partner Onboarding & Command Center Engine
// File: js/dashboard.js
// Theme: Cyber-Brutalist Neo-Stark Telemetry & Link Manipulation Module

(function() {
  'use strict';

  // Dashboard Data Repositories (Stark telemetry models)
  const TELEMETRY_DATA = {
    '7d': {
      clicks: [12, 18, 45, 30, 89, 120, 154],
      conversions: [1, 2, 5, 3, 8, 11, 14],
      earnings: [150, 300, 750, 450, 1200, 1650, 2100],
      labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      pipeline: '$250,000',
      payout: '$6,250.00'
    },
    '30d': {
      clicks: [120, 145, 190, 220, 310, 450, 520, 680, 890, 1050, 1240, 1420],
      conversions: [10, 12, 15, 18, 25, 36, 42, 55, 71, 85, 102, 118],
      earnings: [1500, 1800, 2250, 2700, 3750, 5400, 6300, 8250, 10650, 12750, 15300, 17700],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
      pipeline: '$1,850,000',
      payout: '$46,250.00'
    },
    'all': {
      clicks: [850, 1200, 1950, 3100, 5400, 8900],
      conversions: [68, 96, 156, 248, 432, 712],
      earnings: [10200, 14400, 23400, 37200, 64800, 106800],
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
      pipeline: '$14,250,000',
      payout: '$356,250.00'
    }
  };

  // Live Deal Feed Telemetry Generator
  const MOCK_DEALERS = [
    { company: 'Giga Logistics Corp', amount: 450000, key: 'alpha-node', status: 'IN UNDERWRITING' },
    { company: 'Atlas Heavy Machinery', amount: 820000, key: 'heavy-flow', status: 'FUNDED' },
    { company: 'Summit Retail Chains', amount: 125000, key: 'climb-up', status: 'REVIEWING DOCS' },
    { company: 'NextGen Warehouses', amount: 310000, key: 'space-fill', status: 'TERM SHEET SENT' },
    { company: 'Apex BioTech Partners', amount: 950000, key: 'health-core', status: 'IN UNDERWRITING' }
  ];

  // State Controller
  let activeTimeframe = '7d';
  let chartInstance = null;
  let customCampaigns = [];

  // Core Initialization
  window.addEventListener('DOMContentLoaded', () => {
    injectCustomStyles();
    initTelemetryControl();
    initQuickLinkGenerator();
    initRealtimeActivityFeed();
    initSearchFilters();
    renderActiveChart();
    
    // Auto-update dashboard interface with saved global state if applicable
    const savedKey = localStorage.getItem('moonshine_affiliate_id') || 'partner-demo';
    const linkInput = document.getElementById('dash-live-url');
    if (linkInput) {
      linkInput.value = `https://moonshine.capital/?ref=${savedKey}`;
    }
  });

  // Inject Stark Toast styles dynamically so file is self-contained
  function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .stark-toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }
      .stark-toast {
        background: #000000;
        color: #FFFFFF;
        border: 4px solid #FF5100;
        padding: 16px 24px;
        font-family: 'Archivo Black', sans-serif;
        font-size: 13px;
        text-transform: uppercase;
        box-shadow: 6px 6px 0px #FF5100;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: toast-slide 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        pointer-events: auto;
      }
      @keyframes toast-slide {
        from { transform: translateX(120%) rotate(5deg); opacity: 0; }
        to { transform: translateX(0) rotate(0); opacity: 1; }
      }
      .stark-toast.copied {
        background: #FF5100;
        color: #000000;
        border-color: #000000;
        box-shadow: 6px 6px 0px #000000;
      }
      .stark-badge {
        background: #00FF55;
        color: #000000;
        font-weight: 900;
        padding: 2px 6px;
        border: 1px solid #000000;
        font-size: 10px;
      }
      .timeframe-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 24px;
      }
      .timeframe-btn {
        background: #FFFFFF;
        border: 2px solid #000;
        padding: 8px 16px;
        font-family: 'Archivo Black', sans-serif;
        text-transform: uppercase;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 3px 3px 0px #000;
        transition: all 0.1s ease;
      }
      .timeframe-btn:hover {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px #000;
      }
      .timeframe-btn.active {
        background: #FF5100;
        color: #000000;
        box-shadow: none;
        transform: translate(3px, 3px);
      }
      .chart-viewport {
        background: #FFFFFF;
        border: 4px solid #000000;
        padding: 20px;
        box-shadow: 8px 8px 0px #000000;
        margin-bottom: 40px;
        position: relative;
        overflow: hidden;
      }
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }
      .chart-title-raw {
        font-family: 'Archivo Black', sans-serif;
        font-size: 18px;
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);

    // Ensure Toast Container exists
    let container = document.getElementById('stark-toast-platform');
    if (!container) {
      container = document.createElement('div');
      container.id = 'stark-toast-platform';
      container.className = 'stark-toast-container';
      document.body.appendChild(container);
    }
  }

  // Trigger Stark Notification Feed
  function triggerNotification(message, isCopied = false) {
    const container = document.getElementById('stark-toast-platform');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `stark-toast ${isCopied ? 'copied' : ''}`;
    toast.innerHTML = `
      <span class="stark-badge">${isCopied ? 'SUCCESS' : 'TELEMETRY'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto dispose toast
    setTimeout(() => {
      toast.style.animation = 'toast-slide 0.2s ease reverse forwards';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  // Draw Stark Chart on Canvas with Neo-Brutalist Layout
  function renderActiveChart() {
    // Dynamic generation of Chart container if not present
    let canvas = document.getElementById('telemetry-canvas');
    if (!canvas) {
      const stepDashboard = document.getElementById('step-dashboard');
      if (!stepDashboard) return; // Exit if not in active workspace environment

      const metricsGrid = stepDashboard.querySelector('.metrics-grid');
      if (metricsGrid) {
        // Build raw HTML viewport container for stark charts
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-viewport';
        chartWrapper.innerHTML = `
          <div class="chart-header">
            <span class="chart-title-raw">Traffic Spikes & Conversion Telemetry</span>
            <div class="timeframe-controls" id="tf-group">
              <button class="timeframe-btn active" data-tf="7d">7 Days</button>
              <button class="timeframe-btn" data-tf="30d">30 Days</button>
              <button class="timeframe-btn" data-tf="all">All-Time</button>
            </div>
          </div>
          <canvas id="telemetry-canvas" style="width: 100%; height: 260px; display: block;"></canvas>
        `;
        stepDashboard.insertBefore(chartWrapper, metricsGrid.nextSibling);
        canvas = document.getElementById('telemetry-canvas');
      }
    }

    if (!canvas) return;

    const dataset = TELEMETRY_DATA[activeTimeframe];
    const ctx = canvas.getContext('2d');
    
    // Scale for High-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;

    // Clear Canvas Canvas Area
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Draw Brutalist Background Grid
    ctx.strokeStyle = '#E2E2E2';
    ctx.lineWidth = 1;
    const lines = 6;
    for (let i = 0; i <= lines; i++) {
      const y = padding.top + (chartH / lines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    const maxVal = Math.max(...dataset.clicks) * 1.2 || 10;
    const minVal = 0;

    // Build Plot Points
    const points = [];
    for (let i = 0; i < dataset.clicks.length; i++) {
      const x = padding.left + (chartW / (dataset.clicks.length - 1)) * i;
      const y = h - padding.bottom - ((dataset.clicks[i] - minVal) / (maxVal - minVal)) * chartH;
      points.push({ x, y, val: dataset.clicks[i] });
    }

    // Draw Line Fill Area (Stark Cyber-Orange Gradient Alpha)
    if (points.length > 0) {
      ctx.fillStyle = 'rgba(255, 81, 0, 0.12)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, h - padding.bottom);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
      ctx.closePath();
      ctx.fill();
    }

    // Draw Base Line System (Solid Cyber-Orange 4px Border)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, h - padding.bottom);
    ctx.lineTo(w - padding.right, h - padding.bottom);
    ctx.stroke();

    // Plot Solid Connected Path (Cyber-Orange)
    ctx.strokeStyle = '#FF5100';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Plot Node Markers (Massive square blocks with borders)
    points.forEach(p => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
      ctx.fillStyle = '#FF5100';
      ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
    });

    // Plot Axis Labels
    ctx.fillStyle = '#000000';
    ctx.font = '900 10px "Archivo", sans-serif';
    ctx.textAlign = 'center';

    // X-Axis
    dataset.labels.forEach((lbl, idx) => {
      const x = padding.left + (chartW / (dataset.labels.length - 1)) * idx;
      ctx.fillText(lbl, x, h - 15);
    });

    // Y-Axis
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minVal + ((maxVal - minVal) / 4) * i;
      const y = h - padding.bottom - (chartH / 4) * i;
      ctx.fillText(Math.round(val).toLocaleString(), padding.left - 10, y + 4);
    }
  }

  // Setup Dynamic Filter Switchers
  function initTelemetryControl() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.timeframe-btn');
      if (!btn) return;

      const group = btn.closest('#tf-group');
      if (!group) return;

      group.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeTimeframe = btn.dataset.tf;
      updateVisualMetrics();
      renderActiveChart();
      triggerNotification(`Switching analytics tracking framework: ${activeTimeframe}`);
    });

    // Resize Event debounced
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderActiveChart();
      }, 150);
    });
  }

  // Update Telemetry numeric metrics visually
  function updateVisualMetrics() {
    const data = TELEMETRY_DATA[activeTimeframe];
    const container = document.getElementById('step-dashboard');
    if (!container) return;

    const cards = container.querySelectorAll('.metric-card');
    if (cards.length >= 3) {
      // Direct access pipeline text selector
      const totalClicks = data.clicks.reduce((a, b) => a + b, 0);
      const totalConvs = data.conversions.reduce((a, b) => a + b, 0);
      const totalEarningsVal = data.earnings.reduce((a, b) => a + b, 0);

      // Animate transition values
      animateVal(cards[0].querySelector('.metric-value'), data.pipeline);
      animateVal(cards[1].querySelector('.metric-value'), totalClicks);
      animateVal(cards[2].querySelector('.metric-value'), `$${totalEarningsVal.toLocaleString()}.00`);
    }
  }

  // Count up numeric dynamic visual animation
  function animateVal(element, targetString) {
    if (!element) return;
    
    // Check if value is numeric or currency
    const numerical = parseFloat(targetString.replace(/[^0-9.]/g, ''));
    if (isNaN(numerical)) {
      element.innerText = targetString;
      return;
    }

    const isCurrency = targetString.includes('$');
    let start = 0;
    const duration = 500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + progress * (numerical - start);
      
      if (isCurrency) {
        element.innerText = `$${Math.round(current).toLocaleString()}`;
      } else {
        element.innerText = Math.round(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.innerText = targetString; // Reset precisely
      }
    }
    requestAnimationFrame(update);
  }

  // Link Generation Mechanism
  function initQuickLinkGenerator() {
    const dashboardSection = document.getElementById('step-dashboard');
    if (!dashboardSection) return;

    // Locate active target link block and insert Link Generator panel
    const assetBox = dashboardSection.querySelector('div[style*="background-color: var(--bg-alt)"]');
    if (assetBox) {
      const generatorMarkup = document.createElement('div');
      generatorMarkup.style.marginTop = '24px';
      generatorMarkup.style.borderTop = '2px dashed #000';
      generatorMarkup.style.paddingTop = '20px';
      generatorMarkup.innerHTML = `
        <h4 class="font-display" style="font-size: 14px; margin-bottom: 12px;">Dynamic Campaign Link Matrix</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <label class="input-label" style="font-size: 11px;">Custom Sub-ID / Node</label>
            <input type="text" id="campaign-sub" class="input-brutal" placeholder="e.g. facebook-ads" style="font-size: 13px; padding: 10px;">
          </div>
          <div>
            <label class="input-label" style="font-size: 11px;">Campaign Source</label>
            <input type="text" id="campaign-source" class="input-brutal" placeholder="e.g. newsletter" style="font-size: 13px; padding: 10px;">
          </div>
        </div>
        <button class="btn-brutal btn-secondary" id="generate-campaign-btn" style="width: 100%; border-width: 3px; font-size: 13px; padding: 12px;">
          GENERATE COMPENSATED LINK +
        </button>
        <div id="campaign-results-pool" style="margin-top: 15px;"></div>
      `;
      assetBox.appendChild(generatorMarkup);

      // Event listener for Generator
      const genBtn = document.getElementById('generate-campaign-btn');
      if (genBtn) {
        genBtn.addEventListener('click', executeCampaignGeneration);
      }
    }
  }

  // Generation script sequence
  function executeCampaignGeneration() {
    const subIdInput = document.getElementById('campaign-sub');
    const sourceInput = document.getElementById('campaign-source');
    const dashLiveUrl = document.getElementById('dash-live-url');

    if (!subIdInput || !sourceInput || !dashLiveUrl) return;

    const subVal = subIdInput.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const sourceVal = sourceInput.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');

    if (!subVal && !sourceVal) {
      triggerNotification("Error: Please provide at least one parameter to format target URL.");
      return;
    }

    const baseLink = dashLiveUrl.value.split('&')[0]; // Extract clear root ref url
    let builtLink = baseLink;

    if (subVal) builtLink += `&subid=${subVal}`;
    if (sourceVal) builtLink += `&utm_source=${sourceVal}`;

    // Add node array mapping
    const trackingInstance = {
      link: builtLink,
      sub: subVal || 'N/A',
      source: sourceVal || 'N/A',
      created: new Date().toLocaleTimeString()
    };
    customCampaigns.unshift(trackingInstance);

    renderCampaignPool();
    triggerNotification("Successfully generated new referral cookie protocol.");
    
    // Clear elements
    subIdInput.value = '';
    sourceInput.value = '';
  }

  // Display custom campaigns
  function renderCampaignPool() {
    const container = document.getElementById('campaign-results-pool');
    if (!container) return;

    if (customCampaigns.length === 0) {
      container.innerHTML = '';
      return;
    }

    let markup = `<div style="max-height: 180px; overflow-y: auto; border: 2px solid #000; padding: 10px; background: #FFFFFF;">`;
    customCampaigns.forEach((camp, index) => {
      markup += `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F3F3F3; padding: 8px 0; gap: 10px;">
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; font-weight: 800; max-width: 70%;">
            <span style="color: #FF5100;">[${camp.sub} / ${camp.source}]</span> ${camp.link}
          </div>
          <button class="chat-btn" onclick="navigator.clipboard.writeText('${camp.link}'); alert('Campaign link secured to clipboard!');" style="font-size: 10px; padding: 4px 8px; flex-shrink: 0;">
            COPY
          </button>
        </div>
      `;
    });
    markup += `</div>`;
    container.innerHTML = markup;
  }

  // Live Simulated Ecosystem Activity Feed (Realtime notification telemetry spikes)
  function initRealtimeActivityFeed() {
    const simulationIntervals = [18000, 25000, 32000]; // Interval timing sweeps
    
    function triggerTick() {
      const idx = Math.floor(Math.random() * MOCK_DEALERS.length);
      const deal = MOCK_DEALERS[idx];
      const formatAmount = `$${deal.amount.toLocaleString()}`;
      
      const eventTypes = [
        `System mapping registered traffic node on key '${deal.key}'`,
        `Deal advancement trigger: ${deal.company} (${formatAmount}) status updated: '${deal.status}'`,
        `Affiliate tracking node update: Active cookie session captured on reference tag.`
      ];

      const chosenEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      triggerNotification(chosenEvent);

      // Inject into Active Transaction Registry Table if on screen
      const tableBody = document.getElementById('dashboard-deals-body');
      if (tableBody && Math.random() > 0.5) {
        const newRow = document.createElement('tr');
        newRow.style.backgroundColor = 'rgba(0, 255, 85, 0.05)';
        newRow.innerHTML = `
          <td>${deal.company}</td>
          <td>${formatAmount}</td>
          <td>${deal.key}</td>
          <td><span class="status-pill" style="background:#00FF55; border-color:#000;">${deal.status}</span></td>
        `;
        tableBody.insertBefore(newRow, tableBody.firstChild);
        
        // Remove oldest row if exceeding boundary
        if (tableBody.children.length > 7) {
          tableBody.removeChild(tableBody.lastChild);
        }
      }

      // Schedule next dynamic sequence
      const nextDelay = simulationIntervals[Math.floor(Math.random() * simulationIntervals.length)];
      setTimeout(triggerTick, nextDelay);
    }

    // Delay start of live pipeline noise simulation slightly
    setTimeout(triggerTick, 10000);
  }

  // Stark filter and searches for table transactions
  function initSearchFilters() {
    const tableContainer = document.querySelector('.dashboard-table-container');
    if (!tableContainer) return;

    // Build Search Header directly above Registry Node Table
    const searchWrapper = document.createElement('div');
    searchWrapper.style.margin = '20px 0 10px 0';
    searchWrapper.innerHTML = `
      <div style="display: flex; gap: 10px;">
        <input type="text" id="deal-table-search" class="input-brutal" placeholder="Search registered entity nodes..." style="font-size: 13px; padding: 12px; margin-bottom: 0;">
        <select id="deal-table-filter" class="input-brutal" style="font-size: 13px; padding: 12px; max-width: 200px; font-weight: 800; cursor: pointer;">
          <option value="ALL">ALL STATUSES</option>
          <option value="UNDERWRITING">UNDERWRITING</option>
          <option value="FUNDED">FUNDED</option>
          <option value="REVIEWING">REVIEWING</option>
        </select>
      </div>
    `;

    tableContainer.parentNode.insertBefore(searchWrapper, tableContainer);

    // Filter Listeners
    const searchInput = document.getElementById('deal-table-search');
    const filterSelect = document.getElementById('deal-table-filter');

    if (searchInput && filterSelect) {
      const applyFilters = () => {
        const query = searchInput.value.toLowerCase();
        const category = filterSelect.value;
        const rows = document.querySelectorAll('#dashboard-deals-body tr');

        rows.forEach(row => {
          const cells = row.getElementsByTagName('td');
          if (cells.length < 4) return;

          const company = cells[0].textContent.toLowerCase();
          const nodeKey = cells[2].textContent.toLowerCase();
          const status = cells[3].textContent.toUpperCase();

          const matchesSearch = company.includes(query) || nodeKey.includes(query);
          const matchesCategory = category === 'ALL' || status.includes(category);

          if (matchesSearch && matchesCategory) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      };

      searchInput.addEventListener('input', applyFilters);
      filterSelect.addEventListener('change', applyFilters);
    }
  }

})();