// Funding Applicant OPSCAN — starter interactions

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal major sections without requiring a library.
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-head, .tile, .matrix-row, .flow-step, .demo-panel"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

// Simple interactive demo. This is deliberately transparent and non-lending:
// it demonstrates UI behavior only and is not an underwriting model.
const form = document.querySelector("#opscan-form");
const result = document.querySelector("#demo-result");
const scoreEl = document.querySelector("#demo-score");
const messageEl = document.querySelector("#demo-message");

function readValue(id) {
  return Number(document.querySelector(id).value);
}

function getMessage(score) {
  if (score >= 84) {
    return "Strong preflight. Verify the request, confirm recent activity, and route intentionally.";
  }
  if (score >= 68) {
    return "Usable core file. Clean the weak signals before submission and avoid unnecessary lender shopping.";
  }
  if (score >= 50) {
    return "Repair first. The applicant may be financeable, but this file needs work before it earns a submission.";
  }
  return "Do not shop this file yet. Fix the fundamentals, gather the missing evidence, then rescan.";
}

function animateScore(from, to, duration = 420) {
  if (prefersReducedMotion) {
    scoreEl.textContent = `${to} / 100`;
    return;
  }

  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(from + (to - from) * progress);
    scoreEl.textContent = `${value} / 100`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const raw =
    readValue("#revenue") +
    readValue("#bank") +
    readValue("#credit") +
    readValue("#docs");

  // Maps the 0–12 demo input range to a 28–96 visual readiness range.
  const score = Math.round(28 + (raw / 12) * 68);
  const previous = Number(scoreEl.textContent.split(" ")[0]) || 0;

  result.animate(
    [
      { transform: "translateY(0)", background: "#f3ede2" },
      { transform: "translateY(-4px)", background: "#c6ff45" },
      { transform: "translateY(0)", background: "#f3ede2" }
    ],
    { duration: 430, easing: "ease-out" }
  );

  animateScore(previous, score);
  messageEl.textContent = getMessage(score);
});

// Slight card parallax on pointer devices.
const scanCard = document.querySelector(".scan-card");

if (scanCard && window.matchMedia("(pointer:fine)").matches && !prefersReducedMotion) {
  scanCard.addEventListener("pointermove", (event) => {
    const rect = scanCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    scanCard.style.transform =
      `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translate(-2px,-2px)`;
  });

  scanCard.addEventListener("pointerleave", () => {
    scanCard.style.transform = "";
  });
}
