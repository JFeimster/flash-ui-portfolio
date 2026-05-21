const warRoomStyles = `
    .war-room {
        background: var(--white);
        border-top: var(--border-width) solid var(--black);
        padding: 60px 20px;
        font-family: 'Space Mono', monospace;
    }

    .war-room-header {
        text-align: center;
        margin-bottom: 50px;
    }

    .war-room-title {
        font-family: 'Archivo Black', sans-serif;
        font-size: clamp(2.5rem, 8vw, 5rem);
        text-transform: uppercase;
        background: var(--black);
        color: var(--white);
        display: inline-block;
        padding: 10px 30px;
        transform: skew(-2deg);
    }

    .leaderboard-container {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 40px;
        max-width: 1200px;
        margin: 0 auto;
    }

    @media (max-width: 900px) {
        .leaderboard-container { grid-template-columns: 1fr; }
    }

    .panel {
        border: var(--border-width) solid var(--black);
        background: var(--white);
        box-shadow: var(--shadow);
        padding: 20px;
        position: relative;
    }

    .panel-h2 {
        font-family: 'Archivo Black', sans-serif;
        text-transform: uppercase;
        font-size: 1.5rem;
        margin-bottom: 20px;
        border-bottom: 2px solid var(--black);
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }

    .lethality-meter {
        height: 10px;
        background: #eee;
        border: 2px solid var(--black);
        margin-top: 5px;
        position: relative;
        overflow: hidden;
    }

    .lethality-fill {
        height: 100%;
        background: var(--red);
        width: 0%;
        transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .meme-row {
        margin-bottom: 20px;
        padding: 10px;
        transition: background 0.1s;
    }

    .meme-row:hover {
        background: var(--yellow);
    }

    .rank-num {
        font-family: 'Archivo Black';
        font-size: 1.2rem;
        margin-right: 10px;
    }

    .minister-list {
        list-style: none;
    }

    .minister-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px dashed var(--black);
    }

    .minister-item:last-child { border-bottom: none; }

    .minister-name { font-weight: 700; text-transform: uppercase; }
    .minister-score { color: var(--red); font-weight: 700; }

    .chart-container {
        height: 200px;
        width: 100%;
        background: var(--black);
        margin-top: 20px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        gap: 4px;
        padding: 10px;
    }

    .chart-bar {
        flex: 1;
        background: var(--yellow);
        min-height: 5px;
        position: relative;
    }

    .chart-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--red);
        box-shadow: 0 0 10px var(--red);
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 2px 5px;
        background: var(--red);
        color: var(--white);
        vertical-align: middle;
        margin-left: 10px;
        animation: blink 0.5s infinite alternate;
    }

    @keyframes blink {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .glitch-bar-active {
        animation: glitch-v 0.2s infinite;
    }

    @keyframes glitch-v {
        0% { transform: scaleY(1); }
        50% { transform: scaleY(1.1); filter: hue-rotate(90deg); }
        100% { transform: scaleY(0.9); }
    }
`;

const ministerNames = [
    "CHAOS_ORACLE", "NEON_PROPHET", "MEME_LORD_69", "VOID_POSTER", "BASED_DEPARTMENT",
    "DOOM_SCROLLER", "ALGO_RIPPER", "SIGNAL_JAMMER", "CULT_LEADER_V3", "GHOST_OP"
];

const lethalMemes = [
    { title: "THE FINAL PIXEL WAR", shares: "450k", lethality: 98 },
    { title: "EXECUTIVE ORDER: SHITPOST", shares: "382k", lethality: 92 },
    { title: "VC COPE 2024 (EXTENDED MIX)", shares: "291k", lethality: 85 },
    { title: "LLM SENTIENCE TRAP", shares: "155k", lethality: 74 },
    { title: "GEN ALPHA SLANG PRIMER", shares: "98k", lethality: 61 }
];

function initWarRoom() {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = warRoomStyles;
    document.head.appendChild(styleSheet);

    // Create Section
    const warRoomSection = document.createElement('section');
    warRoomSection.className = 'war-room';
    warRoomSection.id = 'war-room';
    
    warRoomSection.innerHTML = `
        <div class="war-room-header">
            <h2 class="war-room-title">THE WAR ROOM</h2>
            <p style="margin-top: 15px; font-weight: bold;">LIVE LETHALITY TRACKING & PROPAGANDA RANKINGS</p>
        </div>
        <div class="leaderboard-container">
            <div class="panel">
                <div class="panel-h2">
                    MOST LETHAL ASSETS
                    <span class="status-badge">LIVE FEED</span>
                </div>
                <div id="meme-leaderboard"></div>
                <div class="chart-container" id="glitch-chart"></div>
                <p style="font-size: 0.8rem; margin-top: 10px; color: #666;">*Cultural impact calculated via Proprietary Sentiment Aggregator v4.2</p>
            </div>
            <div class="panel">
                <div class="panel-h2">MINISTERS OF TRUTH</div>
                <div class="minister-list" id="minister-leaderboard"></div>
                <div style="margin-top: 30px; border: 2px solid black; padding: 15px; background: var(--yellow);">
                    <h3 style="font-family: 'Archivo Black'; font-size: 1rem; margin-bottom: 5px;">CURRENT PSYOP STATUS</h3>
                    <p id="psyop-msg" style="font-size: 0.9rem; font-weight: bold;">INITIALIZING NODE...</p>
                </div>
            </div>
        </div>
    `;

    // Insert before footer
    const footer = document.querySelector('footer');
    document.body.insertBefore(warRoomSection, footer);

    renderLeaderboards();
    startRealTimeSimulation();
}

function renderLeaderboards() {
    const memeContainer = document.getElementById('meme-leaderboard');
    memeContainer.innerHTML = lethalMemes.map((meme, i) => `
        <div class="meme-row">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span><span class="rank-num">0${i+1}</span> <strong>${meme.title}</strong></span>
                <span style="font-size: 0.8rem;">${meme.shares} SHARES</span>
            </div>
            <div class="lethality-meter">
                <div class="lethality-fill" style="width: ${meme.lethality}%"></div>
            </div>
        </div>
    `).join('');

    const ministerContainer = document.getElementById('minister-leaderboard');
    ministerContainer.innerHTML = ministerNames.slice(0, 8).map((name, i) => `
        <div class="minister-item">
            <span class="minister-name">#${i+1} ${name}</span>
            <span class="minister-score">${(100 - i * 4.5).toFixed(1)}k PK</span>
        </div>
    `).join('');

    // Generate Chart Bars
    const chart = document.getElementById('glitch-chart');
    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = Math.random() * 80 + 10 + '%';
        chart.appendChild(bar);
    }
}

function startRealTimeSimulation() {
    const bars = document.querySelectorAll('.chart-bar');
    const msg = document.getElementById('psyop-msg');
    const messages = [
        "FABRICATING CONSENSUS...",
        "ANALYZING VIRAL VECTORS...",
        "DECODING GENERATIONAL SLANG...",
        "INFILTRATING TIMELINES...",
        "BUFFERING DISCOURSE...",
        "BYPASSING ALGORITHMIC THROTTLING..."
    ];

    setInterval(() => {
        bars.forEach(bar => {
            if (Math.random() > 0.8) {
                bar.style.height = Math.random() * 90 + 5 + '%';
                bar.classList.add('glitch-bar-active');
                setTimeout(() => bar.classList.remove('glitch-bar-active'), 200);
            }
        });

        if (Math.random() > 0.95) {
            msg.innerText = messages[Math.floor(Math.random() * messages.length)];
            msg.style.color = Math.random() > 0.5 ? 'var(--red)' : 'black';
        }
    }, 150);

    // Subtle lethality updates
    setInterval(() => {
        const fills = document.querySelectorAll('.lethality-fill');
        fills.forEach(fill => {
            const currentWidth = parseFloat(fill.style.width);
            const move = (Math.random() - 0.5) * 2;
            fill.style.width = Math.max(10, Math.min(100, currentWidth + move)) + '%';
        });
    }, 2000);
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWarRoom);
} else {
    initWarRoom();
}