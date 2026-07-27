const CACHE_NAME = 'hesnok-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/hesnok_logo1.png',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Hesnok';
    const body = data.body || '🔔 اختبار إشعارات حصنك';
    const icon = data.icon || '/hesnok_logo1.png';
    const tag = data.tag || 'default';

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon,
            tag,
            badge: '/hesnok_logo1.png',
            vibrate: [200, 100, 200],
            requireInteraction: false
        })
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
