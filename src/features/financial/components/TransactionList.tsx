import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TransactionItem from './TransactionItem';

// Dados de exemplo apenas para design, serão removidos ao conectar com a API
const EXAMPLE_DATA = [
  { id: '1', type: 'Entrada' as const, title: 'Entrada', subtitle: 'Reserva Financeira', date: 'Hoje', value: '+ R$ 21.124,56' },
  { id: '2', type: 'Saída' as const, title: 'Saída', subtitle: 'Transação Gateway', date: 'Ontem', value: 'R$ 2.664,45' },
  { id: '3', type: 'Entrada' as const, title: 'Entrada', subtitle: 'Reserva Financeira', date: '11 de Jul', value: '+ R$ 1.164,37' },
  { id: '4', type: 'Transferência' as const, title: 'Transferência enviada', subtitle: 'Soultech Tecnologia...', date: 'Hoje', value: 'R$ 245,45' },
  { id: '5', type: 'Saída' as const, title: 'Saída', subtitle: 'Transação Gateway', date: '9 de Jul', value: 'R$ 560,27' },
];

const TransactionList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={EXAMPLE_DATA}
        renderItem={({ item }) => <TransactionItem {...item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false} // A rolagem principal é na tela
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
});

export default TransactionList; 