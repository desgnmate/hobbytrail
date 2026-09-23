"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/studio")) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const motionPreference = window.matchMedia(reducedMotionQuery);

    const syncScrollPreference = () => {
      if (motionPreference.matches) {
        lenisRef.current?.destroy();
        lenisRef.current = null;
        return;
      }

      if (!lenisRef.current) {
        lenisRef.current = new Lenis({
          anchors: {
            duration: 0.45,
            offset: -96,
          },
          autoRaf: true,
          lerp: 0.12,
          smoothWheel: true,
          stopInertiaOnNavigate: true,
          wheelMultiplier: 1.0,
        });
      }
    };

    syncScrollPreference();
    motionPreference.addEventListener("change", syncScrollPreference);

    return () => {
      motionPreference.removeEventListener("change", syncScrollPreference);
    };
  }, [pathname]);

  // Instantly reset scroll position on route change so page transitions feel immediate
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/studio")) {
      return;
    }

    if (typeof window !== "undefined") {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target as HTMLElement, { immediate: true, offset: -96 });
          } else {
            target.scrollIntoView();
          }
          return;
        }
      }

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
