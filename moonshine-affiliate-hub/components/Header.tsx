import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import type { SiteConfig } from "@/lib/types";

export function Header({ site }: { site: SiteConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(11,11,15,0.85)] backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1">
              <BrandMark wordmark={site.wordmark} />
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm text-[var(--muted)]">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-md px-3 py-2 hover:text-[var(--fg)] hover:bg-[rgba(246,246,247,0.06)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={site.ctas.primary.url}
              className="focus-ring hidden sm:inline-flex items-center rounded-md bg-[var(--lime)] px-3 py-2 text-black font-semibold brut-border brut-shadow"
            >
              {site.ctas.primary.label}
            </a>
            <a
              href={site.ctas.secondary.url}
              className="focus-ring inline-flex items-center rounded-md bg-[var(--card)] px-3 py-2 font-semibold brut-border brut-shadow"
            >
              {site.ctas.secondary.label}
            </a>
          </div>
        </div>

        <nav className="mt-2 flex md:hidden flex-wrap gap-2 text-sm text-[var(--muted)]">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-3 py-2 hover:text-[var(--fg)] hover:bg-[rgba(246,246,247,0.06)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
