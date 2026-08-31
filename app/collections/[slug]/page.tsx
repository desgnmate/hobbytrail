import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CardsThree, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/page-shell";
import { getCollection, getCollections } from "@/lib/content";

export async function generateStaticParams() { return (await getCollections()).map((collection) => ({ slug: collection.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  return collection ? { title: collection.title, description: collection.summary } : {};
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const collections = await getCollections();
  const related = collections.find((item) => item.slug !== collection.slug)!;

  return (
    <PageShell>
      <article className="detail-page collection-detail">
        <div className="detail-page__container">
          <Link className="back-link" href="/collections"><ArrowLeft size={18} /> All collections</Link>
          <header className="collection-detail__header">
            <div>
              <div className="detail-kicker">{collection.game} / {collection.era}</div>
              <h1>{collection.title}</h1>
              <p>{collection.summary}</p>
              <p className="collection-detail__curator">Curated by <strong>{collection.curator}</strong></p>
            </div>
            <div className="collection-detail__cover"><Image src={collection.image} alt={`Open binder from ${collection.title}`} fill preload sizes="(max-width: 820px) 100vw, 50vw" /></div>
          </header>

          <div className="collection-story">
            <div className="collection-story__copy">
              <CardsThree size={42} weight="fill" />
              <h2>Built one meaningful card at a time.</h2>
              {collection.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="collection-highlights">
              <h2>Collection notes</h2>
              {collection.highlights.map((highlight) => <div key={highlight}><Sparkle size={21} weight="fill" /><span>{highlight}</span></div>)}
              <p className="collection-format">Format: <strong>{collection.format}</strong></p>
            </div>
          </div>

          <section className="related-panel">
            <div><span>Continue exploring</span><h2>{related.title}</h2><p>{related.summary}</p></div>
            <Link className="button button--yellow" href={`/collections/${related.slug}`}>Next collection <ArrowRight size={18} /></Link>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
