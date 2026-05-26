(function() {
    'use strict';

    /**
     * Moonshine Capital | Advanced Integration Docs Navigation
     * Handles documentation scroll spying, dynamic anchor links, and mobile menu state.
     */

    const DocsNavigation = {
        init() {
            this.sidebar = document.querySelector('.docs-sidebar');
            this.navLinks = document.querySelectorAll('.docs-sidebar-link');
            this.contentSections = document.querySelectorAll('.docs-content-section');
            this.mobileToggle = document.querySelector('.docs-mobile-nav-trigger');
            
            this.setupScrollSpy();
            this.setupSmoothScroll();
            this.setupMobileNav();
            this.highlightCurrentPage();
        },

        setupScrollSpy() {
            const observerOptions = {
                root: null,
                rootMargin: '-10% 0px -80% 0px',
                threshold: 0
            };

            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.updateActiveState(id);
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            this.contentSections.forEach(section => observer.observe(section));
        },

        updateActiveState(id) {
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                    
                    // Ensure the active link is visible in sidebar scroll
                    const linkRect = link.getBoundingClientRect();
                    const sidebarRect = this.sidebar.getBoundingClientRect();
                    if (linkRect.bottom > sidebarRect.bottom || linkRect.top < sidebarRect.top) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Close mobile nav on selection
                        if (this.sidebar.classList.contains('mobile-visible')) {
                            this.toggleMobileNav();
                        }

                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Update URL without jump
                        history.pushState(null, null, targetId);
                    }
                });
            });
        },

        setupMobileNav() {
            if (this.mobileToggle) {
                this.mobileToggle.addEventListener('click', () => this.toggleMobileNav());
            }
        },

        toggleMobileNav() {
            const isVisible = this.sidebar.classList.toggle('mobile-visible');
            document.body.style.overflow = isVisible ? 'hidden' : '';
            
            if (this.mobileToggle) {
                this.mobileToggle.setAttribute('aria-expanded', isVisible);
                this.mobileToggle.classList.toggle('active');
            }
        },

        highlightCurrentPage() {
            const currentPath = window.location.pathname;
            const menuItems = document.querySelectorAll('.docs-menu-item');
            
            menuItems.forEach(item => {
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === currentPath) {
                    item.classList.add('current-page');
                }
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DocsNavigation.init());
    } else {
        DocsNavigation.init();
    }

    // Export for potential external refresh calls (e.g. after AJAX content loads)
    window.MoonshineDocsNav = DocsNavigation;

})();