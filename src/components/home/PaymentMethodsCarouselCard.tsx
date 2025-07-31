import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PaymentMethodsCarouselCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Formas de Pagamento</Text>
        <Text style={styles.amount}>R$ 138.241,45</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.barSegment, { width: '60%', backgroundColor: '#1313F2' }]} />
        <View style={[styles.barSegment, { width: '30%', backgroundColor: '#8A38F5', left: '60%' }]} />
        <View style={[styles.barSegment, { width: '10%', backgroundColor: '#34C759', left: '90%' }]} />
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#1313F2' }]} />
          <Text style={styles.legendText}>Pix</Text>
        </View>
        <View style={styles.valueContainer}>
            <Text style={styles.legendAmount}>R$ 82.944</Text>
            <View style={[styles.trendContainer, {backgroundColor: 'rgba(20, 132, 48, 0.1)'}]}>
                <TrendingUp color="#148430" size={16} />
                <Text style={[styles.trendText, {color: '#148430'}]}>34%</Text>
            </View>
        </View>
      </View>
       <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#8A38F5' }]} />
          <Text style={styles.legendText}>Cartão</Text>
        </View>
        <View style={styles.valueContainer}>
            <Text style={styles.legendAmount}>R$ 41.472</Text>
            <View style={[styles.trendContainer, {backgroundColor: 'rgba(226, 74, 63, 0.1)'}]}>
                <TrendingDown color="#E24A3F" size={16} />
                <Text style={[styles.trendText, {color: '#E24A3F'}]}>12%</Text>
            </View>
        </View>
      </View>
       <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
          <Text style={styles.legendText}>Boleto</Text>
        </View>
         <View style={styles.valueContainer}>
            <Text style={styles.legendAmount}>R$ 13.824</Text>
             <View style={[styles.trendContainer, {backgroundColor: 'rgba(226, 74, 63, 0.1)'}]}>
                <TrendingDown color="#E24A3F" size={16} />
                <Text style={[styles.trendText, {color: '#E24A3F'}]}>8%</Text>
            </View>
        </View>
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
     marginRight: 12,
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
  },
  barSegment: {
    height: '100%',
    position: 'absolute',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
  valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  legendAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00051B',
    marginRight: 10,
  },
  trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 79
  },
  trendText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 5,
  }
});

export default PaymentMethodsCarouselCard;
