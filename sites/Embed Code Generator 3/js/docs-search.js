const docsIndex = [
    {
        title: "Headless SDK Integration",
        category: "API",
        content: "Complete guide to initializing the Partner Widget using our headless JavaScript SDK without iframes.",
        link: "#headless-sdk"
    },
    {
        title: "CSS Custom Properties (White-labeling)",
        category: "Styling",
        content: "List of all --ms-widget-* CSS variables available for deep branding and UI customization.",
        link: "#css-variables"
    },
    {
        title: "Shopify CSP Configuration",
        category: "CMS",
        content: "Resolving Content Security Policy (CSP) errors when embedding widgets on Shopify Liquid templates.",
        link: "#shopify-csp"
    },
    {
        title: "Webhook Signature Verification",
        category: "Security",
        content: "How to securely verify incoming application data using the X-Moonshine-Signature header.",
        link: "#webhooks"
    },
    {
        title: "Dynamic Height Resizing",
        category: "Integration",
        content: "Implementation of the postMessage API to automatically adjust iframe height based on widget content.",
        link: "#dynamic-height"
    },
    {
        title: "Advanced Tracking Parameters",
        category: "API",
        content: "Mapping custom UTM parameters and sub-affiliate IDs to the partner application flow.",
        link: "#tracking"
    },
    {
        title: "WordPress Shortcode API",
        category: "CMS",
        content: "Creating a custom WordPress plugin to wrap widget configurations in easy-to-use shortcodes.",
        link: "#wordpress-shortcodes"
    },
    {
        title: "Restricted Environment Polyfills",
        category: "Troubleshooting",
        content: "Ensuring compatibility with older enterprise browsers and restrictive corporate firewalls.",
        link: "#polyfills"
    }
];

class DocsSearch {
    constructor() {
        this.isOpen = false;
        this.injectStyles();
        this.createSearchElements();
        this.bindEvents();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .docs-search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 5, 5, 0.9);
                backdrop-filter: blur(4px);
                z-index: 1000;
                display: none;
                justify-content: center;
                padding-top: 10vh;
            }

            .docs-search-modal {
                width: 90%;
                max-width: 600px;
                background: var(--bg-surface);
                border: 1px solid var(--border-bright);
                border-radius: 12px;
                box-shadow: 0 0 50px rgba(0, 240, 255, 0.1);
                overflow: hidden;
                height: fit-content;
                max-height: 70vh;
                display: flex;
                flex-direction: column;
                animation: searchSlideUp 0.2s ease-out;
            }

            @keyframes searchSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .docs-search-header {
                padding: 1rem;
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .docs-search-input {
                flex: 1;
                background: transparent;
                border: none;
                color: var(--text-primary);
                font-size: 1.1rem;
                font-family: 'Inter', sans-serif;
                outline: none;
            }

            .docs-search-results {
                overflow-y: auto;
                padding: 0.5rem;
            }

            .search-result-item {
                padding: 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: var(--transition);
                border: 1px solid transparent;
                text-decoration: none;
                display: block;
                margin-bottom: 0.25rem;
            }

            .search-result-item:hover {
                background: var(--bg-elevated);
                border-color: var(--border);
            }

            .search-result-item .cat {
                font-size: 0.65rem;
                color: var(--neon-blue);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.25rem;
            }

            .search-result-item .title {
                color: var(--text-primary);
                font-weight: 600;
                font-size: 0.95rem;
                margin-bottom: 0.25rem;
            }

            .search-result-item .desc {
                color: var(--text-secondary);
                font-size: 0.8rem;
                line-height: 1.4;
            }

            .search-kbd {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                background: var(--bg-elevated);
                padding: 2px 6px;
                border: 1px solid var(--border);
                border-radius: 4px;
                color: var(--text-muted);
            }

            .empty-state {
                padding: 3rem;
                text-align: center;
                color: var(--text-muted);
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    }

    createSearchElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'docs-search-overlay';
        this.overlay.innerHTML = `
            <div class="docs-search-modal">
                <div class="docs-search-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input type="text" class="docs-search-input" placeholder="Search integration docs (API, CSS, Shopify...)" spellcheck="false">
                    <span class="search-kbd">ESC</span>
                </div>
                <div class="docs-search-results" id="searchResults"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
        this.input = this.overlay.querySelector('.docs-search-input');
        this.resultsContainer = this.overlay.querySelector('#searchResults');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle(true);
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.toggle(false);
            }
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.toggle(false);
        });

        this.input.addEventListener('input', (e) => this.performSearch(e.target.value));
    }

    toggle(state) {
        this.isOpen = state;
        this.overlay.style.display = state ? 'flex' : 'none';
        if (state) {
            this.input.focus();
            this.performSearch('');
        }
    }

    performSearch(query) {
        const term = query.toLowerCase();
        const results = docsIndex.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.content.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term)
        );

        this.renderResults(results);
    }

    renderResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `<div class="empty-state">No documentation found for that query.</div>`;
            return;
        }

        this.resultsContainer.innerHTML = results.map(item => `
            <a href="${item.link}" class="search-result-item" onclick="docsSearch.toggle(false)">
                <div class="cat">${item.category}</div>
                <div class="title">${item.title}</div>
                <div class="desc">${item.content}</div>
            </a>
        `).join('');
    }
}

// Initialize Global Search
const docsSearch = new DocsSearch();

// Helper for UI triggers
window.openMoonshineSearch = () => docsSearch.toggle(true);