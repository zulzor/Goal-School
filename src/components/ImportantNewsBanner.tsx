import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';

interface ImportantNewsBannerProps {
  title: string;
  message: string;
  onDismiss: () => void;
  onPress: () => void;
  animation?: Animated.Value;
}

export const ImportantNewsBanner: React.FC<ImportantNewsBannerProps> = ({
  title,
  message,
  onDismiss,
  onPress,
  animation,
}) => {
  const animatedStyle = animation
    ? {
        transform: [
          {
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            }),
          },
        ],
        opacity: animation,
      }
    : {};

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconButton icon="alert-circle" size={20} color={COLORS.error} style={styles.icon} />
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <IconButton icon="close" size={20} onPress={onDismiss} style={styles.closeButton} />
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
          <Button
            mode="text"
            onPress={onPress}
            textColor={COLORS.error}
            style={styles.detailsButton}>
            Подробнее
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  banner: {
    backgroundColor: COLORS.errorBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    margin: 0,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  closeButton: {
    margin: 0,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsButton: {
    alignSelf: 'flex-start',
    minWidth: 100,
  },
});
