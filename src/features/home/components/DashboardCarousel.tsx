import React, { useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import ApprovalRateCard from './ApprovalRateCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import RefundsCard from './RefundsCard';
import TotalSalesCard from './TotalSalesCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const SPACING = (width - CARD_WIDTH) / 2;

interface DashboardCarouselProps {
  data: any; // O objeto `additionalInfo` vindo do hook
}

const DashboardCarousel: React.FC<DashboardCarouselProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback para caso os dados não cheguem
  if (!data) {
    return null; // Ou um loader/skeleton
  }

  // Extrai os dados necessários para cada card
  const refundsData = {
    sumRefunded: data.sumRefunded || 0,
    sumChargeback: data.sumChargeback || 0,
    totalRefunds: (data.sumRefunded || 0) + (data.sumChargeback || 0),
  };

  const paymentMethodsData = data.paymentMethods;
  const totalSalesData = data.totalSales;
  const approvalRateData = data.approvalRates;

  const cardData = [
    { type: 'refunds', data: refundsData },
    { type: 'payment', data: paymentMethodsData },
    { type: 'sales', data: totalSalesData },
    { type: 'approval', data: approvalRateData },
  ];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CARD_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + (SPACING / 2)}
        contentOffset={{ x: -SPACING, y: 0 }}
        contentContainerStyle={styles.carousel}
      >
        {cardData.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            {item.type === 'refunds' && <RefundsCard data={item.data} />}
            {item.type === 'payment' && <PaymentMethodsCard data={item.data} />}
            {item.type === 'sales' && <TotalSalesCard data={item.data} />}
            {item.type === 'approval' && <ApprovalRateCard data={item.data} />}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {cardData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index ? styles.dotActive : {}]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  carousel: {
    paddingHorizontal: SPACING / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
});

export default DashboardCarousel; 