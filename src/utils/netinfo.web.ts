// Полифил для @react-native-community/netinfo в веб-окружении
class NetInfoWeb {
  private listeners: Array<(state: any) => void> = [];

  async fetch() {
    return this.getConnectionState();
  }

  async getConnectionState() {
    return {
      type: 'wifi',
      isConnected: navigator.onLine,
      isInternetReachable: navigator.onLine,
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

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOnline);

    // Возвращаем функцию для отмены подписки
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOnline);
    };
  }

  removeEventListener(listener: (state: any) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

// Создаем экземпляр и экспортируем его
const NetInfo = new NetInfoWeb();

export default NetInfo;
