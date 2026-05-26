/**
 * Moonshine Capital | Creative Asset Library Search & Filter Logic
 * Handles real-time filtering of marketing assets based on category and search query.
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('assetSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const assetCards = document.querySelectorAll('.asset-card');
    const emptyState = document.getElementById('emptyState');

    function filterAssets() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        let visibleCount = 0;

        assetCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const tags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';
            const category = card.dataset.category;
            
            const matchesSearch = title.includes(searchTerm) || tags.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle Empty State
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', filterAssets);
    }

    // Category Filter Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Visual feedback for selection using brand colors
            filterButtons.forEach(b => {
                b.style.borderColor = 'var(--border-color)';
                b.style.color = 'var(--text-dim)';
            });
            btn.style.borderColor = 'var(--accent-blue)';
            btn.style.color = 'var(--accent-blue)';

            filterAssets();
        });
    });

    // Initialize display states
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .asset-card { transition: transform 0.2s ease; }
        .asset-card:hover { transform: translateY(-4px); }
    `;
    document.head.appendChild(style);
});

/**
 * Copy to Clipboard Utility for 'Swipe Copy' assets
 */
function copySwipeText(button, textId) {
    const textElement = document.getElementById(textId);
    if (!textElement) return;

    const content = textElement.innerText || textElement.textContent;
    
    navigator.clipboard.writeText(content).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = 'Copied!';
        button.style.backgroundColor = 'rgba(57, 255, 20, 0.1)';
        button.style.color = 'var(--accent-green)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = 'transparent';
            button.style.color = 'var(--text-dim)';
        }, 2000);
    });
}

/**
 * Trigger Download for Static Assets
 */
function downloadAsset(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}