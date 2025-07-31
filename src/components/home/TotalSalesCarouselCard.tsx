import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TotalSalesCarouselCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Total de Vendas</Text>
                <Text style={styles.amount}>R$ 138.241,45</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailTitle}>Número de vendas</Text>
                    <View style={styles.valueContainer}>
                        <Text style={styles.detailValue}>3.421</Text>
                        <View style={[styles.trendContainer, { backgroundColor: 'rgba(20, 132, 48, 0.1)' }]}>
                            <TrendingUp color="#148430" size={16} />
                            <Text style={[styles.trendText, { color: '#148430' }]}>15%</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailTitle}>Ticket Médio</Text>
                    <View style={styles.valueContainer}>
                        <Text style={styles.detailValue}>R$ 40,41</Text>
                        <View style={[styles.trendContainer, { backgroundColor: 'rgba(226, 74, 63, 0.1)' }]}>
                            <TrendingDown color="#E24A3F" size={16} />
                            <Text style={[styles.trendText, { color: '#E24A3F' }]}>2%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 346,
        height: 301,
        backgroundColor: '#F9FAFC',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center', // Centraliza o conteúdo, pois há mais espaço
        marginRight: 12,
    },
    header: {
        marginBottom: 40, // Mais espaço
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B5B5B',
    },
    amount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#00051B',
        marginTop: 4,
    },
    detailsContainer: {
        // O container para os detalhes
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, // Espaço entre as linhas de detalhe
    },
    detailTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B5B5B',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00051B',
        marginRight: 10,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 79
    },
    trendText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 5,
    }
});

export default TotalSalesCarouselCard;
