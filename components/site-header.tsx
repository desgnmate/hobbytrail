"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/events", label: "Events" },
  { href: "/collections", label: "Collections" },
  { href: "/guides", label: "Guides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    // Prevent background scrolling while mobile nav is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <header className={`site-header${overlay ? " site-header--overlay" : ""}`}>
      <nav ref={navRef} className="site-nav" aria-label="Main navigation">
        <Link className="site-nav__logo" href="/" prefetch={true} aria-label="Hobby Trail home" onClick={() => setOpen(false)}>
          <Image src="/assets/brand/logo-wordmark.png" alt="Hobby Trail wordmark" width={973} height={408} priority />
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
              prefetch={true}
              className={pathname.startsWith(link.href) ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link className="nav-contact" href="/contact" prefetch={true} onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link className="button button--yellow nav-cta" href="/events#tickets" prefetch={true} onClick={() => setOpen(false)}>
            Buy tickets
          </Link>
        </div>
      </nav>
    </header>
  );
}
