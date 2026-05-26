const armoryData = [
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
    { text: "Mainstream media is just a PR firm for the decline.", cat: "contrarian" },
    { text: "Chaos is a ladder, but most people are afraid of heights.", cat: "philosophy" },
    { text: "The most valuable real estate is the space between a customer's ears.", cat: "founder" },
    { text: "Anonymity is a human right.", cat: "liberty" },
    { text: "If you aren't building, you're waiting for the end.", cat: "philosophy" },
    { text: "Tradition is a set of solutions for which we have forgotten the problems.", cat: "contrarian" },
    { text: "Efficiency is the enemy of resilience.", cat: "philosophy" },
    { text: "A government that can give you everything can take everything away.", cat: "liberty" },
    { text: "Work until you no longer have to introduce yourself to your bank.", cat: "founder" }
];

const Armory = {
    init() {
        this.grid = document.querySelector('.grid');
        this.filters = document.querySelectorAll('.cat-btn');
        this.toast = document.getElementById('toast');
        
        if (this.grid) {
            this.bindEvents();
            this.render('all');
        }
    },

    bindEvents() {
        this.filters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-cat');
                
                // Visual toggle
                this.filters.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.render(category);
            });
        });
    },

    showToast(message) {
        if (!this.toast) return;
        this.toast.textContent = message;
        this.toast.style.display = 'block';
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, 2000);
    },

    copyQuote(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('GRENADE LOADED TO CLIPBOARD');
        });
    },

    render(category) {
        this.grid.innerHTML = '';
        
        const filteredData = category === 'all' 
            ? armoryData 
            : armoryData.filter(item => item.cat === category);

        filteredData.forEach(quote => {
            const card = document.createElement('div');
            card.className = 'wall-item';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'space-between';
            card.style.minHeight = '200px';

            const quoteText = document.createElement('p');
            quoteText.style.fontSize = '1.2rem';
            quoteText.style.fontWeight = '700';
            quoteText.style.marginBottom = '2rem';
            quoteText.textContent = `"${quote.text}"`;

            const footer = document.createElement('div');
            footer.style.display = 'flex';
            footer.style.justifyContent = 'space-between';
            footer.style.alignItems = 'center';

            const tag = document.createElement('span');
            tag.style.fontFamily = 'Archivo Black';
            tag.style.fontSize = '0.7rem';
            tag.style.textTransform = 'uppercase';
            tag.style.background = 'var(--black)';
            tag.style.color = 'var(--white)';
            tag.style.padding = '4px 8px';
            tag.textContent = quote.cat;

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'COPY';
            copyBtn.style.background = 'transparent';
            copyBtn.style.border = '2px solid currentColor';
            copyBtn.style.fontFamily = 'Archivo Black';
            copyBtn.style.fontSize = '0.7rem';
            copyBtn.style.padding = '4px 12px';
            copyBtn.style.cursor = 'pointer';
            
            copyBtn.onclick = () => this.copyQuote(quote.text);

            footer.appendChild(tag);
            footer.appendChild(copyBtn);
            
            card.appendChild(quoteText);
            card.appendChild(footer);
            
            this.grid.appendChild(card);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => Armory.init());