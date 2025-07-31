import React, { useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import ApprovalRateCard from './ApprovalRateCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import RefundsCard from './RefundsCard';
import TotalSalesCard from './TotalSalesCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.88, 350);
const SPACING = 16;

interface DashboardCarouselProps {
  data: any; // O objeto `additionalInfo` vindo do hook
}

const DashboardCarousel: React.FC<DashboardCarouselProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) {
    return null;
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
    { type: 'payment', data: paymentMethodsData },
    { type: 'refunds', data: refundsData },
    { type: 'approval', data: approvalRateData },
    { type: 'sales', data: totalSalesData },
  ];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + SPACING));
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
        snapToInterval={CARD_WIDTH + SPACING}
        contentContainerStyle={styles.carousel}
        style={{ flexGrow: 0 }}
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
    alignItems: 'center',
    width: '100%',
  },
  carousel: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#1313F2',
  },
});

export default DashboardCarousel; 