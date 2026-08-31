import {
  collections as localCollections,
  events as localEvents,
  guides as localGuides,
  sponsors as localSponsors,
  testimonials as localTestimonials,
  type Collection,
  type EventStatus,
  type Guide,
  type HobbyEvent,
  type Sponsor,
  type Testimonial,
  type TicketStatus,
} from "@/data/site-data";
import { sanityClient } from "@/lib/cms/client";
import { draftMode } from "next/headers";

type RawEvent = Omit<HobbyEvent, "month" | "day" | "weekday" | "time" | "endTime"> & {
  endDate?: string;
};

const eventsQuery = `*[_type == "event" && defined(slug.current)] | order(startDate asc) {
  "slug": slug.current,
  title,
  "date": startDate,
  endDate,
  game,
  "type": category,
  level,
  "venue": coalesce(venue->name, venueName),
  "address": coalesce(venue->address, address),
  "city": coalesce(venue->city, city),
  fee,
  capacity,
  status,
  ticketStatus,
  ticketUrl,
  "image": coalesce(image.asset->url, "/stock/events-card-table.jpg"),
  description,
  bring
}`;

const collectionsQuery = `*[_type == "collection" && defined(slug.current)] | order(featured desc, _updatedAt desc) {
  "slug": slug.current,
  title,
  curator,
  game,
  era,
  format,
  "image": coalesce(image.asset->url, "/stock/collection-overview.jpg"),
  summary,
  story,
  highlights
}`;

const guidesQuery = `*[_type == "guide" && defined(slug.current)] | order(featured desc, publishedAt desc) {
  "slug": slug.current,
  title,
  category,
  readTime,
  "image": coalesce(image.asset->url, "/stock/guide-protect-cards.jpg"),
  summary,
  intro,
  sections[]{heading, body}
}`;

const sponsorsQuery = `*[_type == "sponsor" && active == true] | order(order asc, name asc) {
  name,
  tier,
  "logo": logo.asset->url,
  url,
  description
}`;

const testimonialsQuery = `*[_type == "testimonial" && approved == true] | order(featured desc, _updatedAt desc) {
  quote,
  name,
  role,
  organization,
  audience
}`;

function formatEvent(event: RawEvent): HobbyEvent {
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : start;
  const dateParts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    month: "short",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(start);
  const part = (type: Intl.DateTimeFormatPartTypes) => dateParts.find((item) => item.type === type)?.value ?? "";
  const timeFormatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    ...event,
    month: part("month"),
    day: part("day"),
    weekday: part("weekday"),
    time: timeFormatter.format(start),
    endTime: timeFormatter.format(end),
  };
}

async function fetchContent<T>(query: string, fallback: T, tag: string): Promise<T> {
  if (!sanityClient) return fallback;

  try {
    const { isEnabled } = await draftMode();
    const client = isEnabled && process.env.SANITY_API_TOKEN
      ? sanityClient.withConfig({ token: process.env.SANITY_API_TOKEN, perspective: "drafts", useCdn: false, stega: { enabled: true, studioUrl: "/studio" } })
      : sanityClient;
    return await client.fetch<T>(query, {}, { next: { revalidate: isEnabled ? 0 : 60, tags: [tag, "cms-content"] } });
  } catch {
    // A CMS outage must not take down the public website. Existing approved
    // local content remains available until the connection recovers.
    return fallback;
  }
}

export async function getEvents(): Promise<HobbyEvent[]> {
  const fetched = await fetchContent<RawEvent[]>(eventsQuery, localEvents, "event");
  const raw = fetched.length ? fetched : localEvents;
  return raw.map((event) => ("month" in event ? event as HobbyEvent : formatEvent(event)));
}

export async function getEvent(slug: string): Promise<HobbyEvent | undefined> {
  return (await getEvents()).find((event) => event.slug === slug);
}

export async function getCollections(): Promise<Collection[]> {
  const fetched = await fetchContent<Collection[]>(collectionsQuery, localCollections, "collection");
  return fetched.length ? fetched : localCollections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

export async function getGuides(): Promise<Guide[]> {
  const fetched = await fetchContent<Guide[]>(guidesQuery, localGuides, "guide");
  return fetched.length ? fetched : localGuides;
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
  return (await getGuides()).find((guide) => guide.slug === slug);
}

export async function getSponsors(): Promise<Sponsor[]> {
  return fetchContent(sponsorsQuery, localSponsors, "sponsor");
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchContent(testimonialsQuery, localTestimonials, "testimonial");
}

export const eventStatusOptions: EventStatus[] = ["Open", "Filling fast", "Sold out"];
export const ticketStatusOptions: TicketStatus[] = ["On sale", "Free registration", "Coming soon", "Sold out", "Sales closed"];
