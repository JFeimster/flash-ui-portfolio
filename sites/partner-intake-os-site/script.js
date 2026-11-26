(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll reveals
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    reveals.forEach(el => io.observe(el));
  }

  // Score counter
  const scoreEl = document.querySelector('.score-count');
  if (scoreEl) {
    const target = Number(scoreEl.dataset.score || 87);
    let started = false;
    const startCounter = () => {
      if (started) return;
      started = true;
      if (reduceMotion) {
        scoreEl.textContent = target;
        return;
      }
      const duration = 1000;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        scoreEl.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const scoreObserver = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        startCounter();
        scoreObserver.disconnect();
      }
    }, { threshold: .5 });
    scoreObserver.observe(scoreEl);
  }

  // Pipeline intelligence stages
  const stages = [...document.querySelectorAll('.flow-stage')];
  const progress = document.querySelector('.flow-progress');
  let stageIndex = 0;
  const setStage = index => {
    stageIndex = index;
    stages.forEach((el, i) => el.classList.toggle('active', i === index));
    if (progress) progress.style.transform = `translateX(${index * 100}%)`;
  };
  stages.forEach((el, i) => el.addEventListener('mouseenter', () => setStage(i)));

  if (!reduceMotion && stages.length) {
    setInterval(() => setStage((stageIndex + 1) % stages.length), 2200);
  }

  // Copy prompt cards
  const promptNote = document.getElementById('prompt-note');
  document.querySelectorAll('.prompt-card').forEach(card => {
    card.addEventListener('click', async () => {
      const text = card.dataset.prompt || card.innerText;
      try {
        await navigator.clipboard.writeText(text);
        if (promptNote) promptNote.textContent = 'Prompt copied. Paste it into Partner Intake OS.';
      } catch {
        if (promptNote) promptNote.textContent = text;
      }
    });
  });

  // Lightweight magnetic CTA effect
  if (!reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('mousemove', e => {
        const r = button.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        button.style.transform = `translate(${x * .05}px, ${y * .08}px)`;
      });
      button.addEventListener('mouseleave', () => button.style.transform = '');
    });
  }
})();
