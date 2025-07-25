import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { FlatList, FlatListProps, StyleSheet, Text, View } from 'react-native';
import { WalletTransaction } from '../hooks/useWalletData';
import TransactionItem from './TransactionItem';

// Estende as props do FlatList para permitir passagem de props de paginação
interface TransactionListProps extends Partial<FlatListProps<any>> {
  transactions: WalletTransaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, ...flatListProps }) => {

  const formattedTransactions = transactions.map(t => ({
    id: t.id,
    type: t.entrada ? 'Entrada' as const : 'Saída' as const,
    title: t.tipo,
    subtitle: t.descricao || 'Detalhes da transação',
    date: format(new Date(t.created_at), "dd 'de' MMM", { locale: ptBR }),
    value: `${t.entrada ? '+' : ''} ${formatCurrency(t.valor)}`
  }));

  if (transactions.length === 0 && !flatListProps.refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma movimentação recente.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={formattedTransactions}
        renderItem={({ item }) => <TransactionItem {...item} />}
        keyExtractor={(item) => item.id}
        {...flatListProps} // Passa todas as outras props (footer, refresh, etc)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#A1A1AA',
  }
});

export default TransactionList; 