import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const PaymentMethodIcon = ({ method }) => {
    const icons = {
        pix: 'aperture',
        cartao: 'credit-card',
        boleto: 'file-text'
    };
    return <Feather name={icons[method] || 'dollar-sign'} size={16} color={colors.textSecondary} style={styles.methodIcon} />;
}

export const PaymentLinkItem = ({ item, onCopy, onToggle, onEdit }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.value}>{formatCurrency(item.valor)}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.methods}>
            {item.formas_de_pagamento.map(method => <PaymentMethodIcon key={method} method={method} />)}
        </View>
        <View style={styles.status}>
            <Text style={item.ativo ? styles.active : styles.inactive}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
            <Switch
                value={item.ativo}
                onValueChange={onToggle}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={'#f4f3f4'}
            />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCopy}>
            <Feather name="copy" size={18} color={colors.primary} />
            <Text style={styles.actionText}>Copiar Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Feather name="edit" size={18} color={colors.textSecondary} />
            <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
      </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    methods: {
        flexDirection: 'row',
        gap: 8,
    },
    methodIcon: {
        // ...
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    active: {
        color: colors.success,
        fontWeight: '600'
    },
    inactive: {
        color: colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
        borderTopWidth: 1,
        borderTopColor: colors.background,
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: colors.textSecondary,
    }
}); 