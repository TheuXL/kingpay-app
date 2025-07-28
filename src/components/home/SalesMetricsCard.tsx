import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SalesMetricsCardProps {
  dashboardData: any;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const MetricCard = ({ title, value, change, isPositive }: MetricCardProps) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    <View style={styles.changeContainer}>
      <MaterialIcons
        name={isPositive ? 'trending-up' : 'trending-down'}
        size={16}
        color={isPositive ? colors.success : colors.danger}
      />
      <Text
        style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}
      >
        {change}
      </Text>
    </View>
  </View>
);

const SalesMetricsCard: React.FC<SalesMetricsCardProps> = ({
  dashboardData,
}) => {
  if (!dashboardData) {
    return null;
  }

  const {
    taxaChargeback,
    approvalRateGrowthPercentage,
    sumPixPaid,
    salesGrowthPercentage,
    sumBoletoPaid,
  } = dashboardData;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Métricas de vendas</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title='Chargeback'
          value={`${(taxaChargeback || 0).toFixed(2)}%`}
          change={`${(approvalRateGrowthPercentage || 0).toFixed(2)}%`}
          isPositive={approvalRateGrowthPercentage >= 0}
        />
        <MetricCard
          title='Vendas Pix'
          value={formatCurrency(sumPixPaid)}
          change={`${(salesGrowthPercentage || 0).toFixed(2)}%`}
          isPositive={salesGrowthPercentage >= 0}
        />
        <MetricCard
          title='Vendas Boletos'
          value={formatCurrency(sumBoletoPaid)}
          change={`${(salesGrowthPercentage || 0).toFixed(2)}%`}
          isPositive={salesGrowthPercentage >= 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default SalesMetricsCard; 