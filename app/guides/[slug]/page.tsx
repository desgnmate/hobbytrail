import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/page-shell";
import { getGuide, getGuides } from "@/lib/content";

export async function generateStaticParams() { return (await getGuides()).map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  return guide ? { title: guide.title, description: guide.summary } : {};
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();
  const guides = await getGuides();
  const related = guides.find((item) => item.slug !== guide.slug)!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const articleImage = guide.image.startsWith("http") ? guide.image : `${siteUrl}${guide.image}`;
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.summary, image: articleImage, author: { "@type": "Organization", name: "Hobby Trail" }, datePublished: "2026-08-29", dateModified: "2026-08-29" };

  return (
    <PageShell>
      <article className="article-page">
        <div className="article-page__header">
          <Link className="back-link" href="/guides"><ArrowLeft size={18} /> All guides</Link>
          <p className="article-meta"><span>{guide.category}</span><span>{guide.readTime}</span></p>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <div className="article-page__byline"><span>Hobby Trail editorial team</span><span>Updated August 29, 2026</span></div>
        </div>
        <div className="article-page__image"><Image src={guide.image} alt="Card collecting tools arranged on a wooden desk" fill preload sizes="100vw" /></div>
        <div className="article-page__body">
          <aside className="article-page__toc"><h2>In this guide</h2>{guide.sections.map((section) => <a key={section.heading} href={`#${section.heading.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}`}>{section.heading}</a>)}</aside>
          <div className="article-page__copy">
            <p className="article-page__lead">{guide.intro}</p>
            {guide.sections.map((section) => <section key={section.heading} id={section.heading.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
            <div className="article-note"><strong>A note on value</strong><p>Card prices, condition opinions, and grading outcomes can change. Use current sources and seek a qualified opinion for high-value decisions.</p></div>
          </div>
        </div>
        <div className="article-page__related"><div><span>Read next</span><h2>{related.title}</h2></div><Link className="button button--yellow" href={`/guides/${related.slug}`}>Open guide <ArrowRight size={18} /></Link></div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      </article>
    </PageShell>
  );
}
