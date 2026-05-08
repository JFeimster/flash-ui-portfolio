import type { Metadata } from "next";
import type { SiteConfig } from "@/lib/types";

function absoluteUrl(siteUrl: string, path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteUrl}${path}`;
}

export function buildDefaultMetadata(site: SiteConfig): Metadata {
  const base = new URL(site.seo.siteUrl);

  return {
    metadataBase: base,
    title: {
      default: site.seo.defaultTitle,
      template: `%s | ${site.brandName}`
    },
    description: site.seo.defaultDescription,
    alternates: {
      canonical: site.seo.siteUrl
    },
    openGraph: {
      type: "website",
      url: site.seo.siteUrl,
      title: site.seo.defaultTitle,
      description: site.seo.defaultDescription,
      siteName: site.brandName,
      images: [
        {
          url: absoluteUrl(site.seo.siteUrl, site.seo.ogImagePath),
          width: 1200,
          height: 630,
          alt: `${site.brandName} — ${site.tagline}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.defaultTitle,
      description: site.seo.defaultDescription,
      images: [absoluteUrl(site.seo.siteUrl, site.seo.ogImagePath)]
    }
  };
}

export function buildPageMetadata(
  site: SiteConfig,
  opts: { title: string; description: string; path: string }
): Metadata {
  const canonical = absoluteUrl(site.seo.siteUrl, opts.path);

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: opts.title,
      description: opts.description,
      siteName: site.brandName,
      images: [
        {
          url: absoluteUrl(site.seo.siteUrl, site.seo.ogImagePath),
          width: 1200,
          height: 630,
          alt: `${site.brandName} — ${site.tagline}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [absoluteUrl(site.seo.siteUrl, site.seo.ogImagePath)]
    }
  };
}
