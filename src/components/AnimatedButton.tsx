import React from 'react';
import { StyleSheet, Animated, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { COLORS } from '../constants'; // Добавляем импорт цветов

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
}) => {
  const { animatedValue, triggerAnimation } = useAnimation();

  const handlePress = () => {
    if (!disabled) {
      triggerAnimation();
      onPress();
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          style,
          {
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.95, 1],
                }),
              },
            ],
            opacity: disabled ? 0.6 : 1,
          },
        ]}>
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary, // Используем цвет Arsenal вместо хардкодного значения
  },
  secondaryButton: {
    backgroundColor: COLORS.accent, // Используем цвет Arsenal вместо хардкодного значения
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary, // Используем цвет Arsenal вместо хардкодного значения
  },
  primaryText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineText: {
    color: COLORS.primary, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 16,
    fontWeight: 'bold',
  },
});
