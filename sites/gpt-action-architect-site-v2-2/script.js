const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });
}

const revealTargets = document.querySelectorAll(
  '.persona-matrix article, .sequence-grid article, .matrix article, .module-grid article, .auth-columns article, .stack-row, .artifact-row, .principles article, .adaptive-stack > div, .mode-grid article, .trust-list span'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('reveal');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.transition = `opacity .35s ease ${Math.min(i % 4, 3) * .04}s, transform .35s ease ${Math.min(i % 4, 3) * .04}s`;
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.reveal{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);

// Highlight the nearest primary navigation section while scrolling.
const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navSections = navLinks
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.section);

if (navSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.remove('is-active'));
    const current = navSections.find(item => item.section === visible.target);
    if (current) current.link.classList.add('is-active');
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .35, .6] });
  navSections.forEach(({ section }) => navObserver.observe(section));
}
