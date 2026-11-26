(function() {
  // Inject custom CSS styling for the Fintech Command Center Multi-Calculator Console
  const style = document.createElement('style');
  style.textContent = `
    /* Fintech Command Center Custom Styling */
    .fcc-wrapper {
      background: var(--carbon-black);
      border: 4px solid var(--off-white);
      box-shadow: var(--neo-shadow-cyan);
      margin-bottom: 5rem;
      position: relative;
    }

    .fcc-header {
      background: var(--deep-black);
      border-bottom: 4px solid var(--off-white);
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .fcc-title-area h2 {
      font-size: 2.2rem;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1;
      letter-spacing: -1px;
    }

    .fcc-title-area p {
      font-size: 0.9rem;
      color: var(--cyan);
      margin-top: 0.3rem;
    }

    .fcc-tabs-bar {
      display: flex;
      background: var(--graphite);
      border-bottom: 3px solid var(--off-white);
      overflow-x: auto;
    }

    .fcc-tab-btn {
      background: transparent;
      border: none;
      border-right: 3px solid var(--off-white);
      color: var(--off-white);
      padding: 1.2rem 2rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .fcc-tab-btn:hover {
      background: rgba(0, 229, 255, 0.1);
      color: var(--cyan);
    }

    .fcc-tab-btn.active {
      background: var(--cyan);
      color: var(--deep-black);
    }

    .fcc-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
    }

    @media (max-width: 1024px) {
      .fcc-grid {
        grid-template-columns: 1fr;
      }
    }

    .fcc-params-pane {
      padding: 2.5rem;
      border-right: 4px solid var(--off-white);
    }

    @media (max-width: 1024px) {
      .fcc-params-pane {
        border-right: none;
        border-bottom: 4px solid var(--off-white);
      }
    }

    .fcc-readout-pane {
      background: var(--deep-black);
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .fcc-matrix-card {
      border: 3px solid var(--off-white);
      background: var(--graphite);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 4px 4px 0px rgba(0,0,0,1);
    }

    .fcc-matrix-title {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
      color: var(--yellow);
      border-bottom: 2px solid var(--off-white);
      padding-bottom: 0.4rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
    }

    .fcc-matrix-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .fcc-matrix-cell {
      background: var(--deep-black);
      border: 2px solid var(--off-white);
      padding: 0.8rem;
    }

    .fcc-matrix-cell-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      color: #888;
      text-transform: uppercase;
    }

    .fcc-matrix-cell-val {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--off-white);
    }

    .fcc-chart-container {
      border: 3px solid var(--off-white);
      background: var(--deep-black);
      padding: 1rem;
      position: relative;
      margin-bottom: 1.5rem;
    }

    .fcc-canvas {
      width: 100%;
      height: 180px;
      display: block;
    }

    .fcc-action-bar {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .fcc-btn {
      flex: 1;
      padding: 1rem;
      font-weight: 800;
      text-transform: uppercase;
      font-family: 'Share Tech Mono', monospace;
      font-size: 1rem;
      border: 3px solid var(--off-white);
      cursor: pointer;
      transition: all 0.1s ease;
    }

    .fcc-btn-export {
      background: var(--acid-green);
      color: var(--deep-black);
      box-shadow: 4px 4px 0px var(--cyan);
    }

    .fcc-btn-export:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--cyan);
    }

    .fcc-btn-secondary {
      background: transparent;
      color: var(--off-white);
      box-shadow: 4px 4px 0px var(--magenta);
    }

    .fcc-btn-secondary:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--magenta);
      background: rgba(255, 43, 214, 0.1);
    }

    /* Checklist overrides for BizCredit tab */
    .fcc-checklist {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .fcc-check-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      user-select: none;
    }

    .fcc-checkbox {
      width: 24px;
      height: 24px;
      border: 3px solid var(--off-white);
      background: var(--deep-black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.85rem;
      color: var(--acid-green);
    }

    .fcc-checkbox.checked::after {
      content: 'X';
    }

    .fcc-check-label {
      font-size: 0.95rem;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // Dynamic Structure Template Ingestion
  const containerHtml = `
    <section id="fintech-command-center" class="fcc-wrapper">
      <!-- Header Bar -->
      <div class="fcc-header">
        <div class="fcc-title-area">
          <div class="mono" style="color: var(--magenta); font-weight: 800; font-size: 0.85rem; letter-spacing: 2px;">OPERATIONAL COMMAND CENTER</div>
          <h2>Fintech Multi-Calculator Console</h2>
          <p class="mono">[ ACTIVE DIRECTORY ENGINES ENGINE // v3.0 ]</p>
        </div>
        <div class="mono" style="background: var(--deep-black); color: var(--acid-green); padding: 0.5rem 1rem; border: 2px solid var(--off-white); font-size: 0.8rem;">
          SECURE_CALC_GATE: ENABLED
        </div>
      </div>

      <!-- Navigation tabs -->
      <div class="fcc-tabs-bar">
        <button class="fcc-tab-btn active" data-tab="cashflow">[01] Cash Flow Forecaster</button>
        <button class="fcc-tab-btn" data-tab="mrr">[02] MRR to Cash Converter</button>
        <button class="fcc-tab-btn" data-tab="bizcredit">[03] BizCredit Matrix</button>
      </div>

      <div class="fcc-grid">
        <!-- Interactive Parameters (Left Side) -->
        <div class="fcc-params-pane" id="fccParamsArea">
          <!-- Dynamic Form Parameters Injected Here -->
        </div>

        <!-- System Readouts (Right Side) -->
        <div class="fcc-readout-pane">
          <div>
            <div class="fcc-matrix-card">
              <div class="fcc-matrix-title">INDICATIVE ENGINE READOUTS</div>
              <div class="fcc-matrix-grid" id="fccMatrixGrid">
                <!-- Dynamic Metrics Injected Here -->
              </div>
            </div>

            <!-- Canvas Retro-Cyber Chart -->
            <div class="fcc-chart-container">
              <div class="mono" style="font-size:0.7rem; color: var(--cyan); margin-bottom:0.5rem; display: flex; justify-content:space-between;">
                <span>TACTICAL SYSTEM VISUALIZATION</span>
                <span id="fccChartLabel">VAL_LOG</span>
              </div>
              <canvas class="fcc-canvas" id="fccCanvas"></canvas>
            </div>
          </div>

          <!-- Actions -->
          <div class="fcc-action-bar">
            <button class="fcc-btn fcc-btn-export" id="fccBtnExport">EXPORT_DATA.CSV</button>
            <button class="fcc-btn fcc-btn-secondary" id="fccBtnTrigger">ROUTE_TO_CRM</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // State Management
  let activeTab = 'cashflow';
  const state = {
    cashflow: {
      monthlyRev: 125000,
      growthRate: 15,
      cogsRatio: 35,
      adSpendRatio: 20
    },
    mrr: {
      mrrVal: 45000,
      churnRate: 3.5,
      termLength: 6
    },
    bizcredit: {
      tradeLines: 6,
      paydexScore: 78,
      isRegisteredInc: true,
      hasElnNum: true,
      hasPG: false
    }
  };

  // Safe Console Logger Integration
  function logToTacticalTerminal(message) {
    if (window.addConsoleLine) {
      window.addConsoleLine(message, "FINTECH");
    } else {
      console.log(`[FINTECH] ${message}`);
    }
  }

  // HTML Form Builders
  const paramTemplates = {
    cashflow: () => `
      <div class="calc-input-group">
        <label class="calc-label">Monthly Baseline Revenue <span class="mono" style="color:var(--cyan); float:right;" id="lblCFRev">$125,000</span></label>
        <input type="range" class="calc-range" id="paramCFRev" min="10000" max="1000000" step="10000" value="${state.cashflow.monthlyRev}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">Target Growth Rate <span class="mono" style="color:var(--cyan); float:right;" id="lblCFGrowth">15%</span></label>
        <input type="range" class="calc-range" id="paramCFGrowth" min="0" max="100" step="1" value="${state.cashflow.growthRate}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">Cost of Goods Sold (COGS) % <span class="mono" style="color:var(--cyan); float:right;" id="lblCFCOGS">35%</span></label>
        <input type="range" class="calc-range" id="paramCFCOGS" min="5" max="85" step="1" value="${state.cashflow.cogsRatio}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">Ad Spend Allocation % <span class="mono" style="color:var(--cyan); float:right;" id="lblCFAd">20%</span></label>
        <input type="range" class="calc-range" id="paramCFAd" min="0" max="60" step="1" value="${state.cashflow.adSpendRatio}">
      </div>
    `,
    mrr: () => `
      <div class="calc-input-group">
        <label class="calc-label">Current Monthly Recurring Revenue (MRR) <span class="mono" style="color:var(--magenta); float:right;" id="lblMRRVal">$45,000</span></label>
        <input type="range" class="calc-range" id="paramMRRVal" min="5000" max="250000" step="5000" value="${state.mrr.mrrVal}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">Net Logo Churn Rate % <span class="mono" style="color:var(--magenta); float:right;" id="lblMRRChurn">3.5%</span></label>
        <input type="range" class="calc-range" id="paramMRRChurn" min="0.5" max="20" step="0.5" value="${state.mrr.churnRate}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">Financing Term Request (Months) <span class="mono" style="color:var(--magenta); float:right;" id="lblMRRTerm">6 Months</span></label>
        <input type="range" class="calc-range" id="paramMRRTerm" min="3" max="24" step="1" value="${state.mrr.termLength}">
      </div>
    `,
    bizcredit: () => `
      <div class="calc-input-group">
        <label class="calc-label">Active Trade Lines <span class="mono" style="color:var(--acid-green); float:right;" id="lblBCTrade">6 Lines</span></label>
        <input type="range" class="calc-range" id="paramBCTrade" min="0" max="25" step="1" value="${state.bizcredit.tradeLines}">
      </div>
      <div class="calc-input-group">
        <label class="calc-label">D&B Paydex Score Benchmark <span class="mono" style="color:var(--acid-green); float:right;" id="lblBCPaydex">78</span></label>
        <input type="range" class="calc-range" id="paramBCPaydex" min="20" max="100" step="1" value="${state.bizcredit.paydexScore}">
      </div>
      <div style="margin-top: 1.5rem;" class="fcc-checklist">
        <div class="fcc-check-row" data-field="isRegisteredInc">
          <div class="fcc-checkbox ${state.bizcredit.isRegisteredInc ? 'checked' : ''}"></div>
          <span class="fcc-check-label">Registered Corporate LLC or C-Corp</span>
        </div>
        <div class="fcc-check-row" data-field="hasElnNum">
          <div class="fcc-checkbox ${state.bizcredit.hasElnNum ? 'checked' : ''}"></div>
          <span class="fcc-check-label">Valid IRS EIN Assignment</span>
        </div>
        <div class="fcc-check-row" data-field="hasPG">
          <div class="fcc-checkbox ${state.bizcredit.hasPG ? 'checked' : ''}"></div>
          <span class="fcc-check-label">Willing to provide Personal Guarantee (PG)</span>
        </div>
      </div>
    `
  };

  // Ingestion initialization
  function init() {
    const target = document.getElementById('lead-maximizer');
    if (!target) return;

    // Insert section directly below the lead gate
    target.insertAdjacentHTML('afterend', containerHtml);

    // Initial binding
    renderParams();
    calculateAndDraw();

    // Event Delegation for Tabs
    document.querySelector('.fcc-tabs-bar').addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.fcc-tab-btn');
      if (!tabBtn) return;

      document.querySelectorAll('.fcc-tab-btn').forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');

      activeTab = tabBtn.getAttribute('data-tab');
      logToTacticalTerminal(`SWITCHED CONSOLE UTILITY: ${activeTab.toUpperCase()}`);
      
      renderParams();
      calculateAndDraw();
    });

    // Handle interactive parameter changes
    document.getElementById('fccParamsArea').addEventListener('input', (e) => {
      handleInput(e);
    });

    // Checkbox mapping handlers for corporate builder
    document.getElementById('fccParamsArea').addEventListener('click', (e) => {
      const checkRow = e.target.closest('.fcc-check-row');
      if (!checkRow) return;

      const field = checkRow.getAttribute('data-field');
      state.bizcredit[field] = !state.bizcredit[field];
      
      const checkbox = checkRow.querySelector('.fcc-checkbox');
      if (state.bizcredit[field]) {
        checkbox.classList.add('checked');
      } else {
        checkbox.classList.remove('checked');
      }

      calculateAndDraw();
    });

    // Bind Action Buttons
    document.getElementById('fccBtnExport').addEventListener('click', () => {
      exportCSV();
    });

    document.getElementById('fccBtnTrigger').addEventListener('click', () => {
      triggerCrmPipeline();
    });

    // Handle dynamic canvas resizing
    window.addEventListener('resize', () => {
      calculateAndDraw();
    });
  }

  // Render Parameters Pane
  function renderParams() {
    const area = document.getElementById('fccParamsArea');
    area.innerHTML = paramTemplates[activeTab]();
  }

  // Handle live calculation inputs and update baseline scopes
  function handleInput(e) {
    const target = e.target;
    const value = parseFloat(target.value);

    if (activeTab === 'cashflow') {
      if (target.id === 'paramCFRev') {
        state.cashflow.monthlyRev = value;
        document.getElementById('lblCFRev').textContent = `$${value.toLocaleString()}`;
      } else if (target.id === 'paramCFGrowth') {
        state.cashflow.growthRate = value;
        document.getElementById('lblCFGrowth').textContent = `${value}%`;
      } else if (target.id === 'paramCFCOGS') {
        state.cashflow.cogsRatio = value;
        document.getElementById('lblCFCOGS').textContent = `${value}%`;
      } else if (target.id === 'paramCFAd') {
        state.cashflow.adSpendRatio = value;
        document.getElementById('lblCFAd').textContent = `${value}%`;
      }
    } else if (activeTab === 'mrr') {
      if (target.id === 'paramMRRVal') {
        state.mrr.mrrVal = value;
        document.getElementById('lblMRRVal').textContent = `$${value.toLocaleString()}`;
      } else if (target.id === 'paramMRRChurn') {
        state.mrr.churnRate = value;
        document.getElementById('lblMRRChurn').textContent = `${value}%`;
      } else if (target.id === 'paramMRRTerm') {
        state.mrr.termLength = value;
        document.getElementById('lblMRRTerm').textContent = `${value} Months`;
      }
    } else if (activeTab === 'bizcredit') {
      if (target.id === 'paramBCTrade') {
        state.bizcredit.tradeLines = value;
        document.getElementById('lblBCTrade').textContent = `${value} Lines`;
      } else if (target.id === 'paramBCPaydex') {
        state.bizcredit.paydexScore = value;
        document.getElementById('lblBCPaydex').textContent = `${value}`;
      }
    }

    calculateAndDraw();
  }

  // Main Calculation and Visualization Engine
  function calculateAndDraw() {
    const grid = document.getElementById('fccMatrixGrid');
    const canvas = document.getElementById('fccCanvas');
    const ctx = canvas.getContext('2d');
    const label = document.getElementById('fccChartLabel');

    // Resize canvas dynamic scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const w = rect.width;
    const h = rect.height;

    // Clear Canvas with Graphite Style Grid line base
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#171821';
    ctx.lineWidth = 1;
    // Horizontal lines
    for (let i = 20; i < h; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
    // Vertical lines
    for (let i = 30; i < w; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }

    if (activeTab === 'cashflow') {
      label.textContent = "90-DAY OUTLOOK VELOCITY MAP";
      // Perform math operations
      const cf = state.cashflow;
      const margin = 1 - (cf.cogsRatio / 100) - (cf.adSpendRatio / 100);
      const day30 = cf.monthlyRev * (1 + (cf.growthRate / 100)) * margin;
      const day60 = day30 * (1 + (cf.growthRate / 100)) * margin;
      const day90 = day60 * (1 + (cf.growthRate / 100)) * margin;

      // Update indicators
      grid.innerHTML = `
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Operating Margin</div>
          <div class="fcc-matrix-cell-val" style="color: var(--cyan);">${(margin * 100).toFixed(0)}%</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">30-Day Cash Buffer</div>
          <div class="fcc-matrix-cell-val">$${Math.round(day30).toLocaleString()}</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">60-Day Cash Buffer</div>
          <div class="fcc-matrix-cell-val">$${Math.round(day60).toLocaleString()}</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Projected 90-Day Yield</div>
          <div class="fcc-matrix-cell-val" style="color: var(--acid-green);">$${Math.round(day90).toLocaleString()}</div>
        </div>
      `;

      // Render 3 bar projections in Canvas
      const maxVal = Math.max(day30, day60, day90, cf.monthlyRev) * 1.1;
      const barY = (val) => h - (val / maxVal) * (h - 40) - 10;

      // Draw baseline bar
      ctx.fillStyle = '#171821';
      ctx.fillRect(20, barY(cf.monthlyRev), 40, h - barY(cf.monthlyRev) - 10);
      ctx.strokeStyle = '#F4F1E8';
      ctx.strokeRect(20, barY(cf.monthlyRev), 40, h - barY(cf.monthlyRev) - 10);

      // Projections
      const projs = [day30, day60, day90];
      const colors = ['#00E5FF', '#FF2BD6', '#B6FF00'];
      projs.forEach((val, index) => {
        const x = 90 + (index * 70);
        const y = barY(val);
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, 40, h - y - 10);
        ctx.strokeStyle = '#F4F1E8';
        ctx.strokeRect(x, y, 40, h - y - 10);
      });

      // Simple Legend annotations
      ctx.font = "8px 'Share Tech Mono'";
      ctx.fillStyle = '#F4F1E8';
      ctx.fillText("CURRENT", 20, h - 2);
      ctx.fillText("D30", 100, h - 2);
      ctx.fillText("D60", 170, h - 2);
      ctx.fillText("D90", 240, h - 2);

    } else if (activeTab === 'mrr') {
      label.textContent = "MRR BORROWING BASE LIMIT CURVE";
      const m = state.mrr;
      // Adjust factor based on Churn and requested Term parameters
      const retentionFactor = Math.max(0.5, 1 - (m.churnRate * m.termLength / 100));
      const grossCap = m.mrrVal * m.termLength;
      const maxAdvance = grossCap * retentionFactor * 0.75; // 75% LTV factor
      const costOfCapital = maxAdvance * 0.085; // 8.5% simple discount fee
      const effectiveApr = (costOfCapital / maxAdvance) * (12 / m.termLength) * 100;

      grid.innerHTML = `
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Max Advance Limit</div>
          <div class="fcc-matrix-cell-val" style="color: var(--magenta);">$${Math.round(maxAdvance).toLocaleString()}</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Flat Capital Fee (8.5%)</div>
          <div class="fcc-matrix-cell-val">$${Math.round(costOfCapital).toLocaleString()}</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Upfront Net Escrow</div>
          <div class="fcc-matrix-cell-val">$${Math.round(maxAdvance - costOfCapital).toLocaleString()}</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Effective APR</div>
          <div class="fcc-matrix-cell-val" style="color: var(--yellow);">${effectiveApr.toFixed(1)}%</div>
        </div>
      `;

      // Draw MRR to money curve line
      ctx.strokeStyle = '#FF2BD6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const pct = x / w;
        const currentCap = m.mrrVal * (3 + pct * 21);
        const curLimit = currentCap * retentionFactor * 0.75;
        const mappedY = h - (curLimit / (250000 * 24)) * (h - 30) - 20;
        if (x === 0) ctx.moveTo(x, mappedY);
        else ctx.lineTo(x, mappedY);
      }
      ctx.stroke();

      // Current point locator dot
      const currentX = (m.termLength - 3) / 21 * w;
      const currentY = h - (maxAdvance / (250000 * 24)) * (h - 30) - 20;
      ctx.fillStyle = '#FFE600';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F4F1E8';
      ctx.stroke();

    } else if (activeTab === 'bizcredit') {
      label.textContent = "BIZCREDIT QUALIFICATION MATRIX";
      const bc = state.bizcredit;
      
      // Calculate corporate index scoring points
      let score = 20; // baseline entry
      if (bc.paydexScore >= 80) score += 30;
      else if (bc.paydexScore >= 70) score += 20;
      
      score += Math.min(25, bc.tradeLines * 2.5);
      if (bc.isRegisteredInc) score += 10;
      if (bc.hasElnNum) score += 10;
      if (bc.hasPG) score += 15;

      let tier = "TIER_3 (Unsecured Small)";
      let limitEst = bc.tradeLines * 5000;
      if (score >= 80) {
        tier = "TIER_1 (Maximum Executive)";
        limitEst = 75000 + (bc.tradeLines * 12000);
      } else if (score >= 50) {
        tier = "TIER_2 (Structured Growth)";
        limitEst = 25000 + (bc.tradeLines * 8000);
      }

      grid.innerHTML = `
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Corporate Scorecard</div>
          <div class="fcc-matrix-cell-val" style="color: var(--acid-green);">${Math.round(score)}/100</div>
        </div>
        <div class="fcc-matrix-cell">
          <div class="fcc-matrix-cell-label">Target Credit Level</div>
          <div class="fcc-matrix-cell-val" style="font-size: 1.1rem; padding: 0.2rem 0; color: var(--yellow);">${tier}</div>
        </div>
        <div class="fcc-matrix-cell" style="grid-column: span 2;">
          <div class="fcc-matrix-cell-label">Estimated Indicative Line Capacity Limit</div>
          <div class="fcc-matrix-cell-val" style="color: var(--cyan);">$${limitEst.toLocaleString()}</div>
        </div>
      `;

      // Visual Radar or Level line indicators
      ctx.fillStyle = '#171821';
      ctx.fillRect(20, h/2 - 15, w - 40, 30);
      ctx.strokeStyle = '#F4F1E8';
      ctx.strokeRect(20, h/2 - 15, w - 40, 30);

      // Score gauge fill
      const fillW = (score / 100) * (w - 40);
      ctx.fillStyle = '#B6FF00';
      ctx.fillRect(20, h/2 - 15, fillW, 30);

      ctx.fillStyle = '#050505';
      ctx.font = "10px 'Share Tech Mono'";
      ctx.fillText(`INDEX STATUS: ${Math.round(score)}%`, w/2 - 40, h/2 + 4);
    }
  }

  // Export Engine parameters down to local CSV download format
  function exportCSV() {
    logToTacticalTerminal(`COMPILING EXPORT STREAM FOR: ${activeTab.toUpperCase()}`);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fintech Operator Parameter Report\r\n";
    csvContent += `Generated, ${new Date().toISOString()}\r\n\r\n`;
    csvContent += "Parameter Key, Metric Parameter Value\r\n";

    if (activeTab === 'cashflow') {
      csvContent += `Base Monthly Revenue, $${state.cashflow.monthlyRev}\r\n`;
      csvContent += `Growth Ratio, ${state.cashflow.growthRate}%\r\n`;
      csvContent += `COGS Margin, ${state.cashflow.cogsRatio}%\r\n`;
      csvContent += `Ad Spend Allocation, ${state.cashflow.adSpendRatio}%\r\n`;
    } else if (activeTab === 'mrr') {
      csvContent += `Current MRR, $${state.mrr.mrrVal}\r\n`;
      csvContent += `Net Churn, ${state.mrr.churnRate}%\r\n`;
      csvContent += `Requested term months, ${state.mrr.termLength}\r\n`;
    } else {
      csvContent += `D&B Active Trade Lines, ${state.bizcredit.tradeLines}\r\n`;
      csvContent += `Corporate Paydex, ${state.bizcredit.paydexScore}\r\n`;
      csvContent += `Registered Business, ${state.bizcredit.isRegisteredInc}\r\n`;
      csvContent += `Federal EIN Secured, ${state.bizcredit.hasElnNum}\r\n`;
      csvContent += `Personal Guarantee Offered, ${state.bizcredit.hasPG}\r\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Operator_${activeTab}_Metrics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logToTacticalTerminal("SUCCESS: CSV metrics stream dispatched successfully.");
  }

  // Mock sync callback payload directly to CRM systems
  function triggerCrmPipeline() {
    logToTacticalTerminal(`DISPATCHING WEAPONS PIPELINE ROUTE FROM ${activeTab.toUpperCase()}...`);
    const btn = document.getElementById('fccBtnTrigger');
    const oldText = btn.textContent;
    btn.textContent = "ROUTING...";
    btn.style.background = "var(--magenta)";

    setTimeout(() => {
      btn.textContent = oldText;
      btn.style.background = "";
      logToTacticalTerminal(`SUCCESS: Metrics pushed to Master CRM Wix Marketing Database.`);
    }, 1500);
  }

  // Self Initialization Entrypoint
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();