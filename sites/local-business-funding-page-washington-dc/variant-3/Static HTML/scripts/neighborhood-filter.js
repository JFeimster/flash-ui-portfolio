document.addEventListener('DOMContentLoaded', () => {
    /**
     * Local Success Stories: The DC Impact Gallery
     * neighborhood-filter.js - Handles sophisticated filtering for DC Business Case Studies
     */

    const filterBtns = document.querySelectorAll('.neighborhood-filter-btn');
    const caseStudyCards = document.querySelectorAll('.impact-card');
    const galleryGrid = document.querySelector('.impact-gallery-grid');

    if (!filterBtns.length || !caseStudyCards.length) return;

    // Apply initial styles for smooth transitions
    caseStudyCards.forEach(card => {
        card.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    filterBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // 1. Update Active UI State
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.style.color = 'var(--white)';
                btn.style.backgroundColor = 'transparent';
                btn.style.borderColor = 'var(--border)';
            });

            this.classList.add('active');
            this.style.color = 'var(--navy)';
            this.style.backgroundColor = 'var(--gold)';
            this.style.borderColor = 'var(--gold)';

            const filterValue = this.getAttribute('data-filter');

            // 2. Perform Filtering with staggered animation
            let visibleCount = 0;

            caseStudyCards.forEach((card) => {
                const neighborhood = card.getAttribute('data-category');
                
                // Exit Phase
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.98)';
                card.style.pointerEvents = 'none';

                setTimeout(() => {
                    if (filterValue === 'all' || neighborhood === filterValue) {
                        card.style.display = 'block';
                        
                        // Entry Phase (Staggered)
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                            card.style.pointerEvents = 'all';
                        }, 50 + (visibleCount * 50));
                        
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }, 400);
            });

            // 3. Optional: Smooth scroll to top of gallery if user is further down
            const galleryTop = document.querySelector('#impact-gallery').offsetTop;
            if (window.scrollY > galleryTop) {
                window.scrollTo({
                    top: galleryTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize the "All" filter aesthetic
    const initialActive = document.querySelector('.neighborhood-filter-btn.active') || document.querySelector('.neighborhood-filter-btn[data-filter="all"]');
    if (initialActive) {
        initialActive.style.color = 'var(--navy)';
        initialActive.style.backgroundColor = 'var(--gold)';
        initialActive.style.borderColor = 'var(--gold)';
    }

    // Intersection Observer for initial scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    caseStudyCards.forEach(card => revealObserver.observe(card));
});