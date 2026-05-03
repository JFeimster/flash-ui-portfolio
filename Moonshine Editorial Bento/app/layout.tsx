import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkipLink } from "@/components/skip-link";
import site from "@/data/site.json";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/og/og.svg", width: 1200, height: 630, alt: `${site.name} cover` }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og/og.svg"]
  },
  alternates: {
    canonical: site.url
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <SkipLink />
        <div className="mx-auto max-w-[1200px] px-4">
          <SiteHeader />
        </div>
        <main id="main" className="mx-auto max-w-[1200px] px-4 pb-24">
          {children}
        </main>
        <div className="mx-auto max-w-[1200px] px-4">
          <SiteFooter />
        </div>

        <style>{`
          :root {
            font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          }
          .font-display {
            font-family: var(--font-display), ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          }
        `}</style>
      </body>
    </html>
  );
}
