import { Barcode, TrendingDown, TrendingUp, Undo } from 'lucide-react-native'; // Ícones de exemplo
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MetricCard = ({ title, amount, trend, percentage }: { title: string, amount: string, trend: 'up' | 'down', percentage: string }) => {
    
    // Escolhe o ícone com base no título para o exemplo
    const getIcon = () => {
        if (title.includes('Reembolso')) return <Undo color="#5B5B5B" size={24} />;
        if (title.includes('Boleto')) return <Barcode color="#5B5B5B" size={24} />;
        // Adicionar mais lógicas de ícone aqui
        return <Undo color="#5B5B5B" size={24} />;
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                {getIcon()}
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.amount}>{amount}</Text>
            <View style={styles.trendContainer}>
                {trend === 'up' ? <TrendingUp color="#148430" size={20} /> : <TrendingDown color="#E24A3F" size={20} />}
                <Text style={[styles.percentage, { color: trend === 'up' ? '#148430' : '#E24A3F' }]}>{percentage}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 168,
        height: 117,
        backgroundColor: '#F9FAFC',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-between',
        marginRight: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B5B5B',
        marginLeft: 5,
    },
    amount: {
        fontSize: 20,
        fontWeight: '600',
        color: '#00051B',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
    },
});

export default MetricCard;
