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
            duration: 0.8,
            offset: -96,
          },
          autoRaf: true,
          lerp: 0.09,
          smoothWheel: true,
          stopInertiaOnNavigate: true,
          wheelMultiplier: 0.95,
        });
      }
    };

    syncScrollPreference();
    motionPreference.addEventListener("change", syncScrollPreference);

    return () => {
      motionPreference.removeEventListener("change", syncScrollPreference);
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
