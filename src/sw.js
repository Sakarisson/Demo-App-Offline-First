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
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      let offline = false;
      return cache.match(event.request).then((response) => {      // Respond with whatever this promise resolves to.
        if (response) {
          return response;                                        // If file is in cache, return that.
        } else {                                                  // Otherwise...
          const fetchPromise = fetch(event.request)               // Attempt to fetch data from network
          .catch((error) => {                                     // If that doesn't work...
            console.log(error);
            offline = true;
            return caches.match('/offline.html');                 // Respond with an offline page
          })
          .then((response) => {
            if (!offline) {                                       // If network fetch succeeded, though...
              cache.put(event.request, response.clone());         // First add page to cache,
            }
            return response;                                      // and then respond with result from fetch
          });
          return fetchPromise;
        }
      })
    })
  );
});

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.filter(() => true)
//         .map((cacheName) => caches.delete(cacheName))
//       );
//     })
//   );
// })

// This is essentially the stale-while-revalidate strategy
// self.addEventListener('fetch', (event) => {
//   console.log('fetching', event.request.url);
//   event.respondWith(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.match(event.request).then((response) => {
//         const fetchPromise = fetch(event.request).then((networkResponse) => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         })
//         return response || fetchPromise;
//       })
//     })
//   );
// });
