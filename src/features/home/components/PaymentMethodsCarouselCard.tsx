import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaymentMethod {
  value?: number; // em centavos
  percentage?: number;
  variation?: number;
}

interface PaymentMethodData {
  pix?: PaymentMethod;
  card?: PaymentMethod;
  boleto?: PaymentMethod;
}

// Interface para dados vindos do endpoint infos-adicionais
interface PaymentMethodInfo {
  metodo: string; // "PIX", "CARD", "BOLETO"
  vendas: number;
  valorTotal: number;
}

interface PaymentMethodsCarouselCardProps {
  data?: PaymentMethodData | PaymentMethodInfo[];
  isLoading?: boolean;
}

const PaymentMethodsCarouselCard: React.FC<PaymentMethodsCarouselCardProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando métodos...</Text>
        </View>
      </View>
    );
  }

  // Processar dados dependendo do formato recebido
  let processedData: PaymentMethodData = {};
  let totalValue = 0;

  if (Array.isArray(data)) {
    // Dados vindos do endpoint infos-adicionais
    totalValue = data.reduce((sum, method) => sum + method.valorTotal, 0);
    
    data.forEach(method => {
      const percentage = totalValue > 0 ? (method.valorTotal / totalValue) * 100 : 0;
      
      switch (method.metodo.toUpperCase()) {
        case 'PIX':
          processedData.pix = {
            value: method.valorTotal,
            percentage,
            variation: 0 // Não temos dados de variação
          };
          break;
        case 'CARD':
        case 'CARTAO':
          processedData.card = {
            value: method.valorTotal,
            percentage,
            variation: 0
          };
          break;
        case 'BOLETO':
          processedData.boleto = {
            value: method.valorTotal,
            percentage,
            variation: 0
          };
          break;
      }
    });
  } else if (data) {
    // Dados no formato antigo
    processedData = data;
    totalValue = (data.pix?.value || 0) + (data.card?.value || 0) + (data.boleto?.value || 0);
  }

  const renderPaymentMethod = (
    name: string,
    color: string,
    icon: string,
    methodData?: PaymentMethod
  ) => {
    const value = methodData?.value || 0;
    const percentage = methodData?.percentage || 0;
    const variation = methodData?.variation;

    return (
      <View style={styles.methodRow} key={name}>
        <View style={styles.methodInfo}>
          <View style={styles.methodHeader}>
            <Text style={styles.methodIcon}>{icon}</Text>
            <Text style={styles.methodName}>{name}</Text>
          </View>
          <Text style={styles.methodValue}>
            {value > 0 ? formatCurrency(value) : 'R$ 0,00'}
          </Text>
        </View>
        
        <View style={styles.methodStats}>
          <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
          {variation !== undefined && (
            <View style={styles.variationContainer}>
              {variation >= 0 ? (
                <TrendingUp size={12} color="#00C48C" />
              ) : (
                <TrendingDown size={12} color="#FF647C" />
              )}
              <Text style={[
                styles.variationText,
                { color: variation >= 0 ? '#00C48C' : '#FF647C' }
              ]}>
                {Math.abs(variation).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Métodos de Pagamento</Text>
          <Text style={styles.value}>
            {totalValue > 0 ? formatCurrency(totalValue) : 'R$ 0,00'}
          </Text>
        </View>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.methodsContainer}>
        {renderPaymentMethod('PIX', '#00B69B', '💳', processedData.pix)}
        {renderPaymentMethod('Cartão', '#6366F1', '💵', processedData.card)}
        {renderPaymentMethod('Boleto', '#F59E0B', '📄', processedData.boleto)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    height: 220,
    justifyContent: 'space-around',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 4,
  },
  methodsContainer: {
    gap: 16,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  methodName: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  methodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  methodStats: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  variationText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PaymentMethodsCarouselCard;
