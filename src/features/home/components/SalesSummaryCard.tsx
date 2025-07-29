import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SalesSummaryCardProps {
  data?: {
    months: string[];
    values: number[];
  };
}

const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 6 meses');
  
  // Mock data para demonstração
  const chartData = data || {
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    values: [75, 45, 90, 65, 80, 95]
  };

  const maxValue = Math.max(...chartData.values);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo de vendas</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.months.map((month, index) => {
            const height = (chartData.values[index] / maxValue) * 120; // 120 é a altura máxima do gráfico
            return (
              <View key={month} style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View style={[styles.bar, { height }]} />
                </View>
                <Text style={styles.monthLabel}>{month}</Text>
              </View>
            );
          })}
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    height: 120,
    width: 20,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    backgroundColor: '#1A1AFF',
    borderRadius: 4,
    minHeight: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
  },
});

export default SalesSummaryCard;
