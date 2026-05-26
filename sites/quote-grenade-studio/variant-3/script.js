const quotes = [
            { text: "Privacy is not a luxury; it is a weapon.", cat: "freedom" },
            { text: "If it's not permissionless, it's a prison.", cat: "freedom" },
            { text: "Software eats the law while the lawyers are sleeping.", cat: "founder" },
            { text: "Exit is the ultimate form of voice.", cat: "philosophy" },
            { text: "Build things that make governments obsolete.", cat: "founder" },
            { text: "Your comfort zone is a subsidized hallucination.", cat: "philosophy" },
            { text: "The most radical thing you can do is be self-sufficient.", cat: "freedom" },
            { text: "Bureaucracy is the art of making the possible impossible.", cat: "jester" },
            { text: "Code is the only constitution that doesn't require an interpreter.", cat: "founder" },
            { text: "Taxation is the subscription fee for a service you can't cancel.", cat: "jester" },
            { text: "The network state begins in your group chat.", cat: "founder" },
            { text: "Fiat is a slow-motion rug pull.", cat: "philosophy" },
            { text: "Regulations are just moat-building for the uninspired.", cat: "founder" },
            { text: "Don't ask for permission. Ask for forgiveness. Or just be anonymous.", cat: "freedom" },
            { text: "A ship in harbor is safe, but that's not what ships are built for. Also, the harbor is taxed.", cat: "jester" },
            { text: "Opting out is the only way to win a rigged game.", cat: "philosophy" },
            { text: "Centralization is a single point of failure for humanity.", cat: "freedom" },
            { text: "Your 9-to-5 is a bribe to forget your dreams.", cat: "philosophy" },
            { text: "Decentralize everything until nothing is too big to fail.", cat: "founder" },
            { text: "The future is here, it’s just not encrypted yet.", cat: "founder" }
        ];

        const card = document.getElementById('card');
        const quoteText = document.getElementById('quote-text');
        const quoteCat = document.getElementById('quote-cat');
        const generateBtn = document.getElementById('generate-btn');
        const copyBtn = document.getElementById('copy-btn');
        const shareBtn = document.getElementById('share-btn');
        const categoryButtons = document.querySelectorAll('.cat-chip');
        const quoteWall = document.getElementById('quote-wall');

        let currentCategory = 'all';

        function getRandomQuote() {
            const filtered = currentCategory === 'all' 
                ? quotes 
                : quotes.filter(q => q.cat === currentCategory);
            return filtered[Math.floor(Math.random() * filtered.length)];
        }

        function pullPin() {
            card.classList.add('detonate');
            
            setTimeout(() => {
                const quote = getRandomQuote();
                quoteText.innerText = `“${quote.text.toUpperCase()}”`;
                quoteCat.innerText = quote.cat.toUpperCase();
                card.classList.remove('detonate');
                addToWall(quote.text);
            }, 300);
        }

        function addToWall(text) {
            const div = document.createElement('div');
            div.className = 'wall-item';
            div.innerText = text;
            if(quoteWall.children.length > 5) quoteWall.removeChild(quoteWall.lastChild);
            quoteWall.prepend(div);
        }

        // Initialize Wall
        for(let i=0; i<3; i++) {
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            const div = document.createElement('div');
            div.className = 'wall-item';
            div.innerText = q.text;
            quoteWall.appendChild(div);
        }

        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-cat');
            });
        });

        generateBtn.addEventListener('click', pullPin);

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(quoteText.innerText);
            copyBtn.innerText = "COPIED!";
            setTimeout(() => copyBtn.innerText = "COPY TEXT", 1000);
        });

        shareBtn.addEventListener('click', () => {
            const text = encodeURIComponent(quoteText.innerText + " #QuoteGrenade");
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        });

        // Click effects
        document.addEventListener('mousedown', () => {
            document.body.style.backgroundColor = "#EEE";
        });
        document.addEventListener('mouseup', () => {
            document.body.style.backgroundColor = "var(--cream)";
        });