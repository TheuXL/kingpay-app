import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';
import { colors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import PaymentMethodsCard from '@/components/dashboard/PaymentMethodsCard';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import RefundsCard from '@/components/dashboard/RefundsCard';
import SalesMetricsCard from '@/components/dashboard/SalesMetricsCard';

export default function DashboardScreen() {
  const today = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

  const { 
    dashboardData, 
    additionalInfo, 
    isLoading, 
    error, 
    setDateRange 
  } = useDashboardMetrics(thirtyDaysAgo, today);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <PeriodSelector onDateChange={setDateRange} />
        <SalesMetricsCard data={dashboardData} />
        <RefundsCard data={dashboardData} />
        <PaymentMethodsCard data={additionalInfo?.paymentMethods} />
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
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
}); 