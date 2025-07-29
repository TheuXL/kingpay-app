import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TotalSalesData {
  countTotal?: number;
  countPaid?: number;
  sumPaid?: number; // já em centavos
  sumValorLiquido?: number; // já em centavos
  salesCountVariation?: number;
  averageTicketVariation?: number;
}

interface TotalSalesCarouselCardProps {
  data?: TotalSalesData;
  isLoading?: boolean;
}

const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
};

const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR');
};

const calculateAverageTicket = (totalValue: number, salesCount: number): number => {
  if (salesCount === 0) return 0;
  return totalValue / salesCount;
};

const TotalSalesCarouselCard: React.FC<TotalSalesCarouselCardProps> = ({ data, isLoading = false }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  const renderMetric = (
    label: string,
    value: string,
    variation?: number,
  ) => {
    const isPositive = variation !== undefined && variation >= 0;
    
    return (
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{label}</Text>
          <View style={styles.metricValue}>
            <Text style={styles.metricNumber}>{value}</Text>
            {variation !== undefined && (
                 <View style={styles.variationContainer}>
                    {isPositive ? (
                        <TrendingUp size={14} color="#00C48C" />
                    ) : (
                        <TrendingDown size={14} color="#FF647C" />
                    )}
                    <Text style={[
                        styles.variationText,
                        { color: isPositive ? '#00C48C' : '#FF647C' }
                    ]}>
                        {Math.abs(variation).toFixed(1)}%
                    </Text>
                </View>
            )}
          </View>
        </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando vendas...</Text>
        </View>
      </View>
    );
  }

  // Calcular valores com dados reais
  const totalValue = data?.sumPaid || 0;
  const salesCount = data?.countPaid || 0;
  const averageTicket = calculateAverageTicket(totalValue, salesCount);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Total de Vendas</Text>
          <Text style={styles.value}>
            {totalValue > 0 ? formatCurrency(totalValue) : 'R$ 0,00'}
          </Text>
        </View>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.metricsContainer}>
        {renderMetric(
          'Vendas realizadas',
          salesCount > 0 ? formatNumber(salesCount) : '0',
          data?.salesCountVariation
        )}
        
        {renderMetric(
          'Ticket médio',
          averageTicket > 0 ? formatCurrency(averageTicket) : 'R$ 0,00',
          data?.averageTicketVariation
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    height: 220, // Altura fixa para consistência no carrossel
    justifyContent: 'space-around',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 4,
  },
  metricsContainer: {
    gap: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    flex: 1,
  },
  metricValue: {
    alignItems: 'flex-end',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  variationText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TotalSalesCarouselCard;
