import { useHomeData } from '@/features/home/hooks/useHomeData';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import DashboardCarousel from '@/components/home/DashboardCarousel';
import ExploreCard from '@/components/home/ExploreCard';
import HeaderUser from '@/components/home/HeaderUser';
import JourneyCard from '@/components/home/JourneyCard';
import MetricCard from '@/components/home/MetricCard';
import QuickActions from '@/components/home/QuickActions';
import SaldoCard from '@/components/home/SaldoCard';
import SalesAnalysisCard from '@/components/home/SalesAnalysisCard';

export default function HomeScreen() {
  const { user, isLoading, error } = useHomeData();
  const router = useRouter();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeaderUser
          userName={user?.user_metadata?.full_name}
          onPress={() => console.log('Avatar pressionado')}
        />
        <SaldoCard
          saldo={0}
          onAntecipar={() => router.push('/financial/anticipations')}
        />
        <QuickActions />
        <JourneyCard onPress={() => router.push('/jornada')} />

        <Text style={styles.sectionTitle}>Análise de Vendas</Text>
        <SalesAnalysisCard />
        
        <DashboardCarousel />

        <Text style={styles.sectionTitle}>Métricas de vendas</Text>
        <View style={styles.metricsGrid}>
          <MetricCard title="Chargeback" value="0,0%" change="+0%" isPositive={false} period="Últimos 30 dias"/>
          <MetricCard title="Vendas Pix" value="R$ 0,00" change="+0%" isPositive period="Últimos 30 dias"/>
        </View>
        <View style={styles.metricsGrid}>
            <MetricCard title="Vendas Boletos" value="R$ 0,00" change="+0%" isPositive period="Últimos 30 dias"/>
        </View>

        <ExploreCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
}); 