const channelStyles = `
    .channel-matrix-container {
        width: 100%;
        max-width: 500px;
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-radius: 32px;
        padding: 32px;
        margin-top: 24px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .matrix-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .matrix-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: var(--text-main);
    }

    .matrix-grid {
        position: relative;
        height: 300px;
        border-left: 2px solid rgba(255, 255, 255, 0.1);
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        margin: 20px 10px 40px 30px;
    }

    .matrix-axis-label {
        position: absolute;
        font-size: 10px;
        text-transform: uppercase;
        color: var(--text-dim);
        letter-spacing: 1px;
        font-weight: 700;
    }

    .label-y { transform: rotate(-90deg); left: -45px; top: 50%; }
    .label-x { bottom: -35px; left: 50%; transform: translateX(-50%); }

    .quadrant-label {
        position: absolute;
        font-size: 9px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.2);
        font-weight: 800;
        letter-spacing: 0.5px;
    }

    .q-tl { top: 10px; left: 10px; }
    .q-tr { top: 10px; right: 10px; color: rgba(0, 255, 136, 0.3); }
    .q-bl { bottom: 10px; left: 10px; color: rgba(255, 0, 85, 0.3); }
    .q-br { bottom: 10px; right: 10px; }

    .channel-dot {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 10;
    }

    .channel-dot:hover {
        transform: scale(1.5);
    }

    .channel-dot::after {
        content: attr(data-name);
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        font-weight: 600;
        color: var(--text-main);
        opacity: 0.7;
    }

    .dot-seo { background: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }
    .dot-paid { background: var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple); }
    .dot-ref { background: var(--neon-green); box-shadow: 0 0 10px var(--neon-green); }
    .dot-outbound { background: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); }

    .grid-line-v { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.05); }
    .grid-line-h { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.05); }

    .matrix-legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 20px;
        font-size: 11px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-dim);
    }

    .legend-bullet {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }
`;

const channelData = [
    { name: 'SEO', x: 45, y: 75, class: 'dot-seo' },
    { name: 'Paid Ads', x: 85, y: 40, class: 'dot-paid' },
    { name: 'Referrals', x: 20, y: 90, class: 'dot-ref' },
    { name: 'Cold Outreach', x: 60, y: 25, class: 'dot-outbound' }
];

function initChannelOptimizer() {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = channelStyles;
    document.head.appendChild(styleSheet);

    // Create Container
    const container = document.createElement('div');
    container.className = 'channel-matrix-container';
    
    container.innerHTML = `
        <div class="matrix-header">
            <h2 class="matrix-title">Efficiency Matrix</h2>
            <div class="status-badge" style="margin-bottom:0; font-size:9px">Strategic Allocation</div>
        </div>
        
        <div class="matrix-grid">
            <div class="grid-line-v"></div>
            <div class="grid-line-h"></div>
            
            <div class="matrix-axis-label label-y">LTV:CAC Ratio</div>
            <div class="matrix-axis-label label-x">Scale (Volume)</div>
            
            <div class="quadrant-label q-tl">Niche Winners</div>
            <div class="quadrant-label q-tr">Golden Geese</div>
            <div class="quadrant-label q-bl">Red Zone</div>
            <div class="quadrant-label q-br">Scaling Traps</div>
            
            ${channelData.map(channel => `
                <div class="channel-dot ${channel.class}" 
                     data-name="${channel.name}"
                     style="left: ${channel.x}%; bottom: ${channel.y}%">
                </div>
            `).join('')}
        </div>

        <div class="matrix-legend">
            <div class="legend-item"><span class="legend-bullet" style="background:var(--neon-cyan)"></span> Organic Search</div>
            <div class="legend-item"><span class="legend-bullet" style="background:var(--neon-purple)"></span> Paid Channels</div>
            <div class="legend-item"><span class="legend-bullet" style="background:var(--neon-green)"></span> Partner Network</div>
            <div class="legend-item"><span class="legend-bullet" style="background:var(--neon-red)"></span> Direct Sales</div>
        </div>
    `;

    // Append to body after the main card
    const mainCard = document.querySelector('.diagnostic-card');
    if (mainCard) {
        mainCard.after(container);
        
        // Match the wrapper's vertical alignment by wrapping both in a flex container if needed
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.padding = '40px 20px';
        wrapper.style.overflowY = 'auto';
        wrapper.style.height = '100vh';
        wrapper.style.width = '100%';
        
        document.body.prepend(wrapper);
        wrapper.appendChild(mainCard);
        wrapper.appendChild(container);
        document.body.style.overflow = 'auto';
    }
}

// Execute on load
if (document.readyState === 'complete') {
    initChannelOptimizer();
} else {
    window.addEventListener('load', initChannelOptimizer);
}