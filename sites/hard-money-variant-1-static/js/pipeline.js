/**
 * Dynamic Edge | Creative Review & Approval Pipeline Engine
 * High-performance, interactive Kanban workspace for asset packages, contract decks & design revisions.
 */

(function () {
    // Pipeline Application State
    const pipelineState = {
        activeTab: 'directory', // 'directory' or 'pipeline'
        columns: [
            {
                id: 'pending-review',
                title: 'PENDING REVIEW',
                glowClass: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
                accentColor: '#f59e0b',
                badgeBg: 'bg-amber-500/10 text-amber-400'
            },
            {
                id: 'in-discussion',
                title: 'IN DISCUSSION',
                glowClass: 'border-cyber-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.05)]',
                accentColor: '#00f0ff',
                badgeBg: 'bg-cyber-accent/10 text-cyber-accent'
            },
            {
                id: 'revisions-requested',
                title: 'REVISIONS REQUESTED',
                glowClass: 'border-cyber-purple/30 shadow-[0_0_15px_rgba(189,0,255,0.05)]',
                accentColor: '#bd00ff',
                badgeBg: 'bg-cyber-purple/10 text-cyber-purple'
            },
            {
                id: 'approved',
                title: 'APPROVED & SEALED',
                glowClass: 'border-cyber-emerald/30 shadow-[0_0_15px_rgba(5,255,196,0.05)]',
                accentColor: '#05ffc4',
                badgeBg: 'bg-cyber-emerald/10 text-cyber-emerald'
            }
        ],
        cards: [
            {
                id: 'pkg-1',
                title: 'Premium LTV Presentation Deck',
                category: 'Design Revisions',
                urgency: 'HIGH',
                version: 'v2.4',
                reviewer: 'Lead Originator Alpha',
                checklist: [
                    { id: 'c1', text: 'Update interest schedule graph', done: true },
                    { id: 'c2', text: 'Align branding with Edge v2.9', done: false }
                ],
                attachments: [
                    { name: 'LTV_Presentation_v2.4.pdf', size: '14.2 MB', type: 'pdf' },
                    { name: 'Financial_Infographics.fig', size: '28.5 MB', type: 'figma' }
                ],
                history: [
                    { user: 'Sponsor Tech Lead', action: 'Uploaded new package', date: '2 hours ago' }
                ],
                columnId: 'pending-review'
            },
            {
                id: 'pkg-2',
                title: 'Sponsor Track Record Portfolio',
                category: 'Validation Pack',
                urgency: 'MEDIUM',
                version: 'v1.1',
                reviewer: 'Risk Compliance Node 2',
                checklist: [
                    { id: 'c3', text: 'Re-verify CA multifamily deeds', done: true },
                    { id: 'c4', text: 'Add liquid asset validations', done: true }
                ],
                attachments: [
                    { name: 'Sponsor_TrackRecord_v1.1.xlsx', size: '4.8 MB', type: 'sheet' },
                    { name: 'Sponsor_Verification_Notary.pdf', size: '2.1 MB', type: 'pdf' }
                ],
                history: [
                    { user: 'Risk Compliance Node 2', action: 'Requested review meeting', date: 'Yesterday' }
                ],
                columnId: 'in-discussion'
            },
            {
                id: 'pkg-3',
                title: 'Raw Land Phase-I Feasibility Deck',
                category: 'Environmental',
                urgency: 'CRITICAL',
                version: 'v3.0',
                reviewer: 'Site Compliance Board',
                checklist: [
                    { id: 'c5', text: 'Resolve water run-off notes', done: false },
                    { id: 'c6', text: 'Include soil testing signoff', done: false }
                ],
                attachments: [
                    { name: 'Environmental_Phase_I_Draft.pdf', size: '38.9 MB', type: 'pdf' }
                ],
                history: [
                    { user: 'Site Compliance Board', action: 'Marked revisions mandatory', date: '3 days ago' }
                ],
                columnId: 'revisions-requested'
            },
            {
                id: 'pkg-4',
                title: 'Apex Velocity Bridge Executed Memo',
                category: 'Contract Packs',
                urgency: 'LOW',
                version: 'v4.2-FINAL',
                reviewer: 'Senior Origination Team',
                checklist: [
                    { id: 'c7', text: 'Verify cross-collateral signatures', done: true },
                    { id: 'c8', text: 'Match final escrow funding routing', done: true }
                ],
                attachments: [
                    { name: 'Fully_Executed_Apex_Bridge_Signed.pdf', size: '8.4 MB', type: 'pdf' },
                    { name: 'Escrow_Routing_Instructions.pdf', size: '1.1 MB', type: 'pdf' }
                ],
                history: [
                    { user: 'Senior Origination Team', action: 'Electronically Sealed', date: '5 hours ago' }
                ],
                columnId: 'approved'
            }
        ],
        activeCardDetails: null,
        draggedCardId: null
    };

    // DOM Selection Helpers
    const getEl = (id) => document.getElementById(id);

    // Initializer
    function init() {
        injectNavigationLink();
        injectPipelineContainer();
        registerEventHandlers();
        updateTelemetryMetrics();
    }

    // Dynamic Navigation Injection
    function injectNavigationLink() {
        const topTelemetryBar = document.querySelector('.max-w-\\[1400px\\]\\.mx-auto\\.px-4\\.py-2');
        const telemetryRightContainer = document.querySelector('.flex.items-center.gap-4');
        
        if (telemetryRightContainer) {
            // Create navigation separator
            const separator = document.createElement('div');
            separator.className = 'h-4 w-px bg-cyber-border';
            
            // Create target button
            const pipelineToggleBtn = document.createElement('button');
            pipelineToggleBtn.id = 'togglePipelineBtn';
            pipelineToggleBtn.className = 'flex items-center gap-1.5 text-slate-400 hover:text-cyber-purple transition-colors duration-200 font-mono text-[11px] tracking-wider';
            pipelineToggleBtn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span>CREATIVE PIPELINE</span>
            `;
            
            pipelineToggleBtn.addEventListener('click', toggleWorkspaceView);
            telemetryRightContainer.insertBefore(separator, telemetryRightContainer.firstChild);
            telemetryRightContainer.insertBefore(pipelineToggleBtn, separator);
        }
    }

    // Dynamic Pipeline DOM Canvas Construction
    function injectPipelineContainer() {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        // Create main wrapper for creative review pipeline
        const pipelineWrapper = document.createElement('div');
        pipelineWrapper.id = 'pipelineWorkspace';
        pipelineWrapper.className = 'hidden transition-all duration-300';
        pipelineWrapper.innerHTML = `
            <!-- HEADER WORKSPACE BANNER -->
            <div class="mb-8 bg-gradient-to-r from-[#0e131f] to-slate-950 border border-cyber-border p-6 rounded-xl relative overflow-hidden edge-clip">
                <div class="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full filter blur-3xl pointer-events-none"></div>
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-purple/30 bg-cyber-purple/5 mb-3 text-xs font-mono text-cyber-purple uppercase tracking-widest">
                            <span class="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse"></span>
                            Review Engine Active v1.1
                        </div>
                        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                            Creative Review & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-pink-500">Approval Pipeline</span>
                        </h2>
                        <p class="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl font-light">
                            High-velocity asset lifecycle validation. Drag package bundles, update telemetry checklists, and initiate blockchain-grade cryptographic handshakes for finalized designs.
                        </p>
                    </div>

                    <div class="flex items-center gap-3 font-mono">
                        <button id="addNewPackageBtn" class="bg-cyber-purple hover:bg-purple-600 text-white px-4 py-2 text-xs font-bold uppercase transition-all duration-200 edge-clip flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Ingest Attachment Pack
                        </button>
                    </div>
                </div>
                
                <!-- Pipeline System Metrics Bar -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-cyber-border/40 font-mono text-xs">
                    <div class="bg-black/40 p-3 rounded border border-cyber-border/40">
                        <span class="text-slate-500 block text-[10px] uppercase">Review Speed Mean</span>
                        <span class="text-cyber-accent font-bold text-sm block mt-1">4.2 Hours</span>
                    </div>
                    <div class="bg-black/40 p-3 rounded border border-cyber-border/40">
                        <span class="text-slate-500 block text-[10px] uppercase">Sealed Approval Rate</span>
                        <span class="text-cyber-emerald font-bold text-sm block mt-1">94.8% Checked</span>
                    </div>
                    <div class="bg-black/40 p-3 rounded border border-cyber-border/40">
                        <span class="text-slate-500 block text-[10px] uppercase">Active Pipelines</span>
                        <span id="metricActiveCount" class="text-cyber-purple font-bold text-sm block mt-1">4 Bundles</span>
                    </div>
                    <div class="bg-black/40 p-3 rounded border border-cyber-border/40">
                        <span class="text-slate-500 block text-[10px] uppercase">Crypto Signed Keys</span>
                        <span class="text-slate-300 font-bold text-sm block mt-1">SECURE_ECDSA_256</span>
                    </div>
                </div>
            </div>

            <!-- KANBAN BOARD WRAPPER -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start" id="pipelineKanbanGrid">
                <!-- Columns dynamically rendered here -->
            </div>
        `;

        // Inject the Pipeline Workspace right below the Header / above Core Workspace
        mainElement.parentNode.insertBefore(pipelineWrapper, mainElement);

        // Render Initial Pipelines
        renderPipelineKanban();
    }

    // Toggle workspace visibility between Directory and Creative Pipeline
    function toggleWorkspaceView() {
        const directoryView = document.querySelector('main');
        const pipelineView = getEl('pipelineWorkspace');
        const toggleBtn = getEl('togglePipelineBtn');

        if (pipelineState.activeTab === 'directory') {
            pipelineState.activeTab = 'pipeline';
            directoryView.classList.add('hidden');
            pipelineView.classList.remove('hidden');
            toggleBtn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>LENDER DIRECTORY</span>
            `;
            toggleBtn.className = 'flex items-center gap-1.5 text-cyber-accent hover:text-cyan-300 transition-colors duration-200 font-mono text-[11px] tracking-wider';
        } else {
            pipelineState.activeTab = 'directory';
            directoryView.classList.remove('hidden');
            pipelineView.classList.add('hidden');
            toggleBtn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span>CREATIVE PIPELINE</span>
            `;
            toggleBtn.className = 'flex items-center gap-1.5 text-slate-400 hover:text-cyber-purple transition-colors duration-200 font-mono text-[11px] tracking-wider';
        }
    }

    // Main Kanban Rendering Method
    function renderPipelineKanban() {
        const kanbanGrid = getEl('pipelineKanbanGrid');
        if (!kanbanGrid) return;

        kanbanGrid.innerHTML = '';

        pipelineState.columns.forEach(col => {
            const colCards = pipelineState.cards.filter(c => c.columnId === col.id);
            
            const colElem = document.createElement('div');
            colElem.className = `bg-cyber-card border rounded-xl p-4 transition-all duration-300 flex flex-col min-h-[550px] ${col.glowClass}`;
            colElem.setAttribute('data-col-id', col.id);
            
            // Dragover hooks
            colElem.addEventListener('dragover', onDragOverColumn);
            colElem.addEventListener('dragleave', onDragLeaveColumn);
            colElem.addEventListener('drop', onDropOnColumn);

            colElem.innerHTML = `
                <!-- Column Header -->
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-cyber-border/40">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-3 inline-block" style="background-color: ${col.accentColor}"></span>
                        <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">${col.title}</h3>
                    </div>
                    <span class="${col.badgeBg} px-2 py-0.5 rounded text-[10px] font-mono font-bold">${colCards.length}</span>
                </div>

                <!-- Card List Holder -->
                <div class="flex-1 space-y-4" id="cards-container-${col.id}">
                    <!-- Rendered cards -->
                </div>
            `;

            kanbanGrid.appendChild(colElem);
            
            const cardContainer = getEl(`cards-container-${col.id}`);
            if (colCards.length === 0) {
                cardContainer.innerHTML = `
                    <div class="border border-dashed border-cyber-border/40 rounded-lg p-6 text-center text-slate-600 text-xs font-mono py-12">
                        NO ACTIVE PACKAGES
                    </div>
                `;
            } else {
                colCards.forEach(card => {
                    const cardElem = createCardDOM(card, col);
                    cardContainer.appendChild(cardElem);
                });
            }
        });
    }

    // HTML5 Card DOM Maker
    function createCardDOM(card, col) {
        const cardElem = document.createElement('div');
        cardElem.id = card.id;
        cardElem.className = 'bg-black/40 border border-cyber-border/60 hover:border-cyber-accent/60 p-4 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 relative group';
        cardElem.setAttribute('draggable', 'true');

        // Drag events
        cardElem.addEventListener('dragstart', (e) => onDragStart(e, card.id));
        cardElem.addEventListener('dragend', onDragEnd);

        // Urgency color assignment
        const urgencyColorMap = {
            'CRITICAL': 'text-red-500 bg-red-500/10 border-red-500/30',
            'HIGH': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
            'MEDIUM': 'text-cyber-accent bg-cyber-accent/10 border-cyber-accent/30',
            'LOW': 'text-slate-400 bg-slate-400/10 border-slate-400/30'
        };
        const urgencyClass = urgencyColorMap[card.urgency] || 'text-slate-400';

        // Checklist logic
        const completedChecks = card.checklist.filter(i => i.done).length;
        const totalChecks = card.checklist.length;
        const checkPercent = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

        cardElem.innerHTML = `
            <!-- Top Card Indicators -->
            <div class="flex items-center justify-between mb-2">
                <span class="text-[9px] font-mono px-2 py-0.5 rounded border ${urgencyClass}">${card.urgency} Priority</span>
                <span class="text-[9px] font-mono text-slate-500">${card.version}</span>
            </div>

            <!-- Title -->
            <h4 class="text-sm font-semibold text-slate-200 group-hover:text-cyber-accent transition-colors duration-150 mb-1 leading-snug">${card.title}</h4>
            <span class="text-[10px] font-mono text-cyber-purple uppercase block mb-3">${card.category}</span>

            <!-- Checklist Progress -->
            <div class="mb-4">
                <div class="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500">
                    <span>Handshake Protocols:</span>
                    <span>${completedChecks}/${totalChecks} (${checkPercent}%)</span>
                </div>
                <div class="w-full bg-cyber-border/40 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-cyber-purple to-cyber-accent h-full transition-all duration-300" style="width: ${checkPercent}%"></div>
                </div>
            </div>

            <!-- Attachments Segment -->
            <div class="space-y-1.5 mb-4 bg-black/50 p-2 rounded border border-cyber-border/30">
                <span class="text-[9px] font-mono text-slate-500 uppercase block mb-1">Encrypted Payloads (${card.attachments.length})</span>
                ${card.attachments.map(att => `
                    <div class="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                        <span class="truncate max-w-[150px] flex items-center gap-1">
                            <svg class="w-3 h-3 text-cyber-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            ${att.name}
                        </span>
                        <span class="text-[8px] text-slate-500">${att.size}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Footer: Reviewer & CTA -->
            <div class="flex items-center justify-between pt-2 border-t border-cyber-border/30">
                <div class="flex items-center gap-1">
                    <div class="w-4.5 h-4.5 rounded-full bg-cyber-border flex items-center justify-center text-[8px] font-bold text-cyber-accent border border-cyber-accent/20">
                        ${card.reviewer ? card.reviewer.charAt(0) : 'U'}
                    </div>
                    <span class="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">${card.reviewer || 'Unassigned'}</span>
                </div>

                <button class="view-details-btn text-[10px] font-mono text-cyber-purple hover:text-white flex items-center gap-0.5 transition-colors" data-card-id="${card.id}">
                    <span>Manage</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                </button>
            </div>
        `;

        // Interactive Button Event
        cardElem.querySelector('.view-details-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openCardManager(card.id);
        });

        return cardElem;
    }

    // HTML5 Drag & Drop Listeners
    function onDragStart(e, cardId) {
        pipelineState.draggedCardId = cardId;
        e.dataTransfer.setData('text/plain', cardId);
        e.dataTransfer.effectAllowed = 'move';
        
        // Add style to current dragged item
        setTimeout(() => {
            const el = getEl(cardId);
            if (el) el.classList.add('opacity-40', 'scale-95');
        }, 0);
    }

    function onDragEnd(e) {
        const el = getEl(pipelineState.draggedCardId);
        if (el) el.classList.remove('opacity-40', 'scale-95');
        pipelineState.draggedCardId = null;
    }

    function onDragOverColumn(e) {
        e.preventDefault();
        e.currentTarget.classList.add('bg-black/40', 'border-cyber-accent');
    }

    function onDragLeaveColumn(e) {
        e.currentTarget.classList.remove('bg-black/40', 'border-cyber-accent');
    }

    function onDropOnColumn(e) {
        e.preventDefault();
        const colElem = e.currentTarget;
        colElem.classList.remove('bg-black/40', 'border-cyber-accent');
        
        const targetColId = colElem.getAttribute('data-col-id');
        const cardId = e.dataTransfer.getData('text/plain') || pipelineState.draggedCardId;
        
        if (cardId && targetColId) {
            const cardObj = pipelineState.cards.find(c => c.id === cardId);
            if (cardObj && cardObj.columnId !== targetColId) {
                cardObj.columnId = targetColId;
                cardObj.history.unshift({
                    user: 'System Controller',
                    action: `Moved package to status: ${targetColId.toUpperCase().replace('-', ' ')}`,
                    date: 'Just now'
                });
                renderPipelineKanban();
                updateTelemetryMetrics();
                triggerHandshakeSyncFlash(targetColId);
            }
        }
    }

    // System Telemetry Metrics Syncing
    function updateTelemetryMetrics() {
        const activeCountElem = getEl('metricActiveCount');
        if (activeCountElem) {
            activeCountElem.innerText = `${pipelineState.cards.length} Bundle${pipelineState.cards.length !== 1 ? 's' : ''}`;
        }
    }

    // Flash/ping animation on columns during drop actions
    function triggerHandshakeSyncFlash(colId) {
        const targetCol = document.querySelector(`[data-col-id="${colId}"]`);
        if (targetCol) {
            targetCol.classList.add('ring-2', 'ring-cyber-emerald/50');
            setTimeout(() => {
                targetCol.classList.remove('ring-2', 'ring-cyber-emerald/50');
            }, 600);
        }
    }

    // CARD MANAGER MODAL DIALOG INJECTION
    function openCardManager(cardId) {
        const card = pipelineState.cards.find(c => c.id === cardId);
        if (!card) return;

        pipelineState.activeCardDetails = card;

        // Modal structural setup if it doesn't already exist on page
        let modal = getEl('pipelineManagerModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pipelineManagerModal';
            modal.className = 'fixed inset-0 bg-black/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-[#0e131f] border border-cyber-purple w-full max-w-2xl p-6 rounded-xl relative edge-clip-reverse">
                <div class="absolute top-0 right-12 w-24 h-1 bg-gradient-to-r from-cyber-purple to-cyber-accent"></div>
                
                <!-- Title Row -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="bg-cyber-purple/20 text-cyber-purple text-[9px] font-mono px-2 py-0.5 rounded border border-cyber-purple/40 font-bold uppercase">${card.category}</span>
                            <span class="text-xs font-mono text-slate-500">${card.version}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-100 uppercase tracking-tight">${card.title}</h3>
                        <p class="text-xs font-mono text-cyber-accent mt-0.5">Assigned Auditor: ${card.reviewer || 'Unassigned Node'}</p>
                    </div>
                    <button id="closeManagerModalBtn" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Main Layout Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    <!-- Left Side: Interactive Protocols/Checklist -->
                    <div class="space-y-4">
                        <div class="border-b border-cyber-border/40 pb-2">
                            <h4 class="text-xs font-mono text-slate-400 uppercase font-bold">Handshake Validation Checks</h4>
                        </div>
                        <div class="space-y-2 max-h-[160px] overflow-y-auto pr-1" id="modalChecklistHolder">
                            ${card.checklist.map((item, idx) => `
                                <label class="flex items-center justify-between p-2.5 bg-black/40 border border-cyber-border/60 hover:border-cyber-accent/40 rounded cursor-pointer transition-all duration-150">
                                    <span class="text-xs text-slate-300 font-light flex items-center gap-2">
                                        <input type="checkbox" data-index="${idx}" ${item.done ? 'checked' : ''} class="checklist-toggle-box rounded border-cyber-border bg-black text-cyber-accent focus:ring-0 cursor-pointer">
                                        <span class="${item.done ? 'line-through text-slate-500' : ''}">${item.text}</span>
                                    </span>
                                </label>
                            `).join('')}
                        </div>
                        
                        <!-- Add Custom Checklist Task Form -->
                        <div class="flex gap-2">
                            <input type="text" id="newCheckItemInput" placeholder="Add custom criteria check..." class="flex-1 bg-black/60 border border-cyber-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-purple">
                            <button id="addCheckItemBtn" class="bg-cyber-purple hover:bg-purple-600 text-white px-3 py-1 text-xs font-mono uppercase rounded transition-colors">Add</button>
                        </div>
                    </div>

                    <!-- Right Side: Payload Files & Activity Track -->
                    <div class="space-y-4">
                        <div class="border-b border-cyber-border/40 pb-2">
                            <h4 class="text-xs font-mono text-slate-400 uppercase font-bold">Encrypted Payload Bundles</h4>
                        </div>
                        <div class="space-y-2">
                            ${card.attachments.map(att => `
                                <div class="flex items-center justify-between p-2 bg-black/60 rounded border border-cyber-border/40 text-xs font-mono">
                                    <span class="text-slate-300 truncate max-w-[160px]">${att.name}</span>
                                    <span class="text-cyber-accent text-[10px] font-bold">${att.size}</span>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Action Controls: Immediate Seals -->
                        <div class="space-y-2 pt-4 border-t border-cyber-border/30">
                            <label class="block text-[10px] font-mono text-slate-500 uppercase">Interactive State Transfer</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button id="modalRevertBtn" class="border border-red-500/40 hover:border-red-500 text-red-400 hover:bg-red-500/10 py-1.5 text-[10px] font-mono uppercase rounded transition-all">Revisions Req.</button>
                                <button id="modalApproveBtn" class="bg-cyber-emerald hover:bg-emerald-400 text-black font-bold py-1.5 text-[10px] font-mono uppercase rounded transition-all">Approve Packet</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Logs -->
                <div class="bg-black/40 p-3 rounded border border-cyber-border/60 font-mono text-[10px] text-slate-400">
                    <span class="block text-slate-500 uppercase font-bold mb-1">State Modification Ledger</span>
                    <div class="space-y-1 max-h-[60px] overflow-y-auto">
                        ${card.history.map(hist => `
                            <div class="flex justify-between">
                                <span>&gt; ${hist.action} by ${hist.user}</span>
                                <span class="text-slate-600">${hist.date}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        // Close Manager Modal Listener
        getEl('closeManagerModalBtn').addEventListener('click', closeCardManager);
        
        // Add Checklist Checklist Items
        getEl('addCheckItemBtn').addEventListener('click', () => {
            const input = getEl('newCheckItemInput');
            const val = input.value.trim();
            if (val) {
                card.checklist.push({ id: 'custom-' + Date.now(), text: val, done: false });
                card.history.unshift({ user: 'System Administrator', action: `Added checklist task: "${val}"`, date: 'Just now' });
                input.value = '';
                openCardManager(cardId); // Re-render self to reflect checklists
                renderPipelineKanban();
            }
        });

        // Toggle Checklist checkbox actions
        document.querySelectorAll('.checklist-toggle-box').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (card.checklist[idx]) {
                    card.checklist[idx].done = e.target.checked;
                    card.history.unshift({
                        user: 'Sponsor Lead Node',
                        action: `Marked check "${card.checklist[idx].text}" as ${e.target.checked ? 'COMPLETED' : 'INCOMPLETE'}`,
                        date: 'Just now'
                    });
                    openCardManager(cardId);
                    renderPipelineKanban();
                }
            });
        });

        // Instant Action State Triggers (Column Swappers)
        getEl('modalRevertBtn').addEventListener('click', () => {
            updateCardColumn(cardId, 'revisions-requested');
            closeCardManager();
        });

        getEl('modalApproveBtn').addEventListener('click', () => {
            // Check off everything on complete approval
            card.checklist.forEach(item => item.done = true);
            updateCardColumn(cardId, 'approved');
            closeCardManager();
        });
    }

    function closeCardManager() {
        const modal = getEl('pipelineManagerModal');
        if (modal) modal.classList.add('hidden');
        pipelineState.activeCardDetails = null;
    }

    // Move Card columns easily from script
    function updateCardColumn(cardId, columnId) {
        const card = pipelineState.cards.find(c => c.id === cardId);
        if (card) {
            card.columnId = columnId;
            card.history.unshift({
                user: 'Automated Agent',
                action: `Authorized payload movement directly into [${columnId.toUpperCase()}] status`,
                date: 'Just now'
            });
            renderPipelineKanban();
            updateTelemetryMetrics();
            triggerHandshakeSyncFlash(columnId);
        }
    }

    // INGEST COMPONENT: INGEST ATTACHMENT MODAL
    function openIngestionModal() {
        let modal = getEl('pipelineIngestModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pipelineIngestModal';
            modal.className = 'fixed inset-0 bg-black/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-[#0e131f] border border-cyber-accent w-full max-w-lg p-6 rounded-xl relative edge-clip">
                <div class="absolute top-0 right-12 w-24 h-1 bg-gradient-to-r from-cyber-accent to-blue-500"></div>

                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-slate-100 uppercase tracking-tight">Ingest Attachment Bundle</h3>
                        <p class="text-[11px] font-mono text-cyber-accent">Securing design decks, asset plans, and contract packets</p>
                    </div>
                    <button id="closeIngestModalBtn" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form id="ingestPackageForm" class="space-y-4 font-mono text-xs">
                    <div>
                        <label class="block text-[10px] text-slate-400 uppercase mb-1">Package Title</label>
                        <input required id="ingestTitle" type="text" placeholder="e.g. Pro-Forma Modeling Revision" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] text-slate-400 uppercase mb-1">Category Class</label>
                            <select id="ingestCategory" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                                <option value="Design Revisions">Design Revisions</option>
                                <option value="Contract Packs">Contract Packs</option>
                                <option value="Environmental">Environmental</option>
                                <option value="Validation Pack">Validation Pack</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 uppercase mb-1">Audit Priority</label>
                            <select id="ingestUrgency" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] text-slate-400 uppercase mb-1">Auditor Assigned</label>
                            <input required id="ingestReviewer" type="text" placeholder="Lead Auditor" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 uppercase mb-1">Version</label>
                            <input required id="ingestVersion" type="text" value="v1.0" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] text-slate-400 uppercase mb-1">Simulation Attachment Name</label>
                        <input required id="ingestAttachment" type="text" placeholder="Feasibility_Blueprint_Draft.pdf" class="w-full bg-black/60 border border-cyber-border rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-accent">
                    </div>

                    <div class="border-t border-cyber-border/40 pt-4 flex justify-between items-center">
                        <button type="button" id="cancelIngestBtn" class="text-slate-400 hover:text-white font-mono text-[10px] uppercase">Discard Ingestion</button>
                        <button type="submit" class="bg-cyber-accent hover:bg-cyan-400 text-black font-bold px-5 py-2 rounded text-[11px] uppercase transition-all duration-150">Execute Ingestion</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');

        // Modal Action Attachments
        getEl('closeIngestModalBtn').addEventListener('click', closeIngestModal);
        getEl('cancelIngestBtn').addEventListener('click', closeIngestModal);
        
        getEl('ingestPackageForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const title = getEl('ingestTitle').value;
            const category = getEl('ingestCategory').value;
            const urgency = getEl('ingestUrgency').value;
            const reviewer = getEl('ingestReviewer').value;
            const version = getEl('ingestVersion').value;
            const attachmentName = getEl('ingestAttachment').value;

            // Generate mock attachment bundle structure
            const newCard = {
                id: 'pkg-' + Date.now(),
                title: title,
                category: category,
                urgency: urgency,
                version: version,
                reviewer: reviewer,
                checklist: [
                    { id: 'c-new-1', text: 'System Handshake Acknowledged', done: false },
                    { id: 'c-new-2', text: 'Validate structural constraints', done: false }
                ],
                attachments: [
                    { name: attachmentName, size: '12.4 MB', type: 'pdf' }
                ],
                history: [
                    { user: 'Sponsor Lead Node', action: 'Uploaded new package', date: 'Just now' }
                ],
                columnId: 'pending-review'
            };

            pipelineState.cards.push(newCard);
            renderPipelineKanban();
            updateTelemetryMetrics();
            closeIngestModal();
            triggerHandshakeSyncFlash('pending-review');
        });
    }

    function closeIngestModal() {
        const modal = getEl('pipelineIngestModal');
        if (modal) modal.classList.add('hidden');
    }

    // Interactive Core Workspace Hookups
    function registerEventHandlers() {
        // Toggle new bundle modal on clicking ingest
        const addBtn = getEl('addNewPackageBtn');
        if (addBtn) {
            addBtn.addEventListener('click', openIngestionModal);
        }
    }

    // Auto-Initialization
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();