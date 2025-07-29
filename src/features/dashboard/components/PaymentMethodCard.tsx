import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PeriodDropdown from './PeriodDropdown';
import HorizontalBar from './HorizontalBar';

interface PaymentMethodVariation {
  percentage: number;
  variation: number; // percentual de variação
  isPositive: boolean;
}

interface PaymentMethodData {
  totalValue: number;
  pix: PaymentMethodVariation;
  card: PaymentMethodVariation;
  boleto: PaymentMethodVariation;
}

interface PaymentMethodCardProps {
  data: PaymentMethodData;
  onPeriodChange?: (days: number) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
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

  // Calcular valores absolutos para a barra
  const pixValue = (data.totalValue * data.pix.percentage) / 100;
  const cardValue = (data.totalValue * data.card.percentage) / 100;
  const boletoValue = (data.totalValue * data.boleto.percentage) / 100;

  const barSegments = [
    {
      label: 'PIX',
      value: pixValue,
      color: colors.chart.pix,
    },
    {
      label: 'Cartão',
      value: cardValue,
      color: colors.chart.card,
    },
    {
      label: 'Boleto',
      value: boletoValue,
      color: colors.chart.boleto,
    },
  ];

  const paymentMethods = [
    {
      label: 'PIX',
      data: data.pix,
      color: colors.chart.pix,
      icon: <Feather name="zap" size={16} color={colors.chart.pix} />,
    },
    {
      label: 'Cartão',
      data: data.card,
      color: colors.chart.card,
      icon: <Feather name="credit-card" size={16} color={colors.chart.card} />,
    },
    {
      label: 'Boleto',
      data: data.boleto,
      color: colors.chart.boleto,
      icon: <Feather name="file-text" size={16} color={colors.chart.boleto} />,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Formas de pagamento</Text>
        <PeriodDropdown
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </View>

      {/* Valor principal */}
      <Text style={styles.mainValue}>
        {formatCurrency(data.totalValue)}
      </Text>

      {/* Barra de segmentos */}
      <View style={styles.chartContainer}>
        <HorizontalBar
          segments={barSegments}
          height={12}
          showLabels={false}
          formatValue={formatCurrency}
        />
      </View>

      {/* Legendas com variações */}
      <View style={styles.legendsContainer}>
        {paymentMethods.map((method, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendDot, { backgroundColor: method.color }]} />
              {method.icon}
              <Text style={styles.legendLabel}>{method.label}</Text>
            </View>
            
            <View style={styles.legendRight}>
              <Text style={styles.legendPercentage}>
                {method.data.percentage.toFixed(1)}%
              </Text>
              <View style={styles.variationContainer}>
                <Feather
                  name={method.data.isPositive ? 'trending-up' : 'trending-down'}
                  size={12}
                  color={method.data.isPositive ? colors.success : colors.danger}
                />
                <Text style={[
                  styles.variationText,
                  { color: method.data.isPositive ? colors.success : colors.danger }
                ]}>
                  {Math.abs(method.data.variation).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
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
  legendsContainer: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  legendRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  legendPercentage: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
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
});

export default PaymentMethodCard;
