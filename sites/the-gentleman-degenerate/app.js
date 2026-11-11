document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const form = document.querySelector('.newsletter-form');
  const status = document.querySelector('.form-status');
  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      status.dataset.state = 'info';
      status.textContent = 'The mailing list is not connected yet, so your address was not sent or saved.';
    });
  }
});
