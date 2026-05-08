import type { SiteConfig } from "@/lib/types";

export function Footer({ site }: { site: SiteConfig }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold">{site.wordmark}</div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {site.footerBlurb}
            </p>
            <p className="mt-3 text-xs text-[var(--muted2)]">
              © {year} {site.brandName}. All rights reserved.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Navigate</div>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a className="focus-ring underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={n.href}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Contact</div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <a className="focus-ring underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            </p>
            <p className="mt-3 text-xs text-[var(--muted2)]">
              This site is educational. Funding outcomes vary. Don’t misrepresent terms.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted2)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{site.legal.disclaimer}</span>
            <span>Built for static deployment on Vercel.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
