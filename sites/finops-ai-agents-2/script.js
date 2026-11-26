document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    const signInButtonMobile = document.getElementById('signInButtonMobile');

    if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });

        // Close mobile menu when a link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
        if (signInButtonMobile) {
            signInButtonMobile.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                showAuthModal(); // Call to show auth modal
            });
        }
    }

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');

            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180'); // Rotate arrow icon
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Auth Modal Logic
    const signInButton = document.getElementById('signInButton');
    const authModal = document.getElementById('authModal');
    const authModalClose = document.querySelector('.auth-modal-close');

    function showAuthModal() {
        if (authModal) {
            authModal.style.display = 'flex'; // Use flex to center content
        }
    }

    function hideAuthModal() {
        if (authModal) {
            authModal.style.display = 'none';
        }
    }

    if (signInButton) {
        signInButton.addEventListener('click', showAuthModal);
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', hideAuthModal);
    }

    // Close modal if clicking outside the content
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }
});