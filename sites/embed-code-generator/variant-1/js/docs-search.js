const docsData = [
    {
        id: 'wix-integration',
        title: 'Wix Platform Setup',
        category: 'Platforms',
        content: 'To embed on Wix, use the Embed HTML element. Ensure "Server Side" is disabled for mobile responsiveness.',
        tags: ['wix', 'iframe', 'mobile', 'setup']
    },
    {
        id: 'wordpress-gutenberg',
        title: 'WordPress Custom HTML',
        category: 'Platforms',
        content: 'Use the Gutenberg Custom HTML block. For Elementor users, the HTML widget is recommended for better layout control.',
        tags: ['wordpress', 'wp', 'elementor', 'gutenberg']
    },
    {
        id: 'framer-webflow',
        title: 'Framer & Webflow Embeds',
        category: 'Platforms',
        content: 'Set width to 100% and height to auto. Use the Embed utility to paste the Moonshine snippet directly into the canvas.',
        tags: ['framer', 'webflow', 'nocode', 'css']
    },
    {
        id: 'css-overrides',
        title: 'Custom CSS Overrides',
        category: 'Developer',
        content: 'Override the widget theme by targeting .ms-widget-container. Example: filter: hue-rotate(90deg) to shift neon colors.',
        tags: ['css', 'styling', 'branding', 'customization']
    },
    {
        id: 'z-index-fix',
        title: 'Troubleshooting: Z-Index Conflicts',
        category: 'Troubleshooting',
        content: 'If the widget appears behind navigation menus, add style="position:relative; z-index:1;" to the iframe code.',
        tags: ['z-index', 'layering', 'bug', 'fix']
    },
    {
        id: 'mobile-scrolling',
        title: 'Mobile Touch Responsiveness',
        category: 'Troubleshooting',
        content: 'Prevent double scrollbars on mobile by setting overflow:hidden on the parent container of the iframe.',
        tags: ['mobile', 'scroll', 'touch', 'overflow']
    }
];

class DocsSearch {
    constructor() {
        this.searchInput = document.getElementById('docs-search-input');
        this.resultsContainer = document.getElementById('docs-results-container');
        this.categoryFilters = document.querySelectorAll('.category-filter');
        this.currentFilter = 'all';
        
        if (this.searchInput) {
            this.init();
        }
    }

    init() {
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        this.categoryFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.category;
                this.handleSearch(this.searchInput.value);
            });
        });

        // Initial render
        this.renderResults(docsData);
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        const filtered = docsData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(searchTerm) || 
                                 item.content.toLowerCase().includes(searchTerm) ||
                                 item.tags.some(t => t.includes(searchTerm));
            
            const matchesCategory = this.currentFilter === 'all' || item.category.toLowerCase() === this.currentFilter.toLowerCase();
            
            return matchesQuery && matchesCategory;
        });

        this.renderResults(filtered);
    }

    renderResults(results) {
        if (!this.resultsContainer) return;

        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-dim); border: 1px dashed var(--border); border-radius: 8px;">
                    <p>No documentation matches your search criteria.</p>
                </div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = results.map(item => `
            <div class="panel doc-card" style="margin-bottom: 1rem; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" data-id="${item.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="font-size: 1.1rem; color: var(--neon-blue); margin-bottom: 0.5rem;">${item.title}</h3>
                    <span style="font-size: 0.7rem; color: var(--neon-green); border: 1px solid var(--neon-green); padding: 2px 8px; border-radius: 10px;">${item.category}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-dim);">${item.content}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${item.tags.map(tag => `<span style="font-family: var(--font-mono); font-size: 0.7rem; color: #7ee787;">#${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        this.attachCardListeners();
    }

    attachCardListeners() {
        const cards = this.resultsContainer.querySelectorAll('.doc-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'var(--neon-blue)';
                card.style.boxShadow = '0 0 15px var(--accent-glow)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = 'var(--border)';
                card.style.boxShadow = 'none';
            });
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                console.log(`Navigating to documentation: ${id}`);
                // In a real implementation, this would navigate to the detail page or scroll to section
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moonshineSearch = new DocsSearch();
});