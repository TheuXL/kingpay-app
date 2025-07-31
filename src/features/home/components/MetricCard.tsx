// src/features/home/components/MetricCard.tsx
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
}

const MetricCard = ({ icon, title, value, change }: MetricCardProps) => {
    const isPositive = !change.startsWith('-');

    return (
        <View style={styles.card}>
            <View style={styles.titleContainer}>
                {icon}
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.value}>{value}</Text>
            <View style={styles.changeContainer}>
                {isPositive 
                    ? <ArrowUp size={16} color="#2E7D32" /> 
                    : <ArrowDown size={16} color="#D81B60" />}
                <Text style={[styles.changeText, { color: isPositive ? '#2E7D32' : '#D81B60' }]}>
                    {change}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default MetricCard;
