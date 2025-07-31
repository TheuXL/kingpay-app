import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Bar = ({ label, value, color, height, align = 'center' }: { label: string, value: string, color: string, height: number, align?: 'center' | 'flex-start' | 'flex-end' }) => (
    <View style={[styles.barGroup, { alignItems: align }]}>
        <View style={[styles.bar, { backgroundColor: color, height }]} />
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
    </View>
);

const SalesAnalysisCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Análise de Vendas</Text>
                    <Text style={styles.mainValue}>R$ 38.121,15</Text>
                </View>
                <TouchableOpacity style={styles.periodButton}>
                    <Text style={styles.periodText}>7 dias</Text>
                    <ChevronRight size={18} color="#333333" />
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                <Bar label="Vendas" value="R$ 3.724,23" color="#1313F2" height={150} align="flex-start" />
                <Bar label="Pendentes" value="4.123,11" color="#FF8C42" height={80} />
                <Bar label="Estornos" value="2.864,23" color="#E54D4D" height={60} align="flex-end" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 4,
    },
    mainValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    periodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginRight: 6,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 200,
    },
    barGroup: {
        flex: 1,
    },
    barLabel: {
        fontSize: 14,
        color: '#666666',
        marginTop: 8,
    },
    barValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 4,
    },
    bar: {
        width: '80%',
        borderRadius: 16,
    },
});

export default SalesAnalysisCard;
