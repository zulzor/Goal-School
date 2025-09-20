// src/components/LanguageSelector.tsx
// Компонент для выбора языка

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Menu, IconButton, Text } from 'react-native-paper';
import { useLocalization } from '../hooks/useLocalization';
import { COLORS } from '../constants';

interface LanguageSelectorProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: React.ReactNode;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onDismiss,
  anchor,
}) => {
  const { language, changeLanguage } = useLocalization();

  const handleLanguageChange = async (newLanguage: 'ru' | 'en') => {
    await changeLanguage(newLanguage);
    onDismiss();
  };

  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={anchor}>
      <Menu.Item
        title="Русский"
        onPress={() => handleLanguageChange('ru')}
        style={language === 'ru' ? styles.selectedItem : undefined}
      />
      <Menu.Item
        title="English"
        onPress={() => handleLanguageChange('en')}
        style={language === 'en' ? styles.selectedItem : undefined}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  selectedItem: {
    backgroundColor: COLORS.primaryLight,
  },
});
