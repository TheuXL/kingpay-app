import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

interface PaymentMethod {
  metodo: string;
  valorTotal: number;
}

interface PaymentMethodsCardProps {
  data: PaymentMethod[];
}

const methodColors: { [key: string]: string } = {
    PIX: colors.chartBlue,
    CARD: colors.chartPurple,
    BOLETO: colors.chartGreen,
  };

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({ data }) => {

  const total = data?.reduce((sum, item) => sum + item.valorTotal, 0) || 0;

  const methods = (data || []).map(method => {
      const percentage = total > 0 ? (method.valorTotal / total) : 0;
      return {
          name: method.metodo,
          percentage: formatPercentage(percentage),
          percentageValue: percentage * 100,
          color: methodColors[method.metodo] || colors.textSecondary,
          // Dados de variação precisam vir da API
          change: '+0%', 
          isPositive: true,
      }
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Formas de pagamento</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>30 dias</Text>
          <ChevronDown color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      
      {/* Barra de Progresso */}
      <View style={styles.progressBarContainer}>
        {methods.map((method, index) => (
             <View key={index} style={[styles.progressSegment, { width: `${method.percentageValue}%`, backgroundColor: method.color }]} />
        ))}
      </View>

      {/* Legenda */}
      <View style={styles.legendContainer}>
        {methods.map((method, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: method.color }]} />
            <Text style={styles.legendLabel}>{method.name}</Text>
            <Text style={styles.legendPercentage}>{method.percentage}</Text>
            <View style={styles.trendContainer}>
              {method.isPositive ? <TrendingUp size={14} color={colors.success} /> : <TrendingDown size={14} color={colors.danger} />}
              <Text style={[styles.trendText, { color: method.isPositive ? colors.success : colors.danger }]}>
                {method.change}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: 'rgba(0,0,0,0.04)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
      height: 280, // Altura padrão
      justifyContent: 'space-between', // Para distribuir o conteúdo
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 14,
      color: '#52525B',
    },
    periodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F4F4F5',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    periodText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#3F3F46',
      marginRight: 6,
    },
    totalValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 8,
      marginBottom: 16,
    },
    progressBarContainer: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#E4E4E7',
      },
      progressSegment: {
        height: '100%',
      },
    legendContainer: {
      marginTop: 20,
      gap: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    legendLabel: {
      flex: 1,
      fontSize: 14,
      color: '#52525B',
      textTransform: 'capitalize',
    },
    legendPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    trendText: {
        fontSize: 12,
        marginLeft: 2,
    }
  });
  
  export default PaymentMethodsCard; 