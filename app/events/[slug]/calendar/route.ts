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

  // Extract date portion and calculate end date in Melbourne time without server local-time distortion
  const datePrefix = event.date.slice(0, 10);
  const [endTime = "17:00", meridiem = "PM"] = (event.endTime || "5:00 PM").split(" ");
  const [rawHour = 5, minuteValue = 0] = endTime.split(":").map(Number);
  const hour = (rawHour % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);
  const endIsoString = `${datePrefix}T${String(hour).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")}:00+10:00`;
  const end = new Date(endIsoString);

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hobby Trail//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
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

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
