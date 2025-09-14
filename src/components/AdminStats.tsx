import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LineChart } from 'react-native-svg-charts';
import { COLORS } from '../constants';

interface StatItem {
  label: string;
  value: string;
  change?: number; // Процентное изменение
  icon?: string;
}

interface AdminStatsProps {
  stats: StatItem[];
  chartData?: number[];
  title?: string;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  stats,
  chartData,
  title = 'Статистика',
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        {chartData && (
          <View style={styles.chartContainer}>
            <LineChart
              style={styles.chart}
              data={chartData}
              svg={{ stroke: COLORS.primary, strokeWidth: 2 }}
              contentInset={{ top: 20, bottom: 20 }}
            />
          </View>
        )}

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            // Определение цвета для изменения
            const getChangeColor = (change?: number) => {
              if (change === undefined) return COLORS.textSecondary;
              return change >= 0 ? COLORS.success : COLORS.error;
            };

            // Форматирование изменения
            const formatChange = (change?: number) => {
              if (change === undefined) return '';
              return `${change >= 0 ? '+' : ''}${change}%`;
            };

            return (
              <Card key={index} style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  {stat.change !== undefined && (
                    <Text style={[styles.statChange, { color: getChangeColor(stat.change) }]}>
                      {formatChange(stat.change)}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    height: 150,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
