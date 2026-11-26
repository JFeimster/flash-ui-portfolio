document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Mobile menu toggle
    window.toggleMobileMenu = () => {
        mobileMenu.classList.toggle('hidden');
    };

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    closeMobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Accordion functionality
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');

            const isOpen = content.classList.contains('open');

            // Close all other open accordions
            document.querySelectorAll('.accordion-content.open').forEach(openContent => {
                if (openContent !== content) {
                    openContent.classList.remove('open');
                    openContent.style.maxHeight = null;
                    openContent.previousElementSibling.querySelector('.accordion-icon').classList.remove('rotate');
                    openContent.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current accordion
            if (isOpen) {
                content.classList.remove('open');
                content.style.maxHeight = null;
                icon.classList.remove('rotate');
                header.setAttribute('aria-expanded', 'false');
            } else {
                content.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.add('rotate');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
});