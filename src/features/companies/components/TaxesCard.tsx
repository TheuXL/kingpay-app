import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useCompanyTaxes } from '../hooks/useCompanyTaxes';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

const TaxRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export const TaxesCard = () => {
    const { taxes, isLoading, error } = useCompanyTaxes();

    if (isLoading) {
        return <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!taxes) {
        return <Text style={styles.emptyText}>Nenhuma taxa configurada.</Text>;
    }
    
    // Simplificando a exibição. Podemos adicionar todas as taxas de mdr_* depois.
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Feather name="percent" size={24} color={colors.primary} />
                <Text style={styles.title}>Taxas Atuais</Text>
            </View>
            <TaxRow label="Pix" value={formatPercentage(taxes.pix_fee_percentage / 100)} />
            <TaxRow label="Boleto" value={formatCurrency(taxes.boleto_fee_fixed)} />
            <TaxRow label="Cartão de Crédito (1x)" value={`${formatPercentage(taxes.mdr_1x / 100)}`} />
            <TaxRow label="Taxa de Saque" value={formatCurrency(taxes.withdrawal_fee)} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        padding: 16,
    }
}); 