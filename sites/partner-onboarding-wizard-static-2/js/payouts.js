(function () {
  // Neo-Brutalist Payouts & Earnings Ledger State
  const state = {
    clearedBalance: 14250.00,
    pendingCommissions: 6750.00,
    historicalEarnings: 58900.00,
    filterQuery: '',
    filterStatus: 'ALL',
    transactions: [
      { id: "TX-8041", date: "2024-11-04", entity: "Apex Logistics Inc.", amount: 3750.00, type: "Commission Placement", status: "CLEARED" },
      { id: "TX-7992", date: "2024-10-28", entity: "Vanguard Tech Partners", amount: 5000.00, type: "Payout Settlement", status: "COMPLETED" },
      { id: "TX-7851", date: "2024-10-15", entity: "Horizon Real Estate", amount: 4250.00, type: "Commission Placement", status: "CLEARED" },
      { id: "TX-7730", date: "2024-10-02", entity: "Systech Solutions LLC", amount: 2500.00, type: "Commission Placement", status: "PENDING" },
      { id: "TX-7619", date: "2024-09-18", entity: "Titanium Corp", amount: 6250.00, type: "Commission Placement", status: "CLEARED" },
      { id: "TX-7411", date: "2024-09-01", entity: "Alpha Capital Sourcing", amount: 4250.00, type: "Commission Placement", status: "PENDING" },
      { id: "TX-7390", date: "2024-08-25", entity: "Sovereign Holdings", amount: 10000.00, type: "Payout Settlement", status: "COMPLETED" },
      { id: "TX-7102", date: "2024-08-10", entity: "Beacon Digital Group", amount: 26400.00, type: "Commission Placement", status: "CLEARED" }
    ]
  };

  // Dynamic CSS Injection for high-contrast ledger styling
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* PAYOUTS PANEL NEOTENE STYLE INJECTIONS */
    .ledger-container {
      margin-top: 40px;
      border: var(--border-thick, 4px solid #000);
      background-color: #FFFFFF;
      box-shadow: 12px 12px 0px #000000;
      padding: 40px;
      font-family: 'Archivo', sans-serif;
    }
    .ledger-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 40px;
    }
    @media (max-width: 1024px) {
      .ledger-grid { grid-template-columns: 1fr; }
    }
    .metrics-stark-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    @media (max-width: 640px) {
      .metrics-stark-row { grid-template-columns: 1fr; }
    }
    .metric-stark-card {
      border: var(--border-thick, 4px solid #000);
      padding: 20px;
      background: #FFFFFF;
      box-shadow: 4px 4px 0px #000000;
    }
    .metric-stark-label {
      font-family: 'Archivo Black', sans-serif;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 5px;
    }
    .metric-stark-value {
      font-family: 'Archivo Black', sans-serif;
      font-size: 32px;
      line-height: 1;
    }
    .metric-stark-value.green { color: #00aa3a; }
    .metric-stark-value.orange { color: var(--accent, #FF5100); }
    
    /* SEARCH / FILTER BAR */
    .filter-stark-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }
    .filter-stark-input {
      flex: 1;
      min-width: 200px;
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 800;
      border: var(--border-thick, 4px solid #000);
      outline: none;
      background: #FFFFFF;
    }
    .filter-stark-input:focus {
      background: #F3F3F3;
      outline: 3px dashed var(--accent, #FF5100);
    }
    .filter-stark-select {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      border: var(--border-thick, 4px solid #000);
      background: #FFFFFF;
      cursor: pointer;
    }
    
    /* HIGH CONTRAST TABULAR STRUCTURE */
    .payouts-table-wrapper {
      border: var(--border-thick, 4px solid #000);
      box-shadow: 6px 6px 0px #000000;
      overflow-x: auto;
      background: #000000; /* Dark skeleton border background */
    }
    .payouts-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .payouts-table th {
      background: #000000;
      color: #FFFFFF;
      padding: 16px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .payouts-table tr:nth-child(odd) {
      background-color: #FFFFFF;
    }
    .payouts-table tr:nth-child(even) {
      background-color: #F9F9F9;
    }
    .payouts-table tr:hover {
      background-color: #FFF2EC;
    }
    .payouts-table td {
      padding: 16px;
      border-bottom: var(--border-thin, 2px solid #000);
      font-weight: 800;
      font-size: 14px;
      color: #000000;
    }
    .payouts-table tr:last-child td {
      border-bottom: none;
    }
    
    /* NEON ACCENTS & STATUSES */
    .stark-status {
      display: inline-block;
      padding: 4px 8px;
      font-weight: 900;
      font-size: 11px;
      text-transform: uppercase;
      border: var(--border-thin, 2px solid #000);
    }
    .stark-status.cleared { background-color: #B5F1CC; color: #000; }
    .stark-status.pending { background-color: #FFF3B0; color: #000; }
    .stark-status.completed { background-color: #E2E2E2; color: #000; }
    .stark-status.processing { background-color: #00FFFF; color: #000; }

    /* BRUTALIST WITHDRAWAL SIDEBAR CARD */
    .withdrawal-stark-box {
      border: var(--border-thick, 4px solid #000);
      background: #F3F3F3;
      padding: 25px;
      box-shadow: 6px 6px 0px #000000;
      height: fit-content;
    }
    .withdrawal-title {
      font-family: 'Archivo Black', sans-serif;
      font-size: 18px;
      text-transform: uppercase;
      margin-bottom: 15px;
      border-bottom: var(--border-thin, 2px solid #000);
      padding-bottom: 8px;
    }
    .withdrawal-label {
      font-family: 'Archivo Black', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      display: block;
      margin-bottom: 6px;
    }
    .withdrawal-input-group {
      margin-bottom: 20px;
    }
    .withdrawal-input {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      font-weight: 800;
      border: var(--border-thick, 4px solid #000);
      box-sizing: border-box;
      outline: none;
    }
    .withdrawal-select {
      width: 100%;
      padding: 12px;
      font-size: 14px;
      font-weight: 800;
      border: var(--border-thick, 4px solid #000);
      background: #FFFFFF;
      box-sizing: border-box;
    }
    /* AGGRESSIVE NEON TRIGGER */
    .btn-neon-trigger {
      width: 100%;
      background-color: #00FF66; /* Vibrant Neon Green */
      color: #000000;
      border: var(--border-thick, 4px solid #000);
      padding: 16px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 16px;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 6px 6px 0px #000000;
      transition: all 0.1s ease;
      font-weight: 900;
    }
    .btn-neon-trigger:hover {
      transform: translate(2px, 2px);
      box-shadow: 4px 4px 0px #000000;
      background-color: #00E55C;
    }
    .btn-neon-trigger:active {
      transform: translate(6px, 6px);
      box-shadow: 0px 0px 0px #000000;
    }
    .payouts-disclaimer {
      font-size: 11px;
      color: #555;
      font-weight: 700;
      margin-top: 15px;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(styleElement);

  // Core Payout Module Definition
  window.MoonshinePayouts = {
    /**
     * Initializes and mounts the stark payouts ledger component inside a parent DOM node.
     * @param {string|HTMLElement} target - The element or selector to render the layout in.
     */
    init: function (target) {
      const container = typeof target === 'string' ? document.querySelector(target) : target;
      if (!container) {
        console.error("MoonshinePayouts Error: Mount target not detected in DOM.");
        return;
      }
      this.container = container;
      this.render();
    },

    // UI Redraw Strategy
    render: function () {
      const filteredTx = state.transactions.filter(tx => {
        const queryMatch = tx.entity.toLowerCase().includes(state.filterQuery.toLowerCase()) || 
                           tx.id.toLowerCase().includes(state.filterQuery.toLowerCase()) ||
                           tx.type.toLowerCase().includes(state.filterQuery.toLowerCase());
        const statusMatch = state.filterStatus === 'ALL' || tx.status === state.filterStatus;
        return queryMatch && statusMatch;
      });

      this.container.innerHTML = `
        <div class="ledger-container">
          <div style="border-bottom: var(--border-thick, 4px solid #000); padding-bottom: 15px; margin-bottom: 30px;">
            <h2 class="font-display" style="font-size: 42px; line-height: 1; margin: 0; font-family: 'Archivo Black', sans-serif; text-transform: uppercase;">
              Earnings & Payout Ledger
            </h2>
            <p style="font-weight: 800; font-size: 15px; margin-top: 8px; color: #444;">
              Stark transaction registry monitoring node liquidity configurations and balance settlement pathways.
            </p>
          </div>

          <div class="metrics-stark-row">
            <div class="metric-stark-card">
              <div class="metric-stark-label">Cleared Settlement Balance</div>
              <div class="metric-stark-value green" id="ledger-cleared-val">
                $${state.clearedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div class="metric-stark-card">
              <div class="metric-stark-label">Pending Commission Pool</div>
              <div class="metric-stark-value orange">
                $${state.pendingCommissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div class="metric-stark-card">
              <div class="metric-stark-label">Historical Earnings Combined</div>
              <div class="metric-stark-value">
                $${state.historicalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div class="ledger-grid">
            <!-- Table Panel -->
            <div>
              <div class="filter-stark-bar">
                <input type="text" 
                       class="filter-stark-input" 
                       id="ledger-search-input" 
                       placeholder="SEARCH ENTITY OR NODE KEY..." 
                       value="${state.filterQuery}"
                       oninput="MoonshinePayouts.handleSearch(this.value)">
                
                <select class="filter-stark-select" id="ledger-status-filter" onchange="MoonshinePayouts.handleStatusFilter(this.value)">
                  <option value="ALL" ${state.filterStatus === 'ALL' ? 'selected' : ''}>ALL TRANSACTIONS</option>
                  <option value="CLEARED" ${state.filterStatus === 'CLEARED' ? 'selected' : ''}>CLEARED</option>
                  <option value="PENDING" ${state.filterStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
                  <option value="COMPLETED" ${state.filterStatus === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                  <option value="PROCESSING" ${state.filterStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                </select>
              </div>

              <div class="payouts-table-wrapper">
                <table class="payouts-table">
                  <thead>
                    <tr>
                      <th>TX-Node Reference</th>
                      <th>Creation Date</th>
                      <th>Entity Association</th>
                      <th>Telemetry Type</th>
                      <th>Settle Stream Status</th>
                      <th style="text-align: right;">Amount Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredTx.length > 0 ? filteredTx.map(tx => `
                      <tr>
                        <td>${tx.id}</td>
                        <td>${tx.date}</td>
                        <td>${tx.entity}</td>
                        <td>${tx.type}</td>
                        <td>
                          <span class="stark-status ${tx.status.toLowerCase()}">${tx.status}</span>
                        </td>
                        <td style="text-align: right; font-family: 'Archivo Black', sans-serif;">
                          ${tx.type === "Payout Settlement" || tx.type === "Initiated Withdrawal" ? '-' : '+'}$${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    `).join('') : `
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 40px; background: #FFFFFF; font-weight: 900; font-size: 16px;">
                          SYSTEM TRACE ZERO: NO MATCHING DATA NODES LOCATED.
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Withdrawal Interface -->
            <div>
              <div class="withdrawal-stark-box">
                <div class="withdrawal-title">Vault Withdrawal</div>
                
                <div class="withdrawal-input-group">
                  <label class="withdrawal-label" for="w-amount">Settlement Volume ($)</label>
                  <input type="number" 
                         id="w-amount" 
                         class="withdrawal-input" 
                         placeholder="e.g. 5000" 
                         min="1" 
                         max="${state.clearedBalance}">
                </div>

                <div class="withdrawal-input-group">
                  <label class="withdrawal-label" for="w-destination">Disbursement Network</label>
                  <select id="w-destination" class="withdrawal-select">
                    <option value="ACH">ACH Wire Transfer (Institutional)</option>
                    <option value="USDC">USDC (ERC-20 Cyber Ledger)</option>
                    <option value="CHECK">Certified Bank Draft (Priority Dispatch)</option>
                  </select>
                </div>

                <button class="btn-neon-trigger" onclick="MoonshinePayouts.triggerWithdrawal()">
                  EXECUTE TRANSACTION →
                </button>

                <p class="payouts-disclaimer">
                  🚨 WARNING: Executing a withdrawal settles real-time liquidity directly to registered nodes. Cleared metrics will adjust dynamically upon successful telemetry matching.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // Live actions & event triggers
    handleSearch: function (val) {
      state.filterQuery = val;
      this.render();
      // Refocus cursor seamlessly
      const searchInput = document.getElementById('ledger-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(val.length, val.length);
      }
    },

    handleStatusFilter: function (status) {
      state.filterStatus = status;
      this.render();
    },

    triggerWithdrawal: function () {
      const amountInput = document.getElementById('w-amount');
      const networkSelect = document.getElementById('w-destination');
      if (!amountInput || !networkSelect) return;

      const requestedVal = parseFloat(amountInput.value);
      const network = networkSelect.value;

      if (isNaN(requestedVal) || requestedVal <= 0) {
        alert("TRANSACTION ERROR:\nEnter a valid disbursement volume key.");
        return;
      }

      if (requestedVal > state.clearedBalance) {
        alert(`LIQUIDITY BREACH:\nYour request exceeds cleared settlement capacity of $${state.clearedBalance.toLocaleString()}.`);
        return;
      }

      // Decrement the cleared allocation parameters
      state.clearedBalance -= requestedVal;

      // Unshift new pending trace node to the telemetry timeline
      const dateString = new Date().toISOString().split('T')[0];
      const traceKey = "TX-" + Math.floor(1000 + Math.random() * 9000);
      
      state.transactions.unshift({
        id: traceKey,
        date: dateString,
        entity: `Moonshine Vault Dispatch (${network})`,
        amount: requestedVal,
        type: "Initiated Withdrawal",
        status: "PROCESSING"
      });

      // Clear input and redraw interface
      amountInput.value = '';
      this.render();

      alert(`TELEMETRY TRANSMITTED SUCCESSFULLY:\nNode code ${traceKey} registering ${requestedVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} dispatch to ${network} channel.`);
    }
  };
})();
