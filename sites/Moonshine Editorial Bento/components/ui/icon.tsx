export function Icon({ name }: { name: string }) {
  const common = "h-5 w-5 text-ink/80";
  switch (name) {
    case "spark":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l1.2 6.2L20 12l-6.8 3.8L12 22l-1.2-6.2L4 12l6.8-3.8L12 2z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "wave":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 15c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 6 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 12l2.3 2.3L16 8.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "box":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7l8-4 8 4-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 7v10l8 4 8-4V7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "rocket":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14 10l6-6c-2-1-5-1-7 1L6 12l-2 6 6-2 7-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 15l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "cart":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7h15l-2 8H8L6 4H3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 20a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
        </svg>
      );
    case "cpu":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 10h4v4h-4v-4z" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case "credit":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6.5 10v8M6.5 6.5v.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10.5 18v-5.2c0-1.6 1-2.8 2.6-2.8 1.5 0 2.4 1 2.4 2.8V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10.5 12.2c.4-1.2 1.5-2.2 3.2-2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "x":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 18L18 6M8 6h4l4 12h-4L8 6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}
