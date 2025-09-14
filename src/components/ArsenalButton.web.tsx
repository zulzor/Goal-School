import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';

interface ArsenalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const ArsenalButton: React.FC<ArsenalButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
      medium: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
      large: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
    };

    return [styles.button, baseStyle[size], style];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      small: { fontSize: 14, fontWeight: '600' as const },
      medium: { fontSize: 16, fontWeight: '700' as const },
      large: { fontSize: 18, fontWeight: '700' as const },
    };

    return [styles.text, baseTextStyle[size], textStyle];
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: COLORS.primary },
          text: { color: COLORS.surface },
        };
      case 'secondary':
        return {
          container: { backgroundColor: COLORS.accent },
          text: { color: COLORS.surface },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: COLORS.primary,
          },
          text: { color: COLORS.primary },
        };
      case 'text':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: COLORS.primary },
        };
      default:
        return {
          container: { backgroundColor: COLORS.primary },
          text: { color: COLORS.surface },
        };
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      try {
        onPress();
      } catch (error) {
        console.error('Ошибка при вызове onPress:', error);
      }
    }
  };

  const { container, text } = getVariantStyle();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[...getButtonStyle(), container, (disabled || loading) && styles.disabled]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.surface}
        />
      ) : (
        <Text
          style={[...getTextStyle(), text, (disabled || loading) && styles.disabledText] as any}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
});
