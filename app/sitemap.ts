import type { MetadataRoute } from "next";
import { getCollections, getEvents, getGuides } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, collections, guides] = await Promise.all([getEvents(), getCollections(), getGuides()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const routes = ["", "/events", "/events/calendar", "/collections", "/guides", "/vendors", "/sponsors", "/about", "/contact", "/search", "/privacy", "/terms", "/accessibility"];
  const now = new Date();

  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: route === "" || route === "/events" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : route === "/events" ? 0.9 : 0.8,
    })),
    ...events.map((item) => ({
      url: `${base}/events/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...collections.map((item) => ({
      url: `${base}/collections/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...guides.map((item) => ({
      url: `${base}/guides/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
