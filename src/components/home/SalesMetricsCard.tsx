import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SalesMetricsCardProps {
  data: {
    chargeback: number;
    pixSales: number;
    boletoSales: number;
  } | null;
  onPeriodChange?: () => void;
  period?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  onPeriodChange?: () => void;
}

const MetricCard = ({ title, value, change, isPositive, period, onPeriodChange }: MetricCardProps) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    
    <Text style={styles.metricValue}>{value}</Text>
    
    <View style={styles.changeContainer}>
      <MaterialIcons 
        name={isPositive ? "trending-up" : "trending-down"} 
        size={16} 
        color={isPositive ? colors.success : colors.danger} 
      />
      <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}>
        {change}
      </Text>
    </View>

    <TouchableOpacity style={styles.periodDropdown} onPress={onPeriodChange}>
      <Text style={styles.periodText}>{period}</Text>
      <MaterialIcons name="keyboard-arrow-up" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  </View>
);

export default function SalesMetricsCard({ data, onPeriodChange, period = "Últimos 30 dias" }: SalesMetricsCardProps) {
  if (!data) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>Métricas de vendas</Text>
      <View style={styles.metricsGrid}>
        <MetricCard 
          title="Chargeback" 
          value={`${(data.chargeback || 0).toFixed(2)}%`}
          change="+4%" 
          isPositive={false} 
          period={period}
          onPeriodChange={onPeriodChange}
        />
        <MetricCard 
          title="Vendas Pix" 
          value={formatCurrency(data.pixSales)} 
          change="+14%" 
          isPositive={true} 
          period={period}
          onPeriodChange={onPeriodChange}
        />
      </View>
      
      <View style={styles.metricsGridSingle}>
        <MetricCard 
          title="Vendas Boletos" 
          value={formatCurrency(data.boletoSales)} 
          change="+7,8%" 
          isPositive={true} 
          period={period}
          onPeriodChange={onPeriodChange}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    marginTop: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metricsGridSingle: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingRight: '50%', // Para ocupar metade do espaço
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  periodDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  periodText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 2,
  },
}); 