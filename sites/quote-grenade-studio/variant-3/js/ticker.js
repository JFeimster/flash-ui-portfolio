const briefings = [
    { vol: "072", title: "THE ARCHITECTURE OF EXIT", tag: "STRATEGY" },
    { vol: "071", title: "ALGORITHMIC SOVEREIGNTY", tag: "CODE" },
    { vol: "070", title: "POST-STATE PROTOCOLS", tag: "LIBERTY" },
    { vol: "069", title: "THE COST OF CONSENSUS", tag: "TRUTH" },
    { vol: "068", title: "SHADOW INFRASTRUCTURE", tag: "BUILD" },
    { vol: "067", title: "PERMISSIONLESS EXISTENCE", tag: "FREEDOM" },
    { vol: "066", title: "THE LEVIATHAN'S GLITCH", tag: "JESTER" },
    { vol: "065", title: "ASYMMETRIC ADVANTAGE", tag: "FOUNDER" }
];

class Ticker {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        if (!this.container) return;

        this.speed = 0.8;
        this.scrollPos = 0;
        this.isPaused = false;

        this.render();
        this.start();
        this.addEventListeners();
    }

    render() {
        // Apply Brutalist Styles to Container
        Object.assign(this.container.style, {
            height: '400px',
            overflow: 'hidden',
            position: 'relative',
            border: '4px solid #000',
            background: '#FDFCF0',
            boxShadow: '8px 8px 0px #000'
        });

        this.inner = document.createElement('div');
        this.inner.className = 'ticker-inner';

        const createItem = (item) => `
            <div class="ticker-item" style="
                padding: 25px;
                border-bottom: 4px solid #000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                transition: background 0.1s;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Space Mono', monospace; font-weight: bold; background: #000; color: #fff; padding: 2px 8px; font-size: 0.7rem;">VOL ${item.vol}</span>
                    <span style="font-family: 'Space Mono', monospace; color: #FF0000; font-size: 0.7rem; font-weight: bold;">// ${item.tag}</span>
                </div>
                <div style="font-family: 'Archivo Black', sans-serif; font-size: 1.2rem; line-height: 1.1; text-transform: uppercase;">
                    ${item.title}
                </div>
            </div>
        `;

        const content = briefings.map(item => createItem(item)).join('');
        this.inner.innerHTML = content + content; // Clone for seamless loop
        this.container.appendChild(this.inner);
    }

    addEventListeners() {
        this.container.addEventListener('mouseenter', () => this.isPaused = true);
        this.container.addEventListener('mouseleave', () => this.isPaused = false);
        
        // Add hover effects to items via delegation
        this.inner.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.ticker-item');
            if (item) item.style.background = '#FF000033';
        });
        this.inner.addEventListener('mouseout', (e) => {
            const item = e.target.closest('.ticker-item');
            if (item) item.style.background = 'transparent';
        });
    }

    start() {
        const animate = () => {
            if (!this.isPaused) {
                this.scrollPos += this.speed;
                const halfHeight = this.inner.offsetHeight / 2;

                if (this.scrollPos >= halfHeight) {
                    this.scrollPos = 0;
                }
                this.inner.style.transform = `translateY(-${this.scrollPos}px)`;
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    new Ticker('briefing-ticker');
});