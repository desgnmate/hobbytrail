import type { Metadata } from "next";
import { DM_Sans, Lilita_One } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { TrailGuideWidget } from "@/components/trail-guide-widget";

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
  alternates: { canonical: "/" },
  title: { default: "Hobby Trail | Find your place in the hobby", template: "%s | Hobby Trail" },
  description: "Events for Pokémon, TCGs, collectibles, gaming, creators, vendors, and hobby communities.",
  openGraph: {
    type: "website",
    title: "Hobby Trail",
    description: "Collect what you love. Find your people.",
    images: [{ url: "/assets/hobby-trail-hero-final.png", width: 1920, height: 1024, alt: "Hobby Trail mascot exploring a mountain trail" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hobby Trail",
    description: "Collect what you love. Find your people.",
    images: ["/assets/hobby-trail-hero-final.png"],
  },
  icons: { icon: "/assets/brand/logo-badge.png", apple: "/assets/brand/logo-badge.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbytrail.example";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hobby Trail",
    url: siteUrl,
    logo: `${siteUrl}/assets/brand/logo-horizontal.png`,
    description: "An event platform for Pokémon, TCGs, collectibles, gaming, creators, vendors, and hobby communities.",
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <TrailGuideWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
