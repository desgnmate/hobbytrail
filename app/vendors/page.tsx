import type { Metadata } from "next";
import { Storefront, UsersThree, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { VendorEoiForm } from "@/components/vendor-eoi-form";

export const metadata: Metadata = {
  title: "Vendor expression of interest",
  description: "Apply to exhibit, sell, or showcase your work at a Hobby Trail event.",
  alternates: { canonical: "/vendors" },
};

export default function VendorsPage() {
  return (
    <PageShell>
      <PageHero title={["Bring your corner", "of the hobby."]} text="Hobby retailers, makers, artists, creators, collectors, clubs, communities, and businesses can register their interest in future Hobby Trail events." aside={<div className="hero-stamp"><Storefront size={38} weight="fill" /><span>Vendor EOI</span><strong>Open</strong><small>Future events</small></div>} />
      <section className="content-section vendor-page">
        <div className="content-container vendor-page__grid">
          <div className="vendor-page__intro">
            <p className="detail-kicker">Expression of interest</p>
            <h2>Help visitors discover something worth stopping for.</h2>
            <p>Tell the event team what you offer, the space you need, and how your work fits the Hobby Trail community. Applications are reviewed for relevance, quality, safety, and a balanced event mix.</p>
            <div className="vendor-benefit"><Storefront size={30} weight="fill" /><div><h3>A considered vendor mix</h3><p>Categories are curated so the event remains useful and enjoyable for visitors.</p></div></div>
            <div className="vendor-benefit"><UsersThree size={30} weight="fill" /><div><h3>A broad hobby audience</h3><p>TCGs sit alongside collectibles, gaming, artists, creators, and community groups.</p></div></div>
            <div className="vendor-benefit"><Sparkle size={30} weight="fill" /><div><h3>Clear next steps</h3><p>Shortlisted applicants receive event dates, commercial terms, venue rules, and onboarding details before committing.</p></div></div>
          </div>
          <VendorEoiForm />
        </div>
      </section>
    </PageShell>
  );
}
