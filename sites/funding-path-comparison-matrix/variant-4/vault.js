const style = document.createElement('style');
style.textContent = `
    @keyframes scanner {
        0% { transform: translateY(-100%); }
        50% { transform: translateY(100%); }
        100% { transform: translateY(-100%); }
    }
    .cyber-scanner::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 4px;
        background: #39ff14;
        box-shadow: 0 0 12px #39ff14, 0 0 20px #39ff14;
        animation: scanner 4s linear infinite;
        pointer-events: none;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    const parentContainer = document.querySelector('.max-w-7xl');
    if (!parentContainer) return;

    // Create the Document Vault section
    const vaultSection = document.createElement('div');
    vaultSection.id = 'prequal-vault-hub';
    vaultSection.className = 'border-4 border-black bg-zinc-950 p-6 md:p-8 space-y-8 relative overflow-hidden shadow-brutal-yellow mt-12';
    
    // Internal state
    let uploadedDocs = [
        { id: '1', name: 'Corporate Pitch Deck v2.4.pdf', type: 'deck', size: '4.2 MB', verified: true, date: 'Auto-Loaded' }
    ];

    const docTypes = {
        api: { label: 'Stripe/Plaid Live API Integration', unlocks: 'Path A (RBF)', desc: 'Direct ledger telemetry synchronization.' },
        qofe: { label: 'Quality of Earnings (QofE) Report', unlocks: 'Path B (Venture Debt)', desc: 'Required for non-dilutive high debt structures.' },
        cap: { label: 'Equity Cap Table Matrix', unlocks: 'Path B (Venture Debt)', desc: 'Validates existing security parameters.' },
        tax: { label: '3-Year Federal Corporate Tax Returns', unlocks: 'Path C (SBA Term)', desc: 'Essential federal compliance paperwork.' }
    };

    // Render logic
    function render() {
        const hasAPI = uploadedDocs.some(d => d.type === 'api');
        const hasQofE = uploadedDocs.some(d => d.type === 'qofe');
        const hasCap = uploadedDocs.some(d => d.type === 'cap');
        const hasTax = uploadedDocs.some(d => d.type === 'tax');

        const pathAUnlocked = hasAPI;
        const pathBUnlocked = hasQofE && hasCap;
        const pathCUnlocked = hasTax;

        // Custom interaction linked with global buttons if they are active
        const btnA = document.getElementById('btn-path-a');
        const btnB = document.getElementById('btn-path-b');
        const btnC = document.getElementById('btn-path-c');

        if (btnA) {
            if (!btnA.disabled) {
                btnA.style.border = pathAUnlocked ? '3px solid #39ff14' : '2px solid black';
                btnA.innerHTML = pathAUnlocked ? 'INITIALIZE RBF (PRE-QUALIFIED ✓)' : 'INITIALIZE RBF';
            }
        }
        if (btnB) {
            if (!btnB.disabled) {
                btnB.style.border = pathBUnlocked ? '3px solid #00f0ff' : '2px solid black';
                btnB.innerHTML = pathBUnlocked ? 'INITIALIZE DEBT (PRE-QUALIFIED ✓)' : 'INITIALIZE DEBT';
            }
        }
        if (btnC) {
            if (!btnC.disabled) {
                btnC.style.border = pathCUnlocked ? '3px solid #fffb00' : '2px solid #52525b';
                btnC.innerHTML = pathCUnlocked ? 'EXECUTE SBA AUDIT (PRE-QUALIFIED ✓)' : 'EXECUTE SBA AUDIT';
            }
        }

        vaultSection.innerHTML = `
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b-4 border-black">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2">
                        <span class="px-2 py-0.5 text-[10px] font-black bg-neoYellow text-black border-2 border-black uppercase tracking-wider shadow-brutal-white-sm">
                            GATEWAY SECURE
                        </span>
                        <span class="text-xs font-mono font-bold text-neoYellow">PRE-QUALIFICATION DATA ROOM</span>
                    </div>
                    <h2 class="text-3xl font-black text-white uppercase tracking-tight">DOCUMENT VAULT & HUB</h2>
                    <p class="text-xs text-zinc-400 font-semibold max-w-xl">
                        Upload official financial telemetry metrics to satisfy compliance thresholds. Unlocking a path authorizes immediate route execution.
                    </p>
                </div>
                <div class="bg-black border-2 border-zinc-800 p-3 flex gap-6 text-center font-mono">
                    <div>
                        <span class="block text-[10px] text-zinc-500 font-black">SECURED</span>
                        <span class="text-xl font-black text-neoLime">${uploadedDocs.length}</span>
                    </div>
                    <div class="border-l border-zinc-800 pl-6">
                        <span class="block text-[10px] text-zinc-500 font-black">UNLOCKED ROUTES</span>
                        <span class="text-xl font-black text-neoTeal">${(pathAUnlocked?1:0) + (pathBUnlocked?1:0) + (pathCUnlocked?1:0)}/3</span>
                    </div>
                </div>
            </div>

            <!-- Main Interactive Columns -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <!-- Left: Interactive Upload Form & Dynamic List -->
                <div class="lg:col-span-7 space-y-6">
                    <div class="bg-brutalCard border-4 border-black p-5 space-y-4 shadow-brutal-pink relative">
                        <div class="absolute top-0 right-0 bg-neoMagenta text-black text-[9px] font-black px-2.5 py-0.5 border-b-2 border-l-2 border-black uppercase">
                            FILE UPLOAD SYSTEM
                        </div>
                        <h3 class="text-sm font-black text-white uppercase tracking-wider">SECURE FILE INGESTION</h3>
                        
                        <form id="vault-upload-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Document Template</label>
                                    <select id="upload-type" class="w-full bg-black text-white border-2 border-black font-mono text-xs p-2.5 outline-none focus:border-neoMagenta">
                                        <option value="api">Stripe/Plaid API Integration Token</option>
                                        <option value="qofe">Quality of Earnings (QofE) Report</option>
                                        <option value="cap">Equity Cap Table Matrix</option>
                                        <option value="tax">3-Year Corporate Tax Returns</option>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">File Label Name</label>
                                    <input type="text" id="upload-name" placeholder="e.g. Stripe_Token_2024.cert" class="w-full bg-black text-white border-2 border-black font-mono text-xs p-2.5 outline-none focus:border-neoMagenta placeholder-zinc-700" required>
                                </div>
                            </div>

                            <!-- Drag n Drop Zone Trigger -->
                            <div class="border-2 border-dashed border-zinc-700 bg-black/50 p-6 text-center cursor-pointer hover:border-neoMagenta transition-colors relative cyber-scanner" id="drop-trigger">
                                <svg class="w-8 h-8 text-neoMagenta mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span class="text-xs font-black uppercase text-zinc-300 block">Deploy telemetric document structure</span>
                                <span class="text-[10px] text-zinc-500 font-mono">Accepts PDF, JSON, XLSX metrics (Simulated)</span>
                            </div>

                            <button type="submit" class="w-full py-3 px-4 bg-neoMagenta hover:bg-black text-black hover:text-neoMagenta font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150">
                                UPLOAD & VERIFY COMPLIANCE PROTOCOL
                            </button>
                        </form>
                    </div>

                    <!-- Ingestion Inventory List -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-black text-zinc-400 uppercase tracking-widest font-mono">[ ACTIVE INGESTION INVENTORY ]</h4>
                        <div class="space-y-2" id="document-list-container">
                            ${uploadedDocs.map(doc => `
                                <div class="bg-zinc-900 border-2 border-black p-3.5 flex justify-between items-center gap-4 hover:border-zinc-700 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-black border border-zinc-800 text-neoLime text-xs font-mono font-black">
                                            ${doc.type ? doc.type.toUpperCase() : 'DOC'}
                                        </div>
                                        <div>
                                            <span class="text-xs font-black text-white block">${doc.name}</span>
                                            <span class="text-[10px] text-zinc-500 font-mono">${doc.size} | Status: <strong class="text-neoLime font-black">VERIFIED PROTOCOL</strong></span>
                                        </div>
                                    </div>
                                    <button data-id="${doc.id}" class="delete-doc-btn px-2.5 py-1 text-[10px] bg-zinc-800 hover:bg-neoMagenta text-zinc-400 hover:text-black font-black border border-black uppercase font-mono tracking-wider transition-colors">
                                        PURGE
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right: Route Lock/Unlock Status Board -->
                <div class="lg:col-span-5 space-y-6">
                    <div class="bg-black border-4 border-black p-5 space-y-6">
                        <h3 class="text-sm font-black text-white uppercase tracking-wider font-mono text-center border-b-2 border-zinc-900 pb-3">
                            COMPLIANCE PATH CHECKLIST
                        </h3>

                        <!-- Path A Qualification Tracker -->
                        <div class="p-4 border-2 ${pathAUnlocked ? 'border-neoLime bg-neoLime/5' : 'border-zinc-800 bg-zinc-900/40'} transition-all duration-300">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="text-sm font-black uppercase ${pathAUnlocked ? 'text-neoLime' : 'text-zinc-400'}">PATH A: SaaS Revenue-Based</h4>
                                    <p class="text-[10px] text-zinc-400 font-semibold">Requirement: Operational Live API</p>
                                </div>
                                <span class="px-2 py-0.5 text-[9px] font-mono font-black border ${pathAUnlocked ? 'bg-neoLime border-black text-black' : 'border-zinc-800 text-zinc-500'}">
                                    ${pathAUnlocked ? 'COMPLIANT' : 'LOCKED'}
                                </span>
                            </div>
                            <!-- Sub checklist items -->
                            <div class="space-y-1 text-xs font-mono">
                                <div class="flex items-center gap-2">
                                    <span class="${hasAPI ? 'text-neoLime' : 'text-zinc-600'}">${hasAPI ? '✓' : '✗'}</span>
                                    <span class="${hasAPI ? 'text-zinc-300 font-bold' : 'text-zinc-500'}">Stripe or Plaid live linkage API</span>
                                </div>
                            </div>
                        </div>

                        <!-- Path B Qualification Tracker -->
                        <div class="p-4 border-2 ${pathBUnlocked ? 'border-neoTeal bg-neoTeal/5' : 'border-zinc-800 bg-zinc-900/40'} transition-all duration-300">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="text-sm font-black uppercase ${pathBUnlocked ? 'text-neoTeal' : 'text-zinc-400'}">PATH B: Growth Venture Debt</h4>
                                    <p class="text-[10px] text-zinc-400 font-semibold">Requirements: QofE Audit & Cap Table</p>
                                </div>
                                <span class="px-2 py-0.5 text-[9px] font-mono font-black border ${pathBUnlocked ? 'bg-neoTeal border-black text-black' : 'border-zinc-800 text-zinc-500'}">
                                    ${pathBUnlocked ? 'COMPLIANT' : 'LOCKED'}
                                </span>
                            </div>
                            <div class="space-y-1 text-xs font-mono">
                                <div class="flex items-center gap-2">
                                    <span class="${hasQofE ? 'text-neoTeal' : 'text-zinc-600'}">${hasQofE ? '✓' : '✗'}</span>
                                    <span class="${hasQofE ? 'text-zinc-300 font-bold' : 'text-zinc-500'}">Quality of Earnings Report</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="${hasCap ? 'text-neoTeal' : 'text-zinc-600'}">${hasCap ? '✓' : '✗'}</span>
                                    <span class="${hasCap ? 'text-zinc-300 font-bold' : 'text-zinc-500'}">Equity Cap Table Matrix</span>
                                </div>
                            </div>
                        </div>

                        <!-- Path C Qualification Tracker -->
                        <div class="p-4 border-2 ${pathCUnlocked ? 'border-neoYellow bg-neoYellow/5' : 'border-zinc-800 bg-zinc-900/40'} transition-all duration-300">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="text-sm font-black uppercase ${pathCUnlocked ? 'text-neoYellow' : 'text-zinc-400'}">PATH C: SBA 7(a) Term</h4>
                                    <p class="text-[10px] text-zinc-400 font-semibold">Requirement: 3-Year Tax Returns</p>
                                </div>
                                <span class="px-2 py-0.5 text-[9px] font-mono font-black border ${pathCUnlocked ? 'bg-neoYellow border-black text-black' : 'border-zinc-800 text-zinc-500'}">
                                    ${pathCUnlocked ? 'COMPLIANT' : 'LOCKED'}
                                </span>
                            </div>
                            <div class="space-y-1 text-xs font-mono">
                                <div class="flex items-center gap-2">
                                    <span class="${hasTax ? 'text-neoYellow' : 'text-zinc-600'}">${hasTax ? '✓' : '✗'}</span>
                                    <span class="${hasTax ? 'text-zinc-300 font-bold' : 'text-zinc-500'}">3-Year Federal Tax Returns</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mini security notice -->
                        <div class="bg-zinc-900 border border-zinc-800 p-3 text-[10px] text-zinc-400 font-semibold font-mono space-y-1 text-center">
                            <span>🔓 ALL TELEMETRY TRANSMISSIONS END-TO-END AES-256 BIT ROTATED</span>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Attach event listeners after rendering
        setupFormListeners();
    }

    function setupFormListeners() {
        const form = document.getElementById('vault-upload-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const typeSelect = document.getElementById('upload-type');
                const nameInput = document.getElementById('upload-name');

                const typeValue = typeSelect.value;
                const nameValue = nameInput.value.trim();

                if (!nameValue) return;

                // Simulate uploading visual phase
                const dropTrigger = document.getElementById('drop-trigger');
                if (dropTrigger) {
                    dropTrigger.className = "border-2 border-dashed border-neoLime bg-neoLime/5 p-6 text-center cursor-pointer relative cyber-scanner";
                    dropTrigger.innerHTML = `
                        <div class="text-neoLime font-black text-xs font-mono tracking-widest animate-pulse">
                            PARSING DATA MATRIX & CALCULATING COVARIANCES...
                        </div>
                    `;
                }

                setTimeout(() => {
                    // Push to local array
                    const sizeOptions = ['2.8 MB', '1.4 MB', '6.5 MB', '12.1 MB'];
                    const randomSize = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
                    
                    uploadedDocs.push({
                        id: Date.now().toString(),
                        name: nameValue,
                        type: typeValue,
                        size: randomSize,
                        verified: true,
                        date: 'Just Now'
                    });

                    render();
                }, 1200);
            });
        }

        // Setup individual delete button triggers
        const deleteButtons = document.querySelectorAll('.delete-doc-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-id');
                uploadedDocs = uploadedDocs.filter(doc => doc.id !== targetId);
                render();
            });
        });

        // Trigger simulation upload click
        const dropTrigger = document.getElementById('drop-trigger');
        if (dropTrigger) {
            dropTrigger.addEventListener('click', () => {
                const typeSelect = document.getElementById('upload-type');
                const nameInput = document.getElementById('upload-name');
                const selectedText = typeSelect.options[typeSelect.selectedIndex].text;
                nameInput.value = selectedText.replace(/ /g, '_') + "_2024.dat";
            });
        }
    }

    // Insert Document Hub directly above the dynamic metric insights footer cards
    const insightsGrid = parentContainer.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-6');
    if (insightsGrid) {
        parentContainer.insertBefore(vaultSection, insightsGrid);
    } else {
        parentContainer.appendChild(vaultSection);
    }

    // Initial paint
    render();
});