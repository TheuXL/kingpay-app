import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SalesSummaryCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  // Valor fixo para fins de design
  const totalSales = 138241.15;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo de vendas</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={20} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.salesContainer}>
        <Text style={styles.salesAmount}>{formatCurrency(totalSales)}</Text>
        <Text style={styles.salesPeriod}>Últimos 30 dias</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
  },
  salesContainer: {
    alignItems: 'flex-start',
  },
  salesAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  salesPeriod: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 4,
  },
});

export default SalesSummaryCard;
