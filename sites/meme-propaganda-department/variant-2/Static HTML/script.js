function filterMemes(category) {
            const cards = document.querySelectorAll('.meme-card');
            const buttons = document.querySelectorAll('.filter-btn');

            // Update active button
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if(btn.innerText.toLowerCase().includes(category.toLowerCase())) {
                    btn.classList.add('active');
                }
                if(category === 'all' && btn.innerText === 'EVERYTHING') {
                    btn.classList.add('active');
                }
            });

            // Filter cards
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // Glitch effect randomizer
        setInterval(() => {
            const glitchText = document.querySelector('.glitch');
            glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                glitchText.style.transform = `translate(0,0)`;
            }, 50);
        }, 3000);