"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

const links = [
  { href: "/events", label: "Events" },
  { href: "/collections", label: "Collections" },
  { href: "/guides", label: "Guides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={`site-header${overlay ? " site-header--overlay" : ""}`}>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-nav__logo" href="/" aria-label="Hobby Trail home" onClick={() => setOpen(false)}>
          <Image src="/assets/hobby-trail-nav-logo.png" alt="Hobby Trail" width={152} height={64} />
        </Link>

        <button
          className="site-nav__menu"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>

        <div className="site-nav__links" id="mobile-navigation" data-open={open}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link className="nav-contact" href="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link className="button button--yellow nav-cta" href="/events#tickets" onClick={() => setOpen(false)}>
            Buy tickets
          </Link>
        </div>
      </nav>
    </header>
  );
}
