import { getGuides, getSite } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap() {
  const site = getSite();
  const base = site.seo.siteUrl;

  const staticPaths = [
    "/",
    site.pillar.slug,
    "/programs",
    "/guides",
    "/playbook",
    "/about",
    "/contact"
  ];

  const guidePaths = getGuides().map((g) => `/guides/${g.slug}`);

  const urls = [...staticPaths, ...guidePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: path === site.pillar.slug ? 1 : path === "/" ? 0.9 : 0.7
  }));

  return urls;
}
