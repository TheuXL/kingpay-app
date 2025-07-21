import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { Rect } from 'react-native-svg'; // Added for renderBar
import { formatCurrency } from '../../../utils/currency';
import { transactionService } from '../../transactions/services';

const screenWidth = Dimensions.get('window').width;

const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0,
    // Esta função será usada para os labels do gráfico, não para as barras
    color: (opacity = 1) => `rgba(52, 64, 84, ${opacity})`, 
    barRadius: 8,
    propsForLabels: {
        fontSize: '12',
        fontWeight: 'bold',
    },
};

const RevenueSummaryCard = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await transactionService.getTransactionSummary();
                setSummaryData(data);
            } catch (error) {
                console.error("Erro ao buscar resumo de transações:", error);
                setSummaryData(null); // Limpa os dados em caso de erro
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const chartValues = {
        sales: summaryData?.paid?.total || 0,
        pending: summaryData?.pending?.total || 0,
        refunds: summaryData?.refunded?.total || 0,
    };

    const totalRevenue = chartValues.sales; // O total exibido será apenas das vendas pagas

    const dataChart = {
        labels: ['Vendas', 'Pendentes', 'Estorno'],
        datasets: [{
            data: [chartValues.sales / 100, chartValues.pending / 100, chartValues.refunds / 100],
            // Renomeado para evitar conflitos com a biblioteca de gráficos
            barColors: ['#0052FF', '#FF8F00', '#FF4C4C']
        }],
    };

    if (loading) {
        return <View style={styles.card}><Text>Carregando...</Text></View>;
    }

    if (!summaryData) {
        return <View style={styles.card}><Text>Não foi possível carregar os dados.</Text></View>;
    }

    return (
        <View style={styles.card}>
             <View style={styles.header}>
                <Text style={styles.totalRevenue}>{formatCurrency(totalRevenue / 100)}</Text>
                {/* O seletor de período será um componente separado */}
                <View style={styles.periodSelector}>
                    <Text style={styles.periodText}>7 dias</Text>
                </View>
            </View>
            <BarChart
                data={dataChart}
                width={screenWidth - 64}
                height={150}
                chartConfig={chartConfig} // Usamos o chartConfig global simplificado
                fromZero
                withHorizontalLabels={false}
                withVerticalLabels={true}
                withInnerLines={false}
                showValuesOnTopOfBars={false}
                style={styles.chart}
                // Restauramos o renderBar para colorir cada barra individualmente
                renderBar={({x, y, width, height, index}) => (
                    <Rect
                      key={`bar-${index}`}
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={dataChart.datasets[0].barColors[index]}
                      rx={8}
                    />
                )}
            />
            <View style={styles.legendContainer}>
                {dataChart.labels.map((label, index) => (
                    <View style={styles.legendItem} key={label}>
                        <View style={[styles.legendColor, { backgroundColor: dataChart.datasets[0].barColors[index] }]} />
                        <Text style={styles.legendLabel}>{label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  totalRevenue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  periodSelector: {
    // Estilos para o seletor de período
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
  }
});

export default RevenueSummaryCard; 