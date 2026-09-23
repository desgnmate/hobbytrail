"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { Collection } from "@/data/site-data";

export function CollectionExplorer({ collections }: { collections: Collection[] }) {
  const [format, setFormat] = useState("All");
  const [query, setQuery] = useState("");
  const formats = ["All", ...Array.from(new Set(collections.map((collection) => collection.format)))];
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return collections.filter((collection) => (format === "All" || collection.format === format) && (!value || `${collection.title} ${collection.curator} ${collection.game} ${collection.era}`.toLowerCase().includes(value)));
  }, [collections, format, query]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-field filter-field--wide">
          <label htmlFor="collection-search">Search collections</label>
          <input id="collection-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, curator, game, or era" />
        </div>
        <div className="filter-field">
          <label htmlFor="collection-format">Format</label>
          <select id="collection-format" value={format} onChange={(event) => setFormat(event.target.value)}>
            {formats.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "collection" : "collections"}</p>
      </div>

      {filtered.length ? (
        <div className="collection-index-grid">
          {filtered.map((collection, index) => (
            <article className="collection-index-card" key={collection.slug}>
              <Link className="collection-index-card__image" href={`/collections/${collection.slug}`} prefetch={true}>
                <Image src={collection.image} alt={`A preview of ${collection.title}`} fill priority={index < 3} sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw" />
              </Link>
              <div>
                <p className="collection-index-card__meta">{collection.game} / {collection.era}</p>
                <h2><Link href={`/collections/${collection.slug}`} prefetch={true}>{collection.title}</Link></h2>
                <p>{collection.summary}</p>
                <p className="collection-index-card__curator">Curated by {collection.curator}</p>
                <Link className="text-link" href={`/collections/${collection.slug}`} prefetch={true}>Open collection <ArrowRight size={18} /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state"><h2>Nothing matched that search.</h2><p>Try a broader title, game, era, or format.</p></div>
      )}
    </>
  );
}
