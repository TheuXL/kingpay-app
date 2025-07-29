import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MetricCard from './MetricCard';

interface SalesMetricsGridProps {
    data?: {
        // Dados principais do dashboard
        countTotal?: number;
        countPaid?: number;
        sumPaid?: number;
        sumValorLiquido?: number;
        countRefused?: number;
        sumRefused?: number;
        countChargeback?: number;
        sumChargeback?: number;
        countPending?: number;
        sumPending?: number;
        // Campos calculados
        taxaChargeback?: number;
        approvalRateGrowthPercentage?: number;
        sumPixPaid?: number;
        salesGrowthPercentage?: number;
        sumBoletoPaid?: number;
    };
    isLoading?: boolean;
}

const SalesMetricsGrid: React.FC<SalesMetricsGridProps> = ({ data, isLoading = false }) => {
    
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregando métricas...</Text>
                </View>
            </View>
        );
    }

    // Calcular métricas baseadas nos dados disponíveis
    const totalTransactions = data?.countTotal || 0;
    const paidTransactions = data?.countPaid || 0;
    const refusedTransactions = data?.countRefused || 0;
    const chargebackTransactions = data?.countChargeback || 0;
    const pendingTransactions = data?.countPending || 0;
    
    const approvalRate = totalTransactions > 0 ? (paidTransactions / totalTransactions) * 100 : 0;
    const refusalRate = totalTransactions > 0 ? (refusedTransactions / totalTransactions) * 100 : 0;
    const chargebackRate = paidTransactions > 0 ? (chargebackTransactions / paidTransactions) * 100 : 0;
    const pendingRate = totalTransactions > 0 ? (pendingTransactions / totalTransactions) * 100 : 0;

    // Valores formatados
    const approvalValue = `${approvalRate.toFixed(1)}%`;
    const approvalVariation = data?.approvalRateGrowthPercentage;

    const refusalValue = `${refusalRate.toFixed(1)}%`;
    const refusalVariation = data?.salesGrowthPercentage; // Reutilizando a mesma variação

    const chargebackValue = `${chargebackRate.toFixed(1)}%`;
    const chargebackVariation = data?.approvalRateGrowthPercentage;

    const pendingValue = `${pendingRate.toFixed(1)}%`;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <MetricCard 
                    title="Taxa de Aprovação"
                    value={approvalValue}
                    variation={approvalVariation}
                    color="#00C48C"
                />
                <MetricCard 
                    title="Taxa de Recusa"
                    value={refusalValue}
                    variation={refusalVariation}
                    color="#FF647C"
                />
            </View>
            <View style={styles.row}>
                <MetricCard 
                    title="Taxa de Chargeback"
                    value={chargebackValue}
                    variation={chargebackVariation}
                    color="#F59E0B"
                />
                <MetricCard 
                    title="Transações Pendentes"
                    value={pendingValue}
                    color="#6B6B6B"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B6B6B',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
});

export default SalesMetricsGrid; 