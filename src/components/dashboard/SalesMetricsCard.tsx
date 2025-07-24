import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SalesMetricsCardProps {
  data: {
    sumPaid: number;
    sumPending: number;
    sumRefunded: number;
  } | null;
}

const MetricBar = ({ label, value, color, percentage }: { label: string; value: number; color: string; percentage: number }) => (
  <View style={styles.barContainer}>
    <View style={styles.barLabel}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <Text style={styles.valueText}>{formatCurrency(value)}</Text>
    <View style={styles.barBackground}>
      <View style={[styles.barForeground, { backgroundColor: color, width: `${percentage}%` }]} />
    </View>
  </View>
);

const SalesMetricsCard: React.FC<SalesMetricsCardProps> = ({ data }) => {
  if (!data) return null;

  const total = (data.sumPaid || 0) + (data.sumPending || 0) + (data.sumRefunded || 0);
  const paidPercentage = total > 0 ? ((data.sumPaid || 0) / total) * 100 : 0;
  const pendingPercentage = total > 0 ? ((data.sumPending || 0) / total) * 100 : 0;
  const refundedPercentage = total > 0 ? ((data.sumRefunded || 0) / total) * 100 : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Análise de Vendas</Text>
      <MetricBar label="Vendas" value={data.sumPaid || 0} color={colors.success} percentage={paidPercentage} />
      <MetricBar label="Pendentes" value={data.sumPending || 0} color={colors.warning} percentage={pendingPercentage} />
      <MetricBar label="Estornos" value={data.sumRefunded || 0} color={colors.danger} percentage={refundedPercentage} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  barContainer: {
    marginBottom: 12,
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    marginTop: 4,
  },
  barForeground: {
    height: 6,
    borderRadius: 3,
  },
});

export default SalesMetricsCard; 