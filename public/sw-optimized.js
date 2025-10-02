// Optimized Service Worker for better performance

const CACHE_NAME = 'portfolio-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
]

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  '/images/',
  '/assets/',
  '/resume/'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (url.origin !== location.origin) return

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // Update cache in background for dynamic content
          if (isDynamicAsset(request.url)) {
            updateCache(request)
          }
          return cachedResponse
        }

        // Fetch from network and cache if appropriate
        return fetch(request)
          .then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone()
              
              if (isStaticAsset(request.url)) {
                cacheResponse(STATIC_CACHE, request, responseClone)
              } else if (isDynamicAsset(request.url)) {
                cacheResponse(DYNAMIC_CACHE, request, responseClone)
              }
            }
            
            return networkResponse
          })
          .catch((error) => {
            console.error('Service Worker: Network request failed', error)
            
            // Return offline fallback for HTML requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html') || 
                     new Response('Offline - Please check your connection', {
                       status: 503,
                       statusText: 'Service Unavailable'
                     })
            }
            
            throw error
          })
      })
  )
})

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.woff') ||
         url.includes('.woff2')
}

function isDynamicAsset(url) {
  return DYNAMIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.png') ||
         url.includes('.svg') ||
         url.includes('.webp')
}

function cacheResponse(cacheName, request, response) {
  caches.open(cacheName)
    .then((cache) => {
      cache.put(request, response)
    })
    .catch((error) => {
      console.error('Service Worker: Failed to cache response', error)
    })
}

function updateCache(request) {
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, response.clone())
          })
      }
    })
    .catch(() => {
      // Silently fail - we have cached version
    })
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Service Worker: Background sync triggered')
    )
  }
})

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'portfolio-notification'
      })
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})