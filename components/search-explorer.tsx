"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { Collection, Guide, HobbyEvent } from "@/data/site-data";

type SearchItem = { title: string; summary: string; href: string; type: string };

export function SearchExplorer({ events, collections, guides }: { events: HobbyEvent[]; collections: Collection[]; guides: Guide[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set("q", query.trim());
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  }, [query]);

  const items = useMemo<SearchItem[]>(() => [
      ...events.map((item) => ({ title: item.title, summary: item.description, href: `/events/${item.slug}`, type: "Event" })),
      ...collections.map((item) => ({ title: item.title, summary: item.summary, href: `/collections/${item.slug}`, type: "Collection" })),
      ...guides.map((item) => ({ title: item.title, summary: item.summary, href: `/guides/${item.slug}`, type: "Guide" })),
    ], [events, collections, guides]);
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((item) => `${item.title} ${item.summary} ${item.type}`.toLowerCase().includes(value));
  }, [items, query]);

  return (
    <div className="search-explorer">
      <label htmlFor="site-search">Search Hobby Trail</label>
      <div className="search-explorer__field"><MagnifyingGlass size={25} /><input id="site-search" className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try event, binder, or card care" /></div>
      <p className="results-count" aria-live="polite">{results.length} results</p>
      <div className="search-results">
        {results.map((item) => (
          <Link key={`${item.type}-${item.href}`} href={item.href} className="search-result">
            <span>{item.type}</span>
            <div><h2>{item.title}</h2><p>{item.summary}</p></div>
          </Link>
        ))}
      </div>
      {!results.length && <div className="empty-state"><h2>No results found.</h2><p>Try a shorter or more general search.</p></div>}
    </div>
  );
}
