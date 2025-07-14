import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, Paragraph, Portal, Text, TextInput } from 'react-native-paper';
import { usePermissions } from '../../hooks/usePermissions';
import { useWithdrawalStore } from '../../store';
import { Withdrawal } from '../../types';
import { WithdrawalStatusBadge } from './WithdrawalStatusBadge';

interface WithdrawalDetailsProps {
  withdrawal: Withdrawal;
  onClose: () => void;
  onStatusChange: () => void;
}

export const WithdrawalDetails: React.FC<WithdrawalDetailsProps> = ({
  withdrawal,
  onClose,
  onStatusChange,
}) => {
  const { approveSelectedWithdrawal, denySelectedWithdrawal, markSelectedWithdrawalAsPaidManually, isUpdating } = useWithdrawalStore();
  const { hasPermission } = usePermissions();
  
  const [showDenyDialog, setShowDenyDialog] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleApprove = async () => {
    Alert.alert(
      'Confirmar Aprovação',
      'Tem certeza que deseja aprovar este saque?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          style: 'default',
          onPress: async () => {
            const success = await approveSelectedWithdrawal();
            if (success) {
              Alert.alert('Sucesso', 'Saque aprovado com sucesso');
              onStatusChange();
            }
          },
        },
      ]
    );
  };
  
  const handleDeny = async () => {
    if (!denyReason.trim()) {
      Alert.alert('Erro', 'Informe um motivo para negar o saque');
      return;
    }
    
    const success = await denySelectedWithdrawal(denyReason);
    if (success) {
      setShowDenyDialog(false);
      Alert.alert('Sucesso', 'Saque negado com sucesso');
      onStatusChange();
    }
  };
  
  const handleMarkAsPaid = async () => {
    Alert.alert(
      'Confirmar Pagamento Manual',
      'Tem certeza que deseja marcar este saque como pago manualmente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: async () => {
            const success = await markSelectedWithdrawalAsPaidManually();
            if (success) {
              Alert.alert('Sucesso', 'Saque marcado como pago manualmente');
              onStatusChange();
            }
          },
        },
      ]
    );
  };
  
  const canApprove = hasPermission('approve_withdrawals') && withdrawal.status === 'pending';
  const canDeny = hasPermission('deny_withdrawals') && ['pending', 'approved'].includes(withdrawal.status);
  const canMarkAsPaid = hasPermission('mark_withdrawal_paid') && withdrawal.status === 'approved';

  return (
    <>
      <Card style={styles.card}>
        <Card.Title title="Detalhes do Saque" />
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.id}>ID: {withdrawal.id}</Text>
            <WithdrawalStatusBadge status={withdrawal.status} />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valores</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Valor Solicitado:</Text>
              <Text style={styles.value}>{formatCurrency(withdrawal.requested_amount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Taxa:</Text>
              <Text style={styles.value}>{formatCurrency(withdrawal.fee_amount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Valor Final:</Text>
              <Text style={styles.valueHighlight}>{formatCurrency(withdrawal.amount)}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Data de Solicitação:</Text>
              <Text style={styles.value}>{formatDate(withdrawal.created_at)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Última Atualização:</Text>
              <Text style={styles.value}>{formatDate(withdrawal.updated_at)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tipo:</Text>
              <Text style={styles.value}>{withdrawal.is_pix ? 'PIX' : 'Outro'}</Text>
            </View>
          </View>
          
          {withdrawal.pix_key && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chave PIX</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{withdrawal.pix_key.key_type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Chave:</Text>
                <Text style={styles.value}>{withdrawal.pix_key.key}</Text>
              </View>
            </View>
          )}
          
          {withdrawal.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{withdrawal.description}</Text>
            </View>
          )}
          
          {withdrawal.reason_for_denial && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Motivo da Negação</Text>
              <Text style={styles.description}>{withdrawal.reason_for_denial}</Text>
            </View>
          )}
          
          <View style={styles.actions}>
            {canApprove && (
              <Button
                mode="contained"
                onPress={handleApprove}
                loading={isUpdating}
                disabled={isUpdating}
                style={[styles.button, styles.approveButton]}
              >
                Aprovar
              </Button>
            )}
            
            {canDeny && (
              <Button
                mode="outlined"
                onPress={() => setShowDenyDialog(true)}
                loading={isUpdating}
                disabled={isUpdating}
                style={[styles.button, styles.denyButton]}
                textColor="#F44336"
              >
                Negar
              </Button>
            )}
            
            {canMarkAsPaid && (
              <Button
                mode="contained"
                onPress={handleMarkAsPaid}
                loading={isUpdating}
                disabled={isUpdating}
                style={[styles.button, styles.paidButton]}
              >
                Marcar como Pago
              </Button>
            )}
          </View>
          
          <Button
            mode="text"
            onPress={onClose}
            disabled={isUpdating}
            style={styles.closeButton}
          >
            Fechar
          </Button>
        </Card.Content>
      </Card>
      
      <Portal>
        <Dialog visible={showDenyDialog} onDismiss={() => setShowDenyDialog(false)}>
          <Dialog.Title>Negar Saque</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Informe o motivo para negar este saque:</Paragraph>
            <TextInput
              value={denyReason}
              onChangeText={setDenyReason}
              placeholder="Motivo da negação"
              multiline
              numberOfLines={3}
              style={styles.denyInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDenyDialog(false)}>Cancelar</Button>
            <Button onPress={handleDeny} loading={isUpdating} disabled={isUpdating || !denyReason.trim()}>
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  id: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  valueHighlight: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  denyButton: {
    borderColor: '#F44336',
  },
  paidButton: {
    backgroundColor: '#2196F3',
  },
  closeButton: {
    marginTop: 8,
  },
  denyInput: {
    marginTop: 8,
  },
}); 