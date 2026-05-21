const filterBtns = document.querySelectorAll('.filter-btn');
        const toolCards = document.querySelectorAll('.tool-card');
        const searchInput = document.getElementById('toolSearch');

        function filterTools() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            toolCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const category = card.dataset.category;
                const matchesSearch = title.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || category === activeFilter;
                card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterTools();
            });
        });

        searchInput.addEventListener('input', filterTools);

        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', () => {
                const answer = q.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                answer.style.display = isOpen ? 'none' : 'block';
                q.querySelector('span').innerText = isOpen ? '[+]' : '[-]';
            });
        });