import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CarouselContainerProps {
  children: React.ReactNode[];
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 32; // Largura do card considerando margens laterais

const CarouselContainer: React.FC<CarouselContainerProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollPosition / cardWidth);
    setCurrentPage(page);
  };

  const scrollToPage = (page: number) => {
    scrollViewRef.current?.scrollTo({
      x: page * cardWidth,
      animated: true,
    });
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {children.map((child, index) => (
          <View key={index} style={styles.cardContainer}>
            {child}
          </View>
        ))}
      </ScrollView>

      {/* Paginação */}
      <View style={styles.pagination}>
        {children.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              currentPage === index && styles.activePaginationDot
            ]}
            onPress={() => scrollToPage(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollView: {
    marginHorizontal: -16, // Compensa a margem do container pai
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: cardWidth,
    marginRight: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  activePaginationDot: {
    backgroundColor: '#1A1AFF',
  },
});

export default CarouselContainer;
