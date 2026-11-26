// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion logic
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;
            const icon = button.querySelector('svg');

            accordionContent.classList.toggle('active');
            icon.classList.toggle('rotate-180');

            if (accordionContent.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionContent.style.maxHeight = '0';
            }
        });
    });

    // Auth Modal Logic
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    window.toggleAuthModal = () => {
        authModal.classList.toggle('hidden');
        // Ensure login form is shown by default when opening modal
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    };

    window.showSignupForm = (event) => {
        event.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    };

    window.showLoginForm = (event) => {
        event.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    };

    // Close modal if clicked outside form
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            toggleAuthModal();
        }
    });
});
