// src/features/home/components/CarouselContainer.tsx
import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

interface CarouselContainerProps {
    children: React.ReactNode;
}

const CarouselContainer = ({ children }: CarouselContainerProps) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / 300); // 300 é a largura do card
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                decelerationRate="fast"
                snapToInterval={316} // Largura do card + margem
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollViewContent}
            >
                {children}
            </ScrollView>
            <View style={styles.paginationContainer}>
                {React.Children.map(children, (_, index) => (
                    <View 
                        key={index}
                        style={[
                            styles.paginationDot,
                            activeIndex === index ? styles.paginationDotActive : {}
                        ]} 
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
    scrollViewContent: {
        paddingLeft: 4, // Pequeno ajuste para a sombra do primeiro card
        paddingBottom: 24, // Espaço para a sombra e paginação
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D9D9D9',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#1313F2',
    },
});

export default CarouselContainer;
