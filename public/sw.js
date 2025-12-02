// Service Worker for Julefagdag PWA
const CACHE_NAME = "julefagdag-v2";
const RUNTIME_CACHE = "julefagdag-runtime-v2";
const API_CACHE_MAX_AGE = 30000; // 30 seconds for API responses

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/favorites", "/manifest.json"]);
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
  return self.clients.claim();
});

// Check if response is still fresh
function isCacheFresh(cachedResponse) {
  if (!cachedResponse) return false;

  const cachedDate = cachedResponse.headers.get("sw-cached-date");
  if (!cachedDate) return false;

  const age = Date.now() - parseInt(cachedDate, 10);
  return age < API_CACHE_MAX_AGE;
}

// Fetch event - network-first for API, cache-first for static assets
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const isApiRequest = event.request.url.includes("/api/");

  if (isApiRequest) {
    // Network-first strategy for API calls
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response and add cache timestamp
          const responseToCache = response.clone();
          const headers = new Headers(responseToCache.headers);
          headers.set("sw-cached-date", Date.now().toString());

          const cachedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          });

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, cachedResponse);
          });

          return response;
        })
        .catch(() => {
          // Network failed, try cache with freshness check
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse && isCacheFresh(cachedResponse)) {
              return cachedResponse;
            }
            // Return stale cache if network fails, or create error response
            return (
              cachedResponse ||
              new Response(
                JSON.stringify({
                  error: "Offline og ingen cache tilgjengelig",
                }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                },
              )
            );
          });
        }),
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      }),
    );
  }
});

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Julefagdag";
  const options = {
    body: data.body || "Du har en varsel",
    icon: "/icon-192.svg",
    badge: "/icon-192.svg",
    vibrate: [200, 100, 200],
    data: data,
    tag: data.tag || "julefagdag-notification",
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data;
  const urlToOpen = data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
