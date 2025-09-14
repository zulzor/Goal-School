import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EnhancedAnimatedCard } from './EnhancedAnimatedCard';

interface EnhancedAnimatedListProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  style?: object;
}

export const EnhancedAnimatedList = <T,>({
  data,
  renderItem,
  keyExtractor,
  style,
}: EnhancedAnimatedListProps<T>) => {
  const renderAnimatedItem = ({ item, index }: { item: T; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <EnhancedAnimatedCard style={styles.card} elevation={index % 2 === 0 ? 3 : 2}>
          {renderItem({ item, index })}
        </EnhancedAnimatedCard>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderAnimatedItem}
      keyExtractor={keyExtractor}
      style={[styles.list, style]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  itemContainer: {
    marginVertical: 4,
  },
  card: {
    marginHorizontal: 16,
  },
});
