import { colors } from '@/theme/colors';
import type { ChartDataPoint } from '@/types/dashboard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface SalesChartCardProps {
    data: ChartDataPoint[];
}

export const SalesChartCard = ({ data }: SalesChartCardProps) => {
    if (!data || data.length === 0) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Gráfico de Receitas</Text>
                <Text style={styles.emptyText}>Dados indisponíveis para o gráfico.</Text>
            </View>
        );
    }

    const chartData = data.map(item => ({
        value: item.total_paid_amount / 100, // Ajustar para Reais
        label: item.data, // Usar o formato de data que vem do backend (ex: "06/2025")
        frontColor: colors.primary,
    }));
    
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Gráfico de Receitas</Text>
            <BarChart
                data={chartData}
                barWidth={20}
                spacing={25}
                roundedTop
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: colors.textSecondary }}
                noOfSections={4}
                isAnimated
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        paddingVertical: 20,
    }
}); 