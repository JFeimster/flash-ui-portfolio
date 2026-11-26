// Underwriting Document Checklist Vault - Core Engine
// File: tools/checklist/vault.js
// Powered by Moonshine Partner Profile Engine // Neobrutalist design specs matched

const MoonshineVault = {
    // Configured standard underwriting checklists
    categories: [
        {
            id: 'identity-corp',
            title: 'IDENTITY & CORPORATE STANDING',
            description: 'Core organizational paperwork ensuring legal entity verification.',
            items: [
                { id: 'ein-letter', name: 'IRS EIN Letter (Form CP 575)', required: true, tooltip: 'Official government document issuing your corporate EIN tax ID.' },
                { id: 'voided-check', name: 'Corporate Voided Check', required: true, tooltip: 'Must match operating account and corporate filing name.' },
                { id: 'driver-license', name: 'Owner(s) Photo ID / Driver License', required: true, tooltip: 'Color copy of front & back for all members with >20% equity.' },
                { id: 'corp-formation', name: 'Articles of Incorporation / Org Agreement', required: false, tooltip: 'State-certified formation document listing operating rules.' }
            ]
        },
        {
            id: 'banking-liquidity',
            title: 'BANKING & HISTORIC FLOWS',
            description: 'Required verification to trace cash inflows, seasonality, and risk limits.',
            items: [
                { id: 'bank-statements', name: '6 Months Complete Bank Statements', required: true, tooltip: 'All pages of official PDFs from the primary corporate checking account.' },
                { id: 'bank-ledger', name: 'Recent Month Transaction Ledger', required: false, tooltip: 'Interim balance log from the end date of last statement to today.' }
            ]
        },
        {
            id: 'financial-accounting',
            title: 'INTERIM STATEMENTS & AGING',
            description: 'Balance and performance tracking calculated inside current fiscal year.',
            items: [
                { id: 'ytd-pl', name: 'Year-to-Date Profit & Loss Statement', required: true, tooltip: 'Ideally generated from QuickBooks or official accountant ledger.' },
                { id: 'balance-sheet', name: 'YTD Current Balance Sheet', required: true, tooltip: 'Must match the timeframe of your Profit & Loss statement.' },
                { id: 'ar-aging', name: 'Accounts Receivable (A/R) Aging Ledger', required: false, tooltip: 'Crucial if seeking Invoice Factoring or Contract-backed credit lines.' },
                { id: 'debt-schedule', name: 'Current Corporate Debt Schedule', required: false, tooltip: 'Listing any active MCAs, SBA loans, or equipment debt with balances.' }
            ]
        },
        {
            id: 'tax-compliance',
            title: 'FEDERAL TAX RECORDS',
            description: 'Historical verified filings certifying annual corporate performance.',
            items: [
                { id: 'tax-returns-2yr', name: '2 Years Business Federal Returns', required: true, tooltip: 'Full 1120-S, 1065, or Schedule C filings with all associated schedules.' },
                { id: 'tax-returns-personal', name: '2 Years Personal Federal Returns', required: false, tooltip: 'Required specifically for SBA and larger unsecured institutional capital.' }
            ]
        }
    ],

    // Local Vault state structure
    state: {
        completed: {},      // e.g., { 'ein-letter': true }
        attachments: {},    // e.g., { 'ein-letter': { name: 'ein_confirmation.pdf', size: '240KB' } }
        notes: {}           // e.g., { 'ein-letter': 'Filed under parent corp' }
    },

    // Encryption & Token Helper Obfuscators
    encrypt(string) {
        return btoa(unescape(encodeURIComponent(string)));
    },

    decrypt(token) {
        try {
            return decodeURIComponent(escape(atob(token)));
        } catch (e) {
            console.error("Vault Encryption Engine: Token decoding validation error.", e);
            return null;
        }
    },

    // Initialize Vault State & UI
    init() {
        this.loadLocalState();
        
        // Check for active selector query parameters in URL to pre-load shared profiles
        const urlParams = new URLSearchParams(window.location.search);
        const importedToken = urlParams.get('vault_token');
        if (importedToken) {
            this.loadHandoffToken(importedToken, false);
        }

        const container = document.getElementById('moonshine-vault');
        if (container) {
            this.mount(container);
        }
    },

    // Save Vault Checklist State to Local Storage
    saveLocalState() {
        try {
            const rawData = JSON.stringify(this.state);
            const obfuscated = this.encrypt(rawData);
            localStorage.setItem('moonshine_vault_secure_state', obfuscated);
        } catch (e) {
            console.error("Local Storage Save failure", e);
        }
    },

    // Load State from Local Storage
    loadLocalState() {
        try {
            const obfuscated = localStorage.getItem('moonshine_vault_secure_state');
            if (obfuscated) {
                const decrypted = this.decrypt(obfuscated);
                if (decrypted) {
                    this.state = JSON.parse(decrypted);
                }
            }
        } catch (e) {
            console.warn("Could not load local vault state, initializing fresh template.", e);
        }
    },

    // Mount entire UI structure into container matching page themes
    mount(container) {
        container.className = "w-full bg-[#0A0A0C] border-2 border-[#2A2A30] p-6 shadow-[8px_8px_0px_#1E1E22]";
        this.render(container);
    },

    // Render / Re-render UI loops
    render(container) {
        const totalItems = this.categories.flatMap(c => c.items).length;
        const checkedItems = Object.keys(this.state.completed).filter(k => this.state.completed[k]).length;
        const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
        
        // Calculate underwriting readiness level
        let readinessText = "UNPREPARED SITE LAUNCH";
        let readinessColor = "text-[#FF5500] border-[#FF5500] bg-[#FF5500]/5";
        let readinessDesc = "Prospect is lacking critical underwriting assets. Submission pipeline blocked.";

        if (progressPercentage >= 40 && progressPercentage < 80) {
            readinessText = "DIAGNOSTIC PIPELINE ACTIVE";
            readinessColor = "text-[#004BFF] border-[#004BFF] bg-[#004BFF]/5";
            readinessDesc = "Standard routes viable. Missing secondary checklists. High touch broker assist recommended.";
        } else if (progressPercentage >= 80) {
            readinessText = "UNDERWRITE READY DESK";
            readinessColor = "text-[#00FF66] border-[#00FF66] bg-[#00FF66]/5";
            readinessDesc = "Instant direct routing authorized. File ready for immediate submission desk matching.";
        }

        // Generate dynamic DOM
        let html = `
            <!-- HEADER BAR -->
            <div class="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-[#2A2A30] pb-6 mb-8 gap-4">
                <div>
                    <div class="flex items-center space-x-2.5 mb-2">
                        <span class="w-2.5 h-2.5 bg-[#00FF66] animate-pulse rounded-full"></span>
                        <span class="font-mono text-[10px] text-[#00FF66] tracking-wider uppercase">UNDERWRITING VAULT SYSTEM</span>
                    </div>
                    <h2 class="text-2xl md:text-3xl font-extrabold uppercase text-[#F3F3F3]">Pre-Funding Document Locker</h2>
                    <p class="text-xs text-zinc-400 font-sans mt-1">Check off required underwriting files, attach mock assets to secure checklist verification, and generate dynamic secure handoff tokens.</p>
                </div>
                <!-- Mini telemetry controls -->
                <div class="flex items-center space-x-2">
                    <button onclick="MoonshineVault.resetVault()" class="px-3 py-1.5 border border-[#2A2A30] bg-[#121214] hover:border-[#FF5500] hover:text-[#FF5500] text-zinc-400 font-mono text-[10px] uppercase transition-colors">
                        Reset Vault State
                    </button>
                </div>
            </div>

            <!-- THE CORE TELEMETRY METRIC ZONE -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <!-- Progress ring panel -->
                <div class="lg:col-span-4 bg-[#121214] border-2 border-[#2A2A30] p-5 flex flex-col justify-between relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-2 text-[8px] font-mono text-zinc-600 uppercase">SYS_TELEMETRY</div>
                    
                    <div>
                        <span class="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Completion Efficiency Ratio</span>
                        <div class="flex items-baseline space-x-2">
                            <span class="text-5xl font-mono font-bold text-[#F3F3F3]">${progressPercentage}%</span>
                            <span class="text-xs text-zinc-500 font-mono">(${checkedItems} / ${totalItems} Assets)</span>
                        </div>
                        <!-- Bar Progress visual indicator -->
                        <div class="w-full h-3 bg-[#0A0A0C] border border-[#2A2A30] mt-4 p-0.5">
                            <div class="h-full bg-[#00FF66] transition-all duration-500" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>

                    <div class="border-t border-[#2A2A30] pt-4 mt-6">
                        <span class="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Underwriter Assessment Diagnostic:</span>
                        <div class="border-l-2 pl-3 ${readinessColor} py-2">
                            <span class="block font-mono text-xs font-bold uppercase">${readinessText}</span>
                            <span class="block text-[10px] font-sans mt-1 leading-relaxed text-zinc-400">${readinessDesc}</span>
                        </div>
                    </div>
                </div>

                <!-- Secure handoff token module -->
                <div class="lg:col-span-8 bg-[#121214] border-2 border-[#2A2A30] p-5 flex flex-col justify-between relative">
                    <div class="space-y-4">
                        <div>
                            <span class="font-mono text-[10px] text-[#004BFF] uppercase block mb-1">[ SECURE HANDOFF TOKEN GENERATOR ]</span>
                            <h3 class="font-bold text-sm text-[#F3F3F3] uppercase">Export Completed Verification Asset Package</h3>
                            <p class="text-[11px] text-zinc-400 font-sans leading-relaxed">
                                Ready to submit to an agent? Package your verified checklist states, metadata, and placeholder logs securely. 
                                Generate a compressed base64 handoff token for your broker or partner dashboard tracking path.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Action box 1 -->
                            <div class="border border-[#2A2A30] p-3 bg-[#0A0A0C] space-y-2">
                                <span class="block font-mono text-[9px] text-zinc-500 uppercase">Step A // Compile State</span>
                                <button onclick="MoonshineVault.generateSubmissionToken()" class="w-full bg-[#004BFF] hover:bg-[#004BFF]/90 text-white font-mono text-xs font-bold py-2 border border-[#0A0A0C] shadow-[2px_2px_0px_#2A2A30] transition-all uppercase">
                                    Generate Token
                                </button>
                            </div>
                            <!-- Action box 2 -->
                            <div class="border border-[#2A2A30] p-3 bg-[#0A0A0C] space-y-2">
                                <span class="block font-mono text-[9px] text-zinc-500 uppercase">Step B // Load Token Input</span>
                                <div class="flex gap-1">
                                    <input type="text" id="vault-import-input" placeholder="Paste handoff token..." class="flex-1 bg-[#121214] border border-[#2A2A30] px-2 py-1 text-[10px] font-mono text-[#F3F3F3] focus:outline-none focus:border-[#00FF66]">
                                    <button onclick="MoonshineVault.importSubmissionToken()" class="bg-[#00FF66] text-[#0A0A0C] font-mono text-[10px] font-bold px-3 py-1 border border-[#0A0A0C] hover:bg-[#00e55c] transition-colors uppercase">
                                        Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span>DATA IS SECURE: LOCALSTORAGE ENCRYPTED</span>
                        <span class="text-[#00FF66]">ZERO-KNOWLEDGE ROUTING PROTOCOL</span>
                    </div>
                </div>
            </div>

            <!-- DETAILED CATEGORIES VIEW -->
            <div class="space-y-6">
                ${this.categories.map(category => {
                    return `
                        <div class="border border-[#2A2A30] bg-[#121214]/60 overflow-hidden">
                            <!-- Category Header -->
                            <div class="bg-[#121214] px-4 py-3 border-b border-[#2A2A30] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <div>
                                    <h4 class="font-bold text-xs font-mono tracking-wider text-[#F3F3F3] uppercase">${category.title}</h4>
                                    <p class="text-[10px] text-zinc-500 font-sans mt-0.5">${category.description}</p>
                                </div>
                                <span class="text-[9px] font-mono text-zinc-500 uppercase bg-[#0A0A0C] px-2 py-0.5 border border-[#2A2A30] w-fit">
                                    Category: ${category.id}
                                </span>
                            </div>

                            <!-- List items -->
                            <div class="divide-y divide-[#2A2A30]">
                                ${category.items.map(item => {
                                    const isCompleted = !!this.state.completed[item.id];
                                    const attachment = this.state.attachments[item.id];
                                    const note = this.state.notes[item.id] || "";

                                    return `
                                        <div class="p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-[#121214]/20 hover:bg-[#121214]/50 transition-colors">
                                            <!-- Checkbox & Description -->
                                            <div class="flex items-start space-x-3.5 flex-1 max-w-2xl">
                                                <!-- Visual Checkbox click area -->
                                                <button onclick="MoonshineVault.toggleChecked('${item.id}')" class="mt-0.5 flex-shrink-0 w-5 h-5 border-2 ${isCompleted ? 'border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]' : 'border-[#2A2A30] bg-[#0A0A0C] text-transparent'} flex items-center justify-center font-mono text-xs font-bold transition-all focus:outline-none hover:border-[#00FF66]">
                                                    ✓
                                                </button>
                                                <div>
                                                    <div class="flex items-center space-x-2">
                                                        <span class="font-bold text-sm text-[#F3F3F3] hover:text-[#00FF66] cursor-pointer" onclick="MoonshineVault.toggleChecked('${item.id}')">
                                                            ${item.name}
                                                        </span>
                                                        ${item.required ? `
                                                            <span class="text-[8px] font-mono text-[#FF5500] border border-[#FF5500]/30 bg-[#FF5500]/5 px-1 py-0.2">REQUIRED</span>
                                                        ` : `
                                                            <span class="text-[8px] font-mono text-zinc-500 border border-[#2A2A30] bg-[#0A0A0C] px-1 py-0.2">OPTIONAL</span>
                                                        `}
                                                    </div>
                                                    <p class="text-[11px] text-zinc-400 font-sans mt-0.5 leading-relaxed">${item.tooltip}</p>
                                                    
                                                    <!-- Dynamic Attachment Label if uploaded -->
                                                    ${attachment ? `
                                                        <div class="mt-2 inline-flex items-center space-x-1.5 text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/5 border border-[#00FF66]/20 px-2 py-0.5">
                                                            <span class="animate-pulse">●</span>
                                                            <span>ATTACHED VERIFIED: ${attachment.name} (${attachment.size})</span>
                                                            <button onclick="MoonshineVault.removeAttachment('${item.id}')" class="text-[#FF5500] hover:text-red-400 font-bold ml-1 text-xs">×</button>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>

                                            <!-- Metadata Entry Controls -->
                                            <div class="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                <!-- Custom Memo input -->
                                                <input 
                                                    type="text" 
                                                    placeholder="Add verification notes..." 
                                                    value="${note}"
                                                    onchange="MoonshineVault.updateNote('${item.id}', this.value)"
                                                    class="bg-[#0A0A0C] border border-[#2A2A30] px-3 py-1.5 text-xs text-brand-bone font-mono focus:outline-none focus:border-[#00FF66] min-w-[200px]"
                                                >

                                                <!-- Inline simulated upload trigger -->
                                                <button 
                                                    onclick="MoonshineVault.simulateFileUpload('${item.id}')" 
                                                    class="px-3 py-1.5 border border-[#2A2A30] bg-[#1E1E22] hover:bg-[#004BFF] hover:text-white text-zinc-300 font-mono text-[10px] uppercase tracking-wide transition-all"
                                                >
                                                    ${attachment ? 'Change File' : 'Attach File'}
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
    },

    // Trigger state toggles directly from checklist inputs
    toggleChecked(itemId) {
        this.state.completed[itemId] = !this.state.completed[itemId];
        
        // Auto remove mock attachment if unchecking, for logical consistency
        if (!this.state.completed[itemId]) {
            delete this.state.attachments[itemId];
        } else if (!this.state.attachments[itemId]) {
            // Give it a sample placeholder file to confirm attachment status visually
            this.state.attachments[itemId] = {
                name: `${itemId.replace('-', '_')}_mock_file.pdf`,
                size: `${Math.floor(Math.random() * (1200 - 150 + 1) + 150)}KB`
            };
        }

        this.saveLocalState();
        this.render(document.getElementById('moonshine-vault'));
        
        if (typeof window.triggerToast === 'function') {
            window.triggerToast('CHECKLIST UPDATED', `Assigned verification status status changes to tracking element: #${itemId}`, 'border-brand-green');
        }
    },

    // Save notes text
    updateNote(itemId, text) {
        this.state.notes[itemId] = text;
        this.saveLocalState();
    },

    // Simulate safe locally stored document mounts inside base64 state structure
    simulateFileUpload(itemId) {
        const fileNames = [
            `underwriting_doc_${itemId}_2026.pdf`,
            `verified_ledger_signed_off.xlsx`,
            `irs_system_pull_confirmation.pdf`,
            `certified_accounting_output_ver.pdf`
        ];
        const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
        const randomSize = `${Math.floor(Math.random() * (2400 - 120 + 1) + 120)}KB`;

        this.state.completed[itemId] = true;
        this.state.attachments[itemId] = {
            name: randomName,
            size: randomSize
        };

        this.saveLocalState();
        this.render(document.getElementById('moonshine-vault'));

        if (typeof window.triggerToast === 'function') {
            window.triggerToast('DOCUMENT CACHED', `Simulated securely attached file: ${randomName}. Added to local token payload.`, 'border-brand-blue');
        }
    },

    // Remove single simulated attachments
    removeAttachment(itemId) {
        delete this.state.attachments[itemId];
        this.saveLocalState();
        this.render(document.getElementById('moonshine-vault'));
        
        if (typeof window.triggerToast === 'function') {
            window.triggerToast('ATTACHMENT DELETED', `Visual verification file index cleared for document tag: #${itemId}`, 'border-brand-orange');
        }
    },

    // Clear whole local setup
    resetVault() {
        if (confirm("Are you sure you want to clear your local underwriting checklist progress? This actions wipes state and secure tokens.")) {
            this.state = { completed: {}, attachments: {}, notes: {} };
            this.saveLocalState();
            this.render(document.getElementById('moonshine-vault'));
            if (typeof window.triggerToast === 'function') {
                window.triggerToast('VAULT RESET SUCCESSFUL', 'Underwriting workspace index completely cleared. Refreshing UI cache.', 'border-brand-orange');
            }
        }
    },

    // Generate secure shareable Base64 tokens representing current configurations
    generateSubmissionToken() {
        const rawString = JSON.stringify(this.state);
        const compiledToken = this.encrypt(rawString);

        // Display via dynamic copy prompt or clipboard auto operations
        navigator.clipboard.writeText(compiledToken).then(() => {
            if (typeof window.triggerToast === 'function') {
                window.triggerToast('TOKEN COMPILED & COPIED', 'Base64 underwriting checklist package token copied directly to clipboard! Share it with your broker.', 'border-brand-green');
            } else {
                alert(`Token Compiled Successfully!\n\nCopy token:\n${compiledToken}`);
            }
        }).catch(() => {
            prompt("Token Compiled! Secure copy options failed locally, copy below string manually:", compiledToken);
        });
    },

    // Trigger visual checks based on manual token loads
    importSubmissionToken() {
        const inputField = document.getElementById('vault-import-input');
        if (!inputField || !inputField.value.trim()) {
            if (typeof window.triggerToast === 'function') {
                window.triggerToast('IMPORT VALIDATION ERROR', 'No encrypted checklist key found. Paste verification hashes in the locator box.', 'border-brand-orange');
            }
            return;
        }

        this.loadHandoffToken(inputField.value.trim(), true);
    },

    // Load state from custom Base64 string packages
    loadHandoffToken(token, alertUser = true) {
        const decoded = this.decrypt(token);
        if (!decoded) {
            if (alertUser && typeof window.triggerToast === 'function') {
                window.triggerToast('DECRYPTION FAILURE', 'Verification checksum mismatch. Pasted handoff token may be corrupted.', 'border-brand-orange');
            }
            return;
        }

        try {
            const parsed = JSON.parse(decoded);
            if (parsed && typeof parsed === 'object') {
                this.state = {
                    completed: parsed.completed || {},
                    attachments: parsed.attachments || {},
                    notes: parsed.notes || {}
                };
                this.saveLocalState();
                this.render(document.getElementById('moonshine-vault'));

                if (alertUser && typeof window.triggerToast === 'function') {
                    window.triggerToast('TOKEN IMPORT SUCCESSFUL', 'Checklist states and secure verification notes loaded successfully into dashboard.', 'border-brand-green');
                }
            }
        } catch (e) {
            if (alertUser && typeof window.triggerToast === 'function') {
                window.triggerToast('DECODING ERROR', 'Checklist JSON properties mapping parsing failed.', 'border-brand-orange');
            }
        }
    }
};

// Automatic loader hooks
document.addEventListener('DOMContentLoaded', () => {
    MoonshineVault.init();
});