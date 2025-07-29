import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PeriodDropdown from './PeriodDropdown';

interface SalesMetric {
  value: number;
  variation: number; // percentual de variação
  isPositive: boolean;
}

interface TotalSalesData {
  totalSales: number;
  salesCount: SalesMetric;
  averageTicket: SalesMetric;
}

interface TotalSalesCardProps {
  data: TotalSalesData;
  onPeriodChange?: (days: number) => void;
}

const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ 
  data, 
  onPeriodChange 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState({ 
    label: '30 dias', 
    value: 30, 
    key: '30d' 
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handlePeriodChange = (period: any) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period.value);
  };

  const MetricItem = ({ 
    label, 
    value, 
    metric, 
    formatter 
  }: { 
    label: string; 
    value: string; 
    metric: SalesMetric; 
    formatter: (value: number) => string;
  }) => (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{formatter(metric.value)}</Text>
      <View style={styles.variationContainer}>
        <Feather
          name={metric.isPositive ? 'trending-up' : 'trending-down'}
          size={14}
          color={metric.isPositive ? colors.success : colors.danger}
        />
        <Text style={[
          styles.variationText,
          { color: metric.isPositive ? colors.success : colors.danger }
        ]}>
          {Math.abs(metric.variation).toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Total de Vendas</Text>
        <PeriodDropdown
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </View>

      {/* Valor principal */}
      <Text style={styles.mainValue}>
        {formatCurrency(data.totalSales)}
      </Text>

      {/* Métricas */}
      <View style={styles.metricsContainer}>
        <MetricItem
          label="Número de vendas"
          value="count"
          metric={data.salesCount}
          formatter={formatNumber}
        />
        
        <View style={styles.divider} />
        
        <MetricItem
          label="Ticket médio"
          value="average"
          metric={data.averageTicket}
          formatter={formatCurrency}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    gap: spacing.md,
    ...shadow.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: spacing.sm,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  metricItem: {
    flex: 1,
    gap: spacing.xs,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  variationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});

export default TotalSalesCard;
