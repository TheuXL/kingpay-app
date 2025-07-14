import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, FAB, Modal, SegmentedButtons, Text } from 'react-native-paper';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ScreenLayout } from '../../src/components/layout/ScreenLayout';
import { WithdrawalDetails, WithdrawalForm, WithdrawalListItem } from '../../src/components/withdrawals';
import { useWithdrawalStore } from '../../src/store';
import { usePixKeyStore } from '../../src/store/pixKeyStore';
import { Withdrawal, WithdrawalStatus } from '../../src/types';

export default function WithdrawalsScreen() {
  const {
    withdrawals,
    selectedWithdrawal,
    isLoading,
    filters,
    totalCount,
    setFilters,
    fetchWithdrawals,
    selectWithdrawal,
    clearSelectedWithdrawal,
  } = useWithdrawalStore();

  const { pixKeys, fetchPixKeys, isLoading: isLoadingPixKeys } = usePixKeyStore();

  const [showNewWithdrawalForm, setShowNewWithdrawalForm] = useState(false);
  const [showWithdrawalDetails, setShowWithdrawalDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchWithdrawals();
    fetchPixKeys();
  }, []);

  // Filtrar por status
  const handleStatusChange = (status: string | null) => {
    setFilters({ 
      ...filters, 
      status: status as WithdrawalStatus | undefined,
      offset: 0 // Resetar a paginação ao mudar o filtro
    });
    fetchWithdrawals();
  };

  // Carregar mais itens (paginação)
  const handleLoadMore = () => {
    if (isLoading || withdrawals.length >= totalCount) return;
    
    setFilters({
      ...filters,
      offset: (filters.offset || 0) + (filters.limit || 10),
    });
    fetchWithdrawals();
  };

  // Selecionar um saque para ver detalhes
  const handleSelectWithdrawal = (withdrawal: Withdrawal) => {
    selectWithdrawal(withdrawal);
    setShowWithdrawalDetails(true);
  };

  // Fechar o modal de detalhes
  const handleCloseDetails = () => {
    setShowWithdrawalDetails(false);
    clearSelectedWithdrawal();
  };

  // Atualizar a lista após mudança de status
  const handleStatusChangeSuccess = () => {
    setShowWithdrawalDetails(false);
    clearSelectedWithdrawal();
    fetchWithdrawals();
  };

  // Renderizar item da lista
  const renderItem = ({ item }: { item: Withdrawal }) => (
    <WithdrawalListItem
      withdrawal={item}
      onPress={handleSelectWithdrawal}
    />
  );

  // Renderizar o rodapé da lista (loader para paginação)
  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Saques
      </Text>

      <View style={styles.filters}>
        <SegmentedButtons
          value={filters.status || 'all'}
          onValueChange={(value) => handleStatusChange(value === 'all' ? null : value)}
          buttons={[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendentes' },
            { value: 'approved', label: 'Aprovados' },
            { value: 'done', label: 'Concluídos' },
            { value: 'cancel', label: 'Cancelados' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {isLoading && withdrawals.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : withdrawals.length === 0 ? (
        <EmptyState
          icon="cash-remove"
          title="Nenhum saque encontrado"
          description="Não há saques com os filtros selecionados."
          action={
            <Button mode="contained" onPress={() => setShowNewWithdrawalForm(true)}>
              Solicitar Saque
            </Button>
          }
        />
      ) : (
        <FlatList
          data={withdrawals}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowNewWithdrawalForm(true)}
      />

      {/* Modal para novo saque */}
      <Modal
        visible={showNewWithdrawalForm}
        onDismiss={() => setShowNewWithdrawalForm(false)}
        contentContainerStyle={styles.modalContent}
      >
        <WithdrawalForm
          pixKeys={pixKeys}
          onSuccess={() => {
            setShowNewWithdrawalForm(false);
            fetchWithdrawals();
          }}
        />
      </Modal>

      {/* Modal para detalhes do saque */}
      <Modal
        visible={showWithdrawalDetails && !!selectedWithdrawal}
        onDismiss={handleCloseDetails}
        contentContainerStyle={styles.modalContent}
      >
        {selectedWithdrawal && (
          <WithdrawalDetails
            withdrawal={selectedWithdrawal}
            onClose={handleCloseDetails}
            onStatusChange={handleStatusChangeSuccess}
          />
        )}
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  filters: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80, // Espaço para o FAB
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
  },
}); 