const CACHE_NAME = "kama-v1";
const STATIC_ASSETS = [
    "/",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];

// Install: pre-cache critical shell assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch strategy:
//   - API & admin routes: network-only
//   - Uploaded images:    cache-first (1 day TTL)
//   - Everything else:    stale-while-revalidate
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and cross-origin requests
    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    // Network-only for API and admin
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) {
        return;
    }

    // Cache-first for product images (uploads)
    if (url.pathname.startsWith("/uploads/")) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(request);
                if (cached) return cached;
                const response = await fetch(request);
                if (response.ok) cache.put(request, response.clone());
                return response;
            })
        );
        return;
    }

    // Stale-while-revalidate for pages and static assets
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(request);
            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response.ok) cache.put(request, response.clone());
                    return response;
                })
                .catch(() => cached); // offline fallback

            return cached || fetchPromise;
        })
    );
});
