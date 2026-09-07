import type { Metadata } from "next";
import Image from "next/image";
import { CollectionExplorer } from "@/components/collection-explorer";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getCollections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore TCG binders, collecting ideas, and the stories behind favorite cards.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <PageShell>
      <PageHero title={["Every binder", "tells a story."]} text="Explore thoughtful collections built around artwork, memories, eras, and the simple joy of the search." aside={<Image className="page-hero__mark" src="/assets/brand/logo-badge.png" alt="Hobby Trail collector mascot" width={1024} height={1024} />} />
      <section className="content-section"><div className="content-container"><CollectionExplorer collections={collections} /></div></section>
    </PageShell>
  );
}
