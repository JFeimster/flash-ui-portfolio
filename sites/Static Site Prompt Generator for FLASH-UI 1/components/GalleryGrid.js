const galleryData = [
    {
        id: 1,
        title: "Hyper-Growth SaaS Landing",
        author: "Ox_Zero",
        category: "High-Conversion",
        description: "Optimized for B2B conversion with high-contrast sections and subtle depth.",
        prompt: "Create a high-fidelity FLASH-UI Landing Page. Visual Aesthetic: Clean Apple-esque Corporate. Component Manifest: Hero Header, Bento Feature Grid, Social Proof, FAQ Accordion."
    },
    {
        id: 2,
        title: "Terminal-Style Dashboard",
        author: "Ghost_Shell",
        category: "Brutalist",
        description: "A data-heavy interface for developers and power users.",
        prompt: "Create a high-fidelity FLASH-UI SaaS Dashboard. Visual Aesthetic: Cyberpunk Command Console. Component Manifest: Live Data Feed, Bento Feature Grid, System Logs."
    },
    {
        id: 3,
        title: "White-Label Design System",
        author: "NexusLabs",
        category: "SaaS Minimalist",
        description: "Ultra-thin lines, massive whitespace, and Swiss-inspired typography.",
        prompt: "Create a high-fidelity FLASH-UI Portfolio Site. Visual Aesthetic: Minimalist Swiss High-Contrast. Component Manifest: Hero Header, Integration Logos, Newsletter Footer."
    },
    {
        id: 4,
        title: "DeFi Protocol Interface",
        author: "Chain_Architect",
        category: "High-Conversion",
        description: "Complex financial data visualization with glassmorphism.",
        prompt: "Create a high-fidelity FLASH-UI Directory/Listings. Visual Aesthetic: Bento-grid Glassmorphism. Component Manifest: Live Data Feed, Hero Header, Pricing Table."
    }
];

const galleryStyles = `
    .gallery-nexus {
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .gallery-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid var(--border);
        padding-bottom: 20px;
    }

    .gallery-controls {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .search-input {
        background: var(--glass);
        border: 1px solid var(--border);
        color: var(--text-main);
        padding: 8px 16px;
        border-radius: 8px;
        font-family: var(--font-main);
        min-width: 250px;
    }

    .filter-tags {
        display: flex;
        gap: 10px;
    }

    .tag-btn {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-dim);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tag-btn.active {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--accent-glow);
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
    }

    .nexus-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .nexus-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
    }

    .nexus-card .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nexus-card .author {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
    }

    .nexus-card h3 {
        font-size: 1.25rem;
        letter-spacing: -0.5px;
    }

    .nexus-card p {
        font-size: 0.9rem;
        color: var(--text-dim);
        line-height: 1.4;
    }

    .nexus-card .stats {
        display: flex;
        gap: 15px;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--text-dim);
        margin-top: auto;
    }

    .btn-fork {
        background: var(--glass);
        border: 1px solid var(--border);
        color: var(--text-main);
        padding: 10px;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        text-transform: uppercase;
    }

    .btn-fork:hover {
        background: var(--accent);
        color: #000;
        border-color: var(--accent);
    }
`;

class GalleryGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.filter = 'All';
        this.searchTerm = '';
        this.init();
    }

    init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = galleryStyles;
        document.head.appendChild(styleSheet);
        this.render();
    }

    setFilter(category) {
        this.filter = category;
        this.render();
    }

    setSearch(term) {
        this.searchTerm = term.toLowerCase();
        this.render();
    }

    fork(id) {
        const item = galleryData.find(d => d.id === id);
        if (item) {
            const output = document.getElementById('promptOutput');
            const section = document.getElementById('outputSection');
            if (output && section) {
                output.value = item.prompt;
                section.style.display = 'block';
                window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
            }
        }
    }

    render() {
        const filteredData = galleryData.filter(item => {
            const matchesFilter = this.filter === 'All' || item.category === this.filter;
            const matchesSearch = item.title.toLowerCase().includes(this.searchTerm) || 
                                 item.description.toLowerCase().includes(this.searchTerm);
            return matchesFilter && matchesSearch;
        });

        const categories = ['All', 'High-Conversion', 'Brutalist', 'SaaS Minimalist'];

        this.container.innerHTML = `
            <div class="gallery-nexus">
                <div class="gallery-header">
                    <div>
                        <div class="card-label">Community Repository</div>
                        <h2 style="font-size: 2rem;">Prompt Nexus</h2>
                    </div>
                    <div class="gallery-controls">
                        <input type="text" class="search-input" placeholder="Search prompts..." 
                            oninput="window.nexusGallery.setSearch(this.value)">
                        <div class="filter-tags">
                            ${categories.map(cat => `
                                <button class="tag-btn ${this.filter === cat ? 'active' : ''}" 
                                    onclick="window.nexusGallery.setFilter('${cat}')">${cat}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="gallery-grid">
                    ${filteredData.map(item => `
                        <div class="nexus-card">
                            <div class="meta">
                                <span class="author">BY // ${item.author}</span>
                                <span class="status" style="font-size: 0.6rem; padding: 2px 8px;">${item.category}</span>
                            </div>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <div class="stats">
                                <span>FORKS: ${Math.floor(Math.random() * 1000)}</span>
                                <span>UPVOTES: ${Math.floor(Math.random() * 500)}</span>
                            </div>
                            <button class="btn-fork" onclick="window.nexusGallery.fork(${item.id})">
                                Fork to Console
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    const nexusContainer = document.createElement('div');
    nexusContainer.id = 'nexusContainer';
    document.querySelector('.container').appendChild(nexusContainer);
    window.nexusGallery = new GalleryGrid('nexusContainer');
});