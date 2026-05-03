import site from "@/data/site.json";
import { Icon } from "@/components/ui/icon";

export function SiteFooter() {
  return (
    <footer className="pb-14 pt-10">
      <div className="bentoGrid">
        {/* Newsletter */}
        <div className="cardSurfaceMuted grain p-6 md:col-span-6">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Newsletter</p>
          <h3 className="mt-2 font-display text-2xl">The Moonshine Brief.</h3>
          <p className="mt-2 text-sm text-ink/75">
            A short weekly note on non-dilutive capital, underwriting signals, and operator playbooks.
          </p>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="#" method="post">
            <input
              className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-4 text-sm"
              type="email"
              name="email"
              placeholder="you@company.com"
              required
            />
            <button
              className="h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              type="submit"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-ink/60">Replace the form action with Beehiiv/Substack/Mailchimp as needed.</p>
        </div>

        {/* Quick links */}
        <div className="cardSurface p-6 md:col-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className="text-ink/80 hover:text-ink" href="/services/">
                Services
              </a>
            </li>
            <li>
              <a className="text-ink/80 hover:text-ink" href="/insights/">
                Insights
              </a>
            </li>
            <li>
              <a className="text-ink/80 hover:text-ink" href="/case-studies/">
                Case Studies
              </a>
            </li>
            <li>
              <a className="text-ink/80 hover:text-ink" href="/partners/">
                Partners
              </a>
            </li>
          </ul>
        </div>

        <div className="cardSurface p-6 md:col-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className="text-ink/80 hover:text-ink" href="/apply/">
                Apply
              </a>
            </li>
            <li>
              <a className="text-ink/80 hover:text-ink" href="/legal/">
                Legal
              </a>
            </li>
            <li>
              <a className="text-ink/80 hover:text-ink" href={site.url}>
                Home
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="cardSurface p-6 md:col-span-8">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Contact</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{site.name}</p>
              <p className="text-sm text-ink/75">{site.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <a className="grid h-11 w-11 place-items-center rounded-xl bg-fog hairline hover:bg-white" href={site.social.linkedin} aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
              <a className="grid h-11 w-11 place-items-center rounded-xl bg-fog hairline hover:bg-white" href={site.social.x} aria-label="X">
                <Icon name="x" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="cardSurfaceMuted p-6 md:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Compliance</p>
          <p className="mt-3 text-xs text-ink/70">
            © {new Date().getFullYear()} {site.name}. This site is informational and does not constitute an offer to sell
            securities. Replace with counsel-approved language.
          </p>
        </div>
      </div>

      <div className="mt-8 h-px w-full bg-black/10" />
      <p className="mt-6 text-xs text-ink/60">
        Built with an editorial bento system (8px spacing, modular blocks, soft borders, reduced-motion support).
      </p>
    </footer>
  );
}
