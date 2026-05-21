const armoryQuotes = [
    { text: "Sovereignty is a skill, not a right.", cat: "liberty" },
    { text: "The state is a hallucination with a budget.", cat: "liberty" },
    { text: "Build things that make the government obsolete.", cat: "founder" },
    { text: "Optimism is a moral duty, pessimism is a luxury of the bored.", cat: "metamodern" },
    { text: "If it's not a 'Hell Yes', it's a 'Don't tax me'.", cat: "contrarian" },
    { text: "Protocol > Politics.", cat: "liberty" },
    { text: "Exit is the only real voice.", cat: "liberty" },
    { text: "Your attention is the only remaining scarce resource.", cat: "metamodern" },
    { text: "Be the glitch in the simulation.", cat: "metamodern" },
    { text: "Permission is for people who don't have code.", cat: "founder" },
    { text: "The future is a series of opt-in networks.", cat: "liberty" },
    { text: "Everything is a remix, but the ownership is mine.", cat: "founder" },
    { text: "Logic is the ultimate weapon of the unarmed.", cat: "contrarian" },
    { text: "The most radical thing you can do is be happy.", cat: "metamodern" },
    { text: "Stop asking for a seat at the table and build your own floor.", cat: "founder" },
    { text: "Consensus is a trap. Conviction is a tool.", cat: "contrarian" },
    { text: "Taxes are the subscription fee for a service you can't cancel.", cat: "liberty" },
    { text: "Play stupid games, win stupid regulations.", cat: "contrarian" },
    { text: "Code is the only law that doesn't require a police force.", cat: "founder" },
    { text: "They can't cancel what they can't coordinate.", cat: "metamodern" }
];

const yieldTypes = {
    'all': 'ALL AMMO',
    'liberty': 'LIBERTY',
    'founder': 'FOUNDRY',
    'metamodern': 'METAMODERN',
    'contrarian': 'CONTRARIAN'
};

let activeFilter = 'all';
let searchString = '';

function initArmory() {
    const wallContainer = document.querySelector('.wall .container');
    const existingGrid = document.querySelector('.grid-layout');
    
    if (!wallContainer || !existingGrid) return;

    // Create Filter UI
    const controls = document.createElement('div');
    controls.style.cssText = 'margin-bottom: 60px; display: flex; flex-direction: column; gap: 30px;';
    
    controls.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: stretch;">
            <input type="text" id="armory-search" placeholder="SEARCH ARCHIVES..." 
                style="background: transparent; border: 4px solid #fff; color: #fff; padding: 20px; font-family: 'IBM Plex Mono', monospace; font-size: 1.2rem; text-transform: uppercase; outline: none;">
            <div style="background: #ff3c00; color: #000; padding: 0 20px; display: flex; align-items: center; font-weight: 900; border: 4px solid #fff;">
                SEARCH
            </div>
        </div>
        <div class="category-group" style="background: transparent; border: 4px solid #fff;">
            <label style="color: #fff; border-color: #fff; margin-bottom: 20px;">FILTER BY YIELD TYPE</label>
            <div class="tag-cloud" id="armory-tags">
                ${Object.entries(yieldTypes).map(([key, label]) => `
                    <button class="tag-btn ${key === 'all' ? 'active' : ''}" 
                        style="border-color: #fff; color: #fff;" 
                        onclick="updateArmoryFilter('${key}')">${label}</button>
                `).join('')}
            </div>
        </div>
    `;

    wallContainer.insertBefore(controls, existingGrid);

    // Search event
    document.getElementById('armory-search').addEventListener('input', (e) => {
        searchString = e.target.value.toLowerCase();
        renderArmory();
    });

    renderArmory();
}

function updateArmoryFilter(cat) {
    activeFilter = cat;
    document.querySelectorAll('#armory-tags .tag-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText === yieldTypes[cat]) btn.classList.add('active');
    });
    renderArmory();
}

function renderArmory() {
    const grid = document.querySelector('.grid-layout');
    if (!grid) return;

    const filtered = armoryQuotes.filter(q => {
        const matchesCat = activeFilter === 'all' || q.cat === activeFilter;
        const matchesSearch = q.text.toLowerCase().includes(searchString);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(q => `
        <div class="mini-card" onclick="copyArmoryQuote(this)" style="position: relative; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: #ff3c00; margin-bottom: 15px;">
                [ ${q.cat.toUpperCase()} // FRAG_${Math.floor(Math.random() * 900 + 100)} ]
            </div>
            <div class="quote-body">${q.text}</div>
            <div style="margin-top: 20px; font-size: 0.6rem; text-decoration: underline; opacity: 0.7; font-family: 'IBM Plex Mono', monospace;">
                CLICK TO COPY FRAGMENT
            </div>
        </div>
    `).join('');
}

function copyArmoryQuote(element) {
    const text = element.querySelector('.quote-body').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalBg = element.style.background;
        const originalColor = element.style.color;
        
        element.style.background = '#ff3c00';
        element.style.color = '#000';
        
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = "FRAGMENT SECURED TO CLIPBOARD";
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        }

        setTimeout(() => {
            element.style.background = originalBg;
            element.style.color = originalColor;
        }, 150);
    });
}

// Global Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArmory);
} else {
    initArmory();
}

// Override tag-btn active styles for dark background via JS injection
const style = document.createElement('style');
style.textContent = `
    #armory-tags .tag-btn.active {
        background: #fff !important;
        color: #000 !important;
    }
    #armory-tags .tag-btn:hover {
        background: rgba(255,255,255,0.1);
    }
`;
document.head.appendChild(style);