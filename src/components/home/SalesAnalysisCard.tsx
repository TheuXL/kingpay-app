import { formatCurrency } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SalesAnalysisCardProps {
  data: {
    sales: number;
    pending: number;
    refunds: number;
    total: number;
  } | null;
  title: string;
}

const Bar = ({ label, value, color, percentage }) => (
  <View style={styles.barContainer}>
    <View style={styles.barLabelContainer}>
        <View style={[styles.barDot, { backgroundColor: color }]} />
        <Text style={styles.barLabel}>{label}</Text>
    </View>
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { backgroundColor: color, width: `${percentage}%` }]} />
    </View>
    <Text style={styles.barValue}>{formatCurrency(value)}</Text>
  </View>
);

export default function SalesAnalysisCard({ data, title }: SalesAnalysisCardProps) {
  if (!data) return null;

  const totalForPercentage = data.sales + data.pending + data.refunds;
  if (totalForPercentage === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>7 dias</Text>
            <Feather name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.totalValue}>{formatCurrency(0)}</Text>
        <Text style={styles.noDataText}>Sem dados para exibir.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>7 dias</Text>
          <Feather name="chevron-right" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{formatCurrency(data.total)}</Text>

      <View style={styles.barsSection}>
        <Bar label="Vendas" value={data.sales} color="#1A1AFF" percentage={(data.sales / totalForPercentage) * 100} />
        <Bar label="Pendentes" value={data.pending} color="#FF9900" percentage={(data.pending / totalForPercentage) * 100} />
        <Bar label="Estornos" value={data.refunds} color="#FF647C" percentage={(data.refunds / totalForPercentage) * 100} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  periodText: {
    fontSize: 14,
    marginRight: 4,
  },
  barsSection: {
    gap: 16,
  },
  barContainer: {
    
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  barLabel: {
    fontSize: 14,
    color: '#333',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#F5F6FA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#666',
  }
}); 