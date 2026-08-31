import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SearchExplorer } from "@/components/search-explorer";
import { getCollections, getEvents, getGuides } from "@/lib/content";

export const metadata: Metadata = { title: "Search", description: "Search Hobby Trail events, collections, and guides." };

export default async function SearchPage() {
  const [events, collections, guides] = await Promise.all([getEvents(), getCollections(), getGuides()]);
  return <PageShell><PageHero title={["Search the whole", "trail."]} text="Find an event, collection story, or guide from one place." /><section className="content-section"><div className="content-container"><SearchExplorer events={events} collections={collections} guides={guides} /></div></section></PageShell>;
}
