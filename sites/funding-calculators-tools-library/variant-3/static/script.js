const searchInput = document.getElementById('toolSearch');
        const filterPills = document.querySelectorAll('.pill');
        const toolCards = document.querySelectorAll('.tool-card');

        // Search Logic
        searchInput.addEventListener('keyup', () => {
            const query = searchInput.value.toLowerCase();
            filterCards();
        });

        // Filter Logic
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                filterCards();
            });
        });

        function filterCards() {
            const query = searchInput.value.toLowerCase();
            const activeFilter = document.querySelector('.pill.active').getAttribute('data-filter');

            toolCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();
                const category = card.getAttribute('data-category');
                
                const matchesSearch = title.includes(query) || desc.includes(query);
                const matchesFilter = activeFilter === 'all' || category === activeFilter;

                if (matchesSearch && matchesFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }