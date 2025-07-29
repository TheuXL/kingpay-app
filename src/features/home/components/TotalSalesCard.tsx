import { formatCurrency } from '@/utils/currency';
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

interface TotalSalesCardProps {
  data: {
    sumPaid: number;
    countPaid: number;
    avgTicket: number;
    // outras props se houver
  };
}

const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ data }) => {
  // Fallback para caso os dados não cheguem
  const totalSales = data?.sumPaid || 0;
  const salesCount = data?.countPaid || 0;
  const averageTicket = data?.avgTicket || 0;

  // Lógica de variação (exemplo, precisa ser implementada com dados reais de comparação)
  const salesCountChange = { value: '+14%', isPositive: true };
  const averageTicketChange = { value: '+4%', isPositive: true };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Total de Vendas</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>30 dias</Text>
          <ChevronDown color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{formatCurrency(totalSales)}</Text>

      {/* Métricas */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Número de vendas</Text>
          <View style={styles.metricValueContainer}>
            <Text style={styles.metricValue}>{salesCount.toLocaleString('pt-BR')}</Text>
            <View style={styles.trendContainer}>
                {salesCountChange.isPositive ? <TrendingUp size={14} color={colors.success} /> : <TrendingDown size={14} color={colors.danger} />}
                <Text style={[styles.trendText, { color: salesCountChange.isPositive ? colors.success : colors.danger }]}>
                    {salesCountChange.value}
                </Text>
            </View>
          </View>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Ticket Médio</Text>
          <View style={styles.metricValueContainer}>
            <Text style={styles.metricValue}>{formatCurrency(averageTicket)}</Text>
            <View style={styles.trendContainer}>
                {averageTicketChange.isPositive ? <TrendingUp size={14} color={colors.success} /> : <TrendingDown size={14} color={colors.danger} />}
                <Text style={[styles.trendText, { color: averageTicketChange.isPositive ? colors.success : colors.danger }]}>
                    {averageTicketChange.value}
                </Text>
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
        padding: 20,
        shadowColor: 'rgba(0,0,0,0.04)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
        height: 280, // Altura padrão
        justifyContent: 'space-between', // Para distribuir o conteúdo
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      title: {
        fontSize: 14,
        color: '#52525B',
      },
      periodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F5',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
      },
      periodText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3F3F46',
        marginRight: 6,
      },
      totalValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 8,
        marginBottom: 20,
      },
      metricsContainer: {
        gap: 16,
      },
      metricItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      metricLabel: {
        fontSize: 14,
        color: '#52525B',
      },
      metricValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      metricValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
      },
      trendContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 8,
      },
      trendText: {
          fontSize: 12,
          marginLeft: 2,
      }
});

export default TotalSalesCard; 