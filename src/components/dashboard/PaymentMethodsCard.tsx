import { colors } from '@/theme/colors';
import { formatCurrency, formatPaymentMethod, formatPercentage } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface PaymentMethodData {
  metodo: string;
  vendas: number;
  valorTotal: number;
}

interface PaymentMethodsCardProps {
  data: PaymentMethodData[];
  isLoading?: boolean;
  error?: string;
}

interface PaymentMethodItemProps {
  method: string;
  value: number;
  percentage: number;
  trend: 'up' | 'down';
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  method,
  value,
  percentage,
  trend,
}) => {
  // Mapeamento de ícones por método
  const getMethodIcon = (methodName: string) => {
    switch (methodName.toLowerCase()) {
      case 'pix':
        return 'zap';
      case 'cartão':
      case 'card':
        return 'credit-card';
      case 'boleto':
        return 'file-text';
      default:
        return 'dollar-sign';
    }
  };

  const icon = getMethodIcon(method);
  const trendColor = trend === 'up' ? '#00C48C' : '#FF647C';
  const trendIcon = trend === 'up' ? '↑' : '↓';

  return (
    <View style={styles.methodItem}>
      
      {/* Ícone e Informações */}
      <View style={styles.methodInfo}>
        <View style={[styles.methodIconContainer, { backgroundColor: `${colors.primary}15` }]}>
          <Feather name={icon as any} size={22} color={colors.primary} />
        </View>
        
        <View style={styles.methodDetails}>
          <Text style={styles.methodName}>{formatPaymentMethod(method)}</Text>
          <Text style={styles.methodValue}>{formatCurrency(value)}</Text>
        </View>
      </View>

      {/* Indicador de Performance */}
      <View style={styles.performanceIndicator}>
        <Text style={[styles.trendText, { color: trendColor }]}>
          {trendIcon} {formatPercentage(percentage)}
        </Text>
        <Text style={styles.trendLabel}>conversão</Text>
      </View>
    </View>
  );
};

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
  data = [],
  isLoading = false,
  error,
}) => {
  // Calcula o total consolidado
  const totalSum = data.reduce((sum, item) => sum + item.valorTotal, 0);

  // Estado de carregamento
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Métodos de Pagamento</Text>
        </View>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando métodos...</Text>
        </View>
      </View>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <View style={styles.header}>
          <Text style={styles.title}>Métodos de Pagamento</Text>
        </View>
        <View style={styles.errorContent}>
          <Feather name="alert-triangle" size={32} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  // Estado vazio
  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Métodos de Pagamento</Text>
        </View>
        <View style={styles.emptyContent}>
          <Feather name="credit-card" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            Nenhum dado disponível para o período selecionado
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Métodos de Pagamento</Text>
      </View>

      {/* Lista de Métodos */}
      <View style={styles.methodsList}>
        {data.map((item, index) => {
          // Calcula a porcentagem de conversão baseada no total
          const percentage = totalSum > 0 ? (item.valorTotal / totalSum) * 100 : 0;
          // Assume tendência positiva se acima de 30%
          const trend = percentage > 30 ? 'up' : 'down';

          return (
            <PaymentMethodItem
              key={`${item.metodo}-${index}`}
              method={item.metodo}
              value={item.valorTotal}
              percentage={percentage}
              trend={trend}
            />
          );
        })}
      </View>

      {/* Footer com Total */}
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Total</Text>
        <Text style={[styles.footerValue, { color: colors.primary }]}>
          {formatCurrency(totalSum)}
        </Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  methodsList: {
    flex: 1,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  methodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  performanceIndicator: {
    alignItems: 'flex-end',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  footerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentMethodsCard; 