import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, ShieldCheck, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "About", description: "Meet Hobby Trail, the event platform connecting Pokémon, TCG, collectibles, gaming, creator, and hobby communities." };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="about-hero">
        <div className="about-hero__content">
          <div><h1 aria-label="The hobby is a journey worth sharing."><span aria-hidden="true">The hobby is a journey</span><span aria-hidden="true">worth sharing.</span></h1><p>Hobby Trail brings Pokémon, TCGs, collectibles, gaming, creators, vendors, and curious newcomers together in welcoming real-world spaces.</p></div>
          <Image src="/assets/brand/logo-horizontal.png" alt="Hobby Trail mascot with cards, camera, and art brush" width={1013} height={512} preload />
        </div>
      </section>
      <section className="section section--white about-story"><div className="container">
        <div className="about-story__grid"><h2>Built for the part of a hobby that happens between people.</h2><div><p>A new interest can begin with a favorite character, a piece of artwork, a game night, a creator you follow, or something handed over by a friend. Hobby Trail makes space for all of those starting points.</p><p>We focus on the human side of hobbies: learning without embarrassment, trading with care, discovering independent makers, and finding people who understand the excitement.</p></div></div>
      </div></section>
      <section className="section section--cream principles"><div className="container">
        <h2>How we show up</h2>
        <div className="principles__list">
          <div><HandHeart size={44} weight="fill" /><h3>Welcome the beginner</h3><p>Clear language, useful context, and no gatekeeping. Every experienced collector started by asking a first question.</p></div>
          <div><ShieldCheck size={44} weight="fill" /><h3>Trade with care</h3><p>Transparent condition notes, confirmed terms, protected cards, and respect for anyone who chooses not to trade.</p></div>
          <div><UsersThree size={44} weight="fill" /><h3>Make room for people</h3><p>Events and stories should represent different games, goals, ages, budgets, and ways of enjoying the hobby.</p></div>
        </div>
      </div></section>
      <section className="about-cta"><div className="container"><div><h2>Have something worth sharing?</h2><p>Tell us about an event, a collection, or a useful idea for the community.</p></div><Link className="button button--light" href="/contact">Contact Hobby Trail <ArrowRight size={18} /></Link></div></section>
    </PageShell>
  );
}
