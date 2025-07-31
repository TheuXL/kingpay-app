// src/features/home/components/TotalSalesCarouselCard.tsx
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MetricItem = ({ label, value, change }: { label: string; value: string; change: string }) => {
    const isPositive = change.startsWith('+');
    return (
        <View style={styles.metricItemContainer}>
            <Text style={styles.metricLabel}>{label}</Text>
            <View style={styles.metricValueContainer}>
                <Text style={styles.metricValue}>{value}</Text>
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
    );
};

const TotalSalesCarouselCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Total de Vendas</Text>
            <Text style={styles.totalValue}>R$ 233.179,07</Text>

            <View style={styles.metricsContainer}>
                <MetricItem label="Número de vendas" value="1.456" change="+14%" />
                <MetricItem label="Ticket Médio" value="R$ 45,96" change="+4%" />
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
        justifyContent: 'center', // Centraliza o conteúdo verticalmente
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
        marginBottom: 24,
    },
    metricsContainer: {
        gap: 16,
    },
    metricItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        color: '#333333',
    },
    metricValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metricValue: {
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

export default TotalSalesCarouselCard;
