import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical, beginner-friendly guides for collecting, gaming, creators, card care, and local hobby events.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const guides = await getGuides();
  return (
    <PageShell>
      <PageHero title={["Learn the hobby", "without the gatekeeping."]} text="Clear, useful answers for protecting cards, joining events, understanding condition, and collecting with confidence." />
      <section className="content-section"><div className="content-container guide-index-grid">
        {guides.map((guide, index) => (
          <article className={`guide-index-card guide-index-card--${index === 0 ? "feature" : "standard"}`} key={guide.slug}>
            <Link className="guide-index-card__image" href={`/guides/${guide.slug}`} aria-label={`Read ${guide.title}`}><Image src={guide.image} alt="" fill sizes={index === 0 ? "(max-width: 820px) 100vw, 60vw" : "(max-width: 820px) 100vw, 36vw"} /></Link>
            <div><p className="article-meta"><span>{guide.category}</span><span>{guide.readTime}</span></p><h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.summary}</p><Link className="text-link" href={`/guides/${guide.slug}`}>Read guide <ArrowRight size={18} /></Link></div>
          </article>
        ))}
      </div></section>
    </PageShell>
  );
}
