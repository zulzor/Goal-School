// src/components/ImprovedButton.tsx
// Улучшенная кнопка с анимациями и состояниями

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  View,
} from 'react-native';
import { COLORS } from '../constants';
import { useAnimation } from '../hooks/useAnimation';

export interface ImprovedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const ImprovedButton: React.FC<ImprovedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const { scaleValue, opacityValue } = useAnimation();

  const handlePressIn = () => {
    scaleValue.setValue(0.95);
    opacityValue.setValue(0.8);
  };

  const handlePressOut = () => {
    scaleValue.setValue(1);
    opacityValue.setValue(1);
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? COLORS.white : COLORS.primary} 
          />
          <Text style={[textStyleCombined, styles.loadingText]}>
            {title}
          </Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.iconContainer}>
          {iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyleCombined}>{title}</Text>
          {iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      );
    }

    return <Text style={textStyleCombined}>{title}</Text>;
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 56,
  },
  
  // States
  disabled: {
    backgroundColor: COLORS.disabled,
    elevation: 0,
    shadowOpacity: 0,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Icon styles
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  
  // Loading styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
});