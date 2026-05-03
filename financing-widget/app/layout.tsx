import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "FINANCING//WIDGET — Embedded financing for partner checkouts", template: "%s — FINANCING//WIDGET" },
  description: "White-label embedded financing widget + partner dashboard.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header site={site} />
          <main className="flex-1">{children}</main>
          <Footer site={site} />
        </div>
      </body>
    </html>
  );
}
