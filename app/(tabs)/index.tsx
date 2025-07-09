import { Text } from 'react-native-paper';
import React from 'react';

import { AppCard } from '@/components/common/AppCard';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { StyleSheet } from 'react-native';

export default function DashboardScreen() {
  const { stats, loading, fetchCompanyStats } = useCompanyStore();

  React.useEffect(() => {
    fetchCompanyStats();
  }, []);

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
      <AppCard>
        <AppCard.Title title="Empresas" />
        <AppCard.Content>
          {loading ? (
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
