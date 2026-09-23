import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, Megaphone, Storefront, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getSponsors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Meet the partners supporting Hobby Trail events and learn how to become a sponsor.",
  alternates: { canonical: "/sponsors" },
};

const partnershipBenefits = [
  { icon: UsersThree, title: "Meet hobby communities", text: "Connect with people gathering around games, collecting, making, creating, and shared interests." },
  { icon: Storefront, title: "Show up with purpose", text: "Build useful, visible activations that add something genuine to the event experience." },
  { icon: Megaphone, title: "Support the whole trail", text: "Help make welcoming Melbourne events possible for newcomers, regulars, vendors, and community groups." },
] as const;

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <PageShell>
      <PageHero
        title={["Help every hobby", "find its people."]}
        text="Partner with Hobby Trail to support welcoming events, independent makers, and hobby communities across Melbourne."
        aside={<div className="hero-stamp"><Handshake size={38} weight="fill" /><span>Partnerships</span><strong>Open</strong><small>Melbourne events</small></div>}
      />
      <section className="content-section sponsors-page">
        <div className="content-container">
          <div className="sponsors-page__intro">
            <div><p className="detail-kicker">Featured partners</p><h2>Good events are built together.</h2></div>
            <p>We work with partners who respect hobby communities and want to create something useful, memorable, and welcoming.</p>
          </div>

          {sponsors.length ? (
            <div className="sponsors-page__logos" aria-label="Hobby Trail sponsors">
              {sponsors.map((sponsor) => {
                const card = <><Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={300} height={140} /><div><span>{sponsor.tier} partner</span><h3>{sponsor.name}</h3>{sponsor.description && <p>{sponsor.description}</p>}</div></>;
                return sponsor.url ? <a key={sponsor.name} href={sponsor.url} target="_blank" rel="noreferrer">{card}</a> : <article key={sponsor.name}>{card}</article>;
              })}
            </div>
          ) : (
            <div className="sponsors-page__open">
              <span><Handshake size={30} weight="fill" /></span>
              <div><p className="detail-kicker">Partner lineup in progress</p><h3>There is room on the trail.</h3><p>Approved sponsor names and logos will appear here as event partnerships are confirmed.</p></div>
              <Link className="button button--yellow" href="/contact?topic=partnership">Start a conversation <ArrowRight size={18} weight="bold" /></Link>
            </div>
          )}

          <div className="sponsors-page__benefits">
            {partnershipBenefits.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={30} weight="fill" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>

          <div className="sponsors-page__cta"><div><p className="detail-kicker">Become a sponsor</p><h2>Bring something valuable to the room.</h2><p>Tell us about your organisation, audience, and the kind of partnership you have in mind.</p></div><Link className="button button--black" href="/contact?topic=partnership">Discuss a partnership <ArrowRight size={18} weight="bold" /></Link></div>
        </div>
      </section>
    </PageShell>
  );
}
