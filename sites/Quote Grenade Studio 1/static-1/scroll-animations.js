document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Elements on Scroll using Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
                // Add a "glitch" pulse when something becomes visible
                if (entry.target.classList.contains('manifesto-header')) {
                    triggerGlitch(entry.target);
                }
            }
        });
    }, revealOptions);

    // Select items to animate
    const itemsToReveal = document.querySelectorAll('.manifesto-section, .mini-card, h1, .hero-sub');
    itemsToReveal.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px) scale(0.95)";
        item.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        revealObserver.observe(item);
    });

    // 2. Parallax Effects for Typography
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Tilt effect for cards based on scroll
        const cards = document.querySelectorAll('.quote-card, .mini-card');
        cards.forEach((card, index) => {
            const speed = (index % 2 === 0) ? 0.05 : -0.05;
            const yPos = scrolled * speed;
            card.style.transform = `translateY(${yPos}px)`;
        });

        // Horizontal Marquee speed adjustment
        const marqueeInner = document.querySelector('.marquee-inner');
        if (marqueeInner) {
            const scrollSpeed = (scrolled * 0.2) % 100;
            marqueeInner.style.transform = `translateX(-${scrollSpeed}%)`;
        }

        // Background Color Shift on deep scroll
        if (scrolled > 1000) {
            document.body.style.backgroundColor = "#ff3c00"; // Red
            document.body.style.color = "#ffffff";
        } else {
            document.body.style.backgroundColor = "#f4f1ea"; // Cream
            document.body.style.color = "#000000";
        }
    });

    // 3. Brutalist "Glitch" Effect Logic
    function triggerGlitch(element) {
        let count = 0;
        const interval = setInterval(() => {
            element.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            element.style.textShadow = `${Math.random() * 5}px 0 #ff3c00, -${Math.random() * 5}px 0 #000`;
            count++;
            if (count > 10) {
                clearInterval(interval);
                element.style.transform = "translate(0, 0)";
                element.style.textShadow = "none";
            }
        }, 40);
    }

    // 4. Staggered reveal for grid items
    const gridItems = document.querySelectorAll('.grid-layout .mini-card');
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // 5. Scroll Progress Bar (Brutalist style)
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '10px';
    progressBar.style.backgroundColor = '#ff3c00';
    progressBar.style.zIndex = '1001';
    progressBar.style.borderRight = '4px solid #000';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 6. Audio/Visual feedback for "Pulling the Pin"
    const mainBtn = document.querySelector('.btn-main');
    if (mainBtn) {
        mainBtn.addEventListener('mousedown', () => {
            document.body.style.filter = 'invert(1)';
        });
        mainBtn.addEventListener('mouseup', () => {
            document.body.style.filter = 'invert(0)';
        });
    }

    console.log("SYSTEM: Scroll animations active. Philosophy engaged.");
});