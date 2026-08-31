import { getEvent } from "@/lib/content";

function toIcsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return new Response("Event not found", { status: 404 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const uidHost = new URL(siteUrl).hostname;
  const start = new Date(event.date);
  const [endTime, meridiem] = event.endTime.split(" ");
  const [hourValue, minuteValue] = endTime.split(":").map(Number);
  const hour = (hourValue % 12) + (meridiem === "PM" ? 12 : 0);
  const end = new Date(start);
  end.setHours(hour, minuteValue, 0, 0);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hobby Trail//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${uidHost}`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(start.toISOString())}`,
    `DTEND:${toIcsDate(end.toISOString())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replaceAll(",", "\\,")}`,
    `LOCATION:${`${event.venue}, ${event.address}`.replaceAll(",", "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${event.slug}.ics"` } });
}
