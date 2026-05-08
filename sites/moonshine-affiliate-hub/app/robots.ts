import { getSite } from "@/lib/data";

export const dynamic = "force-static";

export default function robots() {
  const site = getSite();
  const base = site.seo.siteUrl;
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
