import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DebugInfo: React.FC = () => {
  useEffect(() => {
    console.log('DebugInfo component mounted');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      <Text>Component is rendering correctly</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
