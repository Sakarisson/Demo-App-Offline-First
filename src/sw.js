const CACHE_NAME = 'demo-app-offline-first-cache';
const FILES_TO_CACHE = [
  '/index.html',
  '/public/registerServiceWorker.js',
  '/public/style.css',
  '/offline.html',
  '/public/pics/dog1.jpeg',
  '/public/pics/dog2.jpeg',
  '/public/pics/dog3.jpeg',
  '/public/pics/dog4.jpeg',
  '/public/pics/dog5.jpeg',
];

// Cache files on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {  // If file is in cache, return that.
      return response || fetch(event.request)         // Otherwise, request file from network.
      .catch((error) => {
        return caches.match('/offline.html');         // If that doesn't work, serve offline
      })                                              // page from cache.
    })
  );
});
