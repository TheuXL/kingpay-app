import React from 'react';
import { StyleSheet, View } from 'react-native';
import DashboardCarousel from './DashboardCarousel';

// Dados de exemplo
const mockData = {
  refunds: {
    totalRefunds: 1250000, // R$ 12.500,00 em centavos
    estornos: 850000,      // R$ 8.500,00
    cashback: 400000,      // R$ 4.000,00
    estornoRate: 2.3,      // 2.3%
  },
  approvalRate: {
    overallRate: 94.2,     // 94.2%
    pix: 98.5,             // 98.5%
    card: 91.8,            // 91.8%
    boleto: 89.2,          // 89.2%
  },
  totalSales: {
    totalSales: 5420000,   // R$ 54.200,00 em centavos
    salesCount: {
      value: 1247,         // 1.247 vendas
      variation: 12.5,     // +12.5%
      isPositive: true,
    },
    averageTicket: {
      value: 43500,        // R$ 435,00 em centavos
      variation: 3.2,      // +3.2%
      isPositive: true,
    },
  },
  paymentMethods: {
    totalValue: 5420000,   // R$ 54.200,00 em centavos
    pix: {
      percentage: 45.2,    // 45.2%
      variation: 8.3,      // +8.3%
      isPositive: true,
    },
    card: {
      percentage: 38.7,    // 38.7%
      variation: 2.1,      // -2.1%
      isPositive: false,
    },
    boleto: {
      percentage: 16.1,    // 16.1%
      variation: 5.4,      // -5.4%
      isPositive: false,
    },
  },
};

const DashboardCarouselExample: React.FC = () => {
  const handlePeriodChange = (cardIndex: number, days: number) => {
    console.log(`Card ${cardIndex} período alterado para ${days} dias`);
    // Aqui você faria a chamada para a API com o novo período
  };

  return (
    <View style={styles.container}>
      <DashboardCarousel 
        data={mockData}
        onPeriodChange={handlePeriodChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
});

export default DashboardCarouselExample;
