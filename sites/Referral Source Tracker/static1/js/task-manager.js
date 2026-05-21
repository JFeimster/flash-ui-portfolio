/**
 * Moonshine Capital | Follow-Up Command Center Logic
 * This module manages the prioritized task list and focus mode interactions.
 */

class TaskManager {
    constructor() {
        this.sources = JSON.parse(localStorage.getItem('moonshine_referrals')) || [];
        this.tasks = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.refreshTasks();
        this.injectStyles();
    }

    refreshTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter for overdue or today, then sort by Quality Score (highest first)
        this.tasks = this.sources
            .filter(s => {
                if (!s.nextFollowUp) return false;
                const followUpDate = new Date(s.nextFollowUp);
                return followUpDate <= today && s.stage !== 'Dormant';
            })
            .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .focus-mode-card {
                background: linear-gradient(to bottom right, #ffffff, #f8fafc);
                border: 2px solid #d4af37;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .task-progress-bar {
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                overflow: hidden;
            }
            .task-progress-fill {
                height: 100%;
                background: #d4af37;
                transition: width 0.3s ease;
            }
            .status-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
        `;
        document.head.appendChild(style);
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }

        const currentTask = this.tasks[this.currentIndex];
        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="flex justify-between items-end mb-6">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Follow-Up Command Center</h2>
                        <p class="text-slate-500 text-sm font-medium">Prioritized by Quality Score & Urgency</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                        <div class="text-lg font-black text-slate-900">${this.currentIndex + 1} / ${this.tasks.length}</div>
                    </div>
                </div>

                <div class="task-progress-bar mb-8">
                    <div class="task-progress-fill" style="width: ${((this.currentIndex + 1) / this.tasks.length) * 100}%"></div>
                </div>

                <div class="focus-mode-card rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4">
                        <div class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <span class="w-2 h-2 bg-amber-500 rounded-full status-pulse"></span>
                            Priority Action
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="md:col-span-2">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-16 h-16 bg-slate-900 text-[#d4af37] rounded-xl flex items-center justify-center text-2xl font-bold">
                                    ${currentTask.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 class="text-3xl font-bold text-slate-900">${currentTask.name}</h3>
                                    <p class="text-slate-500 font-medium">${currentTask.company} • ${currentTask.category}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Quality Score</p>
                                    <p class="text-lg font-bold text-slate-800">${currentTask.qualityScore}/100</p>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Current Stage</p>
                                    <p class="text-lg font-bold text-slate-800">${currentTask.stage}</p>
                                </div>
                            </div>

                            <div class="mb-6">
                                <label class="block text-xs font-black text-slate-500 uppercase mb-2">Interaction Notes</label>
                                <textarea id="task-notes" class="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 shadow-sm" placeholder="What happened during this follow-up?"></textarea>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <button onclick="window.taskManager.completeTask(${currentTask.id})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                    Mark Contacted
                                </button>
                                <button onclick="window.taskManager.nextTask()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold transition-all">
                                    Skip for Now
                                </button>
                            </div>
                        </div>

                        <div class="bg-slate-900 rounded-xl p-6 text-white">
                            <h4 class="text-xs font-black text-amber-500 uppercase tracking-widest mb-4">Contact Intel</h4>
                            <div class="space-y-4 mb-6">
                                <div>
                                    <p class="text-xs text-slate-400">Email</p>
                                    <p class="text-sm font-medium truncate">${currentTask.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-400">Phone</p>
                                    <p class="text-sm font-medium">${currentTask.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-400">Location</p>
                                    <p class="text-sm font-medium">${currentTask.location || 'Remote'}</p>
                                </div>
                            </div>

                            <div class="pt-6 border-t border-slate-800">
                                <h4 class="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Previous Note</h4>
                                <p class="text-xs text-slate-300 italic leading-relaxed">
                                    "${currentTask.notes || 'No notes on record.'}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 class="text-2xl font-bold text-slate-900 mb-2">Queue Clear!</h3>
                <p class="text-slate-500 max-w-sm mx-auto">You've finished all your priority follow-ups for today. Time to find new referral sources.</p>
                <button onclick="window.location.reload()" class="mt-8 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm">Refresh List</button>
            </div>
        `;
    }

    nextTask() {
        if (this.currentIndex < this.tasks.length - 1) {
            this.currentIndex++;
            this.render('task-manager-view');
        } else {
            this.currentIndex = 0;
            this.refreshTasks();
            this.render('task-manager-view');
        }
    }

    completeTask(id) {
        const notes = document.getElementById('task-notes').value;
        const sourceIndex = this.sources.findIndex(s => s.id === id);
        
        if (sourceIndex !== -1) {
            const today = new Date();
            // Move follow-up date forward by 14 days by default
            const nextFollowUp = new Date();
            nextFollowUp.setDate(today.getDate() + 14);

            this.sources[sourceIndex].lastContact = today.toISOString().split('T')[0];
            this.sources[sourceIndex].nextFollowUp = nextFollowUp.toISOString().split('T')[0];
            if (notes) {
                this.sources[sourceIndex].notes = notes + " | " + this.sources[sourceIndex].notes;
            }
            
            // Advance stage if it's the first contact
            if (this.sources[sourceIndex].stage === 'Identified') {
                this.sources[sourceIndex].stage = 'Contacted';
                this.sources[sourceIndex].qualityScore += 20;
            }

            this.save();
            this.refreshTasks();
            
            if (this.currentIndex >= this.tasks.length) {
                this.currentIndex = 0;
            }
            
            this.render('task-manager-view');
        }
    }

    save() {
        localStorage.setItem('moonshine_referrals', JSON.stringify(this.sources));
    }
}

// Global initialization
window.taskManager = new TaskManager();

/**
 * To use this component:
 * 1. Add <div id="task-manager-view"></div> to your HTML.
 * 2. Call window.taskManager.render('task-manager-view');
 */