const CACHE_NAME = "quickcart-cache-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./service-worker.js",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  console.log("[SW] Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching app shell");
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log("[SW] Removing old cache:", key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  console.log("[SW] Fetch event:", event.request.url);

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();

          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return new Response("Offline content not available.", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        });
    })
  );
});

self.addEventListener("sync", (event) => {
  console.log("[SW] Sync event fired:", event.tag);

  if (event.tag === "cart-sync") {
    event.waitUntil(
      (async () => {
        console.log("[SW] Simulating background sync task...");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log("[SW] Background sync complete: cart items synced.");
      })()
    );
  }
});

self.addEventListener("push", (event) => {
  console.log("[SW] Push event received");

  const data = event.data ? event.data.text() : "New deals are waiting for you in QuickCart!";

  event.waitUntil(
    self.registration.showNotification("QuickCart", {
      body: data,
      icon: "./icons/icon-192.svg",
      badge: "./icons/icon-192.svg"
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click event");
  event.notification.close();
  event.waitUntil(clients.openWindow("./index.html"));
});