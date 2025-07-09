import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Divider, Badge } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { AppButton } from '@/components/common/AppButton';
import { FinancialPasswordModal } from '@/components/common/FinancialPasswordModal';

export default function WithdrawalDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // In a real app, you would fetch the withdrawal details from an API
  const withdrawal = {
    id: params.id as string,
    amount: 'R$ 1.500,00',
    status: 'pending',
    date: '15/05/2023',
    account: {
      bank: 'Nubank',
      agency: '0001',
      account: '12345-6',
      holder: 'João Silva',
      type: 'Conta Corrente',
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  const handleApprove = () => {
    setShowPasswordModal(true);
  };

  const handleReject = () => {
    Alert.alert(
      'Rejeitar Saque',
      'Tem certeza que deseja rejeitar este saque?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Rejeitar', style: 'destructive', onPress: () => console.log('Rejected') },
      ]
    );
  };

  const handleConfirmPassword = async (password: string): Promise<void> => {
    try {
      setLoading(true);
      // In a real app, you would validate the password and approve the withdrawal
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordModal(false);
      Alert.alert('Sucesso', 'Saque aprovado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aprovar o saque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Detalhes do Saque
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge">Saque #{withdrawal.id}</Text>
              <Badge 
                style={{ backgroundColor: getStatusColor(withdrawal.status) }}
              >
                {getStatusText(withdrawal.status)}
              </Badge>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Valor:</Text>
              <Text variant="bodyLarge" style={styles.value}>{withdrawal.amount}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Data:</Text>
              <Text variant="bodyMedium">{withdrawal.date}</Text>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>Dados Bancários</Text>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Banco:</Text>
              <Text variant="bodyMedium">{withdrawal.account.bank}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Agência:</Text>
              <Text variant="bodyMedium">{withdrawal.account.agency}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Conta:</Text>
              <Text variant="bodyMedium">{withdrawal.account.account}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Titular:</Text>
              <Text variant="bodyMedium">{withdrawal.account.holder}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Tipo:</Text>
              <Text variant="bodyMedium">{withdrawal.account.type}</Text>
            </View>
          </Card.Content>
        </Card>

        {withdrawal.status === 'pending' && (
          <View style={styles.actions}>
            <AppButton 
              mode="contained" 
              onPress={handleApprove}
              style={[styles.button, styles.approveButton]}
              loading={loading}
              disabled={loading}
            >
              Aprovar
            </AppButton>
            <AppButton 
              mode="outlined" 
              onPress={handleReject}
              style={styles.button}
              disabled={loading}
            >
              Rejeitar
            </AppButton>
          </View>
        )}

        <AppButton 
          onPress={() => router.back()}
          disabled={loading}
        >
          Voltar
        </AppButton>
      </View>

      <FinancialPasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleConfirmPassword}
        title="Confirmar Aprovação"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
}); 