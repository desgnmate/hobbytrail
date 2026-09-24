const CACHE_NAME = "hobby-trail-v2";

const PRECACHE_ASSETS = [
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
  "/assets/brand/logo-wordmark.png",
  "/assets/brand/logo-stacked.png",
  "/assets/brand/logo-badge.png",
  "/assets/brand/logo-mascot.png",
  "/generated/trail-events-clean.png",
  "/generated/trail-collections-clean.png",
  "/generated/trail-guides-clean.png",
  "/stock/events-card-table.jpg",
  "/stock/collection-overview.jpg",
  "/stock/guide-protect-cards.jpg",
];

// Precache primary routes and visual assets on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url, { credentials: "same-origin" })
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Clean up old caches on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate caching for navigation, Next.js RSC requests, and media assets
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept admin routes, CMS APIs, dev hot reload, or mutations
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/studio") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes("/_next/webpack-hmr") ||
    url.pathname.includes("hot-update") ||
    url.pathname.endsWith(".mp4") ||
    request.headers.has("range")
  ) {
    return;
  }

  const isNavigation = request.mode === "navigate";
  const isRsc = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  const isMediaOrStatic =
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/generated/") ||
    url.pathname.startsWith("/stock/") ||
    url.pathname.startsWith("/_next/static/");

  if (isNavigation || isRsc || isMediaOrStatic) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);

        // Fetch fresh copy from network in the background
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        // Return from cache instantly (0ms) if available, otherwise wait for network
        return cached || networkFetch;
      })
    );
  }
});
