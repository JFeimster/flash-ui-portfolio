import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSite } from "@/lib/data";
import { buildDefaultMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return buildDefaultMetadata(site);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang={site.locale ?? "en-US"}>
      <body className="font-mono">
        <a
          href="#content"
          className="focus-ring sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-md bg-[var(--bg)] px-3 py-2 brut-border brut-shadow"
        >
          Skip to content
        </a>
        <Header site={site} />
        <main id="content" className="min-h-[70vh]">
          {children}
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
