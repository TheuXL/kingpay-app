import { formatCurrency } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

// Dados de exemplo para o gráfico
const chartData = [
    { value: 23000, label: 'Jan' },
    { value: 18000, label: 'Fev' },
    { value: 26000, label: 'Mar' },
    { value: 21000, label: 'Abr' },
    { value: 20000, label: 'Mai' },
    { value: 19000, label: 'Jun' },
    { value: 22000, label: 'Jul' },
    { value: 25000, label: 'Ago' },
    { value: 28000, label: 'Set' },
    { value: 32000, label: 'Out' },
    { value: 35000, label: 'Nov' },
    { value: 40000, label: 'Dez' },
];

const RevenueChartCard = () => {
    const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Gráfico de Receita</Text>
                    <Text style={styles.value}>{formatCurrency(totalRevenue)}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Ver tudo</Text>
                    <ArrowRight size={16} color="#333333" />
                </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
                <BarChart
                    data={chartData}
                    barWidth={12}
                    barBorderRadius={4}
                    frontColor="#1A1AFF"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    hideYAxisText
                    xAxisLabelTextStyle={styles.axisLabel}
                    spacing={16}
                    initialSpacing={10}
                    noOfSections={4}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 16,
        color: '#6B6B6B',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginRight: 8,
    },
    chartContainer: {
        paddingBottom: 10,
    },
    axisLabel: {
        color: '#6B6B6B',
        fontSize: 12,
    }
});

export default RevenueChartCard;
