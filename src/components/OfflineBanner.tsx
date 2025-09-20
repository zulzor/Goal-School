import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNetwork } from '../context/NetworkContext';
import { AppIcon } from './AppIcon';
import { COLORS } from '../constants';

/**
 * Компонент баннера для отображения статуса офлайн режима
 */
export const OfflineBanner: React.FC = () => {
  const { isConnected, isInternetReachable, checkConnection } = useNetwork();
  const [isVisible, setIsVisible] = useState(false);

  // Показываем баннер, если нет подключения к интернету
  useEffect(() => {
    const offline = !isConnected || isInternetReachable === false;
    setIsVisible(offline);
  }, [isConnected, isInternetReachable]);

  // Функция для ручной проверки соединения
  const handleRetry = async () => {
    await checkConnection();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <AppIcon name="alert" size={20} color="white" />
        <Text style={styles.text}>Нет подключения к интернету</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginHorizontal: 8,
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});