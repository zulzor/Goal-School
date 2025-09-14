import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';
import { Chip, ProgressBar } from 'react-native-paper';

/**
 * Компонент для отображения состояния сети
 */
export const NetworkStatusIndicator: React.FC = () => {
  const { isConnected, isInternetReachable, networkType, isChecking } = useNetwork();

  // Определяем текст статуса
  const getStatusText = () => {
    if (isChecking) return 'Проверка соединения...';
    if (!isConnected) return 'Нет подключения';
    if (isInternetReachable === false) return 'Нет доступа к интернету';
    if (isInternetReachable === true) return 'Подключено к интернету';
    return 'Подключение установлено';
  };

  // Определяем цвет индикатора
  const getStatusColor = () => {
    if (isChecking) return '#FF9800'; // Оранжевый - проверка
    if (!isConnected) return '#F44336'; // Красный - нет подключения
    if (isInternetReachable === false) return '#FF9800'; // Оранжевый - нет интернета
    if (isInternetReachable === true) return '#4CAF50'; // Зеленый - все хорошо
    return '#2196F3'; // Синий - подключение есть
  };

  // Определяем иконку
  const getStatusIcon = () => {
    if (isChecking) return 'sync';
    if (!isConnected) return 'wifi-off';
    if (isInternetReachable === false) return 'wifi-alert';
    if (isInternetReachable === true) return 'wifi';
    return 'wifi';
  };

  // Определяем тип сети
  const getNetworkTypeText = () => {
    switch (networkType) {
      case 'wifi':
        return 'Wi-Fi';
      case 'cellular':
        return 'Мобильная сеть';
      case 'ethernet':
        return 'Ethernet';
      case 'bluetooth':
        return 'Bluetooth';
      case 'vpn':
        return 'VPN';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <Chip
          icon={getStatusIcon()}
          style={[styles.chip, { backgroundColor: getStatusColor() }]}
          textStyle={styles.chipText}>
          {getStatusText()}
        </Chip>

        {isConnected && networkType && (
          <Chip style={styles.networkTypeChip} textStyle={styles.networkTypeText}>
            {getNetworkTypeText()}
          </Chip>
        )}
      </View>

      {isChecking && (
        <ProgressBar indeterminate color={getStatusColor()} style={styles.progressBar} />
      )}

      <Text style={styles.statusText}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    height: 32,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  networkTypeChip: {
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  networkTypeText: {
    color: '#666',
    fontSize: 11,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
