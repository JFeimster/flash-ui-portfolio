const armoryData = [
    { text: "Sovereignty is a skill, not a right.", cat: "Liberty Riffs", intensity: 5 },
    { text: "The state is a hallucination with a budget.", cat: "Liberty Riffs", intensity: 4 },
    { text: "Build things that make the government obsolete.", cat: "Founder Truths", intensity: 5 },
    { text: "If it's not a 'Hell Yes', it's a 'Don't tax me'.", cat: "Jester Jokes", intensity: 3 },
    { text: "Protocol > Politics.", cat: "Liberty Riffs", intensity: 4 },
    { text: "Exit is the only real voice.", cat: "Liberty Riffs", intensity: 5 },
    { text: "Permission is for people who don't have code.", cat: "Founder Truths", intensity: 4 },
    { text: "Taxes are the subscription fee for a service you can't cancel.", cat: "Liberty Riffs", intensity: 4 },
    { text: "A committee is a life form with six or more legs and no brain.", cat: "Jester Jokes", intensity: 3 },
    { text: "Code is the only law that doesn't require a police force.", cat: "Founder Truths", intensity: 5 },
    { text: "The most radical thing you can do is be happy.", cat: "Jester Jokes", intensity: 2 },
    { text: "Consensus is a trap. Conviction is a tool.", cat: "Founder Truths", intensity: 4 },
    { text: "Decentralize until the center cannot hold.", cat: "Liberty Riffs", intensity: 5 },
    { text: "Logic is the ultimate weapon of the unarmed.", cat: "Jester Jokes", intensity: 2 },
    { text: "Your attention is the only remaining scarce resource.", cat: "Founder Truths", intensity: 3 },
    { text: "The future is a series of opt-in networks.", cat: "Liberty Riffs", intensity: 3 },
    { text: "Stop asking for a seat at the table and build your own floor.", cat: "Founder Truths", intensity: 5 },
    { text: "Everything is a remix, but the ownership is mine.", cat: "Founder Truths", intensity: 2 },
    { text: "They can't cancel what they can't coordinate.", cat: "Liberty Riffs", intensity: 4 },
    { text: "The only way to predict the future is to build the board.", cat: "Founder Truths", intensity: 4 },
    { text: "Government is the art of solving problems that wouldn't exist without it.", cat: "Liberty Riffs", intensity: 5 },
    { text: "I'm not anti-social, I'm just pro-encryption.", cat: "Jester Jokes", intensity: 2 },
    { text: "Scale is the only filter that matters.", cat: "Founder Truths", intensity: 3 },
    { text: "The internet interprets censorship as damage and routes around it.", cat: "Liberty Riffs", intensity: 4 }
];

const armoryStyles = `
    .armory-section {
        background: var(--cream);
        border-top: var(--border);
        padding: 80px 20px;
    }
    .armory-controls {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
        margin-bottom: 60px;
        background: var(--white);
        border: var(--border);
        padding: 30px;
        box-shadow: var(--shadow);
    }
    @media (max-width: 900px) {
        .armory-controls { grid-template-columns: 1fr; }
    }
    .search-input {
        width: 100%;
        padding: 15px;
        border: var(--border);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1rem;
        background: var(--white);
        outline: none;
    }
    .filter-label {
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        text-transform: uppercase;
        display: block;
        margin-bottom: 10px;
        font-size: 0.9rem;
    }
    .intensity-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        background: var(--black);
        outline: none;
        border: 2px solid var(--black);
    }
    .intensity-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 40px;
        background: var(--red);
        cursor: pointer;
        border: 2px solid var(--black);
    }
    .armory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    .grenade-item {
        background: var(--white);
        border: var(--border);
        padding: 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: 0.2s;
    }
    .grenade-item:hover {
        transform: translateY(-5px);
        box-shadow: 6px 6px 0px var(--black);
    }
    .grenade-text {
        font-size: 1.2rem;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 20px;
        line-height: 1.2;
    }
    .grenade-meta {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.75rem;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #ddd;
        padding-top: 15px;
    }
    .cat-tag {
        background: var(--red);
        color: var(--white);
        padding: 2px 8px;
    }
    .intensity-tag {
        font-weight: bold;
    }
`;

function initArmory() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = armoryStyles;
    document.head.appendChild(styleSheet);

    const section = document.createElement('section');
    section.className = 'armory-section';
    section.innerHTML = `
        <div class="container">
            <h2 style="font-family: 'Syne', sans-serif; font-size: 4rem; text-transform: uppercase; margin-bottom: 40px;">The Armory</h2>
            <div class="armory-controls">
                <div>
                    <label class="filter-label">Search Fragments</label>
                    <input type="text" id="armory-search" class="search-input" placeholder="Keyword detonation...">
                </div>
                <div>
                    <label class="filter-label">Ammo Type</label>
                    <select id="armory-cat" class="search-input">
                        <option value="all">ALL PAYLOADS</option>
                        <option value="Founder Truths">FOUNDER TRUTHS</option>
                        <option value="Liberty Riffs">LIBERTY RIFFS</option>
                        <option value="Jester Jokes">JESTER JOKES</option>
                    </select>
                </div>
                <div>
                    <label class="filter-label">Min Intensity: <span id="intensity-val">1</span></label>
                    <input type="range" id="armory-intensity" class="intensity-slider" min="1" max="5" value="1">
                </div>
            </div>
            <div id="armory-grid" class="armory-grid"></div>
        </div>
    `;

    // Inject before footer or at end
    const wall = document.querySelector('.wall');
    if (wall) {
        wall.parentNode.insertBefore(section, wall);
    } else {
        document.body.appendChild(section);
    }

    const searchInput = document.getElementById('armory-search');
    const catSelect = document.getElementById('armory-cat');
    const intensitySlider = document.getElementById('armory-intensity');
    const intensityVal = document.getElementById('intensity-val');
    const grid = document.getElementById('armory-grid');

    function renderArmory() {
        const query = searchInput.value.toLowerCase();
        const cat = catSelect.value;
        const intensity = parseInt(intensitySlider.value);
        intensityVal.innerText = intensity;

        const filtered = armoryData.filter(item => {
            const matchesSearch = item.text.toLowerCase().includes(query);
            const matchesCat = cat === 'all' || item.cat === cat;
            const matchesIntensity = item.intensity >= intensity;
            return matchesSearch && matchesCat && matchesIntensity;
        });

        grid.innerHTML = filtered.map(item => `
            <div class="grenade-item">
                <div class="grenade-text">${item.text}</div>
                <div class="grenade-meta">
                    <span class="cat-tag">${item.cat.toUpperCase()}</span>
                    <span class="intensity-tag">LVL: ${item.intensity}</span>
                </div>
            </div>
        `).join('');
        
        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; font-family: 'IBM Plex Mono'; font-weight: bold; padding: 40px; text-align: center; border: 2px dashed var(--black);">NO GRENADES FOUND. LOWER THE INTENSITY OR CHANGE AMMO.</div>`;
        }
    }

    searchInput.addEventListener('input', renderArmory);
    catSelect.addEventListener('change', renderArmory);
    intensitySlider.addEventListener('input', renderArmory);

    renderArmory();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArmory);
} else {
    initArmory();
}