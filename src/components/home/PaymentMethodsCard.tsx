import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

const PaymentMethodsCard = () => {
  // Dados de exemplo para o design
  const data = {
    total: 'R$ 233.179,07',
    methods: [
      { name: 'Pix', percentage: '70,8%', change: '+14%', isPositive: true, color: colors.chartBlue },
      { name: 'Cartão', percentage: '19,4%', change: '-10%', isPositive: false, color: colors.chartPurple },
      { name: 'Boleto', percentage: '9,8%', change: '-2%', isPositive: false, color: colors.chartGreen },
    ],
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Formas de pagamento</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>30 dias</Text>
          <ChevronDown color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{data.total}</Text>
      
      {/* Barra de Progresso */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, { width: '70.8%', backgroundColor: colors.chartBlue }]} />
        <View style={[styles.progressSegment, { width: '19.4%', backgroundColor: colors.chartPurple }]} />
        <View style={[styles.progressSegment, { width: '9.8%', backgroundColor: colors.chartGreen }]} />
      </View>

      {/* Legenda */}
      <View style={styles.legendContainer}>
        {data.methods.map((method, index) => (
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
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
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