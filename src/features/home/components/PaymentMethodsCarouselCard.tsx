// src/features/home/components/PaymentMethodsCarouselCard.tsx
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LegendItem = ({ color, label, value, change }: { color: string; label: string; value: string; change: string }) => {
    const isPositive = change.startsWith('+');
    return (
        <View style={styles.legendItemContainer}>
            <View style={styles.legendTextContainer}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendLabel}>{label}</Text>
            </View>
            <View style={styles.legendValueContainer}>
                <Text style={styles.legendValue}>{value}</Text>
                <View style={styles.changeContainer}>
                    {isPositive 
                        ? <ArrowUp size={14} color="#2E7D32" /> 
                        : <ArrowDown size={14} color="#D81B60" />}
                    <Text style={[styles.changeText, { color: isPositive ? '#2E7D32' : '#D81B60' }]}>
                        {change.substring(1)}
                    </Text>
                </View>
            </View>
        </View>
    )
};

const PaymentMethodsCarouselCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Formas de pagamento</Text>
            <Text style={styles.totalValue}>R$ 233.179,07</Text>
            
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressSegment, { width: '70.8%', backgroundColor: '#1313F2' }]} />
                <View style={[styles.progressSegment, { width: '19.4%', backgroundColor: '#A020F0' }]} />
                <View style={[styles.progressSegment, { width: '9.8%', backgroundColor: '#2E7D32' }]} />
            </View>

            <View style={styles.legendContainer}>
                <LegendItem color="#1313F2" label="Pix" value="70,8%" change="+14%" />
                <LegendItem color="#A020F0" label="Cartão" value="19,4%" change="-10%" />
                <LegendItem color="#2E7D32" label="Boleto" value="9,8%" change="-2%" />
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
    legendValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '600',
    }
});

export default PaymentMethodsCarouselCard;
