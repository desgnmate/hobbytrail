import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Learn about accessibility features, standards support, and reporting options for Hobby Trail.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <PageShell><article className="prose-page"><div className="prose-page__content"><h1>Accessibility</h1><p>Hobby Trail is designed to be usable with a keyboard, screen reader, zoom, reduced motion, and high-contrast text.</p><h2>What the build supports</h2><ul><li>Semantic headings and landmarks</li><li>A skip link and visible focus states</li><li>Keyboard-accessible navigation, filters, forms, and links</li><li>Labels and error messages for form fields</li><li>Reduced-motion fallbacks</li><li>Responsive layouts and large touch targets</li></ul><h2>Known limitations</h2><p>This demonstration still requires testing with production content, assistive technologies, and real users before launch. Map links and third-party registration experiences will have their own accessibility behavior.</p><h2>Report a problem</h2><p>Use the Contact page and select General question. Include the page, browser, assistive technology, and a short description of the issue.</p></div></article></PageShell>;
}
