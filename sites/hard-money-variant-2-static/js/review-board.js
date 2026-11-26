// FlowLend Premium Attachment Review & Collaboration Board
// Dynamic Split-Screen Workspace Integration for Lender Underwriting Files

(function() {
  // 1. Interactive Attachments Mock Database (7 Detailed Files)
  const ATTACHMENTS_DATA = [
    {
      id: "exec-brief",
      title: "01. Executive Deal Brief",
      filename: "executive_brief_v4.pdf",
      type: "Application Summary",
      status: "Approved", // Approved, Reviewing, Flagged
      updatedAt: "2024-10-24 09:15 AM",
      reviewer: "Marcus T. (Risk Analyst)",
      comments: [
        { id: 1, author: "Marcus T.", role: "Lead Underwriter", avatar: "MT", text: "Verified the sponsor's track record of 14 successful exits in this zip code. Highly favorable.", time: "2 hours ago", activeSpot: true },
        { id: 2, author: "Sarah K.", role: "Risk Committee", avatar: "SK", text: "LTV matches our target profile of 70% based on the conservative post-rehab estimate.", time: "1 hour ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Institutional Underwriting Package</span>
            <h4 class="text-lg font-bold text-white mt-1">Multi-Family Acquisition & Rehab Brief</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">Asset Reference ID: #FL-8930-CA</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-500 block uppercase">Requested Loan</span>
              <span class="text-base font-mono font-bold text-white">$2,450,000</span>
            </div>
            <div class="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <span class="text-[10px] text-slate-500 block uppercase">Estimated ARV</span>
              <span class="text-base font-mono font-bold text-emerald-400">$3,500,000</span>
            </div>
          </div>

          <div class="space-y-3">
            <h5 class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Transaction Summary</h5>
            <p class="leading-relaxed">
              Sponsor is acquiring a value-add 12-unit multi-family complex in Los Angeles, CA. The business plan includes heavy interior upgrades ($45,000/unit) to capture a 35% market rent premium upon lease-up within 18 months.
            </p>
          </div>

          <!-- Highlighted interactive spot simulation -->
          <div class="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/15 transition-all relative group" onclick="window.highlightComment(1)">
            <span class="absolute -top-2.5 -left-2.5 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg animate-bounce">1</span>
            <span class="text-[10px] font-bold text-indigo-300 block uppercase mb-1">Interactive Underwriter Note</span>
            <p class="text-slate-200">Sponsor Liquidity Profile: $650,000 verified post-close liquidity. Personal financial statement (PFS) exhibits robust recurring income.</p>
          </div>
        </div>
      `
    },
    {
      id: "appraisal-valuation",
      title: "02. Commercial Appraisal",
      filename: "commercial_appraisal_la.pdf",
      type: "Valuation Report",
      status: "Reviewing",
      updatedAt: "2024-10-24 10:30 AM",
      reviewer: "Dave R. (Appraiser Liaison)",
      comments: [
        { id: 3, author: "Dave R.", role: "Appraiser Liaison", avatar: "DR", text: "Comp property #3 is slightly outdated but still provides a highly accurate structural baseline.", time: "30 mins ago", activeSpot: true }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Valuation Analysis</span>
            <h4 class="text-lg font-bold text-white mt-1">Appraisal & Sales Comparison Grid</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">Prepared by Integra Realty Resources, Inc.</p>
          </div>

          <div class="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <table class="w-full text-[11px] text-left">
              <thead>
                <tr class="bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                  <th class="p-2.5">Feature</th>
                  <th class="p-2.5">Subject Property</th>
                  <th class="p-2.5">Comp #1</th>
                  <th class="p-2.5 text-indigo-400">Comp #2</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900">
                <tr>
                  <td class="p-2.5 font-medium text-slate-400">Sale Price</td>
                  <td class="p-2.5 text-white font-semibold">$2,450,000</td>
                  <td class="p-2.5">$2,600,000</td>
                  <td class="p-2.5 text-indigo-300 font-semibold">$2,550,000</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-medium text-slate-400">Distance</td>
                  <td class="p-2.5 text-white">—</td>
                  <td class="p-2.5">0.45 miles</td>
                  <td class="p-2.5 text-indigo-300">0.2 miles</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-medium text-slate-400">Unit Mix</td>
                  <td class="p-2.5 text-white">12 x 2BR/1BA</td>
                  <td class="p-2.5">10 x 2BR</td>
                  <td class="p-2.5 text-indigo-300">12 x 2BR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/15 transition-all relative" onclick="window.highlightComment(3)">
            <span class="absolute -top-2.5 -left-2.5 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg">2</span>
            <span class="text-[10px] font-bold text-indigo-300 block uppercase mb-1">Adjusted Sales Analysis</span>
            <p class="text-slate-200">Adjusted comp values reflect a market premium trend due to immediate proximity to the newly approved metro expansion corridor.</p>
          </div>
        </div>
      `
    },
    {
      id: "pro-forma",
      title: "03. Pro Forma Cash Flow",
      filename: "pro_forma_rehab_model.xlsx",
      type: "Financial Projections",
      status: "Approved",
      updatedAt: "2024-10-23 04:12 PM",
      reviewer: "Sarah K. (Financial Analyst)",
      comments: [
        { id: 4, author: "Sarah K.", role: "Financial Analyst", avatar: "SK", text: "Debt Service Coverage Ratio (DSCR) climbs to 1.35x within Month 10 as units flip.", time: "1 day ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Financial Performance Matrix</span>
            <h4 class="text-lg font-bold text-white mt-1">Multi-Family Pro Forma Models (Stabilized)</h4>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span class="text-[9px] text-slate-500 uppercase block">Gross Potential</span>
              <span class="text-xs font-bold text-white font-mono">$324,000/yr</span>
            </div>
            <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span class="text-[9px] text-slate-500 uppercase block">Stabilized NOI</span>
              <span class="text-xs font-bold text-emerald-400 font-mono">$212,000/yr</span>
            </div>
            <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span class="text-[9px] text-slate-500 uppercase block">Exit Cap Rate</span>
              <span class="text-xs font-bold text-indigo-400 font-mono">5.85%</span>
            </div>
          </div>

          <div class="space-y-2">
            <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rehabilitation Fund Schedule</h5>
            <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div class="flex justify-between border-b border-slate-900 pb-1">
                <span>Phase I (Roof & HVAC)</span>
                <span class="text-slate-100">$85,000</span>
              </div>
              <div class="flex justify-between border-b border-slate-900 pb-1">
                <span>Phase II (Unit Interiors 1-6)</span>
                <span class="text-slate-100">$180,000</span>
              </div>
              <div class="flex justify-between">
                <span>Phase III (Unit Interiors 7-12)</span>
                <span class="text-slate-100">$180,000</span>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "environmental",
      title: "04. Phase I Environmental",
      filename: "phase_1_environmental_report.pdf",
      type: "Site Inspection",
      status: "Approved",
      updatedAt: "2024-10-21 11:15 AM",
      reviewer: "Marcus T. (Risk Analyst)",
      comments: [
        { id: 5, author: "Marcus T.", role: "Lead Underwriter", avatar: "MT", text: "No recognized environmental conditions (RECs) identified. Standard clearance approved.", time: "3 days ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Compliance Certificate</span>
            <h4 class="text-lg font-bold text-white mt-1">ESA Phase I Environmental Clean Status</h4>
          </div>

          <div class="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <div>
              <span class="text-xs font-bold text-emerald-400 block uppercase">No Action Required (REC Clear)</span>
              <p class="text-slate-400 text-[11px] mt-0.5">Analysis confirms historic uses do not present threat to localized groundwater or soils.</p>
            </div>
          </div>

          <div class="space-y-2">
            <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historical Use Breakdown</h5>
            <ul class="space-y-2 text-[11px] text-slate-400">
              <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span> 1994 - Present: Residential Multi-Family Dwelling</li>
              <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span> 1965 - 1994: Light Retail / Grocery Store Front</li>
              <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Historic: Clean Undeveloped Farmland</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "title-commitment",
      title: "05. Title Policy Commitment",
      filename: "preliminary_title_report.pdf",
      type: "Legal Clearance",
      status: "Reviewing",
      updatedAt: "2024-10-23 01:22 PM",
      reviewer: "Dave R. (Appraiser Liaison)",
      comments: [
        { id: 6, author: "Sarah K.", role: "Financial Analyst", avatar: "SK", text: "Verified second mortgage from previous owner has been officially satisfied and recorded.", time: "1 day ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Legal & Title Settlement</span>
            <h4 class="text-lg font-bold text-white mt-1">Schedule A: Preliminary Title Report</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">Underwritten by Chicago Title Insurance Company</p>
          </div>

          <div class="space-y-3">
            <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requirements Checklist</h5>
            <div class="space-y-2">
              <div class="flex items-center gap-2.5 p-2 bg-slate-950 rounded border border-slate-800/80">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Requirement 1: Execution and recording of the direct Deed of Trust.</span>
              </div>
              <div class="flex items-center gap-2.5 p-2 bg-slate-950 rounded border border-slate-800/80">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Requirement 2: Release of property tax liens from FY 2023.</span>
              </div>
              <div class="flex items-center gap-2.5 p-2 bg-slate-950 rounded border border-slate-800/80">
                <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span class="text-indigo-300 font-semibold">Requirement 3: Verification of current structural municipal easements.</span>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "liquidity-proof",
      title: "06. Liquidity Proofing",
      filename: "borrower_liquidity_v3.pdf",
      type: "Asset Verification",
      status: "Approved",
      updatedAt: "2024-10-24 08:30 AM",
      reviewer: "Sarah K. (Financial Analyst)",
      comments: [
        { id: 7, author: "Marcus T.", role: "Lead Underwriter", avatar: "MT", text: "Confirmed deposits match audited bank sheets perfectly.", time: "5 hours ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Liquidity & Capital Audit</span>
            <h4 class="text-lg font-bold text-white mt-1">Capital Reserves Verification</h4>
          </div>

          <!-- Pure CSS Visual Progress bar representing liquidity splits -->
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>Reserve Allocations</span>
              <span class="text-white">$650,000 Verified</span>
            </div>
            <div class="h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div class="h-full bg-emerald-400" style="width: 60%" title="Cash Liquid"></div>
              <div class="h-full bg-indigo-500" style="width: 30%" title="Marketable Securities"></div>
              <div class="h-full bg-amber-400" style="width: 10%" title="Escrow Deposit"></div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-emerald-400 rounded-sm"></span> Cash ($390k)</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-indigo-500 rounded-sm"></span> Securities ($195k)</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 bg-amber-400 rounded-sm"></span> Escrow ($65k)</span>
            </div>
          </div>

          <p class="leading-relaxed text-[11px] text-slate-400">
            Account verification executed via automated Plaid integrations. All accounts verified active, showing no unusual major withdrawals or recent encumbrances.
          </p>
        </div>
      `
    },
    {
      id: "architectural-plans",
      title: "07. Renovation Scope",
      filename: "rehabilitation_plans_la.pdf",
      type: "Development Scope",
      status: "Flagged",
      updatedAt: "2024-10-24 11:55 AM",
      reviewer: "Dave R. (Structural Liaison)",
      comments: [
        { id: 8, author: "Dave R.", role: "Underwriter", avatar: "DR", text: "Pending structural seismic approval stamps from the municipal engineering board.", time: "15 mins ago" }
      ],
      htmlContent: `
        <div class="space-y-6 text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-4">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block">Renovation Specifications</span>
            <h4 class="text-lg font-bold text-white mt-1">Architectural Rehabilitation & Permitting Scope</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">Municipal File No: #LA-903-PERMIT</p>
          </div>

          <div class="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <span class="text-xs font-bold text-amber-400 block uppercase">Action Required: Seismic Stamps Pending</span>
              <p class="text-slate-400 text-[11px] mt-0.5">Sponsor must upload final structural stamps by Nov 1st to satisfy formal loan term conditions.</p>
            </div>
          </div>

          <div class="space-y-2">
            <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Progress Tracking</h5>
            <div class="space-y-1.5 text-[11px] font-mono">
              <div class="flex justify-between text-emerald-400">
                <span>Exterior Renovation Approval:</span>
                <span>COMPLETED</span>
              </div>
              <div class="flex justify-between text-emerald-400">
                <span>Environmental Clearances:</span>
                <span>COMPLETED</span>
              </div>
              <div class="flex justify-between text-amber-400">
                <span>Municipal Seismic Permit:</span>
                <span class="font-bold">IN PROCESS</span>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  // Tracker for Active State inside split-screen board
  let activeAttachmentIndex = 0;

  // 2. Main Interface Setup
  function initCollaborationBoard() {
    // Check if the board is already injected
    if (document.getElementById("review-board-launcher")) return;

    // Inject Floating Review Board Trigger Button (Matches premium flow styling)
    const triggerBtn = document.createElement("div");
    triggerBtn.id = "review-board-launcher";
    triggerBtn.className = "fixed bottom-5 left-5 z-40";
    triggerBtn.innerHTML = `
      <button onclick="toggleCollaborationBoard(true)" class="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl shadow-2xl shadow-indigo-500/20 border border-indigo-400/30 transition-all transform hover:scale-[1.02] focus:outline-none">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 node-pulse inline-block"></span>
        <span class="text-xs font-extrabold uppercase tracking-wider">Review Board (7 Files)</span>
        <span class="px-1.5 py-0.5 bg-slate-950/40 border border-white/10 rounded text-[10px] font-mono font-bold">Live Workspace</span>
      </button>
    `;
    document.body.appendChild(triggerBtn);

    // Build Entire Full-Screen Workspace Layout Modal
    const workspaceContainer = document.createElement("div");
    workspaceContainer.id = "collaboration-board-workspace";
    workspaceContainer.className = "hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col transition-all duration-300 overflow-hidden";
    
    workspaceContainer.innerHTML = `
      <!-- Workspace Top Bar Navigation -->
      <header class="border-b border-slate-800 bg-slate-950 px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-white tracking-wide uppercase">Attachment Review & Collaboration Board</h2>
            <p class="text-[10px] text-slate-500">Premium Underwriting Workspace • Direct File Match Flow</p>
          </div>
        </div>

        <!-- Active Reviewers Avatars -->
        <div class="hidden md:flex items-center gap-3 border-x border-slate-800/80 px-6 py-2">
          <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Reviewers:</span>
          <div class="flex -space-x-1.5">
            <span class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-950" title="Sarah K. (Financial Analyst)">SK</span>
            <span class="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-950" title="Marcus T. (Risk Analyst)">MT</span>
            <span class="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-950" title="Dave R. (Structural Analyst)">DR</span>
          </div>
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <!-- Right Side Window Actions -->
        <div class="flex items-center gap-3">
          <button onclick="resetReviewWorkspace()" class="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-300 uppercase transition-colors">
            Reset Board
          </button>
          <button onclick="toggleCollaborationBoard(false)" class="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-2 rounded-lg transition-colors border border-slate-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Main Workspace Split-Screen Body -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Left Wing Navigation Tab Drawer: List of 7 attachments -->
        <aside class="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0">
          <div class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Loan Package Files</span>
              <span class="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold font-mono">7 Total</span>
            </div>
            
            <nav id="attachment-tabs-container" class="space-y-1.5">
              <!-- Tabs dynamic rendering output here -->
            </nav>
          </div>

          <!-- Direct Status Indicator Info Footer -->
          <div class="p-4 border-t border-slate-800/60 bg-slate-950/50 space-y-2.5 text-xs">
            <div class="bg-indigo-950/20 border border-indigo-500/10 rounded-lg p-2.5">
              <div class="flex items-center gap-2 justify-between">
                <span class="text-[9px] text-slate-400 font-bold uppercase">Package Review</span>
                <span id="overall-status-badge" class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold">Reviewing</span>
              </div>
              <div class="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                <div id="overall-progress-bar" class="bg-emerald-400 h-full transition-all duration-300" style="width: 71%"></div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Dynamic Middle Workspace - Split Preview Workspace -->
        <main class="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          <!-- Document Preview Pane (Visual PDF/Sheet Emulator) -->
          <div class="flex-1 bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto border-r border-slate-800/60 relative">
            <!-- Simulated PDF Action Top bar -->
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-6">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span id="preview-filename" class="text-xs font-mono font-medium text-slate-300">file_preview.pdf</span>
              </div>
              <div class="flex items-center gap-1">
                <button class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Zoom In"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg></button>
                <button class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Zoom Out"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6"/></svg></button>
                <button class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Print"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
              </div>
            </div>

            <!-- Previews Body Canvas -->
            <div class="flex-1 bg-slate-950/60 rounded-xl border border-slate-800 p-6 flex flex-col justify-start relative overflow-y-auto no-scrollbar" id="document-preview-canvas">
              <!-- Content gets rendered here dynamically -->
            </div>

            <!-- Page indicators -->
            <div class="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800/60">
              <span>Secure Underwriter Handshake Protocol ACTIVE</span>
              <span class="font-mono">Page 1 of 1 (Fully Verified)</span>
            </div>
          </div>

          <!-- Right Collaboration Board Comment & Action Sidebar -->
          <div class="w-full md:w-80 bg-slate-950 border-l border-slate-800 flex flex-col justify-between overflow-y-auto shrink-0">
            <!-- Header section of collaboration feed -->
            <div class="p-4 border-b border-slate-800 space-y-2">
              <span class="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Collaboration Feed</span>
              <h4 class="text-xs font-bold text-white">Annotations & Risk Audit Notes</h4>
            </div>

            <!-- Comments List Feed -->
            <div class="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4" id="workspace-comments-feed">
              <!-- Injected dynamically based on active attachment comments -->
            </div>

            <!-- Dynamic Input Annotation / Comment Form -->
            <div class="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
              <div>
                <label class="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Simulate Annotation Note</label>
                <div class="relative">
                  <textarea id="workspace-comment-input" rows="2" placeholder="Leave structural annotation or direct risk flag..." class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
                </div>
              </div>

              <!-- Action buttons to submit comment/risk flags -->
              <div class="grid grid-cols-2 gap-2">
                <button onclick="submitWorkspaceComment(false)" class="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                  Post Standard
                </button>
                <button onclick="submitWorkspaceComment(true)" class="py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                  🚨 Flag Risk Note
                </button>
              </div>
            </div>

          </div>
        </main>

      </div>
    `;

    document.body.appendChild(workspaceContainer);

    // Expose dynamic helper globally to anchor to custom DOM clicks in mock documents
    window.highlightComment = function(commentId) {
      const commentEl = document.getElementById(`collaboration-comment-${commentId}`);
      if (commentEl) {
        // Remove active styling from all comments
        document.querySelectorAll(".collaboration-comment-card").forEach(el => {
          el.classList.remove("ring-2", "ring-indigo-500", "bg-indigo-500/5");
        });
        
        // Highlight active clicked element
        commentEl.classList.add("ring-2", "ring-indigo-500", "bg-indigo-500/5");
        commentEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Show quick helper notification
        if (typeof showToast === 'function') {
          showToast(`Direct Annotation Node #${commentId} selected`);
        }
      }
    };

    // Render Initial State
    renderWorkspaceTabs();
    renderActiveAttachment();
  }

  // 3. Main Workspace Rendering Functions
  function renderWorkspaceTabs() {
    const tabsContainer = document.getElementById("attachment-tabs-container");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = ATTACHMENTS_DATA.map((attachment, index) => {
      const isActive = index === activeAttachmentIndex;
      const activeClasses = isActive 
        ? "bg-indigo-600/15 border-indigo-500/60 text-white" 
        : "border-slate-800/80 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white";
      
      // Setup dynamic indicator color based on attachment status
      let indicatorColor = "bg-emerald-400"; // Approved
      if (attachment.status === "Reviewing") indicatorColor = "bg-indigo-400";
      if (attachment.status === "Flagged") indicatorColor = "bg-amber-400";

      return `
        <button onclick="selectWorkspaceAttachment(${index})" class="w-full text-left p-2.5 rounded-xl border flex items-center justify-between group transition-all ${activeClasses}">
          <div class="space-y-1 overflow-hidden pr-2">
            <span class="text-[10px] font-bold block truncate">${attachment.title}</span>
            <span class="text-[9px] text-slate-500 font-mono block truncate">${attachment.filename}</span>
          </div>
          <span class="w-1.5 h-1.5 rounded-full shrink-0 ${indicatorColor}" title="${attachment.status}"></span>
        </button>
      `;
    }).join('');
  }

  function renderActiveAttachment() {
    const attachment = ATTACHMENTS_DATA[activeAttachmentIndex];
    if (!attachment) return;

    // Update File Preview Elements
    const filenameLabel = document.getElementById("preview-filename");
    if (filenameLabel) filenameLabel.textContent = attachment.filename;

    const previewCanvas = document.getElementById("document-preview-canvas");
    if (previewCanvas) {
      previewCanvas.innerHTML = attachment.htmlContent;
    }

    // Render Comments Specific to This Attachment
    const commentsFeed = document.getElementById("workspace-comments-feed");
    if (commentsFeed) {
      if (attachment.comments.length === 0) {
        commentsFeed.innerHTML = `
          <div class="text-center py-10 text-slate-600">
            <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-[11px]">No annotations recorded yet.</p>
          </div>
        `;
      } else {
        commentsFeed.innerHTML = attachment.comments.map(c => {
          const isRisk = c.text.toLowerCase().includes("flag") || c.text.toLowerCase().includes("pending") || c.text.toLowerCase().includes("seismic");
          const cardBorder = isRisk ? 'border-amber-500/20 bg-amber-500/5' : 'border-slate-800/80 bg-slate-900/40';

          return `
            <div id="collaboration-comment-${c.id}" class="collaboration-comment-card p-3 rounded-lg border transition-all duration-300 ${cardBorder}">
              <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800/40">
                <div class="flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 font-bold text-[9px] flex items-center justify-center">${c.avatar}</span>
                  <div>
                    <span class="text-[10px] font-bold text-white block">${c.author}</span>
                    <span class="text-[8px] text-slate-500 block">${c.role}</span>
                  </div>
                </div>
                <span class="text-[8px] font-mono text-slate-500">${c.time}</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">${c.text}</p>
            </div>
          `;
        }).join('');
      }
    }

    // Update progress tracker stats
    updateOverallProgress();
  }

  function updateOverallProgress() {
    const overallProgress = document.getElementById("overall-progress-bar");
    const overallStatus = document.getElementById("overall-status-badge");
    if (!overallProgress || !overallStatus) return;

    // Calculate dynamic approval completion status across all 7 items
    const approvedCount = ATTACHMENTS_DATA.filter(a => a.status === "Approved").length;
    const progressPercent = Math.round((approvedCount / ATTACHMENTS_DATA.length) * 100);

    overallProgress.style.width = `${progressPercent}%`;

    if (progressPercent === 100) {
      overallStatus.textContent = "Fully Approved";
      overallStatus.className = "px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold";
    } else if (ATTACHMENTS_DATA.some(a => a.status === "Flagged")) {
      overallStatus.textContent = "Action Required";
      overallStatus.className = "px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold";
    } else {
      overallStatus.textContent = "Under Review";
      overallStatus.className = "px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold";
    }
  }

  // 4. Workspace Action Interaction Controllers
  window.selectWorkspaceAttachment = function(index) {
    activeAttachmentIndex = index;
    renderWorkspaceTabs();
    renderActiveAttachment();

    // Notify of document swap
    if (typeof showToast === 'function') {
      showToast(`Review View Swapped: File #${index + 1}`);
    }
  };

  window.toggleCollaborationBoard = function(isVisible) {
    const board = document.getElementById("collaboration-board-workspace");
    if (!board) return;

    if (isVisible) {
      board.classList.remove("hidden");
      // Lock main body scrolling
      document.body.classList.add("overflow-hidden");
    } else {
      board.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };

  window.submitWorkspaceComment = function(isRiskFlag = false) {
    const textInput = document.getElementById("workspace-comment-input");
    if (!textInput) return;

    const text = textInput.value.trim();
    if (!text) {
      alert("Please input a valid annotation message.");
      return;
    }

    const activeAttachment = ATTACHMENTS_DATA[activeAttachmentIndex];
    if (!activeAttachment) return;

    // Create and push mock comment
    const newId = Date.now();
    activeAttachment.comments.push({
      id: newId,
      author: "You (Reviewer)",
      role: "Lead Lender Analyst",
      avatar: "YL",
      text: text,
      time: "Just now"
    });

    // Update attachment status appropriately if custom flagged
    if (isRiskFlag) {
      activeAttachment.status = "Flagged";
    } else {
      activeAttachment.status = "Approved"; // Overwrite to approved on standard resolution
    }

    // Reset Inputs
    textInput.value = "";

    // Re-render Dynamic Panels
    renderWorkspaceTabs();
    renderActiveAttachment();

    if (typeof showToast === 'function') {
      showToast(isRiskFlag ? "Risk Flagged Annotation Queued!" : "Underwriting Annotation Appended");
    }
  };

  window.resetReviewWorkspace = function() {
    // Revert attachments to standard pre-configured default statuses
    ATTACHMENTS_DATA[0].status = "Approved";
    ATTACHMENTS_DATA[1].status = "Reviewing";
    ATTACHMENTS_DATA[2].status = "Approved";
    ATTACHMENTS_DATA[3].status = "Approved";
    ATTACHMENTS_DATA[4].status = "Reviewing";
    ATTACHMENTS_DATA[5].status = "Approved";
    ATTACHMENTS_DATA[6].status = "Flagged";

    // Re-slice first couple comments back to default initial list
    ATTACHMENTS_DATA.forEach(a => {
      a.comments = a.comments.slice(0, 2); 
    });

    activeAttachmentIndex = 0;
    renderWorkspaceTabs();
    renderActiveAttachment();

    if (typeof showToast === 'function') {
      showToast("Review board successfully reset");
    }
  };

  // 5. Initialize once Document is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollaborationBoard);
  } else {
    initCollaborationBoard();
  }
})();