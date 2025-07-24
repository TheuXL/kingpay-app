import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/currency';

interface BarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const AnalysisBar: React.FC<BarProps> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  // A altura mínima garante que mesmo valores pequenos sejam visíveis.
  const barHeight = Math.max(10, percentage * 1.2); 

  return (
    <View style={styles.barWrapper}>
      <Text style={styles.barValue}>{formatCurrency(value / 100)}</Text>
      <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
};

interface SalesAnalysisCardProps {
  paid?: number;
  pending?: number;
  refunded?: number;
}

const SalesAnalysisCard: React.FC<SalesAnalysisCardProps> = ({
  paid = 0,
  pending = 0,
  refunded = 0,
}) => {
  const [period, setPeriod] = useState('7 dias'); // Simulação de estado
  const total = paid + pending + refunded;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Análise de Vendas</Text>
          <Text style={styles.totalValue}>{formatCurrency(total / 100)}</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>{period}</Text>
          <ChevronRight color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.barsContainer}>
        <AnalysisBar label="Vendas" value={paid} total={total} color={colors.chartBlue} />
        <AnalysisBar label="Pendentes" value={pending} total={total} color={colors.chartOrange} />
        <AnalysisBar label="Estornos" value={refunded} total={total} color={colors.chartRed} />
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
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#52525B',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3F3F46',
    marginRight: 6,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 32,
    paddingHorizontal: 10,
    minHeight: 150,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '80%', // Barras mais largas
    borderRadius: 8,
    marginTop: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 8,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default SalesAnalysisCard; 