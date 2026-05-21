const ACADEMY_MODULES = [
    {
        id: 'pb-01',
        category: 'Payroll Providers',
        title: 'The Payroll Pivot',
        description: 'How to pitch funding solutions to payroll providers as a cash-flow security blanket for their clients.',
        duration: '15 min',
        type: 'Playbook',
        difficulty: 'Intermediate',
        thumbnail: '📊'
    },
    {
        id: 'pb-02',
        category: 'CPA/Accountant',
        title: 'Tax Liability Funding 101',
        description: 'Tactical training on helping CPAs solve their clients April 15th cash crunches using bridge loans.',
        duration: '22 min',
        type: 'Playbook',
        difficulty: 'Advanced',
        thumbnail: '📑'
    },
    {
        id: 'pb-03',
        category: 'Business Broker',
        title: 'Closing the Gap',
        description: 'Techniques to use creative capital to bridge the gap between SBA limits and seller expectations.',
        duration: '18 min',
        type: 'Playbook',
        difficulty: 'Expert',
        thumbnail: '🤝'
    },
    {
        id: 'ma-01',
        category: 'Marketing Materials',
        title: 'Co-Brandable Bridge Loan PDF',
        description: 'A professional one-pager you can add your logo to and send to your network.',
        duration: 'Download',
        type: 'Marketing Asset',
        difficulty: 'Ready-to-Use',
        thumbnail: '📥'
    }
];

let academyProgress = JSON.parse(localStorage.getItem('moonshine_academy_progress')) || {};

function initAcademy(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    renderAcademy(container);
}

function toggleLessonComplete(lessonId) {
    academyProgress[lessonId] = !academyProgress[lessonId];
    localStorage.setItem('moonshine_academy_progress', JSON.stringify(academyProgress));
    
    const container = document.querySelector('[data-academy-root]');
    if (container) renderAcademy(container);
}

function getCompletionStats() {
    const total = ACADEMY_MODULES.length;
    const completed = Object.values(academyProgress).filter(v => v === true).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
}

function renderAcademy(container) {
    const stats = getCompletionStats();
    
    container.setAttribute('data-academy-root', 'true');
    container.className = "max-w-7xl mx-auto p-6 mb-20";
    
    container.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Referral Partner Academy</h2>
                <p class="text-slate-400 max-w-xl text-sm">Access tactical playbooks and co-brandable marketing assets to turn your professional network into a high-performance deal engine.</p>
            </div>
            <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700 min-w-[240px]">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Progress</span>
                    <span class="text-[#d4af37] font-black">${stats.percentage}%</span>
                </div>
                <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div class="bg-[#d4af37] h-full transition-all duration-700" style="width: ${stats.percentage}%"></div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${ACADEMY_MODULES.map(module => {
                const isDone = academyProgress[module.id];
                return `
                <div class="glass-card group flex flex-col h-full rounded-xl overflow-hidden transition-all hover:border-[#d4af37]/50">
                    <div class="p-6 flex-grow">
                        <div class="flex justify-between items-start mb-4">
                            <span class="text-3xl">${module.thumbnail}</span>
                            ${isDone ? 
                                '<span class="bg-emerald-500/20 text-emerald-400 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>' 
                                : '<span class="w-4 h-4 rounded-full border-2 border-slate-600"></span>'}
                        </div>
                        <div class="mb-1">
                            <span class="text-[10px] font-black text-[#d4af37] uppercase tracking-tighter">${module.category}</span>
                        </div>
                        <h3 class="text-white font-bold text-lg mb-2 group-hover:text-[#d4af37] transition-colors">${module.title}</h3>
                        <p class="text-slate-400 text-xs leading-relaxed mb-4">${module.description}</p>
                    </div>
                    
                    <div class="px-6 pb-6 mt-auto">
                        <div class="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-4">
                            <span>Type: ${module.type}</span>
                            <span>${module.duration}</span>
                        </div>
                        <button 
                            onclick="toggleLessonComplete('${module.id}')"
                            class="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isDone ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-900 hover:bg-[#d4af37]'}"
                        >
                            ${isDone ? 'Restart Module' : module.type === 'Marketing Asset' ? 'Download Asset' : 'Start Training'}
                        </button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        <div class="mt-12 bg-[#d4af37] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-6">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl shadow-inner">
                    🎓
                </div>
                <div>
                    <h3 class="text-slate-900 font-black text-xl">Need a custom co-branded deck?</h3>
                    <p class="text-slate-800 text-sm font-medium">Our marketing team can build custom collateral for your specific high-value partners.</p>
                </div>
            </div>
            <button class="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-transform whitespace-nowrap">
                Request Custom Material
            </button>
        </div>
    `;
}

// Global initialization call if the container exists
document.addEventListener('DOMContentLoaded', () => {
    // If a main container exists in the base HTML, we can inject the academy portal
    const mainBoard = document.querySelector('main');
    if (mainBoard) {
        const academySection = document.createElement('section');
        academySection.id = 'academy-portal';
        mainBoard.parentNode.insertBefore(academySection, mainBoard.nextSibling);
        initAcademy('academy-portal');
    }
});