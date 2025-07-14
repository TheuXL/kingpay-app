import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BillingListItem from '@/components/billings/BillingListItem';
import { useBillingStore } from '@/store/billingStore';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type FilterStatus = 'all' | 'pending' | 'paid' | 'overdue' | 'canceled';

const BillingsScreen = () => {
  const { billings, loading, error, fetchBillings } = useBillingStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const loadBillings = useCallback(() => {
    fetchBillings();
  }, [fetchBillings]);

  useFocusEffect(
    useCallback(() => {
      loadBillings();
    }, [loadBillings])
  );

  const filteredBillings = billings.filter((billing) => {
    if (filterStatus === 'all') return true;
    return billing.status === filterStatus;
  });

  const renderFilterButton = (status: FilterStatus, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Faturas</ThemedText>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Todas')}
        {renderFilterButton('pending', 'Pendentes')}
        {renderFilterButton('paid', 'Pagas')}
        {renderFilterButton('overdue', 'Vencidas')}
      </View>

      {error && (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity onPress={loadBillings}>
            <ThemedText style={{ color: '#007AFF' }}>Tentar novamente</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!error && (
        <FlatList
          data={filteredBillings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BillingListItem billing={item} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centered}>
                <ThemedText>
                  {filterStatus === 'all'
                    ? 'Nenhuma fatura encontrada.'
                    : `Nenhuma fatura ${
                        filterStatus === 'pending'
                          ? 'pendente'
                          : filterStatus === 'paid'
                          ? 'paga'
                          : 'vencida'
                      } encontrada.`}
                </ThemedText>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBillings} />}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#555',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default BillingsScreen; 