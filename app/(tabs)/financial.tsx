import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useFinancialStore, type Withdrawal, type Anticipation } from '@/store/financialStore';

export default function FinancialScreen() {
  const [view, setView] = React.useState('withdrawals');
  const router = useRouter();
  const {
    withdrawals,
    anticipations,
    loadingWithdrawals,
    loadingAnticipations,
    fetchWithdrawals,
    fetchAnticipations,
  } = useFinancialStore();

  React.useEffect(() => {
    if (view === 'withdrawals') {
      fetchWithdrawals();
    } else {
      fetchAnticipations();
    }
  }, [view]);

  const renderWithdrawals = () => {
    if (loadingWithdrawals) return <ActivityIndicator style={styles.loader} />;
    return (
      <AppCard>
        {withdrawals.map((item: Withdrawal) => (
          <AppListItem
            key={item.id}
            title={`R$ ${item.amount} - ${item.companies.name}`}
            description={`${item.status} - ${new Date(item.created_at).toLocaleDateString()}`}
            right={() => <AppListItem.Icon icon="chevron-right" />}
            onPress={() => router.push(`/withdrawal-details?id=${item.id}`)}
          />
        ))}
      </AppCard>
    );
  };

  const renderAnticipations = () => {
    if (loadingAnticipations) return <ActivityIndicator style={styles.loader} />;
    return (
      <AppCard>
        {anticipations.map((item: Anticipation) => (
          <AppListItem
            key={item.id}
            title={`R$ ${item.amount} - ${item.companies.name}`}
            description={`${item.status} - ${new Date(item.created_at).toLocaleDateString()}`}
            right={() => <AppListItem.Icon icon="chevron-right" />}
            onPress={() => router.push(`/anticipation-details?id=${item.id}`)}
          />
        ))}
      </AppCard>
    );
  };

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Financeiro
      </Text>

      <SegmentedButtons
        value={view}
        onValueChange={setView}
        buttons={[
          { value: 'withdrawals', label: 'Saques' },
          { value: 'anticipations', label: 'Antecipações' },
        ]}
        style={styles.segments}
      />

      {view === 'withdrawals' ? renderWithdrawals() : renderAnticipations()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  segments: {
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
}); 