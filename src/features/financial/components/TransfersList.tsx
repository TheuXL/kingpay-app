import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TransferItem from './TransferItem';

// Dados de exemplo apenas para design
const EXAMPLE_DATA = [
  { id: '1', title: 'Transferência enviada', subtitle: 'Soultech Tecnologia de pagame...', date: 'Hoje', value: 'R$ 245,45' },
  { id: '2', title: 'Transferência enviada', subtitle: 'Soultech Tecnologia de pagame...', date: 'Hoje', value: 'R$ 245,45' },
  { id: '3', title: 'Transferência enviada', subtitle: 'Soultech Tecnologia de pagame...', date: 'Hoje', value: 'R$ 245,45' },
];

const TransfersList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={EXAMPLE_DATA}
        renderItem={({ item }) => <TransferItem {...item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
});

export default TransfersList; 