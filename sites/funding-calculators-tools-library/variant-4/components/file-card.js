class FileCard extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'type', 'size', 'date', 'tags', 'selected'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._selected = false;
    }

    get name() { return this.getAttribute('name') || 'Untitled File'; }
    set name(val) { this.setAttribute('name', val); }

    get type() { return (this.getAttribute('type') || 'unknown').toLowerCase(); }
    set type(val) { this.setAttribute('type', val); }

    get size() { return this.getAttribute('size') || '0 KB'; }
    set size(val) { this.setAttribute('size', val); }

    get date() { return this.getAttribute('date') || 'Recent'; }
    set date(val) { this.setAttribute('date', val); }

    get tags() { 
        const tagsAttr = this.getAttribute('tags');
        if (!tagsAttr) return [];
        return tagsAttr.split(',').map(t => t.trim()).filter(Boolean);
    }
    set tags(val) { 
        if (Array.isArray(val)) {
            this.setAttribute('tags', val.join(','));
        } else {
            this.setAttribute('tags', val);
        }
    }

    get selected() { return this.hasAttribute('selected'); }
    set selected(val) {
        if (val) {
            this.setAttribute('selected', '');
        } else {
            this.removeAttribute('selected');
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.setupEventListeners();
        }
    }

    getFileConfig() {
        const type = this.type;
        const configs = {
            pdf: { icon: '📕', color: 'var(--accent-magenta, #ff007a)' },
            xls: { icon: '📊', color: 'var(--accent-lime, #39ff14)' },
            xlsx: { icon: '📊', color: 'var(--accent-lime, #39ff14)' },
            csv: { icon: '📈', color: 'var(--accent-lime, #39ff14)' },
            doc: { icon: '📄', color: 'var(--accent-cyan, #00f0ff)' },
            docx: { icon: '📄', color: 'var(--accent-cyan, #00f0ff)' },
            txt: { icon: '📝', color: 'var(--accent-cyan, #00f0ff)' },
            zip: { icon: '📦', color: 'var(--accent-orange, #ff5c00)' },
            rar: { icon: '📦', color: 'var(--accent-orange, #ff5c00)' },
            png: { icon: '🖼️', color: 'var(--accent-magenta, #ff007a)' },
            jpg: { icon: '🖼️', color: 'var(--accent-magenta, #ff007a)' },
            jpeg: { icon: '🖼️', color: 'var(--accent-magenta, #ff007a)' }
        };
        return configs[type] || { icon: '📁', color: 'var(--accent-cyan, #00f0ff)' };
    }

    setupEventListeners() {
        const checkbox = this.shadowRoot.querySelector('.custom-checkbox');
        const card = this.shadowRoot.querySelector('.card');
        const viewBtn = this.shadowRoot.querySelector('.action-view');
        const downloadBtn = this.shadowRoot.querySelector('.action-download');
        const deleteBtn = this.shadowRoot.querySelector('.action-delete');

        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                this._selected = e.target.checked;
                if (this._selected) {
                    this.setAttribute('selected', '');
                } else {
                    this.removeAttribute('selected');
                }
                this.dispatchEvent(new CustomEvent('file-select', {
                    detail: { name: this.name, selected: this._selected },
                    bubbles: true,
                    composed: true
                }));
            });
        }

        // Clicking card body (excluding controls) selects it
        if (card) {
            card.addEventListener('click', (e) => {
                const target = e.composedPath()[0];
                if (target.closest('.custom-checkbox') || target.closest('.action-btn') || target.closest('.icon-btn')) {
                    return;
                }
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('file-view', {
                    detail: { name: this.name, type: this.type },
                    bubbles: true,
                    composed: true
                }));
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('file-download', {
                    detail: { name: this.name, type: this.type },
                    bubbles: true,
                    composed: true
                }));
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('file-delete', {
                    detail: { name: this.name },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }

    render() {
        const isSelected = this.hasAttribute('selected');
        const config = this.getFileConfig();
        const tagsHtml = this.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --theme-color: ${config.color};
                }

                .card {
                    background: var(--bg-secondary, #0f111a);
                    border: 2px solid var(--border-color, #242b3d);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 5px 5px 0px var(--border-color, #242b3d);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    cursor: pointer;
                    user-select: none;
                    height: 100%;
                    min-height: 200px;
                }

                .card:hover {
                    transform: translate(-4px, -4px);
                    border-color: var(--theme-color);
                    box-shadow: 9px 9px 0px var(--theme-color);
                }

                .card.selected-state {
                    border-color: var(--accent-orange, #ff5c00);
                    box-shadow: 9px 9px 0px var(--accent-orange, #ff5c00);
                    background: var(--bg-tertiary, #161a26);
                }

                /* Brutalist Checkbox */
                .checkbox-container {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    z-index: 5;
                }

                .custom-checkbox {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: var(--bg-primary, #08090d);
                    border: 2px solid var(--border-color, #242b3d);
                    cursor: pointer;
                    position: relative;
                    display: block;
                    transition: all 0.1s ease;
                }

                .custom-checkbox:hover {
                    border-color: var(--theme-color);
                }

                .custom-checkbox:checked {
                    background: var(--accent-orange, #ff5c00);
                    border-color: #000000;
                    box-shadow: 2px 2px 0px #000000;
                }

                .custom-checkbox:checked::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #000000;
                    font-weight: 900;
                    font-size: 12px;
                }

                /* Layout Details */
                .card-top {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 18px;
                    margin-right: 28px;
                }

                .file-icon {
                    font-size: 24px;
                    background: var(--bg-tertiary, #161a26);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid var(--border-color, #242b3d);
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .card:hover .file-icon {
                    background: var(--theme-color);
                    border-color: #000000;
                    box-shadow: 2px 2px 0px #000000;
                }

                .file-meta {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .file-name {
                    font-family: var(--font-display, 'Space Grotesk', sans-serif);
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-primary, #f3f4f6);
                    text-transform: uppercase;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .file-details {
                    font-size: 11px;
                    color: var(--text-secondary, #9ca3af);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 2px;
                }

                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-bottom: 24px;
                }

                .tag {
                    font-size: 9px;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    background: rgba(36, 43, 61, 0.4);
                    color: var(--text-secondary, #9ca3af);
                    padding: 4px 8px;
                    border: 1px solid var(--border-color, #242b3d);
                }

                .card:hover .tag {
                    border-color: var(--border-hover, #3b4764);
                }

                /* Action Footer */
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid var(--border-color, #242b3d);
                    padding-top: 16px;
                    margin-top: auto;
                }

                .action-btn {
                    background: transparent;
                    border: 2px solid transparent;
                    color: var(--theme-color);
                    text-transform: uppercase;
                    font-family: var(--font-display, 'Space Grotesk', sans-serif);
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    transition: all 0.15s ease;
                }

                .action-btn:hover {
                    background: var(--theme-color);
                    color: #000000;
                    border-color: #000000;
                    box-shadow: 2px 2px 0px #000000;
                }

                .secondary-actions {
                    display: flex;
                    gap: 8px;
                }

                .icon-btn {
                    background: var(--bg-tertiary, #161a26);
                    border: 2px solid var(--border-color, #242b3d);
                    color: var(--text-secondary, #9ca3af);
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.15s ease;
                }

                .icon-btn:hover {
                    border-color: var(--accent-magenta, #ff007a);
                    color: var(--accent-magenta, #ff007a);
                }

                .icon-btn.action-download:hover {
                    border-color: var(--accent-cyan, #00f0ff);
                    color: var(--accent-cyan, #00f0ff);
                }
            </style>

            <div class="card ${isSelected ? 'selected-state' : ''}">
                <div class="checkbox-container">
                    <input type="checkbox" class="custom-checkbox" ${isSelected ? 'checked' : ''}>
                </div>

                <div class="card-top">
                    <div class="file-icon">${config.icon}</div>
                    <div class="file-meta">
                        <div class="file-name" title="${this.name}">${this.name}</div>
                        <div class="file-details">${this.size} &bull; ${this.date}</div>
                    </div>
                </div>

                <div class="tags-container">
                    ${tagsHtml}
                </div>

                <div class="card-footer">
                    <button class="action-btn action-view">
                        View Matrix <span>&rarr;</span>
                    </button>
                    <div class="secondary-actions">
                        <button class="icon-btn action-download" title="Download Asset">
                            &darr;
                        </button>
                        <button class="icon-btn action-delete" title="Purge Record">
                            &times;
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('file-card', FileCard);