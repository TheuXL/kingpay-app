import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useBillingStore } from '../../store/billingStore';
import { Billing } from '../../types/billing';
import { formatCurrency } from '../../utils/formatters';

interface BillingListItemProps {
  billing: Billing;
}

const BillingListItem: React.FC<BillingListItemProps> = ({ billing }) => {
  const { payBilling, loading } = useBillingStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = () => {
    switch (billing.status) {
      case 'paid':
        return '#4cd964'; // green
      case 'overdue':
        return '#ff3b30'; // red
      case 'pending':
      default:
        return '#ffcc00'; // yellow
    }
  };

  const getStatusText = () => {
    switch (billing.status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Vencido';
      case 'pending':
      default:
        return 'Pendente';
    }
  };

  const handlePayBilling = () => {
    Alert.alert(
      'Confirmar Pagamento',
      `Deseja confirmar o pagamento da fatura de ${formatCurrency(billing.amount)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const success = await payBilling(billing.id);
            if (success) {
              Alert.alert('Sucesso', 'Fatura paga com sucesso!');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{billing.description}</Text>
        <Text style={styles.amount}>{formatCurrency(billing.amount)}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.date}>Vencimento: {formatDate(billing.due_date)}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
      </View>
      
      {billing.status === 'pending' && (
        <View style={styles.actionContainer}>
          <Button
            title="Pagar"
            onPress={handlePayBilling}
            disabled={loading}
            color="#007AFF"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    marginLeft: 16,
  },
});

export default BillingListItem; 