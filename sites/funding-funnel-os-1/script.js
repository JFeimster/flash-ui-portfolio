document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            this.setAttribute('aria-expanded', isExpanded);
        });
    }

    // FAQ Accordion Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('svg');

            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherContent = otherHeader.nextElementSibling;
                    const otherIcon = otherHeader.querySelector('svg');
                    if (!otherContent.classList.contains('hidden')) {
                        otherContent.classList.add('hidden');
                        otherHeader.setAttribute('aria-expanded', 'false');
                        otherIcon.classList.remove('rotate-180');
                    }
                }
            });

            // Toggle clicked accordion
            content.classList.toggle('hidden');
            const isExpanded = content.classList.contains('hidden') ? 'false' : 'true';
            this.setAttribute('aria-expanded', isExpanded);
            icon.classList.toggle('rotate-180');
        });
    });

    // Auth Modal Functionality
    const authModal = document.getElementById('authModal');
    const openAuthModalNav = document.getElementById('openAuthModalNav');
    const openAuthModalMobile = document.getElementById('openAuthModalMobile');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authTabButtons = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    function toggleAuthModal() {
        authModal.classList.toggle('hidden');
        if (!authModal.classList.contains('hidden')) {
            // Add a slight delay for transform animation to play
            setTimeout(() => {
                authModal.querySelector('.vibe-card').classList.remove('scale-95');
                authModal.querySelector('.vibe-card').classList.add('scale-100');
            }, 10);
        } else {
            authModal.querySelector('.vibe-card').classList.remove('scale-100');
            authModal.querySelector('.vibe-card').classList.add('scale-95');
        }
    }

    if (openAuthModalNav) openAuthModalNav.addEventListener('click', toggleAuthModal);
    if (openAuthModalMobile) openAuthModalMobile.addEventListener('click', () => {
        mobileMenu.classList.add('hidden'); // Close mobile menu first
        toggleAuthModal();
    });
    if (closeAuthModal) closeAuthModal.addEventListener('click', toggleAuthModal);
    if (authModal) authModal.addEventListener('click', function(event) {
        if (event.target === authModal) { // Close when clicking outside the modal content
            toggleAuthModal();
        }
    });

    authTabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            authTabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-[#00C8FF]', 'text-[#00C8FF]');
                btn.classList.add('border-gray-700', 'text-gray-400');
            });
            this.classList.add('active', 'border-[#00C8FF]', 'text-[#00C8FF]');
            this.classList.remove('border-gray-700', 'text-gray-400');

            authForms.forEach(form => form.classList.add('hidden'));
            authForms[index].classList.remove('hidden');
        });
    });

    // Initial active state for auth tabs
    if (authTabButtons.length > 0) {
        authTabButtons[0].click(); 
    }
}
)