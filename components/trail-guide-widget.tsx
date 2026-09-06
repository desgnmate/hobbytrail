"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDots,
  ChatCircleDots,
  Compass,
  Storefront,
  X,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

const guideLinks = [
  {
    href: "/events",
    label: "Find an event",
    detail: "Browse Melbourne events",
    icon: CalendarDots,
  },
  {
    href: "/guides",
    label: "Start collecting",
    detail: "Practical beginner guides",
    icon: BookOpen,
  },
  {
    href: "/vendors",
    label: "Vendor help",
    detail: "Exhibit at a future event",
    icon: Storefront,
  },
  {
    href: "/contact",
    label: "Contact support",
    detail: "Ask the Hobby Trail team",
    icon: ChatCircleDots,
  },
] as const;

export function TrailGuideWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hiddenFromCms = pathname.startsWith("/studio") || pathname.startsWith("/admin");
  const panelId = useId();
  const titleId = useId();
  const widgetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || hiddenFromCms) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (widgetRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [hiddenFromCms, open]);

  if (hiddenFromCms) return null;

  return (
    <aside ref={widgetRef} className="trail-guide-widget" aria-label="Hobby Trail help">
      {open ? (
        <section
          id={panelId}
          className="trail-guide-widget__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <div className="trail-guide-widget__heading">
            <span className="trail-guide-widget__kicker">
              <Image className="trail-guide-widget__kicker-logo" src="/assets/brand/logo-flag.png" alt="" width={30} height={24} aria-hidden="true" />
              Quick trail guide
            </span>
            <h2 id={titleId}>Where are you headed?</h2>
            <p>Choose a route and we’ll point you in the right direction.</p>
          </div>

          <nav className="trail-guide-widget__links" aria-label="Trail Guide shortcuts">
            {guideLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  <span className="trail-guide-widget__link-icon" aria-hidden="true">
                    <Icon size={19} weight="bold" />
                  </span>
                  <span className="trail-guide-widget__link-copy">
                    <strong>{link.label}</strong>
                    <small>{link.detail}</small>
                  </span>
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </section>
      ) : null}

      <button
        ref={triggerRef}
        className="trail-guide-widget__trigger"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close Trail Guide" : "Open Trail Guide"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="trail-guide-widget__trigger-icon" aria-hidden="true">
          {open ? <X size={20} weight="bold" /> : <Compass size={21} weight="fill" />}
        </span>
        <span>{open ? "Close guide" : "Trail guide"}</span>
      </button>
    </aside>
  );
}
