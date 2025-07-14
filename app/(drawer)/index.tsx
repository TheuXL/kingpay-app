import {
    DashboardCard,
    DashboardChart,
    DateRangePicker,
    InfosAdicionaisCard,
    TopProdutosList,
    TopSellersList
} from '@/components/dashboard';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useDashboardStore } from '@/store';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DashboardDateRange } from '../../src/types';

export default function DashboardScreen() {
  const theme = useTheme();
  const { 
    isLoading,
    dateRange,
    dashboardData,
    topSellers,
    topProdutos,
    graficoData,
    infosAdicionais,
    setDateRange,
    fetchAllDashboardData
  } = useDashboardStore();

  // Carregar dados do dashboard ao montar o componente
  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  // Atualizar dados quando o período mudar
  const handleDateRangeChange = (newDateRange: DashboardDateRange) => {
    setDateRange(newDateRange);
    fetchAllDashboardData();
  };

  // Formatar valores para exibição
  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercentage = (value: number | undefined) => {
    return `${((value || 0) * 100).toFixed(1)}%`;
  };

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Dashboard
      </Text>

      <ScrollView style={styles.scrollView}>
        <DateRangePicker 
          dateRange={dateRange} 
          onDateRangeChange={handleDateRangeChange} 
        />

        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Total de Vendas"
            value={formatCurrency(dashboardData?.total_vendas)}
            icon="cash-multiple"
            color={theme.colors.primary}
            isLoading={isLoading}
          />
          <DashboardCard
            title="Taxa de Aprovação"
            value={formatPercentage(dashboardData?.taxa_aprovacao)}
            icon="check-circle"
            color="#00C853"
            isLoading={isLoading}
          />
        </View>

        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Ticket Médio"
            value={formatCurrency(dashboardData?.ticket_medio)}
            icon="receipt"
            color="#FF9800"
            isLoading={isLoading}
          />
          <DashboardCard
            title="Total de Transações"
            value={dashboardData?.total_transacoes || 0}
            icon="swap-horizontal"
            color="#2979FF"
            isLoading={isLoading}
          />
        </View>

        <DashboardChart
          data={graficoData}
          isLoading={isLoading}
        />

        <View style={styles.listsContainer}>
          <TopSellersList 
            sellers={topSellers} 
            isLoading={isLoading} 
          />
          <TopProdutosList 
            produtos={topProdutos} 
            isLoading={isLoading} 
          />
        </View>

        <InfosAdicionaisCard 
          data={infosAdicionais} 
          isLoading={isLoading} 
        />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 8,
  },
  listsContainer: {
    marginVertical: 8,
  },
}); 