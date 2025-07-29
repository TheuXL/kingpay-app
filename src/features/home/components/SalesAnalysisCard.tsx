import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Bar = ({ label, value, color, height }: { label: string, value: string, color: string, height: number }) => (
    <View style={styles.barGroup}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
        <View style={[styles.bar, { backgroundColor: color, height }]} />
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
                    <ArrowRight size={16} color="#333333" />
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                <Bar label="Vendas" value="R$ 3.724,23" color="#1A1AFF" height={120} />
                <Bar label="Pendentes" value="4.123,11" color="#FFA366" height={80} />
                <Bar label="Estornos" value="2.864,23" color="#FF5A5F" height={60} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
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
        alignItems: 'flex-start',
        marginBottom: 24,
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
        paddingVertical: 8,
        borderRadius: 16,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginRight: 8,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 160, // Altura para acomodar barras e legendas
    },
    barGroup: {
        alignItems: 'center',
        flex: 1,
    },
    barLabel: {
        fontSize: 14,
        color: '#666666',
    },
    barValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginVertical: 4,
    },
    bar: {
        width: 48,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
});

export default SalesAnalysisCard;
