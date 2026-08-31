import type { Metadata } from "next";
import { DM_Sans, Lilita_One } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PreviewBanner } from "@/components/preview-banner";
import { TrailGuideWidget } from "@/components/trail-guide-widget";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

const display = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example"),
  title: { default: "Hobby Trail | Find your place in the hobby", template: "%s | Hobby Trail" },
  description: "Events for Pokémon, TCGs, collectibles, gaming, creators, vendors, and hobby communities.",
  openGraph: {
    type: "website",
    title: "Hobby Trail",
    description: "Collect what you love. Find your people.",
    images: [{ url: "/assets/hobby-trail-hero-final.png", width: 1920, height: 1024, alt: "Hobby Trail mascot exploring a mountain trail" }],
  },
  icons: { icon: "/assets/hobby-trail-logo-mark.png", apple: "/assets/hobby-trail-logo-mark.png" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled: isDraftMode } = await draftMode();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hobby Trail",
    url: siteUrl,
    logo: `${siteUrl}/assets/hobby-trail-logo-main.png`,
    description: "An event platform for Pokémon, TCGs, collectibles, gaming, creators, vendors, and hobby communities.",
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth">
      <body>
        <SmoothScroll />
        <PreviewBanner />
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <TrailGuideWidget />
        {isDraftMode && <VisualEditing />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
