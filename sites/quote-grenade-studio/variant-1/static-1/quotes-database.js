const QUOTE_ARMORY_DATA = [
    { text: "Sovereignty is a skill, not a right.", cat: "LIBERTY" },
    { text: "The state is a hallucination with a budget.", cat: "LIBERTY" },
    { text: "Build things that make the government obsolete.", cat: "FOUNDRY" },
    { text: "Optimism is a moral duty, pessimism is a luxury of the bored.", cat: "METAMODERN" },
    { text: "If it's not a 'Hell Yes', it's a 'Don't tax me'.", cat: "FOUNDRY" },
    { text: "Protocol > Politics.", cat: "LIBERTY" },
    { text: "Exit is the only real voice.", cat: "LIBERTY" },
    { text: "Your attention is the only remaining scarce resource.", cat: "METAMODERN" },
    { text: "Be the glitch in the simulation.", cat: "METAMODERN" },
    { text: "Permission is for people who don't have code.", cat: "FOUNDRY" },
    { text: "The future is a series of opt-in networks.", cat: "LIBERTY" },
    { text: "Everything is a remix, but the ownership is mine.", cat: "FOUNDRY" },
    { text: "Logic is the ultimate weapon of the unarmed.", cat: "METAMODERN" },
    { text: "The most radical thing you can do is be happy.", cat: "METAMODERN" },
    { text: "Stop asking for a seat at the table and build your own floor.", cat: "FOUNDRY" },
    { text: "Consensus is a trap. Conviction is a tool.", cat: "FOUNDRY" },
    { text: "Taxes are the subscription fee for a service you can't cancel.", cat: "LIBERTY" },
    { text: "Code is the only law that doesn't require a police force.", cat: "FOUNDRY" },
    { text: "They can't cancel what they can't coordinate.", cat: "METAMODERN" },
    { text: "Decentralization is the only hedge against incompetence.", cat: "LIBERTY" },
    { text: "Ship code or ship complaints. Choose one.", cat: "FOUNDRY" },
    { text: "The individual is the smallest, most ignored minority.", cat: "LIBERTY" },
    { text: "Privacy is not about hiding; it's about boundaries.", cat: "METAMODERN" },
    { text: "Bureaucracy is the art of making the possible impossible.", cat: "LIBERTY" },
    { text: "If you can't exit, it's not a community; it's a cage.", cat: "LIBERTY" },
    { text: "Venture scale is for markets. Human scale is for lives.", cat: "METAMODERN" },
    { text: "Don't fix the system. Build its replacement.", cat: "FOUNDRY" },
    { text: "Legacy is for the dead. Liquidity is for the living.", cat: "FOUNDRY" },
    { text: "The map is not the territory, and the law is not justice.", cat: "METAMODERN" },
    { text: "Automate the mundane, humanize the insane.", cat: "METAMODERN" },
    { text: "Sound money is the foundation of a sound mind.", cat: "LIBERTY" },
    { text: "Marketing is what you do when your product is boring.", cat: "FOUNDRY" },
    { text: "The best way to predict the future is to open-source it.", cat: "FOUNDRY" },
    { text: "A government that can give you everything can take everything.", cat: "LIBERTY" },
    { text: "Algorithms are the new legislative branch.", cat: "METAMODERN" }
];

const armoryStyles = `
    #armory-section {
        background: var(--cream);
        border-top: var(--border);
        padding: 80px 0;
    }
    .armory-header {
        margin-bottom: 60px;
    }
    .armory-controls {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-bottom: 40px;
    }
    .search-input {
        width: 100%;
        padding: 20px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1.5rem;
        border: var(--border);
        box-shadow: var(--shadow);
        outline: none;
        text-transform: uppercase;
    }
    .search-input:focus {
        box-shadow: var(--shadow-hover);
        transform: translate(2px, 2px);
    }
    .filter-bar {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    .armory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
    }
    .armory-item {
        background: var(--white);
        border: var(--border);
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 250px;
        transition: all 0.2s;
        position: relative;
    }
    .armory-item:hover {
        transform: translate(-4px, -4px);
        box-shadow: 12px 12px 0px var(--black);
    }
    .armory-item-text {
        font-size: 1.4rem;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 20px;
    }
    .armory-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .armory-tag {
        font-family: 'IBM Plex Mono', monospace;
        background: var(--red);
        color: var(--white);
        padding: 4px 8px;
        font-size: 0.75rem;
        font-weight: bold;
    }
    .armory-copy-btn {
        background: var(--black);
        color: var(--white);
        border: none;
        padding: 8px 16px;
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
    .armory-copy-btn:hover {
        background: var(--red);
    }
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 100px;
        font-size: 2rem;
        font-weight: 900;
        border: var(--border);
        background: var(--white);
    }
`;

class QuoteArmory {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.filter = 'ALL';
        this.searchTerm = '';
        this.init();
    }

    init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = armoryStyles;
        document.head.appendChild(styleSheet);
        this.renderLayout();
        this.attachListeners();
        this.updateGrid();
    }

    renderLayout() {
        this.container.innerHTML = `
            <section id="armory-section">
                <div class="container">
                    <div class="armory-header">
                        <h2 style="font-size: 5rem; text-transform: uppercase; font-family: 'Syne', sans-serif;">The Armory</h2>
                        <p style="font-family: 'IBM Plex Mono', monospace; font-weight: bold;">[ ARCHIVE OF HIGH-YIELD COGNITIVE MUNITIONS ]</p>
                    </div>
                    
                    <div class="armory-controls">
                        <input type="text" class="search-input" id="armory-search" placeholder="SEARCH BY KEYWORD...">
                        <div class="filter-bar">
                            <button class="tag-btn active" data-yield="ALL">ALL AMMO</button>
                            <button class="tag-btn" data-yield="LIBERTY">LIBERTY</button>
                            <button class="tag-btn" data-yield="FOUNDRY">FOUNDRY</button>
                            <button class="tag-btn" data-yield="METAMODERN">METAMODERN</button>
                        </div>
                    </div>

                    <div class="armory-grid" id="armory-grid"></div>
                </div>
            </section>
        `;
    }

    attachListeners() {
        const search = document.getElementById('armory-search');
        search.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.updateGrid();
        });

        const filterBtns = this.container.querySelectorAll('.tag-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.getAttribute('data-yield');
                this.updateGrid();
            });
        });
    }

    updateGrid() {
        const grid = document.getElementById('armory-grid');
        const filtered = QUOTE_ARMORY_DATA.filter(item => {
            const matchesFilter = this.filter === 'ALL' || item.cat === this.filter;
            const matchesSearch = item.text.toLowerCase().includes(this.searchTerm);
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="no-results">ZERO MATCHES FOUND. LOWER YOUR STANDARDS OR TRY AGAIN.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(item => `
            <div class="armory-item">
                <div class="armory-item-text">"${item.text}"</div>
                <div class="armory-item-footer">
                    <span class="armory-tag">${item.cat}</span>
                    <button class="armory-copy-btn" onclick="armoryInstance.copy('${item.text.replace(/'/g, "\\'")}')">COPY RAW</button>
                </div>
            </div>
        `).join('');
    }

    copy(text) {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.getElementById('toast');
            if (toast) {
                toast.innerText = "MUNITION COPIED";
                toast.style.display = 'block';
                setTimeout(() => toast.style.display = 'none', 1500);
            }
        });
    }
}

// Global instance for the onclick handler
let armoryInstance;

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has a placeholder div, otherwise append to body before footer
    let mountPoint = document.getElementById('armory-mount');
    if (!mountPoint) {
        mountPoint = document.createElement('div');
        mountPoint.id = 'armory-mount';
        const wall = document.querySelector('.wall');
        if (wall) wall.after(mountPoint);
        else document.body.appendChild(mountPoint);
    }
    armoryInstance = new QuoteArmory('armory-mount');
});