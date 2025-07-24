import React from 'react';
import { StyleSheet, View } from 'react-native';
import SalesAnalysisCard from './SalesAnalysisCard'; // Análise de Vendas
import SalesChart from './SalesChart'; // Gráfico de Receita

const SalesSummary = ({ chartData, salesSummary, chartError, salesError }) => {
  return (
    <View style={styles.container}>
      <SalesChart 
        chartData={chartData}
        error={chartError}
      />
      <SalesAnalysisCard
        salesData={salesSummary}
        error={salesError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});

export default SalesSummary; 