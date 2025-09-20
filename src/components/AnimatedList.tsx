import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, Animated } from 'react-native';

interface AnimatedListProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
  style?: any;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  data,
  renderItem,
  keyExtractor,
  style,
}) => {
  const animatedValues = useRef(data.map((_, index) => new Animated.Value(0))).current;

  const animateItem = (index: number) => {
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  };

  const renderAnimatedItem = ({ item, index }: { item: any; index: number }) => {
    // Запускаем анимацию для элемента
    animateItem(index);

    const opacity = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const translateY = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const scale = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    });

    return (
      <Animated.View
        style={[
          styles.item,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}>
        {renderItem({ item, index })}
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderAnimatedItem}
      keyExtractor={keyExtractor}
      style={[styles.container, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginVertical: 4,
  },
});
