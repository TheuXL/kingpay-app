import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PeriodDropdown from './PeriodDropdown';
import HorizontalBar from './HorizontalBar';

interface RefundData {
  totalRefunds: number;
  estornos: number;
  cashback: number;
  estornoRate: number; // em percentual
}

interface RefundCardProps {
  data: RefundData;
  onPeriodChange?: (days: number) => void;
}

const RefundCard: React.FC<RefundCardProps> = ({ 
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

  const handlePeriodChange = (period: any) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period.value);
  };

  const barSegments = [
    {
      label: 'Estornos',
      value: data.estornos,
      color: colors.chart.estorno,
    },
    {
      label: 'Cashback',
      value: data.cashback,
      color: colors.chart.cashback,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reembolsos</Text>
        <PeriodDropdown
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </View>

      {/* Valor principal */}
      <Text style={styles.mainValue}>
        {formatCurrency(data.totalRefunds)}
      </Text>

      {/* Barra de segmentos */}
      <View style={styles.chartContainer}>
        <HorizontalBar
          segments={barSegments}
          height={12}
          formatValue={formatCurrency}
        />
      </View>

      {/* Taxa de estorno */}
      <View style={styles.rateContainer}>
        <View style={styles.rateItem}>
          <View style={[styles.rateDot, { backgroundColor: colors.chart.estornoRate }]} />
          <Text style={styles.rateLabel}>Taxa de estorno</Text>
          <Text style={styles.rateValue}>{data.estornoRate.toFixed(1)}%</Text>
        </View>
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
  chartContainer: {
    marginVertical: spacing.sm,
  },
  rateContainer: {
    marginTop: spacing.sm,
  },
  rateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  rateValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default RefundCard;
