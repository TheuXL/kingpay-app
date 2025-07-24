import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PaymentMethod {
  metodo: string;
  vendas: number;
  valorTotal: number;
}

interface PaymentMethodsCardProps {
  data: PaymentMethod[] | null;
}

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const totalValue = data.reduce((sum, item) => sum + (item.valorTotal || 0), 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Formas de Pagamento</Text>
      {data.map((method, index) => {
        const percentage = totalValue > 0 ? ((method.valorTotal || 0) / totalValue) * 100 : 0;
        return (
          <View key={index} style={styles.methodRow}>
            <Text style={styles.methodName}>{method.metodo}</Text>
            <Text style={styles.methodValue}>{formatCurrency(method.valorTotal || 0)}</Text>
            <Text style={styles.methodPercentage}>{percentage.toFixed(1)}%</Text>
          </View>
        );
      })}
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
    marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodName: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  methodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 16,
  },
  methodPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 50,
    textAlign: 'right',
  },
});

export default PaymentMethodsCard; 