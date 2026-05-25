document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.body;
    let lastScrollTop = 0;
    let scrollVelocity = 0;

    // --- Kinetic Typography Scroll Effect ---
    // Target elements with .kinetic-text class for horizontal movement based on scroll
    const kineticElements = document.querySelectorAll('.kinetic-text');
    
    // --- Intersection Observer for Brutal Reveals ---
    const revealOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                if (entry.target.classList.contains('blast-in')) {
                    triggerExplosionEffect(entry.target);
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('.manifesto-section, .brutal-card, .jester-image').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Smooth Scroll & Parallax Logic ---
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollVelocity = scrollTop - lastScrollTop;
        lastScrollTop = scrollTop;

        // Move kinetic text layers in opposite directions
        kineticElements.forEach((el, index) => {
            const speed = (index + 1) * 0.2;
            const direction = index % 2 === 0 ? 1 : -1;
            const offset = scrollTop * speed * direction;
            el.style.transform = `translateX(${offset}px) skewX(${scrollVelocity * 0.1}deg)`;
        });

        // Apply slight skew to the main container based on velocity for "wobble" feel
        const mainContent = document.querySelector('.manifesto-content');
        if (mainContent) {
            const skew = Math.min(Math.max(scrollVelocity * 0.05, -2), 2);
            mainContent.style.transform = `skewY(${skew * -1}deg)`;
        }

        requestAnimationFrame(updateScrollEffects);
    }

    // --- Jester "Glitches" ---
    // Occasionally adds temporary "glitch" classes to text when scrolling fast
    function handleGlitches() {
        if (Math.abs(scrollVelocity) > 30) {
            const targets = document.querySelectorAll('.hero-title, .red-text');
            const randomTarget = targets[Math.floor(Math.random() * targets.length)];
            
            if (randomTarget) {
                randomTarget.style.textShadow = `${Math.random() * 10}px 0 #FF0000, -${Math.random() * 10}px 0 #0000FF`;
                setTimeout(() => {
                    randomTarget.style.textShadow = 'none';
                }, 100);
            }
        }
    }

    // --- Decorative Elements ---
    function triggerExplosionEffect(element) {
        // Visual feedback for element entering the viewport
        element.style.transition = 'none';
        element.style.transform = 'scale(0.95) rotate(-2deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 50);
    }

    // --- Cursor Stalking for Brutalist Feel ---
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        width: 40px;
        height: 40px;
        background: var(--red);
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        display: none;
        border-radius: 50%;
        transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(cursorDot);

    if (window.matchMedia("(pointer: fine)").matches) {
        cursorDot.style.display = 'block';
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX - 20 + 'px';
            cursorDot.style.top = e.clientY - 20 + 'px';
            
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                cursorDot.style.transform = 'scale(2)';
            } else {
                cursorDot.style.transform = 'scale(1)';
            }
        });
    }

    // Start Loops
    requestAnimationFrame(updateScrollEffects);
    setInterval(handleGlitches, 200);

    // Initial log for the "Jester"
    console.log("%c QUOTE GRENADE // THE JESTER ARCHETYPE ACTIVATED ", "background: #FF0000; color: #FFF; font-weight: bold; padding: 10px;");
});

// Helper for dynamic font resizing on scroll
window.addEventListener('scroll', () => {
    const scrollFactor = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-progress', scrollFactor);
});