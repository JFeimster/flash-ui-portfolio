const style = document.createElement('style');
style.textContent = `
    .blast-radius-section {
        background-color: var(--cream);
        padding: 80px 0;
        border-top: var(--border);
        border-bottom: var(--border);
    }

    .masonry-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-auto-rows: 160px;
        gap: 30px;
        padding: 40px 0;
    }

    .masonry-item {
        background: var(--white);
        border: var(--border);
        box-shadow: 10px 10px 0px var(--black);
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .masonry-item:hover {
        transform: translate(-4px, -4px);
        box-shadow: 14px 14px 0px var(--red);
        z-index: 10;
    }

    /* Staggered Sizes */
    .masonry-item.span-2 { grid-row: span 2; }
    .masonry-item.span-3 { grid-row: span 3; }
    .masonry-item.wide { grid-column: span 2; }

    @media (max-width: 768px) {
        .masonry-item.wide { grid-column: span 1; }
        .masonry-container { grid-auto-rows: auto; }
        .masonry-item { min-height: 250px; }
    }

    .item-rank {
        position: absolute;
        top: -15px;
        left: -15px;
        background: var(--red);
        color: var(--white);
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        border: 3px solid var(--black);
        transform: rotate(-10deg);
        font-size: 1.2rem;
    }

    .item-quote {
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        font-size: 1.6rem;
        line-height: 1.1;
        text-transform: uppercase;
        margin-top: 10px;
    }

    .item-footer {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .item-stats {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.7rem;
        background: var(--black);
        color: var(--white);
        padding: 4px 8px;
        text-transform: uppercase;
    }

    .item-badge {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: bold;
        font-size: 0.7rem;
        color: var(--red);
    }
`;
document.head.appendChild(style);

const hallOfFameData = [
    { text: "The state is a hallucination with a budget.", shares: "42.8k", class: "span-2 wide", tag: "TOP EXPLOSION" },
    { text: "Sovereignty is a skill, not a right.", shares: "31.2k", class: "span-2", tag: "CRITICAL HIT" },
    { text: "Build things that make the government obsolete.", shares: "28.5k", class: "span-3", tag: "FOUNDER TRUTH" },
    { text: "Protocol is greater than politics.", shares: "19.1k", class: "span-2", tag: "CODE IS LAW" },
    { text: "Exit is the only real voice.", shares: "15.4k", class: "span-1", tag: "STRATEGIC" },
    { text: "Permission is for people who don't have code.", shares: "12.9k", class: "span-2 wide", tag: "UNSTOPPABLE" },
    { text: "Consensus is a trap. Conviction is a tool.", shares: "9.8k", class: "span-2", tag: "CONTRARIAN" },
    { text: "Logic is the ultimate weapon of the unarmed.", shares: "8.2k", class: "span-1", tag: "RIFF" }
];

function initBlastRadius() {
    const wallSection = document.querySelector('.wall');
    if (!wallSection) return;

    const blastRadiusHTML = `
        <div class="blast-radius-section">
            <div class="container">
                <h2 class="wall-title" style="margin-bottom: 0;">THE BLAST RADIUS</h2>
                <p style="font-family: 'IBM Plex Mono', monospace; font-weight: bold; margin-bottom: 40px;">// HALL OF FAME: MOST IMPACTFUL DETONATIONS THIS WEEK</p>
                <div class="masonry-container">
                    ${hallOfFameData.map((item, index) => `
                        <div class="masonry-item ${item.class}">
                            <div class="item-rank">#${index + 1}</div>
                            <div class="item-quote">"${item.text}"</div>
                            <div class="item-footer">
                                <div class="item-stats">SHARES: ${item.shares}</div>
                                <div class="item-badge">${item.tag}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    wallSection.insertAdjacentHTML('beforebegin', blastRadiusHTML);
    
    // Optional: Add slight random rotation to items for chaotic look
    document.querySelectorAll('.masonry-item').forEach(item => {
        const rot = (Math.random() * 2 - 1).toFixed(2);
        item.style.transform = `rotate(${rot}deg)`;
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = `rotate(0deg) scale(1.02) translate(-4px, -4px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = `rotate(${rot}deg)`;
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlastRadius);
} else {
    initBlastRadius();
}