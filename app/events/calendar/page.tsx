import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { EventCalendar } from "@/components/event-calendar";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Event calendar",
  description: "Browse upcoming Hobby Trail events by month, including TCG, collectibles, gaming, and creator gatherings.",
};

export default async function EventsCalendarPage() {
  const events = await getEvents();
  return (
    <PageShell>
      <PageHero title={["Plan your next", "trail stop."]} text="A calendar of published Hobby Trail events, updated from the same source as every event page and ticket link." aside={<div className="hero-stamp"><CalendarBlank size={38} weight="fill" /><span>Calendar</span><strong>{events.length}</strong><small>Published events</small></div>} />
      <section className="content-section calendar-page"><div className="content-container"><Link className="back-link" href="/events"><ArrowLeft size={18} /> Event list and filters</Link><EventCalendar events={events} /></div></section>
    </PageShell>
  );
}
