import ApprovalRateCarouselCard from '@/components/home/ApprovalRateCarouselCard';
import CarouselContainer from '@/components/home/CarouselContainer';
import ExploreCard from '@/components/home/ExploreCard';
import HeaderUser from '@/components/home/HeaderUser';
import JourneyCard from '@/components/home/JourneyCard';
import PaymentMethodsCarouselCard from '@/components/home/PaymentMethodsCarouselCard';
import QuickActions from '@/components/home/QuickActions';
import RefundsCarouselCard from '@/components/home/RefundsCarouselCard';
import SaldoCard from '@/components/home/SaldoCard';
import SalesMetricsGrid from '@/components/home/SalesMetricsGrid';
import SalesSummaryCard from '@/components/home/SalesSummaryCard';
import TotalSalesCarouselCard from '@/components/home/TotalSalesCarouselCard';
import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1313F2" />}
      >
        <View style={styles.centeredContent}>
          <View style={styles.headerContainer}>
            <HeaderUser />
            <SaldoCard />
          </View>
          <QuickActions />
          <JourneyCard />
          <SalesSummaryCard />
          <CarouselContainer>
            <RefundsCarouselCard />
            <PaymentMethodsCarouselCard />
            <TotalSalesCarouselCard />
            <ApprovalRateCarouselCard />
          </CarouselContainer>
          <SalesMetricsGrid />
          <ExploreCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7', // cinza-claro suave
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 30,
    paddingBottom: 150,
    gap: 40,
  },
  centeredContent: {
    width: '100%',
    maxWidth: 370,
    alignItems: 'center',
  },
  headerContainer: {
    gap: 24,
    width: '100%',
    maxWidth: 350,
  },
});

export default HomeScreen;
