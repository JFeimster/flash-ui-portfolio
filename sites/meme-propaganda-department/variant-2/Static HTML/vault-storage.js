const VAULT_DATA_KEY = 'MEME_DEPT_OPERATIVE_DATA';

const INITIAL_STATE = {
    operativeId: "OP-420-69-DELTA",
    clearanceLevel: 1,
    rank: "Noob Recruit",
    submissions: [],
    savedMemes: [
        { id: 's1', tag: 'AI Weirdness', title: 'LLM Hallucination #44', img: 'https://picsum.photos/seed/vault1/400/400' },
        { id: 's2', tag: 'Finance/Degens', title: 'Line go down, pain go up', img: 'https://picsum.photos/seed/vault2/400/400' }
    ]
};

const VAULT_STYLES = `
    #operative-bunker {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        max-width: 500px;
        height: 100vh;
        background: var(--white);
        border-left: var(--border-width) solid var(--black);
        z-index: 1000;
        transition: right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        display: flex;
        flex-direction: column;
        box-shadow: -10px 0 0 var(--black);
    }

    #operative-bunker.open {
        right: 0;
    }

    .bunker-header {
        background: var(--black);
        color: var(--white);
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .bunker-content {
        padding: 20px;
        overflow-y: auto;
        flex-grow: 1;
    }

    .stats-card {
        background: var(--yellow);
        border: var(--border-width) solid var(--black);
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: var(--shadow-small);
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin: 5px 0;
        text-transform: uppercase;
    }

    .bunker-tabs {
        display: flex;
        gap: 0;
        margin-bottom: 20px;
        border-bottom: var(--border-width) solid var(--black);
    }

    .bunker-tab {
        flex: 1;
        padding: 10px;
        background: var(--white);
        border: none;
        border-right: var(--border-width) solid var(--black);
        font-family: 'Space Mono', monospace;
        font-weight: bold;
        cursor: pointer;
    }

    .bunker-tab.active {
        background: var(--red);
        color: var(--white);
    }

    .vault-item {
        border: 2px solid var(--black);
        margin-bottom: 15px;
        padding: 10px;
        display: flex;
        gap: 15px;
        background: #f0f0f0;
    }

    .vault-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border: 2px solid var(--black);
    }

    .vault-item-info h4 {
        font-size: 0.9rem;
        margin: 0;
    }

    .deploy-btn {
        background: var(--black);
        color: var(--white);
        border: none;
        padding: 4px 8px;
        font-size: 0.7rem;
        margin-top: 5px;
        cursor: pointer;
        text-transform: uppercase;
    }

    .bunker-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        background: var(--red);
        color: var(--white);
        border: var(--border-width) solid var(--black);
        border-radius: 50%;
        font-family: 'Archivo Black', sans-serif;
        font-size: 0.8rem;
        cursor: pointer;
        z-index: 999;
        box-shadow: var(--shadow-small);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1;
    }
`;

class OperativeVault {
    constructor() {
        this.data = this.loadData();
        this.currentTab = 'saved';
        this.init();
    }

    loadData() {
        const stored = localStorage.getItem(VAULT_DATA_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }

    saveData() {
        localStorage.setItem(VAULT_DATA_KEY, JSON.stringify(this.data));
    }

    updateClearance() {
        const total = this.data.submissions.length + this.data.savedMemes.length;
        this.data.clearanceLevel = Math.floor(total / 3) + 1;
        const ranks = ["Recruit", "Shitposter", "Propagandist", "Meme Lord", "Chaos Architect"];
        this.data.rank = ranks[Math.min(this.data.clearanceLevel - 1, ranks.length - 1)];
        this.saveData();
    }

    render() {
        const bunker = document.getElementById('operative-bunker');
        const content = this.data[this.currentTab === 'saved' ? 'savedMemes' : 'submissions'];
        
        bunker.innerHTML = `
            <div class="bunker-header">
                <h2 style="font-family: 'Archivo Black';">OPERATIVE BUNKER</h2>
                <button onclick="vault.toggle()" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">[X]</button>
            </div>
            <div class="bunker-content">
                <div class="stats-card">
                    <div class="stat-row"><span>ID:</span> <span>${this.data.operativeId}</span></div>
                    <div class="stat-row"><span>CLEARANCE:</span> <span>LVL ${this.data.clearanceLevel}</span></div>
                    <div class="stat-row"><span>RANK:</span> <span>${this.data.rank}</span></div>
                </div>

                <div class="bunker-tabs">
                    <button class="bunker-tab ${this.currentTab === 'saved' ? 'active' : ''}" onclick="vault.setTab('saved')">VAULT</button>
                    <button class="bunker-tab ${this.currentTab === 'subs' ? 'active' : ''}" onclick="vault.setTab('subs')">INTEL</button>
                </div>

                <div class="vault-list">
                    ${content.length ? content.map(item => `
                        <div class="vault-item">
                            <img src="${item.img}" alt="thumbnail">
                            <div class="vault-item-info">
                                <span class="meme-tag" style="font-size: 0.6rem;">${item.tag}</span>
                                <h4>${item.title}</h4>
                                <button class="deploy-btn" onclick="vault.deploy('${item.title}')">Deploy Asset</button>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align:center; font-weight:bold;">NO ASSETS FOUND. GET TO WORK.</p>'}
                </div>
            </div>
            <div class="marquee" style="border-top: var(--border-width) solid black; border-bottom:none;">
                <span>STAY VIGILANT OPERATIVE // TRUST THE PROCESS // MEMES ARE THE ONLY CURRENCY ☢️</span>
            </div>
        `;
    }

    init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = VAULT_STYLES;
        document.head.appendChild(styleSheet);

        const bunkerEl = document.createElement('div');
        bunkerEl.id = 'operative-bunker';
        document.body.appendChild(bunkerEl);

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'bunker-toggle-btn';
        toggleBtn.innerHTML = 'OPEN<br>BUNKER';
        toggleBtn.onclick = () => this.toggle();
        document.body.appendChild(toggleBtn);

        this.render();
        this.interceptActions();
    }

    toggle() {
        document.getElementById('operative-bunker').classList.toggle('open');
    }

    setTab(tab) {
        this.currentTab = tab;
        this.render();
    }

    deploy(title) {
        alert(`DEPLOYING ASSET: ${title}\nRedirecting to secure social uplink...`);
    }

    interceptActions() {
        // Hook into the main page's buttons
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn') && e.target.innerText === 'SHARE') {
                const card = e.target.closest('.meme-card');
                const title = card.querySelector('h3').innerText;
                const tag = card.querySelector('.meme-tag').innerText;
                const img = card.querySelector('img').src;
                
                this.data.savedMemes.unshift({ id: Date.now(), title, tag, img });
                this.updateClearance();
                this.render();
                
                const btn = e.target;
                btn.innerText = 'SAVED';
                btn.style.color = 'var(--red)';
                setTimeout(() => { btn.innerText = 'SHARE'; btn.style.color = ''; }, 2000);
            }
        });
    }
}

const vault = new OperativeVault();