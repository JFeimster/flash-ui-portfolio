const quotes = [
            { text: "Permission is the ghost of a dead king.", cat: "liberty" },
            { text: "If it's not a 'hell yes', it's a tax on your soul.", cat: "founder" },
            { text: "Compliance is a slow suicide.", cat: "philosophy" },
            { text: "Code is the only law that doesn't require a gun to enforce.", cat: "liberty" },
            { text: "Your comfort zone is a gilded cage. Melt the bars.", cat: "philosophy" },
            { text: "The state is a bug, not a feature.", cat: "liberty" },
            { text: "Build things that make the state obsolete.", cat: "founder" },
            { text: "If you aren't being cancelled by the middle-class, you aren't saying anything important.", cat: "contrarian" },
            { text: "The most dangerous animal is a man with nothing to lose and a laptop.", cat: "philosophy" },
            { text: "Bureaucracy is the art of making the possible impossible.", cat: "contrarian" },
            { text: "Don't find customers for your products. Find a tribe for your mission.", cat: "founder" },
            { text: "Taxation is the price we pay for a society we didn't vote for.", cat: "liberty" },
            { text: "The future is decentralized or it is a prison.", cat: "philosophy" },
            { text: "A startup is a conspiracy to change the world.", cat: "founder" },
            { text: "Being 'realistic' is the most common path to mediocrity.", cat: "contrarian" },
            { text: "The sovereign individual does not ask for room. They build it.", cat: "liberty" },
            { text: "Your debt is someone else's asset. Stop being a line item.", cat: "philosophy" },
            { text: "Disruption is only 'rude' to those who profit from the status quo.", cat: "founder" },
            { text: "Privacy is not about having something to hide; it's about having something to protect.", cat: "liberty" },
            { text: "Mainstream media is just a PR firm for the decline.", cat: "contrarian" }
        ];

        const card = document.getElementById('card');
        const quoteText = document.getElementById('quote-text');
        const generateBtn = document.getElementById('generate-trigger');
        const copyBtn = document.getElementById('copy-btn');
        const catButtons = document.querySelectorAll('.cat-btn');
        const toast = document.getElementById('toast');

        let currentCategory = 'all';

        // Filter functionality
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                catButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.cat;
            });
        });

        // Generator functionality
        function generateQuote() {
            // Animation
            card.classList.remove('shake');
            void card.offsetWidth; // trigger reflow
            card.classList.add('shake');

            const filtered = currentCategory === 'all' 
                ? quotes 
                : quotes.filter(q => q.cat === currentCategory);
            
            const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
            
            setTimeout(() => {
                quoteText.textContent = randomQuote.text;
            }, 100);
        }

        generateBtn.addEventListener('click', generateQuote);

        // Copy functionality
        copyBtn.addEventListener('click', () => {
            const text = quoteText.textContent;
            navigator.clipboard.writeText(text).then(() => {
                toast.style.display = 'block';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 2000);
            });
        });

        // Initial Quote
        window.onload = generateQuote;