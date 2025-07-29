import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LegendItemProps {
    color: string;
    text: string;
    value: string;
}

const LegendItem = ({ color, text, value }: LegendItemProps) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.legendText}>{text}</Text>
        <Text style={styles.legendValue}>{value}</Text>
    </View>
);

interface ProgressBarProps {
    data: { color: string, percentage: number }[];
}

const ProgressBar = ({ data }: ProgressBarProps) => (
    <View style={styles.progressBarContainer}>
        {data.map((item, index) => (
            <View key={index} style={{ width: `${item.percentage}%`, backgroundColor: item.color, height: 8 }} />
        ))}
    </View>
);

const RefundsCard = () => {
    const MOCK_DATA = {
        total: 'R$ 850,00',
        items: [
            { text: 'Estornos', value: 'R$ 500,00', color: '#FF9900', percentage: 59 },
            { text: 'Cashback', value: 'R$ 250,00', color: '#7B61FF', percentage: 29 },
            { text: 'Taxa de Estorno', value: 'R$ 100,00', color: '#FF5A5F', percentage: 12 },
        ]
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Reembolsos no período</Text>
                
                <ProgressBar data={MOCK_DATA.items.map(i => ({ color: i.color, percentage: i.percentage }))} />

                <View style={styles.legendContainer}>
                    {MOCK_DATA.items.map(item => (
                        <LegendItem key={item.text} color={item.color} text={item.text} value={item.value} />
                    ))}
                </View>
            </View>
            {/* A paginação (dots) pode ser adicionada aqui se houver múltiplos cards */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 24,
    },
    progressBarContainer: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#F0F2F5',
        marginBottom: 24,
    },
    legendContainer: {
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#6B6B6B',
        flex: 1,
    },
    legendValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
    }
});

export default RefundsCard;
