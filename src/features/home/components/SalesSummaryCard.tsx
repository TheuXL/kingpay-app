// src/features/home/components/SalesSummaryCard.tsx
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LegendItem = ({ color, label, value }: { color: string; label: string; value: string }) => (
    <View style={styles.legendItemContainer}>
        <View style={styles.legendTextContainer}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
        <Text style={styles.legendValue}>{value}</Text>
    </View>
);

const SalesSummaryCard = () => {
    // Dados mocados para o design
    const totalSales = "R$ 138.241,15";
    const salesData = {
        sales: "R$ 7.724,23",
        pending: "R$ 2.822,91",
        refund: "R$ 609,87",
    };

    return (
        <View>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Resumo de vendas</Text>
                <TouchableOpacity style={styles.periodSelector}>
                    <Text style={styles.periodSelectorText}>30 dias</Text>
                    <ChevronDown size={18} color="#666666" />
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <View style={styles.salesInfo}>
                    <Text style={styles.totalSalesText}>{totalSales}</Text>
                    <Text style={styles.periodText}>Últimos 30 dias</Text>
                </View>

                {/* Placeholder para o gráfico */}
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartPlaceholderText}>Gráfico de Vendas</Text>
                </View>

                <View style={styles.legendContainer}>
                    <LegendItem color="#3A49F9" label="Vendas" value={salesData.sales} />
                    <LegendItem color="#FF8F00" label="Pendente" value={salesData.pending} />
                    <LegendItem color="#D81B60" label="Estorno" value={salesData.refund} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    periodSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    periodSelectorText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    salesInfo: {
        marginBottom: 24,
    },
    totalSalesText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
    },
    periodText: {
        fontSize: 14,
        color: '#666666',
    },
    chartPlaceholder: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9FB',
        borderRadius: 8,
        marginBottom: 24,
    },
    chartPlaceholderText: {
        color: '#999',
        fontSize: 16,
    },
    legendContainer: {
        gap: 16,
    },
    legendItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 16,
        color: '#333333',
    },
    legendValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
});

export default SalesSummaryCard;
