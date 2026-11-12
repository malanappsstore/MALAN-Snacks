const CACHE_NAME = 'malan-v2.8'; // ⚠️ CAMBIA ESTE 'v1' por 'v2', 'v3', etc., cada vez que subas cambios grandes.
const urlsToCache = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

// 1. Instalar y forzar a que se active de inmediato
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 2. Borrar cachés viejos y tomar el control de la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Borra la versión anterior
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la app inmediatamente
  );
});

// 3. Estrategia: Red primero (Network First) para el HTML, Caché para lo demás
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || event.request.url.includes('index.html')) {
    // Para el HTML, busca en internet primero
    event.respondWith(
      fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // Si no hay internet, usa el caché
        return caches.match(event.request);
      })
    );
  } else {
    // Para imágenes y otros, usa el caché primero
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
