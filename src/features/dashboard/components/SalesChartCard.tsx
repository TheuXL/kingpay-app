import { colors } from '@/theme/colors';
import type { ChartDataPoint } from '@/types/dashboard';
import { formatChartValue, formatDateString } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface SalesChartCardProps {
    data: ChartDataPoint[];
    title?: string;
    onSeeAll?: () => void;
    isLoading?: boolean;
    error?: string;
}

export const SalesChartCard = ({ 
    data = [], 
    title = "Gráfico de Receita",
    onSeeAll,
    isLoading = false,
    error
}: SalesChartCardProps) => {
    
    // Calcula o total de vendas pagas para exibir no header
    const totalSales = data.reduce((sum, item) => sum + (item.total_paid_amount || 0), 0);

    // Estado de carregamento
    if (isLoading) {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Carregando gráfico...</Text>
                </View>
            </View>
        );
    }

    // Estado de erro
    if (error) {
        return (
            <View style={[styles.card, styles.errorCard]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.errorContent}>
                    <Feather name="bar-chart-2" size={48} color={colors.danger} />
                    <Text style={styles.errorTitle}>Erro ao carregar</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    // Estado vazio
    if (!data || data.length === 0) {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.totalValue}>{formatChartValue(0)}</Text>
                    {onSeeAll && (
                        <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
                            <Text style={styles.seeAllText}>Ver tudo</Text>
                            <Feather name="chevron-right" size={16} color={colors.textPrimary} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.emptyContent}>
                    <Feather name="bar-chart-2" size={48} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>Nenhum dado disponível para o período selecionado</Text>
                    <Text style={styles.emptySubtext}>Selecione outro período ou verifique os filtros</Text>
                </View>
            </View>
        );
    }

    // Prepara os dados para o gráfico
    const chartData = data.map(item => ({
        value: (item.total_paid_amount || 0) / 100, // Converte centavos para reais
        label: formatDateString(item.data), // Formata a data
        frontColor: colors.primary,
        spacing: 2,
        labelWidth: 50,
        labelTextStyle: {
            color: colors.textSecondary,
            fontSize: 10,
        },
    }));
    
    return (
        <View style={styles.card}>
            {/* Header com título, valor total e botão Ver tudo */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.totalValue}>{formatChartValue(totalSales)}</Text>
                </View>
                
                {onSeeAll && (
                    <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
                        <Text style={styles.seeAllText}>Ver tudo</Text>
                        <Feather name="chevron-right" size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Gráfico de Barras */}
            <View style={styles.chartContainer}>
                <BarChart
                    data={chartData}
                    width={300}
                    height={250}
                    barWidth={22}
                    spacing={24}
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ 
                        color: colors.textSecondary,
                        fontSize: 12,
                    }}
                    noOfSections={4}
                    maxValue={Math.max(...chartData.map(item => item.value)) * 1.2}
                    isAnimated
                    animationDuration={800}
                    showGradient
                    gradientColor={`${colors.primary}80`}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        minHeight: 320,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 4,
    },
    seeAllText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    loadingContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 14,
    },
    errorCard: {
        borderColor: colors.danger,
        borderWidth: 1,
        backgroundColor: '#FF647C08',
    },
    errorContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.danger,
        marginTop: 12,
        marginBottom: 4,
    },
    errorText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
}); 