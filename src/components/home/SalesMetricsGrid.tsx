import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MetricCard from './MetricCard'; // Este será o card individual

const SalesMetricsGrid = () => {
    // Dados mocados para o exemplo
    const metrics = [
        { title: 'Reembolsos', amount: 'R$ 1.274', trend: 'up', percentage: '2.5%' },
        { title: 'Taxa de Chargeback', amount: 'R$ 964,95', trend: 'up', percentage: '1.8%' },
        { title: 'Boletos', amount: 'R$ 13.824', trend: 'down', percentage: '5.2%' },
        // Adicione mais métricas conforme necessário
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Métricas de Vendas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
                {metrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00051B',
        marginBottom: 16,
    },
    grid: {
        // A ScrollView horizontal cuidará do layout
    }
});

export default SalesMetricsGrid;
