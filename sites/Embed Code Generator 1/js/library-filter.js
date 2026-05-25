const WIDGET_LIBRARY = [
    { id: 'readiness', title: 'Funding Readiness Score', category: 'lead-gen', description: 'Evaluate business funding potential with a data-driven 60-second assessment.', icon: '📊' },
    { id: 'matcher', title: 'Funding Route Matcher', category: 'lead-gen', description: 'Algorithmically match businesses to optimal capital paths based on industry.', icon: '🛣️' },
    { id: 'cta', title: 'Application CTA Button', category: 'conversion', description: 'High-conversion buttons and banners to drive traffic to application flows.', icon: '🖱️' },
    { id: 'checklist', title: 'Document Checklist', category: 'info', description: 'Interactive list of requirements needed for successful capital rounds.', icon: '📋' },
    { id: 'faq', title: 'Funding FAQ Widget', category: 'info', description: 'Contextual answers to the most common borrower questions about Moonshine.', icon: '❓' },
    { id: 'estimator', title: 'Commission Estimator', category: 'partner', description: 'Calculate potential referral earnings in real-time based on deal volume.', icon: '💰' },
    { id: 'profile', title: 'Partner Profile Card', category: 'partner', description: 'Embeddable trust badge showcasing your status as a verified affiliate.', icon: '🛡️' }
];

/**
 * LibraryFilter handles the filtering and display logic for the Widget Showcase.
 * It integrates with the existing Generator UI to allow seamless selection.
 */
class LibraryFilter {
    constructor() {
        this.grid = document.getElementById('library-grid');
        this.searchInput = document.getElementById('library-search');
        this.filterTabs = document.querySelectorAll('.library-filter-tab');
        this.currentFilter = 'all';
        this.currentSearch = '';

        this.init();
    }

    init() {
        if (!this.grid) return;

        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.render();
            });
        }

        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.category;
                this.render();
            });
        });
    }

    render() {
        this.grid.innerHTML = '';
        
        const filtered = WIDGET_LIBRARY.filter(widget => {
            const matchesFilter = this.currentFilter === 'all' || widget.category === this.currentFilter;
            const matchesSearch = widget.title.toLowerCase().includes(this.currentSearch) || 
                                widget.description.toLowerCase().includes(this.currentSearch);
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            this.renderEmptyState();
            return;
        }

        filtered.forEach(widget => {
            const card = this.createCardElement(widget);
            this.grid.appendChild(card);
        });
    }

    createCardElement(widget) {
        const card = document.createElement('div');
        card.className = 'panel library-card';
        card.style.cssText = `
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border);
        `;

        card.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 5px var(--accent-glow));">${widget.icon}</div>
            <h3 style="color: var(--text-main); margin-bottom: 0.75rem; font-size: 1rem; font-weight: 600;">${widget.title}</h3>
            <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; flex-grow: 1; line-height: 1.4;">${widget.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); pt: 1rem; padding-top: 1rem;">
                <span style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--neon-green); text-transform: uppercase;">${widget.category}</span>
                <button class="btn-copy" style="font-size: 0.65rem; border-color: var(--border);">Load Template</button>
            </div>
        `;

        // Interaction logic
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--neon-blue)';
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 10px 20px -10px rgba(0, 242, 255, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border)';
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });

        card.onclick = () => this.selectWidget(widget.id);

        return card;
    }

    renderEmptyState() {
        this.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; border: 1px dashed var(--border); border-radius: 12px;">
                <div style="color: var(--text-dim); margin-bottom: 1rem;">No widgets matching your criteria</div>
                <button class="btn-copy" onclick="document.getElementById('library-search').value=''; document.querySelector('.library-filter-tab[data-category=\\'all\\']').click();">Clear Filters</button>
            </div>
        `;
    }

    selectWidget(id) {
        const widgetTypeSelect = document.getElementById('widgetType');
        if (widgetTypeSelect) {
            widgetTypeSelect.value = id;
            // Trigger the update logic from the base component
            widgetTypeSelect.dispatchEvent(new Event('input'));
            
            // Visual feedback
            const configPanel = document.querySelector('.panel');
            configPanel.style.borderColor = 'var(--neon-green)';
            setTimeout(() => { configPanel.style.borderColor = 'var(--border)'; }, 1000);
            
            // Smooth scroll to top to see preview
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (typeof showToast === 'function') {
                showToast(`Loaded ${id} template`);
            }
        }
    }
}

// Initialize library on load
document.addEventListener('DOMContentLoaded', () => {
    window.msLibrary = new LibraryFilter();
});