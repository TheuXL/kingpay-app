import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../../../utils/currency';
import { transactionService } from '../../transactions/services/transactionService';

interface SalesMetricsCardProps {
  onNavigate: (screen: string) => void;
}

const MetricItem = ({ label, value, change, changeColor }) => (
    <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        <View style={styles.metricChangeContainer}>
            <Text style={[styles.metricChange, { color: changeColor }]}>{change}</Text>
        </View>
        <View style={styles.periodSelector}>
            <Text style={styles.periodText}>Últimos 30 dias</Text>
        </View>
    </View>
);

const SalesMetricsCard: React.FC<SalesMetricsCardProps> = ({ onNavigate }) => {
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
        return <View style={styles.container}><Text>Carregando métricas...</Text></View>;
    }

    if (!summaryData) {
        return <View style={styles.container}><Text>Métricas indisponíveis.</Text></View>;
    }

    const metrics = [
        { label: 'Chargeback', value: formatCurrency(summaryData.chargeback?.total / 100 || 0), change: `${summaryData.chargeback?.count || 0} eventos`, changeColor: '#F04438' },
        { label: 'Estornos', value: formatCurrency(summaryData.refunded?.total / 100 || 0), change: `${summaryData.refunded?.count || 0} eventos`, changeColor: '#FF8F00' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Métricas de vendas</Text>
            <View style={styles.cardsContainer}>
                {metrics.map(metric => (
                    <MetricItem
                        key={metric.label}
                        label={metric.label}
                        value={metric.value}
                        change={metric.change}
                        changeColor={metric.changeColor}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => onNavigate('transactions')}>
                <Text style={styles.buttonText}>Ver todas as transações</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#101828',
        marginBottom: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: '48%', // Para 2 colunas
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
    metricLabel: {
        fontSize: 14,
        color: '#667085',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101828',
        marginBottom: 8,
    },
    metricChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    metricChange: {
        fontSize: 14,
        fontWeight: '500',
    },
    periodSelector: {
        backgroundColor: '#F2F4F7',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: 'flex-start'
    },
    periodText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#344054'
    },
    button: {
        marginTop: 16,
        backgroundColor: '#0052cc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SalesMetricsCard; 