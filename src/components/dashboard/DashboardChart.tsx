import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';
import { GraficoData } from '../../types';

interface DashboardChartProps {
  data: GraficoData | null;
  isLoading: boolean;
  title?: string;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  data,
  isLoading,
  title = 'Vendas por Período',
}) => {
  const screenWidth = Dimensions.get('window').width - 32; // 16px padding on each side

  // Dados de exemplo para mostrar durante o carregamento
  const loadingData = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={title} />
      <Card.Content>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Carregando gráfico...</Text>
          </View>
        ) : data && data.labels.length > 0 ? (
          <LineChart
            data={{
              labels: data.labels,
              datasets: data.datasets,
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text>Nenhum dado disponível para o período selecionado</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 