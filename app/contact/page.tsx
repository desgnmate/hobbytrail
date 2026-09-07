import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { EnvelopeSimple, MapPin, Timer } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Hobby Trail about events, collection features, partnerships, and general questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero title={["Tell us where", "the trail leads."]} text="Questions, event submissions, collection stories, and thoughtful partnership ideas are all welcome." aside={<Image className="page-hero__mark" src="/assets/brand/logo-badge.png" alt="Hobby Trail bear mascot" width={1024} height={1024} />} />
      <section className="content-section contact-page"><div className="content-container contact-page__grid">
        <div className="contact-page__intro">
          <h2>What happens next</h2>
          <div><EnvelopeSimple size={28} weight="fill" /><p><strong>Your message is reviewed by a person.</strong><br />Choose the closest topic so it reaches the right place.</p></div>
          <div><Timer size={28} weight="fill" /><p><strong>Expect a reply within two business days.</strong><br />Event submissions may take longer while details are verified.</p></div>
          <div><MapPin size={28} weight="fill" /><p><strong>Include exact event information.</strong><br />Date, timezone, venue, fee, registration link, and organizer contact help us verify a listing.</p></div>
        </div>
        <Suspense fallback={<div className="contact-form"><p>Loading form...</p></div>}>
          <ContactForm />
        </Suspense>
      </div></section>
    </PageShell>
  );
}
