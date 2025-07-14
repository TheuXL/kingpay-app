// src/components/transactions/TransactionListItem.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { Transaction } from '../../types/transactions';

interface TransactionListItemProps {
  transaction: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(drawer)/transactions/[id]" as any,
      params: { id: transaction.id }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'refused': return 'red';
      case 'chargedback': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.info}>
        <Text style={styles.id}>{transaction.id}</Text>
        <Text style={styles.amount}>R$ {transaction.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.details}>
        <Text>{transaction.payment_method}</Text>
        <Badge style={{ backgroundColor: getStatusColor(transaction.status) }}>
          {transaction.status}
        </Badge>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TransactionListItem; 