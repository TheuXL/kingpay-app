import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import RefundCard from './RefundCard';
import ApprovalRateCard from './ApprovalRateCard';
import TotalSalesCard from './TotalSalesCard';
import PaymentMethodCard from './PaymentMethodCard';

interface DashboardData {
  refunds: {
    totalRefunds: number;
    estornos: number;
    cashback: number;
    estornoRate: number;
  };
  approvalRate: {
    overallRate: number;
    pix: number;
    card: number;
    boleto: number;
  };
  totalSales: {
    totalSales: number;
    salesCount: {
      value: number;
      variation: number;
      isPositive: boolean;
    };
    averageTicket: {
      value: number;
      variation: number;
      isPositive: boolean;
    };
  };
  paymentMethods: {
    totalValue: number;
    pix: {
      percentage: number;
      variation: number;
      isPositive: boolean;
    };
    card: {
      percentage: number;
      variation: number;
      isPositive: boolean;
    };
    boleto: {
      percentage: number;
      variation: number;
      isPositive: boolean;
    };
  };
}

interface DashboardCarouselProps {
  data: DashboardData;
  onPeriodChange?: (cardIndex: number, days: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (spacing.md * 2);

const DashboardCarousel: React.FC<DashboardCarouselProps> = ({
  data,
  onPeriodChange
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / cardWidth);
    setActiveIndex(index);
  };

  const handlePeriodChange = (cardIndex: number) => (days: number) => {
    onPeriodChange?.(cardIndex, days);
  };

  const cards = [
    <RefundCard 
      key="refunds"
      data={data.refunds}
      onPeriodChange={handlePeriodChange(0)}
    />,
    <ApprovalRateCard 
      key="approval"
      data={data.approvalRate}
      onPeriodChange={handlePeriodChange(1)}
    />,
    <TotalSalesCard 
      key="sales"
      data={data.totalSales}
      onPeriodChange={handlePeriodChange(2)}
    />,
    <PaymentMethodCard 
      key="payment-methods"
      data={data.paymentMethods}
      onPeriodChange={handlePeriodChange(3)}
    />,
  ];

  return (
    <View style={styles.container}>
      {/* Carrossel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        snapToAlignment="start"
      >
        {cards.map((card, index) => (
          <View key={index} style={[styles.cardContainer, { width: cardWidth }]}>
            {card}
          </View>
        ))}
      </ScrollView>

      {/* Indicadores de página */}
      <View style={styles.pagination}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex 
                  ? colors.primary 
                  : colors.border,
                width: index === activeIndex ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingRight: spacing.md,
  },
  cardContainer: {
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
});

export default DashboardCarousel;
