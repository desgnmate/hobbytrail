"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("ht_cache_ready", callback);
  return () => window.removeEventListener("ht_cache_ready", callback);
}

function getCacheSnapshot() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("ht_cache=1");
}

function getServerSnapshot() {
  return false;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const isCached = useSyncExternalStore(subscribe, getCacheSnapshot, getServerSnapshot);

  if (reduceMotion || isCached) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration: 0.25, delay: Math.min(delay, 0.08) }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
