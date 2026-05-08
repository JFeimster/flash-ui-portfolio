import Link from "next/link";
import type { SiteData } from "@/lib/site";
export function Footer({ site }: { site: SiteData }) {
  return (
    <footer className="border-t border-[rgba(244,241,233,0.12)] bg-[rgba(7,8,11,0.65)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] uppercase">{site.brand.wordmark}</div>
            <div className="mt-2 text-sm text-[rgba(244,241,233,0.72)]">{site.brand.positioning}</div>
            <div className="mt-4 text-xs text-[rgba(244,241,233,0.60)]">© {new Date().getFullYear()} {site.brand.wordmark}. All rights reserved.</div>
          </div>

          <div>
            <div className="text-xs tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Navigate</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {site.nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-xl2 px-2 py-1 hover:bg-[rgba(244,241,233,0.06)] focus-ring text-[rgba(244,241,233,0.78)]">
                  {n.label}
                </Link>
              ))}
              {site.legalLinks.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-xl2 px-2 py-1 hover:bg-[rgba(244,241,233,0.06)] focus-ring text-[rgba(244,241,233,0.78)]">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs tracking-[0.2em] uppercase text-[rgba(244,241,233,0.72)]">Contact</div>
            <div className="mt-3 text-sm text-[rgba(244,241,233,0.78)]">
              <div>Email: <a className="underline decoration-[rgba(212,175,55,0.5)] focus-ring" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></div>
              <div className="mt-2">Partner applications: <a className="underline decoration-[rgba(212,175,55,0.5)] focus-ring" href={site.integrations.applyFormUrl}>{site.integrations.applyFormUrlLabel}</a></div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-[rgba(244,241,233,0.55)] leading-relaxed">
          Replace placeholders (domain, form URLs, compliance copy) before going live.
        </div>
      </div>
    </footer>
  );
}
