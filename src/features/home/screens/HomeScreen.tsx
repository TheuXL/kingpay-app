import { useUserData } from '@/contexts/UserDataContext';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DashboardCarousel } from '../../../components/home/DashboardCarousel';
import HeaderUser from '../../../components/home/HeaderUser';
import SalesChart from '../../../components/home/SalesChart';
import TotalSalesCard from '../../../components/home/TotalSalesCard';
// import TopListCard from '../../../components/dashboard/TopListCard'; // Removido temporariamente

const HomeScreen = () => {
  const { userProfile, company } = useUserData();
  const {
    financialSummary,
    chartData,
    additionalInfo,
    isLoading,
    error,
    refreshData,
    // topSellers, // Removido temporariamente
  } = useHomeData();

  const userName = useMemo(() => {
    if (userProfile?.fullname) return userProfile.fullname;
    if (userProfile?.email) return userProfile.email.split('@')[0];
    return 'Usuário';
  }, [userProfile]);

  if (isLoading && !financialSummary) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderUser
          userName={userName}
          userPhoto={company?.logo_url || undefined}
        />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Ocorreu um erro ao carregar os dados. Tente novamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
       <HeaderUser
          userName={userName}
          userPhoto={company?.logo_url || undefined}
        />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
      >
        <DashboardCarousel />

        {financialSummary && <TotalSalesCard summary={financialSummary} />}
        {chartData && chartData.length > 0 && <SalesChart data={chartData} />}
        {/* {topSellers && topSellers.length > 0 && (
          <TopListCard title="Top Vendedores" items={topSellers} />
        )} */}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen; 