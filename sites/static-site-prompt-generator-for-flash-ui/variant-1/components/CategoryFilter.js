/**
 * FLASH-UI // CategoryFilter.js
 * Part of Prompt Nexus (Community Gallery)
 */

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    .nexus-filter {
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .nexus-search-bar {
        position: relative;
        display: flex;
        align-items: center;
    }

    .nexus-search-bar input {
        padding-left: 45px;
        height: 54px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.03);
    }

    .nexus-search-bar::before {
        content: '🔍';
        position: absolute;
        left: 18px;
        font-size: 1.2rem;
        opacity: 0.5;
    }

    .category-scroll-container {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 10px;
        scrollbar-width: none;
    }

    .category-scroll-container::-webkit-scrollbar {
        display: none;
    }

    .nexus-chip {
        white-space: nowrap;
        padding: 8px 20px;
        background: var(--glass);
        border: 1px solid var(--border);
        border-radius: 100px;
        color: var(--text-dim);
        font-family: var(--font-mono);
        font-size: 0.75rem;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nexus-chip:hover {
        border-color: var(--text-main);
        color: var(--text-main);
    }

    .nexus-chip.active {
        background: var(--accent);
        color: #000;
        border-color: var(--accent);
        box-shadow: 0 0 20px var(--accent-glow);
        font-weight: 700;
    }

    .filter-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
    }

    .filter-count {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
    }
`;
document.head.appendChild(styleSheet);

const NexusFilter = {
    categories: [
        "All Artifacts",
        "High-Conversion",
        "Brutalist",
        "SaaS Minimalist",
        "E-Commerce",
        "Web3/Crypto",
        "Utility Tools",
        "Dark UI"
    ],

    render(containerId, onFilterChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = `
            <div class="nexus-filter">
                <div class="nexus-search-bar">
                    <input type="text" id="nexusSearch" placeholder="Search community artifacts by keywords, styles, or authors...">
                </div>
                
                <div class="filter-info">
                    <div class="card-label" style="margin:0">Filter by Archetype</div>
                    <div class="filter-count" id="artifactCount">Showing 1,248 Prompts</div>
                </div>

                <div class="category-scroll-container" id="categoryContainer">
                    ${this.categories.map((cat, i) => `
                        <div class="nexus-chip ${i === 0 ? 'active' : ''}" data-category="${cat}">
                            ${cat}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.initEvents(onFilterChange);
    },

    initEvents(callback) {
        const chips = document.querySelectorAll('.nexus-chip');
        const searchInput = document.getElementById('nexusSearch');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                if (callback) {
                    callback({
                        category: chip.dataset.category,
                        search: searchInput.value
                    });
                }
            });
        });

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const activeCategory = document.querySelector('.nexus-chip.active').dataset.category;
                if (callback) {
                    callback({
                        category: activeCategory,
                        search: e.target.value
                    });
                }
            }, 300);
        });
    }
};

window.NexusFilter = NexusFilter;