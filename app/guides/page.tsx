import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Simple, useful guides for exploring new interests, learning something new, and joining hobby communities.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const guides = await getGuides();
  return (
    <PageShell>
      <PageHero title={["Discover hobbies", "without the gatekeeping."]} text="Simple, useful guides to help you explore new interests, learn something new, and get involved with hobby communities." />
      <section className="content-section"><div className="content-container guide-index-grid">
        {guides.map((guide, index) => (
          <article className="guide-index-card" key={guide.slug}>
            <Link className="guide-index-card__image" href={`/guides/${guide.slug}`} prefetch={true} aria-label={`Read ${guide.title}`}><Image src={guide.image} alt="" fill priority={index === 0} sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 33vw" /></Link>
            <div><p className="article-meta"><span>{guide.category}</span><span>{guide.readTime}</span></p><h2><Link href={`/guides/${guide.slug}`} prefetch={true}>{guide.title}</Link></h2><p>{guide.summary}</p><Link className="text-link" href={`/guides/${guide.slug}`} prefetch={true}>Read guide <ArrowRight size={18} /></Link></div>
          </article>
        ))}
      </div></section>
    </PageShell>
  );
}
