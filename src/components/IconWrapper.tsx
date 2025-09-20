import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton as PaperIconButton } from 'react-native-paper';

interface IconWrapperProps {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ name, size = 24, color, onPress }) => {
  if (Platform.OS === 'web') {
    return <MaterialCommunityIcons name={name} size={size} color={color} onPress={onPress} />;
  }

  return <PaperIconButton icon={name} size={size} iconColor={color} onPress={onPress} />;
};