/**
 * QUOTE GRENADE | FIELD MANUAL (SOCIAL KIT)
 * Tactical deployment assets and high-velocity export logic.
 * v1.0 - [ STATUS: OPERATIONAL ]
 */

const FIELD_MANUAL_CONFIG = {
    tactics: [
        { platform: "X / TWITTER", advice: "High-contrast fragmentation. Deploy during peak news cycles to disrupt the consensus narrative." },
        { platform: "INSTAGRAM", advice: "Square-format brutality. Use the 'RED ALERT' template to bleed through the curated aesthetic." },
        { platform: "SIGNAL / TELEGRAM", advice: "PNG stickers for high-trust circles. Sovereignty is shared in the shadows." }
    ],
    templates: [
        { id: "red-alert", bg: "#ff3c00", text: "#ffffff", border: "#000000" },
        { id: "ghost-white", bg: "#ffffff", text: "#000000", border: "#000000" },
        { id: "void-black", bg: "#000000", text: "#ff3c00", border: "#ffffff" }
    ],
    typography: {
        header: '900 80px "Syne", sans-serif',
        mono: '500 24px "IBM Plex Mono", monospace'
    }
};

/**
 * Generates and downloads a high-resolution brutalist graphic of the current quote.
 */
function downloadTacticalAsset(templateId) {
    const text = document.getElementById('quote-text').innerText;
    if (text.includes('Click "Pull the Pin"')) {
        alert("CRITICAL ERROR: CANNOT EXPORT INERT GRENADE. PULL THE PIN FIRST.");
        return;
    }

    const template = FIELD_MANUAL_CONFIG.templates.find(t => t.id === templateId);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Instagram/Social Square Resolution
    canvas.width = 1080;
    canvas.height = 1080;

    // Background & Heavy Border
    ctx.fillStyle = template.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = template.border;
    ctx.lineWidth = 40;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Text Rendering Setup
    ctx.fillStyle = template.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = FIELD_MANUAL_CONFIG.typography.header;

    // Brutalist Text Wrapping
    const words = text.toUpperCase().split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let metrics = ctx.measureText(currentLine + " " + words[i]);
        if (metrics.width < 850) {
            currentLine += " " + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);

    // Draw Wrapped Text
    const lineHeight = 100;
    const totalHeight = lines.length * lineHeight;
    let startY = (canvas.height / 2) - (totalHeight / 2) + (lineHeight / 2);

    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
    });

    // Branding & Metadata
    ctx.font = FIELD_MANUAL_CONFIG.typography.mono;
    ctx.fillText(`[ SOURCE: QUOTEGRENADE.V1 ]`, canvas.width / 2, canvas.height - 120);
    ctx.fillText(`// NO RIGHTS RESERVED //`, canvas.width / 2, canvas.height - 80);

    // Execute Download
    const link = document.createElement('a');
    link.download = `TACTICAL_ASSET_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/**
 * Injects the Field Manual UI section into the DOM.
 */
function initializeFieldManual() {
    const manualHTML = `
        <section class="wall" id="field-manual" style="background: var(--cream); color: var(--black); border-top: var(--border);">
            <div class="container">
                <h2 class="wall-title" style="color: var(--black); -webkit-text-stroke: 2px var(--red);">FIELD MANUAL</h2>
                <div class="generator-grid">
                    <div class="category-group">
                        <label>TACTICAL DEPLOYMENT ADVICE</label>
                        <div id="tactics-list" style="margin-top: 20px;"></div>
                    </div>
                    <div class="category-group">
                        <label>EXPORT ASSETS (1080px)</label>
                        <div class="tag-cloud" style="margin-top: 20px; display: grid; gap: 10px;">
                            ${FIELD_MANUAL_CONFIG.templates.map(t => `
                                <button class="btn" onclick="downloadTacticalAsset('${t.id}')" style="font-size: 1rem; background: ${t.bg}; color: ${t.text}; border-color: ${t.border}">
                                    GENERATE ${t.id.toUpperCase()}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div style="margin-top: 40px; padding: 20px; border: var(--border); background: var(--white); font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;">
                    <p><strong>TYPOGRAPHY GUIDELINES:</strong></p>
                    <p>> HEADERS: SYNE (EXTRA BOLD) - KERNING: -2PX</p>
                    <p>> BODY: SPACE GROTESK - KERNING: NORMAL</p>
                    <p>> DATA: IBM PLEX MONO - UPPERCASE ONLY</p>
                </div>
            </div>
        </section>
    `;

    const wallSection = document.querySelector('.wall');
    if (wallSection) {
        wallSection.insertAdjacentHTML('beforebegin', manualHTML);
    }

    const tacticsContainer = document.getElementById('tactics-list');
    FIELD_MANUAL_CONFIG.tactics.forEach(t => {
        const item = document.createElement('div');
        item.style.marginBottom = '25px';
        item.innerHTML = `
            <div style="background: var(--black); color: var(--white); display: inline-block; padding: 2px 8px; font-weight: 900; margin-bottom: 5px;">${t.platform}</div>
            <p style="font-size: 1.1rem; font-weight: 700;">${t.advice}</p>
        `;
        tacticsContainer.appendChild(item);
    });
}

// Auto-initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFieldManual);
} else {
    initializeFieldManual();
}