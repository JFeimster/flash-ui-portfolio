const widgetTemplates = [
    {
        id: 'tpl-1',
        name: 'High-Conversion Score',
        type: 'score',
        color: '#00f0ff',
        category: 'conversion',
        description: 'Neon-focused tool designed for maximum lead capture.',
        width: '100%',
        height: '500'
    },
    {
        id: 'tpl-2',
        name: 'Minimalist FAQ',
        type: 'faq',
        color: '#39ff14',
        category: 'info',
        description: 'Clean, simplified list for documentation and support.',
        width: '100%',
        height: '600'
    },
    {
        id: 'tpl-3',
        name: 'SaaS Matcher',
        type: 'matcher',
        color: '#8b5cf6',
        category: 'conversion',
        description: 'Purple-themed pathway tool for software-specific funding.',
        width: '100%',
        height: '450'
    },
    {
        id: 'tpl-4',
        name: 'Verification Badge',
        type: 'profile',
        color: '#f4f4f5',
        category: 'partner',
        description: 'Monochrome official partner card for site footers.',
        width: '350px',
        height: '300'
    },
    {
        id: 'tpl-5',
        name: 'Revenue Estimator',
        type: 'calc',
        color: '#f59e0b',
        category: 'info',
        description: 'Gold-accented calculator for partner projections.',
        width: '100%',
        height: '550'
    }
];

function applyTemplate(templateId) {
    const template = widgetTemplates.find(t => t.id === templateId);
    if (!template) return;

    const fields = {
        'widgetType': template.type,
        'brandColor': template.color,
        'width': template.width,
        'height': template.height
    };

    Object.entries(fields).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input'));
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGallery(filter = 'all') {
    const galleryContainer = document.getElementById('templatesGallery');
    if (!galleryContainer) return;

    const filtered = filter === 'all' 
        ? widgetTemplates 
        : widgetTemplates.filter(t => t.category === filter);

    galleryContainer.innerHTML = filtered.map(tpl => `
        <div class="platform-card animate" style="text-align: left; display: flex; flex-direction: column; justify-content: space-between; border-color: ${tpl.color}44;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="width: 12px; height: 12px; border-radius: 2px; background: ${tpl.color}; box-shadow: 0 0 10px ${tpl.color}aa;"></div>
                    <span class="badge" style="font-size: 0.6rem; opacity: 0.8;">${tpl.category.toUpperCase()}</span>
                </div>
                <h4 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.9rem;">${tpl.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.5rem;">${tpl.description}</p>
            </div>
            <button onclick="applyTemplate('${tpl.id}')" style="
                background: transparent;
                border: 1px solid var(--border-bright);
                color: var(--text-primary);
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                transition: var(--transition);
                width: 100%;
            " onmouseover="this.style.borderColor='${tpl.color}'; this.style.color='${tpl.color}'" 
               onmouseout="this.style.borderColor='var(--border-bright)'; this.style.color='var(--text-primary)'">
                Customize Template
            </button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // Create Gallery Section if it doesn't exist
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const gallerySection = document.createElement('section');
        gallerySection.innerHTML = `
            <div class="section-title" style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>Widget Templates</span>
                <div id="galleryFilters" style="display: flex; gap: 0.5rem;">
                    <button class="tab active" data-filter="all" style="background:transparent; border:none; color:inherit;">All</button>
                    <button class="tab" data-filter="conversion" style="background:transparent; border:none; color:inherit;">Conversion</button>
                    <button class="tab" data-filter="info" style="background:transparent; border:none; color:inherit;">Tools</button>
                </div>
            </div>
            <div class="platforms" id="templatesGallery" style="margin-top: 1rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
                <!-- Templates Rendered Here -->
            </div>
        `;
        
        // Insert before Platform Instructions
        const platformsTitle = [...document.querySelectorAll('.section-title')].find(el => el.textContent.includes('Installation Guides'));
        if (platformsTitle) {
            mainContent.insertBefore(gallerySection, platformsTitle);
        }

        // Add filter listeners
        document.getElementById('galleryFilters').addEventListener('click', (e) => {
            if (e.target.dataset.filter) {
                document.querySelectorAll('#galleryFilters .tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderGallery(e.target.dataset.filter);
            }
        });

        renderGallery();
    }
});