import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';

import { AppCard } from '@/components/common/AppCard';
import { AppListItem } from '@/components/common/AppListItem';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useFinancialStore, type Anticipation, type Withdrawal } from '@/store/financialStore';

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
            right={() => <AppListItem.Icon name="chevron-right" />}
            onPress={() => router.push({
              pathname: '/withdrawal-details',
              params: { id: item.id }
            } as any)}
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
            right={() => <AppListItem.Icon name="chevron-right" />}
            onPress={() => router.push({
              pathname: '/anticipation-details',
              params: { id: item.id }
            } as any)}
          />
        ))}
      </AppCard>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Financeiro
        </Text>
        
        <Button 
          mode="contained" 
          icon="calculator"
          // @ts-ignore - Ignorar erro de tipagem aqui
          onPress={() => router.push('/tax-calculator')}
          style={styles.calculatorButton}
        >
          Calculadora de Taxas
        </Button>
      </View>

      <SegmentedButtons
        value={view}
        onValueChange={setView}
        buttons={[
          {
            value: 'withdrawals',
            label: 'Saques',
          },
          {
            value: 'anticipations',
            label: 'Antecipações',
          },
        ]}
        style={styles.segmentedButtons}
      />

      {view === 'withdrawals' ? renderWithdrawals() : renderAnticipations()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calculatorButton: {
    borderRadius: 8,
  },
}); 