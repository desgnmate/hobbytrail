import type { Metadata } from "next";
import Link from "next/link";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { EventExplorer } from "@/components/event-explorer";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Explore hobby events, new interests, and welcoming communities across Melbourne, Australia.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <PageShell>
      <PageHero
        title={["Discover your", "next hobby."]}
        text="Explore, collect, create, trade, and connect with communities that share what you love."
        aside={<div className="hero-stamp"><CalendarBlank size={36} weight="fill" /><span>Next event</span><strong>Sep 12</strong><small><MapPin size={15} /> South Wharf</small></div>}
      />
      <section className="content-section events-index" id="tickets">
        <div className="content-container">
          <div className="index-toolbar"><div><p className="detail-kicker">Tickets and registration</p><h2>Choose an event</h2></div><Link className="button button--light" href="/events/calendar"><CalendarBlank size={19} weight="fill" /> Calendar view</Link></div>
          <EventExplorer events={events} />
          <div className="submission-callout">
            <div><h2>Hosting something good?</h2><p>Send us the verified details and help more collectors find the room.</p></div>
            <Link className="button button--black" href="/contact?topic=event">Submit an event</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
