// Сервис-воркер для PWA
const CACHE_NAME = 'arsenal-school-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/992cf1d34fb7a6bde5b1.png',
  '/b3a74c285a0e120c85bd.png',
  '/c733a880bd6d3d1f0f38.png',
  '/d54370a07df790a33e70.png',
  '/e7935e3b4e9fd0dc134a.png',
];

// Установка сервис-воркера
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Открыт кэш');
      return cache.addAll(urlsToCache);
    })
  );
});

// Активация сервис-воркера
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов и использование кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Возвращаем кэшированный ответ или делаем сетевой запрос
      return response || fetch(event.request);
    })
  );
});
