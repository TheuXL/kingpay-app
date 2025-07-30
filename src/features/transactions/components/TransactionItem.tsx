import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface TransactionItemProps {
  item: Transaction;
}

const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
        case 'paid':
            return { icon: 'check-circle', color: colors.success, label: 'Aprovada' };
        case 'pending':
            return { icon: 'clock', color: colors.warning, label: 'Pendente' };
        case 'refunded':
            return { icon: 'refresh-ccw', color: colors.gray[500], label: 'Estornada' };
        case 'failed':
            return { icon: 'x-circle', color: colors.error, label: 'Falhou' };
        case 'expired':
            return { icon: 'alert-triangle', color: colors.gray[400], label: 'Expirada' };
        default:
            return { icon: 'help-circle', color: colors.gray[400], label: 'Desconhecido' };
    }
};

const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <Feather name={statusConfig.icon as any} size={24} color={statusConfig.color} />
                <View style={styles.textContainer}>
                    <Text style={styles.customerName}>{item.customer_name || 'Cliente não informado'}</Text>
                    <Text style={styles.statusText}>{statusConfig.label}</Text>
                </View>
            </View>
            <View style={styles.rightContent}>
                <Text style={styles.valueText}>{formatCurrency(item.value)}</Text>
                <Text style={styles.dateText}>{formatShortDate(item.created_at)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    dateText: {
        fontSize: 14,
        color: '#666',
    },
});

export default TransactionItem;
