document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('hub-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.resource-card');
    const resultsCount = document.getElementById('results-count');

    /**
     * Filters the resource cards based on search input and active category
     */
    const performFilter = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
        
        let visibleCount = 0;

        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const tags = card.querySelector('.resource-category-tag')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.dataset.category;

            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                tags.includes(searchTerm);
            
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400); // Matches the CSS transition time
            }
        });

        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} resource${visibleCount === 1 ? '' : 's'}`;
        }
    };

    /**
     * Event Listeners for Search Input
     */
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            performFilter();
        });
    }

    /**
     * Event Listeners for Category Buttons
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // UI State Management
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                // Reverting to base styles defined in CSS
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--white)';
            });

            button.classList.add('active');
            // Applying "Gold" active state to match theme
            button.style.backgroundColor = 'var(--gold)';
            button.style.color = 'var(--navy)';

            performFilter();
        });
    });

    // Initialize layout
    performFilter();
});