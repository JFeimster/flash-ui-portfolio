const trendingGrenades = [
    { text: "The state is a hallucination with a budget.", shares: 1240, cat: "liberty", radius: "9.2KM" },
    { text: "Sovereignty is a skill, not a right.", shares: 1082, cat: "liberty", radius: "8.5KM" },
    { text: "Build things that make the government obsolete.", shares: 954, cat: "founder", radius: "7.9KM" },
    { text: "Protocol > Politics.", shares: 821, cat: "liberty", radius: "6.4KM" },
    { text: "Permission is for people who don't have code.", shares: 730, cat: "founder", radius: "5.8KM" },
    { text: "Exit is the only real voice.", shares: 612, cat: "liberty", radius: "5.1KM" },
    { text: "The future is a series of opt-in networks.", shares: 545, cat: "liberty", radius: "4.7KM" },
    { text: "Optimism is a moral duty, pessimism is a luxury.", shares: 492, cat: "metamodern", radius: "4.2KM" },
    { text: "Code is the only law that doesn't require police.", shares: 388, cat: "founder", radius: "3.9KM" }
];

function renderLeaderboard() {
    const wallSection = document.querySelector('.wall .container');
    if (!wallSection) return;

    // Create Leaderboard Header if it doesn't exist or replace existing grid
    const existingGrid = wallSection.querySelector('.grid-layout');
    
    const leaderboardStyles = `
        <style>
            .blast-radius-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
                margin-top: 40px;
            }
            .leaderboard-item {
                display: grid;
                grid-template-columns: 80px 1fr 150px 150px;
                align-items: center;
                background: #000;
                color: #fff;
                border: 2px solid #fff;
                padding: 15px 20px;
                font-family: 'IBM Plex Mono', monospace;
                transition: all 0.2s;
            }
            .leaderboard-item:hover {
                background: #ff3c00;
                transform: translateX(10px);
            }
            .rank-num { font-weight: 900; font-size: 1.5rem; color: #ff3c00; }
            .leaderboard-item:hover .rank-num { color: #000; }
            .quote-snippet { text-transform: uppercase; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 20px; }
            .stat-label { font-size: 0.7rem; color: #888; display: block; }
            .leaderboard-item:hover .stat-label { color: #eee; }
            
            @media (max-width: 768px) {
                .leaderboard-item {
                    grid-template-columns: 50px 1fr;
                    gap: 10px;
                }
                .stat-hide { display: none; }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', leaderboardStyles);

    const header = `
        <div style="margin-bottom: 20px; border-bottom: 4px solid #ff3c00; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end;">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">[ DATA_STREAM: TRENDING_EXPLOSIONS ]</span>
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">RESETS: EVERY 24H</span>
        </div>
    `;

    let gridHTML = '<div class="blast-radius-grid">';
    
    trendingGrenades.forEach((item, index) => {
        gridHTML += `
            <div class="leaderboard-item">
                <div class="rank-num">#${(index + 1).toString().padStart(2, '0')}</div>
                <div class="quote-snippet">${item.text}</div>
                <div class="stat-hide">
                    <span class="stat-label">BLAST RADIUS</span>
                    ${item.radius}
                </div>
                <div class="stat-hide">
                    <span class="stat-label">SHARES</span>
                    ${item.shares.toLocaleString()}
                </div>
            </div>
        `;
    });

    gridHTML += '</div>';

    if (existingGrid) {
        existingGrid.outerHTML = header + gridHTML;
    }
}

// Initialize the render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLeaderboard);
} else {
    renderLeaderboard();
}

// Export for local storage updates if needed
window.updateBlastRadius = function(newQuote) {
    const mockRadius = (Math.random() * 5).toFixed(1) + "KM";
    trendingGrenades.unshift({
        text: newQuote,
        shares: 1,
        cat: "recent",
        radius: mockRadius
    });
    if(trendingGrenades.length > 12) trendingGrenades.pop();
    renderLeaderboard();
};