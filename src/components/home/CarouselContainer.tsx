import React, { useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CarouselContainer = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {children}
      </ScrollView>
      <View style={styles.pagination}>
        {React.Children.map(children, (_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index ? styles.activeDot : {}]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    marginTop: 40,
  },
  scrollView: {
    width: screenWidth,
    marginLeft: -20, // Compensa o padding do container principal da HomeScreen
  },
  scrollViewContent: {
    // Garante que o primeiro e último item fiquem centralizados
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7575B3',
    marginHorizontal: 2.5,
  },
  activeDot: {
    backgroundColor: '#041D6F',
  },
});

export default CarouselContainer;
