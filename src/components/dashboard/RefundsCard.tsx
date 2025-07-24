import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RefundsCardProps {
  data: {
    sumRefunded: number;
    sumChargedback: number;
    taxaEstorno: number;
  } | null;
}

const RefundsCard: React.FC<RefundsCardProps> = ({ data }) => {
  if (!data) return null;

  const total = (data.sumRefunded || 0) + (data.sumChargedback || 0);
  const refundedPercent = total > 0 ? ((data.sumRefunded || 0) / total) * 100 : 0;
  const chargedbackPercent = total > 0 ? ((data.sumChargedback || 0) / total) * 100 : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reembolsos</Text>
      <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      
      <View style={styles.multiBar}>
        <View style={{ width: `${refundedPercent}%`, backgroundColor: colors.warning, height: 8 }} />
        <View style={{ width: `${chargedbackPercent}%`, backgroundColor: colors.info, height: 8 }} />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Estornos: {formatCurrency(data.sumRefunded || 0)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.info }]} />
          <Text style={styles.legendText}>Cashback: {formatCurrency(data.sumChargedback || 0)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Taxa de Estorno: {(data.taxaEstorno || 0).toFixed(2)}%</Text>
        </View>
      </View>
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
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: 8,
  },
  multiBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default RefundsCard; 