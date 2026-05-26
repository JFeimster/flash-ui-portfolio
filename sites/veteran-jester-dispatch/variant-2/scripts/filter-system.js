document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#mission-search');
    const filterButtons = document.querySelectorAll('.filter-trigger');
    const archiveItems = document.querySelectorAll('.dispatch-card, .list-item');
    
    /**
     * Logic for filtering based on text input and category selection
     */
    const updateArchiveDisplay = () => {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeCategory = document.querySelector('.filter-trigger.active')?.dataset.filter || 'all';

        archiveItems.forEach(item => {
            const content = item.innerText.toLowerCase();
            const category = item.getAttribute('data-category')?.toLowerCase() || '';
            
            const matchesSearch = content.includes(query);
            const matchesFilter = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesFilter) {
                item.style.display = 'flex';
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.pointerEvents = 'none';
            }
        });

        checkEmptyState();
    };

    /**
     * Handles UI feedback when no results match criteria
     */
    const checkEmptyState = () => {
        let visibleCount = 0;
        archiveItems.forEach(item => {
            if (item.style.display !== 'none') visibleCount++;
        });

        let emptyMsg = document.querySelector('.no-intel-found');
        if (visibleCount === 0) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = 'no-intel-found typewriter';
                emptyMsg.style.padding = '40px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.border = '2px dashed var(--black)';
                emptyMsg.style.marginTop = '20px';
                emptyMsg.innerHTML = '<span class="stamp" style="transform:rotate(0deg)">INTEL REDACTED</span><p style="margin-top:15px;">No dispatches match your clearance level or search parameters.</p>';
                const container = document.querySelector('.dispatches') || document.querySelector('.main-column');
                container.appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    };

    // Event Listeners for Search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Slight debounce simulation for the typewriter aesthetic
            updateArchiveDisplay();
        });
    }

    // Event Listeners for Category Tabs
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // UI Toggle
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'transparent';
                b.style.color = 'var(--black)';
            });
            
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--black)';
            btn.style.color = 'var(--bg-color)';

            updateArchiveDisplay();
            
            // Visual feedback: Stamp the transition
            console.log(`[SYS] Filtering by: ${btn.dataset.filter.toUpperCase()}`);
        });
    });

    // Initial setup for the filter UI if buttons exist
    const initFilterUI = () => {
        filterButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                btn.style.backgroundColor = 'var(--black)';
                btn.style.color = 'var(--bg-color)';
            }
        });
    };

    initFilterUI();
});

/**
 * ARCHIVE AUTO-LOADER MOCKUP
 * Simulates the loading of old 'Classified' reports when scrolling
 */
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        // Trigger for infinite scroll or "Load More" animations could go here
    }
};