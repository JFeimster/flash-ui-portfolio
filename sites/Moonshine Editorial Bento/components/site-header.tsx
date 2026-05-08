import site from "@/data/site.json";
import { NavLink } from "@/components/ui/nav-link";

export function SiteHeader() {
  return (
    <header className="py-6">
      <div className="flex items-center justify-between gap-6">
        <a href="/" className="flex items-baseline gap-3">
          <span className="text-lg font-semibold tracking-tight">{site.wordmark}</span>
          <span className="hidden text-xs text-ink/60 md:inline">{site.tagline}</span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          <NavLink href="/services/">Services</NavLink>
          <NavLink href="/insights/">Insights</NavLink>
          <NavLink href="/partners/">Partners</NavLink>
          <NavLink href="/case-studies/">Case Studies</NavLink>
          <a
            className="ml-2 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            href="/apply/"
          >
            Apply
          </a>
        </nav>

        <div className="md:hidden">
          <a
            className="inline-flex items-center justify-center rounded-xl bg-fog px-4 py-2 text-sm font-semibold hairline"
            href="/apply/"
          >
            Apply
          </a>
        </div>
      </div>

      <div className="mt-5 h-px w-full bg-black/10" />
    </header>
  );
}
