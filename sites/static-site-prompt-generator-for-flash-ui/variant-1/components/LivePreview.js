const styles = `
    .codex-container {
        margin-top: 60px;
        padding-top: 40px;
        border-top: 1px dashed var(--border);
    }

    .codex-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 30px;
    }

    .codex-title h2 {
        font-size: 2rem;
        letter-spacing: -1px;
    }

    .codex-grid {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 30px;
        min-height: 500px;
    }

    .component-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .component-nav-item {
        padding: 12px 16px;
        background: var(--glass);
        border: 1px solid var(--border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
    }

    .component-nav-item:hover {
        border-color: var(--text-dim);
    }

    .component-nav-item.active {
        border-color: var(--accent);
        background: var(--accent-glow);
    }

    .component-nav-item .name {
        display: block;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .component-nav-item .tag {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--accent);
        text-transform: uppercase;
    }

    .preview-stage {
        background: #000;
        border: 1px solid var(--border);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .stage-header {
        padding: 12px 20px;
        background: #0a0a0a;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stage-viewport {
        flex-grow: 1;
        padding: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: 
            radial-gradient(var(--border) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .stage-code {
        background: #050505;
        border-top: 1px solid var(--border);
        padding: 20px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-dim);
        max-height: 200px;
        overflow-y: auto;
    }

    .token-attr { color: var(--accent); }
    .token-tag { color: #ff007a; }
    .token-val { color: #7000ff; }

    @media (max-width: 900px) {
        .codex-grid { grid-template-columns: 1fr; }
    }
`;

const components = [
    {
        id: 'bento-card',
        name: 'Bento Cell',
        tag: 'PRIMITIVE-01',
        html: `<div class="card" style="width: 300px; min-height: 180px; position: relative; overflow: hidden;">
    <div class="card-label">Data Node</div>
    <h3 style="margin-top: 10px;">System Terminal</h3>
    <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 10px;">Reactive telemetry monitoring for distributed clusters.</p>
    <div style="margin-top: 20px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent);">STATUS: OPTIMAL</div>
</div>`
    },
    {
        id: 'command-input',
        name: 'Neon Input',
        tag: 'PRIMITIVE-02',
        html: `<div style="width: 100%; max-width: 400px;">
    <label style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); display: block; margin-bottom: 8px;">> ENCRYPTED_FIELD</label>
    <input type="text" value="0x71C24...F31" style="background: rgba(0,242,255,0.05); border: 1px solid var(--accent); border-radius: 4px; box-shadow: 0 0 10px var(--accent-glow);">
</div>`
    },
    {
        id: 'status-badge',
        name: 'System Badge',
        tag: 'PRIMITIVE-03',
        html: `<div style="display: flex; gap: 10px;">
    <span class="status" style="border-color: #ff007a; color: #ff007a;">Critical Warning</span>
    <span class="status" style="border-color: var(--accent); color: var(--accent);">Active Link</span>
</div>`
    },
    {
        id: 'glass-panel',
        name: 'Glass Overlay',
        tag: 'PRIMITIVE-04',
        html: `<div style="padding: 30px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; text-align: center;">
    <div style="width: 50px; height: 50px; background: var(--accent); border-radius: 50%; margin: 0 auto 15px; box-shadow: 0 0 20px var(--accent);"></div>
    <div style="font-weight: 700;">Biometric Lock</div>
</div>`
    }
];

class LivePreview {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeId = components[0].id;
        this.init();
    }

    init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        this.render();
    }

    setActive(id) {
        this.activeId = id;
        this.render();
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    render() {
        const activeComp = components.find(c => c.id === this.activeId);

        this.container.innerHTML = `
            <div class="codex-container">
                <header class="codex-header">
                    <div class="codex-title">
                        <div class="card-label">Library</div>
                        <h2>Component Codex</h2>
                    </div>
                    <div class="status">Primitives: ${components.length} // Selected: ${activeComp.tag}</div>
                </header>

                <div class="codex-grid">
                    <aside class="component-list">
                        ${components.map(comp => `
                            <button class="component-nav-item ${comp.id === this.activeId ? 'active' : ''}" 
                                    onclick="livePreview.setActive('${comp.id}')">
                                <span class="tag">${comp.tag}</span>
                                <span class="name">${comp.name}</span>
                            </button>
                        `).join('')}
                    </aside>

                    <main class="preview-stage">
                        <div class="stage-header">
                            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">Live Output Viewport</div>
                            <div style="display: flex; gap: 5px;">
                                <div style="width: 8px; height: 8px; border-radius: 50%; background: #333;"></div>
                                <div style="width: 8px; height: 8px; border-radius: 50%; background: #333;"></div>
                            </div>
                        </div>
                        <div class="stage-viewport">
                            ${activeComp.html}
                        </div>
                        <div class="stage-code">
                            <pre><code>${this.escapeHtml(activeComp.html)}</code></pre>
                        </div>
                    </main>
                </div>
            </div>
        `;
    }
}

// Global instance for easy access in the prompt lab context
window.addEventListener('DOMContentLoaded', () => {
    const codexAnchor = document.createElement('div');
    codexAnchor.id = 'codex-anchor';
    document.querySelector('.container').appendChild(codexAnchor);
    window.livePreview = new LivePreview('codex-anchor');
});