import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { BarChart } from 'react-native-svg-charts';
import { COLORS } from '../constants';

interface AttendanceData {
  date: string;
  attendance: number; // 0-100
}

interface AttendanceStatsProps {
  data: AttendanceData[];
  title?: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  data,
  title = 'Статистика посещаемости',
}) => {
  // Подготовка данных для диаграммы
  const chartData = data.map(item => item.attendance);

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Расчет средней посещаемости
  const averageAttendance =
    data.length > 0 ? data.reduce((sum, item) => sum + item.attendance, 0) / data.length : 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <View style={styles.chartContainer}>
          <BarChart
            style={styles.chart}
            data={chartData}
            svg={{ fill: COLORS.primary }}
            contentInset={{ top: 20, bottom: 20 }}
          />

          <View style={styles.xAxis}>
            {data.map((item, index) => (
              <Text key={index} style={styles.xAxisLabel}>
                {formatDate(item.date)}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Средняя посещаемость</Text>
            <Text style={styles.statValue}>{averageAttendance.toFixed(1)}%</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Всего записей</Text>
            <Text style={styles.statValue}>{data.length}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Лучший день</Text>
            <Text style={styles.statValue}>
              {data.length > 0 ? `${Math.max(...data.map(d => d.attendance))}%` : 'N/A'}
            </Text>
          </View>
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
    height: 200,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    margin: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
