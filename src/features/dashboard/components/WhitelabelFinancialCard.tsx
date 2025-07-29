import { colors } from '@/theme/colors';
import type { WhitelabelFinancial } from '@/types/dashboard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WhitelabelFinancialCardProps {
  data: WhitelabelFinancial;
}

export default function WhitelabelFinancialCard({ data }: WhitelabelFinancialCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100); // Assumindo que os valores vêm em centavos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados Financeiros Whitelabel</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saldos Totais</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Saldo Geral:</Text>
          <Text style={[styles.value, { color: data.total_balances.total_balance >= 0 ? colors.success : colors.danger }]}>
            {formatCurrency(data.total_balances.total_balance)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Saldo Cartão:</Text>
          <Text style={[styles.value, { color: data.total_balances.total_balance_card >= 0 ? colors.success : colors.danger }]}>
            {formatCurrency(data.total_balances.total_balance_card)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reserva Financeira:</Text>
          <Text style={styles.value}>{formatCurrency(data.total_balances.total_financial_reserve)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pendências</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Saques Pendentes:</Text>
          <Text style={styles.value}>
            {data.pending_withdrawals.pending_withdrawals_count} ({formatCurrency(data.pending_withdrawals.pending_withdrawals_amount)})
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Antecipações Pendentes:</Text>
          <Text style={styles.value}>
            {data.pending_anticipations.pending_anticipations_count} ({formatCurrency(data.pending_anticipations.pending_anticipations_amount)})
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
}); 