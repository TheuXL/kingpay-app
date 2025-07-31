// src/features/home/components/RefundsCarouselCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LegendItem = ({ color, label, value }: { color: string; label: string; value: string }) => (
    <View style={styles.legendItemContainer}>
        <View style={styles.legendTextContainer}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
        <Text style={styles.legendValue}>{value}</Text>
    </View>
);

const RefundsCarouselCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Reembolsos</Text>
            <Text style={styles.totalValue}>R$ 12.547,16</Text>
            
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressSegment, { width: '45%', backgroundColor: '#FF8F00' }]} />
                <View style={[styles.progressSegment, { width: '25%', backgroundColor: '#A020F0' }]} />
                <View style={[styles.progressSegment, { width: '30%', backgroundColor: '#2E7D32' }]} />
            </View>

            <View style={styles.legendContainer}>
                <LegendItem color="#FF8F00" label="Estornos" value="R$ 9.724,23" />
                <LegendItem color="#A020F0" label="Cashback" value="R$ 2.822,93" />
                <LegendItem color="#2E7D32" label="Taxa de estorno" value="12,8%" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    progressBarContainer: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
        marginBottom: 20,
    },
    progressSegment: {
        height: '100%',
    },
    legendContainer: {
        gap: 12,
    },
    legendItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 14,
        color: '#333333',
    },
    legendValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
});

export default RefundsCarouselCard;
