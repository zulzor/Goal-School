// Полифил для @react-native-community/netinfo в веб-окружении
class NetInfoWeb {
  private listeners: Array<(state: any) => void> = [];

  async fetch() {
    return this.getConnectionState();
  }

  async getConnectionState() {
    // Более точная проверка соединения
    let isInternetReachable = navigator.onLine;
    
    // Если браузер говорит, что мы онлайн, дополнительно проверяем соединение
    if (navigator.onLine) {
      try {
        // Пытаемся выполнить HEAD-запрос к главной странице
        const response = await fetch('/', { 
          method: 'HEAD', 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        isInternetReachable = response.ok;
      } catch (error) {
        isInternetReachable = false;
      }
    }
    
    return {
      type: 'wifi',
      isConnected: navigator.onLine,
      isInternetReachable: isInternetReachable,
      details: {
        isConnectionExpensive: false,
      },
    };
  }

  addEventListener(listener: (state: any) => void) {
    this.listeners.push(listener);

    // Вызываем listener с текущим состоянием
    this.getConnectionState().then(state => {
      listener(state);
    });

    // Обработчики событий online/offline
    const handleOnline = () => {
      this.getConnectionState().then(state => {
        this.listeners.forEach(l => l(state));
      });
    };

    const handleOffline = () => {
      this.getConnectionState().then(state => {
        this.listeners.forEach(l => l(state));
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Периодическая проверка соединения каждые 30 секунд
    const interval = setInterval(() => {
      if (navigator.onLine) {
        this.getConnectionState().then(state => {
          this.listeners.forEach(l => l(state));
        });
      }
    }, 30000);

    // Возвращаем функцию для отмены подписки
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }

  removeEventListener(listener: (state: any) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

// Создаем экземпляр и экспортируем его
const NetInfo = new NetInfoWeb();

export default NetInfo;