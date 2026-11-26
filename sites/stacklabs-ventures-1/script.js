document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            accordionItem.classList.toggle('active');
            accordionContent.classList.toggle('hidden');
            header.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Authentication Modal
    const authModal = document.getElementById('authModal');
    const openSignInButtons = document.querySelectorAll('#openSignIn, #openSignInMobile');
    const closeAuthModalButton = document.getElementById('closeAuthModal');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const showSignInButton = document.getElementById('showSignIn');
    const showSignUpButton = document.getElementById('showSignUp');
    const switchToSignUpLink = document.getElementById('switchToSignUp');
    const switchToSignInLink = document.getElementById('switchToSignIn');

    const showForm = (formToShow) => {
        if (formToShow === 'signIn') {
            signInForm.classList.remove('hidden');
            signUpForm.classList.add('hidden');
            showSignInButton.classList.add('bg-vibe-accent', 'text-white');
            showSignInButton.classList.remove('bg-gray-700', 'text-gray-300');
            showSignUpButton.classList.remove('bg-vibe-accent', 'text-white');
            showSignUpButton.classList.add('bg-gray-700', 'text-gray-300');
            showSignInButton.setAttribute('aria-pressed', 'true');
            showSignUpButton.setAttribute('aria-pressed', 'false');
        } else {
            signInForm.classList.add('hidden');
            signUpForm.classList.remove('hidden');
            showSignUpButton.classList.add('bg-vibe-accent', 'text-white');
            showSignUpButton.classList.remove('bg-gray-700', 'text-gray-300');
            showSignInButton.classList.remove('bg-vibe-accent', 'text-white');
            showSignInButton.classList.add('bg-gray-700', 'text-gray-300');
            showSignInButton.setAttribute('aria-pressed', 'false');
            showSignUpButton.setAttribute('aria-pressed', 'true');
        }
    };

    openSignInButtons.forEach(button => {
        button.addEventListener('click', () => {
            authModal.classList.remove('hidden');
            showForm('signIn'); // Default to sign in form
            authModal.setAttribute('aria-hidden', 'false');
        });
    });

    closeAuthModalButton.addEventListener('click', () => {
        authModal.classList.add('hidden');
        authModal.setAttribute('aria-hidden', 'true');
    });

    showSignInButton.addEventListener('click', () => showForm('signIn'));
    showSignUpButton.addEventListener('click', () => showForm('signUp'));
    switchToSignUpLink.addEventListener('click', (e) => { e.preventDefault(); showForm('signUp'); });
    switchToSignInLink.addEventListener('click', (e) => { e.preventDefault(); showForm('signIn'); });

    // Close modal if clicking outside (optional, but good UX)
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
            authModal.setAttribute('aria-hidden', 'true');
        }
    });

    // Trap focus inside modal (basic example, can be enhanced)
    authModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            authModal.classList.add('hidden');
            authModal.setAttribute('aria-hidden', 'true');
        }
    });
});