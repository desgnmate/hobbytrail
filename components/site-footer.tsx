import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer>
      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="newsletter-section__content">
          <div>
            <h2 id="newsletter-title">Keep up with the trail.</h2>
            <p>Upcoming events, hobby discoveries, community stories, and useful guides. All in one place.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <div className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Image src="/assets/brand/logo-stacked.png" alt="Hobby Trail mascot and stacked wordmark" width={1045} height={998} />
            <p>Where every hobby leads somewhere.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/search" prefetch={true}>Games</Link>
            <Link href="/collections" prefetch={true}>Collections</Link>
            <Link href="/guides" prefetch={true}>Guides</Link>
            <Link href="/sponsors" prefetch={true}>Sponsors</Link>
            <Link href="/events" prefetch={true}>Events</Link>
            <Link href="/events/calendar" prefetch={true}>Event calendar</Link>
          </div>
          <div>
            <h3>Hobby Trail</h3>
            <Link href="/about" prefetch={true}>About Us</Link>
            <Link href="/about" prefetch={true}>How It Works</Link>
            <Link href="/collections" prefetch={true}>Stories</Link>
            <Link href="/contact" prefetch={true}>Support</Link>
            <Link href="/contact" prefetch={true}>Contact</Link>
            <Link href="/vendors" prefetch={true}>Vendor EOI</Link>
            <Link href="/sponsors" prefetch={true}>Become a sponsor</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/privacy">Cookie Policy</Link>
            <Link href="/terms">Community Rules</Link>
          </div>
          <div className="site-footer__social">
            <h3>Follow the trail</h3>
            <a href="https://www.instagram.com/hobbytrail.au/" target="_blank" rel="noreferrer"><InstagramLogo size={24} weight="fill" /> Instagram</a>
            <a href="mailto:hello@hobbytrail.com.au"><EnvelopeSimple size={24} weight="fill" /> hello@hobbytrail.com.au</a>
          </div>
        </div>
        <div className="site-footer__fineprint">
          <p>© 2026 Hobby Trail. All rights reserved.</p>
          <p>Designed and Developed by Desgnmate</p>
        </div>
      </div>
    </footer>
  );
}
