import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants'; // Используем COLORS вместо ARSENAL_COLORS

interface ArsenalLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export const ArsenalLogo: React.FC<ArsenalLogoProps> = ({
  size = 'medium',
  showText = true,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 30, height: 30, fontSize: 16 };
      case 'large':
        return { width: 80, height: 80, fontSize: 40 };
      default:
        return { width: 50, height: 50, fontSize: 28 };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={[styles.cannon, { width: width * 0.6, height: height * 0.6 }]}>
        <Text style={[styles.cannonText, { fontSize }]}>⚔️</Text>
      </View>
      {showText && <Text style={[styles.text, { fontSize: fontSize * 0.5 }]}>ARSENAL</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cannon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  cannonText: {
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: COLORS.primary, // Используем COLORS.primary вместо ARSENAL_COLORS.primary
    letterSpacing: 1,
  },
});
