import site from "@/data/site.json";
export type SiteData = typeof site;
export function getSite(): SiteData { return site; }
