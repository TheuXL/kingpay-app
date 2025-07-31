import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TotalSalesCardProps {
  data: {
    sumPaid: number;
    countPaid: number;
    avgTicket: number;
  };
}

const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ data }) => {
  const totalSales = data?.sumPaid || 0;
  const salesCount = data?.countPaid || 0;
  const averageTicket = data?.avgTicket || 0;

  // Mock de variação para exemplo visual
  const salesCountChange = { value: '+14%', isPositive: true };
  const averageTicketChange = { value: '+4%', isPositive: false };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Total de Vendas</Text>
      <Text style={styles.totalValue}>{formatCurrency(totalSales)}</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Número de vendas</Text>
          <View style={styles.metricValueContainer}>
            <Text style={styles.metricValue}>{salesCount.toLocaleString('pt-BR')}</Text>
            <View style={styles.trendContainer}>
              {salesCountChange.isPositive ? (
                <TrendingUp size={16} color="#22C55E" />
              ) : (
                <TrendingDown size={16} color="#EF4444" />
              )}
              <Text style={[styles.trendText, { color: salesCountChange.isPositive ? '#22C55E' : '#EF4444' }]}> {salesCountChange.value}</Text>
            </View>
          </View>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Ticket Médio</Text>
          <View style={styles.metricValueContainer}>
            <Text style={styles.metricValue}>{formatCurrency(averageTicket)}</Text>
            <View style={styles.trendContainer}>
              {averageTicketChange.isPositive ? (
                <TrendingUp size={16} color="#22C55E" />
              ) : (
                <TrendingDown size={16} color="#EF4444" />
              )}
              <Text style={[styles.trendText, { color: averageTicketChange.isPositive ? '#22C55E' : '#EF4444' }]}> {averageTicketChange.value}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
    minHeight: 220,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 15,
    color: '#8C8C8C',
    marginBottom: 8,
  },
  totalValue: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 28,
    color: '#00051B',
    marginBottom: 28,
  },
  metricsContainer: {
    gap: 18,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 15,
    color: '#8C8C8C',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 17,
    color: '#00051B',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  trendText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 2,
  },
});

export default TotalSalesCard; 