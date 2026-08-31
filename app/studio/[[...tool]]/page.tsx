import type { Metadata } from "next";
import { SanityStudio } from "@/components/sanity-studio";
import { isSanityConfigured } from "@/lib/cms/config";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="studio-setup" id="main-content">
        <div>
          <p className="detail-kicker">CMS connection required</p>
          <h1>Hobby Trail Studio is ready to connect.</h1>
          <p>Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> to the local and Vercel environments. This route will then load the editor automatically.</p>
        </div>
      </main>
    );
  }

  return <SanityStudio />;
}
