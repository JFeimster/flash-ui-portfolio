document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle SVG icon for open/close state
        const iconOpen = mobileMenuButton.querySelector('svg:first-child');
        const iconClose = mobileMenuButton.querySelector('svg:last-child');
        iconOpen.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header height
                    behavior: 'smooth'
                });
                // Close mobile menu if open after click
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const iconOpen = mobileMenuButton.querySelector('svg:first-child');
                    const iconClose = mobileMenuButton.querySelector('svg:last-child');
                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                }
            }
        });
    });

    // FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('svg');

            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180'); // Rotate arrow icon
        });
    });

    // Authentication Modal Logic
    const authModal = document.getElementById('authModal');
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const signInBtnMobile = document.getElementById('signInBtnMobile');
    const getStartedBtnMobile = document.getElementById('getStartedBtnMobile');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const openModal = () => {
        authModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const closeModal = () => {
        authModal.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    };

    signInBtn.addEventListener('click', openModal);
    getStartedBtn.addEventListener('click', openModal);
    signInBtnMobile.addEventListener('click', openModal);
    getStartedBtnMobile.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal if clicking outside the modal content
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
