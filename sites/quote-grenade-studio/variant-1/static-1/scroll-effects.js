/**
 * SCROLL-EFFECTS.JS
 * THE SHRAPNEL MANIFESTO ENGINE
 * Radical Libertarian Labs // v1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    initManifestoEffects();
    initGlitchSystem();
    initShrapnelParallax();
    logPersonaManifesto();
});

function initManifestoEffects() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0) rotate(0deg)';
                entry.target.style.opacity = '1';
                entry.target.classList.add('is-detonated');
                
                // Add jitter effect once visible
                if (Math.random() > 0.7) {
                    entry.target.classList.add('jitter-active');
                }
            }
        });
    }, observerOptions);

    // Targets elements that would exist in the Manifesto section
    const fragments = document.querySelectorAll('.mini-card, .wall-title, .hero-sub, section p');
    fragments.forEach(el => {
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = `translateY(40px) rotate(${Math.random() * 4 - 2}deg)`;
        el.style.opacity = '0';
        revealObserver.observe(el);
    });
}

function initGlitchSystem() {
    const glitchElements = document.querySelectorAll('h1, .wall-title');
    
    setInterval(() => {
        const target = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        if (target) {
            applyTemporalGlitch(target);
        }
    }, 3000);
}

function applyTemporalGlitch(el) {
    const originalText = el.innerText;
    const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789#%&';
    let iterations = 0;

    const interval = setInterval(() => {
        el.innerText = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) return originalText[index];
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');

        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

function initShrapnelParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shrapnel = document.querySelectorAll('.mini-card');
        
        shrapnel.forEach((piece, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.02 * (index % 2 === 0 ? 1 : -1);
            
            // Only apply if the element is roughly in view to save perf
            const rect = piece.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                piece.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            }
        });

        // Background color shift on deep scroll
        if (scrolled > 1000) {
            document.body.style.backgroundColor = '#f4f1ea';
        } else {
            document.body.style.backgroundColor = 'var(--cream)';
        }
    });
}

function logPersonaManifesto() {
    const style = 'color: #ff3c00; font-family: "IBM Plex Mono", monospace; font-weight: bold; font-size: 12px; background: #000; padding: 4px 8px;';
    console.log('%c > SYSTEM STATUS: UNSTABLE ', style);
    console.log('%c > IDENTITY: THE JESTER ', style);
    console.log('%c > MISSION: DECENTRALIZE MEANING ', style);
    console.log('%c > VERDICT: EXIT IS THE ONLY VOICE ', style);
}

// Add shake effect to buttons on hover for that "unstable" feel
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseover', () => {
        if (!btn.classList.contains('btn-main')) {
            btn.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Custom Cursor Trail (Performance Optimized)
let lastMousePos = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastMousePos.x) > 100 || Math.abs(e.clientY - lastMousePos.y) > 100) {
        const spark = document.createElement('div');
        spark.style.position = 'fixed';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.backgroundColor = 'var(--red)';
        spark.style.zIndex = '999';
        spark.style.pointerEvents = 'none';
        document.body.appendChild(spark);
        
        setTimeout(() => {
            spark.style.transition = 'all 0.5s ease-out';
            spark.style.transform = 'scale(4) opacity(0)';
            spark.style.opacity = '0';
            setTimeout(() => spark.remove(), 500);
        }, 10);
        
        lastMousePos = { x: e.clientX, y: e.clientY };
    }
});