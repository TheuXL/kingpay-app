import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

const ApprovalRateCard = () => {
  // Dados de exemplo para o design
  const data = {
    total: '92,9%',
    methods: [
      { name: 'Pix', rate: '98,6%', width: '98.6%', color: colors.chartBlue },
      { name: 'Cartão', rate: '76,9%', width: '76.9%', color: colors.chartPurple },
      { name: 'Boleto', rate: '85,2%', width: '85.2%', color: colors.chartGreen },
    ],
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Taxa de aprovação</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>30 dias</Text>
          <ChevronDown color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{data.total}</Text>

      {/* Barras de Progresso */}
      <View style={styles.barsContainer}>
        {data.methods.map((method, index) => (
          <View key={index} style={styles.barItem}>
            <View style={styles.barLabels}>
              <Text style={styles.barLabel}>{method.name}</Text>
              <Text style={styles.barRate}>{method.rate}</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarForeground, { width: method.width, backgroundColor: method.color }]} />
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
        marginBottom: 20,
      },
      barsContainer: {
        gap: 16,
      },
      barItem: {},
      barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
      },
      barLabel: {
        fontSize: 14,
        color: '#52525B',
      },
      barRate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
      },
      progressBarBackground: {
        height: 8,
        backgroundColor: '#E4E4E7',
        borderRadius: 4,
        overflow: 'hidden',
      },
      progressBarForeground: {
        height: 8,
        borderRadius: 4,
      },
});

export default ApprovalRateCard; 