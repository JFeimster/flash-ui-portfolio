import Link from "next/link";
import { Button } from "@/components/Button";
import type { SiteData } from "@/lib/site";
export function Header({ site }: { site: SiteData }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-[rgba(244,241,233,0.12)] bg-[rgba(7,8,11,0.72)]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="focus-ring rounded-xl2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl2 border border-[rgba(244,241,233,0.18)] bg-[rgba(15,17,23,0.65)] shadow-glow flex items-center justify-center">
              <span className="text-xs tracking-[0.22em] font-semibold text-gold">FW</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.18em] uppercase">{site.brand.wordmark}</div>
              <div className="text-xs text-[rgba(244,241,233,0.70)]">{site.brand.tagline}</div>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="px-3 py-2 rounded-xl2 text-sm text-[rgba(244,241,233,0.78)] hover:text-bone hover:bg-[rgba(244,241,233,0.06)] focus-ring">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/login" variant="ghost" className="hidden sm:inline-flex">Login</Button>
          <Button href={site.cta.primary.url} variant="primary">{site.cta.primary.label}</Button>
        </div>
      </div>
    </header>
  );
}
