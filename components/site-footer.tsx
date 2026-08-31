import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react/dist/ssr";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer>
      <section className="newsletter-section" aria-labelledby="newsletter-title">
        <div className="newsletter-section__content">
          <div>
            <h2 id="newsletter-title">Keep up with the trail.</h2>
            <p>Upcoming events, new collection stories, and useful guides. Sent with care.</p>
            <NewsletterForm />
          </div>
          <Image className="newsletter-mark" src="/generated/newsletter-trail-sign.png" alt="Hobby Trail bear waving beside a wooden trail sign" width={724} height={543} />
        </div>
      </section>

      <div className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Image src="/assets/hobby-trail-footer-logo.png" alt="Hobby Trail" width={206} height={197} />
            <p>Follow your hobby. Build your collection.<br />You&apos;re not alone on the trail.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/search">Games</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/events">Community</Link>
            <Link href="/events">Events</Link>
            <Link href="/events/calendar">Event calendar</Link>
          </div>
          <div>
            <h3>Hobby Trail</h3>
            <Link href="/about">About Us</Link>
            <Link href="/about">How It Works</Link>
            <Link href="/collections">Stories</Link>
            <Link href="/contact">Support</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/vendors">Vendor EOI</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/privacy">Cookie Policy</Link>
            <Link href="/terms">Community Rules</Link>
          </div>
          <div className="site-footer__social"><h3>Follow the trail</h3><p className="site-footer__social-note">Official social channels will be linked here after client verification.</p><Link href="/contact">Contact the team</Link></div>
        </div>
        <div className="site-footer__fineprint">
          <p>© 2026 Hobby Trail. All rights reserved.</p>
          <p>Hobby Trail and the Hobby Trail logo are trademarks of Hobby Trail Inc.</p>
          <PawPrint className="site-footer__paw" size={38} weight="fill" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
