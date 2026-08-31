import type { MetadataRoute } from "next";
import { getCollections, getEvents, getGuides } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, collections, guides] = await Promise.all([getEvents(), getCollections(), getGuides()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const routes = ["", "/events", "/events/calendar", "/collections", "/guides", "/vendors", "/about", "/contact", "/search", "/privacy", "/terms", "/accessibility"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date("2026-08-29"), changeFrequency: route === "/events" ? "daily" as const : "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...events.map((item) => ({ url: `${base}/events/${item.slug}`, lastModified: new Date("2026-08-29"), changeFrequency: "daily" as const, priority: 0.8 })),
    ...collections.map((item) => ({ url: `${base}/collections/${item.slug}`, lastModified: new Date("2026-08-29"), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...guides.map((item) => ({ url: `${base}/guides/${item.slug}`, lastModified: new Date("2026-08-29"), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
