import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PeriodDropdown from './PeriodDropdown';
import ApprovalBar from './ApprovalBar';

interface ApprovalRateData {
  overallRate: number;
  pix: number;
  card: number;
  boleto: number;
}

interface ApprovalRateCardProps {
  data: ApprovalRateData;
  onPeriodChange?: (days: number) => void;
}

const ApprovalRateCard: React.FC<ApprovalRateCardProps> = ({ 
  data, 
  onPeriodChange 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState({ 
    label: '30 dias', 
    value: 30, 
    key: '30d' 
  });

  const handlePeriodChange = (period: any) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period.value);
  };

  const paymentMethods = [
    {
      label: 'PIX',
      percentage: data.pix,
      color: colors.chart.pix,
      icon: <Feather name="zap" size={16} color={colors.chart.pix} />,
    },
    {
      label: 'Cartão',
      percentage: data.card,
      color: colors.chart.card,
      icon: <Feather name="credit-card" size={16} color={colors.chart.card} />,
    },
    {
      label: 'Boleto',
      percentage: data.boleto,
      color: colors.chart.boleto,
      icon: <Feather name="file-text" size={16} color={colors.chart.boleto} />,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Taxa de aprovação</Text>
        <PeriodDropdown
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </View>

      {/* Valor principal */}
      <Text style={styles.mainValue}>
        {data.overallRate.toFixed(1)}%
      </Text>

      {/* Barras de aprovação por método */}
      <View style={styles.barsContainer}>
        {paymentMethods.map((method, index) => (
          <ApprovalBar
            key={index}
            label={method.label}
            percentage={method.percentage}
            color={method.color}
            icon={method.icon}
          />
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
  barsContainer: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
});

export default ApprovalRateCard;
