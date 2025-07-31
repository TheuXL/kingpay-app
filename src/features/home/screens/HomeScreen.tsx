import ApprovalRateCard from '@/features/home/components/ApprovalRateCard';
import HeaderUser from '@/features/home/components/HeaderUser';
import JourneyCard from '@/features/home/components/JourneyCard';
import PaymentMethodsCard from '@/features/home/components/PaymentMethodsCard';
import QuickActions from '@/features/home/components/QuickActions';
import RefundsCard from '@/features/home/components/RefundsCard';
import RevenueChartCard from '@/features/home/components/RevenueChartCard';
import SaldoCard from '@/features/home/components/SaldoCard';
import TotalSalesCard from '@/features/home/components/TotalSalesCard';
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
          <HeaderUser />
          <View style={styles.cardsStack}>
            <SaldoCard />
            <QuickActions />
            <JourneyCard />
            <RevenueChartCard />
            <PaymentMethodsCard data={[
              { metodo: 'PIX', valorTotal: 100 },
              { metodo: 'CARD', valorTotal: 50 },
              { metodo: 'BOLETO', valorTotal: 25 },
            ]} />
            <RefundsCard />
            <ApprovalRateCard />
            <TotalSalesCard data={{ sumPaid: 1000, countPaid: 10, avgTicket: 100 }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 120,
    paddingTop: 0,
  },
  centeredContent: {
    width: '100%',
    maxWidth: 398,
    alignItems: 'stretch',
    paddingHorizontal: 24,
  },
  cardsStack: {
    width: '100%',
    gap: 24,
    alignItems: 'stretch',
  },
});

export default HomeScreen;
