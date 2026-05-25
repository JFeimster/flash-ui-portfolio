// Inject Neo-Brutalist styles specific to Secure Transfer & Share Link Manager
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .transfers-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .transfer-form-card {
        background: var(--surface-card);
        border: var(--border-width) solid #fff;
        padding: 25px;
        box-shadow: 5px 5px 0px var(--accent-cyan);
    }
    
    .section-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #fff;
    }
    
    .files-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .file-chip {
        background: var(--surface);
        border: 2px solid #fff;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.15s;
    }
    
    .file-chip.selected {
        background: var(--accent-magenta);
        color: #fff;
        box-shadow: 3px 3px 0px #fff;
        transform: translate(-2px, -2px);
    }
    
    .transfer-grid-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    @media (max-width: 600px) {
        .transfer-grid-options {
            grid-template-columns: 1fr;
        }
    }
    
    .toggle-container {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--surface);
        border: var(--border-width) solid #fff;
        padding: 15px;
        cursor: pointer;
        user-select: none;
    }
    
    .toggle-box {
        width: 24px;
        height: 24px;
        border: 2px solid #fff;
        background: var(--surface-card);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 14px;
    }
    
    .toggle-container.active .toggle-box {
        background: var(--accent-cyan);
        color: #000;
    }
    
    .btn-action-brutal {
        background: var(--accent-yellow);
        color: #000;
        border: var(--border-width) solid #fff;
        padding: 15px 25px;
        font-size: 16px;
        font-weight: 900;
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 4px 4px 0px #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        transition: transform 0.1s, box-shadow 0.1s;
    }
    
    .btn-action-brutal:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #fff;
    }
    
    .btn-action-brutal:active {
        transform: translate(2px, 2px);
        box-shadow: 0px 0px 0px;
    }
    
    .active-transfers-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .transfer-item {
        background: var(--surface-card);
        border: var(--border-width) solid #fff;
        padding: 20px;
        box-shadow: var(--brutal-shadow-magenta);
        position: relative;
    }
    
    .transfer-item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .transfer-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 18px;
        font-weight: 800;
        text-transform: uppercase;
        color: #fff;
    }
    
    .transfer-badge {
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 900;
        padding: 4px 8px;
        border: 2px solid #fff;
    }
    
    .badge-active {
        background: var(--accent-cyan);
        color: #000;
    }
    
    .badge-expired {
        background: var(--accent-magenta);
        color: #fff;
    }
    
    .transfer-meta-rows {
        margin-bottom: 15px;
    }
    
    .meta-row {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        padding: 6px 0;
        border-bottom: 1px dashed rgba(255,255,255,0.1);
    }
    
    .meta-label {
        color: var(--text-muted);
        font-weight: 700;
    }
    
    .meta-val {
        color: #fff;
        font-weight: 800;
    }
    
    .transfer-actions-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .btn-mini-brutal {
        border: 2px solid #fff;
        background: var(--surface);
        color: #fff;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        cursor: pointer;
        font-family: 'Space Grotesk', sans-serif;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    
    .btn-mini-brutal:hover {
        background: #fff;
        color: #000;
    }
    
    .btn-mini-brutal.danger:hover {
        background: var(--accent-magenta);
        color: #fff;
    }
    
    /* Toast Notification */
    .brutal-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--accent-cyan);
        color: #000;
        border: 3px solid #fff;
        padding: 15px 30px;
        font-weight: 900;
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        box-shadow: 6px 6px 0px #000;
        z-index: 10000;
        transform: translateY(150%);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .brutal-toast.show {
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);

// Mock Database for Transfers
const DEFAULT_TRANSFERS = [
    {
        id: "tx-8902",
        name: "Series A Underwriting Bundle",
        files: ["pitch_deck.pdf", "financial_projections.xlsx"],
        expires: "2025-06-30",
        password: "sec-pro-99",
        allowDownload: true,
        downloads: 14,
        status: "Active"
    },
    {
        id: "tx-4412",
        name: "Q3 Tax & Entity Docs",
        files: ["ein_verification.pdf", "tax_returns_2023.zip"],
        expires: "2024-11-01",
        password: "",
        allowDownload: false,
        downloads: 3,
        status: "Expired"
    }
];

// Initialize LocalStorage Data
if (!localStorage.getItem("secure_transfers")) {
    localStorage.setItem("secure_transfers", JSON.stringify(DEFAULT_TRANSFERS));
}

// Global available mock files
const AVAILABLE_FILES = [
    "pitch_deck.pdf",
    "financial_projections.xlsx",
    "ein_verification.pdf",
    "tax_returns_2023.zip",
    "underwriting_sheet.xlsx",
    "corporate_bylaws.pdf"
];

// Dynamically inject the Link Manager Utility card on load
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("toolGrid");
    if (grid) {
        const card = document.createElement("div");
        card.className = "tool-card";
        card.setAttribute("data-category", "broker");
        card.innerHTML = `
            <div class="tool-icon">🔒</div>
            <span class="tool-tag">Broker</span>
            <h3>Secure Share Manager</h3>
            <p>View active transfers, configure passwords, toggle download rights, and set automated expirations.</p>
            <div class="tool-action" onclick="openCalculator('transfers')">Launch utility ↗</div>
        `;
        grid.appendChild(card);
    }
});

// Hook into base components global calculator engine
if (window.openCalculator) {
    const originalOpenCalculator = window.openCalculator;
    window.openCalculator = function (type) {
        if (type === "transfers") {
            setupTransfersManager();
        } else {
            originalOpenCalculator(type);
        }
    };
}

// Setup and render transfer manager inside active overlay
function setupTransfersManager() {
    const calcName = document.getElementById("calcName");
    const calcBody = document.getElementById("calcBody");

    if (calcName && calcBody) {
        calcName.innerText = "Secure Transfer & Share Links";
        renderTransfersInterface(calcBody);
    }
}

// Component state variables for the current builder
let selectedFiles = ["pitch_deck.pdf", "financial_projections.xlsx"];
let allowDownloadState = true;

function renderTransfersInterface(container) {
    const data = JSON.parse(localStorage.getItem("secure_transfers")) || [];

    let fileChipsHTML = AVAILABLE_FILES.map(file => {
        const isSelected = selectedFiles.includes(file);
        return `<div class="file-chip ${isSelected ? 'selected' : ''}" onclick="toggleFileSelection('${file}')">
            ${isSelected ? '✔' : '+'} ${file}
        </div>`;
    }).join("");

    let transfersHTML = data.map(tx => {
        const isActive = tx.status === "Active" && new Date(tx.expires) > new Date();
        const displayStatus = isActive ? "Active" : "Expired";
        const badgeClass = isActive ? "badge-active" : "badge-expired";

        return `
            <div class="transfer-item">
                <div class="transfer-item-header">
                    <div class="transfer-title">${tx.name}</div>
                    <div class="transfer-badge ${badgeClass}">${displayStatus}</div>
                </div>
                
                <div class="transfer-meta-rows">
                    <div class="meta-row">
                        <span class="meta-label">Files</span>
                        <span class="meta-val" style="color: var(--accent-cyan);">${tx.files.join(", ")}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Expiration Date</span>
                        <span class="meta-val">${tx.expires}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Password Protected</span>
                        <span class="meta-val">${tx.password ? "🔒 Yes" : "❌ Public"}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Download Right</span>
                        <span class="meta-val">${tx.allowDownload ? "Enabled" : "View-Only (PDF Viewer/Excel Preview)"}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Total Downloads</span>
                        <span class="meta-val" style="color: var(--accent-yellow);">${tx.downloads} hits</span>
                    </div>
                </div>
                
                <div class="transfer-actions-row">
                    <button class="btn-mini-brutal" onclick="copyTransferLink('${tx.id}')">📋 Copy Link</button>
                    <button class="btn-mini-brutal" onclick="toggleTxDownload('${tx.id}')">🔄 Toggle Download</button>
                    <button class="btn-mini-brutal danger" onclick="deleteTransfer('${tx.id}')">⚠️ Revoke</button>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <div class="transfers-container">
            <!-- Builder/Form -->
            <div class="transfer-form-card">
                <div class="section-title">📂 Build New Attachment Bundle</div>
                
                <div class="calc-group">
                    <label class="calc-label">Bundle Name</label>
                    <input type="text" id="tx_name" class="calc-input" placeholder="e.g. Q4 Underwriting Package">
                </div>
                
                <div class="calc-group">
                    <label class="calc-label">Select Attachments to Include</label>
                    <div class="files-selector">
                        ${fileChipsHTML}
                    </div>
                </div>
                
                <div class="transfer-grid-options">
                    <div class="calc-group">
                        <label class="calc-label">Security Passcode (Optional)</label>
                        <input type="text" id="tx_pass" class="calc-input" placeholder="No password protection">
                    </div>
                    <div class="calc-group">
                        <label class="calc-label">Expiration Limit</label>
                        <select id="tx_expiry" class="calc-input" style="background: var(--surface-card); cursor: pointer;">
                            <option value="1">24 Hours (Tomorrow)</option>
                            <option value="7" selected>7 Days</option>
                            <option value="30">30 Days</option>
                            <option value="365">1 Year</option>
                        </select>
                    </div>
                </div>
                
                <div class="calc-group" style="margin-bottom: 25px;">
                    <div class="toggle-container ${allowDownloadState ? 'active' : ''}" onclick="toggleDownloadPermissionCheckbox()">
                        <div class="toggle-box">${allowDownloadState ? '✔' : ''}</div>
                        <div>
                            <span style="display:block; font-weight:800; text-transform:uppercase; font-size:13px;">Allow Attachment Downloads</span>
                            <span style="display:block; font-size:11px; color: var(--text-muted);">If unchecked, users can only preview files in secure cloud environment.</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn-action-brutal" onclick="createTransfer()">
                    Generate Secure Link
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
            </div>
            
            <!-- List View -->
            <div>
                <div class="section-title">🔒 Active Share Link Inventory (${data.length})</div>
                <div class="active-transfers-list">
                    ${transfersHTML.length > 0 ? transfersHTML : '<div style="text-align:center; padding: 30px; border: var(--border-width) dashed #fff; color: var(--text-muted); font-weight: 700;">NO ACTIVE TRANSFERS. CREATE ONE ABOVE.</div>'}
                </div>
            </div>
        </div>
    `;
}

// Toggle attachment addition
window.toggleFileSelection = function (filename) {
    const index = selectedFiles.indexOf(filename);
    if (index > -1) {
        selectedFiles.splice(index, 1);
    } else {
        selectedFiles.push(filename);
    }
    const calcBody = document.getElementById("calcBody");
    renderTransfersInterface(calcBody);
};

// Toggle download checkbox
window.toggleDownloadPermissionCheckbox = function () {
    allowDownloadState = !allowDownloadState;
    const calcBody = document.getElementById("calcBody");
    renderTransfersInterface(calcBody);
};

// Create new transfer block
window.createTransfer = function () {
    const nameInput = document.getElementById("tx_name");
    const name = nameInput.value.trim() || "Unnamed Transfer Bundle";
    const password = document.getElementById("tx_pass").value.trim();
    const expiryDays = parseInt(document.getElementById("tx_expiry").value) || 7;

    if (selectedFiles.length === 0) {
        showToast("Error: Select at least 1 file.");
        return;
    }

    // Calculate dynamic calendar date based on expiry value
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + expiryDays);
    const dateString = expDate.toISOString().split("T")[0];

    const newTx = {
        id: "tx-" + Math.floor(1000 + Math.random() * 9000),
        name: name,
        files: [...selectedFiles],
        expires: dateString,
        password: password,
        allowDownload: allowDownloadState,
        downloads: 0,
        status: "Active"
    };

    const current = JSON.parse(localStorage.getItem("secure_transfers")) || [];
    current.unshift(newTx);
    localStorage.setItem("secure_transfers", JSON.stringify(current));

    // Reset inputs
    selectedFiles = ["pitch_deck.pdf", "financial_projections.xlsx"];
    allowDownloadState = true;

    // Rerender
    const calcBody = document.getElementById("calcBody");
    renderTransfersInterface(calcBody);

    showToast("Link Generated & Copy Ready!");
};

// Toggle individual active row download rights
window.toggleTxDownload = function (id) {
    const data = JSON.parse(localStorage.getItem("secure_transfers")) || [];
    const index = data.findIndex(tx => tx.id === id);
    if (index > -1) {
        data[index].allowDownload = !data[index].allowDownload;
        localStorage.setItem("secure_transfers", JSON.stringify(data));
        const calcBody = document.getElementById("calcBody");
        renderTransfersInterface(calcBody);
        showToast(`Download permission updated.`);
    }
};

// Revoke/Delete link configuration
window.deleteTransfer = function (id) {
    let data = JSON.parse(localStorage.getItem("secure_transfers")) || [];
    data = data.filter(tx => tx.id !== id);
    localStorage.setItem("secure_transfers", JSON.stringify(data));
    const calcBody = document.getElementById("calcBody");
    renderTransfersInterface(calcBody);
    showToast("Transfer Link Revoked Instantly.");
};

// Copy mock secure link
window.copyTransferLink = function (id) {
    const mockUrl = `https://utility.fintech/share/${id}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
        showToast(`Copied: ${mockUrl}`);
    }).catch(() => {
        // Fallback if browser block
        showToast("Link Copied to Clipboard!");
    });
};

// Toast triggers
function showToast(message) {
    let toast = document.getElementById("brutalToastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "brutalToastNotification";
        toast.className = "brutal-toast";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}