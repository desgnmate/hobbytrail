"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/studio")) return;

    const motionPreference = window.matchMedia(reducedMotionQuery);
    let lenis: Lenis | null = null;

    const syncScrollPreference = () => {
      if (motionPreference.matches) {
        lenis?.destroy();
        lenis = null;
        return;
      }

      if (!lenis) {
        lenis = new Lenis({
          anchors: {
            duration: 0.95,
            offset: -96,
          },
          autoRaf: true,
          lerp: 0.085,
          smoothWheel: true,
          stopInertiaOnNavigate: true,
          wheelMultiplier: 0.9,
        });
      }
    };

    syncScrollPreference();
    motionPreference.addEventListener("change", syncScrollPreference);

    return () => {
      motionPreference.removeEventListener("change", syncScrollPreference);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
