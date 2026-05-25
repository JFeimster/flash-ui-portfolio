document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const searchInput = document.getElementById('gallerySearch');

    /**
     * Filter implementation
     */
    function filterGallery() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

        galleryItems.forEach(item => {
            const category = item.dataset.category;
            const title = item.querySelector('.gallery-card-title').textContent.toLowerCase();
            const description = item.querySelector('.gallery-card-desc').textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = title.includes(searchQuery) || description.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.display = 'none';
                item.style.transform = 'translateY(10px)';
            }
        });
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state UI
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Execute filter
            filterGallery();
        });
    });

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterGallery();
        });
    }

    /**
     * "Use Template" functionality
     * Pre-fills the generator if the user selects a template
     */
    const templateButtons = document.querySelectorAll('.btn-use-template');
    templateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const templateType = e.target.closest('.gallery-item').dataset.type;
            const widgetSelect = document.getElementById('widgetType');
            
            if (widgetSelect) {
                widgetSelect.value = templateType;
                // Trigger the global update function from the base component if available
                if (typeof updateGenerator === 'function') {
                    updateGenerator();
                }
                
                // Scroll to configuration panel
                document.querySelector('.main-grid').scrollIntoView({ behavior: 'smooth' });
                
                // Visual feedback
                if (typeof showToast === 'function') {
                    showToast(`Template: ${templateType.toUpperCase()} loaded`);
                }
            }
        });
    });

    // Initialize with a slight delay for entry animation
    galleryItems.forEach((item, index) => {
        item.style.transition = 'all 0.3s ease';
        item.style.transitionDelay = `${index * 0.05}s`;
    });
});