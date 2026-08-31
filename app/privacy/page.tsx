import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <PageShell><article className="prose-page"><div className="prose-page__content"><h1>Privacy</h1><p>Last updated August 29, 2026</p><h2>What this concept collects</h2><p>The current website demonstration keeps form submissions in the browser and does not send them to a server. A production release must connect forms to an approved provider and update this policy before collecting personal information.</p><h2>Newsletter and contact information</h2><p>If newsletter or contact services are connected, Hobby Trail should collect only the information needed to respond or deliver the requested updates. The production policy must name every processor, retention period, and deletion method.</p><h2>Analytics</h2><p>Analytics should be configured to measure useful product actions with the least personal data possible. Consent requirements depend on the final tools and launch regions.</p><h2>Your choices</h2><p>A production contact address must be added for access, correction, export, and deletion requests.</p></div></article></PageShell>;
}
