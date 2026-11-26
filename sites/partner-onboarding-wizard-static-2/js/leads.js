/**
 * MOONSHINE CAPITAL - PIPELINE ENGINE & DEAL TRACKER (js/leads.js)
 * Fully interactive, state-persisted, Neo-Brutalist deal command matrix.
 * Implements Drag-and-Drop Kanban pipelines, custom high-contrast modals,
 * dynamic commission calculations, and real-time state sync.
 */

(function () {
  // --- INJECT CUSTOM PIPELINE & MODAL CSS RULES ---
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    /* BRUTALIST KANBAN STYLES */
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 30px 0 40px 0;
    }

    .pipeline-column {
      background: var(--bg-alt);
      border: var(--border-thick);
      box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0px #000;
      padding: 15px;
      display: flex;
      flex-direction: column;
      min-height: 450px;
      transition: transform 0.15s, background-color 0.15s;
    }

    .pipeline-column.drag-over {
      background: var(--accent-muted);
      transform: scale(0.99);
      outline: 4px dashed var(--accent);
    }

    .column-header {
      background: var(--dark);
      color: var(--bg);
      font-family: 'Archivo Black', sans-serif;
      text-transform: uppercase;
      font-size: 13px;
      padding: 10px;
      margin: -15px -15px 15px -15px;
      text-align: center;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .column-count {
      background: var(--accent);
      color: var(--dark);
      border: var(--border-thin);
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 900;
    }

    .deal-cards-container {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    /* DRAGGABLE DEAL CARD */
    .deal-card {
      background: var(--bg);
      border: var(--border-thick);
      padding: 15px;
      box-shadow: 4px 4px 0px #000;
      cursor: grab;
      position: relative;
      transition: transform 0.1s, box-shadow 0.1s;
      user-select: none;
    }

    .deal-card:active {
      cursor: grabbing;
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px #000;
    }

    .deal-card.dragging {
      opacity: 0.4;
      border-style: dashed;
    }

    .deal-card-title {
      font-family: 'Archivo Black', sans-serif;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .deal-card-meta {
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #555;
    }

    .deal-card-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 900;
      padding: 3px 6px;
      border: var(--border-thin);
      text-transform: uppercase;
    }

    /* BADGE COLORS */
    .badge-prospect { background: #FFED4A; color: #000; }
    .badge-review { background: var(--accent-light); color: #000; }
    .badge-termsheet { background: #00E1D9; color: #000; }
    .badge-closed { background: #00FF66; color: #000; }

    .deal-card-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      border-top: var(--border-thin);
      padding-top: 8px;
    }

    .deal-card-btn {
      background: none;
      border: var(--border-thin);
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      cursor: pointer;
    }

    .deal-card-btn:hover {
      background: var(--dark);
      color: var(--bg);
    }

    .deal-card-btn.delete-btn {
      margin-left: auto;
      background: #FF3B30;
      color: #fff;
    }

    /* BRUTAL MODAL OVERLAY */
    .brutalist-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(2px);
    }

    .brutalist-modal {
      background: var(--bg);
      border: var(--border-thick);
      box-shadow: 12px 12px 0px #000;
      width: 100%;
      max-width: 600px;
      padding: 40px;
      position: relative;
      animation: modalPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes modalPop {
      0% { transform: scale(0.9) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    .modal-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: var(--accent);
      color: var(--dark);
      border: var(--border-thick);
      width: 40px;
      height: 40px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 4px 4px 0px #000;
    }

    .modal-close:hover {
      transform: translate(1px, 1px);
      box-shadow: 3px 3px 0px #000;
    }

    .view-toggle-row {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
    }

    .toggle-btn {
      background: var(--bg-alt);
      border: var(--border-thin);
      padding: 8px 16px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      cursor: pointer;
    }

    .toggle-btn.active {
      background: var(--accent);
      border: var(--border-thick);
      box-shadow: 3px 3px 0px #000;
    }

    @media (max-width: 1024px) {
      .pipeline-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .pipeline-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(styleElement);

  // --- INITIALIZE STATE ENGINE ---
  const DEFAULT_LEADS = [
    {
      id: "deal-1",
      company: "Acme Logistics Inc.",
      amount: 250000,
      contact: "Franklin Miller",
      email: "franklin@acme.com",
      status: "under_review",
      ref: "partner-demo",
      date: "2024-03-12"
    },
    {
      id: "deal-2",
      company: "Vanguard Renewable Energy",
      amount: 3500000,
      contact: "Sarah Croft",
      email: "scroft@vanguard-power.com",
      status: "closed",
      ref: "partner-demo",
      date: "2024-02-28"
    },
    {
      id: "deal-3",
      company: "Apex Health Systems",
      amount: 1200000,
      contact: "Dr. Aaron Vance",
      email: "vance@apexhealth.org",
      status: "term_sheet",
      ref: "partner-demo",
      date: "2024-03-05"
    },
    {
      id: "deal-4",
      company: "Nova Retail Group",
      amount: 85000,
      contact: "Marcus Kane",
      email: "kane@novaretail.io",
      status: "prospect",
      ref: "partner-demo",
      date: "2024-03-15"
    }
  ];

  let state = {
    leads: JSON.parse(localStorage.getItem("moonshine_leads")) || DEFAULT_LEADS,
    viewMode: "kanban" // "kanban" or "table"
  };

  function saveToLocalStorage() {
    localStorage.setItem("moonshine_leads", JSON.stringify(state.leads));
  }

  // --- COMPUTE SYSTEM METRICS DYNAMICALLY ---
  function computeAndRenderMetrics() {
    let activePipelineSum = 0;
    let closedVolume = 0;
    let clickMock = 47; // Static premium aesthetic click rate

    state.leads.forEach(lead => {
      const amt = Number(lead.amount) || 0;
      if (lead.status === "closed") {
        closedVolume += amt;
      } else {
        activePipelineSum += amt;
      }
    });

    // Commission Slab Rules:
    // Level 1 ($0 - $500k): 1.5% of gross funding value
    // Level 2 ($500k - $2.5M): 2.5% of gross funding value
    // Level 3 ($2.5M+): 4.0% of gross funding value
    let payoutRate = 0.015;
    if (closedVolume > 2500000) {
      payoutRate = 0.04;
    } else if (closedVolume > 50000) {
      payoutRate = 0.025;
    }

    const projectedPayout = closedVolume * payoutRate + (activePipelineSum * 0.005); // Include nominal 0.5% security estimate for processing pipeline

    // Update Dashboard DOM nodes
    const pipelineSumNode = document.getElementById("dash-pipeline-sum");
    if (pipelineSumNode) {
      pipelineSumNode.innerText = "$" + activePipelineSum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    const clickNode = document.querySelector(".metrics-grid > div:nth-child(2) .metric-value");
    if (clickNode) {
      clickNode.innerText = clickMock + state.leads.length * 3;
    }

    const payoutNode = document.querySelector(".metrics-grid > div:nth-child(3) .metric-value");
    if (payoutNode) {
      payoutNode.innerText = "$" + projectedPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // --- RENDER SECTIONS ---
  function buildKanbanGrid() {
    const columns = [
      { key: "prospect", label: "Prospecting Board" },
      { key: "under_review", label: "Under Review" },
      { key: "term_sheet", label: "Term Sheets" },
      { key: "closed", label: "Closed Funded" }
    ];

    let gridHtml = `<div class="pipeline-grid">`;

    columns.forEach(col => {
      const colLeads = state.leads.filter(l => l.status === col.key);
      gridHtml += `
        <div class="pipeline-column" data-status="${col.key}" ondragover="event.preventDefault()" ondragenter="this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')">
          <div class="column-header">
            <span>${col.label}</span>
            <span class="column-count">${colLeads.length}</span>
          </div>
          <div class="deal-cards-container" data-status="${col.key}">
      `;

      colLeads.forEach(lead => {
        gridHtml += `
          <div class="deal-card" draggable="true" data-id="${lead.id}">
            <div class="deal-card-title">${escapeHTML(lead.company)}</div>
            <div class="deal-card-meta">$${Number(lead.amount).toLocaleString()} &bull; ${escapeHTML(lead.contact)}</div>
            <div>
              <span class="deal-card-badge badge-${col.key.replace("_", "")}">${col.key.replace("_", " ")}</span>
            </div>
            <div class="deal-card-actions">
              <button class="deal-card-btn" onclick="window.promoteDeal('${lead.id}')">Advance &rarr;</button>
              <button class="deal-card-btn delete-btn" onclick="window.eliminateDeal('${lead.id}')">Del</button>
            </div>
          </div>
        `;
      });

      gridHtml += `
          </div>
        </div>
      `;
    });

    gridHtml += `</div>`;
    return gridHtml;
  }

  function buildRegistryTable() {
    let tableHtml = `
      <div class="dashboard-table-container">
        <table class="brutal-table">
          <thead>
            <tr>
              <th>Registered Entity</th>
              <th>Requested Fund Volume</th>
              <th>Node Key</th>
              <th>Executive Contact</th>
              <th>Telemetry Pipeline Status</th>
              <th>Governance Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (state.leads.length === 0) {
      tableHtml += `<tr><td colspan="6" style="text-align: center; padding: 30px;">NO RECORDED TELEMETRY TRANSACTIONS CURRENTLY IN CONSOLE.</td></tr>`;
    } else {
      state.leads.forEach(lead => {
        const badgeClass = `badge-${lead.status.replace("_", "")}`;
        tableHtml += `
          <tr>
            <td><strong>${escapeHTML(lead.company)}</strong></td>
            <td>$${Number(lead.amount).toLocaleString()}</td>
            <td><code>${escapeHTML(lead.ref || 'partner-demo')}</code></td>
            <td>${escapeHTML(lead.contact)} <br> <span style="font-size: 11px; opacity:0.6">${escapeHTML(lead.email)}</span></td>
            <td><span class="deal-card-badge ${badgeClass}">${lead.status.replace("_", " ")}</span></td>
            <td>
              <button class="deal-card-btn" onclick="window.promoteDeal('${lead.id}')">Advance Status</button>
              <button class="deal-card-btn delete-btn" onclick="window.eliminateDeal('${lead.id}')">Eliminate</button>
            </td>
          </tr>
        `;
      });
    }

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;
    return tableHtml;
  }

  function renderView() {
    const parentContainer = document.querySelector(".dashboard-table-container");
    if (!parentContainer) return;

    // Build Switcher block
    let renderTarget = document.getElementById("pipeline-matrix-injection");
    if (!renderTarget) {
      renderTarget = document.createElement("div");
      renderTarget.id = "pipeline-matrix-injection";
      parentContainer.parentNode.replaceChild(renderTarget, parentContainer);
    }

    const toggleRow = `
      <div class="view-toggle-row">
        <button class="toggle-btn ${state.viewMode === "kanban" ? "active" : ""}" id="toggle-kanban-btn">Kanban Workspace</button>
        <button class="toggle-btn ${state.viewMode === "table" ? "active" : ""}" id="toggle-table-btn">Structured Table Grid</button>
      </div>
    `;

    const activeViewOutput = state.viewMode === "kanban" ? buildKanbanGrid() : buildRegistryTable();
    renderTarget.innerHTML = toggleRow + activeViewOutput;

    // Attach Toggle Listeners
    document.getElementById("toggle-kanban-btn").addEventListener("click", () => {
      state.viewMode = "kanban";
      renderView();
    });
    document.getElementById("toggle-table-btn").addEventListener("click", () => {
      state.viewMode = "table";
      renderView();
    });

    // Wire up Drag and Drop
    setupDragAndDrop();
    computeAndRenderMetrics();
  }

  // --- DRAG & DROP IMPLEMENTATION ---
  function setupDragAndDrop() {
    const cards = document.querySelectorAll(".deal-card");
    const columns = document.querySelectorAll(".pipeline-column");

    cards.forEach(card => {
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });
    });

    columns.forEach(col => {
      col.addEventListener("dragover", e => {
        e.preventDefault();
        const container = col.querySelector(".deal-cards-container");
        const draggingCard = document.querySelector(".dragging");
        if (draggingCard) {
          container.appendChild(draggingCard);
        }
      });

      col.addEventListener("drop", () => {
        col.classList.remove("drag-over");
        const draggingCard = document.querySelector(".dragging");
        if (draggingCard) {
          const dealId = draggingCard.dataset.id;
          const newStatus = col.dataset.status;
          updateDealStatus(dealId, newStatus);
        }
      });
    });
  }

  function updateDealStatus(id, newStatus) {
    const deal = state.leads.find(l => l.id === id);
    if (deal) {
      deal.status = newStatus;
      saveToLocalStorage();
      renderView();
    }
  }

  // --- GLOBAL EXPOSED CONTROLS ---
  window.promoteDeal = function (id) {
    const statusCycle = ["prospect", "under_review", "term_sheet", "closed"];
    const deal = state.leads.find(l => l.id === id);
    if (deal) {
      const idx = statusCycle.indexOf(deal.status);
      if (idx !== -1 && idx < statusCycle.length - 1) {
        deal.status = statusCycle[idx + 1];
        saveToLocalStorage();
        renderView();
      } else {
        alert("This high-value deal is already successfully closed & funded!");
      }
    }
  };

  window.eliminateDeal = function (id) {
    if (confirm("Are you sure you want to scrub this pipeline node from the network registry?")) {
      state.leads = state.leads.filter(l => l.id !== id);
      saveToLocalStorage();
      renderView();
    }
  };

  // --- DYNAMIC MODAL GENERATION ---
  window.openSubmitDealModal = function () {
    const overlay = document.createElement("div");
    overlay.className = "brutalist-overlay";
    overlay.id = "brutalist-modal-overlay";

    overlay.innerHTML = `
      <div class="brutalist-modal">
        <button class="modal-close" onclick="window.closeSubmitDealModal()">&times;</button>
        <h2 class="font-display" style="font-size:28px; margin-bottom: 25px;">Register High-Value Deal Node</h2>
        
        <form id="brutalist-modal-form" onsubmit="event.preventDefault(); window.handleModalSubmission();">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div class="input-group">
              <label class="input-label" for="modal-company">Target Entity Name</label>
              <input type="text" id="modal-company" class="input-brutal" placeholder="e.g. Orion Industries" required>
            </div>
            <div class="input-group">
              <label class="input-label" for="modal-amount">Capital Sum ($ USD)</label>
              <input type="number" id="modal-amount" class="input-brutal" placeholder="e.g. 750000" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div class="input-group">
              <label class="input-label" for="modal-contact">Managing Director</label>
              <input type="text" id="modal-contact" class="input-brutal" placeholder="e.g. Cynthia Bell" required>
            </div>
            <div class="input-group">
              <label class="input-label" for="modal-email">Corporate Email</label>
              <input type="email" id="modal-email" class="input-brutal" placeholder="e.g. cynthia@orion.io" required>
            </div>
          </div>

          <div class="input-group">
            <label class="input-label" for="modal-status">Baseline Stage Entry</label>
            <select id="modal-status" class="input-brutal" style="font-size:16px;">
              <option value="prospect">Prospect Stage</option>
              <option value="under_review">Under Review Stage</option>
              <option value="term_sheet">Term Sheet Stage</option>
              <option value="closed">Closed Funded Stage</option>
            </select>
          </div>

          <button type="submit" class="btn-brutal" style="width: 100%; text-align: center;">
            SECURE PIPELINE ENTRY →
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
  };

  window.closeSubmitDealModal = function () {
    const overlay = document.getElementById("brutalist-modal-overlay");
    if (overlay) overlay.remove();
  };

  window.handleModalSubmission = function () {
    const company = document.getElementById("modal-company").value.trim();
    const amount = Number(document.getElementById("modal-amount").value);
    const contact = document.getElementById("modal-contact").value.trim();
    const email = document.getElementById("modal-email").value.trim();
    const status = document.getElementById("modal-status").value;

    if (!company || !amount || !contact || !email) {
      alert("Attention: Complete all parameters.");
      return;
    }

    const newDeal = {
      id: "deal-" + Date.now(),
      company,
      amount,
      contact,
      email,
      status,
      ref: window.userAffiliateId || "partner-demo",
      date: new Date().toISOString().split("T")[0]
    };

    state.leads.unshift(newDeal);
    saveToLocalStorage();
    window.closeSubmitDealModal();
    renderView();
  };

  // --- HOOK INTO BASE APP FLOWS ---
  function hookBaseApplication() {
    // Intercept original submitPilotLead function
    window.submitPilotLead = function () {
      const company = document.getElementById('lead-company').value.trim();
      const amountStr = document.getElementById('lead-amount').value.trim();
      const contact = document.getElementById('lead-contact').value.trim();
      const email = document.getElementById('lead-email').value.trim();

      if (!company || !amountStr || !contact || !email) {
        alert("Attention: All key fields require completion to map node pipeline metrics.");
        return;
      }

      const cleanAmount = Number(amountStr.replace(/[^0-9]/g, '')) || 250000;

      const newDeal = {
        id: "deal-" + Date.now(),
        company,
        amount: cleanAmount,
        contact,
        email,
        status: "under_review",
        ref: window.userAffiliateId || "partner-demo",
        date: new Date().toISOString().split("T")[0]
      };

      state.leads.unshift(newDeal);
      saveToLocalStorage();

      // Proceed to Step 4 (Dashboard)
      window.markStepCompleted(3);
      window.markStepCompleted(4);
      window.goToStep(4);

      // Re-render
      renderView();
    };

    // Replace Dashboard Create Trigger to use our Custom Blocky Modal
    const dashActions = document.querySelector(".btn-actions-row");
    if (dashActions) {
      const addBtn = dashActions.querySelector("button:first-child");
      if (addBtn) {
        addBtn.setAttribute("onclick", "window.openSubmitDealModal()");
      }
    }
  }

  // Helper Escape HTML function
  function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Execute on load
  document.addEventListener("DOMContentLoaded", () => {
    hookBaseApplication();
    renderView();
  });

  // Hotfix fallback for immediate injection
  setTimeout(() => {
    hookBaseApplication();
    renderView();
  }, 500);

})();
