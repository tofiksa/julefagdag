// Service Worker for Julefagdag PWA — generated from sw.template.js; do not edit sw.js directly
const CACHE_VERSION = "__CACHE_VERSION__";
const CACHE_NAME = `julefagdag-${CACHE_VERSION}`;
const RUNTIME_CACHE = `julefagdag-runtime-${CACHE_VERSION}`;
const API_CACHE_MAX_AGE = 30000; // 30 seconds for API responses
const OFFLINE_URL = "/offline";

// Install event - cache essential offline resources (used only when network fails)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/offline", "/manifest.json"]);
    }),
  );
});

// Allow the page to trigger activation after the user accepts the update prompt
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Activate event - remove caches from previous deploys
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName)),
        );
      })
      .then(() => self.clients.claim())
      .then(() => {
        return self.clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((clientList) => {
            for (const client of clientList) {
              client.postMessage({ type: "SW_UPDATED" });
            }
          });
      }),
  );
});

function isCacheFresh(cachedResponse) {
  if (!cachedResponse) return false;

  const cachedDate = cachedResponse.headers.get("sw-cached-date");
  if (!cachedDate) return false;

  const age = Date.now() - Number.parseInt(cachedDate, 10);
  return age < API_CACHE_MAX_AGE;
}

function cacheResponse(request, response) {
  if (!response || response.status !== 200 || response.type !== "basic") {
    return;
  }

  const responseToCache = response.clone();
  caches.open(RUNTIME_CACHE).then((cache) => {
    cache.put(request, responseToCache);
  });
}

// Fetch event - network-first for pages and assets; API cached briefly for offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const isApiRequest = event.request.url.includes("/api/");
  const isNavigation = event.request.mode === "navigate";

  if (isApiRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

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
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse && isCacheFresh(cachedResponse)) {
              return cachedResponse;
            }

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
    return;
  }

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          cacheResponse(event.request, response);
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        }),
    );
    return;
  }

  // Network-first for static assets so deploys propagate quickly
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        cacheResponse(event.request, response);
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || Response.error();
        });
      }),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Inspirasjonsdag";
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
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
