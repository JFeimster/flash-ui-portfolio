document.addEventListener("DOMContentLoaded", () => {
    // Sticky Nav Shadow on Scroll
    const nav = document.querySelector('.sticky-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
            nav.style.background = 'rgba(10, 10, 12, 0.95)';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.background = 'rgba(10, 10, 12, 0.85)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animations to cards
    const cards = document.querySelectorAll('.brutal-card, .safety-card, .ba-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(card);
    });

    // Pipeline Hover Interactions
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => {
        stage.addEventListener('mouseenter', () => {
            stages.forEach(s => {
                if(s !== stage) s.style.opacity = '0.4';
            });
            stage.style.transform = 'translateX(10px) scale(1.02)';
            stage.style.boxShadow = '-4px 4px 15px rgba(0,0,0,0.5)';
        });
        stage.addEventListener('mouseleave', () => {
            stages.forEach(s => {
                s.style.opacity = '1';
                s.style.transform = 'translateX(0) scale(1)';
                s.style.boxShadow = 'none';
            });
        });
    });
});
