import { colors } from '@/theme/colors';
import type { WhitelabelBilling } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WhitelabelBillingCardProps {
  data: WhitelabelBilling;
}

export default function WhitelabelBillingCard({ data }: WhitelabelBillingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Faturamento Whitelabel</Text>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Faturamento Total:</Text>
        <Text style={styles.value}>{formatCurrency(data.faturamentoTotal || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Entradas Transações:</Text>
        <Text style={styles.value}>{formatCurrency(data.entradasTransacoes || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Entradas Saque:</Text>
        <Text style={styles.value}>{formatCurrency(data.entradasSaque || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Entradas Antecipação:</Text>
        <Text style={styles.value}>{formatCurrency(data.entradasAntecipacao || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Estornos:</Text>
        <Text style={styles.value}>{formatCurrency(data.estornos || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Chargeback:</Text>
        <Text style={styles.value}>{formatCurrency(data.chargeback || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Taxas Adquirente:</Text>
        <Text style={styles.value}>{formatCurrency(data.taxasDeAdquirente || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Taxas BaaS:</Text>
        <Text style={styles.value}>{formatCurrency(data.taxasDeBaaS || 0)}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.label}>Taxas Intermediação:</Text>
        <Text style={[styles.value, styles.highlight]}>{formatCurrency(data.taxasDeIntermediacao || 0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  highlight: {
    color: colors.success,
    fontWeight: 'bold',
  },
}); 