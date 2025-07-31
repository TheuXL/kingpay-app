import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RefundsCarouselCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Reembolsos</Text>
        <Text style={styles.amount}>R$ 4.218,00</Text>
      </View>
      <View style={styles.progressBar}>
        {/* As barras são posicionadas absolutamente dentro deste container */}
        <View style={[styles.barSegment, { width: '30%', backgroundColor: '#F26813' }]} />
        <View style={[styles.barSegment, { width: '30%', backgroundColor: '#8A38F5', left: '30%' }]} />
        <View style={[styles.barSegment, { width: '40%', backgroundColor: '#34C759', left: '60%' }]} />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#F26813' }]} />
          <Text style={styles.legendText}>Estornos</Text>
        </View>
        <Text style={styles.legendAmount}>R$ 1.274,00</Text>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#8A38F5' }]} />
          <Text style={styles.legendText}>Cashback</Text>
        </View>
        <Text style={styles.legendAmount}>R$ 1.980,00</Text>
      </View>
       <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
          <Text style={styles.legendText}>Taxa de Estorno</Text>
        </View>
        <Text style={styles.legendAmount}>R$ 964,95</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 346,
    height: 301,
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    marginRight: 12, // Espaço entre os cards do carrossel
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B5B5B',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00051B',
    marginTop: 4,
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 219,
    overflow: 'hidden',
    backgroundColor: '#ECECEC' // Fundo caso as barras não preencham tudo
  },
  barSegment: {
    height: '100%',
    position: 'absolute',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B5B5B',
  },
  legendAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00051B',
  },
});

export default RefundsCarouselCard;
