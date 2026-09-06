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
import { supabasePublic } from "@/lib/supabase/public";

type RawEvent = Omit<HobbyEvent, "month" | "day" | "weekday" | "time" | "endTime"> & {
  endDate?: string;
};

type SupabaseRow = Record<string, unknown>;

function rowString(row: SupabaseRow, field: string, fallback = "") {
  const value = row[field];
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

function rowBoolean(row: SupabaseRow, field: string) {
  return row[field] === true;
}

function rowArray(row: SupabaseRow, field: string) {
  return Array.isArray(row[field]) ? row[field].map((value) => String(value)).filter(Boolean) : [];
}

async function getPublishedRows(table: string, orderBy = "updated_at") {
  if (!supabasePublic) return null;
  const { data, error } = await supabasePublic
    .from(table)
    .select("*")
    .eq("published", true)
    .order(orderBy, { ascending: orderBy === "display_order" });
  if (error || !data?.length) return null;
  return data as SupabaseRow[];
}

function mapSupabaseEvent(row: SupabaseRow): RawEvent {
  return {
    slug: rowString(row, "slug"),
    title: rowString(row, "title"),
    date: rowString(row, "start_date"),
    endDate: rowString(row, "end_date"),
    game: rowString(row, "game"),
    type: rowString(row, "category"),
    level: rowString(row, "level"),
    venue: rowString(row, "venue_name"),
    address: rowString(row, "address"),
    city: rowString(row, "city"),
    fee: rowString(row, "fee"),
    capacity: rowString(row, "capacity"),
    status: rowString(row, "status") as EventStatus,
    ticketStatus: rowString(row, "ticket_status") as TicketStatus,
    ticketUrl: rowString(row, "ticket_url") || undefined,
    image: rowString(row, "image") || "/stock/events-card-table.jpg",
    description: rowString(row, "description"),
    bring: rowArray(row, "bring"),
  };
}

function mapSupabaseGuide(row: SupabaseRow): Guide {
  const sections = Array.isArray(row.sections)
    ? row.sections.filter((section): section is Record<string, unknown> => Boolean(section) && typeof section === "object").map((section) => ({ heading: rowString(section, "heading"), body: rowString(section, "body") })).filter((section) => section.heading && section.body)
    : [];
  return {
    slug: rowString(row, "slug"),
    title: rowString(row, "title"),
    category: rowString(row, "category"),
    readTime: rowString(row, "read_time"),
    image: rowString(row, "image") || "/stock/guide-protect-cards.jpg",
    summary: rowString(row, "summary"),
    intro: rowString(row, "intro"),
    sections,
  };
}

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

export async function getEvents(): Promise<HobbyEvent[]> {
  const supabaseEvents = await getPublishedRows("events", "start_date");
  if (supabaseEvents) return supabaseEvents.map(mapSupabaseEvent).map((event) => formatEvent(event));
  return localEvents.map((event) => ("month" in event ? event as HobbyEvent : formatEvent(event)));
}

export async function getEvent(slug: string): Promise<HobbyEvent | undefined> {
  return (await getEvents()).find((event) => event.slug === slug);
}

export async function getCollections(): Promise<Collection[]> {
  const supabaseCollections = await getPublishedRows("collections");
  if (supabaseCollections) {
    return supabaseCollections.map((row) => ({
      slug: rowString(row, "slug"),
      title: rowString(row, "title"),
      curator: rowString(row, "curator"),
      game: rowString(row, "game"),
      era: rowString(row, "era"),
      format: rowString(row, "format"),
      image: rowString(row, "image") || "/stock/collection-overview.jpg",
      summary: rowString(row, "summary"),
      story: rowArray(row, "story"),
      highlights: rowArray(row, "highlights"),
    }));
  }

  return localCollections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

export async function getGuides(): Promise<Guide[]> {
  const supabaseGuides = await getPublishedRows("guides", "published_at");
  if (supabaseGuides) return supabaseGuides.map(mapSupabaseGuide);

  return localGuides;
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
  return (await getGuides()).find((guide) => guide.slug === slug);
}

export async function getSponsors(): Promise<Sponsor[]> {
  const supabaseSponsors = await getPublishedRows("sponsors", "display_order");
  if (supabaseSponsors) {
    return supabaseSponsors.filter((row) => rowBoolean(row, "active")).map((row) => ({
      name: rowString(row, "name"),
      tier: rowString(row, "tier") as Sponsor["tier"],
      logo: rowString(row, "logo"),
      url: rowString(row, "url") || undefined,
      description: rowString(row, "description") || undefined,
    }));
  }

  return localSponsors;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabaseTestimonials = await getPublishedRows("testimonials");
  if (supabaseTestimonials) {
    return supabaseTestimonials.filter((row) => rowBoolean(row, "approved")).map((row) => ({
      quote: rowString(row, "quote"),
      name: rowString(row, "name"),
      role: rowString(row, "role"),
      organization: rowString(row, "organization") || undefined,
      audience: rowString(row, "audience") as Testimonial["audience"],
    }));
  }

  return localTestimonials;
}

export const eventStatusOptions: EventStatus[] = ["Open", "Filling fast", "Sold out"];
export const ticketStatusOptions: TicketStatus[] = ["On sale", "Free registration", "Coming soon", "Sold out", "Sales closed"];
