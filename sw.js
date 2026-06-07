// BOS TacBoard Service Worker — Offline-Cache
const CACHE_NAME = 'tacboard-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './img/logo.png',
    './manifest.json'
];

// 1. Installation: Dateien in den Cache laden
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Aktivierung: Alte Caches löschen, falls eine neue Version existiert
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Fetch: Anfragen abfangen und aus dem Cache oder Netzwerk beantworten
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Wenn im Cache gefunden, gib die gecachte Version zurück
            if (response) {
                return response;
            }
            // Wenn nicht, lade aus dem Netzwerk
            return fetch(event.request);
        })
    );
});
