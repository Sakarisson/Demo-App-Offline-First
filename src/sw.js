const CACHE_NAME = 'demo-app-offline-first-cache';
const FILES_TO_CACHE_IMMEDIATELY = [
  '/',
  '/index.html',
  '/public/registerServiceWorker.js',
  '/public/style.css',
  '/offline.html',
];

const DOG_PICS = [
  '/public/pics/dog1.jpeg',
  '/public/pics/dog2.jpeg',
  '/public/pics/dog3.jpeg',
  '/public/pics/dog4.jpeg',
  '/public/pics/dog5.jpeg',
];

// Cache files on install
self.addEventListener('install', (event) => {
  // Blocking path
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE_IMMEDIATELY).then(() => console.log('done adding main files'));
    })
  );
  // Lazy load non-essential files
  caches.open(CACHE_NAME).then((cache) => {
    console.log('lazily adding to cache', DOG_PICS);
    return cache.addAll(DOG_PICS).then(() => console.log('done adding dog pics'));
  });
});

self.addEventListener('fetch', (event) => {
  console.log('fetching');
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;                              // If file is in cache, return that.
      } else {
        return fetch(event.request)                   // Otherwise, request file from network.
        .catch((error) => {                           // If that doesn't work,
          return caches.match('/offline.html');       // serve offline page from cache.
        });
      }
    })
  );
});
