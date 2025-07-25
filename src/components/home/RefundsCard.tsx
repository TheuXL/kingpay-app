import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RefundsCardProps {
  data: {
    sumRefunded: number;
    sumChargeback: number;
    totalRefunds: number;
  } | null;
  onPeriodChange?: () => void;
  period?: string;
}

export default function RefundsCard({ data, onPeriodChange, period = "30 dias" }: RefundsCardProps) {
  if (!data) return null;

  const total = data.totalRefunds || (data.sumRefunded + data.sumChargeback);
  const refundedPercentage = total > 0 ? (data.sumRefunded / total) * 100 : 0;
  const chargebackPercentage = total > 0 ? (data.sumChargeback / total) * 100 : 0;

  return (
    <View style={styles.card}>
      {/* Header com título, valor e dropdown */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Reembolsos</Text>
          <Text style={styles.value}>{formatCurrency(total)}</Text>
        </View>
        
        <TouchableOpacity style={styles.periodDropdown} onPress={onPeriodChange}>
          <Text style={styles.periodText}>{period}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Barra de Progresso Multicolorida */}
      <View style={styles.progressBar}>
        <View style={[styles.progressSegment, { backgroundColor: colors.warning, width: `${refundedPercentage}%` }]} />
        <View style={[styles.progressSegment, { backgroundColor: colors.info, width: `${chargebackPercentage}%` }]} />
      </View>

      {/* Legenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Estornos</Text>
          <Text style={styles.legendValue}>{formatCurrency(data.sumRefunded)}</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
          <Text style={styles.legendText}>Chargeback</Text>
          <Text style={styles.legendValue}>{formatCurrency(data.sumChargeback)}</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Total</Text>
          <Text style={styles.legendValue}>{formatCurrency(total)}</Text>
        </View>
      </View>

      {/* Paginação */}
      <View style={styles.pagination}>
        <View style={styles.paginationDot} />
        <View style={[styles.paginationDot, styles.paginationDotActive]} />
        <View style={styles.paginationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  periodDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 32,
  },
  periodText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  progressSegment: {
    height: '100%',
  },
  legend: {
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
  },
}); 