import { ChevronUp, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, period }) => {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? colors.success : colors.danger;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.trendContainer}>
        <TrendIcon color={trendColor} size={16} style={styles.trendIcon} />
        <Text style={[styles.trendText, { color: trendColor }]}>{change}</Text>
      </View>
      <TouchableOpacity style={styles.periodButton}>
        <Text style={styles.periodText}>{period}</Text>
        <ChevronUp color="#3F3F46" size={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        flex: 1, // Para ocupar o espaço disponível no grid
      },
      title: {
        fontSize: 14,
        color: '#52525B',
        marginBottom: 8,
      },
      value: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
      },
      trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      trendIcon: {
        marginRight: 4,
      },
      trendText: {
        fontSize: 14,
        fontWeight: '500',
      },
      periodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F4F4F5',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
      },
      periodText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3F3F46',
      },
});

export default MetricCard; 