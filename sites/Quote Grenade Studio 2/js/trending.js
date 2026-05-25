const trendingQuotes = [
    { text: "CODE IS THE ONLY LAW THAT DOESN'T REQUIRE A GUN TO ENFORCE.", count: "48.2K", color: "var(--red)", width: "90%" },
    { text: "PERMISSION IS THE GHOST OF A DEAD KING.", count: "32.1K", color: "var(--black)", width: "75%" },
    { text: "YOUR COMFORT ZONE IS A GILDED CAGE. MELT THE BARS.", count: "29.8K", color: "var(--white)", width: "85%" },
    { text: "THE STATE IS A BUG, NOT A FEATURE.", count: "24.5K", color: "var(--red)", width: "70%" },
    { text: "IF IT'S NOT A 'HELL YES', IT'S A TAX ON YOUR SOUL.", count: "21.0K", color: "var(--black)", width: "95%" },
    { text: "COMPLIANCE IS A SLOW SUICIDE.", count: "18.4K", color: "var(--white)", width: "80%" }
];

const initHallOfFlame = () => {
    const wallSection = document.querySelector('.wall');
    if (!wallSection) return;

    // Inject Hall of Flame Styles
    const styleBlock = document.createElement('style');
    styleBlock.textContent = `
        .hall-of-flame-container {
            display: flex;
            flex-direction: column;
            padding: 6rem 0;
            overflow: visible;
        }
        .flame-item {
            position: relative;
            padding: 3rem;
            border: var(--border-width) solid var(--black);
            margin-bottom: -3rem;
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
            cursor: pointer;
            z-index: 1;
        }
        .flame-item:nth-child(odd) {
            align-self: flex-start;
            transform: rotate(-1.5deg);
            box-shadow: -15px 15px 0 var(--black);
        }
        .flame-item:nth-child(even) {
            align-self: flex-end;
            transform: rotate(2deg);
            box-shadow: 15px 15px 0 var(--black);
        }
        .flame-item[data-color="var(--red)"] { background: var(--red); color: var(--white); }
        .flame-item[data-color="var(--black)"] { background: var(--black); color: var(--white); border-color: var(--red); }
        .flame-item[data-color="var(--white)"] { background: var(--white); color: var(--black); }
        
        .flame-item:hover {
            z-index: 100;
            transform: scale(1.05) rotate(0deg) !important;
            box-shadow: 25px 25px 0 var(--black);
        }
        .flame-text {
            font-family: 'Archivo Black', sans-serif;
            font-size: clamp(2rem, 6vw, 5rem);
            line-height: 0.85;
            text-transform: uppercase;
            pointer-events: none;
        }
        .flame-meta {
            margin-top: 2rem;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid currentColor;
            padding-top: 1rem;
        }
        .flame-badge {
            background: var(--black);
            color: var(--white);
            padding: 0.2rem 0.6rem;
            font-size: 0.8rem;
        }
        .flame-item[data-color="var(--black)"] .flame-badge {
            background: var(--red);
        }
        .detonation-effect {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--red);
            opacity: 0;
            pointer-events: none;
            z-index: -1;
        }
        @keyframes detonated {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }
    `;
    document.head.appendChild(styleBlock);

    // Replace or Update existing Grid
    const existingGrid = wallSection.querySelector('.grid');
    const wallTitle = wallSection.querySelector('.wall-title');
    
    if (wallTitle) wallTitle.textContent = "THE HALL OF FLAME";

    const flameWrapper = document.createElement('div');
    flameWrapper.className = 'hall-of-flame-container';

    trendingQuotes.forEach((quote, idx) => {
        const item = document.createElement('div');
        item.className = 'flame-item';
        item.style.width = quote.width;
        item.setAttribute('data-color', quote.color);
        
        item.innerHTML = `
            <div class="flame-text">${quote.text}</div>
            <div class="flame-meta">
                <span>RANKED #0${idx + 1}</span>
                <span>${quote.count} DETONATIONS</span>
                <span class="flame-badge">MOST WANTED</span>
            </div>
            <div class="detonation-effect"></div>
        `;

        item.addEventListener('click', () => {
            const fx = item.querySelector('.detonation-effect');
            fx.style.animation = 'none';
            void fx.offsetWidth;
            fx.style.animation = 'detonated 0.6s ease-out forwards';
            
            // Audio-visual punch
            item.classList.add('shake');
            setTimeout(() => item.classList.remove('shake'), 500);
            
            // Interaction logic
            const toast = document.getElementById('toast');
            if(toast) {
                toast.textContent = "DETONATION LOGGED";
                toast.style.display = 'block';
                setTimeout(() => toast.style.display = 'none', 1500);
            }
        });

        flameWrapper.appendChild(item);
    });

    if (existingGrid) {
        existingGrid.parentElement.replaceChild(flameWrapper, existingGrid);
    } else {
        wallSection.querySelector('.container').appendChild(flameWrapper);
    }

    // High Impact Reveal on Scroll
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform += ' translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.flame-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform += ' translateY(100px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
};

// Initialize if script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHallOfFlame);
} else {
    initHallOfFlame();
}