/**
 * SIM4LON Service Worker
 * 
 * Lightweight SW for PWA installability + basic caching.
 * Strategy: Network-first for API, Cache-first for assets.
 */

const CACHE_NAME = 'sim4lon-v1'
const STATIC_ASSETS = [
    '/logo-sim4lon-transparant-v2.png',
    '/logo-sim4lon-transparant-v3.png',
]

// Install: pre-cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        })
    )
    self.clients.claim()
})

// Fetch: Network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // API requests: network-first (don't cache stale data)
    if (url.pathname.startsWith('/api')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({ error: 'Offline - tidak bisa terhubung ke server' }),
                    { status: 503, headers: { 'Content-Type': 'application/json' } }
                )
            })
        )
        return
    }

    // Static assets: cache-first
    if (
        request.destination === 'image' ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.woff2')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
            })
        )
        return
    }

    // HTML pages: network-first with offline fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    )
})
