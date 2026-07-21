/**
 * FSTI UWG Malang - Progressive Web App (PWA) Service Worker
 * Cache-First & Network-Fallback Offline Cache Engine v2026.13
 */
const CACHE_NAME = 'fsti-uwg-cache-v2026.19';

const CORE_ASSETS = [
    './index.html',
    './tentang.html',
    './direktori-dosen.html',
    './penelitian.html',
    './pengabdian.html',
    './kerjasama.html',
    './prestasi.html',
    './alumni.html',
    './pmb.html',
    './pusat-unduhan.html',
    './prodi/informatika.html',
    './prodi/sistem-teknologi-informasi.html',
    './prodi/bisnis-digital.html',
    './css/style.css',
    './js/script.js',
    './js/lucide.min.js',
    './js/asset-guard.js',
    './js/alumni-data.js',
    './js/dosen-data.js',
    './js/kerjasama-data.js',
    './js/prestasi-data.js',
    './js/util-tabel.js',
    './js/karya-agregat.js',
    './assets/fonts/inter-latin.woff2',
    './assets/fonts/plus-jakarta-sans-latin.woff2',
    './assets/images/favicon.png',
    './assets/images/logo-final.webp',
    './assets/images/org-p8-0.webp',
    './data/biodata-dosen.csv',
    './data/alumni.csv',
    './data/Karya-Ilmiah-dosen-FSTI-clean.csv'
];

// Install Event: Pre-cache all core HTML, CSS, JS, fonts, and critical images
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS);
        })
    );
});

// Activate Event: Clean up old/stale caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Serve from Cache first, then Network fallback + dynamic caching
self.addEventListener('fetch', (event) => {
    // Only handle GET requests from HTTP/HTTPS
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Serve instantly from cache (0ms latency!)
                // Also trigger background network fetch to update cache silently if online
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {/* Offline, ignore */});
                return cachedResponse;
            }

            // If not in cache, fetch from network and dynamically cache
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // If network fails (Offline airplane mode) and requesting HTML page, return cached index.html
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
