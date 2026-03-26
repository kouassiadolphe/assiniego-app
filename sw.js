const CACHE_NAME = 'assiniego-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/components.css',
  '/js/app.js',
  '/js/data.js',
  '/js/router.js',
  '/js/animations.js',
  '/js/offline.js',
  '/pages/home.html',
  '/pages/activities.html',
  '/pages/booking.html',
  '/pages/profile.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});