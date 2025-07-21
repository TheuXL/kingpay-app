import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../../../utils/currency';
import { transactionService } from '../../transactions/services';

const PaymentMethodItem = ({ color, name, percentage, change, value }) => (
    <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.itemName}>{name}</Text>
        </View>
        <View style={styles.itemValues}>
            <Text style={styles.itemPercentage}>{percentage}</Text>
            <Text style={[styles.itemChange, { color: change.startsWith('+') ? '#12B76A' : '#F04438' }]}>{change}</Text>
        </View>
    </View>
);

const PaymentMethodsCard = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await transactionService.getTransactionSummary();
                setSummaryData(data);
            } catch (error) {
                console.error("Erro ao buscar resumo de transações:", error);
                setSummaryData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <View style={styles.card}><Text>Carregando...</Text></View>;
    }

    const totalPaid = summaryData?.paid?.total || 0;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Total Aprovado</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalPaid / 100)}</Text>
            </View>
            <View>
                <Text style={styles.unavailableText}>Dados detalhados por forma de pagamento estão indisponíveis no momento.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#667085'
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101828'
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    itemName: {
        fontSize: 14,
        color: '#667085',
    },
    itemValues: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101828',
        marginRight: 8,
    },
    itemChange: {
        fontSize: 12,
        fontWeight: '500',
    },
    unavailableText: {
        fontSize: 14,
        color: '#667085',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    }
});

export default PaymentMethodsCard; 