import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

interface RevenueSummaryProps {
  data: {
    sumPaid: number;
    taxaAprovacao?: number; // Ex: 98.5
    salesGrowthPercentage?: number; // Ex: 15.2
  } | null;
  error?: string | null;
}

const MetricItem = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
    </View>
);

const RevenueSummaryCard = ({ data, error }: RevenueSummaryProps) => {
  const renderErrorOrEmptyState = (message: string) => (
    <View style={styles.card}>
      <Text style={styles.title}>Resumo de Vendas</Text>
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>{message}</Text>
      </View>
    </View>
  );

  if (error) {
    return renderErrorOrEmptyState('Não foi possível carregar o resumo.');
  }

  if (!data) {
    return renderErrorOrEmptyState('Sem dados para exibir.');
  }
  
  const totalRevenue = data.sumPaid || 0;
  const approvalRate = data.taxaAprovacao;
  const growth = data.salesGrowthPercentage;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Resumo de Vendas</Text>
      <View style={styles.metricsContainer}>
        <MetricItem 
            label="Total de vendas"
            value={formatCurrency(totalRevenue)}
        />
        <MetricItem 
            label="Taxa de aprovação"
            value={approvalRate ? `${approvalRate.toFixed(1)}%` : 'N/A'}
        />
        <MetricItem 
            label="Crescimento de vendas"
            value={growth ? `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%` : 'N/A'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default RevenueSummaryCard; 