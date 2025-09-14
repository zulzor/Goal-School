import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants'; // Используем COLORS вместо ARSENAL_COLORS

interface TabItem {
  key: string;
  title: string;
  icon: string;
}

interface BeautifulTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

export const BeautifulTabBar: React.FC<BeautifulTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <LinearGradient
      colors={COLORS.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.8}>
          <View style={styles.tabContent}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabTitle, activeTab === tab.key && styles.activeTabTitle]}>
              {tab.title}
            </Text>
            {activeTab === tab.key && <View style={styles.activeIndicator} />}
          </View>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: COLORS.surface,
  },
  tabTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  activeTabTitle: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 24,
    height: 3,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
  },
});
