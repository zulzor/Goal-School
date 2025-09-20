// Компонент AppIcon для использования типизированных иконок
import React from 'react';
import { IconWrapper } from './IconWrapper';
import { APP_ICONS } from '../constants/icons';
import { AppIconName } from '../types/icons';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, color, onPress }) => {
  const iconName = APP_ICONS[name];

  return <IconWrapper name={iconName} size={size} color={color} onPress={onPress} />;
};
