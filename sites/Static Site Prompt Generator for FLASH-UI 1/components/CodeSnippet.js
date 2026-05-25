class FlashCodeSnippet extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activeTab = 'preview';
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'code'];
    }

    attributeChangedCallback() {
        this.render();
    }

    copyCode() {
        const code = this.getAttribute('code');
        navigator.clipboard.writeText(code);
        const btn = this.shadowRoot.querySelector('.copy-btn');
        const originalText = btn.innerText;
        btn.innerText = 'COPIED';
        setTimeout(() => btn.innerText = originalText, 2000);
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || 'Component';
        const code = this.getAttribute('code') || '';
        
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                margin-bottom: 2rem;
                font-family: 'Space Grotesk', sans-serif;
            }

            .container {
                background: #0d0d0d;
                border: 1px solid #222;
                border-radius: 12px;
                overflow: hidden;
            }

            .header {
                padding: 12px 20px;
                border-bottom: 1px solid #222;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.02);
            }

            .title {
                font-family: 'Space Mono', monospace;
                font-size: 0.75rem;
                color: #00f2ff;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .tabs {
                display: flex;
                gap: 10px;
            }

            .tab-btn {
                background: none;
                border: none;
                color: #888;
                font-family: 'Space Mono', monospace;
                font-size: 0.7rem;
                cursor: pointer;
                padding: 4px 8px;
                transition: all 0.2s;
            }

            .tab-btn.active {
                color: #fff;
                border-bottom: 1px solid #00f2ff;
            }

            .content {
                padding: 24px;
                min-height: 100px;
                background-image: 
                    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                background-size: 20px 20px;
            }

            .preview-area {
                display: ${this.activeTab === 'preview' ? 'block' : 'none'};
            }

            .code-area {
                display: ${this.activeTab === 'code' ? 'block' : 'none'};
                margin: 0;
            }

            pre {
                background: #050505;
                padding: 16px;
                border-radius: 8px;
                color: #00f2ff;
                font-family: 'Space Mono', monospace;
                font-size: 0.85rem;
                overflow-x: auto;
                margin: 0;
                border: 1px solid #1a1a1a;
            }

            .footer {
                padding: 10px 20px;
                border-top: 1px solid #222;
                display: flex;
                justify-content: flex-end;
            }

            .copy-btn {
                background: transparent;
                border: 1px solid #222;
                color: #888;
                padding: 6px 12px;
                border-radius: 4px;
                font-family: 'Space Mono', monospace;
                font-size: 0.65rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .copy-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                border-color: #444;
            }

            /* Slot styling for preview content */
            ::slotted(*) {
                max-width: 100%;
            }
        </style>

        <div class="container">
            <div class="header">
                <div class="title">${title}</div>
                <div class="tabs">
                    <button class="tab-btn ${this.activeTab === 'preview' ? 'active' : ''}" onclick="this.getRootNode().host.switchTab('preview')">PREVIEW</button>
                    <button class="tab-btn ${this.activeTab === 'code' ? 'active' : ''}" onclick="this.getRootNode().host.switchTab('code')">SOURCE</button>
                </div>
            </div>
            
            <div class="content">
                <div class="preview-area">
                    <slot></slot>
                </div>
                <div class="code-area">
                    <pre><code>${this.escapeHtml(code)}</code></pre>
                </div>
            </div>

            <div class="footer">
                <button class="copy-btn" onclick="this.getRootNode().host.copyCode()">COPY_TO_CLIPBOARD</button>
            </div>
        </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('flash-code-snippet', FlashCodeSnippet);

// Library of Predefined FLASH-UI Primitives
const FLASH_LIBRARY = {
    bentoCard: {
        title: "Primitive // Bento Card",
        code: `<div class="card">\n  <div class="card-label">Module 01</div>\n  <h3>Data Stream</h3>\n  <p>Real-time telemetry integration.</p>\n</div>`,
        html: `<div style="background: #0d0d0d; border: 1px solid #222; border-radius: 16px; padding: 24px; max-width: 300px;">
                <div style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #00f2ff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 6px; height: 6px; background: #00f2ff; border-radius: 50%; box-shadow: 0 0 10px #00f2ff;"></span>
                    MODULE 01
                </div>
                <h3 style="color: #fff; margin-bottom: 8px;">Data Stream</h3>
                <p style="color: #888; font-size: 0.9rem;">Real-time telemetry integration for high-fidelity monitoring.</p>
              </div>`
    },
    commandInput: {
        title: "Primitive // Command Input",
        code: `<div class="input-group">\n  <label>Terminal Query</label>\n  <input type="text" placeholder="root@flash-ui:~$">\n</div>`,
        html: `<div>
                <label style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #888; display: block; margin-bottom: 8px;">Terminal Query</label>
                <input type="text" placeholder="root@flash-ui:~$" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid #222; border-radius: 8px; padding: 12px; color: #00f2ff; font-family: 'Space Mono', monospace;">
              </div>`
    },
    neonButton: {
        title: "Primitive // Glow Action",
        code: `<button class="btn-glow">EXECUTE_SYSTEM_PROMPT</button>`,
        html: `<button style="background: #00f2ff; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);">EXECUTE_SYSTEM_PROMPT</button>`
    }
};

/**
 * Utility to inject the Codex into a target container
 */
function initComponentCodex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    Object.values(FLASH_LIBRARY).forEach(item => {
        const snippet = document.createElement('flash-code-snippet');
        snippet.setAttribute('title', item.title);
        snippet.setAttribute('code', item.code);
        snippet.innerHTML = item.html;
        container.appendChild(snippet);
    });
}