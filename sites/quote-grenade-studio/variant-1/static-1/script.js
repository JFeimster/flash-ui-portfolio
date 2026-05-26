const quotes = [
            { text: "Sovereignty is a skill, not a right.", cat: "liberty" },
            { text: "The state is a hallucination with a budget.", cat: "liberty" },
            { text: "Build things that make the government obsolete.", cat: "founder" },
            { text: "Optimism is a moral duty, pessimism is a luxury of the bored.", cat: "metamodern" },
            { text: "If it's not a 'Hell Yes', it's a 'Don't tax me'.", cat: "contrarian" },
            { text: "Protocol > Politics.", cat: "liberty" },
            { text: "Exit is the only real voice.", cat: "liberty" },
            { text: "Your attention is the only remaining scarce resource.", cat: "metamodern" },
            { text: "Be the glitch in the simulation.", cat: "metamodern" },
            { text: "Permission is for people who don't have code.", cat: "founder" },
            { text: "The future is a series of opt-in networks.", cat: "liberty" },
            { text: "Everything is a remix, but the ownership is mine.", cat: "founder" },
            { text: "Logic is the ultimate weapon of the unarmed.", cat: "contrarian" },
            { text: "The most radical thing you can do is be happy.", cat: "metamodern" },
            { text: "Stop asking for a seat at the table and build your own floor.", cat: "founder" },
            { text: "Consensus is a trap. Conviction is a tool.", cat: "contrarian" },
            { text: "Taxes are the subscription fee for a service you can't cancel.", cat: "liberty" },
            { text: "Play stupid games, win stupid regulations.", cat: "contrarian" },
            { text: "Code is the only law that doesn't require a police force.", cat: "founder" },
            { text: "They can't cancel what they can't coordinate.", cat: "metamodern" }
        ];

        let currentCategory = 'all';

        function setCategory(cat) {
            currentCategory = cat;
            document.querySelectorAll('.tag-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.innerText.toLowerCase() === cat) btn.classList.add('active');
            });
        }

        function detonate() {
            const card = document.getElementById('grenade-card');
            const textDisplay = document.getElementById('quote-text');
            const metaDisplay = document.getElementById('quote-meta');

            card.classList.add('detonate');
            
            setTimeout(() => {
                const filtered = currentCategory === 'all' 
                    ? quotes 
                    : quotes.filter(q => q.cat === currentCategory);
                
                const random = filtered[Math.floor(Math.random() * filtered.length)];
                
                textDisplay.innerText = random.text;
                metaDisplay.innerText = `TYPE: ${random.cat.toUpperCase()} // FRAGMENT: ${Math.floor(Math.random() * 9999)}`;
                card.classList.remove('detonate');
            }, 400);
        }

        function copyQuote() {
            const text = document.getElementById('quote-text').innerText;
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.getElementById('toast');
                toast.style.display = 'block';
                setTimeout(() => toast.style.display = 'none', 2000);
            });
        }

        function shareTwitter() {
            const text = document.getElementById('quote-text').innerText;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)} - via @QuoteGrenade`, '_blank');
        }

        // Initial Detonation
        window.onload = () => detonate();