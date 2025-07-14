// app/(drawer)/transactions.tsx
import { useAuth } from '@/contexts/AuthContext';
import { AppUser } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import TransactionListItem from '../../src/components/transactions/TransactionListItem';
import { useTransactionStore } from '../../src/store/transactionStore';
import { TransactionFilters } from '../../src/types/transactions';
// import { Datepicker } from '@ui-kitten/components'; // Assuming you have a date picker

const TransactionsScreen = () => {
  const { user } = useAuth(); // Assuming companyId is on the user object
  const {
    transactions,
    summary,
    loading,
    error,
    fetchTransactions,
    fetchTransactionSummary,
  } = useTransactionStore();

  const [filters, setFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    fetchTransactions(filters);
    if (user) {
      const appUser = user as AppUser;
      if (appUser.company_id) {
        fetchTransactionSummary(appUser.company_id);
      }
    }
  }, [filters, fetchTransactions, fetchTransactionSummary, user]);

  const Summary = () => (
    <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        {loading && !summary ? <ActivityIndicator /> : (
            <>
                <Text>Total: {summary?.total_transactions}</Text>
                <Text>Volume: R$ {summary?.total_volume.toFixed(2)}</Text>
                <Text>Pagos: {summary?.paid}</Text>
                <Text>Recusados: {summary?.refused}</Text>
                <Text>Estornados: {summary?.refunds}</Text>
                <Text>Chargebacks: {summary?.chargebacks}</Text>
            </>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* TODO: Add filter components (Date pickers, status selectors, etc) */}
      <Button title="Aplicar Filtros" onPress={() => fetchTransactions(filters)} />
      
      <Summary />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionListItem transaction={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
  summaryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  }
});

export default TransactionsScreen; 