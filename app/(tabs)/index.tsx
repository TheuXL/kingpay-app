import React from 'react';
import { Text } from 'react-native-paper';

import { AppCard } from '@/components/common/AppCard';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { StyleSheet } from 'react-native';

// Add missing interface for stats
interface CompanyStats {
  pendingCount: number;
}

// Extend the store with missing properties
interface DashboardStore {
  stats: CompanyStats;
  isLoading: boolean;
  fetchCompanyStats: () => Promise<void>;
}

export default function DashboardScreen() {
  const { stats, isLoading, fetchCompanyStats } = useCompanyStore() as unknown as DashboardStore;

  React.useEffect(() => {
    fetchCompanyStats();
  }, []);

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
      <AppCard>
        <AppCard.Title>Empresas</AppCard.Title>
        <AppCard.Content>
          {isLoading ? (
            <Text>Carregando...</Text>
          ) : (
            <Text variant="headlineLarge">{stats.pendingCount ?? 0}</Text>
          )}
          <Text>Cadastros Pendentes</Text>
        </AppCard.Content>
      </AppCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
});
