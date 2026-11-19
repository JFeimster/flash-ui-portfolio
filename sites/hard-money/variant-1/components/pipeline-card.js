class PipelineCard extends HTMLElement {
    constructor() {
        super();
        this.attachmentsData = [];
    }

    static get observedAttributes() {
        return ['title', 'version', 'author', 'status', 'priority', 'category', 'comments'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback() {
        this.render();
    }

    set attachments(data) {
        this.attachmentsData = data;
        this.render();
    }

    get attachments() {
        return this.attachmentsData;
    }

    get statusColors() {
        return {
            'pending': { border: 'border-cyber-border', text: 'text-slate-400', glow: 'hover:border-cyber-accent/50', accent: 'bg-cyber-accent/20 text-cyber-accent' },
            'reviewing': { border: 'border-cyber-purple/60', text: 'text-cyber-purple', glow: 'hover:border-cyber-purple/80', accent: 'bg-cyber-purple/20 text-cyber-purple' },
            'approved': { border: 'border-cyber-emerald/60', text: 'text-cyber-emerald', glow: 'hover:border-cyber-emerald/80', accent: 'bg-cyber-emerald/20 text-cyber-emerald' }
        };
    }

    render() {
        const title = this.getAttribute('title') || 'Untitled Asset Pack';
        const version = this.getAttribute('version') || 'v1.0';
        const author = this.getAttribute('author') || 'Anonymous Operator';
        const status = (this.getAttribute('status') || 'pending').toLowerCase();
        const priority = this.getAttribute('priority') || 'Medium';
        const category = this.getAttribute('category') || 'Creative Assets';
        const commentsCount = this.getAttribute('comments') || '0';
        
        const colors = this.statusColors[status] || this.statusColors['pending'];
        
        // Default mock attachments if none provided
        const files = this.attachmentsData.length > 0 ? this.attachmentsData : [
            { name: "interface-blueprint-v4.fig", size: "18.4 MB", type: "design" },
            { name: "licensing-agreement-revised.pdf", size: "4.2 MB", type: "document" }
        ];

        const priorityGlow = priority.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-400 border-cyber-border/40';

        this.className = "block transition-all duration-300";
        this.innerHTML = `
            <div class="bg-cyber-card border ${colors.border} ${colors.glow} p-5 rounded-xl transition-all duration-300 relative group flex flex-col justify-between cyber-glow-hover edge-clip">
                
                <!-- Telemetry Line / Top Metadata -->
                <div class="flex items-center justify-between mb-3 pb-3 border-b border-cyber-border/40">
                    <div class="flex items-center gap-2">
                        <span class="inline-block w-1.5 h-3 bg-cyber-accent"></span>
                        <span class="text-[10px] font-mono tracking-widest text-slate-500 uppercase">${category}</span>
                    </div>
                    <div class="flex items-center gap-2 font-mono text-[10px]">
                        <span class="px-2 py-0.5 rounded border ${priorityGlow}">${priority.toUpperCase()} PRIORITY</span>
                        <span class="text-cyber-accent font-bold">${version}</span>
                    </div>
                </div>

                <!-- Asset Title & Author -->
                <div class="mb-4">
                    <h4 class="text-md font-bold text-slate-100 group-hover:text-cyber-accent transition-colors duration-200">${title}</h4>
                    <p class="text-[11px] text-slate-400 mt-1 font-mono">Assigned To: <span class="text-slate-200">${author}</span></p>
                </div>

                <!-- Attachment System Hub -->
                <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
                        <span>Payload (${files.length} Attachments)</span>
                        <span>Weight</span>
                    </div>
                    <div class="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        ${files.map((file, idx) => `
                            <div class="flex items-center justify-between bg-black/40 px-2.5 py-2 rounded border border-cyber-border/40 text-xs font-mono group/item hover:border-cyber-accent/40 transition-all duration-150">
                                <div class="flex items-center gap-2 truncate">
                                    <svg class="w-3.5 h-3.5 shrink-0 ${file.type === 'design' ? 'text-cyber-purple' : 'text-cyber-accent'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span class="text-slate-300 truncate group-hover/item:text-white transition-colors duration-150">${file.name}</span>
                                </div>
                                <span class="text-[10px] text-slate-500 shrink-0 font-light">${file.size}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Review Checklist / Consent Consensus -->
                <div class="bg-black/20 p-2.5 rounded border border-cyber-border/30 mb-4 text-xs font-mono">
                    <span class="text-[10px] text-slate-500 uppercase block mb-1.5 tracking-wider">Review Consensus Checklist</span>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 hover:text-slate-200">
                            <input type="checkbox" class="checklist-item rounded border-cyber-border bg-black text-cyber-accent focus:ring-0 cursor-pointer w-3.5 h-3.5">
                            <span>Visual QA</span>
                        </label>
                        <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 hover:text-slate-200">
                            <input type="checkbox" class="checklist-item rounded border-cyber-border bg-black text-cyber-accent focus:ring-0 cursor-pointer w-3.5 h-3.5">
                            <span>Compliance</span>
                        </label>
                    </div>
                </div>

                <!-- Bottom Action Controls Interface -->
                <div class="pt-3 border-t border-cyber-border/30 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>${commentsCount} Commits</span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <button class="reject-btn hover:bg-red-500/10 text-red-400 p-1.5 rounded border border-transparent hover:border-red-500/30 transition-all duration-150" title="Request Modifications">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <button class="approve-btn bg-cyber-accent/10 hover:bg-cyber-accent text-cyber-accent hover:text-black font-mono font-bold text-[11px] px-3.5 py-1.5 rounded uppercase border border-cyber-accent/30 transition-all duration-150 flex items-center gap-1">
                            <span>Authorize</span>
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Authorize Action Trigger
        const approveBtn = this.querySelector('.approve-btn');
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('pipeline-card-approved', {
                    bubbles: true,
                    detail: {
                        title: this.getAttribute('title'),
                        version: this.getAttribute('version'),
                        author: this.getAttribute('author'),
                        attachments: this.attachmentsData
                    }
                }));
            });
        }

        // Reject / Request Modification Trigger
        const rejectBtn = this.querySelector('.reject-btn');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('pipeline-card-rejected', {
                    bubbles: true,
                    detail: {
                        title: this.getAttribute('title'),
                        version: this.getAttribute('version')
                    }
                }));
            });
        }

        // Checklist State Event dispatch
        const checklistItems = this.querySelectorAll('.checklist-item');
        checklistItems.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedItems = Array.from(checklistItems).filter(item => item.checked).length;
                this.dispatchEvent(new CustomEvent('pipeline-checklist-updated', {
                    bubbles: true,
                    detail: {
                        checked: checkedItems,
                        total: checklistItems.length
                    }
                }));
            });
        });
    }
}

// Register Web Component inside global custom registry
if (!customElements.get('pipeline-card')) {
    customElements.define('pipeline-card', PipelineCard);
}