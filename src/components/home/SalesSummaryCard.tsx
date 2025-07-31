import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

const SalesSummaryCard = () => {
    
    const lineData = [
        {value: 0},
        {value: 20},
        {value: 18},
        {value: 40},
        {value: 36},
        {value: 60},
        {value: 54},
        {value: 85}
    ];

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Resumo de Vendas</Text>
                <TouchableOpacity style={styles.periodSelector}>
                    <Text style={styles.periodText}>30 dias</Text>
                    <ChevronDown color="#00051B" size={15} />
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <View style={styles.revenueContainer}>
                    <Text style={styles.revenueAmount}>R$ 138.241,45</Text>
                    <Text style={styles.revenueTitle}>Faturamento bruto</Text>
                </View>
                
                <View style={styles.chartContainer}>
                    <LineChart
                        data={lineData}
                        curved
                        height={100}
                        startFillColor="#9898FF"
                        endFillColor="#FFFFFF"
                        startOpacity={0.8}
                        endOpacity={0.3}
                        color="#1313F2"
                        thickness={2}
                        hideDataPoints
                        hideRules
                        hideYAxisText
                        adjustToWidth
                        xAxisColor="transparent"
                        yAxisColor="transparent"
                        />
                </View>

                 <View style={styles.refundsDetailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.legendRow}>
                            <View style={[styles.dot, {backgroundColor: '#1313F2'}]} />
                            <Text style={styles.detailText}>Reembolsos</Text>
                        </View>
                        <Text style={styles.detailAmount}>R$ 1.274,00</Text>
                    </View>
                     <View style={styles.detailRow}>
                        <View style={styles.legendRow}>
                            <View style={[styles.dot, {backgroundColor: '#F99963'}]} />
                            <Text style={styles.detailText}>Cashback</Text>
                        </View>
                        <Text style={styles.detailAmount}>R$ 380,00</Text>
                    </View>
                     <View style={styles.detailRow}>
                        <View style={styles.legendRow}>
                            <View style={[styles.dot, {backgroundColor: '#E24A3F'}]} />
                            <Text style={styles.detailText}>Taxa de Chargeback</Text>
                        </View>
                        <Text style={styles.detailAmount}>R$ 964,95</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Container principal para o resumo de vendas
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        color: '#00051B',
    },
    periodSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        backgroundColor: '#F9FAFC',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 89,
    },
    periodText: {
        fontWeight: '500',
        fontSize: 12,
        color: '#00051B',
        marginRight: 10,
    },
    card: {
        padding: 20,
        backgroundColor: '#F9FAFC',
        borderRadius: 12,
    },
    revenueContainer: {
        marginBottom: 16,
    },
    revenueAmount: {
        fontWeight: '700',
        fontSize: 24,
        color: '#00051B',
    },
    revenueTitle: {
        fontWeight: '500',
        fontSize: 14,
        color: '#5B5B5B',
        marginTop: 4,
    },
    chartContainer: {
        height: 180,
    },
    refundsDetailsContainer: {
        gap: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    detailText: {
        fontWeight: '500',
        fontSize: 14,
        color: '#5B5B5B',
    },
    detailAmount: {
        fontWeight: '600',
        fontSize: 16,
        color: '#00051B',
    }
});

export default SalesSummaryCard;
