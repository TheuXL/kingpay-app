import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface RefundsCardProps {
  totalRefunds?: number;
  refundsValue?: number;
  cashbackValue?: number;
  chargebackRate?: number;
}

const ProgressBar = ({ refunds, cashback }: { refunds: number; cashback: number }) => {
  const total = refunds + cashback;
  if (total === 0) {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground} />
      </View>
    );
  }

  const refundsWidth = (refunds / total) * 100;
  const cashbackWidth = (cashback / total) * 100;

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressSegment, { width: `${refundsWidth}%`, backgroundColor: colors.chartOrange }]} />
      <View style={[styles.progressSegment, { width: `${cashbackWidth}%`, backgroundColor: colors.chartPurple }]} />
    </View>
  );
};

const RefundsCard: React.FC<RefundsCardProps> = ({
  totalRefunds = 0,
  refundsValue = 0,
  cashbackValue = 0,
  chargebackRate = 0,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Reembolsos</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>30 dias</Text>
          <ChevronDown color="#3F3F46" size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalValue}>{formatCurrency(totalRefunds / 100)}</Text>
      
      <ProgressBar refunds={refundsValue} cashback={cashbackValue} />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartOrange }]} />
          <Text style={styles.legendLabel}>Estornos</Text>
          <Text style={styles.legendValue}>{formatCurrency(refundsValue / 100)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartPurple }]} />
          <Text style={styles.legendLabel}>Cashback</Text>
          <Text style={styles.legendValue}>{formatCurrency(cashbackValue / 100)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartGreen }]} />
          <Text style={styles.legendLabel}>Taxa de estorno</Text>
          <Text style={styles.legendValue}>{formatPercentage(chargebackRate)}</Text>
        </View>
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
        minHeight: 280, // Altura padrão
        justifyContent: 'center', // Centraliza o conteúdo se for um placeholder
      },
      emptyCard: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150,
      },
      emptyText: {
        fontSize: 16,
        color: '#A1A1AA',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      title: {
        fontSize: 14,
        fontWeight: '500',
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
      progressBarBackground: {
        flex: 1,
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
      legendValue: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#1a1a1a',
      }
});

export default RefundsCard; 