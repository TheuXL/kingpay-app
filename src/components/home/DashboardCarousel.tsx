import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Text } from 'react-native';
import RefundsCard from './RefundsCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import TotalSalesCard from './TotalSalesCard';
import ApprovalRateCard from './ApprovalRateCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const SPACING = (width - CARD_WIDTH) / 2;

const DashboardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    <RefundsCard key="refunds" />,
    <PaymentMethodsCard key="payment" />,
    <TotalSalesCard key="sales" />,
    <ApprovalRateCard key="approval" />,
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