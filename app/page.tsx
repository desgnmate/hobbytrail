import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CardsThree,
  Clock,
  FolderOpen,
  Handshake,
  MapPin,
  Palette,
  Star,
  Storefront,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { TicketCta } from "@/components/ticket-cta";
import { CollectionCarousel } from "@/components/collection-carousel";
import { HomeHero } from "@/components/home-hero";
import { getCollections, getEvents, getGuides, getSponsors, getTestimonials } from "@/lib/content";

const trailEventImages = [
  "/stock/guide-first-event.jpg",
  "/stock/events-card-table.jpg",
  "/stock/collection-overview.jpg",
];

const collectionArtwork = [
  "/stock/collection-encased-card.jpg",
  "/stock/collection-protected-cards.jpg",
  "/stock/collection-charizard-display.jpg",
];

const guideArtwork = [
  "/stock/guide-protect-cards.jpg",
  "/stock/events-card-table.jpg",
  "/stock/guide-card-condition.jpg",
];

export default async function Home() {
  const [events, collections, guides, sponsors, testimonials] = await Promise.all([
    getEvents(),
    getCollections(),
    getGuides(),
    getSponsors(),
    getTestimonials(),
  ]);
  const featuredEvent = events[0];
  const trailEvents = events.slice(0, 3);

  return (
    <>
      <SiteHeader overlay />
      <main id="main-content">
        <HomeHero />

        <section className="section section--white trail-choices" aria-labelledby="trail-title">
          <div className="container">
            <Reveal className="trail-choices__heading">
              <h2 id="trail-title">Choose your trail</h2>
              <p className="section-intro">Dive into events, explore collections, and get practical guides to fuel your next adventure.</p>
            </Reveal>
            <div className="trail-choices__grid">
              <Reveal className="trail-card trail-card--event" delay={0.02}>
                <Image
                  className="trail-card__scene"
                  src="/generated/trail-events-clean.png"
                  alt=""
                  fill
                  sizes="(max-width: 1080px) 100vw, 52vw"
                />
                <div className="trail-card__copy">
                  <h3>Find an event</h3>
                  <p>TCG tournaments, collectible fairs, gaming sessions, creator workshops, and community meetups.</p>
                  <Link className="button button--black" href="/events" prefetch={true}>Explore events <ArrowRight size={18} /></Link>
                </div>
                <div className="trail-event-list">
                  {trailEvents.map((event, index) => (
                    <Link className="trail-mini-event" href={`/events/${event.slug}`} prefetch={true} key={event.slug}>
                      <Image
                        src={trailEventImages[index]}
                        alt=""
                        width={144}
                        height={88}
                      />
                      <span className="trail-mini-event__copy">
                        <strong>{event.title}</strong>
                        <span>{event.month} {Number(event.day)}, 2026 · {event.city}</span>
                      </span>
                      <span className="trail-mini-event__arrow" aria-hidden="true">
                        <ArrowRight size={18} weight="bold" />
                      </span>
                    </Link>
                  ))}
                </div>
              </Reveal>

              <div className="trail-connectors" aria-hidden="true">
                <div className="trail-connector trail-connector--top">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 72 C68 72 18 50 100 50" />
                  </svg>
                  <span><ArrowRight size={21} weight="bold" /></span>
                </div>
                <div className="trail-connector trail-connector--bottom">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 28 C68 28 18 50 100 50" />
                  </svg>
                  <span><ArrowRight size={21} weight="bold" /></span>
                </div>
              </div>

              <div className="trail-choices__stack">
                <Reveal className="trail-card trail-card--small" delay={0.04}>
                  <Image
                    className="trail-card__scene"
                    src="/generated/trail-collections-clean.png"
                    alt=""
                    fill
                    sizes="(max-width: 820px) 100vw, 38vw"
                  />
                  <div className="trail-card__small-copy">
                    <h3>Explore collections</h3>
                    <p>Curated binders and inspiration for every kind of collector.</p>
                    <Link className="button button--black" href="/collections" prefetch={true}>Browse collections <ArrowRight size={17} /></Link>
                  </div>
                </Reveal>
                <Reveal className="trail-card trail-card--small trail-card--cream" delay={0.06}>
                  <Image
                    className="trail-card__scene"
                    src="/generated/trail-guides-clean.png"
                    alt=""
                    fill
                    sizes="(max-width: 820px) 100vw, 38vw"
                  />
                  <div className="trail-card__small-copy">
                    <h3>Start collecting</h3>
                    <p>Practical guides and how-tos to help you begin with confidence.</p>
                    <Link className="button button--black" href="/guides" prefetch={true}>Read guides <ArrowRight size={17} /></Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--cream events-section" id="tickets" aria-labelledby="events-title">
          <div className="container">
            <Reveal>
              <h2 id="events-title">Upcoming events</h2>
              <p className="section-intro">Trading cards, collectibles, gaming, creators, and community gatherings.</p>
            </Reveal>
            <div className="events-showcase">
              <Reveal className="event-feature" delay={0.04}>
                <div className="event-feature__date">
                  <span>{featuredEvent.month}</span>
                  <strong>{featuredEvent.day}</strong>
                  <span className="event-date__weekday">{featuredEvent.weekday}</span>
                  <span className="event-date__time">{featuredEvent.time}</span>
                </div>
                <div className="event-feature__image">
                  <Image src="/stock/guide-first-event.jpg" alt="Two players facing off over a sleeved trading card game" fill sizes="(max-width: 900px) 100vw, 52vw" />
                </div>
                <div className="event-feature__copy">
                  <h3>{featuredEvent.title}</h3>
                  <p>{featuredEvent.description}</p>
                  <div className="event-meta">
                    <span><i><CardsThree size={20} weight="fill" /></i><b>Game<small>{featuredEvent.game}</small></b></span>
                    <span><i><MapPin size={20} weight="fill" /></i><b>Location<small>{featuredEvent.venue}</small></b></span>
                    <span><i><Star size={20} weight="fill" /></i><b>Skill level<small>{featuredEvent.level}</small></b></span>
                  </div>
                  <div className="event-card-actions"><Link className="button button--light" href={`/events/${featuredEvent.slug}`}>View event</Link><TicketCta event={featuredEvent} /></div>
                </div>
              </Reveal>
              <div className="event-list">
                {events.slice(1).map((event, index) => (
                  <Reveal key={event.slug} className="event-row" delay={0.08 + index * 0.06}>
                    <div className="event-row__date">
                      <span>{event.month}</span>
                      <strong>{event.day}</strong>
                      <span className="event-date__weekday">{event.weekday}</span>
                      <span className="event-date__time">{event.time}</span>
                    </div>
                    <div className="event-row__copy">
                      <h3>{event.title}</h3>
                      <div className="event-row__facts">
                        <span><i><CardsThree size={18} weight="fill" /></i><b>Game<small>{event.game}</small></b></span>
                        <span><i><UsersThree size={18} weight="fill" /></i><b>Skill level<small>{event.level}</small></b></span>
                        <span><i><MapPin size={18} weight="fill" /></i><b>Location<small>{event.venue}</small></b></span>
                      </div>
                      <div className="event-row__actions"><Link className="text-link" href={`/events/${event.slug}`}>Details</Link><TicketCta event={event} compact /></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--white collections-section" aria-labelledby="collections-title">
          <div className="container">
            <Reveal>
              <h2 id="collections-title">Featured collections</h2>
              <p className="section-intro">Handpicked binder showcases from our community.<br />Real collections, real stories, endless inspiration.</p>
            </Reveal>
            <div className="collections-showcase">
              <Reveal className="binder-feature">
                <CollectionCarousel
                  slides={[
                    {
                      src: "/stock/collection-overview.jpg",
                      alt: "Trading card collection arranged in protective cases on a wooden surface",
                      label: "Featured collection overview",
                    },
                    ...collections.slice(0, collectionArtwork.length).map((collection, index) => ({
                      src: collectionArtwork[index] ?? collection.image,
                      alt: `${collection.title} collection detail`,
                      label: collection.title,
                    })),
                  ]}
                />
              </Reveal>
              <div className="collection-stack">
                {collections.map((collection, index) => (
                  <Reveal key={collection.slug} className={`collection-strip-motion collection-strip-motion--${index + 1}`} delay={index * 0.03}>
                    <div className={`collection-strip collection-strip--${index + 1}`}>
                      <Link className="collection-strip__link" href={`/collections/${collection.slug}`} prefetch={true}>
                        <Image src={collectionArtwork[index]} alt={`${collection.title} collection detail`} width={320} height={400} />
                        <div>
                          <h3>{collection.title}</h3>
                          <div className="collection-strip__meta">
                            <span><i><CardsThree size={17} weight="fill" /></i><b>Game<small>{collection.game}</small></b></span>
                            <span><i><UsersThree size={17} weight="fill" /></i><b>Collector<small>{collection.curator}</small></b></span>
                          </div>
                          <p>{collection.summary}</p>
                        </div>
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--white guides-section" aria-labelledby="guides-title">
          <div className="container">
            <Reveal>
              <h2 id="guides-title">Practical guides</h2>
              <p className="section-intro">Clear, step-by-step advice to help you collect smarter,<br />protect your cards, and get more from the hobby.</p>
            </Reveal>
            <div className="home-guides-grid">
              {guides.map((guide, index) => (
                <Reveal key={guide.slug} className="home-guide-card" delay={index * 0.03}>
                  <Link href={`/guides/${guide.slug}`} prefetch={true} className="home-guide-card__image" aria-label={`Read ${guide.title}`}>
                    <Image src={guideArtwork[index]} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 33vw" />
                  </Link>
                  <div className="home-guide-card__body">
                    <p className="article-meta"><span><FolderOpen size={16} weight="fill" />{guide.category}</span><span><Clock size={16} weight="fill" />{guide.readTime}</span></p>
                    <h3><Link href={`/guides/${guide.slug}`} prefetch={true}>{guide.title}</Link></h3>
                    <p>{guide.summary}</p>
                    <Link className="text-link" href={`/guides/${guide.slug}`} prefetch={true}>Read guide <ArrowRight size={17} weight="bold" /></Link>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="guides-section__action"><Link className="button button--yellow" href="/guides" prefetch={true}>View all guides <ArrowRight size={20} weight="bold" /></Link></div>
          </div>
        </section>

        <section className="section section--cream partners-section" aria-labelledby="partners-title">
          <div className="container partners-section__grid">
            <Reveal>
              <p className="detail-kicker">Event partners</p>
              <h2 id="partners-title">Partners who help the trail grow.</h2>
              <p className="section-intro">Hobby Trail works with the Melbourne spaces, retailers, creators, and community partners who make every gathering more useful and welcoming.</p>
              <Link className="button button--black" href="/contact?topic=partnership" prefetch={true}>Become a partner <ArrowRight size={18} /></Link>
            </Reveal>
            <div className="sponsor-list" aria-label="Featured sponsors">
              {sponsors.length ? sponsors.map((sponsor) => {
                const content = <><Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={260} height={120} /><span>{sponsor.tier} partner</span></>;
                return sponsor.url ? <a key={sponsor.name} className="sponsor-card" href={sponsor.url} target="_blank" rel="noreferrer">{content}</a> : <div key={sponsor.name} className="sponsor-card">{content}</div>;
              }) : <div className="partner-empty">
                <div className="partner-empty__head">
                  <div className="partner-empty__icon"><Handshake size={25} weight="fill" /></div>
                  <div><p className="detail-kicker">Melbourne partner network</p><strong>Partners are joining the trail.</strong></div>
                  <span className="partner-empty__status">Open for introductions</span>
                </div>
                <p className="partner-empty__intro">Approved sponsor logos will appear here as partnerships are confirmed. Until then, these are the kinds of people who help Hobby Trail make room for the whole hobby.</p>
                <div className="partner-empty__grid">
                  <div className="partner-empty__card"><Storefront size={24} weight="fill" /><strong>Retailers</strong><span>Local shops and card rooms</span></div>
                  <div className="partner-empty__card"><Palette size={24} weight="fill" /><strong>Creators</strong><span>Artists, makers, and storytellers</span></div>
                  <div className="partner-empty__card"><UsersThree size={24} weight="fill" /><strong>Communities</strong><span>Clubs, leagues, and local groups</span></div>
                </div>
                <div className="partner-empty__footer"><span>Based in Melbourne, Victoria</span><Link className="text-link" href="/contact?topic=partnership" prefetch={true}>Start a conversation <ArrowRight size={17} /></Link></div>
              </div>}
            </div>
          </div>
        </section>

        <section className="section section--white testimonials-section" aria-labelledby="testimonials-title">
          <div className="container">
            <Reveal className="testimonials-section__heading"><p className="detail-kicker">From the community</p><h2 id="testimonials-title">Good events leave a story behind.</h2></Reveal>
            {testimonials.length ? <div className="testimonial-list">{testimonials.map((testimonial) => <blockquote key={`${testimonial.name}-${testimonial.quote}`}><p>“{testimonial.quote}”</p><footer><strong>{testimonial.name}</strong><span>{testimonial.role}{testimonial.organization ? `, ${testimonial.organization}` : ""}</span></footer></blockquote>)}</div> : <div className="testimonial-empty">
              <div className="testimonial-empty__visual"><Image src="/stock/events-card-table.jpg" alt="Collectors playing a card game together at a community table" fill sizes="(max-width: 820px) 100vw, 42vw" /><div><span>Melbourne, VIC</span><strong>Stories from the table</strong></div></div>
              <div className="testimonial-empty__body"><p className="detail-kicker">Verified stories, coming soon</p><h3>Have a Hobby Trail moment to share?</h3><p>We are gathering attendee, vendor, and partner stories with permission. The best part of an event often starts after the first hello.</p><div className="testimonial-empty__audiences"><span><UsersThree size={17} weight="fill" /> Attendees</span><span><Storefront size={17} weight="fill" /> Vendors</span><span><Handshake size={17} weight="fill" /> Partners</span></div><Link className="text-link text-link--large" href="/contact" prefetch={true}>Share your Hobby Trail experience <ArrowRight size={19} /></Link></div>
            </div>}
          </div>
        </section>

        <section className="about-strip" aria-labelledby="home-about-title">
          <div className="container about-strip__content">
            <div className="about-strip__copy"><p className="detail-kicker detail-kicker--light">About Hobby Trail</p><h2 id="home-about-title">More than cards. A place for every kind of hobbyist.</h2><p>Hobby Trail brings Pokémon and TCGs together with collectibles, gaming, creators, vendors, and the communities that make each interest worth sharing.</p><div className="button-row"><Link className="button button--light" href="/about" prefetch={true}>Why Hobby Trail <ArrowRight size={18} /></Link><Link className="button button--yellow" href="/vendors" prefetch={true}>Vendor expression of interest</Link></div><nav className="about-strip__route" aria-label="Explore Hobby Trail"><Link href="/events" prefetch={true}><span>01</span><strong>Find a room</strong><ArrowRight size={16} /></Link><Link href="/collections" prefetch={true}><span>02</span><strong>See collections</strong><ArrowRight size={16} /></Link><Link href="/guides" prefetch={true}><span>03</span><strong>Learn together</strong><ArrowRight size={16} /></Link></nav></div>
            <div className="about-strip__visual"><span className="about-strip__badge"><MapPin size={15} weight="fill" /> Melbourne, Australia</span><div className="about-strip__art"><Image src="/assets/brand/logo-mascot.png" alt="Hobby Trail mascot carrying cards, a camera, and an art brush" width={924} height={1013} /></div></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
