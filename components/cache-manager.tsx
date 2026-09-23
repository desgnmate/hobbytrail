"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PRIMARY_ROUTES = [
  "/",
  "/events",
  "/collections",
  "/guides",
  "/vendors",
  "/sponsors",
  "/about",
  "/contact",
  "/search",
  "/events/calendar",
];

const CACHE_COOKIE_NAME = "ht_cache";

export function CacheManager() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Reset progress bar on pathname change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavigating(false);
  }

  useEffect(() => {
    // 1. Set long-lived client cache cookies and notify sync stores
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie.includes(`${CACHE_COOKIE_NAME}=1`);
      if (!hasCookie) {
        document.cookie = `${CACHE_COOKIE_NAME}=1; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = "ht_nav_ready=1; path=/; max-age=2592000; SameSite=Lax";
      }
      try {
        sessionStorage.setItem("ht_nav_cached", "1");
      } catch {
        // Ignore storage restrictions
      }
      window.dispatchEvent(new Event("ht_cache_ready"));
    }

    // 2. Register Service Worker for instant offline & Stale-While-Revalidate caching
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    }

    // 3. Preload and warm Next.js client router cache for primary pages in idle time
    const prewarmRouter = () => {
      PRIMARY_ROUTES.forEach((route) => {
        try {
          router.prefetch(route);
        } catch {
          // Non-fatal
        }
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prewarmRouter, { timeout: 1000 });
    } else {
      setTimeout(prewarmRouter, 100);
    }

    // 4. Instant Hover & Touch Preloader: Warm routes immediately when user hovers or taps any link
    const handlePointerOver = (event: PointerEvent | TouchEvent) => {
      const target = (event.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("/") && !href.startsWith("/#") && !href.startsWith("/admin")) {
        try {
          router.prefetch(href);
        } catch {
          // Non-fatal
        }
      }
    };

    // 5. Instant Click Feedback: Start progress indicator immediately on link click
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("/admin") &&
        target.target !== "_blank" &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        setNavigating(true);
      }
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("touchstart", handlePointerOver, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("touchstart", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, [router]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: navigating ? "85%" : "0%",
        opacity: navigating ? 1 : 0,
        backgroundColor: "var(--trail-yellow, #f7c948)",
        boxShadow: "0 0 10px rgba(247, 201, 72, 0.7)",
        zIndex: 999999,
        transition: navigating ? "width 180ms cubic-bezier(0.1, 0.9, 0.2, 1), opacity 100ms ease" : "opacity 200ms ease",
        pointerEvents: "none",
      }}
    />
  );
}
