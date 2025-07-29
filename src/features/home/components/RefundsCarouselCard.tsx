import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RefundsData {
  total?: number;
  estornos?: number;
  cashback?: number;
  taxaEstorno?: number;
  // Novos campos vindos dos endpoints
  countRefused?: number;
  sumRefused?: number;
  countChargeback?: number;
  sumChargeback?: number;
  countRefunded?: number;
  sumRefunded?: number;
}

interface RefundsCarouselCardProps {
  data?: RefundsData;
  isLoading?: boolean;
}

const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
};

const RefundsCarouselCard: React.FC<RefundsCarouselCardProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando estornos...</Text>
        </View>
      </View>
    );
  }

  // Calcular total de valores negativos (estornos, recusadas, chargebacks)
  const totalRefusedValue = (data?.sumRefused || 0) + (data?.sumChargeback || 0) + (data?.sumRefunded || 0);
  const totalRefusedCount = (data?.countRefused || 0) + (data?.countChargeback || 0) + (data?.countRefunded || 0);
  
  // Renderiza a estrutura com dados reais ou placeholders
  const totalValue = totalRefusedValue > 0 ? formatCurrency(totalRefusedValue) : 'R$ 0,00';
  
  // Calcular percentuais baseados nos valores
  const refusedPercent = totalRefusedValue > 0 ? ((data?.sumRefused || 0) / totalRefusedValue) * 100 : 0;
  const chargebackPercent = totalRefusedValue > 0 ? ((data?.sumChargeback || 0) / totalRefusedValue) * 100 : 0;
  const refundedPercent = totalRefusedValue > 0 ? ((data?.sumRefunded || 0) / totalRefusedValue) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Estornos e Recusas</Text>
          <Text style={styles.value}>{totalValue}</Text>
        </View>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Recusadas</Text>
          <View style={styles.metricValue}>
            <Text style={styles.metricNumber}>{data?.countRefused || 0}</Text>
            <Text style={styles.metricPercent}>{refusedPercent.toFixed(1)}%</Text>
          </View>
        </View>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Chargeback</Text>
          <View style={styles.metricValue}>
            <Text style={styles.metricNumber}>{data?.countChargeback || 0}</Text>
            <Text style={styles.metricPercent}>{chargebackPercent.toFixed(1)}%</Text>
          </View>
        </View>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Estornadas</Text>
          <View style={styles.metricValue}>
            <Text style={styles.metricNumber}>{data?.countRefunded || 0}</Text>
            <Text style={styles.metricPercent}>{refundedPercent.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalRefusedCount} transações afetadas
        </Text>
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
    height: 220,
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
    color: '#FF647C',
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
    gap: 12,
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
  },
  metricPercent: {
    fontSize: 12,
    color: '#FF647C',
    fontWeight: '600',
  },
  summaryContainer: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontStyle: 'italic',
  },
});

export default RefundsCarouselCard;
