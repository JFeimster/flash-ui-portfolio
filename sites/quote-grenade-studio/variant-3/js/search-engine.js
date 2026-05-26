const armoryQuotes = [
    { text: "Privacy is not a luxury; it is a weapon.", cat: "liberty" },
    { text: "If it's not permissionless, it's a prison.", cat: "liberty" },
    { text: "Software eats the law while the lawyers are sleeping.", cat: "founder" },
    { text: "Exit is the ultimate form of voice.", cat: "metamodern" },
    { text: "Build things that make governments obsolete.", cat: "founder" },
    { text: "Your comfort zone is a subsidized hallucination.", cat: "metamodern" },
    { text: "The most radical thing you can do is be self-sufficient.", cat: "liberty" },
    { text: "Bureaucracy is the art of making the possible impossible.", cat: "chaos" },
    { text: "Code is the only constitution that doesn't require an interpreter.", cat: "founder" },
    { text: "Taxation is the subscription fee for a service you can't cancel.", cat: "chaos" },
    { text: "The network state begins in your group chat.", cat: "founder" },
    { text: "Fiat is a slow-motion rug pull.", cat: "metamodern" },
    { text: "Regulations are just moat-building for the uninspired.", cat: "founder" },
    { text: "Don't ask for permission. Ask for forgiveness. Or just be anonymous.", cat: "liberty" },
    { text: "A ship in harbor is safe, but that's not what ships are built for. Also, the harbor is taxed.", cat: "chaos" },
    { text: "Opting out is the only way to win a rigged game.", cat: "metamodern" },
    { text: "Centralization is a single point of failure for humanity.", cat: "liberty" },
    { text: "Your 9-to-5 is a bribe to forget your dreams.", cat: "metamodern" },
    { text: "Decentralize everything until nothing is too big to fail.", cat: "founder" },
    { text: "The future is here, it’s just not encrypted yet.", cat: "founder" },
    { text: "Anonymity is the only true democracy.", cat: "liberty" },
    { text: "Burn the maps. Navigate by the stars.", cat: "chaos" },
    { text: "Your data is the oil of a machine that wants to grind you down.", cat: "metamodern" },
    { text: "The state is a bug, not a feature.", cat: "liberty" },
    { text: "Move fast and break systems, not just things.", cat: "founder" },
    { text: "Borders are scars on the earth left by old wars.", cat: "chaos" },
    { text: "Algorithm is the new legislation.", cat: "metamodern" },
    { text: "If you can't fork it, you don't own it.", cat: "founder" },
    { text: "The only real crime is obedience.", cat: "chaos" },
    { text: "Sovereignty is a skill, not a right.", cat: "liberty" }
];

class ArmorySearch {
    constructor() {
        this.container = document.getElementById('armory-grid');
        this.searchInput = document.getElementById('armory-search');
        this.categoryBtns = document.querySelectorAll('.armory-filter');
        this.statsDisplay = document.getElementById('armory-count');
        this.currentFilter = 'all';
        this.searchTerm = '';

        this.init();
    }

    init() {
        if (!this.container) return;

        this.searchInput?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });

        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.cat;
                this.render();
            });
        });

        this.render();
    }

    getFilteredQuotes() {
        return armoryQuotes.filter(q => {
            const matchesCat = this.currentFilter === 'all' || q.cat === this.currentFilter;
            const matchesSearch = q.text.toLowerCase().includes(this.searchTerm);
            return matchesCat && matchesSearch;
        });
    }

    render() {
        const filtered = this.getFilteredQuotes();
        
        if (this.statsDisplay) {
            this.statsDisplay.innerText = `${filtered.length} GRENADES ARMED`;
        }

        this.container.innerHTML = filtered.map((q, index) => `
            <div class="wall-item" style="transform: rotate(${Math.random() * 4 - 2}deg); margin-bottom: 20px; background: white; border: 4px solid black; padding: 30px; box-shadow: 8px 8px 0px ${this.getCatColor(q.cat)};">
                <div style="background: black; color: white; display: inline-block; padding: 2px 8px; font-size: 0.7rem; margin-bottom: 15px; font-weight: bold;">
                    ${q.cat.toUpperCase()}
                </div>
                <p style="font-family: 'Archivo Black', sans-serif; font-size: 1.2rem; line-height: 1.1; text-transform: uppercase;">
                    "${q.text}"
                </p>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="navigator.clipboard.writeText('${q.text}')" style="cursor: pointer; background: none; border: 2px solid black; font-family: 'Space Mono'; font-size: 0.7rem; font-weight: bold; padding: 2px 5px;">COPY</button>
                </div>
            </div>
        `).join('');
    }

    getCatColor(cat) {
        const colors = {
            liberty: '#FF0000',
            founder: '#000000',
            chaos: '#FDFCF0',
            metamodern: '#333333'
        };
        return colors[cat] || '#000000';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.armory = new ArmorySearch();
});