import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface ChartDataItem {
  data: string;
  total_paid_amount: number;
}

interface SalesChartProps {
  chartData: ChartDataItem[] | null;
}

const SalesChart: React.FC<SalesChartProps> = ({ chartData }) => {
  const router = useRouter();

  if (!chartData || chartData.length === 0) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Text style={styles.emptyText}>Sem dados de vendas para exibir.</Text>
      </View>
    );
  }

  const processedData = chartData.slice(0, 12).map(item => ({
    value: item.total_paid_amount / 100,
    label: new Date(item.data).toLocaleString('default', { month: 'short' }),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Text style={{ color: 'gray', fontSize: 10, marginBottom: 6 }}>
        {formatCurrency(item.total_paid_amount / 100, false)}
      </Text>
    ),
  }));

  const totalRevenue = chartData.reduce(
    (sum, item) => sum + item.total_paid_amount,
    0,
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gráfico de Receita</Text>
          <Text style={styles.totalRevenue}>
            {formatCurrency(totalRevenue / 100)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push('/dashboard' as `http${string}` | `/${string}`)
          }
        >
          <Text style={styles.viewAllText}>Ver tudo</Text>
          <ChevronRight color='#3F3F46' size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        <BarChart
          data={processedData}
          barWidth={16}
          spacing={20}
          roundedTop
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: 'transparent' }}
          xAxisLabelTextStyle={{ color: 'gray', fontSize: 12 }}
          noOfSections={4}
          isAnimated
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#A1A1AA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#52525B',
  },
  totalRevenue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3F3F46',
    marginRight: 6,
  },
  chartContainer: {
    paddingLeft: 10,
  },
});

export default SalesChart; 