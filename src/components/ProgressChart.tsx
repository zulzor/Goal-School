import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { PieChart } from 'react-native-svg-charts';
import { COLORS } from '../constants';

interface ProgressData {
  name: string;
  value: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title = 'Прогресс' }) => {
  // Подготовка данных для диаграммы
  const chartData = data.map((item, index) => ({
    key: index,
    value: item.value,
    svg: { fill: item.color },
    arc: { cornerRadius: 2 },
  }));

  // Расчет общего значения
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <View style={styles.chartContainer}>
          <PieChart style={styles.chart} data={chartData} innerRadius={60} outerRadius={100} />

          <View style={styles.centerLabel}>
            <Text style={styles.totalValue}>{total}</Text>
            <Text style={styles.totalLabel}>Всего</Text>
          </View>
        </View>

        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
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
    alignItems: 'center',
    marginVertical: 16,
  },
  chart: {
    height: 200,
    width: 200,
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
