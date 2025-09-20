import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Svg, Circle, G, Line, Text as SvgText, Path } from 'react-native-svg';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants'; // Добавляем импорт цветов

interface ProgressDataPoint {
  value: number;
  label: string;
  date: string;
}

interface AnimatedProgressChartProps {
  data: ProgressDataPoint[];
  title: string;
  color?: string;
  height?: number;
  width?: number;
}

export const AnimatedProgressChart: React.FC<AnimatedProgressChartProps> = ({
  data,
  title,
  color = COLORS.primary, // Используем цвет Arsenal вместо хардкодного значения
  height = 200,
  width = 300,
}) => {
  if (data.length === 0) {
    return (
      <AnimatedCard animationType="fade" delay={0}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.noDataText}>Нет данных для отображения</Text>
        </View>
      </AnimatedCard>
    );
  }

  // Вычисляем максимальное значение для масштабирования
  const maxValue = Math.max(...data.map(item => item.value), 100);

  // Вычисляем координаты точек
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (item.value / maxValue) * height;
    return { x, y, ...item };
  });

  // Создаем путь для линии графика
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <AnimatedCard animationType="scale" delay={0}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Svg height={height} width={width} style={styles.chart}>
          {/* Линии сетки */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Line
              key={index}
              x1="0"
              y1={height * ratio}
              x2={width}
              y2={height * ratio}
              stroke={COLORS.border} // Используем цвет Arsenal вместо хардкодного значения
              strokeWidth="1"
            />
          ))}

          {/* Ось X */}
          <Line
            x1="0"
            y1={height}
            x2={width}
            y2={height}
            stroke={COLORS.textSecondary} // Используем цвет Arsenal вместо хардкодного значения
            strokeWidth="2"
          />

          {/* Линия графика */}
          <Path d={pathData} fill="none" stroke={color} strokeWidth="3" />

          {/* Точки данных */}
          {points.map((point, index) => (
            <G key={index}>
              <Circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={color}
                stroke={COLORS.surface} // Используем цвет Arsenal вместо хардкодного значения
                strokeWidth="2"
              />
              <SvgText
                x={point.x}
                y={height + 20}
                fontSize="10"
                textAnchor="middle"
                fill={COLORS.textSecondary} // Используем цвет Arsenal вместо хардкодного значения
              >
                {point.label}
              </SvgText>
              <SvgText
                x={point.x}
                y={point.y - 10}
                fontSize="10"
                textAnchor="middle"
                fill={color}
                fontWeight="bold">
                {point.value}%
              </SvgText>
            </G>
          ))}
        </Svg>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    borderRadius: 8,
    marginVertical: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text, // Используем цвет Arsenal вместо хардкодного значения
  },
  chart: {
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
    fontStyle: 'italic',
  },
});
