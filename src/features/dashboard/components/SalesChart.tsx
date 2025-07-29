import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AppText } from '@/components/shared/AppText';
import { Card } from '@/components/shared/Card';
import { ChartDataPoint } from '@/types/dashboard';
import { colors } from '@/theme/colors';

interface SalesChartProps {
  data: ChartDataPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <AppText>Sem dados para exibir o gráfico.</AppText>
      </Card>
    );
  }

  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        data: data.map(item => item.total_paid_amount / 100), // Convertendo centavos para reais
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Cor do gráfico
        strokeWidth: 2,
      },
    ],
    legend: ['Receita (R$)'],
  };

  return (
    <Card>
      <AppText size="lg" weight="bold" color="textPrimary" style={{ marginBottom: 16 }}>
        Receita nos Últimos Dias
      </AppText>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 64} // Largura da tela menos o padding do card
        height={220}
        chartConfig={{
          backgroundColor: colors.cardBackground,
          backgroundGradientFrom: colors.cardBackground,
          backgroundGradientTo: colors.cardBackground,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </Card>
  );
} 