// app/(drawer)/transaction/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { useTransactionStore } from '../../../src/store/transactionStore';

const TransactionDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedTransaction, loading, error, fetchTransactionById } = useTransactionStore();

  useEffect(() => {
    if (id) {
      fetchTransactionById(id);
    }
  }, [id, fetchTransactionById]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'refused': return 'red';
      case 'chargedback': return 'orange';
      default: return 'gray';
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!selectedTransaction) {
    return <Text style={styles.errorText}>Transação não encontrada.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detalhes da Transação</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{selectedTransaction.id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Empresa ID:</Text>
        <Text style={styles.value}>{selectedTransaction.company_id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Valor:</Text>
        <Text style={styles.value}>R$ {selectedTransaction.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Método de Pagamento:</Text>
        <Text style={styles.value}>{selectedTransaction.payment_method}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Badge style={{ backgroundColor: getStatusColor(selectedTransaction.status) }}>
          {selectedTransaction.status}
        </Badge>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Criada em:</Text>
        <Text style={styles.value}>{new Date(selectedTransaction.created_at).toLocaleString()}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Atualizada em:</Text>
        <Text style={styles.value}>{new Date(selectedTransaction.updated_at).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16
  },
});

export default TransactionDetailsScreen; 