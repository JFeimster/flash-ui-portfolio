// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// FAQ Accordion functionality
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;
        const icon = button.querySelector('svg');

        accordionContent.classList.toggle('active');
        if (accordionContent.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        } else {
            accordionContent.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
        }

        // Optional: Close other accordions
        document.querySelectorAll('.accordion-content').forEach(otherContent => {
            if (otherContent !== accordionContent && otherContent.classList.contains('active')) {
                otherContent.classList.remove('active');
                otherContent.style.maxHeight = '0';
                otherContent.previousElementSibling.querySelector('svg').style.transform = 'rotate(0deg)';
            }
        });
    });
});

// Auth Modal functionality
const authModal = document.getElementById('authModal');
const authModalContent = document.getElementById('authModalContent');
const closeModalBtn = document.getElementById('closeModalBtn');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signInMobileBtn = document.getElementById('signInMobileBtn');
const signUpMobileBtn = document.getElementById('signUpMobileBtn');

const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const showSignUpBtn = document.getElementById('showSignUpBtn');
const showSignInBtn = document.getElementById('showSignInBtn');

function openModal(formToShow) {
    authModal.classList.remove('hidden');
    setTimeout(() => {
        authModalContent.classList.remove('opacity-0', 'scale-95');
        authModalContent.classList.add('opacity-100', 'scale-100');
    }, 10);
    
    if (formToShow === 'signup') {
        loginForm.classList.add('hidden');
        signUpForm.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        signUpForm.classList.add('hidden');
    }
}

function closeModal() {
    authModalContent.classList.remove('opacity-100', 'scale-100');
    authModalContent.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        authModal.classList.add('hidden');
    }, 300); // Match CSS transition duration
}

signInBtn.addEventListener('click', () => openModal('login'));
signUpBtn.addEventListener('click', () => openModal('signup'));
signInMobileBtn.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('hidden'); // Close mobile menu
    openModal('login');
});
signUpMobileBtn.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('hidden'); // Close mobile menu
    openModal('signup');
});

closeModalBtn.addEventListener('click', closeModal);

// Close modal if clicking outside content
authModal.addEventListener('click', (event) => {
    if (event.target === authModal) {
        closeModal();
    }
});

showSignUpBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
});

showSignInBtn.addEventListener('click', () => {
    signUpForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}