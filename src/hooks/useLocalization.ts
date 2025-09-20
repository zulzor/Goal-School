// src/hooks/useLocalization.ts
// Хук для работы с локализацией

import { useState, useEffect, useCallback } from 'react';
import { LocalizationService, SupportedLanguage } from '../services/LocalizationService';

export const useLocalization = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('ru');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Загрузка текущего языка
  const loadLanguage = useCallback(async () => {
    try {
      setLoading(true);
      const currentLanguage = await LocalizationService.getCurrentLanguage();
      setLanguage(currentLanguage);

      const currentTranslations = LocalizationService.getTranslations(currentLanguage);
      setTranslations(currentTranslations);
    } catch (error) {
      console.error('Ошибка при загрузке языка:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Изменение языка
  const changeLanguage = useCallback(async (newLanguage: SupportedLanguage) => {
    try {
      const success = await LocalizationService.setLanguage(newLanguage);
      if (success) {
        setLanguage(newLanguage);
        const newTranslations = LocalizationService.getTranslations(newLanguage);
        setTranslations(newTranslations);
      }
      return success;
    } catch (error) {
      console.error('Ошибка при изменении языка:', error);
      return false;
    }
  }, []);

  // Получение перевода по ключу
  const translate = useCallback(
    (key: string): string => {
      return translations[key] || key;
    },
    [translations]
  );

  // Эффект для загрузки языка при монтировании
  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  return {
    language,
    translations,
    loading,
    changeLanguage,
    t: translate,
    refresh: loadLanguage,
  };
};
