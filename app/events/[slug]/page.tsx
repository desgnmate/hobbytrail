import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarPlus, Clock, MapPin, Ticket, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/page-shell";
import { TicketCta } from "@/components/ticket-cta";
import { getEvent, getEvents } from "@/lib/content";

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const eventImage = event.image.startsWith("http") ? event.image : `${siteUrl}${event.image}`;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: { "@type": "PostalAddress", addressLocality: event.city, addressRegion: "Victoria", addressCountry: "AU" },
    },
    description: event.description,
    image: eventImage,
    offers: { "@type": "Offer", price: event.fee === "Free" ? "0" : event.fee.replace(/[^0-9]/g, ""), priceCurrency: "AUD", availability: event.ticketStatus === "Sold out" ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: event.ticketUrl ?? `${siteUrl}/events/${event.slug}` },
  };

  return (
    <PageShell>
      <article className="detail-page event-detail">
        <div className="detail-page__container">
          <Link className="back-link" href="/events"><ArrowLeft size={18} /> All events</Link>
          <header className="event-detail__header">
            <div className="event-detail__date"><span>{event.month}</span><strong>{event.day}</strong><span>{event.weekday}</span></div>
            <div>
              <div className="detail-kicker">{event.game} / {event.type}</div>
              <h1>{event.title}</h1>
              <p>{event.description}</p>
              <span className={`status status--${event.status.toLowerCase().replaceAll(" ", "-")}`}>{event.status}</span>
            </div>
          </header>

          <div className="event-detail__layout">
            <section className="event-detail__main" aria-labelledby="event-details-title">
              <h2 id="event-details-title">Event details</h2>
              <div className="event-facts">
                <div><Clock size={24} weight="fill" /><span>Date and time</span><strong>{event.weekday}, {event.month} {event.day}<br />{event.time} to {event.endTime}</strong></div>
                <div><MapPin size={24} weight="fill" /><span>Venue</span><strong>{event.venue}<br />{event.address}</strong></div>
                <div><Ticket size={24} weight="fill" /><span>Entry</span><strong>{event.fee}</strong></div>
                <div><UsersThree size={24} weight="fill" /><span>Who it is for</span><strong>{event.level}<br />{event.capacity}</strong></div>
              </div>

              <div className="detail-copy">
                <h2>What to bring</h2>
                <ul className="check-list">{event.bring.map((item) => <li key={item}>{item}</li>)}</ul>
                <h2>A good event for everyone</h2>
                <p>Respect personal boundaries and confirm every trade before cards change hands. Ask the organizer for help if a trade, rule, or interaction feels unclear.</p>
              </div>
            </section>
            <aside className="event-detail__aside">
              <div className="action-panel">
                <h2>Save your place</h2>
                <p>Ticket availability is maintained by the event organizer and updated through the Hobby Trail CMS.</p>
                <TicketCta event={event} />
                <a className="button button--light" href={`/events/${event.slug}/calendar`}><CalendarPlus size={19} /> Add to calendar</a>
              </div>
              <div className="venue-panel"><MapPin size={30} weight="fill" /><h3>{event.venue}</h3><p>{event.address}</p><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`}>Open map</a></div>
            </aside>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      </article>
    </PageShell>
  );
}
