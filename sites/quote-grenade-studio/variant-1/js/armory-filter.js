const armoryQuotes = [
    { text: "Sovereignty is a skill, not a right.", cat: "liberty", intensity: 4 },
    { text: "The state is a hallucination with a budget.", cat: "liberty", intensity: 5 },
    { text: "Build things that make the government obsolete.", cat: "founder", intensity: 5 },
    { text: "Optimism is a moral duty, pessimism is a luxury of the bored.", cat: "metamodern", intensity: 3 },
    { text: "If it's not a 'Hell Yes', it's a 'Don't tax me'.", cat: "contrarian", intensity: 4 },
    { text: "Protocol > Politics.", cat: "liberty", intensity: 5 },
    { text: "Exit is the only real voice.", cat: "liberty", intensity: 4 },
    { text: "Your attention is the only remaining scarce resource.", cat: "metamodern", intensity: 3 },
    { text: "Be the glitch in the simulation.", cat: "metamodern", intensity: 2 },
    { text: "Permission is for people who don't have code.", cat: "founder", intensity: 5 },
    { text: "The future is a series of opt-in networks.", cat: "liberty", intensity: 3 },
    { text: "Everything is a remix, but the ownership is mine.", cat: "founder", intensity: 2 },
    { text: "Logic is the ultimate weapon of the unarmed.", cat: "contrarian", intensity: 4 },
    { text: "The most radical thing you can do is be happy.", cat: "metamodern", intensity: 3 },
    { text: "Stop asking for a seat at the table and build your own floor.", cat: "founder", intensity: 5 },
    { text: "Consensus is a trap. Conviction is a tool.", cat: "contrarian", intensity: 4 },
    { text: "Taxes are the subscription fee for a service you can't cancel.", cat: "liberty", intensity: 5 },
    { text: "Play stupid games, win stupid regulations.", cat: "contrarian", intensity: 3 },
    { text: "Code is the only law that doesn't require a police force.", cat: "founder", intensity: 5 },
    { text: "They can't cancel what they can't coordinate.", cat: "metamodern", intensity: 4 },
    { text: "The algorithm is the new geography.", cat: "metamodern", intensity: 3 },
    { text: "Privacy is not for those with something to hide, but for those with something to protect.", cat: "liberty", intensity: 4 },
    { text: "Don't fix the system. Build its replacement.", cat: "founder", intensity: 5 },
    { text: "Medium is the message. Ownership is the mission.", cat: "founder", intensity: 4 },
    { text: "Centralization is a bug, not a feature.", cat: "liberty", intensity: 5 },
    { text: "Argue for your limitations and they are yours.", cat: "contrarian", intensity: 2 }
];

let activeCategory = 'all';
let activeIntensity = 0;
let searchQuery = '';

function initArmory() {
    const grid = document.getElementById('armory-grid');
    if (!grid) return;

    renderArmory();

    // Event Listeners for Filters
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.cat;
            renderArmory();
        });
    });

    const intensitySlider = document.getElementById('intensity-range');
    if (intensitySlider) {
        intensitySlider.addEventListener('input', (e) => {
            activeIntensity = parseInt(e.target.value);
            document.getElementById('intensity-value').innerText = activeIntensity > 0 ? activeIntensity : 'ALL';
            renderArmory();
        });
    }

    const searchInput = document.getElementById('armory-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderArmory();
        });
    }
}

function renderArmory() {
    const grid = document.getElementById('armory-grid');
    const filtered = armoryQuotes.filter(q => {
        const matchesCat = activeCategory === 'all' || q.cat === activeCategory;
        const matchesIntensity = activeIntensity === 0 || q.intensity === activeIntensity;
        const matchesSearch = q.text.toLowerCase().includes(searchQuery);
        return matchesCat && matchesIntensity && matchesSearch;
    });

    grid.innerHTML = filtered.map(q => `
        <div class="mini-card" style="border: 4px solid #000; background: #fff; padding: 30px; position: relative; transition: 0.2s; cursor: pointer;" onclick="copyToClipboard('${q.text.replace(/'/g, "\\'")}')">
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; margin-bottom: 15px; display: flex; justify-content: space-between;">
                <span>[ ${q.cat.toUpperCase()} ]</span>
                <span style="color: ${q.intensity >= 4 ? '#ff3c00' : '#000'}">IMPACT: ${'★'.repeat(q.intensity)}</span>
            </div>
            <div style="font-weight: 800; font-size: 1.2rem; line-height: 1.2; text-transform: uppercase;">
                ${q.text}
            </div>
            <div class="card-hover-label" style="position: absolute; bottom: 10px; right: 10px; font-size: 0.6rem; opacity: 0.3; font-family: 'IBM Plex Mono', monospace;">
                CLICK TO CLONE
            </div>
        </div>
    `).join('');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = "GRENADE CLONED";
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        }
    });
}

// Ensure styles for the Armory specific elements are present
const injectArmoryStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .armory-controls {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
            background: #000;
            padding: 20px;
            border: 4px solid #000;
        }
        @media (max-width: 768px) {
            .armory-controls { grid-template-columns: 1fr; }
        }
        .control-box {
            background: #fff;
            padding: 15px;
            border: 2px solid #000;
        }
        .control-box label {
            display: block;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        #armory-search {
            width: 100%;
            padding: 10px;
            font-family: 'IBM Plex Mono', monospace;
            border: 2px solid #000;
            outline: none;
        }
        .filter-tag {
            cursor: pointer;
            padding: 4px 8px;
            border: 1px solid #000;
            font-size: 0.7rem;
            font-family: 'IBM Plex Mono', monospace;
            background: transparent;
        }
        .filter-tag.active {
            background: #000;
            color: #fff;
        }
        input[type=range] {
            width: 100%;
            accent-color: #ff3c00;
        }
        .mini-card:hover {
            transform: translate(-4px, -4px);
            box-shadow: 8px 8px 0px #ff3c00;
        }
    `;
    document.head.appendChild(style);
};

document.addEventListener('DOMContentLoaded', () => {
    injectArmoryStyles();
    initArmory();
});