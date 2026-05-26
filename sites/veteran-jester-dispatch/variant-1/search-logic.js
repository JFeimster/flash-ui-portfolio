const ARCHIVE_DATA = [
    {
        id: "084",
        title: "How to Survive a Meeting That Should’ve Been an Email, But Is Now a War Crime",
        date: "2024-05-12",
        zone: "Corporate Front",
        level: "Confidential",
        category: "Tactical Satire",
        excerpt: "A tactical guide to maintaining your soul while corporate buzzwords are launched at your head like mortar rounds..."
    },
    {
        id: "083",
        title: "The Silence of the High Desert: What the Mojave Taught Me About Entrepreneurship",
        date: "2024-05-01",
        zone: "Personal Trenches",
        level: "Unclassified",
        category: "Combat Veteran POV",
        excerpt: "Sometimes the most productive thing you can do is sit in a folding chair and listen to the wind until the bullshit evaporates..."
    },
    {
        id: "082",
        title: "Why Your 'Culture' Slide Deck is Total Garbage (and how to fix it)",
        date: "2024-04-15",
        zone: "Corporate Front",
        level: "Secret",
        category: "Leadership Scars",
        excerpt: "Real culture isn't found in a PDF. It's found in the foxholes of the 2:00 AM server crash and how you treat the janitor..."
    },
    {
        id: "081",
        title: "The Mechanics of Ghosting: Why Modern Accountability is a Myth",
        date: "2024-03-28",
        zone: "Cultural No-Man's Land",
        level: "Top Secret",
        category: "Freedom Commentary",
        excerpt: "In a world of instant connection, the art of disappearing has become the coward's primary weapon system."
    },
    {
        id: "080",
        title: "Suppression Fire: Dealing with Critics Who Never Left the Wire",
        date: "2024-03-10",
        zone: "Cultural No-Man's Land",
        level: "Confidential",
        category: "Gallows Humor",
        excerpt: "An analysis of why those who do the least usually have the loudest opinions on how you're doing it wrong."
    },
    {
        id: "079",
        title: "Logistics of Liberty: The Cost of Choosing Your Own Path",
        date: "2024-02-14",
        zone: "Small Biz Warfare",
        level: "Secret",
        category: "Leadership Scars",
        excerpt: "Freedom is expensive. Not just in currency, but in the brutal tax of responsibility that most people aren't willing to pay."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const archiveGrid = document.getElementById('dispatch-grid') || document.querySelector('.dispatch-grid');
    const searchInput = document.getElementById('archive-search');
    const zoneFilter = document.getElementById('zone-filter');
    const levelFilter = document.getElementById('level-filter');
    const categoryTags = document.querySelectorAll('.category-tag');

    let activeFilters = {
        query: '',
        zone: 'ALL',
        level: 'ALL',
        category: 'ALL'
    };

    function renderArchives() {
        if (!archiveGrid) return;

        const filtered = ARCHIVE_DATA.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(activeFilters.query.toLowerCase()) || 
                               item.excerpt.toLowerCase().includes(activeFilters.query.toLowerCase());
            const matchesZone = activeFilters.zone === 'ALL' || item.zone === activeFilters.zone;
            const matchesLevel = activeFilters.level === 'ALL' || item.level === activeFilters.level;
            const matchesCategory = activeFilters.category === 'ALL' || item.category === activeFilters.category;

            return matchesQuery && matchesZone && matchesLevel && matchesCategory;
        });

        archiveGrid.innerHTML = filtered.map(item => `
            <div class="dispatch-card" style="animation: inkFade 0.3s ease-in forwards;">
                <div class="card-meta">
                    Dispatch #${item.id} // ${item.category}
                </div>
                <div style="font-family: 'Special Elite'; font-size: 0.7rem; color: var(--stamp-red); margin-bottom: 5px; text-transform: uppercase;">
                    INTEL: ${item.level} // ZONE: ${item.zone}
                </div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-excerpt">${item.excerpt}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <a href="#" class="card-link">Decrypt Full File →</a>
                    <span style="font-size: 0.7rem; opacity: 0.6; font-family: monospace;">LOG_DATE: ${item.date}</span>
                </div>
            </div>
        `).join('');

        if (filtered.length === 0) {
            archiveGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; border: 2px dashed var(--ink); opacity: 0.5;">
                    <h3 style="font-family: 'Special Elite';">NO MATCHING INTEL FOUND</h3>
                    <p>Adjust your search parameters or check your clearance level.</p>
                </div>
            `;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.query = e.target.value;
            renderArchives();
        });
    }

    if (zoneFilter) {
        zoneFilter.addEventListener('change', (e) => {
            activeFilters.zone = e.target.value;
            renderArchives();
        });
    }

    if (levelFilter) {
        levelFilter.addEventListener('change', (e) => {
            activeFilters.level = e.target.value;
            renderArchives();
        });
    }

    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagValue = tag.textContent.trim();
            
            // Toggle logic
            if (activeFilters.category === tagValue) {
                activeFilters.category = 'ALL';
                tag.style.background = 'transparent';
                tag.style.color = 'var(--ink)';
            } else {
                categoryTags.forEach(t => {
                    t.style.background = 'transparent';
                    t.style.color = 'var(--ink)';
                });
                activeFilters.category = tagValue;
                tag.style.background = 'var(--ink)';
                tag.style.color = 'var(--paper)';
            }
            renderArchives();
        });
    });

    // Add CSS Animation to head for the "ink fade" effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes inkFade {
            from { opacity: 0; transform: translateY(10px); filter: blur(2px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .dispatch-card {
            transition: all 0.2s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Initial Load
    renderArchives();
});