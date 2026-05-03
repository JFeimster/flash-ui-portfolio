import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import posts from "@/data/posts.json";
import caseStudies from "@/data/caseStudies.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;

  const staticRoutes = ["/", "/services/", "/insights/", "/partners/", "/case-studies/", "/apply/", "/legal/"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date().toISOString().slice(0, 10)
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/insights/${p.slug}/`,
    lastModified: p.date
  }));

  const caseRoutes = caseStudies.map((c) => ({
    url: `${base}/case-studies/${c.slug}/`,
    lastModified: c.updated
  }));

  return [...staticRoutes, ...postRoutes, ...caseRoutes];
}
