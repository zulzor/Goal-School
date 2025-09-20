// Утилита для оптимизации загрузки изображений
export const imageOptimizer = {
  // Кэш для хранения уже загруженных изображений
  imageCache: new Map<string, string>(),

  // Оптимизированная загрузка изображения с кэшированием
  async loadImage(uri: string, maxWidth: number = 800, maxHeight: number = 600): Promise<string> {
    // Проверяем кэш
    if (this.imageCache.has(uri)) {
      return this.imageCache.get(uri)!;
    }

    try {
      // В браузере используем Canvas API для оптимизации
      if (typeof window !== 'undefined' && window.document) {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        return new Promise((resolve, reject) => {
          img.onload = () => {
            // Создаем canvas для изменения размера
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Не удалось получить контекст canvas'));
              return;
            }

            // Вычисляем новые размеры с сохранением пропорций
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = width * ratio;
              height = height * ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Рисуем изображение с новыми размерами
            ctx.drawImage(img, 0, 0, width, height);

            // Получаем оптимизированное изображение в формате base64
            const optimizedUri = canvas.toDataURL('image/jpeg', 0.8);

            // Сохраняем в кэш
            this.imageCache.set(uri, optimizedUri);

            resolve(optimizedUri);
          };

          img.onerror = () => {
            reject(new Error('Не удалось загрузить изображение'));
          };

          img.src = uri;
        });
      } else {
        // Для мобильных платформ просто возвращаем URI
        this.imageCache.set(uri, uri);
        return uri;
      }
    } catch (error) {
      console.error('Ошибка оптимизации изображения:', error);
      // В случае ошибки возвращаем оригинальный URI
      return uri;
    }
  },

  // Очистка кэша
  clearCache() {
    this.imageCache.clear();
  },

  // Получение размера кэша
  getCacheSize() {
    return this.imageCache.size;
  },
};
