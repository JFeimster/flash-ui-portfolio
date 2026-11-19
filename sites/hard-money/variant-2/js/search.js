// Premium Simulated Database of Document Attachments for Hard Money Loans
const ATTACHMENTS_DATABASE = [
  {
    id: "doc-tax-2023",
    name: "3_Yr_Tax_Returns_2023_Signed.pdf",
    extension: "pdf",
    size: "4.8 MB",
    rawSize: 5033164,
    author: "Borrower Portal",
    uploadedDate: "2024-04-20T10:15:30Z",
    ocrKeywords: ["adjusted gross income", "schedule C", "tax liability", "IRS form 1040", "amortization"],
    status: "Verified",
    category: "Financials",
    previewContent: "INTERNAL REVENUE SERVICE // FORM 1040\nTaxable Year: 2023\nFilers: Johnathan Miller & Sarah Miller\nAdjusted Gross Income: $284,500\nSchedule C Business Income: $142,000\nStatus: Signed and Filed electronically via TurboTax Pro.\nVerification Token: IRS-SECURE-9921-X9."
  },
  {
    id: "doc-appraisal-ca",
    name: "Commercial_Property_Appraisal_CA_92109.pdf",
    extension: "pdf",
    size: "18.2 MB",
    rawSize: 19084083,
    author: "Third-Party Inspector",
    uploadedDate: "2024-04-19T14:45:00Z",
    ocrKeywords: ["appraisal value", "comparables", "income approach", "LTV ratio", "zoning commercial"],
    status: "Verified",
    category: "Property",
    previewContent: "VALUATION & ADVISORY SERVICES\nSubject Property: 4410 Mission Blvd, San Diego, CA 92109\nFinal Valuation Estimate: $3,250,000\nValuation Methodologies: Sales Comparison Approach ($3,180,000) and Income Capitalization Approach ($3,250,000).\nZoning Classification: Commercial-C1-A."
  },
  {
    id: "doc-credit-score",
    name: "Borrower_Credit_Report_Score_FICO.pdf",
    extension: "pdf",
    size: "820 KB",
    rawSize: 839680,
    author: "Underwriting Dept",
    uploadedDate: "2024-04-21T09:00:00Z",
    ocrKeywords: ["FICO score", "liens", "payment history", "credit bureau", "debt-to-income"],
    status: "Verified",
    category: "Credit",
    previewContent: "EQUIFAX / EXPERIAN / TRANSUNION TRI-MERGE CREDIT REPORT\nApplicant: Johnathan Miller\nFICO Score: 742 (Experian: 748, TransUnion: 739, Equifax: 739)\nActive Liens: None detected\nDelinquencies: 0 past 30 days. Debt-to-Income (DTI) Ratio: 34.2%."
  },
  {
    id: "doc-entity-formation",
    name: "Apex_Holdings_LLC_Formation_Docs.zip",
    extension: "zip",
    size: "12.4 MB",
    rawSize: 13002342,
    author: "Broker Portal",
    uploadedDate: "2024-04-15T16:22:11Z",
    ocrKeywords: ["operating agreement", "articles of organization", "registered agent", "LLC structure"],
    status: "Pending",
    category: "Legal",
    previewContent: "[Archive File Contents]\n- Articles_of_Organization_CA.pdf\n- LLC_Operating_Agreement_Apex_Holdings.pdf\n- IRS_EIN_Letter_CP575.pdf\nManaging Member: Johnathan Miller (100% Equity stake)."
  },
  {
    id: "doc-hazard-insurance",
    name: "Hazard_Insurance_Binder_Quote.docx",
    extension: "docx",
    size: "1.2 MB",
    rawSize: 1258291,
    author: "Borrower upload",
    uploadedDate: "2024-04-18T11:05:00Z",
    ocrKeywords: ["hazard insurance", "premium quote", "coverage limit", "deductible", "loss payee"],
    status: "Needs Review",
    category: "Insurance",
    previewContent: "LIBERTY MUTUAL COMMERCIAL INSURANCE BINDER\nInsured: Apex Holdings LLC\nCoverage Property: 4410 Mission Blvd, San Diego, CA\nPolicy Limit: $3,500,000 Replacement Cost Value\nDeductible: $10,000 per occurrence\nLoss Payee / Mortgagee: Flow Capital Funds Inc."
  },
  {
    id: "doc-title-prelim",
    name: "Preliminary_Title_Report_SanDiego.xlsx",
    extension: "xlsx",
    size: "3.5 MB",
    rawSize: 3670016,
    author: "Third-Party Inspector",
    uploadedDate: "2024-04-17T08:30:00Z",
    ocrKeywords: ["preliminary title", "encumbrances", "property tax", "easements", "first lien position"],
    status: "Verified",
    category: "Legal",
    previewContent: "CHICAGO TITLE INSURANCE COMPANY // EXCEL TITLE DATABASE RECORD\nParcel Number (APN): 415-090-22-00\nTax Assessment: Paid in full through Q2 2024.\nPrior Mortgages: 1st trust deed of $1,200,000 to be paid off at escrow close.\nEasements: Standard public utility easements on North/East boundaries."
  },
  {
    id: "doc-escrow-instructions",
    name: "Escrow_Holdback_Instructions_Signed.pdf",
    extension: "pdf",
    size: "2.1 MB",
    rawSize: 2202009,
    author: "Underwriting Dept",
    uploadedDate: "2024-04-21T15:10:00Z",
    ocrKeywords: ["escrow agent", "earnest money deposit", "disbursal schedule", "holdback terms"],
    status: "Verified",
    category: "Financials",
    previewContent: "COMMERCE ESCROW & TITLE SERVICES\nEscrow Officer: Marcus Vance\nEarnest Money Deposit (EMD): $150,000 received on April 12, 2024.\nHoldback Terms: $75,000 construction escrow reserve to be released upon certificate of occupancy."
  },
  {
    id: "doc-site-photos",
    name: "Site_Inspection_Photos_PreConstruction.jpg",
    extension: "png",
    size: "15.6 MB",
    rawSize: 16357785,
    author: "Third-Party Inspector",
    uploadedDate: "2024-04-10T13:40:00Z",
    ocrKeywords: ["site photos", "preconstruction", "foundation inspection", "framing stage"],
    status: "Verified",
    category: "Property",
    previewContent: "[High Resolution EXIF Metadata File]\nImage Resolution: 4032 x 3024 pixels\nGeotag Coordinates: Lat 32.7951, Long -117.2519\nSubject Matter: Structural framing, clearing site, concrete slab foundation preparation works completed."
  }
];

// Active State for Attachment Search
let attachmentState = {
  searchQuery: "",
  selectedExtensions: [],
  selectedAuthors: [],
  selectedSizeRange: "All",
  selectedDateRange: "All",
  activeKeywords: [],
  selectedAttachment: null
};

// All available OCR keywords extracted dynamically for the tag cloud
const ALL_OCR_KEYWORDS = [
  "adjusted gross income", "appraisal value", "FICO score", "LTV ratio", "operating agreement", 
  "hazard insurance", "preliminary title", "first lien position", "escrow agent", "preconstruction"
];

// Active tab state: 'lenders' or 'attachments'
let activeTab = "lenders";

// Initialize Attachment View Hook
document.addEventListener("DOMContentLoaded", () => {
  injectAttachmentVaultTab();
  createPreviewDrawer();
});

// Inject "Attachment Vault" tab and replace navigation flows
function injectAttachmentVaultTab() {
  const headerNav = document.querySelector("header .flex.items-center.gap-3");
  if (!headerNav) return;

  // Create clean modern Vault Switch button
  const vaultTabBtn = document.createElement("button");
  vaultTabBtn.id = "btn-switch-vault";
  vaultTabBtn.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-all ml-1";
  vaultTabBtn.innerHTML = `
    <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
    </svg>
    Attachment Vault
  `;

  // Insert before the Interactive Matcher
  headerNav.insertBefore(vaultTabBtn, headerNav.firstChild);

  vaultTabBtn.addEventListener("click", () => {
    toggleWorkspaceView();
  });
}

// Toggle logic between Capital Matcher and Attachment Vault
function toggleWorkspaceView() {
  const mainSection = document.querySelector("main");
  const heroSection = document.querySelector("section.relative.pt-8");
  const switcherBtn = document.getElementById("btn-switch-vault");

  if (activeTab === "lenders") {
    activeTab = "attachments";
    switcherBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Lender Directory
    `;
    switcherBtn.classList.remove("text-slate-300", "border-slate-800", "bg-slate-900");
    switcherBtn.classList.add("text-indigo-300", "border-indigo-500/30", "bg-indigo-500/5");

    // Hide hero match pipeline and render Attachment Dashboard layout inside <main>
    if (heroSection) heroSection.style.display = "none";
    renderAttachmentDashboard(mainSection);
  } else {
    activeTab = "lenders";
    switcherBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
      </svg>
      Attachment Vault
    `;
    switcherBtn.classList.remove("text-indigo-300", "border-indigo-500/30", "bg-indigo-500/5");
    switcherBtn.classList.add("text-slate-300", "border-slate-800", "bg-slate-900");

    if (heroSection) heroSection.style.display = "block";
    location.reload(); // Quick restore of original layout
  }
}

// Render dynamic workspace dashboard for Advanced Attachment Search & Filter Engine
function renderAttachmentDashboard(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Sidebar: Advanced Metadata Filters -->
      <aside class="space-y-6 lg:col-span-1">
        <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-6">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-white uppercase tracking-wider">Attachment Filters</h4>
            <button onclick="resetAttachmentFilters()" class="text-[10px] text-slate-400 hover:text-white transition-colors">Clear All</button>
          </div>

          <!-- Document Name & OCR Keyword Search -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 font-medium">Text / OCR Search</label>
            <div class="relative">
              <input type="text" id="vault-search" placeholder="Search keywords, file names..." class="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- File Extension Filters -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 font-medium">File Extensions</label>
            <div class="flex flex-wrap gap-1.5 mt-1">
              ${["pdf", "docx", "xlsx", "png", "zip"].map(ext => `
                <button onclick="toggleExtensionFilter('${ext}')" id="ext-${ext}" class="px-2.5 py-1 text-[11px] rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                  .${ext.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- File Size Filters -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 font-medium">File Size Class</label>
            <select id="vault-size-select" onchange="filterAttachmentSize(this.value)" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
              <option value="All">All Sizes</option>
              <option value="Small">&lt; 1.0 MB</option>
              <option value="Medium">1.0 MB - 5.0 MB</option>
              <option value="Large">5.0 MB - 20.0 MB+</option>
            </select>
          </div>

          <!-- Author Source Filters -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 font-medium">Uploader Source</label>
            <div class="space-y-2 mt-1" id="vault-author-list">
              ${["Borrower Portal", "Underwriting Dept", "Broker Portal", "Third-Party Inspector"].map(author => `
                <label class="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" value="${author}" onchange="toggleAuthorFilter(this)" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950">
                  <span>${author}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Uploaded Date Filter -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 font-medium">Upload Period</label>
            <div class="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800/85">
              <button onclick="filterAttachmentDate('All')" id="date-All" class="date-btn py-1 px-2 text-[10px] rounded font-medium text-white bg-indigo-600 transition-all">All Time</button>
              <button onclick="filterAttachmentDate('Recent')" id="date-Recent" class="date-btn py-1 px-2 text-[10px] rounded font-medium text-slate-400 hover:text-white transition-all">Last 7 Days</button>
            </div>
          </div>

          <!-- Live Vault Stat Counter -->
          <div class="border-t border-slate-800/60 pt-4 mt-4 space-y-2.5">
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Security Credentials</span>
            <div class="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-2.5 text-xs text-emerald-300 flex items-center justify-between">
              <span>OCR Pipeline:</span>
              <span class="font-mono font-bold text-white">Active (v2.1)</span>
            </div>
          </div>
        </div>

        <!-- Interactive OCR Tag Cloud Selector Widget -->
        <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <h4 class="font-bold text-xs text-white uppercase tracking-wider">Fast OCR Search Tags</h4>
          </div>
          <div class="flex flex-wrap gap-1.5" id="tag-cloud-container">
            ${ALL_OCR_KEYWORDS.map(tag => `
              <button onclick="toggleOCRTag('${tag}')" id="tag-${tag.replace(/\s+/g, '-')}" class="tag-pill px-2 py-1 text-[10px] rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                #${tag}
              </button>
            `).join('')}
          </div>
        </div>
      </aside>

      <!-- Right Panel: Results Grid -->
      <section class="lg:col-span-3 space-y-6">
        <!-- Interactive Vault Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800/80 rounded-xl p-4">
          <div>
            <span class="text-indigo-400 text-xs font-bold uppercase tracking-wide">Document Analytics Hub</span>
            <div class="flex items-center gap-2 mt-1">
              <span id="active-vault-count" class="text-lg font-extrabold text-white">0</span>
              <span class="text-slate-500 text-xs">processed underwriting attachments</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="simulateAddAttachment()" class="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              Upload Mock File
            </button>
          </div>
        </div>

        <!-- Dynamic Grid of Files -->
        <div id="attachments-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Dynamic rendering injected here -->
        </div>

        <!-- Empty State Component -->
        <div id="vault-empty-state" class="hidden text-center py-16 bg-slate-950 border border-dashed border-slate-800 rounded-xl space-y-4">
          <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">No Matching Files Located</h4>
            <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">Adjust search strings, clear extension selectors, or tap general OCR tags.</p>
          </div>
          <button onclick="resetAttachmentFilters()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
            Reset Filters
          </button>
        </div>
      </section>
    </div>
  `;

  // Attach search input keyup/change listeners
  document.getElementById("vault-search").addEventListener("input", (e) => {
    attachmentState.searchQuery = e.target.value.toLowerCase();
    renderAttachments();
  });

  renderAttachments();
}

// Generate the visual File Type Icon
function getFileIcon(extension) {
  const map = {
    pdf: { color: "text-rose-400 bg-rose-500/10 border-rose-500/20", char: "PDF" },
    docx: { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", char: "DOC" },
    xlsx: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", char: "XLS" },
    png: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", char: "IMG" },
    jpg: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", char: "IMG" },
    zip: { color: "text-purple-400 bg-purple-500/10 border-purple-500/20", char: "ZIP" }
  };
  return map[extension] || { color: "text-slate-400 bg-slate-500/10 border-slate-500/20", char: "DOC" };
}

// Render logic to output matched files
function renderAttachments() {
  const grid = document.getElementById("attachments-grid");
  const emptyState = document.getElementById("vault-empty-state");
  const activeCountLabel = document.getElementById("active-vault-count");

  if (!grid) return;

  let matches = ATTACHMENTS_DATABASE.filter(file => {
    // Search String match
    if (attachmentState.searchQuery) {
      const matchName = file.name.toLowerCase().includes(attachmentState.searchQuery);
      const matchAuthor = file.author.toLowerCase().includes(attachmentState.searchQuery);
      const matchOcr = file.ocrKeywords.some(kw => kw.toLowerCase().includes(attachmentState.searchQuery));
      const matchPreview = file.previewContent.toLowerCase().includes(attachmentState.searchQuery);
      if (!matchName && !matchAuthor && !matchOcr && !matchPreview) return false;
    }

    // Extensions check
    if (attachmentState.selectedExtensions.length > 0) {
      if (!attachmentState.selectedExtensions.includes(file.extension)) return false;
    }

    // Authors check
    if (attachmentState.selectedAuthors.length > 0) {
      if (!attachmentState.selectedAuthors.includes(file.author)) return false;
    }

    // Size range check
    if (attachmentState.selectedSizeRange !== "All") {
      const sizeMB = file.rawSize / (1024 * 1024);
      if (attachmentState.selectedSizeRange === "Small" && sizeMB >= 1.0) return false;
      if (attachmentState.selectedSizeRange === "Medium" && (sizeMB < 1.0 || sizeMB > 5.0)) return false;
      if (attachmentState.selectedSizeRange === "Large" && sizeMB <= 5.0) return false;
    }

    // Date range check (Mock logic based on relative dates)
    if (attachmentState.selectedDateRange === "Recent") {
      const uploadTime = new Date(file.uploadedDate).getTime();
      const cutoffTime = new Date("2024-04-18T00:00:00Z").getTime();
      if (uploadTime < cutoffTime) return false;
    }

    // Active Keyword check
    if (attachmentState.activeKeywords.length > 0) {
      const hasKeywords = attachmentState.activeKeywords.every(kw => file.ocrKeywords.includes(kw));
      if (!hasKeywords) return false;
    }

    return true;
  });

  activeCountLabel.textContent = matches.length;

  if (matches.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  grid.innerHTML = matches.map(file => {
    const fileIconStyle = getFileIcon(file.extension);
    const dateFormatted = new Date(file.uploadedDate).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });

    let statusBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (file.status === "Needs Review") statusBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    if (file.status === "Pending") statusBadgeColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";

    return `
      <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-5 hover:bg-slate-900/50 transition-all duration-300 relative group glow-border flex flex-col justify-between">
        <div>
          <!-- Header block: Icon + Name -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${fileIconStyle.color}">
              ${fileIconStyle.char}
            </div>
            <div class="space-y-0.5 max-w-[calc(100%-3rem)]">
              <h3 class="font-semibold text-white text-sm truncate group-hover:text-indigo-400 transition-colors" title="${file.name}">${file.name}</h3>
              <p class="text-[10px] text-slate-500">Source: ${file.author} • ${file.size}</p>
            </div>
          </div>

          <!-- Mid Section: Status & Verification details -->
          <div class="flex items-center justify-between mt-4 pb-3 border-b border-slate-900">
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">${file.category} Data</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full border ${statusBadgeColor} font-medium">
              ${file.status}
            </span>
          </div>

          <!-- Keyword Badges extracted from OCR -->
          <div class="my-4 space-y-1">
            <span class="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Identified OCR Keywords</span>
            <div class="flex flex-wrap gap-1">
              ${file.ocrKeywords.map(kw => `
                <span class="text-[9px] bg-slate-900/60 border border-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded-md hover:text-indigo-300 transition-colors">
                  #${kw}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Connection actions inside card -->
        <div class="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 mt-auto">
          <span class="text-[10px] font-mono">${dateFormatted}</span>
          <button onclick="openAttachmentPreview('${file.id}')" class="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
            Inspect OCR
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Side Drawer Container Setup
function createPreviewDrawer() {
  const drawer = document.createElement("div");
  drawer.id = "attachment-preview-drawer";
  drawer.className = "fixed inset-y-0 right-0 max-w-lg w-full bg-slate-950 border-l border-slate-800/80 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar hidden";
  drawer.innerHTML = `
    <!-- Glowing Accent Element inside Drawer -->
    <div class="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

    <!-- Header Block -->
    <div class="p-6 border-b border-slate-800/80 flex justify-between items-start sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold tracking-wider uppercase" id="preview-tag-badge">OCR Engine Ready</span>
          <span class="text-[10px] font-mono text-emerald-400" id="preview-size-tag">12.4 MB</span>
        </div>
        <h3 class="text-lg font-bold text-white mt-1.5 break-all" id="preview-title">Document Title</h3>
        <p class="text-[11px] text-slate-500" id="preview-author">Author metadata</p>
      </div>
      <button onclick="closeAttachmentPreview()" class="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Metadata Grid -->
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
          <span class="text-[9px] text-slate-500 uppercase block">Verification Check</span>
          <span class="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Verified Hash Matching
          </span>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
          <span class="text-[9px] text-slate-500 uppercase block">Database Location</span>
          <span class="text-xs font-mono font-bold text-slate-300 mt-1">/secure-flow-storage</span>
        </div>
      </div>

      <!-- OCR Raw Content Display Workspace -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <h4 class="text-xs font-bold text-white uppercase tracking-wider">Extracted OCR Text Content</h4>
          <span class="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">Accuracy Score: 99.8%</span>
        </div>
        <div class="relative bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[180px] text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap shadow-inner" id="preview-ocr-text">
          <!-- Text Injected Here -->
        </div>
      </div>

      <!-- Meta Tags -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider">Identified Context Phrases</h4>
        <div class="flex flex-wrap gap-1.5" id="preview-tags-container">
          <!-- Tags dynamically set -->
        </div>
      </div>

      <!-- Action Footer within Drawer -->
      <div class="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3">
        <span class="text-[10px] text-indigo-400 font-bold tracking-wider uppercase block">Document Actions Pipeline</span>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="triggerDownloadSim()" class="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Draft
          </button>
          <button onclick="triggerReRunSim()" class="py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"/></svg>
            Re-Run OCR
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);
}

// Side drawer slide-out controls
function openAttachmentPreview(id) {
  const file = ATTACHMENTS_DATABASE.find(f => f.id === id);
  if (!file) return;

  const drawer = document.getElementById("attachment-preview-drawer");
  document.getElementById("preview-title").textContent = file.name;
  document.getElementById("preview-size-tag").textContent = file.size;
  document.getElementById("preview-author").textContent = `Uploaded by ${file.author} on ${new Date(file.uploadedDate).toLocaleString()}`;
  
  // Highlight keyword matches if query is actively entered
  let contentHtml = file.previewContent;
  if (attachmentState.searchQuery) {
    const regex = new RegExp(`(${attachmentState.searchQuery})`, "gi");
    contentHtml = contentHtml.replace(regex, `<mark class="bg-indigo-500/30 text-white px-0.5 rounded border-b border-indigo-500">$1</mark>`);
  }
  document.getElementById("preview-ocr-text").innerHTML = contentHtml;

  // Insert context tags
  const tagsContainer = document.getElementById("preview-tags-container");
  tagsContainer.innerHTML = file.ocrKeywords.map(kw => `
    <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[10px] text-indigo-300">#${kw}</span>
  `).join('');

  // Show drawer
  drawer.classList.remove("hidden");
  setTimeout(() => {
    drawer.classList.remove("translate-x-full");
  }, 10);
}

function closeAttachmentPreview() {
  const drawer = document.getElementById("attachment-preview-drawer");
  drawer.classList.add("translate-x-full");
  setTimeout(() => {
    drawer.classList.add("hidden");
  }, 300);
}

// Interactive filter toggle mechanisms
function toggleExtensionFilter(ext) {
  const btn = document.getElementById(`ext-${ext}`);
  if (!btn) return;

  if (attachmentState.selectedExtensions.includes(ext)) {
    attachmentState.selectedExtensions = attachmentState.selectedExtensions.filter(e => e !== ext);
    btn.classList.remove("bg-indigo-600", "text-white");
    btn.classList.add("bg-slate-900", "text-slate-400");
  } else {
    attachmentState.selectedExtensions.push(ext);
    btn.classList.remove("bg-slate-900", "text-slate-400");
    btn.classList.add("bg-indigo-600", "text-white");
  }
  renderAttachments();
}

function toggleAuthorFilter(checkbox) {
  const author = checkbox.value;
  if (checkbox.checked) {
    attachmentState.selectedAuthors.push(author);
  } else {
    attachmentState.selectedAuthors = attachmentState.selectedAuthors.filter(a => a !== author);
  }
  renderAttachments();
}

function filterAttachmentSize(sizeClass) {
  attachmentState.selectedSizeRange = sizeClass;
  renderAttachments();
}

function filterAttachmentDate(range) {
  const btns = document.querySelectorAll(".date-btn");
  btns.forEach(b => {
    b.classList.remove("bg-indigo-600", "text-white");
    b.classList.add("text-slate-400");
  });

  attachmentState.selectedDateRange = range;
  const activeBtn = document.getElementById(`date-${range}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400");
    activeBtn.classList.add("bg-indigo-600", "text-white");
  }
  renderAttachments();
}

function toggleOCRTag(tag) {
  const cleanId = `tag-${tag.replace(/\s+/g, '-')}`;
  const btn = document.getElementById(cleanId);
  if (!btn) return;

  if (attachmentState.activeKeywords.includes(tag)) {
    attachmentState.activeKeywords = attachmentState.activeKeywords.filter(k => k !== tag);
    btn.classList.remove("bg-emerald-500", "text-slate-950", "border-emerald-500");
    btn.classList.add("bg-slate-900", "text-slate-400", "border-slate-800");
  } else {
    attachmentState.activeKeywords.push(tag);
    btn.classList.remove("bg-slate-900", "text-slate-400", "border-slate-800");
    btn.classList.add("bg-emerald-500", "text-slate-950", "border-emerald-500");
  }
  renderAttachments();
}

// Simulated dynamic file upload
function simulateAddAttachment() {
  const newId = `doc-sim-${Date.now()}`;
  const fileTemplates = [
    {
      name: "Borrower_Personal_Financial_Statement_PFS.xlsx",
      extension: "xlsx",
      size: "2.3 MB",
      rawSize: 2411724,
      author: "Borrower upload",
      ocrKeywords: ["liquid assets", "real estate portfolio", "net worth", "liabilities"],
      status: "Pending",
      category: "Financials",
      previewContent: "MOCK STATEMENT OF FINANCIAL POSITION\nAssets Cash Reserves: $120,000\nReal Estate Portfolio value: $2,100,000\nTotal Net Worth: $1,850,000."
    },
    {
      name: "Preliminary_Environmental_Site_Assessment_Phase1.pdf",
      extension: "pdf",
      size: "24.5 MB",
      rawSize: 25690112,
      author: "Third-Party Inspector",
      ocrKeywords: ["site photos", "preconstruction", "encumbrances"],
      status: "Verified",
      category: "Property",
      previewContent: "PHASE I ENVIRONMENTAL SITE ASSESSMENT REPORT\nSubject Property: 4410 Mission Blvd, San Diego, CA\nConclusion: No recognized environmental conditions (RECs) identified."
    }
  ];

  const selection = fileTemplates[Math.floor(Math.random() * fileTemplates.length)];
  const randomizedFile = {
    ...selection,
    id: newId,
    uploadedDate: new Date().toISOString()
  };

  ATTACHMENTS_DATABASE.unshift(randomizedFile);
  renderAttachments();

  // Highlight using the base component's custom toast notification if available
  if (typeof showToast === "function") {
    showToast(`Uploaded ${randomizedFile.name}`);
  } else {
    alert(`File uploaded: ${randomizedFile.name}`);
  }
}

// Reset Attachment filter logic
function resetAttachmentFilters() {
  attachmentState = {
    searchQuery: "",
    selectedExtensions: [],
    selectedAuthors: [],
    selectedSizeRange: "All",
    selectedDateRange: "All",
    activeKeywords: [],
    selectedAttachment: null
  };

  // Re-sync UI element values
  const searchBar = document.getElementById("vault-search");
  if (searchBar) searchBar.value = "";

  const sizeSelect = document.getElementById("vault-size-select");
  if (sizeSelect) sizeSelect.value = "All";

  // Deselect inputs and class stylings
  const extBtns = document.querySelectorAll("[id^='ext-']");
  extBtns.forEach(btn => {
    btn.classList.remove("bg-indigo-600", "text-white");
    btn.classList.add("bg-slate-900", "text-slate-400");
  });

  const checkboxes = document.querySelectorAll("#vault-author-list input");
  checkboxes.forEach(chk => {
    chk.checked = false;
  });

  const tagPills = document.querySelectorAll(".tag-pill");
  tagPills.forEach(pill => {
    pill.classList.remove("bg-emerald-500", "text-slate-950", "border-emerald-500");
    pill.classList.add("bg-slate-900", "text-slate-400", "border-slate-800");
  });

  filterAttachmentDate('All');
  renderAttachments();
}

// Action Handlers
function triggerDownloadSim() {
  closeAttachmentPreview();
  if (typeof showToast === "function") {
    showToast("Beginning Document Stream Connection...");
  } else {
    alert("Downloading file draft...");
  }
}

function triggerReRunSim() {
  if (typeof showToast === "function") {
    showToast("Re-indexing File Text Blocks via OCR...");
  } else {
    alert("Re-processing file extraction data...");
  }
}