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
    refunds: data.refunds,
    chargebacks: data.chargebacks,
    // ... outros dados de estorno se houver
  };

  const paymentMethodsData = data.paymentMethods;
  const totalSalesData = data.totalSales;
  const approvalRateData = data.approvalRates;

  const cards = [
    <RefundsCard key="refunds" data={refundsData} />,
    <PaymentMethodsCard key="payment" data={paymentMethodsData} />,
    <TotalSalesCard key="sales" data={totalSalesData} />,
    <ApprovalRateCard key="approval" data={approvalRateData} />,
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
        {cards.map((card, index) => (
          <View key={index} style={styles.cardContainer}>
            {card}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {cards.map((_, index) => (
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