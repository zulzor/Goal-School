const CACHE_NAME = 'arsenal-app-v1.4';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/icon.png',
  '/favicon.png',
  '/adaptive-icon.png',
  '/fallback.html',
  '/manifest.json',
  '/terms.html',
  '/privacy.html',
  '/support.html',
  '/404.html',
  '/test-api.html'
];

// Файлы для кэширования при первом запросе (стратегия cache-first)
const cacheFirstUrls = [
  '/icon.png',
  '/favicon.png',
  '/adaptive-icon.png',
  '/manifest.json',
  '/terms.html',
  '/privacy.html',
  '/support.html',
  '/404.html'
];

// Файлы для сетевого запроса с fallback на кэш (стратегия network-first)
const networkFirstUrls = [
  '/',
  '/index.html',
  '/api/',
  '/login',
  '/register',
  '/test-api.html'
];

// Флаг для отслеживания состояния подключения
let isOnline = true;
let connectionCheckInterval;

// Установка service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache initial resources:', error);
      })
  );
  self.skipWaiting(); // Активируем service worker немедленно
});

// Активация service worker
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
  return self.clients.claim(); // Получаем контроль над всеми страницами
});

// Добавляем обработчик события, который запускает проверку соединения после активации
self.addEventListener('activate', event => {
  // Запускаем периодическую проверку соединения
  startConnectionCheck();
});

// Начало периодической проверки соединения
function startConnectionCheck() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
  
  connectionCheckInterval = setInterval(() => {
    checkConnection();
  }, 30000); // Проверяем каждые 30 секунд
}

// Проверка соединения
async function checkConnection() {
  try {
    const response = await fetch('/api/health', { 
      method: 'GET', 
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      isOnline = true;
      // Уведомляем клиентов о восстановлении соединения
      notifyClients('connection-restored');
    } else {
      isOnline = false;
      // Уведомляем клиентов о потере соединения
      notifyClients('connection-lost');
    }
  } catch (error) {
    isOnline = false;
    // Уведомляем клиентов о потере соединения
    notifyClients('connection-lost');
  }
}

// Уведомление клиентов об изменениях состояния соединения
async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: message,
      timestamp: new Date().toISOString()
    });
  });
}

// Обработка запросов
self.addEventListener('fetch', event => {
  // Только для GET запросов
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Проверяем, является ли запрос API вызовом
  if (url.pathname.startsWith('/api/')) {
    // Для API используем стратегию network-first
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Для статических файлов используем стратегию cache-first
  if (cacheFirstUrls.some(cacheUrl => url.pathname.includes(cacheUrl))) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // Для остальных запросов используем стратегию network-first с fallback
  event.respondWith(networkFirstStrategy(event.request));
});

// Стратегия cache-first
async function cacheFirstStrategy(request) {
  try {
    // Пытаемся получить из кэша
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Если нет в кэше, делаем сетевой запрос
    const networkResponse = await fetch(request);
    
    // Кэшируем ответ для будущего использования
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // В случае ошибки возвращаем fallback для HTML страниц
    if (request.headers.get('accept').includes('text/html')) {
      const fallbackResponse = await caches.match('/fallback.html');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    // Для изображений возвращаем placeholder
    if (request.headers.get('accept').includes('image/')) {
      return new Response('', {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml'
        }
      });
    }
    
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Стратегия network-first с улучшенной обработкой
async function networkFirstStrategy(request) {
  try {
    // Пытаемся сделать сетевой запрос
    const networkResponse = await fetch(request);
    
    // Кэшируем успешный ответ
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Если сетевой запрос не удался, пытаемся получить из кэша
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Для HTML страниц возвращаем fallback
    if (request.headers.get('accept').includes('text/html')) {
      const fallbackResponse = await caches.match('/fallback.html');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return new Response('Network error', { status: 500, statusText: 'Network error' });
  }
}

// Обработка push-уведомлений
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'Уведомление от футбольной школы "Арсенал"';
    const options = {
      body: data.body || 'У вас новое уведомление',
      icon: '/icon.png',
      badge: '/icon.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Если есть открытая вкладка приложения, фокусируемся на ней
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Если нет открытой вкладки, открываем новую
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_CONNECTION') {
    checkConnection();
  }
  
  if (event.data && event.data.type === 'GET_CONNECTION_STATUS') {
    event.source.postMessage({
      type: 'CONNECTION_STATUS',
      isOnline: isOnline,
      timestamp: new Date().toISOString()
    });
  }
  
  // Обработка сообщений о восстановлении соединения от клиента
  if (event.data && event.data.type === 'CONNECTION_RESTORED') {
    isOnline = true;
    notifyClients('connection-restored');
  }
});