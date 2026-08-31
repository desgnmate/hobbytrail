import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <PageShell><article className="prose-page"><div className="prose-page__content"><h1>Terms</h1><p>Last updated August 29, 2026</p><h2>Concept status</h2><p>This build is a design and development demonstration. Event names, venues, contact addresses, collection stories, and registration actions are sample content until Hobby Trail supplies verified production information.</p><h2>Event listings</h2><p>Organizers remain responsible for event accuracy, registration, safety, venue access, cancellations, and refunds. Visitors should confirm critical details with the organizer before traveling.</p><h2>Collector content</h2><p>Only publish card images, stories, names, and photographs with the required permission. Collection condition and value descriptions are informational opinions, not guarantees.</p><h2>Game properties</h2><p>Game names, artwork, and related marks belong to their respective owners. Hobby Trail must not imply sponsorship or endorsement without written permission.</p></div></article></PageShell>;
}
