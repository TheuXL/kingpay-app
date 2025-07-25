import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';
import { colors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import PaymentMethodsCard from '@/components/dashboard/PaymentMethodsCard';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import RefundsCard from '@/components/dashboard/RefundsCard';
import { SalesChartCard } from '@/components/dashboard/SalesChartCard';
import SalesMetricsCard from '@/components/dashboard/SalesMetricsCard';
import TopListCard from '@/components/dashboard/TopListCard';
import WhitelabelBillingCard from '@/components/dashboard/WhitelabelBillingCard';
import WhitelabelFinancialCard from '@/components/dashboard/WhitelabelFinancialCard';

export default function DashboardScreen() {
  const today = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

  const { 
    // ===== DADOS PRINCIPAIS =====
    dashboardData, 
    additionalInfo,
    chartData,
    topProducts,
    topSellers,
    
    // ===== DADOS WHITELABEL =====
    whitelabelBilling,
    whitelabelFinancial,
    
    // ===== DADOS ADICIONAIS =====
    providers,
    acquirers,
    
    // ===== ESTADOS DE CONTROLE =====
    isLoading, 
    error, 
    setDateRange 
  } = useDashboardMetrics(thirtyDaysAgo, today);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados do dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Verifique sua conexão e tente novamente</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        
        <PeriodSelector onDateChange={setDateRange} />
        
        {/* ===== DADOS PRINCIPAIS ===== */}
        {dashboardData && (
          <>
            <SalesMetricsCard data={dashboardData} />
            <RefundsCard data={dashboardData} />
          </>
        )}
        
        {/* ===== GRÁFICO DE VENDAS ===== */}
        {chartData.length > 0 && (
          <SalesChartCard data={chartData} />
        )}
        
        {/* ===== TOP PRODUTOS ===== */}
        {topProducts.length > 0 && (
          <TopListCard
            title="Top Produtos"
            data={topProducts}
            nameKey="product_name"
            valueKey="total_revenue"
            subtitle="Mais vendidos no período"
          />
        )}
        
        {/* ===== TOP VENDEDORES ===== */}
        {topSellers.length > 0 && (
          <TopListCard
            title="Top Vendedores"
            data={topSellers}
            nameKey="seller_name"
            valueKey="total_revenue"
            subtitle="Melhores desempenhos"
          />
        )}
        
        {/* ===== MÉTODOS DE PAGAMENTO ===== */}
        {additionalInfo?.paymentMethods && additionalInfo.paymentMethods.length > 0 && (
          <PaymentMethodsCard data={additionalInfo.paymentMethods} />
        )}
        
        {/* ===== DADOS WHITELABEL ===== */}
        {whitelabelBilling && (
          <WhitelabelBillingCard data={whitelabelBilling} />
        )}
        
        {whitelabelFinancial && (
          <WhitelabelFinancialCard data={whitelabelFinancial} />
        )}
        
        {/* ===== DADOS ADICIONAIS ===== */}
        {providers.length > 0 && (
          <TopListCard
            title="Provedores"
            data={providers}
            nameKey="provider_name"
            valueKey="total_revenue"
            subtitle="Desempenho por provedor"
          />
        )}
        
        {acquirers.length > 0 && (
          <TopListCard
            title="Adquirentes"
            data={acquirers}
            nameKey="acquirer_name"
            valueKey="total_revenue"
            subtitle="Desempenho por adquirente"
          />
        )}
        
        {/* ===== MENSAGEM QUANDO NÃO HÁ DADOS ===== */}
        {!dashboardData && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nenhum dado encontrado</Text>
            <Text style={styles.emptyStateSubtitle}>
              Não há transações no período selecionado. Tente alterar o período ou verifique se há dados disponíveis.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 