import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RefundsData {
  estornos: number;
  cashback: number;
  taxaEstorno: number;
}

interface RefundsCardProps {
  data?: RefundsData;
}

const RefundsCard: React.FC<RefundsCardProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  const [currentPage, setCurrentPage] = useState(0);
  
  // Mock data para demonstração - valor total em centavos
  const refundsData = data || {
    total: 1254716, // R$ 12.547,16
    estornos: 15,
    cashback: 8,
    taxaEstorno: 2.5
  };

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const totalValue = formatCurrency(refundsData.total);
  
  const estornosPercent = refundsData.estornos;
  const cashbackPercent = refundsData.cashback;
  const taxaPercent = refundsData.taxaEstorno;

  // Dados da paginação
  const pages = 3;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reembolsos</Text>
          <Text style={styles.value}>{totalValue}</Text>
        </View>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        {/* Barra de progresso multicolorida */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.estornosSegment, { width: `${estornosPercent}%` }]} />
            <View style={[styles.progressSegment, styles.cashbackSegment, { width: `${cashbackPercent}%` }]} />
            <View style={[styles.progressSegment, styles.taxaSegment, { width: `${taxaPercent}%` }]} />
          </View>
        </View>

        {/* Legenda com valores */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
            <Text style={styles.legendText}>Estornos</Text>
            <Text style={styles.legendValue}>{estornosPercent}%</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.legendText}>Cashback</Text>
            <Text style={styles.legendValue}>{cashbackPercent}%</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Taxa de estorno</Text>
            <Text style={styles.legendValue}>{taxaPercent}%</Text>
          </View>
        </View>

        {/* Paginação */}
        <View style={styles.pagination}>
          {Array.from({ length: pages }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.activePaginationDot
              ]}
              onPress={() => setCurrentPage(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    color: '#6B6B6B',
    marginRight: 4,
  },
  chartContainer: {
    paddingVertical: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    height: 12,
    backgroundColor: '#F5F6FA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  estornosSegment: {
    backgroundColor: '#FF9500',
  },
  cashbackSegment: {
    backgroundColor: '#8B5CF6',
  },
  taxaSegment: {
    backgroundColor: '#10B981',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  activePaginationDot: {
    backgroundColor: '#1A1AFF',
  },
});

export default RefundsCard;
