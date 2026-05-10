// Minimal service worker for PWA installability and offline fallback.
// Caches the homepage shell; lets everything else go through the network.

const CACHE = 'rithala-v1';
const PRECACHE = ['/', '/manifest.json', '/logo.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // Don't intercept admin or API routes
  const url = new URL(request.url);
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return;

  e.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match('/')))
  );
});
