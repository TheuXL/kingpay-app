import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  getFinancialSummary,
  getDashboardData,
  getChartData,
} from '@/features/dashboard/services/dashboardService';
import { useUserData } from '@/contexts/UserDataContext';
import { logger } from '@/utils/logger';
import { colors } from '@/theme/colors';
import {
  WhitelabelFinancial,
  DashboardData,
  ChartDataPoint,
} from '@/types/dashboard';

// Importe todos os seus componentes de UI aqui
import HeaderUser from '@/components/home/HeaderUser';
import SaldoCard from '@/components/home/SaldoCard';
import QuickActions from '@/components/home/QuickActions';
import JourneyCard from '@/components/home/JourneyCard';
import SalesSummary from '@/components/home/SalesSummary';
import RefundsCard from '@/components/home/RefundsCard';
import SalesMetricsCard from '@/components/home/SalesMetricsCard';

export default function HomeScreen() {
  const { userProfile, company } = useUserData();
  const [financialSummary, setFinancialSummary] = useState<WhitelabelFinancial | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeScreenData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      logger.system('HomeScreen', 'Iniciando carregamento de dados da Home');

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      // Busca todos os dados em paralelo
      const [financialRes, dashboardRes, chartRes] = await Promise.all([
        getFinancialSummary(),
        getDashboardData(startDateString, endDateString),
        getChartData(startDateString, endDateString),
      ]);

      if (financialRes.success && financialRes.data) setFinancialSummary(financialRes.data);
      if (dashboardRes.success && dashboardRes.data) setDashboardData(dashboardRes.data);
      if (chartRes.success && chartRes.data) setChartData(chartRes.data);

      logger.success('HomeScreen', 'Dados da Home carregados com sucesso');
    } catch (e: any) {
      setError(e.message);
      logger.error('HomeScreen', 'Erro ao carregar dados da Home:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeScreenData();
  }, [loadHomeScreenData]);

  const userName = userProfile?.fullname || 'Usuário';
  const userPhoto = company?.logo_url;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Ocorreu um erro ao carregar os dados.
          </Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderUser userName={userName} userPhoto={userPhoto} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadHomeScreenData} />
        }
      >
        <SaldoCard
          balance={financialSummary?.total_balances?.total_balance || 0}
        />
        <QuickActions />
        <JourneyCard />
        <SalesSummary
          chartData={chartData || []}
          dashboardData={dashboardData}
        />
        <RefundsCard dashboardData={dashboardData} />
        <SalesMetricsCard dashboardData={dashboardData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}); 