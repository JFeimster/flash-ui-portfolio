document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('toolSearch');
            const chips = document.querySelectorAll('.chip');
            const cards = document.querySelectorAll('.tool-card');

            function filterTools() {
                const searchTerm = searchInput.value.toLowerCase();
                const activeCategory = document.querySelector('.chip.active').dataset.filter;

                cards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const category = card.dataset.category;
                    const matchesSearch = title.includes(searchTerm);
                    const matchesCategory = activeCategory === 'all' || category === activeCategory;

                    if (matchesSearch && matchesCategory) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            searchInput.addEventListener('input', filterTools);

            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    chips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    filterTools();
                });
            });
        });