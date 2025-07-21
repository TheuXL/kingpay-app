import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../../../utils/currency';
import { transactionService } from '../../transactions/services';

const ProgressBar = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <View style={styles.progressBarContainer}>
            {data.map((item, index) => {
                const width = total > 0 ? (item.value / total) * 100 : 0;
                return (
                    <View
                        key={index}
                        style={[styles.progressSegment, { width: `${width}%`, backgroundColor: item.color }]}
                    />
                );
            })}
        </View>
    );
};

const RefundsCard = () => {
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

    if (!summaryData) {
        return <View style={styles.card}><Text>Dados indisponíveis.</Text></View>;
    }
    
    const refundTotal = summaryData.refunded?.total || 0;
    const chargebackTotal = summaryData.chargeback?.total || 0;
    const total = refundTotal + chargebackTotal;

    const progressBarData = [
        { label: 'Estornos', value: refundTotal, color: '#FF8F00' },
        { label: 'Chargeback', value: chargebackTotal, color: '#A300D6' },
    ];

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Reembolsos</Text>
                <Text style={styles.totalValue}>{formatCurrency(total / 100)}</Text>
            </View>
            <ProgressBar data={progressBarData} />
            <View style={styles.legendContainer}>
                {progressBarData.map(item => (
                    <View style={styles.legendItem} key={item.label}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                        <Text style={styles.legendValue}>{formatCurrency(item.value / 100)}</Text>
                    </View>
                ))}
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
        shadowOffset: {
	        width: 0,
	        height: 1,
        },
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
    progressBarContainer: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#E4E7EC',
        marginBottom: 16,
    },
    progressSegment: {
        height: '100%',
    },
    legendContainer: {
        // ...
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendLabel: {
        flex: 1,
        fontSize: 14,
        color: '#667085'
    },
    legendValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101828'
    }
});

export default RefundsCard; 