import { useHomeData } from '@/features/home/hooks/useHomeData';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SalesChartCard } from '@/components/dashboard/SalesChartCard';
import DashboardCarousel from '@/components/home/DashboardCarousel';
import HeaderUser from '@/components/home/HeaderUser';
import JourneyCard from '@/components/home/JourneyCard';
import QuickActions from '@/components/home/QuickActions';
import SaldoCard from '@/components/home/SaldoCard';
import SalesAnalysisCard from '@/components/home/SalesAnalysisCard'; // Importando o novo card
import SalesMetricsCard from '@/components/home/SalesMetricsCard'; // Importando o card de grid

export default function HomeScreen() {
  const { user, financialSummary, chartData, additionalInfo, isLoading, error } = useHomeData();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("30 dias");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Dados para o card de Análise de Vendas
  const salesAnalysisData = {
    sales: financialSummary?.sumPaid || 0,
    pending: financialSummary?.sumPending || 0,
    refunds: financialSummary?.sumRefunded || 0,
    total: (financialSummary?.sumPaid || 0) + (financialSummary?.sumPending || 0)
  };

  // Dados para os cards de Métricas de Vendas (Grid)
  const salesMetricsData = {
    chargeback: financialSummary?.taxaChargeback || 0,
    pixSales: financialSummary?.sumPixPaid || 0,
    boletoSales: financialSummary?.sumBoletoPaid || 0,
  };

  const handlePeriodChange = () => {
    console.log('Mudando período...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeaderUser
          userName={user?.user_metadata?.full_name || "Gabriel"}
          onPress={() => console.log('Avatar pressionado')}
        />

        <SaldoCard
          saldo={financialSummary?.sumPaid || 0}
          onAntecipar={() => router.push('/financial/anticipations')}
        />
        
        <QuickActions />

        <JourneyCard onPress={() => router.push('/jornada')} />

        <Text style={styles.sectionTitle}>Resumo de vendas</Text>
        
        <SalesChartCard data={chartData} title="Gráfico de Receita" />
        
        <SalesAnalysisCard 
          data={salesAnalysisData}
          title="Análise de Vendas"
        />

        <DashboardCarousel 
          data={{ ...additionalInfo, ...financialSummary }} 
        />
        
        <SalesMetricsCard 
          data={salesMetricsData}
          onPeriodChange={handlePeriodChange}
          period={selectedPeriod}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF1FB', 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF1FB',
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8, // Margem superior generosa
  },
}); 