import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SalesAnalysisCard from './SalesAnalysisCard';
import SalesChart from './SalesChart';

interface SalesSummaryProps {
  chartData: any[];
  dashboardData: any;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  chartData,
  dashboardData,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Resumo de vendas</Text>
      <SalesChart chartData={chartData} />
      <SalesAnalysisCard dashboardData={dashboardData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
});

export default SalesSummary; 