import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AppButton } from '@/components/common/AppButton';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { useFinancialStore } from '@/store/financialStore';

export default function AnticipationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedItem, loadingAnticipations, fetchAnticipationById } = useFinancialStore();

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [action, setAction] = React.useState<'approve' | 'deny'>('approve');

  React.useEffect(() => {
    if (id) {
      fetchAnticipationById(id);
    }
  }, [id]);

  const handleAction = (selectedAction: 'approve' | 'deny') => {
    setAction(selectedAction);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    console.log(`Antecipação ${action === 'approve' ? 'aprovada' : 'negada'}`);
    setModalVisible(false);
  };
  
  if (loadingAnticipations) {
    return (
      <ScreenLayout>
        <ActivityIndicator size="large" />
      </ScreenLayout>
    );
  }

  if (!selectedItem) {
    return (
      <ScreenLayout>
        <Text>Antecipação não encontrada.</Text>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Stack.Screen options={{ title: 'Detalhes da Antecipação' }} />
      <Text variant="headlineMedium" style={styles.title}>
        R$ {selectedItem.amount}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {selectedItem.companies.name}
      </Text>

      <Divider style={styles.divider} />

      <Text>Status: {selectedItem.status}</Text>
      <Text>Data: {new Date(selectedItem.created_at).toLocaleString()}</Text>

      <View style={styles.actionsContainer}>
        {selectedItem.status === 'Pendente' && (
          <>
            <AppButton mode="contained" icon="check" onPress={() => handleAction('approve')}>
              Aprovar
            </AppButton>
            <AppButton mode="outlined" icon="close" onPress={() => handleAction('deny')}>
              Negar
            </AppButton>
          </>
        )}
      </View>

      <ConfirmationModal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        title={action === 'approve' ? 'Aprovar Antecipação' : 'Negar Antecipação'}
        content={`Tem certeza que deseja ${
          action === 'approve' ? 'aprovar' : 'negar'
        } esta antecipação?`}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  actionsContainer: {
    marginTop: 'auto',
    gap: 8,
  },
}); 